import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import $ from "jquery";
import 'lib-flexible'
import 'vant/lib/index.css'
import httpClient from './utils/request'
import config from './config/index'
import loading from './components/loading'
import { VueHammer } from './directives/hammerTouch/touchvue.js'
import FastClick from 'fastclick'

import {
  Slider,
  Tab,
  Tabs,
  Overlay,
  Button,
  Col,
  Row,
  NavBar,
  Dialog,
  Toast,
  Field,
  List,
  Icon
} from 'vant'

Vue.use(Slider).use(Tab).use(Tabs).use(Overlay).use(Button).use(Col).use(Row).use(NavBar).use(Dialog).use(Toast).use(Field).use(List).use(Icon)

Vue.use(VueHammer)


FastClick.prototype.focus = function (targetElement) {
  let length
  if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email') {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.$httpClient = httpClient
Vue.prototype.$config = config
Vue.prototype.$loading = loading

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')




