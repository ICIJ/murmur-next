<script lang="ts">
import castArray from 'lodash/castArray'
import eq from 'lodash/eq'
import findIndex from 'lodash/findIndex'
import filter from 'lodash/filter'
import identity from 'lodash/identity'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons'
import { RecycleScroller } from 'vue-virtual-scroller'

import Fa from './Fa'
import {defineComponent, ref, computed, watch, onMounted, onUnmounted,PropType } from 'vue'

const KEY_ESC_CODE = 27
const KEY_UP_CODE = 38
const KEY_DOWN_CODE = 40
type Item = any;
export default defineComponent({
  name: 'SelectableDropdown',
  components: {
    Fa,
    RecycleScroller
  },
  props: {
    /**
     * The items of the list.
     */
    items: {
      type: Array as PropType<Item[]>,
      default() {
        return []
      }
    },
    /**
     * The actual selected item.
     */
    modelValue: {
      type: [String, Object, Array, Number] as PropType<Item>,
      default: null
    },
    /**
     * If true, the dropdown is hidden and deactivated.
     */
    hide: {
      type: Boolean
    },
    /**
     * If true, the key events won't be propagated.
     */
    propagate: {
      type: Boolean
    },
    /**
     * The user can select values.
     */
    multiple: {
      type: Boolean
    },
    /**
     * A function to change the label rendering.
     */
    serializer: {
      type: Function,
      default: identity
    },
    /**
     * The class to apply to the list.
     */
    listClass: {
      type: String,
      default: 'dropdown-menu'
    },
    /**
     * The class to apply to each item.
     */
    itemClass: {
      type: String,
      default: 'dropdown-item'
    },
    /**
     * Set to true to deactivate action when arrow keys are pressed
     */
    deactivateKeys: {
      type: Boolean
    },
    /**
     * Comparison function to verify equality between selected items.
     */
    eq: {
      type: Function,
      default: eq
    },
    /**
     * Display height of the items in pixels used to calculate the scroll size and position
     * Default value is 32 (32px)
     */
    itemSize: {
      type: Number,
      default: 32
    },
    /**
     * Height of the scroll container to specify especially if using the virtual scroll feature
     * Default value is 'inherit'
     */
    scrollerHeight: {
      type: String,
      default: 'inherit'
    }
  },
  emits:['click','update:modelValue', 'deactivate'],
  setup(props,{emit}){
    onMounted(()=> {
      activateItemOrItems()
      toggleKeys()
    })
    onUnmounted(() => {
      unbindKeys()
    })
    const scroller=ref(null)
    const activeItems =  ref<Item[]>([])
    const cssProps = computed(()=>{
      return {
        '--scroller-height': props.scrollerHeight
      }
    })
    const keyField = computed(()=>{
      return typeof items_.value[0] === 'string' ? null : 'recycle_scroller_id'
    })
    const items_ = computed(():Item[]=>{
      if (typeof props.items[0] === 'string') {
        return props.items
      }
      return props.items.map((item:Item) => ({ ...item, recycle_scroller_id: `id-${uniqueId()}` }))
    })
    const firstActiveItemIndex = computed(()=>{
      return activeItems.value.length ? items_.value.indexOf(activeItems.value[0]) : -1
    })
    const lastActiveItemIndex = computed(()=>{
      return activeItems.value.length ? items_.value.indexOf(activeItems.value.slice(-1)) : -1
    })
    const keysMap = computed(():{[key:string]:Function }=>{
          return {
            [KEY_UP_CODE]: activatePreviousItem,
            [KEY_DOWN_CODE]: activateNextItem,
            [KEY_ESC_CODE]: deactivateItems
          }
        }
    )
    watch(()=>props.hide,()=> {
      toggleKeys()
    })
    watch(()=>activeItems.value,
        ()=> {
      /**
       * Fired when the selected value change. It will pass a canonical value
       * or an array of values if the property `multiple` is set to true.
       *
       * @event input
       * @type {String, Object, Array, Number}
       */
      emit('update:modelValue', props.multiple ? activeItems.value : activeItems.value[0])
    })
    watch(()=>props.modelValue,
        (itemOrItems)=>{
      const items = castArray(itemOrItems)
      if (!isEqual(activeItems.value, items)) {
        activateItemOrItems(items)
      }
      },
        {deep: true})
    function indexIcon(item:Item){
      return itemActivated(item) ? faCheckSquare : faSquare
    }
    function itemActivated(item:Item) {
      return findIndex(activeItems.value, (i) => props.eq(item, i)) > -1
    }
    function clickToSelectItem(item:Item) {
      /**
       * Fired when user click on an item
       *
       * @event click
       * @type {String, Object, Array, Number}
       */
      emit('click', item)
      if (props.multiple) {
        addItem(item)
      } else {
        selectItem(item)
      }
    }
    function clickToAddItem(item:Item) {
      /**
       * Fired when user click on an item
       *
       * @event click
       * @type {String, Object, Array, Number}
       */
      emit('click', item)
      addItem(item)
    }
    function clickToSelectRangeToItem(item:Item) {
      /**
       * Fired when user click on an item
       *
       * @event click
       * @type {String, Object, Array, Number}
       */
      emit('click', item)
      selectRangeToItem(item)
    }
    function emitEventOnItem(name:"click" | "update:modelValue" | "deactivate", item:Item) {
      emit(name, item)
    }
    function selectItem(item:Item) {
      if (itemActivated(item) && activeItems.value.length === 1) {
        activeItems.value = filter(activeItems.value, (i) => !props.eq(item, i))
      } else {
        activeItems.value = [item]
      }
    }
    function addItem(item:Item) {
      if (itemActivated(item)) {
        activeItems.value = filter(activeItems.value, (i) => !props.eq(item, i))
      } else {
        activeItems.value.push(item)
      }
    }
    function selectRangeToItem(item:Item) {
      // No activated items
      if (!activeItems.value.length || !props.multiple) {
        selectItem(item)
      } else {
        const index = items_.value.indexOf(item)
        if (index > firstActiveItemIndex.value) {
          activeItems.value = items_.value.slice(firstActiveItemIndex.value, index + 1)
        } else {
          activeItems.value = items_.value.slice(index, firstActiveItemIndex.value + 1)
        }
      }
    }
    function activateItemOrItems(itemOrItems = props.modelValue) {
      const items = castArray(itemOrItems)
      activeItems.value = [...items]
    }
    function activatePreviousItem() {
      activeItems.value = [items_.value[Math.max(firstActiveItemIndex.value - 1, -1)]]
    }
    function activateNextItem() {
      activeItems.value = [items_.value[Math.min(firstActiveItemIndex.value + 1, items_.value.length - 1)]]
    }
    function deactivateItems() {
      activeItems.value = []
      /**
       * Fired when items selection is deactivated
       *
       * @event deactivate
       */
      emit('deactivate')
    }
    function keyDown(event:KeyboardEvent) {
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
    function isKnownKey(keycode:number) {
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
      } else {
        bindKeys()
      }
    }
    function itemId(item:Item){
      return `dropdown-item-${item.recycle_scroller_id ?? item.toLowerCase()}`
    }

    return {
      cssProps,
      items_,
      keyField,
      lastActiveItemIndex,
      itemActivated,
      clickToSelectItem,
      clickToAddItem,
      clickToSelectRangeToItem,
      indexIcon,
      scroller,
      activeItems,
      itemId
    }
  }
})
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
          :class="{ 'recycle_scroller-item--active': active, active: itemActivated(item), [itemClass]: true }"
          class="selectable-dropdown__item px-3 d-flex"
          @click.exact="clickToSelectItem(item)"
          @click.ctrl="clickToAddItem(item)"
          @click.shift="clickToSelectRangeToItem(item)"
      >
        <!-- @slot Item content -->
        <slot name="item" :item="item">
          <div v-if="multiple" class="selectable-dropdown__item__check">
            <fa :icon="indexIcon(item)" class="me-2" />
          </div>
          <div class="flex-grow-1 text-truncate selectable-dropdown__item__label">
            <!-- @slot Item's label content -->
            <slot name="item-label" :item="item">
              {{ serializer(item) }}
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
