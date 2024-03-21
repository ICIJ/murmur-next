<script lang="ts">
import { get, isFunction, kebabCase, uniqueId } from 'lodash'
import * as d3 from 'd3'
import { defineComponent, PropType, computed } from 'vue'

type Datum = { id: string; color: string; path: string; label: string }
type Category = 'id' | 'color' | 'path' | 'label'
export default defineComponent({
  name: 'OrdinalLegend',
  props: {
    data: {
      type: Array as PropType<Datum[]>,
      default: () => []
    },
    horizontal: {
      type: Boolean
    },
    markerPath: {
      type: [String, Function],
      default:
        'M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z'
    },
    categoryObjectsPath: {
      type: String as PropType<Category>,
      default: 'id'
    },
    highlight: {
      type: [String, Number],
      default: null
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['update', 'update:highlight'],
  setup(props, { emit }) {
    const markerBoundingClientRect = computed((): DOMRect | undefined => {
      const svg = d3
        .select('body')
        .append('svg')
        .attr('width', 2046)
        .attr('height', 2046)
      const marker = svg.append('path').attr('d', markerPathFunction())
      const rect: DOMRect | undefined = marker.node()?.getBoundingClientRect()
      svg.remove()
      return rect
    })

    const markerViewbox = computed(() => {
      const { width, height } = markerBoundingClientRect.value ?? {
        width: 0,
        height: 0
      }
      return `0 0 ${width} ${height}`
    })
    const classList = computed(() => {
      return {
        'ordinal-legend--horizontal': props.horizontal,
        'ordinal-legend--has-highlight': props.highlight !== null,
        'ordinal-legend--has-value': props.value !== null
      }
    })
    const dataWithIds = computed(() => {
      return props.data.map((d: any): { [key: string]: string } => {
        const id = uniqueId()
        return { [props.categoryObjectsPath]: id, ...d }
      })
    })
    function itemClassList(d: { [key: string]: string }) {
      const id = d[props.categoryObjectsPath]
      return {
        [`ordinal-legend__item--identifier-${kebabCase(d.label)}`]: true,
        'ordinal-legend__item--highlighted': id === props.highlight,
        'ordinal-legend__item--selected': id === props.value
      }
    }
    function markerPathFunction(d?: Datum): string {
      return isFunction(props.markerPath) && d
        ? props.markerPath(d)
        : props.markerPath
    }
    function update(d: Datum) {
      /**
       * Fired when user clicks on an item
       * @event update
       * @param Mixed Value of the category identifier
       */
      emit('update', get(d, props.categoryObjectsPath, null))
    }
    function updateHighlight(d = {}) {
      /**
       * Fired when user hover an item
       * @event update:highlight
       * @param Mixed Value of the category identifier
       */
      emit('update:highlight', get(d, props.categoryObjectsPath, null))
    }
    return {
      classList,
      markerViewbox,
      updateHighlight,
      itemClassList,
      markerPathFunction,
      update
    }
  }
})
</script>

<template>
  <ul class="ordinal-legend list-unstyled" :class="classList">
    <li
      v-for="d in data"
      :key="d[categoryObjectsPath]"
      class="ordinal-legend__item"
      :class="itemClassList(d)"
    >
      <a
        @click="update(d)"
        @mouseover="updateHighlight(d)"
        @mouseleave="updateHighlight()"
      >
        <span class="ordinal-legend__item__marker me-1">
          <slot name="marker" :marker="{ path: d.path, color: d.color }">
            <svg :viewBox="markerViewbox">
              <path
                :d="markerPathFunction(d)"
                :fill="d.color"
                class="ordinal-legend__item__marker__path"
              />
            </svg>
          </slot>
        </span>
        <span class="ordinal-legend__item__label">
          <slot name="label" v-bind="d">
            {{ d.label }}
          </slot>
        </span>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '../styles/lib';

.ordinal-legend {
  $muted-item-opacity: 0.2;
  $muted-item-filter: grayscale(30%) brightness(10%);
  $muted-item-transition:
    opacity 0.2s,
    filter 0.2s;

  font-size: $font-size-sm;

  &--horizontal &__item {
    display: inline-block;

    &:not(:last-child) {
      margin-right: $spacer;
    }
  }

  &__item {
    transition: $muted-item-transition;

    .ordinal-legend--has-highlight &:not(&--highlighted) {
      opacity: $muted-item-opacity;
      filter: $muted-item-filter;
    }

    &--selected {
      font-weight: bold;
    }

    a {
      color: inherit;
    }

    &__marker svg {
      height: 1em;
      width: 1em;
    }
  }
}
</style>
