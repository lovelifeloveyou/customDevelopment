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
  bottom: 30px; 
  right: 30px; 
  width: 210px; 
  height: 125px; 
  background: rgba(0, 0, 0, 0.7);
  /* border: 1px solid #8f8f8f; */
  border-radius: 4px; 
  z-index: 55555555;
}
.text {
  line-height: 19px; 
  font-family: Microsoft YaHei;
}
.align {
  margin-bottom: 5px; 
  color: #cacaca;
  font-size: 14px; 
  font-family: Microsoft YaHei;
  font-weight: 400;
}
.title {
  font-size: 16px; 
  font-weight: 400;
  color: #fff;
  margin: 9px 0 9px; 
}
.count {
  width: 30px; 
  display: inline-block;
}
.close {
  padding: 3px 23px; 
  background: rgba(36, 36, 36, 0.8);
  color: #cacaca;
  border-radius: 6px; 
  margin-top: 12px; 
  border: 1px solid rgba(108, 108, 108, 1);
  font-size: 14px; 
  width: 40px; 
  margin-left: 60px; 
}
</style>
