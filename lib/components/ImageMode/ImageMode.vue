<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useColorMode } from '@/composables/useColorMode'
import { useQueryObserver } from '@/composables/useQueryObserver'

export interface ImageModeProps {
  /**
   * The default color mode to use when no matching source is found.
   */
  defaultColorMode?: string
  /**
   * The default image source URL, used as fallback when no matching color mode source exists.
   */
  src?: string
  /**
   * Alternative text description of the image for accessibility.
   */
  alt?: string
  /**
   * The intrinsic height of the image in pixels or CSS units.
   */
  height?: string | number
  /**
   * The intrinsic width of the image in pixels or CSS units.
   */
  width?: string | number
  /**
   * CSS classes to apply to the inner img element.
   */
  imageClass?: string | string[] | Record<string, boolean>
}

const props = withDefaults(defineProps<ImageModeProps>(), {
  defaultColorMode: 'light',
  src: undefined,
  alt: undefined,
  height: undefined,
  width: undefined,
  imageClass: undefined
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
