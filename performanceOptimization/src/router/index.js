import store from '../store'
import video from '@/view/video'
import config from '../config'

let url = window.location.href;
let router;
console.log(config)
console.log('路径',url)
if (config.directTest) {
  config.accessToken.set('pc:f1adb886f280db211e4c529f42c79e6908788bc5')
  axios.defaults.headers.common["Token"] = config.accessToken.get()
  router = new VueRouter({
    // base: '/video/',
    // mode: 'history',
    routes: [
      {
        path: '/',
        name: 'video',
        component: video
      }
    ]
  })
} else {
  if(url.indexOf("?") != -1) {
    let queryString = url.split('?')[1].split('#')[0]
    let queryArr = queryString.split('&')
    for(let i=0; i<queryArr.length; i++) {
      const element = queryArr[i].split('=')
      if(element[0] == 'token') {
        store.commit('set_token', element[1])
        config.accessToken.set(element[1])
      }
      if(element[0] == 'param') {
        store.commit('set_param', element[1])
      }
      if(element[0] == 'app') {
        store.commit('set_app', element[1])
      }
      if (element[0] == 'flag') {
        store.commit('set_flag', Number(element[1]))
        if ([10,2, 3, 3.1].includes(Number(element[1]))) {
          axios.defaults.headers.common["Token"] = config.accessToken.get()
        } else {
          let token =JSON.parse(localStorage.getItem('vuex'))
          axios.defaults.headers.common["Token"] = token.bbs.token
        }
      }
    }
  }
  let urlData = url.split('?')[0];
  // window.location.href = urlData;
  router = new VueRouter({
    mode: 'history',
    routes:[{
      path: '/video',
      name: 'video',
      component: () => import('@/view/video')
    }]
  })
}
export default router;
