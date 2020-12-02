import util from "../common/libs/util.crypto";

export default {
  methods: {
    // conn 连接
    isHref() {
      console.log("进去初始链接");
      if (this.$config.directTest) {
        // console.log("paramMsg");
        console.log("本地");
        let paramMsg = util.decrypt(
          "U2FsdGVkX19zOcVTf3Jg4HaMHvCZrSVXKFohba3QYzE/PvdGf+C+Tl+UtnTxGiWrmScUsG/Zq3Wn+ks53MUeOLliHKPwYkiNutO9T7ri4pgEwLrM8d6FpRMps0HWbHD42WcYGQYkYgTa14bCBoXs8EiLg1FmC5njGjb59PA1OviUjr0kRt+0lnps3yo1lyoR"
        );
        // console.log(paramMsg);
        this.initServer();
      } else {
        this.stepStatus = 1;
        // console.log("stepStatus");
        let paramData = sessionStorage.getItem("param");
        // console.log(paramData);
        // console.log("paramMsg", decodeURIComponent(paramData));
        let paramMsg = util.decrypt(paramData);
        // console.log("paramMsg", paramMsg);
        this.loadingProgress(10);

        let appData = sessionStorage.getItem("app");
        console.log("appData", appData);
        console.log("decodeURIComponent(appData)", decodeURIComponent(appData));
        let dataMsg = util.decrypt(appData);
        let serviceDefault = {
          serviceId: dataMsg && dataMsg.g_mark ? dataMsg.g_mark : '标配服务',
          keyId: Number(dataMsg && dataMsg.key_id)
        }
        localStorage.setItem('openDefaultKeyboard', JSON.stringify(serviceDefault))
        console.log("dataMsg", dataMsg);
        if (dataMsg != null) {
          if (dataMsg.g_path != null)
            dataMsg.g_path = dataMsg.g_path.replace(/\\/g, "/");
          if (dataMsg.g_picurl != null)
            dataMsg.g_picurl = dataMsg.g_picurl.replace(/\\/g, "/");
        }
        if (paramMsg == null) {
          this.connError(this.errorMsg[2] + "(501)", 4);
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne:'paramMsg为null'
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
        } else {
          // this.i18nHandle(this.$i18n.locale)
          // this.initWebsocket()
          this.loadData.ip = paramMsg.ip || paramMsg.realip;
          this.loadData.innerip = paramMsg.innerip;
          this.loadData.sessionKey = paramMsg.session_key;
          this.loadData.port = paramMsg.httpcentport;
          this.loadData.msg = paramMsg.msg;
          this.loadData.cid = paramMsg.cid;
          this.loadData.appMsg = dataMsg;
          this.orderId = paramMsg.paycode;
          console.log("连接信息", paramMsg);
          this.path =
            this.$config.WSS_URL + "/ipClient?ip=" + this.loadData.innerip;
          this.loadingProgress(10);
          if (this.loadData.appMsg == null) {
            // $('.ispair').hide()
          } else if (this.loadData.appMsg.start_mode == 1) {
            this.appOnly = true;
          }
          this.initServer();
        }
      }
    },
    connTimeoutCheck() {
      let that = this;
      //30秒监测连接超时
      setTimeout(function () {
        console.log("check timeout");
        if (that.everConnected) {
          return;
        }
        let tne = ''
        switch (Number(that.stepStatus)) {
          case 1:
            tne='数据为正确取出'
            break;
          case 2:
            tne='收不到hashKey'
            break;
          case 3:
            tne='未收到sdp'
            break;
          case 4:
            tne='通道、视频未就位'
            break;
          case 5:
            tne='视频未收到'
            break;
          case 6:
            tne='未执行视频自动播放'
            break;
        }
        if (that.stepStatus < 2 && !that.connectIsShow && !that.freeIsEnd && !that.memberFreeIsEnd) {
          // that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 4);
          let code = "40" + that.stepStatus;
          let eventInfo = {
            errorcode: code,
            $pagename: that.gameName,
            port: that.loadData.port,
            $tne: tne
            // idc: "",
          };
          that.$record("connecting_error", eventInfo);
          that.$dialog
            .alert({
              title: "",
              message: that.errorMsg[1] + "(40" + that.stepStatus + ")",
            })
            .then(() => {
              window.location.href = document.referrer;
            });
        } else {
          // if(that.stepStatus == 6){
          //   // console.log(that.stepStatus)
          //   that.onVideoPlaying()
          // }
          // that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 1);
          if(that.candidataFirst == 1){
            that.stepStatus = 9;
            tne = '未找到服务器'
          }
          let code = "40" + that.stepStatus;
          let eventInfo = {
            errorcode: code,
            $pagename: that.gameName,
            port: that.loadData.port,
            $tne: tne
            // idc: "",
          };
          that.$record("connecting_error", eventInfo);
          if (!that.connectIsShow && !that.freeIsEnd && !that.memberFreeIsEnd) {
            that.$dialog
              .alert({
                title: "",
                message: that.errorMsg[1] + "(40" + that.stepStatus + ")",
              })
              .then(() => {
                window.location.href = document.referrer;
              });
          }
        }
      }, 30000);
    },
    // 将数据转为base64
    encodeBase(jsonData) {
      ////this.tracelog("encode base...");
      let str = JSON.stringify(jsonData);
      ////this.tracelog(str);
      let Base64 = require("js-base64").Base64;
      let base64 = Base64.encode(str);
      //this.tracelog(base64);
      return base64;
    },
    loadingProgress(ratePlus) {
      let that = this;
      if (this.everConnected) return;
      this.loadingRate += ratePlus;
      this.traceLog("loading progress: " + this.loadingRate);
      if (this.loadingRate >= 100) {
        this.lastTime = new Date().getTime(); // 记录默认连接时，当前时间
        // 可以开始游戏
        //进度到100  视频和通道数据准备完成  连接完成
        console.log(
          "视频和通道数据准备完成",
          this.videoReady,
          this.dataChannelReady
        );
        if (this.videoReady && this.dataChannelReady) {
          this.everConnected = true;
          this.readyStart();
          return;
        } else {
          this.traceLog("loading ok,but not ready");
          this.loadingRate = 99;
        }
      }
    },
    initServer() {
      this.stepStatus = 2;
      console.log("initServer");
      this.loadingProgress(10);
      if (this.$config.directTest) {
        this.loadingProgress(20);
        this.loadData.ip = this.$config.ip;
        this.path = this.$config.WSS_URL + "/ipClient?ip=" + this.loadData.ip;
        this.loadData.serverUrl = `${this.$config.ip}:${this.$config.port}`;
        this.loadData.sessionKey = this.directSessionKeyFull;
        // this.loadData.serverUrl = prompt("请输入server url(version 2)");
        // this.sessionkeyTail = prompt("请输入密码");
        // this.loadData.sessionKey = this.directSessionKeyHead + this.sessionkeyTail;
        // console.log("serverUrl", this.loadData.serverUrl);
        //this.tracelog(this.loadData.sessionKey);
      } else {
        if (this.loadData.ip == null || this.loadData.ip == null) {
          this.connError(this.errorMsg[3] + "(501)", 4);
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne: 'paramMsg为null'
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
          return;
        }
        this.loadData.serverUrl = this.loadData.ip + ":" + this.loadData.port;
      }
      //this.tracelog(this.loadData.ip, this.loadData.port);
      this.conn();
    },
    // 向server发送连接请求
    conn() {
      this.serverUsing = 0;
      // this.tracelog("connect server");
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      this.hashKey = null;
      // 连接状态
      this.connStatus = this.connStatusFlag.waitConnect;
      this.pausing = true;
      this.videoReady = false;
      this.dataChannelReady = false;
      this.controlIntervalSendStart(2000);
    },
    // 发送初始连接请求
    sendConn() {
      let app = 0,
        runLevel = 0;
      if (this.loadData.appMsg) {
        app = this.encodeBase(this.loadData.appMsg);
        runLevel = 1;
      }
      let userData = {
        version: 200,
        sessionKey: this.loadData.sessionKey,
        bitrate: 2000,
        fps: 60,
        numlock: 1,
        capslock: 1,
        deviceState: 1, // 设备状态
        channel: "safari",
        deviceType: 3,
        endpointType: "ios-safari",
        runLevel: runLevel, //桌面
        // "appcode": 'eyJnX21hcmsiOiIzIiwiZ19uYW1lIjoiUVEiLCJnX3BhdGgiOiJDOi9Qcm9ncmFtIEZpbGVzICh4ODYpL1RlbmNlbnQvUVEvQmluL1FRLmV4ZTtEOi9RUemjnui9pi9RUVNwZWVkTGF1bmNoZXIuZXhlIiwicHJvY2Vzc19uYW1lIjoiUVFTcGVlZExhdW5jaGVyLmV4ZTtRUS5leGUiLCJnX3BpY3VybCI6IkQ6L1dlYlJUQy9YVGVhbFNlcnZlci9icmFuY2hlcy9YVGVhbFNlcnZlcjAuMS9YVGVhbFNlcnZlci9YVGVhbFNlcnZlci9ia2cvTE9MLmJtcCIsInN0YXJ0X21vZGUiOjB9',
        appcode: app,
      };
      let data = this.jsonToUrl(userData);
      console.log("发送hashkey请求");
      let type = "/api/handshake.evt";
      //this.tracelog(data);
      //微信在此断开 请求出错
      this.httpSend(data, type, true);
    },
    // 向server请求获取分辨率
    getDPI() {
      let data = "hashKey=" + this.hashKey + "&optionType=" + 2;
      let type = "/api/options.evt";
      this.httpSend(data, type, false);
    },
    // 选择分辨率并通知服务端该选定分辨率
    choosingDPI(data) {
      let scrWidth = window.screen.width;
      let scrHeight = window.screen.height;
      let localRate = scrWidth / scrHeight;
      let curDiff = 1000,
        targetW = 0,
        targetH,
        findSame = false;
      let len = data.length;
      if (len == 1) {
        // 不可选择分辨率
        this.loadingProgress(10);
        return;
      }
      targetW = 1600;
      targetH = 900;
      //this.tracelog("choosing dpi" + targetW + " " + targetH);
      let sendData =
        "hashKey=" +
        this.hashKey +
        "&optionType=16" +
        "&value1=" +
        targetW +
        "&value2=" +
        targetH;
      this.httpSend(sendData, "/api/options.evt", false);
    },
    // 处理stun服务器ip列表
    handleStunServer(serverList) {
      this.candidataFirst=0;
      let len = serverList.length;
      if (len < 1) {
        this.connError(this.errorMsg[3] + "(206)", 1);
        let eventInfo = {
          errorcode: "206",
          $pagename: this.gameName,
          port: this.loadData.port,
          $tne: '收到的serverlist为空'
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
      }
      serverList = serverList.map(function (value, index, arr) {
        let str = "stun:" + value;
        return { urls: str };
      });
      this.pcConfig = {
        iceServers: serverList,
      };
    },
    // 通知服务端切换比特率
    byteRateChange(val) {
      //this.tracelog("change byte rate to " + val);
      let data = "hashKey=" + this.hashKey + "&optionType=3" + "&value1=" + val;
      let type = "/api/options.evt";
      this.httpSend(data, type, false);
    },
    // 通知服务端断开连接
    sendingDisconn() {
      //this.tracelog("sending exit...");
      let sendData = "hashKey=" + this.hashKey + "&optionType=7";
      this.httpWebSend(sendData, "/api/options.evt");
    },
    //断开所有连接
    disconnect() {
      // 定时连接检查函数 id
      if (this.checkEverConnId) {
        clearTimeout(this.checkEverConnId);
        this.checkEverConnId = null;
      }
      //this.tracelog("disconnect");
      this.intervalKMSendingClose();
      this.controlIntervalSendStop();
      if (this.connChannel) {
        this.connChannel.close();
        this.connChannel = null;
      }
      this.remoteStream = null;
      this.peerConn = null;
      this.connChannel = false;
    },
    // 控制流发送数据
    httpSend(sendData, inter, simple) {
      let curUrl = this.sigServer + this.loadData.serverUrl + inter;
      let that = this;
      $(function () {
        $.ajax({
          dataType: "jsonp",
          timeout: 8000,
          type: "get",
          contentType: "text/plain",
          data: sendData,
          url: curUrl,
        })
          .done(function (data) {
            // console.log(curUrl, sendData);
            if (inter == "/api/sdp.evt") {
              // console.log(data);
              // console.log(sendData);
              console.log("sdp成功！！！！！！！");
            }
            if (inter == "/api/handshake.evt") {
              // console.log(data);
              if (Number(data.status) > 0) {
                console.timeEnd("handshake请求11");
              }
              // console.log(sendData);
              console.log("hashkey    成功！！！！！！！");
            }
            if (inter == "/api/options.evt") {
              // that.traceLog(curUrl);
              // console.log(sendData);
              // console.log(simple);
              // console.log("成功", data);
              // console.log(that.hashKey);
              // console.log("option    成功！！！！！！！");
            }
            if (inter == "/api/candidate.evt") {
              // that.traceLog(curUrl);
              // console.log(sendData);
              // console.log(simple);
              // console.log("成功", data);
              // console.log(that.hashKey);
              console.log("candidate    成功！！！！！！！");
            }
            that.dealRecvHttpData(data);
          })
          .fail(function (e) {
            console.log("sending fail");
            console.log(curUrl);
            // console.log(sendData);
            // console.log(that.hashKey);
            // // console.log(simple);
            if (simple) return;
            // console.log("是否执行 ! ! ! ! ! ! ! ! ! !");
            // 若只是简单心跳发送失败，不作处理
            that.waittingSendArr.push(sendData);
            that.waittingSendInter.push(inter);
          });
      });
    },
    // 控制流通过web服务器转发数据
    httpWebSend(sendData, inter) {
      let curUrl = process.env.NODE_ENV === 'development' ? "video/transmit/" + this.loadData.serverUrl + inter : "transmit/" + this.loadData.serverUrl + inter;
      console.log('curUrl', curUrl)
      $.ajax({
        dataType: "jsonp",
        type: "get",
        data: sendData,
        url: curUrl,
        async: false,
      });
    },
    // 控制流收到回返数据
    dealRecvHttpData(data) {
      this.nonRespNum = 0;
      if (!data) {
        //this.tracelog("empty response data");
        return;
      }
      console.log("请求状态", data.status);
      if (data.status < 0) {
        //出错执行失败
        //this.tracelog(data);
        if (data.status == -100) {
          // sessionKey校验失败
          this.connError(this.errorMsg[3] + "(100)", 1);
          if (this.sessionFirst) {
            this.sessionFirst = false;
            let eventInfo = {
              errorcode: "100",
              $pagename: this.gameName,
              port: this.loadData.port,
              $tne:'sessionkey不正确'
              // idc: "",
            };
            this.$record("connecting_error", eventInfo);
          }
        } else if (data.status == -101) {
          // 服务正在使用中，拒绝连接
          this.serverUsing++;
          if (this.serverUsing > 5) this.connError(this.errorMsg[4], 1);
        } else if (data.status == -102) {
          // 版本不匹配
          //      this.connError(false,102,true);
        } else if (data.status == -103) {
          // 设置sdp失败
          this.connError(this.errorMsg[3] + "(103)", 1);
          let eventInfo = {
            errorcode: "103",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne: '设置sdp失败'
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
        } else if (data.status == -104) {
          // candidata失败
          //   this.connError(false,104,true)
        } else if (data.status == -105) {
          // hashKey失败，自动尝试重连
          //微信获取 hashKey 失败
          console.log("hashkey 失败 ！！！！！！！！！！！");
          this.tryReconn(false);
        }
        return;
      } else if (data.status == 0) {
        return;
      }
      // console.log("控制流返回状态", data.status);
      //this.tracelog("receiving control data: ");
      //this.tracelog(data);
      if (data.processStatus && data.processStatus != 0) {
        let errorNo = 110 + -data.processStatus;
        let eventInfo = {
          errorcode: errorNo,
          $pagename: this.gameName,
          port: this.loadData.port,
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
        this.connError(this.errorMsg[7] + "(" + errorNo + ")", 1);
      }
      if (data.serverList) {
        if (this.firstenter) {
        let eventInfo = {
          roomdetail_up_time: new Date().getTime() - this.nowTime,
        };
        this.nowTime = new Date().getTime();
        this.$record("precheck_serverip_ready", eventInfo);
        }
        // console.log('时间2',new Date().getTime()-this.nowTime)
        console.log("控制流返回serverList成功", data.serverList);
        this.handleStunServer(data.serverList);
      }
      if (data.hashKey) {
        if (this.firstenter) {
          this.nowTime = new Date().getTime();
          let eventInfo = {
            roomdetail_up_time: this.nowTime - this.startTime,
          };
          console.log("时间1", this.nowTime - this.startTime);
          this.$record("precheck_hashkey_ready", eventInfo);
        }
        console.log("控制流返回hashkey成功", data.hashKey);
        this.stepStatus = 3;
        this.loadingProgress(20);
        this.serverUsing = 0;
        this.hashKey = data.hashKey;
        this.connStatus = this.connStatusFlag.connectting;
        this.controlIntervalSendModify(200);
        let that = this;
        setTimeout(() => {
          that.controlIntervalSendModify(1000);
        }, 10000);
        this.getDPI();
      }

      if (data.sdpValue) {
        if (this.firstenter) {
          let eventInfo = {
            roomdetail_up_time: new Date().getTime() - this.nowTime,
          };
          // console.log('时间3',new Date().getTime()-this.nowTime)
          this.nowTime = new Date().getTime();
          this.$record("precheck_sdp_ready", eventInfo);
        }
        console.log("控制流返回sdp成功", data.sdpValue);
        // sdp message
        this.stepStatus = 4;
        this.loadingProgress(10);
        let dataObj = data.sdpValue;
        if (dataObj.type === "offer") {
          //sdp成功 创建 rtc
          console.log(dataObj);
          this.handleServerSDP(dataObj);
        }
      }
      if (data.candidateValue) {
        if (this.firstenter) {
          let eventInfo = {
            roomdetail_up_time: new Date().getTime() - this.nowTime,
          };
          // console.log('时间4',new Date().getTime()-this.nowTime)
          this.nowTime = new Date().getTime();
          this.$record("precheck_candidate_ready", eventInfo);
        }
        // candidate message
        console.log("获取到candidateValue", data.candidateValue);
        console.log("获取candidate");
        for (let candidate of data.candidateValue) {
          this.handleServerCandidate(candidate);
        }
      }
      if (data.msgPush) {
        // 消息推送
        this.notifyServerMsg(data.msgPush);
      }
      if (data.resoList) {
        // 分辨率列表
        console.log("选择分辨率");
        this.choosingDPI(data.resoList);
      }
    },
    // 开启控制流心跳发送
    controlIntervalSendStart(intervalTime) {
      if (this.controlIntervalId != null) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalId = null;
      }
      this.nonRespNum = 0;
      this.controlIntervalTime = intervalTime;
      console.time("handshake请求");
      this.controlIntervalId = setInterval(
        this.HeartBeatSendingIterval,
        intervalTime
      );
    },
    // 更改控制流心跳发送
    controlIntervalSendModify(intervalTime) {
      if (
        this.controlIntervalId != null &&
        this.controlIntervalTime != intervalTime
      ) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalTime = intervalTime;
        this.nonRespNum = 0;
        this.controlIntervalId = setInterval(
          this.HeartBeatSendingIterval,
          intervalTime
        );
      }
    },
    // 关闭控制流心跳数据发送
    controlIntervalSendStop() {
      if (this.controlIntervalId) {
        clearInterval(this.controlIntervalId);
        this.controlIntervalId = null;
      }
    },
    // 控制流定时发送心跳消息
    HeartBeatSendingIterval() {
      // alert('send')
      this.nonRespNum += this.controlIntervalTime;
      // console.log("发送心跳", this.nonRespNum);
      // 超时检测
      if (this.nonRespNum == 4000 || this.nonRespNum == 8000) {
        //   切换代理服务器
        //this.tracelog("change sigServer\n");
        this.sigServerIndex =
          (this.sigServerIndex + 1) % this.sigServerArr.length;
        this.sigServer = this.sigServerArr[this.sigServerIndex];
      }
      if (this.memberFreeIsEnd) {
        console.log('使用时间结束',this.memberFreeIsEnd)
        this.$dialog
          .alert({
            title: "提示",
            message: this.errorMsg[8],
          })
          .then(() => {
            window.history.go(-1);
            window.location.href = document.referrer;
          });
          return
      }
      let channelTime = new Date().getTime()-this.datachannelLastTime;
      if(channelTime>3000 && this.onVideo && this.dataChannelReady && this.channelFist){
        this.channelFist=false;
        let eventInfo = {
          errorcode: "601",
          $pagename: this.gameName,
          port: this.loadData.port,
          $tne:'数据通道断开'
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
      }
      if (!navigator.onLine && !this.connectIsShow && !this.freeIsEnd && !this.memberFreeIsEnd) {
        //断网状态
        // this.cutPicture();
        this.controlTimeout();
        return;
      }
      if (this.nonRespNum >= 10000 && !this.freeIsEnd && !this.memberFreeIsEnd) {
        console.log("发送超时");
        // 发送超时
        this.controlTimeout();
        return;
      }
      // 发送握手数据
      if (this.connStatus === this.connStatusFlag.waitConnect) {
        this.sendConn();
        return;
      }
      // 发送需发送的上次发送失败数据
      // console.log("错误信息", this.waittingSendInter);
      for (let i in this.waittingSendArr) {
        this.httpSend(
          this.waittingSendArr[i],
          this.waittingSendInter[i],
          false
        );
      }
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      // 抖音小程序安卓报错
      // console.log("发送hashkey请求");
      let sendData = "hashKey=" + this.hashKey + "&optionType=5";
      this.httpSend(sendData, "/api/options.evt", true);
    },
    readyStart() {
      //this.tracelog("ready start");

      this.stepStatus = 7;
      this.onVideo = true;
      this.pLock = null;
      if (this.checkEverConnId) {
        // 清空浏览器超时检查
        clearTimeout(this.checkEverConnId);
        this.checkEverConnId = null;
      }
      // 状态变更
      this.connStatus = this.connStatusFlag.connected;
      if (!this.connectIsShow) {
        this.timeoutCount = 0;
        this.timeoutTimes = 0;
      }
      // 定时器相关
      this.intervalKMSendingStart();
      this.controlIntervalSendModify(500);
      // 开启网速计算定时器
      this.netSpeedComputeIntervalStart();
      // 连接中途断开所致重连
      this.$set(this, 'UIloadingImg', false)
      console.timeEnd("进入流桌面时间");
      // this.isGuide()
      this.enterPausing();
      if (this.firstenter) {
        this.firstenter = false;
        let type = sessionStorage.getItem("entryType");
        let eventInfo = {
          $pagename: this.gameName,
          serverip: this.loadData.ip,
          enter_type: type == 1 ? "按量付费" : "体验免费",
          order_id: this.orderId,
          //暂时只有虚拟按键，暂时不传
          // idc:'',
          // devicetype:'虚拟按键',
          // devicename:'',
        };
        this.$record("connection_succeeded", eventInfo);
        let latency = new Date().getTime() - this.startTime;
        let eventInfos = {
          roomdetail_up_time: latency,
          $duration: new Date().getTime()-this.nowTime
        };
        console.log("时间", new Date().getTime() - this.startTime);
        this.$record("precheck_video_ready", eventInfos);
      // var that = this
      // setTimeout(() => {
      //   const bot = document.getElementById('videos')
      //   bot.onclick = function () {
      //     if (that.recordComeBackCount > 1) {
      //       console.log('模拟用户交互')
      //       console.log(that.recordComeBackCount)
      //       console.log(that.muteStatus)
      //       Vue.set(that, 'muteStatus', false)
      //     }
      //   }
      //   simulateClick()
      //   function simulateClick () {
      //     const event = new MouseEvent('click', {
      //       view: window,
      //       bubbles: true,
      //       cancelable: true
      //     })
      //     bot.dispatchEvent(event)
      //   }
      // })
      }
    },
    // 使用中时进入暂停状态，“进入全屏” 弹窗出现
    enterPausing() {
      //this.tracelog("enter pausing");
      //  this.exitFullScreen();
      // 清空键位状态
      this.controlCode = 0;
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      this.mouseClickFlag = 0;

      // this.UImouseImg.hide();
      // this.UIpauseButton.show();

      this.rotate();
      this.fullScreen();
      this.pausing = false;
      // $('.content')[0].style.cursor = 'block';
    },
    connError(msg, errorType) {
      if (this.onErrorDialog || this.freeIsEnd || this.memberFreeIsEnd) {
        return;
      }
      this.onErrorDialog = true;

      if (this.errorType == 1) {
        this.sendingDisconn();
      }
      this.disconnect();
      // 出现弹窗
      this.dialogStatus = errorType;
      // alert(msg);
      this.$dialog.alert({
        message: msg,
      }).then(() => {
        // on confirm
        window.history.go(-1);
      });
      // .catch(() => {
      //   // on cancel
      //   this.$dialog.close;
      // });
      /*
            switch (errorType)
            {
                case 1:
                    this.notifyErrorTwo(msg,this.errorButtonMsg[1],this.errorButtonMsg[2]);
                    break;
                case 2:
                    this.notifyErrorTwo(msg,this.errorButtonMsg[4],this.errorButtonMsg[2]);
                    break;
                case 3:
                    this.notifyErrorOne(msg,this.errorButtonMsg[3]);
                    break;
                case 4:
                    this.notifyErrorOne(msg,this.errorButtonMsg[2]);
                    break;
            }*/
    },
    // 连接出错,hashkey失效，重新连接server
    tryReconn(ifSend) {
      //this.tracelog("reconn");
      if (ifSend) {
        this.sendingDisconn();
      }
      this.disconnect();
      if (!this.connectIsShow) {
        this.timeoutCount = 0;
        this.timeoutTimes = 0;
      }
      this.conn();
    },
    // 控制流发送超时
    controlTimeout() {
      // this.tracelog("controlTimeout");
      // console.log("重连机制", this.timeoutTimes, this.timeoutCount);
      this.disconnect();
      clearInterval(this.connectTime);
      if (this.timeoutTimes >= 121) return;
      this.connectTime = setInterval(() => {
        this.timeoutTimes++;
        if (this.timeoutTimes > 120) {
          //发送重连失败数据
          if (this.timeoutTimes == 121) {
            var eventInfo = {
              connect_repair_result: "0",
            };
            this.$record("connect_repair", eventInfo);
          }
          clearInterval(this.connectTime);
          this.connectIsShow = false;
          // this.timeoutTimes = 0;
          this.$dialog
            .alert({
              title: "",
              message: this.errorMsg[6],
            })
            .then(() => {
              window.history.go(-1);
              window.location.href = document.referrer;
            });
          return;
        }
      }, 1000);
      this.timeoutCount++;
      if (this.timeoutTimes <= 120) {
        this.connectIsShow = true;
      }
      this.conn();
    },
    // 码率，流量相关
    netSpeedComputeIntervalStart() {
      if (this.spcompIntervalId != null) {
        clearInterval(this.spcompIntervalId);
        this.spcompIntervalId = null;
      }
      let first = true;
      let src = 0;
      let last = true;
      let pc = this.peerConn;
      let that = this;
      var fractionLost = 0;
      var lastPacketsReceived, lastPacketsLost;
      this.spcompIntervalId = setInterval(function () {
        // 定时获取网络延迟和比特率
        pc.getStats(null).then((stats) => {
          stats.forEach((report, index) => {
            if (report.type == "inbound-rtp") {
              if (report.id.match("Video") != "null") {
                if (last) {
                  lastPacketsReceived = report.packetsReceived;
                  lastPacketsLost = report.packetsLost;
                  last = false;
                } else {
                  if (
                    report.packetsReceived != 0 &&
                    report.packetsReceived >= lastPacketsReceived
                  ) {
                    // console.log('丢包数据',report.packetsLost,lastPacketsLost,report.packetsReceived,lastPacketsReceived, fractionLost)
                    // console.log(report.packetsLost-lastPacketsLost,report.packetsLost + report.packetsReceived - lastPacketsLost - lastPacketsReceived)
                    let packet = report.packetsLost - lastPacketsLost;
                    if (packet != 0) {
                      fractionLost =
                        (report.packetsLost - lastPacketsLost) /
                        (report.packetsLost +
                          report.packetsReceived -
                          lastPacketsLost -
                          lastPacketsReceived);
                      lastPacketsLost = report.packetsLost;
                    } else {
                      fractionLost = 0.0;
                    }
                    lastPacketsReceived = report.packetsReceived;
                  }
                  // console.log(fractionLost)
                  that.packetRate = (fractionLost * 100).toFixed(2);
                  // console.log('概率',that.packetRate)
                }
              }
            }
            if (report.type == "transport") {
              if (first) {
                src = report.bytesReceived;
                first = false;
              } else {
                // console.log(report.bytesReceived);
                that.byteRateSpeed = (
                  (report.bytesReceived - src) /
                  1024
                ).toFixed(0);
                src = report.bytesReceived;
              }
            } else if (report.type == "candidate-pair" && report.nominated) {
              // console.log(report.currentRoundTripTime);
              that.roundTripTime =
                parseInt(report.currentRoundTripTime * 1000) || 0;
            }
          });
        });
      }, 2000);
    },
    netSpeedComputeIntervalStop() {
      if (this.spcompIntervalId != null) {
        clearInterval(this.spcompIntervalId);
        this.spcompIntervalId = null;
      }
    },
    // 开启定时发送
    intervalKMSendingStart() {
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      // this.mouseData.lastPositionX = this.mouseData.mousePositionX + this.mouseData.mouseMovementX;
      // this.mouseData.lastPositionY = this.mouseData.mousePositionY + this.mouseData.mouseMovementY;
      this.mouseData.mouseMovementX = 0;
      this.mouseData.mouseMovementY = 0;
      if (this.KeyMouseIntervalId != null) {
        clearInterval(this.KeyMouseIntervalId);
        this.KeyMouseIntervalId = null;
      }
      this.KeyMouseIntervalId = setInterval(this.intervalKMExecute, 10);

      // this.KeyMouseIntervalId = setInterval(this.intervalKMExecute, 5000)
    },
    // 关闭定时发送
    intervalKMSendingClose() {
      if (this.KeyMouseIntervalId != null) {
        clearInterval(this.KeyMouseIntervalId);
        this.KeyMouseIntervalId = null;
      }
    },
    // 定时执行此函数
    intervalKMExecute() {
      if (this.mouseData.mouseMovementX < -127) {
        this.mouseData.mouseMovementX = -127;
      } else if (this.mouseData.mouseMovementX > 127) {
        this.mouseData.mouseMovementX = 127;
      }
      if (this.mouseData.mouseMovementY < -127) {
        this.mouseData.mouseMovementY = -127;
      } else if (this.mouseData.mouseMovementY > 127) {
        this.mouseData.mouseMovementY = 127;
      }
      // 操作数据发送
      this.sendingOperation();
      // this.mouseData.curPositionX = this.mouseData.mousePositionX + this.mouseData.mouseMovementX;
      // this.mouseData.curPositionY = this.mouseData.mousePositionY + this.mouseData.mouseMovementY;
      this.mouseData.mouseMovementX = 0;
      this.mouseData.mouseMovementY = 0;
      this.mouseData.mouseWheelData = 0;
    },
    // 发送键鼠消息
    sendingOperation() {
      // 构造待发送的数据

      let sendingMessage = new Uint8Array(
        this.MinKeyMouseDataSize + this.MaxPressKeys
      ); // 键鼠数据数据包
      sendingMessage[0] = this.keyMouseFlag;
      sendingMessage[1] = this.MouseFlag | this.KeyFlag;
      sendingMessage[2] = Math.round(this.mouseData.mouseWheelData); // 鼠标滚轮轮动距离
      sendingMessage[3] = this.mouseData.mouseClickFlag; // 鼠标点击状态
      if (sendingMessage[3] == this.MousePress.LeftClick) {
        console.log("左键信息发送至服务器.....................");
      }
      // 绝对坐标
      sendingMessage[4] = this.mouseData.mousePositionX & 0xff;
      sendingMessage[5] = (this.mouseData.mousePositionX >> 8) & 0xff;
      sendingMessage[6] = this.mouseData.mousePositionY & 0xff;
      sendingMessage[7] = (this.mouseData.mousePositionY >> 8) & 0xff;
      // 相对位移 
      sendingMessage[8] = this.mouseData.mouseMovementX * 2 & 0xff;
      sendingMessage[9] = (this.mouseData.mouseMovementX * 2 >> 8) & 0xff;
      sendingMessage[10] = this.mouseData.mouseMovementY * 2 & 0xff;
      sendingMessage[11] = (this.mouseData.mouseMovementY * 2 >> 8) & 0xff;
      // 控制码
      sendingMessage[12] = this.controlCode;
      // 键盘状态
      sendingMessage[13] = this.keyStatus;
      let newKeyArray = [...this.keyArray, ...this.btnKeyArray];
      sendingMessage[14] = newKeyArray.length;
      // 具体按键keycode
      for (let i = 0; i < newKeyArray.length; i++) {
        sendingMessage[15 + i] = newKeyArray[i];
      }
      if (this.connChannel) this.connChannel.send(sendingMessage);
    },
    /*  webrtc相关  */
    handleIceConnChange(event) {
      console.log("connection change");
      let pc = this.peerConn;
      console.log("连接状态", pc);
      if (pc == null) {
        return;
      }
      //this.tracelog(event);
      //this.tracelog(pc);
      //this.tracelog(pc.iceConnectionState);
      if (
        pc.iceConnectionState === "disconnected" &&
        this.connStatus === this.connStatusFlag.connected
      ) {
        //this.tracelog(pc.iceConnectionState);
        this.tryReconn(true);
      }
    },
    // 设置本地SDP并发送
    setLocalAndSendMessage(sessionDescription) {
      //this.tracelog("set local description");
      //this.tracelog(this.hashKey);
      //this.tracelog(sessionDescription);
      //this.tracelog(sessionDescription.sdp);
      this.peerConn.setLocalDescription(sessionDescription);
      let sendData =
        "hashKey=" +
        this.hashKey +
        "&sdp=" +
        JSON.stringify(sessionDescription) +
        "&type=answer";
      this.httpSend(sendData, "/api/sdp.evt");
    },
    // 设置本地SDP失败
    onCreateSessionDescriptionError(error) {
      //this.tracelog(
      //   "Falied to create session description: " + error.toString()
      // );
    },
    handleServerSDP(offer) {
      console.log("handel server sdp 创建rtc");
      //this.tracelog("pcConfig:");
      //this.tracelog(this.pcConfig);
      let rtc =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      this.peerConn = new rtc(this.pcConfig);
      this.peerConn.ondatachannel = this.receiveChannelCallBack;
      // 安卓 华为畅享 9s  不能执行
      this.peerConn.onicecandidate = this.handleIceCandidate;
      this.peerConn.onaddstream = this.handleRemoteStreamAdded;
      this.peerConn.ontrack = this.handletrackAdded;
      this.peerConn.onremovestream = this.handleRemoteStreamRemoved;
      this.peerConn.oniceconnectionstatechange = this.handleIceConnChange;

      let rtcSession =
        window.RTCSessionDescription ||
        window.mozRTCSessionDescription ||
        window.webkitRTCSessionDescription;
      this.peerConn.setRemoteDescription(new rtcSession(offer));
      this.peerConn
        .createAnswer()
        .then(
          this.setLocalAndSendMessage,
          this.onCreateSessionDescriptionError
        );
    },
    // 远端流加入
    handletrackAdded(event) {
      console.log("Handle remote stream tracked added");
      //this.tracelog(event);
      // console.log("执行 handletrackAdded");
      // video 添加 onplay 事件 执行onVideoPlaying 完成后正式进入
      if (this.connectIsShow) {
        sessionStorage.setItem("isVisablty", JSON.stringify(true));
        this.cutPicture();
        this.imgShow = true;
        setTimeout(() => {
          $("#remoteVideo")[0].srcObject = event.streams[0];
          // console.log('111srcObject', event.streams[0])
          $("#remoteVideo")[0].onplay = this.onVideoPlaying;
        }, 1000);
      } else {
        $("#remoteVideo")[0].srcObject = event.streams[0];
        $("#remoteVideo")[0].onplay = this.onVideoPlaying;
        // console.log('111srcObject', event.streams[0])
      }
    },
    handleRemoteStreamAdded(event) {
      console.log("Remote  handleRemoteStreamAdded");
      //this.tracelog(event);
      this.remoteStream = event.stream;
      $("#remoteVideo")[0].addEventListener(
        "loadedmetadata",
        this.onVideoPlaying
      );
      $("#remoteVideo")[0].srcObject = this.remoteStream;
      $("#remoteVideo")[0].onplay = this.onVideoPlaying;
      // console.log('222srcObject', event.streams[0])
    },
    // 远端流移除
    handleRemoteStreamRemoved(event) {
      //this.tracelog("remote stream removed event");
      this.remoteStream = null;
      this.connFail(true, "remote stream removed");
    },
    // 本地候选人事件
    handleIceCandidate(event) {
      //this.tracelog("ice candidate event");
      //this.tracelog(event.candidate);
      if (event.candidate) {
        this.candidataFirst++;
        let candidateSelf = {
          type: "candidate",
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        };
        let dataSend =
          "hashKey=" +
          this.hashKey +
          "&candidate=" +
          candidateSelf.candidate +
          "&sdpMLineIndex=" +
          candidateSelf.sdpMLineIndex +
          "&sdpMid=" +
          candidateSelf.sdpMid;
        // console.log("candidate", candidateSelf);
        console.log("candidate dataSend", dataSend);
        this.httpSend(dataSend, "/api/candidate.evt");
      } else {
        //this.tracelog("End of candidates");
      }
    },
    // 处理远端候选人事件
    handleServerCandidate(candidateInfo) {
      let candidate = new RTCIceCandidate({
        sdpMLineIndex: candidateInfo.sdpMLineIndex,
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
      });
      this.peerConn && this.peerConn.addIceCandidate && this.peerConn
        .addIceCandidate(candidate)
        .then(this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    },
    onAddIceCandidateSuccess() {
      console.log("ok,add Ice candidate ok!");
    },
    onAddIceCandidateError(error) {
      //this.tracelog("error,local add Ice candidate fail");
      this.connError(this.errorMsg[3] + "(202)", 1);
      let eventInfo = {
        errorcode: "202",
        $pagename: this.gameName,
        port: this.loadData.port,
        $tne: '版本不匹配'
        // idc: "",
      };
      this.$record("connecting_error", eventInfo);
    },
    // 收到通道事件
    receiveChannelCallBack(event) {
      if (this.firstenter) {
        let eventInfo = {
          roomdetail_up_time: new Date().getTime() - this.nowTime,
        };
        this.nowTime = new Date().getTime()
        // console.log('时间5',new Date().getTime()-this.nowTime)
        this.$record("precheck_data_ready", eventInfo);
      }
      console.log("打开数据通道");
      //this.tracelog("success open datachannel");
      this.connChannel = event.channel;
      this.connChannel.onopen = this.handleSendChannelOpen;
      this.connChannel.onmessage = this.handleConnChannelMessage;
      this.connChannel.onclose = this.handleConnChangeClose;
      this.connChannel.onerror = this.handleConnChannelError;
    },
    // 通道转为打开状态
    handleSendChannelOpen() {
      console.log("data channel open");
      this.stepStatus += 2;
      this.dataChannelReady = true;
      if (this.everConnected && this.videoReady) this.readyStart();
      else this.loadingProgress(19);
      // console.log("执行", this.dataChannelReady, this.initMsg.flag, this.isIos);
      // this.onVideoPlaying()
      if (this.initMsg.flag == 5 && this.isIos && !this.connectIsShow) {
        this.$dialog
          .alert({
            title: "",
            message: "开启游戏 ",
          })
          .then(() => {});
      }
    },
    // 通道发送数据
    sendOperation(data) {
      this.connChannel.send(data);
    },
    // 通道收到数据
    handleConnChannelMessage(event) {
      // console.log('通道数据',event)
      this.datachannelLastTime = new Date().getTime()
      let byteArray = new Uint8Array(event.data);
      this.handleChannelData(byteArray);
    },
    // 处理通道所收到的数据
    handleChannelData(data) {
      // console.log('通道收到的数据',data)
      if (this.pausing) return;
      // 绘制鼠标相关
      //   if(!this.mouseMode) {
      if (data[0] == "0x01") {
        // this.UImouseImg.show();
        // this.showKey();
        if (this.mouseMode === false) {
          $("#mouseImg").show();
          let strPng = this.arrayBufferToBase64(
            data.slice(13, data.length - 1)
          );
          this.$refs.mouse.src = "data:image/png;base64," + strPng;
        }
        let spot = data.slice(1, 5);
        this.mouseData.xhotspot = ((spot[1] & 0xff) << 8) | (spot[0] & 0xff);
        this.mouseData.yhotspot = ((spot[3] & 0xff) << 8) | (spot[2] & 0xff);
      } else if (data[0] == "0x03" || data[0] == "0x04") {
        $("#mouseImg").hide();
        // this.showKey();
      } else if (data[0] == "0x07") {
        // this.showKey();
        this.setShowTextKeyboard(true)
      }
      //   }
    },
    //  将字节数组转为base64格式
    arrayBufferToBase64(buffer) {
      let binary = "";
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    // 数据通道错误
    handleConnChannelError(error) {
      //this.tracelog("data channel error");
      this.connError(this.errorMsg[3] + "(205)", 1);
      let eventInfo = {
        errorcode: "205",
        $pagename: this.gameName,
        port: this.loadData.port,
        $tne:'数据通道错误'
        // idc: "",
      };
      this.$record("connecting_error", eventInfo);
    },
    // 数据通道关闭
    handleConnChangeClose() {
      console.log("data channel close...............");
    },
    // 当视频流开始播放时，设立相关状态位
    onVideoPlaying() {
      console.log("video ready");
      this.recordComeBackCount++
      if (this.recordComeBackCount === 1) {
        this.setNotifyComponent(true)
        this.getAction();
      }
      this.stepStatus++;
      let visable = JSON.parse(sessionStorage.getItem("isVisablty"));
      if (this.connectIsShow && visable) {
        this.$toast("重连成功");
        //发送重连成功数据
        var eventInfo = {
          connect_repair_result: "1",
        };
        this.connectIsShow = false;
        this.imgShow = false;
        clearInterval(this.connectTime);
        this.$record("connect_repair", eventInfo);
      }
      this.videoReady = true;
      if (this.everConnected && this.dataChannelReady) this.readyStart();
      else this.loadingProgress(19);
    },
    // 打乱数组
    shuffle(arr) {
      for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
      }
      return arr;
    },
    // 把json对象转换为url参数
    jsonToUrl(jsonObj) {
      let params = Object.keys(jsonObj)
        .map(function (key) {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(jsonObj[key])
          );
          keyboard_index;
        })
        .join("&");
      return params;
    },
    // 修复重启
    reset() {
      //this.tracelog("reset the process");
      let sendData = "hashKey=" + this.hashKey + "&optionType=17";
      if (this.loadData.appMsg) {
        //this.tracelog("ok,app-partern");
        sendData += "&value1=" + 1;
      } else {
        sendData += "&value1=" + 0;
      }
      this.httpSend(sendData, "/api/options.evt", false);
    }
  }
}