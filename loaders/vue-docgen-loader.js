const vueDocs = require('vue-docgen-api')

module.exports = async function vueDocgenLoader() {
  const callback = this.async()
  const emptyApi = { props: {}, slots: {}, events: {}, methods: {} }
  try {
    const api = await vueDocs.parse(this.resourcePath)
    const json = JSON.stringify(api, null, 2)
    callback(null, `module.exports = ${json}`)
  }
  catch (_) {
    callback(null, `module.exports = ${emptyApi}`)
  }
  return null
}
