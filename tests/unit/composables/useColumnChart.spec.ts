import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import identity from 'lodash/identity'

import { useColumnChart } from '@/composables/useColumnChart'
import type { ColumnChartFormatter } from '@/composables/useColumnChart'

// A formatter mirroring useChart's d3Formatter: applies a function or d3 format
// string, otherwise returns the value untouched.
const passthroughFormatter: ColumnChartFormatter = (value, formatter) => {
  return typeof formatter === 'function' ? formatter(value) : value
}

// Default options matching the ColumnChart component defaults, overridable per
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
    width: ref(500),
    height: ref(300),
    labelWidth: ref(40),
    labelHeight: ref(10),
    bucketHeight: ref(10),
    bucketWidth: ref(100),
    d3Formatter: passthroughFormatter,
    sortBy: ref<string | string[] | null>(null),
    seriesName: ref('value'),
    timeseriesKey: ref('date'),
    maxValue: ref<number | null>(null),
    barPadding: ref(0.35),
    barMargin: ref(0),
    noXAxis: ref(false),
    noYAxis: ref(false),
    xAxisTickCollapse: ref(false),
    xAxisTickFormat: ref<((v: any) => string) | string>(identity),
    xAxisTicks: ref<string[] | null>(null),
    yAxisTickFormat: ref<((v: any) => string) | string>(identity),
    yAxisTicks: ref<number | object>(5),
    waterfall: ref(false),
    waterfallTotal: ref(false),
    waterfallTotalLabel: ref('Total'),
    ...overrides
  }
}

describe('useColumnChart', () => {
  describe('sortedData', () => {
    it('keeps the loaded order when sortBy is null', () => {
      const { sortedData } = useColumnChart(createOptions())
      expect(sortedData.value.map((d: any) => d.date)).toEqual([
        2000, 2001, 2002, 2003, 2004
      ])
    })

    it('sorts by the given field when sortBy is set', () => {
      const { sortedData } = useColumnChart(
        createOptions({
          loadedData: ref([
            { date: 2000, value: 30 },
            { date: 2001, value: 10 },
            { date: 2002, value: 20 }
          ]),
          sortBy: ref('value')
        })
      )
      expect(sortedData.value.map((d: any) => d.date)).toEqual([2001, 2002, 2000])
    })

    it('returns an empty array when there is no loaded data', () => {
      const { sortedData } = useColumnChart(createOptions({ loadedData: ref(null) }))
      expect(sortedData.value).toEqual([])
    })
  })

  describe('margin', () => {
    it('reserves no left margin when the y-axis is hidden', () => {
      const { margin } = useColumnChart(createOptions({ noYAxis: ref(true) }))
      expect(margin.value.left).toBe(0)
    })

    it('reserves the label width plus 10 on the left otherwise', () => {
      const { margin } = useColumnChart(createOptions({ labelWidth: ref(40) }))
      expect(margin.value.left).toBe(50)
    })

    it('drops the bottom margin when the x-axis is hidden', () => {
      const { margin } = useColumnChart(createOptions({ noXAxis: ref(true) }))
      expect(margin.value.bottom).toBe(0)
    })
  })

  describe('scaleY', () => {
    it('maps the data max to the top of the padded area', () => {
      const { scaleY, padded } = useColumnChart(createOptions())
      // Max value (4) maps to 0 (top), and 0 maps to the padded height (bottom).
      expect(scaleY.value(4)).toBe(0)
      expect(scaleY.value(0)).toBe(padded.value.height)
    })

    it('honours an explicit maxValue', () => {
      const { scaleY, padded } = useColumnChart(
        createOptions({ maxValue: ref(8) })
      )
      // With max 8, the data max (4) lands at half the padded height.
      expect(scaleY.value(4)).toBe(padded.value.height / 2)
    })
  })

  describe('bars', () => {
    it('builds one bar per datum', () => {
      const { bars } = useColumnChart(createOptions())
      expect(bars.value).toHaveLength(5)
    })

    it('gives the smallest value the minimum height and the largest the full height', () => {
      const { bars, padded } = useColumnChart(createOptions())
      // value 0 -> height 0; value 4 (max) -> full padded height.
      expect(bars.value[0].height).toBe(0)
      expect(bars.value[4].height).toBe(padded.value.height)
    })
  })

  describe('xAxisTickValues', () => {
    it('uses every datum key when collapse is off', () => {
      const { xAxisTickValues } = useColumnChart(createOptions())
      expect(xAxisTickValues.value).toEqual([2000, 2001, 2002, 2003, 2004])
    })

    it('appends the total label for waterfall totals', () => {
      const { xAxisTickValues } = useColumnChart(
        createOptions({
          loadedData: ref([
            { date: 2020, value: 10 },
            { date: 2021, value: 20 }
          ]),
          waterfall: ref(true),
          waterfallTotal: ref(true)
        })
      )
      expect(xAxisTickValues.value).toEqual([2020, 2021, 'Total'])
    })
  })

  describe('waterfall', () => {
    it('sums every value into the waterfall total', () => {
      const { waterfallTotalValue } = useColumnChart(
        createOptions({
          loadedData: ref([
            { date: 2020, value: 10 },
            { date: 2021, value: 20 },
            { date: 2022, value: 30 }
          ]),
          waterfall: ref(true)
        })
      )
      expect(waterfallTotalValue.value).toBe(60)
    })

    it('stacks each bar on the running cumulative total', () => {
      const { bars, scaleY } = useColumnChart(
        createOptions({
          loadedData: ref([
            { date: 2020, value: 10 },
            { date: 2021, value: 20 },
            { date: 2022, value: 30 }
          ]),
          waterfall: ref(true)
        })
      )
      // Each bar's top sits at the cumulative scale position (10, 30, 60).
      expect(bars.value[0].y).toBe(scaleY.value(10))
      expect(bars.value[1].y).toBe(scaleY.value(30))
      expect(bars.value[2].y).toBe(scaleY.value(60))
    })

    it('adds a flagged total bar when waterfallTotal is on', () => {
      const { bars } = useColumnChart(
        createOptions({
          loadedData: ref([
            { date: 2020, value: 10 },
            { date: 2021, value: 20 }
          ]),
          waterfall: ref(true),
          waterfallTotal: ref(true)
        })
      )
      expect(bars.value).toHaveLength(3)
      expect(bars.value[2].isTotal).toBe(true)
      expect(bars.value[2].datum.value).toBe(30)
    })
  })

  describe('xAxis', () => {
    it('never runs the waterfall total label through the tick formatter', () => {
      const { xAxis } = useColumnChart(
        createOptions({
          loadedData: ref([{ date: 2020, value: 10 }]),
          waterfall: ref(true),
          waterfallTotal: ref(true),
          xAxisTickFormat: ref((v: any) => `'${String(v).slice(2)}`)
        })
      )
      const format = xAxis.value.tickFormat() as (d: any) => string
      expect(format('Total')).toBe('Total')
      expect(format(2020)).toBe('\'20')
    })
  })
})
