import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useChartFormat } from '@/composables/useChartFormat'
import type { LoadedData } from '@/composables/useChartData'

// Build the format composable from plain refs, mirroring how useChart wires it.
function buildFormat({
  loadedData = ref<LoadedData>(null),
  rawData = ref<unknown>(null),
  chartHeightRatio = ref<number | undefined>(undefined),
  socialMode = ref(false),
  socialModeRatio = ref(5 / 4)
} = {}) {
  return useChartFormat({ loadedData, rawData, chartHeightRatio, socialMode, socialModeRatio })
}

describe('useChartFormat', () => {
  describe('d3Formatter', () => {
    it('applies a formatter function to the value', () => {
      const { d3Formatter } = buildFormat()
      expect(d3Formatter(3, (v: number) => `#${v}`)).toBe('#3')
    })

    it('applies a d3 format string to the value', () => {
      const { d3Formatter } = buildFormat()
      expect(d3Formatter(1000, ',')).toBe('1,000')
    })

    it('returns the value untouched when no usable formatter is given', () => {
      const { d3Formatter } = buildFormat()
      expect(d3Formatter(42)).toBe(42)
      expect(d3Formatter(42, undefined)).toBe(42)
    })
  })

  describe('baseHeightRatio', () => {
    it('honours an explicit chart height ratio first', () => {
      const { baseHeightRatio } = buildFormat({
        chartHeightRatio: ref(0.25),
        socialMode: ref(true),
        socialModeRatio: ref(2)
      })
      expect(baseHeightRatio.value).toBe(0.25)
    })

    it('falls back to the social-mode ratio when in social mode', () => {
      const { baseHeightRatio } = buildFormat({ socialMode: ref(true), socialModeRatio: ref(2) })
      expect(baseHeightRatio.value).toBe(2)
    })

    it('falls back to the default 9/16 ratio otherwise', () => {
      const { baseHeightRatio } = buildFormat()
      expect(baseHeightRatio.value).toBe(9 / 16)
    })
  })

  describe('dataHasHighlights', () => {
    it('detects a highlighted datum in the loaded data', () => {
      const loadedData = ref<LoadedData>([{ value: 1 }, { value: 2, highlight: true }] as any)
      const { dataHasHighlights } = buildFormat({ loadedData })
      expect(dataHasHighlights.value).toBe(true)
    })

    it('returns false when no datum is highlighted', () => {
      const loadedData = ref<LoadedData>([{ value: 1 }, { value: 2 }] as any)
      const { dataHasHighlights } = buildFormat({ loadedData })
      expect(dataHasHighlights.value).toBe(false)
    })

    it('falls back to the raw data before the first load settles', () => {
      const rawData = ref<unknown>([{ value: 1, highlight: true }])
      const { dataHasHighlights } = buildFormat({ rawData })
      expect(dataHasHighlights.value).toBe(true)
    })

    it('returns false when neither loaded nor raw data is an array', () => {
      const rawData = ref<unknown>({ a: 1 })
      const { dataHasHighlights } = buildFormat({ rawData })
      expect(dataHasHighlights.value).toBe(false)
    })
  })
})
