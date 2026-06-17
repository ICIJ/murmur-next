import every from 'lodash/every'
import { Child as PymChild } from 'pym.js'
import { injectAssets } from './assets'

// Holds the single Pym child instance shared across IframeResizer instances.
let pymChild: PymChild
// URL parameters injected by Pym into embedded pages.
const pymParams = ['initialWidth', 'childId', 'parentUrl', 'parentTitle']
// Capture the initial href once, before any navigation can change it.
const initialHref = window.location.href

/**
 * Wraps Pym.js to let an embedded iframe report its height to its parent.
 *
 * @example
 * const resizer = IframeResizer.create()
 * await resizer.sendHeight()
 */
export default class IframeResizer {
  initializer: Promise<PymChild>

  constructor() {
    this.initializer = injectAssets('//pym.nprapps.org/pym.v1.min.js').then(
      () => {
        pymChild = pymChild || new (window as any).pym.Child({ polling: 300 })
        return pymChild
      }
    )
  }

  /**
   * Report the current document height to the parent frame.
   *
   * @returns A promise resolving once the height has been sent.
   */
  sendHeight(): Promise<void> {
    return this.initializer.then(pymChild => pymChild.sendHeight())
  }

  /**
   * Build a new resizer instance.
   *
   * @returns A fresh `IframeResizer`.
   */
  static create(): IframeResizer {
    return new IframeResizer()
  }

  /**
   * Build the HTML snippet that embeds a given URL as a Pym-resized iframe.
   *
   * @param url - The URL to embed.
   * @param id - The container element id; defaults to a generated unique id.
   * @returns The HTML snippet wiring up the Pym parent.
   */
  static template(
    url: string,
    id: string = 'icij-' + Date.now().toString(32)
  ): string {
    return [
      `<script type="text/javascript" src="https://pym.nprapps.org/pym.v1.min.js"></script>`,
      `<div id="${id}"></div>`,
      `<script>`,
      `const icijIframe = new pym.Parent("${id}", "${IframeResizer.deletePymParams(url)}", {})`,
      `</script>`
    ].join('\n')
  }

  /**
   * Strip every Pym-injected parameter from a URL.
   *
   * @param href - The URL to clean; defaults to the captured initial href.
   * @returns The URL without any Pym parameters.
   */
  static deletePymParams(href: string = initialHref): string {
    const url = new URL(href)
    for (const param of pymParams) {
      url.searchParams.delete(param)
    }
    return url.href
  }

  /**
   * Tell whether a URL is being viewed inside a Pym iframe.
   *
   * @param href - The URL to inspect; defaults to the captured initial href.
   * @returns `true` when every Pym parameter is present.
   */
  static isEmbedded(href: string = initialHref): boolean {
    const url = new URL(href)
    return every(pymParams, param => url.searchParams.has(param))
  }
}
