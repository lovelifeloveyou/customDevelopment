export default {
  //添加全局事件
  install(Vue, options) {
    Vue.prototype.$bodyScroll = function (event) {
      event.preventDefault();
    }
    Vue.prototype.$scroll = function (event) {
      if (!$('.hscroll') || !$('.verticalscroll') || !$('.vscroll')) {
        e.preventDefault();
      }
    }
    Vue.prototype.$visable = function () {
      // 用户息屏、或者切到后台运行 （离开页面）
      if (document.visibilityState === "hidden") {
        this.panel = false;
        this.firstEntry = 1;
        this.sup_index = 3; //问题19
        this.sendingDisconn();
        this.setHideShowCourse(true);
        if (this.timer) {
          clearInterval(this.timer);
        }
        sessionStorage.setItem("isVisablty", JSON.stringify(false));
        window.location.href = document.referrer;
      }
      // 用户打开或回到页面
      if (document.visibilityState === "visible") {
        console.log('页面回退',document.referrer)
        window.location.href = document.referrer;
        setTimeout(()=>{
          window.location.href = document.referrer;
        },10)
      }
    }
    Vue.prototype.$record=function(eventId,eventInfo){
      let eventMsg = {
      ...eventInfo,
      ...this.universal
      };
      // console.log("数据", eventMsg, this.universal);
      window.AnalysysAgent.track(eventId, eventMsg);
    }
  }
}
