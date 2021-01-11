<template>
    <div class="bar_parent" style="padding-top: 16%;">
        <div class="bar-item">
            <p>拖拽型</p>
            <ul>
                <li @click="addBar(1,101,0)">
					<div>
						<img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/barComp/dragLetter.png" />
					</div>
					<p>WASD</p>
				</li>
                <li @click="addBar(1,102,1)">
                    <div>
                        <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/barComp/dragDire.png" />
                    </div>
                    <p>上下左右</p>
                </li>
            </ul>
        </div>
        <div class="bar-item">
            <p>按键型</p>
            <ul>
                <li @click="addBar(0,103,2)">
                    <div>
                        <img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/barComp/pressLetter.png" />
                    </div>
                    <p>WASD</p>
                </li>
                <li @click="addBar(0,104,3)">
					<div>
						<img src="https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/floatBall/barComp/pressDire.png" />
					</div>
					<p>上下左右</p>
				</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tools from '@/utils/tools'
export default {
    name: "bar",
    data() {
        return {
            compMsg: [],
            betweenRoller: [
				{
					id: '',
					keyPressMode: "1",
					keyName: "拖动上下左右",
					keyStyle: 1,
					rockerType: 101,
					keyHeight: 130,
					keyWidth: 130,
					keyLeft: '',
					keyTop: '',
					isDirection: true,
					type: 'move',
					keySize: 5
				},
				{
					id: '',
					keyPressMode: "1",
					keyName: "拖动上下左右",
					keyStyle: 1,
					rockerType: 102,
					keyHeight: 130,
					keyWidth: 130,
					keyLeft: '',
					keyTop: '',
					isDirection: true,
					type: 'move',
					keySize: 5
				},
				{
					id: '',
					keyPressMode: "1",
					keyName: "按键WASD",
					keyStyle: 1,
					rockerType: 103,
					keyHeight: 130,
					keyWidth: 130,
					keyLeft: '',
					keyTop: '',
					isDirection: true,
					type: 'button',
					keySize: 5
				},
				{
					id: '',
					keyPressMode: "1",
					keyName: "按键WASD",
					keyStyle: 1,
					rockerType: 104,
					keyHeight: 130,
					keyWidth: 130,
					keyLeft: '',
					keyTop: '',
					isDirection: true,
					type: 'button',
					keySize: 5
				}
            ]
        };
    },
    methods: {
        addBar(keyStyle, rockerType, num) {
            let newData = this.betweenRoller[num];
			let newNum = [0,1].includes(num) ? 1 : 2;
			this.$emit("func", newData);
			this.$emit("clkClose", "close");
			this.$emit("rollerCurrent", newNum);
        }
    }
};
</script>

<style scoped lang="less">
div {
    display: flex;
    justify-content: center;
    align-items: center;
    div:nth-child(1) {
        margin-right: 1%;
    }
    div:nth-child(2) {
        margin-left: 1%;
    }
    .bar-item {
        width: 35%;
        height: 250px;
        background-color: #161f1999;
        z-index: 1500;
        display: block;
        p {
            display: block;
			margin: 0px;
			margin-top: 16.7px;
            color: #4fbca6;
            font-size: 26.7px;
            font-weight: bold;
        }
        ul {
            display: flex;

            li {
                display: inline-block;
                flex: 1;
                p {
                    margin: 0px;
                    color: #4fbca6;
                    font-size: 26.7px;
                    line-height: 33.3px;
                    height: 33.3px;
                    font-weight: bold;
                }

                div {
                    height: 150px;
                    img {
                        width: 133.3px;
                        height: 133.3px;
                    }
                }
            }
        }
    }
}
</style>
