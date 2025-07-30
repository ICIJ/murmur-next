import { memoize, flatten } from 'lodash'

let assetUniqueIdCounter = 0

export const injectAsset = memoize(function (
  file: string,
  id = `dynamic-asset-${assetUniqueIdCounter++}`
): Promise<unknown> {
  return new Promise((resolve: (value?: unknown) => void) => {
    const parent: HTMLElement
      = document.querySelector('body') || document.querySelector('head')!
    const parts = file.split('.')
    const ext = parts[parts.length - 1].toLowerCase()

    if (ext === 'js') {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.onload = resolve
      parent.appendChild(script)
      script.setAttribute('src', file)
      script.setAttribute('id', id)
    }
    else if (ext === 'css') {
      const css = document.createElement('link')
      css.setAttribute('rel', 'stylesheet')
      css.setAttribute('type', 'text/css')
      css.onload = resolve
      parent.appendChild(css)
      css.setAttribute('href', file)
      css.setAttribute('id', id)
    }
  })
})

export const injectAssets = function (...args: string[]): Promise<void> {
  const files = flatten(args)
  return new Promise((resolve: () => void) => {
    let filesLoaded = 0
    const allFilesLoaded = function () {
      if (++filesLoaded == files.length) {
        resolve()
      }
    }
    for (const file of files) {
      injectAsset(file)
        .then(allFilesLoaded)
        .catch(() => null)
    }
  })
}
