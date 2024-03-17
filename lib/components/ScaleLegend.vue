<script lang="ts">
import {isFunction, isString} from 'lodash'
import * as d3 from 'd3'
import * as scaleFunctions from 'd3-scale'
import {defineComponent, PropType, ref, computed, onMounted, watch, nextTick, toRef} from 'vue'

type ClassListLegend = { 'scale-legend--has-cursor': boolean }
// eslint-disable-next-line no-unused-vars
type ColorScaleFn = (v?: number) => string

type ColorScale = ColorScaleFn | string
// eslint-disable-next-line no-unused-vars
type WidthScaleFn = (x: number) => string

export default defineComponent({
  name: 'ScaleLegend',
  props: {
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 16
    },
    cursorValue: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    colorScale: {
      type: [Function, String] as PropType<ColorScaleFn | string>,
      default: 'scaleLinear',
      validator(colorScale: ColorScale) {
        return isFunction(colorScale) || (colorScale as string) in scaleFunctions
      }
    },
    colorScaleEnd: {
      type: String,
      default() {
        const computedStyle = window.getComputedStyle(document.body)
        return computedStyle.getPropertyValue('--primary') || '#000'
      }
    },
    colorScaleStart: {
      type: String,
      default: '#fff'
    }
  },
  setup(props) {
    const cursorWrapperOffset = ref(0)
    const mounted = ref(false)
    const el = ref<Element | null>(null)
    const classList = computed((): ClassListLegend => {
      return {
        'scale-legend--has-cursor': hasCursor.value
      }
    })
    const cursorValue = toRef(props.cursorValue)
    onMounted(async () => {
      await nextTick()
      setCursorWrapperOffset()
      setColorScaleCanvas()
      mounted.value = true
    })

    const cursorLeft = computed((): string => {
      const left = cursorLeftScale.value(props.cursorValue)
      return isNaN(left) ? '0%' : `${left}%`
    })
    const colorScaleBaseCanvas = computed((): HTMLCanvasElement | null => {
      return d3.create('canvas').attr('width', props.width).attr('height', props.height).node()
    })
    const colorScaleContext = computed((): CanvasRenderingContext2D | null => {
      return colorScaleBaseCanvas.value?.getContext('2d') ?? null
    })
    const colorScaleBase64 = computed((): string | undefined => {
      if (mounted.value) {
        return colorScaleBaseCanvas.value?.toDataURL() ?? undefined
      }
      return undefined
    })
    const colorScaleWidthRange = computed((): number[] => {
      return d3.range(1, props.width + 1)
    })
    const hasCursor = computed((): boolean => {
      return props.cursorValue != null // double equal also tests undefined
    })
    const colorScaleFunction = computed((): ColorScaleFn => {
      if (isString(props.colorScale)) {
        // @ts-ignore
        const fn: () => any = scaleFunctions[props.colorScale]
        return fn().domain([props.min, props.max]).range([props.colorScaleStart, props.colorScaleEnd])
      }
      return props.colorScale
    })
    const cursorLeftScale = computed((): d3.ScaleLinear<number, number> => {
      return d3.scaleLinear().domain([props.min, props.max]).range([0, 100]).interpolate(d3.interpolateRound)
    })
    const widthScaleColor = computed((): WidthScaleFn => {
      return (x: number) => {
        const value = widthScale.value(x)
        return colorScaleFunction.value(value)
      }
    })
    const widthScale = computed((): d3.ScaleLinear<number, number> => {
      return d3.scaleLinear().domain([0, props.width]).range([props.min, props.max])
    })

    const formatNumber = d3.format(',')

    function setCursorWrapperOffset(): void {
      const cursor = el.value?.querySelector('.scale-legend__cursor')
      if (cursor && el.value) {
        const {x: cursorX, width: cursorWidth} = cursor.getBoundingClientRect()
        const {x: legendX, width: legendWidth} = el.value.getBoundingClientRect()
        const left = legendX - cursorX - 6
        const right = legendX + legendWidth - (cursorX + cursorWidth) + 6
        cursorWrapperOffset.value = Math.max(0, left) || Math.min(0, right)
      } else {
        cursorWrapperOffset.value = 0
      }
    }

    function setColorScaleCanvas(): void {
      if (!colorScaleContext.value) {
        return
      }
      for (const x of colorScaleWidthRange.value) {
        colorScaleContext.value.fillStyle = widthScaleColor.value(x)
        colorScaleContext.value.fillRect(x, 0, 1, props.height)
      }
    }

    watch(cursorValue,
        async () => {
          await nextTick()
          setCursorWrapperOffset()
        })

    return {
      classList,
      colorScaleBase64,
      cursorLeft,
      cursorWrapperOffset,
      formatNumber,
      hasCursor,
      //CD: function below are only uses in unit tests. use callable?
      widthScale,
      colorScaleFunction,
      widthScaleColor,
    }
  }
})
</script>

<template>
  <div ref="el" :class="classList" class="scale-legend">
    <div class="scale-legend__bound scale-legend__bound--min">
      <slot name="legend-cursor-min" v-bind="{ min }">
        {{ formatNumber(min) }}
      </slot>
    </div>
    <img :height="height" :src="colorScaleBase64" :width="width" class="scale-legend__scale" alt="legend scale"/>
    <div class="scale-legend__bound scale-legend__bound--max">
      <slot name="legend-cursor-max" v-bind="{ max }">
        {{ formatNumber(max) }}
      </slot>
    </div>
    <div v-if="hasCursor" :style="{ left: cursorLeft }" class="scale-legend__cursor">
      <div :style="{ transform: `translateX(${cursorWrapperOffset}px)` }" class="scale-legend__cursor__wrapper">
        <slot name="cursor" v-bind="{ value: cursorValue }">
          {{ formatNumber(cursorValue) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/lib';

.scale-legend {
  position: relative;
  display: inline-block;

  &__bound,
  &__cursor {
    position: absolute;
    bottom: 100%;
    font-size: 0.8rem;

    &--min {
      left: 0;
    }

    &--max {
      right: 0;
    }
  }

  .choropleth-map--has-cursor &__bound {
    color: $text-muted;
    opacity: 0.6;
  }

  &__cursor {
    font-weight: bold;
    transform: translateX(-50%);
    left: 50%;

    &:after {
      content: '';
      border: 5px solid transparent;
      border-top-color: var(--dark, currentColor);
      position: absolute;
      left: 50%;
      top: 100%;
      transform: translateX(-50%);
    }
  }
}
</style>
