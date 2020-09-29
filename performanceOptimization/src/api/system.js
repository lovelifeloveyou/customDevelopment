import httpclient from '../utils/request'
import tools from '../utils/tools'


export default {
  // websocket推送连接服务器
  confirmUseServer (params) {
    return httpclient.post(`/confirmUseServer`, params)
  },
  // 获取键盘按键信息
  getKeyboardInfo(params){
    return httpclient.get(`/keyboard_info`, tools.paramsToUrl(params))
  },
  // 测速
  testSpeed (params) {
    return httpclient.post(`/testSpeed`, params)
  },
  // 连接使用状态
  connect (params) {
    return httpclient.post(`/getService`, params)
  },
  // 确认连接使用
  confirmUse (params) {
    return httpclient.post(`/confirmQueue`, params)
  },
  // 是否进入排队
  confirmQueue (params) {
    return httpclient.post(`/confirmQueue`, params)
  },
  // 取消排队
  cancelQueue () {
    return httpclient.post(`/cancelQueue`)
  },
  // 用户注销
  cancellation (params) {
    return httpclient.post(`/cancellation`, params)
  },
  // 提交测速结果
  speedResultSubmit (params) {
    return httpclient.post(`/speedResultSubmit`, params)
  },
  // 用户取消使用连接服务
  releaseServer (params) {
    return httpclient.post(`/cancellation`, params)
  },
  // 获取服务接口（多开）
  getServiceAnother (params) {
    return httpclient.post(`/getServiceAnother`, params)
  },
  preserveKeyboardDel (params) {
    return httpclient.post(`/addKeyboard`, tools.transObject(params))
  },
  // 自定义键盘存储
  preserveKeyboard (params) {
    return httpclient.post(`/addKeyboard`, tools.transObject(params))
  },
  // 我的自定义键盘
  getMyKeyboard (params) {
    return httpclient.post(`/myKeyboard`, params)
  }
  
}