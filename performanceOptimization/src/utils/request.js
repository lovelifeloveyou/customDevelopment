import axios from 'axios'
import config from '../config'

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