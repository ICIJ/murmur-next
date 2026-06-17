import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useStackedChart } from '@/composables/useStackedChart'

// Default options matching the stacked chart component defaults, overridable
// per test. Kept as a factory so each call gets fresh refs.
function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    loadedData: ref<any[]>([
      { label: 'Avatar', budget: 237, box_office: 2784 },
      { label: 'Finding Nemo', budget: 94, box_office: 940 },
      { label: 'Ghostbusters', budget: 14, box_office: 229 }
    ]),
    isLoaded: ref(true),
    sortBy: ref<string | string[] | null>(null),
    keys: ref<string[]>([]),
    labelField: ref('label'),
    groups: ref<string[]>([]),
    barColors: ref<string[]>([]),
    ...overrides
  }
}

describe('useStackedChart', () => {
  describe('sortedData', () => {
    it('returns an empty array until the data has loaded', () => {
      const { sortedData } = useStackedChart(createOptions({ isLoaded: ref(false) }))
      expect(sortedData.value).toEqual([])
    })

    it('keeps the loaded order when sortBy is null', () => {
      const { sortedData } = useStackedChart(createOptions())
      expect(sortedData.value.map((d: any) => d.label)).toEqual([
        'Avatar',
        'Finding Nemo',
        'Ghostbusters'
      ])
    })

    it('sorts by the given field when sortBy is set', () => {
      const { sortedData } = useStackedChart(createOptions({ sortBy: ref('budget') }))
      expect(sortedData.value.map((d: any) => d.label)).toEqual([
        'Ghostbusters',
        'Finding Nemo',
        'Avatar'
      ])
    })
  })

  describe('discoveredKeys', () => {
    it('discovers keys from the first datum minus the label field', () => {
      const { discoveredKeys } = useStackedChart(createOptions())
      expect(discoveredKeys.value).toEqual(['budget', 'box_office'])
    })

    it('uses the explicit keys when provided', () => {
      const { discoveredKeys } = useStackedChart(createOptions({ keys: ref(['box_office']) }))
      expect(discoveredKeys.value).toEqual(['box_office'])
    })

    it('respects a custom label field', () => {
      const { discoveredKeys } = useStackedChart(
        createOptions({
          labelField: ref('movie'),
          loadedData: ref([{ movie: 'Avatar', budget: 237, box_office: 2784 }])
        })
      )
      expect(discoveredKeys.value).toEqual(['budget', 'box_office'])
    })
  })

  describe('colorScale', () => {
    it('maps each discovered key to the matching color by index', () => {
      const { colorScale } = useStackedChart(createOptions({ barColors: ref(['#000', '#fff']) }))
      expect(colorScale.value('budget')).toBe('#000')
      expect(colorScale.value('box_office')).toBe('#fff')
    })
  })

  describe('totalRowValue', () => {
    it('sums every key for the row at the given index', () => {
      const { totalRowValue } = useStackedChart(createOptions())
      expect(totalRowValue(0)).toBe(237 + 2784)
      expect(totalRowValue(2)).toBe(14 + 229)
    })
  })

  describe('maxStackValue', () => {
    it('returns the largest row total across the data', () => {
      const { maxStackValue } = useStackedChart(createOptions())
      expect(maxStackValue.value).toBe(237 + 2784)
    })
  })

  describe('groupName', () => {
    it('returns the matching group name when one is provided', () => {
      const { groupName } = useStackedChart(
        createOptions({ groups: ref(['Budget', 'Box Office']) })
      )
      expect(groupName('budget')).toBe('Budget')
      expect(groupName('box_office')).toBe('Box Office')
    })

    it('falls back to the key itself when no group name matches', () => {
      const { groupName } = useStackedChart(createOptions())
      expect(groupName('budget')).toBe('budget')
    })
  })
})
