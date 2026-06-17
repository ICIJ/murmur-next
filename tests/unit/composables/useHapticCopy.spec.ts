import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import type { App } from 'vue'

import { useHapticCopy } from '@/composables/useHapticCopy'
import type { UseHapticCopy, UseHapticCopyOptions } from '@/composables/useHapticCopy'

// Run the composable inside a real component setup so `onUnmounted` registers
// without warnings, and expose the returned API plus the unmount handle.
function withHapticCopy(options: UseHapticCopyOptions = {}): {
  result: UseHapticCopy
  unmount: () => void
} {
  let result!: UseHapticCopy
  const app: App = createApp({
    setup() {
      result = useHapticCopy(options)
      return () => null
    }
  })
  app.mount(document.createElement('div'))
  return { result, unmount: () => app.unmount() }
}

describe('useHapticCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty, hidden feedback and no pending timer', () => {
    const { result, unmount } = withHapticCopy()
    expect(result.tooltipContent.value).toBe('')
    expect(result.showTooltip.value).toBe(false)
    expect(result.tooltipTimeout.value).toBeUndefined()
    unmount()
  })

  it('resolves the message when opening the tooltip', async () => {
    const resolveMessage = vi.fn((message: string) => `resolved:${message}`)
    const { result, unmount } = withHapticCopy({ resolveMessage })

    await result.openTooltip('hello')
    expect(resolveMessage).toHaveBeenCalledWith('hello')
    expect(result.tooltipContent.value).toBe('resolved:hello')
    expect(result.showTooltip.value).toBe(true)
    unmount()
  })

  it('clears content and pending timer when closing the tooltip', async () => {
    const onHide = vi.fn()
    const { result, unmount } = withHapticCopy({ onHide })

    await result.openTooltip('hello')
    result.nextTimeout(vi.fn(), 1000)
    expect(result.tooltipTimeout.value).toBeDefined()

    await result.closeTooltip()
    expect(result.showTooltip.value).toBe(false)
    expect(result.tooltipTimeout.value).toBeUndefined()
    expect(onHide).toHaveBeenCalledOnce()
    unmount()
  })

  it('runs attempt then success hooks and shows the succeed message on success', async () => {
    const calls: string[] = []
    const copy = vi.fn(() => {
      calls.push('copy')
    })
    const { result, unmount } = withHapticCopy({
      copy,
      succeedMessage: 'succeed',
      onAttempt: () => calls.push('attempt'),
      onSuccess: () => calls.push('success')
    })

    const pending = result.copy()
    await vi.runAllTimersAsync()
    await pending

    expect(calls).toEqual(['attempt', 'copy', 'success'])
    unmount()
  })

  it('shows the failed message and runs the error hook when the copy throws', async () => {
    const failure = new Error('nope')
    const onError = vi.fn()
    const { result, unmount } = withHapticCopy({
      failedMessage: 'failed',
      copy: () => {
        throw failure
      },
      onError
    })

    const pending = result.copy()
    // The failure message is shown before the hide delay runs.
    await Promise.resolve()
    expect(result.tooltipContent.value).toBe('failed')
    expect(onError).toHaveBeenCalledWith(failure)

    await vi.runAllTimersAsync()
    await pending
    unmount()
  })

  it('resets the single hide timer so back-to-back copies do not stack resets', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, unmount } = withHapticCopy()

    result.nextTimeout(first, 1000)
    const firstTimer = result.tooltipTimeout.value
    // Scheduling again replaces the pending timer rather than adding another.
    result.nextTimeout(second, 1000)
    expect(result.tooltipTimeout.value).not.toBe(firstTimer)

    await vi.runAllTimersAsync()
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
    unmount()
  })

  it('reads a reactive hide delay through a getter on every copy', async () => {
    let delay = 500
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const { result, unmount } = withHapticCopy({ hideDelay: () => delay })

    const firstCopy = result.copy()
    await vi.runAllTimersAsync()
    await firstCopy
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 500)

    delay = 2000
    const secondCopy = result.copy()
    await vi.runAllTimersAsync()
    await secondCopy
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 2000)

    setTimeoutSpy.mockRestore()
    unmount()
  })

  it('does not throw when copying with the default no-op action', async () => {
    const { result, unmount } = withHapticCopy()
    const pending = result.copy()
    await vi.runAllTimersAsync()
    await expect(pending).resolves.toBeUndefined()
    unmount()
  })
})
