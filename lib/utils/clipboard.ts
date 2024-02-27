import Clipboard from 'clipboard'

export function copyText (text: string, container: Element): Promise<void> {
  return new Promise(function (resolve: (value?:undefined) => void, reject: (value?: Clipboard.Event) => void) {
    const fakeElement = document.createElement('button')
    // Use the document body as container is no valid object is provided
    container = typeof container === 'object' ? container : document.body

    const clipboard: Clipboard = new Clipboard(fakeElement, { text: () => text, container })

    clipboard.on('success', () => {
      clipboard.destroy()
      resolve()
    })

    clipboard.on('error', error => {
      clipboard.destroy()
      reject(error)
    })

    fakeElement.click()
  })
}

export function copyHtml (html: string, plain: string) {
  interface ClipboardEvent extends Event {
    clipboardData: {
      setData: (attribute: string, value: string) => void
    }
  }

  function listener(event: ClipboardEvent) {
    event.clipboardData.setData("text/html", html)
    event.clipboardData.setData("text/plain", plain)
    event.preventDefault()
  }

  document.addEventListener("copy", listener as EventListener)
  document.execCommand("copy")
  document.removeEventListener("copy", listener as EventListener)
}
