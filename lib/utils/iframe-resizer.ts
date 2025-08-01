import every from 'lodash/every'
import { Child as PymChild } from 'pym.js'
import { injectAssets } from './assets'

// Will hold the pym instance once
let pymChild: PymChild
// URL parameters generated by Pym
const pymParams = ['initialWidth', 'childId', 'parentUrl', 'parentTitle']
// Save the initial window href value in case it changes
const initialHref = window.location.href

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

  sendHeight(): Promise<void> {
    return this.initializer.then(pymChild => pymChild.sendHeight())
  }

  static create(): IframeResizer {
    return new IframeResizer()
  }

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

  static deletePymParams(href: string = initialHref): string {
    const url = new URL(href)
    // Remove all unwanted param
    for (const param of pymParams) {
      url.searchParams.delete(param)
    }
    // Rebuild the URL
    return url.href
  }

  static isEmbedded(href: string = initialHref): boolean {
    const url = new URL(href)
    return every(pymParams, param => url.searchParams.has(param))
  }
}
