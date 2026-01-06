<template>
  <form
    class="sign-up-form"
    :class="{ 'sign-up-form--horizontal': horizontal }"
    @submit.prevent="subscribe"
  >
    <fieldset :disabled="frozen">
      <label
        v-if="!noLabel"
        class="text-uppercase text-muted fw-bold"
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
import last from 'lodash/last'
import { computed, ref } from 'vue'

import config from '@/config'
import { useI18n } from 'vue-i18n'
import { useSendEmail } from '@/composables/useSendEmail'
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
}

const props = withDefaults(defineProps<FormSignUpProps>(), {
  action: () => config.get('signup-form.action'),
  emailField: () => config.get('signup-form.email-field'),
  defaultGroups: () => config.get('signup-form.default-groups'),
  noLabel: false,
  horizontal: false,
  tracker: () => config.get('signup-form.tracker'),
  referrer: null,
  variant: 'primary'
})
const emit = defineEmits(['error', 'success', 'subscribed'])
const { t } = useI18n()
const email = ref('')
const frozen = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)
const { send } = useSendEmail(
  email,
  props.action,
  props.emailField,
  props.tracker,
  props.referrer,
  props.defaultGroups
)

const variantColorClass = computed(() => {
  return `btn-${props.variant}`
})

async function subscribe() {
  resetMessages()
  freeze()
  // Send the data, catch the result no matter what and unfreeze the form
  try {
    const { result, msg } = await send()
    done({ result, msg })
  }
  catch (e) {
    error(e)
  }
  unfreeze()
  emit('subscribed')
}

function done({ result, msg }: any): void {
  if (result === 'success') {
    email.value = ''
    successMessage.value = msg
    emit('success', msg)
  }
  else {
    error({ msg })
  }
}

// Mailchimp formats errors in list
function error({ msg }: any): void {
  errorMessage.value = last((msg || 'Something\'s wrong').split('0 -')) ?? null
  emit('error', errorMessage.value)
}

function resetMessages() {
  errorMessage.value = null
  successMessage.value = null
}

function freeze() {
  frozen.value = true
}

function unfreeze() {
  frozen.value = false
}
</script>

<style lang="scss">

.sign-up-form {
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
