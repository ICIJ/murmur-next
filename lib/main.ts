import { createBootstrap } from 'bootstrap-vue-next'
import { i18n } from './i18n'
import * as components from './components'
import * as datavisualisations from './datavisualisations'
import * as maps from './maps'
import config from './config'
import { App, Component, DefineComponent } from 'vue'

// Accordion
export { default as AccordionWrapper } from './components/Accordion/AccordionWrapper.vue'
export { default as AccordionStep } from './components/Accordion/AccordionStep.vue'

// ActiveTextTruncate
export { default as ActiveTextTruncate } from './components/ActiveTextTruncate/ActiveTextTruncate.vue'

// Brand
export { default as Brand } from './components/Brand/Brand.vue'
export { default as BrandExpansion } from './components/Brand/BrandExpansion.vue'

// Button
export { default as ButtonIcon } from './components/Button/ButtonIcon.vue'
export { default as ButtonIconCounter } from './components/Button/ButtonIconCounter.vue'
export { default as ButtonConfirm } from './components/Button/ButtonConfirm.vue'
/** @deprecated Use ButtonConfirm instead */
export { default as ConfirmButton } from './components/Button/ButtonConfirm.vue'

// ContentPlaceholder
export { default as ContentPlaceholder } from './components/ContentPlaceholder/ContentPlaceholder.vue'

// EmbeddableFooter
export { default as EmbeddableFooter } from './components/EmbeddableFooter/EmbeddableFooter.vue'

// FollowUsPopover
export { default as FollowUsPopover } from './components/FollowUsPopover/FollowUsPopover.vue'

// Form
export { default as FormAdvancedLink } from './components/Form/FormAdvancedLink/FormAdvancedLink.vue'
/** @deprecated Use FormAdvancedLink instead */
export { default as AdvancedLinkForm } from './components/Form/FormAdvancedLink/FormAdvancedLink.vue'
export { default as FormAdvancedLinkTab } from './components/Form/FormAdvancedLink/FormAdvancedLinkTab.vue'
/** @deprecated Use FormAdvancedLinkTab instead */
export { default as AdvancedLinkFormTab } from './components/Form/FormAdvancedLink/FormAdvancedLinkTab.vue'
export { default as FormDonate } from './components/Form/FormDonate.vue'
/** @deprecated Use FormDonate instead */
export { default as DonateForm } from './components/Form/FormDonate.vue'
export { default as FormEmbed } from './components/Form/FormEmbed.vue'
/** @deprecated Use FormEmbed instead */
export { default as EmbedForm } from './components/Form/FormEmbed.vue'
export { default as FormSignUp } from './components/Form/FormSignUp.vue'
/** @deprecated Use FormSignUp instead */
export { default as SignUpForm } from './components/Form/FormSignUp.vue'

// Form/FormControl
export { default as FormControlDigits } from './components/Form/FormControl/FormControlDigits.vue'
/** @deprecated Use FormControlDigits instead */
export { default as DigitsInput } from './components/Form/FormControl/FormControlDigits.vue'
export { default as FormControlRange } from './components/Form/FormControl/FormControlRange.vue'
/** @deprecated Use FormControlRange instead */
export { default as RangePicker } from './components/Form/FormControl/FormControlRange.vue'
export { default as FormControlSecret } from './components/Form/FormControl/FormControlSecret.vue'
/** @deprecated Use FormControlSecret instead */
export { default as SecretInput } from './components/Form/FormControl/FormControlSecret.vue'
export { default as FormControlSelectableDropdown } from './components/Form/FormControl/FormControlSelectableDropdown.vue'
/** @deprecated Use FormControlSelectableDropdown instead */
export { default as SelectableDropdown } from './components/Form/FormControl/FormControlSelectableDropdown.vue'

// App
export { default as AppFooter } from './components/App/AppFooter.vue'
/** @deprecated Use AppFooter instead */
export { default as GenericFooter } from './components/App/AppFooter.vue'
export { default as AppHeader } from './components/App/AppHeader.vue'
/** @deprecated Use AppHeader instead */
export { default as GenericHeader } from './components/App/AppHeader.vue'

// HapticCopy
export { default as HapticCopy } from './components/HapticCopy/HapticCopy.vue'

// ImageMode
export { default as ImageMode } from './components/ImageMode/ImageMode.vue'
export { default as ImageModeSource } from './components/ImageMode/ImageModeSource.vue'

// Legend
export { default as LegendOrdinal } from './components/Legend/LegendOrdinal.vue'
/** @deprecated Use LegendOrdinal instead */
export { default as OrdinalLegend } from './components/Legend/LegendOrdinal.vue'
export { default as LegendScale } from './components/Legend/LegendScale.vue'
/** @deprecated Use LegendScale instead */
export { default as ScaleLegend } from './components/Legend/LegendScale.vue'

// Pagination
export { default as Pagination } from './components/Pagination/Pagination.vue'
/** @deprecated Use Pagination instead */
export { default as CustomPagination } from './components/Pagination/Pagination.vue'
export { default as PaginationTiny } from './components/Pagination/PaginationTiny.vue'
/** @deprecated Use PaginationTiny instead */
export { default as TinyPagination } from './components/Pagination/PaginationTiny.vue'

export { default as AppIcon } from './components/App/AppIcon.vue'
export { default as AppIconLayers } from './components/App/AppIconLayers.vue'
/** @deprecated Use AppIcon instead */
export { default as PhosphorIcon } from './components/App/AppIcon.vue'
/** @deprecated Use AppIconLayers instead */
export { default as PhosphorIconLayers } from './components/App/AppIconLayers.vue'

// ResponsiveIframe
export { default as ResponsiveIframe } from './components/ResponsiveIframe/ResponsiveIframe.vue'

// SharingOptions
export { default as SharingOptions } from './components/SharingOptions/SharingOptions.vue'
export { default as SharingOptionsLink } from './components/SharingOptions/SharingOptionsLink.vue'

// SlideUpDown
export { default as SlideUpDown } from './components/SlideUpDown/SlideUpDown.vue'

// TexturedDeck
export { default as TexturedDeck } from './components/TexturedDeck/TexturedDeck.vue'

// Datavisualisations
export { default as BarChart } from './datavisualisations/BarChart/BarChart.vue'
export { default as ColumnChart } from './datavisualisations/ColumnChart/ColumnChart.vue'
export { default as LineChart } from './datavisualisations/LineChart/LineChart.vue'
export { default as StackedBarChart } from './datavisualisations/StackedBarChart/StackedBarChart.vue'
export { default as StackedColumnChart } from './datavisualisations/StackedColumnChart/StackedColumnChart.vue'

// Maps
export { default as ChoroplethMap } from './maps/ChoroplethMap/ChoroplethMap.vue'
export { default as ChoroplethMapAnnotation } from './maps/ChoroplethMap/ChoroplethMapAnnotation.vue'
export { default as SymbolMap } from './maps/SymbolMap/SymbolMap.vue'

// Directives
export { default as EllipsisTooltip } from './directives/EllipsisTooltip'

// Composables
export { useChart } from './composables/useChart'
export { useResizeObserver } from './composables/useResizeObserver'
export { useColorMode } from './composables/useColorMode'
export { useQueryObserver } from './composables/useQueryObserver'

// Types - public API for library consumers
export type {
  // Icon types
  IconSize,
  IconWeight,
  // Component internal types (provide/inject)
  Accordion,
  AccordionProvide,
  BrandStyle,
  BrandExpansionStyle,
  // Map internal types (provide/inject)
  MapTransform,
  ParentMap,
  ParentMapProvide,
  // Utility types
  Step,
  BoxStyle,
  ContentPlaceholderRow,
  ContentPlaceholderRows,
  ContentPlaceholderStyledRow,
  ContentPlaceholderStyledRows,
  // Re-exported bootstrap-vue-next types
  TextColorVariant,
  ButtonVariant,
  Size
} from './types'

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
    return (Murmur.i18n.global.locale.value = lang)
  },
  getLocale() {
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
