import { resolve } from 'path'
import { defineConfig } from 'vite'
import { sharedPlugins, sharedResolve, sharedCss, umdExternal } from './vite.config.shared'

// Type declarations are emitted only by the ESM pass (vite.config.es.ts) into
// dist/es, which is where package.json `types`/`exports.types` resolve. Running
// vite-plugin-dts here too would regenerate the whole declaration set into
// dist/lib, where nothing references it — wasted build time.
export default defineConfig({
  base: '/',
  assetsInclude: ['/sb-preview/**'],
  plugins: [
    ...sharedPlugins()
  ],
  resolve: sharedResolve,
  css: sharedCss,
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
      external: umdExternal,
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
