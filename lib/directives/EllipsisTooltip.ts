import { type Directive } from 'vue'

import {
  bind,
  type ElementWithPopper,
  resolveActiveStatus,
  resolveContent,
  resolveDirectiveProps,
  unbind,
 } from 'bootstrap-vue-next/src/utils/floatingUi'

export default {
  mounted(el, binding) {
    const props = resolveDirectiveProps(binding, el)
    const tooltip = resolveActiveStatus(binding.value)
    const text = resolveContent(binding.value, el)
    const title = text.title ?? text.content
    const noninteractive = true
    if (!tooltip) return
    if (!title) return

    const isTruncated = (el: HTMLElement) => el.offsetWidth < el.scrollWidth
    const bindTooltip = (el: HTMLElement) => bind(el, binding, { noninteractive, ...props, title, tooltip })
    const unbindTooltip = (el: HTMLElement) => unbind(el)
    const toggleTooltip = (el: HTMLElement) => isTruncated(el) ? bindTooltip(el) : unbindTooltip(el)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        toggleTooltip(entry.target as HTMLElement)
      }
    })

    resizeObserver.observe(el)
    toggleTooltip(el)
  },
  beforeUnmount(el) {
    unbind(el)
  }
} satisfies Directive<ElementWithPopper>
