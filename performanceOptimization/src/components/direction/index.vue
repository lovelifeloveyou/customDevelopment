<template>
  <div
    id="wheel"
    ref="wheel"
    v-hammer:press="keypress"
    @touchstart.stop.prevent="touch($event)"
    @touchmove="touch($event)"
    @touchend="touchEnd($event)"
  >
    <img id="wheelImage" width="130" :src="imgCurrent" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import $ from "jquery";
export default {
  name: "Direction",
  props: ["screen", "isHorizontalScreen","isIos"],
  data() {
    return {
      btn: 2,
      // 中心点
      zoreX: 0,
      zoreY: 0,
      // 移动时距离
      moveX: 0,
      moveY: 0,
      // 中心环形一圈半径
      zoreOffset: 0,
      turn: 0, // 0表示在原点， 1表示右边，顺时针递增
      keyNum: 0, // 传递的键盘keycode
      isVertical: true,
      width: 666.65,
      imgList: [
        require("../../assets/img/direction/middle.png"),
        require("../../assets/img/direction/right.png"),
        require("../../assets/img/direction/rightBottom.png"),
        require("../../assets/img/direction/bottom.png"),
        require("../../assets/img/direction/leftBottom.png"),
        require("../../assets/img/direction/left.png"),
        require("../../assets/img/direction/leftTop.png"),
        require("../../assets/img/direction/top.png"),
        require("../../assets/img/direction/rightTop.png")
      ],
      imgCurrent: require("../../assets/img/direction/middle.png")
    };
  },
  computed: {
    ...mapGetters(["initMsg"])
  },
  mounted() {
    this.$nextTick(function() {
      this.cartView();
    });
  },
  methods: {
    ...mapMutations(["set_BtnEmptyKey", "set_BtnKeyArray"]),
    cartView() {
      console.log("direction screen init");
      const wheel = this.$refs.wheel;

      // const left = wheel.offsetLeft;
      // const top = wheel.offsetTop;
      const left = this.stripPX($("#wheel").css("left"));
      const top = this.stripPX($("#wheel").css("top"));

      const width = $("#wheel").width();
      const height = $("#wheel").height();

      this.zoreOffset = width / 8;
      this.zoreX = left + width / 2;
      this.zoreY = top + height / 2;
    },

    stripPX(obj) {
      if (obj && obj.indexOf("px") != -1) {
        return parseInt(obj.slice(0, -2));
      } else {
        return 0;
      }
    },
    keypress(event) {
      console.log("direction key 长按");
    },
    // 开始触摸方向盘
    touch(event) {
      console.log("direction key down");
      this.$emit("isButton", this.btn);
      console.log(this.initMsg.flag);
      var event = event || window.event;
      switch (event.type) {
        case "touchstart":
        case "touchmove":
          if(!this.isIos){
            event.stopPropagation();
          }
          console.log("滚轮的方向键:");
          if (
            this.initMsg.flag == 0 ||
            this.initMsg.flag == 2 ||
            this.initMsg.flag == 1.1 ||
            this.initMsg.flag == 1 ||
            this.isHorizontalScreen
          ) {
            this.moveX = event.targetTouches[0].clientX - this.screen.left;
            this.moveY = event.targetTouches[0].clientY - this.screen.top;
          } else {
            this.moveX =
              this.screen.totalWidth * this.screen.rate -
              event.targetTouches[0].clientY;
            this.moveY = event.targetTouches[0].clientX - this.screen.top;
          }
          break;
        case "touchend":
          break;
      }
      let turnX = this.moveX - this.zoreX;
      let turnY = this.moveY - this.zoreY;
      if (
        Math.abs(turnX) < this.zoreOffset &&
        Math.abs(turnY) < this.zoreOffset
      ) {
        this.turn = 0;
      } else if (Math.abs(turnX) < this.zoreOffset) {
        this.turn = turnY > 0 ? 3 : 7; // 3：下， 7：上
        this.keyNum = this.turn == 3 ? 83 : 87;
      } else if (Math.abs(turnY) < this.zoreOffset) {
        this.turn = turnX > 0 ? 1 : 5; // 1：右， 5：左
        this.keyNum = this.turn == 1 ? 68 : 65;
      } else {
        if (turnX > 0) {
          // 在右边
          this.turn = turnY > 0 ? 2 : 8; // 2：右下， 8：右上
          this.keyNum = this.turn == 2 ? [68, 83] : [68, 87];
        } else {
          // 在左边
          this.turn = turnY > 0 ? 4 : 6; // 4：坐下， 6：左上
          this.keyNum = this.turn == 4 ? [65, 83] : [65, 87];
        }
      }
      this.set_BtnEmptyKey();
      if (this.turn != 0) {
        this.set_BtnKeyArray(this.keyNum);
      }
      this.imgCurrent = this.imgList[this.turn];
    },

    // 方向键的抬起
    touchEnd(which) {
      this.set_BtnEmptyKey();
      this.imgCurrent = require("../../assets/img/direction/middle.png");
      this.turn = 0;
    }
  }
};
</script>

<style scoped lang="less" src="./index.less"></style>
<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

#wheel {
  width: 130px; 
  height: 130px; 
}

ul {
  position: absolute;
  display: flex;
  width: 120px; 
  height: 120px; 
  flex-wrap: wrap;
  background: url("../../assets/img/direction/top.png") no-repeat center center;
  background-size: 130px 130px; 
}
li {
  width: calc(calc(100% / 3) - 10px);
  margin: 5px; 
  height: calc(calc(100% / 3) - 10px);
  box-sizing: border-box;
  border: 1px solid white;
}
</style>