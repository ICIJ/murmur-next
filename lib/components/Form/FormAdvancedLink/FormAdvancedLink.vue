<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { uniqueId } from 'lodash'
import { ButtonVariant } from 'bootstrap-vue-next'

import AdvancedLinkFormTab from './FormAdvancedLinkTab.vue'
import { Tab } from '@/components/Form/FormAdvancedLink/FormAdvancedLinkTab.vue'

/**
 * A form with tabs to offer several copy formats to users.
 */
defineOptions({
  name: 'AdvancedLinkForm',
})

/**
 * Index of the selected tab
 */
const index = defineModel<number>()

export interface FormAdvancedLinkProps {
  /**
   * The link to copy
   */
  link?: string
  /**
   * Title associated with the link
   */
  title?: string | null
  /**
   * The forms to display
   */
  forms?: Tab[]
  /**
   * Activate the card integration for the tabs
   */
  card?: boolean
  /**
   * Renders the tabs with the appearance of pill buttons
   */
  pills?: boolean
  /**
   * Makes the tabs and the panels smaller.
   */
  small?: boolean
  /**
   * Makes the tabs and the panels vertical.
   */
  vertical?: boolean
  /**
   * The variant to use for the copy button.
   */
  variant?: ButtonVariant
  /**
   * CSS class (or classes) to apply to the currently active tab.
   */
  activeNavItemClass?: string | null
  /**
   * When set to 'true', disables the fade animation on the tabs.
   */
  noFade?: boolean
}

const props = withDefaults(defineProps<FormAdvancedLinkProps>(), {
  link: undefined,
  title: null,
  forms: () => ['raw', 'markdown', 'rich', 'html'],
  card: false,
  pills: false,
  small: false,
  vertical: false,
  variant: 'primary',
  activeNavItemClass: null,
  noFade: false
})
const advancedLinkFormId = uniqueId('advanced-link-form-')

const { t } = useI18n()
const formClasses = computed(() => {
  const propsToCheck = ['card', 'pills', 'small', 'vertical'] as const
  return propsToCheck.reduce((classes, prop) => {
    classes[`advanced-link-form--${prop}`] = props[prop]
    return classes
  }, {} as Record<string, boolean>)
})

// default tabs order
const defaultTabs: Tab[] = ['raw', 'rich', 'markdown', 'html']

const tabs = computed(() => {
  return defaultTabs
    .filter(elem => props.forms.includes(elem))
    .map((elem) => {
      return {
        type: elem,
        title: t(`advanced-link-form.${elem}.tab`),
        id: `${advancedLinkFormId}-${elem}`,
      }
    }
    )
})

const activeForm = computed(() => {
  if (index.value && index.value > 0 && index.value < tabs.value.length) {
    return tabs.value[index.value].id
  }
  return tabs.value[0].id
}
)

function onUpdate(event: string | undefined): void {
  const id = tabs.value.findIndex((elem: { id: string }) => elem.id === event)
  index.value = id < 0 ? 0 : id
}

</script>

<template>
  <b-tabs
    class="advanced-link-form"
    :content-class="card ? 'mt-0' : 'mt-3'"
    :card="card"
    :pills="pills"
    :model-value="activeForm"
    :small="small"
    :vertical="vertical"
    :active-nav-item-class="activeNavItemClass"
    :no-fade="noFade"
    :class="formClasses"
    @update:model-value="onUpdate"
  >
    <b-tab
      v-for="tab in tabs"
      :id="tab.id"
      :key="tab.id"
      :title="tab.title"
    >
      <advanced-link-form-tab
        :title="tab.title"
        :type="tab.type"
        :data-type="tab.type"
        :compact="small"
        :variant="variant"
        :link="link"
      />
    </b-tab>
  </b-tabs>
</template>
