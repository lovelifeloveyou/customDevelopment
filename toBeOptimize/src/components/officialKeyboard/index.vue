<template>
  <div v-show="showOfficialKeyboard" class="officialKeyboard">
    <div v-for="(item, index) in keyInfo" :key="index">
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: item.keyWidth / 2 + 'px', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && !['LB', 'LT', 'RB', 'RT', 'SELECT', 'START'].includes(item.keyRealName.toLocaleUpperCase())"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
      <!-- 游戏手柄  LB、LT、RB、RT、SELECT、START按键特殊处理 -->
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: '2px ' + item.keyWidth / 2 + 'px ' + item.keyWidth / 2 + 'px ' +  '2px',transform: 'rotate(20deg)', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'LB'"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: item.keyWidth / 2 + 'px ' + '2px ' + '2px ' + item.keyWidth / 2 + 'px',transform: 'rotate(-20deg)', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'RB'"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: item.keyWidth / 2 + 'px ' + '2px ' + '2px ' + item.keyWidth / 2 + 'px',transform: 'rotate(20deg)', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'LT'"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: '2px ' + item.keyWidth / 2 + 'px ' + item.keyWidth / 2 + 'px ' +  '2px',transform: 'rotate(-20deg)', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'RT'"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth-10 + 'px', height: item.keyWidth-10 + 'px', borderRadius: (item.keyWidth-10) / 2 + 'px ',left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'SELECT'"
      >
        <img
          src="https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%2011.png"
          :width="item.keyWidth/4"
          style="position: absolute;left: 50%;top: 50%; transform: translate(-50%, -50%);"
        />
      </button>
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index, gamepadLeftHandle)"
        @touchmove="customizeMove($event, item, gamepadLeftHandle)"
        @touchend="customizeUp($event, item, index, gamepadLeftHandle)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth-10 + 'px', height: item.keyWidth-10 + 'px', borderRadius: (item.keyWidth-10) / 2 + 'px ',left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'START'"
      >
        <img
          src="https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%2012.png"
          :width="item.keyWidth/4"
          style="position: absolute;left: 50%;top: 50%; transform: translate(-50%, -50%);"
        />
      </button>
      <!-- 游戏手柄  LB、LT、RB、RT、SELECT、START按键特殊处理 -->
    </div>
    <div
      @touchstart.stop.prevent="touch($event)"
      @touchmove="touch($event)"
      @touchend="touchEnd($event)"
      class="wheel"
      :style="{ width: direction[0].keyWidth + 'px', height: direction[0].keyHeight + 'px', left: direction[0].keyMarginLeft + 'px', top: direction[0].keyMarginTop + 'px' }"
      ref="direction"
      v-if="direction.length && [101,102].includes(Number(direction[0].rockerType))"
    >
      <img :width="direction[0].keyWidth" id="imgBox" :src="imgCurrent" />
      <div
        id="directionBtn"
        ref="directionBtn"
        :style="{ width: direction[0].keyWidth + 'px', height: direction[0].keyHeight + 'px' }"
      >
        <img :width="80 / 230 * direction[0].keyWidth" :src="imgList[2]" id="son" />
      </div>
    </div>
    <div
      v-hammer:press="keypress"
      @touchstart.stop.prevent="touchDirection($event)"
      @touchmove="touchDirection($event)"
      @touchend="touchEndDirection($event)"
      id="wheel"
      class="wasd"
      :style="{ width: directW[0].keyWidth + 'px', height:directW[0].keyHeight + 'px', left:directW[0].keyMarginLeft + 'px', top: directW[0].keyMarginTop + 'px' }"
      ref="direction"
      v-if="directW.length && [103,104].includes(Number(directW[0].rockerType))"
    >
      <img id="wheelImage" :src="direction_imgCurrent" :width="directW[0].keyWidth" />
    </div>

    <!-- 游戏手柄摇杆特殊处理 -->
    <div
      :style="{ position: 'absolute',width: gamepadLeftHandle[0].keyWidth + 'px', height: gamepadLeftHandle[0].keyHeight + 'px', left: gamepadLeftHandle[0].keyMarginLeft + 'px', top: gamepadLeftHandle[0].keyMarginTop + 'px' }"
      v-if="gamepadLeftHandle.length && Number(gamepadLeftHandle[0].rockerType) == 105"
    >

      <div
        class="handleStyle"
        @touchstart.stop.prevent="crossRockerDown('up')"
        @touchmove="crossRockerMove('up')"
        @touchend="crossRockerEnd('up')"
        :style="topCrossRockerStyle"
      >
        <img :src="topCrossRockerImg" style="width: auto;height:auto;max-width: 100%;max-height: 100%;" />
      </div>
      <div
        class="handleStyle"
        @touchstart.stop.prevent="crossRockerDown('right')"
        @touchmove="crossRockerMove('right')"
        @touchend="crossRockerEnd('right')"
        :style="rightCrossRockerStyle"
      >
        <img :src="rightCrossRockerImg" style="width: auto;height:auto;max-width: 100%;max-height: 100%;" />
      </div>
      <div
        class="handleStyle"
        @touchstart.stop.prevent="crossRockerDown('down')"
        @touchmove="crossRockerMove('down')"
        @touchend="crossRockerEnd('down')"
        :style="bottomCrossRockerStyle"
      >
        <img :src="bottomCrossRockerImg" style="width: auto;height:auto;max-width: 100%;max-height: 100%;transform: rotate(180deg);" />
      </div>
      <div
        class="handleStyle"
        @touchstart.stop.prevent="crossRockerDown('left')"
        @touchmove="crossRockerMove('left')"
        @touchend="crossRockerEnd('left')"
        :style="leftCrossRockerStyle"
      >
        <img :src="leftCrossRockerImg" style="width: auto;height:auto;max-width: 100%;max-height: 100%;transform: rotate(180deg);" />
      </div>

      <div
        @touchstart.stop.prevent="touchGamepadLeft($event)"
        @touchmove="touchGamepadLeft($event)"
        @touchend="touchEndGamepadLeft($event)"
        class="wheel"
        :style="{ position: 'absolute',width: gamepadLeftHandle[0].realKeyWidth + 'px', height: gamepadLeftHandle[0].realKeyWidth + 'px', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }"
        ref="direction"
      >
        <img :width="gamepadLeftHandle[0].realKeyWidth" id="imgBox" :src="imgCurrentGamepadLeft" />
        <div
          id="directionBtn"
          ref="directionBtnGamepadLeft"
          :style="{ width: gamepadLeftHandle[0].realKeyWidth + 'px', height: gamepadLeftHandle[0].realKeyWidth + 'px' }"
        >
          <img :width="80 / 230 * (gamepadLeftHandle[0].realKeyWidth)" :src="imgList[3]" id="son" />
        </div>
      </div>
    </div>
    <div
      @touchstart.stop.prevent="touchGamepadRight($event)"
      @touchmove="touchGamepadRight($event)"
      @touchend="touchEndGamepadRight($event)"
      class="wheel"
      :style="{ width: gamepadRightHandle[0].keyWidth + 'px', height: gamepadRightHandle[0].keyHeight + 'px', left: gamepadRightHandle[0].keyMarginLeft + 'px', top: gamepadRightHandle[0].keyMarginTop + 'px' }"
      ref="direction"
      v-if="gamepadRightHandle.length && Number(gamepadRightHandle[0].rockerType) == 106"
    >
      <img :width="gamepadRightHandle[0].keyWidth" id="imgBox" :src="imgCurrentGamepadRight" />
      <div
        id="directionBtn"
        ref="directionBtnGamepadRight"
        :style="{ width: gamepadRightHandle[0].keyWidth + 'px', height: gamepadRightHandle[0].keyHeight + 'px' }"
      >
        <img :width="80 / 230 * gamepadRightHandle[0].keyWidth" :src="imgList[4]" id="son" />
      </div>
    </div>
    <!-- 游戏手柄摇杆特殊处理 -->

    <div class="handle_btn_wrap">
      <div v-show="isShowBtn" class="show_wrap">
        <div class="exitBtn" style="margin-right:10px;" @click="changeKeyboard">切换</div>
        <div class="exitBtn" @click="exitKey">隐藏</div>
      </div>
      <div v-show="!isShowBtn" class="hide_btn" @click="showBtn">
        <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/hide_bg.png" alt="" @click="showBtn">
        <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/hide_row.png" alt="" id="pic">
      </div>
    </div>
    <!--    官方键盘教导-->
    <div class="guide" v-if="firstLoad">
      <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/guide1.jpg" class="guide_img" alt="" v-show="i === 1">
      <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/guide2.jpg" class="guide_img" alt="" v-show="i === 2">
      <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/guide3.jpg" class="guide_img" alt="" v-show="i === 3" @click="next">
      <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/next.png" class="next" alt="" @click="next" v-show="i < 3">
    </div>
  </div>
</template>

<script>
import rollerMixin from "@/mixins/roller";
import directionMixin from "@/mixins/direction";
import customizeKeyboardClickMixin from "@/mixins/customizeKeyboardClick";
import tools from "@/utils/tools";
import { mapGetters, mapMutations, mapActions } from "vuex";


export default {
  mixins: [customizeKeyboardClickMixin, rollerMixin, directionMixin],
  data() {
    return {
      keyInfo: [],
      direction: [],
      directW:[],
      gamepadLeftHandle: [],
      gamepadRightHandle: [],
      sizeA: 30,
      sizeB: 50,
      sizeC: 25,
      sizeD: 34,
      rate:'',
      isShowBtn: true,
      timer: null,
      rehandleFirstLoad: this.firstLoad,
      i: 1,
    };
  },
  props: {
    officialKeyboardFlag: {
      type: String,
      default: "",
    },
    screen: {
      type: Object,
      default: {},
    },
    firstLoad: {
      type: Boolean,
      default: false,
    },
    isHorizontalScreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["fullScreenShow", "officialKeyInfo"]),
    showOfficialKeyboard() {
      return this.officialKeyboardFlag ? true : false;
    },
  },
  watch: {
    officialKeyboardFlag() {
      this.directW=[]
      this.direction=[]
      this.gamepadLeftHandle = []
      this.gamepadRightHandle = []
      this.setGamepadInfo({flag: false})
      this.isShowBtn = true
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.rehandleFirstLoad = false
        this.isShowBtn = false
      }, this.rehandleFirstLoad ? 10000 : 3000)
      if (this.officialKeyboardFlag) {
          let official=tools.deepClone(this.officialKeyInfo)
          this.keyInfo = official.map((item) => {
          if (Number(item.rockerType) == 105 && item.keyStyle == '1') {
            item.realKeyWidth = (item.keyWidth-200) / (1080 / this.screen.videosHeight)
          }
          item.keyWidth = item.keyWidth / (1080 / this.screen.videosHeight);
          item.keyHeight = item.keyHeight / (1080 / this.screen.videosHeight);
          item.keyMarginLeft = item.keyMarginLeft / (1920 / this.screen.videosWidth);
          item.keyMarginTop = item.keyMarginTop / (1080 / this.screen.videosHeight);
          if ([101,102].includes(Number(item.rockerType)) && item.keyStyle == '1') {
            this.direction.shift();
            this.direction.push(item);
          }
          if ([103,104].includes(Number(item.rockerType)) && item.keyStyle == '1') {
            this.directW.shift();
            this.directW.push(item);
          }
          if (Number(item.rockerType) == 105 && item.keyStyle == '1') {
            this.gamepadLeftHandle.shift()
            this.gamepadLeftHandle.push(item)
            this.setGamepadInfo({flag: true})
            this.leftCrossRockerStyle = {position: 'absolute',width: 50 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',height: 101 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',left: 0,top: '50%',transform: 'translateY(-50%)'}
            this.topCrossRockerStyle = {position: 'absolute',width: 101 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',height: 50 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',left: '50%', top: 0,transform: 'translateX(-50%)'}
            this.rightCrossRockerStyle = {position: 'absolute',width: 50 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',height: 101 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',right: 0,top: '50%',transform: 'translateY(-50%)'}
            this.bottomCrossRockerStyle = {position: 'absolute',width: 101 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px', height: 50 / this.gamepadLeftHandle[0].keyWidth * this.gamepadLeftHandle[0].realKeyWidth + 'px',left: '50%', bottom: 0,transform: 'translateX(-50%)'}
            this.leftCrossRockerImg = this.imgList[6]
            this.topCrossRockerImg = this.imgList[5]
            this.rightCrossRockerImg = this.imgList[6]
            this.bottomCrossRockerImg = this.imgList[5]
          }
          if (Number(item.rockerType) == 106 && item.keyStyle == '1') {
            this.setGamepadInfo({flag: true})
            this.gamepadRightHandle.shift()
            this.gamepadRightHandle.push(item)
          }
          return item;
        });
        // console.log('键盘数据',this.directW,this.direction)
      } else {
        this.keyInfo = [];
      }
    },
    fullScreenShow(){
        if (this.fullScreenShow) {
            this.rate = 1920 / this.screen.totalWidth;
          } else {
            this.rate = 1920 / this.screen.videosWidth;
          }
          let official=tools.deepClone(this.officialKeyInfo)
          this.keyInfo = official.map((item) => {
          item.keyWidth = item.keyWidth / (1080 / this.screen.videosHeight);
          item.keyHeight = item.keyHeight / (1080 / this.screen.videosHeight);
          item.keyMarginLeft = item.keyMarginLeft / (1920 / this.screen.videosWidth);
          item.keyMarginTop = item.keyMarginTop / (1080 / this.screen.videosHeight);
          if ([101,102].includes(Number(item.rockerType)) && item.keyStyle == '1') {
            this.direction.shift();
            this.direction.push(item);
          }
          if ([103,104].includes(Number(item.rockerType)) && item.keyStyle == '1') {
            this.directW.shift();
            this.directW.push(item);
          }
          if (Number(item.rockerType) == 105 && item.keyStyle == '1') {
            this.gamepadLeftHandle.shift()
            this.gamepadLeftHandle.push(item)
            this.setGamepadInfo({flag: true})
          }
          if (Number(item.rockerType) == 106 && item.keyStyle == '1') {
            this.gamepadRightHandle.shift()
            this.gamepadRightHandle.push(item)
            this.setGamepadInfo({flag: true})
          }
          return item;
        });
    }
  },
  methods: {
    exitKey() {
      this.$emit("exitOfficialKeyboard", "");
    },
    changeKeyboard(){
      this.$emit("goKeyboardList", "");
    },
    showBtn(){
      this.isShowBtn = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShowBtn = false
      }, 3000)
    },
    next(){
      this.i++
    }
  },
  mounted() {
    // console.log("1111", this.keyInfo);
    // let screenInfo = tools.getScreenInfo();
    // const {
    //   allWidth,
    //   allHeight,
    //   totalWidth,
    //   totalHeight,
    //   left,
    //   top,
    // } = screenInfo;
    // if (totalWidth !== 736 && totalHeight !== 414) {
    //   for (let [key, value] of Object.entries(this.officialKeyboardLists)) {
    //     for (let [k, v] of Object.entries(value)) {
    //       for (let [k1, v1] of Object.entries(v)) {
    //         for (let i in v1) {
    //           if (["width", "height", "left"].includes(i)) {
    //             v1[i] = (v1[i] / 736) * totalWidth;
    //           }
    //           if (i == "top") {
    //             v1[i] = (v1[i] / 414) * totalHeight;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   this.sizeA = (30 / 736) * totalWidth;
    //   this.sizeB = (50 / 414) * totalHeight;
    //   this.sizeC = (25 / 736) * totalWidth;
    //   this.sizeD = (34 / 414) * totalHeight;
    // }
  },
};
</script>

<style lang="less" scoped>
.officialKeyboard {
  width: 100%;
  height: 100%;
}
.handleStyle {
  z-index: 100 !important;
}
button {
  position: absolute;
  color: #00ffd8;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7) !important;
  border: 1.7px solid #0e4a55;
  opacity: 0.9;
  z-index: 100;
  .nameDisplay {
    font-size: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    white-space: pre-line;
    transform: translate(-50%, -50%);
  }
}
.wheel {
  position: absolute;
  z-index: 1000;
}
#imgBox {
  position: absolute;
  z-index: 1;
  left: 0;
}
#directionBtn {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
}
img {
  vertical-align: middle;
}
.wasd {
  position: absolute;
  z-index: 1000;
}
.actived {
  color: black !important;
  background-color: #00fdc6 !important;
}
.actived1 {
  background-color: #a6e7dd !important;
  opacity: 0.5;
  color: #00ffd8 !important;
}
.handle_btn_wrap{
  position: absolute;
  top: 16.7px;
  left: 50%;
  transform:translateX(-50%);
  z-index:999;
  .show_wrap{
    display:flex;
    flex-direction: row;
  }
  .exitBtn {
    width: 83.3px;
    height: 50px;
    line-height: 50px;
    border-radius: 8.3px;
    color: #00ffd8;
    background-color: #161f19;
    border: 1.7px solid #0e4a55;
    z-index: 1000;
    font-size: 26.7px;
  }
  .exitBtn:nth-child(1){
    border-radius:25px 0 0 25px;
  }
  .exitBtn:nth-child(2){
    border-radius:0 25px 25px 0;
  }
  .hide_btn{
    margin-top:-16.7px;
    padding:0 30px 30px 30px;
    position:relative;
    img:nth-child(1){
      width: 160px;
      /*height: 40px;*/
    }
    img:nth-child(2){
      width:70px;
      position:absolute;
      top:24px;
      left:50%;
      transform:translateX(-50%);
      -webkit-transform-origin: center center;
      -webkit-animation-name: loading;
      -webkit-animation-duration: 1.2s;
      -webkit-animation-timing-function: linear;
      -webkit-animation-iteration-count: infinite;
      -moz-transform-origin: center center;
      -moz-animation-name: loading;
      -moz-animation-duration: 1.2s;
      -moz-animation-timing-function: linear;
      -moz-animation-iteration-count: infinite;
    }
    @-webkit-keyframes loading{
      0%{
        top:15px;
      }
      50%{
        top:20px;
      }
      100%{
        top:24px;
      }
    }
    @-moz-keyframes loading{
      0%{
        top:15px;
      }
      50%{
        top:20px;
      }
      100%{
        top:24px;
      }
    }
  }
}
.guide{
  width:100%;
  position:absolute;
  left:50%;
  top:0;
  transform: translateX(-50%);
  z-index:999;
  .guide_img{
    width:100%;
  }
  .next{
    width:310px;
    position:absolute;
    left:50%;
    bottom:60px;
    transform:translate(-50%, -50%);
  }
}

</style>
