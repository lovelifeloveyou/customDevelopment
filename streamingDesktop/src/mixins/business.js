import Connect from "../components/connect";
import websocket from "../common/libs/websocket.js";
import "../common/ufo/index";
import connectApi from "@/api/system.js";
import util from "../common/libs/util.crypto";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      syncDataList: [], // 同步数据 查询差异化 the last time
      editData: "", // edit 编辑数据
      isBoo: -1,
      // 连接流程
      loadingRate: 0,
      directSessionKeyHead: "11566D692A774BCA08F8", // 直联sessionKey
      directSessionKeyFull: "11566D692A774BCA08F81490F59C3018", // 直联sessionKey
      isLog: true,
      serverUsing: 0, // 服务正在使用次数
      timeoutCount: 0, // 超时连接次数
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
      // 交互控件
      UIloadingImg: null,
      UIvideoImg: null,
      UIportrait: null,
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
      servertimeoutCount: 0, // 连接中超时次数
      candidateArr: [], // 缓存candidate数据
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
      isBtn: 1, // 1.屏幕按键 2.按钮按键
      isPan: 1, // 1.屏幕按键 2.拖动悬浮球
      isBar: 1, // 1.屏幕按键 2.菜单栏
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
      keyMouseFlag: 0x01,  // 0x02 手柄
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
      pageTop: "",
      dx: "",
      dy: "",
      tada: "",
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
      loading: false,
      finished: false,
      isClkMyKeyboard: false,
      count: 1,
      current: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      firstEntry: 1,
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
      tapFlag: false,
      connectIsShow: false,
      connectTime: null,
      isVisablty: 0,
      imgSrc: "",
      showWaves: false,
      waveLeft: 0,
      waveTop: 0,
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
      firstLoad: false,
      btnFist: false,
      candidataFirst: 0,
      recordComeBackCount: 0,
      netNumber: 0,
      startTime: 0,
      nowTime: 0,
      datachannelLastTime: 0,
      channelFist: false,
      sessionFirst: true,
      archive: false,
      muteStatus: true,

      errorReport:false,
      pageShift: 2,
      packetNum: 0,
      exportShift:2,
      packetTime: null,
      packetRateTime: null,
      packetChange: 0,
      packetShift:false,
      btnIconIndex:false,
      fireAnglePosition: {
        x: null,
        y: null
      },
      firstPrecheck:true,
      // 悬浮球拖动漂移问题修改
      floatBallFlag: false,
      floatBallPosition: {
        x: 0,
        y: 0
      },
      nx: '',
      ny:  '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
      // 悬浮球拖动漂移问题修改
      usingFirst: true,
      gamepadDeviceStatusFlag: null,
      gamepadDeviceStatusSendCount: 0,
      loadingShow:false,
      framesPerSecondCount:0,
      framesPerSecondFirst:true,
      threeFingerClickFlag: false,
      loadImgShow: true  
    };
  },
  created() {
    this.startTime = new Date().getTime();
    let localInfo = JSON.parse(localStorage.getItem("vuex"));
    let decodeParamPub = this.decodeStringKey(localStorage.getItem("paramPub"));
    let paramArr = decodeParamPub.split(",");
    let appData = sessionStorage.getItem("app");
    let dataMsg = util.decrypt(appData);
    let paramData = sessionStorage.getItem("param");
    let paramMsg = util.decrypt(paramData);
    console.log("dataMsg", dataMsg, appData);
    console.log('params',paramMsg);
    console.log('current',JSON.parse(localStorage.getItem('countInfosArr')));
    let params = {
      is_archive : dataMsg ? dataMsg.is_archive:'0',
      innerip:paramMsg.innerip
    };
    console.log("接口发送信息", params);
    connectApi.setProject(params).then((res) => {
      console.log("接口", res);
    });

    document.ondragstart = document.onselectstart = function () {
      return false;
    };

    this.universal = {
      partner_code: "1220817001",
      $channel: paramArr[2],
      appkey: paramArr[1],
      uname: localInfo ? localInfo.bbs.userInfo.uname : "",
    };
    let game = localStorage.getItem("currentProductName");
    // this.gameName = dataMsg ? dataMsg.g_name : "桌面模式";
    this.gameName = game ? game : "桌面模式";
    console.log("初始数据", this.universal, this.gameName, dataMsg);
    let confirmTime = sessionStorage.getItem('confirmTime');
    let hrefTime = sessionStorage.getItem('hrefTime');
    if(confirmTime && hrefTime && this.firstPrecheck){
      let eventInfo = {
        roomdetail_up_time: this.startTime-confirmTime,
        $duration:this.startTime-hrefTime
      };
      this.firstPrecheck = false;
      this.$record("precheck_p0_ready", eventInfo);
      console.log('进入时长',this.startTime-confirmTime,this.startTime-hrefTime)
    }
  },
  mounted() {
    let that = this;
    // 悬浮球10s未操作时颜色变浅逻辑
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
    
    // 微信浏览器中引导用户点击及使用WeixinJSBridgeReady播放视频
    // let state = 0;
    // if (this.initMsg.flag == 5 && this.isIos) {
    //   document.addEventListener(
    //     "touchstart",
    //     function () {
    //       if (state == 0) {
    //         $("#remoteVideo")[0].play();
    //         state = 1;
    //       }
    //     },
    //     { passive: false }
    //   );
    //   document.addEventListener(
    //     "WeixinJSBridgeReady",
    //     function () {
    //       $("#remoteVideo")[0].play();
    //     },
    //     { passive: false }
    //   );
    // }

    document.ondragstart = document.onselectstart = function () {
      return false;
    };

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
    $(window).bind("beforeunload", this.pageClose);

    if (!this.connectIsShow) {
      this.timeoutCount = 0;
      this.timeoutTimes = 0;
    }
    this.everConnected = false;
    this.isHref();
    websocket.sendThis(this);
    websocket.init();
    // console.log(this);

    // 用户名与方舟ID进行绑定
    let localInfo = JSON.parse(localStorage.getItem("vuex"));
    window.AnalysysAgent.alias(
      localInfo && localInfo.bbs && localInfo.bbs.userInfo.uname
    );
    // window.AnalysysAgent.alias(localInfo?.bbs?.userInfo?.uname)   // 可选链写法
    // this.initsendData()
    this.setFullScreenShow(false);
    localStorage.setItem("screen", JSON.stringify(this.screen));
    let first = JSON.parse(sessionStorage.getItem("novice_teaching"));
    // let first = 1
    if (first && first == 1) {
      this.firstLoad = true;
      this.btnFist = true;
      sessionStorage.setItem("novice_teaching", false);
    }
    console.log("是否首次进入", first, this.firstLoad);
  },
  components: {
    "connect-item": Connect,
    cloudComputerCustom: window["cloud-computer-custom"].cloudComputerCustom,
  },
  computed: {
    ...mapGetters([
      "itemList",
      "initMsg",
      "keyArray",
      "btnKeyArray",
      "MaxPressKeys",
      "editKeyboard",
      "copyItemList",
      "customizeBtnLists",
      "clickEditKeyboard",
      "showNavBar",
      "editKeyboard",
      "mouseMode",
      "saveOfficialKeyboardFlag",
      "fullScreenShow",
      "gamepadInfo"
    ]),
    // 根据延迟是否过高，计算悬浮球图标是否变红
    highNetworkLatency() {
      return this.roundTripTime > 100 ? true : false;
    },
    // 根据延迟是否过高，计算悬浮球图标内的文字是否变红
    roundTripTimeStyle() {
      return { color: this.roundTripTime > 100 ? "red" : "white" };
    },
  },
  watch: {
    // 根据切换的中英文输入法状态，文字键盘的中/英文文字颜色状态
    inputStatus() {
      if (this.inputStatus) {
        this.colorA = "green";
        this.colorB = "white";
      } else {
        this.colorA = "white";
        this.colorB = "green";
      }
    },
    // 根据横竖屏状态设置弹窗提示样式
    isHorizontalScreen() {
      this.$toast.setDefaultOptions({
        className: this.isHorizontalScreen ? "" : "toast",
      });
      this.$dialog.setDefaultOptions({
        className: this.isHorizontalScreen ? "" : "dialog",
      });
    },
    roundTripTime() {
      if (this.roundTripTime > 100 && !this.delayReminder) {
        this.delayReminder = true;
        if (![2, 3, 3.1].includes(this.initMsg.flag)) {
          this.netNumber++;
          // 云电脑对网络延迟大于100ms的2s提示
          // this.$toast({
          //   position: this.isHorizontalScreen ? 'bottom' : '',
          //   className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
          //   message: "网络延迟过高",
          //   duration: 2000,
          // });
        }
      } else if (this.roundTripTime < 100) {
        this.delayReminder = false;
      }
    },
    //画质调节
    packetRate() {
      if(!this.channelFist) return;
      if (this.initMsg.flag == 10) return;
      this.packetNum++;
      console.log("丢包数", this.packetRate,this.packetNum,this.pageShift,this.packetChange);
      if (this.packetShift) {
        if (this.packetRate >= 1 && this.packetRate <= 5) {
          if(this.packetChange != 1){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          this.packetChange = 1;
          if(this.packetRateTime) return
          if (this.pageShift > 0) {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum >= 50) {
                this.byteRateChange(this.pageShift - 1,false);
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络状态不佳，系统已帮您将画质调整至目标画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 60000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum >= 50) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 60000);
          }
        } else if (this.packetRate <= 15) {
          if(this.packetChange != 2){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          this.packetChange = 2;
          if(this.packetRateTime) return
          if (this.pageShift > 0) {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum == 30) {
                this.byteRateChange(this.pageShift - 1,false);
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络状态不佳，系统已帮您将画质调整至目标画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 30000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum == 30) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 30000);
          }
        } else {
          if(this.packetChange != 3){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          this.packetChange = 3;
          if(this.packetRateTime) return
          if (this.pageShift > 0) {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum == 10) {
                this.byteRateChange(this.pageShift - 1,false);
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络状态不佳，系统已帮您将画质调整至目标画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 10000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum == 10) {
                this.byteRateChange(this.pageShift - 1,false);
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 10000);
          }
        }
      } else {
        if (this.packetRate >= 1 && this.packetRate <= 5) {
          if(this.packetChange != 1){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          if(this.packetRateTime) return
          this.packetChange = 1;
          if (this.pageShift > 0) {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum >= 50) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message: "当前网络不稳定，请尝试降低画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 60000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum >= 50) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 60000);
          }
        } else if (this.packetRate <= 15) {
          if(this.packetChange != 2){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          if(this.packetRateTime) return
          this.packetChange = 2;
          if (this.pageShift > 0) {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum > 15) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message: "当前网络不稳定，请尝试降低画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 30000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum > 15) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 30000);
          }
        } else {
          if (this.pageShift > 0) {
            if(this.packetChange != 3){
            clearTimeout(this.packetRateTime);
            this.packetNum = 0;
          }
          if(this.packetRateTime) return
          this.packetChange = 3;
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum > 5) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message: "当前网络不稳定，请尝试降低画质。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 10000);
          } else {
            this.packetRateTime = setTimeout(() => {
              if (this.packetNum > 5) {
                this.$toast({
                  position: this.isHorizontalScreen ? 'bottom' : '',
                  className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                  message:
                    "检测到您的网络不满足最低画质使用要求，建议您更换网络保证使用体验。",
                  duration: 2000,
                });
              }
              // console.log('www',this.packetChange,this.packetNum)
              this.packetNum = 0;
              this.packetChange = 0;
            }, 10000);
          }
        }
      }
    },
    // 深度监听虚拟手柄flag的变化
    gamepadInfo: {
      handler (newVal, oldVal) {
        if ((newVal && newVal.flag) !== (oldVal && oldVal.flag)) {
          if ((newVal && newVal.flag)) {
            this.gamepadDeviceStatusFlag = true
          } else {
            this.gamepadDeviceStatusFlag = false
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(["getCustomizeBtnLists", "getkeyInfo"]),
    ...mapMutations([
      "setItemList",
      "set_key",
      "delete_key",
      "set_EmptyKey",
      "set_BtnKeyArray",
      "set_BtnEmptyKey",
      "setEditKeyboard",
      "setClickEditKeyboard",
      "setCopyItemList",
      "setJustSave",
      "setRememberHasSaveKeyboard",
      "setShowNavBar",
      "setSaveAfterEdit",
      "setCreateClick",
      "setHideShowCourse",
      "setCurrentTutorial",
      "setAddNewCustomizeBtn",
      "setMouseMode",
      "setSaveOfficialKeyboardFlag",
      "setFullScreenShow",
      "setJudgeTouchStart",
      "setShowTextKeyboard",
      "setMoveItem",
      "setNotifyComponent",
      "setGamepadInfo"
    ]),
    // 修改悬浮球层级
    changeIndex(state){
      console.log('修改层级',state)
      this.btnIconIndex=state;
    },
    // 云电脑组件向流桌面上报埋点
    sendDataBuriedPoint(name, data) {
      this.$record(name, data);
    },
    // 云电脑组件菜单的显示与隐藏
    changeSideBarShow(status) {
      this.isSidwbar = status;
    },
    // 鼠标速度的调节
    changemousespeed(speed) {
      this.mouseSpeed = speed;
    },
    // 将时间全部统计为秒
    timeDifference(baseHour) {
      var str = baseHour;
      var arr = str.split(":");
      var hs = parseInt(arr[0] * 3600);
      var ms = parseInt(arr[1] * 60);
      var ss = parseInt(arr[2]);
      var seconds = hs + ms + ss;
      return seconds;
    },
    // 将当前页面生成图片--截图
    cutPicture() {
      let video = document.getElementById("remoteVideo");
      var canvas = document.createElement("canvas");
      canvas.width = this.videosWidth;
      canvas.height = this.videosHeight;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, this.videosWidth, this.videosHeight);
      this.imgSrc = canvas.toDataURL("image/jpeg");
    },
    // 
    clk_cus_close_sidebar(data) {
      if (this.isSidwbar) this.isSidwbar = data;
    },
    // 用户暂时离开时传的方法
    setAction() {
      this.recordComeBackCount = 0;
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
      this.lockBtnInputStatusCount = JSON.parse(
        localStorage.getItem("lockBtnInputCount")
      );
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
      this.goRechargeUrl();
    },
    goRechargeUrl() {
      // 充值
      let localInfo = JSON.parse(localStorage.getItem("vuex"))
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
    // 结束试玩
    toEnd() {
      window.location.href = document.referrer;
    },
    // 菜单栏展开逻辑
    showSidebar() {
      // console.log("组件", this.$refs.silderItem);
      this.btnFist = false;
      if(this.isLockBtn[888]){
        this.lockBtn({key: "Alt",keyCode: 18,keyPressMode: 2},888)
        this.whichKey({key: "空格",keyCode: 32},34);
        this.KeyEnd({key: "空格",keyCode: 32},34);
      }
      if (this.showNavBar) {
        return;
      }
      if (this.firstEntry === 1) {
        this.firstEntry++;
      }
      this.isBtn = 2;
      this.isSidwbar = !this.isSidwbar;
      this.lastTime = new Date().getTime();
      this.longTimeNoOperation = false;
      this.traceLog("this.isSidwbar: " + this.isSidwbar);
    },
    // 悬浮球拖动方法 start
    panstart(event) {
      this.isPan = 2;
      this.floatBallFlag = true
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.floatBallPosition.x = touch.clientX;
      this.floatBallPosition.y = touch.clientY;
      this.dx = this.$refs.btnIcon.offsetLeft;
      this.dy = this.$refs.btnIcon.offsetTop;
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
      if (this.floatBallFlag) {
        this.isPan = 2;
        this.lastTime = new Date().getTime();
        this.longTimeNoOperation = false;
        this.traceLog("panmove");
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.floatBallPosition.x;
        this.ny = touch.clientY - this.floatBallPosition.y;
        if (this.isHorizontalScreen) {
          this.xPum = this.dx + this.nx;
          this.yPum = this.dy + this.ny;
        } else {
          this.xPum = this.dx - this.ny;
          this.yPum = this.dy + this.nx;
        }
        let width = window.innerWidth - this.$refs.btnIcon.offsetWidth; //屏幕宽度减去自身控件宽度
        let height = window.innerHeight - this.$refs.btnIcon.offsetHeight; //屏幕高度减去自身控件高
        if (this.xPum < (this.screen.left || 0)) {
          this.xPum = (this.screen.left || 0);
          this.$refs.btnIcon.style.left = this.xPum + "px";
        }
        if (this.yPum < (this.screen.top || 0)) {
          this.yPum = (this.screen.top || 0);
          this.$refs.btnIcon.style.top = this.yPum + "px";
        }
        if (this.isHorizontalScreen) {
          if (this.xPum > width - (this.screen.left || 0)) {
            this.xPum = width - (this.screen.left || 0);
            this.$refs.btnIcon.style.left = this.xPum + "px";
          }
          if (this.yPum > height - (this.screen.top || 0)) {
            this.yPum = height - (this.screen.top || 0);
            this.$refs.btnIcon.style.top = this.yPum + "px";
          }
        } else {
          if (
            this.xPum >
            this.screen.totalWidth -
              (this.screen.left || 0) -
              this.$refs.btnIcon.offsetWidth
          ) {
            this.xPum =
              this.screen.totalWidth -
              (this.screen.left || 0) -
              this.$refs.btnIcon.offsetWidth;
            this.$refs.btnIcon.style.left = this.xPum + "px";
          }
          if (
            this.yPum >
            this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.btnIcon.offsetHeight
          ) {
            this.yPum =
              this.screen.totalHeight -
              (this.screen.top || 0) -
              this.$refs.btnIcon.offsetHeight;
            this.$refs.btnIcon.style.top = this.yPum + "px";
          }
        }
        this.$refs.btnIcon.style.left = this.xPum + "px";
        this.$refs.btnIcon.style.top = this.yPum + "px";
      }
    },
    panend(event) {
      this.isPan = 1;
      this.floatBallFlag = false
    },
    // 悬浮球拖动方法 end
    // 触屏操作 动画结束
    waveFinish(data) {
      this.showWaves = data;
    },
    // 三指和在光标处同时唤出文字键盘导致自定义键盘隐藏的逻辑
    callUpConflict (data) {
      this.threeFingerClickFlag = data
    },
    //打印日志
    traceLog(data) {
      if (this.isLog) {
        let myDate = new Date();
        console.log(myDate.toLocaleString() + ":  ");
        console.log(data);
      }
    },
    // 打乱数组
    shuffle(arr) {
      for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
      }
      return arr;
    },
    // 把json对象转换为url参数
    jsonToUrl(jsonObj) {
      let params = Object.keys(jsonObj)
        .map(function (key) {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(jsonObj[key])
          );
        })
        .join("&");
      return params;
    },
    // 暂时离开
    away() {
      this.firstEntry = 1;
      this.panel = false;
      this.setAction();
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
        let minutes = this.timeDifference(time);
        let eventInfos = {
          roomdetail_up_time: minutes,
          port: this.netNumber,
        };
        this.$record("precheck_net_delay", eventInfos);
      }
      //   window.history.go(-1);
      // window.location.replace(document.referrer)
      window.location.href = document.referrer;
    },
    // 退出游戏
    off() {
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
            this.$dialog
              .confirm({
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
                      this.$dialog
                        .alert({
                          message: "注销成功",
                        })
                        .then(() => {
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
            this.$dialog
              .alert({
                message: "注销失败",
              })
              .then(() => {
                // on close
                this.$dialog.close;
              });
          }
        });
    },
    // 修复重启
    reset() {
      //this.tracelog("reset the process");
      let sendData = "hashKey=" + this.hashKey + "&optionType=17";
      if (this.loadData.appMsg) {
        //this.tracelog("ok,app-partern");
        sendData += "&value1=" + 1;
      } else {
        sendData += "&value1=" + 0;
      }
      this.httpSend(sendData, "/api/options.evt", false, this.hashKey);
    }
  },
  beforeDestroy() {
    this.firstEntry = 1;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}