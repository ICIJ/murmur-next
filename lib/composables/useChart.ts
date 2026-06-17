import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import max from 'lodash/max'
import some from 'lodash/some'
import { ComponentPublicInstance, computed, toRef, toValue, ref, watch, onMounted, nextTick } from 'vue'
import { isUrl } from '@/utils/strings'
import type { Ref, SetupContext, ComputedRef } from 'vue'
import { useResizeObserver } from '@/composables/useResizeObserver'

type ChartContext<T extends string[]> = SetupContext<[...T, ...string[]]>

type ChartEmit = Pick<ChartContext<['resized', 'loaded']>, 'emit'>

export type ChartData = object[] | Record<string, number> | string | null

interface ChartPropsDefinition {
  chartHeightRatio: { type: NumberConstructor }
  data: {
    default: () => object[] | string
    validator(value: string): boolean
    type: (ArrayConstructor | StringConstructor | ObjectConstructor)[]
  }
  dataUrlType: {
    default: string
    validator(value: string): boolean
    type: StringConstructor
  }
  socialMode: { type: BooleanConstructor }
  socialModeRatio: { default: number, type: NumberConstructor }
}

export interface ChartPropsRefs {
  chartHeightRatio: Ref<number | undefined>
  data: Ref<ChartData>
  dataUrlType: Ref<'json' | 'csv' | 'tsv'>
  socialMode: Ref<boolean>
  socialModeRatio: Ref<number>
}

/**
 * Wraps a chart component's raw props into individual refs consumable by {@link useChart}.
 *
 * @param props - The chart component props (typically from `defineProps`).
 * @returns A {@link ChartPropsRefs} object exposing each chart prop as its own ref.
 * @remarks Internal building block consumed by {@link useChart}; not exported from the package root.
 * @example
 * // Inside a chart component, alongside chartProps() and useChart():
 * const props = defineProps(chartProps())
 * const chart = useChart(resizableRef, getChartProps(props), { emit }, isLoaded)
 */
export function getChartProps(props: {
  chartHeightRatio?: number
  data?: ChartData
  dataUrlType?: 'json' | 'csv' | 'tsv'
  socialMode?: boolean
  socialModeRatio?: number
}): ChartPropsRefs {
  return {
    chartHeightRatio: toRef(props, 'chartHeightRatio'),
    data: toRef(props, 'data'),
    dataUrlType: toRef(props, 'dataUrlType') as Ref<'json' | 'csv' | 'tsv'>,
    socialMode: toRef(props, 'socialMode') as Ref<boolean>,
    socialModeRatio: toRef(props, 'socialModeRatio') as Ref<number>
  }
}

/**
 * Builds the shared Vue prop definitions every chart component accepts.
 *
 * @returns A {@link ChartPropsDefinition} object passable to `defineProps`.
 * @remarks Internal building block used by chart components together with {@link useChart}; not exported from the package root.
 * @example
 * // Inside a chart component's <script setup>:
 * const props = defineProps(chartProps())
 */
export const chartProps = (): ChartPropsDefinition => ({
  data: {
    type: [Array, String, Object],
    default: () => [],
    validator(value: string) {
      return isObject(value) || (isString(value) && isUrl(value))
    }
  },
  /**
   * Format of the data to load.
   */
  dataUrlType: {
    type: String,
    default: 'json',
    validator(value: string) {
      return ['json', 'csv', 'tsv'].indexOf(value) > -1
    }
  },
  /**
   * When applicable, default chart's height ratio
   */
  chartHeightRatio: {
    type: Number
  },
  /**
   * If true, the chart will be display on social mode
   */
  socialMode: {
    type: Boolean
  },
  /**
   * Ratio to use in social mode
   */
  socialModeRatio: {
    type: Number,
    default: 5 / 4
  }
})

export const chartEmits = ['resized', 'loaded']

export type LoadedData = object[] | Record<string, number> | null

export interface ElementsMaxBBoxOptions {
  selector?: string
  defaultWidth?: number | null
  defaultHeight?: number | null
}

export interface ElementsMaxBBox {
  width: number | null | undefined
  height: number | null | undefined
}

export interface UseChartReturn {
  dataHasHighlights: ComputedRef<boolean>
  loadedData: Ref<LoadedData>
  mounted: Ref<boolean>
  xAxisYearFormat: (year: number | string) => number | string
  elementsMaxBBox: (options?: ElementsMaxBBoxOptions) => ElementsMaxBBox
  d3Formatter: (value: number | string, formatter?: ((v: number | string) => string) | string) => string | number
  baseHeightRatio: ComputedRef<number>
}

/**
 * Powers a chart component: loads data (inline or from a URL), tracks size, and emits lifecycle events.
 *
 * @param resizableRef - Ref to the chart's resizable root element, observed for size changes.
 * @param props - The chart props as refs, typically produced by {@link getChartProps}.
 * @param context - The setup context providing `emit`, used to fire `loaded` and `resized`.
 * @param isLoaded - Ref flipped to `true` once data has finished loading; shared with the component.
 * @param onResized - Optional callback run after each settled resize and after the initial load.
 * @param afterLoaded - Optional async hook awaited after data loads but before `loaded` is emitted.
 * @returns A {@link UseChartReturn} with reactive state (`loadedData`, `mounted`, `dataHasHighlights`, `baseHeightRatio`) and helpers (`elementsMaxBBox`, `xAxisYearFormat`, `d3Formatter`).
 * @example
 * <script setup>
 * import { ref } from 'vue'
 * import { useChart } from '@icij/murmur-next'
 *
 * const resizableRef = ref()
 * const emit = defineEmits(['resized', 'loaded'])
 * const isLoaded = ref(false)
 * const chartProps = {
 *   data: ref([]),
 *   dataUrlType: ref('json'),
 *   chartHeightRatio: ref(undefined),
 *   socialMode: ref(false),
 *   socialModeRatio: ref(5 / 4)
 * }
 * const { loadedData, baseHeightRatio } = useChart(resizableRef, chartProps, { emit }, isLoaded)
 * </script>
 *
 * <template>
 *   <div ref="resizableRef">{{ loadedData }}</div>
 * </template>
 */
export function useChart(
  resizableRef: Ref<ComponentPublicInstance<HTMLElement> | null>,
  props: ChartPropsRefs,
  { emit }: ChartEmit,
  isLoaded: Ref<boolean>,
  onResized?: () => void,
  afterLoaded?: () => Promise<void>
): UseChartReturn {
  const { resizeRef, resizeState } = useResizeObserver(resizableRef)
  const loadedData = ref<LoadedData>(null)
  const mounted = ref<boolean>(false)
  const dataRef = toRef(props.data)
  const dataUrlTypeRef = toRef(props.dataUrlType)

  onMounted(() => {
    return nextTick(() => {
      mounted.value = true
    })
  })

  watch([dataRef, dataUrlTypeRef], async () => {
    await document.fonts?.ready

    const data = toValue(dataRef)
    const dataUrlType = toValue(dataUrlTypeRef)

    if (isString(data)) {
      // @ts-expect-error introspection in typescript is tricky
      loadedData.value = await d3[dataUrlType](data)
    }
    else {
      loadedData.value = data as unknown as []
    }

    await afterLoaded?.()
    isLoaded.value = true
    emit('loaded', loadedData.value)

    if (onResized) {
      onResized()
      emit('resized')
    }
  }, { immediate: true })

  function elementsMaxBBox({
    selector = 'text',
    defaultWidth = null,
    defaultHeight = null
  } = {}) {
    const returnDefault = { width: defaultWidth, height: defaultHeight }
    if (!isLoaded.value || !resizeRef.value) {
      return returnDefault
    }
    const elements: NodeListOf<SVGGraphicsElement> = resizeRef.value.querySelectorAll(selector)

    if (elements.length == 0) {
      return returnDefault
    }
    const width = max(
      [...elements].map((element) => {
        return element.getBBox ? element.getBBox().width : defaultWidth
      })
    )
    const height = max(
      [...elements].map((element) => {
        return element.getBBox ? element.getBBox().height : defaultHeight
      })
    )
    return { width, height }
  }

  function xAxisYearFormat(year: number | string) {
    // previously using narrowWidth, but it is automatically updated through resizeObserver state reactivity
    return resizeState.narrowWidth ? '’' + String(year).slice(2, 4) : year
  }

  function highlighted(datum: { highlight: boolean }) {
    return datum.highlight
  }

  function d3Formatter(value: any, formatter: any) {
    if (isFunction(formatter)) {
      return formatter(value)
    }
    else if (isString(formatter)) {
      return d3.format(formatter)(value)
    }
    return value
  }

  const baseHeightRatio = computed(() => {
    const chartHeightRatio = toValue(props.chartHeightRatio)
    const socialMode = toValue(props.socialMode)
    const socialModeRatio = toValue(props.socialModeRatio)
    return chartHeightRatio || (socialMode ? socialModeRatio : 9 / 16)
  })

  const dataHasHighlights = computed(() => {
    // Prefer loadedData (so URL-fetched data is inspected), but fall back to the
    // raw prop so a synchronously-passed array reports highlights on first paint
    // rather than flickering once the load watcher resolves.
    const data = loadedData.value ?? toValue(dataRef)
    if (Array.isArray(data)) {
      return some(data, highlighted)
    }
    return false
  })

  watch(resizeState.dimensions, () => {
    if (isLoaded.value && onResized) {
      onResized()
      emit('resized')
    }
  })

  return {
    loadedData,
    mounted,
    elementsMaxBBox,
    xAxisYearFormat,
    d3Formatter,
    baseHeightRatio,
    dataHasHighlights
  }
}
