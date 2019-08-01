//--------报警通知模块--------------//

/**
 * 初始化报警通知
 */
APP110.mods["notice"].init = function () {
  APP110.isNoticeInit = true;
  if (APP110.callModFun("consoleState", "isReceivingAlarm")) {
    //订阅报警通知
    APP110.callModFun("notice", "initNotice");
  }
  // 主动获取报警排队人数
  if (APP110.mods["notice"].alarmWaitCountTimeOut) {
    clearTimeout(APP110.mods["notice"].alarmWaitCountTimeOut);
    APP110.mods["notice"].alarmWaitCountTimeOut = null;
  }
  // 主动获取报警排队数
  APP110.callModFun("notice", "activeGetAlarmWaitCount");
}

/**
 * 从PubSub组件订阅个人消息事件
 */
APP110.mods["notice"].subscribePersonMsgEvent = function () {
  // 订阅排队人数事件
  GLOBAL.subscribeToPubSub(EVENT.R_ALARM_WAIT_COUNT,
      APP110.mods["notice"].updateAlarmWaitCount);

  // 订阅可能为同一警情事件
  GLOBAL.subscribeToPubSub(EVENT.R_ALARM_MAYBE_SAME,
      APP110.mods["notice"].dealMaybeSameAlarm);

  // 订阅取消处理警情事件
  GLOBAL.subscribeToPubSub(EVENT.R_ALARM_CANCLE_DEAL,
      APP110.mods["notice"].dealAlarmCancle);
}

/**
 * 从PubSub组件取消订阅个人消息事件
 */
APP110.mods["notice"].unSubscribePersonMsgEvent = function () {
  // 取消订阅排队人数事件
  GLOBAL.unSubscribeFromPubSub(EVENT.R_ALARM_WAIT_COUNT);

  // 取消订阅可能为同一警情事件
  GLOBAL.unSubscribeFromPubSub(EVENT.R_ALARM_MAYBE_SAME);

  // 取消订阅取消处理警情事件
  GLOBAL.unSubscribeFromPubSub(EVENT.R_ALARM_CANCLE_DEAL);
}

/**
 * 重置报警通知
 */
APP110.mods["notice"].reset = function () {
  APP110.isSubscribeAlert = false;
  if (APP110.callModFun("consoleState", "isReceivingAlarm")) {
    //重新订阅报警通知
    APP110.callModFun("notice", "initNotice");
  }
  localStorage.removeItem('currentLat');
  localStorage.removeItem('currentLng');
  localStorage.removeItem('currentAddress');
  localStorage.removeItem('currentBjr');
}

/**
 * 订阅Alert队列回调函数
 * @param m
 */
APP110.mods["notice"].subscribeAlertCallback = function (m) {
  console.log("订阅报警推送得到结果……………………：%o", m);
  var body;
  try {
    body = JSON.parse(m.body);
  } catch (e) {
    layer.alert("解析报警推送消息异常：" + e.message + "\n\n" + m.body);
    console.error("解析报警推送消息异常：%s", m.body);
    APP110.isSubscribeAlert = false;
    return;
  }
  // 停止订阅报警
  APP110.callModFun("notice", "stopNotice");
  // 处理报警
  APP110.callModFun("notice", "dealAlarmInfo", body.body);
}

/**
 * 初始化
 */
APP110.mods["notice"].initNotice = function () {
  //重置警情
  APP110.currentMedia = false;
  $("#caseFromDiv").hide();
  if (APP110.currentCase) {
    console.log("当前报警未进行处理，无法重新订阅");
    return;
  }
  //此处应该初始化服务器推送功能
  if (!skynetSocket) {
    layer.alert("客户端消息服务异常，请刷新页面重试！")
    return;
  }
  if (!GLOBAL.stompConnected) {
    layer.alert("客户端消息服务未连接，请刷新页面重试！")
    return;
  }
  if (APP110.isSubscribeAlert) {
    console.log("重复订阅，已取消本次订阅");
    return;
  } else {
    APP110.isSubscribeAlert = true;
  }
  var userId = $("#currentLoginUserId").val();
  console.log("我要订阅：" + userId);

  // 从PubSub组件中订阅个人消息事件
  APP110.callModFun("notice", "subscribePersonMsgEvent");
  // 订阅Alert队列
  GLOBAL.subscribeToMq("/queue/ALERT",
      APP110.mods["notice"].subscribeAlertCallback);
}

/**
 * 当停止接警时，调用
 */
APP110.mods["notice"].stopNotice = function () {
  if (!skynetSocket) {
    console.log("重置接警通知时，发现没有连接，不做后续处理");
    return;
  }
  if (!skynetSocket.connected) {
    console.log("重置接警通知时，发现客户端消息服务尚未连接，不做后续处理");
    return;
  }

  // 停止订阅Alert
  GLOBAL.unSubscribeFromMq("/queue/ALERT");
  APP110.isSubscribeAlert = false;

  console.log("停止订阅接警通知...");
}

/**
 * 处理推送过来的报警信息
 * @param noticeObj
 */
APP110.mods["notice"].dealAlarmInfo = function (noticeObj) {
  noticeObj.display = noticeObj.creator;
  //以报警信息的id为key来缓存报警信息
  var nid = noticeObj.id;
  APP110.noticeMap[nid] = noticeObj;

  getUserInfo(noticeObj.creator, function (data) {
    console.log("获取报警人信息：%o", data);
    if (!data.status) {
      layer.msg("未获取到报警人的信息" + data.error);
      data.obj = {"userId": noticeObj.creator, "nickName": "未知用户"}
    }
    //补充报警人信息
    noticeObj["creatorObj"] = data.obj;

    //如果有通知，则修改弹出通知的提示姓名
    var n = $("#notice_" + nid);
    if (n.length > 0) {
      n.find(".info span").html(data.obj.name);
    }
    // 调用展现右下角弹窗提示报警方法
    APP110.callModFun("notice", "showNotice", noticeObj);
  });
};

/**
 * 显示报警弹窗
 * @param {Object} noticeObj 弹窗显示内容对象
 */
APP110.mods["notice"].showNotice = function (noticeObj) {
  var content = $("#notice-template").html();
  //替换
  content = (content + "").replace(/{{NOTICE-ALARM-ID}}/g, noticeObj.id);
  content = (content + "").replace(/{{NOTICE-ALARM-CLASS}}/g, noticeObj.id);
  // 默认值
  var title = '<i class="icon iconfont icon-shipinbaojing color-white"></i> 实时视频报警';
  // 根据不同的报警类型进行样式和文字设置
  if (noticeObj.alarmType == "101") {
    title = '<i class="icon iconfont icon-jingmobaojing color-white"></i> 静默视频报警';
  } else if (noticeObj.alarmType == "105") {
    title = '<i class="icon iconfont icon-SOS color-white"></i> SOS紧急求救';
  } else if (noticeObj.alarmType == "106") {
    title = '<i class="icon iconfont icon-anquanshouhushenbaojing color-white"></i> 安全守护神报警';
  }
  var tmpc = noticeObj.creatorObj;
  // 按照 真实姓名，昵称，账号 顺序显示
  var name = tmpc.name ? tmpc.name : (tmpc.nickName ? tmpc.nickName
          : tmpc.userName);
  // 替换标题和报警人名称
  content = (content + "").replace(/{{NOTICE-ALARM-TITLE}}/g, title);
  content = (content + "").replace(/{{NOTICE-ALARM-NICKNAME}}/g, name);

  // 报警左下角弹窗提示，并存储弹窗标识
  APP110.noticeWin[noticeObj.id] = layer.open({
    type: 1,
    title: false,//不显示标题
    closeBtn: 0,//不显示关闭按钮
    shade: 0,//不显示遮罩层
    area: '340px',//宽度340px，高度自适应
    offset: 'rb',//右下角弹出
    shift: 2,//动画类型
    content: content
  });
  // 根据不同类型的警情设置弹窗标题的不同背景色
  if (noticeObj.alarmType == "100") {
    $("div.receiving-alarm-box p").css("background-color", "#e5621a");
  } else if (noticeObj.alarmType == "106") {
    $("div.receiving-alarm-box p").css("background-color", "#e5621a")
  }
  // 设置现场视频显示为黑色背景
  $(".video-box").css("background", "#000000 none");
  APP110.currentMedia = APP110.noticeMap[noticeObj.id];
  // 播放报警提醒声音
  APP110.callModFun("notice", "playAlarmAudio");
  //是否传送音频
  var useAudio = APP110.currentMedia.alarmType == "101" ? false : true;
  //是否传送视频
  var useVideo = false;
  try {
    //初始化视频
    APP110.callModFun("kurento", "initKurentoConfig", useAudio, useVideo);
    //加入房间
    APP110.callModFun("kurento", "joinRoom", noticeObj.id, noticeObj.pin,
        noticeObj.secret);
  } catch (e) {
    console.error("接警员加入房间失败!");
  }

  // 先清除之前的计时器
  if (APP110.mods["notice"].waitCountDownTimeout) {
    clearTimeout(APP110.mods["notice"].waitCountDownTimeout);
    APP110.mods["notice"].waitCountDownTimeout = null;
  }
  // 接警提示倒计时
  APP110.callModFun("notice", "policeWaitStart");
};

/**
 * 播放报警提醒声音
 */
APP110.mods["notice"].playAlarmAudio = function () {
  var alarmAudio = document.getElementById("alarmAudio");
  var sinkId = $("#alarmAudioOutput").val();
  if (sinkId) {
    alarmAudio.setSinkId(sinkId);
  }
  alarmAudio.play();
}

/**
 * 停止报警提示声音
 */
APP110.mods["notice"].stopAlarmAudio = function () {
  try {
    var alarmAudio = document.getElementById("alarmAudio");
    alarmAudio.pause();
    //重新加载，从头播放
    alarmAudio.load();
  } catch (e) {
  }
}

/**
 * 处理可能为同一警情的推送消息
 * @param msg
 * @param data
 */
APP110.mods["notice"].dealMaybeSameAlarm = function (msg, data) {
  console.log("处理可能为同一个警情消息：%o", data);
  var body = data;
  try {
    if(!APP110.currentBjr){
      return;
    }
    var maybeSameNum = body.body.num;
    setNoReadTip(maybeSameNum);
  } catch (e) {
    console.error("解析可能为同一个报警推送消息异常：%s", data.body);
    return;
  }
}

/**
 * 报警通知处理
 * @param {Object} type 0拒绝；1接受
 */
APP110.mods["notice"].noticeHandler = function (type, id) {
  layer.close(APP110.noticeWin[id]);
  // 先清除报警提醒计时器
  if (APP110.mods["notice"].waitCountDownTimeout) {
    clearTimeout(APP110.mods["notice"].waitCountDownTimeout);
    APP110.mods["notice"].waitCountDownTimeout = null;
  }
  // 停止报警提醒声音
  APP110.callModFun("notice", "stopAlarmAudio");
  delete APP110.noticeWin[id];
  if (type == 0) {
    //拒绝处理(繁忙)
    APP110.callModFun("notice", "refuseAlarm", id);
    return;
  }
  // 接受报警
  APP110.callModFun("notice", "acceptAlarm", id);
}

/**
 * 拒绝警情（繁忙）
 * @param id
 */
APP110.mods["notice"].refuseAlarm = function (id) {
  //挂断视频
  if (MyKurento.rws) {
    APP110.callModFun("kurento", "leaveRoom");
    APP110.callModFun("kurento", "reset");
    $('#videolocal').empty();
    $('#videoremote1').empty();
  }
  delete APP110.noticeMap[id];
  layer.msg("系统重新分配了接警员", {icon: 1}, function () {
  });
  // 将消息重新推回队列
  APP110.callModFun("notice", "repushToMq", APP110.currentMedia.caseId, false);
  if (APP110.callModFun("consoleState", "isReceivingAlarm")) {
    //重新订阅报警通知
    APP110.callModFun("notice", "initNotice");
  }
}



/**
 * 接受警情
 * @param id
 */
APP110.mods["notice"].acceptAlarm = function (id) {
  layer.msg("您接受了视频报警的接入", {icon: 1});
  $("#transfer").attr('disabled', false);
  APP110.currentBjr = APP110.currentMedia.creatorObj;
  // 重设地图页
  APP110.callModFun("map", "reset");
  // 展现视频下方的一排按钮，包括声音、麦克等按钮
  $("#show-voice-box").show();
  var caseid = APP110.currentMedia.caseId;
  //把caseid放到页面上，为了方便地图取案件信息
  $("#caseID").val(caseid);

  // 更新接警单状态，设置为：接警中
  APP110.callModFun("notice", "updateAlarmStatus");
  // 展现报警用户信息
  APP110.callModFun("notice", "showAlarmUserInfo");

  // 填充警单信息
  APP110.callModFun("notice", "fillCaseInfo");

  //给报警人的通知
  var note = "温馨提示：您的报警已接通，可以和接警员沟通了";
  APP110.callModFun("chat", "sendMsg", note, 0);
}

/**
 * 更新警情状态为接警中
 * @param caseId
 */
APP110.mods["notice"].updateAlarmStatus = function () {
  $.ajax({
    url: BASESERVLET + '/api/updateAlarmCaseStart',
    type: "post",
    data: {caseId: APP110.currentMedia.caseId},
    success: function (data) {
    }
  });
}

/**
 * 展现报警用户信息
 */
APP110.mods["notice"].showAlarmUserInfo = function () {
  var caseId = APP110.currentMedia.caseId;
  var bjr = APP110.currentBjr;
  // 更新用户信息展示
  APP110.callModFun("person", "fill", bjr);
  // 清空缓存中报警人的base64图片字符串
  localStorage.setItem("current_bjr_img", "");
  localStorage.setItem("caseId", caseId);
  //更新用户头像
  $.ajax({
    url: BASESERVLET + "/api/userpic/" + bjr.userId,
    type: "get",
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        console.log("获取报警人头像失败：" + data.error);
        return;
      }
      var face_url = '/theme/img/jiejingtai/head-img.jpg';
      if (data.obj != null) {
        var pics = data.obj;
        if ($.trim(pics.face) != '') {
          var file = pics.face.split("/");
          face_url = BASESERVLET + '/web/file/' + file[file.length - 1];
        }
      }
      $('#current_bjr_img').val(face_url);
      $("#bjrxx-tx").css('background-image', 'url("' + face_url + '")');
      // 设置报警人的图片为base64串，缓存到localStorage
      setImgBase64ToCache("current_bjr_img", face_url);
    }
  });
}

/**
 * 在页面上填充警情信息
 */
APP110.mods["notice"].fillCaseInfo = function () {
  var caseId = APP110.currentMedia.caseId;
  //根据caseid查询报警信息
  $.ajax({
    url: BASESERVLET + "/api/queryAlarmCase/" + caseId,
    type: "get",
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        layer.msg("获取报警详细信息失败:" + data.error, {icon: 2});
        return false;
      }
      var config = APP110.currentCase = data.obj;
      console.info(config);

      // 自主报警
      if (!config.caseFromMark) {
        $("#caseFromDiv").hide();
        // 安全守护神转入 or 紧急求救转入
      } else if (config.caseFromMark == "safe" || config.caseFromMark
          == "sos" || config.caseFromMark == "person") {
        var img = "<img src=\"/theme/img/dmtbj/search.png\" style=\"margin-left:3px;vertical-align: middle;width: 14px;height: 14px;\"/>";
        $("#caseFromDiv").show();
        $("#caseFrom").attr("t", config.caseFromMark);
        $("#caseFrom").attr("tid", config.caseFromMarkId);
        // 安全守护神转入
        if (config.caseFromMark == "safe") {
          $("#caseFrom").text("安全守护神").append(img);
          addClickHandler();
          // 紧急求救转入
        } else if (config.caseFromMark == "sos") {
          $("#caseFrom").text("紧急求救").append(img);
          addClickHandler();
        }
        //自主报警转入
        else if (config.caseFromMark == "person") {
          $("#caseFrom").text("自主报警").append(img);
          $("#caseFrom").unbind();
        }
      }

      var needInitRelatedMod = true;
      // 群众已经挂断
      if (config.hangup == 0) {
        // 接警员也离开房间
        APP110.callModFun("kurento", "leaveRoom");
        layer.confirm('用户已退出视频报警是否查看历史视频？', {
          btn: ['是', '否'] //按钮
        }, function () {
          layer.closeAll();
          if (config.media && config.media.participants[0]
              && config.media.participants[0].records[0]
              && config.media.participants[0].records[0].videoFile) {
            $("#currentVideo").val(
                config.media.participants[0].records[0].videoFile);
            $("#historyVideo").css("display", "block");
            APP110.callModFun("notice", "playCurrentVideo");
            APP110.isplay = true;
          }
          if (!APP110.isplay) {
            layer.msg("用户没有上传视频", {icon: 2});
          }

        }, function () {
          // 重置所有组件
          alarmEndReset();
          layer.closeAll();
          needInitRelatedMod = false;
        });
      } else {
        APP110.callModFun("kurento", "publishLocalVideo");
        //报警人坐标
        localStorage.setItem('currentLat', config.latitude);
        localStorage.setItem('currentLng', config.longitude);
        //案发地坐标
        localStorage.setItem('caseLat', config.caselat);
        localStorage.setItem('caseLng', config.caselon);

        localStorage.setItem('currentAddress', APP110.currentCase.address);
        localStorage.setItem('currentBjr', APP110.currentBjr.userId);
      }

      // 初始化看历史视频和正常接通下的公共模块
      if (needInitRelatedMod) {
        //初始化聊天
        APP110.callModFun("chat", "initChat");
        //初始化地图
        APP110.callModFun("map", "showCase", config.longitude,
            config.latitude, config.caselat, config.caselon, APP110.currentCase.address,
            APP110.currentBjr.userId);
        //初始化接警单信息
        APP110.callModFun("alarmCase", "fill", APP110.currentMedia,
            APP110.currentBjr);
      }
    }
  });
}

function addClickHandler() {
  $("#caseFrom").click(function () {
    var uid = $("#bjrxx-ls").attr("uid");
    var t = $(this).attr("t");
    var tid = $(this).attr("tid");
    if (!uid) {
      layer.msg("没有报警来源信息", {icon: 2});
      return false;
    }
    layer.open({
      type: 2,
      title: "来源详情",
      shadeClose: true,
      shade: 0.3,
      // area: ['800px', '80%'],
      area: ['1600px', '80%'],
      content: BASESERVLET + '/web/safetyRecord/toMap/' + uid + '/' + tid
    });
  });
}

//获取报案时的经纬度
APP110.mods["notice"].getLatandLon = function () {
  if (APP110.currentCase) {
    var lat = APP110.currentCase.latitude;
    var lon = APP110.currentCase.longitude;
    APP110.callModFun("map", "showCase", lon, lat, APP110.currentCase.address,
        APP110.currentBjr.userId);
    localStorage.setItem('currentLat', lat);
    localStorage.setItem('currentLng', lon);
    localStorage.setItem('currentAddress', APP110.currentCase.address);
    localStorage.setItem('currentBjr', APP110.currentBjr.userId);
  }
}

/**
 * 等待接警员接警，倒计时
 */
APP110.mods["notice"].policeWaitStart = function () {
  var wait_time = parseInt($('#police_wait_time').html());
  if (wait_time > 0) {
    $('#police_wait_time').html(wait_time - 1);
    APP110.mods["notice"].waitCountDownTimeout = setTimeout(
        APP110.mods["notice"].policeWaitStart, 1000);
  } else {
    $('#notice-refuse').trigger("click");
  }
}

/**
 * 处理取消订阅过程中收到的消息，再重新推回到mq
 * @param f
 */
function repush(f) {
  var msgBody = JSON.parse(f.body);
  var curCaseId = msgBody.body.id;
  if (null != curCaseId && "" != curCaseId && typeof(curCaseId)
      != "undefined") {
    APP110.callModFun("notice", "repushToMq", curCaseId, true);
  }
}

/**
 * 重新推送消息
 * @param caseId
 * @param isSysHandle  是否是系统原因导致的重新推送，如同时收到2条消息
 */
APP110.mods["notice"].repushToMq = function (caseId, isSysHandle) {
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/rePushToMq",
    dataType: "json",
    data: {"caseId": caseId, "isSysHandle": isSysHandle},
    success: function (data) {
      // 暂无处理逻辑
    }
  });
}

/**
 * 更新排队人数
 * @param msg
 * @param data
 */
var lastReceiveAlarmWaitTime = 0;
APP110.mods["notice"].updateAlarmWaitCount = function (msg, data) {
  try {
    var waitCount = data.body.count;
    var time = data.body.timeLong;
    // 消息时间大于上一次时间，替换内容。否则丢弃
    if (time > lastReceiveAlarmWaitTime) {
      $("#alarmWaitNum").html("当前报警排队人数为" + waitCount);
    }
    lastReceiveAlarmWaitTime = time;
  } catch (e) {
    console.log("更新当前报警排队人数失败------o%", e);
  }
}

/**
 * 主动获取报警排队数
 */
APP110.mods["notice"].activeGetAlarmWaitCount = function () {
  var headers = {
    'activemq.retroactive': 'true'
  };
  APP110.mods["notice"].subscribeWaitAlarmCountNotice = skynetSocket.subscribe(
      "/app/getWaitAlarmCount", function (m) {
        console.log("主动订阅报警排队人数……………………：%o", m);
        var body;
        try {
          body = JSON.parse(m.body);
          $("#alarmWaitNum").html("当前报警排队人数为" + body);
        } catch (e) {
          console.error("解析报警排队人数消息异常：%s", m.body);
          return;
        }
      }, headers);
  APP110.mods["notice"].alarmWaitCountTimeOut = setTimeout(
      APP110.mods["notice"].activeGetAlarmWaitCount, 30000);
}

/**
 * 显示播放已挂断视频的弹窗
 */
APP110.mods["notice"].playCurrentVideo = function () {
  var videoUrl = $("#currentVideo").val();
  if (!videoUrl) {
    return;
  }
  $.ajax({
    url: BASESERVLET + "/web/alarmCase/toHangUpVideoPage",
    type: "post",
    data: {"videoFile": videoUrl},
    dataType: "html",
    success: function (data) {
      layer.open({
        type: 1,
        title: "警情视频",
        shadeClose: false,
        shade: 0.3,
        area: ['45%', '70%'],
        content: data,
        cancel: function (index, layero) {
          layer.close(index);
          releaseResource();
        }
      });
    }
  })
}

/**
 * 警情取消处理逻辑
 * @param msg
 * @param data
 */
APP110.mods["notice"].dealAlarmCancle = function (msg, data) {
  console.log("订阅报警结束推送得到结果……………………：%o", data);
  var body = data;
  try {
    var caseId = body.body.caseId;
    var currentCaseId = APP110.currentMedia.caseId;
    if (caseId === currentCaseId) {
      layer.close(APP110.noticeWin[APP110.currentMedia.id]);
      delete APP110.noticeWin[APP110.currentMedia.id];
      // 停止报警提醒声音
      APP110.callModFun("notice", "stopAlarmAudio");

      //挂断视频
      if (MyKurento.rws) {
        APP110.callModFun("kurento", "leaveRoom");
        APP110.callModFun("kurento", "reset");//APP110.mods["kurento"].reset();//重置网关信息
        $('#videolocal').empty();
        $('#videoremote1').empty();
      }

      if (APP110.callModFun("consoleState", "isReceivingAlarm")) {
        //订阅报警通知
        APP110.callModFun("notice", "initNotice");
      }
    }
  } catch (e) {
    console.error("解析报警结束推送消息异常：%s", data.body);
    return;
  }
}

