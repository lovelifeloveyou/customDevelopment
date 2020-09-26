import {
  mapGetters,
  mapMutations
} from 'vuex'

export default {
  data() {
    return {
      isBoo: -1,
      isBtn: 1, // 1.屏幕按键 2.按钮按键
      isPress: false, // 是否长按
      keyShow: true, // 游戏键盘
      panel: false, //  输入键盘面板
      allKey: false, //  输入键盘字母数字
      signKey: false, //  输入键盘字符符号
      SpeKey: false, //  输入键盘控制键
      mouseMode: false, // true触屏模式， false鼠标模式

      SpecialKey: {
        LeftCtrl: 0x01,
        LeftShift: 0x02,
        LeftAlt: 0x04,
        LeftWin: 0x08,
        RightCtrl: 0x10,
        RightShift: 0x20,
        RightAlt: 0x40,
        RightWin: 0x80
      },
      KeyInvCode: {
        LeftCtrlM: 0xfe,
        LeftShiftM: 0xfd,
        LeftAltM: 0xfb,
        LeftWinM: 0xf7,
        RightCtrlM: 0xef,
        RightShiftM: 0xdf,
        RightAltM: 0xbf,
        RightWinM: 0x7f
      },
      //  13: 键盘按键数量 (will be [0,6])
      //  14: 详细按键的键码 (长度与键盘按键数量等同)
      controlCode: 0,
      keyStatus: 0, // capsLock状态
      mouseData: {
        lastTime: 0, // 记录上次的时间戳
        lastPositionX: 0, // 记录移动前鼠标的位置
        lastPositionY: 0,
        mousescale: 1, //  移动的相对比例
        mousePositionX: 0, //  鼠标当前绝对坐标
        mousePositionY: 0,
        mouseMovementX: 0, //  鼠标当前相对位移
        mouseMovementY: 0,
        mouseWheelData: 0, // 鼠标滚轮数据
        mouseClickFlag: 0, // 鼠标点击状态
        xhotspot: 0, //  鼠标的热点
        yhotspot: 0,
        MoveTotalX: 0, // 记录鼠标一次移动中移动位置
        MoveTotalY: 0
      },
      isLockBtn: [], // 锁定按钮的抬起与放下，true按下，false抬起
      activeClass: -1,
      lockActive: [],
      allKeys: [{
          key: "Tab",
          keyCode: 9
        },
        {
          key: "q",
          keyCode: 81
        },
        {
          key: "w",
          keyCode: 87
        },
        {
          key: "e",
          keyCode: 69
        },
        {
          key: "r",
          keyCode: 82
        },
        {
          key: "t",
          keyCode: 84
        },
        {
          key: "y",
          keyCode: 89
        },
        {
          key: "u",
          keyCode: 85
        },
        {
          key: "i",
          keyCode: 73
        },
        {
          key: "o",
          keyCode: 79
        },
        {
          key: "p",
          keyCode: 80
        },
        {
          key: "中/英",
          keyCode: 16
        },
        {
          key: "a",
          keyCode: 65
        },
        {
          key: "s",
          keyCode: 83
        },
        {
          key: "d",
          keyCode: 68
        },
        {
          key: "f",
          keyCode: 70
        },
        {
          key: "g",
          keyCode: 71
        },
        {
          key: "h",
          keyCode: 72
        },
        {
          key: "j",
          keyCode: 74
        },
        {
          key: "k",
          keyCode: 75
        },
        {
          key: "l",
          keyCode: 76
        },
        {
          key: "Back",
          keyCode: 8
        },
        {
          key: "小写",
          keyCode: 20
        },
        {
          key: "符",
          keyCode: 700
        },
        {
          key: "z",
          keyCode: 90
        },
        {
          key: "x",
          keyCode: 88
        },
        {
          key: "c",
          keyCode: 67
        },
        {
          key: "v",
          keyCode: 86
        },
        {
          key: "b",
          keyCode: 66
        },
        {
          key: "n",
          keyCode: 78
        },
        {
          key: "m",
          keyCode: 77
        },
        {
          key: "确定",
          keyCode: 13
        },
        {
          key: "隐藏",
          keyCode: 800
        },
        {
          key: "空格",
          keyCode: 32
        },
        {
          key: "控制码",
          keyCode: 900
        }
      ],

      CapsallKeys: [{
          key: "Tab",
          keyCode: 9
        },
        {
          key: "Q",
          keyCode: 81
        },
        {
          key: "W",
          keyCode: 87
        },
        {
          key: "E",
          keyCode: 69
        },
        {
          key: "R",
          keyCode: 82
        },
        {
          key: "T",
          keyCode: 84
        },
        {
          key: "Y",
          keyCode: 89
        },
        {
          key: "U",
          keyCode: 85
        },
        {
          key: "I",
          keyCode: 73
        },
        {
          key: "O",
          keyCode: 79
        },
        {
          key: "P",
          keyCode: 80
        },
        {
          key: "中/英",
          keyCode: 16
        },
        {
          key: "A",
          keyCode: 65
        },
        {
          key: "S",
          keyCode: 83
        },
        {
          key: "D",
          keyCode: 68
        },
        {
          key: "F",
          keyCode: 70
        },
        {
          key: "G",
          keyCode: 71
        },
        {
          key: "H",
          keyCode: 72
        },
        {
          key: "J",
          keyCode: 74
        },
        {
          key: "K",
          keyCode: 75
        },
        {
          key: "L",
          keyCode: 76
        },
        {
          key: "Back",
          keyCode: 8
        },
        {
          key: "大写",
          keyCode: 20
        },
        {
          key: "符",
          keyCode: 700
        },
        {
          key: "Z",
          keyCode: 90
        },
        {
          key: "X",
          keyCode: 88
        },
        {
          key: "C",
          keyCode: 67
        },
        {
          key: "V",
          keyCode: 86
        },
        {
          key: "B",
          keyCode: 66
        },
        {
          key: "N",
          keyCode: 78
        },
        {
          key: "M",
          keyCode: 77
        },
        {
          key: "确定",
          keyCode: 13
        },
        {
          key: "隐藏",
          keyCode: 800
        },
        {
          key: "空格",
          keyCode: 32
        },
        {
          key: "控制码",
          keyCode: 900
        }
      ],
      MousePress: {
        LeftClick: 0x01, // 鼠标左键
        RightClick: 0x02, // 鼠标右键
        MidClick: 0x04 // 鼠标中键
      },
      // 鼠标按键标识对应反码，以供鼠标抬起时运算
      MouseLift: {
        LeftClickUp: 0xfe, // 鼠标左键标识 反码
        RightClickUp: 0xfd, // 鼠标右键标识 反码
        MidClickUp: 0xfb // 鼠标中键标识 反码
      }
    };
  },
  computed: {
    ...mapGetters([
      'keyArray'
    ])
  },
  watch: {
    officialKeyboardFlag () {
      this.isBoo=-1;
      this.isLockBtn=[];
    },
  },
  methods: {
    ...mapMutations([
      'delete_key',
      'set_key'
    ]),
    change(data) {
      this.isBtn = data;
    },
    customizeDown(item, index) {
      let customizBtn;
      this.addKeyCode(item);
      if (item.keyPressMode == "2") {
        // 这一块是设置的锁定的
        if (item.keyStyle == "0") {
          // console.log("非摇杆");
          switch (item.keyRealName || item.keyName || item.key) {
            case "左键":
              customizBtn = {
                button: 0
              };
              this.lockMouse(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "移动射击":
              customizBtn = {
                button: 0
              };
              this.lockMouse(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "中键":
              customizBtn = {
                button: 1
              };
              this.lockMouse(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "右键":
              customizBtn = {
                button: 2
              };
              this.lockMouse(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "滚轮上":
              customizBtn = {
                value: 1
              };
              this.lockWheel(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "滚轮下":
              customizBtn = {
                value: -1
              };
              this.lockWheel(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "开火":
              customizBtn = {
                button: 0
              };
              this.lockMouse(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            default:
              this.lockBtn(item, index);
              this.$emit('transferData', item, customizBtn, index)
          }
        } else {
          // console.log("按住摇杆");
        }
      } else {
        // 这一块设置的是即时的
        if (item.keyStyle == "0") {
          console.log("非按住");
          switch (item.keyRealName || item.keyName || item.key) {
            case "左键":
              customizBtn = {
                button: 0
              };
              this.mouseDown(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "移动射击":
              customizBtn = {
                button: 0
              };
              this.mouseDown(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "中键":
              customizBtn = {
                button: 1
              };
              this.mouseDown(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "右键":
              customizBtn = {
                button: 2
              };
              this.mouseDown(customizBtn, index);
              console.log('selfmouseup', customizBtn)
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "滚轮上":
              customizBtn = {
                value: 1
              };
              this.wheelDown(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "滚轮下":
              customizBtn = {
                value: -1
              };
              this.wheelDown(customizBtn, index)
              this.$emit('transferData', item, customizBtn, index)
              break;
            case "开火":
              customizBtn = {
                button: 0
              };
              this.mouseDown(customizBtn, index);
              this.$emit('transferData', item, customizBtn, index)
              break;
            default:
              this.whichKey(item, index)
              this.$emit('transferData', item, customizBtn, index)
          }
        } else {
          console.log("摇杆类型");
        }
      }
    },
    customizeUp(item, index) {
      let customizBtn;
      this.addKeyCode(item);
      console.log('键盘数据33', item)
      if (item.keyPressMode == "2") {
        // 锁定的方法
        if (item.keyStyle == "0") {
          switch (item.keyRealName || item.keyName || item.key) {
            case "左键":
              customizBtn = {
                button: 0
              };
              // this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "移动射击":
              customizBtn = {
                button: 0
              };
              // this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "中键":
              customizBtn = {
                button: 1
              };
              // this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "右键":
              customizBtn = {
                button: 2
              };
              // this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "滚轮上":
              customizBtn = {
                value: 1
              };
              this.wheelUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "滚轮下":
              customizBtn = {
                value: -1
              };
              this.wheelUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "开火":
              customizBtn = {
                button: 0
              };
              // this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            default:
              console.log('end00000')
              this.lockBtn(item, index);
              this.$emit('returnData', item, customizBtn, index)
          }
        }
      } else {
        // 即时的
        if (item.keyStyle == "0") {
          switch (item.keyRealName || item.keyName || item.key) {
            case "左键":
              customizBtn = {
                button: 0
              };
              this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "移动射击":
              customizBtn = {
                button: 0
              };
              this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "中键":
              customizBtn = {
                button: 1
              };
              this.mouseUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "右键":
              customizBtn = {
                button: 2
              };
              this.mouseUp(customizBtn);
              console.log('selfmouseup', customizBtn)
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "滚轮上":
              customizBtn = {
                value: 1
              };
              this.wheelUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "滚轮下":
              customizBtn = {
                value: -1
              };
              this.wheelUp(customizBtn);
              this.$emit('returnData', item, customizBtn, index)
              break;
            case "开火":
              customizBtn = {
                button: 0
              };
              this.mouseUp(customizBtn);
              this.$emit('selfmouseup', customizBtn)
              this.$emit('returnData', item, customizBtn, index)
              break;
            default:
              this.KeyEnd(item);
              this.$emit('returnData', item, customizBtn, index)
          }
        } else {
          console.log("摇杆类型");
        }
      }
    },
    // 自定义键盘添加keyCode
    addKeyCode(item) {
      switch (item.keyRealName || item.keyName || item.key) {
        case "Esc":
          item.keyCode = 27;
          break;
        case "ESC":
            item.keyCode = 27;
            break;
        case "F1":
          item.keyCode = 112;
          break;
        case "F2":
          item.keyCode = 113;
          break;
        case "F3":
          item.keyCode = 114;
          break;
        case "F4":
          item.keyCode = 115;
          break;
        case "F5":
          item.keyCode = 116;
          break;
        case "F6":
          item.keyCode = 117;
          break;
        case "F7":
          item.keyCode = 118;
          break;
        case "F8":
          item.keyCode = 119;
          break;
        case "F9":
          item.keyCode = 120;
          break;
        case "F10":
          item.keyCode = 121;
          break;
        case "F11":
          item.keyCode = 122;
          break;
        case "F12":
          item.keyCode = 123;
          break;
        case "Ins":
          item.keyCode = 45;
          break;
        case "Del":
          item.keyCode = 46;
          break;
        case "PgUp":
          item.keyCode = 33;
          break;
        case "PgDn":
          item.keyCode = 34;
          break;
        case "Home":
          item.keyCode = 36;
          break;
        case "End":
          item.keyCode = 35;
          break;
        case "`":
          item.keyCode = 192;
          break;
        case "1":
          item.keyCode = 49;
          break;
        case "2":
          item.keyCode = 50;
          break;
        case "3":
          item.keyCode = 51;
          break;
        case "4":
          item.keyCode = 52;
          break;
        case "5":
          item.keyCode = 53;
          break;
        case "6":
          item.keyCode = 54;
          break;
        case "7":
          item.keyCode = 55;
          break;
        case "8":
          item.keyCode = 56;
          break;
        case "9":
          item.keyCode = 57;
          break;
        case "0":
          item.keyCode = 48;
          break;
        case "-":
          item.keyCode = 189;
          break;
        case "=":
          item.keyCode = 187;
          break;
        case "Back":
          item.keyCode = 8;
          break;
        case "Tab":
          item.keyCode = 9;
          break;
        case "q":
          item.keyCode = 81;
          break;
        case "w":
          item.keyCode = 87;
          break;
        case "e":
          item.keyCode = 69;
          break;
        case "r":
          item.keyCode = 82;
          break;
        case "t":
          item.keyCode = 84;
          break;
        case "y":
          item.keyCode = 89;
          break;
        case "u":
          item.keyCode = 85;
          break;
        case "i":
          item.keyCode = 73;
          break;
        case "o":
          item.keyCode = 79;
          break;
        case "p":
          item.keyCode = 80;
          break;
        case 'Q':
          item.keyCode = 81;
          break;
        case 'W':
          item.keyCode = 87;
          break;
        case 'E':
          item.keyCode = 69;
          break;
        case 'R':
          item.keyCode = 82;
          break;
        case 'T':
          item.keyCode = 84;
          break;
        case 'Y':
          item.keyCode = 89;
          break;
        case 'U':
          item.keyCode = 85;
          break;
        case 'I':
          item.keyCode = 73;
          break;
        case 'O':
          item.keyCode = 79;
          break;
        case 'P':
          item.keyCode = 80;
          break;
        case "[":
          item.keyCode = 219;
          break;
        case "]":
          item.keyCode = 221;
          break;
        case "\\":
          item.keyCode = 220;
          break;
        case "Ctrl":
          item.keyCode = 17;
          break;
        case "a":
          item.keyCode = 65;
          break;
        case "s":
          item.keyCode = 83;
          break;
        case "d":
          item.keyCode = 68;
          break;
        case "f":
          item.keyCode = 70;
          break;
        case "g":
          item.keyCode = 71;
          break;
        case "h":
          item.keyCode = 72;
          break;
        case "j":
          item.keyCode = 74;
          break;
        case "k":
          item.keyCode = 75;
          break;
        case "l":
          item.keyCode = 76;
          break;
        case 'A':
          item.keyCode = 65;
          break;
        case 'S':
          item.keyCode = 83;
          break;
        case 'D':
          item.keyCode = 68;
          break;
        case 'F':
          item.keyCode = 70;
          break;
        case 'G':
          item.keyCode = 71;
          break;
        case 'H':
          item.keyCode = 72;
          break;
        case 'J':
          item.keyCode = 74;
          break;
        case 'K':
          item.keyCode = 75;
          break;
        case 'L':
          item.keyCode = 76;
          break;
        case ";":
          item.keyCode = 186;
          break;
        case "'":
          item.keyCode = 222;
          break;
        case "Enter":
          item.keyCode = 13;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "z":
          item.keyCode = 90;
          break;
        case "x":
          item.keyCode = 88;
          break;
        case "c":
          item.keyCode = 67;
          break;
        case "v":
          item.keyCode = 86;
          break;
        case "b":
          item.keyCode = 66;
          break;
        case "n":
          item.keyCode = 78;
          break;
        case "m":
          item.keyCode = 77;
          break;
        case 'Z':
          item.keyCode = 90;
          break;
        case 'X':
          item.keyCode = 88;
          break;
        case 'C':
          item.keyCode = 67;
          break;
        case 'V':
          item.keyCode = 86;
          break;
        case 'B':
          item.keyCode = 66;
          break;
        case 'N':
          item.keyCode = 78;
          break;
        case "M":
          item.keyCode = 77;
          break;
        case ",":
          item.keyCode = 188;
          break;
        case ".":
          item.keyCode = 190;
          break;
        case "/":
          item.keyCode = 191;
          break;
        case "↑":
          item.keyCode = 38;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "Alt":
          item.keyCode = 18;
          break;
        case "win":
          item.keyCode = 1000000;
          break;
        case "Space":
          item.keyCode = 32;
          break;
        case "空格":
          item.keyCode = 32;
          break;
        case "←":
          item.keyCode = 37;
          break;
        case "↓":
          item.keyCode = 40;
          break;
        case "→":
          item.keyCode = 39;
          break;
        case "Num1":
          item.keyCode = 97;
          break;
        case "Num2":
          item.keyCode = 98;
          break;
        case "Num3":
          item.keyCode = 99;
          break;
        case "Num4":
          item.keyCode = 100;
          break;
        case "Num5":
          item.keyCode = 101;
          break;
        case "Num6":
          item.keyCode = 102;
          break;
        case "Num7":
          item.keyCode = 103;
          break;
        case "Num8":
          item.keyCode = 104;
          break;
        case "Num9":
          item.keyCode = 105;
          break;
        case "Num0":
          item.keyCode = 96;
        case "CapsLock":
          item.keyCode = 20;
        case "caps":
          item.keyCode = 20;
      }
    },
    addKeyChange(item) {
      switch (item.keyRealName || item.keyName || item.key) {
        case "Esc":
          item.keyCode = 27;
          break;
        case "F1":
          item.keyCode = 112;
          break;
        case "F2":
          item.keyCode = 113;
          break;
        case "F3":
          item.keyCode = 114;
          break;
        case "F4":
          item.keyCode = 115;
          break;
        case "F5":
          item.keyCode = 116;
          break;
        case "F6":
          item.keyCode = 117;
          break;
        case "F7":
          item.keyCode = 118;
          break;
        case "F8":
          item.keyCode = 119;
          break;
        case "F9":
          item.keyCode = 120;
          break;
        case "F10":
          item.keyCode = 121;
          break;
        case "F11":
          item.keyCode = 122;
          break;
        case "F12":
          item.keyCode = 123;
          break;
        case "Ins":
          item.keyCode = 45;
          break;
        case "Del":
          item.keyCode = 46;
          break;
        case "PgUp":
          item.keyCode = 33;
          break;
        case "PgDn":
          item.keyCode = 34;
          break;
        case "Home":
          item.keyCode = 36;
          break;
        case "End":
          item.keyCode = 35;
          break;
        case "`":
          item.keyCode = 192;
          break;
        case "1":
          item.keyCode = 49;
          break;
        case "2":
          item.keyCode = 50;
          break;
        case "3":
          item.keyCode = 51;
          break;
        case "4":
          item.keyCode = 52;
          break;
        case "5":
          item.keyCode = 53;
          break;
        case "6":
          item.keyCode = 54;
          break;
        case "7":
          item.keyCode = 55;
          break;
        case "8":
          item.keyCode = 56;
          break;
        case "9":
          item.keyCode = 57;
          break;
        case "0":
          item.keyCode = 48;
          break;
        case "-":
          item.keyCode = 189;
          break;
        case "=":
          item.keyCode = 187;
          break;
        case "Back":
          item.keyCode = 8;
          break;
        case "Tab":
          item.keyCode = 9;
          break;
        case "ㅂ":
          item.keyCode = 81;
          break;
        case "ㅈ":
          item.keyCode = 87;
          break;
        case "ㄷ":
          item.keyCode = 69;
          break;
        case "ㄱ":
          item.keyCode = 82;
          break;
        case "ㅅ":
          item.keyCode = 84;
          break;
        case "ㅛ":
          item.keyCode = 89;
          break;
        case "ㅕ":
          item.keyCode = 85;
          break;
        case "ㅑ":
          item.keyCode = 73;
          break;
        case "ㅐ":
          item.keyCode = 79;
          break;
        case "ㅔ":
          item.keyCode = 80;
          break;
        case "[":
          item.keyCode = 219;
          break;
        case "]":
          item.keyCode = 221;
          break;
        case "\\":
          item.keyCode = 220;
          break;
        case "Ctrl":
          item.keyCode = 17;
          break;
        case "ㅁ":
          item.keyCode = 65;
          break;
        case "ㄴ":
          item.keyCode = 83;
          break;
        case "ㅇ":
          item.keyCode = 68;
          break;
        case "ㄹ":
          item.keyCode = 70;
          break;
        case "ㅎ":
          item.keyCode = 71;
          break;
        case "ㅗ":
          item.keyCode = 72;
          break;
        case "ㅓ":
          item.keyCode = 74;
          break;
        case "ㅏ":
          item.keyCode = 75;
          break;
        case "ㅣ":
          item.keyCode = 76;
          break;
        case ";":
          item.keyCode = 186;
          break;
        case "'":
          item.keyCode = 222;
          break;
        case "Enter":
          item.keyCode = 13;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "ㅋ":
          item.keyCode = 90;
          break;
        case "ㅌ":
          item.keyCode = 88;
          break;
        case "ㅊ":
          item.keyCode = 67;
          break;
        case "ㅍ":
          item.keyCode = 86;
          break;
        case "ㅠ":
          item.keyCode = 66;
          break;
        case "ㅜ":
          item.keyCode = 78;
          break;
        case "ㅡ":
          item.keyCode = 77;
          break;
        case ",":
          item.keyCode = 188;
          break;
        case ".":
          item.keyCode = 190;
          break;
        case "/":
          item.keyCode = 191;
          break;
        case "↑":
          item.keyCode = 38;
          break;
        case "Shift":
          item.keyCode = 16;
          break;
        case "Alt":
          item.keyCode = 18;
          break;
        case "win":
          item.keyCode = 1000000;
          break;
        case "Space":
          item.keyCode = 32;
          break;
        case "←":
          item.keyCode = 37;
          break;
        case "↓":
          item.keyCode = 40;
          break;
        case "→":
          item.keyCode = 39;
          break;
        case "Num1":
          item.keyCode = 97;
          break;
        case "Num2":
          item.keyCode = 98;
          break;
        case "Num3":
          item.keyCode = 99;
          break;
        case "Num4":
          item.keyCode = 100;
          break;
        case "Num5":
          item.keyCode = 101;
          break;
        case "Num6":
          item.keyCode = 102;
          break;
        case "Num7":
          item.keyCode = 103;
          break;
        case "Num8":
          item.keyCode = 104;
          break;
        case "Num9":
          item.keyCode = 105;
          break;
        case "Num0":
          item.keyCode = 96;
        case "CapsLock":
          item.keyCode = 20;
      }
    },
    //键盘按下事件
    whichKey(which, index) {
      console.log('1111',which)
      which.key = which.keyRealName || which.keyName || which.key;
      console.log('122',which)

      // event.preventDefault()
      this.isBoo = index;
      this.activeClass = index;
      this.isBtn = 2;
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.keyName === "Ctrl"
      ) {
        this.controlCode |= this.SpecialKey.LeftCtrl;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.keyName === "Shift"
      ) {
        this.controlCode |= this.SpecialKey.LeftShift;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
        which.keyName === "Alt"
      ) {
        this.controlCode |= this.SpecialKey.LeftAlt;
      } else if (
        which.key === "Meta" ||
        which.key === "WIN" ||
        which.keyName === "win"
      ) {
        this.controlCode |= this.SpecialKey.LeftWin;
      } else if (["大写", "小写"].includes(which.key)) {
        this.keyStatus = this.keyStatus == 1 ? 0 : 1;
        // 问题大小写切换
        let newList = this.allKeys;
        this.allKeys = this.CapsallKeys;
        this.CapsallKeys = newList;
      } else if (which.key === "CTRL(R)") {
        this.controlCode |= this.SpecialKey.RightCtrl;
      } else if (which.key === "SHIFT(R)") {
        this.controlCode |= this.SpecialKey.RightShift;
      } else if (which.key === "ALT(R)") {
        this.controlCode |= this.SpecialKey.RightAlt;
      } else if (which.key === "隐藏") {
        this.panel = false;
        this.allKey = false;
        this.signKey = false;
        this.SpeKey = false;
        this.sub_index = undefined;
        this.keyShow = true;
        if (this.editKeyboard) {
          this.setItemList(this.copyItemList)
          this.show_customize_div = true
        }
      } else if (which.key === "@") {
        this.keySignDown(which);
      } else if (which.key === "符") {
        this.panel = true;
        this.allKey = false;
        this.SpeKey = false;
        this.signKey = true;
      } else if (which.key === "控制码") {
        this.panel = true;
        this.allKey = false;
        this.signKey = false;
        this.SpeKey = true;
      } else if (which.key === "返回") {
        this.panel = true;
        this.allKey = true;
        this.SpeKey = false;
        this.signKey = false;
      } else {
        if (this.keyArray.length >= this.MaxPressKeys) {
          return;
        }
        let keyVal = which.keyCode;
        for (let i = 0; i < this.keyArray.length; i++) {
          if (this.keyArray[i] == keyVal) {
            return;
          }
        }
        this.set_key(which.keyCode);
        // this.sendingOperation()
      }
    },
    // 特殊符号
    keySignDown(item, index) {
      this.traceLog("special sign down");
      this.activeClass = index;
      this.isBtn = 2;
      this.traceLog(item);
      if (item.len == 0 && item.key === "中/英") {
        this.controlCode |= this.SpecialKey.LeftShift;
      }
      if (this.keyArray.length >= this.MaxPressKeys) {
        return;
      }
      for (let i = 0; i < this.keyArray.length; i++) {
        if (this.keyArray[i] == item.keyCode) {
          return;
        }
      }
      if (item.len == 1) {
        this.traceLog("item len 1");
        this.set_key(item.keyCode);
      } else if (item.len == 2) {
        this.traceLog("item len 2");
        this.controlCode |= this.SpecialKey.LeftShift;
        this.set_key(item.keyCode);
        this.traceLog(this.keyArray);
      } else if (item.len == 0 && item.key === "返回") {
        this.panel = true;
        this.allKey = true;
        this.signKey = false;
        this.SpeKey = false;
      }
    },
    // 即时与锁定按键
    lockBtn(item, index) {
      this.isBtn = 2;
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      if (this.isLockBtn[index] == true) {
        this.isBoo = index;
        this.lockActive[index] = index + 100;
        if (
          item.value == "ControlLeft" ||
          item.key === "Control" ||
          item.key === "CTRL(L)" ||
          item.key === "Ctrl" ||
          item.keyName === "Ctrl"
        ) {
          this.controlCode |= this.SpecialKey.LeftCtrl;
          console.log("ctrl按下");
        } else if (
          item.value == "Shift" ||
          item.key === "Shift" ||
          item.key === "中/英" ||
          item.key === "SHIFT(L)" ||
          item.keyName === "Shift"
        ) {
          this.controlCode |= this.SpecialKey.LeftShift;
          console.log("shift按下");
        } else if (item.value == "ControlRight") {
          this.controlCode |= this.SpecialKey.RightCtrl;
          console.log("ctrlR按下");
        } else if (item.key == "Alt" || item.keyName === "Alt") {
          console.log("alt按下");
          this.controlCode |= this.SpecialKey.LeftAlt;
        } else if (item.key == "win" || item.keyName === "Shift") {
          this.controlCode |= this.SpecialKey.LeftWin;
        } else {
          if (this.keyArray.length >= this.MaxPressKeys) {
            return;
          }
          let keyVal = item.keyCode;
          for (let i = 0; i < this.keyArray.length; i++) {
            if (this.keyArray[i] == keyVal) {
              return;
            }
          }
          this.set_key(item.keyCode);
        }
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.lockActive[index] = -1;
        if (
          item.value == "ControlLeft" ||
          item.key === "Control" ||
          item.key === "CTRL(L)" ||
          item.key === "Ctrl"
        ) {
          this.controlCode &= this.KeyInvCode.LeftCtrlM;
          console.log("Ctrl抬起");
        } else if (
          item.value == "Shift" ||
          item.key === "Shift" ||
          item.key === "中/英" ||
          item.key === "SHIFT(L)"
        ) {
          this.controlCode &= this.SpecialKey.LeftShiftM;
          console.log("shift抬起");
        } else if (item.value == "ControlRight") {
          this.controlCode &= this.SpecialKey.RightCtrlM;
          console.log("CtrlR抬起");
        } else if (item.key == "Alt") {
          this.controlCode &= this.SpecialKey.LeftAlt;
          console.log('alt抬起')
        } else if (item.key == "win") {
          this.controlCode &= this.SpecialKey.LeftWin;
        } else {
          this.delete_key(item.keyCode);
        }
      }
    },
    // 即时与按住鼠标
    lockMouse(item, index) {
      this.isBtn = 2;
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      if (this.isLockBtn[index]) {
        this.isBoo = index;
        this.mouseDown(item, index);
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.mouseUp(item);
      }
    },
    // 滚轮的计时与锁定
    lockWheel(item, index) {
      let timer;
      this.isBtn = 2;
      let that = this;
      console.log("clearTimer1");
      clearInterval(timer);
      this.isLockBtn[index] = this.isLockBtn[index] == true ? false : true;
      console.log(this.isLockBtn[index]);
      if (this.isLockBtn[index]) {
        this.isBoo = index;
        timer = setInterval(function () {
          console.log("timer");
          console.log(item);
          console.log(index);
          that.wheelDown(item, index);
          if (!that.isLockBtn[index]) {
            console.log("clearTimer2");
            that.isLockBtn[index] = false;
            clearInterval(timer);
          }
        }, 100);
      } else if (this.isLockBtn[index] == false) {
        this.isBoo = -1;
        this.wheelUp(item);
        this.isLockBtn[index] = false;
        console.log("clearTimer3");
        clearInterval(timer);
      }
    },
    // 键盘抬起事件
    KeyEnd(which, event) {
      this.isBoo = -1;
      this.activeClass = -1;
      this.traceLog("key touch end up");
      let keyVal = which.keyCode;
      this.traceLog(which);
      if (
        which.key === "Control" ||
        which.key === "CTRL(L)" ||
        which.key === "Ctrl" ||
        which.keyName === "Ctrl"
      ) {
        this.controlCode &= this.KeyInvCode.LeftCtrlM;
      } else if (
        which.key === "Shift" ||
        which.key === "中/英" ||
        which.key === "SHIFT(L)" ||
        which.keyName === "Shift"
      ) {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
      } else if (
        which.key === "Alt" ||
        which.key === "ALT(L)" ||
        which.keyName === "Alt"
      ) {
        this.controlCode &= this.KeyInvCode.LeftAltM;
      } else if (
        which.key === "Meta" ||
        which.key === "WIN" ||
        which.keyName === "win"
      ) {
        this.controlCode &= this.KeyInvCode.LeftWinM;
      } else if (which.key === "@") {
        this.keySpecailUp(which);
      } else if (which.key === "大写") {
        return;
      } else if (which.key === "CTRL(R)") {
        this.controlCode &= this.KeyInvCode.RightCtrlM;
      } else if (which.key === "SHIFT(R)") {
        this.controlCode &= this.KeyInvCode.RightShiftM;
      } else if (which.key === "ALT(R)") {
        this.controlCode &= this.KeyInvCode.RightAltM;
      } else if (
        which.key === "隐藏" ||
        which.key === "符" ||
        which.key === "控制码" ||
        which.key === "返回"
      ) {
        return;
      } else {
        this.delete_key(which.keyCode);
      }
    },
    // 特殊按键的抬起
    keySpecailUp(item) {
      this.traceLog("specail key end up");
      // this.isBtn = 1;
      this.activeClass = -1;
      this.traceLog(item);
      if (item.len === 1) {
        this.delete_key(item.keyCode);
      } else if (item.len === 2) {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
        this.delete_key(item.keyCode);
      } else if (item.key === "中/英") {
        this.controlCode &= this.KeyInvCode.LeftShiftM;
      }
    },
    // 鼠标按键点击
    mouseDown(btn, index) {
      this.isBoo = index;
      this.isBtn = 2;
      this.activeClass = index + 200;
      if (btn.button == 0) {
        this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
      } else if (btn.button == 1) {
        this.mouseData.mouseClickFlag |= this.MousePress.MidClick;
      } else if (btn.button == 2) {
        this.mouseData.mouseClickFlag |= this.MousePress.RightClick;
      }
    },
    // 鼠标按键抬起
    mouseUp(btn) {
      this.isBoo = -1;
      this.activeClass = -1;
      if (btn.button == 0) {
        this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
      } else if (btn.button == 1) {
        this.mouseData.mouseClickFlag &= this.MouseLift.MidClickUp;
      } else if (btn.button == 2) {
        this.mouseData.mouseClickFlag &= this.MouseLift.RightClickUp;
      }
    },
    // 滚轮事件
    wheelDown(item, index) {
      this.isBoo = index;
      this.isBtn = 2;
      this.activeClass = index + 100;
      if (item.value == 1) {
        this.mouseData.mouseWheelData = 1;
      } else if (item.value == -1) {
        this.mouseData.mouseWheelData = -1;
      }
    },
    wheelUp(item) {
      this.isBoo = -1;
      this.activeClass = -1;
      // this.isBtn = 1;
    },

    press(e) {
      // this.traceLog("长按：");
      if (this.isBtn == 2) {
        // this.traceLog("触发长按操作");
        return;
      }
      if (!this.isPress) {
        this.isPress = true;
        if (!this.mouseMode) {
          this.mouseData.mouseClickFlag |= this.MousePress.LeftClick;
        }
      }
    },
    pressup(e) {
      // this.traceLog("长按放开：");
      if (this.isPress) {
        this.isPress = false;
        if (!this.mouseMode) {
          this.mouseData.mouseClickFlag &= this.MouseLift.LeftClickUp;
        }
      }
    },
    traceLog(data) {
      if (this.isLog) {
        let myDate = new Date();
        console.log(myDate.toLocaleString() + ":  ");
        console.log(data);
      }
    }
  }
}
