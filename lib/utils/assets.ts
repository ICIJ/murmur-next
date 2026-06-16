import { memoize, flatten } from 'lodash'

let assetUniqueIdCounter = 0

export const injectAsset = memoize(function (
  file: string,
  id = `dynamic-asset-${assetUniqueIdCounter++}`
): Promise<unknown> {
  const promise = new Promise((resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => {
    const parent: HTMLElement
      = document.querySelector('body') || document.querySelector('head')!
    const parts = file.split('.')
    const ext = parts[parts.length - 1].toLowerCase()

    if (ext === 'js') {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.onload = resolve
      script.onerror = reject
      parent.appendChild(script)
      script.setAttribute('src', file)
      script.setAttribute('id', id)
    }
    else if (ext === 'css') {
      const css = document.createElement('link')
      css.setAttribute('rel', 'stylesheet')
      css.setAttribute('type', 'text/css')
      css.onload = resolve
      css.onerror = reject
      parent.appendChild(css)
      css.setAttribute('href', file)
      css.setAttribute('id', id)
    }
    else {
      reject(new Error(`Unsupported asset extension: ${ext}`))
    }
  })
  // Don't keep a failed injection cached forever, so callers can retry later.
  return promise.catch((err) => {
    injectAsset.cache?.delete(file)
    throw err
  })
})

export const injectAssets = function (...args: string[]): Promise<void> {
  const files = flatten(args)
  return new Promise((resolve: () => void) => {
    if (files.length === 0) {
      resolve()
      return
    }
    let filesLoaded = 0
    const allFilesLoaded = function () {
      if (++filesLoaded == files.length) {
        resolve()
      }
    }
    for (const file of files) {
      // Count a failed injection as "settled" too, otherwise one asset that
      // fails to load leaves the batch promise pending forever.
      injectAsset(file)
        .then(allFilesLoaded)
        .catch(allFilesLoaded)
    }
  })
}
