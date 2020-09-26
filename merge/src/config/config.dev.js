let server = 'https://vsryunesstest.dalongyun.com'


const config = {
  server,
  prefixPath: '/video',
  apiServer: server + '/v1/rtc',
  directTest: true,
  WSS_URL: 'wss://vsrwss.dalongyun.com',
  pcRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/indexs.php?mod=recharge&sl=6&loginSign=',
  mobileRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  // ip: '172.81.197.168',
  // port: '59808',
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
  // ip: '172.81.197.182',
  // port: '59808',

  //直连
  // ip: '192.168.2.199',
  // port:'58008',
  // ip: '49.234.172.58',
  // port: '60008',
  ip: '140.143.105.203',
  port: '59708',

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
