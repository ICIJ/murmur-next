import { config } from '@vue/test-utils';
import {i18n} from "../../lib/i18n";

// @ts-expect-error type
  config.global.plugins = [i18n];
  // @ts-expect-error type
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve({}) },
})
global.HTMLCanvasElement.prototype.getContext = () => null;
global.HTMLCanvasElement.prototype.toDataURL = () => null;
global.URL.createObjectURL = () => "";
