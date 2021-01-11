export default {
  data () {
    return {
      isHorizontalScreen: false,
      // ios与vue通信提示是否需要旋转
      needTipRotate: null,
      markNewFlag: false,
      data: {},
      dataImg: {},
      loadImgStyle: {},
      screen: {
        videosWidth: 0,
        videosHeight: 0,
        changeRatioHeight: 0,
        totalWidth: 0,
        totalHeight: 0,
        rate: 1,
        top: 0,
        left: 0,
        mouseX: 0, // 鼠标模式下的鼠标位置
        mouseY: 0,
      },
      showFullScreenSwitch: true,
      videoStyle: {},
      firstMoveMouse: true,
    }
  },
  mounted () {
    // 检测屏幕旋转及横竖屏
    this.$nextTick(() => {
      // ios和vue通信  --- 横竖屏提示
      // this.getRotatingState()
      this.updateOrientation()
      const supportOrientation = (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object');
      if (supportOrientation) {
        window.addEventListener('orientationchange', this.updateOrientation, false);
      } else {
        //监听resize事件
        window.addEventListener('resize', this.updateOrientation, false);
      }
      document.addEventListener("visibilitychange", this.$visable.bind(this));
    })
  },
  watch: {
    fullScreenShow: {
      handler (newVal, oldVal) {
        this.rotate()
        if (oldVal && !newVal) {
          let btnIconLeft = this.$refs.btnIcon.style.left.replace("px", "");
          // 控制刘海屏手机全屏切非全屏时悬浮球在最右侧出界的问题
          if (Number(btnIconLeft) + 100 >= this.screen.videosWidth) {
            $(".btnIcon")[0].style.left = this.screen.videosWidth - 100 + "px";
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // jsBridge 获取ios方法
    // getRotatingState () {
    //   this.$bridge.callHandler('getRotationFromObjC', (res) => {
    //     if (res) {
    //       this.needTipRotate = Number(res.rotation)
    //       if (this.needTipRotate === 1) {
    //         this.markNewFlag = true
    //       }
    //     }
    //   })
    // },
    updateOrientation () {
      this.getAdaptive()
      this.rotate()
      var supportOrientation = (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object')
      if (supportOrientation) {
        var orientation = window.orientation
        switch (orientation) {
          case 90:
          case -90:
            console.log('横屏状态')
            this.isHorizontalScreen = true;
            this.$set(this,'data',{})
            break
          default:
            console.log('竖屏状态')
            this.isHorizontalScreen = false;
            this.needTipRotate = null
            this.data = {
              width: window.screen.height + "px",
              height: window.screen.width + "px",
              transform: "translate(0px, " + window.screen.height + "px) rotate(-90deg)",
            };
        }
      } else {
        if (window.innerWidth > window.innerHeight) {
          this.isHorizontalScreen = true;
          this.$set(this,'data',{})
        } else {
          this.isHorizontalScreen = false;
          this.needTipRotate = null
          this.data = {
            width: window.screen.height + "px",
            height: window.screen.width + "px",
            transform: "translate(0px, " + window.screen.height + "px) rotate(-90deg)",
          };
        }
      }
    },
    getAdaptive() {
      if (window.screen.height > window.screen.width) {
        this.dataImg = {
          width: window.screen.height + "px",
          height: window.screen.width + "px",
          position: "absolute",
          top: "0",
          zIndex: 11000,
        };
        this.loadImgStyle = {
          width: window.screen.height + "px",
          height: window.screen.width + "px",
          transform: "rotate(0deg)",
          position: "relative",
          left: [5, "5"].includes(this.initMsg.flag)
            ? -(0.02 * window.screen.height) + "px"
            : "0px",
          top: "0px",
        };
      } else {
        this.dataImg = {
          width: window.screen.width + "px",
          height: window.screen.height + "px",
          position: "absolute",
          top: "0",
          zIndex: 11000,
        };
        this.loadImgStyle = {
          width: window.screen.width + "px",
          height: window.screen.height + "px",
          transform: "rotate(0deg)",
          position: "relative",
          left: "0px",
          top: "0px",
        };
      }
    },
    rotate() {
      this.screen.totalWidth =
        window.screen.availWidth > window.screen.availHeight
          ? window.screen.availWidth
          : window.screen.availHeight;
      this.screen.totalHeight =
        window.screen.availWidth < window.screen.availHeight
          ? window.screen.availWidth
          : window.screen.availHeight;

      // 首先判断屏幕是否本身就是16:9的比例，若是则默认全屏显示，且不显示全屏显示，若不是该比例则显示
      if (
        Number(
          (this.screen.totalWidth / this.screen.totalHeight).toFixed(1)
        ) === 1.8
      ) {
        this.showFullScreenSwitch = false;
        this.screen.rate =
          (this.screen.totalHeight * 16) / (9 * this.screen.totalWidth);
        this.screen.top = 0;
        this.screen.left =
          ((1 - this.screen.rate) / 2) * this.screen.totalWidth;
        this.screen.videosWidth = this.screen.rate * this.screen.totalWidth;
        this.screen.videosHeight = this.screen.totalHeight;
        this.videoStyle = {
          width: this.screen.videosWidth + 'px',
          height: this.screen.videosHeight + 'px',
          marginLeft: this.screen.left + 'px',
          marginTop: this.screen.top + 'px'
        }
        console.log('111---phone 11', this.screen)
      } else {
        this.showFullScreenSwitch = true;
        if (this.fullScreenShow) {
          this.fullScreen_index = 1;
          if ((this.screen.totalHeight * 16) / 9 <= this.screen.totalWidth) {
            this.screen.rate =
              (this.screen.totalHeight * 16) / (9 * this.screen.totalWidth);
            this.screen.top = 0;
            this.screen.left =
              ((1 - this.screen.rate) / 2) * this.screen.totalWidth - 42;
            this.screen.videosWidth =
              this.screen.rate * this.screen.totalWidth + 84;
            this.screen.videosHeight = this.screen.totalHeight;
            this.screen.changeRatioHeight = (this.screen.videosWidth / 16) * 9;
            this.videoStyle = {
              width: this.screen.videosWidth + 'px',
              height: this.screen.videosHeight + 'px',
              marginLeft: this.screen.left + 'px',
              marginTop: this.screen.top + 'px'
            }
            console.log('222---phone 11', this.screen)
          } else {
            if ((this.screen.totalWidth * 9) / 16 <= this.screen.totalHeight) {
              this.screen.videosWidth = this.screen.totalWidth;
              this.screen.videosHeight = this.screen.totalHeight
              this.screen.changeRatioHeight = (this.screen.videosWidth / 16) * 9;
              console.log('王者荣耀1')
            } else {
              this.adaptScreen(this.screen.totalWidth, this.screen.totalHeight);
              this.screen.changeRatioHeight = (this.screen.videosWidth / 16) * 9;
              this.screen.videosHeight = this.screen.totalHeight
              console.log('绝地求生1')
            }
            this.screen.top =
              (this.screen.totalHeight - this.screen.videosHeight) / 2;
            this.screen.left =
              (this.screen.totalWidth - this.screen.videosWidth) / 2;
            this.videoStyle = {
              width: this.screen.videosWidth + 'px',
              height: this.screen.videosHeight + 'px',
              marginLeft: this.screen.left + 'px',
              marginTop: this.screen.top + 'px'
            }
            console.log(this.screen)
          }
        } else {
          this.fullScreen_index = 2;
          if ((this.screen.totalHeight * 16) / 9 <= this.screen.totalWidth) {
            this.screen.rate =
              (this.screen.totalHeight * 16) / (9 * this.screen.totalWidth);
            this.screen.top = 0;
            this.screen.left =
              ((1 - this.screen.rate) / 2) * this.screen.totalWidth;
            this.screen.videosWidth = this.screen.rate * this.screen.totalWidth;
            this.screen.videosHeight = this.screen.totalHeight;
            console.log('333---phone 11', this.screen)
          } else {
            if ((this.screen.totalWidth * 9) / 16 <= this.screen.totalHeight) {
              this.screen.videosWidth = this.screen.totalWidth;
              this.screen.videosHeight = (this.screen.totalWidth * 9) / 16;
              console.log('王者荣耀2')
            } else {
              this.adaptScreen(this.screen.totalWidth, this.screen.totalHeight);
              console.log('绝地求生2')
            }
            this.screen.top =
              (this.screen.totalHeight - this.screen.videosHeight) / 2;
            this.screen.left =
              (this.screen.totalWidth - this.screen.videosWidth) / 2;
          }
          this.videoStyle = {
            width: this.screen.videosWidth + 'px',
            height: this.screen.videosHeight + 'px',
            marginLeft: this.screen.left + 'px',
            marginTop: this.screen.top + 'px'
          }
          console.log(this.screen)
        }
      }
      
      // 初始化鼠标样式位置及相对位置, 以及初始化悬浮球的位置
      setTimeout(() => {
        if (this.firstMoveMouse) {
          // 悬浮球初始位置
          $(".btnIcon")[0].style.right = 40 + this.screen.left + "px";

          this.mouseLeft = this.screen.videosWidth / 2;
          this.mouseTop = this.screen.videosHeight / 2;
          this.mouseData.mousePositionX = Math.floor(
            (this.mouseLeft / this.screen.videosWidth) * 32767
          );
          this.mouseData.mousePositionY = Math.floor(
            (this.mouseTop / this.screen.videosHeight) * 32767
          );
          this.firstMoveMouse = false;
        }
      }, 500)
    },
    adaptScreen(x, y) {
      let a = x;
      let b = y;
      let c = 0;
      b -= 10;
      if ((b * 16) / 9 > a) {
        this.adaptScreen(a, b);
      } else {
        a = (b * 16) / 9;
        if (this.fullScreenShow) {
          this.screen.videosWidth = a;
          this.screen.videosHeight = b;
        } else {
          this.screen.videosWidth = a;
          this.screen.videosHeight = b;
        }
      }
    }
  }
}