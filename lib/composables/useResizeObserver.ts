import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { Ref } from 'vue'
import debounce from 'lodash/debounce'
import ResizeObserver from 'resize-observer-polyfill'

// Coalesce resize bursts (e.g. a window/pane drag fires dozens per second) so
// consumers only redraw once the dimensions settle, rather than every frame.
const RESIZE_DEBOUNCE_MS = 100

export function useResizeObserver(resizableRef?: Ref) {
  const resizeRef: Ref<HTMLElement> = resizableRef ?? ref()
  const resizeState = reactive({
    dimensions: {} as DOMRect,
    offsetWidth: 540,
    narrowWidth: false
  })

  const observer = new ResizeObserver(
    debounce((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => {
        resizeState.dimensions = entry.contentRect
        resizeState.offsetWidth = (entry.target as HTMLElement).offsetWidth
        resizeState.narrowWidth = (resizeState.offsetWidth ?? 540) < 540
      })
    }, RESIZE_DEBOUNCE_MS)
  )

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
    if (resizeRef.value) {
      observer.unobserve(resizeRef.value)
    }
    observer.disconnect()
  })

  return { resizeState, resizeRef }
}
