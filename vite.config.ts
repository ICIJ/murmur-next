import { resolve } from 'path'
import { defineConfig } from 'vite'
import DTS from 'vite-plugin-dts'
import { sharedPlugins, sharedResolve, sharedCss, umdExternal } from './vite.config.shared'

export default defineConfig({
  base: '/',
  assetsInclude: ['/sb-preview/**'],
  plugins: [
    ...sharedPlugins(),
    DTS({
      exclude: [
        'tests/**',
        '**/*stories.ts',
        'test',
        'vite',
        'vite.config.ts',
        'vite.config.es.ts',
        'vite.config.shared.ts',
        'vitest.config.ts'
      ],
      outDir: 'dist/lib',
      tsconfigPath: './tsconfig.json',
      logLevel: 'silent'
    })
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
