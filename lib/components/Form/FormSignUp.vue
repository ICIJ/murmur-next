<template>
  <form
    class="sign-up-form"
    :class="classList"
    @submit.prevent="subscribe"
  >
    <fieldset :disabled="frozen">
      <label
        v-if="!noLabel"
        class="sign-up-form__fieldset__label text-uppercase text-muted fw-bold"
        for="input-email"
      >
        {{ t('sign-up-form.label') }}
      </label>
      <div
        class="sign-up-form__fieldset__group"
        :class="{ 'input-group': horizontal }"
      >
        <input
          id="input-email"
          v-model="email"
          name="EMAIL"
          type="email"
          class="form-control"
          :placeholder="t('sign-up-form.placeholder').toString()"
        >
        <button
          class="sign-up-form__fieldset__group__addon btn text-uppercase fw-bold input-group-text"
          :class="{ [variantColorClass]: true }"
          type="submit"
        >
          {{ t('sign-up-form.submit') }}
        </button>
      </div>
    </fieldset>
    <p
      v-if="errorMessage"
      class="sign-up-form__error alert alert-danger p-2 m-0 mt-2"
    >
      {{ errorMessage }}
    </p>
    <p
      v-if="successMessage"
      class="sign-up-form__success alert alert-success p-2 m-0 mt-2"
    >
      {{ successMessage }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import config from '@/config'
import { useI18n } from 'vue-i18n'
import { useSignUpForm } from '@/composables/useSignUpForm'
import type { ButtonVariant } from 'bootstrap-vue-next'

export interface FormSignUpProps {
  /**
   * Mailchimp URL to send the data to.
   */
  action?: string
  /**
   * Mailchimp email field parameter
   */
  emailField?: string
  /**
   * Mailchimp default groups. Can be an array or a comma-separated list of groups.
   */
  defaultGroups?: string | string[]
  /**
   * Disable the main label.
   */
  noLabel?: boolean
  /**
   * Horizontal layout of the form.
   */
  horizontal?: boolean
  /**
   * Mailchimp tracker tag to identify the origin.
   */
  tracker?: string
  /**
   * Referrer URL can't be passed explicitly
   */
  referrer?: string | null
  /**
   * Color variant of the sign-up button
   */
  variant?: ButtonVariant
  /**
   * Compact layout with no gap between the input and the submit button.
   */
  compact?: boolean
}

const props = withDefaults(defineProps<FormSignUpProps>(), {
  action: () => config.get('signup-form.action'),
  emailField: () => config.get('signup-form.email-field'),
  defaultGroups: () => config.get('signup-form.default-groups'),
  noLabel: false,
  horizontal: false,
  tracker: () => config.get('signup-form.tracker'),
  referrer: null,
  variant: 'primary',
  compact: false
})
const emit = defineEmits(['error', 'success', 'subscribed'])
const { t } = useI18n()

const { email, frozen, errorMessage, successMessage, subscribe } = useSignUpForm({
  action: props.action,
  emailField: props.emailField,
  tracker: props.tracker,
  referrer: props.referrer,
  defaultGroups: props.defaultGroups,
  emit
})

const classList = computed(() => ({
  'sign-up-form--horizontal': props.horizontal,
  'sign-up-form--compact': props.compact,
}))

const variantColorClass = computed(() => {
  return `btn-${props.variant}`
})
</script>

<style lang="scss">

.sign-up-form {
  .sign-up-form__fieldset {
    &__label {
      margin-bottom: $spacer-xs;
    }

    &__group {
      display: flex;
      flex-direction: column;
      gap: $spacer-xs;
    }
  }

  &--horizontal .sign-up-form__fieldset__group {
    flex-direction: row;
  }

  &--compact {
    .sign-up-form__fieldset__label {
      margin-bottom: 0;
    }

    .sign-up-form__fieldset__group {
      gap: 0;
    }
  }

  .sign-up-form__fieldset__group__addon.btn {
    font-size: 0.9em;
  }

  &:not(&--horizontal) {
    .sign-up-form__fieldset__group__addon.btn {
      display: block;
      width: 100%;
    }
  }
}
</style>
