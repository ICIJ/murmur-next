<script setup lang="ts">
import equals from 'lodash/eq'
import identity from 'lodash/identity'
// @ts-expect-error no typings available
import { RecycleScroller } from 'vue-virtual-scroller'

import {
  toRef,
  computed,
  watch,
  onMounted,
  onUnmounted
} from 'vue'

import AppIcon from '@/components/App/AppIcon.vue'
import { useSelectableDropdown } from '@/composables/useSelectableDropdown'
import IPhCheckSquare from '~icons/ph/check-square'
import IPhSquare from '~icons/ph/square'
import type { Component } from 'vue'

const KEY_ESC_CODE = 27
const KEY_UP_CODE = 38
const KEY_DOWN_CODE = 40

type Item = any

/**
 * The item marked as active.
 */
const activeItems = defineModel<Item[]>('activeItems', {
  default: () => []
})

/**
 * The actual selected item.
 */
const modelValue = defineModel<Item>({
  default: null
})

export interface FormControlSelectableDropdownProps {
  /**
   * The items of the list.
   */
  items?: Item[]
  /**
   * If true, the dropdown is hidden and deactivated.
   */
  hide?: boolean
  /**
   * If true, the key events won't be propagated.
   */
  propagate?: boolean
  /**
   * The user can select values.
   */
  multiple?: boolean
  /**
   * A function to change the label rendering.
   */
  serializer?: (item: Item) => string
  /**
   * The class to apply to the list.
   */
  listClass?: string
  /**
   * The class to apply to each item.
   */
  itemClass?: string
  /**
   * Set to true to deactivate action when arrow keys are pressed
   */
  deactivateKeys?: boolean
  /**
   * Comparison function to verify equality between selected items.
   */
  eq?: (a: Item, b: Item) => boolean
  /**
   * Display height of the items in pixels used to calculate the scroll size and position
   * Default value is 32 (32px)
   */
  itemSize?: number
  /**
   * Height of the scroll container to specify especially if using the virtual scroll feature
   * Default value is 'inherit'
   */
  scrollerHeight?: string
}

const props = withDefaults(defineProps<FormControlSelectableDropdownProps>(), {
  items: () => [],
  hide: false,
  propagate: false,
  multiple: false,
  serializer: identity,
  listClass: 'dropdown-menu',
  itemClass: 'dropdown-item',
  deactivateKeys: false,
  eq: equals,
  itemSize: 32,
  scrollerHeight: 'inherit'
})

const emit = defineEmits(['click', 'deactivate'])

onMounted(() => {
  activateItemOrItems()
  toggleKeys()
})

onUnmounted(unbindKeys)

const cssProps = computed(() => {
  return {
    '--scroller-height': props.scrollerHeight
  }
})

const items_ = computed((): Item[] => {
  if (typeof props.items[0] === 'string') {
    return props.items
  }
  // Use index-based stable IDs to prevent regeneration on recompute
  return props.items.map((item: Item, index: number) => ({
    ...item,
    recycle_scroller_id: `item-${index}`
  }))
})

const keyField = computed(() => {
  return typeof items_.value[0] === 'string' ? null : 'recycle_scroller_id'
})

// Selection state machine (active set, navigation, range select, model sync)
// lives in a dedicated composable; the component keeps DOM and emit wiring.
const {
  itemActivated,
  selectItem,
  addItem,
  selectRangeToItem,
  activateItemOrItems,
  activatePreviousItem,
  activateNextItem,
  clearActiveItems
} = useSelectableDropdown({
  activeItems,
  modelValue,
  items: () => items_.value,
  multiple: () => props.multiple,
  eq: () => props.eq
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const keysMap = computed((): Record<string, Function> => {
  return {
    [KEY_UP_CODE]: activatePreviousItem,
    [KEY_DOWN_CODE]: activateNextItem,
    [KEY_ESC_CODE]: deactivateItems
  }
})

watch(toRef(props, 'hide'), toggleKeys)

function indexIcon(item: Item): Component {
  return itemActivated(item) ? IPhCheckSquare : IPhSquare
}

function clickToSelectItem(item: Item) {
  /**
   * Fired when user click on an item
   *
   * @event click
   * @type {String, Object, Array, Number}
   */
  emit('click', item)

  if (props.multiple) {
    addItem(item)
  }
  else {
    selectItem(item)
  }
}

function clickToAddItem(item: Item) {
  /**
   * Fired when a user clicks on an item
   *
   * @event click
   * @type {String, Object, Array, Number}
   */
  emit('click', item)
  addItem(item)
}

function clickToSelectRangeToItem(item: Item) {
  /**
   * Fired when a user clicks on an item
   *
   * @event click
   * @type {String, Object, Array, Number}
   */
  emit('click', item)
  selectRangeToItem(item)
}

function deactivateItems() {
  clearActiveItems()
  /**
   * Fired when items selection is deactivated
   *
   * @event deactivate
   */
  emit('deactivate')
}

function keyDown(event: KeyboardEvent) {
  const keyCode = event.keyCode || event.which
  // The dropdown must be active
  if (props.deactivateKeys || props.hide || !isKnownKey(keyCode)) return
  // Should we stop the event propagation?
  if (!props.propagate && event.stopPropagation) {
    event.stopPropagation()
    event.preventDefault()
  }
  // Then call the right method
  keysMap.value[keyCode]()
}

function isKnownKey(keycode: number) {
  return Object.keys(keysMap.value).map(Number).indexOf(keycode) > -1
}

function unbindKeys() {
  window.removeEventListener('keydown', keyDown)
}

function bindKeys() {
  window.addEventListener('keydown', keyDown)
}

function toggleKeys() {
  if (props.hide) {
    unbindKeys()
  }
  else {
    bindKeys()
  }
}

function itemId(item: Item) {
  return `dropdown-item-${item.recycle_scroller_id ?? item.toLowerCase()}`
}

function serialize(item: Item) {
  return props.serializer?.(item)
}
</script>

<template>
  <div
    v-if="!hide"
    class="selectable-dropdown show"
    :class="{ 'selectable-dropdown--multiple': multiple, [listClass]: true }"
  >
    <recycle-scroller
      v-slot="{ item, active }"
      :style="cssProps"
      class="scroller"
      :items="items_"
      :key-field="keyField"
      :item-size="itemSize"
    >
      <span
        :id="itemId(item)"
        :class="{
          'recycle_scroller-item--active': active,
          active: itemActivated(item),
          [itemClass]: true
        }"
        class="selectable-dropdown__item px-3 d-flex"
        @click.exact="clickToSelectItem(item)"
        @click.ctrl="clickToAddItem(item)"
        @click.shift="clickToSelectRangeToItem(item)"
      >
        <!-- @slot Item content -->
        <slot
          name="item"
          :item="item"
        >
          <div
            v-if="multiple"
            class="selectable-dropdown__item__check"
          >
            <app-icon class="me-2">
              <component :is="indexIcon(item)" />
            </app-icon>
          </div>
          <div
            class="flex-grow-1 text-truncate selectable-dropdown__item__label"
          >
            <!-- @slot Item's label content -->
            <slot
              name="item-label"
              :item="item"
            >
              {{ serialize(item) }}
            </slot>
          </div>
        </slot>
      </span>
    </recycle-scroller>
  </div>
</template>

<style lang="scss">
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

.selectable-dropdown {
  --scroller-height: 'inherit';
  user-select: none;

  &.dropdown-menu {
    position: relative;
    top: 0;
    left: 0;
    float: none;
  }

  & .scroller {
    height: var(--scroller-height);
  }
}
</style>
