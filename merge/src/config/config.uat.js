// 测试线打包
// let server = 'https://vsryunesstest.dalongyun.com'
// 预发布线打包
let server = 'https://vsryunesspre.dalongyun.com'

const config = {
  server,
  prefixPath: '/video',
  apiServer: server + '/v1/rtc',
  directTest: false,
  // 测试线打包
  WSS_URL: 'wss://vsrwsstest.dalongyun.com',
  // pcRechargeEntry: 'https://waptest.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  // mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  // zswkRechargeEntry:'http://waptest.ucbgames.com/recharge',
  // 预发布线打包
  pcRechargeEntry: 'https://wappre.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  mobileRechargeEntry: 'https://wappre.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'https://wappre.zhangshangtech.com/recharge',
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
