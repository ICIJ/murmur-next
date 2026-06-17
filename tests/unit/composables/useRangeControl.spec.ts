import { ref } from 'vue'
import { useRangeControl } from '@/composables/useRangeControl'

describe('useRangeControl', () => {
  const createControl = (overrides = {}) => {
    return useRangeControl({
      range: [0.2, 0.8],
      snap: 0.0001,
      precision: 4,
      minDistance: 0.01,
      ...overrides
    })
  }

  it('initializes start and end from the range bounds', () => {
    const { start, end } = createControl()
    expect(start.value).toBe(0.2)
    expect(end.value).toBe(0.8)
  })

  it('defaults bounds to 0 when the range is empty', () => {
    const { start, end } = createControl({ range: [] })
    expect(start.value).toBe(0)
    expect(end.value).toBe(0)
  })

  it('flags a range with fewer than two bounds as disabled', () => {
    expect(createControl({ range: [] }).disabled.value).toBe(true)
    expect(createControl({ range: [0.1] }).disabled.value).toBe(true)
    expect(createControl({ range: [0.1, 0.9] }).disabled.value).toBe(false)
  })

  it('snaps a value to the nearest snap increment', () => {
    const { snapValue } = createControl({ snap: 0.05 })
    expect(snapValue(0.12)).toBe(0.1)
    expect(snapValue(0.13)).toBeCloseTo(0.15, 5)
  })

  it('moves the start bound and reports the change', () => {
    const { start, moveStartTo } = createControl({ snap: 0.05 })
    const changed = moveStartTo(0.3, 1)
    expect(changed).toBe(true)
    expect(start.value).toBe(0.3)
  })

  it('keeps the start bound when it would breach the minimum distance', () => {
    const { start, moveStartTo } = createControl({
      range: [0.1, 0.11],
      minDistance: 0.05
    })
    const changed = moveStartTo(0.06, 1)
    expect(changed).toBe(false)
    expect(start.value).toBe(0.1)
  })

  it('moves the end bound and reports the change', () => {
    const { end, moveEndTo } = createControl({ snap: 0.05 })
    const changed = moveEndTo(0.95, 1)
    expect(changed).toBe(true)
    expect(end.value).toBe(0.95)
  })

  it('keeps the end bound when it would breach the minimum distance', () => {
    const { end, moveEndTo } = createControl({
      range: [0.5, 0.52],
      minDistance: 0.05
    })
    const changed = moveEndTo(0.53, 1)
    expect(changed).toBe(false)
    expect(end.value).toBe(0.52)
  })

  it('slides both bounds while preserving their distance', () => {
    const { start, end, moveBoundsTo } = createControl({ range: [0.2, 0.5] })
    moveBoundsTo(0.4, 1)
    expect(start.value).toBe(0.4)
    expect(end.value).toBeCloseTo(0.7, 4)
  })

  it('syncs the bounds when the source range changes', async () => {
    const range = ref<[number, number]>([0.1, 0.9])
    const { start, end } = useRangeControl({
      range,
      snap: 0.0001,
      precision: 4,
      minDistance: 0.01
    })
    expect(start.value).toBe(0.1)
    range.value = [0.3, 0.7]
    await Promise.resolve()
    expect(start.value).toBe(0.3)
    expect(end.value).toBe(0.7)
  })
})
