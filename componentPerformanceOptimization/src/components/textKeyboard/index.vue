<template>
        <div id="keys" v-show="panel">
          <div id="allKey" v-show="allKey">
            <div class="letter">
              <button
                :class="activeClass == index ? 'actived' : ''"
                v-for="(item, index) in allKeys"
                :key="index"
                @touchstart.stop.prevent="whichKey(item, index)"
                @touchend.stop.prevent="KeyEnd(item)"
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
                @touchstart.stop.prevent="whichKey(item, index + 100)"
                @touchend.stop.prevent="KeyEnd(item)"
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
              @touchstart.stop.prevent="keySignDown(item, index + 200)"
              @touchend.stop.prevent="keySpecailUp(item)"
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
              @touchstart.stop.prevent="whichKey(item, index + 300)"
              @touchend.stop.prevent="KeyEnd(item)"
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
    'activeClass',
    'allKeys',
    'CapsallKeys',
    'numKey',
    'signKeys',
    'speCtrls'
  ],
  data () {
    return {
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