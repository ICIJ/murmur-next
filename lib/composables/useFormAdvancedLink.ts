import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

import { AdvancedLinkTab } from '@/enums'

/**
 * A single tab descriptor exposed to the template: the copy format it carries
 * plus the presentation metadata (translated label and DOM id) built by the
 * caller through {@link UseFormAdvancedLinkOptions.buildTab}.
 */
export interface FormAdvancedLinkTabItem {
  /**
   * The copy format the tab is responsible for.
   */
  type: AdvancedLinkTab
  /**
   * The human-readable, translated tab label.
   */
  title: string
  /**
   * The unique DOM id of the tab, used to sync the active selection.
   */
  id: string
}

/**
 * Reactive inputs driving the advanced-link tab derivation. They mirror the
 * state owned by the form component, accepted as plain values, refs or getters
 * so the composable stays adaptable to how the caller wires its props.
 */
export interface UseFormAdvancedLinkOptions {
  /**
   * The copy formats to expose, in the caller's preferred subset. The composable
   * keeps its own canonical ordering and only retains the formats listed here.
   */
  forms: MaybeRefOrGetter<AdvancedLinkTab[]>
  /**
   * Builds the presentation metadata (translated title and unique id) for a
   * given copy format. Kept as a caller-provided mapper so the composable stays
   * free of i18n and per-instance id concerns.
   *
   * @param type - The copy format to describe.
   * @returns The label and id to attach to the tab.
   */
  buildTab: (type: AdvancedLinkTab) => { title: string, id: string }
  /**
   * Two-way binding to the active tab index. Reads pick the active tab; writes
   * happen when the user switches tabs.
   */
  index: Ref<number | undefined>
}

/**
 * Reactive API returned by {@link useFormAdvancedLink}.
 */
export interface UseFormAdvancedLink {
  /**
   * The ordered, filtered tab descriptors to render.
   */
  tabs: ComputedRef<FormAdvancedLinkTabItem[]>
  /**
   * The DOM id of the currently active tab, derived from {@link index}. Falls
   * back to the first tab when the index is out of range.
   */
  activeForm: ComputedRef<string>
  /**
   * Syncs the active index from a tab id, e.g. on a `b-tabs` model update. An
   * unknown id resets the selection to the first tab.
   *
   * @param id - The id of the newly active tab, if any.
   */
  onUpdate: (id: string | undefined) => void
}

// Canonical tab order, independent of the subset the caller asks for.
const DEFAULT_TABS: readonly AdvancedLinkTab[] = [
  AdvancedLinkTab.raw,
  AdvancedLinkTab.rich,
  AdvancedLinkTab.markdown,
  AdvancedLinkTab.html
]

/**
 * Owns the tab list and the active-tab selection sync for the advanced-link
 * form: the canonical tab ordering filtered to the requested formats, the
 * mapping from the active index to the active tab id, and the reverse mapping
 * that writes the index back when the user switches tabs.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive tab inputs (see {@link UseFormAdvancedLinkOptions}).
 * @returns The {@link UseFormAdvancedLink} API of tab descriptors and selection
 *   sync.
 * @example
 * import { useFormAdvancedLink } from '@/composables/useFormAdvancedLink'
 *
 * const index = defineModel<number>()
 * const { tabs, activeForm, onUpdate } = useFormAdvancedLink({
 *   forms: () => props.forms,
 *   buildTab: type => ({ title: t(`advanced-link-form.${type}.tab`), id: `${formId}-${type}` }),
 *   index
 * })
 */
export function useFormAdvancedLink(options: UseFormAdvancedLinkOptions): UseFormAdvancedLink {
  const { forms, buildTab, index } = options

  const tabs = computed((): FormAdvancedLinkTabItem[] => {
    const requestedForms = toValue(forms)
    return DEFAULT_TABS
      .filter(type => requestedForms.includes(type))
      .map((type) => {
        const { title, id } = buildTab(type)
        return { type, title, id }
      })
  })

  // Pick the active tab id from the index, guarding against an out-of-range
  // value by falling back to the first tab.
  const activeForm = computed((): string => {
    if (index.value && index.value > 0 && index.value < tabs.value.length) {
      return tabs.value[index.value].id
    }
    return tabs.value[0].id
  })

  const onUpdate = (id: string | undefined): void => {
    const position = tabs.value.findIndex(tab => tab.id === id)
    index.value = position < 0 ? 0 : position
  }

  return {
    tabs,
    activeForm,
    onUpdate
  }
}

export default useFormAdvancedLink
