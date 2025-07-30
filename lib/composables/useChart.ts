import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import max from 'lodash/max'
import some from 'lodash/some'
import { ComponentPublicInstance, computed, toRef, toValue, ref, watch, onMounted, nextTick } from 'vue'
import { isUrl } from '@/utils/strings'
import { Ref, SetupContext } from 'vue'
import { useResizeObserver } from '@/composables/useResizeObserver'

type ChartContext<T extends string[]> = SetupContext<[...T, ...string[]]>

type ChartEmit = Pick<ChartContext<['resized', 'loaded']>, 'emit'>

interface ChartProps {
  chartHeightRatio: { type: NumberConstructor }
  data: {
    default: () => any[] | string
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

export function getChartProps(props: any): any {
  return {
    chartHeightRatio: toRef(props, 'chartHeightRatio'),
    data: toRef(props, 'data'),
    dataUrlType: toRef(props, 'dataUrlType'),
    socialMode: toRef(props, 'socialMode'),
    socialModeRatio: toRef(props, 'socialModeRatio')
  }
}

export const chartProps = (): ChartProps => ({
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

interface UseChart {
  dataHasHighlights: any
  loadedData: any
  mounted: Ref<boolean>
  xAxisYearFormat: (year: number | string) => number | string
  elementsMaxBBox: ({
    selector,
    defaultWidth,
    defaultHeight
  }?: {
    selector?: any
    defaultWidth?: any
    defaultHeight?: any
  }) => { width: any, height: any }
  d3Formatter: any
  baseHeightRatio: any
}

export function useChart(
  resizableRef: Ref<ComponentPublicInstance<HTMLElement> | null>,
  props: any,
  { emit }: ChartEmit,
  isLoaded: Ref<boolean>,
  onResized?: () => void,
  afterLoaded?: () => Promise<any>
): UseChart {
  const { resizeRef, resizeState } = useResizeObserver(resizableRef)
  const loadedData = ref<unknown | unknown[]>([])
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
    emit('loaded')

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
      [...elements].map((l) => {
        return l.getBBox ? l.getBBox().width : defaultWidth
      })
    )
    const height = max(
      [...elements].map((l) => {
        return l.getBBox ? l.getBBox().height : defaultHeight
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
    const data = toValue(dataRef)
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
