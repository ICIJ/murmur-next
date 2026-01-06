<script setup>
const props = defineProps({
  /**
   * The image source URL for this color mode variant.
   */
  src: {
    type: String,
    required: true
  },
  /**
   * The color mode this source should be displayed for (e.g., 'light' or 'dark').
   */
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
