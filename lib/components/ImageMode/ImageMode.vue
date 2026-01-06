<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useColorMode } from '@/composables/useColorMode'
import { useQueryObserver } from '@/composables/useQueryObserver'

const props = defineProps({
  /**
   * The default color mode to use when no matching source is found.
   */
  defaultColorMode: {
    type: String,
    default: 'light'
  },
  /**
   * The default image source URL, used as fallback when no matching color mode source exists.
   */
  src: {
    type: String
  },
  /**
   * Alternative text description of the image for accessibility.
   */
  alt: {
    type: String
  },
  /**
   * The intrinsic height of the image in pixels or CSS units.
   */
  height: {
    type: [String, Number]
  },
  /**
   * The intrinsic width of the image in pixels or CSS units.
   */
  width: {
    type: [String, Number]
  },
  /**
   * CSS classes to apply to the inner img element.
   */
  imageClass: {
    type: [String, Array, Object]
  }
})

const element = useTemplateRef<HTMLElement>('element')

const { colorMode } = useColorMode(element, props.defaultColorMode)
const { querySelectorAll } = useQueryObserver(element)
const imageModeSources = querySelectorAll('.image-mode-source')

const classList = computed(() => {
  return [`image-mode--${colorMode.value}`]
})

const sources = computed(() => {
  return imageModeSources.value.map((source: HTMLElement) => source.dataset)
})

const source = computed(() => {
  return sources.value.find((source: DOMStringMap) => source.colorMode === colorMode.value)
})

const defaultSource = computed(() => {
  return sources.value.find((source: DOMStringMap) => source.colorMode === props.defaultColorMode || !source.colorMode)
})

const src = computed(() => {
  return source.value?.src ?? defaultSource.value?.src ?? props.src
})
</script>

<template>
  <picture
    ref="element"
    :class="classList"
  >
    <slot />
    <img
      :src="src"
      :alt="alt"
      :height="height"
      :width="width"
      :class="imageClass"
    >
  </picture>
</template>
