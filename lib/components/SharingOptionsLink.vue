<script lang="ts">
import querystring from 'querystring-es3'
import reduce from 'lodash/reduce'
import noop from 'lodash/noop'
import get from 'lodash/get'
import { h, defineComponent, PropType, VNode } from 'vue'

import PhosphorIcon from '@/components/PhosphorIcon.vue'

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

// Prevent propagation when an event is fired through the given callback
const preventDefault = (callback: Function) => {
  return (event: Event) => {
    event && event.preventDefault()
    callback()
  }
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

/**
 * SharingOptionsLink
 */
export default defineComponent({
  name: 'SharingOptionsLink',
  components: {
    PhosphorIcon
  },
  props: {
    /**
     * Root element type
     */
    tag: {
      type: String,
      default: 'a'
    },
    /**
     * Social network to use
     */
    network: {
      type: String as PropType<Platform>,
      required: true,
      validator(val: string) {
        return Object.keys(networks).includes(val)
      }
    },
    /**
     * Disable icon
     */
    noIcon: {
      type: Boolean
    },
    /**
     * Shared URL
     */
    url: {
      type: String,
      default: null
    },
    /**
     * Shared text
     */
    title: {
      type: String,
      default: null
    },
    /**
     * Shared description
     */
    description: {
      type: String,
      default: null
    },
    /**
     * Shared image
     */
    media: {
      type: String,
      default: null
    },
    /**
     * Twitter user
     */
    user: {
      type: String,
      default: null
    },
    /**
     * Shared hashtags
     */
    hashtags: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      popup: {
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
      }
    }
  },
  computed: {
    href(): string {
      return this.base + querystring.stringify(this.query)
    },
    base(): string {
      return get(networks, [this.network, 'base'], '')
    },
    args(): Record<string, string> {
      return get(networks, [this.network, 'args'], {})
    },
    icon(): string | null {
      return get(networks, [this.network, 'icon'], null)
    },
    query(): any {
      return reduce(
        this.args,
        (obj, prop, param) => {
          // @ts-ignore
          if (this.$props[prop]) {
            // @ts-ignore
            obj[param] = this.$props[prop]
          }
          return obj
        },
        {}
      )
    },
    name(): string {
      return get(networks, [this.network, 'name'], this.network)
    },
    popupParams(): string {
      return querystring.stringify(this.popup).split('&').join(',')
    }
  },
  methods: {
    click(): void {
      this.cleanExistingPopupInstance()
      this.openPopup()
    },
    renderIcon(): void | VNode | null {
      if (!this.noIcon) {
        // @ts-ignore
        return h(PhosphorIcon, { name: this.icon, weight: 'fill' })
      }
    },
    openPopup(): void {
      // Create the popup
      $popup.instance = $popup.parent?.open(
        this.href,
        'sharer',
        this.popupParams
      )
      $popup.instance?.focus()
      // Watch for popup closing
      $popup.interval = setInterval(this.cleanExistingPopupInterval, 500)
    },
    cleanExistingPopupInstance(): void {
      if ($popup.instance && $popup.interval) {
        clearInterval($popup.interval)
        $popup.interval = undefined
        $popup.instance.close()
      }
    },
    cleanExistingPopupInterval() {
      if ($popup.instance && $popup.instance.closed) {
        clearInterval($popup.interval)
        $popup.interval = undefined
        $popup.instance = null
      }
    },
    hasPopup(): boolean {
      return this.network !== 'email'
    }
  },
  render(): void | VNode | null {
    const click = this.hasPopup() ? preventDefault(this.click) : noop
    const href = this.href
    const children = this.$slots.default
      ? this.$slots.default()
      : [this.renderIcon(), h('span', { class: 'visually-hidden' }, this.name)]
    return h(this.tag, { attrs: { href }, onClick: click }, children)
  }
})
</script>
