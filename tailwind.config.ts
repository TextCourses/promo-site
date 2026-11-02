/*
 * Универсальный Tailwind config для scaffold'а.
 *
 * Все цвета биндятся через CSS-переменные из `src/styles/tokens.css`,
 * который запекается в scaffold детерминированно в pivot_runner до старта
 * агента. Конкретная палитра — в активной дизайн-системе
 * (`backend/design_systems/<slug>/tokens.css`).
 *
 * Tailwind-классы:
 *   bg-bg, bg-surface, bg-surface-warm
 *   text-fg, text-fg-2, text-muted, text-meta
 *   border-border, border-border-strong
 *   bg-accent, text-accent, hover:bg-accent-hover
 *   ring-focus-ring
 *
 * Alpha-модификатор работает на всех токенах — и процентом, и arbitrary-формой
 * в квадратных скобках (см. `tokenColor` ниже). Примеры классов намеренно НЕ
 * выписаны литералами: Tailwind сканирует и этот файл, литерал попал бы мёртвым
 * правилом в CSS каждого лендинга.
 *
 * Запрещено добавлять hardcoded hex-цвета в `theme.extend.colors` —
 * это сломает контракт DS-токенов и линтер пометит как нарушение.
 */
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/*
 * Токен-цвет с поддержкой alpha-модификатора.
 *
 * ПОЧЕМУ ФУНКЦИЯ, А НЕ СТРОКА `'var(--color-bg)'`. Tailwind 3 умеет
 * подмешивать alpha только двумя способами: распарсить цвет (var() он
 * распарсить не может) или вызвать значение-функцию с `opacityValue`. Пока
 * токены были строками, КАЖДЫЙ класс с alpha-модификатором молча не попадал в
 * CSS — правило просто не генерировалось.
 *
 * ПОЧЕМУ `toJSON`. Билдер (`infrastructure/builder/scripts/build.js`) мёрджит
 * этот конфиг с базовым и сериализует `theme.extend` через `JSON.stringify` —
 * обычная функция при этом ИСЧЕЗЛА БЫ вместе с ключом цвета (у лендинга
 * пропали бы все токен-классы). Поэтому функция несёт `toJSON`, который отдаёт
 * декларативный маркер `var(--color-x)/*sg-token-color*\/`:
 *   - НОВЫЙ build.js распознаёт маркер и разворачивает его обратно в функцию —
 *     alpha работает;
 *   - СТАРЫЙ build.js (образ билдера ещё не пересобран) оставит строку как
 *     есть, а CSS-комментарий внутри значения парсер браузера отбрасывает →
 *     рендер бит-в-бит как до правки, без alpha. Деградация, а не поломка.
 * Правишь маркер — правь обе стороны (здесь и в build.js).
 *
 * ПОЧЕМУ ОТДЕЛЬНАЯ ВЕТКА НА ЧИСЛО 0 (`GRADIENT_TRANSPARENT`). `from-<токен>` и
 * `via-<токен>` — ОБЫЧНЫЕ классы без alpha, но Tailwind сам достраивает парный
 * `--tw-gradient-to` как «тот же цвет с alpha 0» и ради этого дёргает
 * значение-функцию (`gradientColorStops.transparentTo` →
 * `withAlphaValue(value, 0, 'rgb(255 255 255 / 0)')`). Пока токены были
 * строками, `parseColor('var(--color-x)')` падал и Tailwind брал свой
 * `defaultValue`. С функцией общий guard пропускал `0` как валидный alpha и
 * подставлял `color-mix(... 0%, transparent)` — в браузерах без `color-mix`
 * (Chrome <111, Safari <16.2, FF <113) градиент терял прозрачную точку
 * останова, то есть ехала УЖЕ РАБОТАЮЩАЯ вёрстка (~288 правил с вариантами).
 *
 * Служебный вызов отличим от пользовательского нулевого alpha-модификатора:
 * Tailwind передаёт сюда ЧИСЛО `0`, а модификатор класса всегда приходит
 * СТРОКОЙ (`asColor` → `theme.opacity` даёт `'0'`, arbitrary-форма — тоже
 * строку). Проверено на tailwindcss 3.4.19 билдера: числовой alpha приходит
 * ТОЛЬКО из `transparentTo`. Поэтому явный нулевой alpha на градиент-стопе
 * остаётся живой alpha-формой, а авто-стоп возвращается к прежним байтам.
 *
 * ПОЧЕМУ АРБИТРАРНАЯ ALPHA ЛИБО СЧИТАЕТСЯ, ЛИБО НЕ ЭМИТИТСЯ. Кроме числа
 * (`0.1`) Tailwind передаёт сюда и другие строки: свой плейсхолдер класса БЕЗ
 * модификатора (`var(--tw-bg-opacity, 1)`), проценты (`50%`, `12.5%` — из
 * arbitrary-формы) и вовсе неразрешимое (`calc(1 / 3)`, `var(--x)`). Пока
 * guard стоял на `Number(...)`/`isFinite`, ВСЁ нечисловое уходило в ветку
 * голого токена, и `bg-fg/[50%]` эмитился НЕПРОЗРАЧНЫМ — молча неверный
 * результат вместо явного отсутствия. Теперь форма разбирается явно:
 *   - плейсхолдер `var(--tw-*-opacity, …)` и отсутствие модификатора —
 *     голый токен (прежние байты обычных классов);
 *   - число и процент — переводятся в проценты `color-mix`;
 *   - всё остальное — `undefined`: единицу измерения у `var(--x)` выяснить
 *     нечем (число это или процент — знает только рантайм браузера), а
 *     угадывание дало бы либо невалидный CSS, либо неверную прозрачность.
 *     Tailwind на `undefined` не эмитит правило ЦЕЛИКОМ (проверено на всех
 *     цветовых утилитах 3.4.19, включая градиент-стопы), то есть класса
 *     просто нет — громкий отказ вместо тихо непрозрачного фона.
 *
 * ВНИМАНИЕ: не писать в комментариях этого файла литеральные utility-классы —
 * Tailwind сканирует и сам конфиг (он лежит под `src/`), так что такой класс
 * попадёт мёртвым правилом в CSS каждого лендинга (так уже утёк `bg-bg` с
 * alpha 90 из шапки выше). И не вставлять сюда glob-ы со звёздочкой и слэшем —
 * последовательность «звёздочка + слэш» закроет этот блок-комментарий.
 */
type TokenColorArgs = { opacityValue?: string | number }

// Прежнее (до токен-функций) значение авто-достроенного `--tw-gradient-to`:
// ровно `defaultValue` из `withAlphaValue` в Tailwind 3.
const GRADIENT_TRANSPARENT = 'rgb(255 255 255 / 0)'

// Плейсхолдер, который Tailwind подставляет классу БЕЗ alpha-модификатора.
const TW_OPACITY_PLACEHOLDER = /^var\(--tw-[a-z-]+-opacity(?:,[^)]*)?\)$/i
// Литеральные формы alpha, у которых единица измерения известна точно.
const ALPHA_NUMBER = /^[0-9]*\.?[0-9]+(?:e[+-]?[0-9]+)?$/i
const ALPHA_PERCENT = /^[0-9]*\.?[0-9]+(?:e[+-]?[0-9]+)?%$/i

// Доля процента для `color-mix`, либо `null` — форму разобрать нечем.
const alphaPercent = (raw: string): string | null => {
  if (ALPHA_NUMBER.test(raw)) return `${Number((Number(raw) * 100).toFixed(4))}%`
  if (ALPHA_PERCENT.test(raw)) return `${Number(Number(raw.slice(0, -1)).toFixed(4))}%`
  return null
}

// Тип `ThemeConfig['colors']` знает только строки, поэтому значение-функция
// отдаётся Tailwind'у через cast — иначе конфиг не проходит `strict` TS.
const tokenColor = (variable: string): string => {
  const value = Object.assign(
    ({ opacityValue }: TokenColorArgs = {}) => {
      // Служебный запрос «прозрачный парный стоп» (см. шапку) — не alpha-класс.
      if (typeof opacityValue === 'number' && opacityValue === 0) return GRADIENT_TRANSPARENT
      // Класс без модификатора: alpha либо не передан, либо это служебный
      // плейсхолдер Tailwind. Отдаём голый токен — прежние байты.
      if (opacityValue === undefined || opacityValue === '') return `var(${variable})`
      const raw = String(opacityValue).trim()
      if (TW_OPACITY_PLACEHOLDER.test(raw)) return `var(${variable})`
      const percent = alphaPercent(raw)
      // Неразрешимая форма (`calc(...)`, `var(--x)`, мусор) — см. шапку:
      // правило не эмитится вовсе, вместо тихо непрозрачного класса.
      if (percent === null) return undefined
      return `color-mix(in oklab, var(${variable}) ${percent}, transparent)`
    },
    { toJSON: () => `var(${variable})/*sg-token-color*/` },
  )
  return value as unknown as string
}

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surface tiers
        bg: tokenColor('--color-bg'),
        surface: tokenColor('--color-surface'),
        'surface-warm': tokenColor('--color-surface-warm'),
        'surface-2': tokenColor('--color-surface-2'),

        // Foreground tiers
        fg: tokenColor('--color-fg'),
        'fg-2': tokenColor('--color-fg-2'),
        muted: tokenColor('--color-muted'),
        meta: tokenColor('--color-meta'),

        // Borders
        border: tokenColor('--color-border'),
        'border-strong': tokenColor('--color-border-strong'),

        // Accent
        accent: {
          DEFAULT: tokenColor('--color-accent'),
          hover: tokenColor('--color-accent-hover'),
          on: tokenColor('--color-accent-on'),
          2: tokenColor('--color-accent-2'),
        },

        // Semantic
        success: tokenColor('--color-success'),
        warn: tokenColor('--color-warn'),
        danger: tokenColor('--color-danger'),

        // Focus
        'focus-ring': tokenColor('--color-focus-ring'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm, 4px)',
        md: 'var(--radius-md, 6px)',
        lg: 'var(--radius-lg, 8px)',
        '2xl': 'var(--radius-2xl, 16px)',
      },
      maxWidth: {
        container: 'var(--container-max, 1200px)',
      },
    },
  },
  plugins: [animate],
}

export default config
