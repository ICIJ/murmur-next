<template>
  <span
    class="app-icon"
    :class="classList"
    :style="style"
    @mouseenter="currentHover = true"
    @mouseleave="currentHover = hover ?? false"
  >
    <component
      :is="name"
      v-if="name"
    />
    <slot v-else />
  </span>
</template>

<script setup lang="ts">
import { toRef, type Component } from 'vue'

import { useAppIcon } from '@/composables/useAppIcon'
import type { IconSize, TextColorVariant } from '@/types'

export interface AppIconProps {
  /**
   * Icon component or registered component name to render.
   */
  name?: string | Component
  /**
   * Size of the icon. Can be a preset ('2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl') or a CSS value.
   */
  size?: IconSize | string
  /**
   * Scale factor to apply to the icon size.
   */
  scale?: number
  /**
   * Bootstrap color variant for the icon.
   */
  variant?: TextColorVariant
  /**
   * Bootstrap color variant to apply on hover.
   */
  hoverVariant?: TextColorVariant
  /**
   * Enable pulsing beat animation.
   */
  beat?: boolean
  /**
   * Duration of the beat animation.
   */
  beatDuration?: string
  /**
   * Enable fade in/out animation.
   */
  fade?: boolean
  /**
   * Duration of the fade animation.
   */
  fadeDuration?: string
  /**
   * Enable spinning animation.
   */
  spin?: boolean
  /**
   * Reverse the direction of the spin animation.
   */
  spinReverse?: boolean
  /**
   * Duration of the spin animation.
   */
  spinDuration?: string
  /**
   * Set the icon to its hover state.
   */
  hover?: boolean
}

const props = withDefaults(defineProps<AppIconProps>(), {
  scale: 1,
  beatDuration: '1s',
  fadeDuration: '1s',
  spinDuration: '1s'
})

// Size classification, color resolution and hover tracking live in useAppIcon.
const { currentHover, style, classList } = useAppIcon({
  size: toRef(props, 'size'),
  scale: toRef(props, 'scale'),
  variant: toRef(props, 'variant'),
  hoverVariant: toRef(props, 'hoverVariant'),
  hover: toRef(props, 'hover'),
  spinDuration: toRef(props, 'spinDuration'),
  beatDuration: toRef(props, 'beatDuration'),
  fadeDuration: toRef(props, 'fadeDuration'),
  spin: toRef(props, 'spin'),
  spinReverse: toRef(props, 'spinReverse'),
  beat: toRef(props, 'beat'),
  fade: toRef(props, 'fade')
})
</script>

<style lang="scss" scoped>
@import '../../styles/mixins';

@keyframes app-icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes app-icon-spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes app-icon-beat {
  0%, 100% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
}

@keyframes app-icon-fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-icon-color, currentColor);
  @include app-icon-size($app-icon-size-scale-base, var(--app-icon-scale, 1));

  @each $size, $value in $app-icon-sizes {
    &--size-#{$size} {
      @include app-icon-size($value, var(--app-icon-scale));
    }
  }

  &--raw-size {
    font-size: var(--app-icon-raw-size);
  }

  &--percent-size {
    width: var(--app-icon-percent-size);
    height: auto;

    :deep(svg) {
      width: 100%;
      height: auto;
    }
  }

  &--spin :deep(svg) {
    animation: app-icon-spin var(--app-icon-spin-duration, 1s) linear infinite;
  }

  &--spin-reverse :deep(svg) {
    animation: app-icon-spin-reverse var(--app-icon-spin-duration, 1s) linear infinite;
  }

  &--beat :deep(svg) {
    animation: app-icon-beat var(--app-icon-beat-duration, 1s) ease-in-out infinite;
  }

  &--fade :deep(svg) {
    animation: app-icon-fade var(--app-icon-fade-duration, 1s) ease-in-out infinite;
  }
}
</style>
