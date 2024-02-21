import { locale, fallbackLocale, i18n } from '@/i18n'
import  {I18n} from 'vue-i18n'

describe('i18n.js', () => {

  it('exposes a static method called install', () => {

    expectTypeOf(i18n).toMatchTypeOf<I18n>()
  })

  it('should use `en` as default locale', () => {
    expect(locale).toBe('en')
  })


  it('should use `en` as default fallback locale', () => {
    expect(fallbackLocale).toBe('en')
  })
})
