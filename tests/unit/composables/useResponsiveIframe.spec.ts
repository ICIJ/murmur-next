import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Stub the asset loader so the Pym parent bundle is never actually fetched and
// `onMounted` can resolve synchronously inside the tests.
vi.mock('@/utils/assets', () => ({
  injectAssets: vi.fn(() => Promise.resolve())
}))

import { injectAssets } from '@/utils/assets'
import { useResponsiveIframe } from '@/composables/useResponsiveIframe'
import type { UseResponsiveIframe } from '@/composables/useResponsiveIframe'

// Records the Pym parent constructor calls and exposes a `remove` spy so the
// teardown behaviour can be asserted.
const removeSpy = vi.fn()
const parentSpy = vi.fn()

// Mounts a host component so the composable runs inside a real setup scope
// (its `onMounted`/`onUnmounted` hooks need a component instance).
function mountWithResponsiveIframe(
  url = 'https://projects.icij.org/the-implant-files/graphics/',
  options?: object
) {
  let api!: UseResponsiveIframe

  const host = defineComponent({
    setup() {
      api = useResponsiveIframe({ url: () => url, options: () => options })
      return () => h('div', { id: api.iframeId.value })
    }
  })

  const wrapper = mount(host)
  return { wrapper, api }
}

describe('useResponsiveIframe', () => {
  beforeEach(() => {
    removeSpy.mockClear()
    parentSpy.mockClear()
    vi.mocked(injectAssets).mockClear()
    window.pym = {
      Parent: vi.fn((id: string, url: string, options: object) => {
        parentSpy(id, url, options)
        return { remove: removeSpy } as never
      }) as never
    }
  })

  afterEach(() => {
    delete (window as { pym?: unknown }).pym
  })

  it('generates an id prefixed with icij-iframe-', () => {
    const { api } = mountWithResponsiveIframe()
    expect(api.iframeId.value).toMatch(/^icij-iframe-/)
  })

  it('gives each instance a unique id', () => {
    const first = mountWithResponsiveIframe()
    const second = mountWithResponsiveIframe()
    expect(first.api.iframeId.value).not.toBe(second.api.iframeId.value)
  })

  it('loads the Pym parent bundle on mount', async () => {
    mountWithResponsiveIframe()
    await nextTick()
    expect(injectAssets).toHaveBeenCalledWith('https://pym.nprapps.org/pym.v1.min.js')
  })

  it('creates the Pym parent with the id, url and options on mount', async () => {
    const customOptions = { title: 'Implant Files' }
    const { api } = mountWithResponsiveIframe('https://example.org/embed', customOptions)
    await nextTick()
    expect(parentSpy).toHaveBeenCalledWith(api.iframeId.value, 'https://example.org/embed', customOptions)
    expect(api.pymParent.value).not.toBeNull()
  })

  it('defaults the Pym parent options to an empty object', async () => {
    const { api } = mountWithResponsiveIframe('https://example.org/embed')
    await nextTick()
    expect(parentSpy).toHaveBeenCalledWith(api.iframeId.value, 'https://example.org/embed', {})
  })

  it('removes the Pym parent on unmount', async () => {
    const { wrapper } = mountWithResponsiveIframe()
    await nextTick()
    wrapper.unmount()
    expect(removeSpy).toHaveBeenCalledTimes(1)
  })
})
