import cloudComputerCustom from './views/index'

const components = [cloudComputerCustom]

const install = function (Vue) {
  components.forEach(function (item) {
    if (item.install) {
      Vue.use(item)
    } else if (item.name) {
      Vue.component(item.name, item)
    }
  })
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  cloudComputerCustom
}