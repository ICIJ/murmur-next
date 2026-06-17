import { defineComponent, h, ref, toRaw } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import * as d3 from 'd3'

import { useChartData } from '@/composables/useChartData'
import type { ChartData, LoadedData } from '@/composables/useChartData'

// Make the d3 namespace writable so the URL loaders can be stubbed, mirroring
// the datavisualisation component specs.
vi.mock('d3', async () => {
  return {
    ...(await vi.importActual('d3'))
  }
})

// Mount a tiny host so the composable's `watch(..., { immediate: true })` runs
// inside a real setup context, and expose what we need back to the test.
function mountHost(data: ChartData, dataUrlType: 'json' | 'csv' | 'tsv' = 'json') {
  const onLoaded = vi.fn()
  let api!: ReturnType<typeof useChartData>
  const host = defineComponent({
    setup() {
      api = useChartData({ data: ref(data), dataUrlType: ref(dataUrlType) }, onLoaded)
      return () => h('div')
    }
  })
  const wrapper = mount(host)
  return {
    wrapper,
    onLoaded,
    get loadedData() {
      return api.loadedData
    }
  }
}

describe('useChartData', () => {
  it('passes inline array data through untouched', async () => {
    const inline = [{ value: 1 }, { value: 2 }]
    const { loadedData, onLoaded, wrapper } = mountHost(inline)
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await Promise.resolve()
    // The ref deep-proxies the array, so identity is asserted via the raw target.
    expect(toRaw(loadedData.value)).toBe(inline)
    expect(loadedData.value).toEqual(inline as LoadedData)
    expect(onLoaded).toHaveBeenCalledTimes(1)
  })

  it('fetches and parses a URL through the matching d3 loader', async () => {
    const parsed = [{ value: 3 }]
    d3.json = vi.fn().mockResolvedValue(parsed) as any
    const { loadedData, onLoaded, wrapper } = mountHost('https://example.com/data.json', 'json')
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await Promise.resolve()
    expect(d3.json).toHaveBeenCalledWith('https://example.com/data.json')
    expect(loadedData.value).toEqual(parsed)
    expect(onLoaded).toHaveBeenCalledWith(parsed as LoadedData)
  })

  it('selects the d3 loader matching the data URL type', async () => {
    const parsed = [{ value: 4 }]
    d3.csv = vi.fn().mockResolvedValue(parsed) as any
    const { wrapper } = mountHost('https://example.com/data.csv', 'csv')
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await Promise.resolve()
    expect(d3.csv).toHaveBeenCalledWith('https://example.com/data.csv')
  })
})
