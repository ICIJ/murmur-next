import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useChoropleth } from '@/composables/useChoropleth'

// Default options matching the ChoroplethMap component usage, overridable per
// test. Kept as a factory so each call gets fresh refs.
function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    loadedData: ref<Record<string, number>>({ FRA: 100, SRB: 150, KGZ: 200 }),
    topojsonObjectsPath: ref<string | string[]>('id'),
    max: ref<number | null>(null),
    min: ref<number | null>(null),
    featureColorScale: ref<((v: any) => string) | null>(null),
    colorScaleStart: ref('#fff'),
    colorScaleEnd: ref('#7a0177'),
    ...overrides
  }
}

describe('useChoropleth', () => {
  describe('maxValue / minValue', () => {
    it('derives the bounds from the loaded data when not forced', () => {
      const { maxValue, minValue } = useChoropleth(createOptions())
      expect(maxValue.value).toBe(200)
      expect(minValue.value).toBe(100)
    })

    it('uses the forced max and min when provided', () => {
      const { maxValue, minValue } = useChoropleth(
        createOptions({ max: ref(500), min: ref(10) })
      )
      expect(maxValue.value).toBe(500)
      expect(minValue.value).toBe(10)
    })

    it('falls back to 0 when there is no data', () => {
      const { maxValue, minValue } = useChoropleth(
        createOptions({ loadedData: ref({}) })
      )
      expect(maxValue.value).toBe(0)
      expect(minValue.value).toBe(0)
    })
  })

  describe('featureColorScaleFunction', () => {
    it('uses the custom scale function when provided', () => {
      const custom = () => 'red'
      const { featureColorScaleFunction } = useChoropleth(
        createOptions({ featureColorScale: ref(custom) })
      )
      expect(featureColorScaleFunction.value).toBe(custom)
    })

    it('maps the min value to the start color and the max to the end color', () => {
      const { featureColorScaleFunction } = useChoropleth(createOptions())
      expect(featureColorScaleFunction.value(100)).toBe('rgb(255, 255, 255)')
      expect(featureColorScaleFunction.value(200)).toBe('rgb(122, 1, 119)')
    })
  })

  describe('featureColor', () => {
    it('resolves a feature color from its identifier', () => {
      const { featureColor } = useChoropleth(createOptions())
      expect(featureColor.value({ id: 'KGZ' })).toBe('rgb(122, 1, 119)')
      expect(featureColor.value({ id: 'FRA' })).toBe('rgb(255, 255, 255)')
    })

    it('returns undefined for a feature without data', () => {
      const { featureColor } = useChoropleth(createOptions())
      expect(featureColor.value({ id: 'USA' })).toBeUndefined()
    })

    it('reads the identifier through a dot-notation path', () => {
      const { featureColor } = useChoropleth(
        createOptions({
          loadedData: ref({ '01': 100, '03': 200 }),
          topojsonObjectsPath: ref('properties.code')
        })
      )
      expect(featureColor.value({ properties: { code: '03' } })).toBe(
        'rgb(122, 1, 119)'
      )
      expect(featureColor.value({ properties: { code: '99' } })).toBeUndefined()
    })
  })
})
