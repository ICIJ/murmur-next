import filter from 'lodash/filter'
import docsFrontMatter from 'virtual:docs'

const PAGE_COMPONENTS = import.meta.glob(`./pages/**/*/doc.md`)

export function loadComponent(section, name) {
  return PAGE_COMPONENTS[`./pages/${section}/${name}/doc.md`]
}

export function filterRoutes(predicate = {}) {
  return filter(routes, predicate)
}

const routes = [
  {
    path: '/',
    redirect: '/getting-started/installation-guide'
  },
  ...docsFrontMatter.map((doc) => {
    const component = loadComponent(doc.meta.section, doc.name)
    return { ...doc, component }
  })
]

export default routes
