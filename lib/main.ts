import { createBootstrap } from 'bootstrap-vue-next'
import { i18n } from './i18n'
import * as components from './components'
import * as datavisualisations from './datavisualisations'
import * as maps from './maps'
import config from './config'
import { type App } from 'vue'

export { default as AccordionWrapper } from './components/AccordionWrapper.vue'
export { default as AccordionStep } from './components/AccordionStep.vue'
export { default as ActiveTextTruncate } from './components/ActiveTextTruncate.vue'
export { default as AdvancedLinkForm } from './components/AdvancedLinkForm.vue'
export { default as Brand } from './components/Brand.vue'
export { default as BrandExpansion } from './components/BrandExpansion.vue'
export { default as ConfirmButton } from './components/ConfirmButton.vue'
export { default as ContentPlaceholder } from './components/ContentPlaceholder.vue'
export { default as CustomPagination } from './components/CustomPagination.vue'
export { default as DigitsInput } from './components/DigitsInput.vue'
export { default as DonateForm } from './components/DonateForm.vue'
export { default as EmbeddableFooter } from './components/EmbeddableFooter.vue'
export { default as EmbedForm } from './components/EmbedForm.vue'
export { default as Fa } from './components/Fa'
export { default as FollowUsPopover } from './components/FollowUsPopover.vue'
export { default as GenericFooter } from './components/GenericFooter.vue'
export { default as GenericHeader } from './components/GenericHeader.vue'
export { default as HapticCopy } from './components/HapticCopy.vue'
export { default as ImddbHeader } from './components/ImddbHeader.vue'
export { default as OrdinalLegend } from './components/OrdinalLegend.vue'
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

const Murmur = {
  get i18n() {
    return i18n
  },
  get config() {
    return config
  },
  get components() {
    return components
  },
  setLocaleMessage(lang: string, message: any) {
    return Murmur.i18n.global.setLocaleMessage(lang, message)
  },
  mergeLocaleMessage(lang: string, message: any) {
    return Murmur.i18n.global.mergeLocaleMessage(lang, message)
  },
  setLocale(lang: 'fr' | 'en') {
    // @ts-ignore
    return (Murmur.i18n.global.locale.value = lang)
  },
  getLocale() {
    // @ts-ignore
    return Murmur.i18n.global.locale.value
  },
  install(app: App<Element>) {
    app.use(createBootstrap())
    app.use(i18n)

    app.config.globalProperties.$config = Murmur.config
    // @ts-ignore
    Object.keys(components).forEach((key) =>
      app.component(key, components[key])
    )
    // @ts-ignore
    Object.keys(datavisualisations).forEach((key) =>
      app.component(key, datavisualisations[key])
    )
    // @ts-ignore
    Object.keys(maps).forEach((key) => app.component(key, maps[key]))
  }
}

export default Murmur
