import { mapGetters, mapMutations } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      btn: 2,
      width: 666.65,
      keyNum: 0,
      // 半径
      radius: 0,
      d_radius: 0,
      // 中心点
      zoreX: 0,
      zoreY: 0,
      // 移动时距离
      moveX: 0,
      moveY: 0,
      // 中心环形一圈半径
      zoreOffset: 0,
      // 超出范围圆上点坐标
      dotX: 0,
      dotY: 0,
      // 方向按钮的初始位置
      directionLeft: "",
      directionTop: "",
      //通过监听turn的数值可以向后台发送对应的keycode，从而达到控制行动方向
      turn: 0, // 0表示在原点， 1表示右边，顺时针递增
      imgCurrent: require("../assets/img/roller/摇杆底_非焦点.png"),
      imgList: [
          require("../assets/img/roller/摇杆底_非焦点.png"),
          require("../assets/img/roller/摇杆底_焦点.png"),
          require("../assets/img/roller/摇杆_方向.png")
      ],
      rollerInfo: {}
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
        if (this.rollerInfoData && Object.keys(this.rollerInfoData).length) {
          this.rollerInfo = this.rollerInfoData
          this.initRoller()
        }
      },
      deep: true
    },
    officialKeyboardFlag () {
      this.rollerInfo={}
      if(this.officialKeyboardFlag){
        console.log(this.officialKeyInfo)
        this.officialKeyInfo.forEach(item => {
          if([101,102].includes(Number(item.rockerType)) && item.keyStyle == '1' ){
            let keyItem={
              keyWidth:item.keyWidth/(1080 / this.screen.videosHeight),
              keyHeight:item.keyHeight/(1080 / this.screen.videosHeight),
              keyMarginLeft:item.keyMarginLeft/(1920 / this.screen.videosWidth),
              keyMarginTop:item.keyMarginTop/(1080 / this.screen.videosHeight),
              rockerType:item.rockerType
            }
            this.rollerInfo=keyItem;
            this.initRoller();
            console.log('数据111',this.rollerInfo)
          }
        });
      }
    },
    fullScreenShow(){
      this.rollerInfo={}
      if(this.officialKeyInfo){
        console.log(this.officialKeyInfo)
        this.officialKeyInfo.forEach(item => {
          if([101,102].includes(Number(item.rockerType)) && item.keyStyle == '1' ){
            let keyItem={
              keyWidth:item.keyWidth/(1080 / this.screen.videosHeight),
              keyHeight:item.keyHeight/(1080 / this.screen.videosHeight),
              keyMarginLeft:item.keyMarginLeft/(1920 / this.screen.videosWidth),
              keyMarginTop:item.keyMarginTop/(1080 / this.screen.videosHeight),
              rockerType:item.rockerType
            }
            this.rollerInfo=keyItem;
            this.initRoller();
            console.log('数据111',this.rollerInfo)
          }
        });
      }
    }
  },
  mounted () {
    if (![null, undefined, 'null', 'undefined'].includes(localStorage.getItem("rollerInfo"))) {
      this.rollerInfo = JSON.parse(localStorage.getItem("rollerInfo"))
      this.initRoller()
    }
  },
  methods: {
    ...mapMutations([
      'set_BtnEmptyKey',
      'set_BtnKeyArray'
    ]),
    initRoller() {
      this.$nextTick(() => {
        const left =this.rollerInfo.keyMarginLeft|| this.rollerInfo.keyLeft || this.rollerInfo.left;
        const top = this.rollerInfo.keyMarginTop || this.rollerInfo.keyTop || this.rollerInfo.top;
        const width = this.rollerInfo.keyWidth || this.rollerInfo.width;
        const heigth = this.rollerInfo.keyHeight || this.rollerInfo.height;
        console.log('数据',left,top,width,heigth)
        this.zoreOffset = width / 8; // 小一点比如 1/8， 可以增大触发面积
        this.zoreX = left + width / 2;
        this.zoreY = top + heigth / 2;
  
        // 获取摇杆圆板半径
        this.radius = width / 2;
        const d_width = 80
        const d_heigth = 80
        const d_X = left + d_width / 2;
        const d_Y = top + d_heigth / 2;
  
        // 获取方向按钮的半径
        this.d_radius = (d_width * 2) / 5; //这个因为是给了个图片，按钮的圆包含在图片里，所以只能取个大概，如果图片本身就是个圆那就更好说了直接d_width / 2
        this.directionLeft = this.zoreX - d_X + 'px'
        this.directionTop = this.zoreY - d_Y + 'px'
      })
    },
    stripPX(obj) {
      if(obj.indexOf("px")!=-1){
        return parseInt(obj.slice(0,-2));
      }else{
        return 0;
      }
    },
    touch(event) {
      this.$emit('isButton', this.btn)
      var event = event || window.event;
      this.imgCurrent = this.imgList[1];
      switch (event.type) {
        case "touchstart":
        case "touchmove":
          var ua = navigator.userAgent;
          if (ua.match("Android") || ua.match("Linux")) {
            event.stopPropagation();
          }
          //获取到当前手指的位置
          if((this.initMsg.flag == 0) || (this.initMsg.flag == 2) || (this.initMsg.flag == 1.1) || (this.initMsg.flag == 1) || JSON.parse(localStorage.getItem('isHorizontalScreen'))){
            this.moveX = event.targetTouches[0].clientX - this.screen.left;
            this.moveY = event.targetTouches[0].clientY - this.screen.top;
          }else{
            this.moveX = this.screen.totalWidth * this.screen.rate - event.targetTouches[0].clientY;
            this.moveY = event.targetTouches[0].clientX - this.screen.top;
          }
          break;
        case "touchend":
          break;
      };

      // 获取手指的位置与中心点位置横纵坐标的差值
      let turnX = this.moveX - this.zoreX;
      let turnY = this.moveY - this.zoreY;

      // 通过判断圆心半径的数值与手指的位置信息的大小来判断是在哪个方位
      if(this.rollerInfo.rockerType == 102){
        if (
          Math.abs(turnX) < this.zoreOffset &&
          Math.abs(turnY) < this.zoreOffset
        ) {
          this.turn = 0;  //在中心
          this.set_BtnEmptyKey()
        } else if (Math.abs(turnX) < this.zoreOffset) {
          this.turn = turnY > 0 ? 3 : 7;  // 3：下， 7：上
          this.keyNum = this.turn == 3 ? 40 : 38;
        } else if (Math.abs(turnY) < this.zoreOffset) {
          this.turn = turnX > 0 ? 1 : 5; // 1：右， 5：左
          this.keyNum = this.turn == 1 ? 39 :37;
        } else {
          if (turnX > 0) {
            // 在右边
            this.turn = turnY > 0 ? 2 : 8; // 2：右下， 8：右上
            this.keyNum = this.turn == 2 ? [39,40] : [39,38];
          } else {
            // 在左边
            this.turn = turnY > 0 ? 4 : 6; // 4：坐下， 6：左上
            this.keyNum = this.turn == 4 ? [37,40] : [37,38];
          }
        }
      }else{
        if (
          Math.abs(turnX) < this.zoreOffset &&
          Math.abs(turnY) < this.zoreOffset
        ) {
          this.turn = 0;  //在中心
          this.set_BtnEmptyKey()
        } else if (Math.abs(turnX) < this.zoreOffset) {
          this.turn = turnY > 0 ? 3 : 7;  // 3：下， 7：上
          this.keyNum = this.turn == 3 ? 83 : 87;
        } else if (Math.abs(turnY) < this.zoreOffset) {
          this.turn = turnX > 0 ? 1 : 5; // 1：右， 5：左
          this.keyNum = this.turn == 1 ? 68 : 65;
        } else {
          if (turnX > 0) {
            // 在右边
            this.turn = turnY > 0 ? 2 : 8; // 2：右下， 8：右上
            this.keyNum = this.turn == 2 ? [68,83] : [68, 87];
          } else {
            // 在左边
            this.turn = turnY > 0 ? 4 : 6; // 4：坐下， 6：左上
            this.keyNum = this.turn == 4 ? [65,83] : [65,87];
          }
        }
      }
      this.set_BtnEmptyKey()
      if(this.turn != 0) {
        console.log(this.keyNum)
        this.set_BtnKeyArray(this.keyNum);
      }
        // 控制移动
      this.moveBtn(event);
    },
    // 该方法是用来控制中间方向按钮移动
    moveBtn(e) {
      let event = e || window.event;
      // 获取手指的位置
      let x;
      let y;
      // console.log('topl',event)
      if ((this.initMsg.flag == 0) || (this.initMsg.flag == 2) || (this.initMsg.flag == 1.1) || (this.initMsg.flag == 1) || JSON.parse(localStorage.getItem('isHorizontalScreen'))){
        x = event.targetTouches[0].clientX - this.screen.left;
        y = event.targetTouches[0].clientY - this.screen.top;
      } else {
        x = this.screen.totalWidth * this.screen.rate - event.targetTouches[0].clientY;
        y = event.targetTouches[0].clientX - this.screen.top;
      }
      // 限定范围
      let dx = Math.abs(x - this.zoreX); //横向距离绝对值
      let dy = Math.abs(y - this.zoreY); // 纵向距离绝对值
      // 计算角度用
      let non_dx = x - this.zoreX; //横向距离值
      let non_dy = y - this.zoreY; //纵向距离值
      // console.log('当前角度',non_dx,x,this.zoreX)
      let distance =
        Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) + this.d_radius; // 计算出两者间的直线距离
        // console.log('执行11',this.rollerInfo)
      if (distance > this.radius) {
        // 直线距离超出半径则在圆周上运动
        this.circularMotion(non_dx, non_dy);
        // 移动时按键跟随
        let directionInfo = this.$refs.directionBtn;
        directionInfo.style.left = this.dotX - (this.rollerInfo.keyLeft || this.rollerInfo.left || this.rollerInfo.keyMarginLeft ) + "px";
        directionInfo.style.top = this.dotY  - (this.rollerInfo.keyTop || this.rollerInfo.top || this.rollerInfo.keyMarginTop ) + "px";
        console.log('中心位置',directionInfo.style.left,directionInfo.style.top)
        return;
      }
      // 移动时按键跟随
      let directionInfo = this.$refs.directionBtn;
      directionInfo.style.left = x - (this.rollerInfo.keyWidth || this.rollerInfo.width) / 2  - (this.rollerInfo.keyLeft || this.rollerInfo.left || this.rollerInfo.keyMarginLeft) + "px";
      directionInfo.style.top = y - (this.rollerInfo.keyHeight || this.rollerInfo.height) / 2  - (this.rollerInfo.keyTop || this.rollerInfo.top || this.rollerInfo.keyMarginTop) + "px";
      console.log('中心位置',directionInfo.style.left,directionInfo.style.top)
    },
    // 移动时超出半径部分的绕圆周运动
    circularMotion(non_dx, non_dy) {
      let angle;
      if (non_dx > 0) {
        // 第一和第四象限
        angle = (360 * Math.atan(non_dy / non_dx)) / (2 * Math.PI);
      } else if (non_dx < 0) {
        // 第二和第三象限
        angle =
          (360 * Math.atan(non_dy / non_dx)) / (2 * Math.PI) - 180;
      }
      // 通过角度获取圆上点坐标  算出的坐标需要加上背景中心点坐标再减去按钮的半径
      this.dotX =
        (this.radius - this.d_radius) *
          Math.cos((angle * Math.PI) / 180) +
        this.zoreX -
        this.$refs.directionBtn.offsetHeight / 2;
      this.dotY =
        (this.radius - this.d_radius) *
          Math.sin((angle * Math.PI) / 180) +
        this.zoreY -
        this.$refs.directionBtn.offsetHeight / 2;
      // console.log(this.dotX, this.dotY);
      // return dotX, dotY;
    },
    touchEnd(event) {
      // 抬起归位
      this.set_BtnEmptyKey()
      this.imgCurrent = this.imgList[0];
      this.turn = 0;
      this.$refs.directionBtn.style.left = '0px'
      this.$refs.directionBtn.style.top = '0px'
    }
  }
}