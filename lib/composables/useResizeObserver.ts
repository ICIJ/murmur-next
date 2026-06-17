import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { Ref } from 'vue'
import debounce from 'lodash/debounce'
import ResizeObserver from 'resize-observer-polyfill'

// Coalesce resize bursts (e.g. a window/pane drag fires dozens per second) so
// consumers only redraw once the dimensions settle, rather than every frame.
const RESIZE_DEBOUNCE_MS = 100

const NARROW_WIDTH_THRESHOLD = 540

/**
 * Observes an element's size and exposes reactive, debounced dimensions.
 *
 * @param resizableRef - Optional ref to the observed element; when omitted, a fresh ref is created and returned as `resizeRef`.
 * @returns An object with `resizeRef` (attach to the element) and reactive `resizeState` holding `dimensions`, `offsetWidth`, and `narrowWidth`.
 * @example
 * <script setup>
 * import { useResizeObserver } from '@icij/murmur-next'
 *
 * const { resizeRef, resizeState } = useResizeObserver()
 * </script>
 *
 * <template>
 *   <div ref="resizeRef">{{ resizeState.offsetWidth }}px</div>
 * </template>
 */
export function useResizeObserver(resizableRef?: Ref) {
  const resizeRef: Ref<HTMLElement> = resizableRef ?? ref()
  const resizeState = reactive({
    dimensions: {} as DOMRect,
    offsetWidth: NARROW_WIDTH_THRESHOLD,
    narrowWidth: false
  })

  const onResize = debounce((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect
      resizeState.offsetWidth = (entry.target as HTMLElement).offsetWidth
      resizeState.narrowWidth = (resizeState.offsetWidth ?? NARROW_WIDTH_THRESHOLD) < NARROW_WIDTH_THRESHOLD
    })
  }, RESIZE_DEBOUNCE_MS)

  const observer = new ResizeObserver(onResize)

  onMounted(async () => {
    if (resizeRef.value) {
      // set initial dimensions right before observing: Element.getBoundingClientRect()
      resizeState.dimensions = resizeRef.value.getBoundingClientRect()
      resizeState.offsetWidth = resizeRef.value.offsetWidth
      resizeState.narrowWidth = false // TODO CD: old default is false but maybe this would work (resizeState.offsetWidth ?? 540) < 540 but would be often true

      observer.observe(resizeRef.value)
    }
  })

  onBeforeUnmount(() => {
    // Drop any pending trailing call so it can't fire after teardown, then stop
    // observing every element (disconnect covers unobserve).
    onResize.cancel()
    observer.disconnect()
  })

  return { resizeState, resizeRef }
}
