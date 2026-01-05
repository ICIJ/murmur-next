import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DTS from 'vite-plugin-dts'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// Project imports
import Delete from './plugins/plugin-delete'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
export default defineConfig({
  base: '/',
  assetsInclude: ['/sb-preview/**'],
  plugins: [
    Delete(),
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
    DTS({
      exclude: [
        'tests/**',
        '**/*stories.ts',
        'test',
        'vite',
        'vite.config.ts',
        'vitest.config.ts',
      ],
      outDir: 'dist/lib',
      tsconfigPath: './tsconfig.json',
      // Suppress vite-plugin-dts diagnostic output (bogus TS2614 Vue import errors)
      logLevel: 'silent',
    }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(__dirname, 'lib/locales')
    }),
    /**
     * The Icons plugin from unplugin-icons provides on-demand icon loading
     * from Iconify icon sets (e.g., Phosphor via @iconify-json/ph).
     */
    Icons({
      compiler: 'vue3',
      autoInstall: false
    }),
    /**
     * The "Components" plugin resolvers automatically import components in Vue
     * templates. IconsResolver enables auto-importing icons with the "i-" prefix
     * (example: `<i-ph-caret-left />`).
     */
    Components({
      dts: false,
      dirs: [],
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['ph']
        })
      ]
    }),
    /**
     * The "AutoImport" plugin offers a mechanism similar to the "Components" plugin
     * but it targets JavaScript variables and references.
     */
    AutoImport({
      dts: false,
      vueTemplate: true,
      imports: [],
      resolvers: [
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['ph']
        })
      ]
    })
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      'vue': resolve(__dirname, './node_modules/vue'),
      'node_modules': resolve(__dirname, 'node_modules'),
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
      '~storybook': resolve(__dirname, './.storybook'),
    },
    dedupe: ['vue']
  },
  css: {
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
      sass: { // https://github.com/twbs/bootstrap/issues/40962
        quietDeps: true,
      }
    }
  },
  build: {
    target: 'es2015',
    copyPublicDir: false,
    outDir: 'dist/lib',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: '@icij/murmur',
      fileName: 'murmur'
    },
    rollupOptions: {
      external: ['bootstrap', 'vue', 'bootstrap-vue-next'],
      output: {
        inlineDynamicImports: true,
        globals: {
          vue: 'Vue'
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'murmur.css'
          }
          return assetInfo.name ?? ''
        }
      }
    }
  }
})
