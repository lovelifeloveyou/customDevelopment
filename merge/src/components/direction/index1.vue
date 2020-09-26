<template>
    <div id="direction">
        <button
        v-for="(item, index) in directions"
        :key="index"
        @touchstart="directionStart(item, $event)"
        @touchmove="directionMove(item, $event)"
        @touchend = "directionEnd(item)"
        ><span>{{item.key}}</span></button>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'Direction',
    data() {
        return {
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
            'keyArray'
        ])
    },
    methods: {
        ...mapMutations([
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
            this.set_key(which)
            console.log('key down')
            console.log(which)
            console.log(event)
            console.log('direction key down' + this.keyArray)
        },
        // 方向盘的移动
        directionMove(which, event) {
            console.log('direction move')
            
            console.log('direction key move:' + this.keyArray)
        },

        // 方向键的抬起
        directionEnd(which) {
            this.delete_key(which.keyCode)
            console.log('direction key up:' + this.keyArray)
        }
    }
}
</script>

<style scoped lang="less" src="./index.less"></style>