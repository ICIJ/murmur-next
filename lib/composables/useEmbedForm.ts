import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import IframeResizer from '@/utils/iframe-resizer'

/**
 * Reactive inputs driving the embed-snippet derivation. They mirror the sizing
 * props of the `FormEmbed` component, accepted as plain values, refs or getters
 * so the composable stays adaptable to how the caller wires its props.
 */
export interface UseEmbedFormOptions {
  /**
   * URL to embed. When omitted (`null`/`undefined`), the current window
   * location is used instead.
   */
  url: MaybeRefOrGetter<string | null | undefined>
  /**
   * Iframe width. A string (e.g. `'100%'`) is used verbatim; a number is
   * clamped to `minWidth` before being stringified.
   */
  width: MaybeRefOrGetter<number | string>
  /**
   * Iframe height in pixels, clamped to `minHeight` before being stringified.
   */
  height: MaybeRefOrGetter<number>
  /**
   * Lower bound applied to a numeric `width`.
   */
  minWidth: MaybeRefOrGetter<number>
  /**
   * Lower bound applied to `height`.
   */
  minHeight: MaybeRefOrGetter<number>
}

/**
 * Reactive API returned by {@link useEmbedForm}.
 */
export interface UseEmbedForm {
  /**
   * The resolved URL to embed: the provided `url` when set, otherwise the
   * current window location.
   */
  currentUrl: ComputedRef<string>
  /**
   * Builds the embeddable HTML snippet for the current URL and sizing.
   *
   * @param withPym - When `true`, emit the responsive Pym.js snippet; otherwise
   *   emit a plain `<iframe>`.
   * @returns The HTML snippet to copy or preview.
   */
  embedCode: (withPym?: boolean) => string
}

// Build a plain iframe snippet for the given URL and sizing, stripping any
// Pym.js parameters from the source URL first.
function iframeCodeFor(url: string, width: string, height: string): string {
  const src = IframeResizer.deletePymParams(url)
  return `<iframe width="${width}" height="${height}" src="${src}" frameborder="0" allowfullscreen></iframe>`
}

// Build the responsive Pym.js snippet for the given URL.
function pymCodeFor(url: string): string {
  return IframeResizer.template(url)
}

/**
 * Owns the embed-snippet generation for the `FormEmbed` component: resolves the
 * URL to embed (explicit prop or current location), clamps the numeric sizing
 * to its minimums, and builds either a plain `<iframe>` or the responsive
 * Pym.js snippet.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive sizing and URL inputs (see {@link UseEmbedFormOptions}).
 * @returns The {@link UseEmbedForm} API: the resolved `currentUrl` and the
 *   `embedCode` snippet builder.
 * @example
 * import { useEmbedForm } from '@/composables/useEmbedForm'
 *
 * const { currentUrl, embedCode } = useEmbedForm({
 *   url: () => props.url,
 *   width: () => props.width,
 *   height: () => props.height,
 *   minWidth: () => props.minWidth,
 *   minHeight: () => props.minHeight
 * })
 * const snippet = embedCode(true)
 */
export function useEmbedForm(options: UseEmbedFormOptions): UseEmbedForm {
  const { url, width, height, minWidth, minHeight } = options

  const currentUrl = computed((): string => {
    return toValue(url) || window?.location?.href
  })

  function embedCode(withPym = false): string {
    const widthValue = toValue(width)
    // A string width (e.g. a percentage) is used as-is; a numeric width is
    // clamped to its minimum before being stringified.
    const resolvedWidth
      = typeof widthValue === 'string'
        ? widthValue
        : Math.max(widthValue, toValue(minWidth)).toString()
    const resolvedHeight = Math.max(toValue(height), toValue(minHeight)).toString()

    return withPym
      ? pymCodeFor(currentUrl.value)
      : iframeCodeFor(currentUrl.value, resolvedWidth, resolvedHeight)
  }

  return {
    currentUrl,
    embedCode
  }
}

export default useEmbedForm
