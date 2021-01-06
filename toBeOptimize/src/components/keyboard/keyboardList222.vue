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
          :class="chooseTabIndex === index ? 'active' : ''"
        >
          {{tab}}
        </p>
      </div>
      <MeScrollVue class="customScroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit" :down="mescrollDown">
        <div id="dataList" class="keyboard_list">
          <div
            class="keyboard_item"
            v-for="(item, index) in dataList"
            :key="item.id"
            @click="chooseKeyboards(index, item)"
            :class="chooseKeyboardIndex === index ? 'active' : 'noactive'"
          >
            <p>{{ item.key_name}}</p>
          </div>
        </div>
      </MeScrollVue>
      <div class="right">
        <div class="bg_key">
          <div class="bg_img"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import keyboard from "../../api/keyboard";
import course from "@c/course/index"
import mockData from '../../views/pdlist'
import MescrollMixins from '../../mixins/dalongScrollMixins'

export default {
  name: 'keyboardList',
  mixins: [MescrollMixins],
  data () {
    return {
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 8 // 每页数据的数量
        },
        noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          src: './static/mescroll/mescroll-totop.png' // 回到顶部按钮的图片路径,支持网络图
        },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: 'dataList', // 父布局的id;
          icon: './static/mescroll/mescroll-empty.png', // 图标,支持网络图
          tip: '暂无相关数据~', // 提示
          btntext: '去逛逛 >', // 按钮,默认""
          btnClick () { // 点击按钮的回调,默认null
            alert('点击了按钮,具体逻辑自行实现')
          }
        },
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        },
        isBounce: false
      },
      cusorShow: false,
      searchKeyName: '',
      tabs: ['配置列表', '我的'],
      chooseTabIndex: 0,
      chooseKeyboardIndex: -1,
      dataList: []
    }
  },
  props: [
    'screen'
  ],
  components: {
    'course-item': course,
  },
  methods: {
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    getListDataFromNet (pdType, pageNum, pageSize, successCallback, errorCallback) {
      let listData = []
      if (pdType === 0) {
        let params = {
          page: pageNum,
          keyboard_type: 2, // 1:普通 2：普通+手柄
          key_name: this.searchKeyName
        }
        keyboard.getOfficeKeyboardList(params).then(res => {
          if (res.success && res.status === 10000) {
            if(this.searchKeyName && this.page === 1 && res.data.length === 0) {
              console.log('未搜索到对应官方键盘')
              return
            }
            if (res.data.length) {
              listData = listData.concat(res.data);
              console.log('查询出来的官方键盘的数据', listData)
            }
          }
        })
      } else if (pdType === 1) {
        let params = {
          event: 'keyboard',
          method: 'myKeyboard',
          page: pageNum
        }
        keyboard.getMyKeyboard(params).then(res => {
          if (res.success && res.status === 10000) {
            if (res.data.length) {
              listData = listData.concat(res.data);
              console.log('查询出来的自定义键盘的数据', listData)
            }
          }
        })
      }
      setTimeout(() => {
        if (listData.length) {
          successCallback(listData)
        }
      }, 500)
    }, 
    upCallback (page, mescroll) {
      this.getListDataFromNet(this.chooseTabIndex, page.num, page.size, (arr) => {
        if (page.num === 1) this.dataList = []
        this.dataList = this.dataList.concat(arr)
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }, () => {
        mescroll.endErr()
      })
    },
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
      if (this.chooseTabIndex !== index) {
        this.chooseTabIndex = index
        this.dataList = []
        this.mescroll.resetUpScroll()  // 刷新列表数据
      }
    },
    chooseKeyboards (index, item) {
      this.chooseKeyboardIndex = index
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
      padding-bottom: 25px;

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

    .customScroll {
      position: absolute;
      width: 38%;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #304bb5;
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 6px #304bb5;
      }
    }
    .keyboard_list {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0 2%;
      text-align: left;
      overflow-y: scroll;

      .keyboard_item {
        display: block;
        font-size: 23.3px;
        color: #fff;
        width: 85%;
        height: 50px;
        background: rgba(46, 63, 107, 1);
        opacity: 1;
        border-radius: 6.7px;
        line-height: 50px;
        margin-bottom: 16.7px;
        padding: 0 40px 0 66.7px;
        box-sizing: border-box;
        position: relative;
        margin-right: 3%;
      }

      .keyboard_item:before {
        content: "";
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 13.3px;
        border: 1.7px solid rgba(247, 203, 70, 1);
        position: absolute;
        top: 50%;
        left: 25px;
        transform: translateY(-50%);
      }

      .noactive p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        text-align: left;
        // animation: 15s wordsLoop linear infinite normal;
      }
      .active {
        background: linear-gradient(
          270deg,
          rgba(50, 78, 185, 1) 0%,
          rgba(28, 52, 143, 1) 100%
        );
        box-shadow: 0 0 5px 3px rgba(31, 62, 184, 0.8);
        opacity: 1;
        width: 92%;
        border-radius: 6.7px;
        left: -1%;

        p {
          white-space: nowrap;
          overflow: hidden;
          text-align: left;
        }
      }

      .active:before {
        background: rgba(247, 203, 70, 1);
      }
    }

    .right {
      width: 58%;
      height: 100%;
      position: absolute;
      right: 0%;

      .bg_key {
        position: relative;
        height: 60%;
        width: 91%;
        margin: 0 auto;

        .bg_img {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: 6.7px;
          background-image: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/mobileGame/streamingPC/bg_button.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 'center center';
        }
      }
    }
  }
}
</style>