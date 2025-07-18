import { createBootstrap } from 'bootstrap-vue-next'
import { i18n } from './i18n'
import * as components from './components'
import * as datavisualisations from './datavisualisations'
import * as maps from './maps'
import config from './config'
import { App,Component, DefineComponent } from 'vue'

export { default as AccordionWrapper } from './components/AccordionWrapper.vue'
export { default as AccordionStep } from './components/AccordionStep.vue'
export { default as ActiveTextTruncate } from './components/ActiveTextTruncate.vue'
export { default as AdvancedLinkForm } from './components/AdvancedLinkForm.vue'
export { default as Brand } from './components/Brand.vue'
export { default as BrandExpansion } from './components/BrandExpansion.vue'
export { default as ButtonIcon } from './components/ButtonIcon.vue'
export { default as ButtonIconCounter } from './components/ButtonIconCounter.vue'
export { default as ConfirmButton } from './components/ConfirmButton.vue'
export { default as ContentPlaceholder } from './components/ContentPlaceholder.vue'
export { default as CustomPagination } from './components/CustomPagination.vue'
export { default as DigitsInput } from './components/DigitsInput.vue'
export { default as DonateForm } from './components/DonateForm.vue'
export { default as EmbeddableFooter } from './components/EmbeddableFooter.vue'
export { default as EmbedForm } from './components/EmbedForm.vue'
export { default as FollowUsPopover } from './components/FollowUsPopover.vue'
export { default as GenericFooter } from './components/GenericFooter.vue'
export { default as GenericHeader } from './components/GenericHeader.vue'
export { default as HapticCopy } from './components/HapticCopy.vue'
export { default as ImageMode } from './components/ImageMode/ImageMode.vue'
export { default as ImageModeSource } from './components/ImageMode/ImageModeSource.vue'
export { default as OrdinalLegend } from './components/OrdinalLegend.vue'
export { default as PhosphorIcon } from './components/PhosphorIcon.vue'
export { default as PhosphorIconLayers } from './components/PhosphorIconLayers.vue'
export { default as RangePicker } from './components/RangePicker.vue'
export { default as ResponsiveIframe } from './components/ResponsiveIframe.vue'
export { default as ScaleLegend } from './components/ScaleLegend.vue'
export { default as SecretInput } from './components/SecretInput.vue'
export { default as SelectableDropdown } from './components/SelectableDropdown.vue'
export { default as SharingOptions } from './components/SharingOptions.vue'
export { default as SharingOptionsLink } from './components/SharingOptionsLink.vue'
export { default as SignUpForm } from './components/SignUpForm.vue'
export { default as SlideUpDown } from './components/SlideUpDown.vue'
export { default as TexturedDeck } from './components/TexturedDeck.vue'
export { default as TinyPagination } from './components/TinyPagination.vue'

export { default as BarChart } from './datavisualisations/BarChart.vue'
export { default as ColumnChart } from './datavisualisations/ColumnChart.vue'
export { default as LineChart } from './datavisualisations/LineChart.vue'
export { default as StackedBarChart } from './datavisualisations/StackedBarChart.vue'

export { default as ChoroplethMap } from './maps/ChoroplethMap.vue'
export { default as SymbolMap } from './maps/SymbolMap.vue'

export { default as EllipsisTooltip } from './directives/EllipsisTooltip'

export { useChart } from './composables/useChart'
export { useResizeObserver } from './composables/useResizeObserver'
export { useColorMode } from './composables/useColorMode'
export { useQueryObserver } from './composables/useQueryObserver'

type ComponentMap = {[name:string]:Component|DefineComponent}

type PluginOptions = {
  useI18n?: boolean,
  useBootstrap?: boolean,
  useConfig?: boolean,
  registerComponents?: boolean
}

const Murmur = {
  get i18n() {
    return i18n
  },
  get config() {
    return config
  },
  get components() :ComponentMap{
    return components
  },
  get datavisualisations() : ComponentMap{
    return datavisualisations
  },
  get maps() : ComponentMap{
    return maps
  },
  setLocaleMessage(lang: string, message: any) {
    return Murmur.i18n.global.setLocaleMessage(lang, message)
  },
  mergeLocaleMessage(lang: string, message: any) {
    return Murmur.i18n.global.mergeLocaleMessage(lang, message)
  },
  setLocale(lang: 'fr' | 'en') {
    // @ts-expect-error not sure why typescript sees an error here
    return (Murmur.i18n.global.locale.value = lang)
  },
  getLocale() {
    // @ts-expect-error not sure why typescript sees an error here
    return Murmur.i18n.global.locale.value
  },
  install(app: App<Element>, {
    useI18n = true,
    useBootstrap = true,
    useConfig = true,
    registerComponents = true
  }: PluginOptions = {}) {

    if (useBootstrap) {
      app.use(createBootstrap())
    }

    if (useI18n) {
      app.use(Murmur.i18n)
    }

    if (useConfig) {
      app.config.globalProperties.$config = Murmur.config
    }

    if (registerComponents) {
      Object.keys(this.components).forEach((key) =>
        app.component(key, this.components[key])
      )
      Object.keys(this.datavisualisations).forEach((key) =>
        app.component(key, this.datavisualisations[key])
      )
      Object.keys(this.maps).forEach((key) =>
        app.component(key, this.maps[key])
      )
    }
  }
}

export default Murmur
