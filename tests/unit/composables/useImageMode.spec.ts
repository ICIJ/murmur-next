import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import { useImageMode } from '@/composables/useImageMode'

interface SourceDescriptor {
  src: string
  colorMode?: string
}

// Mounts a host component so the composable runs inside a real setup scope: it
// relies on `useColorMode` (`onMounted` + ancestor `data-bs-theme` lookup) and
// `useQueryObserver` (a `MutationObserver` over the host subtree). The host
// renders a themed ancestor wrapping a `<picture>` whose `.image-mode-source`
// children carry the `data-src`/`data-color-mode` dataset the composable reads.
function mountWithImageMode(
  theme: string,
  sources: SourceDescriptor[],
  defaultColorMode = 'light',
  fallbackSrc?: string
) {
  const element = ref<HTMLElement | null>(null)
  const fallbackRef = ref<string | undefined>(fallbackSrc)
  let api!: ReturnType<typeof useImageMode>

  const host = defineComponent({
    setup() {
      api = useImageMode(element, defaultColorMode, () => fallbackRef.value)

      return () =>
        h('div', { 'data-bs-theme': theme }, [
          h(
            'picture',
            { ref: element },
            sources.map(source =>
              h('source', {
                'class': 'image-mode-source',
                'data-src': source.src,
                'data-color-mode': source.colorMode
              })
            )
          )
        ])
    }
  })

  // Attach to the document so `element.closest('[data-bs-theme]')` resolves.
  const wrapper = mount(host, { attachTo: document.body })
  return { wrapper, api, element, fallbackRef }
}

describe('useImageMode', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('resolves the source matching the active color mode', async () => {
    const { api } = mountWithImageMode('dark', [
      { src: 'light.png', colorMode: 'light' },
      { src: 'dark.png', colorMode: 'dark' }
    ])
    await nextTick()
    expect(api.colorMode.value).toBe('dark')
    expect(api.src.value).toBe('dark.png')
  })

  it('falls back to the default color-mode source when no exact match exists', async () => {
    const { api } = mountWithImageMode('high-contrast', [
      { src: 'light.png', colorMode: 'light' },
      { src: 'dark.png', colorMode: 'dark' }
    ])
    await nextTick()
    // The active mode (`high-contrast`) has no source, so the `light` default wins.
    expect(api.colorMode.value).toBe('high-contrast')
    expect(api.src.value).toBe('light.png')
  })

  it('falls back to a source carrying no explicit color mode', async () => {
    const { api } = mountWithImageMode('high-contrast', [
      { src: 'default.png', colorMode: undefined },
      { src: 'dark.png', colorMode: 'dark' }
    ])
    await nextTick()
    expect(api.src.value).toBe('default.png')
  })

  it('falls back to the provided fallbackSrc when no source matches', async () => {
    const { api } = mountWithImageMode(
      'high-contrast',
      [{ src: 'dark.png', colorMode: 'dark' }],
      'light',
      'fallback.png'
    )
    await nextTick()
    expect(api.src.value).toBe('fallback.png')
  })

  it('reactively updates the resolved src when the fallback getter input changes', async () => {
    const { api, fallbackRef } = mountWithImageMode(
      'high-contrast',
      [{ src: 'dark.png', colorMode: 'dark' }],
      'light',
      'first.png'
    )
    await nextTick()
    expect(api.src.value).toBe('first.png')

    fallbackRef.value = 'second.png'
    await nextTick()
    expect(api.src.value).toBe('second.png')
  })
})
