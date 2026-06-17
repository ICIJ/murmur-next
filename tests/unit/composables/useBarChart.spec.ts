import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useBarChart } from '@/composables/useBarChart'

// Default options matching the BarChart component defaults, overridable per
// test. Kept as a factory so each call gets fresh refs.
function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    loadedData: ref<object[]>([
      { label: 'A', value: 10 },
      { label: 'B', value: 20, highlight: true },
      { label: 'C', value: 40 }
    ]),
    width: ref(500),
    labelWidth: ref(100),
    valueWidth: ref(0),
    sortBy: ref<string | string[] | null>(null),
    barHeight: ref(30),
    barGap: ref(15),
    labelGap: ref(10),
    ...overrides
  }
}

describe('useBarChart', () => {
  describe('sortedData', () => {
    it('keeps the loaded order when sortBy is null', () => {
      const { sortedData } = useBarChart(createOptions())
      expect(sortedData.value.map((d: any) => d.label)).toEqual(['A', 'B', 'C'])
    })

    it('sorts by the given field when sortBy is set', () => {
      const { sortedData } = useBarChart(
        createOptions({
          loadedData: ref([
            { label: 'B', value: 20 },
            { label: 'A', value: 50 },
            { label: 'C', value: 10 }
          ]),
          sortBy: ref('value')
        })
      )
      expect(sortedData.value.map((d: any) => d.label)).toEqual(['C', 'B', 'A'])
    })

    it('returns an empty array when there is no loaded data', () => {
      const { sortedData } = useBarChart(createOptions({ loadedData: ref(null) }))
      expect(sortedData.value).toEqual([])
    })
  })

  describe('margin', () => {
    it('reserves the label width plus the label gap on the left', () => {
      const { margin } = useBarChart(
        createOptions({ labelWidth: ref(100), labelGap: ref(10) })
      )
      expect(margin.value).toEqual({ left: 110, right: 0, top: 0, bottom: 0 })
    })
  })

  describe('height', () => {
    it('stacks every bar by barHeight plus barGap', () => {
      const { height } = useBarChart(createOptions())
      // 3 data points * (30 + 15)
      expect(height.value).toBe(135)
    })
  })

  describe('padded', () => {
    it('subtracts the left margin from the width', () => {
      const { padded } = useBarChart(
        createOptions({ width: ref(500), labelWidth: ref(100), labelGap: ref(10) })
      )
      expect(padded.value.width).toBe(390)
    })

    it('never goes negative when the margin exceeds the width', () => {
      const { padded } = useBarChart(
        createOptions({ width: ref(50), labelWidth: ref(100), labelGap: ref(10) })
      )
      expect(padded.value.width).toBe(0)
    })
  })

  describe('bars', () => {
    it('scales the largest value to the full padded width', () => {
      const { bars, padded } = useBarChart(createOptions())
      // Largest datum (40) spans the whole padded width (no value room reserved).
      expect(bars.value[2].width).toBe(padded.value.width)
    })

    it('scales values linearly from the [0, max] domain', () => {
      const { bars, padded } = useBarChart(createOptions())
      // 20 is half of the max (40), so half the padded width.
      expect(bars.value[1].width).toBe(padded.value.width / 2)
    })

    it('stacks each bar vertically and carries its highlight flag', () => {
      const { bars } = useBarChart(createOptions())
      expect(bars.value.map(b => b.y)).toEqual([0, 45, 90])
      expect(bars.value.map(b => b.highlight)).toEqual([
        undefined,
        true,
        undefined
      ])
    })

    it('reserves room for the value width on the right', () => {
      const { bars, padded } = useBarChart(
        createOptions({ valueWidth: ref(40) })
      )
      // The max bar now stops short of the padded width by the value width.
      expect(bars.value[2].width).toBe(padded.value.width - 40)
    })
  })

  describe('labels', () => {
    it('places each label at the label width and stacked vertically', () => {
      const { labels } = useBarChart(createOptions())
      expect(labels.value.map(l => l.label)).toEqual(['A', 'B', 'C'])
      expect(labels.value.map(l => l.x)).toEqual([100, 100, 100])
      // 4 + barHeight / 2 + (barHeight + barGap) * i
      expect(labels.value.map(l => l.y)).toEqual([19, 64, 109])
    })
  })
})
