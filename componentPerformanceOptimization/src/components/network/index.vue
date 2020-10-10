<template>
  <div class="slider" v-show="isNetshow">
    <div class="network">
      <div class="title">
        <div>实时检测系统</div>
        <div @click="closeNetwork">
        </div>
      </div>
      <div class="content">
        <ul>
          <li>
            <div>
              <p>网速</p>
              <p>
                <span>{{delayChart.value}}</span> K/s
              </p>
            </div>
            <div id="delay"></div>
          </li>
          <li>
            <div>
              <p>丢包率</p>
              <p>
                <span>{{packetChart.value}}</span>%
              </p>
            </div>
            <div id="packet"></div>
          </li>
          <li>
            <div>
              <p>延迟</p>
              <p>
                <span>{{netspeedChart.value}}</span> ms
              </p>
            </div>
            <div class="speedcanvas" id="netspeed"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
// import echarts from "echarts"

export default {
  name: "network",
  props: ["byteRateSpeed", "roundTripTime", "packetRate", "isNetshow"],
  data() {
    return {
      delayChart: {
        name: "delayChart",
        value: this.byteRateSpeed,
        color: "#D578E2",
      },
      packetChart: {
        name: "packetChart",
        value: this.packetRate,
        color: "#40F799",
      },
      netspeedChart: {
        name: "netspeedChart",
        value: this.roundTripTime,
        color: "#40F7F7",
      },
    };
  },
  watch: {
    byteRateSpeed(newVal) {
      this.delayChart.value = newVal;
    },
    roundTripTime(newVal) {
      this.netspeedChart.value = newVal;
    },
    packetRate(newVal) {
      this.packetChart.value = newVal;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.delayChart, "delay");
      this.initChart(this.packetChart, "packet");
      this.initChart(this.netspeedChart, "netspeed");
    });
  },
  methods: {
    closeNetwork() {
      console.log("我点击了关闭。。。。。");
      //   this.netShow = false;
      this.$emit("closeNetWork", false);
    },
    initChart(chart, id) {
      let mychart = chart.name;
      mychart = echarts.init(document.getElementById(id));
      function randomData(offset, isInital) {
        offset = offset || 0.0;
        now = new Date().getTime() + offset * 1000;
        value = chart.value;
        chart.value = isInital ? 0.0 : value;
        return {
          name: now.toString(),
          value: [now, isInital ? 0.0 : value],
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
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.slider {
  font-size: 23.3px;
  position: absolute;
  top: 33.3px;
  left: 33.3px;
  z-index: 100;
  .network {
    width: 366.7px;
    background: linear-gradient(135deg, #2f4bb3 0%, #783c5e 100%, #7180f5 100%);
    opacity: 0.94;
    border-radius: 8.3px;
    height: 241.7px;

    .title {
      font-size: 23.3px;
      color: #fff;
      height: 50px;
      line-height: 50px;
      text-align: left;
      border-bottom: 1.7px solid #7482bf;
      padding-left: 23.3px;
      margin: 0;
      div {
        display: inline-block;
        height: 50px;
        vertical-align: top;
      }
      div:nth-child(1){
        width: 250px;
      }
      div:nth-child(2) {
        position: absolute;
        right: 6.7px;
        top: -5px;
        width: 50px;
        height: 50px;
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/close_icon.png');

      }
    }

    .content {
      margin: 0 23.3px;

      li {
        height: 46.7px;
        border-bottom: 1px solid #7482bf;
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
