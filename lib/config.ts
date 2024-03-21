import get from "lodash/get";
import each from "lodash/each";
import { reactive, ref } from "vue";
import defaultValues from "./config.default";
import { Ref } from "@vue/runtime-core";

type ConfigMap = { [key: string]: any };

export class Config {
  _VALUES: Ref<ConfigMap>;
  _SCOPES: Ref<ConfigMap>;
  constructor(values = {}) {
    this._VALUES = ref({});
    this._SCOPES = ref({});
    this.merge(values);
    return this;
  }
  merge(values = {}) {
    return each(values, (value, key) => {
      this.set(key, value);
    });
  }
  set(key: string, value: any) {
    const levels = key.split(".");
    this._VALUES.value = this._VALUES.value ?? {};

    if (levels.length > 1) {
      const scope = this.scope(levels.shift() as string);
      this._VALUES.value[key] = scope.set(levels.join("."), value);
    } else {
      this._VALUES.value[key] = value;
    }
    return value;
  }
  get(key: string, defaultValue?: Object | null) {
    return get(this._VALUES.value, key, defaultValue);
  }
  is(key: string) {
    const value = this.get(key, null);
    switch (value) {
      case 1:
        return true;
      case true:
        return true;
      case "1":
        return true;
      case "true":
        return true;
      case 0:
        return false;
      case false:
        return false;
      case "0":
        return false;
      case "false":
        return false;
      default:
        return !!value;
    }
  }
  isnt(key: string) {
    return !this.is(key);
  }
  scope(name: string) {
    this.scopes[name] = this.scopes[name] ?? new Config();
    return this.scopes[name];
  }
  get values() {
    return this._VALUES.value;
  }
  get scopes() {
    this._SCOPES.value = this._SCOPES.value ?? ref({});
    return this._SCOPES.value;
  }
}

export default new Config(defaultValues);
