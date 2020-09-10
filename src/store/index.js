import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    seller: null
  },
  getters: {
    getSeller: state => state.seller
  },
  mutations: {
    setSeller(state, data) {
      state.seller = data
    }
  },
  actions: {
  },
  modules: {
  }
})
