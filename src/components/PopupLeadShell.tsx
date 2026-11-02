import { useEffect, useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  formatRussianPhone,
  isRussianPhoneComplete,
  RUSSIAN_PHONE_MASK_LENGTH,
  RUSSIAN_PHONE_PATTERN,
} from '@/lib/phoneMask'

export type PopupPresentation = 'centered' | 'bottom-sheet'

export interface PopupLeadShellProps {
  buttonLabel?: string
  description: string
  formId: string
  onOpenChange: (open: boolean) => void
  open: boolean
  presentation?: PopupPresentation
  privacyHref?: string
  successMessage?: string
  title: string
}

/**
 * The shared popup lead engine. Its native form is intentionally the sole
 * delivery mechanism: FormInterceptor owns the per-form idempotency key,
 * backend request, success event and per-form Metrika goal.
 */
export function PopupLeadShell({
  buttonLabel = 'Получить предложение',
  description,
  formId,
  onOpenChange,
  open,
  presentation = 'centered',
  privacyHref = '/privacy',
  successMessage = 'Спасибо! Мы получили заявку и скоро свяжемся с вами.',
  title,
}: PopupLeadShellProps): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null)
  const phoneErrorId = useId()
  const [phone, setPhone] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'pending' | 'error' | 'success'
  >('idle')
  const phoneInvalid = phoneTouched && !isRussianPhoneComplete(phone)

  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const onSubmitting = () => setSubmissionState('pending')
    const onError = () => setSubmissionState('error')
    const onSubmitted = () => setSubmissionState('success')
    form.addEventListener('surgay:submitting', onSubmitting)
    form.addEventListener('surgay:submit-error', onError)
    form.addEventListener('surgay:submitted', onSubmitted)
    return () => {
      form.removeEventListener('surgay:submitting', onSubmitting)
      form.removeEventListener('surgay:submit-error', onError)
      form.removeEventListener('surgay:submitted', onSubmitted)
    }
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && submissionState === 'pending') return
    if (!nextOpen) {
      setPhone('')
      setPhoneTouched(false)
      setSubmissionState('idle')
    }
    onOpenChange(nextOpen)
  }

  const updatePhone = (value: string) => {
    const nextPhone = formatRussianPhone(value)
    setPhone(nextPhone)
    if (isRussianPhoneComplete(nextPhone)) {
      formRef.current?.querySelector('[data-surgay-submit-error]')?.remove()
    }
  }

  const positionClass = presentation === 'bottom-sheet'
    ? 'top-auto bottom-0 max-w-none translate-y-0 rounded-b-none sm:top-1/2 sm:bottom-auto sm:max-w-md sm:-translate-y-1/2 sm:rounded-lg'
    : 'sm:max-w-md'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`gap-0 border-border bg-bg p-0 shadow-xl ${positionClass}`}
        showCloseButton={false}
      >
        <div className="grid gap-6 p-5 sm:p-7" data-popup-lead-shell data-popup-presentation={presentation}>
          <div className="flex items-start justify-between gap-4">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-2xl leading-tight text-fg">
                {title}
              </DialogTitle>
              <DialogDescription className="max-w-md text-base leading-relaxed text-muted">
                {description}
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button variant="ghost" className="min-h-11 shrink-0 px-3 text-sm text-muted" type="button">
                Закрыть
              </Button>
            </DialogClose>
          </div>

          {submissionState === 'success' ? (
            <div className="grid gap-4 py-3" aria-live="polite">
              <p className="text-lg font-medium text-fg">{successMessage}</p>
              <Button variant="outline" className="min-h-11 w-fit" onClick={() => handleOpenChange(false)} type="button">
                Понятно
              </Button>
            </div>
          ) : (
            <form
              ref={formRef}
              aria-busy={submissionState === 'pending'}
              className="grid gap-4"
              data-form-id={formId}
            >
              <label className="grid gap-1.5 text-sm font-medium text-fg">
                Как к вам обращаться
                <input
                  autoComplete="name"
                  className="h-11 w-full rounded-md border border-border bg-transparent px-3 text-base text-fg outline-none placeholder:text-muted focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/50"
                  minLength={2}
                  name="name"
                  placeholder="Имя"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium text-fg">
                Телефон
                <input
                  aria-describedby={phoneInvalid ? phoneErrorId : undefined}
                  aria-invalid={phoneInvalid}
                  autoComplete="tel"
                  className="h-11 w-full rounded-md border border-border bg-transparent px-3 text-base text-fg outline-none placeholder:text-muted focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/50"
                  inputMode="tel"
                  maxLength={RUSSIAN_PHONE_MASK_LENGTH}
                  name="phone"
                  onBlur={() => setPhoneTouched(true)}
                  onChange={(event) => updatePhone(event.target.value)}
                  pattern={RUSSIAN_PHONE_PATTERN}
                  placeholder="+7 (999) 123-45-67"
                  required
                  type="tel"
                  value={phone}
                />
              </label>
              {phoneInvalid ? (
                <p id={phoneErrorId} role="alert" className="text-sm text-danger">
                  Введите номер полностью в формате +7 (000) 000-00-00.
                </p>
              ) : null}

              <label className="flex items-start gap-2 text-sm leading-5 text-muted">
                <input className="mt-1 size-4 accent-accent" name="consent" required type="checkbox" />
                <span>
                  Я даю согласие на обработку{' '}
                  <a className="text-accent underline underline-offset-2" href={privacyHref}>
                    персональных данных
                  </a>
                  .
                </span>
              </label>

              <Button className="min-h-11" disabled={submissionState === 'pending'} type="submit">
                {submissionState === 'pending' ? 'Отправляем…' : buttonLabel}
              </Button>
              <p data-thank-you className="hidden" aria-live="polite">
                {successMessage}
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PopupLeadShell
