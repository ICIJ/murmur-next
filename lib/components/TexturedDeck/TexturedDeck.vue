<script setup lang="ts">
import { clamp } from 'lodash'
import { computed, useAttrs } from 'vue'

import { DeckTexture } from '@/enums'
import config from '@/config'

defineOptions({
  name: 'TexturedDeck'
})

type TexturedDeckValue = DeckTexture | number

export interface TexturedDeckProps {
  /**
   * Name of the texture file ('silk', 'brick', 'rock', 'sand', 'crack', 'carbon')
   */
  modelValue?: TexturedDeckValue
  /**
   * CSS background-size property (cover, contain, auto, 50%, 50% auto, ...)
   */
  size?: string
  /**
   * Tag/Component to use as root tag.
   */
  tag?: string | object
  /**
   * Either or note we should use the black version of the texture
   */
  black?: boolean
  /**
   * Host where to find the textures (without tailing slash)
   */
  backgroundBaseUrl?: string
}

const props = withDefaults(defineProps<TexturedDeckProps>(), {
  modelValue: DeckTexture.Brick,
  size: 'cover',
  tag: 'div',
  black: false,
  backgroundBaseUrl: () => config.get('textured-deck.background-base-url', window.location.origin)
})

const attrs = useAttrs()

const names = computed((): DeckTexture[] => {
  return Object.values(DeckTexture)
})

const textureIndex = computed((): number => {
  if (typeof props.modelValue !== 'number') {
    return clamp(
      names.value.indexOf(props.modelValue),
      0,
      names.value.length - 1
    )
  }
  return props.modelValue
})

const textureName = computed((): string => {
  return names.value[textureIndex.value]
})

const filename = computed((): string => {
  if (props.black) {
    return `texture-${textureName.value}-black.jpg`
  }
  return `texture-${textureName.value}.jpg`
})

const backgroundUrl = computed((): string => {
  return `${props.backgroundBaseUrl}/assets/img/${filename.value}`
})

const backgroundSize = computed((): string => {
  return props.size
})

const backgroundImage = computed((): string => {
  return `url("${backgroundUrl.value}")`
})

const inheritedProps = computed((): object => {
  return { ...attrs, ...props, tag: undefined }
})
</script>

<template>
  <component
    :is="tag"
    :style="{ backgroundSize, backgroundImage }"
    v-bind="inheritedProps"
    class="textured-deck"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.textured-deck {
  background: #000 no-repeat center center;
  background-size: cover;
  color: #fff;
}
</style>
