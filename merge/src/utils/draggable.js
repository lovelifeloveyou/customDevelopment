import Vue from 'vue'

Vue.directive('draggable', {
  // binding 参数格式 { onEnd: function(pos) { 回调post有left, top属性 }, dragEl: '拖动元素选择器' }
  bind: function (el, binding, vnode, oldVnode) {
    let elLeft, elTop // 元素起始定位
    let eX, eY  // 开始时的坐标，用于计算移动值
    let maxLeft, maxTop // 不能拉出界限
    let minLeft = 0, minTop = 0
    let start = 0

    let move = function (e) {
      el.style.left = Math.min(maxLeft, Math.max(minLeft, elLeft + (e.clientX - eX))) + 'px'
      el.style.top = Math.min(maxTop, Math.max(minTop, elTop + (e.clientY - eY))) + 'px'
    }
    let moveEnd = function (e) {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', moveEnd)

      let pos = {
        left: parseInt(el.style.left),
        top: parseInt(el.style.top)
      }
      if (pos.left != elLeft || pos.top != elTop) {
        binding.value.onEnd && binding.value.onEnd(pos)
      }
    }

    setTimeout(() => {
      (binding.value.dragEl ? el.querySelector(binding.value.dragEl) : el).addEventListener('mousedown', (e) => {
        let style = getComputedStyle(el)
        elLeft = parseInt(style.left)
        elTop = parseInt(style.top)
        eX = e.clientX
        eY = e.clientY
        maxLeft = document.body.clientWidth - parseInt(style.width)
        maxTop = document.body.clientHeight - parseInt(style.height)

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', moveEnd)
      })
    })
  }
})

function detectOrient() {
  var storage = localStorage;
  var data = storage.getItem('J-recordOrientX');
  var w = document.documentElement.clientWidth,
      h = document.documentElement.clientHeight;

  var _Width = 0,
      _Height = 0;
  if(!data) {
      _Width = window.screen.width;
      _Height = window.screen.height;
      storage.setItem('J-recordOrientX',_Width + ',' + _Height);
  }else {
      var str = data.split(',');
      _Width = str[0];
      _Height = str[1];
  }

  if(w == _Width) {
      // 竖屏
      return;
  }
  if(w == _Height){
      // 横屏
      return;
  }
}
detectOrient();
window.addEventListener('resize',detectOrient);