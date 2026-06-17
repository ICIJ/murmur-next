import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { toValue } from 'vue'
import type { Parent } from 'pym.js'

import { injectAssets } from '@/utils/assets'

declare global {
  interface Window {
    pym: { Parent: new (id: string, url: string, options: object) => Parent }
  }
}

// Hosted Pym.js parent bundle; embedding ICIJ pages report their height through it.
const PYM_PARENT_SCRIPT_URL = 'https://pym.nprapps.org/pym.v1.min.js'

/**
 * Prefix shared by every container id so generated ids stay recognisable and
 * collision-free across ICIJ embeds.
 */
type StartsWithIcijIframe = `icij-iframe-${string}`

/**
 * Reactive options driving the responsive iframe. They mirror the `url` and
 * `options` props of the `ResponsiveIframe` component.
 */
export interface UseResponsiveIframeOptions {
  /**
   * URL of the generated iframe code, loaded by the Pym parent.
   */
  url: MaybeRefOrGetter<string>
  /**
   * Options forwarded to the constructor of the Pym parent instance.
   */
  options?: MaybeRefOrGetter<object | undefined>
}

/**
 * Reactive API returned by {@link useResponsiveIframe}.
 */
export interface UseResponsiveIframe {
  /**
   * Unique id to bind on the container element the Pym parent mounts into.
   */
  iframeId: Ref<StartsWithIcijIframe>
  /**
   * The live Pym parent instance, or `null` until it is created on mount.
   */
  pymParent: Ref<Parent | null>
}

// Build a unique container id from the host component instance id, falling back
// to a random value when no instance is available (for example outside setup).
function generateIframeId(): StartsWithIcijIframe {
  const instance = getCurrentInstance()
  return `icij-iframe-${instance?.uid ?? Math.random()}`
}

/**
 * Owns the parent side of the Pym.js resize messaging for the
 * `ResponsiveIframe` component: generates a unique container id, lazily loads
 * the Pym parent bundle on mount, creates the Pym parent that listens for
 * height messages from the embedded page, and tears it down on unmount.
 *
 * @param options - Reactive iframe options (see {@link UseResponsiveIframeOptions}).
 * @returns The {@link UseResponsiveIframe} API: the `iframeId` ref to bind on
 *   the container element and the live `pymParent` ref.
 * @example
 * // Internal building block of the `ResponsiveIframe` component; not exported
 * // from the package root. Inside a `<script setup>` block:
 * import { useResponsiveIframe } from '@/composables/useResponsiveIframe'
 *
 * const props = defineProps<{ url: string, options?: object }>()
 * const { iframeId } = useResponsiveIframe({
 *   url: () => props.url,
 *   options: () => props.options
 * })
 */
export function useResponsiveIframe(
  options: UseResponsiveIframeOptions
): UseResponsiveIframe {
  const { url, options: parentOptions } = options

  const iframeId = ref<StartsWithIcijIframe>(generateIframeId())
  const pymParent = ref<Parent | null>(null)

  onMounted(async (): Promise<void> => {
    await injectAssets(PYM_PARENT_SCRIPT_URL)
    pymParent.value = new window.pym.Parent(
      iframeId.value,
      toValue(url),
      toValue(parentOptions) ?? {}
    )
  })

  onUnmounted(() => {
    pymParent.value?.remove?.()
  })

  return { iframeId, pymParent }
}

export default useResponsiveIframe
