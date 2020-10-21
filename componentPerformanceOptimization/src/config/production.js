// 正式线打包
let server = "https://vsryuness.dalongyun.com"
let zswkServer = 'https://gwess.dalongyun.com'


module.exports = {
  server,
  zswkServer,
  apiServer: server + '/v1/rtc',
  zswkApiServer: zswkServer + '/api/v1/rtc',
  directTest: false,
  mobileRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://m.zhangshangtech.com/recharge'
}
