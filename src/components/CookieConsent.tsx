/*
 * CookieConsent — всплывающее уведомление об использовании cookie.
 *
 * Системный баннер согласия для подключённой аналитики. Показывается только
 * когда публикационный runtime выставил __SURGAY_TRACKING_REQUIRED__.
 * Tracking-скрипты загружаются только после явного согласия.
 *
 * Рендерится ОДИН раз в App.tsx внутри <Router> — рядом с <Routes>.
 *
 * ЧТО ГЕНЕРАТОРУ МОЖНО И НУЖНО МЕНЯТЬ — чтобы баннер совпадал с вайбом
 * конкретного лендинга:
 *   - текст уведомления, подпись кнопки, подпись ссылки (props text /
 *     buttonLabel / privacyLabel либо прямо в JSX);
 *   - Tailwind-классы оформления — цвета (под brand-палитру), скругление,
 *     тень, типографику, позицию баннера.
 *
 * ЧТО НЕЛЬЗЯ ТРОГАТЬ:
 *   - имя файла CookieConsent.tsx и default-export;
 *   - логику видимости и consent event;
 *   - наличие ссылки на политику конфиденциальности.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

// Ключ в localStorage, под которым хранится факт согласия. Не менять.
const STORAGE_KEY = 'cookie-consent-accepted'

const CONSENT_EVENT = 'surgay:cookie-consent-accepted'

function hasDecision(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

function trackingRequiresConsent(): boolean {
  return window.__SURGAY_TRACKING_REQUIRED__ === true
}

export interface CookieConsentProps {
  text?: string
  buttonLabel?: string
  /** Сохраняем prop для совместимости со старыми сгенерированными вызовами. */
  rejectLabel?: string
  privacyHref?: string
  privacyLabel?: string
}

export default function CookieConsent({
  text = 'Мы используем',
  buttonLabel = 'Хорошо',
  privacyHref = '/privacy',
  privacyLabel = 'куки',
}: CookieConsentProps): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(
    () => trackingRequiresConsent() && !hasDecision(),
  )

  if (!visible) return null

  const accept = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // localStorage недоступен — закрываем баннер хотя бы на эту сессию.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT))
    setVisible(false)
  }

  return (
    <aside
      aria-label="Уведомление об использовании cookie"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-4 sm:justify-end sm:px-4"
    >
      <div className="pointer-events-auto inline-flex max-w-full items-center gap-3 rounded-xl bg-bg px-3 py-2 text-muted shadow-md">
        <p className="whitespace-nowrap text-xs leading-none">
          {text}
          {privacyHref ? (
            <>
              {' '}
              <Link
                to={privacyHref}
                className="font-medium text-fg underline underline-offset-2 hover:no-underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                {privacyLabel}
              </Link>
            </>
          ) : null}
          .
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={accept}
          className="h-9 shrink-0 rounded-lg border-fg/15 bg-transparent px-3 text-xs font-medium text-fg shadow-none hover:bg-fg/5 hover:text-fg focus-visible:ring-accent/50"
        >
          {buttonLabel}
        </Button>
      </div>
    </aside>
  )
}
