<template>
  <div class="slide" v-show="isSidwbar">
    <div class="bars_wrap" v-show="slidebarShow">
      <div id="silder" class="content">
        <div class="contentBox">
          <div class="top">
            <p @click="showText">
              <i></i>
              <span>文字键盘</span>
            </p>
            <p  @click="goKeyboardList">
              <i :class="officalFist && firstLoad ? 'arrow_boxo':''" ></i>
              <span :class="officalFist && firstLoad ? 'arrow_box':''">游戏键盘</span>
            </p>
            <p></p>
          </div>
          <div class="bars_absolute">
            <ul class="ul">
              <li
                v-for="(bar, index) in bars"
                :key="index"
                :class="i == index ? 'bar_active' : 'bar'"
              >
                <p @click="clickBar(index)">
                  <i class="icon" :class="'bar_icon_'+ (index + 1)"></i>
                  <span>{{bar.name}}</span>
                </p>
                <p @click="helphide" class="tips" v-show="isHelp">
                  <span>{{bar.tip}}</span>
                </p>
                <div class="point_speed" v-show="index === 2 && i === 2">
                  <span>慢</span>
                  <van-slider
                    v-model="value"
                    @change="onChange"
                    inactive-color="#9580A7"
                    active-color="#fff"
                    button-size="14"
                    @drag-start="dragStart"
                    @drag-end="dragEnd"
                    max="2.0"
                    min="0.5"
                    step="0.1"
                  >
                    <template #button>
                      <div
                        class="custom-button"
                        :class="isDraging ? 'custom-button-focused' : isTouch ? 'custom-button-draging' : ''"
                        @touchstart="touchButton"
                      >
                        <span></span>
                      </div>
                    </template>
                  </van-slider>
                  <span>快</span>
                </div>
                <div class="mouse" v-show="index === 3 && i === 3">
                  <div>
                    <p class="p_item" @click="chooseMouseType(1)">
                      <i></i>
                      <span>指针</span>
                    </p>
                    <p class="p_item" @click="chooseMouseType(2)">
                      <i></i>
                      <span>触控</span>
                    </p>
                  </div>
                </div>
                <div class="full" v-show="index === 5 && i === 5">
                  <div>
                    <p class="p_item" @click="chooseFull(true)">
                      <i></i>
                      <span>开</span>
                    </p>
                    <p class="p_item" @click="chooseFull(false)">
                      <i></i>
                      <span>关</span>
                    </p>
                    <p
                      class="active"
                      :class="fullScreenShow? 'left': 'right'"
                      :style="fullScreenShow? 'left:0px': 'left:80px'"
                    ></p>
                  </div>
                </div>
              </li>
            </ul>
            <div class="help"  @click="help">
              <p class="help_icon" :class="[isHelp ? 'helping' : 'nohelping',helpFist && firstLoad ? 'arrow_boxb':'']"></p>
              <p :class="[isHelp ? 'help_text_active' : 'help_text',helpFist && firstLoad ? 'arrow_box':'']">帮助</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :style="{left:online.left+'px',top:online.top+'px'}"
      class="online_time"
      v-show="slidebarShow"
    >
      <div class="title">
        <p>在线时长</p>
        <p v-if="[2, 3, 3.1].includes(initMsg.flag)" @click="goCharge">前往充值</p>
      </div>
      <div>{{onlineTime}}</div>
      <div>
        <p v-if="[2, 3, 3.1].includes(initMsg.flag)">
          <span>本次消费 {{useCount}}网币</span>
          <span>剩余 {{sumCount}}网币</span>
        </p>
        <p v-else>
          <span>本次消费 {{useCount}}云豆</span>
          <span>剩余 {{sumCount}}云豆</span>
        </p>
        <p v-if="!([2, 3, 3.1].includes(initMsg.flag))" @click="goCharge">前往充值</p>
      </div>
    </div>
    <keyboardList
      :firstLoad='firstLoad'
      v-if="keyboardListShow"
      @goBack="goBack"
      @createClick="createClick"
      @sendDataBuriedPoint="sendDataBuriedPoint"
    />
  </div>
</template>

<script>
import keyboard from "../../api/keyboard";
import keyboardList from "../keyboard/keyboardList";
import util from "../../common/libs/util.crypto";
import tools from "@/utils/tools"
import { mapGetters } from "vuex";
export default {
  name: "slidebar",
  props: [
    "loadData",
    "screen",
    "isSidwbar",
    "showFullScreenSwitch",
    "firstLoad"
  ],
  data() {
    return {
      bars: [
        { name: "暂时离开", tip: "点击后返回客户端界面" },
        { name: "游戏修复", tip: "点击确定后可快速关闭卡住的游戏。" },
        { name: "鼠标速度", tip: "点击调整鼠标模式下的鼠标速度。" },
        { name: "鼠标模式", tip: "选择使用云电脑时鼠标操作形式。" },
        {
          name: "网络监测",
          tip: "开启或关闭延迟，解码，丢包等信息的监控窗口。",
        },
        {
          name: "全屏显示",
          tip: "开启或关闭画面比例约束，开启后可能会导致画面变形。",
        },
      ],
      i: -1,
      isHelp: false,
      value: 1,
      isDraging: false,
      isTouch: false,
      netShow: false,
      slidebarShow: true,
      useCount: "",
      sumCount: "",
      keyboardListShow: false,
      onlineTime: "00:00:00",
      game: "",
      message: "",
      online: {
        left: "",
        top: "",
        value: ''
      },
      timer: "",
      helpFist: true,
      officalFist: true
    };
  },
  components: {
    keyboardList,
  },
  watch: {
    fullScreenShow() {
      console.log(this.screen);
      this.online.left = this.screen.left + 140;
      this.online.top = this.screen.top;
      if (!this.fullScreenShow) {
        this.i = -1;
      }
    },
    isSidwbar() {
      if (!this.isSidwbar) {
        this.isHelp = false;
        this.i = -1
      }
      if (this.isSidwbar) {
        clearInterval(this.timer);
        this.getUseInfo();
      }
    },
    showFullScreenSwitch() {
      if (!this.showFullScreenSwitch) {
        console.log("判断是否为16：9  。。。。。。。。。。。。");
        let arr = this.bars.filter((item) => item.name !== "全屏显示");
        this.$set(this, "bars", arr);
      }
    },
  },
  computed: {
    ...mapGetters(["fullScreenShow", "initMsg"]),
  },
  created() {
    let appData = sessionStorage.getItem("app");
    let dataMsg = appData ? util.decrypt(appData) : '';
    this.game = dataMsg ? dataMsg.g_name : "";
    if (this.game) {
      this.message = '点击"确定"后将强制关闭当前游戏，解决游戏卡住问题';
    } else {
      this.message =
        '点击"确定"后将强制关闭所有游戏，解决游戏卡住问题，请手动重启需要玩的游戏';
    }
    this.online.left = this.screen ? this.screen.left + 140 : 140;
    this.online.top = this.screen ? this.screen.top : 0;
    if (!this.showFullScreenSwitch) {
      this.bars = this.bars.filter((item) => item.name !== "全屏显示");
    }
  },
  mounted() {
    this.getUseInfo();
  },
  methods: {
    sendDataBuriedPoint (name, data) {
      this.$emit('sendDataBuriedPoint', name, data)
    },
    getTop(e) {
      var offset = e.offsetTop;
      if (e.offsetParent != null) offset += getTop(e.offsetParent);
      return offset;
    },
    getLeft(e) {
      var offset = e.offsetLeft;
      if (e.offsetParent != null) offset += getLeft(e.offsetParent);
      return offset;
    },
    createClick() {
      this.$emit("createClick");
    },
    chooseFull(status) {
      this.$emit("showSidebar");
      this.$emit("showFullScreen", status);
    },
    showText() {
      // 打开文字键盘
      this.isHelp = false;
      this.$emit("showKey");
    },
    clickBar(index) {
      console.log(index);
      this.$nextTick(() => {
      if (this.i == index) {
        // this.i = -1;
        this.$set(this, 'i', -1)
      } else {
        // this.i = index;
        this.$set(this, 'i', index)
      }
        this.isHelp = false;
      })
      switch (index) {
        case 0:
          this.$emit("away");
          break;
        case 1:
          this.$dialog.confirm({
            title: "",
            message: this.message,
            confirmButtonColor: "#3DA0FE",
            cancelButtonColor: "#3DA0FE",
          })
            .then(() => {
              this.i = -1;
              this.$emit("reset");
              // on confirm
            })
            .catch(() => {
              this.i = -1;
              // on cancel
            });
          break;
        case 4:
          this.i = -1;
          this.$emit("showSidebar");
          this.$emit("changeNet", true);
          break;
        case 5:
          this.slidebarShow = true;
          break;
      }
    },
    helphide() {
      console.log("kkk");
      this.isHelp = false;
    },
    help() {
      this.helpFist=false;
      this.isHelp = !this.isHelp;
      this.i = -1;
    },
    onChange(value) {
      // 鼠标速度区间 0.5-2.0
      console.log(value, "111");
      this.$emit("changemousespeed", value);
    },
    touchButton() {
      this.isTouch = true;
    },
    dragStart() {
      this.isDraging = true;
      this.isTouch = false;
    },
    dragEnd() {
      this.isDraging = false;
      this.isTouch = false;
    },
    closeNetwork() {
      this.netShow = false;
      this.i = -1;
    },
    goKeyboardList() {
      // this.$router.replace({
      //     path: '/keyboardList'
      // })
      this.officalFist=false;
      this.isHelp = false;
      this.keyboardListShow = true;
      this.netShow = false;
      this.slidebarShow = false;
    },
    goBack() {
      this.keyboardListShow = false;
      this.netShow = false;
      this.slidebarShow = true;
    },
    initChart(chart, id) {
      let mychart = chart.name;
      mychart = this.$echarts.init(document.getElementById(id));
      function randomData(offset, isInital) {
        offset = offset || 0;
        now = new Date().getTime() + offset * 1000;
        value = chart.value;
        chart.value = isInital ? 0 : Math.round(value);
        return {
          name: now.toString(),
          value: [now, isInital ? 0 : Math.round(value)],
        };
      }
      var data = [];
      var color = chart.color;
      var now = new Date().getTime();
      var value = Math.random() + 10;
      for (var i = 20; i > -1; i--) {
        data.push(randomData(-i, true));
      }
      let option = {
        title: {
          show: false,
        },
        tooltip: {
          show: false,
          trigger: "axis",
          formatter: function (params) {},
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          show: false,
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          show: false,
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
        },
        max: function (value) {
          return value.max;
        },
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0,
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: data,
          },
        ],
      };
      mychart.setOption(option);
      setInterval(() => {
        data.shift();
        data.push(randomData(0, false));
        mychart.setOption({
          series: [
            {
              data: data,
              type: "line",
              color: color,
            },
          ],
        });
      }, 1000);
    },
    goCharge() {
      //获取cookie是否存在
      this.$emit("goRechargeUrl");
    },
    chooseMouseType(type) {
      if (type === 2) {
        this.$toast("敬请期待");
      } else {
        // this.slidebarShow = false;
        this.$emit("showSidebar");
      }
    },
    async getUseInfo() {
      //this.loadData.cid
      let paramData = sessionStorage.getItem("param");
      let paramMsg = paramData ? util.decrypt(paramData) : '';
      console.log("获取用户信息", paramMsg);
      console.log("flag", this.initMsg.flag);
      if ([2, 3, 3.1].includes(this.initMsg.flag)) {
        let sendData = {
          cid: paramMsg.cid,
        };
        let zswk = await keyboard.getZswkUseInfo(sendData);
        console.log("用户信息", zswk);
        this.useCount = zswk.used_money;
        this.sumCount = zswk.yundou_amount;
        console.log(zswk.used_money,this.useCount,zswk.yundou_amount,this.sumCount)
        let online = zswk.onlinetime;
        // online.value = '10:05-11:00'
        let time = online ? online.value : '';
        let minutes = time ? tools.timeDifference(time) : 0;
        this.intervalTimer(minutes);
      } else {
        let sendData = {
          cid: paramMsg.cid,
        };
        let res = await keyboard.getUseInfo(sendData);
        console.log("用户信息", res);
        this.useCount = res.used_money;
        this.sumCount = res.yundou_amount;
        let online = res.onlinetime;
        // online.value = '10:05-11:00'
        let time = online ? online.value : '';
        let minutes = time ? tools.timeDifference(time) : 0;
        this.intervalTimer(minutes);
        console.log(minutes);
        console.log(res);
      }
    },
    intervalTimer(minutes) {
      console.log("秒数", minutes);
      let seconds = parseInt(minutes);
      let that = this;
      let hour = 0;
      let minute = 0;
      if (seconds > 60) {
        minute = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        if (minute > 60) {
          hour = parseInt(minute / 60);
          minute = parseInt(minute % 60);
        }
      }
      let tempHour = "00";
      let tempMinutes = "00";
      let tempSeconds = "00";
      const handleTime = () => {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minute++;
        }
        if (minute === 60) {
          minute = 0;
          hour++;
        }
        if (seconds < 10) {
          tempSeconds = "0" + seconds;
        } else {
          tempSeconds = seconds;
        }
        if (minute < 10) {
          tempMinutes = "0" + minute;
        } else {
          tempMinutes = minute;
        }
        if (hour < 10) {
          tempHour = "0" + hour;
        } else {
          tempHour = hour;
        }
        // console.log(hour, minutes, seconds);
        // console.log("数据22", tempHour, tempMinutes, tempSeconds);
        this.onlineTime = tempHour + ":" + tempMinutes + ":" + tempSeconds;
      };
      handleTime();
      that.timer = setInterval(() => {
        handleTime();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.slide {
  display: flex;
  flex-direction: row;
  font-size: 23.3px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  pointer-events: none;
  ::-webkit-scrollbar {
    // display: none;
  }

  .bars_wrap {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    .content {
      height: 100%;
      width: 233.3px;
      pointer-events: auto;
      background-color: #171d33;
      .contentBox {
        position: relative;
        height: 100%;
        .top {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #171d33;
          color: #fff;
          pointer-events: auto;
          width: 233.3px;
          padding-top: 16.7px;
          height: 383.3px;
          background-image: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_bars.png");
          background-size: cover;
          background-repeat: no-repeat;
          position: absolute;
          top: 0;
          z-index: 1;

          i {
            margin-right: 13.3px;
            display: inline-block;
            width: 40px;
            height: 40px;
            overflow: hidden;
            background: transparent
              url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png")
              0 0 no-repeat;
            background-size: 276.7px 278.3px;
          }

          p {
            margin: 8.3px 0 0 0;
            line-height: 66.7px;
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
              display: inline-block;
            }
          }

          p:nth-child(1) {
            i {
              width: 48.3px;
              height: 41.7px;
              background-position: -56.7px -235px;
            }
          }

          p:nth-child(2) {
            i {
              width: 50px;
              height: 36.7px;
              background-position: -228.3px -195px;
            }
          }

          p:last-child {
            width: 200px;
            height: 1.7px;
            background-color: #464e6d;
          }
        }

        .bars_absolute {
          position: absolute;
          top: 183.3px;
          pointer-events: auto;
          width: 233.3px;
          background-color: #171d33;
          display: flex;
          height: calc(100% - 190px);
          flex-direction: column;
          align-items: center;

          .ul {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .icon {
              margin-right: 13.3px;
              display: inline-block;
              width: 40px;
              height: 40px;
              overflow: hidden;
              background: transparent
                url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png")
                0 0 no-repeat;
              background-size: 276.7px 278.3px;
            }

            li {
              margin-top: 8.3px;
              line-height: 50px;
              display: flex;
              flex: 1;
              flex-direction: row;
              align-items: center;

              p:nth-child(1) {
                position: relative;
                z-index: 9;
                display: flex;
                flex-direction: row;
                align-items: center;
              }
            }
            .tips {
              width: 600px;
              height: 50px;
              background: -webkit-gradient(
                linear,
                left top,
                right top,
                from(#b1465e),
                color-stop(100%, rgba(147, 155, 230, 0.3)),
                to(#7180f5)
              );
              background: linear-gradient(
                90deg,
                #b1465e 0%,
                rgba(147, 155, 230, 0.3) 100%,
                #7180f5 100%
              );
              opacity: 0.69;
              border-radius: 13.3px;
              margin-bottom: 31.7px;
              line-height: 50px;
              padding-left: 66.7px;
              color: #fff;
              font-size: 23.3px;
              text-align: left;
              position: absolute;
              left: 250px;
            }

            .bar {
              color: #787c88;
              p {
                margin: 0;
              }
              .bar_icon_1 {
                background-position: -56.7px -140px;
              }

              .bar_icon_2 {
                background-position: -155px -190px;
              }

              .bar_icon_3 {
                background-position: -58.3px -188.3px;
              }

              .bar_icon_4 {
                background-position: -185px -6.7px;
              }

              .bar_icon_5 {
                background-position: -186.7px -105px;
              }

              .bar_icon_6 {
                background-position: -71.7px -71.7px;
              }
            }

            .bar_active {
              color: #fff;
              position: relative;
              height: 50px;

              .bar_icon_1 {
                background-position: -105px -140px;
              }

              .bar_icon_2 {
                background-position: -236.7px -3.3px;
              }

              .bar_icon_3 {
                background-position: -108.3px -190px;
              }

              .bar_icon_4 {
                background-position: -185px -56.7px;
              }

              .bar_icon_5 {
                background-position: -6.7px -188.3px;
              }

              .bar_icon_6 {
                background-position: -138.3px -6.7px;
              }
            }

            .bar_active:after {
              content: "";
              display: block;
              width: 200px;
              height: 50px;
              background: linear-gradient(268deg, #324eb9 0%, #1c348f 100%);
              -webkit-box-shadow: 0px 5px 33.3px rgba(31, 62, 184, 0.8);
              box-shadow: 0px 5px 33.3px rgba(31, 62, 184, 0.8);
              opacity: 1;
              border-radius: 13.3px;
              position: absolute;
              left: -36.7px;
              z-index: 1;
              padding-left: 36.7px;
            }
          }

          .help {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            height: 66.7px;
            .help_icon {
              width: 40px;
              height: 40px;
              overflow: hidden;
              background: transparent
                url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png)
                0 0 no-repeat;
              background-size: 200px 186.7px;
              margin-bottom: 5px;
            }

            .nohelping {
              background-position: -1.7px 0px;
            }

            .helping {
              background-position: -48.3px 0px;
            }

            .help_text {
              color: #787c88;
              line-height: 23.3px;
              height: 23.3px;
            }

            .help_text_active {
              color: #fff;
              line-height: 23.3px;
              height: 23.3px;
            }
          }
        }
      }
    }
  }

  .mouse {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 216.7px;

    div {
      width: 266.7px;
      height: 43.3px;
      background: linear-gradient(
        90deg,
        #2f4bb3 0%,
        #783c5e 100%,
        #7180f5 100%
      );
      opacity: 1;
      border-radius: 10px;
      font-size: 23.3px;
      color: #fff;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }

    .p_item {
      width: 50%;
      display: flex;
      height: 41.7px;
      flex-direction: row;
      justify-content: center;

      i {
        display: inline-block;
        width: 40px;
        height: 45px;
        overflow: hidden;
        background: transparent
          url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png")
          0 0 no-repeat;
        background-size: 358.3px 346.7px;
        margin-right: 8.3px;
      }
      span {
        height: 45px;
        line-height: 45px;
      }
    }

    p:nth-child(1) {
      border-right: 1.7px solid #fff;
    }

    p:nth-child(1) i {
      background-position: -141.7px -298.3px;
    }

    p:nth-child(2) i {
      background-position: -198.3px -296.7px;
    }
  }
  .full {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 216.7px;

    div {
      width: 266.7px;
      height: 43.3px;
      background: linear-gradient(
        90deg,
        #2f4bb3 0%,
        #783c5e 100%,
        #7180f5 100%
      );
      opacity: 1;
      border-radius: 10px;
      font-size: 23.3px;
      color: #fff;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    p {
      margin: 0;
    }

    .p_item {
      width: 50%;
      height: 43.3px;
      display: flex;
      line-height: 43.3px;
      flex-direction: row;
      justify-content: center;

      i {
        display: inline-block;
        width: 40px;
        height: 43.3px;
        overflow: hidden;
        margin-right: 16.7px;
      }
      span {
        height: 43.3px;
        line-height: 43.3px;
      }
    }

    p:nth-child(1) {
      border-right: 1.7px solid #fff;
      height: 43.3px;
      line-height: 43.3px;
    }

    p:nth-child(1) i {
      margin-top: 10px;
      background: url("../../assets/img/icon/full.png") 0 0 no-repeat;
      background-size: 33.3px;
    }

    p:nth-child(2) i {
      margin-top: 5px;
      background: url("../../assets/img/icon/nfull.png") 0 0 no-repeat;
      background-size: 33.3px;
    }
    .active {
      position: absolute;
      width: 131.7px;
      height: 43.3px;
      line-height: 43.3px;
      background: rgba(255, 255, 255, 0.5);
      border: 1.7px solid rgba(255, 255, 255, 0.6);
      opacity: 1;
      top: -1.7px;
      background: rgba(255, 255, 255, 0.2);
    }
    .left {
      // 四个值: 第一个值为左上角，第二个值为右上角，第三个值为右下角，第四个值为左下角。
      border-radius: 10px 0px 0px 10px;
    }
    .right {
      border-radius: 0px 10px 10px 0px;
    }
  }

  .online_time {
    width: 316.7px;
    height: 176.7px;
    pointer-events: auto;
    background: url(https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_timer.png);
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1;
    padding: 16.7px 18.3px 11.7px 18.3px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: fixed;
    z-index: 100;

    div:nth-child(1) {
      font-size: 23.3px;
      color: #fff;
      font-weight: bolder;
      line-height: 33.3px;
      text-align: left;
      display: flex;
      flex-direction: row;
      align-items: center;
      p:nth-child(2) {
        width: 106.7px;
        height: 33.3px;
        background: rgba(61, 160, 254, 0.36);
        border: 3.3px solid #3da0fe;
        opacity: 1;
        border-radius: 30px;
        font-size: 20px;
        color: #fff;
        text-align: center;
        line-height: 33.3px;
        margin-left: auto;
      }
    }

    div:nth-child(2) {
      color: #3da0fe;
      font-size: 33.3px;
      font-weight: 600;
      line-height: 33.3px;
      margin: 10px 6.7px 10px 0px;
      text-align: left;
    }

    div:nth-child(3) {
      display: flex;
      flex-direction: row;
      align-items: center;

      p:nth-child(1) {
        font-size: 20px;
        color: #3da0fe;
        display: flex;
        margin: 0;
        text-align: left;
        flex-direction: column;

        span {
          line-height: 23.3px;
        }

        span:nth-child(1) {
          margin-bottom: 10px;
        }
      }

      p:nth-child(2) {
        width: 106.7px;
        height: 33.3px;
        background: rgba(61, 160, 254, 0.36);
        border: 3.3px solid #3da0fe;
        opacity: 1;
        border-radius: 30px;
        font-size: 20px;
        color: #fff;
        text-align: center;
        line-height: 33.3px;
        margin-left: auto;
      }
    }
  }
  .point_speed {
    width: 233.3px;
    height: 46.7px;
    background: linear-gradient(
      90deg,
      rgba(47, 75, 179, 1) 0%,
      rgba(120, 60, 94, 1) 100%,
      rgba(113, 128, 245, 1) 100%
    );
    opacity: 1;
    border-radius: 13.3px;
    font-size: 23.3px;
    color: #fff;
    padding: 0 16.7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 216.7px;

    .van-slider {
      margin: 0 16.7px;
      height: 6.7px;
      border-radius: 13.3px;
    }

    .custom-button {
      position: relative;
      width: 50px;
      height: 50px;

      span {
        display: inline-block;
        width: 16.7px;
        height: 16.7px;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        margin: 16.7px 33.3px;
        left: 50%;
        -webkit-transform: translate(-100%, -100%);
        transform: translate(-250%, -150%);
      }
    }

    .custom-button-draging {
      width: 53.3px;
      height: 53.3px;
      border-radius: 26.7px;
      background-color: rgba(255, 255, 255, 0.2);
    }

    .custom-button-focused {
      width: 53.3px;
      height: 53.3px;
      border-radius: 26.7px;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1.7px solid #fff;
    }
  }
  .arrow_box {
    animation: glow 1000ms ease-out infinite alternate;
  }
  @keyframes glow {
    0% {
      color: #787c88;
    }
    100% {
      color: #fff;
    }
  }
  .arrow_boxb {
    animation: glowb 1000ms ease-out infinite alternate;
  }
  @keyframes glowb {
    0% {
      background: url('../../assets/img/icon/help.png') 3px 3px no-repeat;
      background-size: 33.3px;
      
    }
    100% {
      background: url('../../assets/img/icon/nohelp.png') 3px 3px no-repeat;
      background-size: 33.3px;
    }
  }
  .arrow_boxo {
    animation: glowo 1000ms ease-out infinite alternate;
  }
  @keyframes glowo {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
  .network {
    width: 341.7px;
    pointer-events: auto;
    background: linear-gradient(135deg, #2f4bb3 0%, #783c5e 100%, #7180f5 100%);
    opacity: 0.94;
    border-radius: 5px;
    height: 231.7px;
    position: absolute;
    left: 0;
    top: 0;

    .title {
      font-size: 23.3px;
      color: #fff;
      height: 50px;
      border-bottom: 1.7px solid #7482bf;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 20px;
      margin: 0;

      span:nth-child(2) {
        width: 60px;
        height: 60px;
        display: inline-block;
        background: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/close_icon.png");
        background-size: cover;
      }
    }

    .content {
      margin: 0 16.7px;

      li {
        height: 46.7px;
        border-bottom: 1.7px solid #7482bf;
        padding: 5px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: left;

        div:nth-child(1) {
          font-size: 20px;
          color: #fff;
          width: 66.7px;
          height: 46.7px;

          p:nth-child(2) {
            display: flex;
            flex-direction: row;
            align-items: center;
            // margin-top: 4px;

            span {
              font-size: 20px;
              font-weight: bolder;
            }
          }
        }

        div:nth-child(2) {
          width: 241.7px;
          height: 43.3px;
          /*background-color: red;*/
        }
      }

      li:last-child {
        border: none;
      }

      .chart {
        width: 100% !important;
        height: 50px !important;
      }
    }
  }
}
</style>
