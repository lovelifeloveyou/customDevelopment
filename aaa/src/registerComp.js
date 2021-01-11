import Vue from 'vue'

const componentsContext = require.context('./components/scroll', true, /index.(vue|js)$/)

componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component).default
  if (/.vue$/.test(component)) {
    Vue.component(componentConfig.name, componentConfig)
  } else {
    Vue.use(componentConfig)
  }
})