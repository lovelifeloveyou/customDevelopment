let connectivityStatus, gamepad, connectivityInterval

window.addEventListener('gamepadconnected', function () {
  gamepad = navigator.getGamepads()[0]
  connectivityStatus = `${gamepad.id}  ${gamepad.buttons.length} Buttons | ${gamepad.axes.length} Axes`
  console.log(connectivityStatus)

  connectivityInterval = setInterval(runGamepad, 100)
})

window.addEventListener('gamepaddisconnected', function (e) {
  if (e.gamepad.index === gamepad.index) {
    clearInterval(connectivityInterval)
    connectivityStatus = `Gamepad disconnected`
    console.log(connectivityStatus)
  }
})

const runGamepad = () => {
  let gamepadObject = navigator.getGamepads()[0]
  let buttons = gamepadObject.buttons
  let axes = gamepadObject.axes

  for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
    if (buttons[buttonIndex].value > 0.4) {
      keyHandler(buttonIndex)
    }
  }

  for (let axesIndex = 0; axesIndex < axes.length; axesIndex += 2) {
    if (axes[axesIndex] > 0.4 || axes[axesIndex] < -0.4 || axes[axesIndex + 1] > 0.4 || axes[axesIndex + 1] < -0.4) {
      let stick = axesIndex === 0 ? 'Left' : 'Right'
      console.log(`Moved ${stick} Stick by (${axes[axesIndex]}, ${axes[axesIndex + 1]})`)

      if (axesIndex === 0) {
        window.scrollBy(axes[axesIndex] * 80, axes[axesIndex + 1] * 80)
      }

      if (axesIndex === 2) {
        if (axes[axesIndex] < 0 || axes[axesIndex + 1] < 0) {
          arrowKeyEventHandler(upKey)
        } else if (axes[axesIndex] > 0 || axes[axesIndex + 1] > 0) {
          arrowKeyEventHandler(downKey)
        }
      }
    }
  }
}

const keyHandler = buttonIndex => {
  if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(buttonIndex)) {
    console.log('按键按下')
  } else {
    console.log('操控遥感')
  }
}