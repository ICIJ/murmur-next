<template>
  <div class="embed-form">
    <div class="container-fluid">
      <h4
        v-if="!noTitle"
        class="embed-form__heading"
      >
        {{ t('embed-form.heading') }}
      </h4>
      <div class="row">
        <div class="col">
          <p>
            {{ t('embed-form.introduction') }}
          </p>
          <textarea
            ref="embed-form__code"
            class="form-control embed-form__code mb-2"
            readonly
            :value="embedCode()"
            @click="selectCode"
          />

          <div class="d-flex justify-content-between">
            <div class="form-check align-self-end">
              <input
                id="responsiveOptin"
                v-model="responsiveCheck"
                type="checkbox"
                class="form-check-input"
              >
              <label
                class="form-check-label fw-bold"
                for="responsiveOptin"
              >
                {{ t('embed-form.responsive-optin') }}
              </label>
            </div>

            <haptic-copy
              class="btn-link btn-sm text-uppercase fw-bold"
              :text="embedCode()"
              :label="t('embed-form.copy').toString()"
              @attempt="selectCode()"
            />
          </div>
        </div>
        <div
          v-if="!noPreview"
          class="col-7 d-none d-lg-block embed-form__preview"
        >
          <!-- eslint-disable vue/no-v-html -->
          <span v-html="embedCode(false)" />
          <!-- eslint-enable -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import { useI18n } from 'vue-i18n'
import HapticCopy from '@/components/HapticCopy.vue'
import IframeResizer from '@/utils/iframe-resizer'

interface ComponentInterface {
  currentUrl: string
  responsiveCheck: boolean
  width: string
  minWidth: number
  height: number
  minHeight: number
  iframeCodeFor: Function
  pymCodeFor: Function
}
/**
 * Embed Form
 */
export default defineComponent({
  name: 'EmbedForm',
  components: {
    HapticCopy
  },
  props: {
    /**
     * Hide the form title
     */
    noTitle: {
      type: Boolean
    },
    /**
     * Hide the preview panel
     */
    noPreview: {
      type: Boolean
    },
    /**
     * Default width of the iframe code
     */
    width: {
      type: [Number, String],
      default: '100%'
    },
    /**
     * Default height of the iframe code
     */
    height: {
      type: Number,
      default: () => window.innerHeight
    },
    /**
     * Default minimal width of the iframe code (if extract from window\'s size)
     */
    minWidth: {
      type: Number,
      default: 0
    },
    /**
     * Default minimal height of the iframe code (if extract from window\'s size)
     */
    minHeight: {
      type: Number,
      default: 0
    },
    /**
     * URL of the iframe code
     */
    url: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const { t } = useI18n()

    const responsiveCheck = ref(false)
    const embedFormCode = ref<HTMLTextAreaElement | null>(null)
    const currentUrl = computed(() => {
      return props.url || window?.location?.href
    })
    function iframeCodeFor(_url = currentUrl, width: string, height: string) {
      return `<iframe width="${width}" height="${height}" src="${IframeResizer.deletePymParams(
        props.url
      )}" frameborder="0" allowfullscreen></iframe>`
    }
    function pymCodeFor(url = currentUrl): string {
      return IframeResizer.template(url.value)
    }
    function selectCode(): void {
      embedFormCode.value?.select()
    }
    function embedCode(withPym = responsiveCheck.value): string {
      const width
        = typeof props.width === 'string'
          ? props.width
          : Math.max(props.width, props.minWidth).toString()
      const height = Math.max(props.height, props.minHeight).toString()
      return withPym
        ? pymCodeFor(currentUrl)
        : iframeCodeFor(currentUrl, width, height)
    }

    return {
      t,
      responsiveCheck,
      embedFormCode,
      selectCode,
      embedCode
    }
  }
})
</script>

<style lang="scss" scoped>

.embed-form {
  font-size: 0.9rem;
  overflow: auto;

  &__heading {
    font-size: 1.1em;
    text-transform: uppercase;
  }

  &__code {
    height: 80px;
  }

  &__preview {
    border-left: 1px $gray-400 dashed;
  }
}
</style>
