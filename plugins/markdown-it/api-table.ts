// @ts-expect-error no typings available
import container from 'markdown-it-container'

import { TokenMap } from '../MdPluginTypes'

export default function (name = 'api-table'): any[] {
  return [
    container,
    name,
    {
      render(tokens: TokenMap, idx: string) {
        if (tokens[idx].nesting === 1) {
          const pathMatches = tokens[idx].info
            .slice(name.length + 1)
            .trim()
            .match(/(.*\.vue)/)
          const path = pathMatches?.[1] ?? ''
          return `<api-table path="${path}" />`
        } else {
          return `\n`
        }
      }
    }
  ]
}
