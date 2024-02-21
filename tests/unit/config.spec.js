import { default as config, Config } from '@/config'
import Murmur from '@/main'
import { getCurrentInstance, h} from "vue";
import { mount } from "@vue/test-utils";
describe('config.ts', () => {

  it('should be an instance of `Config`', () => {
    expect(config).toBeInstanceOf(Config)
  })

  it('should define a scope named `foo`', () => {
    config.set('foo.bar', 'uwu')
    expect(config.scope('foo')).toBeInstanceOf(Config)
    expect(config.scope('foo').get('bar')).toBe('uwu')
  })

  it('should define two scopes named `foo` and `bar`', () => {
    config.set('foo.bar', 'uwu')
    config.set('bar.foo', 'owo')
    expect(config.scope('foo').get('bar')).toBe('uwu')
    expect(config.scope('bar').get('foo')).toBe('owo')
    expect(config.scopes.foo).toBeDefined()
    expect(config.scopes.bar).toBeDefined()
  })

  it('should define two values named `foo` and `bar`', () => {
    config.set('foo', 'uwu')
    config.set('bar', 'owo')
    expect(config.values.foo).toBeDefined()
    expect(config.values.bar).toBeDefined()
  })

  it('should merge the given object with the config', () => {
    config.set('foo', 'erased')
    config.merge({ 'foo': 'foo', 'bar': 'bar' })
    expect(config.get('foo')).toBe('foo')
    expect(config.get('bar')).toBe('bar')
  })

  it('should merge all the boolean values', () => {
    config.merge({ 'foo': true, 'bar': false })
    expect(config.get('foo')).toBe(true)
    expect(config.get('bar')).toBe(false)
    config.merge({ 'foo': false, 'bar': true })
    expect(config.get('foo')).toBe(false)
    expect(config.get('bar')).toBe(true)
  })

  it('should merge the given object and its scopes with the config', () => {
    config.merge({ 'foo.bar': 'foobar' })
    expect(config.scope('foo').get('bar')).toBe('foobar')
    config.merge({ 'bar.foo': 'barfoo' })
    expect(config.scope('bar').get('foo')).toBe('barfoo')
  })

  it('should merge the given object with the config with a new key', () => {
    expect(config.get('help')).toBeUndefined()
    config.merge({ 'help': 'link' })
    expect(config.get('help')).toBe('link')
  })

  it('should give the value of a given key as true', () => {
    config.set('activated', 1)
    expect(config.is('activated')).toBeTruthy()
    config.set('activated', '1')
    expect(config.is('activated')).toBeTruthy()
    config.set('activated', 'true')
    expect(config.is('activated')).toBeTruthy()
    config.set('activated', true)
    expect(config.is('activated')).toBeTruthy()
    config.set('activated', 'foo')
    expect(config.is('activated')).toBeTruthy()
    config.set('activated', 'bar')
    expect(config.is('activated')).toBeTruthy()
  })

  it('should give the value of a given key as false', () => {
    config.set('activated', 0)
    expect(config.is('activated')).toBeFalsy()
    config.set('activated', '0')
    expect(config.is('activated')).toBeFalsy()
    config.set('activated', 'false')
    expect(config.is('activated')).toBeFalsy()
    config.set('activated', false)
    expect(config.is('activated')).toBeFalsy()
  })

  it('should give the value of a given key as false (when it\'s true)', () => {
    config.set('activated', 0)
    expect(config.isnt('activated')).toBeTruthy()
    config.set('activated', '0')
    expect(config.isnt('activated')).toBeTruthy()
    config.set('activated', 'false')
    expect(config.isnt('activated')).toBeTruthy()
    config.set('activated', false)
    expect(config.isnt('activated')).toBeTruthy()
  })


  it('should create a reactive property', async () => {
    const component = {
      setup(){
        const app = getCurrentInstance();
        return ()=> h('div', app.appContext.config.globalProperties.$config.get('reactiveProp', 'bar'))
      }
    }

    const wrapper = mount(component,{global: {plugins: [Murmur]} })
    expect(wrapper.text()).toBe('bar')
    wrapper.vm.$config.set('reactiveProp', 'baz')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('baz')
  })


  it('should create a nested reactive property from inside the component', async () => {
    //configVTU.global.plugins.push(Murmur);
    const component = {
      setup(){
        const app = getCurrentInstance();
        return ()=>h('div', app.appContext.config.globalProperties.$config.get('nested.reactiveProp', 'bar'))
      }
    }

    const wrapper = mount(component, {global: {plugins: [Murmur]} })
    expect(wrapper.text()).toBe('bar')
    wrapper.vm.$config.set('nested.reactiveProp', 'baz')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('baz')
  })
})
