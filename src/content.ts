/*
 * src/content.ts — ОПЦИОНАЛЬНЫЙ слой данных лендинга.
 *
 * Хранить тексты здесь НЕ обязательно: способ задаёт active skill / тип
 * лендинга (см. system prompt). Можно писать текст прямо в JSX. Это пустая
 * заглушка-скелет (только brand).
 *
 * Если решаешь хранить тексты здесь — действует ЖЁСТКИЙ контракт:
 *   - заполни РЕАЛЬНЫМИ данными ВСЕ ключи, на которые ссылаются компоненты
 *     (content.hero, content.quiz_start, …). НЕ оставляй ссылку content.<key>
 *     на незаполненный ключ — в рантайме это `undefined` и БЕЛЫЙ ЭКРАН
 *     (Cannot read properties of undefined), хотя сборка/компиляция пройдёт;
 *   - держи content.ts и JSX синхронными.
 * Если хранить данные здесь не нужно — НЕ ссылайся на `content` в компонентах
 * (пиши текст прямо в JSX) и оставь этот файл как есть.
 *
 * Тип `Content` намеренно гибкий — индексная сигнатура позволяет добавлять
 * ключи (hero, services, …) без правки типа.
 */

export interface Brand {
  name: string
  logo_url: string | null
  logo_alt: string | null
}

export interface Content {
  brand: Brand
  // Каждая секция skill'а добавит сюда свой ключ:
  // hero: { headline, subhead, cta: { label, href }, image: '...' },
  // services: [{ title, description, icon }],
  // и т.д.
  [key: string]: unknown
}

export const content: Content = {
  brand: {
    name: '',
    logo_url: null,
    logo_alt: null,
  },
}

export default content
