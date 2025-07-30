import { createI18n, I18n, I18nOptions } from 'vue-i18n'

import fr from '@/locales/fr.json'
import en from '@/locales/en.json'

export const locale = 'en'
export const fallbackLocale = 'en'
export const options: I18nOptions = {
  warnHtmlMessage: false,
  // https://vue-i18n.intlify.dev/guide/advanced/composition.html#implicit-with-injected-properties-and-functions
  globalInjection: true,
  legacy: false,
  locale,
  fallbackLocale,
  messages: { fr, en }
}
export const i18n: I18n = createI18n(options)
