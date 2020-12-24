const MescrollMixins = {
	data() {
		mescroll: null
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
		})
	},
	beforeRouteLeave(to, from, next) {
		this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
		next()
	}
}

export default MescrollMixins
