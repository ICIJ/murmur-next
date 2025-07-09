<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: 'md'
  },
})

const isRawSize = computed(() => {
  return !['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.size)
})

const style = computed(() => {
  return {
    '--phosphor-icon-layers-raw-size': isRawSize.value ? props.size : null,
    '--phosphor-icon-layers-size': isRawSize.value ? null : props.size
  }
})

const classList = computed(() => {
  return {
    [`phosphor-icon-layers--size-${props.size}`]: !isRawSize.value
  }
})
</script>

<template>
  <span class="phosphor-icon-layers" :style="style" :class="classList">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
@import '../styles/lib';
@import '../styles/mixins';

.phosphor-icon-layers {
  display: inline-block;
  position: relative;
  height: var(--phosphor-icon-raw-size, 1em);
  width: var(--phosphor-icon-raw-size, 1em);
  @include ph-icon-layers-size($ph-icon-size-scale-base);

  @each $size, $value in $ph-icon-sizes {
    &--size-#{$size} {
      @include ph-icon-layers-size($value);

      &:deep(.phosphor-icon:not(.phosphor-icon--has-size)) {
        @include ph-icon-size($value);
      }
    }
  }

  &:deep(.phosphor-icon) {
    display: inline-flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
