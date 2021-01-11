import GamepadListener from "../directives/Gamepad/GamepadListener";
import { mappings } from "../directives/Gamepad/mappings";

export default {
  data () {
    return {
      handleInfomation: {},
      axesLeft: 0,
      axesTop: 0,
    }
  },
  created () {
    console.log("游戏手柄");
    console.log("navigator.getGamepads()", navigator.getGamepads());
    window.addEventListener("gamepadconnected", function (e) {
      console.log(
        "控制器已连接于 %d 位: %s. %d 个按钮, %d 个坐标方向。",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      );
    });
    window.sendAxesInfo = this.sendAxesInfo;
    window.showGamepadName = this.showGamepadName;
    window.keyPressHandle = this.keyPressHandle;
    window.liftUpKey = this.liftUpKey;
    window.addEventListener("load", this.init);
  },
  methods: {
    init() {
      var listener = new GamepadListener({}, false);
      listener.on("gamepad:connected", function (e) {
        console.log("connected", e);
        showGamepadName(e);
      });

      listener.on("gamepad:disconnected", function (e) {
        console.log("gamepad has just been disconnected, press a button", e);
      });

      listener.on("gamepad:axis", function (e) {
        var index = e.detail.gamepad.index,
          axis = e.detail.axis,
          value = e.detail.value;
        console.log("摇杆信息", e.detail.gamepad.axes);
        if (e.detail.gamepad.axes.length) {
          sendAxesInfo(e.detail.gamepad.axes);
        }
        // console.log(navigator.getGamepads()[0])
        console.log(`转动摇杆, ${index}, ${axis}, ${value}`)
      });

      listener.on("gamepad:button", function (e) {
        var button = e.detail.button,
          index = e.detail.gamepad.index,
          pressed = e.detail.pressed;
        console.log(`Button ${index}, ${button}, ${pressed} pressed`)
        if (pressed) {
          keyPressHandle(button);
        } else {
          (button);
        }
      });

      listener.start();
    },
    showGamepadName(info) {
      console.log("gamepad name", info.detail.gamepad.id);
      let pressBtnInfos =
        mappings.find((item) => item.id === info.detail.gamepad.id) &&
        mappings.find((item) => item.id === info.detail.gamepad.id).buttons;
      this.handleInfomation = Object.keys(pressBtnInfos || {});
      console.log(this.handleInfomation);
    },
    keyPressHandle(btn) {
      console.log(`按下${btn}键`);
      let keyPressBtnInfo = {};
      switch (this.handleInfomation[btn]) {
        case "button_1":
          keyPressBtnInfo = { key: "k", keyCode: 75 };
          break;
        case "button_2":
          keyPressBtnInfo = { key: "l", keyCode: 76 };
          break;
        case "button_3":
          keyPressBtnInfo = { key: "j", keyCode: 74 };
          break;
        case "button_4":
          keyPressBtnInfo = { key: "i", keyCode: 73 };
          break;
        case "shoulder_top_left":
          keyPressBtnInfo = { key: "CTRL(L)", keyCode: "" };
          break;
        case "shoulder_top_right":
          keyPressBtnInfo = { key: "o", keyCode: 79 };
          break;
        case "shoulder_bottom_left":
          keyPressBtnInfo = { key: "CTRL(R)", keyCode: "" };
          break;
        case "shoulder_bottom_right":
          keyPressBtnInfo = { key: "p", keyCode: 80 };
          break;
        case "select":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "start":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "stick_button_left":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "stick_button_right":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "d_pad_up":
          this.set_BtnKeyArray(87);
          break;
        case "d_pad_down":
          this.set_BtnKeyArray(83);
          break;
        case "d_pad_left":
          this.set_BtnKeyArray(65);
          break;
        case "d_pad_right":
          this.set_BtnKeyArray(68);
          break;
        case "vendor":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        default:
          console.log("gamepad");
      }
      if (Object.keys(keyPressBtnInfo).length) {
        this.whichKey(keyPressBtnInfo, 0);
      }
    },
    liftUpKey(btn) {
      console.log(`抬起${btn}键`);
      let keyPressBtnInfo = {};
      switch (this.handleInfomation[btn]) {
        case "button_1":
          keyPressBtnInfo = { key: "k", keyCode: 75 };
          break;
        case "button_2":
          keyPressBtnInfo = { key: "l", keyCode: 76 };
          break;
        case "button_3":
          keyPressBtnInfo = { key: "j", keyCode: 74 };
          break;
        case "button_4":
          keyPressBtnInfo = { key: "i", keyCode: 73 };
          break;
        case "shoulder_top_left":
          keyPressBtnInfo = { key: "CTRL(L)", keyCode: "" };
          break;
        case "shoulder_top_right":
          keyPressBtnInfo = { key: "o", keyCode: 79 };
          break;
        case "shoulder_bottom_left":
          keyPressBtnInfo = { key: "CTRL(R)", keyCode: "" };
          break;
        case "shoulder_bottom_right":
          keyPressBtnInfo = { key: "p", keyCode: 80 };
          break;
        case "select":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "start":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "stick_button_left":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "stick_button_right":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        case "d_pad_up":
          this.set_BtnEmptyKey();
          break;
        case "d_pad_down":
          this.set_BtnEmptyKey();
          break;
        case "d_pad_left":
          this.set_BtnEmptyKey();
          break;
        case "d_pad_right":
          this.set_BtnEmptyKey();
          break;
        case "vendor":
          keyPressBtnInfo = { key: "", keyCode: "" };
          break;
        default:
          console.log("gamepad");
      }
      if (Object.keys(keyPressBtnInfo).length) {
        this.KeyEnd(keyPressBtnInfo, 0);
      }
    },
    sendAxesInfo(arr) {
      if (arr.length) {
        const [a, b, c, d] = arr;
        if (a !== 0) {
          this.axesTop -= a;
        } else if (b !== 0) {
          this.axesLeft += b;
        } else if (c !== 0) {
          this.axesTop += c;
        } else if (d !== 0) {
          this.axesLeft -= d;
        }
      }
      if (this.axesLeft === 0 && this.axesTop === 0) {
        this.set_BtnEmptyKey();
      } else if (this.axesLeft > 0 && this.axesTop === 0) {
        this.set_BtnKeyArray(37);
      } else if (this.axesLeft < 0 && this.axesTop === 0) {
        this.set_BtnKeyArray(39);
      } else if (this.axesLeft === 0 && this.axesTop > 0) {
        this.set_BtnKeyArray(38);
      } else if (this.axesLeft === 0 && this.axesTop < 0) {
        this.set_BtnKeyArray(40);
      } else if (this.axesLeft > 0 && this.axesTop > 0) {
        this.set_BtnKeyArray([37, 38]);
      } else if (this.axesLeft > 0 && this.axesTop < 0) {
        this.set_BtnKeyArray([37, 40]);
      } else if (this.axesLeft < 0 && this.axesTop > 0) {
        this.set_BtnKeyArray([39, 38]);
      } else if (this.axesLeft < 0 && this.axesTop < 0) {
        this.set_BtnKeyArray([39, 40]);
      }
    }
  }
}