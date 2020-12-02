// let server = 'https://vsryunesstest.dalongyun.com'
let server = 'https://vsryunesspre.dalongyun.com'


const config = {
  server,
  prefixPath: '/video',
  apiServer: server + '/v1/rtc',
  directTest: true,
  // WSS_URL: 'wss://vsrwsstest.dalongyun.com',
  // pcRechargeEntry: 'https://waptest.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  // mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  // zswkRechargeEntry:'http://waptest.ucbgames.com/recharge',
  WSS_URL: 'wss://vsrwsspre.dalongyun.com',
  pcRechargeEntry: 'https://wappre.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  mobileRechargeEntry: 'https://wappre.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'https://wappre.zhangshangtech.com/recharge',
  // ip: '172.81.197.172',
  // port: '60108',
  // ip: '172.81.197.168',
  // port: '59808',
  // ip: '129.211.198.130',
  // port: '60008',
  // ip: '172.81.197.161',
  // port:'59408',
  // ip: '172.81.197.175',
  // port:'59508',
  // ip: '172.81.197.180',
  // port:'59808',
  // ip: '49.234.172.58',
  // port: '60008',
  // ip: '172.81.197.183',
  // port: '60108',
  // ip: '139.159.190.14',
  // port:'58008',
  // ip: '172.81.197.186',
  // port: '59208',
  // ip: '172.81.197.180',
  // port:'59808',
  // ip: '172.81.197.180',
  // port:'59508',
  // ip: '172.81.197.182',
  // port: '59808',
  // ip: '152.136.52.41',
  // port:'58008',
  // ip: '211.159.196.162',
  // port: '58008',

  //直连
  // ip: '192.168.2.199',
  // port:'58008',
  ip: '172.81.197.180',
  port: '59908',

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
