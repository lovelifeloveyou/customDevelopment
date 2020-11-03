<template>
	<div class="mouse_Comp" style="padding-top: 16%;">
		<div class="mouseComp">
			<ul class="mouseContent">
				<li @click="addMouse('左键')">
					<div>
						<img src="@/assets/img/mouseComp/鼠标选项_左键.png" />
					</div>
					<span>左键</span>
				</li>
				<li @click="addMouse('右键')">
					<div>
						<img src="@/assets/img/mouseComp/鼠标选项_右键.png" />
					</div>
					<span>右键</span>
				</li>
				<li @click="addMouse('中键')">
					<div>
						<img src="@/assets/img/mouseComp/鼠标选项_中键.png" />
					</div>
					<span>中键</span>
				</li>
				<li @click="addMouse('滚轮上')">
					<div>
						<img src="@/assets/img/mouseComp/鼠标选项_滚轮上.png" />
					</div>
					<span>滚轮上</span>
				</li>
				<li @click="addMouse('滚轮下')">
					<div>
						<img src="@/assets/img/mouseComp/鼠标选项_滚轮下.png" />
					</div>
					<span>滚轮下</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import tools from '@/utils/tools'

export default {
	name: "mouse",
	data() {
		return {
			compMsg: [],
			videosTop: 0
		};
	},
	computed: {
		...mapGetters([
			'fullScreenShow'
		])
	},
	watch: {
		fullScreenShow () {
			this.sizeAdaptive()
		}
	},
	mounted () {
		this.sizeAdaptive()
	},
	methods: {
		addMouse(typeMsg) {
			this.$emit('showDragBall', true)
			let newData = {
				id: "",
				keyPressMode: "1",
				keyName: typeMsg,
				keyRealName: "",
				keyStyle: 0,
				keyWidth: 50,
				keyHeight: 50,
				rockerType: "-1",
				keySize: 5,
			};
			this.$emit("func", newData);
			this.$emit("clkClose", "close");
		},
		sizeAdaptive () {
			let screenInfo = tools.getScreenInfo()
			this.videosTop = screenInfo.top
		}
	}
};
</script>

<style scoped lang="less">
div {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.mouseComp {
	.mouseContent {
		width: 60%;
		height: 166.7px;
		background-color: #161f1999; //问题24
		// border: 1px solid #0e4a55;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 1500;
		li {
			div {
				width: 83.3px;
				height: 83.3px;
				border-radius: 43.3px;
				border: 3.3px solid #0e4a55;
				img {
					width: 83.3px;
					height: 66.7px;
				}
			}
			span {
				color: #0e4a55;
				font-size: 26px;
				font-weight: bold;
			}
		}
	}
}
</style>
