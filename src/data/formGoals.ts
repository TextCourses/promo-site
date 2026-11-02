export interface FormGoalEntry {
  formId: string
  goalId: string
  name: string
  description?: string
  stale?: boolean
}

export interface FormGoalsRegistry {
  version: number
  goals: FormGoalEntry[]
}

export const FORM_GOALS: FormGoalsRegistry = {
  version: 1,
  goals: [
    {
      formId: 'quiz',
      goalId: 'form_quiz',
      name: 'Получение персонального чек-листа QA',
      description: 'Финальный шаг короткого опроса',
    },
  ],
}
