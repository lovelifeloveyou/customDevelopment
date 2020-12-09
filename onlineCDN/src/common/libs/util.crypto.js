import CryptoJS from 'crypto-js';

export default {
	//加密
	encrypt (word, keyStr) {
		keyStr = keyStr ? keyStr : 'DlClientPost2019';
		let hash = CryptoJS.MD5(keyStr).toString();
		let iv = CryptoJS.MD5(keyStr.split("").reverse().join("")).toString();
		return CryptoJS.AES.encrypt(word, hash, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}).toString();
	},
	//解密
	decrypt (word, keyStr) {
		keyStr = keyStr ? keyStr : 'DlClientPost2019';
		let hash = CryptoJS.MD5(keyStr).toString();
		let iv = CryptoJS.MD5(keyStr.split("").reverse().join("")).toString();
		return JSON.parse(CryptoJS.AES.decrypt(word, hash, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8));
	}
}

