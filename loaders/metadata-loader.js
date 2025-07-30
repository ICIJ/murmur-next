const frontmatter = require('front-matter')
const startCase = require('lodash/startCase')
const { dirname, extname, relative } = require('path')

module.exports = function metadataLoader(source) {
  this && this.cacheable && this.cacheable()

  const metadata = {
    title: startCase(dirname(this.resourcePath).split('/').pop()),
    resourcePath: relative('./', this.resourcePath)
  }

  if (extname(this.resourcePath) === '.md') {
    Object.assign(metadata, frontmatter(source).attributes)
  }

  return JSON.stringify(metadata)
}
