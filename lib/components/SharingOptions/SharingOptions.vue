<script setup lang="ts">
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import uniqueId from 'lodash/uniqueId'
import {
  computed,
  type CSSProperties
} from 'vue'

import EmbedForm from '@/components/Form/FormEmbed.vue'
import AppIcon from '@/components/App/AppIcon.vue'
import SharingOptionsLink from '@/components/SharingOptions/SharingOptionsLink.vue'
import config from '@/config'
import IframeResizer from '@/utils/iframe-resizer'
import { BModal, useModal } from 'bootstrap-vue-next'

interface MetaValuesMap {
  url: string
  title: string
  description: string
  facebook_title: string
  facebook_description: string
  facebook_media: string
  twitter_media: string
  twitter_user: string
}

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

const embedFormId = uniqueId('embed-form-')
const { show } = useModal(embedFormId)
const style = computed((): CSSProperties => {
  return {
    'flex-direction': props.direction
  } as CSSProperties
})

const metaValues = computed((): MetaValuesMap => {
  return {
    url: props.url ?? '',
    title: defaultValueFor('sharing-options.title'),
    description: defaultValueFor(
      'sharing-options.description',
      'meta[name="description]'
    ),
    facebook_title: defaultValueFor(
      'sharing-options.facebook_title',
      'meta[property="og:title"]'
    ),
    facebook_description: defaultValueFor(
      'sharing-options.description',
      'meta[property="og:description"]'
    ),
    facebook_media: defaultValueFor(
      'sharing-options.media',
      'meta[property="og:image"]'
    ),
    twitter_media: defaultValueFor(
      'sharing-options.media',
      'meta[name="twitter:image"]'
    ),
    twitter_user: defaultValueFor(
      'sharing-options.twitter-user',
      'meta[name="twitter:site"]'
    )
  }
})

function valuesFor(network: string): Record<string, string> {
  const values = Object.assign(metaValues.value, props.values)
  return reduce(
    props.valuesKeys,
    (res: Record<string, string>, key) => {
      res[key] = get(values, `${network}_${key}`, values[key])
      return res
    },
    {}
  )
}

function defaultValueFor(key: string, metaSelector?: string): string {
  if (props.noMeta || !metaSelector) {
    return config.get(key)
  }
  return get(
    document.head.querySelector(metaSelector),
    'content',
    config.get(key)
  )
}
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
      network="twitter"
      v-bind="valuesFor('twitter')"
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
      @click="show"
    >
      <app-icon><i-ph-code /></app-icon>
      <span class="visually-hidden">Embed</span>
    </a>
    <b-modal
      :id="embedFormId"
      class="text-dark"
      hide-footer
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
