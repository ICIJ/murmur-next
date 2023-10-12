<script lang="ts">
import { defineComponent, VNode, DirectiveBinding, PropType } from 'vue'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical'
import { clamp, get, has, invoke, round } from 'lodash'

import Fa, { library } from './Fa'

import type { Variant } from '@/types'

/**
 * A component to wrap an HTML element with a range picker overlay.
 */
export default defineComponent({
  name: 'RangePicker',
  components: {
    Fa
  },
  directives: {
    draggable: {
      inserted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void {
        let startX: number, initialMouseX: number
        const relative = binding.modifiers?.relative ?? false

        // Emit an event to the parent component
        function emitEvent({ name, data }: { name: string; data: any }) {
          const handlers = get(vnode, 'data.on') ?? get(vnode, 'componentOptions.listeners')

          if (has(handlers, name)) {
            invoke(handlers, `${name}.fns`, data)
          }
        }

        // Handle the dragging of the element
        function mousemove(event: MouseEvent) {
          const clientX = event.clientX
          const offset = relative ? el.offsetWidth : 0
          const maxX = (vnode.context as any).rangeWidth() - offset
          const data = clamp(startX + clientX - initialMouseX, 0, maxX)
          emitEvent({ name: 'dragged', data })
          return false
        }

        // Clean up listeners once the dragging ends
        function mouseup() {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }

        // Register the drag event handlers
        el.addEventListener('mousedown', (event: MouseEvent) => {
          startX = el.offsetLeft
          initialMouseX = event.clientX
          document.addEventListener('mousemove', mousemove)
          document.addEventListener('mouseup', mouseup)
          return false
        })
      }
    }
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    /**
     * Represents the initial values of the range bounds. Should contain two numbers
     * indicating the start and end of the range.
     */
    value: {
      type: Array as PropType<number[]>,
      required: true
    },
    /**
     * Defines an offset from the left side of the component
     * where the dragging for the start value begins.
     */
    startOffset: {
      type: [Number as PropType<number>, String as PropType<string>],
      default: 0
    },
    /**
     * Defines an offset from the right side of the component where
     * the dragging for the end value ends.
     */
    endOffset: {
      type: [Number as PropType<number>, String as PropType<string>],
      default: 0
    },
    /**
     * Specifies the number of decimal places to which values should be rounded.
     */
    precision: {
      type: Number as PropType<number>,
      default: 4
    },
    /**
     * Determines the increments in which values should snap. For instance,
     * if snap is 0.1, values will snap to 0, 0.1, 0.2, and so on.
     */
    snap: {
      type: Number as PropType<number>,
      default: 0.0001
    },
    /**
     * Specifies the minimum allowed distance between the two range bounds to ensure they
     * don't get too close to each other.
     */
    minDistance: {
      type: Number as PropType<number>,
      default: 0.01
    },
    /**
     * Sets the visual variant/style of the component. Expected to be one
     * of the predefined Bootstrap theme (e.g., 'primary', 'secondary', etc).
     */
    variant: {
      type: String as PropType<Variant>,
      default: 'primary'
    },
    /**
     * Determines whether the edges of the range should be rounded. If
     * true, the component will have rounded corners.
     */
    rounded: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  data() {
    return {
      start: this.value[0] ?? 0,
      end: this.value[1] ?? 1
    }
  },
  computed: {
    overlayStyle(): { left: string; right: string } {
      return {
        left: `${this.start * 100}%`,
        right: `${(1 - this.end) * 100}%`
      }
    },
    boundsStyle(): { left: string; right: string } {
      return {
        left: this.startOffsetWithUnit,
        right: this.endOffsetWithUnit
      }
    },
    startOffsetWithUnit(): string {
      return this.valueWithUnit(this.startOffset)
    },
    endOffsetWithUnit(): string {
      return this.valueWithUnit(this.endOffset)
    },
    startBoundStyle(): { left: string } {
      return { left: `${this.start * 100}% ` }
    },
    endBoundStyle(): { left: string } {
      return { left: `${this.end * 100}%` }
    },
    classList(): { [key: string]: boolean } {
      return {
        [`range-picker--${this.variant}`]: !!this.variant,
        'range-picker--rounded': this.rounded
      }
    }
  },
  watch: {
    value([start, end]) {
      this.start = start
      this.end = end
    }
  },
  beforeMount() {
    library.add(faEllipsisVertical)
  },
  methods: {
    snapValue(value: number): number {
      return round(value / this.snap) * this.snap
    },
    rangeWidth(): number {
      return this.$el?.querySelector('.range-picker__bounds')?.getBoundingClientRect().width ?? 0
    },
    dragStartBound(dx: number) {
      const newValue = this.snapValue(dx / this.rangeWidth())
      // Ensure start value doesn't get too close to end value
      if (newValue < this.end - this.minDistance) {
        this.start = round(newValue, this.precision)
        /**
         * Update the values of the range (both start and end)
         * @event update
         * @param Number[] New value of the range
         */
        this.$emit('update', [this.start, this.end])
      }
    },
    dragEndBound(dx: number) {
      const newValue = this.snapValue(dx / this.rangeWidth())
      // Ensure end value doesn't get too close to start value
      if (newValue > this.start + this.minDistance) {
        this.end = round(newValue, this.precision)
        /**
         * Update the values of the range (both start and end)
         * @event update
         * @param Number[] New value of the range
         */
        this.$emit('update', [this.start, this.end])
      }
    },
    dragBounds(dx: number) {
      const diff = this.snapValue(this.end - this.start)
      const newValue = this.snapValue(dx / this.rangeWidth())

      this.start = round(newValue, this.precision)
      this.end = round(newValue + diff, this.precision)
      /**
       * Update the values of the range (both start and end)
       * @event update
       * @param Number[] New value of the range
       */
      this.$emit('update', [this.start, this.end])
    },
    valueWithUnit(value: number | string): string {
      return typeof value === 'number' ? `${value}px` : `${value}`
    }
  }
})
</script>

<template>
  <div class="range-picker" :class="classList">
    <slot />
    <div class="range-picker__bounds" :style="boundsStyle">
      <div v-draggable.relative class="range-picker__bounds__overlay" :style="overlayStyle" @dragged="dragBounds"></div>
      <button v-draggable :style="startBoundStyle" class="range-picker__bounds__start btn" @dragged="dragStartBound">
        <fa icon="fa-ellipsis-vertical" fixed-width />
      </button>
      <button v-draggable class="range-picker__bounds__end btn" :style="endBoundStyle" @dragged="dragEndBound">
        <fa icon="fa-ellipsis-vertical" fixed-width />
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
      --bg: #{$value};
      --fg: #{color-yiq($value)};
    }
  }

  &--rounded {
    border-radius: $border-radius;
  }

  &__bounds {
    pointer-events: none;
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: inherit;

    &__overlay {
      cursor: move;
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
      font-size: 0.8rem;
      width: 1.2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      padding: 0;
      background: var(--bg);
      color: var(--fg);
      transform: translate(-50%, -50%);

      &:hover,
      &:active {
        color: var(--fg);
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