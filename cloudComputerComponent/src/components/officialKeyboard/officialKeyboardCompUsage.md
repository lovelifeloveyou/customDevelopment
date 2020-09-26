# 官方键盘组件使用说明


## 说明

> 如果后续要配置许多官方键盘，一个一个去写的话，会显得代码量很多很乱，且在做一些不必要的重复操作，
而且违背了代码设计原则。我们可以把官方配置成一个对象，这个对象中包含着按键的哪些按键，以及
是否有左右键，即时和锁定规则，以及这些按键的位置信息，及是否有摇杆。然后我们再根据点击的是哪个官方键盘
取出定义的对象中的数据则可使用。这样的话，到最后我们后续需要增加官方键盘的话，只需要增加这个官方键盘的
数据定义。以及如果我们后续是有编辑操作的话，也是可以适应组件的。而其中的退出按钮我们只需要当成是slot插槽
放置即可


### 官方键盘数据定义示例

``` javascript
DNFKey: {
  btn: [
    { key: 'xx', keyCode: '', value: '', button: 0, keyPressMode: 1, width: '', height: '', left: '', top: '' },
    { key: 'xx', keyCode: '', value: '', button: 0, keyPressMode: 1, width: '', height: '', left: '', top: '' },
    { key: 'xx', keyCode: '', value: '', button: 0, keyPressMode: 1, width: '', height: '', left: '', top: '' }
  ],
  direction: [
    { keyName: '按键WASD', rockerType: 102/103, width: '', height: '', left: '', top: '' }
  ]
}
```

