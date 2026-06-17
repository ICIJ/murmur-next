import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import { useDonateForm } from '@/composables/useDonateForm'
import type { DonationThresholds, SuggestedDonation } from '@/composables/useDonateForm'

const thresholds: DonationThresholds = {
  monthly: { 1: 'conversation', 15: 'rules', 50: 'world' },
  yearly: { 1: 'conversation', 180: 'rules', 600: 'world' }
}

const suggestedAmount: SuggestedDonation = {
  conversation: { onetime: 50, monthly: 10, yearly: 25 },
  rules: { onetime: 200, monthly: 25, yearly: 180 },
  world: { onetime: 600, monthly: 100, yearly: 600 }
}

function setup() {
  return useDonateForm({ thresholds, suggestedAmount })
}

describe('useDonateForm', () => {
  it('starts on a monthly $10 conversation donation', () => {
    const { amount, installmentPeriod, level } = setup()
    expect(amount.value).toBe(10)
    expect(installmentPeriod.value).toBe('monthly')
    expect(level.value).toBe('conversation')
  })

  it('derives the level from the amount for monthly donations', async () => {
    const { amount, level } = setup()

    amount.value = 3
    await nextTick()
    expect(level.value).toBe('conversation')

    amount.value = 15
    await nextTick()
    expect(level.value).toBe('rules')

    amount.value = 50
    await nextTick()
    expect(level.value).toBe('world')

    amount.value = 150
    await nextTick()
    expect(level.value).toBe('world')
  })

  it('uses the yearly thresholds for a one-time donation', async () => {
    const { amount, installmentPeriod, level } = setup()

    installmentPeriod.value = 'onetime'
    await nextTick()

    amount.value = 35
    await nextTick()
    expect(level.value).toBe('conversation')

    amount.value = 180
    await nextTick()
    expect(level.value).toBe('rules')

    amount.value = 600
    await nextTick()
    expect(level.value).toBe('world')
  })

  it('suggests the amount for the selected level and period', async () => {
    const { amount, installmentPeriod, selectLevel } = setup()

    installmentPeriod.value = 'onetime'
    await nextTick()
    selectLevel('rules')
    expect(amount.value).toBe(200)

    installmentPeriod.value = 'monthly'
    await nextTick()
    selectLevel('rules')
    expect(amount.value).toBe(25)

    installmentPeriod.value = 'yearly'
    await nextTick()
    selectLevel('world')
    expect(amount.value).toBe(600)
  })

  it('re-suggests the amount when switching period while pristine', async () => {
    const { amount, installmentPeriod } = setup()

    installmentPeriod.value = 'yearly'
    await nextTick()
    expect(amount.value).toBe(25)
  })

  it('stops re-suggesting once the amount is edited by hand', async () => {
    const { amount, installmentPeriod, amountIsNotPristine } = setup()

    installmentPeriod.value = 'yearly'
    await nextTick()
    expect(amount.value).toBe(25)

    amountIsNotPristine()
    installmentPeriod.value = 'monthly'
    await nextTick()
    expect(amount.value).toBe(25)
  })
})
