<template>
  <!-- //  -->
  <div v-if="connectIsShow" class="connect">
    <div class="text title">网络异常,正在重新连接</div>
    <div class="text align">
      重连时间 :
      <span class="count">{{timeoutTimes}}</span> 秒
    </div>
    <div class="text align">
      重连次数 :
      <span class="count">{{timeoutCount}}</span> 次
    </div>
    <div class="close" @click="goback">取消</div>
  </div>
</template>

<script>
export default {
  name: "Connect",
  props: ["connectIsShow", "timeoutTimes", "timeoutCount"],
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    goback () {
      window.history.go(-1);
      this.$emit("away");
    }
  }
}
</script>
<style scoped>
.connect {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 350px;
  height: 208.3px;
  background: rgba(0, 0, 0, 0.7);
  /* border: 1px solid #8f8f8f; */
  border-radius: 6.7px;
  z-index: 55555555;
}
.text {
  line-height: 31.7px;
  font-family: Microsoft YaHei;
}
.align {
  margin-bottom: 8.3px;
  color: #cacaca;
  font-size: 23.3px;
  font-family: Microsoft YaHei;
  font-weight: 400;
}
.title {
  font-size: 26.7px;
  font-weight: 400;
  color: #fff;
  margin: 15px 0 15px;
}
.count {
  width: 50px;
  display: inline-block;
}
.close {
  padding: 5px 38.3px;
  background: rgba(36, 36, 36, 0.8);
  color: #cacaca;
  border-radius: 10px;
  margin-top: 20px;
  border: 1.7px solid rgba(108, 108, 108, 1);
  font-size: 23.3px;
  width: 66.7px;
  margin-left: 100px;
}
</style>
