import httpclient from '../utils/request'
import tools from '../utils/tools'

export default {
    // 官方键盘列表
    getOfficeKeyboardList(params){
        return httpclient.post(`/office_keyboard_list`,tools.transObject(params))
    },
    // 获取键盘按键信息
    getKeyboardInfo(params){
        return httpclient.get(`/keyboard_info`, tools.paramsToUrl(params))
    },
    // 流桌面获取使用详情接口
    getUseInfo(params) {
        return httpclient.post(`/use_info`,tools.transObject(params))
    },
    // 删除自定义键盘
    preserveKeyboardDel (params) {
        return httpclient.post(`/addKeyboard`, tools.transObject(params))
    },
    // 获取掌上网咖用户信息
    getZswkUseInfo (params) {
        return httpclient.post(`/useInfo`, params)
    },
    // 我的自定义键盘
    getMyKeyboard (params) {
        return httpclient.post(`/myKeyboard`, params)
    },
    // 自定义键盘存储
    preserveKeyboard (params) {
        return httpclient.post(`/addKeyboard`, tools.transObject(params))
    },
}
