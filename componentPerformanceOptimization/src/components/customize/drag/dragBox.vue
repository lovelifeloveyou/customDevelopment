<template>
  <div
    v-show="showItem"
    :id="'dragBox' + keymsg.id"
    class="dragBox"
    ref="dragBox"
    :style="[dragBoxStyle, showItemStyle, virtualStyle]"
  >
    <div v-if="canUseStep">
      <div
        @touchstart="customizeDown(keymsg, title)"
        @touchend="customizeUp(keymsg)"
        :class="['btn', {'actived1': isBoo == title}, {'actived1': isLockBtn[title]}]"
        id="btn"
        :style="[dynamicBtnStyle, changeSizeStyle]"
        ref="btn"
        v-if="keymsg.keyStyle == 0"
      >{{ keymsg.keyName }}</div>
      <div
        @touchstart.stop.prevent="touch($event)"
        @touchmove="touch($event)"
        @touchend="touchEnd($event)"
        class="wheel roll"
        :style="[directionStyle, changeDirectionSizeStyle]"
        ref="direction"
        v-if="[101,102].includes(Number(keymsg.rockerType))"
      >
        <img :width="keymsg.keyWidth" id="imgBox" :src="imgCurrent" />
        <div id="directionBtn" ref="directionBtn" :style="moveDirectionStyle">
          <img width="80" :src="imgList[2]" id="son" />
        </div>
      </div>
      <!-- wasd方向键 -->
      <div
        @touchstart.stop.prevent="touchDirection($event)"
        @touchmove="touchDirection($event)"
        @touchend="touchEndDirection($event)"
        id="wheel"
        class="wasd"
        :style="[directionStyle, changeDirectionSizeStyle]"
        ref="direction"
        v-if="[103,104].includes(Number(keymsg.rockerType))"
      >
        <img id="wheelImage" :src="direction_imgCurrent" :width="keymsg.keyWidth" />
      </div>
    </div>
    <div v-else>
      <div
        @mousedown="clickFn"
        @touchstart="clickFn"
        @mousemove="moveFn"
        @touchmove="moveFn"
        @mouseup="upFn"
        @touchend="upFn"
        @click="handleClick"
        class="btn"
        id="btn"
        :style="[dynamicBtnStyle, changeSizeStyle]"
        ref="btn"
        v-if="keymsg.keyStyle == 0"
      >{{ keymsg.keyName }}</div>
      <div
        @mousedown="clickDirectionFn"
        @touchstart="clickDirectionFn"
        @mousemove="moveDirectionFn"
        @touchmove="moveDirectionFn"
        @mouseup="upDirectionFn"
        @touchend="upDirectionFn"
        @click="handleClick"
        class="wheel"
        :style="[directionStyle, changeDirectionSizeStyle]"
        ref="direction"
        v-if="[101,102].includes(Number(keymsg.rockerType))"
      >
        <img :width="keymsg.keyWidth" id="imgBox" :src="roller_img[0]" />
        <div id="directionBtn" :style="moveDirectionStyle">
          <img width="80" :src="roller_img[1]" id="son" />
        </div>
      </div>
      <div
        @mousedown="clickDirectionFn"
        @touchstart="clickDirectionFn"
        @mousemove="moveDirectionFn"
        @touchmove="moveDirectionFn"
        @mouseup="upDirectionFn"
        @touchend="upDirectionFn"
        @click="handleClick"
        class="wasd"
        :style="[directionStyle, changeDirectionSizeStyle]"
        ref="direction"
        v-if="[103, 104].includes(Number(keymsg.rockerType))"
      >
        <img :src="direction_imgCurrent" :width="keymsg.keyWidth" />
      </div>
    </div>
    <!-- dialog -->
    <van-dialog v-model="show_dialog">
      <div class="drag_content">
        <div class="btnStyle">
          <div class="btnExample"><span class="btnDisplayName" :style="{'top': keymsg.keyName === '拖动上下左右' ? '30px' : '35px'}">{{keymsg.keyStyle == 0 ? '滚轮键盘' : keymsg.keyName}}</span></div>
        </div>
        <div class="btnFunc">
          <div class="changeSize">
            <p class="changeSize_text">按键大小</p>
            <div class="regulate">
              <span @click="decreaseSize">
                <img
                  style="width: 30px; transform: rotate(-90deg);"
                  src="@/assets/img/mouseComp/鼠标选项_滚轮上.png"
                />
              </span>
              <span>{{keyInfo.keySize}}</span>
              <span @click="increaseSize">
                <img
                  style="width: 30px; transform: rotate(-90deg);"
                  src="@/assets/img/mouseComp/鼠标选项_滚轮下.png"
                />
              </span>
            </div>
          </div>
          <div class="keyFashion">
            <p class="keyFashion_text">按键方式</p>
            <div class="twoBtn">
              <span @click="changeClick(1)" :class="{'actived': this.keyInfo.keyPressMode == 1}">即时</span>
              <span @click="changeClick(2)" :class="{'actived': this.keyInfo.keyPressMode == 2}">锁定</span>
            </div>
          </div>
        </div>
        <img class="exitImg" @click="closeDialog" :src="exitImg" height="30" width="30" />
        <div class="funcBtn">
          <div @click="removebtn" class="removeBtn">移除按键</div>
          <div @click="confirm" class="confirm">确定</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import customizeKeyboardClickMixin from "@/mixins/customizeKeyboardClick";
import rollerMixin from "@/mixins/roller";
import directionMixin from "@/mixins/direction";
import { mapGetters, mapMutations } from "vuex";
export default {
  mixins: [customizeKeyboardClickMixin, rollerMixin, directionMixin],
  data() {
    return {
      flag: false, // 按顺序dowm->move来
      position: {
        x: 0,
        y: 0,
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      keyInfo: {
        keyHeight: "",
        keyLeft: "",
        keyName: "",
        keyPressMode: 1, // 1, 即时 2, 锁定
        keyStyle: "",
        keyTop: "",
        keyBottom: "",
        keyWidth: "",
        rockerType: "",
        keySize: "",
        isDelete: false,
      },
      show_dialog: false,
      exitImg: require("../../../assets/img/roller/保存设置_关闭.png"),
      // 是否删除状态
      isDelete: false,
      dynamicBtnStyle: {},
      dragBoxStyle: {},
      dragFlag: false,
      hasMove: false,
      roller_img: [
        require("../../../assets/img/roller/摇杆底_非焦点.png"),
        require("../../../assets/img/roller/摇杆_方向.png"),
        require("../../../assets/img/roller/八方向_焦点字母空.png"),
        require('../../../assets/img/roller/middle.png')
      ],
      directionStyle: {},
      changeSizeStyle: {},
      changeDirectionSizeStyle: {},
      moveDirectionStyle: {},
      showItemStyle: {},
      saveConfirmFlag: false,
      rememberKeyboardSaveSize: {},
      showItem: true,
      saveRadio: "",
      virtualStyle: {},
      adaptModel: {
        btnWidth: 50,
        btnLeft: 200,
        btnTop: 150,
        directionWidth: 130,
        directionLeft: 25,
        directionTop: 200
      }
    };
  },
  props: {
    keymsg: Object,
    screen: Object,
    isHorizontalScreen: Boolean,
    title: Number,
    secondMenu: Boolean
  },
  computed: {
    ...mapGetters([
      "currentTutorial",
      "navBarShow",
      "editKeyboard",
      "clickEditKeyboard",
      "justSave",
      "rememberHasSaveKeyboard",
      "createClick",
      "addNewCustomizeBtn",
    ]),
    canUseStep() {
      return (
        ((this.editKeyboard && !this.clickEditKeyboard) || this.justSave) &&
        !this.createClick
      );
    },
  },
  watch: {
    keymsg: {
      handler: function () {
        if (this.keymsg.virtual) {
          this.virtualStyle = { visibility: "hidden" };
        }
      },
      deep: true,
      immediate: true,
    },
    justSave() {
      if (this.justSave) {
        this.showItem = true;
      }
    },
    currentTutorial: function () {
      this.showItemStyle = this.currentTutorial
        ? { visibility: "hidden" }
        : { visibility: "visible" };
    },
  },
  created() {
    if (this.screen.videosWidth !== 736 && this.screen.videosHeight !== 414) {
      this.adaptModel.btnWidth = 50 / 736 * this.screen.videosWidth
      this.adaptModel.btnLeft = 200 / 736 * this.screen.videosWidth
      this.adaptModel.btnTop = 150 / 414 * this.screen.videosHeight
      this.adaptModel.directionWidth = 130 / 736 * this.screen.videosWidth
      this.adaptModel.directionLeft = 25 / 736 * this.screen.videosWidth
      this.adaptModel.directionTop = 200 / 414 * this.screen.videosHeight
    }
    this.keyInfo = this.keymsg
  },
  mounted() {
    console.log('键盘数据',this.keymsg)
    if (this.keymsg.rockerType == 103) {
      this.direction_imgCurrent = require("../../../assets/img/direction/middle.png");
    } else if (this.keymsg.rockerType == 104) {
      this.direction_imgCurrent = this.direction_keyImg
    }
    if (this.editKeyboard || this.justSave) {
      this.saveRadio = this.keyInfo.keyPressMode;
      if ([101,104,102, 103].includes(this.keymsg.rockerType)) {
        this.keyInfo.keySize =
          Math.floor((this.keyInfo.keyWidth - this.adaptModel.directionWidth) / 10) + 5;
      } else {
        this.keyInfo.keySize =
          Math.floor((this.keyInfo.keyWidth - this.adaptModel.btnWidth) / 10) + 5;
      }
    }
    this.init(this.keyInfo);
    this.getAdaptive();
  },
  methods: {
    ...mapMutations(["setMoveItem", "setAddNewCustomizeBtn"]),
    decreaseSize() {
      this.keyInfo.keySize--;
      if (this.keyInfo.keyStyle != 0) {
        if (this.keyInfo.keySize < 1) {
          this.keyInfo.keySize = 1;
          return;
        }
        this.keyInfo.keyHeight = this.keyInfo.keyWidth -= 10;
        if (this.keyInfo.type === "move") {
          this.moveDirectionStyle = {
            width: this.keyInfo.keyWidth + "px",
            height: this.keyInfo.keyWidth + "px",
          };
        }
        this.changeDirectionSizeStyle = {
          width: this.keyInfo.keyWidth + "px",
          height: this.keyInfo.keyWidth + "px",
        };
      } else {
        if (this.keyInfo.keySize < 3) {
          this.keyInfo.keySize = 3;
          return;
        }
        this.keyInfo.keyHeight = this.keyInfo.keyWidth -= 10;
        this.changeSizeStyle = {
          height: this.keyInfo.keyWidth + "px",
          width: this.keyInfo.keyWidth + "px",
          "border-radius": this.keyInfo.keyWidth / 2 + "px",
          "line-height": this.keyInfo.keyWidth + "px"
        };
      }
    },
    increaseSize() {
      this.keyInfo.keySize++;
      if (this.keyInfo.keySize > 10) {
        this.keyInfo.keySize = 10;
        return;
      }
      if (this.keyInfo.keyStyle != 0) {
        this.keyInfo.keyHeight = this.keyInfo.keyWidth += 10;
        if (this.keyInfo.type === "move") {
          this.moveDirectionStyle = {
            width: this.keyInfo.keyWidth + "px",
            height: this.keyInfo.keyWidth + "px",
          };
        }
        this.changeDirectionSizeStyle = {
          width: this.keyInfo.keyWidth + "px",
          height: this.keyInfo.keyWidth + "px",
        };
      } else {
        this.keyInfo.keyHeight = this.keyInfo.keyWidth += 10;
        this.changeSizeStyle = {
          height: this.keyInfo.keyWidth + "px",
          width: this.keyInfo.keyWidth + "px",
          "border-radius": this.keyInfo.keyWidth / 2 + "px",
          "line-height": this.keyInfo.keyWidth + "px"
        };
      }
    },
    init(data) {
      if (data.keyStyle == 0) {
        //初始化位置
        this.$refs.btn.style.left = data.keyLeft + "px";
        this.$refs.btn.style.top = data.keyTop + "px";
      } else {
        //方向键初始化位置
        this.$refs.direction.style.left = data.keyLeft + "px";
        this.$refs.direction.style.top = data.keyTop + "px";
      }
    },
    clickFn() {
      this.flag = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = this.$refs.btn.offsetLeft;
      this.dy = this.$refs.btn.offsetTop;
    },
    moveFn() {
      console.log("移动出发");
      if ((this.editKeyboard && !this.clickEditKeyboard) || this.justSave)
        return;
      if (this.flag) {
        this.dragFlag = true;
        this.hasMove = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        if (this.isHorizontalScreen) {
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;
        } else {
          this.xPum = this.dx - this.ny;
          this.yPum = this.dy + this.nx;
        }
        let width = window.innerWidth - this.$refs.btn.offsetWidth; //屏幕宽度减去自身控件宽度
        let height = window.innerHeight - this.$refs.btn.offsetHeight; //屏幕高度减去自身控件高度
        if (this.xPum < 0) {
          this.xPum = 0;
          this.$refs.btn.style.left = this.xPum + "px";
          this.keyInfo.keyLeft = this.xPum;
        }
        if (this.yPum < 0) {
          this.yPum = 0;
          this.$refs.btn.style.top = this.yPum + "px";
          this.keyInfo.keyTop = this.yPum;
        }
        if (this.isHorizontalScreen) {
          if (this.xPum > width - (this.screen.left || 0) * 2) {
            this.xPum = width - (this.screen.left || 0) * 2;
            this.$refs.btn.style.left = this.xPum + "px";
            this.keyInfo.keyLeft = this.xPum;
          }
          if (this.yPum > height - (this.screen.top || 0) * 2) {
            this.yPum = height - (this.screen.top || 0) * 2;
            this.$refs.btn.style.top = this.yPum + "px";
            this.keyInfo.keyTop = this.yPum;
          }
        } else {
          if (
            this.xPum >
            this.screen.totalWidth -
              (this.screen.left * 2 || 0) -
              this.$refs.btn.offsetWidth
          ) {
            this.xPum =
              this.screen.totalWidth -
              (this.screen.left * 2 || 0) -
              this.$refs.btn.offsetWidth;
            this.$refs.btn.style.left = this.xPum + "px";
            this.keyInfo.keyLeft = this.xPum;
          }
          if (
            this.yPum >
            this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.btn.offsetHeight
          ) {
            this.yPum =
              this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.btn.offsetHeight;
            this.$refs.btn.style.top = this.yPum + "px";
            this.keyInfo.keyTop = this.yPum;
          }
        }

        this.$refs.btn.style.left = this.xPum + "px";
        this.$refs.btn.style.top = this.yPum + "px";
        this.keyInfo.keyLeft = this.xPum;
        this.keyInfo.keyTop = this.yPum;
        if (this.isHorizontalScreen) {
          this.keyInfo.keyBottom = "";
          this.keyInfo.keyLeft = this.xPum;
          this.keyInfo.keyTop = this.yPum;
        } else {
          this.keyInfo.keyLeft = this.xPum;
          this.keyInfo.keyTop = this.yPum;
          this.keyInfo.keyBottom =
            this.screen.totalWidth -
            this.keyInfo.keyTop -
            this.keyInfo.keySize * 10;
        }
        this.isDelete = true;
        if (this.isDelete) {
          this.isDelete = false;
        }
        // 移动时关闭键盘和nav栏
        this.$emit("moveClose", "close");
        this.$emit("updateElement", this.keyInfo, "edit");
        this.setMoveItem(true);
      }
    },
    //鼠标释放
    upFn() {
      // console.log(this.screen)
      console.log("位置", this.keyInfo);
      this.flag = false;
    },
    clickDirectionFn(e) {
      e.preventDefault();
      this.flag = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = this.$refs.direction.offsetLeft;
      this.dy = this.$refs.direction.offsetTop;
    },
    moveDirectionFn(e) {
      if (this.flag) {
        this.dragFlag = true;
        this.hasMove = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        if (this.isHorizontalScreen) {
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;
        } else {
          this.xPum = this.dx - this.ny;
          this.yPum = this.dy + this.nx;
        }
        let width = window.innerWidth - this.$refs.direction.offsetWidth; //屏幕宽度减去自身控件宽度
        let height = window.innerHeight - this.$refs.direction.offsetHeight; //屏幕高度减去自身控件高度
        if (this.xPum < 0) {
          this.xPum = 0;
          this.$refs.direction.style.left = this.xPum + "px";
          this.keyInfo.keyLeft = this.xPum;
        }
        if (this.yPum < 0) {
          this.yPum = 0;
          this.$refs.direction.style.top = this.yPum + "px";
          this.keyInfo.Top = this.yPum;
        }
        if (this.isHorizontalScreen) {
          if (this.xPum > width - (this.screen.left || 0) * 2) {
            this.xPum = width - (this.screen.left || 0) * 2;
            this.$refs.direction.style.left = this.xPum + "px";
            this.keyInfo.keyLeft = this.xPum;
          }
          if (this.yPum > height - (this.screen.top || 0) * 2) {
            this.yPum = height - (this.screen.top || 0) * 2;
            this.$refs.direction.style.top = this.yPum + "px";
            this.keyInfo.keyTop = this.yPum;
          }
        } else {
          if (
            this.xPum >
            this.screen.totalWidth -
              (this.screen.left * 2 || 0) -
              this.$refs.direction.offsetWidth
          ) {
            this.xPum =
              this.screen.totalWidth -
              (this.screen.left * 2 || 0) -
              this.$refs.direction.offsetWidth;
            this.$refs.direction.style.left = this.xPum + "px";
            this.keyInfo.keyLeft = this.xPum;
          }
          if (
            this.yPum >
            this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.direction.offsetHeight
          ) {
            this.yPum =
              this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.direction.offsetHeight;
            this.$refs.direction.style.top = this.yPum + "px";
            this.keyInfo.keyTop = this.yPum;
          }
        }
        this.$refs.direction.style.left = this.xPum + "px";
        this.$refs.direction.style.top = this.yPum + "px";
        if (this.isHorizontalScreen) {
          this.keyInfo.keyBottom = "";
          this.keyInfo.keyLeft = this.xPum;
          this.keyInfo.keyTop = this.yPum;
        } else {
          this.keyInfo.keyLeft = this.xPum;
          this.keyInfo.keyTop = this.yPum;
          this.keyInfo.keyBottom =
            this.screen.totalWidth -
            this.keyInfo.keyTop -
            this.keyInfo.keyWidth;
        }
        this.isDelete = true;
        if (this.isDelete) {
          this.isDelete = false;
        }
        // 移动时关闭键盘和nav栏
        this.$emit("moveClose", "close");
        this.$emit("updateElement", this.keyInfo, "edit");
        this.setMoveItem(true);
      }
    },
    upDirectionFn(e) {
      console.log("位置", this.keyInfo);
      this.flag = false;
    },
    handleClick() {
      console.log("kisdj");
      if ((this.editKeyboard && !this.clickEditKeyboard) || this.justSave)
        return;
      this.show_dialog = true;
    },
    getAdaptive() {
      this.dragBoxStyle = {
        width: this.screen.videosWidth + "px",
        height: this.screen.videosHeight + "px",
        position: "initial",
        "z-index": "-1"
      };
      if (this.editKeyboard || this.justSave) {
        if (this.addNewCustomizeBtn) {
          this.keyInfo.keyPressMode = 1;
          this.keyInfo.keySize = 5;
          if ([101,104,102, 103].includes(this.keyInfo.rockerType)) {
            this.changeDirectionSizeStyle = {
              width: this.adaptModel.directionWidth + "px",
              height: this.adaptModel.directionWidth + "px"
            };
            this.moveDirectionStyle = { width: this.adaptModel.directionWidth + "px", height: this.adaptModel.directionWidth + "px" };
            this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.directionWidth;
            this.keyInfo.keyLeft = this.adaptModel.directionLeft;
            this.keyInfo.keyTop = this.adaptModel.directionTop;
          } else {
            this.changeSizeStyle = {
              width: this.adaptModel.btnWidth + "px",
              height: this.adaptModel.btnWidth + "px",
              "border-radius": this.adaptModel.btnWidth / 2 + "px",
              "line-height": this.adaptModel.btnWidth + "px"
            };
            this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.btnWidth
            this.keyInfo.keyLeft = this.adaptModel.btnLeft
            this.keyInfo.keyTop = this.adaptModel.btnTop
          }
          this.dynamicBtnStyle = { left: this.adaptModel.btnLeft + "px", top: this.adaptModel.btnTop + "px", bottom: "" };
          this.directionStyle = {
            transform: "rotate(0deg)",
            left: this.adaptModel.directionLeft + "px",
            top: this.adaptModel.directionTop + "px",
            bottom: ""
          };
          if ([101,104,102, 103].includes(this.keymsg.rockerType)) {
            this.$refs.direction.style.left = this.adaptModel.directionLeft + "px"
            this.$refs.direction.style.top = this.adaptModel.directionTop + "px"
          } else {
            this.$refs.btn.style.left = this.adaptModel.btnLeft + "px"
            this.$refs.btn.style.top = this.adaptModel.btnTop + "px"
          }
          this.setAddNewCustomizeBtn(false);
          return;
        }
        this.dynamicBtnStyle = {
          left: this.keymsg.keyLeft + "px",
          top: this.keymsg.keyTop + "px",
          bottom: ""
        };
        this.directionStyle = {
          transform: "rotate(0deg)",
          left: this.keymsg.keyLeft + "px",
          top: this.keymsg.keyTop + "px",
          bottom: ""
        };
        this.keyInfo.keyPressMode = this.keymsg.keyPressMode;
        this.keyInfo.keySize = this.keymsg.keySize;
        if ([101,104,102, 103].includes(this.keyInfo.rockerType)) {
          this.changeDirectionSizeStyle = {
            width: this.keymsg.keyWidth + "px",
            height: this.keymsg.keyHeight + "px"
          };
          this.moveDirectionStyle = {
            width: this.keymsg.keyWidth + "px",
            height: this.keymsg.keyHeight + "px"
          };
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.keymsg.keyWidth;
          this.keyInfo.keyLeft = this.keymsg.keyLeft;
          this.keyInfo.keyTop = this.keymsg.keyTop;
        } else {
          this.changeSizeStyle = {
            width: this.keymsg.keyWidth + "px",
            height: this.keymsg.keyHeight + "px",
            "border-radius": this.keymsg.keyWidth / 2 + "px",
            "line-height": this.keymsg.keyHeight + "px"
          };
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.keymsg.keyWidth;
          this.keyInfo.keyLeft = this.keymsg.keyLeft;
          this.keyInfo.keyTop = this.keymsg.keyTop;
        }
      } else {
        this.dynamicBtnStyle = { left: this.adaptModel.btnLeft + "px", top: this.adaptModel.btnTop + "px", bottom: "" };
        this.directionStyle = {
          transform: "rotate(0deg)",
          left: this.adaptModel.directionLeft + "px",
          top: this.adaptModel.directionTop + "px",
          bottom: ""
        };
        this.keyInfo.keyPressMode = 1;
        this.keyInfo.keySize = 5;
        if ([101,104,102, 103].includes(this.keyInfo.rockerType)) {
          this.changeDirectionSizeStyle = {
            width: this.adaptModel.directionWidth + "px",
            height: this.adaptModel.directionWidth + "px"
          };
          this.moveDirectionStyle = { width: this.adaptModel.directionWidth + "px", height: this.adaptModel.directionWidth + "px" };
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.directionWidth;
          this.keyInfo.keyLeft = this.adaptModel.directionLeft;
          this.keyInfo.keyTop = this.adaptModel.directionTop;
        } else {
          this.changeSizeStyle = {
            width: this.adaptModel.btnWidth + "px",
            height: this.adaptModel.btnWidth + "px",
            "border-radius": this.adaptModel.btnWidth / 2 + "px",
            "line-height": this.adaptModel.btnWidth + "px"
          };
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.btnWidth
          this.keyInfo.keyLeft = this.adaptModel.btnLeft
          this.keyInfo.keyTop = this.adaptModel.btnTop
        }
      }
    },

    changeClick(data) {
      // 设置 即时 锁定
      this.keyInfo.keyPressMode = data;
      console.log(this.keyInfo);
    },
    removebtn() {
      this.showItem = false;
      this.show_dialog = false;
      this.$emit("updateElement", this.keyInfo, "remove");
    },
    confirm() {
      this.show_dialog = false;
      this.saveConfirmFlag = true;
      this.saveRadio = this.keyInfo.keyPressMode;
      this.$set(this.rememberKeyboardSaveSize, "keySize", this.keyInfo.keySize);
      this.$set(
        this.rememberKeyboardSaveSize,
        "keyWidth",
        this.keyInfo.keyWidth
      );
      this.$emit("updateElement", this.keyInfo, "edit");
    },
    closeDialog() {
      this.show_dialog = false;
      if (this.saveConfirmFlag) {
        const { keySize, keyWidth } = this.rememberKeyboardSaveSize;
        this.keyInfo.keySize = keySize;
        this.keyInfo.keyHeight = this.keyInfo.keyWidth = keyWidth;
        this.changeDirectionSizeStyle = {
          width: keyWidth + "px",
          height: keyWidth + "px",
        };
        this.moveDirectionStyle = {
          width: keyWidth + "px",
          height: keyWidth + "px",
        };
        this.changeSizeStyle = {
          height: keyWidth + "px",
          width: keyWidth + "px",
          "border-radius": keyWidth / 2 + "px",
          "line-height": keyWidth + "px"
        };
        this.keyInfo.keyPressMode = this.saveRadio;
        return;
      }
      if (!this.editKeyboard) {
        if (![101,104,102, 103].includes(this.keyInfo.rockerType)) {
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.btnWidth;
          this.changeSizeStyle = {
            height: this.keyInfo.keyWidth + "px",
            width: this.keyInfo.keyWidth+ "px",
            "border-radius": this.keyInfo.keyWidth / 2 + "px",
            "line-height": this.keyInfo.keyWidth + "px"
          };
        } else {
          this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.directionWidth;
          this.moveDirectionStyle = {
            width: this.keyInfo.keyWidth + "px",
            height: this.keyInfo.keyWidth + "px"
          };
          this.changeDirectionSizeStyle = {
            width: this.keyInfo.width + "px",
            height: this.keyInfo.width + "px",
          };
        }
        this.keyInfo.keySize = 5;
        this.keyInfo.keyPressMode = 1;
      } else {
        let filterRealValue = this.rememberHasSaveKeyboard.find(
          (item) => item.id === this.keyInfo.id
        );
        if (filterRealValue) {
          this.keyInfo.keySize = filterRealValue.keySize;
          this.keyInfo.keyHeight = this.keyInfo.keyWidth = filterRealValue.keyWidth
          this.changeDirectionSizeStyle = {
            width: filterRealValue.width + "px",
            height: filterRealValue.width + "px",
          };
          this.moveDirectionStyle = {
            width: filterRealValue.keyWidth + "px",
            height: filterRealValue.keyWidth + "px",
          };
          this.changeSizeStyle = {
            height: filterRealValue.keyWidth + "px",
            width: filterRealValue.keyWidth+ "px",
            "border-radius": filterRealValue.keyWidth / 2 + "px",
            "line-height": filterRealValue.keyWidth + "px"
          };
          this.keyInfo.keyPressMode = this.saveRadio;
        } else {
          if (![101,104,102, 103].includes(this.keyInfo.rockerType)) {
            this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.btnWidth;
            this.changeSizeStyle = {
              height: this.keyInfo.keyWidth + "px",
              width: this.keyInfo.keyWidth+ "px",
              "border-radius": this.keyInfo.keyWidth / 2 + "px",
              "line-height": this.keyInfo.keyWidth + "px"
            };
          } else {
            this.keyInfo.keyWidth = this.keyInfo.keyHeight = this.adaptModel.directionWidth;
            this.moveDirectionStyle = {
              width: this.keyInfo.keyWidth + "px",
              height: this.keyInfo.keyWidth + "px"
            };
            this.changeDirectionSizeStyle = {
              width: this.keyInfo.width + "px",
              height: this.keyInfo.width + "px",
            };
          }
          this.keyInfo.keySize = 5;
          this.keyInfo.keyPressMode = 1;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
p {
  margin: 0;
  padding: 0;
}
.dragBox {
  position: relative;
}
.btn {
  position: absolute;
  font-size: 16.7px; 
  height: 50px; 
  width: 50px; 
  line-height: 50px; 
  color: #00ffd8;
  text-align: center;
  background-color: #161f1999; //问题24
  border: 1px solid #0e4a55;
  margin-left: auto;
  border-radius: 25px; 
  opacity: 0.9;
  z-index: 100;
}
.wheel {
  width: 130px; 
  height: 130px; 
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
  height: 130px; 
  width: 130px; 
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
  width: 130px; 
  height: 130px; 
  position: absolute;
  z-index: 100;
}
/deep/ .van-dialog {
  overflow: inherit;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 26.7px;
  height: 333.3px;
  width: 533.3px;
  font-size: 28px;
  .van-dialog__footer {
    display: none;
  }
}
/deep/ .van-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}
.drag_content {
  display: flex;
  height: 333.3px;
  width: 533.3px;
  // background-color: rgba(0, 0, 0, 0.7);
  .btnStyle {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .btnExample {
      position: relative;
      color: whitesmoke;
      font-size: 30px;
      width: 166.7px;
      height: 166.7px;
      border-radius: 83.3px;
      border: 1.7px solid #8a8a8a;
      background-color: black;
      .btnDisplayName {
        position: relative;
        display: flex;
        justify-content: center;
      }
    }
  }
  .btnFunc {
    flex: 1;
    color: whitesmoke;
    .changeSize {
      box-sizing: border-box;
      padding-top: 33.3px;
      height: 50%;
      .changeSize_text {
        height: 50%;
      }
      .regulate {
        height: 50%;
        color: #00fdc6;
      }
    }
    .keyFashion {
      box-sizing: border-box;
      padding-top: 16.7px;
      height: 50%;
      .keyFashion_text {
        height: 50%;
      }
      .twoBtn {
        height: 50%;
        span {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          width: 93.3px;
          border-radius: 25px;
          background-color: #626262;
        }
      }
    }
  }
  .exitImg {
    position: absolute;
    right: 0px; 
    transform: translate(40%, -40%);
  }
  .funcBtn {
    position: absolute;
    display: flex;
    color: #fff;
    justify-content: space-around;
    width: 100%;
    bottom: -24%;
    .removeBtn {
      // display: inline-block;
      height: 50px;
      line-height: 50px;
      width: 216.7px;
      border-radius: 25px;
      background-color: #a01614;
    }
    .confirm {
      color: #00fdc6;
      border: 1.7px solid #00fdc6;
      height: 50px;
      line-height: 50px;
      width: 100px;
      border-radius: 25px;
      background-color: #181818;
    }
  }
}
.actived {
  color: black !important;
  background-color: #00fdc6 !important;
}
.actived1 {
  // background-color: red;
  background-color: #a6e7dd;
  opacity: 0.5;
  color: #00ffd8;
}
</style>
