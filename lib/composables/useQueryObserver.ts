import { computed, onScopeDispose, reactive, toRef, watch } from 'vue'
import { first, get } from 'lodash'

type ElementMap = Record<string, HTMLElement[]>
type ObserverMap = Record<string, MutationObserver>

/**
 * Reactively tracks DOM elements matching CSS selectors via `MutationObserver`.
 *
 * @param root - Root node whose subtree is observed; defaults to `window.document`.
 * @param once - When `true`, stops observing a selector as soon as it matches at least one element.
 * @returns An object with `querySelector` (first match) and `querySelectorAll` (all matches), both returning reactive computed refs.
 * @example
 * <script setup>
 * import { useQueryObserver } from '@icij/murmur-next'
 *
 * const { querySelector, querySelectorAll } = useQueryObserver()
 * const heading = querySelector('h1')
 * const links = querySelectorAll('a')
 * </script>
 */
export function useQueryObserver(root = window.document, once = false) {
  const rootRef = toRef<Document | null>(root)
  const elements = reactive<ElementMap>({})
  const observers = reactive<ObserverMap>({})

  const hasElements = (selector: string) => {
    return get(elements, [selector, 'length'], 0) > 0
  }

  const hasObserver = (selector: string) => {
    return selector in observers
  }

  const updateElements = (selector: string) => {
    if (rootRef.value) {
      elements[selector] = Array.from(rootRef.value.querySelectorAll(selector))
    }
    return elements[selector] ?? null
  }

  const observerCallback = (selector: string) => {
    return () => {
      updateElements(selector)
      if (once && hasElements(selector)) {
        observers[selector].disconnect()
      }
    }
  }

  const observe = (selector: string) => {
    updateElements(selector)
    // Create the observer once, even if the rootRef doesn't exist yet
    if (!hasObserver(selector)) {
      observers[selector] = new MutationObserver(observerCallback(selector))
    }
    // Wait for the root ref to exist and only create the observer once by selector
    if (rootRef.value && rootRef.value instanceof Node) {
      observers[selector].disconnect()
      observers[selector].observe(rootRef.value, { childList: true, subtree: true })
    }
    return observers[selector]
  }

  const querySelector = (selector: string, options = { immediate: true }) => {
    const elements = querySelectorAll(selector, options)
    return computed(() => first(elements.value))
  }

  const querySelectorAll = (selector: string, options = { immediate: true }) => {
    watch(rootRef, () => observe(selector), options)
    return computed(() => get(elements, selector, []))
  }

  onScopeDispose(() => {
    for (const selector in observers) {
      observers[selector].disconnect()
    }
  })

  return {
    querySelector,
    querySelectorAll
  }
}
