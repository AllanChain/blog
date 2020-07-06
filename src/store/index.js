import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: '',
    swStatus: ''
  },
  mutations: {
    setTitle (state, title) {
      state.title = title
    },
    swUpdate (state, status) {
      state.swStatus = status
    }
  }
})
