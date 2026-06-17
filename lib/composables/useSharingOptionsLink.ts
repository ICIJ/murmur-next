import querystring from 'querystring-es3'
import reduce from 'lodash/reduce'
import get from 'lodash/get'
import { computed, onUnmounted, reactive, toValue, type Component, type MaybeRefOrGetter } from 'vue'

import { SharingPlatform } from '@/enums'
import IPhEnvelope from '~icons/ph/envelope-bold'
import IPhFacebookLogoFill from '~icons/ph/facebook-logo-fill'
import IPhLinkedinLogoFill from '~icons/ph/linkedin-logo-fill'
import IPhButterflyFill from '~icons/ph/butterfly-fill'

/**
 * Description of a single social network share endpoint: the base share URL,
 * the icon to display, and the mapping from query parameter to share value key.
 */
export interface SharingPlatformConfig {
  base: string
  icon: Component
  args: Record<string, string>
}

type SharingPlatforms = Record<SharingPlatform, SharingPlatformConfig>

/**
 * Per-network share endpoints. Each `args` entry maps the network's own query
 * parameter name to the generic share value key it should receive.
 *
 * @source https://github.com/bradvin/social-share-urls
 */
export const networks: SharingPlatforms = {
  email: {
    base: 'mailto:?',
    icon: IPhEnvelope,
    args: {
      subject: 'title',
      body: 'description'
    }
  },
  facebook: {
    base: 'https://www.facebook.com/sharer.php?',
    icon: IPhFacebookLogoFill,
    args: {
      u: 'url',
      title: 'title',
      description: 'description',
      hashtag: 'hashtags'
    }
  },
  linkedin: {
    base: 'https://www.linkedin.com/sharing/share-offsite/?',
    icon: IPhLinkedinLogoFill,
    args: {
      url: 'url',
      title: 'title',
      summary: 'description'
    }
  },
  bluesky: {
    base: 'https://bsky.app/intent/compose?',
    icon: IPhButterflyFill,
    args: {
      text: 'title',
      url: 'url'
    }
  }
}

/**
 * Holds the single share popup window shared across every link instance, plus
 * the interval that polls for its closing. Kept module-level so that all links
 * cooperate on (and tear down) the same popup.
 */
export interface SharingPopup {
  instance: Window | null | undefined
  interval: undefined | ReturnType<typeof setTimeout>
  parent: (Window & typeof globalThis) | null
}

/**
 * @internal Module-level singleton, not part of the public API. Re-exported
 * from SharingOptionsLink.vue only so the existing component spec can poke it.
 */
export const $popup: SharingPopup = {
  instance: null,
  interval: undefined,
  parent: typeof window !== 'undefined' ? window : null
}

/**
 * Generic share values a link can carry. Each key maps onto a network query
 * parameter through the network's `args` configuration.
 */
export interface SharingValues {
  url?: string | null
  title?: string | null
  description?: string | null
  media?: string | null
  user?: string | null
  hashtags?: string | null
}

type SharingValueKey = keyof SharingValues

/**
 * Builds the share URL for a social network and drives the share popup window.
 *
 * The URL building (`base`, `args`, `query`, `href`) is pure and deterministic,
 * derived only from the target network and the share values. The popup helpers
 * cooperate on a single module-level window ({@link $popup}) so concurrent links
 * never leave orphaned popups or polling intervals behind.
 *
 * @param network - Target social network (plain value, ref, or getter).
 * @param values - Generic share values (url, title, description, …); may be reactive.
 * @returns Reactive share-link state plus popup lifecycle helpers.
 * @example
 * // Internal building block — import via relative path inside the library.
 * <script setup>
 * import { useSharingOptionsLink } from '@/composables/useSharingOptionsLink'
 *
 * const { href, openSharePopup } = useSharingOptionsLink('facebook', { url: 'https://icij.org' })
 * </script>
 */
export function useSharingOptionsLink(
  network: MaybeRefOrGetter<SharingPlatform>,
  values: MaybeRefOrGetter<SharingValues>
) {
  // Popup window geometry and chrome, serialized as window.open features.
  const popup = reactive({
    status: 'no',
    resizable: 'yes',
    toolbar: 'no',
    menubar: 'no',
    scrollbars: 'no',
    location: 'no',
    directories: 'no',
    width: 626,
    height: 436,
    top: 0,
    left: 0,
    screenY: 0,
    screenX: 0
  })

  const base = computed((): string => {
    return get(networks, [toValue(network), 'base'], '')
  })

  const args = computed((): Record<string, string> => {
    return get(networks, [toValue(network), 'args'], {})
  })

  const iconComponent = computed((): Component | null => {
    return get(networks, [toValue(network), 'icon'], null)
  })

  // Map each network query parameter to its share value, skipping empty values.
  const query = computed((): Record<string, string> => {
    const sharingValues = toValue(values)
    return reduce(
      args.value,
      (obj: Record<string, string>, valueKey: string, param: string) => {
        const value = sharingValues[valueKey as SharingValueKey]
        if (value) {
          obj[param] = value
        }
        return obj
      },
      {}
    )
  })

  const href = computed((): string => {
    return base.value + querystring.stringify(query.value)
  })

  // NOTE: latent quirk preserved from the original — no network entry carries a
  // `name` key, so this lookup always falls back to the network id itself.
  const name = computed((): string => {
    return get(networks, [toValue(network), 'name'], toValue(network))
  })

  // window.open expects a comma-separated feature string, not a query string.
  const popupParams = computed((): string => {
    return querystring.stringify(popup).split('&').join(',')
  })

  // The email network opens the default mail client, not a popup window.
  function hasPopup(): boolean {
    return toValue(network) !== SharingPlatform.email
  }

  function openPopup(): void {
    $popup.instance = $popup.parent?.open(href.value, 'sharer', popupParams.value)
    $popup.instance?.focus()
    // Poll for the popup closing so we can reset the shared state afterwards.
    $popup.interval = setInterval(cleanExistingPopupInterval, 500)
  }

  function cleanExistingPopupInstance(): void {
    if ($popup.instance && $popup.interval) {
      clearInterval($popup.interval)
      $popup.interval = undefined
      $popup.instance.close()
    }
  }

  function cleanExistingPopupInterval(): void {
    if ($popup.instance && $popup.instance.closed) {
      clearInterval($popup.interval)
      $popup.interval = undefined
      $popup.instance = null
    }
  }

  function openSharePopup(): void {
    cleanExistingPopupInstance()
    openPopup()
  }

  // Tear down the polling interval (and any open popup) on unmount, otherwise
  // the setInterval started in openPopup() keeps firing against a destroyed
  // instance.
  onUnmounted(() => {
    cleanExistingPopupInstance()
  })

  return {
    base,
    args,
    iconComponent,
    query,
    href,
    name,
    popupParams,
    hasPopup,
    openPopup,
    openSharePopup,
    cleanExistingPopupInstance,
    cleanExistingPopupInterval
  }
}

export default useSharingOptionsLink
