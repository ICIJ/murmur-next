import jsonp from 'jsonp'
import { computed, MaybeRefOrGetter, toValue } from 'vue'
import flatten from 'lodash/flatten'
import castArray from 'lodash/castArray'

interface FormDataResult { result: string, msg: string }
// by convention, composable function names start with "use"
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
