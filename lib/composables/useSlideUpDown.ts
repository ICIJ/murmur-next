import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ComputedRef, CSSProperties, Ref } from 'vue'

import { SlideUpDownState } from '@/enums'

/**
 * Subset of CSS properties used to animate the height transition.
 */
export type SlideUpDownStyle = Pick<
  CSSProperties,
  'overflow' | 'transition-property' | 'transition-duration' | 'height'
>

/**
 * Reactive options driving the slide animation. They mirror the `active` and
 * `duration` props of the `SlideUpDown` component.
 */
export interface UseSlideUpDownOptions {
  /**
   * Whether the content is expanded. Toggling it triggers the slide.
   */
  active: Ref<boolean>
  /**
   * Duration of the height transition, in milliseconds.
   */
  duration: Ref<number>
}

/**
 * Reactive API returned by {@link useSlideUpDown}.
 */
export interface UseSlideUpDown {
  /**
   * Template ref to attach to the animated container element.
   */
  container: Ref<HTMLElement | undefined>
  /**
   * Current phase of the slide animation.
   */
  state: Ref<SlideUpDownState>
  /**
   * Whether the host component has mounted, gating the measured height so the
   * initial render can rely on `height: auto` instead of a pixel value.
   */
  mounted: Ref<boolean>
  /**
   * Inline style applied to the container for the current animation phase.
   */
  style: ComputedRef<SlideUpDownStyle>
  /**
   * Start the slide: snapshot the height, render once, then enter the active
   * phase so the CSS transition can run.
   */
  triggerSlide: () => Promise<void>
  /**
   * Settle the animation back to its resting phase, unless the transition was
   * bubbled up from an animated child element.
   */
  cleanLayout: (event: Event | null) => Promise<void> | undefined
}

/**
 * Owns the height-based open/close animation of the `SlideUpDown` component:
 * measures the container `scrollHeight`, derives the inline transition style for
 * each animation phase, and drives the phase lifecycle when `active` toggles.
 *
 * The animation runs in three phases (see {@link SlideUpDownState}): `pre`
 * locks the height to the measured value, `active` transitions it towards the
 * target height, and `post` releases the height once the transition ends.
 *
 * @param options - Reactive slide options (see {@link UseSlideUpDownOptions}).
 * @returns The {@link UseSlideUpDown} API: the `container` ref to attach to the
 *   host element, the `state`/`mounted` refs, the `style` computed for the
 *   template, and the `triggerSlide`/`cleanLayout` lifecycle handlers.
 * @example
 * import { toRef } from 'vue'
 * import { useSlideUpDown } from '@icij/murmur-next'
 *
 * const props = defineProps<{ active?: boolean, duration?: number }>()
 * const { container, style } = useSlideUpDown({
 *   active: toRef(props, 'active'),
 *   duration: toRef(props, 'duration')
 * })
 */
export function useSlideUpDown(options: UseSlideUpDownOptions): UseSlideUpDown {
  const { active, duration } = options

  const state = ref(SlideUpDownState.post)
  const mounted = ref(false)
  // NOTE: preserved latent behaviour — this ref is written by `triggerSlide`
  // but never read; the rendered height derives from `containerScrollHeight`.
  const scrollHeight = ref(0)
  const container = ref<HTMLElement | undefined>(undefined)

  const containerScrollHeight = computed((): number => {
    return container.value?.scrollHeight ?? 0
  })

  const activeHeight = computed((): number => {
    return active.value ? containerScrollHeight.value : 0
  })

  const stylePreTransition = computed((): SlideUpDownStyle => {
    return {
      'overflow': 'hidden',
      'transition-property': 'height',
      'transition-duration': `${duration.value}ms`,
      'height': mounted.value ? `${containerScrollHeight.value}px` : 0
    }
  })

  const styleActiveTransition = computed((): SlideUpDownStyle => {
    return {
      'overflow': 'hidden',
      'transition-property': 'height',
      'transition-duration': `${duration.value}ms`,
      'height': mounted.value ? `${activeHeight.value}px` : 'auto'
    }
  })

  const stylePostTransition = computed((): SlideUpDownStyle => {
    // Reset style when the element is active
    return active.value ? {} : styleActiveTransition.value
  })

  const style = computed((): SlideUpDownStyle => {
    switch (state.value) {
      case SlideUpDownState.pre:
        return stylePreTransition.value
      case SlideUpDownState.active:
        return styleActiveTransition.value
      default:
        return stylePostTransition.value
    }
  })

  async function triggerSlide(): Promise<void> {
    state.value = SlideUpDownState.pre
    scrollHeight.value = containerScrollHeight.value
    // Deferred next tick to let the component render once
    await deferredNextTick()
    state.value = SlideUpDownState.active
  }

  function cleanLayout(event: Event | null): Promise<void> | undefined {
    // This method can be triggered by animated child elements in
    // which case, we should do anything
    if (!event || event.target === container.value) {
      state.value = SlideUpDownState.post
      return deferredNextTick()
    }
  }

  // The extra macrotask before `nextTick` lets the browser commit the
  // intermediate render so the height transition actually animates.
  async function deferredNextTick(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
  }

  function onTransitionEnd(event: TransitionEvent): void {
    cleanLayout(event)
  }

  watch(active, (): Promise<void> => {
    return triggerSlide()
  })

  onMounted(async () => {
    await deferredNextTick()
    mounted.value = true
    await cleanLayout(null)
    container.value?.addEventListener('transitionend', onTransitionEnd)
  })

  onUnmounted(() => {
    container.value?.removeEventListener('transitionend', onTransitionEnd)
  })

  return { container, state, mounted, style, triggerSlide, cleanLayout }
}

export default useSlideUpDown
