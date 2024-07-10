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
  --size: var(--phosphor-icon-layers-size, 1em);

  display: inline-block;
  height: var(--size);
  line-height: var(--size);
  width: var(--size);
  position: relative;

  &:deep(.phosphor-icon) {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>