// Node.js built-ins
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// Vite and plugins
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DTS from 'vite-plugin-dts' // generates d.ts files
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// Project imports
import Delete from './plugins/plugin-delete'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import { PhosphorVuePreset } from './bin/presets'
import { PhosphorVueResolver } from './bin/resolvers'
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
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
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
    }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(__dirname, 'lib/locales')
    }),
    /**
     * The "Components" plugin resolvers automatically import components in Vue
     * templates. For PhosphorVueResolver we use a homemade resolver
     * that simply imports icons (example: `<ph-plus>`).
     */
    Components({
      dts: false,
      dirs: [],
      resolvers: [
        BootstrapVueNextResolver(),
        PhosphorVueResolver()
      ]
    }),
    /**
     * The "AutoImport" plugin offers a mechanism similar to the "Components" plugin
     * but it targets JavaScript variables and references. This allows importing components
     * directly in `<script setup>` or in Vue template refs (example: `<component :is="PhPlus" />`)
     */
    AutoImport({
      dts: false,
      vueTemplate: true,
      imports: [PhosphorVuePreset()],
      resolvers: [PhosphorVueResolver()]
    })
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      vue: resolve(__dirname, './node_modules/vue'),
      node_modules: resolve(__dirname, 'node_modules'),
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
      '~storybook': resolve(__dirname, './.storybook'),
    },
    dedupe: ['vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api'],
        api: 'modern',
        additionalData: `
            @use 'sass:math';
            @use 'sass:color';
            @import '@/styles/lib.scss';
          `
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
