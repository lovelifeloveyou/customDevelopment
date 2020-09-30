// 测试线打包
let server = 'https://vsryunesstest.dalongyun.com'

// 得区分掌上网咖接口地址
// 'https://gwesstest.dalongyun.com'
// https://gwesspre.dalongyun.com
module.exports = {
  server,
  apiServer: server + '/v1/rtc',
  mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://waptest.ucbgames.com/recharge'
}
