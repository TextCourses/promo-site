/*
 * MediaSlot — единая обёртка для всех картинок, видео и файлов лендинга.
 *
 * Три режима:
 *
 * 1. Inline-картинка/видео (по умолчанию) — рендерит <img>/<video>:
 *      <MediaSlot id="team.photo.0" alt="..." className="rounded-xl" />
 *
 * 2. Inline-файл (kind="file" или kind из registry) — рендерит <a download>:
 *      <MediaSlot id="lead_magnet.checklist.0" kind="file" className="..." />
 *
 * 3. Фон секции (as="background") — рендерит <div> с background-image,
 *    контент секции кладётся внутрь как children и ложится ПОВЕРХ фона:
 *      <MediaSlot id="hero.bg.0" as="background" className="min-h-[600px]">
 *        <div>…контент hero…</div>
 *      </MediaSlot>
 *    Используй этот режим для полноэкранных/фоновых изображений секций
 *    (hero, CTA-блок). Не нужно возиться с absolute/z-index вручную.
 *
 * Логика:
 *   - по `id` ищем запись в mediaRegistry.ts;
 *   - есть `url` — рендерим картинку/видео/файл/фон;
 *   - url пуст — рендерим общий placeholder (юзер видит «здесь будет
 *     изображение» или disabled file-label, а не сломанный тег). Для
 *     background-слота placeholder — нейтральный градиент из токенов DS;
 *     если у слота задан scrim, он накладывается и на этот градиент и задаёт
 *     безопасный foreground всему copy-root ещё ДО выбора фото.
 *
 * Заглушка пустого слота адресована ВЛАДЕЛЬЦУ в редакторе, поэтому в
 * publish-сборке она молчит: картинка становится нейтральным кадром без
 * подписей и без служебных data-атрибутов, пустой файловый слот не рендерится
 * вовсе. Признак сборки — PUBLISH_BUILD ниже.
 *
 * Этот файл НЕ должен правиться генератором — он часть базового
 * шаблона. Генератор только вставляет <MediaSlot id="..."/> в секции и
 * обновляет mediaRegistry.ts.
 */
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
  VideoHTMLAttributes,
} from 'react'
import { useEffect, useState } from 'react'
import { MEDIA_REGISTRY, type MediaSlotEntry } from '../data/mediaRegistry'

export type { MediaSlotEntry }
export type MediaSlotKind = 'image' | 'video' | 'file'

export interface MediaSlotProps {
  id?: string
  alt?: string
  className?: string
  kind?: MediaSlotKind
  downloadLabel?: string
  fileProps?: AnchorHTMLAttributes<HTMLAnchorElement>
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>
  videoPlayback?: 'autoplay' | 'scroll-scrub' | 'poster'
  videoRef?: Ref<HTMLVideoElement>
  as?: 'background' | 'inline'
  children?: ReactNode
  style?: CSSProperties
}

// Признак опубликованной сборки. Служебная заглушка пустого слота (подпись,
// технический id, инструкция «откройте вкладку Материалы») адресована владельцу в
// редакторе — посетителю сайта её показывать нельзя. Константу подставляет
// билдер (`define` в vite.config.ts), поэтому в publish-бандле минификатор
// вырезает и сами тексты заглушки.
//
// Fallback нужен, пока образ билдера на среде мог остаться без этого define:
// тогда режим читается из runtime-конфига, который билдер инжектит в index.html.
// Конфига нет вовсе (сборки runtime_validator и browser-QA) — это preview, тот
// же контракт, что у FormInterceptor.
declare const __SG_PUBLISH_BUILD__: boolean | undefined

function runtimePublishBuild(): boolean {
  const scope = globalThis as typeof globalThis & {
    __SURGAY_CONFIG__?: { previewMode?: boolean }
  }
  const config = scope.__SURGAY_CONFIG__
  return Boolean(config) && config?.previewMode === false
}

const PUBLISH_BUILD: boolean =
  typeof __SG_PUBLISH_BUILD__ !== 'undefined'
    ? __SG_PUBLISH_BUILD__ === true
    : runtimePublishBuild()

// Обе заглушки — функции, а не модульные константы: при `PUBLISH_BUILD === true`
// ветка сворачивается на этапе сборки, неиспользованное объявление выпадает из
// бандла, и служебные строки в опубликованные ассеты не попадают.
function previewPlaceholderDataUrl(): string {
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#e2e8f0"/>
           <stop offset="100%" stop-color="#cbd5e1"/>
         </linearGradient>
       </defs>
       <rect width="800" height="600" fill="url(#g)"/>
       <g fill="#475569" font-family="system-ui, sans-serif" text-anchor="middle">
         <circle cx="400" cy="270" r="44" fill="none" stroke="#475569" stroke-width="3"/>
         <path d="M376 282 l24 -28 18 22 14 -16 22 26 z" fill="#475569"/>
         <circle cx="392" cy="258" r="6" fill="#475569"/>
         <text x="400" y="380" font-size="22" font-weight="600">Здесь будет изображение</text>
         <text x="400" y="412" font-size="14" opacity="0.7">Откройте вкладку «Материалы», чтобы заполнить слот</text>
       </g>
     </svg>`,
    )
  )
}

// Публичный вариант: тот же кадр 800×600, поэтому геометрия и intrinsic aspect
// ratio пустого слота не меняются (важно для `w-full h-auto`-раскладок), но без
// единой подписи — нейтральный градиент вместо служебного плаката.
function neutralPlaceholderDataUrl(): string {
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#e2e8f0"/>
           <stop offset="100%" stop-color="#cbd5e1"/>
         </linearGradient>
       </defs>
       <rect width="800" height="600" fill="url(#g)"/>
     </svg>`,
    )
  )
}

// Фон-placeholder для as="background": лёгкий нейтральный градиент, без текста —
// контент секции уже лежит поверх и не должен спорить с подписью. Цвета берутся
// из токенов активной дизайн-системы (`--color-surface`/`--color-surface-2`),
// поэтому на тёмной DS placeholder тоже тёмный, на светлой — светлый, и секция,
// спроектированная под конкретное настроение, не сваливается в чужой серый.
// Fallback-hex (var(--x, #hex)) срабатывает, если переменная токена почему-то
// недоступна — placeholder всё равно виден и iframe-превью не ломается.
const PLACEHOLDER_BG_GRADIENT =
  'linear-gradient(135deg, var(--color-surface, #e2e8f0) 0%, ' +
  'var(--color-surface-2, #cbd5e1) 100%)'

function findSlot(id?: string): MediaSlotEntry | null {
  if (!id) return null
  const slots = (MEDIA_REGISTRY && MEDIA_REGISTRY.slots) || []
  return slots.find((s) => s && s.id === id) || null
}

function clampOverlay(value?: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0.68
  return Math.min(1, Math.max(0, value))
}

function safeFocalPoint(value?: string): string | undefined {
  if (!value) return undefined
  const match = value.trim().match(/^(\d{1,3})%\s+(\d{1,3})%$/)
  if (!match) return undefined
  const x = Math.min(100, Number(match[1]))
  const y = Math.min(100, Number(match[2]))
  return `${x}% ${y}%`
}

function focalPointForViewport(
  slot: MediaSlotEntry | null,
  mobile: boolean,
): string | undefined {
  const desktopFocalPoint = safeFocalPoint(slot?.focal_point)
  if (!mobile) return desktopFocalPoint

  const mobileFocalPoint = safeFocalPoint(slot?.mobile_focal_point)
  if (mobileFocalPoint) return mobileFocalPoint

  // Shared media keeps the desktop composition. A dedicated mobile asset is
  // an independent canvas, so no mobile override means its own centre rather
  // than an unrelated focal point authored for the desktop sibling.
  return slot?.mobile_url ? '50% 50%' : desktopFocalPoint
}

function MobileFocalStyle({
  id,
  slot,
}: {
  id?: string
  slot: MediaSlotEntry | null
}): JSX.Element | null {
  const focalPoint = focalPointForViewport(slot, true)
  if (!id || !focalPoint) return null
  const safeId = id.replace(/["\\]/g, '')
  // Keep this utility node out of sibling-spacing selectors such as
  // `space-y-* > :not([hidden]) ~ :not([hidden])`. The stylesheet remains
  // active, while attached media and its placeholder keep identical geometry.
  return (
    <style hidden>{`@media (max-width: 767px) {
      [data-media-slot="${safeId}"] {
        background-position: ${focalPoint} !important;
        object-position: ${focalPoint} !important;
      }
      [data-media-slot="${safeId}"] img {
        object-position: ${focalPoint} !important;
      }
    }`}</style>
  )
}

type MediaCopyStyle = CSSProperties & {
  '--media-copy-color'?: string
  '--media-copy-muted'?: string
}

function effectiveScrimStrength(slot: MediaSlotEntry | null): number | null {
  if (!slot || !slot.scrim || slot.scrim === 'none') return null
  return Math.max(0.68, clampOverlay(slot.overlay_strength))
}

// Scrim-подложка поверх фона (картинки или видео) — контрастный градиент под
// текстом. `null`, если scrim не задан. На desktop сохраняем чистую часть
// фотографии, но держим плотное плато под copy; на mobile даём безопасный
// full-width veil, потому что текст почти всегда занимает всю ширину кадра.
function scrimOverlay(slot: MediaSlotEntry | null, mobile: boolean): string | null {
  const strength = effectiveScrimStrength(slot)
  if (!slot || strength === null) return null
  const rgb = slot.scrim === 'light' ? '255,255,255' : '0,0,0'
  const strong = `rgba(${rgb},${strength})`
  const shoulder = `rgba(${rgb},${Math.max(0.5, strength * 0.74)})`
  const veil = `rgba(${rgb},${Math.max(0.14, strength * 0.22)})`
  if (mobile) {
    // Copy normally occupies most of the mobile crop. A uniform veil is the
    // only deterministic guarantee when the user later replaces the image.
    return `linear-gradient(${strong}, ${strong})`
  }
  if (slot.copy_position === 'center') {
    return `linear-gradient(${strong}, ${strong})`
  }
  const direction =
    slot.copy_position === 'right'
      ? 'to left'
      : 'to right'
  return `linear-gradient(${direction}, ${strong} 0%, ${strong} 50%, ${shoulder} 76%, ${veil} 100%)`
}

// `color` is the fail-safe for plain/inherited copy. CSS variables let the
// generated page express hierarchy without unsafe `text-[var(...)]/NN`
// classes, which this Tailwind stack silently drops. Opaque cards nested over
// the photo must still set their own foreground token.
function scrimCopyStyle(slot: MediaSlotEntry | null): MediaCopyStyle {
  if (slot?.scrim === 'dark') {
    return {
      color: 'rgb(255, 255, 255)',
      '--media-copy-color': 'rgb(255, 255, 255)',
      '--media-copy-muted': 'rgba(255,255,255,0.82)',
    }
  }
  if (slot?.scrim === 'light') {
    return {
      color: 'rgb(24, 23, 20)',
      '--media-copy-color': 'rgb(24, 23, 20)',
      '--media-copy-muted': 'rgba(24,23,20,0.76)',
    }
  }
  return {}
}

const VIDEO_URL_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

function isVideoSlot(kind: MediaSlotKind, url?: string | null): boolean {
  return kind === 'video' || (typeof url === 'string' && VIDEO_URL_RE.test(url))
}

function captureModeEnabled(): boolean {
  if (typeof globalThis === 'undefined') return false
  const scope = globalThis as typeof globalThis & {
    __SURGAY_CAPTURE_MODE__?: boolean
    __SG_CAPTURE_MODE__?: boolean
    __SG_MOTION_PERFORMANCE_PROBE__?: boolean
  }
  return (
    scope.__SURGAY_CAPTURE_MODE__ === true ||
    scope.__SG_CAPTURE_MODE__ === true ||
    scope.__SG_MOTION_PERFORMANCE_PROBE__ === true
  )
}

function captureSafeVisualUrl(
  value: string | null | undefined,
  captureMode: boolean,
): string | null {
  if (!value) return null
  // generation_v4 browser QA is network-isolated. The backend may explicitly
  // inject exact, already-validated backend-owned still URLs and fulfill them
  // from S3 bytes inside Playwright without any Chromium network access.
  // Arbitrary/provider URLs and all motion-probe media remain placeholders.
  if (captureMode && /^https?:\/\//i.test(value)) {
    const scope = globalThis as typeof globalThis & {
      __SURGAY_CAPTURE_MODE__?: boolean
      __SG_CAPTURE_MODE__?: boolean
      __SG_MOTION_PERFORMANCE_PROBE__?: boolean
      __SG_CAPTURE_MEDIA_URLS__?: readonly string[]
    }
    if (scope.__SG_MOTION_PERFORMANCE_PROBE__ === true) return null
    const allowed = scope.__SG_CAPTURE_MEDIA_URLS__
    if (
      scope.__SURGAY_CAPTURE_MODE__ !== true &&
      scope.__SG_CAPTURE_MODE__ !== true
    ) {
      return null
    }
    return Array.isArray(allowed) && allowed.includes(value) ? value : null
  }
  return value
}

function useMediaQuery(query: string): boolean {
  const read = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(read)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

function videoSourceForViewport({
  slot,
  desktopUrl,
  mobile,
  videoSuppressed,
}: {
  slot: MediaSlotEntry | null
  desktopUrl: string | null | undefined
  mobile: boolean
  videoSuppressed: boolean
}): string | null {
  if (videoSuppressed) return null
  if (!mobile) return desktopUrl || null
  const policy = slot?.mobile_video_policy || 'poster-only'
  if (policy === 'shared') return desktopUrl || null
  if (policy === 'dedicated') return slot?.mobile_url || null
  return null
}

function posterForViewport(slot: MediaSlotEntry | null, mobile: boolean): string | null {
  if (!slot) return null
  return (mobile && slot.mobile_poster_url) || slot.poster_url || null
}

function imageSourceForViewport(
  slot: MediaSlotEntry | null,
  desktopUrl: string,
  mobile: boolean,
): string {
  return (mobile && slot?.mobile_url) || desktopUrl
}

function imageVariantsForViewport(
  slot: MediaSlotEntry | null,
  mobile: boolean,
): MediaSlotEntry['variants'] | null {
  if (!slot) return null
  if (mobile && Array.isArray(slot.mobile_variants) && slot.mobile_variants.length > 0) {
    return slot.mobile_variants
  }
  return Array.isArray(slot.variants) && slot.variants.length > 0 ? slot.variants : null
}

interface PlaceholderImageProps {
  alt?: string
  className?: string
  slot: MediaSlotEntry | null
}

function PlaceholderImage({ alt, className, slot }: PlaceholderImageProps): JSX.Element {
  if (PUBLISH_BUILD) {
    // Опубликованный сайт: нейтральный кадр без подписей. Ни alt, ни
    // data-media-slot не отдаём — id слота и его ярлык это внутренняя кухня
    // редактора, посетителю они не нужны ни глазами, ни скринридером.
    return (
      <img
        src={neutralPlaceholderDataUrl()}
        alt=""
        aria-hidden="true"
        className={className}
      />
    )
  }
  const hint = (slot && (slot.alt || slot.prompt)) || alt || 'media slot'
  return (
    <img
      src={previewPlaceholderDataUrl()}
      alt={alt || hint}
      data-media-slot={slot ? slot.id : 'unknown'}
      data-media-placeholder="true"
      className={className}
    />
  )
}

function fileLabel({
  slot,
  alt,
  downloadLabel,
  children,
}: {
  slot: MediaSlotEntry | null
  alt?: string
  downloadLabel?: string
  children?: ReactNode
}): ReactNode {
  return (
    children ||
    downloadLabel ||
    (slot && (slot.element_label || slot.download_filename || slot.alt)) ||
    alt ||
    'Скачать файл'
  )
}

export default function MediaSlot({
  id,
  alt,
  className,
  kind: propKind,
  downloadLabel,
  fileProps,
  videoProps,
  videoPlayback = 'autoplay',
  videoRef,
  as,
  children,
  style,
}: MediaSlotProps): JSX.Element | null {
  const slot = findSlot(id)
  const kind: MediaSlotKind =
    propKind || (slot && (slot.kind as MediaSlotKind)) || 'image'
  const url = slot && slot.url
  const mobile = useMediaQuery('(max-width: 767px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const captureMode = captureModeEnabled()
  const videoSuppressed =
    captureMode || prefersReducedMotion || videoPlayback === 'poster'
  const shouldLoopVideo =
    videoPlayback === 'autoplay' &&
    slot?.video_intent?.loop_strategy !== 'hold-last-frame'

  if (kind === 'file') {
    const label = fileLabel({ slot, alt, downloadLabel, children })
    const mergedClassName =
      [fileProps && fileProps.className, className].filter(Boolean).join(' ') ||
      undefined

    if (!url) {
      // Опубликованный сайт: файла нет — значит нет и кнопки. Мёртвая ссылка
      // «Скачать …» с ярлыком слота хуже пустоты: посетитель по ней кликает и
      // не получает ничего. В preview заглушка остаётся — по ней владелец
      // видит, какой слот ещё не заполнен.
      if (PUBLISH_BUILD) return null
      return (
        <span
          data-media-slot={id || 'unknown'}
          data-media-placeholder="true"
          aria-disabled="true"
          className={mergedClassName}
          style={style}
        >
          {label}
        </span>
      )
    }

    return (
      <a
        {...(fileProps || {})}
        href={url}
        download={
          (fileProps && fileProps.download) ||
          (slot && slot.download_filename) ||
          undefined
        }
        data-media-slot={id}
        className={mergedClassName}
        style={{ ...((fileProps && fileProps.style) || {}), ...(style || {}) }}
      >
        {label}
      </a>
    )
  }

  // ── Режим фона секции ─────────────────────────────────────────────
  if (as === 'background') {
    const video = isVideoSlot(kind, url)
    const videoSource = video
      ? videoSourceForViewport({
          slot,
          desktopUrl: url,
          mobile,
          videoSuppressed,
        })
      : null
    const poster = video
      ? captureSafeVisualUrl(posterForViewport(slot, mobile), captureMode)
      : null
    const imageSource =
      !video && url
        ? captureSafeVisualUrl(imageSourceForViewport(slot, url, mobile), captureMode)
        : null
    const selectedFocalPoint = focalPointForViewport(slot, mobile) || 'center'
    const overlay = scrimOverlay(slot, mobile)
    const overlayStrength = effectiveScrimStrength(slot)
    const copyStyle = scrimCopyStyle(slot)
    const hasVisual = Boolean(videoSource || poster || imageSource)
    const placeholderBackground: CSSProperties = hasVisual
      ? {}
      : {
          backgroundImage: overlay
            ? `${overlay}, ${PLACEHOLDER_BG_GRADIENT}`
            : PLACEHOLDER_BG_GRADIENT,
        }
    return (
      <div
        data-media-slot={id || 'unknown'}
        data-media-placeholder={hasVisual ? undefined : 'true'}
        data-media-viewport={mobile ? 'mobile' : 'desktop'}
        data-media-scrim={
          slot?.scrim && slot.scrim !== 'none' ? slot.scrim : undefined
        }
        data-media-copy-position={slot?.copy_position || undefined}
        data-media-overlay-strength={
          overlayStrength === null ? undefined : String(overlayStrength)
        }
        data-video-suppressed={video && !videoSource ? 'true' : undefined}
        role="img"
        aria-label={alt || (slot && slot.alt) || ''}
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...copyStyle,
          ...placeholderBackground,
          ...(style || {}),
          // Own the stacking contract here instead of requiring every
          // generated caller to remember `relative z-10` on its children.
          // Without an isolated stacking context the positioned media node is
          // painted over ordinary section content once a real URL is attached.
          isolation: 'isolate',
        }}
      >
        {videoSource ? (
          <video
            {...(videoProps || {})}
            ref={videoRef}
            src={videoSource}
            poster={poster || undefined}
            data-video-playback={videoPlayback}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{
              ...((videoProps && videoProps.style) || {}),
              objectPosition: selectedFocalPoint,
              zIndex: -2,
            }}
            playsInline
            muted
            autoPlay={videoPlayback === 'autoplay'}
            loop={shouldLoopVideo}
            preload={videoPlayback === 'scroll-scrub' ? 'auto' : 'metadata'}
            aria-hidden="true"
          />
        ) : poster || imageSource ? (
          <img
            src={poster || imageSource || undefined}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: selectedFocalPoint, zIndex: -2 }}
            aria-hidden="true"
            decoding="async"
          />
        ) : null}
        {overlay && hasVisual ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: overlay, zIndex: -1 }}
          />
        ) : null}
        <MobileFocalStyle id={id} slot={slot} />
        {children}
      </div>
    )
  }

  // ── Режим inline-картинки / видео ─────────────────────────────────
  if (kind === 'video') {
    const videoSource = videoSourceForViewport({
      slot,
      desktopUrl: url,
      mobile,
      videoSuppressed,
    })
    const poster = captureSafeVisualUrl(
      posterForViewport(slot, mobile),
      captureMode,
    )
    if (!videoSource) {
      if (!poster) {
        return <PlaceholderImage alt={alt} className={className} slot={slot} />
      }
      return (
        <img
          src={poster}
          alt={alt || slot?.alt || ''}
          className={className}
          data-media-slot={id}
          data-video-suppressed="true"
          loading="lazy"
          decoding="async"
          style={style}
        />
      )
    }
    return (
      <video
        {...(videoProps || {})}
        ref={videoRef}
        src={videoSource}
        poster={poster || undefined}
        className={className}
        data-media-slot={id}
        data-media-viewport={mobile ? 'mobile' : 'desktop'}
        data-video-playback={videoPlayback}
        style={{ ...((videoProps && videoProps.style) || {}), ...(style || {}) }}
        playsInline
        muted
        autoPlay={videoPlayback === 'autoplay'}
        loop={shouldLoopVideo}
        preload={videoPlayback === 'scroll-scrub' ? 'auto' : 'metadata'}
      />
    )
  }

  if (!url) {
    return <PlaceholderImage alt={alt} className={className} slot={slot} />
  }

  const selectedUrl = captureSafeVisualUrl(
    imageSourceForViewport(slot, url, mobile),
    captureMode,
  )
  const selectedVariants = imageVariantsForViewport(slot, mobile)?.filter(
    (variant) => captureSafeVisualUrl(variant?.url, captureMode) !== null,
  )
  const selectedFocalPoint = focalPointForViewport(slot, mobile)
  const selectedWidth = mobile ? slot?.mobile_width || slot?.width : slot?.width
  const selectedHeight = mobile ? slot?.mobile_height || slot?.height : slot?.height

  // Если есть оптимизированные варианты (WebP разных ширин + JPEG-фоллбэк),
  // рендерим <picture> с <source srcset>. Браузер выберет WebP, если умеет
  // (а это сегодня все актуальные). JPEG-фоллбэк нужен только для самых
  // старых браузеров без WebP-поддержки.
  if (selectedVariants && selectedVariants.length > 0 && selectedUrl) {
    const webp = selectedVariants.filter((v) => v && v.format === 'webp' && v.url)
    const jpg = selectedVariants.find((v) => v && v.format === 'jpg' && v.url)
    const fallbackUrl = (jpg && jpg.url) || selectedUrl
    const webpSrcSet = webp
      .map((v) => `${v.url} ${v.width}w`)
      .join(', ')
    return (
      <>
        <MobileFocalStyle id={id} slot={slot} />
        {/*
          display:contents — <picture> не участвует в раскладке, поэтому
          grid/flex-item'ом остаётся сам <img> с className вызывающего кода.
          Без этого layout-классы (col-span-*, flex-1, basis-*, h-full,
          self-stretch) применялись бы к <img> ВНУТРИ бокса-обёртки и не
          работали: элементом сетки становился <picture> без col-span и
          занимал одну колонку из 12. Ветка без variants рендерит голый <img>,
          так что contents уравнивает поведение обеих веток.
          Стиль инлайновый, а не класс `contents`: не зависит от того, попал ли
          этот файл в content-glob Tailwind у конкретного лендинга.
          `data-media-slot` по той же причине висит на <img>, а не на обёртке:
          у элемента с display:contents нет бокса, и внешние потребители атрибута
          (подсветка слота в редакторе — editor-bridge.js, геометрия canvas,
          DOM-аудиты QA) остались бы без размеров.
        */}
        <picture style={{ display: 'contents' }}>
          {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} />}
          <img
            src={fallbackUrl}
            data-media-slot={id}
            alt={alt || (slot && slot.alt) || ''}
            width={selectedWidth || undefined}
            height={selectedHeight || undefined}
            loading="lazy"
            decoding="async"
            className={className}
            style={{
              objectPosition: selectedFocalPoint,
              ...(style || {}),
            }}
          />
        </picture>
      </>
    )
  }

  if (!selectedUrl) {
    return <PlaceholderImage alt={alt} className={className} slot={slot} />
  }

  return (
    <>
      <MobileFocalStyle id={id} slot={slot} />
      <img
        src={selectedUrl}
        alt={alt || (slot && slot.alt) || ''}
        data-media-slot={id}
        className={className}
        style={{
          objectPosition: selectedFocalPoint,
          ...(style || {}),
        }}
        loading="lazy"
        decoding="async"
      />
    </>
  )
}

export { MEDIA_REGISTRY }
