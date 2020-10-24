import GamepadListener from './GamepadListener'

export function init () {
  var listener = new GamepadListener({}, false)
  listener.on('gamepad:connected', function (e) {
    console.log('connected', e)
  })

  listener.on('gamepad:disconnected', function (e) {
    console.log('gamepad has just been disconnected, press a button', e)
  })

  listener.on('gamepad:axis', function (e) {
    var index = e.detail.gamepad.index,
      axis = e.detail.axis,
      value = e.detail.value
    // console.log(`转动摇杆, ${index}, ${axis}, ${value}`)
  })

  listener.on('gamepad:button', function (e) {
    var button = e.detail.button,
      index = e.detail.gamepad.index,
      pressed = e.detail.pressed
    // console.log(`Button ${index}, ${button}, ${pressed} pressed`)
    if (pressed) {
      console.log('listener', listener)
      keyPressHandle(button)
    } else {
      liftUpKey(button)
    }
  })

  listener.start()
}

function keyPressHandle (key) {
  console.log(`${key}按键被按下`)
  let btnInfo = {key: '', keyCode: ''}
  switch (key) {
    case 0:  // A
      btnInfo = {key: 'a', keyCode: 65}
      break
    case 1: // B
      btnInfo = {key: 'b', keyCode: 66}
      break
    case 2: // X
      btnInfo = {key: 'x', keyCode: 88}
      break
    case 3: // Y
      btnInfo = {key: 'y', keyCode: 89}
      break
  }
}

function liftUpKey (key) {
  console.log(`${key}按键被松开`)
  let btnInfo = {key: '', keyCode: ''}
  switch (key) {
    case 0:  // A
      btnInfo = {key: 'a', keyCode: 65}
      break
    case 1: // B
      btnInfo = {key: 'b', keyCode: 66}
      break
    case 2: // X
      btnInfo = {key: 'x', keyCode: 88}
      break
    case 3: // Y
      btnInfo = {key: 'y', keyCode: 89}
      break
  }
}

// window.addEventListener('load', init)