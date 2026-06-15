import { resolve, isAbsolute } from 'path'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Delete from './plugins/plugin-delete'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'

/**
 * Plugins shared by both build passes. A factory (not a constant array) so each
 * pass gets fresh plugin instances and can append its own DTS config.
 *
 * @param cleanTargets Override the directories the Delete plugin will wipe before
 *   building. Defaults to `['dist']` (the whole output root). Pass a narrower
 *   list (e.g. `['dist/es']`) when running a secondary build pass so it does not
 *   remove the output of a previous pass.
 */
export function sharedPlugins(cleanTargets?: string[]) {
  return [
    Delete(cleanTargets ? { targetFiles: cleanTargets } : undefined),
    Vue({
      template: {
        transformAssetUrls: {
          'image-mode': ['src'],
          'image-mode-source': ['src'],
          'b-img': ['src'],
          'video': ['src', 'poster'],
          'source': ['src'],
          'img': ['src'],
          'image': ['xlink:href', 'href'],
          'use': ['xlink:href', 'href']
        }
      }
    }),
    VueI18nPlugin({
      include: resolve(__dirname, 'lib/locales')
    }),
    Icons({
      scale: 1,
      compiler: 'vue3',
      autoInstall: false
    }),
    Components({
      dts: false,
      dirs: [],
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver({ prefix: 'i', enabledCollections: ['ph'] })
      ]
    }),
    AutoImport({
      dts: false,
      vueTemplate: true,
      imports: [],
      resolvers: [IconsResolver({ prefix: 'i', enabledCollections: ['ph'] })]
    })
  ]
}

export const sharedResolve = {
  extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  alias: {
    'vue': resolve(__dirname, './node_modules/vue'),
    'node_modules': resolve(__dirname, 'node_modules'),
    '@': fileURLToPath(new URL('./lib', import.meta.url)),
    '~storybook': resolve(__dirname, './.storybook')
  },
  dedupe: ['vue']
}

export const sharedCss = {
  preprocessorOptions: {
    scss: {
      api: 'modern',
      silenceDeprecations: ['legacy-js-api', 'import', 'color-functions', 'global-builtin', 'if-function'],
      additionalData: `
            @use 'sass:math';
            @use 'sass:color';
            @import "@/styles/lib.scss";
          `
    },
    sass: {
      quietDeps: true // https://github.com/twbs/bootstrap/issues/40962
    }
  }
}

/** Narrow external list for the UMD pass: only the peers a CDN page provides. */
export const umdExternal = ['bootstrap', 'vue', 'bootstrap-vue-next']

/**
 * Packages that ship raw, uncompiled sources (e.g. a `.vue` SFC) instead of
 * built JS. These MUST be bundled, not externalized: a consumer's bundler would
 * otherwise receive a bare `import 'pkg/src/foo.vue'` it cannot process without
 * a Vue SFC transform over node_modules. vue-headroom (a GitHub-only dep used by
 * AppHeader) exposes `vue-headroom/src/headroom.vue`.
 */
const RAW_SOURCE_PACKAGES = ['vue-headroom']

// A specifier produced by this build or by a plugin at build time — relative
// paths, Rollup virtuals (`\0`), unplugin-icons' "~icons/...", the "@/" source
// alias, or an absolute path. None of these map to an installable package, so
// they must be bundled rather than externalized.
function isLocalOrVirtualModule(id: string): boolean {
  return (
    id.startsWith('.')
    || id.startsWith('\0')
    || id.startsWith('~')
    || id.startsWith('virtual:')
    || id.startsWith('@/')
    || isAbsolute(id)
  )
}

// A raw-source package (see RAW_SOURCE_PACKAGES) imported either directly or via
// a deep path such as "vue-headroom/src/headroom.vue".
function isBundledRawSourcePackage(id: string): boolean {
  return RAW_SOURCE_PACKAGES.some(pkg => id === pkg || id.startsWith(`${pkg}/`))
}

/**
 * Rollup `external` predicate for the ESM pass. Real third-party packages stay
 * external so consumers dedupe and tree-shake them via their own node_modules;
 * everything local, virtual, or raw-source gets bundled.
 */
export function esmExternal(id: string): boolean {
  if (isLocalOrVirtualModule(id)) {
    return false
  }
  if (isBundledRawSourcePackage(id)) {
    return false
  }
  return true
}
