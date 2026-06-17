import * as d3 from 'd3'
import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import identity from 'lodash/identity'

import { useLineChart } from '@/composables/useLineChart'
import type { LineChartFormatter } from '@/composables/useLineChart'

// A formatter mirroring useChart's d3Formatter: applies a function or d3 format
// string, otherwise returns the value untouched.
const passthroughFormatter: LineChartFormatter = (value, formatter) => {
  return typeof formatter === 'function' ? formatter(value) : value
}

// A year formatter mirroring useChart's xAxisYearFormat in its wide layout: the
// year is returned untouched.
const yearFormat = (year: number | string) => year

// Default options matching the LineChart component defaults, overridable per
// test. Kept as a factory so each call gets fresh refs.
function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    loadedData: ref<object[]>([
      { date: 2000, value: 0 },
      { date: 2001, value: 1 },
      { date: 2002, value: 2 },
      { date: 2003, value: 3 },
      { date: 2004, value: 4 }
    ]),
    padded: ref({ width: 500, height: 300 }),
    keys: ref<string[]>([]),
    seriesName: ref('value'),
    timeseriesKey: ref('date'),
    lineColors: ref<string[]>([]),
    curve: ref<d3.CurveFactory | undefined>(undefined),
    d3Formatter: passthroughFormatter,
    xAxisTicks: ref<object | number | null>(null),
    yAxisTickFormat: ref<((v: any) => string) | string>(identity),
    yAxisTicks: ref<number | object>(5),
    xAxisYearFormat: yearFormat,
    ...overrides
  }
}

describe('useLineChart', () => {
  describe('isMultiLine / activeKeys', () => {
    it('is single-line and uses seriesName when keys are empty', () => {
      const { isMultiLine, activeKeys } = useLineChart(createOptions())
      expect(isMultiLine.value).toBe(false)
      expect(activeKeys.value).toEqual(['value'])
    })

    it('is multi-line and uses keys when keys are set', () => {
      const { isMultiLine, activeKeys } = useLineChart(
        createOptions({ keys: ref(['injuries', 'deaths']) })
      )
      expect(isMultiLine.value).toBe(true)
      expect(activeKeys.value).toEqual(['injuries', 'deaths'])
    })
  })

  describe('formattedData', () => {
    it('parses the time field into a Date and casts series values to numbers', () => {
      const { formattedData } = useLineChart(
        createOptions({
          loadedData: ref([{ date: 2000, value: '7' }])
        })
      )
      const [first] = formattedData.value
      expect(first.date).toBeInstanceOf(Date)
      expect(first.date.getFullYear()).toBe(2000)
      expect(first.value).toBe(7)
    })

    it('returns an empty array when there is no loaded data', () => {
      const { formattedData } = useLineChart(
        createOptions({ loadedData: ref(null) })
      )
      expect(formattedData.value).toEqual([])
    })

    it('does not mutate the source data', () => {
      const source = [{ date: 2000, value: 0 }]
      const { formattedData } = useLineChart(
        createOptions({ loadedData: ref(source) })
      )
      // Touch the computed so the mapping runs.
      expect(formattedData.value).toHaveLength(1)
      expect(source[0].date).toBe(2000)
    })
  })

  describe('scales', () => {
    it('maps the time extent onto the padded width', () => {
      const { scaleX, formattedData } = useLineChart(createOptions())
      const dates = formattedData.value.map((d: any) => d.date)
      expect(scaleX.value(dates[0])).toBe(0)
      expect(scaleX.value(dates[dates.length - 1])).toBe(500)
    })

    it('maps the data max to the top of the padded area', () => {
      const { scaleY } = useLineChart(createOptions())
      // Max value is 4; it maps to y=0 (top), and 0 maps to the bottom.
      expect(scaleY.value(4)).toBe(0)
      expect(scaleY.value(0)).toBe(300)
    })

    it('covers every series in multi-line mode', () => {
      const { scaleY } = useLineChart(
        createOptions({
          loadedData: ref([
            { date: 2000, injuries: 10, deaths: 2 },
            { date: 2001, injuries: 20, deaths: 5 }
          ]),
          keys: ref(['injuries', 'deaths'])
        })
      )
      // The highest value across both series is 20.
      expect(scaleY.value(20)).toBe(0)
    })
  })

  describe('line / lines', () => {
    it('builds a single path with no NaN in single-line mode', () => {
      const { line, lines } = useLineChart(createOptions())
      expect(lines.value).toEqual([])
      expect(line.value).toBeTruthy()
      expect(line.value).toContain('M')
      expect(line.value).not.toContain('NaN')
    })

    it('builds one path per key with resolved colors in multi-line mode', () => {
      const { line, lines } = useLineChart(
        createOptions({
          loadedData: ref([
            { date: 2000, injuries: 10, deaths: 2 },
            { date: 2001, injuries: 20, deaths: 5 }
          ]),
          keys: ref(['injuries', 'deaths']),
          lineColors: ref(['#e53935', '#ff8a80'])
        })
      )
      expect(line.value).toBeNull()
      expect(lines.value).toHaveLength(2)
      expect(lines.value[0]).toMatchObject({ key: 'injuries', color: '#e53935' })
      expect(lines.value[1]).toMatchObject({ key: 'deaths', color: '#ff8a80' })
      lines.value.forEach((series) => {
        expect(series.path).toContain('M')
        expect(series.path).not.toContain('NaN')
      })
    })

    it('applies the curve factory when provided', () => {
      const linear = useLineChart(createOptions())
      const stepped = useLineChart(createOptions({ curve: ref(d3.curveStep) }))
      expect(stepped.line.value).not.toBe(linear.line.value)
    })
  })

  describe('axes', () => {
    it('configures the y-axis tick count from yAxisTicks', () => {
      const { yAxis } = useLineChart(createOptions({ yAxisTicks: ref(3) }))
      expect(yAxis.value.tickArguments()).toEqual([3])
    })

    it('formats x-axis ticks through the year formatter', () => {
      const { xAxis } = useLineChart(createOptions())
      const tickFormat = xAxis.value.tickFormat()
      expect(tickFormat?.(new Date(2001, 0, 1), 0)).toBe(2001)
    })
  })
})
