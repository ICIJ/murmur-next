import {createI18n,I18n} from 'vue-i18n'

import fr from '@/locales/fr.json'
import en from '@/locales/en.json'

export const locale: string = 'en'
export const fallbackLocale: string = 'en'
// https://vue-i18n.intlify.dev/guide/advanced/composition.html#implicit-with-injected-properties-and-functions
export const i18n: I18n = createI18n({
  warnHtmlMessage:false,
  globalInjection: true,
  legacy:false,
  locale,
  fallbackLocale,
  messages: { fr, en }
})
