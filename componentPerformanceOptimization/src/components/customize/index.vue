<template>
  <div class="customize" v-show="isOpen" @touchstart="isShow($event)">
    <div class="nav_prent" v-show="isNavShow">
      <div class="nav">
        <img :src="nav_icon[0]" :height="imgShowSize.a" @click="closeCustomizePanel" />
        <img :src="nav_icon[1]" :height="imgShowSize.a" @click="clk(1)" />
        <img :src="nav_icon[2]" :height="imgShowSize.a" @click="clk(2)" />
        <img :src="nav_icon[3]" :height="imgShowSize.b" style="position: relative; top: 20%;" @click="showCourse" />
        <img :src="nav_icon[4]" :height="imgShowSize.a" @click="clk(3)" />
        <img :src="nav_icon[5]" :height="imgShowSize.a" @click="clk(4)" />
        <img :src="nav_icon[6]" :height="imgShowSize.a" @click="openSaveDialog" />
      </div>
    </div>

    <!-- 教程图 -->
    <div class="course" v-show="isShowCourse" @click="clickNext">
      <img :class="{course_active: courseActive == 2}" :src="course_img[4]" />
      <img :class="{course_active: courseActive == 3}" :src="course_img[5]" />
      <img :class="{course_active: courseActive == 4}" :src="course_img[6]" />
      <img :class="{course_active: courseActive == 5}" :src="course_img[7]" />
      <img :class="{course_active: courseActive == 6}" :src="course_img[8]" />
    </div>

    <div class="half_icon" v-show="isIconShow" @click="expandNavBar">
      <img :src="nav_icon[7]" :height="imgShowSize.c" />
      <span style="position: fixed;top: 5px;left: 50%;transform: translate(-50%);color: #00f6c1;font-size: 16px;">菜单</span>
      <img
        :src="nav_icon[8]"
        :height="imgShowSize.d"
        style="position: fixed;top: 30px;   left: 50%;transform: translate(-50%); "
      />
    </div>

    <!-- nav栏组件 -->
    <div class="compSon" style="pointer-events: initial;">
      <mouseKey-item
        @showDragBall="showDragBall"
        v-show="comp_actived == 1"
        @func="getData"
        @clkClose="clkClose"
      ></mouseKey-item>
      <key-item v-show="comp_actived == 2" @func="getData"></key-item>
      <barKey-item
        v-show="comp_actived == 3"
        @func="getData"
        @clkClose="clkClose"
        @rollerCurrent="rollerCurrent"
      ></barKey-item>
      <lineKey-item v-show="comp_actived == 4" @func="getData"></lineKey-item>
    </div>
    <!-- 保存 -->
    <van-dialog id="save" v-model="showPreserve" title="保存配置">
      <div class="preserve_content">
        <img
          class="exitImg_pres"
          :src="test_exitImg"
          @click="closeSaveDialog"
          height="30"
          width="30"
        />
        <!-- 键盘列表 -->
        <div class="config">
          <p>我的配置</p>
          <van-list
            class="name_list hscroll"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <li v-for="(item, index) in customizeBtnLists" :key="index">
              <span>{{item.key_name}}</span>
              <van-icon name="delete" @click="deleteBtn(item)" />
            </li>
          </van-list>
        </div>
        <div class="setName">
          <p style="text-align: left; padding-left: 5%;">配置名称</p>
          <!-- <van-field @focus="fieldFocus" @blur="onblur" v-model="name_keyName" /> -->
          <van-field v-model="name_keyName" />
          <div class="btns">
            <div class="preserve_btn" @click="sendmsg">保存</div>
          </div>
        </div>
      </div>
    </van-dialog>
    <van-dialog id="vertical" v-model="verticalPreserve" title="保存配置">
      <div class="preserve_content" style="display: block;pointer-events: initial;">
        <img
          class="exitImg_pres"
          :src="close_exitImg"
          @click="closeSaveDialog"
          height="30"
          width="30"
        />
        <!-- 键盘列表 -->
        <div class="config" style="border-radius:0px;   ">
          <p>我的配置</p>
          <van-list
            class="name_list verticalscroll"
            v-model="loading"
            style="height:119px;   "
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <li v-for="(item, index) in customizeBtnLists" :key="index" @click="active(item)">
              <span :class="item.key_id == actived ? 'color':''">{{item.key_name}}</span>
              <van-icon name="delete" @click="deleteBtn(item)" />
            </li>
          </van-list>
        </div>
        <div class="setName" style="height:60%; margin-left:12px;   ">
          <p style="text-align: left; padding-left: 5%;">新键盘名称</p>
          <van-field v-model="name_keyName" />
          <div class="btns">
            <div class="preserve_btn" @click="sendmsg">保存</div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import connectApi from "@/api/keyboard";
import mouseKey from "@/components/customize/mouseComp/index";
import allKey from "@/components/customize/keyComp/index";
import barKey from "@/components/customize/barComp/index";
import lineKey from "@/components/customize/lineComp/index";
import { mapGetters, mapMutations, mapActions } from "vuex";
import tools from "@/utils/tools";

export default {
  name: "HelloWorld",
  props: {
    screen: Object,
    Showcustomize: Number,
    customize_editBtn_data: Object, //edit
    isHorizontalScreen: Boolean,
    popupNav: String,
    exitCustomEdit: Boolean,
    universal:Object
  },
  data() {
    return {
      loading: false,
      finished: false,
      nav_icon: [
        require("../../assets/img/nav_icon/键盘设置_退出.png"),
        require("../../assets/img/nav_icon/键盘设置_鼠标.png"),
        require("../../assets/img/nav_icon/键盘设置_键盘.png"),
        require("../../assets/img/nav_icon/键盘设置_教程.png"),
        require("../../assets/img/nav_icon/键盘设置_摇杆.png"),
        require("../../assets/img/nav_icon/键位设置_其他.png"),
        require("../../assets/img/nav_icon/键盘设置_保存.png"),
        require("../../assets/img/nav_icon/菜单缩紧.png"),
        require("../../assets/img/nav_icon/多边形 3 拷贝 2.png")
      ],
      course_img: [
        require("../../assets/img/course_img/教学引导01.jpg"),
        require("../../assets/img/course_img/教学引导02.jpg"),
        require("../../assets/img/course_img/教学引导03.jpg"),
        require("../../assets/img/course_img/教学引导04.jpg"),
        require("../../assets/img/course_img/教学引导05.jpg"),
        require("../../assets/img/course_img/教学引导06.jpg"),
        require("../../assets/img/course_img/教学引导07.jpg"),
        require("../../assets/img/course_img/教学引导08.jpg"),
        require("../../assets/img/course_img/教学引导09.jpg")
      ],
      roller_img: [
        require("../../assets/img/roller/摇杆底_非焦点.png"),
        require("../../assets/img/roller/摇杆_方向.png"),
        require("../../assets/img/roller/八方向_焦点字母空.png")
      ],
      isOpen: false,
      isNavShow: true, // 是否显示nav菜单栏
      isIconShow: false, // 是否显示菜单半圆图标
      isShowCourse: false, // 是否显示教程图
      is_actived: true,
      comp_actived: 0,
      courseActive: 2,
      // 滚轮图片的数据
      rollerImgCurrent: 0,
      test_exitImg: require("../../assets/img/roller/保存设置_关闭.png"),
      // 保存dialog
      showPreserve: false,
      verticalPreserve: false,
      name_keyName: "",
      count: 1,
      actived: "",
      close_exitImg: require("../../assets/img/roller/关闭.png"),
      imgShowSize: {
        a: 45,
        b: 65,
        c: 40,
        d: 16
      }
    };
  },
  computed: {
    ...mapGetters([
      "itemList",
      "moveItem",
      "initMsg",
      "customizeBtnLists",
      "editKeyboard",
      "clickEditKeyboard",
      "showNavBar",
      "saveAfterEdit",
      "hideShowCourse"
    ])
  },
  watch: {
    exitCustomEdit() {
      this.$nextTick(() => {
        if (this.exitCustomEdit) {
          this.closeCustomizePanel();
        }
      });
    },
    showNavBar() {
      this.$nextTick(() => {
        if (this.showNavBar) {
          this.isOpen = true;
          this.isNavShow = true;
          this.isIconShow = false;
        } else {
          this.isOpen = false;
          this.isNavShow = false;
          this.isIconShow = false;
        }
      });
    },
    isNavShow() {
      this.$nextTick(() => {
        if (this.isNavShow) {
          this.$emit("showNavBar", this.isNavShow, this.isIconShow);
        }
        this.setNavBarShow(this.isNavShow);
      });
    },
    isOpen() {
      this.$nextTick(() => {
        if (this.isOpen) {
          this.$emit("showNavBar", this.isNavShow, this.isIconShow);
        }
      });
    },
    popupNav() {
      if (this.popupNav === "hide") {
        this.isOpen = false;
        this.isNavShow = false;
        this.isIconShow = false;
      } else if (this.popupNav === "all") {
        this.isOpen = true;
        this.isNavShow = true;
        this.isIconShow = false;
      } else if (this.popupNav === "iconShow") {
        this.isOpen = true;
        this.isNavShow = false;
        this.isIconShow = true;
      }
    },
    moveItem() {
      if (this.moveItem) {
        this.isNavShow = false;
        this.isIconShow = true;
        this.comp_actived = 0;
        this.$nextTick(() => {
          this.setMoveItem(false);
        });
      }
    },
    hideShowCourse() {
      if (this.hideShowCourse) {
        this.isShowCourse = false;
        this.courseActive = 2;
        this.setHideShowCourse(false);
        if (this.showNavBar) {
          this.isOpen = true;
          this.isNavShow = true;
          this.isIconShow = false;
        }
      }
    }
  },
  components: {
    "mouseKey-item": mouseKey,
    "key-item": allKey,
    "barKey-item": barKey,
    "lineKey-item": lineKey
  },
  mounted() {
      let screenInfo = tools.getScreenInfo()
      const { totalWidth, totalHeight } = screenInfo
      for (let i in this.imgShowSize) {
        this.imgShowSize[i] = this.imgShowSize[i] / 736 * totalWidth
      }
  },
  methods: {
    ...mapActions(["getCustomizeBtnLists"]),
    ...mapMutations([
      "addItemList",
      "cutItemList",
      "setItemList",
      "setCurrentTutorial",
      "setMoveItem",
      "setNavBarShow",
      "setClickEditKeyboard",
      "setHasDelCustomizeBtn",
      "setJustSave",
      "setEditKeyboard",
      "setShowNavBar",
      "setSaveAfterEdit",
      "setCreateClick",
      "setHideShowCourse",
      "setAddNewCustomizeBtn",
      "setRollerInfo"
    ]),
    expandNavBar() {
      this.isNavShow = true;
      this.isIconShow = false;
    },
    async getCustomizeKeyboardLists() {
      let params = {
        event: "keyboard",
        method: "myKeyboard",
        page: this.count
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
    active(e) {
      this.actived = e.key_id;
      this.name_keyName = e.key_name;
    },
    openSaveDialog() {
      // if ([5].includes(this.initMsg.flag)) {
      //   document.body.removeEventListener("touchmove", this.$bodyScroll, {
      //     passive: false
      //   });
      // }
      this.actived = "";
      if (this.isHorizontalScreen) {
        this.showPreserve = true;
      } else {
        this.verticalPreserve = true;
      }
      if (this.editKeyboard && this.clickEditKeyboard) {
        this.name_keyName = this.customize_editBtn_data.key_name;
      } else if (this.saveAfterEdit.saveFlag) {
        this.name_keyName =
          this.saveAfterEdit.itemList && this.saveAfterEdit.itemList.key_name;
      } else {
        this.name_keyName = "";
      }
    },
    closeSaveDialog() {
      this.showPreserve = false;
      this.verticalPreserve = false;
    },
    showDragBall(data) {
      this.$emit("showDragBall", data);
    },
    clk(num) {
      this.comp_actived = num;
    },
    onblur() {
      $("#save").removeClass("spin");
    },
    empty() {
      this.getCustomizeKeyboardLists();
    },
    onLoad() {
      this.finished = false;
      this.loading = false;
    },
    getData(data) {
      if (this.itemList.length) {
        data.id = this.itemList[this.itemList.length - 1].id + 1;
      } else {
        data.id = 0;
      }
      if (data.keyName == "隐藏") {
        this.comp_actived = 0;
        return;
      }
      this.$nextTick(() => {
        console.log("添加键盘数据 ", data);
        var ua = navigator.userAgent;
        if (ua.match("QQ") !== null) {
          console.log("设备信息", ua);
          data.isQq = true;
        }
        console.log('11',data)
        if(!data.keyTop){
          data.keyTop=150;
        }
        console.log('存储data',data)
        if ([102, 103,101,104].includes(Number(data.rockerType))) {
          let arr = JSON.parse(JSON.stringify(this.itemList));
          arr.map(item => {
            if ([102, 103,101,104].includes(item.rockerType)) {
              item.virtual = true;
            }
          });
          this.setItemList([...arr, data]);
        } else {
          this.setItemList([...this.itemList, data]);
        }
        this.setAddNewCustomizeBtn(true);
      });
    },
    removeCurrentBtn(index) {
      this.$nextTick(() => {
        for (var i = 0; i < this.itemList.length; i++) {
          if (this.itemList[i].id == index) {
            this.cutItemList(i);
          }
        }
      });
    },
    deleteBtn: function(item) {
      this.$dialog
        .confirm({
          message: "是否删除配置：" + item.key_name
        })
        .then(() => {
          this.delmsg(item);
          this.setHasDelCustomizeBtn(item.key_id);
        })
        .catch(() => {
          this.$toast("已取消");
        });
    },
    delmsg(keydata) {
      this.$loading.open();
      const { cate_name, width, height, key_name, key_id } = keydata;
      let params = {
        cateName: cate_name,
        width: width,
        height: height,
        keyName: key_name,
        keyInfo: [],
        lineInfo: [],
        isShare: 0,
        keyId: key_id,
        authorname: "",
        event: "keyboard",
        method: "addKeyboard",
        operation: "del"
      };
      connectApi
        .preserveKeyboardDel(params)
        .then(res => {
          this.$loading.close();
          setTimeout(() => {
            this.$toast(res.msg);
            this.getCustomizeKeyboardLists();
          }, 1000);
          let eventInfo = {
          keyboard_del_position: "1",
          };
          this.$emit('sendDataBuriedPoint', 'virturl_keyboard_list_del', eventInfo)
        })
        .catch(error => {
          this.$loading.close();
          console.log("删除失败");
        });
    },
    sendmsg: function() {
      // if ([5].includes(this.initMsg.flag)) {
      //   document.body.addEventListener("touchmove", this.$bodyScroll, {
      //     passive: false
      //   });
      // }
      if (!this.name_keyName.trim().length) {
        this.$toast("请输入配置名称!");
        return;
      }
      let realSave = this.itemList.filter(
        item => !item.virtual && !item.isDelete
      );
      let obj = {};
      let realSaveItem = realSave.reduce((current, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && current.push(next));
        return current;
      }, []);

      let keyid = 0;
      let keyIndex = 0;

      if (!realSaveItem.length) {
        this.$toast("请添加自定义键盘!");
        return;
      }
      this.$loading.open();
      let params = {
        cateName: "其他类游戏",
        width: Math.ceil(this.screen.videosWidth),
        height: Math.ceil(this.screen.videosHeight),
        keyName: this.name_keyName,
        keyInfo: realSaveItem,
        lineInfo: [],
        isShare: 0,
        keyId:
          (this.editKeyboard && this.clickEditKeyboard) ||
          this.saveAfterEdit.saveFlag
            ? (this.saveAfterEdit.itemList &&
                this.saveAfterEdit.itemList.key_id) ||
              this.customize_editBtn_data.key_id
            : 0,
        authorname: "",
        event: "keyboard",
        method: "addKeyboard",
        operation:
          (this.editKeyboard && this.clickEditKeyboard) ||
          this.saveAfterEdit.saveFlag
            ? "edit"
            : "add"
      };

      connectApi
        .preserveKeyboard(params)
        .then(res => {
          if (!!res.success) {
            this.getCustomizeKeyboardLists();
            if (res.status == 10000) {
              this.$loading.close();
              setTimeout(() => {
                keyIndex =
                  params.operation === "edit"
                    ? this.customizeBtnLists.findIndex(
                        item => item.key_name === params.keyName
                      )
                    : 0;
                this.$toast(res.msg);
                this.showPreserve = false;
                this.verticalPreserve = false
                this.isOpen = false;
                this.$emit(
                  "Showcustomize_son",
                  this.customizeBtnLists[keyIndex],
                  1
                );
                this.setJustSave(true);
                this.setShowNavBar(false);
                this.setCreateClick(false);
              }, 2000);
              setTimeout(() => {
                this.setSaveAfterEdit({
                  saveFlag: true,
                  itemList: this.customizeBtnLists[keyIndex]
                });
              }, 2000);
            }
          } else {
            this.$loading.close();
            if (res.status === 10003) {
              setTimeout(() => {
                this.$toast(res.msg);
              }, 1000);
            } else if (res.status == 10005) {
              setTimeout(() => {
                this.$dialog
                  .confirm({
                    title: "",
                    message: res.msg
                  })
                  .then(() => {
                    this.$loading.open();
                    keyid = this.customizeBtnLists.find(
                      item => item.key_name === params.keyName
                    ).key_id;
                    keyIndex = this.customizeBtnLists.findIndex(
                      item => item.key_name === params.keyName
                    );

                    params.keyId = keyid;
                    params.operation = "edit";
                    connectApi.preserveKeyboard(params).then(res => {
                      this.$loading.close();
                      this.getCustomizeKeyboardLists();
                      setTimeout(() => {
                        this.$toast(res.msg);
                        this.showPreserve = false;
                        this.verticalPreserve = false
                        this.isOpen = false;
                        this.$emit(
                          "Showcustomize_son",
                          this.customizeBtnLists[keyIndex],
                          1
                        );
                        this.setJustSave(true);
                        this.setShowNavBar(false);
                        this.setCreateClick(false);
                      }, 2000);
                      setTimeout(() => {
                        this.setSaveAfterEdit({
                          saveFlag: true,
                          itemList: this.customizeBtnLists[keyIndex]
                        });
                      }, 2000);
                    });
                  });
              }, 1000);
            } else if (res.status == 10007) {
              setTimeout(() => {
                this.$dialog
                  .confirm({
                    title: "",
                    message: "是否覆盖已有键盘名称 ？"
                  })
                  .then(() => {
                    this.$loading.open();
                    keyid = this.customizeBtnLists.find(
                      item => item.key_name === params.keyName
                    ).key_id;
                    keyIndex = this.customizeBtnLists.findIndex(
                      item => item.key_name === params.keyName
                    );

                    params.keyId = keyid;
                    params.operation = "edit";
                    connectApi.preserveKeyboard(params).then(res => {
                      this.$loading.close();
                      this.getCustomizeKeyboardLists();
                      setTimeout(() => {
                        this.$toast(res.msg);
                        this.showPreserve = false;
                        this.verticalPreserve = false
                        this.isOpen = false;
                        this.$emit(
                          "Showcustomize_son",
                          this.customizeBtnLists[keyIndex],
                          1
                        );
                        this.setJustSave(true);
                        this.setShowNavBar(false);
                        this.setCreateClick(false);
                      }, 2000);
                      setTimeout(() => {
                        this.setSaveAfterEdit({
                          saveFlag: true,
                          itemList: this.customizeBtnLists[keyIndex]
                        });
                      }, 2000);
                    });
                  });
              }, 1000);
            }
          }
        })
        .catch(error => {
          this.$loading.close();
          throw error;
        });
    },
    isShow(e) {
      if (
        e.srcElement.className == "customize" ||
        e.srcElement.className == "nav_prent" ||
        e.srcElement.className == "bar_parent" ||
        e.srcElement.className == "mouse_Comp" ||
        e.srcElement.className == "line_comp"
      ) {               
        this.isNavShow = false;
        this.isIconShow = true;
        this.comp_actived = 0;
      }
      this.$emit("clk_cus_close_sidebar", 0); // addd
    },
    closeCustomizePanel() {
      this.isOpen = false;
      this.isIconShow = true;
      this.comp_actived = 0;
      if (this.clickEditKeyboard) {
        this.setItemList(this.itemList);
        let realSaveItem = this.itemList.filter(
          item => !item.virtual && !item.isDelete
        );
        let rollerInfo = realSaveItem.find(ele =>
          [102, 103, 101, 104].includes(ele.rockerType)
        );
        this.setRollerInfo(rollerInfo);
        this.$emit("initCustomizeShow", 1);
        this.setClickEditKeyboard(false);
        this.setEditKeyboard(true);
        this.setShowNavBar(false);
        this.setSaveAfterEdit({
          saveFlag: false,
          itemList: ""
        });
      } else {
        this.setItemList([]);
        this.$emit("initCustomizeShow", 0);
        this.setClickEditKeyboard(false);
        this.setEditKeyboard(false);
        this.setShowNavBar(false);
        this.setSaveAfterEdit({
          saveFlag: false,
          itemList: ""
        });
      }
    },
    showCourse() {
      // 显示教程图
      this.isShowCourse = true;
      this.isIconShow = false;
      this.isNavShow = false;
      this.comp_actived = 0;
      this.setCurrentTutorial(true);
      console.log("元素集合", this.itemList);
    },
    clickNext() {
      // 点击切换到下一张图片
      if (++this.courseActive >= 7) {
        this.isShowCourse = false;
        this.isIconShow = false;
        this.isNavShow = true;
        this.courseActive = 2;
        this.setCurrentTutorial(false);
      } else {
        // ...
      }
    },
    clkClose(data) {
      let statu = data || null;
      console.log(statu);

      if (statu == "close") {
        this.comp_actived = 0;
      }
    },
    rollerCurrent(num) {
      // 控制显示当前滚轮图片
      this.rollerImgCurrent = num;
    },
    changeClick() {
      this.$toast("暂不支持");
    }
  }
};
</script>

<style lang="less" scoped>

p {
  margin: 0;
  padding: 0;
}
.nav_prent {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  width: 50%;
  height: 16%;
  background-color: #161f1999;
  border: 3.3px solid #0e4a55;
  border-radius: 16.7px;  
  pointer-events: initial;
}
.nav {
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  width: 120%;
  height: 100%;
  pointer-events: initial;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.half_icon {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  z-index: 5;
  pointer-events: initial;
}
.course {
  width: 100%;
  height: 100%;
  pointer-events: initial;
  img {
    display: none;
    height: 100%;
    width: 100%;
  }
  .course_active {
    display: block;
  }
}
.customize {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1500;
  pointer-events: none;
}

.add {
  position: fixed;
  bottom: 0;
}
.send {
  position: fixed;
  bottom: 10%;
}
#vertical {
  transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  position: fixed;
  top: 5%;
  left: 46%;
  width: 550px;   
  height: 543.3px;   
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0px;   
}
.color {
  color: #00fdc6;
}

/deep/ .van-dialog {
  overflow: inherit;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 26.7px;   
  .van-dialog__footer {
    display: none;
  }
}
/deep/ .van-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}

.drag_content {
  display: flex;
  height: 333.3px;   
  width: 533.3px;   
  // background-color: rgba(0, 0, 0, 0.7);
  .btnStyle {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .btnExample {
      color: whitesmoke;
      font-size: 30px;
      line-height: 166.7px;
      width: 166.7px;
      height: 166.7px;
      border-radius: 83.3px;
      border: 1.7px solid #8a8a8a;
      background-color: black;
    }
  }
  .btnFunc {
    flex: 1;
    color: whitesmoke;
    .changeSize {
      box-sizing: border-box;
      padding-top: 33.3px;
      height: 50%;
      .changeSize_text {
        height: 50%;
      }
      .regulate {
        height: 50%;
        color: #00fdc6;
      }
    }
    .keyFashion {
      box-sizing: border-box;
      padding-top: 16.7px;
      height: 50%;
      .keyFashion_text {
        height: 50%;
      }
      .twoBtn {
        height: 50%;
        span {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          width: 93.3px;
          border-radius: 25px;
          background-color: #626262;
        }
      }
    }
  }
  .exitImg {
    position: absolute;
    right: 0px;   
    transform: translate(40%, -40%);
  }
  .funcBtn {
    position: absolute;
    display: flex;
    color: #fff;
    justify-content: space-around;
    width: 100%;
    bottom: -24%;
    .removeBtn {
      // display: inline-block;
      height: 50px;
      line-height: 50px;
      width: 216.7px;
      border-radius: 25px; 
      background-color: #a01614;
    }
    .confirm {
      color: #00fdc6;
      border: 1.7px solid #00fdc6;
      height: 50px;
      line-height: 50px;
      width: 100px;
      border-radius: 25px; 
      background-color: #181818;
    }
  }
}

// 保存
.spin {
  margin-top: -15%;
  margin-right: 30%;
  transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}

/deep/ .van-dialog {
  width: 833.3px;
  color: white;
  overflow: inherit;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 26.7px;   

  .van-dialog__header {
    font-size: 30px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1.7px solid #ffffff96;
  }
  .van-dialog__footer {
    display: none;
  }
}

.preserve_content {
  display: flex;
  height: 333.3px;
  width: 100%;
  border-radius: 26.7px;
  background-color: rgba(0, 0, 0, 0.7);
  pointer-events: initial;
  .exitImg_pres {
    position: absolute;
    top: 0px;   
    right: 0px;   
    transform: translate(40%, -40%);
  }
  .config {
    flex: 1;
    font-size: 26.7px;
    .name_list {
      position: relative;
      list-style: none;
      color: #fff;
      height: 250px;
      padding: 0 33.3px; 
      overflow: auto;
      text-align: center;
      li {
        position: relative;
        height: 50px;
        line-height: 50px;  
        &:nth-child(2n-1) {
          background: linear-gradient(
            to right,
            rgba(8, 8, 8, 0.5),
            rgba(255, 255, 255, 0.1),
            rgba(8, 8, 8, 0.5)
          );
        }
        /deep/ .van-icon {
          position: absolute;
          color: white;
          font-size: 30px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .setName {
    position: relative;
    flex: 1;
    font-size: 26.7px;
    box-sizing: border-box;
    height: 92%;
    margin: 8.3px 16.7px 16.7px 0px;
    background-color: #313131;

    /deep/ .van-cell {
      padding: 16.7px 13.3px;
      line-height: 40px;
      font-size: 26.7px;
      background-color: #313131;
      .van-field__value {
        background-color: black !important;
      }
      .van-field__control {
        color: white;
      }
      &:not(:last-child)::after {
        border: none;
      }
    }

    .btns {
      position: relative;
      top: 10%;
      .preserve_btn {
        display: inline-block;
        color: #00fdc6;
        border: 1.7px solid #00fdc6;
        height: 50px;
        line-height: 50px;
        width: 133.3px;
        border-radius: 25px;
      }
    }
  }
}
</style>
