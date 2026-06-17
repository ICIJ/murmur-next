import jsonp from 'jsonp'
import { computed, MaybeRefOrGetter, toValue } from 'vue'
import flatten from 'lodash/flatten'
import castArray from 'lodash/castArray'

interface FormDataResult { result: string, msg: string }

/**
 * Builds and submits a Mailchimp newsletter signup request via JSONP.
 *
 * @param email - Subscriber email address (plain value, ref, or getter).
 * @param action - Mailchimp form action URL; required before `send` can succeed.
 * @param emailField - Name of the Mailchimp merge field carrying the email.
 * @param tracker - Mailchimp signup tracker value (the `SIGNUP` parameter).
 * @param referrer - Explicit referrer to record; falls back to the parent/document referrer when omitted.
 * @param defaultGroups - Mailchimp interest group names to opt into; comma-separated strings are split.
 * @returns An object with a `send` function that resolves with the Mailchimp `FormDataResult`.
 * @example
 * <script setup>
 * import { useSendEmail } from '@icij/murmur-next'
 *
 * const email = ref('jane@example.org')
 * const { send } = useSendEmail(email, action, 'EMAIL', 'newsletter')
 * await send()
 * </script>
 */
export function useSendEmail(
  email: MaybeRefOrGetter<string>,
  action?: string,
  emailField?: string,
  tracker?: string,
  referrer?: string | null,
  defaultGroups?: string[] | string
) {
  const groups = computed(() => {
    return flatten(castArray(defaultGroups).map(g => g.split(',')))
  })

  // Mailchimp's JSONP endpoint lives at /post-json and echoes the callback via the "c" param.
  const urlFromAction = computed(() => {
    return action?.replace('/post?', '/post-json?').concat('&c=?')
  })

  const parentReferrer = computed(() => {
    if (referrer) {
      return referrer
    }
    return window.location !== window.parent.location
      ? document.referrer
      : document.location.href
  })

  const submitUrl = computed(() => {
    if (typeof urlFromAction.value == 'undefined' || !tracker || !emailField) {
      throw new Error('Missing url Info')
    }

    const emailValue = toValue(email)
    const url = new URL(urlFromAction.value)
    url.searchParams.set('SIGNUP', tracker)
    url.searchParams.set('MMERGE24', parentReferrer.value)
    url.searchParams.set(emailField, emailValue)
    groups.value.map((group: string) => url.searchParams.set(group, '1'))

    return url.href
  })

  function send(): Promise<FormDataResult> {
    return new Promise((resolve, reject) => {
      jsonp(
        submitUrl.value,
        { param: 'c' },
        (err: any, data: FormDataResult) => {
          return err ? reject(err) : resolve(data)
        }
      )
    })
  }

  return { send }
}
