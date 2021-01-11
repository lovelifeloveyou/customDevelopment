<template>
    <div class="handle_tips" v-if="tipsShow">
        <div class="head">
            <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips_back.png" alt="" @click="close">
            <p>鼠标模式操作说明</p>
            <div>
                <span v-show="timer">{{timer}}s</span>
                <span @click="close">开始使用</span>
            </div>
        </div>
        <div class="tips">
            <div>
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips1.png" alt="">
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips2.png" alt="">
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips3.png" alt="">
            </div>
            <div>
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips4.png" alt="">
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips5.png" alt="">
                <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/course/tips6.png" alt="">
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "tips",
        data() {
            return {
                timer: 10,
                tipsShow: true,
                interval: null
            }
        },
        methods: {
          close() {
              this.tipsShow = false
              clearInterval(interval)
          }
        },
        mounted() {
           this.interval = setInterval(() => {
                this.timer--
                if (this.timer === 0) {
                    clearInterval(this.interval)
                    this.tipsShow = false
                }
            }, 1000)
        }
    }
</script>

<style lang="less" scoped>
.handle_tips{
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background: rgba(28, 28, 28, 0.9);
    .head{
        width:100%;
        height:66px;
        display: flex;
        flex-direction: row;
        align-items: center;
        /*justify-content: space-between;*/
        padding:0 15px 0 11px;
        font-size:25px;
        box-sizing: border-box;
        color:#fff;
        img{
            width:26px;
            margin-right:auto;
        }
        p{
            position: absolute;
            left:50%;
            transform: translateX(-50%);
        }
        div{
            margin-left:auto;
        }
        span{
            color: #FFCF2A;
            font-size:20px;
        }
        span:nth-child(1){
            margin-right:10px;
        }
    }
    .tips{
        width:100%;
        padding:0 76px;
        height:calc(100% - 66px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        div{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            img{
                width:270px;
            }
        }
        div:nth-child(1){
            margin-bottom:16px;
        }
    }
}
</style>
