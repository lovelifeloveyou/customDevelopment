export default {
  methods: {
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
            // console.log('stats',report)
            if (report.type == "inbound-rtp") {
              // console.log('stats',report)
              if (report.id.match("Video") != "null") {
                if(report.framesPerSecond){
                  if(report.framesPerSecond < 5){
                    that.framesPerSecondCount++;
                    if(that.framesPerSecond > 3 && that.framesPerSecondFirst){
                      that.framesPerSecondFirst = false;
                      var eventInfo = {
                        port: that.framesPerSecondCount,
                      };
                      that.$record('framespersecond',eventInfo)
                    }
                    console.log('report.framesPerSecond11',report.framesPerSecond)
                  }else{
                    that.framesPerSecondCount = 0;
                    console.log('report.framesPerSecond',report.framesPerSecond)
                  }
                }
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
                // console.log(report.bytesReceived,src);
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
      }, 1000);
    },
    /*  webrtc相关  */
    handleIceConnChange(event) {
      console.log("connection change");
      this.channelFist = false;
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
      this.httpSend(sendData, "/api/sdp.evt", false, this.hashKey);
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
      //this.tracelog("Handle remote stream tracked added");
      //this.tracelog(event);
      // console.log("执行 handletrackAdded");
      // video 添加 onplay 事件 执行onVideoPlaying 完成后正式进入
      if (this.connectIsShow) {
        sessionStorage.setItem("isVisablty", JSON.stringify(true));
        this.cutPicture();
        this.imgShow = true;
        setTimeout(() => {
          $("#remoteVideo")[0].srcObject = event.streams[0];
          $("#remoteVideo")[0].onplay = this.onVideoPlaying;
        }, 1000);
      } else {
        $("#remoteVideo")[0].srcObject = event.streams[0];
        $("#remoteVideo")[0].onplay = this.onVideoPlaying;
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
    },

    // 远端流移除
    handleRemoteStreamRemoved(event) {
      //this.tracelog("remote stream removed event");
      this.remoteStream = null;
      this.connFail(true, "remote stream removed");
    },
    /* ============ candidate 相关 ============ */
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
        this.httpSend(dataSend, "/api/candidate.evt", false, this.hashKey);
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
      this.peerConn
        .addIceCandidate(candidate)
        .then(this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    },
    onAddIceCandidateSuccess() {
      console.log("ok,add Ice candidate ok!");
    },
    onAddIceCandidateError(error) {
      //this.tracelog("error,local add Ice candidate fail");
      let eventInfo = {
        errorcode: "202",
        $pagename: this.gameName,
        port: this.loadData.port,
        $tne: "版本不匹配",
        // idc: "",
      };
      this.$record("connecting_error", eventInfo);
      this.connError(this.errorMsg[3] + "(202)", 1);
    },
    /* ========== data channel 相关 ==========  */
    // 收到通道事件
    receiveChannelCallBack(event) {
      if (this.firstenter) {
        let eventInfo = {
          roomdetail_up_time: new Date().getTime() - this.nowTime,
        };
        this.nowTime = new Date().getTime();
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
      this.datachannelLastTime = new Date().getTime();
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
        if (this.threeFingerClickFlag) {
          this.threeFingerClickFlag = false
          return
        }
        this.setShowTextKeyboard(true);
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
        $tne: "数据通道错误",
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
      this.recordComeBackCount++;
      if (this.recordComeBackCount === 1) {
        this.setNotifyComponent(true);
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
    }
  }
}