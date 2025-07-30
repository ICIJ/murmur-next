const { promises: fs } = require('fs')
const getSassVars = require('get-sass-vars')

module.exports = async function sassExtractLoader() {
  const callback = this.async()
  try {
    const css = await fs.readFile(this.resourcePath, 'utf-8')
    const json = await getSassVars(css)
    callback(null, `module.exports = ${JSON.stringify(json)}`)
  }
  catch (_) {
    callback(null, 'module.exports = {}')
  }
  return null
}
