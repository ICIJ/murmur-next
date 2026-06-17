import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

import IframeResizer from '@/utils/iframe-resizer'

/**
 * Reactive API returned by {@link useEmbeddableFooter}.
 */
export interface UseEmbeddableFooter {
  /**
   * Whether the sharing-options panel is currently visible.
   */
  showShareOptions: Ref<boolean>
  /**
   * Toggle the visibility of the sharing-options panel.
   */
  toggleShareOptions: () => void
}

/**
 * Owns the small amount of behaviour behind the `EmbeddableFooter` component:
 * the visibility state of the sharing-options panel and the mount-time setup of
 * the Pym child resizer, so an embedded footer can report its height to the
 * host page.
 *
 * The resizer is created for its side effect only (it wires up the Pym child);
 * the instance is intentionally not returned, matching the component's original
 * fire-and-forget behaviour.
 *
 * @returns The {@link UseEmbeddableFooter} API: the `showShareOptions` ref and
 *   the `toggleShareOptions` action.
 * @example
 * // Internal building block of the `EmbeddableFooter` component; not exported
 * // from the package root. Inside a `<script setup>` block:
 * import { useEmbeddableFooter } from '@/composables/useEmbeddableFooter'
 *
 * const { showShareOptions, toggleShareOptions } = useEmbeddableFooter()
 */
export function useEmbeddableFooter(): UseEmbeddableFooter {
  const showShareOptions = ref(false)

  function toggleShareOptions(): void {
    showShareOptions.value = !showShareOptions.value
  }

  // Reporting the embedded height to the host page is a pure mount-time side
  // effect, so the created resizer is left unreferenced on purpose.
  onMounted(() => {
    IframeResizer.create()
  })

  return { showShareOptions, toggleShareOptions }
}

export default useEmbeddableFooter
