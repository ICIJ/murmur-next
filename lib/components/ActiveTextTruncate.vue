<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import useResizeObserver from '@/composables/resizeObserver'
import { RequestAnimationFrameWrapper } from '@/utils/animation'

type ActiveTextTruncateData = {
  textLivePosition: number
  resizeObserverKey: string | null
}

export default defineComponent({
  name: 'ActiveTextTruncate',
  props: {
    /**
     * Number of Pixel Per Millisecond for the text transition.
     */
    ppms: {
      type: Number,
      default: 0.025
    },
    /**
     * Maximum width of the fading mask.
     */
    fadingMaxWidth: {
      type: Number,
      default: 50,
      validator: (value: number) => value > 0
    },
    /**
     * Minimum width of the fading mask.
     */
    fadingMinWidth: {
      type: Number,
      default: 0.001,
      validator: (value: number) => value > 0
    },
    /**
     * Delay to start moving the text (in milliseconds).
     */
    delay: {
      type: Number,
      default: 1000
    },
    /**
     * Direction of the truncate
     */
    direction: {
      type: String,
      default: 'ltr',
      validator: (value: string) => ['ltr', 'rtl'].indexOf(value) > -1
    }
  },
  emits: ['cancel', 'end', 'start'],
  setup(props, { emit }) {
    const el = ref(null)
    const textLivePosition = ref(0)
    // This will hold a key generated every time the component is resized.
    const { resizeRef, resizeState } = useResizeObserver(el)
    watch(resizeState, () => {
      onResized()
    })

    const wrapperElement = computed((): HTMLElement | null => {
      const selector = '.active-text-truncate__wrapper'
      return resizeRef.value?.querySelector(selector) ?? null
    })
    const wrapperElementWidth = computed((): number => {
      return wrapperElement.value?.offsetWidth ?? 0
    })
    const textElement = computed((): HTMLElement | null => {
      const selector = '.active-text-truncate__wrapper__text'
      return resizeRef.value?.querySelector(selector) ?? null
    })
    const textElementWidth = computed((): number => {
      return textElement.value?.offsetWidth ?? 0
    })
    const textOffsetTransitionDelay = computed((): string => {
      return `${props.delay}ms`
    })
    const textOffsetTransitionDuration = computed((): string => {
      const offset = Math.abs(
        wrapperElementWidth.value - textElementWidth.value
      )
      const duration = offset / props.ppms
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
      if (props.direction === 'ltr') {
        return [textInitialOffset.value, textFinalOffset.value]
      }
      return [textFinalOffset.value, textInitialOffset.value]
    })
    const isFadingLeft = computed((): boolean => {
      return props.direction === 'rtl' && isFading.value
    })
    const isFadingRight = computed((): boolean => {
      return props.direction === 'ltr' && isFading.value
    })
    const isFading = computed((): boolean => {
      return wrapperElementWidth.value < textElementWidth.value
    })
    const fadingLeftWidth = computed((): string => {
      const offset = textLivePosition.value
      const width = Math.min(
        Math.max(props.fadingMinWidth, Math.abs(offset)),
        props.fadingMaxWidth
      )
      return `${width}px`
    })
    const fadingRightWidth = computed((): string => {
      const offset = parseInt(textFinalOffset.value) - textLivePosition.value
      const width = Math.min(
        Math.max(props.fadingMinWidth, Math.abs(offset)),
        props.fadingMaxWidth
      )
      return `${width}px`
    })
    const textLivePositionRequestAnimationFrame = computed(
      (): RequestAnimationFrameWrapper => {
        return new RequestAnimationFrameWrapper()
      }
    )

    function onResized() {
      textLivePosition.value = parseInt(textOffsetValues.value[0])
      // Track transitions to update the text position in live using Request Animation Frame
      listenOnTextElement('transitionstart', startTrackingTextLivePosition)
      listenOnTextElement('transitionend', endTrackingTextLivePosition)
      listenOnTextElement('transitioncancel', resetTextLivePosition)
    }
    function listenOnTextElement(name: string, func: () => void) {
      textElement.value?.removeEventListener(name, func)
      textElement.value?.addEventListener(name, func)
    }
    function trackTextLivePosition(): void {
      if (!textElement.value) return
      const left = window
        .getComputedStyle(textElement.value, null)
        .getPropertyValue('left')
      textLivePosition.value = parseInt(left)
    }
    function startTrackingTextLivePosition(): void {
      textLivePositionRequestAnimationFrame.value.start(trackTextLivePosition)
      /**
       * Emitted when the animation on the text starts.
       * @event start
       */
      emit('start')
    }
    function endTrackingTextLivePosition(): void {
      textLivePositionRequestAnimationFrame.value.stop()
      /**
       * Emitted when the animation on the text reaches the end.
       * @event end
       */
      emit('end')
    }
    function resetTextLivePosition(): void {
      textLivePositionRequestAnimationFrame.value.stop()
      textLivePosition.value = parseInt(textOffsetValues.value[0])
      /**
       * Emitted when the animation on the text is cancelled.
       * @event cancel
       */
      emit('cancel')
    }
    return {
      el,
      isFading,
      fadingLeftWidth,
      fadingRightWidth,
      textOffsetTransitionDuration,
      textOffsetTransitionDelay,
      textFinalOffset,
      resetTextLivePosition
    }
  }
})
</script>

<template>
  <span
    ref="el"
    class="active-text-truncate"
    :class="{
      'active-text-truncate--fading': isFading,
      [`active-text-truncate--${direction}`]: true
    }"
    :style="{
      '--fading-left-width': fadingLeftWidth,
      '--fading-right-width': fadingRightWidth,
      '--text-offset-transition-duration': textOffsetTransitionDuration,
      '--text-offset-transition-delay': textOffsetTransitionDelay,
      '--text-final-offset': textFinalOffset
    }"
    @mouseleave="resetTextLivePosition"
  >
    <span class="active-text-truncate__wrapper">
      <span class="active-text-truncate__wrapper__text">
        <slot />
      </span>
    </span>
  </span>
</template>

<style lang="scss" scoped>
@import '../styles/lib';
@import '../styles/mixins';

.active-text-truncate {
  --fading-left-width: 0;
  --fading-right-width: 0;
  --fading-left-gradient: linear-gradient(
    to left,
    black calc(100% - var(--fading-left-width)),
    transparent 100%
  );
  --fading-right-gradient: linear-gradient(
    to right,
    black calc(100% - var(--fading-right-width)),
    transparent 100%
  );
  --text-offset-transition-duration: 0ms;
  --text-offset-transition-delay: 0ms;
  --text-final-offset: 0;

  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  position: relative;

  &:after {
    content: attr(data-text-live-position);
    position: absolute;
    left: 0;
    top: 0;
  }

  &__wrapper {
    width: 100%;
    display: inline-block;

    .active-text-truncate--fading & {
      mask: var(--fading-right-gradient), var(--fading-left-gradient);
      mask-composite: intersect;
    }

    .active-text-truncate--rtl.active-text-truncate--fading &:hover &__text,
    .active-text-truncate--ltr.active-text-truncate--fading &:hover &__text {
      transition: linear left var(--text-offset-transition-duration);
      transition-delay: var(--text-offset-transition-delay);
    }

    .active-text-truncate--ltr.active-text-truncate--fading &:hover &__text {
      left: var(--text-final-offset);
    }

    .active-text-truncate--rtl.active-text-truncate--fading &:hover &__text {
      left: 0;
    }

    &__text {
      white-space: nowrap;
      position: relative;
      left: 0;

      .active-text-truncate--rtl & {
        left: var(--text-final-offset);
      }
    }
  }
}
</style>
