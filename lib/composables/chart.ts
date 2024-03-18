import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import max from 'lodash/max'
import some from 'lodash/some'
import {ComponentPublicInstance, computed, onMounted, ref, watch} from 'vue'
import {isUrl} from '@/utils/strings'
import { Ref, SetupContext} from "@vue/runtime-core";
import useResizeObserver from "@/composables/resizeObserver";
import { watchEffect } from 'vue'


type ChartContext<T extends string[]> = SetupContext<[...T, ...string[]]>;
type ChartEmit = Pick<ChartContext<["resized", "loaded"]>, 'emit'>
type ChartProps = {
    chartHeightRatio: { type: NumberConstructor },
    data: {
        default: () => any[] | string,
        validator(value: string): boolean,
        type: (ArrayConstructor | StringConstructor | ObjectConstructor)[]
    },
    dataUrlType: { default: string, validator(value: string): boolean, type: StringConstructor },
    socialMode: { type: BooleanConstructor },
    socialModeRatio:
        { default: number, type: NumberConstructor }
};

export function getChartProps(props: any): ChartProps {
    return {
        chartHeightRatio: props.chartHeightRatio,
        data: props.data,
        dataUrlType: props.dataUrlType,
        socialMode: props.socialMode,
        socialModeRatio: props.socialModeRatio,
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
export const chartEmits = ["resized", "loaded"]
type Chart =  {
    dataHasHighlights: any;
    loadedData: any;
    xAxisYearFormat: (year: (number | string)) => number | string;
    elementsMaxBBox: ({selector, defaultWidth, defaultHeight}?: {
        selector?: any;
        defaultWidth?: any;
        defaultHeight?: any
    }) => ({ width: any; height: any });
    d3Formatter: any;
    baseHeightRatio: any
}
export function useChart(resizableRef: Ref<ComponentPublicInstance<HTMLElement> | null>, props: ChartProps, {emit}: ChartEmit, isLoaded:Ref<boolean>, onResized?:Function, afterLoaded?:()=>Promise<any>): Chart {
    const  { resizeRef , resizeState } = useResizeObserver(resizableRef)
    const loadedData = ref([])

    onMounted(async () => {
        await document.fonts?.ready

        watchEffect(async ()=>{
            if(!isLoaded.value){

                if (isString(props.data)) {
                    // @ts-ignore
                    loadedData.value = await d3[props.dataUrlType](props.data)
                } else {
                    loadedData.value = props.data as unknown as []
                }

                if(afterLoaded){
                    await afterLoaded()
                }
                isLoaded.value = true
                emit('loaded')
            }

             if(isLoaded.value && onResized){
                onResized()
                emit('resized')
             }
        })


    })
    function elementsMaxBBox({selector = 'text', defaultWidth = null, defaultHeight = null} = {}) {

        const elements = isLoaded.value? resizeRef.value?.querySelectorAll(selector) : []
        if (elements.length == 0) {
            return {width: defaultWidth, height: defaultHeight}
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
        return {width, height}
    }

    function xAxisYearFormat(year: number | string) {
        // previously using narrowWidth but it is automatically updated through resizeObserver state reactivity
        return resizeState.narrowWidth ? '’' + String(year).slice(2, 4) : year
    }
    function highlighted(datum: { highlight: boolean }) {
        return datum.highlight
    }
    function d3Formatter(value:any,formatter:any)  {
        if (isFunction(formatter)) {
            return formatter(value)
        } else if (isString(formatter)) {
            return d3.format(formatter)(value)
        }
        return value
    }
    const baseHeightRatio = computed(() => {
        return props.chartHeightRatio || (props.socialMode ? props.socialModeRatio : 9 / 16)
    })
    const dataHasHighlights = computed(() => {
        if (Array.isArray(props.data)) {
            return some(props.data, highlighted)
        }
        return false
    })

    watch(resizeState.dimensions, () => {
        if(isLoaded.value && onResized){
            onResized()
            emit('resized')
        }
    })


    return {
        loadedData,
        elementsMaxBBox,
        xAxisYearFormat,
        d3Formatter,
        baseHeightRatio,
        dataHasHighlights,
    }
}
