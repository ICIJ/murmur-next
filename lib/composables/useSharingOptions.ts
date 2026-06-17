import get from 'lodash/get'
import reduce from 'lodash/reduce'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import config from '@/config'

/**
 * Default share values resolved once from the configuration and the document
 * meta tags. Network-specific overrides (e.g. `facebook_title`) are layered on
 * top of these when building a network's values.
 */
export interface MetaValuesMap {
  url: string
  title: string
  description: string
  facebook_title: string
  facebook_description: string
  facebook_media: string
}

/**
 * Resolves the share values handed to each social link.
 *
 * Default values are read from the library configuration and, unless disabled,
 * from the page meta tags. Consumer-provided `values` win over those defaults,
 * and {@link UseSharingOptionsReturn.valuesFor} picks the most specific value
 * for a network (e.g. `facebook_title` before the generic `title`).
 *
 * @param url - URL being shared (plain value, ref, or getter).
 * @param values - Consumer share values, generic or network-prefixed; may be reactive.
 * @param valuesKeys - Keys to inject into each social link (plain value, ref, or getter).
 * @param noMeta - When true, skip reading defaults from the document meta tags.
 * @returns The resolved default `metaValues` plus a `valuesFor(network)` builder.
 * @example
 * // Internal composable — import via relative path inside the library.
 * <script setup>
 * import { useSharingOptions } from '@/composables/useSharingOptions'
 *
 * const { valuesFor } = useSharingOptions(() => props.url, () => props.values)
 * const facebookValues = valuesFor('facebook')
 * </script>
 */
export function useSharingOptions(
  url: MaybeRefOrGetter<string | null | undefined>,
  values: MaybeRefOrGetter<Record<string, unknown>> = () => ({}),
  valuesKeys: MaybeRefOrGetter<string[]> = () => ['url', 'title', 'description', 'media', 'user'],
  noMeta: MaybeRefOrGetter<boolean> = false
) {
  // Read a default value from the page meta tags, falling back to the config.
  // When meta reading is disabled or no selector is given, use the config only.
  function defaultValueFor(key: string, metaSelector?: string): string {
    if (toValue(noMeta) || !metaSelector) {
      return config.get(key)
    }
    return get(document.head.querySelector(metaSelector), 'content', config.get(key))
  }

  const metaValues = computed((): MetaValuesMap => {
    return {
      url: toValue(url) ?? '',
      title: defaultValueFor('sharing-options.title'),
      description: defaultValueFor('sharing-options.description', 'meta[name="description"]'),
      facebook_title: defaultValueFor('sharing-options.facebook_title', 'meta[property="og:title"]'),
      facebook_description: defaultValueFor('sharing-options.description', 'meta[property="og:description"]'),
      facebook_media: defaultValueFor('sharing-options.media', 'meta[property="og:image"]')
    }
  })

  // Build the values for a network, preferring its prefixed key (e.g.
  // `facebook_title`) and falling back to the generic key (`title`).
  function valuesFor(network: string): Record<string, string> {
    const resolvedValues = Object.assign({}, metaValues.value, toValue(values))
    return reduce(
      toValue(valuesKeys),
      (res: Record<string, string>, key) => {
        res[key] = get(resolvedValues, `${network}_${key}`, resolvedValues[key])
        return res
      },
      {}
    )
  }

  return { metaValues, valuesFor }
}

export default useSharingOptions
