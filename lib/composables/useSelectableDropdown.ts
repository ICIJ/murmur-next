import castArray from 'lodash/castArray'
import filter from 'lodash/filter'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import { computed, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

type Item = any

/**
 * Reactive inputs driving the selectable dropdown state.
 */
export interface UseSelectableDropdownOptions {
  /**
   * Two-way model of the currently active item(s). Owned by the component
   * (a `v-model`) and mutated by the selection actions.
   */
  activeItems: Ref<Item[]>
  /**
   * Two-way model of the canonical selection: a single item, or an array of
   * items when `multiple` is set.
   */
  modelValue: Ref<Item>
  /**
   * The items rendered by the list, carrying their scroller ids. Used to
   * resolve indexes for keyboard navigation and range selection.
   */
  items: MaybeRefOrGetter<Item[]>
  /**
   * Whether several items can be selected at once.
   */
  multiple: MaybeRefOrGetter<boolean>
  /**
   * Equality predicate used to compare two items.
   */
  eq: MaybeRefOrGetter<(a: Item, b: Item) => boolean>
}

/**
 * Reactive API returned by {@link useSelectableDropdown}.
 */
export interface UseSelectableDropdown {
  /**
   * Index of the first active item within the items list, or `-1` when none is
   * active.
   */
  firstActiveItemIndex: ComputedRef<number>
  /**
   * Whether the given item is currently active.
   */
  itemActivated: (item: Item) => boolean
  /**
   * Selects a single item, toggling it off when it is the only active one.
   */
  selectItem: (item: Item) => void
  /**
   * Adds the item to the active set, or removes it when already active.
   */
  addItem: (item: Item) => void
  /**
   * Extends the active selection as a contiguous range up to the given item.
   */
  selectRangeToItem: (item: Item) => void
  /**
   * Resets the active set from the canonical model value (or the given value).
   */
  activateItemOrItems: (itemOrItems?: Item) => void
  /**
   * Moves the active item to the previous one in the list.
   */
  activatePreviousItem: () => void
  /**
   * Moves the active item to the next one in the list.
   */
  activateNextItem: () => void
  /**
   * Clears the active set.
   */
  clearActiveItems: () => void
}

/**
 * Owns the selection state machine of the selectable dropdown: which items are
 * active, how single/multiple/range selection mutate that set, keyboard
 * navigation between items, and the two-way synchronization between the active
 * set and the canonical `modelValue`. DOM concerns (keyboard binding, scroller
 * ids) and event emission stay in the component.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive dropdown inputs (see {@link UseSelectableDropdownOptions}).
 * @returns The {@link UseSelectableDropdown} selection API.
 * @example
 * import { useSelectableDropdown } from '@/composables/useSelectableDropdown'
 *
 * const { itemActivated, selectItem } = useSelectableDropdown({
 *   activeItems,
 *   modelValue,
 *   items: () => items_.value,
 *   multiple: () => props.multiple,
 *   eq: () => props.eq
 * })
 */
export function useSelectableDropdown(
  options: UseSelectableDropdownOptions
): UseSelectableDropdown {
  const { activeItems, modelValue, items, multiple, eq } = options

  const firstActiveItemIndex = computed((): number => {
    if (!activeItems.value.length) {
      return -1
    }
    const itemsList = toValue(items)
    const activeItem = activeItems.value[0]
    if (typeof activeItem === 'string') {
      return itemsList.indexOf(activeItem)
    }
    // activeItems may hold either a raw modelValue object (no recycle_scroller_id)
    // or an items entry from a click/range-select (which carries it), so strip
    // the injected key from both sides before comparing.
    const target = omit(activeItem, 'recycle_scroller_id')
    return itemsList.findIndex(it =>
      isEqual(omit(it, 'recycle_scroller_id'), target)
    )
  })

  function itemActivated(item: Item): boolean {
    return findIndex(activeItems.value, i => toValue(eq)(item, i)) > -1
  }

  function selectItem(item: Item): void {
    if (itemActivated(item) && activeItems.value.length === 1) {
      activeItems.value = filter(activeItems.value, i => !toValue(eq)(item, i))
    }
    else {
      activeItems.value = [item]
    }
  }

  function addItem(item: Item): void {
    if (itemActivated(item)) {
      activeItems.value = filter(activeItems.value, i => !toValue(eq)(item, i))
    }
    else {
      activeItems.value = [...activeItems.value, item]
    }
  }

  function selectRangeToItem(item: Item): void {
    // Without an existing selection (or outside multiple mode) a range select
    // falls back to a plain single selection.
    if (!activeItems.value.length || !toValue(multiple)) {
      selectItem(item)
      return
    }
    const itemsList = toValue(items)
    const index = itemsList.indexOf(item)
    if (index > firstActiveItemIndex.value) {
      activeItems.value = itemsList.slice(firstActiveItemIndex.value, index + 1)
    }
    else {
      activeItems.value = itemsList.slice(index, firstActiveItemIndex.value + 1)
    }
  }

  function activateItemOrItems(itemOrItems: Item = modelValue.value): void {
    activeItems.value = [...castArray(itemOrItems)]
  }

  function activatePreviousItem(): void {
    const itemsList = toValue(items)
    activeItems.value = [itemsList[Math.max(firstActiveItemIndex.value - 1, -1)]]
  }

  function activateNextItem(): void {
    const itemsList = toValue(items)
    activeItems.value = [
      itemsList[Math.min(firstActiveItemIndex.value + 1, itemsList.length - 1)]
    ]
  }

  function clearActiveItems(): void {
    activeItems.value = []
  }

  // Mirror the canonical model into the active set when it changes externally.
  watch(modelValue, (itemOrItems: unknown) => {
    const items = castArray(itemOrItems)
    if (!isEqual(activeItems.value, items)) {
      activateItemOrItems(itemOrItems)
    }
  }, { deep: true, immediate: false })

  // Project the active set back into the canonical model.
  watch(activeItems, (itemOrItems: unknown[]) => {
    modelValue.value = toValue(multiple) ? itemOrItems : itemOrItems[0]
  }, { deep: true })

  return {
    firstActiveItemIndex,
    itemActivated,
    selectItem,
    addItem,
    selectRangeToItem,
    activateItemOrItems,
    activatePreviousItem,
    activateNextItem,
    clearActiveItems
  }
}

export default useSelectableDropdown
