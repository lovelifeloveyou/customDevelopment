import Vue from 'vue'
import Vuex from 'vuex'

import system from './modules/system'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

export default new Vuex.Store({
  modules: {
    system: system
  }
})