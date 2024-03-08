<template>
  <form class="sign-up-form" :class="{ 'sign-up-form--horizontal': horizontal }" @submit.prevent="subscribe">
    <fieldset :disabled="frozen">
      <label v-if="!noLabel" class="text-uppercase text-muted fw-bold" for="input-email">
        {{ t('sign-up-form.label') }}
      </label>
      <div class="sign-up-form__fieldset__group " :class="{'input-group': horizontal}">
        <input
            id="input-email"
            v-model="email"
            name="EMAIL"
            type="email"
            class="form-control"
            :placeholder="t('sign-up-form.placeholder').toString()"
        />
        <button class="sign-up-form__fieldset__group__addon btn text-uppercase fw-bold input-group-text"  :class="{ [variantColorClass] :true }"  type="submit">
          {{ t('sign-up-form.submit') }}
        </button>
      </div>
    </fieldset>
    <p v-if="errorMessage" class="alert alert-danger p-2 m-0 mt-2">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="alert alert-success p-2 m-0 mt-2">
      {{ successMessage }}
    </p>
  </form>
</template>

<script lang="ts">
import jsonp from 'jsonp'
import castArray from 'lodash/castArray'
import flatten from 'lodash/flatten'
import last from 'lodash/last'
import {computed, defineComponent, PropType, ref} from 'vue'

import config from '../config'
import {useI18n} from "vue-i18n";
import {useSendEmail} from "@/composables/sendEmail";


type SignUpFormData = {
  email: string
  frozen: boolean
  response: any
  errorMessage: string | null
  successMessage: string | null
}

/**
 * SignUpForm
 */
export default defineComponent({
name: 'SignUpForm',
  props: {
    /**
     * Mailchimp URL to send the data to.
     */
    action: {
      type: String,
      default: () => config.get('signup-form.action')
    },
    /**
     * Malchimp email field parameter
     */
    emailField: {
      type: String,
      default: () => config.get('signup-form.email-field')
    },
    /**
     * Malchimp default groups. Can be an array or a commat-separated list of groups.
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
     * Referrer URL cant be passed explicitly
     */
    referrer: {
      type: String,
      default: null
    },
    /**
     * Color variant of the sign-up button
     */
    variant: {
      type: String,
      default: 'primary'
    }
  },
  setup(props){
    const {t} = useI18n()
    const email = ref('')
    const frozen = ref(false)
    const response = ref({})
    const errorMessage = ref(null)
    const successMessage = ref(null)
    const {send} = useSendEmail(email,props.action,props.emailField, props.tracker, props.referrer,props.defaultGroups)

    const variantColorClass = computed(()=> {
      return `btn-${props.variant}`
    } )
    async function subscribe() {
      resetMessages()
      freeze()
      // Send the data, catch the result no matter what and unfreeze the form
      await send().then(done,done).finally(unfreeze)

    }

    function done({ result, msg }: any): void {
      if (result === 'success') {
        email.value = ''
        successMessage.value = msg
      } else {
        // Mailchimp formats errors in list
        errorMessage.value = last((msg || "Something's wrong").split('0 -')) ?? null
      }
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

    return {
      t,
      email,
      frozen,
      response,
      errorMessage,
      successMessage,
      variantColorClass,
      subscribe,
      send
    }
  }
})
</script>

<style lang="scss">
@import '../styles/lib.scss';

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
