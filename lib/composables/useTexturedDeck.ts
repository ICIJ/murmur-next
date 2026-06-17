import { clamp } from 'lodash'
import { computed, toValue } from 'vue'
import type { ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'

import { DeckTexture } from '@/enums'

/**
 * Value selecting a texture: either a {@link DeckTexture} name or the numeric
 * index of a texture in the {@link DeckTexture} enumeration order.
 */
export type TexturedDeckValue = DeckTexture | number

/**
 * Reactive inputs driving the textured background. They mirror the
 * `modelValue`, `size`, `black`, and `backgroundBaseUrl` props of the
 * `TexturedDeck` component.
 */
export interface UseTexturedDeckOptions {
  /**
   * Texture name or numeric index selecting which texture to display.
   */
  modelValue: MaybeRefOrGetter<TexturedDeckValue>
  /**
   * CSS `background-size` value (cover, contain, auto, 50%, 50% auto, ...).
   */
  size: MaybeRefOrGetter<string>
  /**
   * Whether to use the black variant of the texture file.
   */
  black: MaybeRefOrGetter<boolean>
  /**
   * Host where the textures are served from (without trailing slash).
   */
  backgroundBaseUrl: MaybeRefOrGetter<string>
}

/**
 * Reactive API returned by {@link useTexturedDeck}.
 */
export interface UseTexturedDeck {
  /**
   * Name of the resolved texture (one of the {@link DeckTexture} values).
   */
  textureName: ComputedRef<DeckTexture>
  /**
   * Texture file name derived from the texture name and the black variant.
   */
  filename: ComputedRef<string>
  /**
   * Absolute URL of the texture image, combining the base URL and file name.
   */
  backgroundUrl: ComputedRef<string>
  /**
   * Inline style applying the resolved texture as the background image and
   * propagating the requested background size.
   */
  style: ComputedRef<CSSProperties>
}

/**
 * Derives the background image of the `TexturedDeck` component from a texture
 * selection: resolves the texture name (accepting either a name or a numeric
 * index clamped to the available textures), builds the texture file name and
 * its absolute URL, and exposes the inline style to apply on the host element.
 *
 * @param options - Reactive texture options (see {@link UseTexturedDeckOptions}).
 * @returns The {@link UseTexturedDeck} API: the resolved `textureName`, the
 *   `filename`, the absolute `backgroundUrl`, and the `style` computed for the
 *   template.
 * @example
 * // Internal building block of the `TexturedDeck` component; not exported from
 * // the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useTexturedDeck } from '@/composables/useTexturedDeck'
 *
 * const props = defineProps<{
 *   modelValue?: string | number
 *   size?: string
 *   black?: boolean
 *   backgroundBaseUrl?: string
 * }>()
 * const { style } = useTexturedDeck({
 *   modelValue: toRef(props, 'modelValue'),
 *   size: toRef(props, 'size'),
 *   black: toRef(props, 'black'),
 *   backgroundBaseUrl: toRef(props, 'backgroundBaseUrl')
 * })
 */
export function useTexturedDeck(options: UseTexturedDeckOptions): UseTexturedDeck {
  const { modelValue, size, black, backgroundBaseUrl } = options

  const textureNames = computed((): DeckTexture[] => {
    return Object.values(DeckTexture)
  })

  // A texture can be selected by name or by numeric index. A name is mapped
  // back to its index and clamped so an unknown name falls back to a valid
  // texture. A numeric index is used as-is and is intentionally NOT clamped,
  // so an out-of-range number yields an undefined texture name (latent edge
  // preserved).
  const textureIndex = computed((): number => {
    const value = toValue(modelValue)
    if (typeof value !== 'number') {
      return clamp(
        textureNames.value.indexOf(value),
        0,
        textureNames.value.length - 1
      )
    }
    return value
  })

  const textureName = computed((): DeckTexture => {
    return textureNames.value[textureIndex.value]
  })

  const filename = computed((): string => {
    if (toValue(black)) {
      return `texture-${textureName.value}-black.jpg`
    }
    return `texture-${textureName.value}.jpg`
  })

  const backgroundUrl = computed((): string => {
    return `${toValue(backgroundBaseUrl)}/assets/img/${filename.value}`
  })

  const style = computed((): CSSProperties => {
    return {
      backgroundSize: toValue(size),
      backgroundImage: `url("${backgroundUrl.value}")`
    }
  })

  return { textureName, filename, backgroundUrl, style }
}

export default useTexturedDeck
