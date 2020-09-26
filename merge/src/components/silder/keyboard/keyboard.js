import httpclient from '../../../utils/request'
import common from '../../../directives/common'
import tools from '../../../utils/tools'
import axios from './axios';
const _axios = axios._axios

export default {
    // 我的键盘列表
    // getMyKeyboardList(data) {
    //     let query = common.getParam(data)
    //     return httpclient.get(`/v1/rtc/my_keyboard_list?${query}`)
    // },

    // 官方键盘列表
    getOfficeKeyboardList(params){
        return httpclient.post(`/office_keyboard_list`,tools.transObject(params))
    },
    // 获取键盘按键信息
    getKeyboardInfo(params){
        let query = common.getParam(params)
        return httpclient.get(`/keyboard_info?${query}`)
    },
    // 流桌面获取使用详情接口
    getUseInfo(params) {
        return httpclient.post(`/use_info`,tools.transObject(params))
    },
}
