import Clipboard from 'clipboard'

/**
 * Copy plain text to the clipboard using a throwaway button element.
 *
 * @param text - The text to copy.
 * @param container - The element the temporary clipboard target lives in;
 *   falls back to `document.body` when not a valid object.
 * @returns A promise that resolves once the copy succeeds and rejects on failure.
 * @example
 * await copyText('hello', document.body)
 */
export function copyText(text: string, container: Element): Promise<void> {
  return new Promise(function (
    resolve: (value?: undefined) => void,
    reject: (value?: Clipboard.Event) => void
  ) {
    const fakeElement = document.createElement('button')
    // Fall back to the document body when no valid container is provided.
    container = typeof container === 'object' ? container : document.body

    const clipboard: Clipboard = new Clipboard(fakeElement, {
      text: () => text,
      container
    })

    clipboard.on('success', () => {
      clipboard.destroy()
      resolve()
    })

    clipboard.on('error', (error) => {
      clipboard.destroy()
      reject(error)
    })

    fakeElement.click()
  })
}

/**
 * Copy rich content to the clipboard with both HTML and plain-text flavors.
 *
 * @param html - The HTML representation written to the `text/html` flavor.
 * @param plain - The fallback text written to the `text/plain` flavor.
 * @example
 * copyHtml('<b>hello</b>', 'hello')
 */
export function copyHtml(html: string, plain: string) {
  interface ClipboardEvent extends Event {
    clipboardData: {
      setData: (attribute: string, value: string) => void
    }
  }

  function writeClipboardFlavors(event: ClipboardEvent) {
    event.clipboardData.setData('text/html', html)
    event.clipboardData.setData('text/plain', plain)
    event.preventDefault()
  }

  document.addEventListener('copy', writeClipboardFlavors as EventListener)
  document.execCommand('copy')
  document.removeEventListener('copy', writeClipboardFlavors as EventListener)
}
