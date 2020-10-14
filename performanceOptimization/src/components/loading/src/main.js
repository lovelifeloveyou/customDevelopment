import Vue from 'vue'
import Main from './main.vue'
let LoadingConstructor = Vue.extend(Main)

let instance

const Message = function (options) {
  if (Vue.prototype.$isServer) return
  let id = 'dalongyun'

  instance = new LoadingConstructor()
  instance.id = id
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instance.dom.style.zIndex = 2000000
  return instance.vm
}

Message.close = function () {
  if (instance) {
    instance.out()
    instance = null
  }
}

Message.open = function () {
  return Message()
}

export default Message