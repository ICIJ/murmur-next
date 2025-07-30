<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  colorMode: {
    type: String,
    default: 'light'
  }
})

defineExpose({ ...props })
</script>

<template>
  <source
    ref="element"
    class="image-mode-source"
    :src="src"
    :data-src="src"
    :data-color-mode="colorMode"
  >
</template>
