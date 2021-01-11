import tools from "@/utils/tools";

export default {
  methods: {
    // 组件传来的按下按键的处理方法
    transferData(item, customizBtn, index) {
      if (
        ["左键", "中键", "右键", "开火", "移动射击"].includes(
          item.keyRealName || item.key || item.keyName
        )
      ) {
        item.keyPressMode == "2"
          ? this.lockMouse(customizBtn, index)
          : this.mouseDown(customizBtn, index);
      } else if (["滚轮上", "滚轮下"].includes(item.key || item.keyName)) {
        item.keyPressMode == "2"
          ? this.lockWheel(customizBtn, index)
          : this.wheelDown(customizBtn, index);
      } else {
        item.keyPressMode == "2"
          ? this.lockBtn(item, index)
          : this.whichKey(item, index);
      }
    },
    // 组件传来的抬起按键的处理方法
    returnData(item, customizBtn, index) {
      if (
        ["左键", "中键", "右键", "开火", "移动射击"].includes(
          item.keyRealName || item.key || item.keyName
        )
      ) {
        this.mouseUp(customizBtn);
      } else if (
        ["滚轮上", "滚轮下"].includes(
          item.keyRealName || item.key || item.keyName
        )
      ) {
        this.wheelUp(customizBtn);
      } else {
        item.keyPressMode == "2"
          ? this.lockBtn(item, index)
          : this.KeyEnd(item);
      }
    },
    // 开火键(可同时开火和控制视角转动) -- touchStart
    fireStart (e) {
      this.mouseData.mousePositionX = Math.floor(
        (this.mouseLeft / this.screen.videosWidth) * 32767
      );
      this.mouseData.mousePositionY = Math.floor(
        (this.mouseTop / this.screen.videosHeight) * 32767
      );
      this.mouseData.lastPositionX = e.targetTouches[0].pageX;
      this.mouseData.lastPositionY = e.targetTouches[0].pageY;
      this.fireAnglePosition.x = e.targetTouches[0].pageX
      this.fireAnglePosition.y = e.targetTouches[0].pageY
      this.screen.mouseX = this.mouseLeft + this.screen.left;
      this.screen.mouseY = this.mouseTop + this.screen.top;
    },
    // 开火键(可同时开火和控制视角转动) -- touchMove
    fireAngle (e) {
      let clickMouseX, clickMouseY
      clickMouseX = e.targetTouches[0].pageX;
      clickMouseY = e.targetTouches[0].pageY;
      if (this.isHorizontalScreen) {
        this.mouseLeft += (clickMouseX - this.fireAnglePosition.x) * this.mouseSpeed;
        this.mouseTop += (clickMouseY - this.fireAnglePosition.y) * this.mouseSpeed;
        this.mouseData.mouseMovementX =
            clickMouseX - this.mouseData.lastPositionX +
            this.mouseData.mouseMovementX;
        this.mouseData.mouseMovementY =
            clickMouseY - this.mouseData.lastPositionY +
            this.mouseData.mouseMovementY;
        this.mouseData.mouseMovementX = this.mouseData.mouseMovementX * this.mouseSpeed
        this.mouseData.mouseMovementY = this.mouseData.mouseMovementY * this.mouseSpeed
      } else {
        this.mouseLeft -= (clickMouseY - this.fireAnglePosition.y) * this.mouseSpeed;
        this.mouseTop += (clickMouseX - this.fireAnglePosition.x) * this.mouseSpeed;
        //竖屏数据传递
        //水平方向
        this.mouseData.mouseMovementX = -(
          clickMouseY -
          this.mouseData.lastPositionY +
          this.mouseData.mouseMovementX
        );
        //垂直方向
        this.mouseData.mouseMovementY =
          clickMouseX -
          this.mouseData.lastPositionX +
          this.mouseData.mouseMovementY;
        this.mouseData.mouseMovementX =
          this.mouseData.mouseMovementX * this.mouseSpeed;
        this.mouseData.mouseMovementY =
          this.mouseData.mouseMovementY * this.mouseSpeed;
      }
      if (this.mouseLeft <= 0) {
        this.mouseLeft = 0;
      }
      if (this.mouseTop <= 0) {
        this.mouseTop = 0;
      }
      if (this.mouseLeft >= this.screen.videosWidth - 5) {
        this.mouseLeft = this.screen.videosWidth - 5;
      }
      if (this.mouseTop >= this.screen.videosHeight - 10) {
        this.mouseTop = this.screen.videosHeight - 10;
      }
      this.mouseData.lastPositionX = clickMouseX;
      this.mouseData.lastPositionY = clickMouseY;
      this.fireAnglePosition.x = clickMouseX
      this.fireAnglePosition.y = clickMouseY
      this.mouseData.mousePositionX = Math.floor(
        (this.mouseLeft / this.screen.videosWidth) * 32767
      );
      this.mouseData.mousePositionY = Math.floor(
        (this.mouseTop / this.screen.videosHeight) * 32767
      );
    },
    // 开火键(可同时开火和控制视角转动) -- touchEnd
    fireUp (e) {
      if (this.isPress) {
        this.isPress = false;
        this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
      }
      let that = this
      if (this.mouseData.mouseClickFlag == 0x01) {
        setTimeout(function () {
          that.mouseData.mouseClickFlag &= that.MouseLift.LeftClickUp;
        }, 10);
      } else if (
        this.mouseData.mouseClickFlag == 0x02 ||
        this.isRight ||
        e.rightClick
      ) {
        setTimeout(() => {
          this.mouseData.mouseClickFlag = 0;
          if (this.isRight) {
            this.isRight = false;
          }
        }, 10);
      } else {
        this.mouseData.mouseClickFlag = 0;
      }
    },
    //键盘按下事件
    whichKey(which, index) {
      console.log("摁下", which,index);
      which.key = which.keyRealName || which.keyName || which.key;
      this.isBoo = index;
      this.activeClass = index;
      this.isBtn = 2;
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.key === 'Ctrl(L)' ||
        which.keyName === "Ctrl"
      ) {
        this.controlCode |= this.SpecialKey.LeftCtrl;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.key === "Shift(L)" ||
        which.key === "SHIFT(R)" ||
        which.keyName === "Shift"
      ) {
        this.inputStatus = !this.inputStatus;
        this.controlCode |= this.SpecialKey.LeftShift;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
        which.key === "Alt(L)" ||
        which.keyName === "Alt"
      ) {
        this.controlCode |= this.SpecialKey.LeftAlt;
      } else if (
        which.key === "Meta" ||
        which.key === "WIN" ||
        which.keyName === "win"
      ) {
        this.controlCode |= this.SpecialKey.LeftWin;
      } else if (["大写", "小写"].includes(which.key)) {
        this.keyStatus = this.keyStatus == 1 ? 0 : 1;
        // 问题大小写切换
        let newList = this.allKeys;
        this.allKeys = this.CapsallKeys;
        this.CapsallKeys = newList;
      } else if (which.key === "CTRL(R)") {
        this.controlCode |= this.SpecialKey.RightCtrl;
      } else if (which.key === "SHIFT(R)") {
        this.controlCode |= this.SpecialKey.RightShift;
      } else if (which.key === "ALT(R)") {
        this.controlCode |= this.SpecialKey.RightAlt;
      } else if (which.key === "隐藏") {
      } else if (which.key === "@") {
        this.keySignDown(which);
      } else if (which.key === "符") {
        this.panel = true;
        this.allKey = false;
        this.SpeKey = false;
        this.signKey = true;
      } else if (which.key === "控制码") {
        this.panel = true;
        this.allKey = false;
        this.signKey = false;
        this.SpeKey = true;
      } else if (which.key === "返回") {
        this.panel = true;
        this.allKey = true;
        this.SpeKey = false;
        this.signKey = false;
      } else {
        if (this.keyArray.length >= this.MaxPressKeys) {
          return;
        }
        let keyVal = which.keyCode;
        for (let i = 0; i < this.keyArray.length; i++) {
          if (this.keyArray[i] == keyVal) {
            return;
          }
        }
        this.set_key(which.keyCode);
        // this.sendingOperation()
      }
    },

    // 特殊符号
    keySignDown(item, index) {
      //this.tracelog("special sign down");
      this.activeClass = index;
      this.isBtn = 2;
      //this.tracelog(item);
      if (item.len == 0 && item.key === "中/英") {
        this.inputStatus = !this.inputStatus;
        this.controlCode |= this.SpecialKey.LeftShift;
      }
      if (this.keyArray.length >= this.MaxPressKeys) {
        return;
      }
      for (let i = 0; i < this.keyArray.length; i++) {
        if (this.keyArray[i] == item.keyCode) {
          return;
        }
      }
      if (item.len == 1) {
        //this.tracelog("item len 1");
        this.set_key(item.keyCode);
      } else if (item.len == 2) {
        //this.tracelog("item len 2");
        this.controlCode |= this.SpecialKey.LeftShift;
        this.set_key(item.keyCode);
        //this.tracelog(this.keyArray);
      } else if (item.len == 0 && item.key === "返回") {
        this.panel = true;
        this.allKey = true;
        this.signKey = false;
        this.SpeKey = false;
      }
    },

    // 即时与锁定按键
    lockBtn(item, index) {
      item.key = item.keyRealName || item.keyName || item.key || item.value;
      this.isBtn = 2;
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      if (this.isLockBtn[index] == true) {
        this.isBoo = index;
        this.lockActive[index] = index + 100;
        if (
          item.value == "ControlLeft" ||
          item.key === "Control" ||
          item.key === "CTRL(L)" ||
          item.key === "Ctrl" ||
          item.keyName === "Ctrl"
        ) {
          this.controlCode |= this.SpecialKey.LeftCtrl;
          console.log("ctrl按下");
        } else if (
          item.value == "Shift" ||
          item.key === "Shift" ||
          item.key === "中/英" ||
          item.key === "SHIFT(L)" ||
          item.key === "SHIFT(R)" ||
          item.keyName === "Shift"
        ) {
          this.lockBtnInputStatusCount++;
          if (this.lockBtnInputStatusCount === 2) {
            this.inputStatus = !this.inputStatus;
            this.lockBtnInputStatusCount = 0;
          }
          this.controlCode |= this.SpecialKey.LeftShift;
          // console.log("shift按下");
        } else if (item.value == "ControlRight") {
          this.controlCode |= this.SpecialKey.RightCtrl;
          // console.log("ctrlR按下");
        } else if (item.key == "Alt" || item.keyName === "Alt") {
          console.log('alt按下11')
          this.controlCode |= this.SpecialKey.LeftAlt;
        } else if (item.key == "win" || item.keyName === "Shift") {
          this.controlCode |= this.SpecialKey.LeftWin;
        } else {
          if (this.keyArray.length >= this.MaxPressKeys) {
            return;
          }
          let keyVal = item.keyCode;
          for (let i = 0; i < this.keyArray.length; i++) {
            if (this.keyArray[i] == keyVal) {
              return;
            }
          }
          this.set_key(item.keyCode);
        }
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.lockActive[index] = -1;
        if (
          item.value == "ControlLeft" ||
          item.key === "Control" ||
          item.key === "CTRL(L)" ||
          item.key === "Ctrl"
        ) {
          this.controlCode &= this.KeyInvCode.LeftCtrlM;
          // console.log("Ctrl抬起");
        } else if (
          item.value == "Shift" ||
          item.key === "Shift" ||
          item.key === "中/英" ||
          item.key === "SHIFT(L)" ||
          item.key === "SHIFT(R)"
        ) {
          this.inputStatus = !this.inputStatus;
          this.controlCode &= this.SpecialKey.LeftShiftM;
          // console.log("shift抬起");
        } else if (item.value == "ControlRight") {
          this.controlCode &= this.SpecialKey.RightCtrlM;
          // console.log("CtrlR抬起");
        } else if (item.key == "Alt") {
          this.controlCode &= this.KeyInvCode.LeftAltM;
          console.log("alt抬起");
        } else if (item.key == "win") {
          this.controlCode &= this.SpecialKey.LeftWin;
        } else {
          this.delete_key(item.keyCode);
        }
      }
    },
    // 即时与按住鼠标
    lockMouse(item, index) {
      this.isBtn = 2;
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      if (this.isLockBtn[index]) {
        this.isBoo = index;
        this.mouseDown(item, index);
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.mouseUp(item);
      }
    },
    // 滚轮的计时与锁定
    lockWheel(item, index) {
      let timer;
      this.isBtn = 2;
      let that = this;
      // console.log("clearTimer1");
      clearInterval(timer);
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      console.log(this.isLockBtn[index]);
      if (this.isLockBtn[index]) {
        this.isBoo = index;
        timer = setInterval(function () {
          // console.log("timer");
          // console.log(item);
          // console.log(index);
          that.wheelDown(item, index);
          if (!that.isLockBtn[index]) {
            // console.log("clearTimer2");
            that.isLockBtn[index] = false;
            clearInterval(timer);
          }
        }, 100);
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.wheelUp(item);
        this.isLockBtn[index] = false;
        // console.log("clearTimer3");
        clearInterval(timer);
      }
    },
    // 键盘抬起事件
    KeyEnd(which, event) {
      console.log("抬起", which);
      which.key = which.keyRealName || which.keyName || which.key;
      this.isBoo = -1;
      this.activeClass = -1;
      //this.tracelog("key touch end up");
      let keyVal = which.keyCode;
      //this.tracelog(which);
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.key === 'Ctrl(L)' ||
        which.keyName === "Ctrl"
      ) {
        this.controlCode &= this.KeyInvCode.LeftCtrlM;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.key === "Shift(L)" ||
        which.key === "SHIFT(R)" ||
        which.keyName === "Shift"
      ) {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
        which.key === "Alt(L)" ||
        which.keyName === "Alt"
      ) {
        this.controlCode &= this.KeyInvCode.LeftAltM;
      } else if (
        which.key === "Meta" ||
        which.key === "WIN" ||
        which.keyName === "win"
      ) {
        this.controlCode &= this.KeyInvCode.LeftWinM;
      } else if (which.key === "@") {
        this.keySpecailUp(which);
      } else if (which.key === "大写") {
        return;
      } else if (which.key === "CTRL(R)") {
        this.controlCode &= this.KeyInvCode.RightCtrlM;
      } else if (which.key === "SHIFT(R)") {
        this.controlCode &= this.KeyInvCode.RightShiftM;
      } else if (which.key === "ALT(R)") {
        this.controlCode &= this.KeyInvCode.RightAltM;
      } else if (
        which.key === "隐藏" ||
        which.key === "符" ||
        which.key === "控制码" ||
        which.key === "返回"
      ) {
        return;
      } else {
        this.delete_key(which.keyCode);
      }
    },
    // 特殊按键的抬起
    keySpecailUp(item) {
      //this.tracelog("specail key end up");
      // this.isBtn = 1;
      this.activeClass = -1;
      //this.tracelog(item);
      if (item.len === 1) {
        this.delete_key(item.keyCode);
      } else if (item.len === 2) {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
        this.delete_key(item.keyCode);
      } else if (item.key === "中/英") {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
      }
    },
    // 鼠标按键点击
    mouseDown(btn, index) {
      this.isBoo = index;
      this.isBtn = 2;
      this.activeClass = index + 200;
      if (btn.button == 0) {
        this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
      } else if (btn.button == 1) {
        this.mouseData.mouseClickFlag |= this.MousePress.MidClick;
      } else if (btn.button == 2) {
        this.mouseData.mouseClickFlag |= this.MousePress.RightClick;
      }
    },
    // 鼠标按键抬起
    mouseUp(btn) {
      // event.preventDefault()
      this.isBoo = -1;
      this.activeClass = -1;
      if (btn.button == 0) {
        this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
      } else if (btn.button == 1) {
        this.mouseData.mouseClickFlag &= this.MouseLift.MidClickUp;
      } else if (btn.button == 2) {
        this.mouseData.mouseClickFlag &= this.MouseLift.RightClickUp;
      }
    },
    // 滚轮事件
    wheelDown(item, index) {
      this.isBoo = index;
      this.isBtn = 2;
      this.activeClass = index + 100;
      if (item.value == 1) {
        this.mouseData.mouseWheelData = 1;
      } else if (item.value == -1) {
        this.mouseData.mouseWheelData = -1;
      }
    },
    wheelUp(item) {
      this.isBoo = -1;
      this.activeClass = -1;
      // this.isBtn = 1;
    },
    // 长按操作 按下
    press(e) {
      // console.log('press事件',this.showNavBar)
      if (this.showNavBar) return;
      if (
        e.target &&
        Object.prototype.toString.call(e.target) === "[object HTMLVideoElement]"
      ) {
        // this.traceLog("触发长按操作");
        if (!this.isPress) {
          this.isPress = true;
          if (!this.mouseMode) {
            // console.log('press事件',this.showNavBar)
            this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
          }
        }
      }
    },
    // 长按操作 抬起
    pressup(e) {
      // console.log('pressup事件',this.showNavBar)
      if (this.showNavBar) return;
      // this.traceLog("长按放开：");
      if (this.isPress) {
        this.isPress = false;
        if (!this.mouseMode) {
          console.log('抬起',this.mouseMode)
          this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
        }
      }
    },
    // 移动鼠标方法 touchStart
    gestureTouchStart(e) {
      console.log('点击开始',this.showNavBar)
      if (this.showNavBar) {
        this.setMoveItem(true);
        return;
      }
      if(this.isLockBtn[888]){
        this.lockBtn({key: "Alt",keyCode: 18,keyPressMode: 2},888)
        this.whichKey({key: "空格",keyCode: 32},34);
        this.KeyEnd({key: "空格",keyCode: 32},34);
      }
      let that = this;
      if (
        Object.prototype.toString.call(e.target) === "[object HTMLVideoElement]"
      ) {
        this.setJudgeTouchStart(true);
      }
      this.$set(this, "muteStatus", false);
      if ($("#remoteVideo")[0].paused) {
        $("#remoteVideo")[0].play();
      }
      if (this.mouseMode) {
        clearTimeout(this.touchAnimationTime);
        if (e.touches && e.touches[0].target.id === "remoteVideo") {
          this.waveLeft = e.targetTouches[0].pageX;
          this.waveTop = e.targetTouches[0].pageY;
          this.showWaves = true;
        }
      } else {
        this.mouseData.mousePositionX = Math.floor(
          (this.mouseLeft / this.screen.videosWidth) * 32767
        );
        this.mouseData.mousePositionY = Math.floor(
          (this.mouseTop / this.screen.videosHeight) * 32767
        );
        if (e.targetTouches && e.targetTouches.length === 1) {
          this.mouseData.lastPositionX = e.targetTouches[0].pageX;
          this.mouseData.lastPositionY = e.targetTouches[0].pageY;
        } else if (e.targetTouches && e.targetTouches.length === 2) {
          Array.prototype.slice
            .call(e.targetTouches)
            .forEach((value, index) => {
              that.mouseData.lastPositionX = e.targetTouches[index].pageX;
              that.mouseData.lastPositionY = e.targetTouches[index].pageY;
            });
        }
        let mouseX = this.mouseLeft;
        let mouseY = this.mouseTop;
        this.current.left = mouseX;
        this.current.top = mouseY;
        this.current.right = this.screen.totalWidth - mouseX;
        this.current.bottom = this.screen.totalHeight - mouseY;
        this.screen.mouseX = this.mouseLeft + this.screen.left;
        this.screen.mouseY = this.mouseTop + this.screen.top;
      }
    },
    // 移动鼠标方法 touchMove
    pressMove(e) {
      if (this.showNavBar) return;
      if (this.mouseMode) {
      } else {
        let clickMouseX, clickMouseY;
        if (this.isRight) return;
        if (e.targetTouches && e.targetTouches.length === 1) {
          clickMouseX = e.targetTouches[0].pageX;
          clickMouseY = e.targetTouches[0].pageY;
        } else if (e.targetTouches && e.targetTouches.length === 2) {
          Array.prototype.slice
            .call(e.targetTouches)
            .forEach((value, index) => {
              if (value.target.id === "remoteVideo") {
                clickMouseX = e.targetTouches[index].pageX;
                clickMouseY = e.targetTouches[index].pageY;
              }
            });
        }
        // if (this.tapFlag) {
        //   this.tapFlag = false;
        //   this.mouseData.mouseClickFlag = 0;
        // }
        // if (e.tapTheScreen) {
        //   this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        // }
        if (e.moveMouse) {
          this.mouseData.mouseClickFlag = 0;
        }

        if (this.mouseSpeed == 1) {
          if (this.isHorizontalScreen) {
            this.mouseLeft += e.deltaX;
            this.mouseTop += e.deltaY;
            this.mouseData.mouseMovementX =
              clickMouseX -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementX;
            this.mouseData.mouseMovementY =
              clickMouseY -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementY;
          } else {
            this.mouseLeft -= e.deltaY;
            this.mouseTop += e.deltaX;
            //竖屏数据传递
            //水平方向
            this.mouseData.mouseMovementX = -(
              clickMouseY -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementX
            );
            //垂直方向
            this.mouseData.mouseMovementY =
              clickMouseX -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementY;
          }
        } else {
          if (this.isHorizontalScreen) {
            this.mouseLeft += e.deltaX * this.mouseSpeed;
            this.mouseTop += e.deltaY * this.mouseSpeed;
            this.mouseData.mouseMovementX =
              clickMouseX -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementX;
            this.mouseData.mouseMovementY =
              clickMouseY -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementY;
            this.mouseData.mouseMovementX =
              this.mouseData.mouseMovementX * this.mouseSpeed;
            this.mouseData.mouseMovementY =
              this.mouseData.mouseMovementY * this.mouseSpeed;
          } else {
            this.mouseLeft -= e.deltaY * this.mouseSpeed;
            this.mouseTop += e.deltaX * this.mouseSpeed;
            //竖屏数据传递
            //水平方向
            this.mouseData.mouseMovementX = -(
              clickMouseY -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementX
            );
            //垂直方向
            this.mouseData.mouseMovementY =
              clickMouseX -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementY;
            this.mouseData.mouseMovementX =
              this.mouseData.mouseMovementX * this.mouseSpeed;
            this.mouseData.mouseMovementY =
              this.mouseData.mouseMovementY * this.mouseSpeed;
          }
        }

        if (this.mouseLeft <= 0) {
          this.mouseLeft = 0;
        }
        if (this.mouseTop <= 0) {
          this.mouseTop = 0;
        }
        if (this.mouseLeft >= this.screen.videosWidth - 5) {
          this.mouseLeft = this.screen.videosWidth - 5;
        }
        if (this.mouseTop >= this.screen.videosHeight - 10) {
          this.mouseTop = this.screen.videosHeight - 10;
        }

        this.mouseData.lastPositionX = clickMouseX;
        this.mouseData.lastPositionY = clickMouseY;
        this.mouseData.mousePositionX = Math.floor(
          (this.mouseLeft / this.screen.videosWidth) * 32767
        );
        this.mouseData.mousePositionY = Math.floor(
          (this.mouseTop / this.screen.videosHeight) * 32767
        );
      }
    },
    // 移动鼠标方法 touchEnd
    gestureTouchEnd(e) {
      if (this.showNavBar) return;
      // e.preventDefault();
      if (event.srcElement.id === "remoteVideo") {
        if (tools.judgeClient() !== "Android") {
          e.stopPropagation();
          e.preventDefault();
        }
      } else {
        return;
      }
      if (this.mouseMode) {
        this.touchAnimationTime = setTimeout(() => {
          this.showWaves = false;
        }, 1000);
      } else {
        if (this.isPress) {
          this.isPress = false;
          // console.log('press抬起-------')
          this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
        }
        if (e.holdClick) {
          // console.log('555555555555555555555555555')
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
        if (e.rightClick && !e.threeFingerClick) {
          this.mouseData.mouseClickFlag = 0;
          this.isRight = true;
          this.mouseData.mouseClickFlag |= this.MousePress.RightClick;
        }
        if (e.threeFingerClick) {
          if (this.threeFingerClickFlag) {
            this.threeFingerClickFlag = false
            return
          }
          this.threeFingerClickFlag = true
          this.setShowTextKeyboard(true);
        }
        let that = this;
        if (this.mouseData.mouseClickFlag == 0x01) {
          setTimeout(function () {
            console.log("触摸结束，鼠标左键抬起");
            that.mouseData.mouseClickFlag &= that.MouseLift.LeftClickUp;
          },10);
        } else if (
          this.mouseData.mouseClickFlag == 0x02 ||
          this.isRight ||
          e.rightClick
        ) {
          // this.traceLog("window touch end，右键抬起");
          setTimeout(() => {
            this.mouseData.mouseClickFlag = 0;
            if (this.isRight) {
              this.isRight = false;
            }
          }, 10);
        } else {
          this.mouseData.mouseClickFlag = 0;
        }
      }
    },
    // tap方法
    tap(event) {
      console.log("tap事件", this.showNavBar);
      if (this.showNavBar) return;
      if (
        event.target &&
        Object.prototype.toString.call(event.target) ===
          "[object HTMLVideoElement]"
      ) {
        this.tapFlag = true;
        if (!this.mouseMode) {
          console.log('鼠标摁下')
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
      }
    },
    // 开启定时发送
    intervalKMSendingStart() {
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      // this.mouseData.lastPositionX = this.mouseData.mousePositionX + this.mouseData.mouseMovementX;
      // this.mouseData.lastPositionY = this.mouseData.mousePositionY + this.mouseData.mouseMovementY;
      this.mouseData.mouseMovementX = 0;
      this.mouseData.mouseMovementY = 0;
      if (this.KeyMouseIntervalId != null) {
        clearInterval(this.KeyMouseIntervalId);
        this.KeyMouseIntervalId = null;
      }
      this.KeyMouseIntervalId = setInterval(this.intervalKMExecute, 5);

      // this.KeyMouseIntervalId = setInterval(this.intervalKMExecute, 5000)
    },
    // 关闭定时发送
    intervalKMSendingClose() {
      if (this.KeyMouseIntervalId != null) {
        clearInterval(this.KeyMouseIntervalId);
        this.KeyMouseIntervalId = null;
      }
    },
    // 定时执行此函数
    intervalKMExecute() {
      if (this.mouseData.mouseMovementX < -127) {
        this.mouseData.mouseMovementX = -127;
      } else if (this.mouseData.mouseMovementX > 127) {
        this.mouseData.mouseMovementX = 127;
      }
      if (this.mouseData.mouseMovementY < -127) {
        this.mouseData.mouseMovementY = -127;
      } else if (this.mouseData.mouseMovementY > 127) {
        this.mouseData.mouseMovementY = 127;
      }
      // 操作数据发送
      this.sendingOperation();

      // // 虚拟手柄设备状态更新
      if (this.gamepadDeviceStatusFlag !== null) {
        this.gamepadDeviceStatus()
      }

      // // 虚拟手柄数据发送
      if (this.gamepadInfo.flag) {
        this.sendingGamepadOperation()
      }

      // this.mouseData.curPositionX = this.mouseData.mousePositionX + this.mouseData.mouseMovementX;
      // this.mouseData.curPositionY = this.mouseData.mousePositionY + this.mouseData.mouseMovementY;
      this.mouseData.mouseMovementX = 0;
      this.mouseData.mouseMovementY = 0;
      this.mouseData.mouseWheelData = 0;
    },
    // 发送键鼠消息
    sendingOperation() {
      // 构造待发送的数据

      let sendingMessage = new Uint8Array(
        this.MinKeyMouseDataSize + this.MaxPressKeys
      ); // 键鼠数据数据包
      sendingMessage[0] = this.keyMouseFlag;
      sendingMessage[1] = this.MouseFlag | this.KeyFlag;
      sendingMessage[2] = Math.round(this.mouseData.mouseWheelData); // 鼠标滚轮轮动距离
      sendingMessage[3] = this.mouseData.mouseClickFlag; // 鼠标点击状态
      if (sendingMessage[3] == this.MousePress.LeftClick) {
        console.log("左键信息发送至服务器.....................");
      }
      // 绝对坐标
      sendingMessage[4] = this.mouseData.mousePositionX & 0xff;
      sendingMessage[5] = (this.mouseData.mousePositionX >> 8) & 0xff;
      sendingMessage[6] = this.mouseData.mousePositionY & 0xff;
      sendingMessage[7] = (this.mouseData.mousePositionY >> 8) & 0xff;
      // 相对位移
      sendingMessage[8] = (this.mouseData.mouseMovementX * 2) & 0xff;
      sendingMessage[9] = ((this.mouseData.mouseMovementX * 2) >> 8) & 0xff;
      sendingMessage[10] = (this.mouseData.mouseMovementY * 2) & 0xff;
      sendingMessage[11] = ((this.mouseData.mouseMovementY * 2) >> 8) & 0xff;
      // 控制码
      sendingMessage[12] = this.controlCode;
      // 键盘状态
      sendingMessage[13] = this.keyStatus;
      let newKeyArray = [...this.keyArray, ...this.btnKeyArray];
      sendingMessage[14] = newKeyArray.length;
      // 具体按键keycode
      for (let i = 0; i < newKeyArray.length; i++) {
        sendingMessage[15 + i] = newKeyArray[i];
      }
      if (this.connChannel) this.connChannel.send(sendingMessage);
    },
    // 发送虚拟手柄消息
    sendingGamepadOperation () {
      let sendingGamepadMessage = new Uint8Array(15) // 虚拟手柄数据包
      sendingGamepadMessage[0] = 3
      sendingGamepadMessage[1] = 4
      if ([0x01, 0x02, 0x80, 0x40, 0x20, 0x10].includes(this.gamepadInfo.highKeyStatus)) {
        sendingGamepadMessage[3]= sendingGamepadMessage[3] | this.gamepadInfo.highKeyStatus
      } else {
        sendingGamepadMessage[3] = 0
      }
      if ([0x10, 0x20, 0x40, 0x80, 0x01, 0x02, 0x04, 0x08].includes(this.gamepadInfo.lowKeyStatus)) {
        sendingGamepadMessage[2] = sendingGamepadMessage[2] | this.gamepadInfo.lowKeyStatus
      } else {
        sendingGamepadMessage[2] = 0
      }

      sendingGamepadMessage[4] = this.gamepadInfo.leftTrigger
      sendingGamepadMessage[5] = this.gamepadInfo.rightTrigger

      sendingGamepadMessage[6] = this.gamepadInfo.leftThumbX & 0xff
      sendingGamepadMessage[7] = (this.gamepadInfo.leftThumbX >> 8) & 0xff

      sendingGamepadMessage[8] = this.gamepadInfo.leftThumbX & 0xff
      sendingGamepadMessage[9] = (this.gamepadInfo.leftThumbY >> 8) & 0xff

      sendingGamepadMessage[10] = this.gamepadInfo.rightThumbX & 0xff
      sendingGamepadMessage[11] = (this.gamepadInfo.rightThumbX >> 8) & 0xff

      sendingGamepadMessage[12] = this.gamepadInfo.rightThumbY & 0xff
      sendingGamepadMessage[13] = (this.gamepadInfo.rightThumbY >> 8) & 0xff

      sendingGamepadMessage[14] = 0

      if (this.connChannel) this.connChannel.send(sendingGamepadMessage)

      if (sendingGamepadMessage[2] || sendingGamepadMessage[3]) {
        console.log('按下手柄按键', sendingGamepadMessage[2] || sendingGamepadMessage[3])
      }
    },
    // 虚拟手柄设备状态更新
    gamepadDeviceStatus () {
      this.gamepadDeviceStatusSendCount++
      if (this.gamepadDeviceStatusSendCount === 3) {
        this.gamepadDeviceStatusFlag = null
        this.gamepadDeviceStatusSendCount =0
      }
      let gamepadStatus = new Uint8Array(3)
      gamepadStatus[0] = 4
      gamepadStatus[1] = 4
      gamepadStatus[2] = this.gamepadInfo.flag ? 1 : 0

      if (this.connChannel) this.connChannel.send(gamepadStatus)
      console.log('发送虚拟手柄设备状态' + (this.gamepadInfo.flag ? '连接' : '移除'))
    }
  }
}