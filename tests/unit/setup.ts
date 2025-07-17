import { config } from '@vue/test-utils'
import { i18n } from '@/i18n'
import { createBootstrap } from 'bootstrap-vue-next'

// @ts-expect-error type
config.global.plugins = [i18n, createBootstrap()]

// @ts-expect-error type
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) }
})

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

global.HTMLCanvasElement.prototype.getContext = () => null
global.HTMLCanvasElement.prototype.toDataURL = () => null
global.URL.createObjectURL = () => ''
