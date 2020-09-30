import Vue from 'vue'
import Vuex from 'vuex'

import system from './modules/system'
import cloudComputer from './modules/cloudComputer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    system: system,
    cloudComputer: cloudComputer
  }
})