<script setup lang="ts">
import keys from 'lodash/keys'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import forEach from 'lodash/forEach'

import config from '@/config'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'

type Period = 'onetime' | 'monthly' | 'yearly'
type DonationCategory = 'conversation' | 'rules' | 'world'
type SuggestedDonation = Record<DonationCategory, Record<Period, number>>
interface LabelForChange {
  monthly: Record<number, DonationCategory>
  yearly: Record<number, DonationCategory>
  onetime?: Record<number, DonationCategory>
}

/**
 * A form to encourage donations. We usually put this form inside a modal
 */
defineOptions({
  name: 'DonateForm'
})

export interface FormDonateProps {
  /**
   * Title of the form.
   */
  noTitle?: boolean
}

withDefaults(defineProps<FormDonateProps>(), {
  noTitle: false
})

const { t, locale, messages } = useI18n()
const amount = ref<number | undefined>(10)
// True if the amount wasn't changed by the user yet
const amountIsPristine = ref(true)
const installmentPeriod: Ref<Period> = ref('monthly')
const level = ref<DonationCategory | null>('conversation')
const campaign = ref(config.get('donate-form.tracker'))
const labelForChange = ref<LabelForChange>({
  monthly: {
    1: t('donate-form.result.conversation') as DonationCategory,
    15: t('donate-form.result.rules') as DonationCategory,
    50: t('donate-form.result.world') as DonationCategory
  },
  yearly: {
    1: t('donate-form.result.conversation') as DonationCategory,
    180: t('donate-form.result.rules') as DonationCategory,
    600: t('donate-form.result.world') as DonationCategory
  }
})

const suggestedAmount = ref<SuggestedDonation>(
  messages.value[locale.value]['donate-form']['suggesteddonation']
)
const listBenefits = ref<string[]>(
  messages.value[locale.value]['donate-form']['benefits']['list']
)

const ranges = computed((): Record<number, DonationCategory> => {
  if (installmentPeriod.value === 'onetime') {
    return labelForChange.value['yearly']
  }
  return labelForChange.value[installmentPeriod.value]
})

const firstRange = computed(() => {
  const key = Number(keys(ranges.value)[0])
  return ranges.value[key]
})

const changeThe = computed(() => {
  // Final label
  let label: DonationCategory | null = null
  forEach(sortBy(map(keys(ranges.value), Number)), (amountV) => {
    label = amount.value && (amount.value >= amountV) ? ranges.value[amountV] : label
  })
  return label
})

function getSuggestedAmount() {
  if (!amountIsPristine.value) {
    return
  }

  if (!level.value) {
    level.value = firstRange.value
  }

  // Return suggested amount
  return suggestedAmount.value[level.value][installmentPeriod.value]
}

function selectLevel(levelSelected: DonationCategory) {
  // Set chose level
  level.value = levelSelected

  // Set suggested amount
  amount.value = getSuggestedAmount()
}

function amountIsNotPristine() {
  amountIsPristine.value = false
}

watch(installmentPeriod, () => {
  if (!amountIsPristine.value) {
    return
  }

  // Set suggested amount
  amount.value = getSuggestedAmount()
})

watch(
  () => amount.value,
  (v: number) => {
    level.value = changeThe.value

    // Set manual amount
    return (amount.value = v)
  }
)
</script>

<template>
  <div class="donate-form container-fluid py-2">
    <h2
      v-if="!noTitle"
      class="donate-form__title text-uppercase fw-bold text-primary h5"
    >
      {{ t('donate-form.support') }}
    </h2>
    <!-- @slot Description of the form (bellow the title). -->
    <slot name="introduction">
      <!-- eslint-disable vue/no-v-html -->
      <p
        class="donate-form__introduction"
        v-html="t('donate-form.introduction')"
      />
      <!-- eslint-enable -->
    </slot>

    <div class="donate-form__payment mb-4 text-center">
      <form
        action="//checkout.fundjournalism.org/memberform"
        method="get"
        target="_blank"
        class="donate-form__payment__form bg-light p-4"
      >
        <div class="donate-form__payment__levels row">
          <div
            class="col donate-form__payment__level donate-form__payment__level--conversation"
            :class="{ active: level === 'conversation' }"
            @click="selectLevel('conversation')"
          >
            <h3
              class="donate-form__payment__heading text-uppercase fw-bold text-primary h5"
            >
              {{ t('donate-form.benefits.impacts.conversation.heading') }}
            </h3>
            <div class="Article">
              <div>
                <!-- eslint-disable vue/no-v-html -->
                <p
                  class="donate-form__payment__highlight text-icij fw-bold"
                  v-html="
                    t('donate-form.benefits.impacts.conversation.highlight')
                  "
                />
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
          <div
            class="col donate-form__payment__level donate-form__payment__level--rules"
            :class="{ active: level === 'rules' }"
            @click="selectLevel('rules')"
          >
            <h3
              class="donate-form__payment__heading text-uppercase fw-bold text-primary h5"
            >
              {{ t('donate-form.benefits.impacts.rules.heading') }}
            </h3>
            <div class="Article">
              <div>
                <!-- eslint-disable vue/no-v-html -->
                <p
                  class="donate-form__payment__highlight text-icij fw-bold"
                  v-html="t('donate-form.benefits.impacts.rules.highlight')"
                />
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
          <div
            class="col donate-form__payment__level donate-form__payment__level--world"
            :class="{ active: level === 'world' }"
            @click="selectLevel('world')"
          >
            <h3
              class="donate-form__payment__heading text-uppercase fw-bold text-primary h5"
            >
              {{ t('donate-form.benefits.impacts.world.heading') }}
            </h3>
            <div class="Article">
              <div>
                <!-- eslint-disable vue/no-v-html -->
                <p
                  class="donate-form__payment__highlight text-icij fw-bold"
                  v-html="t('donate-form.benefits.impacts.world.highlight')"
                />
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="mt-5">
            <span class="donate-form__payment__buttons">
              <button
                type="button"
                class="btn btn-sm frequency-monthly"
                :class="{ 'btn-primary': installmentPeriod === 'monthly' }"
                @click="installmentPeriod = 'monthly'"
              >
                {{ t('donate-form.frequency.monthly') }}
              </button>
              <button
                type="button"
                class="btn btn-sm frequency-yearly"
                :class="{ 'btn-primary': installmentPeriod === 'yearly' }"
                @click="installmentPeriod = 'yearly'"
              >
                {{ t('donate-form.frequency.yearly') }}
              </button>
              <button
                type="button"
                class="btn btn-sm frequency-onetime"
                :class="{ 'btn-primary': !installmentPeriod}"
                @click="installmentPeriod = 'onetime'"
              >
                {{ t('donate-form.frequency.onetime') }}
              </button>
            </span>
          </div>
          <div class="mt-4">
            <span>{{ t('donate-form.label') }}&nbsp;</span>
            <label
              class="donate-form__payment__unit input-group input-group-sm d-inline-flex"
            >
              <span class="input-group-prepend">
                <span class="input-group-text">$</span>
              </span>
              <input
                v-model="amount"
                class="donate-form__payment__input form-control"
                name="amount"
                type="number"
                min="0"
                @change="amountIsNotPristine"
              >
            </label>
          </div>
          <div class="mt-4">
            <input
              name="org_id"
              value="icij"
              type="hidden"
            >
            <input
              v-model="campaign"
              name="campaign"
              type="hidden"
            >
            <input
              v-model="installmentPeriod"
              name="installmentPeriod"
              type="hidden"
            >
            <button
              type="submit"
              class="btn btn-primary rounded-pill text-uppercase fw-bold"
            >
              {{ t('donate-form.submit') }}
            </button>
            <a
              target="_blank"
              href="https://icij.org/donate"
              class="donate-form__payment__image"
            />
          </div>
        </div>
      </form>
    </div>

    <div class="donate-form__insider">
      <h2 class="donate-form__insider__title">
        {{ t('donate-form.benefits.heading') }}
      </h2>
      <p>
        {{ t('donate-form.benefits.introduction') }}
      </p>
      <div>
        <ul class="donate-form__insider__list">
          <li
            v-for="(benefit, index) in listBenefits"
            :key="index"
            class="donate-form__insider__list-item"
            v-html="benefit"
          />
        </ul>
      </div>
      <div>
        <hr class="donate-form__insider__separator">
        <div class="donate-form__insider__more text-center">
          <a
            target="_blank"
            href="https://icij.org/donate"
            class="btn btn-primary rounded-pill text-uppercase fw-bold py-2"
          >
            {{ t('donate-form.benefits.more') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.donate-form {
  font-size: 0.9rem;

  &__payment {
    & &__unit {
      width: 120px;
      margin-right: $spacer;

      @media screen and (max-width: $modal-lg) {
        width: 100%;
        flex: 0 0 100%;
      }
    }

    &__buttons {
      button {
        margin: 0 5px;
        border: solid 1px var(--primary);
      }
    }

    &__level {
      border-bottom: solid 3px $light;
      cursor: pointer;

      &.active {
        border-bottom: solid 3px var(--primary);
      }
    }

    &__highlight {
      font-size: 17px;

      .monthly {
        display: block;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  &__insider {
    &__list {
      padding-left: 20px;

      &-item {
        position: relative;
        margin: 3px 0;
        font-size: 15px;
        list-style: none;

        &:before {
          content: '\2713';
          position: absolute;
          left: -16px;
          font-size: 14px;
          font-weight: 700;
          color: #333;
          font-family: $font-family-sans-serif;
        }
      }
    }

    &__modal__container .col {
      @media screen and (max-width: $modal-lg) {
        width: 100%;
        flex: 0 0 100%;
      }
    }
  }
}
</style>
