<template>
    <div id="direction" :style="{backgroundImage:'url(' + coverImgUrl[index] + ')'}">
        <button
        v-for="(item, index) in directions"
        :key="index"
        @touchstart.stop.prevent="directionStart(item, $event)"
        @touchmove="directionMove(item, $event)"
        @touchend = "directionEnd(item)"
        ><span>{{item.key}}</span></button>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import directionO from '@/assets/img/directionO.png'
import directionW from '@/assets/img/directionW.png'
import directionS from '@/assets/img/directionS.png'
import directionA from '@/assets/img/directionA.png'
import directionD from '@/assets/img/directionD.png'
import directionAW from '@/assets/img/directionAW.png'
import directionAS from '@/assets/img/directionAS.png'
import directionWD from '@/assets/img/directionWD.png'
import directionSD from '@/assets/img/directionSD.png'
export default {
    name: 'Direction',
    data() {
        return {
            index: 0,
            coverImgUrl: [
                directionO,
                directionW,
                directionS,
                directionA,
                directionD,
                directionAW,
                directionAS,
                directionWD,
                directionSD
            ],
            directions: [
                {key: 'W', keyCode: 87},
                {key: 'S', keyCode: 83},
                {key: 'A', keyCode: 65},
                {key: 'D', keyCode: 68},
                {key: 'AW', keyCode: [65, 87]}, // 左上
                {key: 'AS', keyCode: [65, 83]}, // 左下
                {key: 'WD', keyCode: [68, 83]}, // 右上
                {key: 'SD', keyCode: [87, 68]} // 右下
            ],
        }
    },
    computed: {
        ...mapGetters([
            'keyArray',
            'lastBtnMsg'
        ])
    },
    methods: {
        ...mapMutations([
            'set_LastBtn',
            'set_key',
            'delete_key'
        ]),
        // 开始触摸方向盘
        directionStart(which, event) {
            console.log('direction key down')
            console.log(which)
            for(let i=0;i<this.keyArray.length; i++) {
                if(this.keyArray[i] == which.keyCode) {
                    return;
                }
            }
            if(which.key === "W") {
                this.index = 1;
            }else if(which.key === "S") {
                this.index = 2;
            }else if(which.key === "A") {
                this.index = 3;
            }else if(which.key === "D") {
                this.index = 4;
            }else if(which.key === "AW") {
                this.index = 5;
            }else if(which.key === "AS") {
                this.index = 6;
            }else if(which.key === "WD") {
                this.index = 7;
            }else if(which.key === "SD") {
                this.index = 8;
            }
            // let pageX = event.pageX;
            // let pageY = event.pageY;
            this.set_LastBtn(which.key)
            this.set_key(which)
            console.log('key down')
            console.log(which)
            console.log(event)
            console.log('direction key down' + this.keyArray)
        },
        // 方向盘的移动
        directionMove(which, event) {
            console.log('direction move')
            let nowBtnX = event.targetTouches[0].pageX;
            let nowBtnY = event.targetTouches[0].pageY;
            let diffBtnX = nowBtnX - this.lastBtnMsg.lastBtnX;
            let diffBtnY = nowBtnY - this.lastBtnMsg.lastBtnY;
            console.log('touch 位置')
            console.log('diffBtnX' + diffBtnX);
            console.log('diffBtnX' + diffBtnY);
            console.log('lastBtnX' + this.lastBtnMsg.lastBtnX);
            console.log('lastBtnX' + this.lastBtnMsg.lastBtnY)
            console.log('nowBtnX' + nowBtnX)
            console.log('nowBtnY' + nowBtnY)
            if((diffBtnX<15)&&(diffBtnX>-15)&&(diffBtnY>20)&&(diffBtnY<50)) {
                this.index = 1;
                console.log('lastBtn:' + this.lastBtnMsg.lastBtn)
                if(this.lastBtnMsg.lastBtn === 'AW') {
                    this.delete_key(65)
                }else if(this.lastBtnMsg.lastBtn === 'WD') {
                    this.delete_key(68)
                }
                this.set_LastBtn('W')
            }else if((diffBtnX>-15)&&(diffBtnX<15)&&(diffBtnY>-50)&&(diffBtnY<-20)) {
                this.index = 2;
                if(this.lastBtnMsg.lastBtn === 'AS') {
                    this.delete_key(65)
                }else if(this.lastBtnMsg.lastBtn === 'SD') {
                    this.delete_key(68)
                }
                this.set_LastBtn('S')
            }else if((diffBtnX>-50)&&(diffBtnX<-20)&&(diffBtnY>-15)&&(diffBtnY<15)) {
                this.index = 3;
                if(this.lastBtnMsg.lastBtn === 'AW') {
                    this.delete_key(87)
                }else if(this.lastBtnMsg.lastBtn === 'AS') {
                    this.delete_key(83)
                }
                this.set_LastBtn('A')
            }else if((diffBtnX>20)&&(diffBtnX<50)&&(diffBtnY>-15)&&(diffBtnY<15)) {
                this.index = 4;
                if(this.lastBtnMsg.lastBtn === 'WD') {
                    this.delete_key(87)
                }else if(this.lastBtnMsg.lastBtn === 'SD') {
                    this.delete_key(83)
                }
                this.set_LastBtn('D')
            }else if((diffBtnX>-50)&&(diffBtnX<-15)&&(diffBtnY>15)&&(diffBtnY<50)) {
                this.index = 5;
                if(this.lastBtnMsg.lastBtn === 'A') {
                    this.set_key(this.directions[0])
                }else if(this.lastBtnMsg.lastBtn === 'W') {
                    this.set_key(this.directions[2])
                }
                this.set_LastBtn('AW')
            }else if((diffBtnX>-50)&&(diffBtnX<-15)&&(diffBtnY>-50)&&(diffBtnY<-15)) {
                this.index = 6;
                if(this.lastBtnMsg.lastBtn === 'A') {
                    this.set_key(this.directions[1])
                }else if(this.lastBtnMsg.lastBtn === 'S') {
                    this.set_key(this.directions[2])
                }
                this.set_LastBtn('AS')
            }else if((diffBtnX>15)&&(diffBtnX<50)&&(diffBtnY>15)&&(diffBtnY<50)) {
                this.index = 7;
                if(this.lastBtnMsg.lastBtn === 'W') {
                    this.set_key(this.directions[3])
                }else if(this.lastBtnMsg.lastBtn === 'D') {
                    this.set_key(this.directions[0])
                }
                this.set_LastBtn('WD')
            }else if((diffBtnX>15)&&(diffBtnX<50)&&(diffBtnY>-50)&&(diffBtnY<-15)) {
                this.index = 8
                if(this.lastBtnMsg.lastBtn === 'S') {
                    this.set_key(this.directions[3])
                }else if(this.lastBtnMsg.lastBtn === 'D') {
                    this.set_key(this.directions[1])
                }
                this.set_LastBtn('SD')
            }
            console.log('direction key move:' + this.keyArray)
        },

        // 方向键的抬起
        directionEnd(which) {
            let keyVal = which.keyCode;
            for(let i=0; i< this.keyArray.length; i++) {
                this.delete_key(which.keyCode)
            }
            console.log('direction key up:' + this.keyArray)
        }
    }
}
</script>

<style scoped lang="less" src="./index.less"></style>