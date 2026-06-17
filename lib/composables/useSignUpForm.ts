import last from 'lodash/last'
import { ref } from 'vue'
import type { Ref } from 'vue'

import { useSendEmail } from '@/composables/useSendEmail'

/**
 * The newsletter signup payload forwarded to {@link useSendEmail}. Mirrors the
 * Mailchimp-related props of the `FormSignUp` component.
 */
export interface UseSignUpFormOptions {
  /**
   * Mailchimp form action URL.
   */
  action?: string
  /**
   * Name of the Mailchimp merge field carrying the email.
   */
  emailField?: string
  /**
   * Mailchimp signup tracker value.
   */
  tracker?: string
  /**
   * Explicit referrer to record; falls back to the document referrer when omitted.
   */
  referrer?: string | null
  /**
   * Mailchimp interest groups to opt into.
   */
  defaultGroups?: string | string[]
  /**
   * Emits the form lifecycle events back to the host component. Receives the
   * same `('success' | 'error' | 'subscribed', payload?)` contract the
   * component exposes.
   */
  emit: (event: 'success' | 'error' | 'subscribed', payload?: unknown) => void
}

/**
 * Reactive API returned by {@link useSignUpForm}.
 */
export interface UseSignUpForm {
  /**
   * Two-way bound subscriber email.
   */
  email: Ref<string>
  /**
   * Whether the form is locked while a submission is in flight.
   */
  frozen: Ref<boolean>
  /**
   * The last error message to display, if any.
   */
  errorMessage: Ref<string | null>
  /**
   * The last success message to display, if any.
   */
  successMessage: Ref<string | null>
  /**
   * Submits the email, freezing the form while the request is in flight and
   * surfacing the outcome through the messages and the host `emit`.
   *
   * @returns A promise resolving once the submission settled.
   */
  subscribe: () => Promise<void>
}

/**
 * Owns the newsletter submission flow for the `FormSignUp` component: the
 * subscriber email, the freeze/unfreeze lifecycle, the success/error messages,
 * and the `success`/`error`/`subscribed` events. Wraps {@link useSendEmail} to
 * perform the actual Mailchimp request.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Submission payload and the host `emit` (see {@link UseSignUpFormOptions}).
 * @returns The {@link UseSignUpForm} API: the form state and the `subscribe`
 *   action.
 * @example
 * import { useSignUpForm } from '@/composables/useSignUpForm'
 *
 * const emit = defineEmits(['error', 'success', 'subscribed'])
 * const { email, frozen, errorMessage, successMessage, subscribe } = useSignUpForm({
 *   action: props.action,
 *   emailField: props.emailField,
 *   tracker: props.tracker,
 *   referrer: props.referrer,
 *   defaultGroups: props.defaultGroups,
 *   emit
 * })
 */
export function useSignUpForm(options: UseSignUpFormOptions): UseSignUpForm {
  const { action, emailField, tracker, referrer, defaultGroups, emit } = options

  const email = ref('')
  const frozen = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const { send } = useSendEmail(
    email,
    action,
    emailField,
    tracker,
    referrer,
    defaultGroups
  )

  function resetMessages(): void {
    errorMessage.value = null
    successMessage.value = null
  }

  function freeze(): void {
    frozen.value = true
  }

  function unfreeze(): void {
    frozen.value = false
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

  // Mailchimp formats errors as a list, so keep only the trailing message.
  function error({ msg }: any): void {
    errorMessage.value = last((msg || 'Something\'s wrong').split('0 -')) ?? null
    emit('error', errorMessage.value)
  }

  async function subscribe(): Promise<void> {
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

  return {
    email,
    frozen,
    errorMessage,
    successMessage,
    subscribe
  }
}

export default useSignUpForm
