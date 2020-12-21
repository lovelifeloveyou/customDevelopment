<template>
    <div id="keys" v-show="panel" :class="fullScreenShow ? 'fullScreen' : 'noFullScreen'">
        <div id="allKey" v-show="allKey">
            <div class="letter">
                <button
                        :class="activeClass === index ?
                        [0, 11, 21, 22, 23, 32, 33, 35, 36].includes(index) ? 'special_active' :
                        [31].includes(index) ? 'confirm_active' :
                        [34].includes(index) ? 'space_active' : 'basic_active' : 'base'"
                        v-for="(item, index) in allKeys"
                        :key="index"
                        @touchstart.stop.prevent="whichKey(item, index)"
                        @touchend.stop.prevent="KeyEnd(item)"
                >
                    <span v-if="item.key === '中/英'" class="english">
                        <i :style="{ color: colorA }">中</i>
                        <i>/</i>
                        <i :style="{ color: colorB }">英</i>
                    </span>
                    <span v-else-if="item.key === '控制码'">
                        <span style="display:block">S</span>
                        <span style="display:block">C A</span>
                    </span>
                    <img v-else-if="item.key === 'Back'" src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/delet.png" alt="">
                    <span v-else>{{ item.key }}</span>
                    <span v-show="!([0, 11, 21, 22, 23, 31, 32, 33, 34, 35, 36].includes(index)) && activeClass === index"
                          class="key_tip">{{ item.key }}</span>
                </button>
            </div>
            <div class="number">
                <button
                        :class="activeClass == index + 100 ?
                        [9, 11].includes(index) ? 'special_active' : 'basic_active' : 'base'"
                        v-for="(item, index) in numKey"
                        :key="index"
                        @touchstart.stop.prevent="whichKey(item, index + 100)"
                        @touchend.stop.prevent="KeyEnd(item)"
                >
                    <img v-if="item.key === '左'" src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/L.png" alt="">
                    <img v-else-if="item.key === '右'" src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/R.png" alt="">
                    <span v-else>{{ item.key }}</span>
                    <span v-show="!([9, 11].includes(index)) && activeClass === index + 100" class="key_tip">{{ item.key }}</span>
                </button>
            </div>
        </div>
        <div id="sign" v-show="signKey">
            <button
                    v-for="(item, index) in signKeys"
                    :key="index"
                    :class="activeClass == index + 400 ?
                        [0].includes(index) ? 'special_active' :
                        [31].includes(index) ? 'confirm_active' : 'basic_active'
                        : 'base'"
                    @touchstart.stop.prevent="keySignDown(item, index + 200)"
                    @touchend.stop.prevent="keySpecailUp(item)"
            >
                <span v-if="item.key === '中/英'">
                    <i :style="{ color: colorA }">中</i>
                    <i>/</i>
                    <i :style="{ color: colorB }">英</i>
              </span>
                <span v-else>{{ item.key }}</span>
            </button>
        </div>
        <div id="speCtrl" v-show="SpeKey">
            <button
                    v-for="(item, index) in speCtrls"
                    :key="index"
                    :class="activeClass == index + 300 ?
                        [0, 10, 20 ,31].includes(index) ? 'special_active' :
                        [7,8,9,17,18,19,20,21,26,27,28,29,30,32,33,34,35].includes(index) ? 'confirm_active' : 'basic_active'
                        : 'base'"
                    @touchstart.stop.prevent="whichKey(item, index + 300)"
                    @touchend.stop.prevent="KeyEnd(item)"
            >
                <span v-if="item.key === '中/英'">
                    <i :style="{ color: colorA }">中</i>
                    <i>/</i>
                    <i :style="{ color: colorB }">英</i>
              </span>
                <span v-else>{{ item.key }}</span>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'textKeyboard',
        props: [
            'panel',
            'allKey',
            'signKey',
            'SpeKey',
            'iscaps',
            'colorA',
            'colorB',
            'activeClass',
            'allKeys',
            'CapsallKeys',
            'numKey',
            'signKeys',
            'speCtrls',
            'fullScreenShow'
        ],
        data() {
            return {

            }
        },
        computed: {},
        watch: {
            fullScreenShow(newval) {
                this.fullScreenShow = newval
                console.log(this.fullScreenShow, 'fullScreenShow')
            },
        },
        mounted() {
          console.log(this.fullScreenShow, 'fullScreenShow')
        },
        methods: {
            //键盘按下事件
            whichKey(which, index) {
                // which.key = which.keyRealName || which.keyName || which.key
                // this.activeClass = index
                this.$emit('whickKeyTextKeyboard', which, index)
                // if (['Control', 'CTRL(L)', 'Ctrl'].includes(which.key)) {
                //   console.log('按下Ctrl键')
                // } else if (['Shift', '中/英', 'SHIFT(L)', 'SHIFT(R)', 'Shift'].includes(which.key)) {
                //   this.inputStatus = !this.inputStatus
                //   console.log('按下Shift键')
                // } else if (['Alt', 'ALT(L)'].includes(which.key)) {
                //   console.log('按下Alt键')
                // } else if (['Meta', 'WIN', 'win'].includes(which.key)) {
                //   console.log('按下win键')
                // } else if (['大写', '小写'].includes(which.key)) {
                //   let newList = this.allKeys;
                //   this.allKeys = this.CapsallKeys;
                //   this.CapsallKeys = newList;
                //   console.log('按下大小写键')
                // } else if (['CTRL(R)'].includes(which.key)) {
                //   console.log('按下CTRL(R)键')
                // } else if (['SHIFT(R)'].includes(which.key)) {
                //   console.log('按下SHIFT(R)键')
                // } else if (['ALT(R)'].includes(which.key)) {
                //   console.log('按下ALT(R)键')
                // } else if (['隐藏'].includes(which.key)) {
                //   this.panel = false;
                //   this.allKey = false;
                //   this.signKey = false;
                //   this.SpeKey = false;
                // } else if (['@'].includes(which.key)) {
                //   this.keySignDown(which)
                // } else if (['符'].includes(which.key)) {
                //   this.panel = true;
                //   this.allKey = false;
                //   this.SpeKey = false;
                //   this.signKey = true;
                // } else if (which.key === "控制码") {
                //   this.panel = true;
                //   this.allKey = false;
                //   this.signKey = false;
                //   this.SpeKey = true;
                // } else if (which.key === "返回") {
                //   this.panel = true;
                //   this.allKey = true;
                //   this.SpeKey = false;
                //   this.signKey = false;
                // } else {
                //   console.log('按下其他按键')
                // }
            },
            // 键盘抬起事件
            KeyEnd(which) {
                this.$emit('KeyEndTextKeyboard', which)
                // which.key = which.keyRealName || which.keyName || which.key
                // this.activeClass = -1
                // if (['Control', 'CTRL(L)', 'Ctrl'].includes(which.key)) {
                //   console.log('抬起Ctrl键')
                // } else if (['Shift', '中/英', 'SHIFT(L)', 'SHIFT(R)', 'Shift'].includes(which.key)) {
                //   console.log('抬起Shift键')
                // } else if (['Alt', 'ALT(L)'].includes(which.key)) {
                //   console.log('抬起Alt键')
                // } else if (['Meta', 'WIN', 'win'].includes(which.key)) {
                //   console.log('抬起win键')
                // } else if (['@'].includes(which.key)) {
                //   this.keySpecailUp(which)
                // } else if (['大写', '小写', '隐藏', '符', '控制码', '返回'].includes(which.key)) {
                //   return
                // } else if (['CTRL(R)'].includes(which.key)) {
                //   console.log('抬起CTRL(R)键')
                // } else if (['SHIFT(R)'].includes(which.key)) {
                //   console.log('抬起SHIFT(R)键')
                // } else if (['ALT(R)'].includes(which.key)) {
                //   console.log('抬起ALT(R)键')
                // } else {
                //   console.log('抬起其他键')
                // }
            },
            // 特殊符号
            keySignDown(item, index) {
                // console.log('特殊符号', item, index)
                // this.activeClass = index
                this.$emit('keySignDownTextKeyboard', item, index + 200)
            },
            // 特殊按键的抬起
            keySpecailUp(item) {
                // console.log('特殊按键的抬起', item)
                // this.activeClass = -1
                this.$emit('keySpecailUp', item)
            }
        }
    }
</script>

<style lang="less" scoped>
    button {
        border-radius: 0px;

        span {
            color: #fff;
            font-size: 20.3px;
        }
    }
    .base {
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;
        background-size: contain;
    }

    .basic_active {
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic_hover.png') no-repeat;
        background-size: contain;
    }

    .special_active {
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special_hover.png') no-repeat !important;
        background-size: contain !important;
    }

    .confirm_active {
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm_hover.png') no-repeat !important;
        background-size: contain !important;
    }

    .key_tip {
        position: absolute;
        width: 120px;
        height: 78px;
        line-height: 78px;
        text-align: center;
        font-size: 33.33px;
        font-weight: bolder;
        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/key_tip.png') no-repeat;
        background-size: contain;
        left: 50%;
        top: -110%;
        transform: translateX(-50%);
    }



    /*css[竖向定义样式]*/
    @media screen and (orientation:portrait) {
        #keys {
            position: absolute;
            bottom: 0;
            width: 100%;
            /*height: 401.4px;*/
            background: rgba(23, 29, 51, 0.7);
            z-index: 11; // 问题31
            padding: 38.3px 1.5vh 28.3px 1.5vh;
            box-sizing: border-box;

            #allKey {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;

                button {
                    /*height: 6.4vw;*/
                    /*width: 6.4vw;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vh;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;

                    span {
                        font-size: 18.7px;
                    }
                    .english{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    i {
                        font-style: normal;
                    }
                }

                .space_active {
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/space_hover.png') no-repeat !important;
                    background-size: contain !important;
                }

                .letter {
                    /*width: 78%;*/
                    /*width:918px;*/
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    /*position: absolute;*/
                    /*left: 0px;*/

                    button:nth-child(1),
                    button:nth-child(12),
                    button:nth-child(22),
                    button:nth-child(23),
                    button:nth-child(24),
                    button:nth-child(33),
                    button:nth-child(34),
                    button:nth-child(36),
                    button:nth-child(37) {
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                        background-size: contain;
                    }

                    button:nth-child(11) {
                        margin-right: 0;
                    }

                    button:nth-child(22) {
                        margin-right: 0;

                        span {
                            opacity: 0;
                        }
                    }

                    button:nth-child(32) {
                        /*width: 13.3vw;*/
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat;
                        background-size: contain;
                        margin-right:0;
                    }

                    button:nth-child(35) {
                        /*width: 47.8vw;*/
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/space.png') no-repeat;
                        background-size: contain;
                    }
                    button:nth-child(23),
                    button:nth-child(24),
                    button:nth-child(33),
                    button:nth-child(34){
                        span{
                            font-size: 16px;
                        }
                    }
                }

                .number {
                    /*width: 22%;*/
                    /*display:flex;*/
                    /*flex-direction: row;*/
                    /*flex-wrap: wrap;*/
                    /*justify-content: flex-end;*/
                    /*position: absolute;*/
                    /*right: 0px;*/
                    text-align:right;

                    button:nth-child(3n) {
                        margin-right: 0;
                    }

                    button:nth-child(10),
                    button:nth-child(12) {
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                        background-size: contain;
                    }
                }
            }

            #sign {
                button {
                    /*height: 78px;*/
                    /*width: 12%;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vh;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;
                    background-color: transparent;

                    span {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    i {
                        font-style: normal;
                    }
                }
                button:nth-child(1){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                    background-size: contain;
                }
            }

            #speCtrl {
                button {
                    /*height: 78px;*/
                    /*width: 10.6%;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vh;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;
                    background-color: transparent;

                    span {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    i {
                        font-style: normal;
                    }
                }
                button:nth-child(1),
                button:nth-child(11),
                button:nth-child(21),
                button:nth-child(32){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                    background-size: contain;
                }
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat;
                    background-size: contain;
                }
            }
        }
    }
    @media only screen and (orientation:portrait) and (max-height: 800px ) {
        button{
            width:6.4vh;
            height:6.4vh;
        }
        #allKey{
            button:nth-child(32) {
                width: 13.3vh;
            }

            button:nth-child(35) {
                width: 47.8vh;
            }
            img {
                width: 2.4vh;
                height: 2.4vh;
            }
        }
        #speCtrl{
            padding:0 2vh;
            button:nth-child(8),
            button:nth-child(9),
            button:nth-child(10),
            button:nth-child(18),
            button:nth-child(19),
            button:nth-child(20),
            button:nth-child(22),
            button:nth-child(27),
            button:nth-child(28),
            button:nth-child(29),
            button:nth-child(30),
            button:nth-child(31),
            button:nth-child(33),
            button:nth-child(34),
            button:nth-child(35),
            button:nth-child(36){
                width: 13.3vh;
            }
        }
        #sign{
            padding:0 10vh;
            button:last-child{
                width: 13.3vh;
                background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                background-size: contain !important;
                margin-right:0!important;
            }
        }

    }
    @media only screen and (orientation:portrait) and (min-height: 800px ) {
        .noFullScreen{
            button{
                width:5.2vh;
                height:5.2vh;
            }
            #allKey{
                button:nth-child(32) {
                    width: 10.9vh;
                }

                button:nth-child(35) {
                    width: 39vh;
                }
                img {
                    width: 2vh;
                    height: 2vh;
                }
            }
            #speCtrl{
                padding:0 2vh;
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    width: 10.9vh;
                }
            }

            #sign{
                padding:0 7vh;
                button:last-child{
                    width: 10.9vh;
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                    background-size: contain !important;
                    margin-right:0!important;
                }
            }
        }
        .fullScreen{
            button{
                width:5.7vh;
                height:5.7vh;
            }
            #allKey{
                button:nth-child(32) {
                    width: 11.9vh;
                }

                button:nth-child(35) {
                    width: 42.9vh;
                }
                img {
                    width: 2vh;
                    height: 2vh;
                }
            }
            #speCtrl{
                padding:0 2vh;
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    width: 11.9vh;
                }
            }
            #sign{
                padding:0 10vh;
                button:last-child{
                    width: 11.9vh;
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                    background-size: contain !important;
                    margin-right:0!important;
                }
            }
        }
    }

    /*css[横向定义样式]*/
    @media screen and (orientation:landscape) {
        #keys {
            position: absolute;
            bottom: 0;
            width: 100%;
            /*height: 401.4px;*/
            background: rgba(23, 29, 51, 0.7);
            z-index: 11; // 问题31
            padding: 38.3px 1.5vw 28.3px 1.5vw;
            box-sizing: border-box;

            #allKey {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;

                button {
                    /*height: 6.4vw;*/
                    /*width: 6.4vw;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vw;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;

                    span {
                        font-size: 18.7px;
                    }
                    .english{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    i {
                        font-style: normal;
                    }
                }

                .space_active {
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/space_hover.png') no-repeat !important;
                    background-size: contain !important;
                }

                .letter {
                    /*width: 78%;*/
                    /*width:918px;*/
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    /*position: absolute;*/
                    /*left: 0px;*/

                    button:nth-child(1),
                    button:nth-child(12),
                    button:nth-child(22),
                    button:nth-child(23),
                    button:nth-child(24),
                    button:nth-child(33),
                    button:nth-child(34),
                    button:nth-child(36),
                    button:nth-child(37) {
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                        background-size: contain;
                    }

                    button:nth-child(11) {
                        margin-right: 0;
                    }

                    button:nth-child(22) {
                        margin-right: 0;

                        span {
                            opacity: 0;
                        }
                    }

                    button:nth-child(32) {
                        /*width: 13.3vw;*/
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat;
                        background-size: contain;
                        margin-right:0;
                    }

                    button:nth-child(35) {
                        /*width: 47.8vw;*/
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/space.png') no-repeat;
                        background-size: contain;
                    }
                    button:nth-child(23),
                    button:nth-child(24),
                    button:nth-child(33),
                    button:nth-child(34){
                        span{
                            font-size: 16px;
                        }
                    }
                }

                .number {
                    /*width: 22%;*/
                    /*display:flex;*/
                    /*flex-direction: row;*/
                    /*flex-wrap: wrap;*/
                    /*justify-content: flex-end;*/
                    /*position: absolute;*/
                    /*right: 0px;*/
                    text-align:right;

                    button:nth-child(3n) {
                        margin-right: 0;
                    }

                    button:nth-child(10),
                    button:nth-child(12) {
                        background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                        background-size: contain;
                    }
                }
            }

            #sign {
                button {
                    /*height: 78px;*/
                    /*width: 12%;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vw;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;
                    background-color: transparent;

                    span {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    i {
                        font-style: normal;
                    }
                }
                button:nth-child(1){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                    background-size: contain;
                }
            }

            #speCtrl {
                button {
                    /*height: 78px;*/
                    /*width: 10.6%;*/
                    text-align: center;
                    /*background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/basic.png') no-repeat;*/
                    /*background-size: contain;*/
                    border: none;
                    margin-right: 0.5vw;
                    margin-bottom: 6px;
                    font-weight: bold;
                    position: relative;
                    background-color: transparent;

                    span {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    i {
                        font-style: normal;
                    }
                }
                button:nth-child(1),
                button:nth-child(11),
                button:nth-child(21),
                button:nth-child(32){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/special.png') no-repeat;
                    background-size: contain;
                }
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat;
                    background-size: contain;
                }
            }
        }
    }
    @media only screen and (orientation:landscape) and (max-width: 800px ) {
        button{
            width:6.4vw;
            height:6.4vw;
        }
        #allKey{
            button:nth-child(32) {
                width: 13.3vw;
            }

            button:nth-child(35) {
                width: 47.8vw;
            }
            img {
                width: 2.4vw;
                height: 2.4vw;
            }
        }
        #speCtrl{
            padding:0 2vw;
            button:nth-child(8),
            button:nth-child(9),
            button:nth-child(10),
            button:nth-child(18),
            button:nth-child(19),
            button:nth-child(20),
            button:nth-child(22),
            button:nth-child(27),
            button:nth-child(28),
            button:nth-child(29),
            button:nth-child(30),
            button:nth-child(31),
            button:nth-child(33),
            button:nth-child(34),
            button:nth-child(35),
            button:nth-child(36){
                width: 13.3vw;
            }
        }
        #sign{
            padding:0 10vw;
            button:last-child{
                width: 13.3vw;
                background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                background-size: contain !important;
                margin-right:0!important;
            }
        }

    }
    @media only screen and (orientation:landscape) and (min-width: 800px ) {
        .noFullScreen{
            button{
                width:5.2vw;
                height:5.2vw;
            }
            #allKey{
                button:nth-child(32) {
                    width: 10.9vw;
                }

                button:nth-child(35) {
                    width: 39vw;
                }
                img {
                    width: 2vw;
                    height: 2vw;
                }
            }
            #speCtrl{
                padding:0 2vw;
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    width: 10.9vw;
                }
            }

            #sign{
                padding:0 7vw;
                button:last-child{
                    width: 10.9vw;
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                    background-size: contain !important;
                    margin-right:0!important;
                }
            }
        }
        .fullScreen{
            button{
                width:5.7vw;
                height:5.7vw;
            }
            #allKey{
                button:nth-child(32) {
                    width: 11.9vw;
                }

                button:nth-child(35) {
                    width: 42.9vw;
                }
                img {
                    width: 2vw;
                    height: 2vw;
                }
            }
            #speCtrl{
                padding:0 2vw;
                button:nth-child(8),
                button:nth-child(9),
                button:nth-child(10),
                button:nth-child(18),
                button:nth-child(19),
                button:nth-child(20),
                button:nth-child(22),
                button:nth-child(27),
                button:nth-child(28),
                button:nth-child(29),
                button:nth-child(30),
                button:nth-child(31),
                button:nth-child(33),
                button:nth-child(34),
                button:nth-child(35),
                button:nth-child(36){
                    width: 11.9vw;
                }
            }
            #sign{
                padding:0 10vw;
                button:last-child{
                    width: 11.9vw;
                    background: url('https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/keyboard/confirm.png') no-repeat !important;
                    background-size: contain !important;
                    margin-right:0!important;
                }
            }
        }
    }
</style>
