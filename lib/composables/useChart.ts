import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import max from 'lodash/max'
import { ComponentPublicInstance, toRef, ref, onMounted, nextTick, watch } from 'vue'
import { isUrl } from '@/utils/strings'
import type { Ref, SetupContext, ComputedRef } from 'vue'
import { useResizeObserver } from '@/composables/useResizeObserver'
import { useChartData } from '@/composables/useChartData'
import { useChartFormat } from '@/composables/useChartFormat'
import type { ChartData, LoadedData } from '@/composables/useChartData'

// Re-exported so the public type surface of this module is unchanged even
// though the underlying definitions now live in the data sub-composable.
export type { ChartData, LoadedData }

type ChartContext<T extends string[]> = SetupContext<[...T, ...string[]]>

type ChartEmit = Pick<ChartContext<['resized', 'loaded']>, 'emit'>

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
  const mounted = ref<boolean>(false)

  onMounted(() => {
    return nextTick(() => {
      mounted.value = true
    })
  })

  // Data loading: delegate fetching/parsing to the data sub-composable and run
  // the lifecycle side effects in the order consumers depend on once a load
  // settles (after the optional afterLoaded hook, flip isLoaded, emit loaded,
  // then run the initial resize).
  const { loadedData } = useChartData(
    { data: props.data, dataUrlType: props.dataUrlType },
    async (data) => {
      await afterLoaded?.()
      isLoaded.value = true
      emit('loaded', data)

      if (onResized) {
        onResized()
        emit('resized')
      }
    }
  )

  // Formatting and derived config (value formatter, base height ratio, highlight
  // detection) live in the format sub-composable; they hold no DOM state.
  const { dataHasHighlights, baseHeightRatio, d3Formatter } = useChartFormat({
    loadedData,
    rawData: toRef(props.data),
    chartHeightRatio: props.chartHeightRatio,
    socialMode: props.socialMode,
    socialModeRatio: props.socialModeRatio
  })

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
