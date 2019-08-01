/**********websocket*************/
var ws;
var nw;
var room_role;
var participants = {};
var name = "";
var currentRoom = null;
var removeTaskId;
var myusername;
var projection_secret;
var projection_room_id;
var oldRoomId;
createWebSocket();
wsReconnect();
/*刷新或者关闭当前页面*/
window.onbeforeunload = function () {
    leaveRoom();
    ws.close();
};
/*心跳监测*/
var heartCheck = {
    timeout: 60000,//60s
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        this.start();
    },
    start: function () {
        var self = this;
        this.timeoutObj = setTimeout(function () {
            ws.send("i");
            console.log("websocket heartCheck request****************");
            self.serverTimeoutObj = setTimeout(function () {
                ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    },
}

function reconnect() {
    setTimeout(function () {
        initWebsocket();
    }, 5000);
}

function createWebSocket() {
    if (window.location.protocol === 'http:') {
        ws = new WebSocket('ws://' + location.host + '/skynet/ws/groupcall');
    } else {
        ws = new WebSocket('wss://' + location.host + '/skynet/ws/groupcall');
    }
}

function initWebsocket() {
    try {
        createWebSocket();
        ws.onopen = function () {
            heartCheck.start();
            var current_task_id = $('#current_task_id').val();
            var current_task_lng = $('#current_task_lng').val();
            var current_task_lat = $('#current_task_lat').val();
            initTask(current_task_id, current_task_lat, current_task_lng);
        };
        ws.onmessage = function (message) {
            if (message.data && message.data === 'o') {
                console.log("reconnect ws response************o****");
                return;
            }
            heartCheck.reset();
            wsMessage(message);
        }
        wsReconnect();
    } catch (e) {
        initWebsocket();
    }
}

function wsReconnect() {
    ws.onclose = function () {
        console.log("Connection closed.");
        reconnect();
    };
    ws.onerror = function () {
        console.log("Connection error.");
        reconnect();
    }
}


function wsMessage(message) {
    var parsedMessage = JSON.parse(message.data);
    switch (parsedMessage.id) {
        case 'joinRoomAnswer':
            joinRoomAnswer(parsedMessage);
            break;
        case 'newParticipantArrived':
            onNewParticipant(parsedMessage);
            break;
        case 'participantLeft':
            onParticipantLeft(parsedMessage);
            break;
        case 'leaveRoomAnswer':
            leaveRoomAnswer(parsedMessage);
            break;
        case 'publishAnswer':
            sendVideoResponse(parsedMessage);
            break;
        case 'unPublishAnswer':
            unPublishAnswer(parsedMessage);
            break;
        case 'receiveVideoAnswer':
            receiveVideoResponse(parsedMessage);
            break;
        case 'faceDetected':
            faceDetectedAnswer(parsedMessage);
            break;
        case 'enableFaceDetectAnswer':
            enableFaceDetectAnswer(parsedMessage);
            break;
        case 'disableFaceDetectAnswer':
            disFaceDetectAnswer(parsedMessage);
            break;
        case 'destoryNotice':
            destroyResponse();
            console.log(parsedMessage + "destoryNotice")
            break;
        case 'forwardCallAnswer':
            forwardCallAnswer(parsedMessage);
            break;
        case 'cancelForwardCallAnswer':
            cancelForwardCallAnswer(parsedMessage);
            break;
        case 'cancelReceiveFromAnswer':
            break;
        case 'iceCandidate':
            participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                if (error) {
                    console.error("Error adding candidate: " + error);
                    return;
                }
            });
            break;
        default:
            console.error('Unrecognized message', parsedMessage);
    }
}

/**当房间中不存在publish时，5分钟后就会销毁房间，需要从新加入房间*/
function destroyResponse() {
    var taskId = $('#current_task_id').val();
    var lng = $('#current_task_lng').val();
    var lat = $('#current_task_lat').val();
    destoryJoinRoom(taskId, lat, lng);
}

/**投影大屏幕请求*/
function forwardCallRequest(userId) {
    var message = {
        id: 'forwardCall',
        room: projection_room_id,
        pin: projection_secret,
        caller: userId,
        videoCodec: 'H264',
        audioCodec: 'PCMU',
        channel: 1,
        autoPickChannel: 'true'
    }
    sendMessage(message);
    console.log("投影大屏幕++++++++++++++++" + userId + "++++++++++++++++++++++++");
}

function faceStart(sender) {
    var message = {
        id: 'enableFaceDetect',
        room: projection_room_id,
      sender: sender
    }
    sendMessage(message);
}

function faceEnd(sender) {
    var message = {
        id: 'disableFaceDetect',
        room: projection_room_id,
      sender: sender
    }
    sendMessage(message);
}
/**投影大屏幕响应*/
function forwardCallAnswer(result) {
    try {
        console.log("投影大屏幕+++++++++++++++answer++++++++++++++++++++++++++++++++++");
        var rtsp = result.rtsp;
        if ("媒体转发已经存在" === result.result) {
            layer.msg('已存在，请取消在投屏', {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            });
        } else {
            var value = $('#url_id').html();
            $('#url_id').html("投屏链接地址为:" + rtsp + ";" + value);
          $('#url_id').parent().css("display", "block");
        }
    } catch (e) {
        layer.alert(e.name + ": " + e.message);
        console.log(e)
    }
}

/**取消投大屏请求*/
function cancelForwardCallRequest(name) {
    var message = {
        id: 'cancelForwardCall',
        room: projection_room_id,
        pin: projection_secret,
        caller: name
    }
    this.sendMessage(message);
    console.log("取消投影大屏幕+++++++++++++++++++++++++++++++++++++++++++++++++");
}

/**取消投大屏响应*/
function cancelForwardCallAnswer(result) {
    try {
        console.log("取消投影大屏幕++++++answer+++++++++++++++++++++++++++++++++++++++++++");
      $('#url_id').parent().css("display", "none");
        layer.msg('取消投屏', {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
    } catch (e) {
        layer.alert(e.name + ": " + e.message);
        console.log(e)
    }
}

ws.onmessage = function (message) {
    if (message.data && message.data === 'o') {
        console.log("websocket heartCheck response****************");
        heartCheck.reset();
        return;
    }
    wsMessage(message);
}

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    ws.send(jsonMessage);
}

/**joinRoomAnswer*/
function joinRoomAnswer(msg) {
    if (msg.name === undefined) {
        return;
    }
    name = msg.name;
    msg.data.forEach(receiveVideo.bind(null, msg.room));
}

function onNewParticipant(request) {
    receiveVideo(request.room, request.data);
    if (nw != null) {
        /**flag 如果是1 是视频中*/
        var flag = 1;
        APP110.callModFun("map", "replaceMarker", request.data.name, flag);
    }
    setTimeout(function () {
        var taskId = $('#current_task_id').val();
        APP110.callModFun("person", "refresh", taskId);
    }, 10000);

  // 根据order（非0）判断是否为指挥中心，记录指挥中心id
  if (request.data.extraInfo.order !== 0) {
    saveCenterUsers(request.data.name);
  }
  // 检查每组直播人数是否超出最大数量
  isLiveOutOfLimit();
}

function receiveVideo(room, sender) {
    var participant = new Participant(room, sender.name, '', sender.extraInfo);
    participants[sender.name] = participant;
    var video = participant.getVideoElement();
    var options = {
        remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant),
        configuration: {
            "iceServers": [{"urls": "stun:v1.video110.cn:34780"}, {
                urls: "turn:v1.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v2.video110.cn:34780"}, {
                urls: "turn:v2.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v3.video110.cn:34780"}, {
                urls: "turn:v3.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v4.video110.cn:34780"}, {
                urls: "turn:v4.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v5.video110.cn:34780"}, {
                urls: "turn:v5.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }]
        }
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
        function (error) {
            if (error) {
                return console.error(error);
            }
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });

  /*
  如果存在extraInfo表示新加入该房间时接收到的其他人的视频，
  根据extraInfo.order判断是否修改指挥中心数量和检查显示人数；
  如果不存在extraInfo信息，表示接受的视频来自屏蔽视频的重新接受，不需要执行以下去操作
   */
  if (sender.extraInfo != null && sender.extraInfo !== undefined) {
    // 根据order（非0）判断是否为指挥中心，记录指挥中心id
    if (sender.extraInfo.order !== 0) {
      saveCenterUsers(sender.name);
    }
    // 检查每组直播人数是否超出最大数量
    isLiveOutOfLimit();
  }
}

function sendVideoResponse(result) {
    participants[name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
        if (error) return console.error(error);
    });
}

function disFaceDetectAnswer(parsedMessage) {
    if (parsedMessage.status) {
        layer.msg('视频人脸识别关闭成功', {
            icon: 1,
            time: 2000
        });
    } else {
        layer.msg('视频人脸识别关闭失败，请重试', {
            icon: 1,
            time: 2000
        });
    }
}
function enableFaceDetectAnswer(parsedMessage) {
    if (parsedMessage.status) {
        layer.msg('视频人脸识别开启成功', {
            icon: 1,
            time: 2000
        });
    } else {
        layer.msg('视频人脸识别开启失败，请换房间', {
            icon: 1,
            time: 2000
        });
    }
}

function faceDetectedAnswer(result) {
    var url;
    if (window.location.protocol === 'http:') {
        url = "https://test.video110.cn:18000/faceDetect/";
    } else {
        url = "https://" + location.host + "/faceDetect/";
    }
  //“人脸捕捉图片”是否显示
  var faceImgTitle = $("#faceImgCount" + result.sender);
  if (faceImgTitle.length <= 0) {
    //“人脸捕捉图片”未显示
    var faceImgCount = '<a href="#" id="faceImgCount' + result.sender
        + '" style="color:#363a91; float: right;" onclick="open_face_window(this, \''
        + projection_room_id + '\',\'' + result.sender
        + '\')" data-role="close">已捕捉人脸照片</a>';
    $("#room" + projection_room_id + "remote" + result.sender
        + ' .video-title').prepend(faceImgCount);
  } else {
    //“人脸捕捉图片”未显示
    var dataName = $("#faceImgCount" + result.sender).attr("data-role");
    //人脸识别窗口打开
    if (dataName == "open") {
      if (iframeBody) {
        getFaceImgUerInfo(url + result.file, result.fileId, result.ownerId,
            result.copy);
      }
    }
  }
}

//测试用，获取捕捉照片和对应的人脸的识别信息
function getFaceImgUerInfo(url, fileId, ownerId, copy) {
  if (copy == 2) {
    var faceHtml = '<div class="face-recognition" id="' + ownerId + '">' +
        '<img class="face-recognition-img" id="' + fileId + '" src="'
        + url + '" /><div class="face-recognition-message" id="card_' + ownerId
        + '">'
        + '<div name="getPersonCard" onclick="face_img_show(this,\'' + ownerId
        + '\', \'' + fileId
        + '\', \'all\')" style="float: right; color: #217ede;cursor: pointer;">身份信息获取>></div>'
        + '</div>';
    iframeBody.find(".face-recognition-box").append(faceHtml);
  } else {
    if (iframeBody.find("#title_" + ownerId).length > 0) {
      var faceHtml = '<div class="face-recognition-list-img-box" onmouseover="showButton(this)" onmouseout="hideButton(this)">'
          + '<img class="face-recognition-list-img" id="' + fileId + '" src="'
          + url + '">'
          + '<button class="setting-main-img" onclick="setMaster(this,\''
          + ownerId + '\')" style="display: none;">获取信息</button>'
          + '</div>';
      iframeBody.find("#title_" + ownerId).parent().find(
          ".face-recognition-list").find("#otherPhoto").after(faceHtml);
    }
  }
}

function receiveVideoResponse(result) {
    console.log(participants[result.name].rtcPeer);
    participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
        if (error) return console.error(error);
    });
}


function onParticipantLeft(request) {
    console.log("participantLeft");
    var participant = participants[request.name];
    participant.dispose();
    delete participants[request.name];
    //刷新最小化窗口计数
    $('#remote-id-' + request.name).remove();
    refreshMinimizingCount();
  //关闭人脸识别
  faceEnd(request.name);
    //判断子页面刷新
    if (nw != null) {
      var video = nw.document.getElementById("video" + request.name);
      var flag = 1;
        if (!video) {
            /**flag 如果是1 是视频中*/
            flag = 2;
        } else {
            nw.closeMapInfoWindow();
        }
        APP110.callModFun("map", "replaceMarker", request.name, flag);
    }
  // 删除指挥中心用户id
  removeCenterUsers(request.name);
}

/**某人离开房间*/
function leaveRoomAnswer(parsedMessage) {
    console.log(parsedMessage.name + ":离开房间--------未完待续");
}

/****************页面js交互***************/
//向信令服务器发送joinRoom，命令
function joinRoom(room, pin, extraInfo) {
    var message = {
        id: 'joinRoom',
        pin: pin,
        room: room,
        role: 'viewer',
        extraInfo: extraInfo
    }
    sendMessage(message);
}

function publish(room) {
    room_role = "publisher_viewer";
    var constraints = {
        audio: true,
        video: {
            mandatory: {
                maxWidth: 320,
                maxFrameRate: 15,
                minFrameRate: 15
            }
        }
    };
    var participant = new Participant(room, name, true);
    participants[name] = participant;
    var video = participant.getVideoElement();
    var options = {
        localVideo: video,
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate.bind(participant),
        configuration: {
            "iceServers": [{"urls": "stun:v1.video110.cn:34780"}, {
                urls: "turn:v1.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v2.video110.cn:34780"}, {
                urls: "turn:v2.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v3.video110.cn:34780"}, {
                urls: "turn:v3.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v4.video110.cn:34780"}, {
                urls: "turn:v4.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }, {"urls": "stun:v5.video110.cn:34780"}, {
                urls: "turn:v5.video110.cn:34780",
                username: "video1",
                credential: "12wwfthisisturnserver1"
            }]
        }
    };
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
        function (error) {
            if (error) {
                return console.error(error);
            }
            this.generateOffer(participant.offerToSendVideo.bind(participant));
        }
    );

  // 记录指挥中心id
  saveCenterUsers(name);
  // 检查每组直播人数是否超出最大数量
  isLiveOutOfLimit();
}

/**取消发布的响应*/
function unPublishAnswer(parsedMessage) {
    console.log(parsedMessage.name + ":取消发布的响应--------未完待续");
}

function unPublish(room, userId) {
    room_role = "";
    var message = {
        id: 'unpublish',
        room: room
    }
    sendMessage(message);
    console.log(participants[userId]);
    console.log("*****************************************unPublish**********角色置空*******************************");
    console.log(participants[userId].rtcPeer);
    if (participants[userId]) {
        participants[userId].rtcPeer.dispose();
    }
  // 删除指挥中心用户id
  removeCenterUsers(userId);
}

/**
 * 离开房间
 * @param room 房间id
 */
function leaveRoom(room) {
    sendMessage({
        id: 'leaveRoom',
        room: room
    });
    room_role = "";
    for (var key in participants) {
        participants[key].rtcPeer.dispose();
    }
}
APP110.mods["video"].leaveRoom = function (room) {
    leaveRoom();
}

function fill() {
    var task = new Object();
    task.unit = null;
    task.user = null;
    task.lng = null;
    task.lat = null;
    task.address = null;
    return task;
}

//时间轴点击
function timer_shaft(obj) {
    $(obj).click(function () {
        var tab = this;
        var className = $(this).attr('class');
        //点击本标签刷新页面
        if (className === 'checked-timer-shaft') {
            return;
        }
        layer.confirm('确定要离开房间吗，离开房间后视频链接将断开！', {
            btn: ['是', '否'] //按钮
        }, function () {
            liEvent(tab);
        });
    });
}

function liEvent(domSelector) {
    //点击后的具体事件处理
    var taskId = $(domSelector).attr('id');
    //todo: 清理其他房间webrtc
    if (currentRoom) {
        $(currentRoom).remove();
        currentRoom = null;
    }
    if (removeTaskId) {
        $('#' + removeTaskId).remove();
        removeTaskId = null;
    }
    //离开房间
    leaveRoom();
    var lat = $(domSelector).attr('lat');
    var lng = $(domSelector).attr('lng');
    initTask(taskId, lat, lng);
    $(".timer-shaft-list li").removeClass("checked-timer-shaft");
    $(domSelector).addClass("checked-timer-shaft");
    var tabIndex = $(domSelector).index();
    $(".tab-num-box").css("display", "none");
    $(".tab-num-box").eq(tabIndex).css("display", "block");
    //设置标题
    var createTime = $(domSelector).attr('createTime');
    var titleText = $(domSelector).children('span.timer-shaft-text').html();
    titleText = titleText.replace(/<br>/, " ")
    setTitle(createTime, titleText);
    //清空远程视频窗口
    $('#room_box').html('<div class="video-group-box"></div>');
  $('.video-person-group').empty();
  refreshMinimizingCount();
    if (oldRoomId) {
        //修改发布窗口样式
        $('#room' + oldRoomId + 'local').attr('hasControl', 0);
        $('#room' + oldRoomId + 'local .video-content-box').addClass('bg-gray');
        $('#room' + oldRoomId + 'local video').hide();
        $('#room' + oldRoomId + 'local .public-box').show();
    }
    if (nw) {
        nw.location.reload();
    }
    layer.closeAll();
}



function addButtonFun(domId, room, isLocal) {
    //全屏按钮
    $(domId).find('.full-screen-btn:first').on('click', function () {
        $(domId).find('video').first()[0].webkitRequestFullScreen();
    });
    if (isLocal) {
        //暂停按钮
        $(domId).find('.video-stop-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-start-btn:first').show();
            mute(name, true, false);
        });
        //播放按钮
        $(domId).find('.video-start-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-stop-btn:first').show();
            mute(name, true, true);
        });
        //停止投屏
        $(domId).find('.video-projection-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-stop_projection-btn:first').show();
            cancelForwardCallRequest($('#currentUser').val());
        });
        //开始投屏
        $(domId).find('.video-stop_projection-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-projection-btn').show();
            forwardCallRequest($('#currentUser').val());
        });
    } else {
        //音频的取消接收
        $(domId).find('.voice-close-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.voice-btn:first').show();
            remoteMute($(this).attr('value'), false, false);
        });
        //音频的接收
        $(domId).find('.voice-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.voice-close-btn:first').show();
            remoteMute($(this).attr('value'), false, true);
        });
        //停止投屏
        $(domId).find('.video-projection-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-stop_projection-btn:first').show();
            cancelForwardCallRequest($(this).attr('value'));
        });
        //开始投屏
        $(domId).find('.video-stop_projection-btn:first').on('click', function () {
            $(this).hide();
            $(domId).find('.video-projection-btn').show();
            forwardCallRequest($(this).attr('value'));
        });
        //最小化窗口
        $(domId).find('.minimizing-btn:first').on('click', function () {
            var roomId = $(this).data('roomid');
            var remoteId = $(this).data('remoteid');
            addMinimizingVideo(roomId, remoteId);
        });
      //开始人脸识别
      $(domId).find('.face-open-btn:first').on('click', function () {
        var remoteId = $(this).data('remoteid');
        $(this).hide();
        $(domId).find('.face-close-btn').show();
        //开始人脸识别
        faceStart(remoteId);
      });
      //关闭人脸识别
      $(domId).find('.face-close-btn:first').on('click', function () {
        var remoteId = $(this).data('remoteid');
        $(this).hide();
        $(domId).find('.face-open-btn').show();
        //关闭人脸识别
        faceEnd(remoteId);
      });

    }

}

APP110.mods["video"].add = function (taskId, comment, lat, lng, createTime,
    leaderUnit) {
    if ($('#' + taskId).length > 0) {
        console.log("新增任务已存在");
    } else {
        APP110.taskNum++;
        var day = new Date(createTime).format('yyyy/MM/dd');
        var time = new Date(createTime).format('hh:mm:ss');
      $("#tasks_ul").prepend('<li id="' + taskId + '" lat="' + lat + '" lng="'
          + lng + '" createTime="' + createTime + '" data-leader-unit="'
          + leaderUnit + '"><span class="timer-span">' + day + '<br/>' + time
          + '</span><span class="timer-icon"><b></b></span><span title="'
          + comment + '" class="timer-shaft-text">' + buildTaskName(comment)
          + '</span></li>');
        //时间轴增加点击监听点击事件
        timer_shaft($(".timer-shaft-list li"));
        $('#notice_mp3')[0].play();
    }

}

function buildTaskName(name) {
    if ($.trim(name) == '') {
        return '未命名任务';
    } else {
        if (name.length > 9) {
            return name.substring(0, 9) + '...';
        } else {
            return name;
        }
    }
}

skynetSocket.afterConnect = function () {
    var headers = {
        'activemq.retroactive': 'true'
    };
    chatSubscribe = skynetSocket.subscribe("/topic/POLICE_TASK", function (m) {
        console.log("收到调度任务<<<<<<<：o%", m);
        var body;
        try {
            body = JSON.parse(m.body);
        } catch (e) {
            layer.alert("解析消息异常：" + e.message + "\n\n" + m.body);
            console.error("解析消息异常：s%", m.body);
            return;
        }
        if (!body) {
            return;
        }
        var task = body.body;
        if (body.event == 'ADD_TASK') {
          APP110.mods["video"].add(task.id, task.taskName, task.policeInfoLat,
              task.policeInfoLng, task.createTime, task.leaderUnit);
        } else {
            var currentTaskId = $('.checked-tab:first').attr('id');
            if (currentTaskId == task.id) {
                removeTaskId = task.id;
            } else {
                $('#' + task.id).remove();
            }
        }
    }, headers);

  // mq-任务结束
  subscribeTaskEnd();

  // 如果不是自己创建的任务，需要订阅分组变动通知
  if (!isOwnVideoGroup(getCurrentTaskId())) {
    initSubscribeVideoGroup();
  }
}

function initTask(taskId, lat, lng) {
    //根据taskId获取对应的room，并加入
    $('#current_task_id').val(taskId);
    $('#current_task_lng').val(lng);
    $('#current_task_lat').val(lat);

  //添加聊天组按钮显示
  if (isOwnVideoGroup(taskId)) {
    $("#addChatGroup").css("display", "block");
  } else {
    $("#addChatGroup").css("display", "none");
  }

    //获得分组信息
    listVideoGroup(taskId);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/joinVideoRoom",
        type: "post",
        data: {
            taskId: taskId
        },
        dataType: "json",
        success: function (data) {
            if (data.status) {
                var obj = data.obj;
                var replaceStr = '/{{ROOM-ID}}/g';
                if (null != oldRoomId) {
                    replaceStr = '/' + oldRoomId + '/g';
                }
                var tab = $("#tab-template").html();
                tab = (tab + "").replace(eval(replaceStr), obj.id);//替换
                $("#tab-template").html(tab);
                addButtonFun('#room' + obj.id + 'local', null, true);
                $("#room" + obj.id + "local").mouseover(function () {
                    if ($(this).attr('hasControl') == '1') {
                        $(this).children().find(".controls-box").css("display", "block");
                    }
                });
                $("#room" + obj.id + "local").mouseout(function () {
                    $(this).children().find(".controls-box").css("display", "none");
                });
                currentRoom = '#room' + obj.id;
                oldRoomId = obj.id;
                var userId = $('#currentUser').val();
                var extraInfo = {'order': '' || obj.publicLevel, 'publisher': obj.publisher};
                name = userId;
                //加入房间
                var room = obj.id;
                heartCheck.start();
                joinRoom(room, obj.pin, extraInfo);
                console.log("切换标签或者第一次加入房间时候的角色-------joinRoom" + room_role)
                if (room_role) {
                    publish(room);
                }
                $('#room' + room + 'local .public-video-button').click(
                    function () {
                        if (room) {
                            publish(room);
                            $('#room' + room + 'local').attr('hasControl', 1);
                            $('#room' + room + 'local .video-content-box').removeClass('bg-gray');
                            $('#room' + room + 'local .public-box').hide();
                            $('#room' + room + 'local video').show();
                        }
                    });
                projection_secret = obj.secret;
                projection_room_id = obj.id;
                $('#room' + room + 'local .stop-public-btn').click(function () {
                    unPublish(room, userId);
                    $('#room' + room + 'local').attr('hasControl', 0);
                    $('#room' + room + 'local .video-content-box').addClass('bg-gray');
                    $('#room' + room + 'local video').hide();
                    $('#room' + room + 'local .public-box').show();
                });
                localStorage.setItem('currentLat', lat);
                localStorage.setItem('currentLng', lng);
                localStorage.setItem('currentTaskId', taskId);
                localStorage.setItem('currentRoomId', obj.id);
                APP110.callModFun("chat", "choice", taskId, obj.id);
                APP110.callModFun("map", "gpsMap", lat, lng, taskId);
            }
        }
    });
}

function destoryJoinRoom(taskId, lat, lng) {
    //根据taskId获取对应的room，并加入
    $('#current_task_id').val(taskId);
    $('#current_task_lng').val(lng);
    $('#current_task_lat').val(lat);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/joinVideoRoom",
        type: "post",
        data: {
            taskId: taskId
        },
        dataType: "json",
        success: function (data) {
            if (data.status) {
                var obj = data.obj;
                var userId = $('#currentUser').val();
                var extraInfo = {'order': '' || obj.publicLevel, 'publisher': obj.publisher};
                name = userId;
                //加入房间
                var room = obj.id;
                heartCheck.start();
                joinRoom(room, obj.pin, extraInfo);
                console.log("----destoryJoinRoom" + room_role)
                projection_secret = obj.secret;
                projection_room_id = obj.id;
                APP110.callModFun("chat", "choice", taskId, obj.id);
                APP110.callModFun("map", "gpsMap", lat, lng, taskId);
            }
        }
    });
}

APP110.mods["video"].currentTasks = function () {
    currentTasks();
}

function currentTasks() {
    $.ajax({
        url: BASESERVLET + "/web/infoTask/currentTasks",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.status) {
                $("#tasks_ul").empty();
                var list = data.list;
                //事件信息加入到app.js中去，多屏交互时可以传递上任务信息
                APP110.taskNum = list.length;
                if (0 == list.length) {
                    localStorage.clear();
                }
                var flag = true;
                for (var i = 0; i < list.length; i++) {
                    //var num = i + 1;
                    var taskStatus = list[i].policeInfoStatus;
                  var taskStatusName = "【已完成】";
                    if (1 == taskStatus) {
                        taskStatusName = "【已生成】";
                    } else if (2 == taskStatus) {
                        taskStatusName = "【已下发】";
                    } else if (3 == taskStatus) {
                        taskStatusName = "【处理中】";
                    }
                    /**如果是已经完成的任务，就不显示了*/
                    if (5 == taskStatus) {
                        continue;
                    }

                    var day = new Date(list[i].createTime).format('yyyy/MM/dd');
                    var time = new Date(list[i].createTime).format('hh:mm:ss');
                    if (flag) {
                        flag = false;
                        // $("#tasks_ul").append('<li id="'+list[i].id+'" lat="'+list[i].policeInfoLat+'" lng="'+list[i].policeInfoLng+'" class="checked-tab" style="cursor:pointer;"><abbr title="'+list[i].taskName+'">'+buildTaskName(list[i].taskName)+'</abbr></li>');
                      $("#tasks_ul").append('<li class="checked-timer-shaft" id="'
                          + list[i].id + '" lat="' + list[i].policeInfoLat
                          + '" lng="' + list[i].policeInfoLng + '" createTime="'
                          + list[i].createTime + '" data-leader-unit="'
                          + list[i].leaderUnit + '">' +
                            '<span class="timer-span">' + day + '<br/>' + time + '</span>' +
                            '<span class="timer-icon"><b></b></span>' +
                            '<span title="' + list[i].taskName + '" class="timer-shaft-text">' + taskStatusName + '</br>' + buildTaskName(list[i].taskName) + '</span></li>');

                        //todo: 是否需要清理webrtc资源
                        if (currentRoom) {
                            $(currentRoom).remove();
                            currentRoom = null;
                        }
                        initTask(list[i].id, list[i].policeInfoLat, list[i].policeInfoLng);
                        setTitle(list[i].createTime, list[i].taskName);
                    } else {
                        // $("#tasks_ul").append('<li id="'+list[i].id+'" lat="'+list[i].policeInfoLat+'" lng="'+list[i].policeInfoLng+'" style="cursor:pointer;"><abbr title="'+list[i].taskName+'">'+buildTaskName(list[i].taskName)+'</abbr></li>');
                      $("#tasks_ul").append('<li id="' + list[i].id + '" lat="'
                          + list[i].policeInfoLat + '" lng="'
                          + list[i].policeInfoLng + '"  createTime="'
                          + list[i].createTime + '" data-leader-unit="'
                          + list[i].leaderUnit + '"><span class="timer-span">'
                          + day + '<br/>' + time
                          + '</span><span class="timer-icon"><b></b></span><span title="'
                          + list[i].taskName + '" class="timer-shaft-text">'
                          + taskStatusName + '</br>' + buildTaskName(
                              list[i].taskName) + '</span></li>');
                    }
                }
                //时间轴增加点击监听点击事件
                timer_shaft($(".timer-shaft-list li"));
            }
        }
    });
}

$(document).ready(function () {
    ws.onopen = function () {
        //获取所有未完成任务
        currentTasks();
        //多屏接警台，开启其他两屏
        $('#page_chat').click(function () {
            window.open(BASESERVLET + "/web/home?page=chat");
        });
        $('#page_map').click(function () {
            nw = window.open(BASESERVLET + "/web/infoTask/getMapHtml");
        });
        $('#page_task').click(function () {
            layer.open({
                type: 2,
                title: "添加任务信息",
                shadeClose: true,
                closeBtn: 1,
                shade: 0.3,
                area: ['1240px', '90%'],
                content: BASESERVLET + '/web/infoTask/add'
            });
        });
        //初始化地址反解析
        AMap.service('AMap.Geocoder', function () {//回调函数
            //实例化Geocoder
            window.geoc = new AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
        });
        //多屏模块初始化
        APP110.loadConfig(3);
        APP110.load(1);//加载第1屏
    }
    if (nw != null) {
        nw.location.reload();
    }
});

/**
 * 设置标题
 * @param createTime 创建时间
 * @param titleText 标题
 */
function setTitle(createTime, titleText) {
    var titleTime = new Date(parseFloat(createTime)).format('yyyy-MM-dd hh:mm:ss')
    $("#video_message").html(titleTime + ' ' + titleText);
}

/**
 * 最小化远程视频窗口
 * @param room 房间id
 */
function minimizingRemoteVideo(room, remoteId) {
    sendMessage({
        id: 'stopReceiveVideoFrom',
        room: room,
        sender: remoteId
    });
}

/**
 * 还原最小化视频窗口
 * @param obj
 */
function removeMinimizingVideo(obj) {
    var roomId = $(obj).data('roomid');
    var remoteId = $(obj).data('remoteid');
    $(obj).remove();
    refreshMinimizingCount();

    //接受对方视频
    var msg = {name: remoteId};
    receiveVideo(roomId, msg);

    $('#room' + roomId + 'remote' + remoteId).show();
}

/**
 * 最小化视频窗口
 * @param obj
 */
function addMinimizingVideo(roomId, remoteId) {
    var name = $('#room' + roomId + 'remote' + remoteId + ' a').html();
    var count = $('.video-person-group').children('li').length + 1;
    var html = '<li onclick="removeMinimizingVideo(this)" id="remote-id-'
        + remoteId + '" data-roomid="' + roomId + '" data-remoteid="' + remoteId
        + '">'
        + '<span class="serial-number">' + count + '.</span><span> ' + name
        + '</span>'
        + '<i class="icon iconfont icon-shipin color-dark-gray" ></i>'
        + '</li>';
    $('.video-person-group').append(html);
    $('#room' + roomId + 'remote' + remoteId).hide();
    $('#room' + roomId + 'remote' + remoteId + ' video').attr('src', '');
    refreshMinimizingCount();

    //停止接受视频信令
    minimizingRemoteVideo(roomId, remoteId);
}

/**
 * 刷新最小化窗口数量
 */
function refreshMinimizingCount() {
    var count = $('.video-person-group').children('li').length;
    $('#minimizing_count').html(count);
  if (count == 0) {
    $(".video-menu-box").css("display", "none");
  }
}

var iframeBody;

function open_face_window(id, videoId, userId) {
  //修改已经打开人脸识别图片页面
  $(id).attr("data-role", "open");
  layer.open({
    type: 2,
    title: "人脸识别图片",
    shadeClose: true,
    shade: 0.3,
    area: ['1250px', '80%'],
    content: BASESERVLET + '/web/infoTask/faceImgHtml?roomId=' + videoId
    + '&userId=' + userId,
    success: function (layero, index) {
      iframeBody = layer.getChildFrame('body', index);
      initFaceComparison();
    },
    cancel: function (layero, index) {
      unFaceComparison();
      layer.closeAll();
    }
  });
}

/**
 * 判断任务指挥的单位，与当前登陆用户的单位是否一致
 * @param taskId 任务id
 * @returns {boolean} 是否为当前分组创建的任务
 */
function isOwnVideoGroup(taskId) {
  var taskLi = $('#tasks_ul').find("#" + taskId);
  if (taskLi.length > 0) {
    var createUnit = taskLi.data("leader-unit");
    var userGroup = $(".userGroup").val();
    return createUnit == userGroup;
  }
}

/**
 * mq消息-任务完结消息
 */
function subscribeTaskEnd() {
  var headers = {
    'activemq.retroactive': 'true'
  };
  chatSubscribe = skynetSocket.subscribe("/topic/TASK_END", function (m) {
    console.log(m);
    console.log("收到任务结束<<<<<<<：o%", m);
    var body;
    try {
      body = JSON.parse(m.body);
    } catch (e) {
      layer.alert("解析消息异常：" + e.message + "\n\n" + m.body);
      console.error("解析消息异常：s%", m.body);
      return;
    }
    if (!body) {
      return;
    }
    var taskId = body.body;

    var currentTaskId = getCurrentTaskId();
    // 如果完结任务为当前打开的任务，则自动加载下一个任务
    if (currentTaskId === taskId) {
      var nextTask = $('#' + taskId).next();
      if (nextTask.length > 0) {
        liEvent(nextTask);
      }
    }
    $('#' + taskId).remove();
  }, headers);
}
