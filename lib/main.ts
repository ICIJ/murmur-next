import { createBootstrap } from 'bootstrap-vue-next'
import { i18n } from './i18n'
import * as components from './components'
import * as datavisualisations from './datavisualisations'
import * as maps from './maps'
import config from './config'
import { App, Component, DefineComponent } from 'vue'

export { default as AccordionWrapper } from './components/Accordion/AccordionWrapper.vue'
export { default as AccordionStep } from './components/Accordion/AccordionStep.vue'
export { default as ActiveTextTruncate } from './components/ActiveTextTruncate/ActiveTextTruncate.vue'
export { default as AdvancedLinkForm } from './components/AdvancedLinkForm/AdvancedLinkForm.vue'
export { default as AdvancedLinkFormTab } from './components/AdvancedLinkForm/AdvancedLinkFormTab.vue'
export { default as Brand } from './components/Brand/Brand.vue'
export { default as BrandExpansion } from './components/Brand/BrandExpansion.vue'
export { default as ButtonIcon } from './components/Button/ButtonIcon.vue'
export { default as ButtonIconCounter } from './components/Button/ButtonIconCounter.vue'
export { default as ConfirmButton } from './components/Button/ConfirmButton.vue'
export { default as ContentPlaceholder } from './components/ContentPlaceholder/ContentPlaceholder.vue'
export { default as CustomPagination } from './components/Pagination/CustomPagination.vue'
export { default as DigitsInput } from './components/DigitsInput/DigitsInput.vue'
export { default as DonateForm } from './components/DonateForm/DonateForm.vue'
export { default as EmbeddableFooter } from './components/EmbeddableFooter/EmbeddableFooter.vue'
export { default as EmbedForm } from './components/EmbedForm/EmbedForm.vue'
export { default as FollowUsPopover } from './components/FollowUsPopover/FollowUsPopover.vue'
export { default as GenericFooter } from './components/Generic/GenericFooter.vue'
export { default as GenericHeader } from './components/Generic/GenericHeader.vue'
export { default as HapticCopy } from './components/HapticCopy/HapticCopy.vue'
export { default as ImageMode } from './components/ImageMode/ImageMode.vue'
export { default as ImageModeSource } from './components/ImageMode/ImageModeSource.vue'
export { default as OrdinalLegend } from './components/Legend/OrdinalLegend.vue'
export { default as PhosphorIcon } from './components/PhosphorIcon/PhosphorIcon.vue'
export { default as PhosphorIconLayers } from './components/PhosphorIcon/PhosphorIconLayers.vue'
export { default as RangePicker } from './components/RangePicker/RangePicker.vue'
export { default as ResponsiveIframe } from './components/ResponsiveIframe/ResponsiveIframe.vue'
export { default as ScaleLegend } from './components/Legend/ScaleLegend.vue'
export { default as SecretInput } from './components/SecretInput/SecretInput.vue'
export { default as SelectableDropdown } from './components/SelectableDropdown/SelectableDropdown.vue'
export { default as SharingOptions } from './components/SharingOptions/SharingOptions.vue'
export { default as SharingOptionsLink } from './components/SharingOptions/SharingOptionsLink.vue'
export { default as SignUpForm } from './components/SignUpForm/SignUpForm.vue'
export { default as SlideUpDown } from './components/SlideUpDown/SlideUpDown.vue'
export { default as TexturedDeck } from './components/TexturedDeck/TexturedDeck.vue'
export { default as TinyPagination } from './components/Pagination/TinyPagination.vue'

export { default as BarChart } from './datavisualisations/BarChart/BarChart.vue'
export { default as ColumnChart } from './datavisualisations/ColumnChart/ColumnChart.vue'
export { default as LineChart } from './datavisualisations/LineChart/LineChart.vue'
export { default as StackedBarChart } from './datavisualisations/BarChart/StackedBarChart.vue'
export { default as StackedColumnChart } from './datavisualisations/ColumnChart/StackedColumnChart.vue'

export { default as ChoroplethMap } from './maps/ChoroplethMap/ChoroplethMap.vue'
export { default as ChoroplethMapAnnotation } from './maps/ChoroplethMap/ChoroplethMapAnnotation.vue'
export { default as SymbolMap } from './maps/SymbolMap/SymbolMap.vue'

export { default as EllipsisTooltip } from './directives/EllipsisTooltip'

export { useChart } from './composables/useChart'
export { useResizeObserver } from './composables/useResizeObserver'
export { useColorMode } from './composables/useColorMode'
export { useQueryObserver } from './composables/useQueryObserver'

type ComponentMap = Record<string, Component | DefineComponent>

interface PluginOptions {
  useI18n?: boolean
  useBootstrap?: boolean
  useConfig?: boolean
  registerComponents?: boolean
}

const Murmur = {
  get i18n() {
    return i18n
  },
  get config() {
    return config
  },
  get components(): ComponentMap {
    return components
  },
  get datavisualisations(): ComponentMap {
    return datavisualisations
  },
  get maps(): ComponentMap {
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
      Object.keys(this.components).forEach(key =>
        app.component(key, this.components[key])
      )
      Object.keys(this.datavisualisations).forEach(key =>
        app.component(key, this.datavisualisations[key])
      )
      Object.keys(this.maps).forEach(key =>
        app.component(key, this.maps[key])
      )
    }
  }
}

export default Murmur
