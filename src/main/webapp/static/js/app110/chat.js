//------------文字聊天-------------//

/**
 * 聊天模块初始化
 */
APP110.mods["chat"].init = function () {
  //chat-wind   聊天窗口
  $("button#chat").click(function () {
    if ($("#chat-wind").is(":hidden")) {
      APP110.mods["chat"].openWin();
      $("#chat").removeClass("chat-red");
    } else {
      APP110.mods["chat"].closeWin();
    }
  });
  //聊天窗右上角隐藏按钮
  $("#chat-wind .chat-title .clo").click(function () {
    $("#chat-wind").hide();
    $(".left-wrapper").css("width", "326");
    $(".alarm-list").css("margin-left", "336");
  });

  //点击发送按钮，发送消息，或者按：ctrl+enter;
  $("#chat-send-btn").click(function (e) {
    APP110.mods["chat"].sendMsg(e, 1);
  });
  $("#chat-text").on("keyup", function (e) {
    if (e.which == 13) {
      APP110.mods["chat"].sendMsg(e, 1);
    }
  });

  //保存图片状态。使用viewer必须。
  APP110.mods["chat"].hasImg = false;
};

//重置
APP110.mods["chat"].reset = function () {
  //停止订阅聊天
  if (!skynetSocket) {
    console.log("重置聊天订阅时，发现没有连接，不做后续处理");
    return;
  }
  if (!skynetSocket.connected) {
    console.log("重置聊天订阅时，发现客户端消息服务尚未连接，不做后续处理");
    return;
  }

  GLOBAL.unSubscribeFromMq(APP110.mods["chat"].destination)
  console.log("停止订阅聊天信息...");

  //清空聊天框
  $("#chat-cont").empty();

  //重置图片状态
  APP110.mods["chat"].hasImg = false;
};

/**
 * 订阅聊天回调方法
 * @param m
 */
APP110.mods["chat"].subscribeChatCallBack = function (m) {
  console.log("订阅报警文字聊天得到结果<<<<<<<：o%", m);
  var body;
  try {
    body = JSON.parse(m.body);
  } catch (e) {
    layer.alert("解析报警推送消息异常：" + e.message + "\n\n" + m.body);
    console.error("解析报警推送消息异常：s%", m.body);
    return;
  }
  var type,//消息类型
      isTip = false,//是否提示新消息
      msg,//消息内容
      nickname,//昵称
      from,//自定义消息标识：从哪里发出如：jjy(接警员),dsf(第三方）,空表示报警人
      time = new Date(Number(m.headers.timestamp));//时间戳
  time = time.format(
      time.isToday() ? "hh:mm:ss" : "yyyy-MM-dd hh:mm:ss.S");

  if (body.event == "CHAT_LOGIN") {
    APP110.chatMap[body.from] = body.body.from;
    type = 0;//通知消息
    if (body.from == APP110.currentBjr.userId) {
      var cb = APP110.currentBjr;
      nickname = cb.name ? cb.name : (cb.nickName ? cb.nickName
              : cb.userName);
      isTip = true;//报警人消息需要提示
      //$("#show-voice-box").show();//报警人加入后视频背景置黑，如果用户退出视频不以聊天为准，可以取消此处操作
      //$(".video-box").css("background", "#000000 none");
    } else {
      nickname = body.body.nickName;
      if (body.from != $("#currentLoginUserId").val()) {
        isTip = true;//非当前登录人的第三方需要提示
      }
    }
    msg = nickname + " 加入";
    from = "";//自定义消息标识，在系统发出的登录退出消息中不存在
  } else if (body.event == "CHAT_LOGOUT") {
    type = 0;//通知消息
    nickname = APP110.chatMap[body.from];//退出事件中无昵称body.body.nickName;
    if (body.from == APP110.currentBjr.userId) {
      var cb = APP110.currentBjr;
      nickname = cb.name ? cb.name : (cb.nickName ? cb.nickName
              : cb.userName);
      //$("#show-voice-box").hide();//报警人加入后视频背景置黑，如果用户退出视频不以聊天为准，可以把此处代码挪去他处
      //$(".video-box").css("background","url(/theme/img/jiejingtai/video-bg.jpg)");
    } else {
      if (body.body) {
        if (body.body.hasOwnProperty("nickName")) {
          nickname = body.body.nickName;
        } else {
          return;//避免显示undefined退出
        }
      }
    }
    console.log(body);
    isTip = true;
    if (nickname) {
      msg = nickname + " 退出";
    } else {
      return;
    }
    from = "";//自定义消息标识，在系统发出的登录退出消息中不存在
    delete APP110.chatMap[body.from];
  } else if (body.event == "CHAT_MESSAGE") {
    APP110.chatMap[body.from] ? ""
        : APP110.chatMap[body.from] = body.body.from;
    type = 1;//聊天消息
    nickname = body.body.from;
    msg = body.body.text;//
    from = m.headers.from;//自定义消息头标识，标识来源：接警员:jjy，第三方：dsf

    if (body.from != $("#currentLoginUserId").val()) {
      isTip = true;//非当前登录人的需要提示
    }
  }
  if ($("#currentLoginUserId").val() == body.from) {
    nickname = "您";
  }
  nickname = nickname ? nickname : "";
  /**在页面聊天框显示内容*/
  APP110.mods["chat"].showChatMsg(type, from, nickname, time, msg, isTip);
}

//初始化聊天监听，当接到报警后，才调用
APP110.mods["chat"].initChat = function () {
  var headers = {
    'activemq.retroactive': 'true'
  };
  APP110.mods["chat"].destination = "/topic/chat.message."
      + APP110.currentMedia.id;

  //查询参与者
  APP110.mods["chat"].chatSubscribe = skynetSocket.subscribe(
      "/app/chat.participants."
      + APP110.currentMedia.caseId, function (m) {
        console.log("订阅报警聊天室参与者得到结果<<<<<<<：o%", m);
        var body;
        try {
          body = JSON.parse(m.body);
        } catch (e) {
          layer.alert("解析报警聊天室参与者消息异常：" + e.message + "\n\n" + m.body);
          console.error("解析报警聊天室参与者消息异常：s%", m.body);
          return;
        }
        if (!body) {
          return;
        }
        for (var i = 0; i < body.length; i++) {
          var u = body[i];
          APP110.chatMap[u.userId] = u.nickname;
        }
      }, headers);
  //订阅消息
  GLOBAL.subscribeToMq(APP110.mods["chat"].destination,
      APP110.mods["chat"].subscribeChatCallBack);
}
//infotext=>可能是发送窗口发送时的点击事件，也可能是接警完成时的提示信息
APP110.mods["chat"].sendMsg = function (infotext, msgType, event) {
  //已经结束接警，则不再发送消息
  if (!APP110.currentBjr) {
    return;
  }
  var username = $("#currentLoginUserNickname").val();
  var uid = $("#currentLoginUserId").val();
  var destination = "/topic/chat.message." + APP110.currentMedia.id;
  var text = $("#chat-text").val();
  text = text.replace(/[\r\n]/g, "")//去掉回车换行
  if ($.trim(text) == '') {
    if ($.trim(infotext) == '' || !(infotext.length < 100)) {
      //发送窗口发送
      layer.msg("不能发送空消息")
      $("#chat-text").val('');
      return;
    }
  }
  //记录模板输入情况
  if (msgType == 1 && text.indexOf("[") == -1) {
    $.ajax({
      url: BASESERVLET + "/web/chatTemplatePersonal/save",
      type: "post",
      data: {
        content: text
      },
      dataType: "json",
      success: function (data) {

      }
    })
  }
  text = infotext.length < 100 ? infotext : text;
  if (!event) {
    event = "CHAT_MESSAGE";
  }
  var sender = skynetSocket.send(destination, {from1: "jjy"},
      JSON.stringify({
        from: uid, event: event, caseId: APP110.currentMedia.caseId,
        body: {
          sender: uid,
          text: text,
          from: username,
          time: new Date().format("hh:mm:ss")
        }
      }));

  console.log("发送消息的返回：o%", sender);
  $("#chat-text").val("");
}

APP110.mods["chat"].showChatMsg = function (type, from, nickname, time, msg,
    isTip) {
  var html, imgAdded = false;
  if (type == 0) {
    //通知消息：如xxx加入聊天，xxx退出聊天
    //html = '<i class="chat-tip">'+msg+' '+time+'</i>';
    html = '<div class="center-box"><p>' + time
        + '</p><span style="background-color: #2b399e; color: #ffffff; ">' + msg
        + '</span> </div>';
  } else if (type == 1) {
    var cla = from == "jjy" || from == "dsf" ? "mes2" : "mes1";
    if (msg.indexOf("[address]") == 0 && msg.lastIndexOf("[/address]")) {
      msg = msg.replace("[address]", "").replace("[/address]", "");
      if ($.trim(msg) != '') {
        $('#a_c_detailedaddress').val(msg);
        APP110.callModFun("alarmCase", "changeAlarmDescContent");
      }
      return;
    }
    if (msg.indexOf("[alarmType]") == 0 && msg.lastIndexOf("[/alarmType]")) {
      msg = msg.replace("[alarmType]", "").replace("[/alarmType]", "");
      if ($.trim(msg) != '') {
        var type1 = msg.substring(0, 2);
        $("#a_c_type").find("option[value=" + type1 + "]").prop("selected",
            'selected');
        $("#a_c_type").change();
        var type2 = msg.substring(0, 4) + "00";
        $("#a_c_type2").find("option[value=" + type2 + "]").prop("selected",
            'selected');
        $("#a_c_type2").change();
        var type3 = msg.substring(0, 6);
        $("#a_c_type3").find("option[value=" + type3 + "]").prop("selected",
            'selected');
        $("#a_c_type3").change();
        if (msg.length == 8) {
          var type4 = msg.substring(0, 8);
          $("#a_c_type4").find("option[value=" + type4 + "]").prop("selected",
              'selected');
          $("#a_c_type4").change();
        }
      }
      return;
    }
    if (msg.indexOf("[latlng]") == 0 && msg.lastIndexOf("[/latlng]")) {
      msg = msg.replace("[latlng]", "").replace("[/latlng]", "");
      var latlng = msg.split(",");
      if (latlng && latlng.length == 2) {
        $('#a_c_latitude').val(latlng[0]);
        $('#a_c_longitude').val(latlng[1]);
      }
      return;
    }

    //判断消息类型
    if (msg && msg.indexOf("[img]") == 0) {
      msg = msg.replace("[img]", "").replace("[/img]", "");
      msg = '<img class="chat_img" width="80" src="' + BASESERVLET
          + '/web/file/' + msg + '"/>';
      imgAdded = true;
    }

    if (msg.indexOf("[caseaddress]") == 0 && msg.lastIndexOf(
            "[/caseaddress]")) {
      var start = msg.indexOf("[caselat]");
      var end = msg.indexOf("[/caseaddress]")
      var latlon = msg.substring(start + 9, end);
      var str = new Array();
      str = latlon.split(",")
      var lat = str[0];
      var lon = str[1];
      msg = msg.substring(msg.indexOf("[caseaddress]") + 13,
          msg.indexOf("[caselat]"));
    }
    // 优先从缓存中获取base64字符串，获取不到时再获取url
    var currentBjrImg = localStorage.getItem("current_bjr_img");
    if (currentBjrImg == null || currentBjrImg == "") {
      currentBjrImg = $('#current_bjr_img').val();
    }

    var currentUserImg = localStorage.getItem("current_user_img");
    if (currentUserImg == null || currentUserImg == "") {
      currentUserImg = $('#current_user_img').val();
    }

    if (nickname != '您') {
      html = '<div class="center-box"><p>' + time
          + '</p></div> <div class="left-chatting-box"><span class="left-head-img">'
          + '<img src="' + currentBjrImg
          + '"></span><div class="speech left" ng-class="speech left">' +
          msg + '</div></div>';
    } else {
      html = '<div class="center-box"><p>' + time
          + '</p></div><div class="right-chatting-box"><span class="right-head-img">'
          +
          '<img src="' + currentUserImg
          + '"></span><div class="speech right" ng-class="speech left">' +
          msg + '</div></div>';
    }
  }
  $("#chat-cont").append(html);

  $("#chat-cont")[0].scrollTop = $("#chat-cont")[0].scrollHeight;

  if (imgAdded) {
    console.warn("imgadded...");
    if (APP110.mods["chat"].hasImg) {
      $('#chat-cont').viewer("update");//动态添加图片，需要更新展示
      return;
    } else {
      APP110.mods["chat"].hasImg = true;
      //添加图片展示
      $('#chat-cont').viewer({
        navbar: false   //不显示导航小图
      });
    }
  }
  if (isTip) {
    if ($("#chat-wind").is(":hidden")) {
      //提示聊天信息
      layer.tips(nickname + "：" + msg, '#chat', {
        tips: [1, '#3595CC'],
        time: 5000
      });
      $("#chat").addClass("chat-red");
    } else {
      $("#chat").removeClass("chat-red");
    }
  }
}

//------------文字聊天-------------//
