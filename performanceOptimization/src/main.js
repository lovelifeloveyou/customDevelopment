import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import httpClient from './utils/request'
// import Vconsole from 'vconsole'
import FastClick from 'fastclick'
import VueCookies from 'vue-cookies'
import $ from 'jquery'
import gesture from './directives/gesture/index'
import { VueHammer } from './directives/hammerTouch/touchvue.js'
import './directives/waves.js'
import store from './store/index'
import config from './config'
import helpers from './directives/helpers.js'
import {
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
} from 'vant';

Vue.config.productionTip = false

// let vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(Tab).use(Tabs).use(Overlay).use(Button).use(Col).use(Row).use(NavBar).use(Dialog).use(Toast).use(Field).use(List).use(Icon);
Vue.use(helpers)
Vue.use(VueHammer)
Vue.use(gesture)
Vue.use(VueCookies)

Vue.prototype.$httpClient = httpClient
Vue.prototype.$config = config
Vue.prototype.$toast = Toast
Vue.prototype.$ = $

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
var userAgent = navigator.userAgent; 
console.log(userAgent)


new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
