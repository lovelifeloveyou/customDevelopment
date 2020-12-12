<template>
  <div data-tname="WaveItem">
    <div class="main-container">
      <div class="waves">
        <div class="wave" v-for="(item, key) in waves" :key="key" :style="item">
          <div
            v-for="n in wavesConfig.total"
            :key="n"
            class="wave-item"
            :style="{
              transform: `scale(${0.1 * Math.sqrt(n - 1)})`,
              opacity: 0.3 * (1 / n),
              animationDelay: `${(n - 1) * 0.12}s`,
              animationDuration: `${0.6 +
                n * 0.3 +
                parseInt(item.width) * 0.002}s`,
              backgroundColor: wavesConfig.waveColor
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WaveItem",
  data() {
    return {
      waves: [],
      wavesConfig: {
        maxSize: 300,
        minSize: 100,
        zIndexCount: 999,
        waveColor: "#3E8CE3",
        total: 5
      },
      clear: {
        delay: 5000,
        timeoutId: null
      }
    };
  },
  mounted() {
    document.getElementById("app").onclick = e => {
      this.createWave(e);
      this.intervalClearWave();
    };
  },
  methods: {
    createWave(e) {
      if (this.wavesConfig.zIndexCount > 99999) {
        this.wavesConfig.zIndexCount = 999;
      } else {
        this.wavesConfig.zIndexCount++;
      }
      const waveSize = parseInt(
        Math.random() * (this.wavesConfig.maxSize - this.wavesConfig.minSize) +
          this.wavesConfig.minSize
      );
      this.waves.push({
        left: `${e.clientX - waveSize / 2}px`,
        top: `${e.clientY - waveSize / 2}px`,
        zIndex: this.wavesConfig.zIndexCount,
        width: `${waveSize}px`,
        height: `${waveSize}px`
      });
    },
    intervalClearWave() {
      clearTimeout(this.clear.timeoutId);
      this.clear.timeoutId = setTimeout(() => {
        this.waves = [];
      }, this.clear.delay);
    }
  }
};
</script>

<style lang="scss" scoped>
.waves {
  .wave {
    position: fixed;
    pointer-events: none;
    @keyframes wave {
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
    .wave-item {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 100%;
      animation: {
        name: wave;
        fill-mode: forwards;
        timing-function: ease-out;
      }
    }
  }
}
</style>


