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
import { computed, PropType, ref } from 'vue'

import config from '@/config'
import { useI18n } from 'vue-i18n'
import { useSendEmail } from '@/composables/useSendEmail'
import type { ButtonVariant } from 'bootstrap-vue-next'

/**
 * SignUpForm
 */
const props = defineProps({
  /**
   * Mailchimp URL to send the data to.
   */
  action: {
    type: String,
    default: () => config.get('signup-form.action')
  },
  /**
   * Mailchimp email field parameter
   */
  emailField: {
    type: String,
    default: () => config.get('signup-form.email-field')
  },
  /**
   * Mailchimp default groups. Can be an array or a comma-separated list of groups.
   */
  defaultGroups: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => config.get('signup-form.default-groups')
  },
  /**
   * Disable the main label.
   */
  noLabel: {
    type: Boolean
  },
  /**
   * Horizontal layout of the form.
   */
  horizontal: {
    type: Boolean
  },
  /**
   * Mailchimp tracker tag to identify the origin.
   */
  tracker: {
    type: String,
    default: () => config.get('signup-form.tracker')
  },
  /**
   * Referrer URL can't be passed explicitly
   */
  referrer: {
    type: String,
    default: null
  },
  /**
   * Color variant of the sign-up button
   */
  variant: {
    type: String as PropType<ButtonVariant>,
    default: 'primary'
  }
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
