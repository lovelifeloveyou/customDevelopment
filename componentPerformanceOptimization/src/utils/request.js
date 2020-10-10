import axios from 'axios'
import config from '../config/index'
import tools from './tools'

config.accessToken.set('pc:1fd4ce808a62baaa0ba9650684e873b28b6c8ef1')
// 保存最近一次请求的信息 401时重新发起
// const oldRequest = {}
// const tip = tipTmp

/**
 * 可定义白名单
 */

const serverWhiteList = [
  config.apiServer
]
// 超时时间
axios.defaults.timeout = 15000

axios.defaults.headers.common["Token"] = config.accessToken.get();          
// let token =JSON.parse( localStorage.getItem('vuex'))
// axios.defaults.headers.common["Token"] = token.bbs.token;

// http请求拦截器
axios.interceptors.request.use(request => {
  if (!request.url.startsWith('http')) {
    if (request.url.lastIndexOf('&') === request.url.length-1) {
      request.url = request.url.substring(0, request.url.lastIndexOf('&'))
    }
    request.url = config.apiServer + request.url 
  }
  let tmpUrl = request.url
  if (request.method === 'get' && request.params) {
    tmpUrl = request.url + '?'
    for (let key in request.params) {
      tmpUrl += key + '=' + request.params[key] + '&'
    }
    tmpUrl = tmpUrl.substring(0, tmpUrl.length-1)
  }

  // oldRequest[tmpUrl] = {
  //   tmpUrl: tmpUrl,
  //   tmpData: request.data,
  //   method: request.method
  // } 

  return request
}, error => {
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(response => {
  const result = response.data.data
  return result
}, error => {
  return Promise.reject(error)
})


export default {
  get: (url, params) => {
    console.log('23',url,params)
    // if (params !== undefined) {
    //   for (var key in params) {
    //     if (params[key] !== undefined){
    //       if (Object.prototype.toString.call(params[key]) === "[object Date]") {
    //         params[key] = params[key].toISOString()
    //       }
    //     } else {
    //       params[key] = ''
    //     }
    //   }
    // }
    // params = tools.paramsToUrl(params)
    url += params
    return axios({
      url: url,
      methos: 'get'
    })
  },
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  update: axios.update
}