<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: '1.25em'
  },
})

const style = computed(() => {
  return {
    '--phosphor-icon-layers-size': props.size
  }
})
</script>

<template>
  <span class="phosphor-icon-layers" :style="style">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.phosphor-icon-layers {
  display: inline-block;
  height: var(--phosphor-icon-size, 1em);
  line-height: var(--phosphor-icon-size, 1em);
  width: var(--phosphor-icon-size, 1em);
  position: relative;

  &:deep(.phosphor-icon) {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>