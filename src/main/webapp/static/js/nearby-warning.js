var objBack;
var maybeSameNoRead = 0;

function open_nearby_list(obj) {
  objBack = obj;
  $(obj).parents(".nerby-warning-box").css("display", "none");
  $("#nearby_no_read").html("");
  open_layer_list();
}

//打开附近警情列表窗口
function open_layer_list() {
  maybeSameNoRead = 0;
  var cancelNum = 0;
  layer.open({
    type: 2,
    title: '<span class="layui-title">附近警情</span>',
    closeBtn: 1,
    shadeClose: true,
    shade: false,
    maxmin: false, //开启最大化最小化按钮
    area: ['1000px', '600px'],
    content: BASESERVLET + '/web/nearWarning/nearByWarning',
    cancel: function () {
      cancelNum = 1;
      $(objBack).parents(".nerby-warning-box").css("display", "block");
    },
    end: function () {
      if (cancelNum == 0) {
        open_details();
      } else {
        return;
      }
    }
  });
  $(".layui-layer-title").css({
    "text-algin": "center",
    "padding-left": "24px",
  });
}

/**
 * 附近警情数据
 */
function nearby_warning_list() {
  var index = layer.load();
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/alarmCase/maybeSameAlert/list",
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (!data.status) {
        layer.msg('操作失败' + data.error);
        layer.close(index);
        return;
      }
      if (data.list != null && data.list.length > 0) {
        var html = '';
        var dateStr;
        $.each(data.list, function (index, value) {
          dateStr = new Date(value.caseTime).format("yyyy-MM-dd hh:mm:ss");
          html += '<tr>';
          html += '<td>' + dateStr + '</td>';
          html += '<td>' + value.caseAddress + '</td>';
          html += '<td>' + value.mobile + '</td>';
          html += '<td>' + (value.name === undefined ? value.mobile
              : value.name) + '</td>';
          html += '<td><button class="button2" onClick="before_open_detail(\''
              + value.caseId + '\')">查看详情</button></td>';
          html += '</tr>';
        });
        $('#list').html(html);
      } else {
        $('#list').html('<tr><td colspan="5">暂无数据...</td></tr>');
      }
      layer.close(index);
    }
  });
}

function before_open_detail(caseId) {
  localStorage.setItem('currentCaseId', caseId);
  close_layer();
}

//打开附近警情详情窗口
function open_details() {
  var caseId = localStorage.getItem('currentCaseId');
  var cancelNum = 0;
  layer.open({
    type: 2,
    title: '<span class="layui-title">附近警情详情</span>',
    closeBtn: 1,
    shadeClose: true,
    shade: false,
    maxmin: false, //开启最大化最小化按钮
    area: ['1000px', '600px'],
    content: BASESERVLET + '/web/nearWarning/nearByWarningDetail/' + caseId,
    cancel: function () {
      cancelNum = 1;
      $(objBack).parents(".nerby-warning-box").css("display", "block");
      nearbyLeaveRoom();
    },
    end: function () {
      if (cancelNum == 0) {
        open_layer_list();
      } else {
        return;
      }

    }
  });
}

//关闭弹窗
function close_layer() {
  parent.layer.closeAll();
}

//警情处理询问框
function query_box() {
  layer.confirm('您确定要挂断该报警吗？', {
    btn: ['确定', '取消'] //按钮
  }, function () {
    close_layer();

  }, function (index) {
    layer.close(index);
  });
}

// 设置未读提示
function setNoReadTip(count) {
  if (typeof(count) != "undefined" && count != null && count > 0) {
    $("#nearby_no_read").html("（未读" + count + "条）");
  } else {
    $("#nearby_no_read").html("");
  }
}

/**
 * 挂断该报警
 * @param caseId 警情id
 */
function nearbyWarningFinish(caseId, roomId, handleUserId, handleUserName) {
  $.ajax({
    type: "get",
    url: BASESERVLET + "/web/alarmCase/nearbyWarningFinish/" + caseId,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (!data.status) {
        layer.msg('操作失败' + data.error);
        return;
      }
      skynetSocket.send('/topic/chat.message.' + roomId, {from1: 'jjy'},
          JSON.stringify({
            from: handleUserId, event: "CHAT_MESSAGE",
            body: {
              sender: handleUserId,
              text: "温馨提示：接警员已经收到您的视频报警，和我们已经处理过的警情一致，谢谢您提供的报警信息，同样会作为破案线索，您可以挂断视频报警，也可以继续录制为我们提供更多视频内容。",
              from: handleUserName,
              time: new Date().format("hh:mm:ss")
            }
          })
      );
      nearbyLeaveRoom();
    }
  });
}

/**
 * 加入房间
 * @param room 房间id
 * @param pin 密码
 */
function nearbyJoinRoom(room, pin) {
  nearbyKurento.rws.joinRoom(room, pin, '', 'viewer');
}

/**
 * 离开房间
 */
function nearbyLeaveRoom() {
  if (nearbyKurento.rws) {
    nearbyKurento.rws.leaveRoom();
  }
  close_layer();
  open_layer_list();
}

// kurento 基础参数
var nearbyKurento = {
  rws: null,
  useAudio: true,
  useVideo: true,
  useBigScreen: false
};

// 初始化Kurento,创建websocket信令传输通道
function initNearbyKurento(room, pin) {
  if (!nearbyKurento.rws) {
    var listener = new AlarmRoomListener();
    nearbyKurento.rws = new RoomWebSocket(listener);
  }
  setTimeout('nearbyJoinRoom("' + room + '", "' + pin + '")', 2000);
}

function AlarmRoomListener() {

}

AlarmRoomListener.prototype = {
  constructor: AlarmRoomListener,
  getAlarmPersonVideo: function () {
    $('#videoremote').css('background', 'none rgb(0, 0, 0)');
    $('#videoremote').html(
        '<video class="rounded centered relative " id="remotevideo1" width="100%" height="100%" autoplay/>');
    var video = $('#remotevideo1').get(0);
    return video;
  },
  onParticipantLeft: function () {
    $('#videoremote').css('background',
        'url("/theme/img/jiejingtai/video-bg.jpg") no-repeat center top ');
    $('#videoremote').html('');
  },
  onPublishAnswer: function () {
  },
  onLeaveRoom: function () {
    console.log("onLeaveRoom.......................");
    resetMyKurento();
  },
  forwardCallAnswer: function (rtsp) {
    console.log(rtsp);
    layer.alert("投屏链接地址为：" + rtsp);
  },
  cancelForwardCallAnswer: function (message) {
    console.log(message);
  }
}

/**
 * 重置Kurento组件
 */
function resetMyKurento() {
  MyKurento.useBigScreen = false;
  MyKurento.rws.localName = null;
  if (MyKurento.rws.participants) {
    for (var key in this.participants) {
      MyKurento.rws.participants[key].dispose();
    }
    MyKurento.rws.participants = {};
  }
  MyKurento.rws.room = null;
  MyKurento.rws.pin = null;
  MyKurento.rws.secret = null;
  MyKurento.rws.role = null;
  MyKurento.useAudio = true;
  MyKurento.useVideo = true;
}
