<template>
  <div v-show="showOfficialKeyboard" class="officialKeyboard">
    <div  
    v-for="(item, index) in keyInfo"
    :key="index">
      <button
        @touchstart="customizeDown(item, index)"
        @touchend="customizeUp(item)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{width: handlePX(item.keyWidth),height: handlePX(item.keyHeight), borderRadius: handlePX(item.keyWidth/2), left: handlePX(item.keyMarginLeft), top: handlePX(item.keyMarginTop), backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (item.keyName === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.rockerType == '-1'"
      >
        <div
          class="nameDisplay"
          v-if="item.keyName"
          :style="{'width': '100%', 'font-size': '10px', 'margin-top': item.keyTop ? '-7px' : ''}"
        >{{ item.keyName }}</div>
      </button>
      <div
        @touchstart="touch($event)"
        @touchmove="touch($event)"
        @touchend="touchEnd($event)"
        class="wheel"
        :style="{ width: handlePX(item.keyWidth), height: handlePX(item.keyHeight), left: handlePX(item.keyMarginLeft), top: handlePX(item.keyMarginTop) }"
        ref="direction"
        v-if="[101,102].includes(Number(item.rockerType))"
      >
        <img :width="handlePX(item.keyWidth)" id="imgBox" :src="imgCurrent" />
        <div
          id="directionBtn"
          ref="directionBtn"
          :style="{ width: handlePX(item.keyWidth), height: handlePX(item.keyHeight),top:0,left:0}"
        >
          <img width="80" :src="imgList[2]" id="son" />
        </div>
      </div>
      <div
        v-hammer:press="keypress"
        @touchstart="touchDirection($event)"
        @touchmove="touchDirection($event)"
        @touchend="touchEndDirection($event)"
        id="wheel"
        class="wasd"
        :style="{width: handlePX(item.keyWidth), height: handlePX(item.keyHeight), left: handlePX(item.keyMarginLeft), top: handlePX(item.keyMarginTop)}"
        ref="direction"
        v-if="item.rockerType == 103"
      >
        <img id="wheelImage" :src="direction_imgCurrent" :width="handlePX(item.keyWidth)" />
      </div>
    </div>
    <div class="exitBtn" @click="exitKey">退出</div>
  </div>
</template>

<script>
import rollerMixin from "@/mixins/roller";
import directionMixin from "@/mixins/direction";
import keyboard from "../silder/keyboard/keyboard";
import customizeKeyboardClickMixin from "@/mixins/customizeKeyboardClick";
import tools from "@/utils/tools";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  mixins: [customizeKeyboardClickMixin, rollerMixin, directionMixin],
  data() {
    return {
      sizeA: 30,
      sizeB: 50,
      sizeC: 25,
      sizeD: 34,
      reproduceKeyboardLists: {},
      keyInfo: [],
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
  },
  computed: {
    ...mapGetters(["fullScreenShow",'officialKeyInfo']),
    showOfficialKeyboard() {
      return this.officialKeyboardFlag ? true : false;
    },
  },
  watch: {
    fullScreenShow() {
      // this.sizeAdaptive();
      if (this.officialKeyboardFlag) {
        this.getKeyboardInfo();
      } else {
      }
    },
    officialKeyboardFlag() {
        //   let data = Object.keys(this.officialKeyboardLists).find(item => item == this.officialKeyboardFlag)
        //   this.result = this.officialKeyboardLists[data]
        console.log("jianpan ID", this.officialKeyboardFlag);
        if(this.officialKeyboardFlag){
        this.keyInfo=this.officialKeyInfo;
        }
    },
  },
  methods: {
    handlePX(px) {
    // console.log('屏幕信息',this.screen)
        let rate =1920/this.screen.totalWidth
        if(this.fullScreenShow){
          rate =1920/this.screen.totalWidth
        }else{
          rate =1920/this.screen.videosWidth
        }
        return px/rate  + 'px'
    },
    exitKey() {
      this.$emit("exitOfficialKeyboard");
    },
    sizeAdaptive() {
      let screenInfo = tools.getScreenInfo();
      const {
        allWidth,
        allHeight,
        totalWidth,
        totalHeight,
        left,
        top,
      } = screenInfo;
      if (totalWidth !== 736 && totalHeight !== 414) {
        for (let [key, value] of Object.entries(this.officialKeyboardLists)) {
          for (let [k, v] of Object.entries(value)) {
            for (let [k1, v1] of Object.entries(v)) {
              for (let i in v1) {
                if (["width", "height", "left"].includes(i)) {
                  v1[i] = (v1[i] / 736) * totalWidth;
                }
                if (i == "top") {
                  v1[i] = (v1[i] / 414) * totalHeight;
                }
              }
            }
          }
        }
        this.sizeA = (30 / 736) * totalWidth;
        this.sizeB = (50 / 414) * totalHeight;
        this.sizeC = (25 / 736) * totalWidth;
        this.sizeD = (34 / 414) * totalHeight;
      }
    },
  },
  mounted() {
    this.reproduceKeyboardLists = tools.deepClone(this.officialKeyboardLists);
    // this.sizeAdaptive();
  },
};
</script>

<style lang="less" scoped>
.officialKeyboard {
  width: 100%;
  height: 100%;
}
button {
  position: absolute;
  color: #00ffd8;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid #0e4a55;
  opacity: 0.9;
  .nameDisplay {
    font-size: 10px; 
    position: absolute;
    left: 50%;
    top: 50%;
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
.exitBtn {
  position: absolute;
  top: 10px; 
  left: 45%;
  width: 50px; 
  height: 30px; 
  line-height: 30px; 
  border-radius: 5px; 
  color: #00ffd8;
  background-color: #161f19;
  border: 1px solid #0e4a55;
  z-index: 1000;
}
</style>
