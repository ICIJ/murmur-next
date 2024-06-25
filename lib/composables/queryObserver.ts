import get from 'lodash/get'
import first from 'lodash/first'

import { Ref, reactive } from 'vue'

type ElementMap = {
  [selector: string]: HTMLElement[]
}

type ObserverMap = {
  [selector: string]: MutationObserver
}

export function useQueryObserver(rootRef: Ref<HTMLElement | null>) {
  const elements = reactive<ElementMap>({})
  const observers = reactive<ObserverMap>({})

  const hasElements = (selector: string): boolean => {
    return get(elements, [selector, 'length'], 0) > 0
  }
  
  const hasObserver = (selector: string): boolean => {
    return selector in observers
  }
  
  const updateElements = (selector: string): HTMLElement[] | null => {
    // We search for the give selector until element are found
    if (rootRef.value && !hasElements(selector)) {
      elements[selector] = Array.from(rootRef.value.querySelectorAll(selector))
    }
    return elements[selector] ?? null
  }
  
  const observerCallback = (selector: string) => {
    return () => {
      updateElements(selector)
      if (hasElements(selector)) {
        observers[selector].disconnect()
      }
    }
  }
  
  const observe = (selector: string) =>  {
    updateElements(selector)
    // Wait for the root ref to exist and only create the observer once by selector
    if (rootRef.value && !hasObserver(selector)) {
      observers[selector] = new MutationObserver(observerCallback(selector))
      observers[selector].observe(rootRef.value, { childList: true, subtree: true, })
    }
    return observers[selector]
  }

  const querySelector = (selector: string) => {
    return first(querySelectorAll(selector))
  }

  const querySelectorAll = (selector: string) => {
    observe(selector)
    return get(elements, selector, [])
  }

  return {
    querySelector,
    querySelectorAll,
  }
}
