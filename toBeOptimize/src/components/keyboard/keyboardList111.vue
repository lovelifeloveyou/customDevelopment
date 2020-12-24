<template>
  <div class="wrap" :style="`width: ${screen.videosWidth}px;height: ${screen.videosHeight}px;`">
    <course-item v-if="cusorShow" @changeCusor="changeCusor"></course-item>
    <div class="header">
      <div class="content">
        <div @click="goBack" class="back">
          <div></div>
          <span>返回菜单</span>
        </div>
        <div class="search">
          <span></span>
          <input type="text" placeholder="搜索您需要的键盘..." v-model="searchKeyName" />
          <div @click="searchKey">
            <i></i>
            <i>搜索</i>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="tab">
        <p
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          :class="i === index ? 'active' : ''"
        >
          {{tab}}
        </p>
      </div>
      <div style="border: 1px solid red;width: 40%;height: 100%;">
        <ul id="dataList" class="data-list">
          <li v-for="item in dataList" :key="item.id">
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import course from "@c/course/index"

export default {
  name: 'keyboardList',
  data () {
    return {
      cusorShow: false,
      searchKeyName: '',
      tabs: ['配置列表', '我的'],
      i: 0,
      dataList: [
        {
          id: 31245,
          name: '111111'
        },
        {
          id: 53435,
          name: '222222'
        }
      ]
    }
  },
  props: [
    'screen'
  ],
  components: {
    'course-item': course,
  },
  methods: {
    changeCusor () {
      this.cusorShow = false;
    },
    goBack () {
      this.$emit('goBack')
      this.$emit('changeIndex', false)
    },
    searchKey () {
      console.log('搜索')
    },
    changeTab (index) {
      this.i = index
    }
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.wrap {
  position: fixed;
  background-color: #1a2038;
  pointer-events: auto;
  width: 100%;
  height: 100%;

  .header {
    height: 166.7px;
    width: 100%;
    background-image: url("https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_mine.png");
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    padding: 0 33.3px 0 33.3px;
    box-sizing: border-box;
    z-index: 1;

    .content {
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .back {
        display: flex;
        flex-direction: row;
        align-items: center;
        div {
          width: 46.7px;
          height: 40px;
          overflow: hidden;
          background: transparent
            url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
            0 0 no-repeat;
          background-size: 300px 303.3px;
          background-position: -6.7px -88.3px;
        }
        span {
          color: #fff;
          font-size: 23.3px;
        }
      }

      .search {
        width: 450px;
        height: 60px;
        margin-top: 6.7px;
        background-color: #39405c;
        border-radius: 25px 53.3px 53.3px 25px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-left: auto;
        position: relative;

        span {
          display: inline-block;
          width: 40px;
          height: 36.7px;
          overflow: hidden;
          background: transparent
            url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
            0 0 no-repeat;
          background-size: 300px 303.3px;
          background-position: -6.7px -155px;
          margin: 0 16.7px;
        }

        input {
          height: 60px;
          line-height: 50px;
          font-size: 23.3px;
          border: none;
          background: transparent;
          color: #888c9d;
        }

        input::placeholder {
          color: #888c9d;
        }

        div {
          width: 133.3px;
          height: 63.3px;
          background: rgba(61, 160, 254, 1);
          opacity: 1;
          border-radius: 53.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0px;
          font-family: Source Han Sans CN;

          i {
            font-style: normal;
            font-size: 26.7px;
            color: #ffffff;
          }

          i:nth-child(1) {
            display: inline-block;
            width: 40px;
            height: 36.7px;
            line-height: 36.7px;
            overflow: hidden;
            background: transparent
              url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/icon_sprites.png')
              0 0 no-repeat;
            background-size: 300px 303.3px;
            background-position: -256.7px -166.7px;
            margin-right: 6.7px;
          }
        }
      }
    }
  }

  .main {
    position: absolute;
    top: 91.7px;
    padding: 0 38.3px;
    width: calc(100% - 76.7px);
    height: calc(100% - 91.7px);
    z-index: 99;
    overflow: hidden;

    .tab {
      font-size: 23.3px;
      color: #a3a5af;
      display: flex;
      flex-direction: row;
      align-items: center;

      p:nth-child(1) {
        margin-right: 83.3px;
      }

      p {
        position: relative;
        line-height: 50px;
        margin: 0;
      }

      p.active:after {
        content: "";
        display: block;
        width: 53.3px;
        height: 6.7px;
        background: rgba(61, 160, 254, 1);
        opacity: 1;
        border-radius: 6.7px;
        position: absolute;
        left: 50%;
        bottom: -3.3px;
        transform: translateX(-50%);
      }
    }
  }
}
</style>