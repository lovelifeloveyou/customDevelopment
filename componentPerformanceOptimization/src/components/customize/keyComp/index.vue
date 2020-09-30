<template>
	<div class="keyComp">
		<div class="key-item" :style="adaptIPhoneXStyle">
			<button
				@click="addKey(item)"
				v-for="(item, index) in keyComp"
				:key="index"
				:class="{ 'btn1': index < 19, 'btn2': index >= 19 && index < 33, 'btn3': index >= 33 && index < 47, 'btn4': index >= 47 && index < 60, 'btn5': index >59 && index < 73, 'btn6': index > 72}"
				:style="btnHeight[index]"
			>
				<span>{{ item.key }}</span>
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import tools from '@/utils/tools'

export default {
	name: "key",
	data() {
		return {
			compMsg: [],
			keyComp: [
				{ key: "Esc", keyCode: 27 },
				{ key: "F1", keyCode: 112 },
				{ key: "F2", keyCode: 113 },
				{ key: "F3", keyCode: 114 },
				{ key: "F4", keyCode: 115 },
				{ key: "F5", keyCode: 116 },
				{ key: "F6", keyCode: 117 },
				{ key: "F7", keyCode: 118 },
				{ key: "F8", keyCode: 119 },
				{ key: "F9", keyCode: 120 },
				{ key: "F10", keyCode: 121 },
				{ key: "F11", keyCode: 122 },
				{ key: "F12", keyCode: 123 },
				{ key: "Ins", keyCode: 45 },
				{ key: "Del", keyCode: 46 },
				{ key: "PgUp", keyCode: 33 },
				{ key: "PgDn", keyCode: 34 },
				{ key: "Home", keyCode: 36 },
				{ key: "End", keyCode: 35 },
				{ key: "`", keyCode: 192 },
				{ key: "1", keyCode: 49 },
				{ key: "2", keyCode: 50 },
				{ key: "3", keyCode: 51 },
				{ key: "4", keyCode: 52 },
				{ key: "5", keyCode: 53 },
				{ key: "6", keyCode: 54 },
				{ key: "7", keyCode: 55 },
				{ key: "8", keyCode: 56 },
				{ key: "9", keyCode: 57 },
				{ key: "0", keyCode: 48 },
				{ key: "-", keyCode: 189 },
				{ key: "=", keyCode: 187 },
				{ key: "Back", keyCode: 8 },
				{ key: "Tab", keyCode: 9 },
				{ key: "q", keyCode: 81 },
				{ key: "w", keyCode: 87 },
				{ key: "e", keyCode: 69 },
				{ key: "r", keyCode: 82 },
				{ key: "t", keyCode: 84 },
				{ key: "y", keyCode: 89 },
				{ key: "u", keyCode: 85 },
				{ key: "i", keyCode: 73 },
				{ key: "o", keyCode: 79 },
				{ key: "p", keyCode: 80 },
				{ key: "[", keyCode: 219 },
				{ key: "]", keyCode: 221 },
				{ key: "\\", keyCode: 220 },
				{ key: "Caps", keyCode: 20 },
				{ key: "a", keyCode: 65 },
				{ key: "s", keyCode: 83 },
				{ key: "d", keyCode: 68 },
				{ key: "f", keyCode: 70 },
				{ key: "g", keyCode: 71 },
				{ key: "h", keyCode: 72 },
				{ key: "j", keyCode: 74 },
				{ key: "k", keyCode: 75 },
				{ key: "l", keyCode: 76 },
				{ key: ";", keyCode: 186 },
				{ key: "'", keyCode: 222 },
				{ key: "Enter", keyCode: 13 },
				{ key: "Shift", keyCode: 16 },
				{ key: "z", keyCode: 90 },
				{ key: "x", keyCode: 88 },
				{ key: "c", keyCode: 67 },
				{ key: "v", keyCode: 86 },
				{ key: "b", keyCode: 66 },
				{ key: "n", keyCode: 78 },
				{ key: "m", keyCode: 77 },
				{ key: ",", keyCode: 188 },
				{ key: ".", keyCode: 190 },
				{ key: "/", keyCode: 191 },
				{ key: "↑", keyCode: 38 },
				{ key: "Shift", keyCode: 16 },
				{ key: "Ctrl", keyCode: 17 },
				{ key: "win", keyCode: 100000 },
				{ key: "Alt", keyCode: 18 },
				{ key: "Space", keyCode: 32 },
				// { key: "小键盘", keyCode: 200000 },
				{ key: "←", keyCode: 37 },
				{ key: "↓", keyCode: 40 },
				{ key: "→", keyCode: 39 }
			],
			// keyCompUsual: [
			// 	{ key: "Esc", keyCode: 27 },
			// 	{ key: "F1", keyCode: 112 },
			// 	{ key: "F2", keyCode: 113 },
			// 	{ key: "F3", keyCode: 114 },
			// 	{ key: "F4", keyCode: 115 },
			// 	{ key: "F5", keyCode: 116 },
			// 	{ key: "F6", keyCode: 117 },
			// 	{ key: "F7", keyCode: 118 },
			// 	{ key: "F8", keyCode: 119 },
			// 	{ key: "F9", keyCode: 120 },
			// 	{ key: "F10", keyCode: 121 },
			// 	{ key: "F11", keyCode: 122 },
			// 	{ key: "F12", keyCode: 123 },
			// 	{ key: "Ins", keyCode: 45 },
			// 	{ key: "Del", keyCode: 46 },
			// 	{ key: "PgUp", keyCode: 33 },
			// 	{ key: "PgDn", keyCode: 34 },
			// 	{ key: "Home", keyCode: 36 },
			// 	{ key: "End", keyCode: 35 },
			// 	{ key: "`", keyCode: 192 },
			// 	{ key: "1", keyCode: 49 },
			// 	{ key: "2", keyCode: 50 },
			// 	{ key: "3", keyCode: 51 },
			// 	{ key: "4", keyCode: 52 },
			// 	{ key: "5", keyCode: 53 },
			// 	{ key: "6", keyCode: 54 },
			// 	{ key: "7", keyCode: 55 },
			// 	{ key: "8", keyCode: 56 },
			// 	{ key: "9", keyCode: 57 },
			// 	{ key: "0", keyCode: 48 },
			// 	{ key: "-", keyCode: 189 },
			// 	{ key: "=", keyCode: 187 },
			// 	{ key: "Back", keyCode: 8 },
			// 	{ key: "Tab", keyCode: 9 },
			// 	{ key: "q", keyCode: 81 },
			// 	{ key: "w", keyCode: 87 },
			// 	{ key: "e", keyCode: 69 },
			// 	{ key: "r", keyCode: 82 },
			// 	{ key: "t", keyCode: 84 },
			// 	{ key: "y", keyCode: 89 },
			// 	{ key: "u", keyCode: 85 },
			// 	{ key: "i", keyCode: 73 },
			// 	{ key: "o", keyCode: 79 },
			// 	{ key: "p", keyCode: 80 },
			// 	{ key: "[", keyCode: 219 },
			// 	{ key: "]", keyCode: 221 },
			// 	{ key: "\\", keyCode: 220 },
			// 	{ key: "Caps", keyCode: 20 },
			// 	{ key: "a", keyCode: 65 },
			// 	{ key: "s", keyCode: 83 },
			// 	{ key: "d", keyCode: 68 },
			// 	{ key: "f", keyCode: 70 },
			// 	{ key: "g", keyCode: 71 },
			// 	{ key: "h", keyCode: 72 },
			// 	{ key: "j", keyCode: 74 },
			// 	{ key: "k", keyCode: 75 },
			// 	{ key: "l", keyCode: 76 },
			// 	{ key: ";", keyCode: 186 },
			// 	{ key: "'", keyCode: 222 },
			// 	{ key: "Enter", keyCode: 13 },
			// 	{ key: "Shift", keyCode: 16 },
			// 	{ key: "z", keyCode: 90 },
			// 	{ key: "x", keyCode: 88 },
			// 	{ key: "c", keyCode: 67 },
			// 	{ key: "v", keyCode: 86 },
			// 	{ key: "b", keyCode: 66 },
			// 	{ key: "n", keyCode: 78 },
			// 	{ key: "m", keyCode: 77 },
			// 	{ key: ",", keyCode: 188 },
			// 	{ key: ".", keyCode: 190 },
			// 	{ key: "/", keyCode: 191 },
			// 	{ key: "↑", keyCode: 38 },
			// 	{ key: "Shift", keyCode: 16 },
			// 	{ key: "Ctrl", keyCode: 17 },
			// 	{ key: "win", keyCode: 100000 },
			// 	{ key: "Alt", keyCode: 18 },
			// 	{ key: "Space", keyCode: 32 },
			// 	// { key: "小键盘", keyCode: 200000 },
			// 	{ key: "←", keyCode: 37 },
			// 	{ key: "↓", keyCode: 40 },
			// 	{ key: "→", keyCode: 39 }
			// ],
			// keyCompNum: [
			// 	{ key: "Esc", keyCode: 27 },
			// 	{ key: "F1", keyCode: 112 },
			// 	{ key: "F2", keyCode: 113 },
			// 	{ key: "F3", keyCode: 114 },
			// 	{ key: "F4", keyCode: 115 },
			// 	{ key: "F5", keyCode: 116 },
			// 	{ key: "F6", keyCode: 117 },
			// 	{ key: "F7", keyCode: 118 },
			// 	{ key: "F8", keyCode: 119 },
			// 	{ key: "F9", keyCode: 120 },
			// 	{ key: "F10", keyCode: 121 },
			// 	{ key: "F11", keyCode: 122 },
			// 	{ key: "F12", keyCode: 123 },
			// 	{ key: "Ins", keyCode: 45 },
			// 	{ key: "Del", keyCode: 46 },
			// 	{ key: "PgUp", keyCode: 33 },
			// 	{ key: "PgDn", keyCode: 34 },
			// 	{ key: "Home", keyCode: 36 },
			// 	{ key: "End", keyCode: 35 },
			// 	{ key: "`", keyCode: 192 },
			// 	{ key: "Num1", keyCode: 97 },
			// 	{ key: "Num2", keyCode: 98 },
			// 	{ key: "Num3", keyCode: 99 },
			// 	{ key: "Num4", keyCode: 100 },
			// 	{ key: "Num5", keyCode: 101 },
			// 	{ key: "Num6", keyCode: 102 },
			// 	{ key: "Num7", keyCode: 103 },
			// 	{ key: "Num8", keyCode: 104 },
			// 	{ key: "Num9", keyCode: 105 },
			// 	{ key: "Num0", keyCode: 96 },
			// 	{ key: "-", keyCode: 189 },
			// 	{ key: "=", keyCode: 187 },
			// 	{ key: "Back", keyCode: 8 },
			// 	{ key: "Tab", keyCode: 9 },
			// 	{ key: "q", keyCode: 81 },
			// 	{ key: "w", keyCode: 87 },
			// 	{ key: "e", keyCode: 69 },
			// 	{ key: "r", keyCode: 82 },
			// 	{ key: "t", keyCode: 84 },
			// 	{ key: "y", keyCode: 89 },
			// 	{ key: "u", keyCode: 85 },
			// 	{ key: "i", keyCode: 73 },
			// 	{ key: "o", keyCode: 79 },
			// 	{ key: "p", keyCode: 80 },
			// 	{ key: "[", keyCode: 219 },
			// 	{ key: "]", keyCode: 221 },
			// 	{ key: "\\", keyCode: 220 },
			// 	{ key: "CapsLock", keyCode: 20 },
			// 	{ key: "a", keyCode: 65 },
			// 	{ key: "s", keyCode: 83 },
			// 	{ key: "d", keyCode: 68 },
			// 	{ key: "f", keyCode: 70 },
			// 	{ key: "g", keyCode: 71 },
			// 	{ key: "h", keyCode: 72 },
			// 	{ key: "j", keyCode: 74 },
			// 	{ key: "k", keyCode: 75 },
			// 	{ key: "l", keyCode: 76 },
			// 	{ key: ";", keyCode: 186 },
			// 	{ key: "'", keyCode: 222 },
			// 	{ key: "Enter", keyCode: 13 },
			// 	{ key: "Shift", keyCode: 16 },
			// 	{ key: "z", keyCode: 90 },
			// 	{ key: "x", keyCode: 88 },
			// 	{ key: "c", keyCode: 67 },
			// 	{ key: "v", keyCode: 86 },
			// 	{ key: "b", keyCode: 66 },
			// 	{ key: "n", keyCode: 78 },
			// 	{ key: "m", keyCode: 77 },
			// 	{ key: ",", keyCode: 188 },
			// 	{ key: ".", keyCode: 190 },
			// 	{ key: "/", keyCode: 191 },
			// 	{ key: "↑", keyCode: 38 },
			// 	{ key: "Shift", keyCode: 16 },
			// 	{ key: "Ctrl", keyCode: 17 },
			// 	{ key: "win", keyCode: 100000 },
			// 	{ key: "Alt", keyCode: 18 },
			// 	{ key: "Space", keyCode: 32 },
			// 	{ key: "小键盘", keyCode: 200000 },
			// 	{ key: "←", keyCode: 37 },
			// 	{ key: "↓", keyCode: 40 },
			// 	{ key: "→", keyCode: 39 }
			// ],
			adaptIPhoneXStyle: {},
			btnHeight: [],
			keyNum:false,
		};
	},
	methods: {
		addKey(item) {
			// if(item.keyCode == 200000){
			// 	if(this.keyNum){
			// 		this.keyNum =false;
			// 		this.keyComp=this.keyCompUsual;
			// 	}else{
			// 		this.keyNum =true;
			// 		this.keyComp=this.keyCompNum;
			// 	}
			// 	return
			// }
			let newData = {
				id: "",
				keyPressMode: "1",
				keyWidth: 50,
				keyHeight: 50,
				keyName: item.key,
				keyCode: item.keyCode,
				keyRealName: "",
				keyStyle: 0,
				rockerType: "-1",
				keySize: 5
			};
			this.$emit("func", newData);
		},
		sizeAdaptive () {
			let screenInfo = tools.getScreenInfo()
			if (tools.isIphoneX()) {
				this.adaptIPhoneXStyle = {'width': screenInfo.totalWidth + 'px', 'left': screenInfo.left + 'px', 'bottom': screenInfo.top + 'px'}
			} else {
				this.adaptIPhoneXStyle = {'bottom': screenInfo.top + 'px'}
			}
		}
	},
	computed: {
		...mapGetters([
			'fullScreenShow'
		])
	},
	watch: {
		fullScreenShow () {
			this.sizeAdaptive()
		}
	},
	mounted () {
		this.sizeAdaptive()
		this.keyComp.forEach((item, index) => {
			if (index < 19) {
				this.btnHeight[index] = {'height': tools.isIphoneX() ? '30px' : '25px'}
			} else {
				this.btnHeight[index] = {'height': tools.isIphoneX() ? '35px' : '30px'}
			}
		})
	}
};
</script>

<style scoped lang="less">
.key-item {
	position: fixed;
	bottom: 0px; 
	left: 0px; 
	right: 0px; 
	z-index: 1500;
	button {
		color: #ffffff;
		font-size: 12px;
		padding: 0px; 
		margin: 0px; 
		background-color: #000;
		opacity: 0.7;
		border: 1.7px solid #0e4a55;
	}
	button:nth-child(33) {
		background-image: url(../../../assets/img/icon/退格.png);
		background-repeat:no-repeat;
		background-size: 50px 41.7px;
		background-position:center;
		span {
			opacity: 0;
		}
	}
	button:nth-child(19) {
		width: 5.33%;
	}
	button:nth-child(33) {
		width: 9%;
	}
	button:nth-child(34) {
		width: 9%;
	}
	button:nth-child(48) {
		width: 11.5%;
	}
	button:nth-child(60) {
		width: 11.5%;
	}
	button:nth-child(61) {
		width: 12.4%;
	}
	button:nth-child(74) {
		width: 15%;
	}
	button:nth-child(77) {
		width: 45%;
	}
	.btn1 {
		width: 5.259%;
	}
	.btn2 {
		width: 7%;
	}
	.btn3 {
		width: 7%;
	}
	.btn4 {
		width: 7%;
	}
	.btn5 {
		width: 7.3%;
	}
	.btn6 {
		width: 8%;
		vertical-align: top;
	}
}
</style>
