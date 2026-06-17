/**
 * floatingUI from https://github.com/bootstrap-vue-next/bootstrap-vue-next/blob/main/packages/bootstrap-vue-next/src/utils/floatingUi.ts
 * It's no longer exported by BVN so we need to copy it.
 */

import type { Boundary, Placement, RootBoundary } from '@floating-ui/vue'
export { autoUpdate } from '@floating-ui/vue'

import { type DirectiveBinding, h, render } from 'vue'
import { BPopover, BPopoverProps } from 'bootstrap-vue-next'

/**
 * Map a Floating UI placement to its Bootstrap placement keyword.
 *
 * @param placement - The Floating UI placement (e.g. `'left-start'`).
 * @returns The Bootstrap placement keyword (`'start'`, `'end'`, or the side).
 */
export const resolveBootstrapPlacement = (placement: Placement): string => {
  const [side] = placement.split('-')
  switch (side) {
    case 'left':
      return 'start'
    case 'right':
      return 'end'
    default:
      return side
  }
}

/**
 * Map a Floating UI placement to its Bootstrap caret direction keyword.
 *
 * @param placement - The Floating UI placement (e.g. `'top-start'`).
 * @returns The Bootstrap caret keyword (`'start'`, `'end'`, `'up'`, `'down'`, or the side).
 */
export const resolveBootstrapCaret = (placement: Placement): string => {
  const [side] = placement.split('-')
  switch (side) {
    case 'left':
      return 'start'
    case 'right':
      return 'end'
    case 'top':
      return 'up'
    case 'bottom':
      return 'down'
    default:
      return side
  }
}

/**
 * Tell whether a directive binding leaves the popover/tooltip active.
 *
 * @param values - The directive binding value.
 * @returns `false` only when the value is an object with `active: false`.
 */
export const resolveActiveStatus = (values: DirectiveBinding['value']): boolean =>
  typeof values !== 'object' || values.active !== false

/**
 * Resolve the title and body content for a popover/tooltip directive.
 *
 * Falls back to the element's `title` attribute (moved to `data-original-title`)
 * when the binding provides no content of its own.
 *
 * @param values - The directive binding value.
 * @param el - The element the directive is bound to.
 * @returns The resolved `title` and `body`, or an empty object when inactive.
 */
export const resolveContent = (
  values: DirectiveBinding['value'],
  el: HTMLElement
): { title?: string, body?: string } => {
  const isActive = resolveActiveStatus(values)
  if (!isActive) {
    return {}
  }

  const missingBindingValue
    = typeof values === 'undefined'
      || (typeof values === 'object' && !values.title && !values.content && !values.body)
  const title = el.getAttribute('title') || el.getAttribute('data-original-title')
  if (missingBindingValue) {
    if (title) {
      el.removeAttribute('title')
      el.setAttribute('data-original-title', title)

      return {
        body: title,
      }
    }
    return {}
  }
  if (typeof values === 'string') {
    return {
      body: values,
    }
  }

  // TODO: remove this deprecation warning after 2025-07.
  if (values?.content) {
    console.warn('v-b-popover/v-b-tooltip: `content` is deprecated, use `body` instead')
  }

  return {
    title: values?.title ? values?.title : undefined,
    body: values?.body ? values?.body : values?.content ? values?.content : undefined,
  }
}

/**
 * Build the `BPopover` props from a directive binding and its element.
 *
 * @param binding - The directive binding, whose modifiers drive placement and behavior.
 * @param el - The element the popover targets.
 * @returns The props passed to the rendered `BPopover`.
 */
export const resolveDirectiveProps = (
  binding: Readonly<DirectiveBinding>,
  el: Readonly<HTMLElement>
) => ({
  target: el,
  modelValue: binding.modifiers.show,
  inline: binding.modifiers.inline,
  click: binding.modifiers.click,
  realtime: binding.modifiers.realtime,
  lazy: binding.modifiers.lazy,
  placement: binding.modifiers.left
    ? 'left'
    : binding.modifiers.right
      ? 'right'
      : binding.modifiers.bottom
        ? 'bottom'
        : binding.modifiers.top
          ? 'top'
          : undefined,
  ...(typeof binding.value === 'object' ? binding.value : undefined),
  ...(binding.modifiers.interactive ? { noninteractive: false } : undefined),
  title: null,
  body: null,
})

export interface ElementWithPopper extends HTMLElement {
  $__element?: HTMLElement
  $__binding?: string
}

/**
 * Render a `BPopover` into a fresh container placed relative to the element.
 *
 * The container goes on `document.body`, inside the element, or after it,
 * depending on the `body`/`child` modifiers, and is stored on the element
 * for later teardown.
 *
 * @param el - The element the popover is bound to.
 * @param binding - The directive binding whose modifiers pick the mount point.
 * @param props - The `BPopover` props to render.
 */
export const bind = (
  el: ElementWithPopper,
  binding: Readonly<DirectiveBinding>,
  props: BPopoverProps
) => {
  const div = document.createElement('span')
  if (binding.modifiers.body) {
    document.body.appendChild(div)
  }
  else if (binding.modifiers.child) {
    el.appendChild(div)
  }
  else {
    el.parentNode?.insertBefore(div, el.nextSibling)
  }
  render(h(BPopover, props), div)
  el.$__element = div
}

/**
 * Unmount the popover previously rendered by `bind` and remove its container.
 *
 * @param el - The element the popover was bound to.
 */
export const unbind = (el: ElementWithPopper) => {
  const div = el.$__element
  if (div) {
    render(null, div)
  }
  setTimeout(() => {
    div?.remove()
  }, 0)
  delete el.$__element
}

/**
 * Tell whether an input is a Floating UI `Boundary`.
 *
 * @param input - The value to test.
 * @returns `true` for `'clippingAncestors'`, an `Element`, or an array.
 */
export const isBoundary = (input: unknown): input is Boundary =>
  input === 'clippingAncestors' || input instanceof Element || Array.isArray(input)

/**
 * Tell whether an input is a Floating UI `RootBoundary` rather than a `Boundary`.
 *
 * @param input - The value to test.
 * @returns `true` when the value is not a `Boundary`.
 */
export const isRootBoundary = (input: Boundary | RootBoundary): input is RootBoundary =>
  !isBoundary(input)
