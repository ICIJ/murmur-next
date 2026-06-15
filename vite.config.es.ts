import { resolve, relative, dirname } from 'path'
import { defineConfig } from 'vite'
import DTS from 'vite-plugin-dts'
import { sharedPlugins, sharedResolve, sharedCss, esmExternal } from './vite.config.shared'

/**
 * Vite 7 emits per-component CSS files but strips the `import './X.css'` from
 * each JS chunk in lib mode (leaving an empty-css comment marker). We re-add
 * those imports — but ONLY into Vue SFC chunks (the *.vue*.js files), never into
 * barrels (main.js, index.js) or other JS modules. CSS only originates from
 * <style> blocks in .vue files, so SFC chunks are the complete and correct set
 * of CSS owners. Injecting into a barrel would make
 * `import { X } from '@icij/murmur-next'` pull EVERY component's CSS (a barrel's
 * importedCss is the union of all its children), defeating CSS tree-shaking.
 */
function restoreCssImports() {
  return {
    name: 'restore-css-imports',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'chunk') continue
        if (!/\.vue\d*\.js$/.test(file.fileName)) continue
        const importedCss = file.viteMetadata?.importedCss
        if (!importedCss || importedCss.size === 0) continue
        const fromDir = dirname(file.fileName)
        const imports = [...importedCss]
          .map((css) => {
            let rel = relative(fromDir, css)
            if (!rel.startsWith('.')) rel = './' + rel
            return `import '${rel}';`
          })
          .join('\n')
        file.code = `${imports}\n${file.code}`
      }
    }
  }
}

export default defineConfig({
  base: '/',
  assetsInclude: ['/sb-preview/**'],
  plugins: [
    // Scope Delete to dist/es only so a preceding UMD pass (dist/lib) is preserved.
    ...sharedPlugins(['dist/es']),
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
      outDir: 'dist/es',
      // Emit .d.ts mirrored from lib/ so types sit beside their .js
      // (dist/es/main.d.ts, dist/es/components/.../X.d.ts).
      entryRoot: 'lib',
      tsconfigPath: './tsconfig.json',
      logLevel: 'silent'
    })
  ],
  resolve: sharedResolve,
  css: sharedCss,
  build: {
    target: 'es2015',
    copyPublicDir: false,
    outDir: 'dist/es',
    emptyOutDir: true,
    sourcemap: true,
    // Emit one CSS file per component chunk, auto-imported by that chunk's JS.
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: esmExternal,
      output: {
        // Mirror the lib/ source tree into dist/es so each module is prunable.
        preserveModules: true,
        preserveModulesRoot: 'lib',
        entryFileNames: '[name].js',
        exports: 'named'
      },
      plugins: [restoreCssImports()]
    }
  }
})
