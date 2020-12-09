import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
        direction_btn: 2,
        // 中心点
        direction_zoreX: 0,
        direction_zoreY: 0,
        // 移动时距离
        direction_moveX: 0,
        direction_moveY: 0,
        // 中心环形一圈半径
        direction_zoreOffset: 0,
        direction_turn: 0, // 0表示在原点， 1表示右边，顺时针递增
        direction_keyNum: 0, // 传递的键盘keycode
        direction_imgList: [
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/right.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/rightBottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/bottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/leftBottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/left.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/leftTop.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/top.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/rightTop.png"
        ],
        direction_keyImglist: [
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/middle.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/right.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/rightBottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/bottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/leftBottom.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/left.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/leftTop.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/top.png",
          "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/rightTop.png"
        ],
        direction_imgCurrent: "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png",
        direction_keyImg: "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/middle.png",
        directionrollerInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'initMsg',
      'rollerInfoData',
      'officialKeyInfo',
      "fullScreenShow"
    ])
  },
  watch: {
    rollerInfoData: {
      handler () {
        this.directionrollerInfo = {}
        if (this.rollerInfoData && Object.keys(this.rollerInfoData).length) {
          this.directionrollerInfo = this.rollerInfoData
          this.cartView()
        }
      },
      deep: true
    },
    officialKeyboardFlag () {
      this.directionrollerInfo={};
      if(this.officialKeyboardFlag){
        console.log(this.officialKeyInfo)
        this.officialKeyInfo.forEach(item => {
          if([103,104].includes(Number(item.rockerType))&& item.keyStyle == 1){
            let keyItem={
              keyWidth:item.keyWidth/(1080 / this.screen.videosHeight),
              keyHeight:item.keyHeight/(1080 / this.screen.videosHeight),
              keyMarginLeft:item.keyMarginLeft/(1920 / this.screen.videosWidth),
              keyMarginTop:item.keyMarginTop/(1080 / this.screen.videosHeight),
              rockerType:item.rockerType
            }
            this.directionrollerInfo=keyItem;
            if(this.directionrollerInfo.rockerType == 103){
              this.direction_imgCurrent = "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png";
            }else{
              this.direction_imgCurrent = this.direction_keyImg
            }
            this.cartView();
            console.log('数据111',this.directionrollerInfo)
          }
        });
      }
    },
    fullScreenShow(){
      this.directionrollerInfo={};
      if(this.officialKeyInfo){
        console.log(this.officialKeyInfo)
        this.officialKeyInfo.forEach(item => {
          if([103,104].includes(Number(item.rockerType))&& item.keyStyle == 1){
            let keyItem={
              keyWidth:item.keyWidth/(1080 / this.screen.videosHeight),
              keyHeight:item.keyHeight/(1080 / this.screen.videosHeight),
              keyMarginLeft:item.keyMarginLeft/(1920 / this.screen.videosWidth),
              keyMarginTop:item.keyMarginTop/(1080 / this.screen.videosHeight),
              rockerType:item.rockerType
            }
            this.directionrollerInfo=keyItem;
            if(this.directionrollerInfo.rockerType == 103){
              this.direction_imgCurrent = "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png";
            }else{
              this.direction_imgCurrent = this.direction_keyImg
            }
            this.cartView();
            console.log('数据111',this.directionrollerInfo)
          }
        });
      }
    }
  },
  mounted() {
    if (![null, undefined, 'null', 'undefined'].includes(localStorage.getItem("directionInfo"))) {
      this.directionrollerInfo = JSON.parse(localStorage.getItem("directionInfo"))
      this.$nextTick(function () {
        this.cartView()
      })
    }
  },
  methods: {
    ...mapMutations([
      'set_BtnEmptyKey',
      'set_BtnKeyArray'
    ]),
    cartView () {
      console.log('direction screen init')
      const left = (this.directionrollerInfo.keyLeft || this.directionrollerInfo.left || this.directionrollerInfo.keyMarginLeft) ? (this.directionrollerInfo.keyLeft || this.directionrollerInfo.left || this.directionrollerInfo.keyMarginLeft) : 0;
      const top = (this.directionrollerInfo.keyTop || this.directionrollerInfo.top || this.directionrollerInfo.keyMarginTop) ? (this.directionrollerInfo.keyTop || this.directionrollerInfo.top || this.directionrollerInfo.keyMarginTop) : 0;

      const width = (this.directionrollerInfo.keyWidth || this.directionrollerInfo.width) ? (this.directionrollerInfo.keyWidth || this.directionrollerInfo.width) : 0;
      const height = (this.directionrollerInfo.keyHeight || this.directionrollerInfo.height) ? (this.directionrollerInfo.keyHeight || this.directionrollerInfo.height) : 0;

      this.direction_zoreOffset = width / 8;
      this.direction_zoreX = left + width / 2;
      this.direction_zoreY = top + height / 2;
    },
    stripPX (obj) {
      if (obj && obj.indexOf("px")!=-1) {
        return parseInt(obj.slice(0,-2));
      } else {
        return 0;
      }
    },
    keypress (event) {
      console.log('direction key 长按')
    },
    // 开始触摸方向盘
    touchDirection (event) {
      console.log('direction key down')
      this.$emit('isButton', this.direction_btn)
      var event = event || window.event;
      switch (event.type) {
        case "touchstart":
        case "touchmove":
          var ua = navigator.userAgent;
          if (ua.match("Android") || ua.match("Linux")) {
            event.stopPropagation();
          }
          console.log('滚轮的方向键:');
          if((this.initMsg.flag == 0) || (this.initMsg.flag == 2) || (this.initMsg.flag == 1.1) || (this.initMsg.flag == 1) || JSON.parse(localStorage.getItem('isHorizontalScreen'))){
            this.direction_moveX = event.targetTouches[0].clientX - this.screen.left;
            this.direction_moveY = event.targetTouches[0].clientY - this.screen.top;
          }else{
            this.direction_moveX = this.screen.totalWidth * this.screen.rate - event.targetTouches[0].clientY;
            this.direction_moveY = event.targetTouches[0].clientX - this.screen.top;
          }
          break;
        case "touchend":
          break;
      }
      let turnX = this.direction_moveX - this.direction_zoreX;
      let turnY = this.direction_moveY - this.direction_zoreY;
      if(this.directionrollerInfo.rockerType == 103){
        if (
          Math.abs(turnX) < this.direction_zoreOffset &&
          Math.abs(turnY) < this.direction_zoreOffset
        ) {
          this.direction_turn = 0;
        } else if (Math.abs(turnX) < this.direction_zoreOffset) {
          this.direction_turn = turnY > 0 ? 3 : 7; // 3：下， 7：上
          this.direction_keyNum = this.direction_turn == 3 ? 83 : 87;
        } else if (Math.abs(turnY) < this.direction_zoreOffset) {
          this.direction_turn = turnX > 0 ? 1 : 5; // 1：右， 5：左
          this.direction_keyNum = this.direction_turn == 1 ? 68 : 65;
        } else {
          if (turnX > 0) {
            // 在右边
            this.direction_turn = turnY > 0 ? 2 : 8; // 2：右下， 8：右上
            this.direction_keyNum = this.direction_turn == 2 ? [68,83] : [68, 87];
          } else {
            // 在左边
            this.direction_turn = turnY > 0 ? 4 : 6; // 4：坐下， 6：左上
            this.direction_keyNum = this.direction_turn == 4 ? [65,83] : [65,87];
          }
        }
      }else{
        if (
          Math.abs(turnX) < this.direction_zoreOffset &&
          Math.abs(turnY) < this.direction_zoreOffset
        ) {
          this.direction_turn = 0;
        } else if (Math.abs(turnX) < this.direction_zoreOffset) {
          this.direction_turn = turnY > 0 ? 3 : 7; // 3：下， 7：上
          this.direction_keyNum = this.direction_turn == 3 ? 40 : 38;
        } else if (Math.abs(turnY) < this.direction_zoreOffset) {
          this.direction_turn = turnX > 0 ? 1 : 5; // 1：右， 5：左
          this.direction_keyNum = this.direction_turn == 1  ? 39 :37;
        } else {
          if (turnX > 0) {
            // 在右边
            this.direction_turn = turnY > 0 ? 2 : 8; // 2：右下， 8：右上
            this.direction_keyNum = this.direction_turn == 2 ? [39,40] : [39,38];
          } else {
            // 在左边
            this.direction_turn = turnY > 0 ? 4 : 6; // 4：坐下， 6：左上
            this.direction_keyNum = this.direction_turn == 4 ? [37,40] : [37,38];
          }
        }
      }
      this.set_BtnEmptyKey()
      if (this.direction_turn != 0) {
        this.set_BtnKeyArray(this.direction_keyNum);
      }
      if(this.directionrollerInfo.rockerType == 103){
        this.direction_imgCurrent = this.direction_imgList[this.direction_turn];
      }else{
        this.direction_imgCurrent = this.direction_keyImglist[this.direction_turn]
      }

    },
    // 方向键的抬起
    touchEndDirection (which) {
      this.set_BtnEmptyKey()
      if(this.directionrollerInfo.rockerType == 103){
        this.direction_imgCurrent = "https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png";
      }else{
        this.direction_imgCurrent = this.direction_keyImg
      }
      this.direction_turn = 0;
    }
  }
}
