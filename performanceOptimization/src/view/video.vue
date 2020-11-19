<template>
  <div
    id="player"
    :class="[5,'5'].includes(initMsg.flag) && !isHorizontalScreen  ? 'playTop' : 'pageTop'"
    :style="data"
  >
    <cloudComputerCustom
      ref="silderItem"
      :isSidwbar="isSidwbar"
      :showFullScreenSwitch="showFullScreenSwitch"
      :firstLoad="firstLoad"
      :roundTripTime="roundTripTime"
      :byteRateSpeed="byteRateSpeed"
      :packetRate="packetRate"
      :colorA="colorA"
      :colorB="colorB"
      :universal="universal"
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
      @clk_cus_close_sidebar="clk_cus_close_sidebar"
      @sendDataBuriedPoint="sendDataBuriedPoint"
      style="position: absolute;"
    >
    </cloudComputerCustom>
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
      <img
        src="../assets/img/mouse.png"
        ref="mouse"
        id="mouseImg"
        :style="{ left: mouseLeft + 'px', top: mouseTop + 'px' }"
        v-if="mouseMode === false"
      />

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
          <div class="detailMsg" :class="firstLoad && btnFist ? 'arrow_box' : ''">
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

      <div class="dialog-start" v-if="[1, 3, 4, 5, '5'].includes(initMsg.flag) ? false : (isHorizontalScreen ? false : true)">
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
    </div>
    <div id="loadImg" :style="dataImg" v-if="UIloadingImg">
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
</template>

<script>
import business from '../mixins/business'
import video from '../mixins/video'
export default {
  name: 'videoScreen',
  mixins: [business, video]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.toast {
  transform: rotate(-90deg);
  position: absolute;
  left: 36%;
  top: 45%;
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
    /* box-shadow: 5px 5px 10px -4px #F2C329,
      5px -5px 10px -4px #F2C329; */
    /* box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 1px 0 #393; */
  }
  100% {
    border-left: none;
    border-color: #6f6;
    box-shadow: 8.3px 8.3px 16.7px -6.7px #f2c329, 8.3px -8.3px 16.7px -6.7px #f2c329;
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
    box-shadow: -8.3px -8.3px 16.7px -6.7px #f2c329, -8.3px 8.3px 16.7px -6.7px #f2c329;
    /* box-shadow: 5px 5px 10px -4px rgba(0,255,0,.6), 5px -5px 10px -4px rgba(0,255,0,.4); 
         box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 1px 0 #6f6; */
  }
}
</style>

<style scoped lang="less" src="../assets/css/index.less"></style>
