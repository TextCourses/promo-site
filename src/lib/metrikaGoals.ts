/*
 * Цели Яндекс Метрики для квиза и перехода в бот.
 * Добавлено 09.11.2026 для раздельного учёта Telegram / МАХ и шагов квиза.
 *
 * Счётчик Метрики подключён в index.html (номер 113691981), поэтому здесь
 * мы его не устанавливаем, а только отправляем цели в уже подключённый
 * счётчик. Если номер счётчика в index.html изменится — поменяйте его и здесь.
 */
const COUNTER_ID: number | null = 113691981 // счётчик «Текст-Курс» из index.html

type GoalParams = Record<string, string | number | boolean>

interface MetrikaWindow {
  ym?: (...args: unknown[]) => void
  Ya?: { Metrika2?: { counters?: () => Array<{ id: number }> } }
}

function resolveCounterId(w: MetrikaWindow): number | null {
  if (COUNTER_ID) return COUNTER_ID
  try {
    const counters = w.Ya?.Metrika2?.counters?.()
    return counters && counters.length > 0 ? counters[0].id : null
  } catch {
    return null
  }
}

/**
 * Отправить цель в Метрику. Ничего не делает, если Метрика не загружена
 * (например, посетитель не дал согласие на cookie) — сайт при этом
 * продолжает работать как обычно.
 */
export function reachGoal(goal: string, params?: GoalParams): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as MetrikaWindow
  if (typeof w.ym !== 'function') return
  const counterId = resolveCounterId(w)
  if (!counterId) return
  try {
    w.ym(counterId, 'reachGoal', goal, params)
  } catch {
    // Ошибка аналитики не должна ломать квиз
  }
}

/** Идентификаторы целей. Должны совпадать с целями, созданными в Метрике. */
export const GOALS = {
  quizStep1: 'quiz_step_1',
  quizStep2: 'quiz_step_2',
  quizStep3: 'quiz_step_3',
  quizStep4: 'quiz_step_4',
  segmentBeginner: 'quiz_segment_beginner',
  segmentSkilled: 'quiz_segment_skilled',
  botClick: 'bot_click',
  botTg: 'bot_tg',
  botMax: 'bot_max',
} as const
