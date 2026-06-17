import { defineComponent, h, ref, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { useActiveTextTruncate } from '@/composables/useActiveTextTruncate'

// Mock HTML element offset so the wrapper/text widths can be measured under
// JSDOM the same way the component spec does.
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    configurable: true,
    get() {
      return parseFloat(this.style.width) || 0
    }
  }
})

interface HostOptions {
  ppms?: number
  fadingMaxWidth?: number
  fadingMinWidth?: number
  delay?: number
  direction?: 'ltr' | 'rtl'
  wrapperWidth?: number
  textWidth?: number
}

// Mount a tiny host that reproduces the component's DOM structure so the
// composable can measure the wrapper and text elements.
function mountHost(options: HostOptions = {}) {
  const {
    ppms = 0.025,
    fadingMaxWidth = 50,
    fadingMinWidth = 0.001,
    delay = 1000,
    direction = 'ltr',
    wrapperWidth = 100,
    textWidth = 200
  } = options

  // shallowRef avoids Vue deep-unwrapping the returned computed refs, which
  // would otherwise replace each `.value` with a plain unwrapped value.
  const api = shallowRef<ReturnType<typeof useActiveTextTruncate>>()

  const Host = defineComponent({
    setup() {
      const truncate = useActiveTextTruncate(
        {
          ppms: ref(ppms),
          fadingMaxWidth: ref(fadingMaxWidth),
          fadingMinWidth: ref(fadingMinWidth),
          delay: ref(delay),
          direction: ref(direction)
        },
        () => {}
      )
      api.value = truncate
      return () =>
        h('span', { ref: truncate.resizeRef }, [
          h('span', { class: 'active-text-truncate__wrapper', style: { width: `${wrapperWidth}px` } }, [
            h('span', { class: 'active-text-truncate__wrapper__text', style: { width: `${textWidth}px` } })
          ])
        ])
    }
  })

  const wrapper = mount(Host)
  return { wrapper, api: api.value! }
}

describe('useActiveTextTruncate', () => {
  it('marks the text as fading when it overflows the wrapper', () => {
    const { api } = mountHost({ wrapperWidth: 100, textWidth: 200 })
    expect(api.isFading.value).toBe(true)
  })

  it('does not fade when the text fits within the wrapper', () => {
    const { api } = mountHost({ wrapperWidth: 200, textWidth: 100 })
    expect(api.isFading.value).toBe(false)
  })

  it('derives the final offset from the wrapper/text width difference', () => {
    const { api } = mountHost({ wrapperWidth: 100, textWidth: 200 })
    expect(api.textFinalOffset.value).toBe('-100px')
  })

  it('expresses the transition delay in milliseconds', () => {
    const { api } = mountHost({ delay: 750 })
    expect(api.textOffsetTransitionDelay.value).toBe('750ms')
  })

  it('derives the transition duration from the offset and ppms', () => {
    const { api } = mountHost({ wrapperWidth: 100, textWidth: 200, ppms: 0.1 })
    // |100 - 200| / 0.1 = 1000
    expect(api.textOffsetTransitionDuration.value).toBe('1000ms')
  })

  it('clamps the fading mask widths between min and max', () => {
    const { api } = mountHost({
      wrapperWidth: 100,
      textWidth: 200,
      fadingMinWidth: 5,
      fadingMaxWidth: 50
    })
    // At rest the live position is the LTR initial offset (0), so the left mask
    // falls back to the minimum width and the right mask saturates at the max.
    expect(api.fadingLeftWidth.value).toBe('5px')
    expect(api.fadingRightWidth.value).toBe('50px')
  })
})
