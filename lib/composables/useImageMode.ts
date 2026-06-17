import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

import { useColorMode } from '@/composables/useColorMode'
import { useQueryObserver } from '@/composables/useQueryObserver'

const SOURCE_SELECTOR = '.image-mode-source'

/**
 * Resolves the image source to display based on the active Bootstrap color mode.
 *
 * Internal building block for the `ImageMode` component. It observes the
 * `.image-mode-source` descendants rendered by `ImageModeSource`, tracks the
 * color mode of the closest themed ancestor, and picks the matching source URL
 * (falling back to the default-mode source, then to the provided `src`).
 *
 * Not exported from `@icij/murmur-next`: it relies on the `.image-mode-source`
 * DOM convention and is only useful inside `ImageMode`.
 *
 * @param element - Element whose color mode and source descendants are observed.
 * @param defaultColorMode - Color mode to resolve the fallback source from.
 * @param fallbackSrc - Source URL used when no matching color-mode source exists.
 * @returns Reactive `colorMode` and the resolved `src` to render.
 * @example
 * <script setup>
 * import { useImageMode } from '@/composables/useImageMode'
 *
 * const element = useTemplateRef('element')
 * const { colorMode, src } = useImageMode(element, 'light', () => props.src)
 * </script>
 */
export function useImageMode(
  element: Ref<HTMLElement | null>,
  defaultColorMode = 'light',
  fallbackSrc?: MaybeRefOrGetter<string | undefined>
) {
  const { colorMode } = useColorMode(element, defaultColorMode)
  const { querySelectorAll } = useQueryObserver(element)
  const sourceElements = querySelectorAll(SOURCE_SELECTOR)

  // Expose each source's `data-*` attributes (color mode + src) instead of the raw nodes.
  const sources = computed(() => {
    return sourceElements.value.map((source: HTMLElement) => source.dataset)
  })

  const sourceForColorMode = computed(() => {
    return sources.value.find((source: DOMStringMap) => source.colorMode === colorMode.value)
  })

  // The default source matches the default color mode, or carries no explicit color mode.
  const defaultSource = computed(() => {
    return sources.value.find((source: DOMStringMap) => source.colorMode === defaultColorMode || !source.colorMode)
  })

  const src = computed(() => {
    return sourceForColorMode.value?.src ?? defaultSource.value?.src ?? toValue(fallbackSrc)
  })

  return { colorMode, src }
}
