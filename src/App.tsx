/*
 * Минимальный универсальный App.tsx для Pivot Phase 2.
 * ...
 */
import { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import type { ComponentType, ReactNode } from 'react'
import Main from './pages/Main'
import Privacy from './pages/Privacy'
import CookieConsent from './components/CookieConsent'

// MemoryRouter для Sandpack-preview, BrowserRouter для production-build.
const Router: ComponentType<{ children?: ReactNode }> =
  typeof __SANDBOX__ !== 'undefined' && __SANDBOX__
    ? MemoryRouter
    : BrowserRouter

function ScrollToTop(): null {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App(): JSX.Element {
  return (
    <Router basename="/">   {/* ← Вернули корень */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      {/* Runtime сам покажет баннер, только если подключена аналитика. */}
      <CookieConsent privacyHref="/privacy" />
    </Router>
  )
}

