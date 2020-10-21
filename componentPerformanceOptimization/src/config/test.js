// 测试线打包
let server = 'https://vsryunesstest.dalongyun.com'
let zswkServer = 'https://gwesstest.dalongyun.com'

// 得区分掌上网咖接口地址
// 'https://gwesstest.dalongyun.com'
// https://gwesspre.dalongyun.com
module.exports = {
  server,
  zswkServer,
  apiServer: server + '/v1/rtc',
  zswkApiServer: zswkServer + '/api/v1/rtc',
  directTest: false,
  mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://waptest.ucbgames.com/recharge'
}
