<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { uniqueId } from 'lodash'
import { ButtonVariant } from 'bootstrap-vue-next'

import AdvancedLinkFormTab from './FormAdvancedLinkTab.vue'
import { useFormAdvancedLink } from '@/composables/useFormAdvancedLink'
import { AdvancedLinkTab } from '@/enums'

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
  forms?: AdvancedLinkTab[]
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
  title: 'Link',
  forms: () => [AdvancedLinkTab.raw, AdvancedLinkTab.markdown, AdvancedLinkTab.rich, AdvancedLinkTab.html],
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

// Build a tab's presentation metadata: the translated label and the unique id
// scoped to this form instance.
function buildTab(type: AdvancedLinkTab): { title: string, id: string } {
  return {
    title: t(`advanced-link-form.${type}.tab`),
    id: `${advancedLinkFormId}-${type}`
  }
}

const { tabs, activeForm, onUpdate } = useFormAdvancedLink({
  forms: () => props.forms,
  buildTab,
  index
})
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
        :title="title"
        :type="tab.type"
        :data-type="tab.type"
        :compact="small"
        :variant="variant"
        :link="link"
      />
    </b-tab>
  </b-tabs>
</template>
