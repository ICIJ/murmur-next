import { createBootstrap } from 'bootstrap-vue-next'
import { App, Component, DefineComponent } from 'vue'
import { i18n } from './i18n'
import * as components from './components'
import * as datavisualisations from './datavisualisations'
import * as maps from './maps'
import config from './config'

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
      const registerAll = (map: ComponentMap) =>
        Object.keys(map).forEach(key => app.component(key, map[key]))
      registerAll(this.components)
      registerAll(this.datavisualisations)
      registerAll(this.maps)
    }
  }
}

export default Murmur
