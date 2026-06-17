import { describe, expect, it, vi } from 'vitest'

import { useConfirmButton } from '@/composables/useConfirmButton'

describe('useConfirmButton', () => {
  it('starts with the tooltip hidden', () => {
    const emit = vi.fn()
    const { showTooltip } = useConfirmButton(emit)
    expect(showTooltip.value).toBe(false)
  })

  it('toggles the tooltip and emits the resulting state', () => {
    const emit = vi.fn()
    const { showTooltip, toggle } = useConfirmButton(emit)

    toggle()
    expect(showTooltip.value).toBe(true)
    expect(emit).toHaveBeenLastCalledWith('toggled', true)

    toggle()
    expect(showTooltip.value).toBe(false)
    expect(emit).toHaveBeenLastCalledWith('toggled', false)
  })

  it('confirms by hiding, running the callback, then emitting', () => {
    const emit = vi.fn()
    const onConfirmed = vi.fn()
    const { showTooltip, toggle, confirm } = useConfirmButton(emit, { onConfirmed })

    toggle()
    emit.mockClear()
    confirm()

    expect(showTooltip.value).toBe(false)
    expect(onConfirmed).toHaveBeenCalledOnce()
    // Hiding emits `toggled(false)` before the `confirmed` event.
    expect(emit).toHaveBeenNthCalledWith(1, 'toggled', false)
    expect(emit).toHaveBeenNthCalledWith(2, 'confirmed')
  })

  it('cancels by hiding, running the callback, then emitting', () => {
    const emit = vi.fn()
    const onCancelled = vi.fn()
    const { showTooltip, toggle, cancel } = useConfirmButton(emit, { onCancelled })

    toggle()
    emit.mockClear()
    cancel()

    expect(showTooltip.value).toBe(false)
    expect(onCancelled).toHaveBeenCalledOnce()
    expect(emit).toHaveBeenNthCalledWith(1, 'toggled', false)
    expect(emit).toHaveBeenNthCalledWith(2, 'cancelled')
  })

  it('runs the confirmation callback before emitting the confirmed event', () => {
    const calls: string[] = []
    const emit = vi.fn((event: string) => calls.push(`emit:${event}`))
    const onConfirmed = vi.fn(() => calls.push('callback'))
    const { confirm } = useConfirmButton(emit, { onConfirmed })

    confirm()
    expect(calls).toEqual(['emit:toggled', 'callback', 'emit:confirmed'])
  })

  it('works without optional callbacks', () => {
    const emit = vi.fn()
    const { confirm, cancel } = useConfirmButton(emit)
    expect(() => {
      confirm()
      cancel()
    }).not.toThrow()
  })
})
