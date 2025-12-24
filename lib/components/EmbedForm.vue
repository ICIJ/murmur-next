<script setup lang="ts">
import { computed, ref } from 'vue'

import { useI18n } from 'vue-i18n'
import HapticCopy from '@/components/HapticCopy.vue'
import IframeResizer from '@/utils/iframe-resizer'

defineOptions({
  name: 'EmbedForm'
})

const props = withDefaults(defineProps<{
  /**
   * Hide the form title
   */
  noTitle?: boolean
  /**
   * Hide the preview panel
   */
  noPreview?: boolean
  /**
   * Default width of the iframe code
   */
  width?: number | string
  /**
   * Default height of the iframe code
   */
  height?: number
  /**
   * Default minimal width of the iframe code (if extract from window's size)
   */
  minWidth?: number
  /**
   * Default minimal height of the iframe code (if extract from window's size)
   */
  minHeight?: number
  /**
   * URL of the iframe code
   */
  url?: string | null
}>(), {
  noTitle: false,
  noPreview: false,
  width: '100%',
  height: () => window.innerHeight,
  minWidth: 0,
  minHeight: 0,
  url: null
})

const { t } = useI18n()

const responsiveCheck = ref(false)
const embedFormCode = ref<HTMLTextAreaElement | null>(null)

const currentUrl = computed(() => {
  return props.url || window?.location?.href
})

function iframeCodeFor(_url = currentUrl, width: string, height: string) {
  const src = IframeResizer.deletePymParams(props.url)
  return `<iframe width="${width}" height="${height}" src="${src}" frameborder="0" allowfullscreen></iframe>`
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
</script>

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
