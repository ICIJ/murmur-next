<script setup lang="ts">
export interface ImageModeSourceProps {
  /**
   * The image source URL for this color mode variant.
   */
  src: string
  /**
   * The color mode this source should be displayed for (e.g., 'light' or 'dark').
   */
  colorMode?: string
}

const props = withDefaults(defineProps<ImageModeSourceProps>(), {
  colorMode: 'light'
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
