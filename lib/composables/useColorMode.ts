import { ref, toRef, onMounted, onUnmounted } from 'vue'

const THEME_ATTRIBUTE = 'data-bs-theme'

/**
 * Tracks the Bootstrap color mode (`data-bs-theme`) of the closest themed ancestor.
 *
 * @param element - Element to resolve the color mode from; defaults to the document body.
 * @param defaultColorMode - Color mode to fall back on when no themed ancestor exists.
 * @returns An object with a reactive `colorMode` ref that stays in sync with the ancestor's theme.
 * @example
 * <script setup>
 * import { useColorMode } from '@icij/murmur-next'
 *
 * const { colorMode } = useColorMode()
 * </script>
 */
export function useColorMode(element = window?.document?.body, defaultColorMode = 'light') {
  const elementRef = toRef(element)
  const colorMode = ref(defaultColorMode)

  const findClosestThemeElement = () => elementRef.value.closest(`[${THEME_ATTRIBUTE}]`)

  const updateColorMode = () => {
    colorMode.value = findClosestThemeElement()?.getAttribute(THEME_ATTRIBUTE) ?? defaultColorMode
  }

  let observer: MutationObserver | null = null

  onMounted(() => {
    updateColorMode()
    observer = new MutationObserver(updateColorMode)
    const themeElement = findClosestThemeElement()
    if (themeElement) {
      observer.observe(themeElement, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] })
    }
  })

  onUnmounted(() => observer && observer.disconnect())

  return { colorMode }
}
