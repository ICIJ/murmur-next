import { memoize, flatten } from 'lodash'

let assetUniqueIdCounter = 0

function resolveAssetParent(): HTMLElement {
  return document.querySelector('body') || document.querySelector('head')!
}

function fileExtension(file: string): string {
  const parts = file.split('.')
  return parts[parts.length - 1].toLowerCase()
}

function injectScript(
  parent: HTMLElement,
  file: string,
  id: string,
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
): void {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.onload = resolve
  script.onerror = reject
  parent.appendChild(script)
  script.setAttribute('src', file)
  script.setAttribute('id', id)
}

function injectStylesheet(
  parent: HTMLElement,
  file: string,
  id: string,
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
): void {
  const css = document.createElement('link')
  css.setAttribute('rel', 'stylesheet')
  css.setAttribute('type', 'text/css')
  css.onload = resolve
  css.onerror = reject
  parent.appendChild(css)
  css.setAttribute('href', file)
  css.setAttribute('id', id)
}

/**
 * Inject a JS or CSS asset into the document, resolving once it loads.
 *
 * Results are memoized by file URL so the same asset is injected only once.
 *
 * @param file - The URL of the asset to inject; its extension selects the type.
 * @param id - The element id to assign; defaults to a generated unique id.
 * @returns A promise resolving when the asset loads and rejecting on failure
 *   or on an unsupported extension.
 * @example
 * await injectAsset('https://example.com/widget.js')
 */
export const injectAsset = memoize(function (
  file: string,
  id = `dynamic-asset-${assetUniqueIdCounter++}`
): Promise<unknown> {
  const promise = new Promise((resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => {
    const parent = resolveAssetParent()
    const ext = fileExtension(file)

    if (ext === 'js') {
      injectScript(parent, file, id, resolve, reject)
    }
    else if (ext === 'css') {
      injectStylesheet(parent, file, id, resolve, reject)
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

/**
 * Inject several assets in parallel, resolving once all have settled.
 *
 * A failed asset still counts as settled so one broken URL cannot leave the
 * batch promise pending forever.
 *
 * @param args - Asset URLs, either as separate arguments or nested arrays.
 * @returns A promise resolving when every asset has loaded or failed.
 * @example
 * await injectAssets('a.js', 'b.css')
 */
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
      injectAsset(file)
        .then(allFilesLoaded)
        .catch(allFilesLoaded)
    }
  })
}
