// 正式线打包
let server = "https://vsryuness.dalongyun.com"

// 得区分掌上网咖接口地址
// 'https://gwess.dalongyun.com'

module.exports = {
  server,
  apiServer: server + '/v1/rtc',
  mobileRechargeEntry: 'http://dlyun.wap.slb.dalongyun.com/alipay.php?mod=addmoney&loginSign=',
  zswkRechargeEntry:'http://m.zhangshangtech.com/recharge'
}
