/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
// kurento 基础参数
var MyKurento = {
  rws: null,
  useAudio: true,
  useVideo: true,
  useBigScreen: false,
  useFaceDetect: false,
  useVideoFlip: false
};
// 初始化视频组件，包括切换按钮动作、初始化websocket、信令交互逻辑
APP110.mods["kurento"].init = function () {
  $('#mute').click(toggleMute);
  $('#appmute').click(toggleAppMute);
  $('#camera').click(toggleVideo);
  $('#big-screen').click(toggleBigScreen);
  $('#faceDetect').click(toggleFaceDetect);
  $('#videoFlip').click(toggleVideoFlip);
  initKurento();
};

// 初始化参数配置
APP110.mods["kurento"].initKurentoConfig = function (useAudio, useVideo) {
  MyKurento.useAudio = useAudio;
  MyKurento.useVideo = useVideo;
};

// 重置参数
APP110.mods["kurento"].reset = function () {
  resetMyKurento();
  resetCss();
};
var joinRoomTimeout;
// 加入房间，先以观看者进入
APP110.mods["kurento"].joinRoom = function (room, pin, secret, role) {
  console.log("接警员尝试joinRoom......");
  // 如果websocket没有连接，一直等待连接后再joinRoom
  if (!MyKurento.rws.connected) {
    joinRoomTimeout = setTimeout(APP110.mods["kurento"].joinRoom, 1000, room,
        pin, secret);
  } else {
    if (joinRoomTimeout) {
      clearTimeout(joinRoomTimeout);
    }
    if (!role) {
      role = RoomWebSocket.viewerOnly;
    }
    MyKurento.rws.joinRoom(room, pin, secret, role);
  }
}

// 发布本地视频
APP110.mods["kurento"].publishLocalVideo = function () {
  $('#videolocal').append(
      '<video class="rounded centered" id="myvideo" width="100%" height="100%" autoplay muted="muted"/>');
  var video = $('#myvideo').get(0);
  MyKurento.rws.publishLocalVideo(video);
}

// 离开房间
APP110.mods["kurento"].leaveRoom = function () {
  MyKurento.rws.leaveRoom();
  resetCss();
}

// 初始化Kurento,创建websocket信令传输通道
function initKurento() {
  if (!MyKurento.rws) {
    var listener = new AlarmRoomListener();
    MyKurento.rws = new RoomWebSocket(listener);
  }
}

function AlarmRoomListener() {

}

AlarmRoomListener.prototype = {
  constructor: AlarmRoomListener,
  getAlarmPersonVideo: function () {
    $('#videoremote1').html(
        '<video class="rounded centered relative " id="remotevideo1" width="100%" height="100%" autoplay/>');
    $('#videoremote1').append(
        '<span class="label label-primary hide" id="curres1" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>'
        +
        '<span class="label label-info hide" id="curbitrate1" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;color: yellow;"></span>');
    var rv = document.getElementById("remotevideo1");
    var sinkId = $("#chatAudioOutput").val();
    if (sinkId) {
      rv.setSinkId(sinkId);
      rv.muted = false;
    }
    var video = $('#remotevideo1').get(0);
    return video;
  },
  onParticipantLeft: function (name, isNormal) {
    // 报警人点击挂断按钮情况下，会清理资源；当异常挂断(如自动关机)不会处理，因为有时可能是网络原因断开，还会自动重连，此种情况回导致接警人员的视频框还在
    if (name != MyKurento.rws.localName && isNormal) {
      resetCss();
      resetMyKurento();
    }
  },
  onPublishAnswer: function () {
    initMute();
    initVideo();
  },
  onLeaveRoom: function () {
    resetMyKurento();
    $("#show-voice-box").hide();
    $(".video-box").css("background",
        "url(/theme/img/jiejingtai/video-bg.jpg)");
    $('#videoremote1').empty();
    $('#videolocal').empty();
  },
  forwardCallAnswer: function (rtsp) {
    console.log(rtsp);
    layer.alert("投屏链接地址为：" + rtsp);
  },
  cancelForwardCallAnswer: function (message) {
    console.log(message);
  }
}

// 重置css样式
function resetCss() {
  //重置视频状态
  $("#appmute").css("background", "url(/theme/img/jiejingtai/speaker.png)");
  $("#mute").css("background", "url(/theme/img/jiejingtai/voice.png)");
  $("#camera").css("background-img",
      "url(/theme/img/jiejingtai/btn_camera_open.png)");
  $("#big-screen").css("background",
      "url(/theme/img/jiejingtai/btn-screen-open.png)");
  $("#faceDetect").css("background",
      "url(/theme/img/jiejingtai/btn_face_close.png)");
  $("#videoFlip").css("background",
      "url(/theme/img/jiejingtai/btn_flip_open.png)");
  // 设置麦克风隐藏
  $("#show-voice-box").hide();
  // 重置视频样式
  $(".video-box").css("background", "url(/theme/img/jiejingtai/video-bg.jpg)");
  //本地视频隐藏
  $("#videolocal").hide();
  //转接按钮不可用
  $("#transfer").attr('disabled', true);
}

/**
 * 重置Kurento组件
 */
function resetMyKurento() {
  MyKurento.useBigScreen = false;
  MyKurento.rws.localName = null;
  if (MyKurento.rws.participants) {
    for (var key in MyKurento.rws.participants) {
      MyKurento.rws.participants[key].dispose();
      delete MyKurento.rws.participants[key];
    }
    MyKurento.rws.participants = {};
  }
  MyKurento.rws.room = null;
  MyKurento.rws.pin = null;
  MyKurento.rws.secret = null;
  MyKurento.rws.role = null;
  MyKurento.useAudio = true;
  MyKurento.useVideo = true;
  MyKurento.useFaceDetect = false;
  MyKurento.useVideoFlip = false;
}

/**
 * 初始化话筒声音
 */
function initMute() {
  var rv = document.getElementById("remotevideo1");
  var sinkId = $("#chatAudioOutput").val();
  if (sinkId) {
    rv.setSinkId(sinkId);
    rv.muted = false;
  }
  if (!MyKurento.useAudio) {
    var participant = MyKurento.rws.participants[MyKurento.rws.localName];
    mute(participant, false, true);
    var muted = isMuted(participant, false);
    if (muted) {
      $("#mute").css("background", "url(/theme/img/jiejingtai/voice-mute.png)");
    }
  }
}

/**
 * 初始化视频
 */
function initVideo() {
  if (!MyKurento.useVideo) {
    var participant = MyKurento.rws.participants[MyKurento.rws.localName];
    mute(participant, true, true);
    $("#camera").css("background",
        "url(/theme/img/jiejingtai/btn_camera_closed.png)");
    MyKurento.rws.disableVideo();
  }
}

// 切换本地视频是否发布
function toggleVideo() {
  var participant = MyKurento.rws.participants[MyKurento.rws.localName];
  if (!MyKurento.useVideo) {
    mute(participant, true, false);
    MyKurento.useVideo = true;
  } else {
    mute(participant, true, true);
    MyKurento.useVideo = false;
  }
  if (!MyKurento.useVideo) {
    $("#camera").css("background",
        "url(/theme/img/jiejingtai/btn_camera_closed.png)");
    $("#videolocal").hide();
    MyKurento.rws.disableVideo();
  } else {
    $("#camera").css("background",
        "url(/theme/img/jiejingtai/btn_camera_open.png)");
    $("#videolocal").show();
    MyKurento.rws.enableVideo();
  }
}

/**
 * 关闭/打开话筒声音
 */
function toggleMute() {
  var participant = MyKurento.rws.participants[MyKurento.rws.localName];
  if (!MyKurento.useAudio) {
    mute(participant, false, false);
    MyKurento.useAudio = true;
  } else {
    mute(participant, false, true);
    MyKurento.useAudio = false;
  }
  muted = isMuted(participant, false);
  if (muted) {
    $("#mute").css("background", "url(/theme/img/jiejingtai/voice-mute.png)");
  } else {
    $("#mute").css("background", "url(/theme/img/jiejingtai/voice.png)");
  }
}

/**
 * 关闭/打开报警人的声音
 */
function toggleAppMute() {
  var rv = document.getElementById("remotevideo1");
  var sinkId = $("#chatAudioOutput").val();
  if (sinkId) {
    rv.setSinkId(sinkId);
  }
  if (rv) {
    rv.muted = rv.muted ? false : true;
    if (rv.muted) {
      // 点击修改图片样式
      $("#appmute").css("background",
          "url(/theme/img/jiejingtai/speaker-mute.png)");
    } else {
      // 点击修改图片样式
      $("#appmute").css("background", "url(/theme/img/jiejingtai/speaker.png)");
    }
  }
}


/**
 * 检查本地音视频是否mute
 * @param participant
 * @param video
 * @returns {boolean}
 */
function isMuted(participant, video) {
  if (participant === null || participant === undefined ||
      participant.rtcPeer === null || participant === undefined) {
    return true;
  }
  var config = participant.rtcPeer;
  if (config.peerConnection === null || config.peerConnection === undefined) {
    return true;
  }
  if (config.getLocalStream() === undefined || config.getLocalStream()
      === null) {
    return true;
  }
  if (video) {
    if (config.getLocalStream().getVideoTracks() === null
        || config.getLocalStream().getVideoTracks() === undefined
        || config.getLocalStream().getVideoTracks().length === 0) {
      return true;
    }
    return !config.getLocalStream().getVideoTracks()[0].enabled;
  } else {
    if (config.getLocalStream().getAudioTracks() === null
        || config.getLocalStream().getAudioTracks() === undefined
        || config.getLocalStream().getAudioTracks().length === 0) {
      return true;
    }
    return !config.getLocalStream().getAudioTracks()[0].enabled;
  }
}

/**
 * mute/unmute 本地音视频
 * @param participant
 * @param video
 * @param mute
 * @returns {boolean}
 */
function mute(participant, video, mute) {
  if (participant === null || participant === undefined ||
      participant.rtcPeer === null || participant === undefined) {
    return false;
  }
  var config = participant.rtcPeer;
  if (config.peerConnection === null || config.peerConnection === undefined) {
    return false;
  }
  if (config.getLocalStream() === undefined || config.getLocalStream()
      === null) {
    return false;
  }
  if (video) {
    if (config.getLocalStream().getVideoTracks() === null
        || config.getLocalStream().getVideoTracks() === undefined
        || config.getLocalStream().getVideoTracks().length === 0) {
      return false;
    }
    config.getLocalStream().getVideoTracks()[0].enabled = mute ? false : true;
    return true;
  } else {
    if (config.getLocalStream().getAudioTracks() === null
        || config.getLocalStream().getAudioTracks() === undefined
        || config.getLocalStream().getAudioTracks().length === 0) {
      return false;
    }
    config.getLocalStream().getAudioTracks()[0].enabled = mute ? false : true;
    return true;
  }
}

/**
 * 切换是否投大屏，暂时未考虑websocket断线重连的问题
 */
function toggleBigScreen() {
  var caller;
  for (x in MyKurento.rws.participants) {
    if (x != MyKurento.rws.localName) {
      caller = x;
      break;
    }
  }
  if (MyKurento.useBigScreen) {
    MyKurento.rws.cancelForwardCall(caller);
    $("#big-screen").css("background",
        "url(/theme/img/jiejingtai/btn-screen-open.png)");
  } else {
    MyKurento.rws.forwardCall(caller);
    $("#big-screen").css("background",
        "url(/theme/img/jiejingtai/btn-screen-closed.png)");
  }
  MyKurento.useBigScreen = !MyKurento.useBigScreen;
}

function toggleFaceDetect() {
  var sender = $("#bjrxx-ls").attr("uid");
  if (MyKurento.useFaceDetect) {
    MyKurento.rws.disableFaceDetect(sender);
    $("#faceDetect").css("background",
        "url(/theme/img/jiejingtai/btn_face_close.png)");
  } else {
    MyKurento.rws.enableFaceDetect(sender);
    $("#faceDetect").css("background",
        "url(/theme/img/jiejingtai/btn_face_open.png)");
  }
  MyKurento.useFaceDetect = !MyKurento.useFaceDetect;
}

/**
 * 切换是否投进行视频的旋转
 */
function toggleVideoFlip() {
  var sender = $("#bjrxx-ls").attr("uid");
  if (MyKurento.useVideoFlip) {
    MyKurento.rws.stopVideoFlip(sender);
    $("#videoFlip").css("background",
        "url(/theme/img/jiejingtai/btn_flip_open.png)");
  } else {
    MyKurento.rws.videoFlip(sender);
    $("#videoFlip").css("background",
        "url(/theme/img/jiejingtai/btn_flip_close.png)");
  }
  MyKurento.useVideoFlip = !MyKurento.useVideoFlip;
}

