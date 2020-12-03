import Connect from "../components/connect";
import tools from "@/utils/tools";
import connectApi from "@/api/system.js";
import util from "../common/libs/util.crypto";
import websocket from "../common/libs/websocket.js";
import "../common/ufo/index";
import GamepadListener from '../directives/Gamepad/GamepadListener'
import { mappings } from '../directives/Gamepad/mappings'
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    "connect-item": Connect,
    cloudComputerCustom: window['cloud-computer-custom'].cloudComputerCustom
  },
  data() {
    return {
      // 连接流程
      loadingRate: 0,
      directSessionKeyHead: "11566D692A774BCA08F8", // 直联sessionKey
      directSessionKeyFull: "11566D692A774BCA08F81490F59C3018", // 直联sessionKey
      isLog: true,
      serverUsing: 0, // 服务正在使用次数
      onVideo: false, // 用户画面正在播放视频
      // 连接状态位
      everConnected: false, // 是否连接上了
      checkEverConnId: null, // 检查是否连接成功的延迟函数的id
      // 初始连接判断位
      videoReady: false, // 视频已准备完成
      dataChannelReady: false, // 数据通道已准备完成
      pausing: true, // 当前属于暂停连接(图层显示状态)
      connStatus: null, // 当前连接状态
      // 当前连接状态枚举
      connStatusFlag: {
        waitConnect: 0, // 未连接
        connectting: 1, // 正在连接
        connected: 2, // 已连接
        disconnected: 3, // 连接已断开
      },
      appOnly: false, // 是否是应用模式
      deviceMarkFlag: {
        ios: "ios",
        android: "android",
        mac: "mac",
        linux: "linux",
        windows: "win",
        wp: "wp",
        other: "other",
      },
      loadData: {
        ip: null,
        innerip: null,
        sessionKey: null,
        port: 58006,
        serverUrl: null,
        cid: 0,
        msg: "",
        appMsg: "",
      },
      // 用户充值引导
      path: null,
      freeIsEnd: false,
      memberFreeIsEnd: false,
      // loading图片
      UIloadingImg: true,
      hashKey: null,
      // 信令服务器相关
      sigServer: null, //当前代理服务器
      sigServerArr: null, // 代理服务器数组
      sigServerIndex: null, //代理服务器下标
      // webrtc相关
      peerConn: null,
      // 控制流相关
      controlIntervalId: "", // 控制流心跳定时器id
      controlIntervalTime: 0, // 控制流心跳发送间隔
      nonRespNum: 0, // 心跳未响应次数
      timeoutCount: 0, // 连接中超时次数
      timeoutTimes: 0, //连接中时长
      waittingSendArr: [], // 待重新发送的消息
      waittingSendInter: [], // 待重新发送的消息类型，与上面对应
      /* 错误码及提示数据 */
      stepStatus: 0, // 当前加载进度
      dialogStatus: 0, // 弹窗类型
      onErrorDialog: false, // 当前处于错误弹窗界面
      errorMsg: {
        1: "连接时间过长，建议结束后重新开始游戏。",
        2: "连接失败，请从官网进入游戏。",
        3: "连接失败，请尝试重新连接。",
        4: "正在其他页面上进行游戏，请不要重复连接。",
        5: "请在谷歌浏览器最新版本上连接使用。",
        6: "网络异常，请检查网络尝试重新连接。",
        7: "游戏启动失败，请更换大区或者联系客服。",
        8: "体验时间已结束，欢迎您使用其他服务！",
      },
      errorButtonMsg: {
        1: "结束游戏",
        2: "返回",
        3: "前往官网",
        4: "下载谷歌",
      },
      // ==================== preiviouse =====================
      isSidwbar: false, // 侧边栏
      isSub: false, //  出现二级菜单
      isBtn: 1, // 1.屏幕按键 2.按钮按键
      isPan: 1, // 1.屏幕按键 2.拖动悬浮球
      isBar: 1, // 1.屏幕按键 2.菜单栏
      isMode: false, //  鼠标模式的二级菜单
      isRight: false, // true右键，false非右键
      isPress: false, // 是否长按
      remoteStream: "",
      localStream: "",
      peerConn: null,
      connChannel: null,
      mediaStreamConstraints: {
        video: true,
        audio: true,
      },
      // 键鼠相关数据
      MinKeyMouseDataSize: 15, // 键鼠数据最短长度
      // MaxPressKeys: 6, // 最多按下键盘按键数目
      // 0: 数据包标识
      keyMouseFlag: 0x01,
      // 1: 设备标识
      MouseFlag: 0x01, // 低位1标识普通鼠标
      KeyFlag: 0x10, //  高位1标识普通键盘
      // 2: 滚轮数值
      // 3：鼠标按键标识
      MousePress: {
        LeftClick: 0x01, // 鼠标左键
        RightClick: 0x02, // 鼠标右键
        MidClick: 0x04, // 鼠标中键
      },
      // 鼠标按键标识对应反码，以供鼠标抬起时运算
      MouseLift: {
        LeftClickUp: 0xfe, // 鼠标左键标识 反码
        RightClickUp: 0xfd, // 鼠标右键标识 反码
        MidClickUp: 0xfb, // 鼠标中键标识 反码
      },
      // 4： 鼠标绝对坐标X低位
      // 5： 鼠标绝对坐标X高位
      // 6:  鼠标绝对坐标Y低位
      // 7： 鼠标绝对坐标Y高位
      // 8:  鼠标相对坐标X低位
      // 9： 鼠标相对坐标X高位
      // 10：鼠标相对坐标Y低位
      // 11：鼠标相对坐标Y高位
      // 12: 键盘控制码
      SpecialKey: {
        LeftCtrl: 0x01,
        LeftShift: 0x02,
        LeftAlt: 0x04,
        LeftWin: 0x08,
        RightCtrl: 0x10,
        RightShift: 0x20,
        RightAlt: 0x40,
        RightWin: 0x80,
      },
      KeyInvCode: {
        LeftCtrlM: 0xfe,
        LeftShiftM: 0xfd,
        LeftAltM: 0xfb,
        LeftWinM: 0xf7,
        RightCtrlM: 0xef,
        RightShiftM: 0xdf,
        RightAltM: 0xbf,
        RightWinM: 0x7f,
      },
      //  13: 键盘按键数量 (will be [0,6])
      //  14: 详细按键的键码 (长度与键盘按键数量等同)
      controlCode: 0,
      keyStatus: 0, // capsLock状态
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
      mouseData: {
        lastTime: 0, // 记录上次的时间戳
        lastPositionX: 0, // 记录移动前鼠标的位置
        lastPositionY: 0,
        mousescale: 1, //  移动的相对比例
        mousePositionX: 0, //  鼠标当前绝对坐标
        mousePositionY: 0,
        mouseMovementX: 0, //  鼠标当前相对位移
        mouseMovementY: 0,
        mouseWheelData: 0, // 鼠标滚轮数据
        mouseClickFlag: 0, // 鼠标点击状态
        xhotspot: 0, //  鼠标的热点
        yhotspot: 0,
        MoveTotalX: 0, // 记录鼠标一次移动中移动位置
        MoveTotalY: 0,
      },
      // webMouse: { // web端 鼠标左中右键键码
      //   WebLeftButton: 0,
      //   WebMidButton: 1,
      //   WebRightButton: 2
      // },
      //  键鼠数据定时发送定时器id
      KeyMouseIntervalId: null,
      isLockBtn: [], // 锁定按钮的抬起与放下，true按下，false抬起
      lockActive: [],
      // -----------test----------------// 强制横屏test
      data: "",
      dataImg: {},
      tada: "",
      sup_index: 0, // 问题19,
      sub_index: undefined,
      sum_index: 0,
      fullScreen_index: 0,

      // 码率延迟
      spcompIntervalId: null,
      byteRateSpeed: 0, //码率
      roundTripTime: 0, // 延迟
      packetRate: 0.0,

      // 引导图
      show: false,
      active: 1,
      guideList: [
        require("../assets/img/guide/10月优化_触控.png"),
        require("../assets/img/guide/10月优化_触控hold.png"),
        require("../assets/img/guide/10月优化_鼠标.png"),
        require("../assets/img/guide/10月优化_鼠标hold.png"),
        require("../assets/img/guide/触控_组1.png"),
        require("../assets/img/guide/触控_组2.png"),
        require("../assets/img/guide/触控_组3.png"),
        require("../assets/img/guide/触控_组4.png"),
        require("../assets/img/guide/鼠标_组1.png"),
        require("../assets/img/guide/鼠标_组2.png"),
        require("../assets/img/guide/鼠标_组3.png"),
        require("../assets/img/guide/鼠标_组4.png"),
        require("../assets/img/guide/鼠标_组5.png"),
      ],
      imgTouch: require("../assets/img/guide/10月优化_触控.png"),
      imgMouse: require("../assets/img/guide/10月优化_鼠标.png"),
      // ---------------------------------------------------引导图截至此
      isHorizontalScreen: false,
      loadImgStyle: {},
      isQq: false,
      isIos: false,
      timer: null,
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: 10 * 1000, // 设置不操作时间: 10s
      longTimeNoOperation: false,
      // 云电脑图标
      deepState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/悬浮球_带显示.png") + ")",
      },
      shallowState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/悬浮球_带显示2.png") + ")",
      },
      anotherDeepState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/悬浮球_带显示延迟高.png") + ")",
      },
      anotherShallowState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/悬浮球_带显示延迟高2.png") + ")",
      },
      // 掌上网咖图标
      cafeDeepState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/漂浮球焦点.png") + ")",
      },
      cafeShallowState: {
        backgroundImage:
          "url(" + require("../assets/img/icon/漂浮球隐藏.png") + ")",
      },
      delayReminder: false,
      mouseLeft: 0,
      mouseTop: 0,
      firstMoveMouse: true,
      tapFlag: false,
      connectIsShow: false,
      connectTime: null,
      isVisablty: 0,
      imgSrc: "",
      showWaves: false,
      waveLeft: 0,
      waveTop: 0,
      showModeSelect: false,
      showFullScreenSelect: false,
      touchAnimationTime: null,
      imgShow: false,
      universal: {},
      gameName: "",
      firstenter: true,
      orderId: "",
      inputStatus: false,
      colorA: "white",
      colorB: "green",
      lockBtnInputStatusCount: 0,
      mouseSpeed: 1,
      showFullScreenSwitch: true,
      firstLoad: false,
      btnFist: false,
      candidataFirst:0,
      recordComeBackCount: 0,
      netNumber: 0,
      startTime: 0,
      nowTime: 0,
      datachannelLastTime:0,
      channelFist:true,
      sessionFirst:true,
      muteStatus: true,
      // 游戏手柄 start
      handleInfomation: {},
      axesLeft: 0,
      axesTop: 0, 
      // 游戏手柄 end,
      videoStyle: {},
      fireAnglePosition: {
        x: null,
        y: null
      }
    };
  },
  computed: {
    ...mapGetters([
      "initMsg",
      "keyArray",
      "btnKeyArray",
      "MaxPressKeys",
      "showNavBar",
      "mouseMode",
      "fullScreenShow"
    ]),
    highNetworkLatency() {
      return this.roundTripTime > 100 ? true : false;
    },
    roundTripTimeStyle() {
      return { color: this.roundTripTime > 100 ? "red" : "white" };
    },
  },
  created() {
    this.startTime = new Date().getTime();
    // 强制横屏test
    this.renderResize();
    this.getAdaptive()
    // this.isGuide();

    // 禁止选择或复制
    document.ondragstart = document.onselectstart = function () {
      return false;
    };

    let localInfo = JSON.parse(localStorage.getItem("vuex"));
    let decodeParamPub = this.decodeStringKey(localStorage.getItem("paramPub"));
    let paramArr = decodeParamPub.split(",");
    this.universal = {
      partner_code: "1220817001",
      $channel: paramArr[2],
      appkey: paramArr[1],
      uname: localInfo ? localInfo.bbs.userInfo.uname : "",
    };
    let appData = sessionStorage.getItem("app");
    let dataMsg = util.decrypt(appData);
    let game = sessionStorage.getItem("currentProductName");
    // this.gameName = dataMsg ? dataMsg.g_name : "桌面模式";
    this.gameName = game ? game : "桌面模式";
    console.log("初始数据", this.universal, this.gameName, dataMsg);
    let token =JSON.parse(localStorage.getItem('vuex'))
		console.log('token信息')
		console.log(token)
    console.log(token.bbs.userDetail.preSell)
    
    // 游戏手柄相关
    console.log('游戏手柄')
    console.log('navigator.getGamepads()', navigator.getGamepads())
    window.addEventListener("gamepadconnected", function(e) {
      console.log("控制器已连接于 %d 位: %s. %d 个按钮, %d 个坐标方向。",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    })
    window.sendAxesInfo = this.sendAxesInfo
    window.showGamepadName = this.showGamepadName
    window.keyPressHandle = this.keyPressHandle
    window.liftUpKey = this.liftUpKey
    window.addEventListener('load', this.init)
  },
  watch: {
    // 输入法状态判断
    inputStatus() {
      if (this.inputStatus) {
        this.colorA = "green";
        this.colorB = "white";
      } else {
        this.colorA = "white";
        this.colorB = "green";
      }
    },
    isHorizontalScreen() {
      this.$toast.setDefaultOptions({
        className: this.isHorizontalScreen ? "" : "toast",
      });
      localStorage.setItem(
        "isHorizontalScreen",
        JSON.stringify(this.isHorizontalScreen)
      );
    },
    roundTripTime() {
      if (this.roundTripTime > 100 && !this.delayReminder) {
        this.delayReminder = true;
        if (![2, 3, 3.1].includes(this.initMsg.flag)) {
          this.netNumber++;
          // 云电脑对网络延迟大于100ms的2s提示
          this.$toast({
            position: this.isHorizontalScreen ? 'bottom' : '',
            className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
            message: "网络延迟过高",
            duration: 2000,
          });
        }
      } else if (this.roundTripTime < 100) {
        this.delayReminder = false;
      }
    },
    fullScreenShow() {
      this.rotate()
      if (!this.fullScreenShow) {
        let btnIconLeft = (this.$refs.btnIcon.style.left).replace('px', '')
        let btnIconTop = (this.$refs.btnIcon.style.top).replace('px', '')
        if (Number(btnIconLeft) + 100 >= this.screen.videosWidth) {
          $(".btnIcon")[0].style.left = (this.screen.videosWidth - 100) + 'px'
        }
        if (Number(btnIconTop) + 50 >= this.screen.videosHeight) {
          $(".btnIcon")[0].style.top = (this.screen.videosHeight - 100) + 'px'
        }
      }
    }
  },
  mounted() {
    let that = this;
    // 用户息屏、或者切到后台运行 （离开页面）
    document.addEventListener("visibilitychange", this.$visable.bind(that));
    that.timer = setInterval(function () {
      that.currentTime = new Date().getTime();
      if (that.lastTime && that.currentTime - that.lastTime > that.timeOut) {
        // 过期状态的操作
        that.longTimeNoOperation = true;
      }
    }, 1000);
    var ua = navigator.userAgent;
    if (ua.match("QQ") !== null) {
      this.isQq = true;
    }
    if (ua.match("iPhone") || ua.match("iOS")) {
      this.isIos = true;
    }
    let state = 0;
    if (this.initMsg.flag == 5 && this.isIos) {
      document.addEventListener(
        "touchstart",
        function () {
          if (state == 0) {
            $("#remoteVideo")[0].play();
            state = 1;
          }
        },
        { passive: false }
      );
      document.addEventListener(
        "WeixinJSBridgeReady",
        function () {
          $("#remoteVideo")[0].play();
        },
        { passive: false }
      );
    }
    // 监听屏幕事件
    window.addEventListener("resize", this.renderResize, false);
    console.time("进入流桌面时间");

    // 超时检查
    this.connTimeoutCheck();
    //初始化进度
    this.loadingProgress(0);

    // 信令服务器选取
    if (this.initMsg.flag == 10) {
      this.sigServerArr = ["http://", "http://"];
    } else {
      this.sigServerArr = [
        "https://vcssignal1.dalongyun.com/",
        "https://vcssignal2.dalongyun.com/",
      ];
    }

    //直连
    //  (this.sigServerArr = [
    //   "http://",
    //   "http://",
    // ]),
    this.sigServerArr = this.shuffle(this.sigServerArr);
    this.sigServer = this.sigServerArr[0];
    this.sigServerIndex = 0;

    //video 数据加载完毕
    $("#remoteVideo")[0].addEventListener(
      "loadedmetadata",
      this.onVideoPlaying
    );
    // 浏览器窗口关闭或者刷新时，触发beforeunload事件
    $(window).bind("beforeunload", this.pageClose);

    if (!this.connectIsShow) {
      this.timeoutCount = 0;
      this.timeoutTimes = 0;
    }
    this.everConnected = false;
    this.isHref();
    // websocket相关
    websocket.sendThis(this);
    websocket.init();
    // 用户名与方舟ID进行绑定
    let localInfo = JSON.parse(localStorage.getItem("vuex"));
    window.AnalysysAgent.alias(
      localInfo && localInfo.bbs && localInfo.bbs.userInfo.uname
    );
    // window.AnalysysAgent.alias(localInfo?.bbs?.userInfo?.uname)   // 可选链写法
    let first = JSON.parse(sessionStorage.getItem("novice_teaching"));
    if (first && first == 1) {
      this.firstLoad = true;
      this.btnFist = true;
      sessionStorage.setItem("novice_teaching", false);
    }
    console.log("是否首次进入", first, this.firstLoad);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.renderResize, false);
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    ...mapMutations([
      "set_key",
      "delete_key",
      "set_EmptyKey",
      "set_BtnKeyArray",
      "set_BtnEmptyKey",
      "setHideShowCourse",
      "setMouseMode",
      "setFullScreenShow",
      "setJudgeTouchStart",
      "setShowTextKeyboard",
      "setMoveItem",
      "setNotifyComponent"
    ]),
    // 游戏手柄 Start
    init () {
      var listener = new GamepadListener({}, false)
      listener.on('gamepad:connected', function (e) {
        console.log('connected', e)
        showGamepadName(e)
      })

      listener.on('gamepad:disconnected', function (e) {
        console.log('gamepad has just been disconnected, press a button', e)
      })

      listener.on('gamepad:axis', function (e) {
        var index = e.detail.gamepad.index,
          axis = e.detail.axis,
          value = e.detail.value
        console.log('摇杆信息', e.detail.gamepad.axes)
        if ((e.detail.gamepad.axes).length) {
          sendAxesInfo(e.detail.gamepad.axes)
        }
        // console.log(navigator.getGamepads()[0])
        // console.log(`转动摇杆, ${index}, ${axis}, ${value}`)
      })

      listener.on('gamepad:button', function (e) {
        var button = e.detail.button,
          index = e.detail.gamepad.index,
          pressed = e.detail.pressed
        // console.log(`Button ${index}, ${button}, ${pressed} pressed`)
        if (pressed) {
          keyPressHandle(button)
        } else {
          liftUpKey(button)
        }
      })

      listener.start()
    },
    showGamepadName (info) {
      console.log('gamepad name', info.detail.gamepad.id)
      let pressBtnInfos = mappings.find(item => item.id === info.detail.gamepad.id) && mappings.find(item => item.id === info.detail.gamepad.id).buttons
      this.handleInfomation = Object.keys(pressBtnInfos || {})
      console.log(this.handleInfomation)
    },
    keyPressHandle (btn) {
      console.log(`按下${btn}键`)
      let keyPressBtnInfo = {}
      switch (this.handleInfomation[btn]) {
        case 'button_1':
          keyPressBtnInfo = { key: 'k', keyCode: 75 }
          break
        case 'button_2':
          keyPressBtnInfo = { key: 'l', keyCode: 76 }
          break
        case 'button_3':
          keyPressBtnInfo = { key: 'j', keyCode: 74 }
          break
        case 'button_4':
          keyPressBtnInfo = { key: 'i', keyCode: 73 }
          break
        case 'shoulder_top_left':
          keyPressBtnInfo = { key: 'CTRL(L)', keyCode: '' }
          break
        case 'shoulder_top_right':
          keyPressBtnInfo = { key: 'o', keyCode: 79 }
          break
        case 'shoulder_bottom_left':
          keyPressBtnInfo = { key: 'CTRL(R)', keyCode: '' }
          break
        case 'shoulder_bottom_right':
          keyPressBtnInfo = { key: 'p', keyCode: 80 }
          break
        case 'select':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'start':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'stick_button_left':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'stick_button_right':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'd_pad_up':
          this.set_BtnKeyArray(87)
          break
        case 'd_pad_down':
          this.set_BtnKeyArray(83)
          break
        case 'd_pad_left':
          this.set_BtnKeyArray(65)
          break
        case 'd_pad_right':
          this.set_BtnKeyArray(68)
          break
        case 'vendor':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        default:
          console.log('gamepad')
      }
      if (Object.keys(keyPressBtnInfo).length) {
        this.whichKey(keyPressBtnInfo, 0)
      }
    },
    liftUpKey (btn) {
      console.log(`抬起${btn}键`)
      let keyPressBtnInfo = {}
      switch (this.handleInfomation[btn]) {
        case 'button_1':
          keyPressBtnInfo = { key: 'k', keyCode: 75 }
          break
        case 'button_2':
          keyPressBtnInfo = { key: 'l', keyCode: 76 }
          break
        case 'button_3':
          keyPressBtnInfo = { key: 'j', keyCode: 74 }
          break
        case 'button_4':
          keyPressBtnInfo = { key: 'i', keyCode: 73 }
          break
        case 'shoulder_top_left':
          keyPressBtnInfo = { key: 'CTRL(L)', keyCode: '' }
          break
        case 'shoulder_top_right':
          keyPressBtnInfo = { key: 'o', keyCode: 79 }
          break
        case 'shoulder_bottom_left':
          keyPressBtnInfo = { key: 'CTRL(R)', keyCode: '' }
          break
        case 'shoulder_bottom_right':
          keyPressBtnInfo = { key: 'p', keyCode: 80 }
          break
        case 'select':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'start':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'stick_button_left':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'stick_button_right':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        case 'd_pad_up':
          this.set_BtnEmptyKey()
          break
        case 'd_pad_down':
          this.set_BtnEmptyKey()
          break
        case 'd_pad_left':
          this.set_BtnEmptyKey()
          break
        case 'd_pad_right':
          this.set_BtnEmptyKey()
          break
        case 'vendor':
          keyPressBtnInfo = { key: '', keyCode: '' }
          break
        default:
          console.log('gamepad')
      }
      if (Object.keys(keyPressBtnInfo).length) {
        this.KeyEnd(keyPressBtnInfo, 0)
      }
    },
    sendAxesInfo (arr) {
      if (arr.length) {
        const [a, b, c, d] = arr
        if (a !== 0) {
          this.axesTop -= a
        } else if (b !== 0) {
          this.axesLeft += b
        } else if (c !== 0) {
          this.axesTop += c
        } else if (d !== 0) {
          this.axesLeft -= d
        }
      }
      if (this.axesLeft === 0 && this.axesTop === 0) {
        this.set_BtnEmptyKey()
      } else if (this.axesLeft > 0 && this.axesTop === 0) {
        this.set_BtnKeyArray(37)
      } else if (this.axesLeft < 0 && this.axesTop === 0) {
        this.set_BtnKeyArray(39)
      } else if (this.axesLeft === 0 && this.axesTop > 0) {
        this.set_BtnKeyArray(38)
      } else if (this.axesLeft === 0 && this.axesTop < 0) {
        this.set_BtnKeyArray(40)
      } else if (this.axesLeft > 0 && this.axesTop > 0) {
        this.set_BtnKeyArray([37, 38])
      } else if (this.axesLeft > 0 && this.axesTop < 0) {
        this.set_BtnKeyArray([37, 40])
      } else if (this.axesLeft < 0 && this.axesTop > 0) {
        this.set_BtnKeyArray([39, 38])
      } else if (this.axesLeft < 0 && this.axesTop < 0) {
        this.set_BtnKeyArray([39, 40])
      }
    },
    // 游戏手柄End
    // 云电脑组件中的数据埋点
    sendDataBuriedPoint (name, data) {
      this.$record(name, data)
    },
    changeSideBarShow (status) {
      this.isSidwbar = status
    },
    changemousespeed(speed) {
      this.mouseSpeed = speed;
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
    },
    cutPicture() {
      let video = document.getElementById("remoteVideo");
      var canvas = document.createElement("canvas");
      canvas.width = this.videosWidth;
      canvas.height = this.videosHeight;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, this.videosWidth, this.videosHeight);
      this.imgSrc = canvas.toDataURL("image/jpeg");
    },
    // 用户暂时离开
    setAction() {
      this.recordComeBackCount = 0
      localStorage.setItem(
        "currentInputStatus",
        JSON.stringify(this.inputStatus)
      );
      localStorage.setItem("payCode", this.orderId);
      localStorage.setItem(
        "lockBtnInputCount",
        JSON.stringify(this.lockBtnInputStatusCount)
      );
      localStorage.setItem(
        "cacheFullScreen",
        JSON.stringify(this.fullScreenShow)
      );
    },
    async getAction() {
      let payCode = localStorage.getItem("payCode");
      if (payCode == this.orderId)
        this.inputStatus = JSON.parse(
          localStorage.getItem("currentInputStatus")
        );
      this.setFullScreenShow(
        JSON.parse(localStorage.getItem("cacheFullScreen"))
      );
      this.rotate();
      this.lockBtnInputStatusCount = JSON.parse(
        localStorage.getItem("lockBtnInputCount")
      );
    },
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
    fireUp (e) {
      if (this.isPress) {
        this.isPress = false;
        this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
      }
      let that = this
      if (this.mouseData.mouseClickFlag == 0x01) {
        setTimeout(function () {
          console.log("触摸结束，鼠标左键抬起");
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
    clk_cus_close_sidebar(data) {
      if (this.isSidwbar) this.isSidwbar = false;
    },
    // 消息推送
    toRecharge() {
      let localInfo = JSON.parse(localStorage.getItem("vuex"));
      let decodeParamPub = this.decodeStringKey(
        localStorage.getItem("paramPub")
      );
      let paramArr = decodeParamPub.split(",");
      let eventInfo = {
        ce_event_position: "6",
        $channel: paramArr[2],
        appkey: paramArr[1],
        uname: localInfo.bbs.userInfo.uname,
        userID: function () {
          return localInfo.bbs.userInfo.uname;
        },
      };
      window.AnalysysAgent.track("tab_CE_button", eventInfo);
      this.$cookies.set(
        "lCoH_2132_auth",
        localInfo.bbs.userInfo.auth,
        null,
        "/",
        "dalongyun.com"
      );
      this.$cookies.set(
        "lCoH_2132_saltkey",
        localInfo.bbs.userInfo.saltkey,
        null,
        "/",
        "dalongyun.com"
      );
      this.goRechargeUrl();
    },
    goRechargeUrl() {
      // 充值
      let ua = navigator.userAgent;
      let paramPub = localStorage.getItem("paramPub");
      let rechargeUrl = "";
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(ua)) {
        //移动端
        // 移动端充值
        if ([2, 3, 3.1].includes(this.initMsg.flag)) {
          rechargeUrl = this.$config.zswkRechargeEntry;
        } else {
          rechargeUrl = this.$config.mobileRechargeEntry + paramPub;
        }
      } else {
        // pc端充值
        rechargeUrl = this.$config.pcRechargeEntry + paramPub;
      }
      window.location.href = rechargeUrl;
    },
    decodeStringKey(str) {
      str = str ? str.trim() : "";
      let strLen = str.length;
      let enLen = Math.floor(strLen / 2);
      let arr = [];
      for (let i = 0; i < strLen; i++) {
        arr[i] = str.substr(i, i + 1).charCodeAt() - 2;
      }
      for (let j = 0; j < enLen; j++) {
        arr[j] = arr[j + enLen] ^ arr[j];
        arr[j + enLen] = arr[j + enLen] ^ arr[j];
        arr[j] = arr[j + enLen] ^ arr[j];
      }
      let str1 = "";
      for (let i = 0; i < strLen; i++) {
        str1 += String.fromCharCode(arr[i]);
      }
      return str1;
    },
    toEnd() {
      window.location.href = document.referrer;
    },
    // 是否是首次进入，是否展示引导图
    isGuide() {
      let mode = window.localStorage.getItem("mode");
      if (mode === null) {
        this.show = true;
        return;
      } else {
        if (mode == "true") {
          this.setMouseMode(true);
        } else if (mode == "false") {
          this.setMouseMode(false);
        } else {
          this.setMouseMode(mode);
        }
        this.show = false;
      }
    },
    renderResize() {
      // 判断横竖屏
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      if (width > height) {
        this.isHorizontalScreen = true;
        this.data = {}
      } else {
        this.isHorizontalScreen = false;
        this.rotate();
        this.data = {
          width: window.screen.height + "px",
          height: window.screen.width + "px",
          transform: "translate(0px, " + window.screen.height + "px) rotate(-90deg)",
        };
      }
    },
    // 引导图
    changePicTouch() {
      // 触控模式
      clearTimeout(timer1);
      this.imgTouch = this.guideList[1];

      let timer1 = setTimeout(() => {
        this.setMouseMode(true);
        window.localStorage.setItem("mode", true);
        this.imgTouch = this.guideList[0];

        this.active = 2;
      }, 200);
    },
    changePicMouse() {
      // 鼠标模式
      clearTimeout(timer1);
      this.imgMouse = this.guideList[3];

      let timer1 = setTimeout(() => {
        this.setMouseMode(false);
        window.localStorage.setItem("mode", false);
        this.imgMouse = this.guideList[2];

        this.active = 3;
      }, 200);
    },
    onClickLeft() {
      this.active = 1;
    },
    onClickRight() {
      this.show = false;
    },
    // 适配不同设备的宽高
    getAdaptive() {
      let height = window.screen.height;
      let width = window.screen.width;
      this.x = width;
      this.y = height;
      let currentWidth = document.documentElement.clientWidth;
      let currentHeight = document.documentElement.clientHeight;
      if (currentHeight > currentWidth) {
        this.dataImg = {
          width: this.y + "px",
          height: this.x + "px",
          position: "absolute",
          top: "0",
          zIndex: 11000,
        };
        this.loadImgStyle = {
          width: this.y + "px",
          height: this.x + "px",
          transform: "rotate(0deg)",
          position: "relative",
          left: [5, "5"].includes(this.initMsg.flag)
            ? -(0.02 * this.y) + "px"
            : "0px",
          top: "0px",
        };
      } else {
        this.dataImg = {
          width: currentWidth + "px",
          height: currentHeight + "px",
          position: "absolute",
          top: "0",
          zIndex: 11000,
        };
        this.loadImgStyle = {
          width: currentWidth + "px",
          height: currentHeight + "px",
          transform: "rotate(0deg)",
          position: "relative",
          left: "0px",
          top: "0px",
        };
      }
    },
    customizeDown(item, index) {
      let customizBtn;
      // console.log(item);
      this.addKeyCode(item);
      // console.log("按下操作");
      if (item.keyPressMode == "2") {
        console.log("按下按住");
        if (item.keyStyle == "0") {
          console.log("非摇杆");
          switch (item.keyName || item.key) {
            case "左键":
              customizBtn = { button: 0 };
              this.lockMouse(customizBtn, index);
              break;
            case "移动射击":
              customizBtn = { button: 0 };
              this.lockMouse(customizBtn, index);
              break;
            case "中键":
              customizBtn = { button: 1 };
              this.lockMouse(customizBtn, index);
              break;
            case "右键":
              customizBtn = { button: 2 };
              this.lockMouse(customizBtn, index);
              break;
            case "滚轮上":
              customizBtn = { value: 1 };
              this.lockWheel(customizBtn, index);
              break;
            case "滚轮下":
              customizBtn = { value: -1 };
              this.lockWheel(customizBtn, index);
              break;
            case "开火":
              customizBtn = { button: 0 };
              this.lockMouse(customizBtn, index);
              break;
            default:
              this.lockBtn(item, index);
          }
        } else {
          // console.log("按住摇杆");
          if (item.rockerType == "102") {
            this.customizeBtn.customRoller = true;
          } else if (item.rockerType == "103") {
            this.customizeBtn.customDirection = true;
          }
        }
      } else {
        // console.log("按下非按住");
        if (item.keyStyle == "0") {
          console.log("非按住");
          switch (item.keyName || item.key) {
            case "左键":
              customizBtn = { button: 0 };
              this.mouseDown(customizBtn, index);
              break;
            case "移动射击":
              customizBtn = { button: 0 };
              this.mouseDown(customizBtn, index);
              break;
            case "中键":
              customizBtn = { button: 1 };
              this.mouseDown(customizBtn, index);
              break;
            case "右键":
              customizBtn = { button: 2 };
              this.mouseDown(customizBtn, index);
              break;
            case "滚轮上":
              customizBtn = { value: 1 };
              this.wheelDown(customizBtn, index);
              break;
            case "滚轮下":
              customizBtn = { value: -1 };
              this.wheelDown(customizBtn, index);
              break;
            case "开火":
              customizBtn = { button: 0 };
              this.mouseDown(customizBtn, index);
              break;
            default:
              this.whichKey(item, index);
          }
        } else {
          // console.log("摇杆类型");
          if (item.rockerType == "102") {
            this.customizeBtn.customRoller = true;
          } else if (item.rockerType == "103") {
            this.customizeBtn.customDirection = true;
          }
        }
      }
    },
    // 自定义键盘添加keyCode
    addKeyCode(item) {
      switch (item.keyName || item.key) {
        case "Esc":
          item.keyCode = 27;
          break;
        case "F1":
          item.keyCode = 112;
          break;
        case "F2":
          item.keyCode = 113;
          break;
        case "F3":
          item.keyCode = 114;
          break;
        case "F4":
          item.keyCode = 115;
          break;
        case "F5":
          item.keyCode = 116;
          break;
        case "F6":
          item.keyCode = 117;
          break;
        case "F7":
          item.keyCode = 118;
          break;
        case "F8":
          item.keyCode = 119;
          break;
        case "F9":
          item.keyCode = 120;
          break;
        case "F10":
          item.keyCode = 121;
          break;
        case "F11":
          item.keyCode = 122;
          break;
        case "F12":
          item.keyCode = 123;
          break;
        case "Ins":
          item.keyCode = 45;
          break;
        case "Del":
          item.keyCode = 46;
          break;
        case "PgUp":
          item.keyCode = 33;
          break;
        case "PgDn":
          item.keyCode = 34;
          break;
        case "Home":
          item.keyCode = 36;
          break;
        case "End":
          item.keyCode = 35;
          break;
        case "`":
          item.keyCode = 192;
          break;
        case "1":
          item.keyCode = 49;
          break;
        case "2":
          item.keyCode = 50;
          break;
        case "3":
          item.keyCode = 51;
          break;
        case "4":
          item.keyCode = 52;
          break;
        case "5":
          item.keyCode = 53;
          break;
        case "6":
          item.keyCode = 54;
          break;
        case "7":
          item.keyCode = 55;
          break;
        case "8":
          item.keyCode = 56;
          break;
        case "9":
          item.keyCode = 57;
          break;
        case "0":
          item.keyCode = 48;
          break;
        case "-":
          item.keyCode = 189;
          break;
        case "=":
          item.keyCode = 187;
          break;
        case "Back":
          item.keyCode = 8;
          break;
        case "Tab":
          item.keyCode = 9;
          break;
        case "q":
          item.keyCode = 81;
          break;
        case "w":
          item.keyCode = 87;
          break;
        case "e":
          item.keyCode = 69;
          break;
        case "r":
          item.keyCode = 82;
          break;
        case "t":
          item.keyCode = 84;
          break;
        case "y":
          item.keyCode = 89;
          break;
        case "u":
          item.keyCode = 85;
          break;
        case "i":
          item.keyCode = 73;
          break;
        case "o":
          item.keyCode = 79;
          break;
        case "p":
          item.keyCode = 80;
          break;
        case "[":
          item.keyCode = 219;
          break;
        case "]":
          item.keyCode = 221;
          break;
        case "\\":
          item.keyCode = 220;
          break;
        case "Ctrl":
          item.keyCode = 17;
          break;
        case "a":
          item.keyCode = 65;
          break;
        case "s":
          item.keyCode = 83;
          break;
        case "d":
          item.keyCode = 68;
          break;
        case "f":
          item.keyCode = 70;
          break;
        case "g":
          item.keyCode = 71;
          break;
        case "h":
          item.keyCode = 72;
          break;
        case "j":
          item.keyCode = 74;
          break;
        case "k":
          item.keyCode = 75;
          break;
        case "l":
          item.keyCode = 76;
          break;
        case ";":
          item.keyCode = 186;
          break;
        case "'":
          item.keyCode = 222;
          break;
        case "Enter":
          item.keyCode = 13;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "z":
          item.keyCode = 90;
          break;
        case "x":
          item.keyCode = 88;
          break;
        case "c":
          item.keyCode = 67;
          break;
        case "v":
          item.keyCode = 86;
          break;
        case "b":
          item.keyCode = 66;
          break;
        case "n":
          item.keyCode = 78;
          break;
        case "m":
          item.keyCode = 77;
          break;
        case ",":
          item.keyCode = 188;
          break;
        case ".":
          item.keyCode = 190;
          break;
        case "/":
          item.keyCode = 191;
          break;
        case "↑":
          item.keyCode = 38;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "Alt":
          item.keyCode = 18;
          break;
        case "win":
          item.keyCode = 1000000;
          break;
        case "Space":
          item.keyCode = 32;
          break;
        case "←":
          item.keyCode = 37;
          break;
        case "↓":
          item.keyCode = 40;
          break;
        case "→":
          item.keyCode = 39;
          break;
      }
    },
    customizeUp(item, index) {
      let customizBtn;
      this.addKeyCode(item);
      if (item.keyPressMode == "2") {
        // console.log("按住");
        if (item.keyStyle == "0") {
          switch (item.keyName || item.key) {
            case "左键":
              customizBtn = { button: 0 };
              this.mouseUp(customizBtn);
              break;
            case "移动射击":
              customizBtn = { button: 0 };
              this.mouseUp(customizBtn);
              break;
            case "中键":
              customizBtn = { button: 1 };
              this.mouseUp(customizBtn);
              break;
            case "右键":
              customizBtn = { button: 2 };
              this.mouseUp(customizBtn);
              break;
            case "滚轮上":
              customizBtn = { value: 1 };
              this.wheelUp(customizBtn);
              break;
            case "滚轮下":
              customizBtn = { value: -1 };
              this.wheelUp(customizBtn);
              break;
            case "开火":
              customizBtn = { button: 0 };
              this.mouseUp(customizBtn);
              break;
            default:
              this.lockBtn(item, index);
          }
        }
      } else {
        if (item.keyStyle == "0") {
          switch (item.keyName || item.key) {
            case "左键":
              customizBtn = { button: 0 };
              this.mouseUp(customizBtn);
              break;
            case "移动射击":
              customizBtn = { button: 0 };
              this.mouseUp(customizBtn);
              break;
            case "中键":
              customizBtn = { button: 1 };
              this.mouseUp(customizBtn);
              break;
            case "右键":
              customizBtn = { button: 2 };
              this.mouseUp(customizBtn);
              break;
            case "滚轮上":
              customizBtn = { value: 1 };
              this.wheelUp(customizBtn);
              break;
            case "滚轮下":
              customizBtn = { value: -1 };
              this.wheelUp(customizBtn);
              break;
            case "开火":
              customizBtn = { button: 0 };
              this.mouseDown(customizBtn);
              break;
            default:
              this.KeyEnd(item);
          }
        } else {
          // console.log("摇杆类型");
        }
      }
    },
    change(data) {
      this.isBtn = data;
    },
    isChoose(bool) {
      this.isMode = false;
      this.isSidwbar = false;

      if (bool) {
        this.traceLog("触屏模式");
        this.setMouseMode(true);
        this.sum_index = 1;
        window.localStorage.setItem("mode", true);
      } else {
        this.traceLog("鼠标模式");
        this.setMouseMode(false);
        this.sum_index = 2;
        window.localStorage.setItem("mode", false);
      }
    },
    showSidebar() {
      this.traceLog("this.isSidwbar: " + this.isSidwbar);
      console.log('组件', this.$refs.silderItem)
      this.btnFist = false;
      if (this.showNavBar) {
        return;
      }
      this.isBtn = 2;
      this.isSidwbar = !this.isSidwbar;
      this.lastTime = new Date().getTime();
      this.longTimeNoOperation = false;
    },
    // 页面被关闭
    pageClose() {
      //this.tracelog("page close");
      if (
        this.connStatus === this.connStatusFlag.connected ||
        this.connStatus === this.connStatusFlag.connectting
      ) {
        //this.tracelog("sending disconn");
        this.sendingDisconn();
      }
      this.disconnect();
    },
    panstart(event) {
      this.isPan = 2;
      //this.tracelog("panstart");
      //this.tracelog(event);
      // 问题15 & 问题19 tada animated 动画效果
      if (this.tada === "") {
        clearTimeout(timer);
        this.tada = " tada animated";
        let timer = window.setTimeout(() => {
          this.tada = "";
        }, 200);
      } else {
        this.tada = "";
      }
    },
    panmove(event) {
      this.isPan = 2;
      this.lastTime = new Date().getTime();
      this.longTimeNoOperation = false;
      this.traceLog("panmove");
      if (this.isHorizontalScreen) {
        $(".btnIcon")[0].style.left =
          event.targetTouches[0].clientX - this.screen.left - 25 + "px";
        $(".btnIcon")[0].style.top =
          event.targetTouches[0].clientY - this.screen.top - 25 + "px";
      } else {
        $(".btnIcon")[0].style.left =
          this.screen.totalWidth * 0.98 -
          event.targetTouches[0].clientY -
          this.screen.left * 2 -
          25 +
          "px";
        $(".btnIcon")[0].style.top =
          event.targetTouches[0].clientX - this.screen.top - 25 + "px";
      }
      let iconTop = this.stripPX($(".btnIcon").css("top"));
      let iconLeft = this.stripPX($(".btnIcon").css("left"));
      if (iconLeft <= 0) {
        this.traceLog("iconLeft <= 0");
        $(".btnIcon")[0].style.left = 0 + "px";
      }
      if (iconTop <= 0) {
        this.traceLog("iconTop  <= 0");
        $(".btnIcon")[0].style.top = 0 + "px";
      }
      if (
        iconLeft >=
        this.screen.totalWidth -
          (this.screen.left || 0) * 2 -
          this.$refs.btnIcon.offsetWidth
      ) {
        $(".btnIcon")[0].style.left =
          this.screen.totalWidth -
          (this.screen.left || 0) * 2 -
          this.$refs.btnIcon.offsetWidth +
          "px";
      }
      if (
        iconTop >=
        this.screen.totalHeight -
          (this.screen.top || 0) * 2 -
          this.$refs.btnIcon.offsetHeight
      ) {
        this.traceLog("iconLeft  >= this.screen.totalWidth");
        $(".btnIcon")[0].style.top =
          this.screen.totalHeight -
          (this.screen.top || 0) * 2 -
          this.$refs.btnIcon.offsetHeight +
          "px";
      }
    },
    panend(event) {
      this.isPan = 1;
      //this.tracelog("panend");
    },
    //键盘按下事件
    whichKey(which, index) {
      console.log("dianji ", which);
      which.key = which.keyRealName || which.keyName || which.key;
      this.activeClass = index;
      this.isBtn = 2;
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.keyName === "Ctrl"
      ) {
        this.controlCode |= this.SpecialKey.LeftCtrl;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.key === "SHIFT(R)" ||
        which.keyName === "Shift"
      ) {
        this.inputStatus = !this.inputStatus;
        this.controlCode |= this.SpecialKey.LeftShift;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
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
          // console.log('alt按下11')
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
        this.mouseDown(item, index);
      } else if (this.isLockBtn[index] == false) {
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
        this.wheelUp(item);
        this.isLockBtn[index] = false;
        // console.log("clearTimer3");
        clearInterval(timer);
      }
    },
    // 键盘抬起事件
    KeyEnd(which, event) {
      console.log("dianji ", which);
      which.key = which.keyRealName || which.keyName || which.key;
      this.activeClass = -1;
      //this.tracelog("key touch end up");
      let keyVal = which.keyCode;
      //this.tracelog(which);
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.keyName === "Ctrl"
      ) {
        console.log("000000000000000000");
        this.controlCode &= this.KeyInvCode.LeftCtrlM;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.keyName === "Shift"
      ) {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
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
      this.isBtn = 2;
      this.activeClass = index + 100;
      if (item.value == 1) {
        this.mouseData.mouseWheelData = 1;
      } else if (item.value == -1) {
        this.mouseData.mouseWheelData = -1;
      }
    },
    wheelUp(item) {
      this.activeClass = -1;
      // this.isBtn = 1;
    },
    press(e) {
      if (this.showNavBar) return
      if (
        e.target &&
        Object.prototype.toString.call(e.target) === "[object HTMLVideoElement]"
      ) {
        // this.traceLog("触发长按操作");
        if (!this.isPress) {
          this.isPress = true;
          if (!this.mouseMode) {
            this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
          }
        }
      }
    },
    pressup(e) {
      if (this.showNavBar) return
      // this.traceLog("长按放开：");
      if (this.isPress) {
        this.isPress = false;
        if (!this.mouseMode) {
          this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
        }
      }
    },
    waveFinish(data) {
      this.showWaves = data;
    },
    gestureTouchStart(e) {
      if (this.showNavBar) {
        this.setMoveItem(true)
        return
      }
      let that = this;
      if (
        Object.prototype.toString.call(e.target) === "[object HTMLVideoElement]"
      ) {
        this.setJudgeTouchStart(true)
      }
      this.$set(this, 'muteStatus', false)
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
        this.screen.mouseX = this.mouseLeft + this.screen.left;
        this.screen.mouseY = this.mouseTop + this.screen.top;
      }
    },
    pressMove(e) {
      if (this.showNavBar) return
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
                clickMouseX - this.mouseData.lastPositionX +
                this.mouseData.mouseMovementX;
            this.mouseData.mouseMovementY =
                clickMouseY - this.mouseData.lastPositionY +
                this.mouseData.mouseMovementY;
            this.mouseData.mouseMovementX = this.mouseData.mouseMovementX * this.mouseSpeed
            this.mouseData.mouseMovementY = this.mouseData.mouseMovementY * this.mouseSpeed
          } else {
            this.mouseLeft -= e.deltaY * this.mouseSpeed;
            this.mouseTop += e.deltaX * this.mouseSpeed;
            //竖屏数据传递
            //水平方向
            this.mouseData.mouseMovementX = -(
              clickMouseY - this.mouseData.lastPositionY +
              this.mouseData.mouseMovementX
            );
            //垂直方向
            this.mouseData.mouseMovementY =
              clickMouseX - this.mouseData.lastPositionX +
              this.mouseData.mouseMovementY;
            this.mouseData.mouseMovementX = this.mouseData.mouseMovementX * this.mouseSpeed
            this.mouseData.mouseMovementY = this.mouseData.mouseMovementY * this.mouseSpeed
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
    gestureTouchEnd(e) {
      if (this.showNavBar) return
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
          this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
        }
        if (e.holdClick) {
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
        if (e.rightClick && !e.threeFingerClick) {
          this.mouseData.mouseClickFlag = 0;
          this.isRight = true;
          this.mouseData.mouseClickFlag |= this.MousePress.RightClick;
        }
        if (e.threeFingerClick) {
          // this.showKey();
          this.setShowTextKeyboard(true)
        }
        let that = this;
        if (this.mouseData.mouseClickFlag == 0x01) {
          setTimeout(function () {
            console.log("触摸结束，鼠标左键抬起");
            that.mouseData.mouseClickFlag &= that.MouseLift.LeftClickUp;
          }, 10);
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
    rotate() {
      $("#videos").show();
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
          } else {
            if ((this.screen.totalWidth * 9) / 16 <= this.screen.totalHeight) {
              this.screen.videosWidth = this.screen.totalWidth;
              this.screen.videosHeight = this.screen.totalHeight
              this.screen.changeRatioHeight = (this.screen.videosWidth / 16) * 9;
            } else {
              this.adaptScreen(this.screen.totalWidth, this.screen.totalHeight);
              this.screen.changeRatioHeight = (this.screen.videosWidth / 16) * 9;
              this.screen.videosHeight = this.screen.totalHeight
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
          } else {
            if ((this.screen.totalWidth * 9) / 16 <= this.screen.totalHeight) {
              this.screen.videosWidth = this.screen.totalWidth;
              this.screen.videosHeight = (this.screen.totalWidth * 9) / 16;
            } else {
              this.adaptScreen(this.screen.totalWidth, this.screen.totalHeight);
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
        }
      }
      localStorage.setItem("screen", JSON.stringify(this.screen));
      if (this.firstMoveMouse) {
        this.mouseLeft = this.screen.videosWidth / 2;
        this.mouseTop = this.screen.videosHeight / 2;
        this.firstMoveMouse = false;
      }
    },
    fullScreen() {
      //   this.rotate();
      window.addEventListener(
        "onorientationchange" in window ? "orientationchange" : "resize",
        this.rotate,
        false
      );
    },

    stripPX(obj) {
      if (obj.indexOf("px") != -1) {
        return parseInt(obj.slice(0, -2));
      } else {
        return 0;
      }
    },
    tap(event) {
      if (this.showNavBar) return
      if (
        event.target &&
        Object.prototype.toString.call(event.target) ===
          "[object HTMLVideoElement]"
      ) {
        this.tapFlag = true;
        if (!this.mouseMode) {
          console.log("鼠标模式下的左键按下");
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
      }
    },
    //打印日志
    traceLog(data) {
      if (this.isLog) {
        let myDate = new Date();
        console.log(myDate.toLocaleString() + ":  ");
        console.log(data);
      }
    },
    // 暂时离开
    away() {
      this.setAction();
      this.sup_index = 3; //问题19
      this.sendingDisconn();
      this.setHideShowCourse(true);
      if (this.timer) {
        clearInterval(this.timer);
      }
      let eventInfo = {
        control_panel_event_position: "14",
      };
      this.$record("control_panel_event", eventInfo);
      if (this.initMsg.flag != 10) {
        let time = this.$refs.silderItem.$children[0].onlineTime;
        let minutes = tools.timeDifference(time)
        let eventInfos = {
          roomdetail_up_time: minutes,
          port: this.netNumber,
        };
        this.$record("precheck_net_delay", eventInfos);
      }
      //   window.history.go(-1);
      window.location.href = document.referrer;
    },
    // 鼠标模式选择
    modeSelect() {
      this.sup_index = 6;
      this.showModeSelect = true;
    },
    // 全屏模式选择
    fullScreenSelect() {
      this.sup_index = 7;
      this.showFullScreenSelect = true;
    },
    showFullScreen(status) {
      console.log("执行全屏");
      this.setFullScreenShow(status);
      this.isSidwbar = false;
    },
    // 退出游戏
    off() {
      // 问题35
      this.sup_index = 4; //问题19
      connectApi
        .cancellation({
          cid: this.loadData.cid,
          confirm: 0,
        })
        .then((res) => {
          // console.log(res);
          if (res.success == true) {
            // this.sendingDisconn();
            let msg = res.txt;
            // msg ? '' : msg = "本次扣费还剩42分钟，剩余时间可返还1云豆，是否注销？";
            this.$dialog.confirm({
              title: "",
              message: msg,
            })
              .then(() => {
                // on confirm
                connectApi
                  .cancellation({
                    cid: this.loadData.cid,
                    confirm: 1,
                  })
                  .then((res) => {
                    if (res.success == true) {
                      this.sendingDisconn();
                      window.location.href = document.referrer;
                      //   window.history.go(-1);
                    } else {
                      this.$dialog.alert({
                        message: "注销成功",
                      }).then(() => {
                        // on close
                        this.$dialog.close;
                      });
                    }
                  });
              })
              .catch(() => {
                // on cancel
              });
            //   window.history.go(-1);
          } else {
            this.$dialog.alert({
              message: "注销失败",
            }).then(() => {
              // on close
              this.$dialog.close;
            });
          }
        });
    },
  }
}