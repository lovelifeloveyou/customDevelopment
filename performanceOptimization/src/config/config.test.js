测试线打包
let server = 'https://vsryunesstest.dalongyun.com'

const config = {
  server,
  prefixPath: '/video',
  apiServer: server + '/v1/rtc',
  directTest: false,
  // 测试线打包
  WSS_URL: 'wss://vsrwsstest.dalongyun.com',
  pcRechargeEntry: 'https://waptest.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://waptest.ucbgames.com/recharge',
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
