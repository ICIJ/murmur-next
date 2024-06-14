import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collapseMenu: true
  },
  mutations: {
    toggleMenu(state) {
      state.collapseMenu = !state.collapseMenu
    },
    collapseMenu(state) {
      state.collapseMenu = true
    },
    showMenu(state) {
      state.collapseMenu = false
    }
  }
})
