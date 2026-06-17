import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useContentPlaceholder } from '@/composables/useContentPlaceholder'
import type { ContentPlaceholderRows } from '@/types'

describe('useContentPlaceholder', () => {
  it('returns an empty list when no rows are provided', () => {
    const { formattedRows } = useContentPlaceholder(undefined)
    expect(formattedRows.value).toEqual([])
  })

  it('formats each row into styled boxes', () => {
    const rows: ContentPlaceholderRows = [
      {
        height: '1em',
        boxes: [
          [0, 10],
          [0, 20]
        ]
      }
    ]

    const { formattedRows } = useContentPlaceholder(rows)

    expect(formattedRows.value).toHaveLength(1)
    expect(formattedRows.value[0].height).toBe('1em')
    // Two content boxes plus the trailing filler the helper appends.
    expect(formattedRows.value[0].boxes).toHaveLength(3)
  })

  it('applies the given sub-class to spacer boxes', () => {
    const rows: ContentPlaceholderRows = [
      {
        height: '1em',
        boxes: [['10px', 20]]
      }
    ]

    const { formattedRows } = useContentPlaceholder(rows, 'spacer')

    const spacerBoxes = formattedRows.value[0].boxes.filter(
      box => box.subClass === 'spacer'
    )
    // The leading spacer and the trailing filler both carry the sub-class.
    expect(spacerBoxes).toHaveLength(2)
  })

  it('recomputes when the source rows change', () => {
    const rows = ref<ContentPlaceholderRows>([
      { height: '1em', boxes: [[0, 10]] }
    ])

    const { formattedRows } = useContentPlaceholder(rows)
    expect(formattedRows.value).toHaveLength(1)

    rows.value = [
      { height: '1em', boxes: [[0, 10]] },
      { height: '2em', boxes: [[0, 20]] }
    ]
    expect(formattedRows.value).toHaveLength(2)
  })
})
