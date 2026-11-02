/// <reference types="vite/client" />

/**
 * Global sandbox-флаг.
 *
 * `__SANDBOX__` подкидывается Sandpack-preview-средой через `define` в
 * vite-конфиге. В preview значение — `true`, в обычной production-сборке —
 * `false`/undefined. По нему App.tsx выбирает между MemoryRouter (preview)
 * и BrowserRouter (production).
 */
declare global {
  // eslint-disable-next-line no-var
  var __SANDBOX__: boolean | undefined

  interface Window {
    __SURGAY_TRACKING_REQUIRED__?: boolean
    __SURGAY_LOAD_TRACKING__?: () => void
  }
}

export {}
