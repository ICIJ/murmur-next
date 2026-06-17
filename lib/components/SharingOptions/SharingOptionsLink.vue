<script lang="ts">
// Re-exported for backward compatibility: the share popup singleton and the
// per-network share endpoints now live in the composable.
export { $popup, networks } from '@/composables/useSharingOptionsLink'
</script>

<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/App/AppIcon.vue'
import { SharingPlatform } from '@/enums'
import {
  useSharingOptionsLink,
  type SharingValues
} from '@/composables/useSharingOptionsLink'

defineOptions({
  name: 'SharingOptionsLink'
})

export interface SharingOptionsLinkProps {
  /**
   * Root element type
   */
  tag?: string
  /**
   * Social network to use
   */
  network: SharingPlatform
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
   * Social media user handle
   */
  user?: string | null
  /**
   * Shared hashtags
   */
  hashtags?: string | null
}

const props = withDefaults(defineProps<SharingOptionsLinkProps>(), {
  tag: 'a',
  noIcon: false,
  url: null,
  title: null,
  description: null,
  media: null,
  user: null,
  hashtags: null
})

const sharingValues = computed((): SharingValues => {
  return {
    url: props.url,
    title: props.title,
    description: props.description,
    media: props.media,
    user: props.user,
    hashtags: props.hashtags
  }
})

const {
  base,
  args,
  iconComponent,
  query,
  href,
  name,
  hasPopup,
  openSharePopup,
  openPopup,
  cleanExistingPopupInstance
} = useSharingOptionsLink(() => props.network, sharingValues)

// Only intercept the click for networks that open a share popup; the email
// network keeps its native mailto: behavior.
function handleClick(event: Event): void {
  if (hasPopup()) {
    event.preventDefault()
    openSharePopup()
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
      <app-icon
        v-if="!noIcon && iconComponent"
        size="1.2em"
      >
        <component :is="iconComponent" />
      </app-icon>
      <span class="visually-hidden">{{ name }}</span>
    </slot>
  </component>
</template>
