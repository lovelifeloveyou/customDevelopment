// let server = 'https://vsryunesstest.dalongyun.com'
// let server = 'http://vsryunessdev.dalongyun.com'
let server = 'https://vsryunesspre.dalongyun.com'

// 得区分掌上网咖接口地址
// 'https://gwess.dalongyun.com'

module.exports = {
  server,
  apiServer: server + '/v1/rtc',
  // mobileRechargeEntry: 'http://waptest.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  // zswkRechargeEntry:'http://waptest.ucbgames.com/recharge'
  mobileRechargeEntry: 'https://wappre.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'https://wappre.zhangshangtech.com/recharge'
}
