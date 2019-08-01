/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';
//报警提示音
var alarmAudioOutput = document.querySelector('select#alarmAudioOutput');
//聊天声音
var chatAudioOutput = document.querySelector('select#chatAudioOutput');

alarmAudioOutput.disabled = !('sinkId' in HTMLMediaElement.prototype);
chatAudioOutput.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];

    if (deviceInfo.kind === 'audiooutput' && $(
            "#alarmAudioOutput").find("option[groupId*=\'" + deviceInfo.groupId
            + "\']")) {
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      option.text = deviceInfo.label || 'speaker ' + (alarmAudioOutput.length
          + 1);
      alarmAudioOutput.appendChild(option);
    }
  }

  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'audiooutput') {
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      option.text = deviceInfo.label || 'speaker ' + (chatAudioOutput.length
          + 1);
      chatAudioOutput.appendChild(option);
    }
  }
  var alarmAudioOutputConfig = localStorage.getItem("alarmAudioOutput");
  var chatAudioOutputConfig = localStorage.getItem("chatAudioOutput");

  $("#alarmAudioOutput").find(
      "option[value='" + alarmAudioOutputConfig + "']").attr("selected", true);
  $("#chatAudioOutput").find(
      "option[value='" + chatAudioOutputConfig + "']").attr("selected", true);
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

$("#chatAudioOutput").change(function () {
  var sinkId = $("#chatAudioOutput").val();
  localStorage.setItem("chatAudioOutput", sinkId);
  if (APP110.currentMedia.caseId) {
    var rv = document.getElementById("remotevideo1");
    rv.setSinkId(sinkId);
    rv.muted = false;
  }
});

$("#alarmAudioOutput").change(function () {
  var sinkId = $("#alarmAudioOutput").val();
  localStorage.setItem("alarmAudioOutput", sinkId);
  var rv = document.getElementById("alarmAudio");
  if (APP110.currentMedia.caseId) {
    rv.setSinkId(sinkId);
    rv.muted = false;
  }
});

$("#alarmAudioOutputTest").click(function () {
  var sinkId = $("#alarmAudioOutput").val();
  var v = $("#alarmAudioOutputTest").attr("v");
  if (v == 1) {
    alarmAudioOutputTestStop();
    stopAudio();
  } else {
    alarmAudioOutputTestPlay();
    playAudio(sinkId);
    chatAudioOutputTestStop();
  }
});

function alarmAudioOutputTestStop() {
  $("#alarmAudioOutputTest").removeClass("icon-zanting");
  $("#alarmAudioOutputTest").addClass("icon-shipinbofang");
  $("#alarmAudioOutputTest").attr("v", 0);
}

function alarmAudioOutputTestPlay() {
  $("#alarmAudioOutputTest").removeClass("icon-shipinbofang");
  $("#alarmAudioOutputTest").addClass("icon-zanting");
  $("#alarmAudioOutputTest").attr("v", 1);
}

$("#chatAudioOutputTest").click(function () {
  var sinkId = $("#chatAudioOutput").val();
  var v = $("#chatAudioOutputTest").attr("v");
  if (v == 1) {
    chatAudioOutputTestStop();
    stopAudio();
  } else {
    chatAudioOutputTestPlay();
    playAudio(sinkId);
    alarmAudioOutputTestStop();
  }
});

function chatAudioOutputTestStop() {
  $("#chatAudioOutputTest").removeClass("icon-zanting");
  $("#chatAudioOutputTest").addClass("icon-shipinbofang");
  $("#chatAudioOutputTest").attr("v", 0);
}

function chatAudioOutputTestPlay() {
  $("#chatAudioOutputTest").removeClass("icon-shipinbofang");
  $("#chatAudioOutputTest").addClass("icon-zanting");
  $("#chatAudioOutputTest").attr("v", 1);
}

function playAudio(sinkId) {
  console.log(sinkId);
  var audio = document.getElementById("alarmAudioTest");
  if (sinkId) {
    audio.setSinkId(sinkId);
  }
  audio.play();//启动音频，用于第一次启动
}

function stopAudio() {
  var audio = document.getElementById("alarmAudioTest");
  audio.pause();
}