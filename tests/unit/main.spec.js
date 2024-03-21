import Murmur from '@/main'
import { createApp } from 'vue'

describe('main.js', () => {
  it('exposes a static method called `install`', () => {
    expect(Murmur.install).toBeDefined()
  })

  it('exposes a static method called `setLocaleMessage`', () => {
    expect(Murmur.setLocaleMessage).toBeDefined()
  })

  it('exposes a static method called `mergeLocaleMessage`', () => {
    expect(Murmur.mergeLocaleMessage).toBeDefined()
  })

  it('exposes a static method called `setLocale`', () => {
    expect(Murmur.setLocale).toBeDefined()
  })

  it('exposes a static method called `getLocale`', () => {
    expect(Murmur.getLocale).toBeDefined()
  })

  it('use plugin to register Murmur components ', () => {
    const app = createApp()
    expect(app._context.components.ContentPlaceholder).toBeUndefined()
    app.use(Murmur)
    expect(app._context.components.ContentPlaceholder).toBeDefined()
  })

  it('has a list of components', () => {
    expect(Murmur.components).toHaveProperty('Brand')
    expect(Murmur.components).toHaveProperty('ContentPlaceholder')
    expect(Murmur.components).toHaveProperty('DonateForm')
    expect(Murmur.components).toHaveProperty('EmbeddableFooter')
    expect(Murmur.components).toHaveProperty('EmbedForm')
    expect(Murmur.components).toHaveProperty('FollowUsPopover')
    expect(Murmur.components).toHaveProperty('Fa')
    expect(Murmur.components).toHaveProperty('GenericFooter')
    expect(Murmur.components).toHaveProperty('GenericHeader')
    expect(Murmur.components).toHaveProperty('ImddbHeader')
    expect(Murmur.components).toHaveProperty('ResponsiveIframe')
    expect(Murmur.components).toHaveProperty('SharingOptions')
    expect(Murmur.components).toHaveProperty('SignUpForm')
    expect(Murmur.components).toHaveProperty('SlideUpDown')
  })

  it('has a locale', () => {
    expect(Murmur.getLocale()).toBe('en')
  })

  it('can update the locale', () => {
    Murmur.setLocale('en')
    expect(Murmur.getLocale()).toBe('en')
    Murmur.setLocale('fr')
    expect(Murmur.getLocale()).toBe('fr')
  })

  it('can define a new locale', () => {
    Murmur.setLocaleMessage('jp', {
      hello: 'もしもし'
    })

    Murmur.setLocale('jp')
    expect(Murmur.i18n.global.t('hello')).toBe('もしもし')
  })

  it('can merge an existing locale with new messages', () => {
    expect(Murmur.getLocale()).toBe('en')
    Murmur.mergeLocaleMessage('en', {
      hello: 'world',
      foo: 'bar'
    })
    expect(Murmur.i18n.global.t('hello')).toBe('world')
    expect(Murmur.i18n.global.t('foo')).toBe('bar')
  })

  afterEach(() => {
    Murmur.setLocale('en')
  })
})
