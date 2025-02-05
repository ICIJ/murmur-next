<script lang="ts">
import {
  defineComponent,
  VNode,
  DirectiveBinding,
  PropType,
  ref,
  watch,
  computed,
  toRef
} from 'vue'
import { clamp, round } from 'lodash'

import type { Variant } from '@/types'
import PhosphorIcon from '@/components/PhosphorIcon.vue';

type DragDropValue = {detail:number}
/**
 * A component to wrap an HTML element with a range picker overlay.
 */
export default defineComponent({
  name: 'RangePicker',
  components: {
    PhosphorIcon
  },
  directives: {
    draggable: {
      mounted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void {
        let startX: number, initialClientX: number
        const relative = binding.modifiers?.relative ?? false

        // Emit an event to the parent component
        function emitEvent({
          name,
          data = null
        }: {
          name: string
          data?: any
        }) {
          vnode.el?.dispatchEvent(new CustomEvent(name, { detail: data }))
        }

        // Handle the dragging of the element
        function move(event: MouseEvent | TouchEvent) {
          const clientX =
            event instanceof MouseEvent
              ? event.clientX
              : event.touches[0].clientX
          const offset = relative ? el.offsetWidth : 0
          //@ts-ignore
          const maxX = binding.instance?.rangeWidth() - offset
          const data = clamp(startX + clientX - initialClientX, 0, maxX)
          emitEvent({ name: 'dragged', data })
          return false
        }

        // Clean up listeners once the dragging ends
        function end(event: MouseEvent | TouchEvent) {
          emitEvent({ name: 'ended' })
          if (event instanceof MouseEvent) {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', end)
          } else {
            document.removeEventListener('touchmove', move)
            document.removeEventListener('touchend', end)
          }
        }

        // Register listeners when dragging start
        function start(event: MouseEvent | TouchEvent) {
          emitEvent({ name: 'started' })
          startX = el.offsetLeft
          if (event instanceof MouseEvent) {
            initialClientX = event.clientX
            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', end)
          } else {
            initialClientX = event.touches[0].clientX
            document.addEventListener('touchmove', move)
            document.addEventListener('touchend', end)
          }
          return false
        }

        // Register the drag and touch event handlers
        el.addEventListener('mousedown', start)
        el.addEventListener('touchstart', start)
      }
    }
  },
  props: {
    /**
     * Initial values of the range bounds. Should contain two numbers.
     * indicating the start and end of the range.
     */
    range: {
      type: Array as unknown as PropType<[number, number]>,
      required: true
    },
    /**
     * Enables hover styling on rows.
     */
    hover: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    /**
     * Offset from the left side of the component
     * where the dragging for the start value begins.
     */
    startOffset: {
      type: [Number, String] as PropType<number | string>,
      default: 0
    },
    /**
     * Offset from the right side of the component where
     * the dragging for the end value ends.
     */
    endOffset: {
      type: [Number, String] as PropType<number | string>,
      default: 0
    },
    /**
     * Number of decimal places to which values should be rounded.
     */
    precision: {
      type: Number as PropType<number>,
      default: 4
    },
    /**
     * Snap increment value. For instance,
     * if snap is 0.1, values will snap to 0, 0.1, 0.2, and so on.
     */
    snap: {
      type: Number as PropType<number>,
      default: 0.0001
    },
    /**
     * Minimum distance between the two range bounds to ensure they
     * don't get too close to each other.
     */
    minDistance: {
      type: Number as PropType<number>,
      default: 0.01
    },
    /**
     * Variant style of the component. Expected to be one
     * of the predefined Bootstrap theme (e.g., 'primary', 'secondary', etc.).
     */
    variant: {
      type: String as PropType<Variant>,
      default: 'primary'
    },
    /**
     * Rounds corner edges of the range boundaries. If
     * true, the component will have rounded corners.
     */
    rounded: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    boundStartIcon: {
      type: String as PropType<string>,
      default: 'caret-left'
    },
    boundStartIconWeight: {
      type: String as PropType<string>,
      default: 'bold'
    },
    boundEndIcon: {
      type: String as PropType<string>,
      default: 'caret-right'
    },
    boundEndIconWeight: {
      type: String as PropType<string>,
      default: 'bold'
    },
  },
  emits: ['update:range'],
  setup(props, { emit }) {
    const rangePickerBounds = ref<HTMLElement | null>(null)
    const start = toRef(props.range[0] ?? 0)
    const end = toRef(props.range[1] ?? 0)
    const moving = ref(false)
    const resizing = ref(false)
    const disabled = computed(() => {
      return props.range.length < 2
    })
    const overlayStyle = computed((): { left: string; right: string } => {
      return {
        left: `${start.value * 100}%`,
        right: `${(1 - end.value) * 100}%`
      }
    })
    const boundsStyle = computed((): { left: string; right: string } => {
      return {
        left: startOffsetWithUnit.value,
        right: endOffsetWithUnit.value
      }
    })

    const startOffsetWithUnit = computed((): string => {
      return valueWithUnit(props.startOffset)
    })
    const endOffsetWithUnit = computed((): string => {
      return valueWithUnit(props.endOffset)
    })

    const startBoundStyle = computed((): { left: string } => {
      return { left: `${start.value * 100}% ` }
    })

    const endBoundStyle = computed((): { left: string } => {
      return { left: `${end.value * 100}%` }
    })
    const classList = computed((): { [key: string]: boolean } => {
      return {
        [`range-picker--${props.variant}`]: !!props.variant,
        'range-picker--hover': props.hover,
        'range-picker--disabled': disabled.value,
        'range-picker--rounded': props.rounded,
        'range-picker--resizing': resizing.value,
        'range-picker--moving': moving.value
      }
    })

    function toggleMoving(value:boolean) {
      moving.value = value ?? !moving.value
    }
    function toggleResizing(value:boolean) {
      resizing.value = value ?? !resizing.value
    }
    function snapValue(value:number): number {
      return round(value / props.snap) * props.snap
    }
    function rangeWidth(): number {
      return rangePickerBounds.value?.getBoundingClientRect().width ?? 0
    }
    function dragStartBound({ detail: dx }:DragDropValue) {
      const newValue = snapValue(dx / rangeWidth())
      // Ensure start value doesn't get too close to end value
      if (newValue < end.value - props.minDistance) {
        start.value = round(newValue, props.precision)
        /**
         * Update the values of the range (both start and end)
         * @event update
         * @param Number[] New value of the range
         */
        emit('update:range', [start.value, end.value])
      }
    }
    function dragEndBound({ detail: dx }:DragDropValue) {
      const newValue = snapValue(dx / rangeWidth())
      // Ensure end value doesn't get too close to start value
      if (newValue > start.value + props.minDistance) {
        end.value = round(newValue, props.precision)
        /**
         * Update the values of the range (both start and end)
         * @event update
         * @param Number[] New value of the range
         */
        emit('update:range', [start.value, end.value])
      }
    }
    function dragBounds({ detail: dx }:DragDropValue) {
      const diff = snapValue(end.value - start.value)
      const newValue = snapValue(dx / rangeWidth())
      start.value = round(newValue, props.precision)
      end.value = round(newValue + diff, props.precision)
      /**
       * Update the values of the range (both start and end)
       * @event update
       * @param Number[] New value of the range
       */
      emit('update:range', [start.value, end.value])
    }
    function valueWithUnit(value: number | string): string {
      return typeof value === 'number' ? `${value}px` : `${value}`
    }

    watch(()=>props.range, (newRange) => {
      start.value = newRange[0] ?? 0
      end.value = newRange[1] ?? 0
    })

    return {
      rangePickerBounds,
      start,
      end,
      classList,
      disabled,
      overlayStyle,
      boundsStyle,
      rangeWidth,
      startBoundStyle,
      endBoundStyle,
      dragStartBound,
      dragEndBound,
      dragBounds,
      toggleMoving,
      toggleResizing
    }
  }
})
</script>

<template>
  <div class="range-picker" :class="classList">
    <div class="range-picker__wrapper">
      <slot />
    </div>
    <div
      v-show="!disabled"
      ref="rangePickerBounds"
      class="range-picker__bounds"
      :style="boundsStyle"
    >
      <div
        v-draggable.relative
        class="range-picker__bounds__overlay"
        :style="overlayStyle"
        @dragged="dragBounds"
        @started="toggleMoving(true)"
        @ended="toggleMoving(false)"
      ></div>
      <button
        v-draggable
        :style="startBoundStyle"
        class="range-picker__bounds__start btn"
        @dragged="dragStartBound"
        @started="toggleResizing(true)"
        @ended="toggleResizing(false)"
      >
        <phosphor-icon :name="boundStartIcon" :weight="boundStartIconWeight" />
      </button>
      <button
        v-draggable
        class="range-picker__bounds__end btn"
        :style="endBoundStyle"
        @dragged="dragEndBound"
        @started="toggleResizing(true)"
        @ended="toggleResizing(false)"
      >
        <phosphor-icon :name="boundEndIcon" :weight="boundEndIconWeight" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../styles/lib';

.range-picker {
  min-height: 1rem;
  position: relative;

  --bg: #{$component-active-bg};
  --fg: #{$component-active-color};

  @each $color, $value in $theme-colors {
    &--#{$color} {
      --bg: var(--#{$color}, #{$value});
      --fg: #{color-contrast($value)};
    }
  }

  &--rounded {
    border-radius: $border-radius;
  }

  &--hover:hover &__bounds:after {
    pointer-events: none;
    content: '';
    z-index: -1;
    width: 100%;
    height: 100%;
    display: block;
    background: var(--bg);
    opacity: 0.1;
    border-radius: inherit;
  }

  &--moving &__wrapper,
  &--resizing &__wrapper {
    &,
    * {
      pointer-events: none;
    }
  }

  &--moving,
  &__bounds__overlay,
  &--moving &__bounds__start.btn:not(:disabled):not(.disabled),
  &--moving &__bounds__end.btn:not(:disabled):not(.disabled) {
    cursor: move;
  }

  &--resizing,
  &--resizing &__bounds__overlay,
  &__bounds__start.btn:not(:disabled):not(.disabled),
  &__bounds__end.btn:not(:disabled):not(.disabled) {
    cursor: col-resize;
  }

  &__bounds {
    pointer-events: none;
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: inherit;

    &__overlay {
      pointer-events: all;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      border-radius: inherit;
      border: 1px solid var(--bg);
      overflow: hidden;

      &:after {
        content: '';
        width: 100%;
        height: 100%;
        display: block;
        background: var(--bg);
        opacity: 0.3;
      }
    }

    &__start,
    &__end {
      pointer-events: all;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      font-size: 0.6rem;
      width: 1.2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      padding: 0;
      background: var(--bg, transparent);
      color: var(--fg);
      transform: translate(-50%, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &:active,
      &:focus {
        color: var(--fg);
      }

      &:active, &:focus {
        background: var(--bg, transparent);
      }
    }

    &__start {
      left: 0;
    }

    &__end {
      left: 100%;
    }
  }
}
</style>
