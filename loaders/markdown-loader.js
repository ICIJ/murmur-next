'use strict'

/**
 * @src https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/markdown-loader
 * Module dependencies.
 */

const { EventEmitter } = require('events')
const { getOptions } = require('loader-utils')
const { fs, path, hash, parseFrontmatter, } = require('@vuepress/shared-utils')
const LRU = require('lru-cache')
const md = require('@vuepress/markdown')

const cache = LRU({ max: 1000 })

/**
 * Expose markdown loader.
 */

module.exports = function (src) {
  const isProd = process.env.NODE_ENV === 'production'
  const options = getOptions(this)
  const { sourceDir } = options
  let { markdown } = options
  // Duck-typing to ensure we received a correct markdown-it instance
  if (!markdown || !markdown.parse) {
    markdown = md()
  }

  // we implement a manual cache here because this loader is chained before
  // vue-loader, and will be applied on the same file multiple times when
  // selecting the individual blocks.
  const file = this.resourcePath
  const key = hash(file + src)
  const cached = cache.get(key)
  if (cached && (isProd || /\?vue/.test(this.resourceQuery))) {
    return cached
  }

  const frontmatter = parseFrontmatter(src)
  const content = frontmatter.content

  // the render method has been augmented to allow plugins to
  // register data during render
  const { html, data: { hoistedTags, links }, dataBlockString } = markdown.render(content)

  // check if relative links are valid
  links && links.forEach((link) => {
    link = decodeURIComponent(link)

    const shortname = link
      .replace(/#.*$/, '')
      .replace(/\.html$/, '.md')

    const filename = shortname
      .replace(/\/$/, '/README.md')
      .replace(/^\//, sourceDir + '/')

    const altname = shortname
      .replace(/\/$/, '/index.md')
      .replace(/^\//, sourceDir + '/')

    const dir = path.dirname(this.resourcePath)
    const file = path.resolve(dir, filename)
    const altfile = altname !== filename ? path.resolve(dir, altname) : null

    if (!fs.existsSync(file) && (!altfile || !fs.existsSync(altfile))) {
      this.emitWarning(
        new Error(
          `\nFile for relative link "${link}" does not exist.\n`
          + `(Resolved file: ${file})\n`
        )
      )
    }
  })

  const res = (
    `<template>\n`
    + `<div>${html}</div>\n`
    + `</template>\n`
    + `<script>
      export default { }
    </script>`
    + (hoistedTags || []).join('\n')
    + `\n${dataBlockString}\n`
  )
  cache.set(key, res)
  return res
}

module.exports.frontmatterEmitter = new EventEmitter()
