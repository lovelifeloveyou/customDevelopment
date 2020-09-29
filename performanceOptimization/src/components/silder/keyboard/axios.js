import axios from "axios"
import qs from "qs";


/**
 * axios
 */
// http://vsryunessdev.dalongyun.com/
var _axios = axios.create({
    // baseURL:  process.env.VUE_APP_BASE_ESS_API,
    //测试线线
    // baseURL:  'https://gwesstest.dalongyun.com',
    //预发布线
    baseURL:  'https://gwesspre.dalongyun.com',
    //正式线 
    // baseURL:  'https://gwess.dalongyun.com',
    timeout: 30000,
    withCredentials: false,
    crossDomain: false,
});


const axiosInter = (axiosType) => {
    axiosType.interceptors.request.use(
        config => {//请求拦截
            if (config.method === "post") {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                config.data = qs.stringify(config.data);
            }
            let token=JSON.parse(localStorage.getItem('h5userInfo'))
            config.headers['Token'] = token.apiToken
            // config.headers['Token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjYwNDgwMCwiZXhwIjoxNjAwNDE0OTQ0LCJ2ZXJzaW9uIjoiMS4wLjAiLCJhY2NvdW50IjoiNTIzMzAzZGY3NTIzZTUwYjA1NjA0NDQ4MGQ1OWRhOTUiLCJhcHBfa2V5IjoiMGVmMzVkYTQ0Y2JkZGM3NmRiOGFiMTA5N2UwZDNkMGIiLCJwYXJ0bmVyX2NvZGUiOiIxMjIxMDI5MDE5IiwiY2hhbm5lbF9jb2RlIjoib2ZmaWNpYWwiLCJ1aWQiOiIxNzA4Njg4NCIsInVuYW1lIjoiRExQVF8xOTkwMTI2RiIsIm1vYmlsZSI6bnVsbCwiZW1haWwiOm51bGwsInVzZXJfdmlwIjowLCJwbGF0Zm9ybSI6Img1IiwicnRjX3Rva2VuIjoiMDlhNWY3ZWE3MzViYjhiMGYyNzRlY2Q1ZDE2YjJhZDciLCJwcmljZV9yYWRpbyI6MSwicHJpY2VfdW5pdCI6Ilx1NGU5MVx1OGM0NiIsImZsYWciOiIwIn0.zfEQGQXzEIRoFsgH8Tt6WlWzOPFaRMsOE7xx6rkPLxc';
            return config
        }, error => {//请求错误处理
            return Promise.reject(error)
        }
    )

    axiosType.interceptors.response.use(
        response => {//响应拦截
            let rest = response.data;
            let code = rest.code;
            switch(code){
                case(200):
                    return rest.data;
                    break;
            }
            // return rest;
        }, error => {// 对响应错误做点什么
            // errorNotification("数据异常");
            return Promise.reject(error)
        }
    )
}

axiosInter(_axios)

export default {
    _axios
}
