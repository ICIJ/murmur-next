import { computed, onUnmounted, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import { useResizeObserver } from '@/composables/useResizeObserver'
import { RequestAnimationFrameWrapper } from '@/utils/animation'

/**
 * Direction the truncated text scrolls towards on hover.
 */
export type ActiveTextTruncateDirection = 'ltr' | 'rtl'

/**
 * Options driving the truncation animation. They mirror the
 * `ActiveTextTruncate` component props.
 */
export interface UseActiveTextTruncateOptions {
  /**
   * Number of pixels per millisecond for the text transition.
   */
  ppms: Ref<number>
  /**
   * Maximum width of the fading mask, in pixels.
   */
  fadingMaxWidth: Ref<number>
  /**
   * Minimum width of the fading mask, in pixels.
   */
  fadingMinWidth: Ref<number>
  /**
   * Delay before the text starts moving, in milliseconds.
   */
  delay: Ref<number>
  /**
   * Direction of the truncation animation.
   */
  direction: Ref<ActiveTextTruncateDirection>
}

/**
 * Emit signature for the animation lifecycle events.
 */
type ActiveTextTruncateEmit = (event: 'cancel' | 'end' | 'start') => void

/**
 * Reactive API returned by {@link useActiveTextTruncate}.
 */
export interface UseActiveTextTruncate {
  resizeRef: Ref<HTMLElement>
  isFading: ComputedRef<boolean>
  fadingLeftWidth: ComputedRef<string>
  fadingRightWidth: ComputedRef<string>
  textFinalOffset: ComputedRef<string>
  textOffsetTransitionDelay: ComputedRef<string>
  textOffsetTransitionDuration: ComputedRef<string>
  resetTextLivePosition: () => void
}

const WRAPPER_SELECTOR = '.active-text-truncate__wrapper'
const TEXT_SELECTOR = '.active-text-truncate__wrapper__text'

/**
 * Drives the resize-aware text truncation animation for `ActiveTextTruncate`:
 * measures the wrapper and text elements, derives the CSS custom properties
 * that animate the text offset and fading mask, and tracks the text position
 * live (via `requestAnimationFrame`) while a transition is running so the
 * fading mask can follow it.
 *
 * Reuses {@link useResizeObserver} to re-measure whenever the host element is
 * resized.
 *
 * @param options - Reactive truncation options (see {@link UseActiveTextTruncateOptions}).
 * @param emit - The component's emit function, used to raise `start`, `end` and `cancel`.
 * @returns The {@link UseActiveTextTruncate} API: `resizeRef` to attach to the
 *   host element, the derived CSS-value computeds for the template, and the
 *   `resetTextLivePosition` handler.
 * @example
 * import { toRef } from 'vue'
 * import { useActiveTextTruncate } from '@icij/murmur-next'
 *
 * const { resizeRef, isFading, resetTextLivePosition } = useActiveTextTruncate(
 *   {
 *     ppms: toRef(props, 'ppms'),
 *     fadingMaxWidth: toRef(props, 'fadingMaxWidth'),
 *     fadingMinWidth: toRef(props, 'fadingMinWidth'),
 *     delay: toRef(props, 'delay'),
 *     direction: toRef(props, 'direction')
 *   },
 *   emit
 * )
 */
export function useActiveTextTruncate(
  options: UseActiveTextTruncateOptions,
  emit: ActiveTextTruncateEmit
): UseActiveTextTruncate {
  const { ppms, fadingMaxWidth, fadingMinWidth, delay, direction } = options

  // Position of the text element (its CSS `left`) updated live during the
  // transition; the fading mask widths are derived from it.
  const textLivePosition = ref(0)
  const animationFrame = new RequestAnimationFrameWrapper()

  const { resizeRef, resizeState } = useResizeObserver()

  const wrapperElement = computed((): HTMLElement | null => {
    return resizeRef.value?.querySelector(WRAPPER_SELECTOR) ?? null
  })
  const wrapperElementWidth = computed((): number => {
    return wrapperElement.value?.offsetWidth ?? 0
  })
  const textElement = computed((): HTMLElement | null => {
    return resizeRef.value?.querySelector(TEXT_SELECTOR) ?? null
  })
  const textElementWidth = computed((): number => {
    return textElement.value?.offsetWidth ?? 0
  })

  const textOffsetTransitionDelay = computed((): string => {
    return `${delay.value}ms`
  })
  const textOffsetTransitionDuration = computed((): string => {
    const offset = Math.abs(wrapperElementWidth.value - textElementWidth.value)
    const duration = offset / ppms.value
    return `${duration}ms`
  })
  const textInitialOffset = computed((): string => {
    return '0'
  })
  const textFinalOffset = computed((): string => {
    const offset = wrapperElementWidth.value - textElementWidth.value
    return `${offset}px`
  })
  const textOffsetValues = computed((): string[] => {
    if (direction.value === 'ltr') {
      return [textInitialOffset.value, textFinalOffset.value]
    }
    return [textFinalOffset.value, textInitialOffset.value]
  })

  const isFading = computed((): boolean => {
    return wrapperElementWidth.value < textElementWidth.value
  })
  const fadingLeftWidth = computed((): string => {
    const offset = textLivePosition.value
    const width = Math.min(
      Math.max(fadingMinWidth.value, Math.abs(offset)),
      fadingMaxWidth.value
    )
    return `${width}px`
  })
  const fadingRightWidth = computed((): string => {
    const offset = parseInt(textFinalOffset.value) - textLivePosition.value
    const width = Math.min(
      Math.max(fadingMinWidth.value, Math.abs(offset)),
      fadingMaxWidth.value
    )
    return `${width}px`
  })

  // Add a listener idempotently: remove it first so repeated resizes never
  // stack duplicate listeners on the same text element.
  function listenOnTextElement(name: string, func: () => void): void {
    textElement.value?.removeEventListener(name, func)
    textElement.value?.addEventListener(name, func)
  }
  function trackTextLivePosition(): void {
    if (!textElement.value) {
      return
    }
    const left = window
      .getComputedStyle(textElement.value, null)
      .getPropertyValue('left')
    textLivePosition.value = parseInt(left)
  }
  function startTrackingTextLivePosition(): void {
    animationFrame.start(trackTextLivePosition)
    /**
     * Emitted when the animation on the text starts.
     * @event start
     */
    emit('start')
  }
  function endTrackingTextLivePosition(): void {
    animationFrame.stop()
    /**
     * Emitted when the animation on the text reaches the end.
     * @event end
     */
    emit('end')
  }
  function resetTextLivePosition(): void {
    animationFrame.stop()
    textLivePosition.value = parseInt(textOffsetValues.value[0])
    /**
     * Emitted when the animation on the text is cancelled.
     * @event cancel
     */
    emit('cancel')
  }

  // Re-measure and re-bind transition listeners whenever the element resizes.
  function onResized(): void {
    textLivePosition.value = parseInt(textOffsetValues.value[0])
    listenOnTextElement('transitionstart', startTrackingTextLivePosition)
    listenOnTextElement('transitionend', endTrackingTextLivePosition)
    listenOnTextElement('transitioncancel', resetTextLivePosition)
  }

  watch(resizeState, onResized)

  onUnmounted(() => {
    // Stop the Request Animation Frame loop so it doesn't reschedule forever.
    animationFrame.stop()
    // Remove the transition listeners added on the text element.
    textElement.value?.removeEventListener(
      'transitionstart',
      startTrackingTextLivePosition
    )
    textElement.value?.removeEventListener(
      'transitionend',
      endTrackingTextLivePosition
    )
    textElement.value?.removeEventListener(
      'transitioncancel',
      resetTextLivePosition
    )
  })

  return {
    resizeRef,
    isFading,
    fadingLeftWidth,
    fadingRightWidth,
    textFinalOffset,
    textOffsetTransitionDelay,
    textOffsetTransitionDuration,
    resetTextLivePosition
  }
}

export default useActiveTextTruncate
