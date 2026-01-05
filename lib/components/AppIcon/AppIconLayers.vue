<script setup lang="ts">
import { computed } from 'vue'
import type { IconSize } from '@/types'

export interface AppIconLayersProps {
  size?: IconSize | string
}

const props = withDefaults(defineProps<AppIconLayersProps>(), {
  size: 'md'
})

const isRawSize = computed(() => {
  return !['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.size)
})

const style = computed(() => {
  return {
    '--app-icon-layers-raw-size': isRawSize.value ? props.size : null,
    '--app-icon-layers-size': isRawSize.value ? null : props.size
  }
})

const classList = computed(() => {
  return {
    [`app-icon-layers--size-${props.size}`]: !isRawSize.value
  }
})
</script>

<template>
  <span
    class="app-icon-layers"
    :style="style"
    :class="classList"
  >
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import '../../styles/mixins';

.app-icon-layers {
  display: inline-block;
  position: relative;
  height: var(--app-icon-raw-size, 1em);
  width: var(--app-icon-raw-size, 1em);
  @include ph-icon-layers-size($ph-icon-size-scale-base);

  @each $size, $value in $ph-icon-sizes {
    &--size-#{$size} {
      @include ph-icon-layers-size($value);

      &:deep(.app-icon:not(.app-icon--has-size)) {
        @include ph-icon-size($value);
      }
    }
  }

  &:deep(.app-icon) {
    display: inline-flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
