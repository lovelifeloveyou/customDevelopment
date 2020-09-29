<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    // 判断横竖屏
    detectOrient() {
      var storage = localStorage; // 不一定要使用localStorage，其他存储数据的手段都可以
      var data = storage.getItem("J-recordOrientX");
      var cw = document.documentElement.clientWidth;

      var _Width = 0,
        _Height = 0;
      if (!data) {
        var sw = window.screen.width;
        var sh = window.screen.height;
        // 2.在某些机型（如华为P9）下出现 srceen.width/height 值交换，所以进行大小值比较判断
        _Width = sw < sh ? sw : sh;
        _Height = sw >= sh ? sw : sh;
        storage.setItem("J-recordOrientX", _Width + "," + _Height);
      } else {
        var str = data.split(",");
        _Width = str[0];
        _Height = str[1];
      }

      if (cw == _Width) {
        // 竖屏
        this.$toast.setDefaultOptions({
          className: "toast"
        });
        return;
      }
      if (cw == _Height) {
        // 横屏
        this.$toast.setDefaultOptions({
          className: "point"
        });
        return;
      }
    }
  },
  computed: {
    ...mapGetters(["initMsg"])
  },
  mounted () {
    // if([0, 1, 1.1, 2].includes(this.initMsg.flag)){
    //   let startX, startY
    //   document.addEventListener("touchstart", function (e) {
    //     startX = e.targetTouches[0].pageX
    //     startY = e.targetTouches[0].pageY
    //   })
    //   document.addEventListener("touchmove", function (e) {
    //     let moveX = e.targetTouches[0].pageX
    //     let moveY = e.targetTouches[0].pageY
    //     if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
    //       e.preventDefault()
    //     }
    //   }, { passive: false })
    // }
    this.detectOrient()
    
    // 防止页面后退
    history.pushState(null, null, location.href)
    window.onpopstate = function (event) {
      history.go(1)
    }
  }
};
</script>

<style lang="less">
@import './assets/css/waves.less';
html{
  margin: 0;
  padding: 0;
  overflow: hidden !important;
  touch-action: none;
}
body {
  margin: 0;
  padding: 0;
  overflow: hidden !important;
  background-color: black;
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早起浏览器*/
  -moz-user-select: none; /*火狐浏览器*/
  -ms-user-select: none; /*IE浏览器*/
  user-select: none; /*用户是否能够选中文本*/
}

#app {
  position: fixed;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.toast {
  transform: rotate(-90deg);
  position: absolute;
  left: 36%;
  top: 45%;
  pointer-events: none;
}
.point{
  pointer-events: none;
}
</style>
