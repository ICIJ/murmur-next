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
import { computed, ref, watch, type Component } from 'vue'
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

const currentHover = ref(false)
watch(() => props.hover, () => (currentHover.value = props.hover), { immediate: true })

const color = computed(() => {
  let colorVariant = 'currentColor'

  if (props.variant) {
    colorVariant = `var(--bs-${props.variant}, currentColor)`
  }

  if (currentHover.value && props.hoverVariant) {
    colorVariant = `var(--bs-${props.hoverVariant}, ${colorVariant})`
  }

  return colorVariant
})

const isRawSize = computed(() => {
  return !['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', undefined].includes(props.size)
})

const hasSize = computed(() => {
  return ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.size ?? '')
})

const style = computed(() => {
  return {
    '--app-icon-color': color.value,
    '--app-icon-raw-size': isRawSize.value ? props.size : undefined,
    '--app-icon-size': hasSize.value ? props.size : undefined,
    '--app-icon-scale': props.scale ?? 1,
    '--app-icon-spin-duration': props.spinDuration,
    '--app-icon-beat-duration': props.beatDuration,
    '--app-icon-fade-duration': props.fadeDuration,
  }
})

const classList = computed(() => {
  return {
    [`app-icon--size-${props.size}`]: hasSize.value,
    [`app-icon--has-size`]: hasSize.value,
    [`app-icon--raw-size`]: isRawSize.value,
    [`app-icon--hover`]: currentHover.value,
    [`app-icon--spin`]: props.spin,
    [`app-icon--spin-reverse`]: props.spinReverse,
    [`app-icon--beat`]: props.beat,
    [`app-icon--fade`]: props.fade,
  }
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
