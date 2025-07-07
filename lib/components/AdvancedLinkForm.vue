<script lang="ts" setup>
import {computed, watch, ref, Ref, PropType, useTemplateRef, onMounted, nextTick, getCurrentInstance} from 'vue'
import HapticCopy from './HapticCopy.vue'

import { useI18n } from 'vue-i18n'
import {ButtonVariant} from "bootstrap-vue-next";


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
defineOptions({
  name: 'AdvancedLinkForm',
})

/**
 * Index of the selected tab
 */
const index = defineModel({
  type: Number
})

const props = defineProps({
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
    type: Array as PropType<string[]>,
    default: () => ['raw', 'markdown', 'rich', 'html']
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
})
const { t } = useI18n()
const rawInput = useTemplateRef<HTMLTextAreaElement>("rawInput")
const richInput = useTemplateRef<HTMLElement>("richInput")
const markdownInput = useTemplateRef<HTMLTextAreaElement>("markdownInput")
const htmlInput = useTemplateRef<HTMLTextAreaElement>("htmlInput")
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
const orderedTabs =  computed(()=>["raw","rich","markdown","html"].filter(elem => props.forms.includes(elem)))

const showForm = computed(() =>(name: string) => orderedTabs.value.indexOf(name) > -1)
const activeForm = computed(() => {return orderedTabs.value[index.value??0]?? orderedTabs.value[0]})
function onUpdate(event:string | undefined):void{
  index.value = event? orderedTabs.value.indexOf(event):0
}
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

</script>

<template>
 <b-tabs
    class="advanced-link-form"
    :content-class="card ? 'mt-0' : 'mt-3'"
    :card="card"
    :pills="pills"
    :model-value="activeForm"
    @update:model-value="onUpdate"
    :small="small"
    :vertical="vertical"
    :active-nav-item-class="activeNavItemClass"
    :no-fade="noFade"
    :class="formClasses"
  >
    <b-tab id="raw" v-if="showForm('raw')" :title="t('advanced-link-form.raw.tab')">
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
    <b-tab id="rich" v-if="showForm('rich')" :title="t('advanced-link-form.rich.tab')">
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
        id="markdown"
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
    <b-tab id="html" v-if="showForm('html')" :title="t('advanced-link-form.html.tab')">
      <div class="advanced-link-form__html" :class="{ small }">
        <b-input-group :size="size">
          <b-form-input
            ref="htmlInput"
            readonly
            :model-value="linkAsHtml"
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
