<template>
  <div class="connect">
    <div class="bg">
      <img class="bgimg" :src="newUserGuidePics[0]" />
      <div class="meng"></div>
      <img class="list" :src="newUserGuidePics[1]" />
      <img class="changegameimg" :src="newUserGuidePics[2]" />
      <img class="changegameimg" :src="newUserGuidePics[3]" />
      <div class="changegameText text">您可以选择一款我们为您设计好的游戏键盘。</div>
      <img class="creat" @click="close" :src="newUserGuidePics[4]" />
      <img class="creatimg"  :src="newUserGuidePics[5]" />
      <div class="creatText text">若都没有您喜欢的，您可以试试自己创建一款</div>
      <img class="use" @click="close" :src="newUserGuidePics[6]" />
      <img class="useimg" :src="newUserGuidePics[7]" />
      <div class="useText text">您可以选择一款我们为您设计好的游戏键盘。</div>
      <div class="end" @click="close">完成教学</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "course",
  data() {
    return {
      newUserGuidePics: [
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/1212.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/组件 51 – 1.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/路径 53.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/路径 53.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/组件 52 – 1.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/路径 54.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/组件 53 – 1.png',
        'https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/路径 55.png'
      ]
    };
  },
  computed: {},
  mounted() {},
  methods: {
    close(){
      this.$emit('changeCusor',false)
    }
  },
};
</script>
<style lang="less"  scoped>
.connect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    .bgimg {
      width: 100%;
      height: 100%;
    }
    .meng {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.81);
    }
    .list {
      position: absolute;
      left: 2%;
      top: 25%;
      width: 35%;
      height: 71%;
      z-index: 5;
    }
    .changegameimg {
      position: absolute;
      left: 35%;
      top: 35%;
      width: 8%;
      height: 16%;
    }
    .text {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 33.3px;
      color: #cccccc;
      text-align: left;
    }
    .changegameText {
      position: absolute;
      left: 43%;
      top: 43%;
      width: 238.3px;
      height: 66.7px;
    }
    .use {
      position: absolute;
      bottom: 5%;
      right: 4%;
      width: 14%;
      height: 8.5%;
    }
    .useimg {
      position: absolute;
      bottom: 12%;
      right: 7%;
      width: 9%;
      height: 14%;
    }
    .useText {
      position: absolute;
      bottom: 25%;
      right: 3%;
      width: 238.3px;
      height: 66.7px;
    }
    .creat {
      position: absolute;
      bottom: 5%;
      right: 19.5%;
      width: 14%;
      height: 8.5%;
      z-index: 5;
    }
    .creatimg {
      position: absolute;
      bottom: 1%;
      right: 33%;
      width: 8%;
      height: 16%;
    }
    .creatText {
      position: absolute;
      bottom: 4%;
      right: 38%;
      width: 258.3px;
      height: 66.7px;
    }
    .end{
      position: absolute;
      top: 9%;
      right: 4%;
      width: 150px;
      line-height: 43.3px;
      height: 43.3px;
      font-size: 23.3px;
      color: #fff;
      font-family: Source Han Sans CN;
      font-weight: 400;
      border: 1.7px solid #fff;
      border-radius: 58.3px;
    }
  }
}
</style>
