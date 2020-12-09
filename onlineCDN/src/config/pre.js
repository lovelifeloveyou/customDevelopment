// 预发布线打包
let server = 'https://vsryunesspre.dalongyun.com'
let zswkServer = 'https://gwesspre.dalongyun.com'

// 得区分掌上网咖接口地址
// 'https://gwesstest.dalongyun.com'
// https://gwesspre.dalongyun.com
module.exports = {
  server,
  zswkServer,
  apiServer: server + '/v1/rtc',
  zswkApiServer: zswkServer + '/api/v1/rtc',
  directTest: false,
  // 预发布线打包
  mobileRechargeEntry: 'https://wappre.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'https://wappre.zhangshangtech.com/recharge'
}
