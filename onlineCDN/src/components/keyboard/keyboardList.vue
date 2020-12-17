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
          :style="ipadKeyboardWrapStyle"
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
        <div class="right" :style="ipadRightStyle">
          <div class="bg_key">
            <div
              class="bg_img"
              :style="ipadBgStyle"
            ></div>
            <ul v-if="mytab==1" class="btn_wrap" :style="ipadBtnWrapStyle">
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
                    :src="keyboardListPics[0]"
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
                    :src="keyboardListPics[1]"
                    :width="handlemyPX(item.keyWidth)"
                  />
                  <div
                    :style="`width: ${handlemyPX(item.keyWidth)};height:${handlemyPX(item.keyHeight)};position:absolute;
                top:0;left:0;`"
                  >
                    <img
                      :style="`position:absolute;left:${handlemyPX(item.keyWidth/4)};top: ${handlemyPX(item.keyHeight/4)}`"
                      :width="handlemyPX(item.keyWidth/2)"
                      :src="keyboardListPics[2]"
                    />
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="mytab!=1" class="btn_wrap" :style="ipadBtnWrapStyle">
              <li v-for="(item, index) in keyInfo" :key="index">
                <div
                  v-if="item.keyStyle == '0' && !['LB', 'LT', 'RB', 'RT', 'SELECT', 'START'].includes(item.keyRealName.toLocaleUpperCase())"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  ${handlePX(item.keyWidth/2)};background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >{{item.keyRealName}}</div>
                <!-- 游戏手柄  LB、LT、RB、RT、SELECT、START按键特殊处理 -->
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'LB'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  2px ${handlePX(item.keyWidth/2)} ${handlePX(item.keyWidth/2)} 2px;transform: rotate(20deg);background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >{{item.keyRealName}}</div>
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'RB'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  ${handlePX(item.keyWidth/2)} 2px 2px ${handlePX(item.keyWidth/2)};transform: rotate(-20deg);background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >{{item.keyRealName}}</div>
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'LT'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  ${handlePX(item.keyWidth/2)} 2px 2px ${handlePX(item.keyWidth/2)};transform: rotate(20deg);background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >{{item.keyRealName}}</div>
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'RT'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius:  2px ${handlePX(item.keyWidth/2)} ${handlePX(item.keyWidth/2)} 2px;transform: rotate(-20deg);background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >{{item.keyRealName}}</div>
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'SELECT'"
                  :style="`width: ${handlePX(item.keyWidth-25)};height:${handlePX(item.keyWidth-25)};border-radius: ${handlePX((item.keyWidth-25)/2)};background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyWidth-25)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >
                <img :src="keyboardListPics[11]" :width="handlePX(item.keyWidth/3.5)" style="position: absolute;left: 50%;top: 50%; transform: translate(-50%, -50%);" />
                </div>
                <div
                  v-if="item.keyStyle == '0' && item.keyRealName.toLocaleUpperCase() == 'START'"
                  :style="`width: ${handlePX(item.keyWidth-25)};height:${handlePX(item.keyWidth-25)};border-radius: ${handlePX((item.keyWidth-25)/2)};background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyWidth-25)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)};
                            `"
                >
                <img :src="keyboardListPics[12]" :width="handlePX(item.keyWidth/3.5)" style="position: absolute;left: 50%;top: 50%; transform: translate(-50%, -50%);" />
                </div>
                <!-- 游戏手柄  LB、LT、RB、RT、SELECT、START按键特殊处理 -->

                <div
                  v-if="[103].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)}
                            `"
                >
                  <img
                    id="wheelImage"
                    :src="keyboardListPics[3]"
                    :width="handlePX(item.keyWidth)"
                  />
                </div>
                <div
                  v-if="[104].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)}
                            `"
                >
                  <img
                    id="wheelImage"
                    :src="keyboardListPics[4]"
                    :width="handlePX(item.keyWidth)"
                  />
                </div>
                <div
                  v-if="[101,102].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)}`"
                >
                  <img
                    id="wheelImage"
                    :src="keyboardListPics[5]"
                    :width="handlePX(item.keyWidth)"
                  />
                  <div
                    :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};position:absolute;
                top:0;left:0;`"
                  >
                    <img
                      :style="`position:absolute;left:${handlePX(item.keyWidth/4)};top: ${handlePX(item.keyHeight/4)}`"
                      :width="handlePX(item.keyWidth/2)"
                      :src="keyboardListPics[6]"
                    />
                  </div>
                </div>
                <!-- 游戏手柄摇杆特殊处理 -->

                <div
                  :style="`position: absolute;width: ${handlePX(item.keyWidth)};height: ${handlePX(item.keyWidth)};left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)}`"
                  v-if="[105].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                >
                  <div
                    :style="`position:absolute;width: ${handlePX(303 / item.keyWidth * item.realKeyWidth)};height: ${handlePX(150 / item.keyWidth * item.realKeyWidth)};left: 50%;top: 0;transform: translateX(-50%);`"
                  >
                    <img :src="keyboardListPics[9]" style="width: auto;height:auto;max-width: 100%;max-height: 100%;" />
                  </div>
                  <div
                    :style="`position:absolute;width: ${handlePX(150 / item.keyWidth * item.realKeyWidth)};height: ${handlePX(303 / item.keyWidth * item.realKeyWidth)};top: 50%;right: 0;transform: translateY(-50%);`"
                  >
                    <img :src="keyboardListPics[10]" style="width: auto;height:auto;max-width: 100%;max-height: 100%;" />
                  </div>
                  <div
                    :style="`position:absolute;width: ${handlePX(303 / item.keyWidth * item.realKeyWidth)};height: ${handlePX(150 / item.keyWidth * item.realKeyWidth)};left: 50%;bottom: 0;transform: translateX(-50%);`"
                  >
                    <img :src="keyboardListPics[9]" style="width: auto;height:auto;max-width: 100%;max-height: 100%;transform: rotate(180deg);" />
                  </div>
                  <div
                    :style="`position:absolute;width: ${handlePX(150 / item.keyWidth * item.realKeyWidth)};height: ${handlePX(303 / item.keyWidth * item.realKeyWidth)};top: 50%;left: 0;transform: translateY(-50%);`"
                  >
                    <img :src="keyboardListPics[10]" style="width: auto;height:auto;max-width: 100%;max-height: 100%;transform: rotate(180deg);" />
                  </div>
                  <div
                    :style="`width: ${handlePX(item.realKeyWidth)};height:${handlePX(item.realKeyWidth)};border-radius: 50%;background-color:#1C263E;text-align:center;
                              line-height:${handlePX(item.realKeyWidth)};position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);`"
                  >
                    <img
                      id="wheelImage"
                      :src="keyboardListPics[5]"
                      :width="handlePX(item.realKeyWidth)"
                    />
                    <div
                      :style="`width: ${handlePX(item.realKeyWidth)};height:${handlePX(item.realKeyWidth)};position:absolute;
                  top:0;left:0;`"
                    >
                      <img
                        :style="`position:absolute;left:${handlePX(item.realKeyWidth/4)};top: ${handlePX(item.realKeyWidth/4)}`"
                        :width="handlePX(item.realKeyWidth/2)"
                        :src="keyboardListPics[7]"
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-if="[106].includes(Number(item.rockerType)) && item.keyStyle == '1'"
                  :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};border-radius: 50%;background-color:#1C263E;text-align:center;
                            line-height:${handlePX(item.keyHeight)};position:absolute;left:${handlePX(item.keyMarginLeft)};top: ${handlePX(item.keyMarginTop, true)}`"
                >
                  <img
                    id="wheelImage"
                    :src="keyboardListPics[5]"
                    :width="handlePX(item.keyWidth)"
                  />
                  <div
                    :style="`width: ${handlePX(item.keyWidth)};height:${handlePX(item.keyHeight)};position:absolute;
                top:0;left:0;`"
                  >
                    <img
                      :style="`position:absolute;left:${handlePX(item.keyWidth/4)};top: ${handlePX(item.keyHeight/4)}`"
                      :width="handlePX(item.keyWidth/2)"
                      :src="keyboardListPics[8]"
                    />
                  </div>
                </div>
                <!-- 游戏手柄摇杆特殊处理 -->
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
    <div class="tips" v-show="tipsShow">{{tips}}</div>
  </div>
</template>

<script>
import keyboard from "../../api/keyboard";
import tools from "../../utils/tools";
import { mapGetters, mapMutations, mapActions } from "vuex";
import course from "@c/course/index";

export default {
  name: "keyboardList",
  components: {
    "course-item": course,
  },
  props: ["firstLoad", "keyboardListShow"],
  data() {
    return {
      keyboardListPics: [
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/roller/摇杆底_非焦点.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/roller/摇杆_方向.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/direction/middle.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/directionkey/middle.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/roller/摇杆底_非焦点.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/roller/摇杆_方向.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E6%91%87%E6%9D%86_LS.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E6%91%87%E6%9D%86_RS.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%8D%81%E5%AD%97%E5%88%87%E5%9B%BE.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%8D%81%E5%AD%97%E5%88%87%E5%9B%BE%E5%8F%B3.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%2011.png',
        'https://vcsstore.oss-cn-hangzhou.aliyuncs.com/image/floatBall/gamepad/%E5%9C%86%E8%A7%92%E7%9F%A9%E5%BD%A2%2012.png'
      ],
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
      ipadKeyboardWrapStyle: {},
      ipadRightStyle: {},
      ipadBgStyle: { 'background-image': 'url(' + 'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_button.png' + ')',backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',backgroundPosition:'center center',backgroundSize: 'cover'},
      ipadBtnWrapStyle: {},
      tipsShow:false,
      tips: ''
    };
  },
  computed: {
    ...mapGetters(["customizeBtnLists", "fullScreenShow"]),
  },
  inject: ["created", "editFn", "btnSelf", "keySort",'exitKey'],
  mounted() {
      if (this.fullScreenShow) {
        if (tools.isPad()) {
          let screenInfo = tools.getScreenInfo()
          const { totalWidth } = screenInfo
          this.ipadKeyboardWrapStyle = {'width': 'calc(' + (totalWidth - 500) + 'px)'}
          this.ipadRightStyle = {'width': '500px'}
          this.ipadBgStyle = { 'background-image': 'url(' + 'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_button.png' + ')',backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',backgroundPosition:'center center',backgroundSize: 'cover', width: '500px'}
          this.ipadBtnWrapStyle = {'width': '500px'}
        }
      } else {
        if (tools.isPad()) {
          let screenInfo = tools.getScreenInfo()
          const { totalWidth } = screenInfo
          this.ipadKeyboardWrapStyle = {'width': 'calc(' + (totalWidth - 500) + 'px)'}
          this.ipadRightStyle = {'width': '500px'}
          this.ipadBgStyle = { 'background-image': 'url(' + 'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_button.png' + ')',backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',backgroundPosition:'center center',backgroundSize: 'cover', width: '500px', 'height': '250px'}
          this.ipadBtnWrapStyle = {'width': '500px', 'height': '250px'}
        }
      }
    // if (this.firstClick) {
    //   this.firstClick = false;
    //   this.getCustomizeKeyboardLists();
    // }
    // this.keyboards=this.keyLists;
    this.getOfficeKeyboardList();
    // this.getCustomizeKeyboardLists()
    // let screen = JSON.parse(localStorage.getItem("screenInfomation"));
    // console.log(screen, 'screen')
    // this.full.width = screen.videosWidth + "px";
    // this.full.height = screen.videosHeight + "px";
    // this.scale.width = screen.videosWidth + 1 + "px";
    // this.scale.height = screen.videosHeight + "px";
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
  watch: {
    keyboardListShow() {
      if (this.keyboardListShow) {
        let screen = JSON.parse(localStorage.getItem("screenInfomation"));
        this.full.width = screen.videosWidth + "px";
        this.full.height = screen.videosHeight + "px";
        this.scale.width = screen.videosWidth + 1 + "px";
        this.scale.height = screen.videosHeight + "px";
      }
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
          // this.$toast("已取消");
          this.handleTips("已取消")
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
      keyboard
        .preserveKeyboardDel(params)
        .then((res) => {
          this.$loading.close();
          setTimeout(() => {
            this.$toast(res.msg);
            this.keyboards = [];
            this.j = -1;
            this.keyInfos = [];
            this.page = 1
            this.finished = false
            this.getCustomizeKeyboardLists();
            // this.getCustomizeKey();
          }, 1000);
          let eventInfo = {
            keyboard_del_position: "1",
          };
          this.$emit('sendDataBuriedPoint', 'virturl_keyboard_list_del', eventInfo)
        })
        .catch((error) => {
          this.$loading.close();
          console.log("删除失败");
        });
    },
    createdKey() {
      this.goBack();
      this.created();
      this.$emit('changeIndex', false)
    },
    edit() {
      this.$emit('changeIndex', false)
      this.use();
      setTimeout(() => {
        this.editFn();
      })
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
        this.$emit('changeIndex', false)
      } else {
        // this.$toast("请选择键盘");
        this.handleTips("请选择键盘")
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
      this.searchKeyName = ''
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
      this.$emit('changeIndex', false)
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
          this.getOfficeKeyboardList(this.searchKeyName);
        } else {
          this.getCustomizeKeyboardLists();
        }
        // 加载状态结束
        this.loading = false;
      }, 1000);
    },
    async getOfficeKeyboardList(searchKey = "") {
      if (this.mytab == 1) {
        // this.$toast('"我的"页面暂不支持搜索');
        // this.handleTips('"我的"页面暂不支持搜索')
        this.getCustomizeKeyboardLists();
        return;
      }
      this.time = new Date().getTime();
      let sendData = {
        page: this.page,
        keyboard_type: 2, // 1:普通 2：普通+手柄
        key_name: searchKey,
      };
      let res = await keyboard.getOfficeKeyboardList(sendData);
      if (res.success && res.status === 10000) {
        if(searchKey && this.page ==1 && res.data.length==0){
          // this.$toast("未搜索到对应官方键盘");
          this.handleTips("未搜索到对应官方键盘")
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
      if (this.mytab === 1) {
        this.handleTips('"我的"页面暂不支持搜索')
        return
      }
      this.keyboards = [];
      this.keyInfos=[];
      this.keyInfo=[];
      this.j = -1;
      this.page = 1;
      this.getOfficeKeyboardList(this.searchKeyName);
    },
    async getKeyboardInfo(index, item) {
      if (this.mytab == 1) {
        this.keyInfos = JSON.parse(this.keyboards[index].key_info);
        this.keyInfosWidth = JSON.parse(this.keyboards[index].width);
        this.keyInfoHeight = JSON.parse(this.keyboards[index].height);
      } else {
        let sendData = { key_id: item.key_id };
        let res = await this.getkeyInfo(sendData);
        this.keyInfo = (res || []).map(item => {
          if ([105].includes(Number(item.rockerType)) && item.keyStyle == '1') {
            item.realKeyWidth = item.keyWidth - 200
          }
          return {
            ...item,
          }
        });
      }
    },
    handlePX(px, status = false) {
      // console.log('屏幕信息',this.screen)
      let rate = "";
      if (tools.isPad()) {
        rate = 1920 / (status ? (this.fullScreenShow ? 780 : 450) : 500);
      } else {
        rate = 1920 / 386;
      }
      return px / rate + "px";
    },
    handlemyPX(px) {
      let rate = "";
      if (tools.isPad()) {
        rate = this.keyInfosWidth / 500
      } else {
        rate = this.keyInfosWidth / 386
      }
      return px / rate  + "px";
    },
    handlemyTop(px) {
      let rate = "";
      if (tools.isPad()) {
        rate = this.keyInfoHeight / (this.fullScreenShow ? 400 : 217);
      } else {
        rate = this.keyInfoHeight / 217;
      }
      return px / rate + "px";
    },
    handleTips(tip){
      this.tips = tip
      this.tipsShow = true
      setTimeout(() => {
        this.tipsShow = false
      }, 1500)
    }
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
    height: 166.7px;
    width: 100%;
    background-image: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_mine.png");
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    padding: 0 33.3px 0 33.3px;
    box-sizing: border-box;
    z-index: 1;

    .content {
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .back {
        display: flex;
        flex-direction: row;
        align-items: center;
        div {
          width: 46.7px;
          height: 40px;
          overflow: hidden;
          background: transparent
            url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
            0 0 no-repeat;
          background-size: 300px 303.3px;
          background-position: -6.7px -88.3px;
        }
        span {
          color: #fff;
          font-size: 23.3px;
        }
      }

      .activity {
        width: 733.3px;
        height: 106.7px;
        background: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/activity.png");
        background-size: cover;
      }

      .search {
        width: 450px;
        height: 60px;
        margin-top: 6.7px;
        background-color: #39405c;
        border-radius: 25px 53.3px 53.3px 25px;
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
          width: 40px;
          height: 36.7px;
          overflow: hidden;
          background: transparent
            url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
            0 0 no-repeat;
          background-size: 300px 303.3px;
          background-position: -6.7px -155px;
          margin: 0 16.7px;
        }

        input {
          height: 60px;
          line-height: 50px;
          font-size: 23.3px;
          border: none;
          background: transparent;
          color: #888c9d;
        }

        input::placeholder {
          color: #888c9d;
        }

        div {
          width: 133.3px;
          height: 63.3px;
          background: rgba(61, 160, 254, 1);
          opacity: 1;
          border-radius: 53.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0px;
          font-family: Source Han Sans CN;

          i {
            font-style: normal;
            font-size: 26.7px;
            color: #ffffff;
          }

          i:nth-child(1) {
            display: inline-block;
            width: 40px;
            height: 36.7px;
            line-height: 36.7px;
            overflow: hidden;
            background: transparent
              url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
              0 0 no-repeat;
            background-size: 300px 303.3px;
            background-position: -256.7px -166.7px;
            margin-right: 6.7px;
          }
        }
      }
    }
  }

  .main {
    position: absolute;
    top: 91.7px;
    padding: 0 38.3px;
    width: calc(100% - 76.7px);
    height: calc(100% - 91.7px);
    z-index: 99;
    overflow: hidden;

    .tab {
      font-size: 23.3px;
      color: #a3a5af;
      display: flex;
      flex-direction: row;
      align-items: center;

      p:nth-child(1) {
        margin-right: 83.3px;
      }

      p {
        position: relative;
        line-height: 50px;
        margin: 0;
      }

      p.active:after {
        content: "";
        display: block;
        width: 53.3px;
        height: 6.7px;
        background: rgba(61, 160, 254, 1);
        opacity: 1;
        border-radius: 6.7px;
        position: absolute;
        left: 50%;
        bottom: -3.3px;
        transform: translateX(-50%);
      }
    }

    .list {
      display: flex;
      flex-direction: row;
      margin-top: 33.3px;
      // padding-bottom: 20px;
      height: calc(100% - 100px);

      ::-webkit-scrollbar {
        // display: none;
        width: 6.7px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 1.7px;
        -webkit-box-shadow: inset 0 0 8.3px #304bb5;
        background: #304bb5;
      }

      .keyboard_wrap {
        height: 100%;
        overflow-y: scroll;
        width: calc(100% - 643.3px);
        text-align: left;
        padding: 0 2%;
        position: relative;

        .keyboard_item {
          display: block;
          font-size: 23.3px;
          color: #fff;
          width: 90%;
          height: 50px;
          background: rgba(46, 63, 107, 1);
          opacity: 1;
          border-radius: 6.7px;
          line-height: 50px;
          margin-bottom: 16.7px;
          padding: 0 40px 0 66.7px;
          box-sizing: border-box;
          position: relative;
          margin-right: 3%;
        }

        .keyboard_item:before {
          content: "";
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 13.3px;
          border: 1.7px solid rgba(247, 203, 70, 1);
          position: absolute;
          top: 50%;
          left: 25px;
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
          border-radius: 6.7px;
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
        width: 643.3px;
        margin-left: 50px;
        height: 100%;
        position: relative;

        .bg_key {
          position: relative;
          height: 361.7px;
          .bg_img {
            width: 643.3px;
            height: 361.7px;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            border-radius: 6.7px;
          }
          .btn_wrap {
            width: 643.3px;
            height: 361.7px;
            font-size: 10px;
            position: relative;
            left: 0;
            top: 0;
            transform-origin: 0 0;
            li {
              color: #00fad4;
              font-size: 10px;
            }
          }
        }

        .btn_setting {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          font-size: 23.3px;
          height: 53.3px;
          color: #fff;
          position: absolute;
          bottom: 8.3px;
          right: 0;
          p {
            margin: 0;
          }

          p:nth-child(1) {
            width: 170px;
            height: 53.3px;
            background: linear-gradient(
              90deg,
              rgba(249, 92, 127, 1) 0%,
              rgba(114, 127, 243, 1) 100%,
              rgba(113, 128, 245, 1) 100%
            );
            opacity: 1;
            border-radius: 6.7px;
            color: #fff;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 10px;

            span:nth-child(1) {
              width: 36.7px;
              height: 46.7px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
                0 0 no-repeat;
              background-size: 300px 303.3px;
              background-position: -248.3px -110px;
              margin-right: 10px;
            }
          }

          p:nth-child(2) {
            width: 170px;
            height: 50px;
            border: 1.7px solid rgba(61, 160, 254, 1);
            opacity: 1;
            border-radius: 6.7px;
            color: #3da0fe;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            span:nth-child(1) {
              width: 50px;
              height: 41.7px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
                0 0 no-repeat;
              background-size: 300px 303.3px;
              background-position: -1.7px -260px;
              margin-right: 10px;
            }
          }
        }

        .btn_mine {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          font-size: 23.3px;
          height: 53.3px;
          color: #fff;
          position: absolute;
          bottom: 8.3px;
          right: 0;

          p {
            width: 126.7px;
            height: 50px;
            color: #3da0fe;
            opacity: 1;
            border-radius: 6.7px;
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
            margin-right: 10px;
            border: 1.7px solid rgba(61, 160, 254, 1);

            span:nth-child(1) {
              width: 33.3px;
              height: 50px;
              background: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/icon/icon_delete.png")
                no-repeat;

              background-size: 33.3px;
              background-position-y: 8.3px;
              margin-right: 10px;
            }
          }

          p:nth-child(2) {
            margin-right: 10px;
            border: 1.7px solid rgba(61, 160, 254, 1);
            span:nth-child(1) {
              width: 33.3px;
              height: 50px;
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADDElEQVRYR81XO2gUURQ9ZyaaIhGidQTtAioKRtBkgylil2BABS00syCoKBiIYlorFRstRAXN7vrBgAED2sVCySQKUbBQ0EoLCwuLgCnUzMyRt584u87uTLILccp595177n33S6zyxyT6d2TU1mphCNJBkQ9mhng76l4qqxFAgyAnFgLk3qU5H4cfSyCV0wVKowDaimALsNg/fYwvw+A997QXgZ4BaC3+nxd52R3ilVok4glk9ZjQwQoQT9CEaL0w/6mgl6CRaQrLCZxwHR6qi0BPVhlATpwro8+ZnXaYrotAKhtMEehbCQEBz13H2rdiAqmsdhJ6XenaZZDxBO52Hb6tdqdqDKTuazt9TQLYtAyFUaJfArB/xuGHqMMlAibaIXUS/CpoK4HeOiyv1OWZ5yD4UVA7yDel7MgTMHm+jvocSrU6jY69Pv9D3GzqRJ5AKqezlK7FXmuggMhhd4jXCwSywTSB1ArwvxefqVSkEkMIcF3H6skT6B7zz1gWL4WqWAwQxz39vvgq3fwxb0BmsRe0rxLoTMhgIZDOz6TtW3+DMLPYS9pT8YHH8WmHRyoVbbmh1vUtmiPQEUPCk/x9bnpNoYqGhVNZ/xHBwzUAvJ/ixrk0v0XJ7Bnz+pss62ktAoLGXcdeMqCMQHfGP2mRN6sBCHjvOta2aufGCxta9KMWgUA6ZVxfkiknkNMJS1o6rARqCAHyZLidN/QJunLabytfPat+VZ+g2M+fxwVhJUBJ03KCEBb7SvNEsQ7oNKHLSdNQwKRsjs4c5SdDwJBXoGsEdiROQ/KceYp6C5EZucwQUpqCEuoHygrRqpfiVW9GhX6gkWIp/SaoozgFlc14if37r2CoHaMdRHk7jgLuuvNrq920xlS1ugcS31scmD3e/D5KT82puPvu707Lbpqrx3Jf3q7Z9Np31TASjOWrOJTmc/w/GMufEBiscGFhMRHy2xGJvVUWk3E3onWHseKfIGI1k/yBUj8vgZmhhLRN0DZ2NTMKypZT6WG4nYat6c74wyQPNHQ5rSMDEl39Aw7rbDAUeTZIAAAAAElFTkSuQmCC)
                no-repeat;
              background-size: 33.3px;
              background-position-y: 8.3px;
              margin-right: 10px;
            }
          }
          p:nth-child(3) {
            width: 170px;
            height: 53.3px;
            background: linear-gradient(
              90deg,
              rgba(249, 92, 127, 1) 0%,
              rgba(114, 127, 243, 1) 100%,
              rgba(113, 128, 245, 1) 100%
            );
            opacity: 1;
            border-radius: 6.7px;
            color: #fff;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-right: 10px;

            span:nth-child(1) {
              width: 36.7px;
              height: 46.7px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
                0 0 no-repeat;
              background-size: 300px 303.3px;
              background-position: -248.3px -110px;
              margin-right: 10px;
            }
          }

          p:nth-child(4) {
            width: 170px;
            height: 50px;
            border: 1.7px solid rgba(61, 160, 254, 1);
            opacity: 1;
            border-radius: 6.7px;
            color: #3da0fe;
            display: flex;
            background: none;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            span:nth-child(1) {
              width: 50px;
              height: 41.7px;
              display: inline-block;
              overflow: hidden;
              background: transparent
                url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
                0 0 no-repeat;
              background-size: 300px 303.3px;
              background-position: -1.7px -260px;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }

  .tips{
    padding:12px;
    color:#fff;
    font-size:20px;
    border-radius: 6px;
    background-color: rgba(0,0,0,0.7);
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    z-index:9999;
  }
}
</style>
