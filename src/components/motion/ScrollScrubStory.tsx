import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'

import MediaSlot from '../MediaSlot'
import { useMotionPolicy } from './MotionPolicyProvider'

export interface ScrollScrubScene {
  id: string
  accessibleLabel: string
  visualDescription: string
  content: ReactNode
}

export interface ScrollScrubStoryProps {
  mediaSlotId: string
  mediaAlt: string
  scenes: readonly ScrollScrubScene[]
  className?: string
  stageClassName?: string
  sceneClassName?: string
  persistentContent?: ReactNode
  stickyOffsetPx?: number
}

interface ScenePanelProps {
  scene: ScrollScrubScene
  index: number
  count: number
  progress: MotionValue<number>
  className?: string
}

const MIN_SCENES = 3
const MAX_SCENES = 5

function boundedStickyOffset(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.max(0, Math.min(128, Math.round(value)))
}

function validScenes(scenes: readonly ScrollScrubScene[]): boolean {
  if (scenes.length < MIN_SCENES || scenes.length > MAX_SCENES) return false
  const ids = new Set<string>()
  for (const scene of scenes) {
    const id = scene.id.trim()
    if (
      !id
      || ids.has(id)
      || !scene.accessibleLabel.trim()
      || !scene.visualDescription.trim()
    ) return false
    ids.add(id)
  }
  return true
}

function sceneStops(index: number, count: number): {
  input: number[]
  opacity: number[]
  y: number[]
} {
  const segment = 1 / count
  const start = index * segment
  const end = (index + 1) * segment
  const fade = Math.min(segment * 0.22, 0.075)
  if (index === 0) {
    return {
      input: [0, Math.max(0.001, end - fade), end],
      opacity: [1, 1, 0],
      y: [0, 0, -14],
    }
  }
  if (index === count - 1) {
    return {
      input: [start, Math.min(0.999, start + fade), 1],
      opacity: [0, 1, 1],
      y: [14, 0, 0],
    }
  }
  return {
    input: [start, start + fade, end - fade, end],
    opacity: [0, 1, 1, 0],
    y: [14, 0, 0, -14],
  }
}

function ScenePanel({
  scene,
  index,
  count,
  progress,
  className,
}: ScenePanelProps): JSX.Element {
  const stops = sceneStops(index, count)
  const opacity = useTransform(progress, stops.input, stops.opacity)
  const y = useTransform(progress, stops.input, stops.y)

  return (
    <motion.div
      aria-label={scene.accessibleLabel}
      data-scroll-scene={scene.id}
      data-scroll-visual-description={scene.visualDescription}
      data-scroll-scrub-scene={scene.id}
      data-scroll-scrub-scene-index={index}
      className={[
        'relative flex items-center',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        height: 'var(--scroll-scrub-stage-height, 100svh)',
        opacity,
        y,
      }}
    >
      {scene.content}
    </motion.div>
  )
}

function seekVideoToProgress(
  video: HTMLVideoElement | null,
  progress: number,
): void {
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
  const bounded = Math.max(0, Math.min(1, progress))
  const target = bounded * Math.max(0, video.duration - 0.04)
  if (Math.abs(video.currentTime - target) < 0.025) return
  try {
    video.pause()
    video.currentTime = target
  } catch {
    // A browser may briefly reject seeks before metadata/seekable ranges are
    // ready. The next MotionValue frame or loadedmetadata retries the same
    // deterministic target without falling back to autoplay.
  }
}

function useScrollScrubbedVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: MotionValue<number>,
  enabled: boolean,
): void {
  const latestProgress = useRef(0)
  const frame = useRef<number | null>(null)
  const scheduleSeek = useCallback((value: number) => {
    if (!enabled) return
    latestProgress.current = value
    if (frame.current !== null) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null
      seekVideoToProgress(videoRef.current, latestProgress.current)
    })
  }, [enabled, videoRef])

  useMotionValueEvent(progress, 'change', scheduleSeek)

  useEffect(() => {
    if (!enabled) return undefined
    const video = videoRef.current
    const onMetadata = () => scheduleSeek(latestProgress.current)
    video?.addEventListener('loadedmetadata', onMetadata)
    scheduleSeek(progress.get())
    return () => {
      video?.removeEventListener('loadedmetadata', onMetadata)
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
        frame.current = null
      }
    }
  }, [enabled, progress, scheduleSeek, videoRef])
}

function StaticScrollScrubStory({
  mediaSlotId,
  mediaAlt,
  scenes,
  className,
  stageClassName,
  sceneClassName,
  persistentContent,
  stickyOffsetPx,
  mobile,
  preserveDesktopGeometry,
}: ScrollScrubStoryProps & {
  mobile: boolean
  preserveDesktopGeometry: boolean
}): JSX.Element {
  if (mobile || !preserveDesktopGeometry) {
    return (
      <section
        data-motion-signature="scroll-scrub-stage"
        data-motion-mode="stacked"
        data-motion-scene-count={scenes.length}
        className={className}
      >
        <MediaSlot
          id={mediaSlotId}
          kind="video"
          as="background"
          alt={mediaAlt}
          className="min-h-[58svh]"
          videoPlayback="poster"
        />
        <div data-scroll-scrub-fallback="true">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              aria-label={scene.accessibleLabel}
            data-scroll-scene={scene.id}
            data-scroll-visual-description={scene.visualDescription}
            data-scroll-scrub-scene={scene.id}
            className={sceneClassName}
          >
              {scene.content}
            </div>
          ))}
        </div>
        {persistentContent}
      </section>
    )
  }

  const offset = boundedStickyOffset(stickyOffsetPx)
  const stageHeight = `calc(100svh - ${offset}px)`
  const sceneStackOffset = `calc(${offset}px - 100svh)`
  const sharedStyle = {
    '--scroll-scrub-stage-height': stageHeight,
  } as CSSProperties

  return (
    <section
      data-motion-signature="scroll-scrub-stage"
      data-motion-mode="stacked"
      data-motion-scene-count={scenes.length}
      className={['relative', className].filter(Boolean).join(' ')}
      style={sharedStyle}
    >
      <div
        data-scroll-stage="true"
        className={[
          'relative overflow-hidden',
          stageClassName,
        ].filter(Boolean).join(' ')}
        style={{ height: stageHeight }}
      >
        <MediaSlot
          id={mediaSlotId}
          kind="video"
          as="background"
          alt={mediaAlt}
          className="h-full w-full"
          style={{ position: 'absolute', inset: 0 }}
          videoPlayback="poster"
        />
        {persistentContent}
      </div>
      <div
        data-scroll-scrub-fallback="true"
        className="relative z-10"
        style={{ marginTop: sceneStackOffset }}
      >
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            aria-label={scene.accessibleLabel}
            data-scroll-scene={scene.id}
            data-scroll-visual-description={scene.visualDescription}
            data-scroll-scrub-scene={scene.id}
            data-scroll-scrub-scene-index={index}
            className={[
              'relative flex items-center',
              sceneClassName,
            ].filter(Boolean).join(' ')}
            style={{ height: stageHeight }}
          >
            {scene.content}
          </div>
        ))}
      </div>
    </section>
  )
}

function EnhancedScrollScrubStory(
  props: ScrollScrubStoryProps,
): JSX.Element {
  const {
    mediaSlotId,
    mediaAlt,
    scenes,
    className,
    stageClassName,
    sceneClassName,
    persistentContent,
    stickyOffsetPx,
  } = props
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end end'],
  })
  useScrollScrubbedVideo(videoRef, scrollYProgress, true)

  const offset = boundedStickyOffset(stickyOffsetPx)
  const stageHeight = `calc(100svh - ${offset}px)`
  const sceneStackOffset = `calc(${offset}px - 100svh)`
  const sharedStyle = {
    '--scroll-scrub-stage-height': stageHeight,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      data-motion-signature="scroll-scrub-stage"
      data-motion-mode="scrub"
      data-motion-scene-count={scenes.length}
      className={['relative', className].filter(Boolean).join(' ')}
      style={sharedStyle}
    >
      <div
        data-scroll-stage="true"
        className={['sticky overflow-hidden', stageClassName]
          .filter(Boolean)
          .join(' ')}
        style={{ top: offset, height: stageHeight }}
      >
        <MediaSlot
          id={mediaSlotId}
          kind="video"
          as="background"
          alt={mediaAlt}
          className="h-full w-full"
          style={{ position: 'absolute', inset: 0 }}
          videoPlayback="scroll-scrub"
          videoRef={videoRef}
        />
        {persistentContent}
        <motion.div
          aria-hidden="true"
          data-scroll-scrub-progress="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 origin-left"
          style={{
            scaleX: scrollYProgress,
            background: 'var(--color-accent, currentColor)',
          }}
        />
      </div>
      <div
        className="relative z-10"
        style={{ marginTop: sceneStackOffset }}
      >
        {scenes.map((scene, index) => (
          <ScenePanel
            key={scene.id}
            scene={scene}
            index={index}
            count={scenes.length}
            progress={scrollYProgress}
            className={sceneClassName}
          />
        ))}
      </div>
    </section>
  )
}

export function ScrollScrubStory(
  props: ScrollScrubStoryProps,
): JSX.Element {
  const policy = useMotionPolicy()
  const structurallyValid = validScenes(props.scenes)
  const scrubAuthorized =
    structurallyValid &&
    policy.signaturePattern === 'scroll-scrub-stage' &&
    policy.intensity >= 7
  const enhanced =
    scrubAuthorized && !policy.staticMotion && !policy.mobile

  if (enhanced) return <EnhancedScrollScrubStory {...props} />
  return (
    <StaticScrollScrubStory
      {...props}
      mobile={policy.mobile}
      preserveDesktopGeometry={scrubAuthorized}
    />
  )
}

export default ScrollScrubStory
