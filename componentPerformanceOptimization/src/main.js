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

Vue.config.productionTip = false
Vue.prototype.$httpClient = httpClient
Vue.prototype.$config = config
Vue.prototype.$loading = loading

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')




