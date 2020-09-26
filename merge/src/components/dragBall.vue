<template>
	<div style="width: 100%; height: 100%;" v-show="showDrag">
		<button style="text-align: initial !important;" @click="onClick" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end"  ref="fu" class="float">
			悬浮
		</button>
	</div>
</template>

<script>
export default {
	name:'',
	props: {
    horizontalScreen: Boolean,
    showDrag: Boolean
	},
	data () {
		return {
			flags: false,//控制使用
			position: {
				x: 0,
				y: 0
			},
			nx: '',
			ny: '',
			dx: '',
			dy: '',
			xPum: '',
			yPum: ''
		}
	},
	methods:{
		down() {
      console.log('dragBall Down')
			this.flags = true;
			var touch;
			if (event.touches) {
				touch = event.touches[0];
			} else {
				touch = event;
			}
			this.position.x = touch.clientX;
			this.position.y = touch.clientY;
			this.dx = this.$refs.fu.offsetLeft;
      this.dy = this.$refs.fu.offsetTop;
      console.log('111', this.position.x, this.position.y)
		},
		move() {
      console.log('dragBall Move')
			if (this.flags) {
				var touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				this.nx = touch.clientX - this.position.x;
				this.ny = touch.clientY - this.position.y;
				this.xPum = this.dx + this.nx;
				this.yPum = this.dy + this.ny;
				let width=window.innerWidth - this.$refs.fu.offsetWidth//屏幕宽度减去自身控件宽度
				let height=window.innerHeight - this.$refs.fu.offsetHeight//屏幕高度减去自身控件高度
				this.xPum < 0 && (this.xPum = 0)
				this.yPum < 0 && (this.yPum = 0)
				this.xPum > width && (this.xPum = width)
				this.yPum > height && (this.yPum = height)
				// if (this.xPum >= 0 && this.yPum >= 0 && this.xPum<= width &&this.yPum<= height) {
					this.$refs.fu.style.left = this.xPum + 'px';
					this.$refs.fu.style.top = this.yPum + 'px';
				// }
				//阻止页面的滑动默认事件
				document.addEventListener(
					'touchmove',
					function() {
						event.preventDefault();
					},
					false
				);
			}
		},
		//鼠标释放时候的函数
		end() {
      console.log('dragBall End')
			this.flags = false;
		},
		onClick(){
			//在这里我是作为子组件来使用的
			this.$emit('click')
		}
	},
	watch: {
		horizontalScreen: function () {
			if (this.horizontalScreen) {
				console.log('横屏状态下的位置')
				console.log(this.$refs.fu.style.left)
				console.log(this.$refs.fu.style.top)
			} else {
				console.log('竖屏状态下的位置')
				console.log(this.$refs.fu.style.left)
				console.log(this.$refs.fu.style.top)
			}
			console.log('111', this.$refs.fu.style)
		}
	}
}
</script>

<style lang="less" scoped>
.float {
  width: 48px; 
  height: 48px; 
  border-radius: 50%;
  box-shadow: 0 0 0 12px rgba(0, 222, 22, 0.6);
  position: fixed;
  // right: 0px; 
  bottom: 0px; 
  text-align: center;
  line-height: 48px; 
}
</style>


