<template>
        <div id="keys" v-show="panel">
          <div id="allKey" v-show="allKey">
            <div class="letter">
              <button
                :class="activeClass == index ? 'actived' : ''"
                v-for="(item, index) in allKeys"
                :key="index"
                @touchstart="whichKey(item, index)"
                @touchend="KeyEnd(item)"
              >
                <span v-if="item.key === '中/英'">
                  <span :style="{ color: colorA }">中</span>/
                  <span :style="{ color: colorB }">英</span>
                </span>
                <span v-else>{{ item.key }}</span>
              </button>
            </div>
            <div class="number">
              <button
                :class="activeClass == index + 100 ? 'actived' : ''"
                v-for="(item, index) in numKey"
                :key="index"
                @touchstart="whichKey(item, index + 100)"
                @touchend="KeyEnd(item)"
              >
                <span>{{ item.key }}</span>
              </button>
            </div>
          </div>
          <div id="sign" v-show="signKey">
            <button
              :class="activeClass == index + 200 ? 'actived' : ''"
              v-for="(item, index) in signKeys"
              :key="index"
              @touchstart="keySignDown(item, index + 200)"
              @touchend="keySpecailUp(item)"
            >
              <span v-if="item.key === '中/英'">
                <span :style="{ color: colorA }">中</span>/
                <span :style="{ color: colorB }">英</span>
              </span>
              <span v-else>{{ item.key }}</span>
            </button>
          </div>
          <div id="speCtrl" v-show="SpeKey">
            <button
              :class="activeClass == index + 300 ? 'actived' : ''"
              v-for="(item, index) in speCtrls"
              :key="index"
              @touchstart="whichKey(item, index + 300)"
              @touchend="KeyEnd(item)"
            >
              <span v-if="item.key === '中/英'">
                <span :style="{ color: colorA }">中</span>/
                <span :style="{ color: colorB }">英</span>
              </span>
              <span v-else>{{ item.key }}</span>
            </button>
          </div>
        </div>
</template>

<script>
export default {
  name: 'textKeyboard',
  props: [
    'panel',
    'allKey',
    'signKey',
    'SpeKey',
    'iscaps',
    'colorA',
    'colorB',
    'activeClass'
  ],
  data () {
    return {
      allKeys: [
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
        { key: "中/英", keyCode: 16 },
        { key: "a", keyCode: 65 },
        { key: "s", keyCode: 83 },
        { key: "d", keyCode: 68 },
        { key: "f", keyCode: 70 },
        { key: "g", keyCode: 71 },
        { key: "h", keyCode: 72 },
        { key: "j", keyCode: 74 },
        { key: "k", keyCode: 75 },
        { key: "l", keyCode: 76 },
        { key: "Back", keyCode: 8 },
        { key: "小写", keyCode: 20 },
        { key: "符", keyCode: 700 },
        { key: "z", keyCode: 90 },
        { key: "x", keyCode: 88 },
        { key: "c", keyCode: 67 },
        { key: "v", keyCode: 86 },
        { key: "b", keyCode: 66 },
        { key: "n", keyCode: 78 },
        { key: "m", keyCode: 77 },
        { key: "确定", keyCode: 13 },
        { key: "隐藏", keyCode: 800 },
        { key: "空格", keyCode: 32 },
        { key: "控制码", keyCode: 900 },
      ],

      CapsallKeys: [
        { key: "Tab", keyCode: 9 },
        { key: "Q", keyCode: 81 },
        { key: "W", keyCode: 87 },
        { key: "E", keyCode: 69 },
        { key: "R", keyCode: 82 },
        { key: "T", keyCode: 84 },
        { key: "Y", keyCode: 89 },
        { key: "U", keyCode: 85 },
        { key: "I", keyCode: 73 },
        { key: "O", keyCode: 79 },
        { key: "P", keyCode: 80 },
        { key: "中/英", keyCode: 16 },
        { key: "A", keyCode: 65 },
        { key: "S", keyCode: 83 },
        { key: "D", keyCode: 68 },
        { key: "F", keyCode: 70 },
        { key: "G", keyCode: 71 },
        { key: "H", keyCode: 72 },
        { key: "J", keyCode: 74 },
        { key: "K", keyCode: 75 },
        { key: "L", keyCode: 76 },
        { key: "Back", keyCode: 8 },
        { key: "大写", keyCode: 20 },
        { key: "符", keyCode: 700 },
        { key: "Z", keyCode: 90 },
        { key: "X", keyCode: 88 },
        { key: "C", keyCode: 67 },
        { key: "V", keyCode: 86 },
        { key: "B", keyCode: 66 },
        { key: "N", keyCode: 78 },
        { key: "M", keyCode: 77 },
        { key: "确定", keyCode: 13 },
        { key: "隐藏", keyCode: 800 },
        { key: "空格", keyCode: 32 },
        { key: "控制码", keyCode: 900 },
      ],

      numKey: [
        { key: "7", keyCode: 55 },
        { key: "8", keyCode: 56 },
        { key: "9", keyCode: 57 },
        { key: "4", keyCode: 52 },
        { key: "5", keyCode: 53 },
        { key: "6", keyCode: 54 },
        { key: "1", keyCode: 49 },
        { key: "2", keyCode: 50 },
        { key: "3", keyCode: 51 },
        { key: "0", keyCode: 48 },
        { key: "@", keyCode: 50, len: 2 },
        { key: ".", keyCode: 190 },
      ],

      signKeys: [
        { key: "`", keyCode: 192, len: 1 },
        { key: "~", keyCode: 192, len: 2 },
        { key: "!", keyCode: 49, len: 2 },
        // {key: '@', keyCode: 50, len: 2},
        { key: "#", keyCode: 51, len: 2 },
        { key: "?", keyCode: 191, len: 2 },
        { key: "%", keyCode: 53, len: 2 },
        { key: "^", keyCode: 54, len: 2 },
        { key: "中/英", keyCode: 16, len: 0 },
        { key: "&", keyCode: 55, len: 2 },
        { key: "*", keyCode: 56, len: 2 },
        { key: "(", keyCode: 57, len: 2 },
        { key: ")", keyCode: 48, len: 2 },
        { key: "-", keyCode: 189, len: 1 },
        { key: "=", keyCode: 187, len: 1 },
        { key: "_", keyCode: 189, len: 2 },
        { key: "+", keyCode: 187, len: 2 },
        { key: "[", keyCode: 219, len: 1 },
        { key: "]", keyCode: 221, len: 1 },
        { key: "{", keyCode: 219, len: 2 },
        { key: "}", keyCode: 221, len: 2 },
        { key: "\\", keyCode: 220, len: 1 },
        { key: "|", keyCode: 220, len: 2 },
        { key: ";", keyCode: 186, len: 1 },
        { key: ":", keyCode: 186, len: 2 },
        { key: "'", keyCode: 222, len: 1 },
        { key: '"', keyCode: 222, len: 2 },
        { key: ",", keyCode: 188, len: 1 },
        // {key: '.', keyCode: 190, len: 1},
        { key: "<", keyCode: 188, len: 2 },
        { key: ">", keyCode: 190, len: 2 },
        { key: "/", keyCode: 191, len: 1 },
        { key: "$", keyCode: 52, len: 2 },
        { key: "返回", keyCode: 1000, len: 0 },
      ],

      speCtrls: [
        { key: "左", keyCode: 37 },
        { key: "上", keyCode: 38 },
        { key: "下", keyCode: 40 },
        { key: "右", keyCode: 39 },
        { key: "ESC", keyCode: 27 },
        { key: "CTRL(L)", keyCode: 17 },
        { key: "CTRL(R)", keyCode: 17 },
        { key: "SHIFT(L)", keyCode: 16 },
        { key: "SHIFT(R)", keyCode: 16 },
        { key: "中/英", keyCode: 16 },
        { key: "ALT(L)", keyCode: 18 },
        { key: "ALT(R)", keyCode: 18 },
        { key: "TAB", keyCode: 9 },
        { key: "WIN", keyCode: 1001 },
        { key: "HOME", keyCode: 36 },
        { key: "END", keyCode: 35 },
        { key: "PRTSC", keyCode: 900000 },
        { key: "SCRLK", keyCode: 145 },
        { key: "PAUSE", keyCode: 19 },
        { key: "INS", keyCode: 45 },
        { key: "DEL", keyCode: 46 },
        { key: "PGUP", keyCode: 33 },
        { key: "PGDN", keyCode: 34 },
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
        { key: "返回", keyCode: 1000 },
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //键盘按下事件
    whichKey(which, index) {
      // which.key = which.keyRealName || which.keyName || which.key
      // this.activeClass = index
      this.$emit('whickKeyTextKeyboard', which, index)
      // if (['Control', 'CTRL(L)', 'Ctrl'].includes(which.key)) {
      //   console.log('按下Ctrl键')
      // } else if (['Shift', '中/英', 'SHIFT(L)', 'SHIFT(R)', 'Shift'].includes(which.key)) {
      //   this.inputStatus = !this.inputStatus
      //   console.log('按下Shift键')
      // } else if (['Alt', 'ALT(L)'].includes(which.key)) {
      //   console.log('按下Alt键')
      // } else if (['Meta', 'WIN', 'win'].includes(which.key)) {
      //   console.log('按下win键')
      // } else if (['大写', '小写'].includes(which.key)) {
      //   let newList = this.allKeys;
      //   this.allKeys = this.CapsallKeys;
      //   this.CapsallKeys = newList;
      //   console.log('按下大小写键')
      // } else if (['CTRL(R)'].includes(which.key)) {
      //   console.log('按下CTRL(R)键')
      // } else if (['SHIFT(R)'].includes(which.key)) {
      //   console.log('按下SHIFT(R)键')
      // } else if (['ALT(R)'].includes(which.key)) {
      //   console.log('按下ALT(R)键')
      // } else if (['隐藏'].includes(which.key)) {
      //   this.panel = false;
      //   this.allKey = false;
      //   this.signKey = false;
      //   this.SpeKey = false;
      // } else if (['@'].includes(which.key)) {
      //   this.keySignDown(which)
      // } else if (['符'].includes(which.key)) {
      //   this.panel = true;
      //   this.allKey = false;
      //   this.SpeKey = false;
      //   this.signKey = true;
      // } else if (which.key === "控制码") {
      //   this.panel = true;
      //   this.allKey = false;
      //   this.signKey = false;
      //   this.SpeKey = true;
      // } else if (which.key === "返回") {
      //   this.panel = true;
      //   this.allKey = true;
      //   this.SpeKey = false;
      //   this.signKey = false;
      // } else {
      //   console.log('按下其他按键')
      // }
    },
    // 键盘抬起事件
    KeyEnd(which) {
      this.$emit('KeyEndTextKeyboard', which)
      // which.key = which.keyRealName || which.keyName || which.key
      // this.activeClass = -1
      // if (['Control', 'CTRL(L)', 'Ctrl'].includes(which.key)) {
      //   console.log('抬起Ctrl键')
      // } else if (['Shift', '中/英', 'SHIFT(L)', 'SHIFT(R)', 'Shift'].includes(which.key)) {
      //   console.log('抬起Shift键')
      // } else if (['Alt', 'ALT(L)'].includes(which.key)) {
      //   console.log('抬起Alt键')
      // } else if (['Meta', 'WIN', 'win'].includes(which.key)) {
      //   console.log('抬起win键')
      // } else if (['@'].includes(which.key)) {
      //   this.keySpecailUp(which)
      // } else if (['大写', '小写', '隐藏', '符', '控制码', '返回'].includes(which.key)) {
      //   return
      // } else if (['CTRL(R)'].includes(which.key)) {
      //   console.log('抬起CTRL(R)键')
      // } else if (['SHIFT(R)'].includes(which.key)) {
      //   console.log('抬起SHIFT(R)键')
      // } else if (['ALT(R)'].includes(which.key)) {
      //   console.log('抬起ALT(R)键')
      // } else {
      //   console.log('抬起其他键')
      // }
    },
    // 特殊符号
    keySignDown(item, index) {
      // console.log('特殊符号', item, index)
      // this.activeClass = index
      this.$emit('keySignDownTextKeyboard', item, index + 200)
    },
    // 特殊按键的抬起
    keySpecailUp(item) {
      // console.log('特殊按键的抬起', item)
      // this.activeClass = -1
      this.$emit('keySpecailUp', item)
    }
  }
}
</script>

<style lang="less" scoped>
button {
	height: 66.7px;
	width: 66.7px;
	color: #00ffd8;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.7) !important;
	border: 1.7px solid #0e4a55;
	margin-left: auto;
	border-radius: 33.3px;
	opacity: 0.9;

	span {
		font-size: 16.7px;
	}
}
.actived {
	background-color: #a6e7dd;
	opacity: 0.5;
	color: #00ffd8;
}
#keys {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 300px;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 11; // 问题31

	button {
		height: 75px;
		border-radius: 0px;
		span {
			color: #fff;
			font-size: 21.7px;
		}
	}
	#allKey {
		.letter {
			width: 80%;
			position: absolute;
			left: 0px;
			button {
				width: 9%;
				padding: 0px;
				span {
					padding: 0px;
					font-size: 25px;
				}
			}
			button:first-child {
				width: 10%;
			}
			button:nth-child(12) {
					width: 10%;
			}
			button:nth-child(22) {
				background-image: url(../../assets/img/icon/退格.png);
				background-repeat: no-repeat;
				background-size: 50px 41.7px;
				background-position: center;
				span {
					opacity: 0;
				}
			}
			button:nth-child(23) {
				width: 10%;
			}
			button:nth-child(32) {
				width: 18%;
			}
			button:nth-child(33) {
				width: 19%;
			}
			button:nth-child(34) {
				width: 63%;
			}
			button:nth-child(35) {
				width: 18%;
				background-image: url(../../assets/img/sign.png);
				background-repeat: no-repeat;
				background-size: 83.3px 66px;
				background-position: center;

				span {
					opacity: 0;
				}
			}
		}
		.number {
			width: 20%;
			position: absolute;
			right: 0px;

			button {
				width: 33%;
			}
		}
	}

	#sign {
		button {
			width: 12.5%;
		}
	}

	#speCtrl {
		button {
			width: 11%;
		}
	}
}
</style>