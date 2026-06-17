import { type Directive, type DirectiveBinding } from 'vue'
import { type BPopoverProps } from 'bootstrap-vue-next'

import {
  bind,
  type ElementWithPopper,
  resolveActiveStatus,
  resolveContent,
  resolveDirectiveProps,
  unbind,
} from '@/utils/floatingUi'

interface ElementWithResizeObserver extends ElementWithPopper {
  $__ellipsisResizeObserver?: ResizeObserver
}

// An element is truncated when its rendered width is narrower than the width
// its content would occupy without clipping (e.g. `text-overflow: ellipsis`).
const isTruncated = (el: HTMLElement): boolean => el.offsetWidth < el.scrollWidth

/**
 * Show the tooltip only while the element is truncated; remove it otherwise.
 *
 * @param el - The element whose truncation state drives the tooltip.
 * @param binding - The directive binding passed to the Vue hook.
 * @param props - Resolved popper props (title, tooltip flag, placement, …).
 */
function syncTooltipWithTruncation(
  el: HTMLElement,
  binding: DirectiveBinding,
  props: BPopoverProps,
): void {
  if (isTruncated(el)) {
    bind(el, binding, props)
  }
  else {
    unbind(el)
  }
}

/**
 * Watch the element for size changes and keep its tooltip in sync.
 *
 * The observer is returned so the caller can store it on the element and
 * disconnect it when the directive unmounts.
 *
 * @param el - The element to observe.
 * @param binding - The directive binding passed to the Vue hook.
 * @param props - Resolved popper props applied when binding the tooltip.
 * @returns The active `ResizeObserver` observing the element.
 */
function observeTruncation(
  el: HTMLElement,
  binding: DirectiveBinding,
  props: BPopoverProps,
): ResizeObserver {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      syncTooltipWithTruncation(entry.target as HTMLElement, binding, props)
    }
  })
  resizeObserver.observe(el)
  return resizeObserver
}

/**
 * Directive that attaches a tooltip to an element, but only while its text is
 * truncated (overflowing its box). The tooltip appears when the element is
 * clipped and disappears once it fits, tracked live through a `ResizeObserver`.
 *
 * @example
 * ```html
 * <div class="text-truncate" v-ellipsis-tooltip title="Full text here">
 *   Full text here
 * </div>
 * ```
 */
export default {
  mounted(el: ElementWithResizeObserver, binding: DirectiveBinding) {
    const tooltip = resolveActiveStatus(binding.value)
    const text = resolveContent(binding.value, el)
    const title = text.title ?? text.body
    if (!tooltip) {
      return
    }
    if (!title) {
      return
    }

    // Tooltips driven by truncation must stay noninteractive so hovering the
    // popper itself never keeps it open once the text no longer overflows.
    const props = { noninteractive: true, ...resolveDirectiveProps(binding, el), title, tooltip }

    el.$__ellipsisResizeObserver = observeTruncation(el, binding, props)
    syncTooltipWithTruncation(el, binding, props)
  },
  beforeUnmount(el: ElementWithResizeObserver) {
    el.$__ellipsisResizeObserver?.disconnect()
    delete el.$__ellipsisResizeObserver
    unbind(el)
  },
} satisfies Directive<ElementWithResizeObserver>
