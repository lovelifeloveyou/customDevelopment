<template>
  <div class="wrap" :style="fullScreenShow ? full : scale">
    <course-item v-if="cusorShow && firstLoad" @changeCusor="changeCusor"></course-item>
    <div class="header">
      <div class="content">
        <div @click="goBack" class="back">
          <div></div>
          <span>返回菜单</span>
        </div>
        <!--<div class="activity"></div>-->
        <div class="search">
          <span></span>
          <input type="text" placeholder="搜索您需要的键盘..." v-model="searchKeyName" />
          <div @click="searchKey">
            <i></i>
            <i>搜索</i>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="tab">
        <p
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          :class="i === index ? 'active' : ''"
        >{{tab}}</p>
      </div>
      <div class="list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          offset="1"
          class="keyboard_wrap"
          id="keyboard_wrap"
        >
          <div
            class="keyboard_item"
            v-for="(item, index) in keyboards"
            :key="index"
            @click="chooseKeyboards(index, item)"
            :class="j === index ? 'active' : 'noactive'"
          >
            <p style="margin:0;">{{item.key_name}}</p>
          </div>
        </van-list>
        <div class="right">
          <div class="bg_key">
            <div
              class="bg_img"
              :style="{ 'background-image': 'url(' + 'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_button.png' + ')',backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',backgroundPosition:'center center',backgroundSize: 'cover'}"
            ></div>
            <ul v-if="mytab==1" class="btn_wrap">
              <li v-for="(item, index) in keyInfos" :key="index">
                <div
                  v-if="item.keyStyle == '0'"
                  :style="`width: ${handlemyPX(item.keyWidth)};height:${handlemyPX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlemyPX(item.keyHeight)};position:absolute;left:${handlemyPX(item.keyLeft)};top: ${handlemyTop(item.keyTop)}`"
                >{{item.keyName}}</div>
                <div
                  v-if="[103,104].includes(Number(item.rockerType))"
                  :style="`width: ${handlemyPX(item.keyWidth)};height:${handlemyPX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlemyPX(item.keyHeight)};position:absolute;left:${handlemyPX(item.keyLeft)};top: ${handlemyTop(item.keyTop)}`"
                >
                  <img
                    id="wheelImage"
                    src="../../../assets/img/direction/middle.png"
                    :width="handlemyPX(item.keyWidth)"
                  />
                </div>
                <div
                  v-if="[101,102].includes(Number(item.rockerType))"
                  :style="`width: ${handlemyPX(item.keyWidth)};height:${handlemyPX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;
                            position:absolute;left:${handlemyPX(item.keyLeft)};top: ${handlemyTop(item.keyTop)}`"
                >
                  <img
                    id="wheelImage"
                    src="../../../assets/img/roller/摇杆底_非焦点.png"
                    :width="handlemyPX(item.keyWidth)"
                  />
                  <div
                    :style="`width: ${handlemyPX(item.keyWidth)};height:${handlemyPX(item.keyHeight)};position:absolute;
                top:0;left:0;`"
                  >
                    <img
                      :style="`position:absolute;left:${handlemyPX(item.keyWidth/4)};top: ${handlemyPX(item.keyHeight/4)}`"
                      :width="handlemyPX(item.keyWidth/2)"
                      src="../../../assets/img/roller/摇杆_方向.png"
                    />
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="mytab!=1" class="btn_wrap">
              <li v-for="(item, index) in keyInfo" :key="index">
                <div
                  v-if="item.keyStyle == '0'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  ${handlePX(item.keyWidth/2)};background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop)};
                            `"
                >{{item.keyRealName}}</div>

                <div
                  v-if="[103].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop)}
                            `"
                >
                  <img
                    id="wheelImage"
                    src="../../../assets/img/direction/middle.png"
                    :width="handlePX(item.keyWidth)"
                  />
                </div>
                <div
                  v-if="[104].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop)}
                            `"
                >
                  <img
                    id="wheelImage"
                    src="../../../assets/img/directionkey/middle.png"
                    :width="handlePX(item.keyWidth)"
                  />
                </div>
                <div
                  v-if="[101,102].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop)}`"
                >
                  <img
                    id="wheelImage"
                    src="../../../assets/img/roller/摇杆底_非焦点.png"
                    :width="handlePX(item.keyWidth)"
                  />
                  <div
                    :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};position:absolute;
                top:0;left:0;`"
                  >
                    <img
                      :style="`position:absolute;left:${handlePX(item.keyWidth/4)};top: ${handlePX(item.keyHeight/4)}`"
                      :width="handlePX(item.keyWidth/2)"
                      src="../../../assets/img/roller/摇杆_方向.png"
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn_setting" v-show="!editDelShow">
            <p @click="createdKey">
              <span></span>
              <span>创建键盘</span>
            </p>
            <p @click="use">
              <span></span>
              <span>使用</span>
            </p>
          </div>
          <div class="btn_mine" v-show="editDelShow">
            <p v-show="mytab==1" @click="deleteBtn">
              <span></span>
              <span>删除</span>
            </p>
            <p v-show="mytab==1" @click="edit">
              <span></span>
              <span>编辑</span>
            </p>
            <p @click="createdKey">
              <span></span>
              <span>创建键盘</span>
            </p>
            <p @click="use">
              <span></span>
              <span>使用</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { List, Dialog } from "vant";
import keyboard from "./keyboard";
import tools from "../../../utils/tools";
import { mapGetters, mapMutations, mapActions } from "vuex";
import connectApi from "@/api/system.js";
import course from "@/components/course/index";
Vue.use(List);
Vue.use(Dialog);
export default {
  name: "keyboardList",
  components: {
    "course-item": course,
  },
  props: ["firstLoad"],
  data() {
    return {
      i: 0,
      j: -1,
      tabs: ["配置列表", "我的"],
      keyboards: [],
      list: [],
      loading: false,
      finished: false,
      page: 1,
      time: "",
      searchKeyName: "",
      keyInfos: [],
      keyInfo: [],
      editDelShow: false,
      choosedKeyId: "",
      count: 1,
      firstClick: true,
      mytab: -1,
      mykey: "",
      mykeyindex: "",
      full: {
        width: "",
        height: "",
      },
      scale: {
        width: "",
        height: "",
      },
      cusorShow: false,
      first: true,
    };
  },
  computed: {
    ...mapGetters(["customizeBtnLists", "fullScreenShow"]),
  },
  inject: ["created", "editFn", "btnSelf", "keySort",'exitKey'],
  mounted() {
    // if (this.firstClick) {
    //   this.firstClick = false;
    //   this.getCustomizeKeyboardLists();
    // }
    // this.keyboards=this.keyLists;
    this.getOfficeKeyboardList();
    // this.getCustomizeKeyboardLists()
    let screen = JSON.parse(localStorage.getItem("screen"));
    this.full.width = screen.videosWidth + "px";
    this.full.height = screen.videosHeight + "px";
    this.scale.width = screen.videosWidth + 1 + "px";
    this.scale.height = screen.videosHeight + "px";
    this.keyboards = [];
    this.first = this.firstLoad;
    if (this.first) {
      this.first = false;
      let first = JSON.parse(sessionStorage.getItem('first'))
      if(!first){
      this.cusorShow = true;
      }
      sessionStorage.setItem('first',JSON.stringify(true))
    }
  },
  methods: {
    ...mapActions(["getCustomizeBtnLists", "getkeyInfo"]),
    ...mapMutations(["setHasDelCustomizeBtn"]),
    changeCusor(status) {
      this.cusorShow = status;
    },
    deleteBtn() {
      this.$dialog
        .confirm({
          message: "是否删除配置：" + this.mykey.key_name,
        })
        .then(() => {
          this.delmsg(this.mykey);
          this.setHasDelCustomizeBtn(this.mykey.key_id);
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
        operation: "del",
        keyInfosWidth: "",
        keyInfoHeight: "",
      };
      connectApi
        .preserveKeyboardDel(params)
        .then((res) => {
          this.$loading.close();
          setTimeout(() => {
            this.$toast(res.msg);
            this.keyboards = [];
            this.j = -1;
            this.keyInfos = [];
            this.getCustomizeKeyboardLists();
            // this.getCustomizeKey();
          }, 1000);
          let eventInfo = {
            keyboard_del_position: "1",
          };
          this.$record("virturl_keyboard_list_del", eventInfo);
        })
        .catch((error) => {
          this.$loading.close();
          console.log("删除失败");
        });
    },
    createdKey() {
      this.goBack();
      this.created();
    },
    edit() {
      this.use();
      this.editFn();
    },
    use() {
      if (this.mykey) {
        this.goBack();
        this.exitKey();
        if (this.mytab == 1) {
          this.btnSelf(this.mykey, this.mykeyindex);
        } else {
          this.keySort(this.mykey, this.mykeyindex);
        }
      } else {
        this.$toast("请选择键盘");
      }
    },
    changeTab(index) {
      this.i = index;
      this.j = -1;
      this.editDelShow = false;
      this.keyboards = [];
      this.keyInfos = [];
      this.keyInfo = [];
      this.page = 1;
      this.finished = false;
      this.mykey = "";
      this.mykeyindex = "";
      if (index === 0) {
        this.mytab = 0;
        //  this.keyboards=this.keyLists;
        this.getOfficeKeyboardList();
      } else {
        this.mytab = 1;
        this.getCustomizeKeyboardLists();
        // this.getCustomizeKey();
      }
    },
    chooseKeyboards(index, item) {
      this.mykey = item;
      this.mykeyindex = index;
      this.editDelShow = true;
      this.j = index;
      this.choosedKeyId = item.key_id;
      this.getKeyboardInfo(this.j, item);
    },
    goBack() {
      // this.$router.replace({
      //     path: '/slidebar'
      // })
      this.$emit("goBack");
    },
    onLoad() {
      let nowTime = new Date().getTime();
      if (nowTime - this.time < 1000) {
        this.loading = false;
        return;
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.page++;
        if (this.i === 0) {
          this.getOfficeKeyboardList();
        } else {
          this.getCustomizeKeyboardLists();
        }
        // 加载状态结束
        this.loading = false;
      }, 1000);
    },
    async getOfficeKeyboardList(searchKey = "") {
      if (this.mytab == 1) {
        this.$toast('"我的"页面暂不支持搜索');
        this.getCustomizeKeyboardLists();
        return;
      }
      console.log(searchKey, "searchKey");
      this.time = new Date().getTime();
      let sendData = {
        page: this.page,
        keyboard_type: 1, // 1:普通 2：普通+手柄
        key_name: searchKey,
      };
      let res = await keyboard.getOfficeKeyboardList(sendData);
      if (res.success && res.status === 10000) {
        if(searchKey && this.page ==1 && res.data.length==0){
          this.$toast("未搜索到对应官方键盘");
          return
        }
        this.keyboards = this.keyboards.concat(res.data);
        // 数据全部加载完成
        if (this.page !== 1 && res.data.length === 0) {
          this.finished = true;
        }
      }
    },
    async getCustomizeKeyboardLists() {
      let params = {
        event: "keyboard",
        method: "myKeyboard",
        page: this.page,
      };
      let data = await this.getCustomizeBtnLists(params);
      console.log(data);
      if (data.success && data.status === 10000) {
        // let newData = data.data.reverse();
        this.keyboards = this.keyboards.concat(data.data);
        // this.keyboards.forEach(item=>{
        //   console.log(item.key_name.length)
        // })
        // 数据全部加载完成
        if (this.page !== 1 && data.data.length === 0) {
          this.finished = true;
        }
      }
    },
    getCustomizeKey() {
      this.keyboards = this.customizeBtnLists;
      console.log("键盘", this.keyboards);
    },
    searchKey() {
      this.keyboards = [];
      this.keyInfos=[];
      this.keyInfo=[];
      this.j = -1;
      this.page = 1;
      this.getOfficeKeyboardList(this.searchKeyName);
    },
    async getKeyboardInfo(index, item) {
      if (this.mytab == 1) {
        console.log("999");
        this.keyInfos = JSON.parse(this.keyboards[index].key_info);
        this.keyInfosWidth = JSON.parse(this.keyboards[index].width);
        this.keyInfoHeight = JSON.parse(this.keyboards[index].height);
      } else {
        let sendData = { key_id: item.key_id };
        let res = await this.getkeyInfo(sendData);
        this.keyInfo = res;
        console.log("键盘数据111", this.keyInfo);
      }
    },
    handlePX(px) {
      // console.log('屏幕信息',this.screen)
      let rate = "";
      rate = 1920 / 386;
      // console.log('比例',rate)
      return px / rate + "px";
    },
    handlemyPX(px) {
      let rate = "";
      rate = this.keyInfosWidth / 386;
      // console.log('比例',rate)
      return px / rate + "px";
    },
    handlemyTop(px) {
      let rate = "";
      rate = this.keyInfoHeight / 217;
      // console.log('比例',rate)
      return px / rate + "px";
    },
    delKeyboard() {
      console.log(this.choosedKeyId, "choosedKeyId");
      Dialog.confirm({
        title: "提示",
        message: "是否确认要删除该键位",
        confirmButtonText: "是",
        confirmButtonColor: "#3DA0FE",
        cancelButtonText: "否",
        cancelButtonColor: "#3DA0FE",
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  position: fixed;
  background-color: #1a2038;
  pointer-events: auto;
  width: 100%;
  height: 100%;

  .header {
    height: 100px;
    width: 100%;
    background-image: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_mine.png");
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    padding: 0 20px 0 20px;
    box-sizing: border-box;
    z-index: 1;

    .content {
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .back {
        display: flex;
        flex-direction: row;
        align-items: center;
        div {
          width: 28px;
          height: 24px;
          overflow: hidden;
          background: transparent
            url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
            0 0 no-repeat;
          background-size: 180px 182px;
          background-position: -4px -53px;
        }
        span {
          color: #fff;
          font-size: 14px;
        }
      }

      .activity {
        width: 440px;
        height: 64px;
        background: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/activity.png");
        background-size: cover;
      }

      .search {
        width: 270px;
        height: 36px;
        margin-top: 4px;
        background-color: #39405c;
        border-radius: 15px 32px 32px 15px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-left: auto;
        position: relative;

        span {
          display: inline-block;
          width: 24px;
          height: 22px;
          overflow: hidden;
          background: transparent
            url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
            0 0 no-repeat;
          background-size: 180px 182px;
          background-position: -4px -93px;
          margin: 0 10px;
        }

        input {
          height: 36px;
          line-height: 30px;
          font-size: 14px;
          border: none;
          background: transparent;
          color: #888c9d;
        }

        input::placeholder {
          color: #888c9d;
        }

        div {
          width: 80px;
          height: 38px;
          background: rgba(61, 160, 254, 1);
          opacity: 1;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0px;
          font-family: Source Han Sans CN;

          i {
            font-style: normal;
            font-size: 16px;
            color: #ffffff;
          }

          i:nth-child(1) {
            display: inline-block;
            width: 24px;
            height: 22px;
            line-height: 22px;
            overflow: hidden;
            background: transparent
              url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
              0 0 no-repeat;
            background-size: 180px 182px;
            background-position: -154px -100px;
            margin-right: 4px;
          }
        }
      }
    }
  }

  .main {
    position: absolute;
    top: 55px;
    padding: 0 23px;
    width: calc(100% - 46px);
    height: calc(100% - 55px);
    z-index: 99;
    overflow: hidden;

    .tab {
      font-size: 14px;
      color: #a3a5af;
      display: flex;
      flex-direction: row;
      align-items: center;

      p:nth-child(1) {
        margin-right: 50px;
      }

      p {
        position: relative;
        line-height: 30px;
        margin: 0;
      }

      p.active:after {
        content: "";
        display: block;
        width: 32px;
        height: 4px;
        background: rgba(61, 160, 254, 1);
        opacity: 1;
        border-radius: 4px;
        position: absolute;
        left: 50%;
        bottom: -2px;
        transform: translateX(-50%);
      }
    }

    .list {
      display: flex;
      flex-direction: row;
      margin-top: 20px;
      // padding-bottom: 20px;
      height: calc(100% - 60px);

      ::-webkit-scrollbar {
        // display: none;
        width: 4px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 1px;
        -webkit-box-shadow: inset 0 0 5px #304bb5;
        background: #304bb5;
      }

      .keyboard_wrap {
        height: 100%;
        overflow-y: scroll;
        width: calc(100% - 386px);
        text-align: left;
        padding: 0 2%;
        position: relative;

        .keyboard_item {
          display: block;
          font-size: 14px;
          color: #fff;
          width: 90%;
          height: 30px;
          background: rgba(46, 63, 107, 1);
          opacity: 1;
          border-radius: 4px;
          line-height: 30px;
          margin-bottom: 10px;
          padding: 0 24px 0 40px;
          box-sizing: border-box;
          position: relative;
          margin-right: 3%;
        }

        .keyboard_item:before {
          content: "";
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 8px;
          border: 1px solid rgba(247, 203, 70, 1);
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
        }

        .keyboard_item:nth-child(2n) {
          /*margin-left: 4%;*/
        }

        .noactive p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          text-align: left;
          // animation: 15s wordsLoop linear infinite normal;
        }
        .active {
          background: linear-gradient(
            270deg,
            rgba(50, 78, 185, 1) 0%,
            rgba(28, 52, 143, 1) 100%
          );
          box-shadow: 0 0 5px 3px rgba(31, 62, 184, 0.8);
          opacity: 1;
          width: 92%;
          border-radius: 4px;
          left: -1%;

          p {
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
          }
        }

        .active:before {
          background: rgba(247, 203, 70, 1);
        }

        .van-list__finished-text {
          width: 100%;
        }
      }

      .right {
        width: 386px;
        margin-left: 30px;
        height: 100%;
        position: relative;

        .bg_key {
          position: relative;
          height: 217px;
          .bg_img {
            width: 386px;
            height: 217px;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            border-radius: 4px;
          }
          .btn_wrap {
            width: 386px;
            height: 217px;
            font-size: 6px;
            position: relative;
            left: 0;
            top: 0;
            transform-origin: 0 0;
            li {
              color: #00fad4;
              font-size: 6px;
            }
          }
        }

        .btn_setting {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          font-size: 16px;
          height: 32px;
          color: #fff;
          position: absolute;
          bottom: 5px;
          right: 0;
          p {
            margin: 0;
          }

          p:nth-child(1) {
            width: 100px;
            height: 32px;
            background: linear-gradient(
              90deg,
              rgba(249, 92, 127, 1) 0%,
              rgba(114, 127, 243, 1) 100%,
              rgba(113, 128, 245, 1) 100%
            );
            opacity: 1;
            border-radius: 4px;
            color: #fff;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 8px;

            span:nth-child(1) {
              width: 22px;
              height: 28px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
                0 0 no-repeat;
              background-size: 180px 182px;
              background-position: -149px -66px;
              margin-right: 6px;
            }
          }

          p:nth-child(2) {
            width: 100px;
            height: 30px;
            border: 1px solid rgba(61, 160, 254, 1);
            opacity: 1;
            border-radius: 4px;
            color: #3da0fe;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            span:nth-child(1) {
              width: 30px;
              height: 25px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
                0 0 no-repeat;
              background-size: 180px 182px;
              background-position: -1px -156px;
              margin-right: 16px;
            }
          }
        }

        .btn_mine {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          font-size: 14px;
          height: 32px;
          color: #fff;
          position: absolute;
          bottom: 5px;
          right: 0;

          p {
            width: 76px;
            height: 30px;
            color: #3da0fe;
            opacity: 1;
            border-radius: 4px;
            display: flex;
            align-items: center;
            margin: 0;
            justify-content: center;

            span:nth-child(1) {
              display: inline-block;
              overflow: hidden;
            }
          }

          p:nth-child(1) {
            margin-right: 6px;
            border: 1px solid rgba(61, 160, 254, 1);

            span:nth-child(1) {
              width: 20px;
              height: 30px;
              background: url("../../../assets/img/icon/icon_delete.png")
                no-repeat;

              background-size: 20px;
              background-position-y: 5px;
              margin-right: 6px;
            }
          }

          p:nth-child(2) {
            margin-right: 16px;
            border: 1px solid rgba(61, 160, 254, 1);
            span:nth-child(1) {
              width: 20px;
              height: 30px;
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADDElEQVRYR81XO2gUURQ9ZyaaIhGidQTtAioKRtBkgylil2BABS00syCoKBiIYlorFRstRAXN7vrBgAED2sVCySQKUbBQ0EoLCwuLgCnUzMyRt584u87uTLILccp595177n33S6zyxyT6d2TU1mphCNJBkQ9mhng76l4qqxFAgyAnFgLk3qU5H4cfSyCV0wVKowDaimALsNg/fYwvw+A997QXgZ4BaC3+nxd52R3ilVok4glk9ZjQwQoQT9CEaL0w/6mgl6CRaQrLCZxwHR6qi0BPVhlATpwro8+ZnXaYrotAKhtMEehbCQEBz13H2rdiAqmsdhJ6XenaZZDxBO52Hb6tdqdqDKTuazt9TQLYtAyFUaJfArB/xuGHqMMlAibaIXUS/CpoK4HeOiyv1OWZ5yD4UVA7yDel7MgTMHm+jvocSrU6jY69Pv9D3GzqRJ5AKqezlK7FXmuggMhhd4jXCwSywTSB1ArwvxefqVSkEkMIcF3H6skT6B7zz1gWL4WqWAwQxz39vvgq3fwxb0BmsRe0rxLoTMhgIZDOz6TtW3+DMLPYS9pT8YHH8WmHRyoVbbmh1vUtmiPQEUPCk/x9bnpNoYqGhVNZ/xHBwzUAvJ/ixrk0v0XJ7Bnz+pss62ktAoLGXcdeMqCMQHfGP2mRN6sBCHjvOta2aufGCxta9KMWgUA6ZVxfkiknkNMJS1o6rARqCAHyZLidN/QJunLabytfPat+VZ+g2M+fxwVhJUBJ03KCEBb7SvNEsQ7oNKHLSdNQwKRsjs4c5SdDwJBXoGsEdiROQ/KceYp6C5EZucwQUpqCEuoHygrRqpfiVW9GhX6gkWIp/SaoozgFlc14if37r2CoHaMdRHk7jgLuuvNrq920xlS1ugcS31scmD3e/D5KT82puPvu707Lbpqrx3Jf3q7Z9Np31TASjOWrOJTmc/w/GMufEBiscGFhMRHy2xGJvVUWk3E3onWHseKfIGI1k/yBUj8vgZmhhLRN0DZ2NTMKypZT6WG4nYat6c74wyQPNHQ5rSMDEl39Aw7rbDAUeTZIAAAAAElFTkSuQmCC)
                no-repeat;
              background-size: 20px;
              background-position-y: 5px;
              margin-right: 6px;
            }
          }
          p:nth-child(3) {
            width: 102px;
            height: 32px;
            background: linear-gradient(
              90deg,
              rgba(249, 92, 127, 1) 0%,
              rgba(114, 127, 243, 1) 100%,
              rgba(113, 128, 245, 1) 100%
            );
            opacity: 1;
            border-radius: 4px;
            color: #fff;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 6px;

            span:nth-child(1) {
              width: 22px;
              height: 28px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
                0 0 no-repeat;
              background-size: 180px 182px;
              background-position: -149px -66px;
              margin-right: 6px;
            }
          }

          p:nth-child(4) {
            width: 102px;
            height: 30px;
            border: 1px solid rgba(61, 160, 254, 1);
            opacity: 1;
            border-radius: 4px;
            color: #3da0fe;
            display: flex;
            background: none;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            span:nth-child(1) {
              width: 30px;
              height: 25px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
                0 0 no-repeat;
              background-size: 180px 182px;
              background-position: -1px -156px;
              margin-right: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
