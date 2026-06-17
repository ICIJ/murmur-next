import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Stub the iframe resizer so no Pym asset is fetched and the mount-time side
// effect can be asserted in isolation.
const createSpy = vi.fn()
vi.mock('@/utils/iframe-resizer', () => ({
  default: { create: () => createSpy() }
}))

import { useEmbeddableFooter } from '@/composables/useEmbeddableFooter'
import type { UseEmbeddableFooter } from '@/composables/useEmbeddableFooter'

// Mounts a host component so the composable runs inside a real setup scope (its
// `onMounted` hook needs a component instance).
function mountWithEmbeddableFooter() {
  let api!: UseEmbeddableFooter

  const host = defineComponent({
    setup() {
      api = useEmbeddableFooter()
      return () => h('div')
    }
  })

  const wrapper = mount(host)
  return { wrapper, api }
}

describe('useEmbeddableFooter', () => {
  beforeEach(() => {
    createSpy.mockClear()
  })

  it('starts with the sharing-options panel hidden', () => {
    const { api } = mountWithEmbeddableFooter()
    expect(api.showShareOptions.value).toBe(false)
  })

  it('toggles the sharing-options panel visibility', () => {
    const { api } = mountWithEmbeddableFooter()
    api.toggleShareOptions()
    expect(api.showShareOptions.value).toBe(true)
    api.toggleShareOptions()
    expect(api.showShareOptions.value).toBe(false)
  })

  it('creates the iframe resizer once on mount', () => {
    mountWithEmbeddableFooter()
    expect(createSpy).toHaveBeenCalledTimes(1)
  })
})
