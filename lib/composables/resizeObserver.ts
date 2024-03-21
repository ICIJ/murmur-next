import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { Ref, nextTick } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'

export const useResizeObserver = (resizableRef?: Ref) => {
  const resizeRef: Ref<HTMLElement> = resizableRef ?? ref()
  const resizeState = reactive({
    dimensions: {} as DOMRect,
    offsetWidth: 540,
    narrowWidth: false
  })

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect
      resizeState.offsetWidth = (entry.target as HTMLElement).offsetWidth
      resizeState.narrowWidth = (resizeState.offsetWidth ?? 540) < 540
    })
  })

  onMounted(async () => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.dimensions = resizeRef.value.getBoundingClientRect()
    resizeState.offsetWidth = resizeRef.value.offsetWidth
    resizeState.narrowWidth = false // TODO CD: old default is false but maybe this would work (resizeState.offsetWidth ?? 540) < 540 but would be often true

    observer.observe(resizeRef.value)
  })

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value)
  })

  return { resizeState, resizeRef }
}

export default useResizeObserver
