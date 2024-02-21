<script lang="ts">
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import ResizeObserver from 'resize-observer-polyfill'
import { defineComponent } from 'vue'

import { RequestAnimationFrameWrapper } from '@/utils/animation'

type ActiveTextTruncateData = { textLivePosition: number; resizeObserverKey: string | null }

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
  data(): ActiveTextTruncateData {
    return {
      textLivePosition: 0,
      // This will hold a key generated every time the component is resized.
      resizeObserverKey: null
    }
  },
  resizeObserver: null,
  computed: {
    wrapperElement(): Element | null {
      const selector = '.active-text-truncate__wrapper'
      return this.resizeObserverKey ? this.$el.querySelector(selector) : null
    },
    wrapperElementWidth(): number {
      return get(this, 'wrapperElement.offsetWidth', 0)
    },
    textElement(): Element | null {
      const selector = '.active-text-truncate__wrapper__text'
      return this.resizeObserverKey ? this.$el.querySelector(selector) : null
    },
    textElementWidth(): number {
      return get(this, 'textElement.offsetWidth', 0)
    },
    textOffsetTransitionDelay(): string {
      return `${this.delay}ms`
    },
    textOffsetTransitionDuration(): string {
      const offset = Math.abs(this.wrapperElementWidth - this.textElementWidth)
      const duration = offset / this.ppms
      return `${duration}ms`
    },
    textInitialOffset(): string {
      return '0'
    },
    textFinalOffset(): string {
      const offset = this.wrapperElementWidth - this.textElementWidth
      return `${offset}px`
    },
    textOffsetValues(): string[] {
      if (this.direction === 'ltr') {
        return [this.textInitialOffset, this.textFinalOffset]
      }
      return [this.textFinalOffset, this.textInitialOffset]
    },
    isFadingLeft(): boolean {
      return this.direction === 'rtl' && this.isFading
    },
    isFadingRight(): boolean {
      return this.direction === 'ltr' && this.isFading
    },
    isFading(): boolean {
      return this.wrapperElementWidth < this.textElementWidth
    },
    fadingLeftWidth(): string {
      const offset = this.textLivePosition
      const width = Math.min(Math.max(this.fadingMinWidth, Math.abs(offset)), this.fadingMaxWidth)
      return `${width}px`
    },
    fadingRightWidth(): string {
      const offset = parseInt(this.textFinalOffset) - this.textLivePosition
      const width = Math.min(Math.max(this.fadingMinWidth, Math.abs(offset)), this.fadingMaxWidth)
      return `${width}px`
    },
    textLivePositionRequestAnimationFrame(): RequestAnimationFrameWrapper {
      return new RequestAnimationFrameWrapper()
    }
  },
  async mounted() {
    this.$options.resizeObserver = new ResizeObserver(this.setup)
    // Bind the resize observer after the first rendering
    await this.$nextTick()
    this.$options.resizeObserver?.observe(this.$el)
  },
  beforeUnmount() {
    this.$options.resizeObserver?.unobserve(this.$el)
    this.$options.resizeObserver = null
  },
  methods: {
    setup() {
      this.resizeObserverKey = uniqueId()
      this.textLivePosition = parseInt(this.textOffsetValues[0])
      // Track transitions to update the text position in live using Request Animation Frame
      this.listenOnTextElement('transitionstart', this.startTrackingTextLivePosition)
      this.listenOnTextElement('transitionend', this.endTrackingTextLivePosition)
      this.listenOnTextElement('transitioncancel', this.resetTextLivePosition)
    },
    listenOnTextElement(name: string, func: () => void) {
      this.textElement?.removeEventListener(name, func)
      this.textElement?.addEventListener(name, func)
    },
    trackTextLivePosition(): void {
      if (!this.textElement) return
      const left = window.getComputedStyle(this.textElement, null).getPropertyValue('left')
      this.textLivePosition = parseInt(left)
    },
    startTrackingTextLivePosition(): void {
      this.textLivePositionRequestAnimationFrame.start(this.trackTextLivePosition)
      /**
       * Emitted when the animation on the text starts.
       * @event start
       */
      this.$emit('start')
    },
    endTrackingTextLivePosition(): void {
      this.textLivePositionRequestAnimationFrame.stop()
      /**
       * Emitted when the animation on the text reaches the end.
       * @event end
       */
      this.$emit('end')
    },
    resetTextLivePosition(): void {
      this.textLivePositionRequestAnimationFrame.stop()
      this.textLivePosition = parseInt(this.textOffsetValues[0])
      /**
       * Emitted when the animation on the text is cancelled.
       * @event cancel
       */
      this.$emit('cancel')
    }
  }
})
</script>

<template>
  <span
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
  --fading-left-gradient: linear-gradient(to left, black calc(100% - var(--fading-left-width)), transparent 100%);
  --fading-right-gradient: linear-gradient(to right, black calc(100% - var(--fading-right-width)), transparent 100%);
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
