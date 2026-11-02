/*
 * Минимальный универсальный App.tsx для Pivot Phase 2.
 *
 * Этот файл — точка композиции лендинга. Skill добавляет компоненты
 * секций через импорты и линейную композицию в <Main />.
 *
 * Контракт:
 *   - Все секции — отдельные TSX-компоненты в src/components/<Section>.tsx
 *   - Контент секций — в JSX либо, опционально, в src/content.ts. Если
 *     используешь content.ts — заполни ВСЕ ключи, на которые ссылаешься
 *     (content.hero и т.д.), иначе в рантайме undefined и белый экран.
 *   - Стили — через Tailwind-классы, читающие CSS-переменные из tokens.css
 *   - `Router` УЖЕ объявлен ниже (sandbox-aware). НЕ импортируй и не алиась
 *     `BrowserRouter as Router` / `Router` из 'react-router-dom' — используй
 *     готовый `<Router>`. Двойное объявление = build-ошибка «Duplicate
 *     declaration "Router"».
 *
 * Этот файл МОЖНО редактировать агенту — это template, не fixture.
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
    <Router basename="/">
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

