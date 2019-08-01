/**
 * Creates a video element for a new participant
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */
function Participant(room, name, local, userExtraInfo) {
    this.name = name;
    this.room = room;
    var video;
    if (local) {
        video = prepareLocalDom(room);
    } else {
        video = prepareRemoteDom(room, name);
    }
    var rtcPeer;
    this.getVideoElement = function () {
        return video;
    }
    this.offerToSendVideo = function (error, offerSdp, wp) {
        if (error) return console.error("sdp offer error")
        console.log('Invoking send SDP offer callback function');
        var msg = {
            id: "publish",
            sdpOffer: offerSdp,
            room: room
        };
        sendMessage(msg);
    }
    this.offerToReceiveVideo = function (error, offerSdp, wp) {
        if (error) return console.error("sdp offer error")
        console.log('Invoking receive SDP offer callback function');
        var msg = {
            id: "receiveVideoFrom",
            sender: name,
            sdpOffer: offerSdp,
            room: room
        };
        sendMessage(msg);
    }
    this.onIceCandidate = function (candidate, wp) {
        // console.log("Local candidate" + JSON.stringify(candidate));
        var message = {
            id: 'onIceCandidate',
            candidate: candidate,
            room: room,
            name: name
        };
        sendMessage(message);
    }
    Object.defineProperty(this, 'rtcPeer', {writable: true});
    this.dispose = function () {
        // console.log('Disposing participant ' + this.name);
        this.rtcPeer.dispose();
        $('#room' + this.room + 'remote' + this.name).remove();
    };
}

function prepareLocalDom(room) {
    $('#room' + room + ' .public-video-button').click(function () {
        $('#room' + room + 'local').attr('hasControl', 1);
        $('#room' + room + 'local .video-content-box').removeClass('bg-gray');
        $('#room' + room + ' .public-box').hide();
        $('#room' + room + 'local video').show();
    });
    $('#room' + room + ' .stop-public-btn').click(function () {
        $('#room' + room + 'local').attr('hasControl', 0);
        $('#room' + room + 'local .video-content-box').addClass('bg-gray');
        $('#room' + room + 'local video').hide();
        $('#room' + room + ' .public-box').show();
    });
    if ($('#room' + room + 'local video').length == 0) {
        $('#room' + room + 'local .video-content-box').append('<video class="rounded centered" id="myvideo' + room + '" width="100%" height="100%" autoplay />');
    }
    $('#room' + room + 'local .video-title span').html(myusername).show();
    $('#mute' + room).unbind("click");
    $('#mute' + room).click(function () {
        toggleMute(room);
    });
    return $('#room' + room + 'local video')[0];
}

//处理远程用户的dom
function prepareRemoteDom(room, name) {
    if ($('#room' + room + 'remote' + name).length === 0) {
        $('#room_box').append('<div class="video-box" id="room' + room + 'remote'
            + name + '">');
        $('#room' + room + 'remote' + name).append('<div class="video-title color-blue"></div><div class="video-content-box"><div class="address-box"><i class="fa fa-map-marker color-white" aria-hidden="true"></i> &nbsp;&nbsp;<span class="color-white"></span></div></div>');
        $('#room' + room + 'remote' + name + ' .video-content-box')
            .append('<video class="rounded centered relative hide" id="remotevideo'
                + name + room
                + '" width="100%" height="100%" autoplay/>'
                + '<div class="controls-box">'
                // + '<span class="mic-btn"></span>'
                + '<ul class="video-content-list">'
                + '<li><span class="full-screen-btn"></span></li>'
                + '<li><span class="video-projection-btn" style="display: none;cursor: pointer;" value="' + name + '"></span></li>'
                + '<li><span class="video-stop_projection-btn" style="cursor: pointer;"  value="' + name + '"></span></span></li>'
                + '<li><span class="voice-btn" style="cursor: pointer;" value="'
                + name + '"></span></li>'
                + '<li><span class="voice-close-btn" style="display: none; cursor: pointer;"  value="'
                + name + '"></span></li>'
                + '<li><span class="face-open-btn" style="cursor: pointer;" data-roomid="'
                + room + '" data-remoteid="' + name + '"></span></li>'
                + '<li><span class="face-close-btn" style="display: none; cursor: pointer;" data-roomid="'
                + room + '" data-remoteid="' + name + '"></span></li>'
                + '<li><span class="minimizing-btn" style="cursor: pointer;" data-roomid="'
                + room + '" data-remoteid="' + name + '"></span></li>'
                + '<li><span id="curres' + name + room + '" class="color-white font-size-12px"></span></li>'
                + '<li><span id="curbitrate' + name + room + '" class="color-white font-size-12px"></span></li>'
                + '</ul></div>');
        fillVideoInfo('#room' + room + 'remote' + name, name, room);

    }
    $('#room_box').dad({
        draggable: 'video'
    });
    return $('#room' + room + 'remote' + name + ' video')[0];
}

function toggleMute(room) {
    var muted = isMuted(name, false);
    if (muted) {
        mute(name, false, false);
    } else {
        mute(name, false, true);
    }
    muted = isMuted(name, false)
    var muteClass = muted ? "mic-close-btn" : "mic-btn";
    $('#mute' + room).attr("class", muteClass);
}


/**
 * 检查本地音视频是否mute
 * @param name
 * @param video
 * @returns {boolean}
 */
function isMuted(name, video) {
    var participant = participants[name];
    if (participant === null || participant === undefined ||
        participant.rtcPeer === null || participant === undefined) {
        return true;
    }
    var config = participant.rtcPeer;
    if (config.peerConnection === null || config.peerConnection === undefined) {
        return true;
    }
    if (config.getLocalStream() === undefined || config.getLocalStream() === null) {
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
 * @param name
 * @param video
 * @param mute
 * @returns {boolean}
 */
function mute(name, video, mute) {
    var participant = participants[name];
    if (participant === null || participant === undefined ||
        participant.rtcPeer === null || participant === undefined) {
        return false;
    }
    var config = participant.rtcPeer;
    if (config.peerConnection === null || config.peerConnection === undefined) {
        return false;
    }
    if (config.getLocalStream() === undefined || config.getLocalStream() === null) {
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
 * mute/unmute 远程音视频
 * @param name
 * @param video
 * @param mute
 * @returns {boolean}
 */
function remoteMute(name, video, mute) {
    var participant = participants[name];
    if (participant === null || participant === undefined ||
        participant.rtcPeer === null || participant === undefined) {
        return false;
    }
    var config = participant.rtcPeer;
    if (config.peerConnection === null || config.peerConnection === undefined) {
        return false;
    }
    if (config.getRemoteStream() === undefined || config.getRemoteStream()
        === null) {
        return false;
    }
    if (video) {
        if (config.getRemoteStream().getVideoTracks() === null
            || config.getRemoteStream().getVideoTracks() === undefined
            || config.getRemoteStream().getVideoTracks().length === 0) {
            return false;
        }
        config.getRemoteStream().getVideoTracks()[0].enabled = mute ? false : true;
        return true;
    } else {
        if (config.getRemoteStream().getAudioTracks() === null
            || config.getRemoteStream().getAudioTracks() === undefined
            || config.getRemoteStream().getAudioTracks().length === 0) {
            return false;
        }
        config.getRemoteStream().getAudioTracks()[0].enabled = mute ? false : true;
        return true;
    }
}

function fillVideoInfo(domId, userId, room) {
    $(domId).mouseover(function () {
        $(this).children().find(".controls-box").css("display", "block");
    });
    $(domId).mouseout(function () {
        $(this).children().find(".controls-box").css("display", "none");
    });
    $.ajax({
        url: BASESERVLET + "/web/getPoliceCoordinates/" + userId,
        type: "get",
        success: function (data) {
            if (data.status) {
                var obj = data.obj;
                // $(domId+' .video-title').html(obj.userName);
                var list = domId.split("remote");
                var videoId = "'" + list[0].replace("#room", "remotevideo" + list[1]) + "'";

                var stylecss = "'location=0,status=0,toolbar=0,scrollbars=1,resizeable=1,width=500,height=250'";
                var videoA = '<a href="#" onclick="open_in_new_window(' + videoId + ',\'' + obj.userName + '\',' + stylecss + ')">' + obj.groupName + obj.userName + '</a>';
                $(domId + ' .video-title').append(videoA);
                if (obj.longitude && obj.latitude) {
                    var lnglatXY = [obj.longitude, obj.latitude];//地图上所标点的坐标
                    geoc.getAddress(lnglatXY, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            //获得了有效的地址信息:
                            //即，result.regeocode.formattedAddress
                            $(domId).find('.address-box:first').find('span').html(result.regeocode.formattedAddress);
                        } else {
                            //获取地址失败
                            $(domId).find('.address-box:first').find('span').html(obj.groupName);
                        }
                    });
                } else {
                    $(domId).find('.address-box:first').find('span').html(obj.groupName);
                }

            }
        }
    });
  showFaceImgTitle(domId, userId, room);
  addButtonFun(domId, room);
}


function showFaceImgTitle(domId, userId, room) {
  $.ajax({
    url: BASESERVLET + "/web/infoTask/faceImgListFlag",
    type: "get",
    data: {roomId: room, userId: userId},
    dataType: "json",
    success: function (data) {
      if (data.status) {
        if (data.obj.flag) {
          var faceImgCount = '<a href="#" id="faceImgCount' + userId
              + '" style="color:#363a91; float: right;" onclick="open_face_window(this, \''
              + room + '\',\'' + userId + '\')" data-role="close">已捕捉人脸照片</a>';
          $(domId + ' .video-title').append(faceImgCount);
        }
      }
    }
  });
}
