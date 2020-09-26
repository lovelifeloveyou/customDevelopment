export default {
  install (Vue, options) {
    Vue.prototype.$bodyScroll = function (event) {
      event.preventDefault()
    }
  }
}
