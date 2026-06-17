/**
 * Tell whether a string is a parseable absolute URL.
 *
 * @param value - The string to test.
 * @returns `true` when the string can be parsed as a URL, `false` otherwise.
 * @example
 * isUrl('https://icij.org') // true
 * isUrl('not a url') // false
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value)
  }
  catch {
    return false
  }
  return true
}
