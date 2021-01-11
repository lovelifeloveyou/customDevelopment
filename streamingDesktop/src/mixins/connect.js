export default {
  methods: {
    // conn 连接
    isHref() {
      console.log("进去初始链接");
      // 本地连接
      if (this.$config.directTest) {
        console.log("本地");
        // let paramMsg = util.decrypt(
        //   "U2FsdGVkX19zOcVTf3Jg4HaMHvCZrSVXKFohba3QYzE/PvdGf+C+Tl+UtnTxGiWrmScUsG/Zq3Wn+ks53MUeOLliHKPwYkiNutO9T7ri4pgEwLrM8d6FpRMps0HWbHD42WcYGQYkYgTa14bCBoXs8EiLg1FmC5njGjb59PA1OviUjr0kRt+0lnps3yo1lyoR"
        // );
        // console.log(paramMsg);
        this.initServer();
      } else {  // 线上
        this.stepStatus = 1;
        // console.log("stepStatus");
        let paramData = sessionStorage.getItem("param");
        // console.log(paramData);
        let paramMsg = util.decrypt(paramData);
        // console.log("paramMsg", paramMsg);
        this.loadingProgress(10);

        let appData = sessionStorage.getItem("app");
        console.log("appData", appData);
        console.log("decodeURIComponent(appData)", decodeURIComponent(appData));
        let dataMsg = util.decrypt(appData);
        let serviceDefault = {
          serviceId: dataMsg && dataMsg.g_mark ? dataMsg.g_mark : "标配服务",
          keyId:
            Number(dataMsg && dataMsg.key_id) === 3725425
              ? 0
              : Number(dataMsg && dataMsg.key_id),
        };
        localStorage.setItem(
          "openDefaultKeyboard",
          JSON.stringify(serviceDefault)
        );
        console.log("dataMsg11111", dataMsg);
        if (dataMsg != null) {
          if (dataMsg.g_path != null)
            dataMsg.g_path = dataMsg.g_path.replace(/\\/g, "/");
          if (dataMsg.g_picurl != null)
            dataMsg.g_picurl = dataMsg.g_picurl.replace(/\\/g, "/");
        }
        if (paramMsg == null) {
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne: "paramMsg为null",
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
          this.errorReport = true;
          this.connError(this.errorMsg[2] + "(501)", 4);
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
        if(this.errorReport) return
        let tne = "";
        switch (Number(that.stepStatus)) {
          case 1:
            tne = "数据未正确取出";
            break;
          case 2:
            tne = "收不到hashKey";
            break;
          case 3:
            tne = "未收到sdp";
            break;
          case 4:
            tne = "通道、视频未就位";
            break;
          case 5:
            tne = "视频未收到";
            break;
          case 6:
            tne = "未执行视频自动播放";
            break;
        }
        if (
          that.stepStatus < 2 &&
          !that.connectIsShow &&
          !that.freeIsEnd &&
          !that.memberFreeIsEnd
        ) {
          let code = "40" + that.stepStatus;
          let eventInfo = {
            errorcode: code,
            $pagename: that.gameName,
            port: that.loadData.port,
            $tne: tne,
            // idc: "",
          };
          that.$record("connecting_error", eventInfo);
          that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 4);
        } else {
          if (!that.connectIsShow && !that.freeIsEnd && !that.memberFreeIsEnd) {
            if (that.candidataFirst == 1) {
              that.stepStatus = 9;
              tne = "未找到服务器";
            }
            let code = "40" + that.stepStatus;
            let eventInfo = {
              errorcode: code,
              $pagename: that.gameName,
              port: that.loadData.port,
              $tne: tne,
              // idc: "",
            };
            that.$record("connecting_error", eventInfo);
            that.connError(that.errorMsg[1] + "(40" + that.stepStatus + ")", 1);
          }
        }
      }, 30000);
    },
    // 将数据转为base64
    encodeBase(jsonData) {
      // this.tracelog("encode base...");
      let str = JSON.stringify(jsonData);
      // this.tracelog(str);
      let Base64 = require("js-base64").Base64;
      let base64 = Base64.encode(str);
      // this.tracelog(base64);
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
          let eventInfo = {
            errorcode: "501",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne: "paramMsg为null",
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
          this.errorReport = true;
          this.connError(this.errorMsg[3] + "(501)", 4);
          return;
        }
        this.loadData.serverUrl = this.loadData.ip + ":" + this.loadData.port;
      }
      //this.tracelog(this.loadData.ip, this.loadData.port);
      // let payCode = localStorage.getItem("payCode");
      // if (payCode != this.orderId) this.sendConn();

      // 1
      //this.sendConn();
      this.conn();
    },
    // 向server发送连接请求
    conn() {
      this.channelFist = false;
      if(!this.firstenter){
        this.serverUsing = 0;
      }
      // this.tracelog("connect server");
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      this.hashKey = null;
      // 连接状态
      this.connStatus = this.connStatusFlag.waitConnect;
      this.pausing = true;
      this.videoReady = false;
      this.dataChannelReady = false;

      // 1
      // this.controlIntervalSendStart(2000);
      this.HeartBeatSendingIterval()
      console.log('发送握手')
    },
    // 发送初始连接请求
    sendConn() {
      let app = 0,
        runLevel = 0;
        this.hashKey = null;
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
      this.httpSend(data, type, true, this.hashKey);
    },
    // 向server请求获取分辨率
    getDPI() {
      let data = "hashKey=" + this.hashKey + "&optionType=" + 2;
      let type = "/api/options.evt";
      this.httpSend(data, type, false, this.hashKey);
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
      this.httpSend(sendData, "/api/options.evt", false, this.hashKey);
    },
    // 处理stun服务器ip列表
    handleStunServer(serverList) {
      this.candidataFirst = 0;
      let len = serverList.length;
      if (len < 1) {
        let eventInfo = {
          errorcode: "206",
          $pagename: this.gameName,
          port: this.loadData.port,
          $tne: "收到的serverlist为空",
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
        this.errorReport = true;
        this.connError(this.errorMsg[3] + "(206)", 1);
      }
      serverList = serverList.map(function (value, index, arr) {
        let str = "stun:" + value;
        return { urls: str };
      });
      this.pcConfig = {
        iceServers: serverList,
      };
    },
    //一分钟监测
    byteUp() {
      if(!this.channelFist) return;
      this.packetTime = setInterval(() => {
        console.log('df',this.pageShift,this.packetNum,typeof(this.packetNum))
        if (this.packetNum <= 10) {
          if(this.packetShift){
            console.log('df224',this.pageShift,this.packetNum,typeof(this.packetNum))
            if (this.pageShift < 3) {
              this.$toast({
                position: this.isHorizontalScreen ? 'bottom' : '',
                className: this.isHorizontalScreen ? '' : 'highLatencyPortraitStyle',
                message:
                  "检测到您的网络状态良好，系统已帮您将画质调整至目标画质。",
                duration: 2000,
              });
              this.byteRateChange(Number(this.pageShift) + 1,false);
            }
          }
        }
      }, 60000);
    },
    // 通知服务端切换比特率
    byteRateChange(value, state) {
      if (this.initMsg != 10) {
        if (state) {
          let mess
          switch(value){
            case 0:  
              mess = '低'
              break
            case 1:  
              mess = '中'
              break
            case 2:  
              mess = '高'
              break
            case 3:  
              mess = '超高'
              break
            case 4:  
              mess = '自动'
              break
          }
          this.$toast({
            position: this.isHorizontalScreen ? "bottom" : "",
            className: this.isHorizontalScreen
              ? ""
              : "highLatencyPortraitStyle",
            message:'切换成功，当前为'+mess+'画质',
            duration: 2000,
          });
          this.exportShift = value;
          if (value != 4) {
            this.pageShift = value;
            this.packetShift = false;
            localStorage.setItem("pageShift", value);
          } else {
            this.pageShift = 2;
            this.packetShift = true;
            localStorage.setItem("pageShift", value);
            value = 2;
          }
        } else {
          this.pageShift = value;
        }
        clearInterval(this.packetTime);
        this.byteUp();
      }
      console.log("切换画质", value, state, this.packetShift);
      switch (value) {
        case 0:
          value = 2000;
          break;
        case 1:
          value = 4000;
          break;
        case 2:
          value = 6000;
          break;
        case 3:
          value = 8000;
          break;
        case 4:
          value = 6000;
          break;
      }
      //this.tracelog("change byte rate to " + val);
      let data =
        "hashKey=" + this.hashKey + "&optionType=3" + "&value1=" + value;
      let type = "/api/options.evt";
      this.httpSend(data, type, false, this.hashKey);
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
      this.controlIntervalTime = 0;
      this.controlIntervalId = '';
      this.serverUsing = 0;
      this.remoteStream = null;
      this.connStatus = this.connStatusFlag.waitConnect;
      // this.peerConn = null;
      this.connChannel = false;
    },

    /*   ===================    控制流连接相关    =====================   */
    // 控制流发送数据
    httpSend(sendData, inter, simple, hashKey) {
      let curUrl = this.sigServer + this.loadData.serverUrl + inter;
      let that = this;
      $(function () {
        $.ajax({
          dataType: "jsonp",
          timeout: 11000,
          type: "get",
          contentType: "text/plain",
          data: sendData,
          url: curUrl,
        })
          .done(function (data) {
            console.log('httpsend')
            console.log(that.hashKey)
            console.log(hashKey)
            if(that.hashKey == hashKey) {
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
            }else{
              return;
            }
            
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
          })
          .always(function( XHR, status ){
            if(status == 'error'){
              if (inter == "/api/handshake.evt") {
                that.nonRespNum += 2000
                setTimeout(()=>{
                  console.log('hanshkey失败,再次请求')
                  that.HeartBeatSendingIterval()
                },2000)
              }
            }
            if(status == 'timeout'){
              console.log('请求超时',that.servertimeoutCount)
              if (inter == "/api/handshake.evt") {
                that.servertimeoutCount++;
                if(that.servertimeoutCount <= 2) {
                  console.log('超时握手')
                  that.tryReconn(true)
                }
                if(that.servertimeoutCount >2 && !that.firstenter){
                  that.$dialog
                  .alert({
                    title: "",
                    message: that.errorMsg[6],
                  })
                  .then(() => {
                    window.history.go(-1);
                    window.location.href = document.referrer;
                  });
                }
              }
            }
          //
          });
      });
    },
    // 控制流通过web服务器转发数据
    httpWebSend(sendData, inter) {
      let curUrl =
        process.env.NODE_ENV === "development"
          ? "video/transmit/" + this.loadData.serverUrl + inter
          : "transmit/" + this.loadData.serverUrl + inter;
      console.log("curUrl", curUrl);
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
      // console.log("请求状态", data.status);
      if (data.status < 0) {
        //出错执行失败
        //this.tracelog(data);
        if (data.status == -100) {
          // sessionKey校验失败
          if (this.sessionFirst) {
            this.sessionFirst = false;
            let eventInfo = {
              errorcode: "100",
              $pagename: this.gameName,
              port: this.loadData.port,
              $tne: "sessionkey不正确",
              // idc: "",
            };
            this.$record("connecting_error", eventInfo);
          }
          this.errorReport = true;
          this.connError(this.errorMsg[3] + "(100)", 1);
        } else if (data.status == -101) {
          // 服务正在使用中，拒绝连接
          this.serverUsing++;
          setTimeout(() => {
            this.tryReconn(false)
          }, 2000);
          if (this.serverUsing > 7) {
            this.errorReport = true;
            if(this.usingFirst){
              this.usingFirst = false;
              let eventInfo = {
                errorcode: "503",
                $pagename: this.gameName,
                port: this.loadData.port,
                $tne: "服务正在使用中，拒绝连接",
                // idc: "",
              };
              this.$record("connecting_error", eventInfo);
            }
            this.connError(this.errorMsg[4], 1);
          }
        } else if (data.status == -102) {
          // 版本不匹配
          //      this.connError(false,102,true);
        } else if (data.status == -103) {
          // 设置sdp失败
          let eventInfo = {
            errorcode: "103",
            $pagename: this.gameName,
            port: this.loadData.port,
            $tne: "设置sdp失败",
            // idc: "",
          };
          this.$record("connecting_error", eventInfo);
          this.errorReport = true;
          this.connError(this.errorMsg[3] + "(103)", 1);
        } else if (data.status == -104) {
          // candidata失败
          //   this.connError(false,104,true)
        } else if (data.status == -105) {
          // hashKey失败，自动尝试重连
          //微信获取 hashKey 失败
          console.log("hashkey 失败 ！！！！！！！！！！！");
          this.channelFist = false;
          if(this.connStatus == this.connStatusFlag.connectting) return
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
        this.servertimeoutCount = 0;
        this.hashKey = data.hashKey;
        this.connStatus = this.connStatusFlag.connectting;
        this.controlIntervalSendModify(200);
        let that = this;
        // setTimeout(() => {
        //   console.log('更改心跳10s定时器')
        //   that.controlIntervalSendModify(1000);
        // }, 10000);
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
          if(this.candidateArr) {
            for(let candidate of this.candidateArr) {
              console.log('当candidate存在数据时')
              console.log(candidate)
              this.handleServerCandidate(candidate)
            }
          }
          
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
        // for (let candidate of data.candidateValue) {
        //     this.handleServerCandidate(candidate);
        //   }
        if(this.peerConn != null) {
          console.log('peerConn不为null')
          for (let candidate of data.candidateValue) {
            this.handleServerCandidate(candidate);
          }
        }else{
          console.log('peerconn为null')
          Array.prototype.push.apply(this.candidateArr, data.candidateValue)
          console.log(this.candidateArr)
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
      // this.controlIntervalTime = intervalTime;
      // this.nonRespNum = 0;
      // this.controlIntervalId = setInterval(
      //   this.HeartBeatSendingIterval,
      //   intervalTime
      // );
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
      // console.log('nonrespnum');
      // console.log(this.nonRespNum)
      this.nonRespNum += this.controlIntervalTime;
      console.log("发送心跳", this.nonRespNum,this.controlIntervalTime);
      // 超时检测
      if (this.nonRespNum == 4000 || this.nonRespNum == 8000) {
        //   切换代理服务器
        //this.tracelog("change sigServer\n");
        this.sigServerIndex =
          (this.sigServerIndex + 1) % this.sigServerArr.length;
        this.sigServer = this.sigServerArr[this.sigServerIndex];
      }
      if (this.memberFreeIsEnd) {
        this.channelFist = false;
        console.log("使用时间结束", this.memberFreeIsEnd);
        this.$dialog
          .alert({
            title: "提示",
            message: this.errorMsg[8],
          })
          .then(() => {
            window.history.go(-1);
            window.location.href = document.referrer;
          });
        return;
      }
      if (
        !navigator.onLine &&
        !this.connectIsShow &&
        !this.freeIsEnd &&
        !this.memberFreeIsEnd
      ) {
        //断网状态
        // this.cutPicture();
        if(!this.firstenter){
          this.channelFist = false;
          this.controlTimeout();
          return;
        }
      }
      if (
        this.nonRespNum >= 10000 &&
        !this.freeIsEnd &&
        !this.memberFreeIsEnd
      ) {
        this.nonRespNum = 0;
        console.log("发送超时");
        this.channelFist = false;
        // 发送超时
        this.controlTimeout();
        return;
      }
      // 发送握手数据
      console.log('握手状态',this.connStatus)
      if (this.connStatus === this.connStatusFlag.waitConnect) {
        this.channelFist = false;
        this.sendConn();
        return;
      }
      let channelTime = new Date().getTime() - this.datachannelLastTime;
      //预计改为5s
      if (
        this.nonRespNum <= 5000 &&
        channelTime >  10000 &&
        this.onVideo &&
        this.dataChannelReady &&
        this.channelFist && 
        !this.memberFreeIsEnd &&
        !this.freeIsEnd
      ) {
        console.log("数据通道333", channelTime);
        this.channelFist = false;
        //测试
        // this.$toast({
        //   position: "bottom",
        //   message: "数据通道断开",
        //   duration: 10000,
        // });
        let eventInfo = {
          errorcode: "601",
          $pagename: this.gameName,
          port: this.loadData.port,
          $tne: "数据通道断开",
          // idc: "",
        };
        this.$record("connecting_error", eventInfo);
      }
      // 发送需发送的上次发送失败数据
      // console.log("错误信息", this.waittingSendInter);
      for (let i in this.waittingSendArr) {
        this.httpSend(
          this.waittingSendArr[i],
          this.waittingSendInter[i],
          false,
          this.hashKey
        );
      }
      this.waittingSendArr = [];
      this.waittingSendInter = [];
      // 抖音小程序安卓报错
      // console.log("发送hashkey请求");
      let sendData = "hashKey=" + this.hashKey + "&optionType=5";
      this.httpSend(sendData, "/api/options.evt", true, this.hashKey);
    },
    // 页面被关闭
    pageClose() {
      //this.tracelog("page close");
      if (
        this.connStatus === this.connStatusFlag.connected ||
        this.connStatus === this.connStatusFlag.connectting
      ) {
        //this.tracelog("sending disconn");
        this.sendingDisconn();
      }
      this.disconnect();
    },

    /*   ==================      连接状态相关    =================  */
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
      this.controlIntervalSendModify(1000);
      // 开启网速计算定时器
      this.netSpeedComputeIntervalStart();
      // 连接中途断开所致重连

      // load图片隐藏
      this.loadImgShow = false
      this.loadingShow = true;
      console.timeEnd("进入流桌面时间");
      // this.UIvideoImg.show();
      
      // 清空键位状态
      this.controlCode = 0;
      this.set_EmptyKey();
      this.set_BtnEmptyKey();
      this.mouseClickFlag = 0;
      this.pausing = false;

      this.channelFist = true;
      this.datachannelLastTime = new Date().getTime();
      if (this.firstenter) {
        let shift = Number(localStorage.getItem('pageShift'))
        if ([0,1,2,3,4].includes(shift)) {
          this.pageShift = shift;
          this.exportShift = shift;
          if (this.pageShift == 4) {
            this.packetShift = true;
            this.pageShift = 2;
          }
          this.byteRateChange(this.pageShift, false);
        } else {
          localStorage.setItem("pageShift", this.pageShift);
          this.byteRateChange(this.pageShift, false);
        }
        this.byteUp();
        this.firstenter = false;
        let type = localStorage.getItem("entryType");
        let nowEnter = JSON.parse(sessionStorage.getItem("isFirstInto"));
        let eventInfo = {
          $pagename: this.gameName,
          serverip: this.loadData.ip,
          enter_type: type == 1 ? "按量付费" : "体验免费",
          order_id: this.orderId,
          is_first_time:nowEnter
          //暂时只有虚拟按键，暂时不传
          // idc:'',
          // devicetype:'虚拟按键',
          // devicename:'',
        };
        console.log('enter',eventInfo)
        this.$record("connection_succeeded", eventInfo);
        let latency = new Date().getTime() - this.startTime;
        let eventInfos = {
          roomdetail_up_time: latency,
          $duration: new Date().getTime() - this.nowTime, 
        };
        console.log("时间", new Date().getTime() - this.startTime);
        this.$record("precheck_video_ready", eventInfos);
      }
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
    },

    /*   ==================      连接异常处理    =================  */
    // 连接报错处理
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
      this.$dialog
        .alert({
          message: msg,
        })
        .then(() => {
          // on confirm
          if(this.errorReport){
            window.location.href = document.referrer;
          }
          window.history.go(-1);
          window.location.href = document.referrer;
        });
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
    }
  }
}