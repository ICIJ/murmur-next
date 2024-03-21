<script lang="ts">
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import {
  computed,
  CSSProperties,
  defineComponent,
  onBeforeMount,
  PropType,
  ref
} from 'vue'

import { default as Fa, library } from './Fa'

import EmbedForm from '@/components/EmbedForm.vue'
import SharingOptionsLink from '@/components/SharingOptionsLink.vue'
import config from '@/config'
import IframeResizer from '@/utils/iframe-resizer'
import { BModal, useModal } from 'bootstrap-vue-next'

type MetaValuesMap = {
  url: string
  title: string
  description: string
  facebook_title: string
  facebook_description: string
  facebook_media: string
  twitter_media: string
  twitter_user: string
}

/**
 * SharingOptions
 */
export default defineComponent({
  name: 'SharingOptions',
  components: {
    BModal,
    EmbedForm,
    SharingOptionsLink,
    Fa
  },
  props: {
    /**
     * URL to be shared.
     */
    url: {
      type: String,
      default: () =>
        config.get('sharing-options.url', null) ||
        IframeResizer.deletePymParams()
    },
    /**
     * URL to use specifically with the embed form
     */
    embedUrl: {
      type: String,
      default: null
    },
    /**
     * Direction of the sharing options. Can be: <em>row</em>, <em>row-reverse</em>,
     * <em>column</em> or <em>column-reverse</em>.
     */
    direction: {
      default: 'row',
      validator(value: string) {
        return (
          ['row', 'row-reverse', 'column', 'column-reverse'].indexOf(value) !==
          -1
        )
      }
    },
    /**
     * Sharing contents which can be generic (<em>title</em>, <em>description</em>, etc)
     * or specific to a network (<em>twitter_title</em>, <em>facebook_description</em>, etc).
     */
    values: {
      type: Object,
      default: () => ({})
    },
    /**
     * The list of all the keys to automatically inject in each social button.
     */
    valuesKeys: {
      default: () => ['url', 'title', 'description', 'media', 'user'],
      type: Array as PropType<string[]>
    },
    /**
     * Disable embed button.
     */
    noEmbed: {
      type: Boolean
    },
    /**
     * Minimum height of the iframe in the embed form.
     */
    iframeMinHeight: {
      type: Number,
      default: 100
    },
    /**
     * Minimum width of the iframe in the embed form.
     */
    iframeMinWidth: {
      type: Number,
      default: 100
    },
    /**
     * Prevent from reading default value from the <code>meta</code>.
     */
    noMeta: {
      type: Boolean
    }
  },
  setup(props) {
    onBeforeMount(() => {
      library.add(faCode)
    })

    const embedForm = ref(null)
    const { show } = useModal('embedForm')
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

    function valuesFor(network: string): { [key: string]: string } {
      const values = Object.assign(metaValues.value, props.values)
      return reduce(
        props.valuesKeys,
        (res: { [name: string]: string }, key) => {
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

    return {
      style,
      show,
      embedForm,
      valuesFor
    }
  }
})
</script>

<template>
  <div :style="style" class="sharing-options">
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
    <div
      v-show="!noEmbed"
      class="sharing-options__link sharing-options__link--embed"
    >
      <a @click="show">
        <fa icon="code" />
        <span class="sr-only">Embed</span>
      </a>
    </div>
    <b-modal
      id="embedForm"
      ref="embedForm"
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
@import '@/styles/lib';
@import '@/styles/mixins';

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
