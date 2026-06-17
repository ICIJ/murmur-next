import noop from 'lodash/noop'
import { nextTick, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Copies content to the clipboard. May run synchronously (HTML copy) or return
 * a promise (text copy); both shapes are awaited by {@link useHapticCopy}.
 */
export type HapticCopyAction = () => void | Promise<void>

/**
 * Resolves a feedback message key into the string shown in the tooltip. The
 * default implementation returns the key untouched; consumers usually plug an
 * i18n translator in here.
 */
export type HapticCopyMessageResolver = (message: string) => string

/**
 * Optional callbacks fired across the copy lifecycle, mirroring the events a
 * host component typically re-emits to its parent.
 */
export interface UseHapticCopyOptions {
  /**
   * Performs the actual clipboard write. Defaults to a no-op so the composable
   * can be wired incrementally.
   */
  copy?: HapticCopyAction
  /**
   * Turns a message key into the displayed tooltip text. Defaults to identity.
   */
  resolveMessage?: HapticCopyMessageResolver
  /**
   * Delay, in milliseconds, before the success/failure feedback is hidden.
   * Accepts a getter so a reactive delay is read afresh on every copy.
   */
  hideDelay?: number | (() => number)
  /**
   * Message key displayed when the copy succeeds.
   */
  succeedMessage?: string
  /**
   * Message key displayed when the copy fails.
   */
  failedMessage?: string
  /**
   * Called before the copy attempt starts.
   */
  onAttempt?: () => void
  /**
   * Called once the copy succeeds.
   */
  onSuccess?: () => void
  /**
   * Called with the thrown error when the copy fails.
   */
  onError?: (error: unknown) => void
  /**
   * Called when the feedback is hidden, either after the delay or on cleanup.
   */
  onHide?: () => void
}

/**
 * Reactive API returned by {@link useHapticCopy}.
 */
export interface UseHapticCopy {
  /**
   * Text currently displayed in the feedback tooltip.
   */
  tooltipContent: Ref<string>
  /**
   * Whether the feedback tooltip is visible.
   */
  showTooltip: Ref<boolean>
  /**
   * Pending hide timer handle. Doubles as the "feedback is showing" flag the
   * host template uses to swap the clipboard/check icons.
   */
  tooltipTimeout: Ref<ReturnType<typeof setTimeout> | undefined>
  /**
   * Run the copy action, surface success/failure feedback, then hide it after
   * the configured delay.
   */
  copy: () => Promise<void>
  /**
   * Show the feedback tooltip with the given (resolved) message.
   */
  openTooltip: (message?: string) => Promise<void>
  /**
   * Hide the feedback tooltip and clear any pending hide timer.
   */
  closeTooltip: () => Promise<void>
  /**
   * Reset the hide timer, then run `fn` after `delay` and a `nextTick` flush.
   */
  nextTimeout: (fn?: () => unknown, delay?: number) => Promise<unknown>
}

/**
 * Owns the transient "copied!" feedback shown after a clipboard write: the
 * tooltip message, its visibility, and the timer that resets it. The copy
 * itself is delegated to the {@link UseHapticCopyOptions.copy} action so the
 * composable stays agnostic of text vs HTML clipboard strategies.
 *
 * The single hide timer is always cleared before a new one is scheduled, so
 * repeated copies never stack overlapping resets, and it is cleared again on
 * unmount to avoid running after the host is gone.
 *
 * @param options - Copy action, message resolver, delay and lifecycle hooks
 *   (see {@link UseHapticCopyOptions}).
 * @returns The {@link UseHapticCopy} API: the `tooltipContent`, `showTooltip`
 *   and `tooltipTimeout` state plus the `copy`, `openTooltip`, `closeTooltip`
 *   and `nextTimeout` handlers.
 * @example
 * const { copy, tooltipContent, showTooltip } = useHapticCopy({
 *   copy: () => navigator.clipboard.writeText('hello'),
 *   resolveMessage: (key) => t(key),
 *   onSuccess: () => emit('success')
 * })
 */
export function useHapticCopy(options: UseHapticCopyOptions = {}): UseHapticCopy {
  const {
    copy: copyAction = noop,
    resolveMessage = (message: string) => message,
    hideDelay = 1e3,
    succeedMessage = 'haptic-copy.tooltip.succeed',
    failedMessage = 'haptic-copy.tooltip.failed',
    onAttempt,
    onSuccess,
    onError,
    onHide
  } = options

  const tooltipContent = ref<string>('')
  const tooltipTimeout = ref<ReturnType<typeof setTimeout> | undefined>(undefined)
  const showTooltip = ref(false)

  function openTooltip(message = succeedMessage): Promise<void> {
    tooltipContent.value = resolveMessage(message)
    showTooltip.value = true
    return Promise.resolve()
  }

  function closeTooltip(): Promise<void> {
    clearTimeout(tooltipTimeout.value)
    showTooltip.value = false
    tooltipTimeout.value = undefined
    onHide?.()
    return Promise.resolve()
  }

  // Reset the single hide timer before scheduling a new one so back-to-back
  // copies never leave a stale reset running.
  function nextTimeout(fn = noop, delay = 0): Promise<unknown> {
    clearTimeout(tooltipTimeout.value)
    return new Promise((resolve) => {
      tooltipTimeout.value = setTimeout(resolve, delay)
    })
      .finally(nextTick)
      .then(fn)
  }

  async function copy(): Promise<void> {
    try {
      onAttempt?.()
      await copyAction()
      await openTooltip(succeedMessage)
      onSuccess?.()
    }
    catch (error) {
      await openTooltip(failedMessage)
      onError?.(error)
    }
    // Hide the feedback once the delay elapses, reading a reactive delay afresh.
    const delay = typeof hideDelay === 'function' ? hideDelay() : hideDelay
    return nextTimeout(closeTooltip, delay)
  }

  onUnmounted(() => {
    closeTooltip()
  })

  return {
    tooltipContent,
    showTooltip,
    tooltipTimeout,
    copy,
    openTooltip,
    closeTooltip,
    nextTimeout
  }
}

export default useHapticCopy
