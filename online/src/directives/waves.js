import Vue from 'vue'
import store from '../store'

Vue.directive('waves', { 
	bind: function(el, binding) { 
		el.classList.add('waves-effect'); 
		let modifiers = Object.keys(binding.modifiers)[0], duration = +binding.expression || 200; 
		!!modifiers && el.classList.add(`waves-${modifiers}`); 
		function convertStyle(obj) { 
			let style = ''; 
			for (let a in obj) { 
				if (obj.hasOwnProperty(a)) { 
					style += `${a}:${obj[a]};` 
				} 
			} 
			return style; 
		}
		if (store.state.mouseMode) {
			el.addEventListener('touchstart', function(e) {
				let ripple = document.createElement('div'); 
				ripple.classList.add('waves-ripple'); 
				el.appendChild(ripple); 
				let styles = { 
					left: `${e.touches[0].pageX}px`, 
					top: `${e.touches[0].pageY}px`, 
					opacity: 1, 
					transform: `scale(${((el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight) / 300)})`, 
					'transition-duration': `${duration}ms`, 
					'transition-timing-function': 'ease-in-out' 
				}; 
				ripple.setAttribute('style', convertStyle(styles)); 
				setTimeout(function() { 
					ripple.setAttribute('style', convertStyle({ 
						opacity: 0, 
						transform: styles.transform, 
						left: styles.left, 
						top: styles.top, 
					})); 
					setTimeout(function() { 
						ripple && el.removeChild(ripple); 
					}, duration * 3); 
				}, duration); 
			}); 
		}
	}, 
});