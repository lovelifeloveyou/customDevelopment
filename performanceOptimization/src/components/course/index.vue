<template>
  <div class="connect">
    <div class="bg">
      <img class="bgimg" src="../../assets/img/course/1212.png" />
      <div class="meng"></div>
      <img class="list" src="../../assets/img/course/组件 51 – 1.png" />
      <img class="changegameimg" src="../../assets/img/course/路径 53.png" />
      <img class="changegameimg" src="../../assets/img/course/路径 53.png" />
      <div class="changegameText text">您可以选择一款我们为您设计好的游戏键盘。</div>
      <img class="creat" @click="close" src="../../assets/img/course/组件 52 – 1.png" />
      <img class="creatimg"  src="../../assets/img/course/路径 54.png" />
      <div class="creatText text">若都没有您喜欢的，您可以试试自己创建一款</div>
      <img class="use" @click="close" src="../../assets/img/course/组件 53 – 1.png" />
      <img class="useimg" src="../../assets/img/course/路径 55.png" />
      <div class="useText text">您可以选择一款我们为您设计好的游戏键盘。</div>
      <div class="end" @click="close">完成教学</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "course",
  data() {
    return {};
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
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 20px;
      color: #cccccc;
      text-align: left;
    }
    .changegameText {
      position: absolute;
      left: 43%;
      top: 43%;
      width: 143px;
      height: 40px;
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
      width: 143px;
      height: 40px;
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
      width: 155px;
      height: 40px;
    }
    .end{
      position: absolute;
      top: 9%;
      right: 4%;
      width: 90px;
      line-height: 26px;
      height: 26px;
      font-size: 14px;
      color: #fff;
      font-family: Source Han Sans CN;
      font-weight: 400;
      border: 1px solid #fff;
      border-radius: 35px;
    }
  }
}
</style>
