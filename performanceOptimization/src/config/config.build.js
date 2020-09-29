// 正式线打包
let server = "https://vsryuness.dalongyun.com"

const config = {
  server,
  prefixPath: '/video',
  apiServer: server + '/v1/rtc',
  directTest: false,
  WSS_URL: 'wss://vsrwss.dalongyun.com',
  pcRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  mobileRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://m.zhangshangtech.com/recharge',
  accessToken: {
    get: () => {
      return sessionStorage.getItem('access_token')
    },
    set: (value) => {
      return sessionStorage.setItem('access_token', value)
    }
  },
  refreshToken: {
    get: () => {
      return sessionStorage.getItem('refresh_token')
    },
    set: (value) => {
      return sessionStorage.setItem('refresh_token', value)
    }
  }
}
export default config
