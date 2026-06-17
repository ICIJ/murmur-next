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

// `copy()` awaits the copy action then the tooltip open before scheduling the
// hide timer, so several microtask turns must drain before the feedback shows.
async function flushMicrotasks(): Promise<void> {
  for (let turn = 0; turn < 5; turn += 1) {
    await Promise.resolve()
  }
}

describe('useHapticCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty, hidden, not-visible feedback', () => {
    const { result, unmount } = withHapticCopy()
    expect(result.tooltipContent.value).toBe('')
    expect(result.showTooltip.value).toBe(false)
    expect(result.isVisible.value).toBe(false)
    unmount()
  })

  it('shows the resolved succeed message and becomes visible during a copy', async () => {
    const resolveMessage = vi.fn((message: string) => `resolved:${message}`)
    const { result, unmount } = withHapticCopy({
      resolveMessage,
      succeedMessage: 'ok'
    })

    const pending = result.copy()
    // Feedback is shown and the hide timer is pending before the delay elapses.
    await flushMicrotasks()
    expect(resolveMessage).toHaveBeenCalledWith('ok')
    expect(result.tooltipContent.value).toBe('resolved:ok')
    expect(result.showTooltip.value).toBe(true)
    expect(result.isVisible.value).toBe(true)

    await vi.runAllTimersAsync()
    await pending
    // Once the delay elapses the feedback hides itself.
    expect(result.isVisible.value).toBe(false)
    expect(result.showTooltip.value).toBe(false)
    unmount()
  })

  it('hides the feedback and runs the hide hook when closed', async () => {
    const onHide = vi.fn()
    const { result, unmount } = withHapticCopy({ onHide })

    result.copy()
    await flushMicrotasks()
    expect(result.isVisible.value).toBe(true)

    await result.close()
    expect(result.showTooltip.value).toBe(false)
    expect(result.isVisible.value).toBe(false)
    expect(onHide).toHaveBeenCalled()
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
    await flushMicrotasks()
    expect(result.tooltipContent.value).toBe('failed')
    expect(onError).toHaveBeenCalledWith(failure)

    await vi.runAllTimersAsync()
    await pending
    unmount()
  })

  it('resets the single hide timer so back-to-back copies do not stack resets', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { result, unmount } = withHapticCopy()

    // Start a first copy that schedules a hide timer. Its promise is awaited
    // only through the timer it owns, so superseding it intentionally orphans
    // the first promise — the test never awaits it.
    result.copy()
    await flushMicrotasks()
    expect(result.isVisible.value).toBe(true)
    const clearsAfterFirst = clearTimeoutSpy.mock.calls.length

    // A second copy clears the pending hide timer before scheduling its own.
    const secondCopy = result.copy()
    await flushMicrotasks()
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(clearsAfterFirst)
    expect(result.isVisible.value).toBe(true)

    await vi.runAllTimersAsync()
    await secondCopy
    // Only one hide runs at the end; the feedback is no longer visible.
    expect(result.isVisible.value).toBe(false)

    clearTimeoutSpy.mockRestore()
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
