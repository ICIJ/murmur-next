// BootstrapVue recommend using this
import 'mutationobserver-shim'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import Murmur from '@/main'

import store from './store'
import App from './components/App.vue'
import ApiTable from './components/ApiTable.vue'
import CollapsibleBlock from './components/CollapsibleBlock.vue'
import OutboundLink from './components/OutboundLink.vue'
import PalettePresenter from './components/PalettePresenter.vue'
import RepositoryLink from './components/RepositoryLink.vue'
import SampleCard from './components/SampleCard.vue'

import routes from './routes'
import './styles/app.scss'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(Murmur)

Vue.config.productionTip = false

Vue.component('ApiTable', ApiTable)
Vue.component('CollapsibleBlock', CollapsibleBlock)
Vue.component('OutboundLink', OutboundLink)
Vue.component('PalettePresenter', PalettePresenter)
Vue.component('RepositoryLink', RepositoryLink)
Vue.component('SampleCard', SampleCard)

Murmur.config.set('project.name', 'Demo Project')

new Vue({
  store,
  render: (h) => h(App),
  router: new VueRouter({ routes })
}).$mount('#app')
