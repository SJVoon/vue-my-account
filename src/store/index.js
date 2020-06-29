import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import STORE_CONSTANT from './constant'

Vue.use(Vuex)

export default new Vuex.Store({
  name: STORE_CONSTANT.NAME,
  actions,
  getters,
  mutations,
  state,
})
