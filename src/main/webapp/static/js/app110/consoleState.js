//--------------------接警状态操作模块--------------------//

/**
 * 初始化
 * 设置每个接警状态按钮的执行动作
 */
APP110.mods["consoleState"].init = function () {
  // 绑定点击开始接警执行动作
  $(".state1").click(function () {
    APP110.mods["consoleState"].startReceivingAlarm();
  });

  // 绑定点击结束接警执行动作
  $(".state3").click(function () {
    APP110.mods["consoleState"].stopReceivingAlarm();
  });
  // 警情转接
  $("#transfer").click(function () {
    APP110.mods["consoleState"].caseTransfer();
  });
}

/**
 * 接警状态按钮样式变化，全部移除样式
 */
APP110.mods["consoleState"].removeStateBtnCss = function () {
  $(".top-menu-box>ul>li>button").removeClass("check-button1");
  $(".top-menu-box>ul>li>button").removeClass("check-button3");
}

// 开始接警执行动作
APP110.mods["consoleState"].startReceivingAlarm = function () {
  // 处理样式
  APP110.callModFun("consoleState", "removeStateBtnCss");
  $(".state1").addClass("check-button1");
  $("#handleSaveBtn").attr("disabled", false);
  $(".consoleState").removeClass("active");
  $(".state1").addClass("active");

  // 已接警，未处理完成时，不重新订阅
  if (APP110.currentBjr) {
    return;
  }
  console.log("开始接警....");
  APP110.callModFun("notice", "initNotice");
}

/**
 * 结束接警执行动作
 */
APP110.mods["consoleState"].stopReceivingAlarm = function () {
  // 必须处理完正在接的警情后才能结束接警
  if (APP110.currentBjr) {
    layer.msg("请完成本次接警并保存接警单后再停止接警", {icon: 2}, function () {
    });
    return;
  }
  //如果是已经收到推送情形
  if (APP110.currentMedia) {
    var id = $(".receiving-alarm-box").attr("id");
    if (id !== undefined && id !== null) {
      //截取7-43的字符串,获取caseId
      var caseId = id.substring(7, 43);
      //将警情推回去
      APP110.callModFun("notice", "noticeHandler", 0, caseId);
    }

  }
  // 从PubSub组件取消个人消息订阅
  APP110.callModFun("notice", "unSubscribePersonMsgEvent");
  // 停止接收报警通知
  APP110.callModFun("notice", "stopNotice");
  // 处理样式
  APP110.callModFun("consoleState", "removeStateBtnCss");
  $(".state3").addClass("check-button3");
  $("#handleSaveBtn").attr("disabled", true);
  $(".consoleState").removeClass("active");
  $(".state3").addClass("active");
  // 重置视频组件
  APP110.callModFun("kurento", "reset");
  $('#videolocal').empty();
  console.log("停止接警!");
}

/**
 * 是否正在接警
 * @returns {boolean}
 */
APP110.mods["consoleState"].isReceivingAlarm = function () {
  var st = $('.consoleState.active').attr("value");
  if (st == 1) {
    return true;
  }
  return false;
}
/**
 *警情转接
 */
APP110.mods["consoleState"].caseTransfer = function () {
  APP110.callModFun("alarmCase", "transferAlarm");
}
