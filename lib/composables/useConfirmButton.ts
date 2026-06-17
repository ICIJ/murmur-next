import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Event names emitted by the `ButtonConfirm` component, in the order the
 * composable may trigger them.
 */
export type ConfirmButtonEvent = 'toggled' | 'cancelled' | 'confirmed'

/**
 * Minimal emit signature accepted by {@link useConfirmButton}. It matches the
 * `defineEmits` return of the host component so the composable can forward the
 * confirmation lifecycle events without owning the component instance.
 */
export type ConfirmButtonEmit = (event: ConfirmButtonEvent, ...args: unknown[]) => void

/**
 * Optional callbacks invoked alongside the emitted events, mirroring the
 * `confirmed`/`cancelled` props of the `ButtonConfirm` component.
 */
export interface UseConfirmButtonOptions {
  /**
   * Called when the user confirms, before the `confirmed` event is emitted.
   */
  onConfirmed?: () => void
  /**
   * Called when the user cancels, before the `cancelled` event is emitted.
   */
  onCancelled?: () => void
}

/**
 * Reactive API returned by {@link useConfirmButton}.
 */
export interface UseConfirmButton {
  /**
   * Whether the confirmation tooltip is currently visible.
   */
  showTooltip: Ref<boolean>
  /**
   * Flip the tooltip visibility and emit the resulting state.
   */
  toggle: () => void
  /**
   * Hide the tooltip, run the cancellation callback, then emit `cancelled`.
   */
  cancel: () => void
  /**
   * Hide the tooltip, run the confirmation callback, then emit `confirmed`.
   */
  confirm: () => void
}

/**
 * Owns the show/hide state of a confirmation tooltip and the cancel/confirm
 * lifecycle. Hiding always emits `toggled(false)` so listeners stay in sync,
 * and the matching callback runs before its event is emitted.
 *
 * @param emit - The host component's emit function for the confirmation events.
 * @param options - Optional confirm/cancel callbacks (see {@link UseConfirmButtonOptions}).
 * @returns The {@link UseConfirmButton} API: the `showTooltip` state plus the
 *   `toggle`, `cancel`, and `confirm` handlers.
 * @example
 * const emit = defineEmits(['toggled', 'cancelled', 'confirmed'])
 * const { showTooltip, toggle, cancel, confirm } = useConfirmButton(emit, {
 *   onConfirmed: () => props.confirmed?.(),
 *   onCancelled: () => props.cancelled?.()
 * })
 */
export function useConfirmButton(
  emit: ConfirmButtonEmit,
  options: UseConfirmButtonOptions = {}
): UseConfirmButton {
  const { onConfirmed, onCancelled } = options

  const showTooltip = ref<boolean>(false)

  function toggle(): void {
    showTooltip.value = !showTooltip.value
    emit('toggled', showTooltip.value)
  }

  // Collapsing the tooltip is shared by cancel and confirm, and always reports
  // the closed state so external listeners mirror the component.
  function hide(): void {
    showTooltip.value = false
    emit('toggled', false)
  }

  function cancel(): void {
    hide()
    onCancelled?.()
    emit('cancelled')
  }

  function confirm(): void {
    hide()
    onConfirmed?.()
    emit('confirmed')
  }

  return { showTooltip, toggle, cancel, confirm }
}

export default useConfirmButton
