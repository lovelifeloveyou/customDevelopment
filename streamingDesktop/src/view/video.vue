<template>
  <div
    id="player"
    :class="
      [5, '5'].includes(initMsg.flag) && !isHorizontalScreen ? 'playTop' : 'pageTop'
    "
    :style="data"
  >
    <!-- cloudComputerCustom 云电脑组件 -->
    <cloudComputerCustom
      ref="silderItem"
      :isSidwbar="isSidwbar"
      :firstLoad="firstLoad"
      :roundTripTime="roundTripTime"
      :byteRateSpeed="byteRateSpeed"
      :packetRate="packetRate"
      :colorA="colorA"
      :colorB="colorB"
      :universal="universal"
      :pageShift='exportShift'
      :loadingSuccessed='loadingShow'
      @changeSideBarShow="changeSideBarShow"
      @away="away"
      @reset="reset"
      @goRechargeUrl="goRechargeUrl"
      @changemousespeed="changemousespeed"
      @showSidebar="showSidebar"
      @showFullScreen="showFullScreen"
      @whickKeyTextKeyboard="whichKey"
      @KeyEndTextKeyboard="KeyEnd"
      @keySignDownTextKeyboard="keySignDown"
      @keySpecailUp="keySpecailUp"
      @transferData="transferData"
      @returnData="returnData"
      @fireStart="fireStart"
      @fireAngle="fireAngle"
      @fireUp="fireUp"
      @clk_cus_close_sidebar="clk_cus_close_sidebar"
      @sendDataBuriedPoint="sendDataBuriedPoint"
      @byteRateChange='byteRateChange'
      @callUpConflict="callUpConflict"
      @changeIndex='changeIndex'
      style="position: absolute"
    > 
    </cloudComputerCustom>

    <!-- video -->
    <div
      id="videos"
      v-gesture:tap="tap"
      v-gesture:longTap="press"
      v-gesture:start="gestureTouchStart"
      v-gesture:pressMove="pressMove"
      v-gesture:twoFingerPressMove="pressMove"
      v-gesture:end="gestureTouchEnd"
      ref="videos"
      :style="videoStyle"
    >
      <video
        id="remoteVideo"
        ref="remoteVideo"
        :muted="muteStatus"
        autoplay
        playsinline
        webkit-playsinline
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="landscape"
        x-webkit-airplay="allow"
        x5-playsinline
        :style="{
          width: screen.videosWidth + 'px',
          height:
            showFullScreenSwitch && fullScreenShow
              ? screen.changeRatioHeight + 'px'
              : screen.videosHeight + 'px',
          objectFit: 'fill',
          position: 'relative',
          transform:
            showFullScreenSwitch && fullScreenShow
              ? 'scaleY(' +
                screen.totalHeight / screen.changeRatioHeight +
                ')'
              : 'none',
          top:
            showFullScreenSwitch && fullScreenShow
              ? -(screen.changeRatioHeight - screen.totalHeight) / 2 + 'px'
              : '',
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
      <img
        src="../assets/img/mouse.png"
        ref="mouse"
        id="mouseImg"
        :style="{ left: mouseLeft + 'px', top: mouseTop + 'px' }"
        v-if="mouseMode === false"
      />
    </div>

    <!-- 悬浮球 -->
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
          tada: true,
          btnIndex:btnIconIndex,
          silderIndex:!btnIconIndex
        }"
        @click="showSidebar"
        @touchstart="panstart"
        @touchmove="panmove"
        @touchend="panend"
      >
        <i></i>
        <div
          class="detailMsg"
          :class="firstLoad && btnFist ? 'arrow_box' : ''"
        >
          <p v-if="byteRateSpeed === byteRateSpeed">
            {{ byteRateSpeed }}
            <span>KB/s</span>
          </p>
          <p v-else>
            0
            <span>KB/s</span>
          </p>
          <p
            v-if="roundTripTime === roundTripTime"
            :style="roundTripTimeStyle"
          >
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

    <!-- load图片 -->
    <div id="loadImg" :style="dataImg" v-show="loadImgShow">
      <img
        src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobile/load.jpg"
        ref="load"
        :style="loadImgStyle"
      />
    </div>

    <!-- 横竖屏提示 -->
    <!-- <div
      class="dialog-start"
      v-if="needTipRotate === 0 
        ? true : 
        (needTipRotate === 1 
          ? false : 
          (markNewFlag ? false : 
            ([1, 3, 4, 5, '5'].includes(initMsg.flag) ? false : (isHorizontalScreen ? false : true))))"
    > -->
    <div
      class="dialog-start"
      v-if="([1, 3, 4, 5, '5'].includes(initMsg.flag) ? false : (isHorizontalScreen ? false : true))"
    >
      <div class="pannel">
        <p>请把手机“横向”摆放，若本提示还在，</p>
        <p>请关闭手机设置中【竖屏锁定】功能即可</p>
      </div>
    </div>

    <!-- 体验结束，开通会员提示 -->
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

    <!-- 重连机制弹框 -->
    <connect-item
      :isHorizontalScreen="isHorizontalScreen"
      :timeoutTimes="timeoutTimes"
      :timeoutCount="timeoutCount"
      :connectIsShow="connectIsShow"
      @away="away"
    ></connect-item>
  </div>
</template>

<script>
import adaptScreenRotate from '@/mixins/adaptScreenRotate'
import business from '@/mixins/business'
import connect from '@/mixins/connect'
import gamepad from '@/mixins/gamepad'
import sendMouseAndKeyboard from '@/mixins/sendMouseandKeyboard'
import webrtc from '@/mixins/webrtc'

export default {
  name: 'videoScreen',
  mixins: [
    gamepad,
    adaptScreenRotate,
    sendMouseAndKeyboard,
    webrtc,
    connect,
    business,
  ]
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
.dialog{
  transform: rotate(-90deg) !important;
  left: 10%;
  top: 40%;
}
.highLatencyPortraitStyle {
  transform: rotate(-90deg);
  position: absolute;
  left: 55%;
  top: 45%;
}
.imgSrc {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  border: none;
}

.arrow_box {
  animation: glow 800ms ease-out infinite alternate;
}
@keyframes glow {
  0% {
    border-left: none;
    border-color: #393;
  }
  100% {
    border-left: none;
    border-color: #6f6;
    box-shadow: 8.3px 8.3px 16.7px -6.7px #f2c329,
      8.3px -8.3px 16.7px -6.7px #f2c329;
  }
}

.arrow_rbox {
  animation: grlowr 800ms ease-out infinite alternate;
}
@keyframes grlowr {
  0% {
    border-left: none;
    border-color: #393;
  }
  100% {
    border-left: none;
    border-color: #6f6;
    box-shadow: -8.3px -8.3px 16.7px -6.7px #f2c329,
      -8.3px 8.3px 16.7px -6.7px #f2c329;
  }
}
</style>

<style scoped lang="less" src="../assets/css/index.less"></style>
