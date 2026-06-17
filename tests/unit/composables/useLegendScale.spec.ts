import { ref } from 'vue'
import { scaleThreshold } from 'd3-scale'
import { describe, expect, it } from 'vitest'

import { useLegendScale } from '@/composables/useLegendScale'
import type { ColorScaleFn } from '@/composables/useLegendScale'

// Default options matching the LegendScale component defaults, overridable per
// test. Kept as a factory so each call gets fresh refs.
function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    width: ref(150),
    min: ref(0),
    max: ref(100),
    cursorValue: ref<number | null>(null),
    colorScale: ref<ColorScaleFn | string>('scaleLinear'),
    colorScaleStart: ref('#fff'),
    colorScaleEnd: ref('#000'),
    ...overrides
  }
}

describe('useLegendScale', () => {
  describe('with the default linear scale', () => {
    it('reports no cursor for a null cursor value', () => {
      const { hasCursor } = useLegendScale(createOptions())
      expect(hasCursor.value).toBe(false)
    })

    it('reports a cursor for a numeric cursor value', () => {
      const { hasCursor } = useLegendScale(
        createOptions({ cursorValue: ref(50) })
      )
      expect(hasCursor.value).toBe(true)
    })

    it('returns 0% cursor offset when there is no cursor value', () => {
      const { cursorLeft } = useLegendScale(createOptions())
      expect(cursorLeft.value).toBe('0%')
    })

    it('returns 0% cursor offset for the minimum value', () => {
      const { cursorLeft } = useLegendScale(
        createOptions({ min: ref(0), max: ref(150), cursorValue: ref(0) })
      )
      expect(cursorLeft.value).toBe('0%')
    })

    it('returns 100% cursor offset for the maximum value', () => {
      const { cursorLeft } = useLegendScale(
        createOptions({ min: ref(0), max: ref(150), cursorValue: ref(150) })
      )
      expect(cursorLeft.value).toBe('100%')
    })

    it('maps a pixel column back to its domain value', () => {
      const { widthScale } = useLegendScale(
        createOptions({ width: ref(100), min: ref(0), max: ref(100) })
      )
      expect(Math.round(widthScale.value(100))).toBe(100)
    })

    it('ranges over every pixel column from 1 to width', () => {
      const { colorScaleWidthRange } = useLegendScale(
        createOptions({ width: ref(3) })
      )
      expect(colorScaleWidthRange.value).toEqual([1, 2, 3])
    })
  })

  describe('with a threshold scale', () => {
    // White below 10k, pink up to 20k, red above.
    function createThresholdOptions() {
      const colorScale = scaleThreshold<number, string>()
        .domain([1e4, 2e4])
        .range(['white', 'pink', 'red'])
      return createOptions({
        min: ref(0),
        max: ref(3e4),
        width: ref(150),
        colorScale: ref(colorScale as unknown as ColorScaleFn)
      })
    }

    it('passes through the caller-provided color function', () => {
      const { colorScaleFunction } = useLegendScale(createThresholdOptions())
      expect(colorScaleFunction.value(0)).toBe('white')
      expect(colorScaleFunction.value(1e4)).toBe('pink')
      expect(colorScaleFunction.value(1e5)).toBe('red')
    })

    it('maps a pixel column to the color painted there', () => {
      const { widthScaleColor } = useLegendScale(createThresholdOptions())
      expect(widthScaleColor.value(0)).toBe('white')
      expect(widthScaleColor.value(75)).toBe('pink')
      expect(widthScaleColor.value(150)).toBe('red')
    })

    it('rounds the cursor offset to whole percents', () => {
      const { cursorLeft } = useLegendScale(
        createOptions({
          min: ref(0),
          max: ref(3e4),
          cursorValue: ref(1e4)
        })
      )
      expect(cursorLeft.value).toBe('33%')
    })
  })
})
