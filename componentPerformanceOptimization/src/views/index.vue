<template>
  <div
    :style="{
      position: 'relative',
      width: screenInfomation.videosWidth + 'px',
      height: screenInfomation.videosHeight + 'px',
      marginLeft: screenInfomation.left + 'px',
      marginTop: screenInfomation.top + 'px',
      background: 'beige'
    }"
  >
    <button v-if="true" class="floatBall" @touchstart="showMenu">悬浮球</button>
    <!-- 菜单栏组件 -->
    <slidebar-item
      :isSidwbar="isSidwbar"
      :screen="screenInfomation"
      :firstLoad="firstLoad"
      :showFullScreenSwitch="showFullScreenSwitch"
      @showKey="showKey"
      @away="away"
      @reset="reset"
      @goRechargeUrl="goRechargeUrl"
      @changemousespeed="changemousespeed"
      @createClick="createClick"
      @changeNet="changeNet"
      @showSidebar="showSidebar"
      @showFullScreen="showFullScreen"
      @sendDataBuriedPoint="sendDataBuriedPoint"
    >
    </slidebar-item>

    <!-- 网络监测组件 -->
    <network-item
      :isNetshow="isNetshow"
      :roundTripTime="roundTripTime"
      :byteRateSpeed="byteRateSpeed"
      :packetRate="packetRate"
      @closeNetWork="changeNet"
    >
    </network-item>

    <!-- 文字键盘组件 -->
    <textKeyboard
      :panel="panel"
      :allKey="allKey"
      :signKey="signKey"
      :SpeKey="SpeKey"
      :colorA="colorA"
      :colorB="colorB"
      :activeClass="activeClass"
      :allKeys="allKeys"
      :CapsallKeys="CapsallKeys"
      :numKey="numKey"
      :signKeys="signKeys"
      :speCtrls="speCtrls"
      @whickKeyTextKeyboard="whickKeyTextKeyboard"
      @KeyEndTextKeyboard="KeyEndTextKeyboard"
      @keySignDownTextKeyboard="keySignDownTextKeyboard"
      @keySpecailUp="keySpecailUp"
    >
    </textKeyboard>

    <!-- 自定义键盘组件 -->
    <customize-item
      :screen="screenInfomation"
      :universal="universal"
      :Showcustomize="Showcustomize"
      :customize_editBtn_data="customize_editBtn_data"
      :isHorizontalScreen="isHorizontalScreen"
      :popupNav="popupNav"
      :exitCustomEdit="exitCustomEdit"
      @initCustomizeShow="initCustomizeShow"
      @Showcustomize_son="Showcustomize_son"
      @clk_cus_close_sidebar="clk_cus_close_sidebar"
      @showNavBar="emitShowNavBar"
      @sendDataBuriedPoint="sendDataBuriedPoint"
    >
    </customize-item>
    <dragBox-item
      v-for="(item, index) in itemList"
      :key="index"
      :keymsg="item"
      :title="index"
      :screen="screenInfomation"
      :isHorizontalScreen="isHorizontalScreen"
      :secondMenu="secondMenu"
      @transferData="transferData"
      @returnData="returnData"
      @updateElement="updateElement"
    >
    </dragBox-item>

    <div v-show="show_customize_div">
      <div style="display:flex;">
        <div class="exitBtn_cus editBtn" ref="exitBtn_cus" @click="cus_editFn">编辑</div>
        <div class="exitBtn_cus" ref="exitBtn_cus" @touchstart="cus_exitFn">退出</div>
      </div>
    </div>

    <!-- 官方虚拟键盘组件 -->
    <officialKeyboard
      :officialKeyboardFlag="officialKeyboardFlag"
      :screen="screenInfomation"
      @exitOfficialKeyboard="exitKey"
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
import tools from "@/utils/tools"
import keyboard from '@/api/keyboard'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'cloudComputerCustom',
  data () {
    return {
      isSidwbar: false, // 本地开发调试
      customize_editBtn_data: {},
      show_customize_div: false,
      Showcustomize: 1,
      keyShow: true, // 游戏键盘
      panel: false, //  输入键盘面板
      allKey: false, //  输入键盘字母数字
      signKey: false, //  输入键盘字符符号
      SpeKey: false, //  输入键盘控制键
      activeClass: -1,
      index: "",
      isShowMyborad: false, // 是否显示我的键盘二级菜单
      customizeBtn: {
        customDirection: false,
        customRoller: false,
      },
      showFullScreenSwitch: true, // 全屏显示开关
      cus_exit: false,
      showDrag: false,
      needShowNavBar: false,
      needIconShow: false,
      exitCustomEdit: false,
      quitOfficialKeyboard: false,
      keyboard_index: null,
      officialKeyboardFlag: "",
      isNetshow: false,
      screenInfomation: {
        videosWidth: 0,
        videosHeight: 0,
        totalWidth: 0,
        totalHeight: 0,
        rate: 1,
        top: 0,
        left: 0
      },
      isHorizontalScreen: false,
      count: 1,
      firstOnloadKeyboard: true,
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
      ]
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
    // 'isSidwbar', // 本地调试暂时隐藏
    'firstLoad',
    // 网络监测相关
    'roundTripTime',
    'byteRateSpeed',
    'packetRate',
    // 文字键盘相关
    'colorA',
    'colorB',
    // 创建自定义键盘相关
    'universal'
  ],
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
      "popupNav",
      "judgeTouchStart",
      "showTextKeyboard",
      "notifyComponent"
    ]),
    secondMenu() {
      return this.isShowMyborad || this.keyShow;
    }
  },
  watch: {
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
    fullScreenShow() {
      this.rotate();
      if (this.itemList.length) {
        this.setItemList([]);
        const { item, index } = this.saveCustomKeyboard;
        this.btnSelf(item, index);
      }
    },
    judgeTouchStart () {
      if (this.judgeTouchStart) {
        if (!this.isSidwbar && this.panel) {
          this.panel = false;
          this.allKey = false;
          this.signKey = false;
          this.SpeKey = false;
          this.keyShow =
            this.showNavBar || this.editKeyboard || this.quitOfficialKeyboard
              ? false
              : true;
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
            this.setPopupNav("all")
          }
          if (this.needIconShow) {
            this.setPopupNav("iconShow")
          }
          if (!this.needShowNavBar && !this.needShowNavBar) {
            this.setPopupNav("hide")
          }
          return;
        }
        if (this.isSidwbar) {
          this.$emit('changeSideBarShow', false)
        }
      }
      this.setJudgeTouchStart(false)
    },
    isSidwbar () {
      this.setJudgeTouchStart(false)
    },
    panel () {
      this.setJudgeTouchStart(false)
    },
    showTextKeyboard () {
      if (this.showTextKeyboard) {
        this.showKey()
      }
      this.setShowTextKeyboard(false)
    },
    async notifyComponent () {
      if (this.notifyComponent) {
        let saveCount = JSON.parse(localStorage.getItem('saveUseCount')) || {}
        const { newUser, useCount } = saveCount
        let serviceDefault = JSON.parse(localStorage.getItem('openDefaultKeyboard')) || {}
        const { serviceId, keyId } = serviceDefault
        let judge = JSON.parse(localStorage.getItem('saveUserBehavior'))
        if (Object.prototype.toString.call(judge) !== '[object Array]') {
          localStorage.setItem('saveUserBehavior', null)
        }
        let saveServiceKeyboard = JSON.parse(localStorage.getItem('saveUserBehavior')) || []
        let exclusiveFlag = saveServiceKeyboard.find(item => item.serviceId === serviceId)
        if (exclusiveFlag && exclusiveFlag.item) {
          if (exclusiveFlag.flag === 'official') {
            let sendData = { key_id: exclusiveFlag.item.key_id }
            await this.getkeyInfo(sendData)
            this.keySort(exclusiveFlag.item, exclusiveFlag.index)
          } else if (exclusiveFlag.flag === 'custom') {
            this.btnSelf(exclusiveFlag.item, exclusiveFlag.index)
          }
        } else {
          let defaultKeyboardSetting = JSON.parse(localStorage.getItem('defaultKeyboardSetting'))
          if (!defaultKeyboardSetting) {
            let res = await keyboard.getKeyboardInfo({ key_id: keyId ? keyId : ((newUser && useCount < 6) ? 3615551 : undefined) })
            if (res.success && res.data) {
              let keyInfo = JSON.parse(res.data.key_info)
              const { width, height } = res.data
              let officialkey = keyInfo.map((item)=>{
              item.keyMarginTop = item.keyMarginTop =='-1' ? height - item.keyMarginBottom - item.keyHeight : item.keyMarginTop
              item.keyMarginLeft = item.keyMarginLeft =='-1' ? width - item.keyMarginRight - item.keyWidth : item.keyMarginLeft
              item.keyName = item.keyName.replace(/\\n/g,'\n')
                return item
              })
              let realData = saveServiceKeyboard.filter(item => item.serviceId !== serviceId).concat({
                serviceId: serviceId,
                item: tools.deepClone(res.data),
                index: 0,
                flag: 'official'
              })
              localStorage.setItem("saveUserBehavior", JSON.stringify(realData))
              localStorage.setItem('defaultKeyboardSetting', JSON.stringify(true))
              this.setKeyInfo(officialkey)
              this.keySort(res.data, 0)
            }
          }
        }
      }
      this.setNotifyComponent(false)
    }
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
  methods: {
    ...mapActions([
      "getCustomizeBtnLists",
      "getkeyInfo"
    ]),
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
      "setPopupNav",
      "setJudgeTouchStart",
      "setShowTextKeyboard",
      "setKeyInfo",
      "setEmptyCustomizeBtnLists",
      "setNotifyComponent"
    ]),
    // 本地开发调试，模拟悬浮球
    showMenu () {
      if (this.showNavBar) return
      this.isSidwbar = !this.isSidwbar // 本地开发调试
    },
    sendDataBuriedPoint (name, data) {
      this.$emit('sendDataBuriedPoint', name, data)
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
    showKey() {
      console.log("显示文字键盘");
      this.isBtn = 2;
      this.allKey = this.SpeKey || this.signKey ? false : true;
      // 改变菜单是否显示
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
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
        this.setPopupNav("hide");
      }
      let eventInfo = {
        keyboard_type: "-2",
        keyboard_type_name: "文字键盘",
        keyboard_type_position: "1",
      };
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_list_selection', eventInfo)
    },
    away () {
      setTimeout(() => {
        this.$emit('away')
      }, 300)
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
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
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
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_event', eventInfo)
    },
    changeNet (data) {
      this.isNetshow = data
    },
    showSidebar () {
      this.isSidwbar = !this.showSidebar // 本地开发调试
      this.$emit('showSidebar')
    },
    showFullScreen (data) {
      this.setFullScreenShow(data);
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
    },
    whickKeyTextKeyboard (which, index) {
      which.key = which.keyRealName || which.keyName || which.key
      this.activeClass = index
      if (['大写', '小写'].includes(which.key)) {
        let newList = this.allKeys
        this.allKeys = this.CapsallKeys
        this.CapsallKeys = newList
      } else if (which.key == '隐藏') {
        this.panel = false
        this.allKey = false
        this.signKey = false
        this.SpeKey = false
        this.keyShow =
          this.showNavBar || this.editKeyboard || this.quitOfficialKeyboard
            ? false
            : true;
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
          this.setPopupNav("all");
        }
        if (this.needIconShow) {
          this.setPopupNav("iconShow");
        }
        if (!this.needShowNavBar && !this.needShowNavBar) {
          this.setPopupNav("hide");
        }
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
      }
      this.$emit('whickKeyTextKeyboard', which, index)
    },
    KeyEndTextKeyboard (which) {
      this.activeClass = -1;
      this.$emit('KeyEndTextKeyboard', which)
    },
    keySignDownTextKeyboard (item, index) {
      this.activeClass = index;
      if (item.len == 0 && item.key == '返回') {
        this.panel = true;
        this.allKey = true;
        this.signKey = false;
        this.SpeKey = false;
      }
      this.$emit('keySignDownTextKeyboard', item, index)
    },
    keySpecailUp (item) {
      this.activeClass = -1
      this.$emit('keySpecailUp', item)
    },
    cus_editFn() {
      this.setClickEditKeyboard(true);
      this.setJustSave(false);
      this.setRememberHasSaveKeyboard(
        JSON.parse(JSON.stringify(this.itemList))
      );
      this.show_customize_div = false;
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
      this.setShowNavBar(true);
      let eventInfo = {
        virturl_keyboard_event_position: "2",
      };
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_event', eventInfo)
    },
    cus_exitFn() {
      this.keyboard_index = null;
      this.show_customize_div = false;
      let serviceDefault = JSON.parse(localStorage.getItem('openDefaultKeyboard')) || {}
      const { serviceId } = serviceDefault
      let saveServiceKeyboard = JSON.parse(localStorage.getItem('saveUserBehavior')) || []
      let realData = saveServiceKeyboard.filter(item => item.serviceId !== serviceId).concat({
        serviceId: serviceId,
        item: null,
        index: null,
        flag: 'custom'
      })
      localStorage.setItem("saveUserBehavior", JSON.stringify(realData))
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
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_event', eventInfo)
    },
    exitKey() {
      this.officialKeyboardFlag = "";
      let serviceDefault = JSON.parse(localStorage.getItem('openDefaultKeyboard')) || {}
      const { serviceId } = serviceDefault
      let saveServiceKeyboard = JSON.parse(localStorage.getItem('saveUserBehavior')) || []
      let realData = saveServiceKeyboard.filter(item => item.serviceId !== serviceId).concat({
        serviceId: serviceId,
        item: null,
        index: null,
        flag: 'official'
      })
      localStorage.setItem("saveUserBehavior", JSON.stringify(realData))
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
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_event', eventInfo)
    },
    transferData (item, customizBtn, index) {
      this.$emit('transferData', item, customizBtn, index)
    },
    returnData (item, customizBtn, index) {
      this.$emit('returnData', item, customizBtn, index)
    },
    // 退出编辑后初始化
    initCustomizeShow(data) {
      this.cus_exit = false;
      this.Showcustomize = 1; // addd
      this.show_customize_div = !!data; // addd
      this.needShowNavBar = false;
      this.needIconShow = false;
    },
    Showcustomize_son(data, opacity) {
      this.Showcustomize = opacity;
      this.show_customize_div = true;
      this.btnSelf(data);
    },
    clk_cus_close_sidebar (data) {
      this.$emit('clk_cus_close_sidebar', data)
    },
    emitShowNavBar(navShow, iconShow) {
      this.needShowNavBar = navShow;
      this.needIconShow = iconShow;
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
    // 自定义键盘对应的按键信息
    btnSelf(item, index) {
      this.setCopyItemList(
        Object.assign(this.copyItemList, { myselfKeyboardIndex: index })
      );
      this.keyboard_index = index;
      this.sub_index = undefined;
      let serviceDefault = JSON.parse(localStorage.getItem('openDefaultKeyboard')) || {}
      const { serviceId } = serviceDefault
      let saveServiceKeyboard = JSON.parse(localStorage.getItem('saveUserBehavior')) || []
      let realData = saveServiceKeyboard.filter(item => item.serviceId !== serviceId).concat({
        serviceId: serviceId,
        item: tools.deepClone(item),
        index: index,
        flag: 'custom'
      })
      localStorage.setItem("saveUserBehavior", JSON.stringify(realData))
      this.setItemList([]);
      this.setEditKeyboard(true);
      this.setClickEditKeyboard(false);
      this.setCreateClick(false);
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
      this.show_customize_div = true;
      this.customize_editBtn_data = item;
      if (this.showNavBar) {
        this.setShowNavBar(false);
      }
      this.keyShow = false;
      this.officialKeyboardFlag = "";
      let keyInfo = "";
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
            this.screenInfomation.videosWidth,
          keyHeight:
            (Number(ele.keyWidth) / Number(item.width)) *
            this.screenInfomation.videosWidth,
          keyLeft:
            (Number(ele.keyLeft) / Number(item.width)) *
            this.screenInfomation.videosWidth,
          keyTop:
            (Number(ele.keyTop) / Number(item.height)) *
            this.screenInfomation.videosHeight,
        };
      });
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
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_list_selection', eventInfo)
    },
    keySort(item, index) {
      this.quitOfficialKeyboard = false;
      let serviceDefault = JSON.parse(localStorage.getItem('openDefaultKeyboard')) || {}
      const { serviceId } = serviceDefault
      let saveServiceKeyboard = JSON.parse(localStorage.getItem('saveUserBehavior')) || []
      let realData = saveServiceKeyboard.filter(item => item.serviceId !== serviceId).concat({
        serviceId: serviceId,
        item: tools.deepClone(item),
        index: index,
        flag: 'official'
      })
      localStorage.setItem("saveUserBehavior", JSON.stringify(realData))
      this.officialKeyboardFlag = item.key_id;
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
      this.isSidwbar = false; // 本地开发调试
      this.$emit('changeSideBarShow', false)
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
      this.$emit('sendDataBuriedPoint', 'virturl_keyboard_list_selection', eventInfo)
    },
    renderResize() {
      // 判断横竖屏
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      this.rotate()
      if (width > height) {
        this.isHorizontalScreen = true;
      } else {
        this.isHorizontalScreen = false;
      }
    },
    adaptScreenInfomation(x, y) {
      let a = x;
      let b = y;
      let c = 0;
      b -= 10;
      if ((b * 16) / 9 > a) {
        this.adaptScreenInfomation(a, b);
      } else {
        a = (b * 16) / 9;
        if (this.fullScreenShow) {
          this.screenInfomation.videosWidth = a;
          this.screenInfomation.videosHeight = b;
        } else {
          this.screenInfomation.videosWidth = a;
          this.screenInfomation.videosHeight = b;
        }
      }
    },
    rotate() {
      this.screenInfomation.totalWidth =
        window.screen.availWidth > window.screen.availHeight
          ? window.screen.availWidth
          : window.screen.availHeight;
      this.screenInfomation.totalHeight =
        window.screen.availWidth < window.screen.availHeight
          ? window.screen.availWidth
          : window.screen.availHeight;

      // 首先判断屏幕是否本身就是16:9的比例，若是则默认全屏显示，且不显示全屏显示，若不是该比例则显示
      if (
        Number(
          (this.screenInfomation.totalWidth / this.screenInfomation.totalHeight).toFixed(1)
        ) === 1.8
      ) {
        this.showFullScreenSwitch = false
        this.screenInfomation.rate =
          (this.screenInfomation.totalHeight * 16) / (9 * this.screenInfomation.totalWidth);
        this.screenInfomation.top = 0;
        this.screenInfomation.left =
          ((1 - this.screenInfomation.rate) / 2) * this.screenInfomation.totalWidth;
        this.screenInfomation.videosWidth = this.screenInfomation.rate * this.screenInfomation.totalWidth;
        this.screenInfomation.videosHeight = this.screenInfomation.totalHeight;
      } else {
        this.showFullScreenSwitch = true
        if (this.fullScreenShow) {
          if ((this.screenInfomation.totalHeight * 16) / 9 <= this.screenInfomation.totalWidth) {
            this.screenInfomation.rate =
              (this.screenInfomation.totalHeight * 16) / (9 * this.screenInfomation.totalWidth);
            this.screenInfomation.top = 0;
            this.screenInfomation.left =
              ((1 - this.screenInfomation.rate) / 2) * this.screenInfomation.totalWidth - 42;
            this.screenInfomation.videosWidth =
              this.screenInfomation.rate * this.screenInfomation.totalWidth + 84;
            this.screenInfomation.videosHeight = this.screenInfomation.totalHeight;
            this.screenInfomation.changeRatioHeight = (this.screenInfomation.videosWidth / 16) * 9;
          } else {
            if ((this.screenInfomation.totalWidth * 9) / 16 <= this.screenInfomation.totalHeight) {
              this.screenInfomation.videosWidth = this.screenInfomation.totalWidth;
              this.screenInfomation.videosHeight =
                (this.screenInfomation.totalWidth * 9) / 16 + 200;
            } else {
              this.adaptScreenInfomation(this.screenInfomation.totalWidth, this.screenInfomation.totalHeight);
            }
            this.screenInfomation.top =
              (this.screenInfomation.totalHeight - this.screenInfomation.videosHeight) / 2;
            this.screenInfomation.left =
              (this.screenInfomation.totalWidth - this.screenInfomation.videosWidth) / 2;
          }
        } else {
          if ((this.screenInfomation.totalHeight * 16) / 9 <= this.screenInfomation.totalWidth) {
            this.screenInfomation.rate =
              (this.screenInfomation.totalHeight * 16) / (9 * this.screenInfomation.totalWidth);
            this.screenInfomation.top = 0;
            this.screenInfomation.left =
              ((1 - this.screenInfomation.rate) / 2) * this.screenInfomation.totalWidth;
            this.screenInfomation.videosWidth = this.screenInfomation.rate * this.screenInfomation.totalWidth;
            this.screenInfomation.videosHeight = this.screenInfomation.totalHeight;
          } else {
            if ((this.screenInfomation.totalWidth * 9) / 16 <= this.screenInfomation.totalHeight) {
              this.screenInfomation.videosWidth = this.screenInfomation.totalWidth;
              this.screenInfomation.videosHeight = (this.screenInfomation.totalWidth * 9) / 16;
            } else {
              this.adaptScreenInfomation(this.screenInfomation.totalWidth, this.screenInfomation.totalHeight);
            }
            this.screenInfomation.top =
              (this.screenInfomation.totalHeight - this.screenInfomation.videosHeight) / 2;
            this.screenInfomation.left =
              (this.screenInfomation.totalWidth - this.screenInfomation.videosWidth) / 2;
          }
        }
      }
      localStorage.setItem("screenInfomation", JSON.stringify(this.screenInfomation));
    }
  },
  mounted () {
    // 监听屏幕事件
    window.addEventListener("resize", this.renderResize, false);
  },
  async created () {
    this.renderResize()

    if (this.firstOnloadKeyboard) {
      this.firstOnloadKeyboard = false;
      this.setEmptyCustomizeBtnLists([])
      this.getCustomizeKeyboardLists();
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
	z-index: 1000;
	font-size: 26.7px;
}
.editBtn {
	left: 45%;
}
.floatBall {
  position: absolute;
  top: 100px;
  right: 100px;
  width: 150px;
  height: 70px;
  border-radius: 70px;
  color: #fff;
  background-color: #449d44;
  border: none;
  font-size: 28px;
}
</style>