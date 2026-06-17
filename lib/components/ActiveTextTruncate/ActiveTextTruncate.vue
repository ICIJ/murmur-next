<script setup lang="ts">
import { toRef } from 'vue'

import { useActiveTextTruncate } from '@/composables/useActiveTextTruncate'
import type { ActiveTextTruncateDirection } from '@/composables/useActiveTextTruncate'

export interface ActiveTextTruncateProps {
  /**
   * Number of Pixel Per Millisecond for the text transition.
   */
  ppms?: number
  /**
   * Maximum width of the fading mask (must be greater than 0).
   */
  fadingMaxWidth?: number
  /**
   * Minimum width of the fading mask (must be greater than 0).
   */
  fadingMinWidth?: number
  /**
   * Delay to start moving the text (in milliseconds).
   */
  delay?: number
  /**
   * Direction of the truncate ('ltr' or 'rtl').
   */
  direction?: ActiveTextTruncateDirection
}

const props = withDefaults(defineProps<ActiveTextTruncateProps>(), {
  ppms: 0.025,
  fadingMaxWidth: 50,
  fadingMinWidth: 0.001,
  delay: 1000,
  direction: 'ltr'
})

const emit = defineEmits(['cancel', 'end', 'start'])

const {
  resizeRef,
  isFading,
  fadingLeftWidth,
  fadingRightWidth,
  textFinalOffset,
  textOffsetTransitionDelay,
  textOffsetTransitionDuration,
  resetTextLivePosition
} = useActiveTextTruncate(
  {
    ppms: toRef(props, 'ppms'),
    fadingMaxWidth: toRef(props, 'fadingMaxWidth'),
    fadingMinWidth: toRef(props, 'fadingMinWidth'),
    delay: toRef(props, 'delay'),
    direction: toRef(props, 'direction')
  },
  emit
)
</script>

<template>
  <span
    ref="resizeRef"
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

@import '../../styles/mixins';

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
