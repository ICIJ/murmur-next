<script lang="ts">
import { computed, defineComponent, ref, Ref, PropType } from 'vue'
import {
  BTabs,
  BTab,
  BInputGroup,
  BFormInput,
  ButtonVariant
} from 'bootstrap-vue-next'

import HapticCopy from './HapticCopy.vue'

import { useI18n } from 'vue-i18n'

type AdvancedLinkedFormClassName = `${'advanced-link-form--'}${string}`
interface AdvancedLinkedFormClasses {
  [prop: AdvancedLinkedFormClassName]: boolean
}

interface TextRange {
  moveToElementText: Function
  select: Function
}

interface HTMLElementSupportingCreateRange extends HTMLElement {
  createTextRange(): TextRange
}

/**
 * A form with tabs to offer several copy formats to users.
 */
export default defineComponent({
  name: 'AdvancedLinkForm',
  components: {
    BTabs,
    BTab,
    BInputGroup,
    BFormInput,
    HapticCopy
  },
  props: {
    /**
     * The link to copy
     */
    link: {
      type: String,
      default: null
    },
    /**
     * Title associated with the link
     */
    title: {
      type: String,
      default: null
    },
    /**
     * The forms to display
     */
    forms: {
      type: Array,
      default: () => ['raw', 'markdown', 'rich', 'html']
    },
    /**
     * Index of the selected tab
     */
    modelValue: {
      type: Number,
      default: 0
    },
    /**
     * Activate the card integration for the tabs
     */
    card: {
      type: Boolean
    },
    /**
     * Renders the tabs with the appearance of pill buttons
     */
    pills: {
      type: Boolean
    },
    /**
     * Makes the tabs and the panels smaller.
     */
    small: {
      type: Boolean
    },
    /**
     * Makes the tabs and the panels vertical.
     */
    vertical: {
      type: Boolean
    },
    /**
     * The variant to use for the copy button.
     */
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    },
    /**
     * CSS class (or classes) to apply to the currently active tab.
     */
    activeNavItemClass: {
      type: String,
      default: null
    },
    /**
     * When set to 'true', disables the fade animation on the tabs.
     */
    noFade: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { t } = useI18n()
    const rawInput = ref<HTMLTextAreaElement | null>(null)
    const richInput = ref<HTMLElement | null>(null)
    const markdownInput = ref<HTMLTextAreaElement | null>(null)
    const htmlInput = ref<HTMLTextAreaElement | null>(null)
    const titleOrLink = computed(() => props.title || props.link)

    const linkAsMarkdown = computed(
      () => `[${titleOrLink.value}](${props.link})`
    )

    const linkAsHtml = computed(
      () => `<a href="${props.link}" target="_blank">${titleOrLink.value}</a>`
    )
    const formClasses = computed(() => {
      const propsToCheck = ['card', 'pills', 'small', 'vertical']
      return propsToCheck.reduce((classes, prop) => {
        //@ts-ignore
        classes[`advanced-link-form--${prop}`] = props[prop]
        return classes
      }, {})
    })

    const size = computed(() => (props.small ? 'sm' : 'md'))

    const showForm = computed(() => {
      return (name: string) => props.forms.indexOf(name) > -1
    })

    const selectInput = (target: Ref<HTMLElement | null>) => {
      // if(!target.value){
      //   throw new Error("no target")
      // }
      if (target.value instanceof HTMLTextAreaElement) {
        target.value.select()
      }
    }

    const selectRaw = () => selectInput(rawInput)

    function selectRich() {
      if (!richInput.value) return

      const selection = window.getSelection ? window.getSelection() : null
      if (selection) {
        const range = document.createRange()
        range.selectNodeContents(richInput.value)
        selection.removeAllRanges()
        selection.addRange(range)
      } else if (
        (document.body as HTMLElementSupportingCreateRange).createTextRange
      ) {
        const range = (
          document.body as HTMLElementSupportingCreateRange
        ).createTextRange()
        range.moveToElementText(richInput.value)
        range.select()
      }
    }
    function selectMarkdown() {
      selectInput(markdownInput)
    }

    function selectHtml() {
      selectInput(htmlInput)
    }

    return {
      t,
      titleOrLink,
      linkAsMarkdown,
      linkAsHtml,
      formClasses,
      size,
      showForm,
      selectRaw,
      selectRich,
      selectMarkdown,
      selectHtml
    }
  }
})
</script>

<template>
  <b-tabs
    class="advanced-link-form"
    :content-class="card ? 'mt-0' : 'mt-3'"
    :card="card"
    :pills="pills"
    :model-value="modelValue"
    :small="small"
    :vertical="vertical"
    :active-nav-item-class="activeNavItemClass"
    :no-fade="noFade"
    :class="formClasses"
    @update:model-value="$emit('update:modelValue')"
  >
    <b-tab v-if="showForm('raw')" :title="t('advanced-link-form.raw.tab')">
      <div class="advanced-link-form__raw" :class="{ small }">
        <b-input-group :size="size">
          <b-form-input
            ref="rawInput"
            readonly
            :model-value="link"
            class="advanced-link-form__raw__input"
            @click="selectRaw"
          />
          <haptic-copy
            :text="link"
            :variant="variant"
            @attempt="selectRaw"
          />
        </b-input-group>
      </div>
    </b-tab>
    <b-tab v-if="showForm('rich')" :title="t('advanced-link-form.rich.tab')">
      <div class="advanced-link-form__rich" :class="{ small }">
        <b-input-group :size="size">
          <a
            ref="richInput"
            :href="link"
            class="form-control advanced-link-form__rich__input"
            @click.prevent="selectRich"
            >{{ titleOrLink }}</a
          >
          <haptic-copy
            html
            :text="linkAsHtml"
            :plain="link"
            :variant="variant"
            @attempt="selectRich"
          />
        </b-input-group>
        <p class="text-muted mt-2 mb-0">
          {{ t('advanced-link-form.rich.description') }}
        </p>
      </div>
    </b-tab>
    <b-tab
      v-if="showForm('markdown')"
      :title="t('advanced-link-form.markdown.tab')"
    >
      <div class="advanced-link-form__markdown" :class="{ small }">
        <b-input-group :size="size">
          <b-form-input
            ref="markdownInput"
            readonly
            :model-value="linkAsMarkdown"
            class="advanced-link-form__markdown__input"
            @click="selectMarkdown"
          />
          <haptic-copy
            :text="linkAsMarkdown"
            :variant="variant"
            @attempt="selectMarkdown"
          />
        </b-input-group>
        <p class="text-muted mt-2 mb-0">
          {{ t('advanced-link-form.markdown.description') }}
        </p>
      </div>
    </b-tab>
    <b-tab v-if="showForm('html')" :title="t('advanced-link-form.html.tab')">
      <div class="advanced-link-form__html" :class="{ small }">
        <b-input-group :size="size">
          <b-form-input
            ref="htmlInput"
            readonly
            :modelValue="linkAsHtml"
            class="advanced-link-form__html__input"
            @click="selectHtml"
          />
          <haptic-copy
            :text="linkAsHtml"
            :variant="variant"
            @attempt="selectHtml"
          />
        </b-input-group>
      </div>
    </b-tab>
  </b-tabs>
</template>

<style lang="scss" scoped>
@import '../styles/lib';

.advanced-link-form {
  text-align: left;

  &__raw__input[readonly],
  &__markdown__input[readonly],
  &__html__input[readonly] {
    background: $input-bg;
  }

  &__rich__input {
    text-align: center;
    text-decoration: underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
