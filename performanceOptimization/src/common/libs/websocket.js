import util from "./util.crypto";

let socket = ''
let vm = this
const sendThis = ( _this )=> {
	console.log('vm')
	console.log(_this)
	vm = _this;
};

const init = function () {
	if (typeof (WebSocket) === "undefined") {
		// alert("您的浏览器不支持socket")
	} else {
		console.log('vm.path')
		console.log(vm.path)
		// 实例化socket
		socket = new WebSocket(vm.path);
		socket.binaryType = 'arraybuffer';
		
		// 监听socket连接
		socket.onopen = open;
		// 监听socket消息
		socket.onmessage = getMessage;
	}
}

const open = function () {
	setInterval(function () {
		sendPackage('{"cmd":"heart","data":{},"ext":{}}');
	}, 10000)
}

const getMessage = function (event) {
	if (event.data instanceof ArrayBuffer) {
		let object = vm;
		let buffer = event.data;
		let view = new DataView(buffer);
		let str = '';
		let len = view.getUint32(0);
		window.console.log(len);
		for (let i = 4; i < view.byteLength; i++) {
			str += String.fromCharCode(view.getUint8(i));
		}
		let obj = util.decrypt(str);
		window.console.log(obj);
		let msgId = obj.ext.msgId;
		sendPackage('{"cmd":"msgAck","data":{},"ext":{"msgId":' + msgId + '}}');
		if (obj.cmd == 'invalid') { // 登录失效  跳出流桌面

		}
		if (obj.cmd == 'server') {
			let res = obj.data.package;
			window.console.log('返回信息',res)
			window.console.log(res, 'res-message')
			if (res.type === 'free_expired') { // 免费体验结束
				window.console.log('freeIsend:' + object)
				window.console.log(object)
				object.freeIsEnd = true;
			}
			if (res.type === 'vip_expired') { // 会员免费体验结束
				window.console.log('vip_expired:' + object)
				window.console.log(object)
				setTimeout(()=>{
					object.memberFreeIsEnd = true;
				},30000)
			}
		}
	}
}

const send = (byteArr) => {
	let buffer = new ArrayBuffer(byteArr.length + 4);
	let view = new DataView(buffer);
	view.setUint32(0, byteArr.length);
	for (let i = 0; i < byteArr.length; i++) {
		view.setUint8(i + 4, byteArr[i]);
	}
	socket.send(view);
}

const sendPackage = (pack) => {
	let data = util.encrypt(pack);
	let arr = [];
	for (let i = data.length - 1; i >= 0; i--) {
		let str = data.charAt(i);
		let code = str.charCodeAt(0);
		arr[i] = code;
	}
	send(arr);
}

export default {
	sendThis,
	init,
}
