<script setup lang="ts">
import { BaseButtonVariant } from 'bootstrap-vue-next'
import HapticCopy from '@/components/HapticCopy/HapticCopy.vue'
import { computed, nextTick, type ShallowRef, useTemplateRef } from 'vue'
import { uniqueId } from 'lodash'

export type Tab = 'raw' | 'rich' | 'markdown' | 'html'

interface AdvancedLinkFormTabProps {
  title: string
  link?: string
  type?: Tab
  compact?: boolean
  variant?: keyof BaseButtonVariant
}

interface TextRange {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  moveToElementText: Function
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  select: Function
}

interface HTMLElementSupportingCreateRange extends HTMLElement {
  createTextRange(): TextRange
}

const props = withDefaults(defineProps<AdvancedLinkFormTabProps>(), {
  type: 'raw',
  compact: false,
  variant: 'primary',
  id: uniqueId('advanced-link-form-tab')
})

const size = computed(() => (props.compact ? 'sm' : 'md'))

const inputRef = useTemplateRef<HTMLInputElement>('input')

const text = computed(
  () => {
    switch (props.type) {
      case 'rich':
      case 'html':
        return linkAsHtml.value
      case 'markdown':
        return linkAsMarkdown.value
      case 'raw':
      default:
        return props.link
    }
  }
)

const titleOrLink = computed(() => props.title || props.link)
const linkAsHtml = computed(() => `<a href="${props.link}" target="_blank">${titleOrLink.value}</a>`)
const linkAsMarkdown = computed(() => `[${titleOrLink.value}](${props.link})`)
const isRich = computed(() => props.type === 'rich')
const isHTML = computed(() => props.type === 'html')

function select() {
  if (props.type === 'rich') {
    selectRich(inputRef)
  }
  else {
    selectInput(inputRef)
  }
}

const selectInput = async (target: Readonly<ShallowRef<HTMLInputElement | null>>) => {
  // wait for the copy to finish to select text
  await nextTick()
  // @ts-expect-error element does exist on target.value but IDE says it doesn't :'(
  target.value?.element.select()
}

async function selectRich(target: Readonly<ShallowRef<HTMLInputElement | null>>) {
  if (!target.value) return
  // wait for the copy to finish to select text
  await nextTick()
  const selection = window.getSelection ? window.getSelection() : null
  if (selection) {
    const range = document.createRange()
    range.selectNodeContents(target.value)
    selection.removeAllRanges()
    selection.addRange(range)
  }
  else if (
    (document.body as HTMLElementSupportingCreateRange).createTextRange
  ) {
    const range = (
      document.body as HTMLElementSupportingCreateRange
    ).createTextRange()
    range.moveToElementText(target.value)
    range.select()
  }
}
</script>

<template>
  <div
    class="advanced-link-form-tab"
    :class="{ small: compact }"
  >
    <b-input-group :size="size">
      <a
        v-if="isRich"
        ref="input"
        :href="link"
        class="form-control advanced-link-form-tab__input advanced-link-form-tab__input--rich"
        @click.prevent="select"
      >
        {{ titleOrLink }}
      </a>
      <b-form-input
        v-else
        ref="input"
        readonly
        :model-value="text"
        class="advanced-link-form-tab__input"
        @click.prevent="select"
      />
      <haptic-copy
        :html="isHTML"
        :text="text"
        :plain="link"
        :variant="variant"
        @attempt="select"
      />
    </b-input-group>
  </div>
</template>

<style scoped lang="scss">
.advanced-link-form-tab {
  text-align: left;

  &__input {
    background: $input-bg;
    &--rich {
      text-align: center;
      text-decoration: underline;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: text;
    }
  }
}
</style>
