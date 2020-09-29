(function(config) {
	window.AnalysysAgent = window.AnalysysAgent || []
	window.AnalysysAgent.methods = 'identify alias reset track profileSet profileSetOnce profileIncrement profileAppend profileUnset profileDelete registerSuperProperty registerSuperProperties unRegisterSuperProperty clearSuperProperties getSuperProperty getSuperProperties pageView debugMode auto appkey name uploadURL hash visitorConfigURL autoProfile autoWebstay encryptType pageProperty autoHeatmap freeApi'.split(' ');

	function factory(b) {
		return function() {
			var a = Array.prototype.slice.call(arguments);
			a.unshift(b);
			window.AnalysysAgent.push(a);
			return window.AnalysysAgent;
		}
	}
	for (var i = 0; i < AnalysysAgent.methods.length; i++) {
		var key = window.AnalysysAgent.methods[i];
		AnalysysAgent[key] = factory(key);
	}
	for (var key in config) {
		AnalysysAgent[key](config[key])
	}
	var date = new Date();
	var time = new String(date.getFullYear()) + new String(date.getMonth() + 1) + new String(date.getDate());

	var d = document,
		c = d.createElement('script'),
		n = d.getElementsByTagName('script')[0];
	c.type = 'text/javascript';
	c.async = true;
	c.id = 'ARK_SDK';
	c.src = 'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/channel/AnalysysAgent_JS_SDK.min.js' +'?v=' +time; //JS SDK存放地址
	n.parentNode.insertBefore(c, n);
})({
    //正式线埋点模式及appkey
	appkey: '23376d5170259585', //APPKEY
	debugMode: 0,
	//测试线及预发布线埋点模式及appkey
	// appkey: 'b3dbdb245d6c8515', //APPKEY
	// debugMode: 2,
    uploadURL: 'http://ufo.dalongyun.com:8089',//上传数据的地址
})
