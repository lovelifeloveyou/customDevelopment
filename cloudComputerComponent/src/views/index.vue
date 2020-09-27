<template>
  <div>
    <button class="floatBall" @touchstart="showMenu">悬浮球</button>
    <!-- 菜单栏组件 -->
    <slidebar-item
      :isSidwbar="isSidwbar"
      :screen="screenInfomation"
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
    >
    </customize-item>
    <dragBox-item
      v-for="(item, index) in itemList"
      :key="index"
      :keymsg="item"
      :title="index"
      :screen="screenInfomation"
      :isHorizontalScreen="isHorizontalScreen"
      :dragBoxShowSidebar="dragBoxShowSidebar"
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'customDevelopment',
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
      cus_exit: false,
      showDrag: false,
      needShowNavBar: false,
      needIconShow: false,
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
      quitOfficialKeyboard: false,
      keyboard_index: null,
      officialKeyboardFlag: "",
      mouseSpeed: 1,
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
      isHorizontalScreen: false
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
    'showFullScreenSwitch',
    'firstLoad',
    // 网络监测相关
    'roundTripTime',
    'byteRateSpeed',
    'packetRate',
    // 文字键盘相关
    'colorA',
    'colorB',
    // 创建自定义键盘相关
    'universal',
    // 操作自定义键盘相关
    'dragBoxShowSidebar'
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
      "popupNav"
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
      "setPopupNav"
    ]),
    // 本地开发调试，模拟悬浮球
    showMenu () {
      this.isSidwbar = !this.isSidwbar
    },
    showKey() {
      console.log("显示文字键盘");
      this.isBtn = 2;
      this.allKey = this.SpeKey || this.signKey ? false : true;
      // 改变菜单是否显示
      this.isSidwbar = false;
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
      // let eventInfo = {
      //   keyboard_type: "-2",
      //   keyboard_type_name: "文字键盘",
      //   keyboard_type_position: "1",
      // };
      // this.$record("virturl_keyboard_list_selection", eventInfo);
    },
    // showKey () {
    //   this.$emit('showKey')
    // },
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
      // let eventInfo = {
      //   virturl_keyboard_event_position: "1",
      // };
      // this.$record("virturl_keyboard_event", eventInfo);
    },
    // createClick () {
    //   this.$emit('createClick')
    // },
    changeNet (data) {
      this.isNetshow = data
      // this.$emit('changeNet', data)
    },
    // closeNetWork (data) {
    //   this.$emit('closeNetWork', data)
    // },
    showSidebar () {
      this.isSidwbar = !this.showSidebar // 本地开发调试
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
    cus_editFn() {
      this.setClickEditKeyboard(true);
      this.setJustSave(false);
      this.setRememberHasSaveKeyboard(
        JSON.parse(JSON.stringify(this.itemList))
      );
      this.show_customize_div = false;
      this.isSidwbar = false;
      this.$emit('changeSideBarShow', false)
      this.setShowNavBar(true);
      this.setLevelShow(false);
      // let eventInfo = {
      //   virturl_keyboard_event_position: "2",
      // };
      // this.$record("virturl_keyboard_event", eventInfo);
    },
    // cus_editFn () {
    //   this.$emit('cusEditFn')
    // },
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
      // let eventInfo = {
      //   virturl_keyboard_event_position: "5",
      // };
      // this.$record("virturl_keyboard_event", eventInfo);
    },
    // cus_exitFn () {
    //   this.$emit('cusExitFn')
    // },
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
      // let eventInfo = {
      //   virturl_keyboard_event_position: "5",
      // };
      // this.$record("virturl_keyboard_event", eventInfo);
    },
    // exitOfficialKeyboard () {
    //   this.$emit('exitOfficialKeyboard')
    // },
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
    // initCustomizeShow (data) {
    //   this.$emit('initCustomizeShow', data)
    // },
    Showcustomize_son(data, opacity) {
      this.Showcustomize = opacity;
      this.show_customize_div = true;
      this.btnSelf(data);
    },
    // Showcustomize_son (data, opacity) {
    //   this.$emit('Showcustomize_son', data, opacity)
    // },
    clk_cus_close_sidebar (data) {
      this.$emit('clk_cus_close_sidebar', data)
    },
    emitShowNavBar(navShow, iconShow) {
      this.needShowNavBar = navShow;
      this.needIconShow = iconShow;
    },
    // emitShowNavBar (navShow, iconShow) {
    //   this.$emit('showNavBar', navShow, iconShow)
    // },
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
    // updateElement (element, status) {
    //   this.$emit('updateElement', element, status)
    // }
    // 自定义键盘对应的按键信息
    btnSelf(item, index) {
      this.setCopyItemList(
        Object.assign(this.copyItemList, { myselfKeyboardIndex: index })
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
      this.$emit('changeSideBarShow', false)
      this.show_customize_div = true;
      this.customize_editBtn_data = item;
      if (this.showNavBar) {
        this.setShowNavBar(false);
      }
      this.keyShow = false;
      this.officialKeyboardFlag = "";
      let keyInfo = "";
      if (
        Number(item.width) === this.screenInfomation.videosWidth &&
        Number(item.height) === this.screenInfomation.videosHeight
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
      // let eventInfo = {
      //   keyboard_type: "0",
      //   keyboard_type_name: item.key_name,
      //   keyboard_type_position: "3",
      // };
      // this.$record("virturl_keyboard_list_selection", eventInfo);
    },
    keySort(item, index) {
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
      // let eventInfo = {
      //   keyboard_type: "-1",
      //   keyboard_type_position: "1",
      //   keyboard_type_name: item.key,
      // };
      // this.$record("virturl_keyboard_list_selection", eventInfo);
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
        this.screenInfomation.rate =
          (this.screenInfomation.totalHeight * 16) / (9 * this.screenInfomation.totalWidth);
        this.screenInfomation.top = 0;
        this.screenInfomation.left =
          ((1 - this.screenInfomation.rate) / 2) * this.screenInfomation.totalWidth;
        this.screenInfomation.videosWidth = this.screenInfomation.rate * this.screenInfomation.totalWidth;
        this.screenInfomation.videosHeight = this.screenInfomation.totalHeight;
      } else {
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
  created () {
    this.renderResize()
  },
  mounted () {
    // 监听屏幕事件
    window.addEventListener("resize", this.renderResize, false);
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