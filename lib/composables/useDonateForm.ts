import keys from 'lodash/keys'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import forEach from 'lodash/forEach'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * The recurrence of a donation. `onetime` reuses the yearly thresholds for its
 * level derivation.
 */
export type DonationPeriod = 'onetime' | 'monthly' | 'yearly'

/**
 * The membership tier a donation falls into, used to highlight the matching
 * benefit column.
 */
export type DonationCategory = 'conversation' | 'rules' | 'world'

/**
 * Suggested donation amounts indexed by category, then by period.
 */
export type SuggestedDonation = Record<DonationCategory, Record<DonationPeriod, number>>

/**
 * Maps an amount threshold to the category it unlocks, per period. The yearly
 * thresholds double as the `onetime` thresholds.
 */
export interface DonationThresholds {
  monthly: Record<number, DonationCategory>
  yearly: Record<number, DonationCategory>
  onetime?: Record<number, DonationCategory>
}

/**
 * Inputs driving the donation derivation. They carry the i18n- and
 * config-sourced data the component owns, so the composable stays free of
 * translation and configuration concerns.
 */
export interface UseDonateFormOptions {
  /**
   * Amount thresholds per period that unlock each category.
   */
  thresholds: DonationThresholds
  /**
   * Suggested amounts per category and period.
   */
  suggestedAmount: SuggestedDonation
}

/**
 * Reactive API returned by {@link useDonateForm}.
 */
export interface UseDonateForm {
  /**
   * The current donation amount; `undefined` while the user clears the field.
   */
  amount: Ref<number | undefined>
  /**
   * The selected recurrence.
   */
  installmentPeriod: Ref<DonationPeriod>
  /**
   * The currently highlighted membership tier.
   */
  level: Ref<DonationCategory | null>
  /**
   * Picks a level and resets the amount to its suggested value.
   *
   * @param levelSelected - The tier the user clicked.
   */
  selectLevel: (levelSelected: DonationCategory) => void
  /**
   * Flags the amount as user-edited, freezing the automatic suggestions.
   */
  amountIsNotPristine: () => void
}

/**
 * Owns the donation amount/period/level state machine for the `FormDonate`
 * component: derives the active membership tier from the amount, suggests an
 * amount when the user picks a tier or switches period, and stops suggesting
 * once the amount has been edited by hand.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - i18n/config-sourced donation data (see {@link UseDonateFormOptions}).
 * @returns The {@link UseDonateForm} API: the reactive state and the level/amount
 *   actions.
 * @example
 * import { useDonateForm } from '@/composables/useDonateForm'
 *
 * const { amount, installmentPeriod, level, selectLevel, amountIsNotPristine } =
 *   useDonateForm({ thresholds, suggestedAmount })
 */
export function useDonateForm(options: UseDonateFormOptions): UseDonateForm {
  const { thresholds, suggestedAmount } = options

  const amount = ref<number | undefined>(10)
  // True until the user edits the amount field, gating the auto-suggestions.
  const amountIsPristine = ref(true)
  const installmentPeriod = ref<DonationPeriod>('monthly')
  const level = ref<DonationCategory | null>('conversation')

  // A one-time donation borrows the yearly thresholds.
  const ranges = computed((): Record<number, DonationCategory> => {
    if (installmentPeriod.value === 'onetime') {
      return thresholds.yearly
    }
    return thresholds[installmentPeriod.value]
  })

  const firstRange = computed((): DonationCategory => {
    const key = Number(keys(ranges.value)[0])
    return ranges.value[key]
  })

  // Walk the thresholds in ascending order and keep the highest one the amount
  // reaches.
  const matchingLevel = computed((): DonationCategory | null => {
    let label: DonationCategory | null = null
    forEach(sortBy(map(keys(ranges.value), Number)), (threshold) => {
      label = amount.value && amount.value >= threshold ? ranges.value[threshold] : label
    })
    return label
  })

  function getSuggestedAmount(): number | undefined {
    if (!amountIsPristine.value) {
      return
    }

    if (!level.value) {
      level.value = firstRange.value
    }

    return suggestedAmount[level.value][installmentPeriod.value]
  }

  function selectLevel(levelSelected: DonationCategory): void {
    level.value = levelSelected
    amount.value = getSuggestedAmount()
  }

  function amountIsNotPristine(): void {
    amountIsPristine.value = false
  }

  // Switching period re-suggests an amount as long as the field is untouched.
  watch(installmentPeriod, () => {
    if (!amountIsPristine.value) {
      return
    }
    amount.value = getSuggestedAmount()
  })

  // Any amount change re-derives the highlighted tier.
  watch(amount, () => {
    level.value = matchingLevel.value
  })

  return {
    amount,
    installmentPeriod,
    level,
    selectLevel,
    amountIsNotPristine
  }
}

export default useDonateForm
