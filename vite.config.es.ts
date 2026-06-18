import { resolve, relative, dirname, sep } from 'path'
import { defineConfig } from 'vite'
import DTS from 'vite-plugin-dts'
import { sharedPlugins, sharedResolve, sharedCss, esmExternal } from './vite.config.shared'

// A Vue SFC compiles to one or more chunks named like Foo.vue.js / Foo.vue2.js.
// These are the only chunks that own component CSS — barrels and plain modules
// never do.
function isSfcChunk(fileName) {
  return /\.vue\d*\.js$/.test(fileName)
}

// Build the relative `import` specifier for a CSS file as seen from the chunk
// that imports it. Normalize to POSIX separators: on Windows `relative()` yields
// backslashes, which are invalid in ESM import specifiers.
function toRelativeCssSpecifier(chunkFileName, cssFileName) {
  const relativePath = relative(dirname(chunkFileName), cssFileName).split(sep).join('/')
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

// Re-add the per-component CSS imports that Vite 7 strips in lib mode, but ONLY
// into SFC chunks — never barrels (main.js, index.js), whose importedCss is the
// union of all children and would make `import { X } from '@icij/murmur'`
// pull every component's CSS, defeating tree-shaking. Returns the set of CSS
// files that received an importer, for the orphan check below.
function injectCssImportsIntoSfcChunks(bundle) {
  const importedCssFiles = new Set()
  for (const file of Object.values(bundle)) {
    if (file.type !== 'chunk' || !isSfcChunk(file.fileName)) {
      continue
    }
    const importedCss = file.viteMetadata?.importedCss
    if (!importedCss?.size) {
      continue
    }
    const importStatements = [...importedCss]
      .map((cssFileName) => {
        importedCssFiles.add(cssFileName)
        return `import '${toRelativeCssSpecifier(file.fileName, cssFileName)}';`
      })
      .join('\n')
    file.code = `${importStatements}\n${file.code}`
  }
  return importedCssFiles
}

// Safety net: the SFC-chunk filename pattern is a Vite/plugin-vue convention, so
// assert every emitted CSS asset ended up imported by some chunk. If a future
// Vite version changes chunk naming (so isSfcChunk stops matching) or a non-SFC
// module imports CSS directly, fail the build LOUD here instead of silently
// shipping components with missing styles.
function assertEveryCssFileIsImported(bundle, importedCssFiles) {
  const orphanCssFiles = Object.values(bundle)
    .filter(file => file.type === 'asset' && file.fileName.endsWith('.css'))
    .map(file => file.fileName)
    .filter(fileName => !importedCssFiles.has(fileName))
  if (orphanCssFiles.length === 0) {
    return
  }
  throw new Error(
    `restore-css-imports: ${orphanCssFiles.length} CSS file(s) were emitted but `
    + `imported by no JS chunk, so their styles would be silently dropped: `
    + `${orphanCssFiles.join(', ')}. The SFC chunk-name pattern likely no longer `
    + `matches (Vite upgrade) or a non-SFC module imported CSS directly.`
  )
}

// Vite 7 emits per-component CSS files but strips each chunk's `import './X.css'`
// in lib mode. This plugin restores them so per-component styles load on demand.
function restoreCssImports() {
  return {
    name: 'restore-css-imports',
    generateBundle(_options, bundle) {
      const importedCssFiles = injectCssImportsIntoSfcChunks(bundle)
      assertEveryCssFileIsImported(bundle, importedCssFiles)
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
        // Raw-source deps that we bundle rather than externalize (e.g.
        // vue-headroom) live under node_modules, so preserveModules would emit
        // them to dist/es/node_modules/*. npm strips nested node_modules/ from
        // published tarballs, which breaks the import. Relocate those chunks
        // under _vendor/ instead; Rollup rewrites the importing specifiers to
        // match, so AppHeader points at the shipped file.
        entryFileNames: (chunk) => {
          const name = chunk.name.replace(/(^|\/)node_modules\//, '$1_vendor/')
          return `${name}.js`
        },
        exports: 'named'
      },
      plugins: [restoreCssImports()]
    }
  }
})
