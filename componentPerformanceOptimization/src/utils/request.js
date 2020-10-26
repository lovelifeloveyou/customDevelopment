import axios from 'axios'
import config from '../config/index'
import tools from './tools'

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

if ((window.location.href).indexOf("?") != -1) {
  let searchParams = new URLSearchParams(window.location.href)
  let flag = Number(searchParams.get('flag'))
  if ([10, 2, 3, 3.1].includes(flag)) {
    axios.defaults.headers.common["Token"] = config.accessToken.get()
  } else {
    let token =JSON.parse(localStorage.getItem('vuex'))
    axios.defaults.headers.common["Token"] = token.bbs.token
  }
} else {
  config.accessToken.set('pc:08f1e13b30947bdea536fb839c3d3759b349fed7')
  axios.defaults.headers.common["Token"] = config.accessToken.get(); 
}         

// http请求拦截器
axios.interceptors.request.use(request => {
  if (!request.url.startsWith('http')) {
    if (request.url.lastIndexOf('&') === request.url.length-1) {
      request.url = request.url.substring(0, request.url.lastIndexOf('&'))
    }
    if ((request.url).includes('/useInfo')) {
      request.url = config.zswkApiServer + request.url
      // let token = JSON.parse(localStorage.getItem('h5userInfo')) || {apiToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjYwNDgwMCwiZXhwIjoxNjAzNzkzMTgxLCJ2ZXJzaW9uIjoiMS4wLjAiLCJhY2NvdW50IjoiOGU2OTZlMzljOTRjZDMxOGIyYzU5ZjUzMzEyZTZkMzUiLCJhcHBfa2V5IjoiZjIzZGFjYTQ2YmI5ZTFmM2M3YTY2YTZiYTlkMmJiOTEiLCJwYXJ0bmVyX2NvZGUiOiIxMjIxMDI5MDE5IiwiY2hhbm5lbF9jb2RlIjoiemhhbmdzaGFuZ3RlY2hfaDUiLCJ1aWQiOiI0MjEzNzM4NCIsInVuYW1lIjoiRExQVF83QTgzNzU3MCIsIm1vYmlsZSI6bnVsbCwiZW1haWwiOm51bGwsInVzZXJfdmlwIjowLCJwbGF0Zm9ybSI6Img1IiwicnRjX3Rva2VuIjoiOTIwYWUzZmZlNTk1YjUzNTQ2NTlmOTliNDI1YWM0Y2UiLCJwcmljZV9yYWRpbyI6MTAwLCJwcmljZV91bml0IjoiXHU3ZjUxXHU1ZTAxIiwiZmxhZyI6IjIifQ.k03iVtJhHUKn7CKA65JvenqiEaI38L0eMxKheLFGe58'}
      let token = JSON.parse(localStorage.getItem('h5userInfo'))
      request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      request.headers['Token'] = token.apiToken
    } else {
      request.url = config.apiServer + request.url
    }
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