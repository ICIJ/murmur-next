import { config } from '@vue/test-utils'

import { default as murmurConfig, Config } from '@/config'
import Murmur from '@/main'
import { getCurrentInstance, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeAll } from 'vitest'
describe('config.ts', () => {
  beforeAll(() => {
    config.global.plugins = []
  })
  it('should be an instance of `Config`', () => {
    expect(murmurConfig).toBeInstanceOf(Config)
  })

  it('should define a scope named `foo`', () => {
    murmurConfig.set('foo.bar', 'uwu')
    expect(murmurConfig.scope('foo')).toBeInstanceOf(Config)
    expect(murmurConfig.scope('foo').get('bar')).toBe('uwu')
  })

  it('should define two scopes named `foo` and `bar`', () => {
    murmurConfig.set('foo.bar', 'uwu')
    murmurConfig.set('bar.foo', 'owo')
    expect(murmurConfig.scope('foo').get('bar')).toBe('uwu')
    expect(murmurConfig.scope('bar').get('foo')).toBe('owo')
    expect(murmurConfig.scopes.foo).toBeDefined()
    expect(murmurConfig.scopes.bar).toBeDefined()
  })

  it('should define two values named `foo` and `bar`', () => {
    murmurConfig.set('foo', 'uwu')
    murmurConfig.set('bar', 'owo')
    expect(murmurConfig.values.foo).toBeDefined()
    expect(murmurConfig.values.bar).toBeDefined()
  })

  it('should merge the given object with the murmurConfig', () => {
    murmurConfig.set('foo', 'erased')
    murmurConfig.merge({ foo: 'foo', bar: 'bar' })
    expect(murmurConfig.get('foo')).toBe('foo')
    expect(murmurConfig.get('bar')).toBe('bar')
  })

  it('should merge all the boolean values', () => {
    murmurConfig.merge({ foo: true, bar: false })
    expect(murmurConfig.get('foo')).toBe(true)
    expect(murmurConfig.get('bar')).toBe(false)
    murmurConfig.merge({ foo: false, bar: true })
    expect(murmurConfig.get('foo')).toBe(false)
    expect(murmurConfig.get('bar')).toBe(true)
  })

  it('should merge the given object and its scopes with the murmurConfig', () => {
    murmurConfig.merge({ 'foo.bar': 'foobar' })
    expect(murmurConfig.scope('foo').get('bar')).toBe('foobar')
    murmurConfig.merge({ 'bar.foo': 'barfoo' })
    expect(murmurConfig.scope('bar').get('foo')).toBe('barfoo')
  })

  it('should merge the given object with the murmurConfig with a new key', () => {
    expect(murmurConfig.get('help')).toBeUndefined()
    murmurConfig.merge({ help: 'link' })
    expect(murmurConfig.get('help')).toBe('link')
  })

  it('should give the value of a given key as true', () => {
    murmurConfig.set('activated', 1)
    expect(murmurConfig.is('activated')).toBeTruthy()
    murmurConfig.set('activated', '1')
    expect(murmurConfig.is('activated')).toBeTruthy()
    murmurConfig.set('activated', 'true')
    expect(murmurConfig.is('activated')).toBeTruthy()
    murmurConfig.set('activated', true)
    expect(murmurConfig.is('activated')).toBeTruthy()
    murmurConfig.set('activated', 'foo')
    expect(murmurConfig.is('activated')).toBeTruthy()
    murmurConfig.set('activated', 'bar')
    expect(murmurConfig.is('activated')).toBeTruthy()
  })

  it('should give the value of a given key as false', () => {
    murmurConfig.set('activated', 0)
    expect(murmurConfig.is('activated')).toBeFalsy()
    murmurConfig.set('activated', '0')
    expect(murmurConfig.is('activated')).toBeFalsy()
    murmurConfig.set('activated', 'false')
    expect(murmurConfig.is('activated')).toBeFalsy()
    murmurConfig.set('activated', false)
    expect(murmurConfig.is('activated')).toBeFalsy()
  })

  it('should give the value of a given key as false (when it\'s true)', () => {
    murmurConfig.set('activated', 0)
    expect(murmurConfig.isnt('activated')).toBeTruthy()
    murmurConfig.set('activated', '0')
    expect(murmurConfig.isnt('activated')).toBeTruthy()
    murmurConfig.set('activated', 'false')
    expect(murmurConfig.isnt('activated')).toBeTruthy()
    murmurConfig.set('activated', false)
    expect(murmurConfig.isnt('activated')).toBeTruthy()
  })

  it('should create a reactive property', async () => {
    const component = {
      setup() {
        const app = getCurrentInstance()
        return () => h('div', app.appContext.config.globalProperties.$config.get('reactiveProp', 'bar'))
      }
    }

    const wrapper = mount(component, { global: { plugins: [Murmur] } })
    expect(wrapper.text()).toBe('bar')
    wrapper.vm.$config.set('reactiveProp', 'baz')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('baz')
  })

  it('should create a nested reactive property from inside the component', async () => {
    // configVTU.global.plugins.push(Murmur);
    const component = {
      setup() {
        const app = getCurrentInstance()
        return () => h('div', app.appContext.config.globalProperties.$config.get('nested.reactiveProp', 'bar'))
      }
    }

    const wrapper = mount(component, { global: { plugins: [Murmur] } })
    expect(wrapper.text()).toBe('bar')
    wrapper.vm.$config.set('nested.reactiveProp', 'baz')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('baz')
  })
})
