import { resolve, relative, dirname, sep } from 'path'
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
 *
 * The SFC-chunk filename pattern is a Vite/plugin-vue convention, so as a safety
 * net we assert every emitted CSS asset ends up imported by some chunk. If a
 * future Vite version changes chunk naming (so the regex stops matching) or a
 * non-SFC module starts importing CSS directly, the build FAILS LOUD here
 * instead of silently shipping components with missing styles.
 */
function restoreCssImports() {
  return {
    name: 'restore-css-imports',
    generateBundle(_options, bundle) {
      const importedCssFiles = new Set()
      for (const file of Object.values(bundle)) {
        if (file.type !== 'chunk') continue
        if (!/\.vue\d*\.js$/.test(file.fileName)) continue
        const importedCss = file.viteMetadata?.importedCss
        if (!importedCss?.size) continue
        const fromDir = dirname(file.fileName)
        const imports = [...importedCss]
          .map((css) => {
            importedCssFiles.add(css)
            // Normalize to POSIX separators: on Windows `relative()` yields
            // backslashes, which are invalid in ESM import specifiers.
            let rel = relative(fromDir, css).split(sep).join('/')
            if (!rel.startsWith('.')) rel = `./${rel}`
            return `import '${rel}';`
          })
          .join('\n')
        file.code = `${imports}\n${file.code}`
      }
      const orphanCss = Object.values(bundle)
        .filter(file => file.type === 'asset' && file.fileName.endsWith('.css'))
        .map(file => file.fileName)
        .filter(name => !importedCssFiles.has(name))
      if (orphanCss.length > 0) {
        this.error(
          `restore-css-imports: ${orphanCss.length} CSS file(s) were emitted but `
          + `imported by no JS chunk, so their styles would be silently dropped: `
          + `${orphanCss.join(', ')}. The SFC chunk-name pattern likely no longer `
          + `matches (Vite upgrade) or a non-SFC module imported CSS directly.`
        )
      }
    }
  }
}

export default defineConfig({
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
