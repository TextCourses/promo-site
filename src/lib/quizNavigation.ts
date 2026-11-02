import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type QuizQuestionType =
  | 'radio'
  | 'single_choice'
  | 'single-choice'
  | 'multi_select'
  | 'multi-select'
  | 'checkbox'
  | 'range'
  | 'text'

export interface QuizQuestionLike {
  autoAdvance?: boolean
  id: string
  type: QuizQuestionType | string
}

export type QuizAnswers = Record<string, unknown>

export interface QuizNextStepContext<TQuestion extends QuizQuestionLike> {
  answers: QuizAnswers
  question: TQuestion
  questionIndex: number
  questions: readonly TQuestion[]
  value: unknown
}

export interface UseQuizFlowOptions<TQuestion extends QuizQuestionLike> {
  initialAnswers?: QuizAnswers
  isAnswerComplete?: (question: TQuestion, value: unknown) => boolean
  resolveNextStep?: (context: QuizNextStepContext<TQuestion>) => number
  shouldAutoAdvance?: (question: TQuestion, value: unknown) => boolean
}

const SINGLE_CHOICE_TYPES = new Set(['radio', 'single_choice', 'single-choice'])
const INTER_STEP_INPUT_FENCE_MS = 280

export function isSingleChoiceQuestionType(type: string): boolean {
  return SINGLE_CHOICE_TYPES.has(type.trim().toLowerCase())
}

/**
 * Move keyboard focus when an already-visible quiz changes step.
 *
 * The first render is deliberately ignored: focusing an off-screen quiz
 * heading on mount makes the browser scroll past the hero before the visitor
 * sees it. `preventScroll` also keeps a step transition from moving the page
 * unexpectedly while still announcing the new heading to keyboard and screen
 * reader users.
 */
export function useQuizStepFocus<TElement extends HTMLElement>(
  targetRef: RefObject<TElement>,
  stepIndex: number,
): void {
  const previousStepRef = useRef(stepIndex)

  useEffect(() => {
    if (previousStepRef.current === stepIndex) return
    previousStepRef.current = stepIndex
    targetRef.current?.focus({ preventScroll: true })
  }, [stepIndex, targetRef])
}

function defaultAnswerComplete(_question: QuizQuestionLike, value: unknown): boolean {
  if (value === undefined || value === null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  return true
}

function boundedForwardStep(candidate: number, current: number, total: number): number {
  if (!Number.isInteger(candidate) || candidate <= current) {
    return Math.min(current + 1, total)
  }
  return Math.min(candidate, total)
}

function shouldAutoAdvanceQuestion<TQuestion extends QuizQuestionLike>(
  question: TQuestion,
  value: unknown,
  override?: (question: TQuestion, value: unknown) => boolean,
): boolean {
  if (!isSingleChoiceQuestionType(question.type) || question.autoAdvance === false) {
    return false
  }
  return override?.(question, value) ?? true
}

/**
 * Canonical state controller for generated landing quizzes.
 *
 * A single-choice answer is committed and advances in one event handler. The
 * mutable step fence makes rapid clicks idempotent, and a short input-only
 * fence prevents the second pointer event of a double-click from landing on
 * the newly mounted question. The new question is still rendered immediately.
 * Multi-select/range/text answers stay on the current
 * question until continueCurrentQuestion() validates them explicitly. A
 * single-choice "Other" branch can opt out while its text field is incomplete.
 */
export function useQuizFlow<TQuestion extends QuizQuestionLike>(
  questions: readonly TQuestion[],
  options: UseQuizFlowOptions<TQuestion> = {},
) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(options.initialAnswers ?? {})
  const stepIndexRef = useRef(0)
  const answersRef = useRef<QuizAnswers>(options.initialAnswers ?? {})
  const historyRef = useRef<number[]>([])
  const acceptInputAfterRef = useRef(0)

  const currentQuestion = questions[stepIndex] ?? null
  const isComplete = stepIndex >= questions.length
  const requiresContinue = Boolean(
    currentQuestion
    && !shouldAutoAdvanceQuestion(
      currentQuestion,
      answers[currentQuestion.id],
      options.shouldAutoAdvance,
    ),
  )

  const moveForwardOnce = useCallback((fromStep: number, requestedStep: number): boolean => {
    if (stepIndexRef.current !== fromStep) return false
    const nextStep = boundedForwardStep(requestedStep, fromStep, questions.length)
    historyRef.current = [...historyRef.current, fromStep]
    stepIndexRef.current = nextStep
    acceptInputAfterRef.current = Date.now() + INTER_STEP_INPUT_FENCE_MS
    setStepIndex(nextStep)
    return true
  }, [questions.length])

  const answerQuestion = useCallback((question: TQuestion, value: unknown): boolean => {
    const fromStep = stepIndex
    if (
      Date.now() < acceptInputAfterRef.current
      || stepIndexRef.current !== fromStep
      || questions[fromStep]?.id !== question.id
    ) {
      return false
    }

    const nextAnswers = { ...answersRef.current, [question.id]: value }
    answersRef.current = nextAnswers
    setAnswers(nextAnswers)

    if (!shouldAutoAdvanceQuestion(question, value, options.shouldAutoAdvance)) {
      return false
    }

    const requestedStep = options.resolveNextStep?.({
      answers: nextAnswers,
      question,
      questionIndex: fromStep,
      questions,
      value,
    }) ?? fromStep + 1
    return moveForwardOnce(fromStep, requestedStep)
  }, [moveForwardOnce, options, questions, stepIndex])

  const continueCurrentQuestion = useCallback((): boolean => {
    const fromStep = stepIndexRef.current
    const question = questions[fromStep]
    if (!question) return false
    const value = answersRef.current[question.id]
    // Single-choice normally advances inside answerQuestion(). After Back,
    // however, its saved answer makes the locked Bullet scaffold's visible
    // “Далее” button an intentional explicit resume action.
    const answerComplete = options.isAnswerComplete ?? defaultAnswerComplete
    if (!answerComplete(question, value)) return false
    const requestedStep = options.resolveNextStep?.({
      answers: answersRef.current,
      question,
      questionIndex: fromStep,
      questions,
      value,
    }) ?? fromStep + 1
    return moveForwardOnce(fromStep, requestedStep)
  }, [moveForwardOnce, options, questions])

  const goBack = useCallback((): boolean => {
    const current = stepIndexRef.current
    if (current <= 0) return false
    const history = historyRef.current
    const previous = history.length > 0 ? history[history.length - 1] : current - 1
    historyRef.current = history.slice(0, -1)
    stepIndexRef.current = previous
    acceptInputAfterRef.current = Date.now() + INTER_STEP_INPUT_FENCE_MS
    setStepIndex(previous)
    return true
  }, [])

  const reset = useCallback((): void => {
    answersRef.current = options.initialAnswers ?? {}
    historyRef.current = []
    stepIndexRef.current = 0
    acceptInputAfterRef.current = 0
    setAnswers(answersRef.current)
    setStepIndex(0)
  }, [options.initialAnswers])

  return {
    answerQuestion,
    answers,
    continueCurrentQuestion,
    currentQuestion,
    goBack,
    isComplete,
    requiresContinue,
    reset,
    stepIndex,
  }
}
