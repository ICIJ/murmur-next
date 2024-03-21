<script lang="ts">
import { clamp } from 'lodash'
import { computed, defineComponent, PropType } from 'vue'

import { DeckTexture } from '@/enums'
import config from '@/config'

type TexturedDeckValue = DeckTexture | number

export default defineComponent({
  name: 'TexturedDeck',
  props: {
    /**
     * Name of the texture file ('silk', 'brick', 'rock', 'sand', 'crack', 'carbon')
     */
    modelValue: {
      type: String as PropType<TexturedDeckValue>,
      default: DeckTexture.Brick
    },
    /**
     * CSS background-size property (cover, contain, auto, 50%, 50% auto, ...)
     */
    size: {
      type: String,
      default: 'cover'
    },
    /**
     * Tag/Component to use as root tag.
     */
    tag: {
      type: [String, Object],
      default: 'div'
    },
    /**
     * Either or note we should use the black version of the texture
     */
    black: {
      type: Boolean,
      default: false
    },
    /**
     * Host where to find the textures (without tailing slash)
     */
    backgroundBaseUrl: {
      type: String,
      default: () =>
        config.get('textured-deck.background-base-url', window.location.origin)
    }
  },
  setup(props, { attrs }) {
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
    return {
      backgroundSize,
      backgroundImage,
      inheritedProps
    }
  }
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
