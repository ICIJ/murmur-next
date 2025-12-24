<script lang="ts">
// Popup instance and an interval holder
interface Popup {
  instance: Window | null | undefined
  interval: undefined | ReturnType<typeof setTimeout>
  parent: (Window & typeof globalThis) | null
}

export const $popup: Popup = {
  instance: null,
  interval: undefined,
  parent: typeof window !== 'undefined' ? window : null
}

interface SharingPlatform {
  base: string
  icon: string
  args: Record<string, string>
}
type Platform = 'email' | 'facebook' | 'linkedin' | 'twitter' | 'x'

type SharingPlatforms = Record<Platform, SharingPlatform>
/**
 * @source https://github.com/bradvin/social-share-urls
 */
export const networks: SharingPlatforms = {
  email: {
    base: 'mailto:?',
    icon: 'envelope',
    args: {
      subject: 'title',
      body: 'description'
    }
  },
  facebook: {
    base: 'https://www.facebook.com/sharer.php?',
    icon: 'facebook-logo',
    args: {
      u: 'url',
      title: 'title',
      description: 'description',
      hashtag: 'hashtags'
    }
  },
  linkedin: {
    base: 'https://www.linkedin.com/sharing/share-offsite/?',
    icon: 'linkedin-logo',
    args: {
      url: 'url',
      title: 'title',
      summary: 'description'
    }
  },
  twitter: {
    base: 'https://x.com/intent/tweet?',
    icon: 'x-logo',
    args: {
      url: 'url',
      text: 'title',
      via: 'user',
      hashtags: 'hashtags'
    }
  },
  x: {
    base: 'https://x.com/intent/tweet?',
    icon: 'x-logo',
    args: {
      url: 'url',
      text: 'title',
      via: 'user',
      hashtags: 'hashtags'
    }
  }
}
</script>

<script setup lang="ts">
import querystring from 'querystring-es3'
import reduce from 'lodash/reduce'
import get from 'lodash/get'
import { computed, reactive } from 'vue'

import PhosphorIcon from '@/components/PhosphorIcon/PhosphorIcon.vue'

defineOptions({
  name: 'SharingOptionsLink'
})

const props = withDefaults(defineProps<{
  /**
   * Root element type
   */
  tag?: string
  /**
   * Social network to use
   */
  network: Platform
  /**
   * Disable icon
   */
  noIcon?: boolean
  /**
   * Shared URL
   */
  url?: string | null
  /**
   * Shared text
   */
  title?: string | null
  /**
   * Shared description
   */
  description?: string | null
  /**
   * Shared image
   */
  media?: string | null
  /**
   * Twitter user
   */
  user?: string | null
  /**
   * Shared hashtags
   */
  hashtags?: string | null
}>(), {
  tag: 'a',
  noIcon: false,
  url: null,
  title: null,
  description: null,
  media: null,
  user: null,
  hashtags: null
})

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

const href = computed((): string => {
  return base.value + querystring.stringify(query.value)
})

const base = computed((): string => {
  return get(networks, [props.network, 'base'], '')
})

const args = computed((): Record<string, string> => {
  return get(networks, [props.network, 'args'], {})
})

const icon = computed((): string | null => {
  return get(networks, [props.network, 'icon'], null)
})

const query = computed((): any => {
  return reduce(
    args.value,
    (obj, prop, param) => {
      if (props[prop]) {
        obj[param] = props[prop]
      }
      return obj
    },
    {}
  )
})

const name = computed((): string => {
  return get(networks, [props.network, 'name'], props.network)
})

const popupParams = computed((): string => {
  return querystring.stringify(popup).split('&').join(',')
})

function click(): void {
  cleanExistingPopupInstance()
  openPopup()
}

function openPopup(): void {
  // Create the popup
  $popup.instance = $popup.parent?.open(
    href.value,
    'sharer',
    popupParams.value
  )
  $popup.instance?.focus()
  // Watch for popup closing
  $popup.interval = setInterval(cleanExistingPopupInterval, 500)
}

function cleanExistingPopupInstance(): void {
  if ($popup.instance && $popup.interval) {
    clearInterval($popup.interval)
    $popup.interval = undefined
    $popup.instance.close()
  }
}

function cleanExistingPopupInterval() {
  if ($popup.instance && $popup.instance.closed) {
    clearInterval($popup.interval)
    $popup.interval = undefined
    $popup.instance = null
  }
}

function hasPopup(): boolean {
  return props.network !== 'email'
}

function handleClick(event: Event): void {
  if (hasPopup()) {
    event.preventDefault()
    click()
  }
}

defineExpose({
  base,
  args,
  query,
  hasPopup,
  openPopup,
  cleanExistingPopupInstance
})
</script>

<template>
  <component
    :is="tag"
    :href="href"
    @click="handleClick"
  >
    <slot>
      <phosphor-icon
        v-if="!noIcon"
        :name="icon"
        weight="fill"
      />
      <span class="visually-hidden">{{ name }}</span>
    </slot>
  </component>
</template>
