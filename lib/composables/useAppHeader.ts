import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Reactive API returned by {@link useAppHeader}.
 */
export interface UseAppHeader {
  showFollowUsPopover: Ref<boolean>
  collapseNavbar: Ref<boolean>
  closeFollowUsPopover: () => void
  toggleNavbar: () => void
}

/**
 * Manages the `AppHeader` interactive state: the collapsed/expanded navbar and
 * the "follow us" popover visibility. Toggling the navbar always dismisses the
 * popover so the two never overlap on small screens.
 *
 * Internal building block for `AppHeader`; not exported from `@icij/murmur-next`.
 *
 * @returns The {@link UseAppHeader} API: the `showFollowUsPopover` and
 *   `collapseNavbar` flags plus the `closeFollowUsPopover` and `toggleNavbar`
 *   actions.
 * @example
 * import { useAppHeader } from '@/composables/useAppHeader'
 *
 * const { showFollowUsPopover, collapseNavbar, closeFollowUsPopover, toggleNavbar } = useAppHeader()
 */
export function useAppHeader(): UseAppHeader {
  const showFollowUsPopover = ref(false)
  const collapseNavbar = ref(true)

  function closeFollowUsPopover(): void {
    showFollowUsPopover.value = false
  }

  // Opening or closing the navbar also dismisses the popover to avoid overlap.
  function toggleNavbar(): void {
    collapseNavbar.value = !collapseNavbar.value
    closeFollowUsPopover()
  }

  return { showFollowUsPopover, collapseNavbar, closeFollowUsPopover, toggleNavbar }
}

export default useAppHeader
