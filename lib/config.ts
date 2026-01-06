import get from 'lodash/get'
import each from 'lodash/each'
import { ref } from 'vue'
import type { Ref } from 'vue'
import defaultValues from './config.default'

/**
 * Supported config value types
 */
export type ConfigValue =
  | string
  | number
  | boolean
  | null
  | object
  | ConfigValue[]
  | Record<string, ConfigValue>

type ConfigValues = Record<string, ConfigValue>
type ConfigScopes = Record<string, Config>

export class Config {
  _VALUES: Ref<ConfigValues>
  _SCOPES: Ref<ConfigScopes>

  constructor(values: ConfigValues = {}) {
    this._VALUES = ref<ConfigValues>({})
    this._SCOPES = ref<ConfigScopes>({})
    this.merge(values)
    return this
  }

  merge(values: ConfigValues = {}): void {
    each(values, (value, key) => {
      this.set(key, value)
    })
  }

  set(key: string, value: ConfigValue): ConfigValue {
    const levels = key.split('.')
    this._VALUES.value = this._VALUES.value ?? {}

    if (levels.length > 1) {
      const scope = this.scope(levels.shift() as string)
      this._VALUES.value[key] = scope.set(levels.join('.'), value)
    }
    else {
      this._VALUES.value[key] = value
    }
    return value
  }

  get<T extends ConfigValue = ConfigValue>(key: string, defaultValue?: T | null): T | null {
    return get(this._VALUES.value, key, defaultValue) as T | null
  }

  is(key: string): boolean {
    const value = this.get(key, null)
    switch (value) {
      case 1:
        return true
      case true:
        return true
      case '1':
        return true
      case 'true':
        return true
      case 0:
        return false
      case false:
        return false
      case '0':
        return false
      case 'false':
        return false
      default:
        return !!value
    }
  }

  isnt(key: string): boolean {
    return !this.is(key)
  }

  scope(name: string): Config {
    this.scopes[name] = this.scopes[name] ?? new Config()
    return this.scopes[name]
  }

  get values(): ConfigValues {
    return this._VALUES.value
  }

  get scopes(): ConfigScopes {
    this._SCOPES.value = this._SCOPES.value ?? {}
    return this._SCOPES.value
  }
}

export default new Config(defaultValues)
