import axios from './axios';
const _axios = axios._axios

export default {
    getZswkUseInfo(params) {
        return _axios({
            url: `/api/v1/rtc/useInfo`,
            method: 'post',
            data: params
        })
    }
}
