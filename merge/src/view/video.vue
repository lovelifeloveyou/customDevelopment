<template>
  <div>
    <div
      id="player"
      :class="[5,'5'].includes(initMsg.flag) && isVertical  ? 'playTop' : 'pageTop'"
      :style="data"
    >
      <div
        id="videos"
        v-hammer:tap="tap"
        v-hammer:press="press"
        v-hammer:pressup="pressup"
        v-gesture:start="gestureTouchStart"
        v-gesture:pressMove="pressMove"
        v-gesture:twoFingerPressMove="pressMove"
        v-gesture:end="gestureTouchEnd"
        ref="videos"
        :style="{
          width: screen.videosWidth + 'px',
          height: screen.videosHeight + 'px',
          marginLeft: screen.left + 'px',
          marginTop: screen.top + 'px'
        }"
      >
        <video
          id="remoteVideo"
          ref="remoteVideo"
          muted
          autoplay
          playsinline
          webkit-playsinline
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="landscape"
          x-webkit-airplay="allow"
          x5-playsinline
          :style="{
            'width': screen.videosWidth + 'px',
            'height': (showFullScreenSwitch && fullScreenShow) ? screen.changeRatioHeight + 'px' : screen.videosHeight + 'px',
            objectFit: 'fill',
            'position': 'relative',
            'transform': (showFullScreenSwitch && fullScreenShow) ? 'scaleY(' + screen.totalHeight / screen.changeRatioHeight + ')' : 'none',
            'top': (showFullScreenSwitch && fullScreenShow) ? -(screen.changeRatioHeight - screen.totalHeight) / 2 + 'px' : ''
          }"
        ></video>
        <img
          class="imgSrc"
          v-if="imgShow"
          :src="imgSrc"
          :style="{
            width: screen.videosWidth + 'px',
            height: screen.videosHeight + 'px',
          }"
        />
        <!-- <img src="#" ref="mouse" id="mouseImg" /> -->
        <img
          src="../assets/img/mouse.png"
          ref="mouse"
          id="mouseImg"
          :style="{ left: mouseLeft + 'px', top: mouseTop + 'px' }"
          v-if="mouseMode === false"
        />

        <!-- 官方虚拟键盘组件 -->
        <!-- <officialKeyboard
          :officialKeyboardFlag="officialKeyboardFlag"
          :screen="screen"
          @exitOfficialKeyboard="exitKey"
          @transferData="transferData"
          @returnData="returnData"
        ></officialKeyboard> -->

        <!-- <div id="keys" v-show="panel">
          <div id="allKey" v-show="allKey">
            <div class="letter">
              <button
                :class="activeClass == index ? 'actived' : ''"
                v-for="(item, index) in allKeys"
                :key="index"
                @touchstart="whichKey(item, index)"
                @touchend="KeyEnd(item)"
              >
                <span v-if="item.key === '中/英'">
                  <span >中</span>/
                  <span >英</span>
                </span>
                <span v-else>{{ item.key }}</span>
              </button>
            </div>
            <div class="number">
              <button
                :class="activeClass == index + 100 ? 'actived' : ''"
                v-for="(item, index) in numKey"
                :key="index"
                @touchstart="whichKey(item, index + 100)"
                @touchend="KeyEnd(item)"
              >
                <span>{{ item.key }}</span>
              </button>
            </div>
          </div>
          <div id="sign" v-show="signKey">
            <button
              :class="activeClass == index + 200 ? 'actived' : ''"
              v-for="(item, index) in signKeys"
              :key="index"
              @touchstart="keySignDown(item, index + 200)"
              @touchend="keySpecailUp(item)"
            >
              <span v-if="item.key === '中/英'">
                <span :style="{ color: colorA }">中</span>/
                <span :style="{ color: colorB }">英</span>
              </span>
              <span v-else>{{ item.key }}</span>
            </button>
          </div>
          <div id="speCtrl" v-show="SpeKey">
            <button
              :class="activeClass == index + 300 ? 'actived' : ''"
              v-for="(item, index) in speCtrls"
              :key="index"
              @touchstart="whichKey(item, index + 300)"
              @touchend="KeyEnd(item)"
            >
              <span v-if="item.key === '中/英'">
                <span :style="{ color: colorA }">中</span>/
                <span :style="{ color: colorB }">英</span>
              </span>
              <span v-else>{{ item.key }}</span>
            </button>
          </div>
        </div> -->

        <div id="icon">
          <div
            ref="btnIcon"
            :style="
              [2, 3, 3.1].includes(initMsg.flag)
                ? highNetworkLatency
                  ? longTimeNoOperation
                    ? cafeShallowState
                    : cafeDeepState
                  : longTimeNoOperation
                  ? cafeShallowState
                  : cafeDeepState
                : highNetworkLatency
                ? longTimeNoOperation
                  ? anotherShallowState
                  : anotherDeepState
                : longTimeNoOperation
                ? shallowState
                : deepState
            "
            :class="{
              btnIcon: true,
              palm: [2, 3, 3.1].includes(initMsg.flag),
              tada: true
            }"
            @click="showSidebar"
            @touchstart="panstart"
            @touchmove="panmove"
            @touchend="panend"
          >
            <i></i>
            <div class="detailMsg" :class="firstLoad && btnFist ?'arrow_box':''">
              <p v-if="byteRateSpeed === byteRateSpeed">
                {{ byteRateSpeed }}
                <span>KB/s</span>
              </p>
              <p v-else>
                0
                <span>KB/s</span>
              </p>
              <p v-if="roundTripTime === roundTripTime" :style="roundTripTimeStyle">
                {{ roundTripTime }}
                <span :style="roundTripTimeStyle">ms</span>
              </p>
              <p v-else>
                0
                <span>ms</span>
              </p>
            </div>
            <div v-if="firstLoad && btnFist" class="icon arrow_rbox"></div>
          </div>
        </div>

        <!-- <silder-item
          :loadData="loadData"
          :screen="screen"
          :isSidwbar="isSidwbar"
          :roundTripTime="roundTripTime"
          :byteRateSpeed="byteRateSpeed"
          :showFullScreenSwitch="showFullScreenSwitch"
          :firstLoad="firstLoad"
          @showKey="showKey"
          @away="away"
          @reset="reset"
          @goRechargeUrl="goRechargeUrl"
          @changemousespeed="changemousespeed"
          @createClick="createClick"
          @changeNet="changeNet"
          @showSidebar="showSidebar"
          @showFullScreen="showFullScreen"
          v-show="isSidwbar"
        ></silder-item>
        <net-item
          :roundTripTime="roundTripTime"
          :byteRateSpeed="byteRateSpeed"
          :packetRate="packetRate"
          @changeNet="changeNet"
          v-show="isNetshow"
        ></net-item> -->

        <!-- 通过组件的形式引入各端的自定义样式 -->
        <cloudComputerComponent
          :isSidwbar="isSidwbar"
          :screen="screen"
          :showFullScreenSwitch="showFullScreenSwitch"
          :firstLoad="firstLoad"
          :isNetshow="isNetshow"
          :roundTripTime="roundTripTime"
          :byteRateSpeed="byteRateSpeed"
          :packetRate="packetRate"
          :panel="panel"
          :allKey="allKey"
          :signKey="signKey"
          :SpeKey="SpeKey"
          :iscaps="iscaps"
          :colorA="colorA"
          :colorB="colorB"
          :activeClass="activeClass"
          :showCustomizeDiv="show_customize_div"
          :officialKeyboardFlag="officialKeyboardFlag"
          :universal="universal"
          :Showcustomize="Showcustomize"
          :customize_editBtn_data="customize_editBtn_data"
          :isHorizontalScreen="isHorizontalScreen"
          :popupNav="popupNav"
          :exitCustomEdit="exitCustomEdit"
          :dragBoxShowSidebar="isSidwbar"
          :secondMenu="secondMenu"
          @showKey="showKey"
          @away="away"
          @reset="reset"
          @goRechargeUrl="goRechargeUrl"
          @changemousespeed="changemousespeed"
          @createClick="createClick"
          @changeNet="changeNet"
          @closeNetWork="changeNet"
          @showSidebar="showSidebar"
          @showFullScreen="showFullScreen"
          @whickKeyTextKeyboard="whichKey"
          @KeyEndTextKeyboard="KeyEnd"
          @keySignDownTextKeyboard="keySignDown"
          @keySpecailUp="keySpecailUp"
          @cusEditFn="cus_editFn"
          @cusExitFn="cus_exitFn"
          @exitOfficialKeyboard="exitKey"
          @transferData="transferData"
          @returnData="returnData"
          @initCustomizeShow="initCustomizeShow"
          @Showcustomize_son="Showcustomize_son"
          @clk_cus_close_sidebar="clk_cus_close_sidebar"
          @showDragBall="showDragBall"
          @showNavBar="emitShowNavBar"
          @updateElement="updateElement"
        >
        </cloudComputerComponent>

        <div class="dialog-start" v-if="[1, 3, 4, 5, '5'].includes(initMsg.flag) ? false : true">
          <div class="pannel">
            <p>请把手机“横向”摆放，若本提示还在，</p>
            <p>请关闭手机设置中【竖屏锁定】功能即可</p>
          </div>
        </div>

        <!-- 引导图 -->
        <van-overlay :show="show">
          <div class="wrapper">
            <div class="block" v-show="active == 1">
              <p class="choose" style="text-align: center;font-size:18px; ">请选择操作模式</p>
              <van-row
                type="flex"
                justify="space-around"
                style="padding-top: 20px; margin-bottom: 20px; "
              >
                <van-col span="10" @click="changePicTouch">
                  <img :src="imgTouch" style="width: 60%;" />
                  <p style="font-size: 14px; ">触控模式</p>
                </van-col>
                <van-col span="10" @click="changePicMouse">
                  <img :src="imgMouse" style="width: 60%;" />
                  <p style="font-size: 14px; ">鼠标模式</p>
                </van-col>
              </van-row>
              <van-row type="flex" justify="space-between">
                <van-col span="11">
                  <p style="font-size: 12px; ">触控操作，易上手。但部分游戏模式操作困难。游戏时建议切换为鼠标模式。</p>
                </van-col>
                <van-col span="11">
                  <p style="font-size: 12px; ">以鼠标为主体的操作模式。适配性高，利于配合虚拟键盘对任意游戏进行操控。</p>
                </van-col>
              </van-row>
              <p
                style="text-align: center;color: rgb(7, 178, 113);margin-top: 8vh;font-size:11px; "
              >您可以在漂浮球内随时切换这两种模式，方便您进行体验。</p>
            </div>
            <div class="touch" v-show="active == 2">
              <van-nav-bar
                title="触控模式操作说明"
                left-text
                right-text="开始使用"
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
              />
              <van-row type="flex" justify="space-around" style="padding-top: 20vh;">
                <van-col span="5">
                  <img style="width: 100%;" :src="guideList[4]" />
                </van-col>
                <van-col span="5">
                  <img style="width: 100%;" :src="guideList[5]" />
                </van-col>
                <van-col span="5">
                  <img style="width: 100%;" :src="guideList[6]" />
                </van-col>
                <van-col span="5">
                  <img style="width: 100%;" :src="guideList[7]" />
                </van-col>
              </van-row>
            </div>
            <div class="mouse" v-show="active == 3">
              <van-nav-bar
                title="鼠标模式操作说明"
                left-text
                right-text="开始使用"
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
              />
              <div class="imgs" style>
                <img style="width: 18%; margin-top:3vh" :src="guideList[8]" />
                <img style="width: 18%; margin-left:10vw; margin-top:3vh" :src="guideList[9]" />
                <img style="width: 18%; margin-left:10vw; margin-top:3vh" :src="guideList[10]" />
                <img
                  style="width: 18%; padding-left:13vw;  margin-left:0vw; margin-top:3vh"
                  :src="guideList[11]"
                />
                <img
                  style="width: 18%; padding-right:10vw; margin-left:10vw; margin-top:3vh"
                  :src="guideList[12]"
                />
              </div>
            </div>
          </div>
        </van-overlay>
        <!-- // ---------------------------------------------------引导图截至此 // addd -->
        <!-- <customize-item
          @initCustomizeShow="initCustomizeShow"
          :screen="screen"
          :universal="universal"
          @Showcustomize_son="Showcustomize_son"
          :Showcustomize="Showcustomize"
          :customize_editBtn_data="customize_editBtn_data"
          @clk_cus_close_sidebar="clk_cus_close_sidebar"
          @showDragBall="showDragBall"
          :isHorizontalScreen="isHorizontalScreen"
          @showNavBar="emitShowNavBar"
          :popupNav="popupNav"
          :exitCustomEdit="exitCustomEdit"
        ></customize-item>
        <dragBox-item
          v-for="(item, index) in itemList"
          :key="index"
          :keymsg="item"
          :title="index"
          :screen="screen"
          :isHorizontalScreen="isHorizontalScreen"
          :showSidebar="isSidwbar"
          :secondMenu="secondMenu"
          @transferData="transferData"
          @returnData="returnData"
          @updateElement="updateElement"
        ></dragBox-item>

        <div v-show="show_customize_div">
          <div style="display:flex;">
            <div class="exitBtn_cus editBtn" ref="exitBtn_cus" @click="cus_editFn">编辑</div>
            <div class="exitBtn_cus" ref="exitBtn_cus" @touchstart="cus_exitFn">退出</div>
          </div>
        </div> -->

        <div class="wrap" v-if="freeIsEnd">
          <div class="popup_container">
            <div class="popup">
              <p class="title">体验已结束</p>
              <p class="tip">开通会员畅玩更多精彩游戏</p>
              <div class="rechargeBtn">
                <p @click="toEnd">结束试玩</p>
                <p @click="toRecharge">开通会员</p>
              </div>
            </div>
            <div class="mark"></div>
          </div>
        </div>
        <Wave
          :showWaves="showWaves"
          :waveLeft="waveLeft"
          :waveTop="waveTop"
          @waveFinish="waveFinish"
        />
      </div>
      <div id="loadImg" :style="dataImg">
        <img
          src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobile/load.jpg"
          ref="load"
          :style="loadImgStyle"
        />
      </div>
      <connect-item
        :isHorizontalScreen="isHorizontalScreen"
        :timeoutTimes="timeoutTimes"
        :timeoutCount="timeoutCount"
        :connectIsShow="connectIsShow"
        @away="away"
      ></connect-item>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
// import Direction from "../components/direction";
// import Roller from "../components/roller";
import Connect from "../components/connect";
import $ from "jquery";
import tools from "@/utils/tools";
import connectApi from "@/api/system.js";
import util from "../common/libs/util.crypto";
import websocket from "../common/libs/websocket.js";
import "../common/ufo/index";
import html2canvas from "html2canvas";
import customize from "@/components/customize/index";
import silder from "@/components/silder/index";
import network from "@/components/network/index";
import dragbox from "@/components/customize/drag/dragBox";
import officialKeyboard from "@/components/officialKeyboard/index";
import Wave from "@/components/waves";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "videoScreen",
  components: {
    "dragBox-item": dragbox,
    // Direction,
    // Roller,
    [Dialog.Component.name]: Dialog.Component,
    "customize-item": customize,
    "connect-item": Connect,
    "silder-item": silder,
    "net-item": network,
    html2canvas,
    Wave,
    officialKeyboard,
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
    ]),
    secondMenu() {
      return this.isShowMyborad || this.keyShow;
    },
    highNetworkLatency() {
      return this.roundTripTime > 100 ? true : false;
    },
    roundTripTimeStyle() {
      return { color: this.roundTripTime > 100 ? "red" : "white" };
    },
  },
  provide() {
    return {
      created: this.createClick,
      editFn: this.cus_editFn,
      btnSelf: this.btnSelf,
      showKey: this.showKey,
      keySort: this.keySort,
      exitKey:this.exitKey,
    };
  },
  data() {
    return {
      syncDataList: [], // 同步数据 查询差异化 the last time
      editData: "", // edit 编辑数据
      customize_editBtn_data: {},
      isBoo: -1,
      show_customize_div: false,
      Showcustomize: 1,
      // 连接流程
      loadingRate: 0,
      directSessionKeyHead: "11566D692A774BCA08F8", // 直联sessionKey
      directSessionKeyFull: "11566D692A774BCA08F81490F59C3018", // 直联sessionKey
      isLog: true,
      isVertical: true, // 是否为竖屏
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
      isMode: false, //  鼠标模式的耳机菜单
      isRight: false, // true右键，false非右键
      isPress: false, // 是否长按
      keyShow: true, // 游戏键盘
      panel: false, //  输入键盘面板
      allKey: false, //  输入键盘字母数字
      signKey: false, //  输入键盘字符符号
      SpeKey: false, //  输入键盘控制键
      iscaps: false, // 是否为大写
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
      activeClass: -1,
      lockActive: [],
      index: "",
      allKeys: [
        { key: "Tab", keyCode: 9 },
        { key: "q", keyCode: 81 },
        { key: "w", keyCode: 87 },
        { key: "e", keyCode: 69 },
        { key: "r", keyCode: 82 },
        { key: "t", keyCode: 84 },
        { key: "y", keyCode: 89 },
        { key: "u", keyCode: 85 },
        { key: "i", keyCode: 73 },
        { key: "o", keyCode: 79 },
        { key: "p", keyCode: 80 },
        { key: "中/英", keyCode: 16 },
        { key: "a", keyCode: 65 },
        { key: "s", keyCode: 83 },
        { key: "d", keyCode: 68 },
        { key: "f", keyCode: 70 },
        { key: "g", keyCode: 71 },
        { key: "h", keyCode: 72 },
        { key: "j", keyCode: 74 },
        { key: "k", keyCode: 75 },
        { key: "l", keyCode: 76 },
        { key: "Back", keyCode: 8 },
        { key: "小写", keyCode: 20 },
        { key: "符", keyCode: 700 },
        { key: "z", keyCode: 90 },
        { key: "x", keyCode: 88 },
        { key: "c", keyCode: 67 },
        { key: "v", keyCode: 86 },
        { key: "b", keyCode: 66 },
        { key: "n", keyCode: 78 },
        { key: "m", keyCode: 77 },
        { key: "确定", keyCode: 13 },
        { key: "隐藏", keyCode: 800 },
        { key: "空格", keyCode: 32 },
        { key: "控制码", keyCode: 900 },
      ],

      CapsallKeys: [
        { key: "Tab", keyCode: 9 },
        { key: "Q", keyCode: 81 },
        { key: "W", keyCode: 87 },
        { key: "E", keyCode: 69 },
        { key: "R", keyCode: 82 },
        { key: "T", keyCode: 84 },
        { key: "Y", keyCode: 89 },
        { key: "U", keyCode: 85 },
        { key: "I", keyCode: 73 },
        { key: "O", keyCode: 79 },
        { key: "P", keyCode: 80 },
        { key: "中/英", keyCode: 16 },
        { key: "A", keyCode: 65 },
        { key: "S", keyCode: 83 },
        { key: "D", keyCode: 68 },
        { key: "F", keyCode: 70 },
        { key: "G", keyCode: 71 },
        { key: "H", keyCode: 72 },
        { key: "J", keyCode: 74 },
        { key: "K", keyCode: 75 },
        { key: "L", keyCode: 76 },
        { key: "Back", keyCode: 8 },
        { key: "大写", keyCode: 20 },
        { key: "符", keyCode: 700 },
        { key: "Z", keyCode: 90 },
        { key: "X", keyCode: 88 },
        { key: "C", keyCode: 67 },
        { key: "V", keyCode: 86 },
        { key: "B", keyCode: 66 },
        { key: "N", keyCode: 78 },
        { key: "M", keyCode: 77 },
        { key: "确定", keyCode: 13 },
        { key: "隐藏", keyCode: 800 },
        { key: "空格", keyCode: 32 },
        { key: "控制码", keyCode: 900 },
      ],

      numKey: [
        { key: "7", keyCode: 55 },
        { key: "8", keyCode: 56 },
        { key: "9", keyCode: 57 },
        { key: "4", keyCode: 52 },
        { key: "5", keyCode: 53 },
        { key: "6", keyCode: 54 },
        { key: "1", keyCode: 49 },
        { key: "2", keyCode: 50 },
        { key: "3", keyCode: 51 },
        { key: "0", keyCode: 48 },
        { key: "@", keyCode: 50, len: 2 },
        { key: ".", keyCode: 190 },
      ],

      signKeys: [
        { key: "`", keyCode: 192, len: 1 },
        { key: "~", keyCode: 192, len: 2 },
        { key: "!", keyCode: 49, len: 2 },
        // {key: '@', keyCode: 50, len: 2},
        { key: "#", keyCode: 51, len: 2 },
        { key: "?", keyCode: 191, len: 2 },
        { key: "%", keyCode: 53, len: 2 },
        { key: "^", keyCode: 54, len: 2 },
        { key: "中/英", keyCode: 16, len: 0 },
        { key: "&", keyCode: 55, len: 2 },
        { key: "*", keyCode: 56, len: 2 },
        { key: "(", keyCode: 57, len: 2 },
        { key: ")", keyCode: 48, len: 2 },
        { key: "-", keyCode: 189, len: 1 },
        { key: "=", keyCode: 187, len: 1 },
        { key: "_", keyCode: 189, len: 2 },
        { key: "+", keyCode: 187, len: 2 },
        { key: "[", keyCode: 219, len: 1 },
        { key: "]", keyCode: 221, len: 1 },
        { key: "{", keyCode: 219, len: 2 },
        { key: "}", keyCode: 221, len: 2 },
        { key: "\\", keyCode: 220, len: 1 },
        { key: "|", keyCode: 220, len: 2 },
        { key: ";", keyCode: 186, len: 1 },
        { key: ":", keyCode: 186, len: 2 },
        { key: "'", keyCode: 222, len: 1 },
        { key: '"', keyCode: 222, len: 2 },
        { key: ",", keyCode: 188, len: 1 },
        // {key: '.', keyCode: 190, len: 1},
        { key: "<", keyCode: 188, len: 2 },
        { key: ">", keyCode: 190, len: 2 },
        { key: "/", keyCode: 191, len: 1 },
        { key: "$", keyCode: 52, len: 2 },
        { key: "返回", keyCode: 1000, len: 0 },
      ],

      speCtrls: [
        { key: "左", keyCode: 37 },
        { key: "上", keyCode: 38 },
        { key: "下", keyCode: 40 },
        { key: "右", keyCode: 39 },
        { key: "ESC", keyCode: 27 },
        { key: "CTRL(L)", keyCode: 17 },
        { key: "CTRL(R)", keyCode: 17 },
        { key: "SHIFT(L)", keyCode: 16 },
        { key: "SHIFT(R)", keyCode: 16 },
        { key: "中/英", keyCode: 16 },
        { key: "ALT(L)", keyCode: 18 },
        { key: "ALT(R)", keyCode: 18 },
        { key: "TAB", keyCode: 9 },
        { key: "WIN", keyCode: 1001 },
        { key: "HOME", keyCode: 36 },
        { key: "END", keyCode: 35 },
        { key: "PRTSC", keyCode: 900000 },
        { key: "SCRLK", keyCode: 145 },
        { key: "PAUSE", keyCode: 19 },
        { key: "INS", keyCode: 45 },
        { key: "DEL", keyCode: 46 },
        { key: "PGUP", keyCode: 33 },
        { key: "PGDN", keyCode: 34 },
        { key: "F1", keyCode: 112 },
        { key: "F2", keyCode: 113 },
        { key: "F3", keyCode: 114 },
        { key: "F4", keyCode: 115 },
        { key: "F5", keyCode: 116 },
        { key: "F6", keyCode: 117 },
        { key: "F7", keyCode: 118 },
        { key: "F8", keyCode: 119 },
        { key: "F9", keyCode: 120 },
        { key: "F10", keyCode: 121 },
        { key: "F11", keyCode: 122 },
        { key: "F12", keyCode: 123 },
        { key: "返回", keyCode: 1000 },
      ],

      // -----------test----------------// 强制横屏test
      data: "",
      pageTop: "",
      dataImg: {},
      dx: "",
      dy: "",
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
      isShowMyborad: false, // 是否显示我的键盘二级菜单
      customizeBtn: {
        customDirection: false,
        customRoller: false,
      },
      cus_exit: false,
      loading: false,
      finished: false,
      isClkMyKeyboard: false,
      showDrag: false,
      isHorizontalScreen: false,
      count: 1,
      firstClick: true,
      needShowNavBar: false,
      needIconShow: false,
      popupNav: "",
      exitCustomEdit: false,
      saveOfficialKeyboard: {
        item: "",
        index: "",
        flag: "official",
      },
      saveCustomKeyboard: {
        item: "",
        index: "",
        flag: "custom",
      },
      current: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      loadImgStyle: {},
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
      firstMoveMouse: true,
      tapFlag: false,
      quitOfficialKeyboard: false,
      connectIsShow: false,
      connectTime: null,
      isVisablty: 0,
      imgSrc: "",
      showWaves: false,
      waveLeft: 0,
      waveTop: 0,
      showModeSelect: false,
      showFullScreenSelect: false,
      keyboard_index: null,
      touchAnimationTime: null,
      officialKeyboardFlag: "",
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
      isNetshow: false,
      showFullScreenSwitch: true,
      firstLoad: false,
      btnFist: false,
    };
  },
  created() {
    //// 强制横屏test
    this.renderResize();
    // this.isGuide();

    var iLastTouch = null;
    document.ondragstart = document.onselectstart = function () {
      return false;
    };
    // 响应式布局
    let htmlSize = function () {
      let deviceWidth = document.documentElement.clientWidth;
      if (deviceWidth > 1280) deviceWidth = 1280;
      document.documentElement.style.fontSize = deviceWidth / 12.8 + "px";
    };
    // htmlSize()
    window.onresize = function () {
      // htmlSize()
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
    // // 问题19
    isSidwbar(newVal) {
      if (newVal) {
        this.sup_index = 0;
        this.isSub = false;
        this.isMode = false;
        this.isShowMyborad = false;
        this.showModeSelect = false;
        this.showFullScreenSelect = false;
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
          // 云电脑对网络延迟大于100ms的2s提示
          this.$toast({
            position: "middle",
            message: "网络延迟过高",
            duration: 2000,
          });
        }
      } else if (this.roundTripTime < 100) {
        this.delayReminder = false;
      }
    },
    itemList() {
      let itemListInfo = JSON.parse(JSON.stringify(this.itemList));
      let rollerInfo = itemListInfo.find((ele) =>
        [101, 102].includes(ele.rockerType)
      );
      let directionInfo = itemListInfo.find((ele) =>
        [103, 104].includes(ele.rockerType)
      );
      localStorage.setItem("rollerInfo", JSON.stringify(rollerInfo));
      localStorage.setItem("directionInfo", JSON.stringify(directionInfo));
    },
    mouseMode() {
      this.sum_index = this.mouseMode ? 1 : this.mouseMode === false ? 2 : 0;
    },
    fullScreenShow() {
      this.rotate();
      if (this.itemList.length) {
        this.setItemList([]);
        const { item, index } = this.saveCustomKeyboard;
        this.btnSelf(item, index);
      }
    },
  },
  mounted() {
    let that = this;
    document.addEventListener("visibilitychange", this.$visable);
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
    if (this.firstClick) {
      this.firstClick = false;
      this.getCustomizeKeyboardLists();
    }
    // 监听屏幕事件 // 强制横屏test
    window.addEventListener("resize", this.renderResize, false);
    document.ondragstart = document.onselectstart = function () {
      return false;
    };
    // this.isGuide();
    // 控件相关
    this.UIloadingImg = $("#loadImg");
    this.UIvideoImg = $("#videos");
    this.UIportrait = $("#portrait");
    console.time("进入流桌面时间");
    this.UIloadingImg.show();
    this.UIvideoImg.hide();
    this.UIportrait.hide();
    // this.fullScreen();
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
    // console.log("this");
    // console.log(this);
    websocket.sendThis(this);
    websocket.init();
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
    if (first  && first == 1) {
      this.firstLoad = true;
      this.btnFist = true;
      sessionStorage.setItem("novice_teaching", false);
    }
    console.log("是否首次进入", first, this.firstLoad);
  },
  beforeDestroy() {
    // 强制横屏test
    window.removeEventListener("resize", this.renderResize, false);
    this.firstEntry = 1;
    if (this.timer) {
      clearInterval(this.timer);
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
      "setLevelShow",
      "setAddNewCustomizeBtn",
      "setMouseMode",
      "setSaveOfficialKeyboardFlag",
      "setFullScreenShow",
    ]),
    changemousespeed(speed) {
      this.mouseSpeed = speed;
    },
    changeNet(status) {
      this.isNetshow = status;
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
        localStorage.setItem("vwidth", this.screen.videosWidth);
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
      if (this.keyShow) {
        localStorage.setItem(
          "saveUserBehavior",
          JSON.stringify(this.saveOfficialKeyboard)
        );
      } else if (this.show_customize_div) {
        localStorage.setItem(
          "saveUserBehavior",
          JSON.stringify(this.saveCustomKeyboard)
        );
      } else {
        localStorage.setItem("saveUserBehavior", null);
      }
      localStorage.setItem(
        "currentInputStatus",
        JSON.stringify(this.inputStatus)
      );
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
      this.inputStatus = JSON.parse(localStorage.getItem("currentInputStatus"));
      this.setFullScreenShow(
        JSON.parse(localStorage.getItem("cacheFullScreen"))
      );
      this.rotate();
      this.lockBtnInputStatusCount = JSON.parse(
        localStorage.getItem("lockBtnInputCount")
      );
      const saveFlag = JSON.parse(localStorage.getItem("saveUserBehavior"));
      if (saveFlag && saveFlag.flag === "official") {
        let sendData = { key_id: saveFlag.item.key_id };
        await this.getkeyInfo(sendData);
      }
      if (saveFlag && saveFlag.item) {
        saveFlag.flag === "official"
          ? this.keySort(saveFlag.item, saveFlag.index)
          : this.btnSelf(saveFlag.item, saveFlag.index);
      }
      localStorage.setItem("saveUserBehavior", null);
    },
    removeEvent() {
      // if ([5].includes(this.initMsg.flag)) {?
      // document.body.removeEventListener("touchmove", this.$bodyScroll, {
      //   passive: false
      // });
      // }
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
      console.log('000000')
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
    emitShowNavBar(navShow, iconShow) {
      this.needShowNavBar = navShow;
      this.needIconShow = iconShow;
    },
    async getCustomizeKeyboardLists() {
      let params = {
        event: "keyboard",
        method: "myKeyboard",
        page: this.count,
      };
      let data = await this.getCustomizeBtnLists(params);

      if (data.success && data.data.length === 8) {
        ++this.count;
        this.getCustomizeKeyboardLists();
      } else {
        this.count = 1;
        return;
      }
    },
    overscroll(el) {
      // console.log(el);
      el.addEventListener("touchstart", function () {
        var top = el.scrollTop,
          totalScroll = el.scrollHeight,
          currentScroll = top + el.offsetHeight;
        if (top === 0) {
          el.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
          el.scrollTop = top - 1;
        }
      });
      el.addEventListener("touchmove", function (evt) {
        if (el.offsetHeight < el.scrollHeight) evt._isScroller = true;
      });
    },

    showDragBall(data) {
      this.showDrag = data;
    },
    clk_cus_close_sidebar(data) {
      // addd
      // console.log("点击了");

      if (this.isSidwbar) this.isSidwbar = false;
    },
    onLoad() {
      this.finished = false;
      this.loading = false;
    },
    Showcustomize_son(data, opacity) {
      this.Showcustomize = opacity;
      this.show_customize_div = true;
      this.btnSelf(data);
    },
    updateElement(element, status) {
      let newItemList = this.itemList.map((ele) => {
        if (ele.id === element.id) {
          if (status === "edit") {
            return (ele = element);
          } else if (status === "remove") {
            return {
              ...ele,
              isDelete: true,
            };
          }
        } else {
          return ele;
        }
      });
      this.setItemList(newItemList);
    },
    cus_editFn() {
      this.setClickEditKeyboard(true);
      this.setJustSave(false);
      this.setRememberHasSaveKeyboard(
        JSON.parse(JSON.stringify(this.itemList))
      );
      this.show_customize_div = false;
      this.isSidwbar = false;
      this.setShowNavBar(true);
      this.setLevelShow(false);
      let eventInfo = {
        virturl_keyboard_event_position: "2",
      };
      this.$record("virturl_keyboard_event", eventInfo);
    },
    cus_exitFn() {
      this.keyboard_index = null;
      this.show_customize_div = false;
      this.setEditKeyboard(false);
      this.setClickEditKeyboard(false);
      this.setItemList([]);
      this.setJustSave(false);
      this.setShowNavBar(false);
      this.setSaveAfterEdit({
        saveFlag: false,
        itemList: "",
      });
      let eventInfo = {
        virturl_keyboard_event_position: "5",
      };
      this.$record("virturl_keyboard_event", eventInfo);
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
        //this.tracelog("this.mouseMode: " + this.mouseMode);
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

    // 强制横屏test
    renderResize() {
      // 判断横竖屏
      //this.tracelog("屏幕改变");

      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      this.getAdaptive();
      if (width > height) {
        this.isHorizontalScreen = true;
        // 首次进入适配
        this.isVertical = false;
        $(".dialog-start").hide();
        console.log('根节点 html font-size大小', document.getElementsByTagName('html')[0].style.fontSize)
      } else {
        this.isHorizontalScreen = false;
        //this.tracelog("竖屏");
        // if((this.initMsg.flag == 0) || (this.initMsg.flag == 2) || (this.initMsg.flag == 11)) {
        $(".dialog-start").show();
        // }
        // $(".dialog-start").hide();

        this.rotate();
        //this.tracelog(this.screen.left);
        this.data = {
          width: this.y + "px",
          height: this.x + "px",
          transform: "translate(0px, " + this.y + "px) rotate(-90deg)",
        };
        // 首次进入适配
        this.isVertical = true;
        console.log('根节点 html font-size大小', document.getElementsByTagName('html')[0].style.fontSize)
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
    // ---------------------------------------------------引导图截至此

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

    // 我的键盘
    myKeyboard() {
      this.sup_index = 5;
      this.isShowMyborad = true;
      this.showModeSelect = false;
      this.showFullScreenSelect = false;
      let eventInfo = {
        virturl_keyboard_event_position: "7",
      };
      this.$record("virturl_keyboard_event", eventInfo);
      // this.customizeBtnLists = [];
    },
    // 创建我的键盘
    createClick() {
      this.setEditKeyboard(false);
      this.setClickEditKeyboard(false);
      this.setSaveAfterEdit({
        saveFlag: false,
        itemList: "",
      });
      this.setCreateClick(true);
      this.panel = false;
      this.allKey = false;
      this.signKey = false;
      this.SpeKey = false;
      this.isSidwbar = false;
      this.Showcustomize = 0;
      this.show_customize_div = false;
      this.setShowNavBar(true);
      this.setItemList([]);
      this.keyShow = false;
      this.officialKeyboardFlag = "";
      this.setHideShowCourse(true);
      this.setCurrentTutorial(false);
      this.sub_index = undefined;
      this.keyboard_index = null;
      let eventInfo = {
        virturl_keyboard_event_position: "1",
      };
      this.$record("virturl_keyboard_event", eventInfo);
    },

    // 自定义键盘对应的按键信息
    btnSelf(item, index) {
      this.setCopyItemList(
        Object.assign(...this.copyItemList, { myselfKeyboardIndex: index })
      );
      this.keyboard_index = index;
      this.sub_index = undefined;
      this.saveCustomKeyboard.item = tools.deepClone(item);
      this.saveCustomKeyboard.index = index;
      this.setItemList([]);
      this.setEditKeyboard(true);
      this.setClickEditKeyboard(false);
      this.setCreateClick(false);
      this.setLevelShow(true);
      this.isSidwbar = false;
      this.show_customize_div = true;
      this.customize_editBtn_data = item;
      if (this.showNavBar) {
        this.setShowNavBar(false);
      }
      this.keyShow = false;
      this.officialKeyboardFlag = "";
      let keyInfo = "";
      if (
        Number(item.width) === this.screen.videosWidth &&
        Number(item.height) === this.screen.videosHeight
      ) {
        keyInfo = item.key_info;
      } else {
        keyInfo =
          Object.prototype.toString.call(item.key_info) === "[object String]"
            ? JSON.parse(item.key_info)
            : item.key_info;
        keyInfo = keyInfo.map((ele, index) => {
          return {
            ...ele,
            id: ele.id ? ele.id : index,
            keyWidth:
              (Number(ele.keyWidth) / Number(item.width)) *
              this.screen.videosWidth,
            keyHeight:
              (Number(ele.keyWidth) / Number(item.width)) *
              this.screen.videosWidth,
            keyLeft:
              (Number(ele.keyLeft) / Number(item.width)) *
              this.screen.videosWidth,
            keyTop:
              (Number(ele.keyTop) / Number(item.height)) *
              this.screen.videosHeight,
          };
        });
      }
      setTimeout(() => {
        this.setItemList(
          Object.prototype.toString.call(keyInfo) === "[object String]"
            ? JSON.parse(keyInfo)
            : keyInfo
        );
      });
      // 打开自定义键盘,关闭文字键盘
      this.panel = false;
      this.allKey = false;
      this.setHideShowCourse(true);
      this.setCurrentTutorial(false);
      this.setAddNewCustomizeBtn(false);
      let eventInfo = {
        keyboard_type: "0",
        keyboard_type_name: item.key_name,
        keyboard_type_position: "3",
      };
      this.$record("virturl_keyboard_list_selection", eventInfo);
    },

    // 将文本字符串转为对象
    textToObj1(keyInfo) {
      var a = `${keyInfo}`;
      // console.log(a);
      var b = a.split("");
      // console.log(b);
      var arr = b.filter((item, index) => index != 0 && index != b.length - 1);
      let s = arr.join("");
      // console.log(s);
      var c = s.replace(/{/g, "");
      var j = c.replace(/}/g, "");
      var d = j.replace(/]/g, "");
      // console.log(d);
      var e = d.split(",");
      var f = [],
        g = [];
      e.forEach((item) => {
        var h = item.split(":");
        f.push(h[0]);
        g.push(h[1]);
      });
      var i = [];
      // console.log(g);
      this.$nextTick(() => {
        for (let index = 0; index < g.length / 8; index++) {
          var obj = {
            keyHeight: g[0 + 8 * index],
            keyLeft: g[1 + 8 * index],
            keyName: g[2 + 8 * index].toString().replace(/"/g, ""),
            keyPressMode: g[3 + 8 * index],
            keyStyle: g[4 + 8 * index],
            keyTop: g[5 + 8 * index],
            keyWidth: g[6 + 8 * index],
            rockerType: g[7 + 8 * index],
          };
          i.push(obj);
          // console.log(i);
        }
      });
      return i;
    },

    textToObj(keyInfo) {
      var a = `${keyInfo}`;
      // console.log(a);
      var d = eval(a);
      // console.log(d);
      return d;
    },
    // 退出编辑后初始化
    initCustomizeShow(data) {
      this.cus_exit = false;
      this.Showcustomize = 1; // addd
      this.show_customize_div = !!data; // addd
      this.needShowNavBar = false;
      this.needIconShow = false;
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
    // ----------------  UI 交互相关  -------------------
    change(data) {
      this.isBtn = data;
    },

    ismodeMouse() {
      this.isSub = false;
      this.isMode = true;
      this.sup_index = 2;
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

    gesture() {
      this.show = true;
      this.active = 1;
      this.isSidwbar = false;
      this.sum_index = 3;
    },

    showSidebar() {
      this.btnFist = false;
      if (this.showNavBar) {
        return;
      }
      if (this.firstEntry === 1) {
        this.firstEntry++;
        this.setLevelShow(true);
      }
      this.isBtn = 2;
      this.traceLog("this.isSidwbar: " + this.isSidwbar);
      this.isSidwbar = !this.isSidwbar;
      this.lastTime = new Date().getTime();
      this.longTimeNoOperation = false;
      // if ([5].includes(this.initMsg.flag)) {
      // document.body.addEventListener("touchmove", this.$bodyScroll, {
      //   passive: false
      // });
      // }
    },

    showKey() {
      console.log("显示文字键盘");
      this.isBtn = 2;
      this.allKey = this.SpeKey || this.signKey ? false : true;
      this.isSidwbar = false;
      this.isSub = false;
      // 问题34
      // this.sub_index = this.keyLists.length;
      this.keyboard_index = null;
      // 重叠
      this.show_customize_div = false;
      if (this.keyShow) {
        this.keyShow = false;
      }
      this.setSaveOfficialKeyboardFlag(this.officialKeyboardFlag);
      this.officialKeyboardFlag = "";
      if (this.panel) return;
      let copyItemListIndex = this.copyItemList.myselfKeyboardIndex;
      this.setCopyItemList(
        Object.assign(
          { myselfKeyboardIndex: copyItemListIndex },
          { myselfKeyboardArr: this.itemList }
        )
      );
      this.setItemList([]);
      this.panel = true;
      if (this.editKeyboard && !this.clickEditKeyboard) return;
      if (this.needShowNavBar || this.needIconShow) {
        this.popupNav = "hide";
      }
      let eventInfo = {
        keyboard_type: "-2",
        keyboard_type_name: "文字键盘",
        keyboard_type_position: "1",
      };
      this.$record("virturl_keyboard_list_selection", eventInfo);
    },
    sup() {
      this.sup_index = 1; // 问题19
      this.isSub = true;
      this.isBtn = 2;
      this.isMode = false;
      this.isShowMyborad = false;
      this.showModeSelect = false;
      this.showFullScreenSelect = false;
      this.exitCustomEdit = false;
      let eventInfo = {
        control_panel_event_position: "1",
      };
      this.$record("control_panel_event", eventInfo);
      // if ([5].includes(this.initMsg.flag)) {
      // document.body.addEventListener("touchmove", this.$bodyScroll, {
      //   passive: false
      // });
      // }
    },
    keySort(item, index) {
      console.log("官方键盘", item, index);
      this.quitOfficialKeyboard = false;
      this.saveOfficialKeyboard.item = item;
      this.saveOfficialKeyboard.index = index;
      this.officialKeyboardFlag = item.key_id;
      // this.officialKeyboardFlag = 'FIFAKeys';
      // this.keyLists.forEach(function (item) {
      //   item.isShow = false;
      // });
      // if (this.keyLists.find((ele) => ele.key === item.key)) {
      //   this.keyLists.find((ele) => ele.key === item.key).isShow = true;
      // }
      // 重叠
      this.show_customize_div = false;
      // 问题34
      this.sub_index = index;
      this.keyboard_index = null;
      this.setCopyItemList(
        Object.assign({ myselfKeyboardIndex: null }, { myselfKeyboardArr: [] })
      );
      this.isBtn = 2;
      this.keyShow = true;
      this.isSidwbar = false;
      this.isSub = false;
      // forEach

      // 问题 22
      // if (this.panel || this.allKey) {
      this.panel = false;
      this.allKey = false;
      // }
      this.setItemList([]);
      this.setShowNavBar(false);
      this.exitCustomEdit = true;
      let eventInfo = {
        keyboard_type: "-1",
        keyboard_type_position: "1",
        keyboard_type_name: item.key,
      };
      this.$record("virturl_keyboard_list_selection", eventInfo);
    },

    exitKey() {
      this.officialKeyboardFlag = "";
      this.quitOfficialKeyboard = true;
      this.keyShow = false;
      this.isSub = false;
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      this.controlCode = 0;
      this.mouseClickFlag = 0;
      this.sub_index = undefined;
      let eventInfo = {
        virturl_keyboard_event_position: "5",
      };
      this.$record("virturl_keyboard_event", eventInfo);
    },

    // conn 连接
    isHref() {
      console.log("进去初始链接");
      if (this.$config.directTest) {
        // console.log("paramMsg");
        console.log("本地");
        let paramMsg = util.decrypt(
          "U2FsdGVkX19zOcVTf3Jg4HaMHvCZrSVXKFohba3QYzE/PvdGf+C+Tl+UtnTxGiWrmScUsG/Zq3Wn+ks53MUeOLliHKPwYkiNutO9T7ri4pgEwLrM8d6FpRMps0HWbHD42WcYGQYkYgTa14bCBoXs8EiLg1FmC5njGjb59PA1OviUjr0kRt+0lnps3yo1lyoR"
        );
        // console.log(paramMsg);
        this.initServer();
      } else {
        this.stepStatus = 1;
        // console.log("stepStatus");
        let paramData = sessionStorage.getItem("param");
        // console.log(paramData);
        console.log("paramMsg", decodeURIComponent(paramData));
        let paramMsg = util.decrypt(paramData)
        console.log("paramMsg", paramMsg);
        this.loadingProgress(10);

        let appData = sessionStorage.getItem("app");
        console.log("appData", appData);
        console.log("decodeURIComponent(appData)", decodeURIComponent(appData));
        let dataMsg = util.decrypt(appData)
        console.log("dataMsg", dataMsg);
        if (dataMsg != null) {
          if (dataMsg.g_path != null)
            dataMsg.g_path = dataMsg.g_path.replace(/\\/g, "/");
          if (dataMsg.g_picurl != null)
            dataMsg.g_picurl = dataMsg.g_picurl.replace(/\\/g, "/");
        }
        if (paramMsg == null) {
          this.connError(this.errorMsg[2] + "(501)", 4);
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
        } else {
          // this.i18nHandle(this.$i18n.locale)
          // this.initWebsocket()
          this.loadData.ip = paramMsg.ip || paramMsg.realip;
          this.loadData.innerip = paramMsg.innerip;
          this.loadData.sessionKey = paramMsg.session_key;
          this.loadData.port = paramMsg.httpcentport;
          this.loadData.msg = paramMsg.msg;
          this.loadData.cid = paramMsg.cid;
          this.loadData.appMsg = dataMsg;
          this.orderId = paramMsg.paycode;
          console.log("连接信息", paramMsg);
          this.path =
            this.$config.WSS_URL + "/ipClient?ip=" + this.loadData.innerip;
          this.loadingProgress(10);
          if (this.loadData.appMsg == null) {
            // $('.ispair').hide()
          } else if (this.loadData.appMsg.start_mode == 1) {
            this.appOnly = true;
          }
          this.initServer();
        }
      }
    },
    connTimeoutCheck() {
      let that = this;
      //30秒监测连接超时
      setTimeout(function () {
        console.log("check timeout");
        if (that.everConnected) {
          return;
        }
        if (that.stepStatus < 2 && !that.connectIsShow && !that.freeIsEnd) {
          // that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 4);
          let code = "40" + that.stepStatus;
          let eventInfo = {
            errorcode: code,
            $pagename: that.gameName,
            port: that.loadData.port,
            // idc: "",
          };
          that.$record("connecting_error", eventInfo);
          that.$dialog
            .alert({
              title: "",
              message: that.errorMsg[1] + "(40" + that.stepStatus + ")",
            })
            .then(() => {
              window.location.href = document.referrer;
            });
        } else {
          // if(that.stepStatus == 6){
          //   // console.log(that.stepStatus)
          //   that.onVideoPlaying()
          // }
          // that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 1);
          let code = "40" + that.stepStatus;
          let eventInfo = {
            errorcode: code,
            $pagename: that.gameName,
            port: that.loadData.port,
            // idc: "",
          };
          that.$record("connecting_error", eventInfo);
          if (!that.connectIsShow && !that.freeIsEnd) {
            that.$dialog
              .alert({
                title: "",
                message: that.errorMsg[1] + "(40" + that.stepStatus + ")",
              })
              .then(() => {
                window.location.href = document.referrer;
              });
          }
        }
      }, 30000);
    },
    // 将数据转为base64
    encodeBase(jsonData) {
      ////this.tracelog("encode base...");
      let str = JSON.stringify(jsonData);
      ////this.tracelog(str);
      let Base64 = require("js-base64").Base64;
      let base64 = Base64.encode(str);
      //this.tracelog(base64);
      return base64;
    },
    loadingProgress(ratePlus) {
      let that = this;
      if (this.everConnected) return;
      this.loadingRate += ratePlus;
      this.traceLog("loading progress: " + this.loadingRate);
      if (this.loadingRate >= 100) {
        this.lastTime = new Date().getTime(); // 记录默认连接时，当前时间
        // 可以开始游戏
        //进度到100  视频和通道数据准备完成  连接完成
        console.log(
          "视频和通道数据准备完成",
          this.videoReady,
          this.dataChannelReady
        );
        if (this.videoReady && this.dataChannelReady) {
          this.everConnected = true;
          this.readyStart();
          return;
        } else {
          this.traceLog("loading ok,but not ready");
          this.loadingRate = 99;
        }
      }
    },
    initServer() {
      this.stepStatus = 2;
      console.log("initServer");
      this.loadingProgress(10);
      if (this.$config.directTest) {
        this.loadingProgress(20);
        this.loadData.ip = this.$config.ip;
        this.path = this.$config.WSS_URL + "/ipClient?ip=" + this.loadData.ip;
        this.loadData.serverUrl = `${this.$config.ip}:${this.$config.port}`;
        this.loadData.sessionKey = this.directSessionKeyFull;
        // this.loadData.serverUrl = prompt("请输入server url(version 2)");
        // this.sessionkeyTail = prompt("请输入密码");
        // this.loadData.sessionKey = this.directSessionKeyHead + this.sessionkeyTail;
        // console.log("serverUrl", this.loadData.serverUrl);
        //this.tracelog(this.loadData.sessionKey);
      } else {
        if (this.loadData.ip == null || this.loadData.ip == null) {
          this.connError(this.errorMsg[3] + "(501)", 4);
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
          return;
        }
        this.loadData.serverUrl = this.loadData.ip + ":" + this.loadData.port;
      }
      //this.tracelog(this.loadData.ip, this.loadData.port);
      this.conn();
    },
    // 向server发送连接请求
    conn() {
      this.serverUsing = 0;
      // this.tracelog("connect server");
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      this.hashKey = null;
      // 连接状态
      this.connStatus = this.connStatusFlag.waitConnect;
      this.pausing = true;
      this.videoReady = false;
      this.dataChannelReady = false;
      this.controlIntervalSendStart(2000);
    },
    // 发送初始连接请求
    sendConn() {
      let app = 0,
        runLevel = 0;
      if (this.loadData.appMsg) {
        app = this.encodeBase(this.loadData.appMsg);
        runLevel = 1;
      }
      let userData = {
        version: 200,
        sessionKey: this.loadData.sessionKey,
        bitrate: 2000,
        fps: 60,
        numlock: 1,
        capslock: 1,
        deviceState: 1, // 设备状态
        channel: "safari",
        deviceType: 3,
        endpointType: "ios-safari",
        runLevel: runLevel, //桌面
        // "appcode": 'eyJnX21hcmsiOiIzIiwiZ19uYW1lIjoiUVEiLCJnX3BhdGgiOiJDOi9Qcm9ncmFtIEZpbGVzICh4ODYpL1RlbmNlbnQvUVEvQmluL1FRLmV4ZTtEOi9RUemjnui9pi9RUVNwZWVkTGF1bmNoZXIuZXhlIiwicHJvY2Vzc19uYW1lIjoiUVFTcGVlZExhdW5jaGVyLmV4ZTtRUS5leGUiLCJnX3BpY3VybCI6IkQ6L1dlYlJUQy9YVGVhbFNlcnZlci9icmFuY2hlcy9YVGVhbFNlcnZlcjAuMS9YVGVhbFNlcnZlci9YVGVhbFNlcnZlci9ia2cvTE9MLmJtcCIsInN0YXJ0X21vZGUiOjB9',
        appcode: app,
      };
      let data = this.jsonToUrl(userData);
      // console.log("传递参数", userData);
      let type = "/api/handshake.evt";
      //this.tracelog(data);
      //微信在此断开 请求出错
      this.httpSend(data, type, true);
    },
    // 向server请求获取分辨率
    getDPI() {
      let data = "hashKey=" + this.hashKey + "&optionType=" + 2;
      let type = "/api/options.evt";
      this.httpSend(data, type, false);
    },
    // 选择分辨率并通知服务端该选定分辨率
    choosingDPI(data) {
      let scrWidth = window.screen.width;
      let scrHeight = window.screen.height;
      let localRate = scrWidth / scrHeight;
      let curDiff = 1000,
        targetW = 0,
        targetH,
        findSame = false;
      let len = data.length;
      if (len == 1) {
        // 不可选择分辨率
        this.loadingProgress(10);
        return;
      }
      targetW = 1600;
      targetH = 900;
      //this.tracelog("choosing dpi" + targetW + " " + targetH);
      let sendData =
        "hashKey=" +
        this.hashKey +
        "&optionType=16" +
        "&value1=" +
        targetW +
        "&value2=" +
        targetH;
      this.httpSend(sendData, "/api/options.evt", false);
    },
    // 处理stun服务器ip列表
    handleStunServer(serverList) {
      let len = serverList.length;
      if (len < 1) {
        this.connError(this.errorMsg[3] + "(206)", 1);
        let eventInfo = {
          errorcode: "206",
          $pagename: this.gameName,
          port: this.loadData.port,
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
      }
      serverList = serverList.map(function (value, index, arr) {
        let str = "stun:" + value;
        return { urls: str };
      });
      this.pcConfig = {
        iceServers: serverList,
      };
    },
    // 通知服务端切换比特率
    byteRateChange(val) {
      //this.tracelog("change byte rate to " + val);
      let data = "hashKey=" + this.hashKey + "&optionType=3" + "&value1=" + val;
      let type = "/api/options.evt";
      this.httpSend(data, type, false);
    },
    // 通知服务端断开连接
    sendingDisconn() {
      //this.tracelog("sending exit...");
      let sendData = "hashKey=" + this.hashKey + "&optionType=7";
      this.httpWebSend(sendData, "/api/options.evt");
    },
    //断开所有连接
    disconnect() {
      // 定时连接检查函数 id
      if (this.checkEverConnId) {
        clearTimeout(this.checkEverConnId);
        this.checkEverConnId = null;
      }
      //this.tracelog("disconnect");
      this.intervalKMSendingClose();
      this.controlIntervalSendStop();
      if (this.connChannel) {
        this.connChannel.close();
        this.connChannel = null;
      }
      this.remoteStream = null;
      this.peerConn = null;
      this.connChannel = false;
    },
    /*   ===================    控制流连接相关    =====================   */

    // 控制流发送数据
    httpSend(sendData, inter, simple) {
      let curUrl = this.sigServer + this.loadData.serverUrl + inter;
      let that = this;
      $(function () {
        $.ajax({
          dataType: "jsonp",
          timeout: 8000,
          type: "get",
          contentType: "text/plain",
          data: sendData,
          url: curUrl,
        })
          .done(function (data) {
            // console.log(curUrl, sendData);
            if (inter == "/api/sdp.evt") {
              // console.log(data);
              // console.log(sendData);
              // console.log("sdp成功！！！！！！！");
            }
            if (inter == "/api/handshake.evt") {
              // console.log(data);
              if (Number(data.status) > 0) {
                console.timeEnd("handshake请求11");
              }
              // console.log(sendData);
              console.log("hashkey    成功！！！！！！！");
            }
            if (inter == "/api/options.evt") {
              // that.traceLog(curUrl);
              // console.log(sendData);
              // console.log(simple);
              // console.log("成功", data);
              // console.log(that.hashKey);
              // console.log("option    成功！！！！！！！");
            }
            if (inter == "/api/candidate.evt") {
              // that.traceLog(curUrl);
              // console.log(sendData);
              // console.log(simple);
              // console.log("成功", data);
              // console.log(that.hashKey);
              console.log("candidate    成功！！！！！！！");
            }
            that.dealRecvHttpData(data);
          })
          .fail(function (e) {
            console.log("sending fail");
            console.log(curUrl);
            // console.log(sendData);
            // console.log(that.hashKey);
            // // console.log(simple);
            if (simple) return;
            // console.log("是否执行 ! ! ! ! ! ! ! ! ! !");
            // 若只是简单心跳发送失败，不作处理
            that.waittingSendArr.push(sendData);
            that.waittingSendInter.push(inter);
          });
      });
    },
    // 控制流通过web服务器转发数据
    httpWebSend(sendData, inter) {
      let curUrl = "video/transmit/" + this.loadData.serverUrl + inter;
      $.ajax({
        dataType: "jsonp",
        type: "get",
        data: sendData,
        url: curUrl,
        async: false,
      });
    },
    // 控制流收到回返数据
    dealRecvHttpData(data) {
      this.nonRespNum = 0;
      if (!data) {
        //this.tracelog("empty response data");
        return;
      }

      if (data.status < 0) {
        //出错执行失败
        //this.tracelog(data);
        if (data.status == -100) {
          // sessionKey校验失败
          this.connError(this.errorMsg[3] + "(100)", 1);
          let eventInfo = {
            errorcode: "100",
            $pagename: this.gameName,
            port: this.loadData.port,
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
        } else if (data.status == -101) {
          // 服务正在使用中，拒绝连接
          this.serverUsing++;
          if (this.serverUsing > 5) this.connError(this.errorMsg[4], 1);
        } else if (data.status == -102) {
          // 版本不匹配
          //      this.connError(false,102,true);
        } else if (data.status == -103) {
          // 设置sdp失败
          this.connError(this.errorMsg[3] + "(103)", 1);
          let eventInfo = {
            errorcode: "103",
            $pagename: this.gameName,
            port: this.loadData.port,
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
        } else if (data.status == -104) {
          // candidata失败
          //   this.connError(false,104,true)
        } else if (data.status == -105) {
          // hashKey失败，自动尝试重连
          //微信获取 hashKey 失败
          console.log("hashkey 失败 ！！！！！！！！！！！");
          this.tryReconn(false);
        }
        return;
      } else if (data.status == 0) {
        return;
      }
      // console.log("控制流返回状态", data.status);
      //this.tracelog("receiving control data: ");
      //this.tracelog(data);
      if (data.processStatus && data.processStatus != 0) {
        let errorNo = 110 + -data.processStatus;
        let eventInfo = {
          errorcode: errorNo,
          $pagename: this.gameName,
          port: this.loadData.port,
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
        this.connError(this.errorMsg[7] + "(" + errorNo + ")", 1);
      }
      if (data.serverList) {
        console.log("控制流返回serverList成功", data.serverList);
        this.handleStunServer(data.serverList);
      }
      if (data.hashKey) {
        console.log("控制流返回hashkey成功", data.hashKey);
        this.stepStatus = 3;
        this.loadingProgress(20);
        this.serverUsing = 0;
        this.hashKey = data.hashKey;
        this.connStatus = this.connStatusFlag.connectting;
        this.controlIntervalSendModify(200);
        let that = this;
        setTimeout(() => {
          that.controlIntervalSendModify(1000);
        }, 10000);
        this.getDPI();
      }

      if (data.sdpValue) {
        console.log("控制流返回sdp成功", data.sdpValue);
        // sdp message
        this.stepStatus = 4;
        this.loadingProgress(10);
        let dataObj = data.sdpValue;
        if (dataObj.type === "offer") {
          //sdp成功 创建 rtc
          console.log(dataObj);
          this.handleServerSDP(dataObj);
        }
      }
      if (data.candidateValue) {
        // candidate message
        console.log("获取candidate");
        for (let candidate of data.candidateValue) {
          this.handleServerCandidate(candidate);
        }
      }
      if (data.msgPush) {
        // 消息推送
        this.notifyServerMsg(data.msgPush);
      }
      if (data.resoList) {
        // 分辨率列表
        console.log("选择分辨率");
        this.choosingDPI(data.resoList);
      }
    },
    // 开启控制流心跳发送
    controlIntervalSendStart(intervalTime) {
      if (this.controlIntervalId != null) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalId = null;
      }
      this.nonRespNum = 0;
      this.controlIntervalTime = intervalTime;
      console.time("handshake请求");
      this.controlIntervalId = setInterval(
        this.HeartBeatSendingIterval,
        intervalTime
      );
    },
    // 更改控制流心跳发送
    controlIntervalSendModify(intervalTime) {
      if (
        this.controlIntervalId != null &&
        this.controlIntervalTime != intervalTime
      ) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalTime = intervalTime;
        this.nonRespNum = 0;
        this.controlIntervalId = setInterval(
          this.HeartBeatSendingIterval,
          intervalTime
        );
      }
    },
    // 关闭控制流心跳数据发送
    controlIntervalSendStop() {
      if (this.controlIntervalId) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalId = null;
      }
    },
    // 控制流定时发送心跳消息
    HeartBeatSendingIterval() {
      // alert('send')
      this.nonRespNum += this.controlIntervalTime;
      // console.log("数据重连", this.nonRespNum);
      // 超时检测
      if (this.nonRespNum == 4000 || this.nonRespNum == 8000) {
        //   切换代理服务器
        //this.tracelog("change sigServer\n");
        this.sigServerIndex =
          (this.sigServerIndex + 1) % this.sigServerArr.length;
        this.sigServer = this.sigServerArr[this.sigServerIndex];
      }
      if (!navigator.onLine && !this.connectIsShow && !this.freeIsEnd) {
        //断网状态
        // this.cutPicture();
        this.controlTimeout();
        return;
      }
      if (this.nonRespNum >= 10000 && !this.freeIsEnd) {
        console.log("发送超时");
        // 发送超时
        this.controlTimeout();
        return;
      }
      // 发送握手数据
      if (this.connStatus === this.connStatusFlag.waitConnect) {
        this.sendConn();
        return;
      }
      // 发送需发送的上次发送失败数据
      // console.log("错误信息", this.waittingSendInter);
      for (let i in this.waittingSendArr) {
        this.httpSend(
          this.waittingSendArr[i],
          this.waittingSendInter[i],
          false
        );
      }
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      // 抖音小程序安卓报错
      // console.log("发送hashkey请求");
      let sendData = "hashKey=" + this.hashKey + "&optionType=5";
      this.httpSend(sendData, "/api/options.evt", true);
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
    /*   ==================      连接状态相关    =================  */
    readyStart() {
      //this.tracelog("ready start");

      this.stepStatus = 7;
      this.onVideo = true;
      this.pLock = null;
      if (this.checkEverConnId) {
        // 清空浏览器超时检查
        clearTimeout(this.checkEverConnId);
        this.checkEverConnId = null;
      }
      // 状态变更
      this.connStatus = this.connStatusFlag.connected;
      if (!this.connectIsShow) {
        this.timeoutCount = 0;
        this.timeoutTimes = 0;
      }
      // 定时器相关
      this.intervalKMSendingStart();
      this.controlIntervalSendModify(1000);
      // 开启网速计算定时器
      this.netSpeedComputeIntervalStart();
      // 连接中途断开所致重连
      // UI浮层变动
      this.UIloadingImg.hide();
      console.timeEnd("进入流桌面时间");
      // this.isGuide()
      // this.UIvideoImg.show();
      this.enterPausing();
      if (this.firstenter) {
        this.firstenter = false;
        let type = sessionStorage.getItem("entryType");
        let eventInfo = {
          $pagename: this.gameName,
          serverip: this.loadData.ip,
          enter_type: type == 1 ? "按量付费" : "体验免费",
          order_id: this.orderId,
          //暂时只有虚拟按键，暂时不传
          // idc:'',
          // devicetype:'虚拟按键',
          // devicename:'',
        };
        this.$record("connection_succeeded", eventInfo);
      }
    },
    // 使用中时进入暂停状态，“进入全屏” 弹窗出现
    enterPausing() {
      //this.tracelog("enter pausing");
      //  this.exitFullScreen();
      // 清空键位状态
      this.controlCode = 0;
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      this.mouseClickFlag = 0;

      // this.UImouseImg.hide();
      // this.UIpauseButton.show();

      this.rotate();
      this.fullScreen();
      this.pausing = false;
      // $('.content')[0].style.cursor = 'block';
    },
    // 用户选择进入全屏状态，进入全屏游戏
    enterPlaying() {
      //this.tracelog("enter playing");
      this.pausing = true;
      this.pLock = null;
      // this.UIpauseButton.hide();
      let dom = $("#remoteVideo")[0];
      if (typeof $("#remoteVideo")[0] != "undefined") {
        if ($("#remoteVideo")[0].paused) {
          $("#remoteVideo")[0].play();
        }
        if ($("#remoteVideo")[0].muted) {
          $("#remoteVideo")[0].muted = false;
        }
        this.fullScreen();
      }
    },
    /*   ==================      连接异常处理    =================  */
    /* ---- 连接出错处理 --- */

    // connecting error or connected error,告知用户并结束连接
    connError(msg, errorType) {
      if (this.onErrorDialog || this.freeIsEnd) {
        return;
      }
      this.onErrorDialog = true;

      if (this.errorType == 1) {
        this.sendingDisconn();
      }
      this.disconnect();
      // 出现弹窗
      this.dialogStatus = errorType;
      // alert(msg);
      Dialog.alert({
        message: msg,
      }).then(() => {
        // on confirm
        window.history.go(-1);
      });
      // .catch(() => {
      //   // on cancel
      //   Dialog.close;
      // });
      /*
            switch (errorType)
            {
                case 1:
                    this.notifyErrorTwo(msg,this.errorButtonMsg[1],this.errorButtonMsg[2]);
                    break;
                case 2:
                    this.notifyErrorTwo(msg,this.errorButtonMsg[4],this.errorButtonMsg[2]);
                    break;
                case 3:
                    this.notifyErrorOne(msg,this.errorButtonMsg[3]);
                    break;
                case 4:
                    this.notifyErrorOne(msg,this.errorButtonMsg[2]);
                    break;
            }*/
    },
    // 连接出错,hashkey失效，重新连接server
    tryReconn(ifSend) {
      //this.tracelog("reconn");
      if (ifSend) {
        this.sendingDisconn();
      }
      this.disconnect();
      if (!this.connectIsShow) {
        this.timeoutCount = 0;
        this.timeoutTimes = 0;
      }
      this.conn();
    },
    // 控制流发送超时
    controlTimeout() {
      // this.tracelog("controlTimeout");
      // console.log("重连机制", this.timeoutTimes, this.timeoutCount);
      this.disconnect();
      clearInterval(this.connectTime);
      if (this.timeoutTimes >= 121) return;
      this.connectTime = setInterval(() => {
        this.timeoutTimes++;
        if (this.timeoutTimes > 120) {
          //发送重连失败数据
          if (this.timeoutTimes == 121) {
            var eventInfo = {
              connect_repair_result: "0",
            };
            this.$record("connect_repair", eventInfo);
          }
          clearInterval(this.connectTime);
          this.connectIsShow = false;
          // this.timeoutTimes = 0;
          this.$dialog
            .alert({
              title: "",
              message: this.errorMsg[6],
            })
            .then(() => {
              window.history.go(-1);
              window.location.href = document.referrer;
            });
          return;
        }
      }, 1000);
      this.timeoutCount++;
      if (this.timeoutTimes <= 120) {
        this.connectIsShow = true;
      }
      this.conn();
    },
    // 用户选择退出
    userQuit() {
      //this.tracelog("user quit");
      this.exitFullScreen();
      if (
        this.connStatus === this.connStatusFlag.connected ||
        this.connStatus === this.connStatusFlag.connectting
      ) {
        this.sendingDisconn();
      }
      this.disconnect();
    },
    notifyErrorOne(msg, btnMsg) {
      this.prompt.connectVisible = true;
      this.prompt.message = msg;
      this.prompt.btn = btnMsg;
    },

    notifyErrorTwo(msg, cancelMsg, returnMsg) {
      this.connect.connectVisible = true;
      this.connect.message = msg;
      this.connect.cancelBtn = cancelMsg;
      this.connect.returnBtn = returnMsg;
    },

    /* ===================== 键盘操作 ========================*/

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
      if (!this.isVertical) {
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
      which.key = which.keyRealName || which.keyName || which.key;
      this.isBoo = index;
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
        this.sub_index = null;
        this.panel = false;
        this.allKey = false;
        this.signKey = false;
        this.SpeKey = false;
        this.keyShow =
          this.showNavBar || this.editKeyboard || this.quitOfficialKeyboard
            ? false
            : true;
        // if (this.keyShow) {
        //   this.sub_index = this.keyLists.findIndex((ele) => ele.isShow);
        // }
        this.officialKeyboardFlag = this.saveOfficialKeyboardFlag;
        if (this.editKeyboard) {
          this.show_customize_div = true;
        }
        this.setItemList(this.copyItemList.myselfKeyboardArr);
        this.keyboard_index = this.copyItemList.myselfKeyboardIndex;
        if (this.editKeyboard && this.clickEditKeyboard) {
          this.show_customize_div = false;
        }
        if (this.editKeyboard && !this.clickEditKeyboard) return;
        if (this.needShowNavBar) {
          this.popupNav = "all";
        }
        if (this.needIconShow) {
          this.popupNav = "iconShow";
        }
        if (!this.needShowNavBar && !this.needShowNavBar) {
          this.popupNav = "hide";
        }
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

    press(e) {
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
      let that = this;
      if (
        Object.prototype.toString.call(e.target) === "[object HTMLVideoElement]"
      ) {
        if (!this.isSidwbar && this.panel) {
          this.sub_index = null;
          this.panel = false;
          this.allKey = false;
          this.signKey = false;
          this.SpeKey = false;
          this.sub_index = undefined;
          this.keyShow =
            this.showNavBar || this.editKeyboard || this.quitOfficialKeyboard
              ? false
              : true;
          // if (this.keyShow) {
          //   this.sub_index = this.keyLists.findIndex((ele) => ele.isShow);
          // }
          this.officialKeyboardFlag = this.saveOfficialKeyboardFlag;
          if (this.editKeyboard) {
            this.show_customize_div = true;
          }
          this.setItemList(this.copyItemList.myselfKeyboardArr);
          this.keyboard_index = this.copyItemList.myselfKeyboardIndex;
          if (this.editKeyboard && this.clickEditKeyboard) {
            this.show_customize_div = false;
          }
          if (this.editKeyboard && !this.clickEditKeyboard) return;
          if (this.needShowNavBar) {
            this.popupNav = "all";
          }
          if (this.needIconShow) {
            this.popupNav = "iconShow";
          }
          if (!this.needShowNavBar && !this.needShowNavBar) {
            this.popupNav = "hide";
          }
          return;
        }
        if (this.isSidwbar) {
          this.isSidwbar = false;
        }
      }
      $("#remoteVideo")[0].muted = false;
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
    pressMove(e) {
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
        if (this.tapFlag) {
          this.tapFlag = false;
          this.mouseData.mouseClickFlag = 0;
        }
        if (e.tapTheScreen) {
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
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
              clickMouseX * this.mouseSpeed -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementX;
            this.mouseData.mouseMovementY =
              clickMouseY * this.mouseSpeed -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementY;
          } else {
            this.mouseLeft -= e.deltaY * this.mouseSpeed;
            this.mouseTop += e.deltaX * this.mouseSpeed;
            //竖屏数据传递
            //水平方向
            this.mouseData.mouseMovementX = -(
              clickMouseY * this.mouseSpeed -
              this.mouseData.lastPositionY +
              this.mouseData.mouseMovementX
            );
            //垂直方向
            this.mouseData.mouseMovementY =
              clickMouseX * this.mouseSpeed -
              this.mouseData.lastPositionX +
              this.mouseData.mouseMovementY;
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
          this.showKey();
        }
        let that = this;
        if (this.mouseData.mouseClickFlag == 0x01) {
          setTimeout(function () {
            // that.traceLog("触摸结束，鼠标左键抬起");
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
      // console.log('是否全屏',this.fullScreenShow)

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
          } else {
            if ((this.screen.totalWidth * 9) / 16 <= this.screen.totalHeight) {
              this.screen.videosWidth = this.screen.totalWidth;
              this.screen.videosHeight =
                (this.screen.totalWidth * 9) / 16 + 200;
            } else {
              this.adaptScreen(this.screen.totalWidth, this.screen.totalHeight);
            }
            this.screen.top =
              (this.screen.totalHeight - this.screen.videosHeight) / 2;
            this.screen.left =
              (this.screen.totalWidth - this.screen.videosWidth) / 2;
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
        }
      }
      localStorage.setItem("screen", JSON.stringify(this.screen));
      //this.tracelog("window.orientation: " + window.orientation);
      if (this.firstMoveMouse) {
        this.mouseLeft = this.screen.videosWidth / 2;
        this.mouseTop = this.screen.videosHeight / 2;
        this.firstMoveMouse = false;
      }
      if (window.orientation === 180 || window.orientation === 0) {
        this.isVertical = true;
        //this.tracelog("竖屏");
        // $(".dialog-start").hide();
        // if((this.initMsg.flag == 0) || (this.initMsg.flag == 2) || (this.initMsg.flag == 11)){
        $(".dialog-start").show();
        // }
        this.data = {
          width: this.y + "px",
          height: this.x + "px",
          transform:
            "translate(0px, " +
            (this.y - this.screen.left / 2) +
            "px) rotate(-90deg)",
        };
      }
      if (window.orientation === 90 || window.orientation === -90) {
        this.isVertical = false;
        $(".dialog-start").hide();
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
      if (
        event.target &&
        Object.prototype.toString.call(event.target) ===
          "[object HTMLVideoElement]"
      ) {
        this.tapFlag = true;
        if (!this.mouseMode) {
          // this.traceLog("鼠标模式下的左键按下");
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
      }
    },

    /* ==================== 键鼠数据发送  ==========================================*/
    // 码率，流量相关
    netSpeedComputeIntervalStart() {
      if (this.spcompIntervalId != null) {
        clearInterval(this.spcompIntervalId);
        this.spcompIntervalId = null;
      }
      let first = true;
      let src = 0;
      let last = true;
      let pc = this.peerConn;
      let that = this;
      var fractionLost = 0;
      var lastPacketsReceived, lastPacketsLost;
      this.spcompIntervalId = setInterval(function () {
        // 定时获取网络延迟和比特率
        pc.getStats(null).then((stats) => {
          stats.forEach((report, index) => {
            if (report.type == "inbound-rtp") {
              if (report.id.match("Video") != "null") {
                if (last) {
                  lastPacketsReceived = report.packetsReceived;
                  lastPacketsLost = report.packetsLost;
                  last = false;
                } else {
                  if (
                    report.packetsReceived != 0 &&
                    report.packetsReceived >= lastPacketsReceived
                  ) {
                    console.log('丢包数据',report.packetsLost,lastPacketsLost,report.packetsReceived,lastPacketsReceived, fractionLost)
                    console.log(report.packetsLost-lastPacketsLost,report.packetsLost + report.packetsReceived - lastPacketsLost - lastPacketsReceived)
                    let packet=report.packetsLost-lastPacketsLost;
                    if (packet != 0) {
                      console.log('00009999')
                      fractionLost =
                        (report.packetsLost - lastPacketsLost) /
                        (report.packetsLost +
                          report.packetsReceived -
                          lastPacketsLost -
                          lastPacketsReceived);
                      lastPacketsLost = report.packetsLost;
                    } else {
                      console.log('000')
                      fractionLost = 0.0;
                    }
                    lastPacketsReceived = report.packetsReceived;
                  }
                  console.log(fractionLost)
                  that.packetRate = (fractionLost * 100).toFixed(2);
                  console.log('概率',that.packetRate)
                }
              }
            }
            if (report.type == "transport") {
              if (first) {
                src = report.bytesReceived;
                first = false;
              } else {
                // console.log(report.bytesReceived);
                that.byteRateSpeed = (
                  (report.bytesReceived - src) /
                  1024
                ).toFixed(0);
                src = report.bytesReceived;
              }
            } else if (report.type == "candidate-pair" && report.nominated) {
              // console.log(report.currentRoundTripTime);
              that.roundTripTime =
                parseInt(report.currentRoundTripTime * 1000) || 0;
            }
          });
        });
      }, 1000);
    },

    netSpeedComputeIntervalStop() {
      if (this.spcompIntervalId != null) {
        clearInterval(this.spcompIntervalId);
        this.spcompIntervalId = null;
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
      this.KeyMouseIntervalId = setInterval(this.intervalKMExecute, 10);

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
      // 绝对坐标
      sendingMessage[4] = this.mouseData.mousePositionX & 0xff;
      sendingMessage[5] = (this.mouseData.mousePositionX >> 8) & 0xff;
      sendingMessage[6] = this.mouseData.mouseMovementY & 0xff;
      sendingMessage[7] = (this.mouseData.mousePositionY >> 8) & 0xff;
      // 相对位移
      sendingMessage[8] = this.mouseData.mouseMovementX & 0xff;
      sendingMessage[9] = (this.mouseData.mouseMovementX >> 8) & 0xff;
      sendingMessage[10] = this.mouseData.mouseMovementY & 0xff;
      sendingMessage[11] = (this.mouseData.mouseMovementY >> 8) & 0xff;
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

    // 连接
    // conn() {
    //     let befUrl = "https://vcssignal2.dalongyun.com/";
    //     // let url = prompt("请输入server url");
    // //  let befUrl = "http://"
    //     let url = "114.115.131.94:58008"
    //     this.serverUrl = befUrl + url;
    //     this.sessionKey = "11566D692A774BCA08F81490F59C3018";
    //     let data = "version=100&sessionKey=11566D692A774BCA08F81490F59C3018&bitrate=10000&fps=60&numlock=1&capslock=1&deviceState=1&channel=testChannel&deviceType=null&endpointType=null&runLevel=1&appcode=0";
    //     let type = "/api/handshake.evt";
    //     this.httpSend(data,type);
    // },

    //打印日志
    traceLog(data) {
      if (this.isLog) {
        let myDate = new Date();
        console.log(myDate.toLocaleString() + ":  ");
        console.log(data);
      }
    },

    /*  webrtc相关  */
    handleIceConnChange(event) {
      console.log("connection change");
      let pc = this.peerConn;
      console.log('连接状态',pc)
      if (pc == null) {
        return;
      }
      //this.tracelog(event);
      //this.tracelog(pc);
      //this.tracelog(pc.iceConnectionState);
      if (
        pc.iceConnectionState === "disconnected" &&
        this.connStatus === this.connStatusFlag.connected
      ) {
        //this.tracelog(pc.iceConnectionState);
        this.tryReconn(true);
      }
    },
    // 设置本地SDP并发送
    setLocalAndSendMessage(sessionDescription) {
      //this.tracelog("set local description");
      //this.tracelog(this.hashKey);
      //this.tracelog(sessionDescription);
      //this.tracelog(sessionDescription.sdp);
      this.peerConn.setLocalDescription(sessionDescription);
      let sendData =
        "hashKey=" +
        this.hashKey +
        "&sdp=" +
        JSON.stringify(sessionDescription) +
        "&type=answer";
      this.httpSend(sendData, "/api/sdp.evt");
    },

    // 设置本地SDP失败
    onCreateSessionDescriptionError(error) {
      //this.tracelog(
      //   "Falied to create session description: " + error.toString()
      // );
    },
    handleServerSDP(offer) {
      //this.tracelog("handel server sdp");
      //this.tracelog("pcConfig:");
      //this.tracelog(this.pcConfig);
      let rtc =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      this.peerConn = new rtc(this.pcConfig);
      this.peerConn.ondatachannel = this.receiveChannelCallBack;
      // 安卓 华为畅享 9s  不能执行
      this.peerConn.onicecandidate = this.handleIceCandidate;
      this.peerConn.onaddstream = this.handleRemoteStreamAdded;
      this.peerConn.ontrack = this.handletrackAdded;
      this.peerConn.onremovestream = this.handleRemoteStreamRemoved;
      this.peerConn.oniceconnectionstatechange = this.handleIceConnChange;

      let rtcSession =
        window.RTCSessionDescription ||
        window.mozRTCSessionDescription ||
        window.webkitRTCSessionDescription;
      this.peerConn.setRemoteDescription(new rtcSession(offer));
      this.peerConn
        .createAnswer()
        .then(
          this.setLocalAndSendMessage,
          this.onCreateSessionDescriptionError
        );
    },
    // 远端流加入
    handletrackAdded(event) {
      //this.tracelog("Handle remote stream tracked added");
      //this.tracelog(event);
      // console.log("执行 handletrackAdded");
      // video 添加 onplay 事件 执行onVideoPlaying 完成后正式进入
      if (this.connectIsShow) {
        this.imgShow = true;
        sessionStorage.setItem("isVisablty", JSON.stringify(true));
        this.cutPicture();
        setTimeout(() => {
          $("#remoteVideo")[0].srcObject = event.streams[0];
          $("#remoteVideo")[0].onplay = this.onVideoPlaying;
        }, 1000);
      } else {
        $("#remoteVideo")[0].srcObject = event.streams[0];
        $("#remoteVideo")[0].onplay = this.onVideoPlaying;
      }
    },

    handleRemoteStreamAdded(event) {
      console.log("Remote  handleRemoteStreamAdded");
      //this.tracelog(event);
      this.remoteStream = event.stream;
      $("#remoteVideo")[0].addEventListener(
        "loadedmetadata",
        this.onVideoPlaying
      );
      $("#remoteVideo")[0].srcObject = this.remoteStream;
      $("#remoteVideo")[0].onplay = this.onVideoPlaying;
    },

    // 远端流移除
    handleRemoteStreamRemoved(event) {
      //this.tracelog("remote stream removed event");
      this.remoteStream = null;
      this.connFail(true, "remote stream removed");
    },

    /* ============ candidate 相关 ============ */
    // 本地候选人事件
    handleIceCandidate(event) {
      //this.tracelog("ice candidate event");
      //this.tracelog(event.candidate);
      if (event.candidate) {
        let candidateSelf = {
          type: "candidate",
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        };
        let dataSend =
          "hashKey=" +
          this.hashKey +
          "&candidate=" +
          candidateSelf.candidate +
          "&sdpMLineIndex=" +
          candidateSelf.sdpMLineIndex +
          "&sdpMid=" +
          candidateSelf.sdpMid;
        // console.log("candidate", candidateSelf);
        console.log("candidate dataSend", dataSend);
        this.httpSend(dataSend, "/api/candidate.evt");
      } else {
        //this.tracelog("End of candidates");
      }
    },

    // 处理远端候选人事件
    handleServerCandidate(candidateInfo) {
      let candidate = new RTCIceCandidate({
        sdpMLineIndex: candidateInfo.sdpMLineIndex,
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
      });
      this.peerConn
        .addIceCandidate(candidate)
        .then(this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    },
    onAddIceCandidateSuccess() {
      //this.tracelog("ok,add Ice candidate ok!");
    },
    onAddIceCandidateError(error) {
      //this.tracelog("error,local add Ice candidate fail");
      this.connError(this.errorMsg[3] + "(202)", 1);
      let eventInfo = {
        errorcode: "202",
        $pagename: this.gameName,
        port: this.loadData.port,
        // idc: "",
      };
      this.$record("connecting_error", eventInfo);
    },

    /* ========== data channel 相关 ==========  */
    // 收到通道事件
    receiveChannelCallBack(event) {
      console.log("打开数据通道");
      //this.tracelog("success open datachannel");
      this.connChannel = event.channel;
      this.connChannel.onopen = this.handleSendChannelOpen;
      this.connChannel.onmessage = this.handleConnChannelMessage;
      this.connChannel.onclose = this.handleConnChangeClose;
      this.connChannel.onerror = this.handleConnChannelError;
    },
    // 通道转为打开状态
    handleSendChannelOpen() {
      console.log("data channel open");
      this.stepStatus += 2;
      this.dataChannelReady = true;
      if (this.everConnected && this.videoReady) this.readyStart();
      else this.loadingProgress(19);
      // console.log("执行", this.dataChannelReady, this.initMsg.flag, this.isIos);
      // this.onVideoPlaying()
      if (this.initMsg.flag == 5 && this.isIos && !this.connectIsShow) {
        this.$dialog
          .alert({
            title: "",
            message: "开启游戏 ",
          })
          .then(() => {});
      }
    },

    // 通道发送数据
    sendOperation(data) {
      this.connChannel.send(data);
    },
    
    // 通道收到数据
    handleConnChannelMessage(event) {
      // console.log('通道数据',event)
      let byteArray = new Uint8Array(event.data);
      this.handleChannelData(byteArray);
    },
    // 处理通道所收到的数据
    handleChannelData(data) {
      // //this.tracelog('通道收到的数据')
      if (this.pausing) return;
      // 绘制鼠标相关
      //   if(!this.mouseMode) {
      if (data[0] == "0x01") {
        // this.UImouseImg.show();
        // this.showKey();
        if (this.mouseMode === false) {
          $("#mouseImg").show();
          let strPng = this.arrayBufferToBase64(
            data.slice(13, data.length - 1)
          );
          this.$refs.mouse.src = "data:image/png;base64," + strPng;
        }
        let spot = data.slice(1, 5);
        this.mouseData.xhotspot = ((spot[1] & 0xff) << 8) | (spot[0] & 0xff);
        this.mouseData.yhotspot = ((spot[3] & 0xff) << 8) | (spot[2] & 0xff);
      } else if (data[0] == "0x03" || data[0] == "0x04") {
        $("#mouseImg").hide();
        // this.showKey();
      } else if (data[0] == "0x07") {
        this.showKey();
      }
      //   }
    },

    //  将字节数组转为base64格式
    arrayBufferToBase64(buffer) {
      let binary = "";
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    // 数据通道错误
    handleConnChannelError(error) {
      //this.tracelog("data channel error");
      this.connError(this.errorMsg[3] + "(205)", 1);
      let eventInfo = {
        errorcode: "205",
        $pagename: this.gameName,
        port: this.loadData.port,
        // idc: "",
      };
      this.$record("connecting_error", eventInfo);
    },
    // 数据通道关闭
    handleConnChangeClose() {
      //this.tracelog("data channel close");
    },
    logVideoLoaded() {
      //this.tracelog("video loadded");
    },
    // 当视频流开始播放时，设立相关状态位
    onVideoPlaying() {
      console.log("video ready");
      this.getAction();
      this.stepStatus++;
      let visable = JSON.parse(sessionStorage.getItem("isVisablty"));
      if (this.connectIsShow && visable) {
        this.$toast("重连成功");
        //发送重连成功数据
        var eventInfo = {
          connect_repair_result: "1",
        };
        this.connectIsShow = false;
        this.imgShow = false;
        clearInterval(this.connectTime);
        this.$record("connect_repair", eventInfo);
      }
      this.videoReady = true;
      if (this.everConnected && this.dataChannelReady) this.readyStart();
      else this.loadingProgress(19);
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
          keyboard_index;
        })
        .join("&");
      return params;
    },
    // 暂时离开
    away() {
      this.firstEntry = 1;
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
            Dialog.confirm({
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
                      Dialog.alert({
                        message: "注销成功",
                      }).then(() => {
                        // on close
                        Dialog.close;
                      });
                    }
                  });
              })
              .catch(() => {
                // on cancel
              });
            //   window.history.go(-1);
          } else {
            Dialog.alert({
              message: "注销失败",
            }).then(() => {
              // on close
              Dialog.close;
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
      this.httpSend(sendData, "/api/options.evt", false);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.toast {
  transform: rotate(-90deg);
  position: absolute;
  left: 36%;
  top: 45%;
}
.imgSrc {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.arrow_box {
  animation: glow 800ms ease-out infinite alternate;
}
@keyframes glow {
  0% {
    border-left: none;
    border-color: #393;
    /* box-shadow: 5px 5px 10px -4px #F2C329,
      5px -5px 10px -4px #F2C329; */
    /* box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 1px 0 #393; */
  }
  100% {
    border-left: none;
    border-color: #6f6;
    box-shadow: 5px 5px 10px -4px #f2c329, 5px -5px 10px -4px #f2c329;
    /* box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 1px 0 #6f6; */
  }
}

.arrow_rbox {
  animation: grlowr 800ms ease-out infinite alternate;
}
@keyframes grlowr {
  0% {
    border-left: none;
    border-color: #393;
    /* box-shadow: -5px -5px 10px -4px #F2C329,
      -5px 5px 10px -4px #F2C329; */
    /* box-shadow:5px 5px 10px -4px rgba(0,255,0,.2),5px -5px 10px -4px  rgba(0,255,0,.1); */
    /* box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 1px 0 #393; */
  }
  100% {
    border-left: none;
    border-color: #6f6;
    /* box-shadow: -2px -3px 10px -4px #F2C329,
      -1px 5px 10px -4px #F2C329; */
    box-shadow: -5px -5px 10px -4px #f2c329, -5px 5px 10px -4px #f2c329;
    /* box-shadow: 5px 5px 10px -4px rgba(0,255,0,.6), 5px -5px 10px -4px rgba(0,255,0,.4); 
         box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 1px 0 #6f6; */
  }
}
</style>

<style scoped lang="less" src="../assets/css/index.less"></style>
