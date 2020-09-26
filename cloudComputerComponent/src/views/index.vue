<template>
  <div>
    <!-- 菜单栏组件 -->
    <slidebar-item
      :isSidwbar="isSidwbar"
      :screen="screen"
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
    >
    </slidebar-item>

    <!-- 网络监测组件 -->
    <network-item
      :isNetshow="isNetshow"
      :roundTripTime="roundTripTime"
      :byteRateSpeed="byteRateSpeed"
      :packetRate="packetRate"
      @closeNetWork="closeNetWork"
    >
    </network-item>

    <!-- 文字键盘组件 -->
    <textKeyboard
      :panel="panel"
      :allKey="allKey"
      :signKey="signKey"
      :SpeKey="SpeKey"
      :iscaps="iscaps"
      :colorA="colorA"
      :colorB="colorB"
      :activeClass="activeClass"
      @whickKeyTextKeyboard="whickKeyTextKeyboard"
      @KeyEndTextKeyboard="KeyEndTextKeyboard"
      @keySignDownTextKeyboard="keySignDownTextKeyboard"
      @keySpecailUp="keySpecailUp"
    >
    </textKeyboard>

    <!-- 自定义键盘组件 -->
    <customize-item
      :screen="screen"
      :universal="universal"
      :Showcustomize="Showcustomize"
      :customize_editBtn_data="customize_editBtn_data"
      :isHorizontalScreen="isHorizontalScreen"
      :popupNav="popupNav"
      :exitCustomEdit="exitCustomEdit"
      @initCustomizeShow="initCustomizeShow"
      @Showcustomize_son="Showcustomize_son"
      @clk_cus_close_sidebar="clk_cus_close_sidebar"
      @showDragBall="showDragBall"
      @showNavBar="emitShowNavBar"
    >
    </customize-item>
    <dragBox-item
      v-for="(item, index) in itemList"
      :key="index"
      :keymsg="item"
      :title="index"
      :screen="screen"
      :isHorizontalScreen="isHorizontalScreen"
      :dragBoxShowSidebar="dragBoxShowSidebar"
      :secondMenu="secondMenu"
      @transferData="transferData"
      @returnData="returnData"
      @updateElement="updateElement"
    >
    </dragBox-item>

    <div v-show="showCustomizeDiv">
      <div style="display:flex;">
        <div class="exitBtn_cus editBtn" ref="exitBtn_cus" @click="cus_editFn">编辑</div>
        <div class="exitBtn_cus" ref="exitBtn_cus" @touchstart="cus_exitFn">退出</div>
      </div>
    </div>

    <!-- 官方虚拟键盘组件 -->
    <officialKeyboard
      :officialKeyboardFlag="officialKeyboardFlag"
      :screen="screen"
      @exitOfficialKeyboard="exitOfficialKeyboard"
      @transferData="transferData"
      @returnData="returnData"
    ></officialKeyboard>
  </div>
</template>

<script>
import slidebar from '@c/slidebar/index'
import network from '@c/network/index'
import textKeyboard from '@c/textKeyboard/index'
import officialKeyboard from '@c/officialKeyboard/index'
import dragBox from '@c/customize/drag/dragBox'
import customize from '@c/customize/index'
import { mapGetters } from 'vuex'

export default {
  name: 'customDevelopment',
  data () {
    return {

    }
  },
  components: {
    "slidebar-item": slidebar,
    "network-item": network,
    textKeyboard,
    'dragBox-item': dragBox,
    'customize-item': customize,
    officialKeyboard
  },
  props: [
    // 自定义菜单相关
    'isSidwbar',
    'screen',
    'showFullScreenSwitch',
    'firstLoad',
    'isNetshow',
    // 网络监测相关
    'roundTripTime',
    'byteRateSpeed',
    'packetRate',
    // 文字键盘相关
    'panel',
    'allKey',
    'signKey',
    'SpeKey',
    'iscaps',
    'colorA',
    'colorB',
    'activeClass',
    // 编辑退出相关
    'showCustomizeDiv',
    // 官方键盘相关
    'officialKeyboardFlag',
    // 创建自定义键盘相关
    'universal',
    'Showcustomize',
    'customize_editBtn_data',
    'isHorizontalScreen',
    'popupNav',
    'exitCustomEdit',
    // 操作自定义键盘相关
    'dragBoxShowSidebar',
    'secondMenu'
  ],
  computed: {
    ...mapGetters([
      'itemList'
    ])
  },
  methods: {
    showKey () {
      this.$emit('showKey')
    },
    away () {
      this.$emit('away')
    },
    reset () {
      this.$emit('reset')
    },
    goRechargeUrl () {
      this.$emit('goRechargeUrl')
    },
    changemousespeed (data) {
      this.$emit('changemousespeed', data)
    },
    createClick () {
      this.$emit('createClick')
    },
    changeNet (data) {
      this.$emit('changeNet', data)
    },
    closeNetWork (data) {
      this.$emit('closeNetWork', data)
    },
    showSidebar () {
      this.$emit('showSidebar')
    },
    showFullScreen (data) {
      this.$emit('showFullScreen', data)
    },
    whickKeyTextKeyboard (which, index) {
      this.$emit('whickKeyTextKeyboard', which, index)
    },
    KeyEndTextKeyboard (which) {
      this.$emit('KeyEndTextKeyboard', which)
    },
    keySignDownTextKeyboard (item, index) {
      this.$emit('keySignDownTextKeyboard', item, index)
    },
    keySpecailUp (item) {
      this.$emit('keySpecailUp', item)
    },
    cus_editFn () {
      this.$emit('cusEditFn')
    },
    cus_exitFn () {
      this.$emit('cusExitFn')
    },
    exitOfficialKeyboard () {
      this.$emit('exitOfficialKeyboard')
    },
    transferData (item, customizBtn, index) {
      this.$emit('transferData', item, customizBtn, index)
    },
    returnData (item, customizBtn, index) {
      this.$emit('returnData', item, customizBtn, index)
    },
    initCustomizeShow (data) {
      this.$emit('initCustomizeShow', data)
    },
    Showcustomize_son (data, opacity) {
      this.$emit('Showcustomize_son', data, opacity)
    },
    clk_cus_close_sidebar (data) {
      this.$emit('clk_cus_close_sidebar', data)
    },
    showDragBall (data) {
      this.$emit('showDragBall', data)
    },
    emitShowNavBar (navShow, iconShow) {
      this.$emit('showNavBar', navShow, iconShow)
    },
    updateElement (element, status) {
      this.$emit('updateElement', element, status)
    }
  }
}
</script>

<style lang="less" scoped>
.exitBtn_cus {
	position: absolute;
	top: 16.7px;
	left: 55%; //edit
	width: 83.3px;
	height: 50px;
	line-height: 50px;
	border-radius: 8.3px;
	color: #00ffd8;
	background-color: #161f19;
	border: 1.7px solid #0e4a55;
	z-index: 99999;
	font-size: 26.7px;
}
.editBtn {
	left: 45%;
}
</style>