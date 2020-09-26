import customDevelopment from './views/index'

customDevelopment.install = Vue => Vue.component(customDevelopment.name, customDevelopment);//注册组件

export default customDevelopment
