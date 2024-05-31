import { resolve } from 'path'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "node:url";
// generates d.ts files
import DTS from "vite-plugin-dts";
import Vue from '@vitejs/plugin-vue'
import Delete from './plugins/plugin-delete'
import VueDocgen from './plugins/plugin-docgen'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  base: '/',
  assetsInclude: ['/sb-preview/**'],
  plugins: [
    Delete(),
    Vue(),
    VueDocgen(),
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
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
  ],
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
  },
  server: {
    host: '0.0.0.0',
    port: 9009
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      vue: resolve(__dirname, './node_modules/vue'),
      node_modules: resolve(__dirname, 'node_modules'),
      $package: resolve(__dirname, 'package.json'),
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
    },
    dedupe: ['vue']
  }
})
