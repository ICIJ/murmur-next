import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { useSlideUpDown } from '@/composables/useSlideUpDown'
import type { UseSlideUpDown } from '@/composables/useSlideUpDown'

// Mounts a host component so the composable runs inside a real setup scope
// (its `onMounted`/`onUnmounted`/`watch` hooks need a component instance).
function mountWithSlideUpDown(active = false, duration = 200) {
  const activeRef = ref(active)
  const durationRef = ref(duration)
  let api!: UseSlideUpDown

  const host = defineComponent({
    setup() {
      api = useSlideUpDown({ active: activeRef, duration: durationRef })
      return () => h('div', { ref: api.container })
    }
  })

  const wrapper = mount(host)
  return { wrapper, api, activeRef, durationRef }
}

describe('useSlideUpDown', () => {
  it('starts in the post state', () => {
    const { api } = mountWithSlideUpDown()
    expect(api.state.value).toBe('post')
  })

  it('reports `height: auto` while inactive and before the host has mounted', () => {
    const { api } = mountWithSlideUpDown(false)
    expect(api.style.value.height).toBe('auto')
  })

  it('enters the pre phase synchronously when triggerSlide is called', () => {
    const { api } = mountWithSlideUpDown()
    api.triggerSlide()
    expect(api.state.value).toBe('pre')
  })

  it('reaches the active phase after triggerSlide resolves', async () => {
    const { api } = mountWithSlideUpDown()
    await api.triggerSlide()
    expect(api.state.value).toBe('active')
  })

  it('settles back to post when cleanLayout is called with no event', async () => {
    const { api } = mountWithSlideUpDown()
    await api.triggerSlide()
    expect(api.state.value).toBe('active')
    await api.cleanLayout(null)
    expect(api.state.value).toBe('post')
  })

  it('ignores transitionend events bubbled from child elements', async () => {
    const { api } = mountWithSlideUpDown()
    await api.triggerSlide()
    const childEvent = { target: document.createElement('span') } as unknown as Event
    await api.cleanLayout(childEvent)
    // State is unchanged because the event did not target the container.
    expect(api.state.value).toBe('active')
  })

  it('triggers the slide when the active option toggles', async () => {
    const { api, activeRef } = mountWithSlideUpDown(false)
    activeRef.value = true
    await nextTick()
    expect(api.state.value).toBe('pre')
  })
})
