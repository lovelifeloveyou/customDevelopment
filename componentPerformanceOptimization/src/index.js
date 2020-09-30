import cloudComponent from './views/index'

cloudComponent.install = Vue => Vue.component(cloudComponent.name, cloudComponent);//注册组件

export default cloudComponent
