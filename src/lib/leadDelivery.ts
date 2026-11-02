/*
 * Системный канал доставки лида — ЕДИНСТВЕННЫЙ правильный способ
 * отправить заявку из кастомного флоу без нативной <form>
 * (квиз, многошаговая форма, кастомная кнопка).
 *
 * Как это работает: на опубликованной странице смонтирован системный
 * `FormInterceptor`. Он слушает событие `quiz-complete` на `document`
 * и сам делает `POST /v1/landings/{id}/submissions`. Компонент НИЧЕГО
 * не отправляет сам — он только зовёт `submitLead(...)`.
 *
 * Почему через хелпер, а не `document.dispatchEvent` вручную: имя
 * события и цель (`document`, не `window`) — это контракт. Любая
 * опечатка → лид молча теряется, посетитель видит ложное «Спасибо».
 * Хелпер делает доставку correct-by-construction.
 *
 * НЕ нужен для нативной `<form>` с `<button type="submit">` —
 * там `FormInterceptor` перехватывает событие `submit` сам.
 */

import { useCallback, useRef } from 'react'

export type LeadDeliveryPayload = Record<string, unknown>

interface LeadDeliveryRequest {
  readonly __surgayDeliveryRequest: true
  readonly payload: LeadDeliveryPayload
  readonly resolve: () => void
  readonly reject: (error: unknown) => void
}

/**
 * Dispatch a lead to the system delivery layer and settle only after the
 * backend has accepted it.  Callers may ignore the returned promise, but any
 * UI that renders a success state must await it so a network failure can be
 * shown and retried instead of becoming a false "thank you" screen.
 */
export function submitLead(detail?: LeadDeliveryPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const request: LeadDeliveryRequest = {
      __surgayDeliveryRequest: true,
      payload: detail || {},
      resolve,
      reject,
    }
    document.dispatchEvent(
      new CustomEvent('quiz-complete', { detail: request }),
    )
  })
}

function createClientSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const random = Math.random().toString(36).slice(2, 12)
  return `lead-${Date.now().toString(36)}-${random}`
}

export interface ExactlyOnceLeadDelivery {
  /**
   * Starts one delivery for the current completed flow. Concurrent taps share
   * the same promise; a retry after a transport failure retains the same
   * client_submission_id, which lets the backend deduplicate an accepted
   * request whose response was lost.
   */
  submit: (payload?: LeadDeliveryPayload) => Promise<void>
  /** Start a genuinely new flow only after the visitor deliberately edits it. */
  reset: () => boolean
}

/**
 * Delivery engine for non-native lead capture (quizzes, configurators and
 * calculators). Native `<form>` elements must not use this hook: their
 * exactly-once boundary is FormInterceptor's per-form submission id.
 */
export function useExactlyOnceLeadDelivery(
  defaultFormId: string,
): ExactlyOnceLeadDelivery {
  const formIdRef = useRef(defaultFormId)
  const submissionIdRef = useRef<string | null>(null)
  const inFlightRef = useRef<Promise<void> | null>(null)
  const deliveredRef = useRef(false)

  formIdRef.current = defaultFormId

  const submit = useCallback((payload: LeadDeliveryPayload = {}): Promise<void> => {
    if (deliveredRef.current) return Promise.resolve()
    if (inFlightRef.current) return inFlightRef.current

    const requestedFormId = payload.form_id
    const formId = (
      typeof requestedFormId === 'string' && requestedFormId.trim()
        ? requestedFormId.trim()
        : formIdRef.current
    )
    const clientSubmissionId = submissionIdRef.current ?? createClientSubmissionId()
    submissionIdRef.current = clientSubmissionId

    const attempt = submitLead({
      ...payload,
      form_id: formId,
      client_submission_id: clientSubmissionId,
    })
    inFlightRef.current = attempt
    void attempt.then(
      () => {
        deliveredRef.current = true
      },
      () => undefined,
    ).finally(() => {
      if (inFlightRef.current === attempt) inFlightRef.current = null
    })
    return attempt
  }, [])

  const reset = useCallback((): boolean => {
    if (inFlightRef.current) return false
    submissionIdRef.current = null
    deliveredRef.current = false
    return true
  }, [])

  return { submit, reset }
}
