import store from '../store'

let allWidth =
  window.screen.availWidth > window.screen.availHeight
    ? window.screen.availWidth
    : window.screen.availHeight;
let allHeight =
  window.screen.availWidth < window.screen.availHeight
    ? window.screen.availWidth
    : window.screen.availHeight;
let rate, totalWidth, totalHeight, top, left

function adaptScreen (x, y) {
  let a = x 
  let b = y 
  let c = 0
  b -= 10
  if ((b * 16 / 9) > a) {
    adaptScreen(a, b)
  } else {
    a = b * 16 / 9
    totalWidth = a
    totalHeight = b
  }
}

const isType = (obj, type) => Object.prototype.toString.call(obj).slice(8, -1) === type;

export default {
  paramsToUrl: function (params) {
    if (!params || !Object.keys(params).length) {
      return ''
    }
    let query = '?' + Object.keys(params).map(k =>
      encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    ).join('&')
    return query
  },
  getParam(data) {
    let url = '';
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
  },
  queryToObject: function (query) {
    query = query || location.search
    if (query) {
      return query.slice(1).split('&').map(o => o.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    } else {
      return {}
    }
  },
  transObject: function (obj) {
    if (!obj || !Object.keys(obj).length) {
      return ''
    }
    let query = Object.keys(obj).map(k => 
      k + '=' + (Object.prototype.toString.call(obj[k]) === '[object Array]' ? JSON.stringify(obj[k]) : obj[k])  
    ).join('&')
    return query
  },
  formatDate(datetime, baseHour) {
    // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
    var year = datetime.getFullYear(),
        month = ("0" + (datetime.getMonth() + 1)).slice(-2),
        date = ("0" + datetime.getDate()).slice(-2),
        hour = baseHour ? baseHour : ("0" + datetime.getHours()).slice(-2),
        minute = ("0" + datetime.getMinutes()).slice(-2),
        second = ("0" + datetime.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    // 返回
    return result;
  },
  timeDifference(baseHour) {
  //定义两个变量time1,time2分别保存开始和结束时间
      var today_time = new Date();    // 获取当前时间
      var time1 = this.formatDate(today_time, baseHour);
      let time2 = this.formatDate(today_time); // 时间转换

  //判断开始时间是否大于结束日期
      if (time1 > time2) {
          alert("开始时间不能大于结束时间！");
          return false;
      }

  //截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
      var begin1 = time1.substr(0, 10).split("-");
      var end1 = time2.substr(0, 10).split("-");

  //将拆分的数组重新组合，并实例成化新的日期对象
      var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
      var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);

  //得到两个日期之间的差值m，以分钟为单位
  //Math.abs(date2-date1)计算出以毫秒为单位的差值
  //Math.abs(date2-date1)/1000得到以秒为单位的差值
  //Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
      var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);

  //小时数和分钟数相加得到总的分钟数
  //time1.substr(11,2)截取字符串得到时间的小时数
  //parseInt(time1.substr(11,2))*60把小时数转化成为分钟
      var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
      var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));

  //两个分钟数相减得到时间部分的差值，以分钟为单位
      var n = min2 - min1;

  //将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
      var minutes = m + n;
      return minutes;
  },
  // 对象数组去重
  duplicate (arr, type) {
    if (arr.length === 0) {
      return arr
    } else {
      if (type) {
        let obj = {}
        let newArr = arr.reduce((cur, next) => {
          obj[next[type]] ? '' : obj[next[type]] = true && cur.push(next)
          return cur
        }, [])
        return newArr
      } else {
        return Array.from(new Set(arr))
      }
    }
  },
  getDifferenceSet(arr1, arr2, typeName) {
    return Object.values(
      arr1.concat(arr2).reduce((acc, cur) => {
        if (
          acc[cur[typeName]] &&
          acc[cur[typeName]][typeName] === cur[typeName]
        ) {
          delete acc[cur[typeName]];
        } else {
          acc[cur[typeName]] = cur;
        }
        return acc;
      }, {})
    );
  },
  // 判断横竖屏
  detectOrient () {
    var storage = localStorage; // 不一定要使用localStorage，其他存储数据的手段都可以
    var data = storage.getItem('J-recordOrientX');
    var cw = document.documentElement.clientWidth;

    var _Width = 0,
      _Height = 0;
    if (!data) {
      sw = window.screen.width;
      sh = window.screen.height;
      // 2.在某些机型（如华为P9）下出现 srceen.width/height 值交换，所以进行大小值比较判断
      _Width = sw < sh ? sw : sh;
      _Height = sw >= sh ? sw : sh;
      storage.setItem('J-recordOrientX',_Width + ',' + _Height);
    } else {
      var str = data.split(',');
      _Width = str[0];
      _Height = str[1];
    }

    if(cw == _Width) {
      // 竖屏
      return;
    }
    if(cw == _Height){
      // 横屏
      return;
    }
  },
  debounce (func,delay) {
    var timer = null;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        func.apply(context, args);
      }, delay);
    }
  },
  // 判断刘海屏
  adaptIphoneX () {
    // X XS, XS Max, XR
    const xSeriesConfig = [
      {
        devicePixelRatio: 3,
        width: 375,
        height: 812,
      },
      {
        devicePixelRatio: 3,
        width: 414,
        height: 896,
      },
      {
        devicePixelRatio: 2,
        width: 414,
        height: 896,
      },
    ];
    // h5
    if (typeof window !== 'undefined' && window) {
      const isIOS = /iphone/gi.test(window.navigator.userAgent);
      if (!isIOS) return false;
      const { devicePixelRatio, screen } = window;
      const { width, height } = screen;
      return xSeriesConfig.some(item => item.devicePixelRatio === devicePixelRatio && item.width === width && item.height === height);
    }
    return false;
  },
  // 判断iphone X
  isIphoneX() {
    // iPhone X、iPhone XS
    const isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812
    // iPhone XS Max iphone11 Pro
    const isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896
    // iPhone XR iphone11
    const isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896
    if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) return true
    return false
  },
  // 区分ios、android
  /*判断客户端*/
  judgeClient() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;   //判断是否是 android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);     //判断是否是 iOS终端
    // console.log('是否是Android：' + isAndroid); //true,false
    // console.log('是否是iOS：' + isIOS);
    if (isAndroid) {
      return 'Android';
    } else if (isIOS){
      return 'IOS';
    } else {
      return 'PC';
    }
  },
  getScreenInfo () {
    if (Number((allWidth / allHeight).toFixed(1)) === 1.8) {
      rate =  (allHeight * 16) / (9 * allWidth)
      totalWidth =  rate * allWidth
      totalHeight = allHeight
      top = 0
      left = ((1 - rate) / 2) * allWidth
    } else {
      if (store.getters.fullScreenShow) {
        if ((allHeight * 16 / 9) <= allWidth) {
          rate =  (allHeight * 16) / (9 * allWidth)
          totalWidth =  rate * allWidth + 84
          totalHeight = allHeight
          top = 0
          left = ((1 - rate) / 2) * allWidth - 42
        } else {
          if ((allWidth * 9 / 16) <= allHeight) {
            totalWidth = allWidth
            totalHeight = allWidth * 9 / 16 + 200
          } else {
            adaptScreen(allWidth, allHeight)
          }
          left = (allWidth - totalWidth) / 2
          top = (allHeight - totalHeight) / 2
        }
      } else {
        if ((allHeight * 16 / 9) <= allWidth) {
          rate =  (allHeight * 16) / (9 * allWidth)
          totalWidth =  rate * allWidth
          totalHeight = allHeight
          top = 0
          left = ((1 - rate) / 2) * allWidth
        } else {
          if ((allWidth * 9 / 16) <= allHeight) {
            totalWidth = allWidth
            totalHeight = allWidth * 9 / 16
          } else {
            adaptScreen(allWidth, allHeight)
          }
          left = (allWidth - totalWidth) / 2
          top = (allHeight - totalHeight) / 2
        }
      }
    }
    let screenInfo = {
      allWidth: allWidth,
      allHeight: allHeight,
      totalWidth: totalWidth,
      totalHeight: totalHeight,
      left: left,
      top: top
    }
    return screenInfo
  },
  // 深克隆
  deepClone (parent) {
    // 维护两个储存循环引用的数组
    const parents = [];
    const children = [];

    const _clone = parent => {
      if (parent === null) return null;
      if (typeof parent !== 'object') return parent;

      let child, proto;

      if (isType(parent, 'Array')) {
        // 对数组做特殊处理
        child = [];
      } else if (isType(parent, 'RegExp')) {
        // 对正则对象做特殊处理
        child = new RegExp(parent.source, getRegExp(parent));
        if (parent.lastIndex) child.lastIndex = parent.lastIndex;
      } else if (isType(parent, 'Date')) {
        // 对Date对象做特殊处理
        child = new Date(parent.getTime());
      } else {
        // 处理对象原型
        proto = Object.getPrototypeOf(parent);
        // 利用Object.create切断原型链
        child = Object.create(proto);
      }

      // 处理循环引用
      const index = parents.indexOf(parent);

      if (index != -1) {
        // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
        return children[index];
      }
      parents.push(parent);
      children.push(child);

      for (let i in parent) {
        // 递归
        child[i] = _clone(parent[i]);
      }

      return child;
    };
    return _clone(parent);
  }
}