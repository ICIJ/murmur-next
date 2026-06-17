<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'

import EmbedForm from '@/components/Form/FormEmbed.vue'
import AppIcon from '@/components/App/AppIcon.vue'
import SharingOptionsLink from '@/components/SharingOptions/SharingOptionsLink.vue'
import config from '@/config'
import IframeResizer from '@/utils/iframe-resizer'
import { useSharingOptions } from '@/composables/useSharingOptions'
import { BModal } from 'bootstrap-vue-next'

export interface SharingOptionsProps {
  /**
   * URL to be shared.
   */
  url?: string
  /**
   * URL to use specifically with the embed form
   */
  embedUrl?: string | null
  /**
   * Direction of the sharing options. Can be: 'row', 'row-reverse', 'column' or 'column-reverse'.
   */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  /**
   * Sharing contents which can be generic (title, description, etc.)
   * or specific to a network (twitter_title, facebook_description, etc.).
   */
  values?: Record<string, unknown>
  /**
   * The list of all the keys to automatically inject in each social button.
   */
  valuesKeys?: string[]
  /**
   * Disable embed button.
   */
  noEmbed?: boolean
  /**
   * Minimum height of the iframe in the embed form.
   */
  iframeMinHeight?: number
  /**
   * Minimum width of the iframe in the embed form.
   */
  iframeMinWidth?: number
  /**
   * Prevent from reading default value from the meta tags.
   */
  noMeta?: boolean
}

const props = withDefaults(defineProps<SharingOptionsProps>(), {
  url: () => config.get('sharing-options.url', null) || IframeResizer.deletePymParams(),
  embedUrl: null,
  direction: 'row',
  values: () => ({}),
  valuesKeys: () => ['url', 'title', 'description', 'media', 'user'],
  noEmbed: false,
  iframeMinHeight: 100,
  iframeMinWidth: 100,
  noMeta: false
})

const showEmbedForm = ref(false)
function showEmbed(): void {
  showEmbedForm.value = true
}

const style = computed((): CSSProperties => {
  return {
    'flex-direction': props.direction
  } as CSSProperties
})

const { valuesFor } = useSharingOptions(
  () => props.url,
  () => props.values,
  () => props.valuesKeys,
  () => props.noMeta
)

// Exposed so consumers (and tests) can resolve a network's share values.
defineExpose({
  valuesFor
})
</script>

<template>
  <div
    :style="style"
    class="sharing-options"
  >
    <sharing-options-link
      class="sharing-options__link"
      network="facebook"
      v-bind="valuesFor('facebook')"
    />
    <sharing-options-link
      class="sharing-options__link"
      network="bluesky"
      v-bind="valuesFor('bluesky')"
    />
    <sharing-options-link
      class="sharing-options__link"
      network="linkedin"
      v-bind="valuesFor('linkedin')"
    />
    <sharing-options-link
      class="sharing-options__link"
      network="email"
      v-bind="valuesFor('email')"
    />
    <a
      v-show="!noEmbed"
      class="sharing-options__link sharing-options__link--embed"
      @click="showEmbed"
    >
      <app-icon>
        <i-ph-code-bold />
      </app-icon>
      <span class="visually-hidden">Embed</span>
    </a>
    <b-modal
      v-model="showEmbedForm"
      class="text-dark"
      no-footer
      title="Embed on your website"
    >
      <embed-form
        :min-height="iframeMinHeight"
        :min-width="iframeMinWidth"
        :url="embedUrl || url"
        no-preview
        no-title
      />
    </b-modal>
  </div>
</template>

<style lang="scss">

@import '../../styles/mixins';

.sharing-options {
  display: flex;

  &__link {
    display: block;
    margin: $spacer * 0.25;
    background: black;
    height: 2.5em;
    line-height: 2.5em;
    width: 2.5em;
    text-align: center;
    font-size: 80%;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    & > a,
    & > button {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      display: block;
      background: transparent !important;
      text-decoration: none;
      opacity: 1;
    }

    .svg-inline--fa {
      color: white;
    }
  }
}
</style>
