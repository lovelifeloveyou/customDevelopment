<template>
  <div class="waves" v-show="showWaves">
    <div class="tips-click" :style="{ left: waveLeft + 'px', top: waveTop + 'px' }">
      <b></b>
      <b></b>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'waveLeft',
    'waveTop',
    'showWaves'
  ],
  watch: {
    // showWaves () {
    //   if (this.showWaves) {
    //     setTimeout(() => {
    //       this.$emit('waveFinish', false)
    //     }, 1000)
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
  .waves {
    width: 100%;
    height: 100%;
    position: initial;
    z-index: -1;

    .tips-click {
      position: absolute;
      cursor: pointer;
      b {
        width: 28px; 
        height: 28px; 
        background: #fff;
        border-radius: 50%;
        display: block; 
        background-color: rgba(7, 178, 113);  
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        -webkit-animation: click1 1.2s linear infinite;
        animation: click1 1.2s linear infinite;  
      }
      b:nth-of-type(2) {
        -webkit-animation: click2 1.2s linear infinite;
        animation: click2 1.2s linear infinite;       
      }
    }
  }

  @-webkit-keyframes click1 {
    0% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }

  @keyframes click1 {
    0% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }

  @-webkit-keyframes click2 {
    0% {
      opacity: .8;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(3);
      transform: scale(3);
    }
  }

  @keyframes click2 {
    0% {
      opacity: .8;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      opacity: 0;
      -webkit-transform: scale(3);
      transform: scale(3);
    }
  }
</style>