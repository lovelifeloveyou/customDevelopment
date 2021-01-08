<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less">
@import "assets/reset.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  overflow: hidden !important;
  text-align: center;
}
html, body {
  overflow: hidden !important;
}
.van-dialog {
  z-index: 60000 !important;
}
</style>
