<template>
  <div v-show="showOfficialKeyboard" class="officialKeyboard">
    <div v-for="(item, index) in keyInfo" :key="index">
      <button
        @touchstart.stop.prevent="customizeDown($event, item, index)"
        @touchmove="customizeMove($event, item)"
        @touchend="customizeUp($event, item)"
        ref="btn"
        :class="[{'actived1': isBoo == index}, {'actived1': isLockBtn[index]}]"
        :style="{ width: item.keyWidth + 'px', height: item.keyHeight + 'px', borderRadius: item.keyWidth / 2 + 'px', left: item.keyMarginLeft + 'px', top: item.keyMarginTop + 'px', backgroundImage: 'url(' + item.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: (officialKeyboardFlag === 'YXKeys' && item.key === '右键' ? sizeA + 'px' + ' ' + sizeB + 'px' : sizeC + 'px' + ' ' + sizeD + 'px')}"
        v-if="item.keyStyle == '0'"
      >
        <div
          class="nameDisplay"
          :style="{width: '100%',fontSize: (screen.totalWidth >= 1024 ? screen.totalWidth / 736 * 10 + 5 : 10) + 'px'}"
        >{{ item.keyName }}</div>
      </button>
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
        <img width="80" :src="imgList[2]" id="son" />
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

    <div class="exitBtn" @click="exitKey">退出</div>
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
      sizeA: 30,
      sizeB: 50,
      sizeC: 25,
      sizeD: 34,
      rate:''
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
    ...mapGetters(["fullScreenShow", "officialKeyInfo"]),
    showOfficialKeyboard() {
      return this.officialKeyboardFlag ? true : false;
    },
  },
  watch: {
    officialKeyboardFlag() {
      this.directW=[]
      this.direction=[]
      if (this.officialKeyboardFlag) {
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
          return item;
        });
    }
  },
  methods: {
    exitKey() {
      this.$emit("exitOfficialKeyboard", "");
    },
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
.exitBtn {
  position: absolute;
  top: 16.7px;
  left: 45%;
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
</style>
