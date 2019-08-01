var janus = null;
var currentRoom = null;
var sfutest;
var removeTaskId;
function Commander(config) {
    var feeds = [];
    var bitrateTimer = [];
    // var janus = null;
    var opaqueId = "videoroomtest-" + Janus.randomString(12);
    var started = false;

    var myid = null;
    var mystream = null;
// We use this other ID just to map our subscriptions to us
    var mypvtid = null;

    var config = config || {};
    //TODO check config parameters

    var room = config.room;
    var server = config.server;
    var pin = config.pin;
    var myusername = config.username;

    this.attend = function (config) {
        joinVideoRoom();
    }

    function joinVideoRoom() {
        Janus.init({
            debug: "all", callback: function () {
                if (!Janus.isWebrtcSupported()) {
                    Janus.log("No WebRTC support... ");
                    return;
                }
                janus = new Janus(
                    {
                        server: server,
                        //pin: pin,
                        iceServers: [
                            {
                                urls: "turn:v1.video110.cn:34780",
                                username: "video1",
                                credential: "12wwfthisisturnserver1"
                            }, {
                                urls: "stun:v1.video110.cn:34780"
                            }
                        ],
                        success: function () {
                            var isJoin;
                            janus.attach(
                                {
                                    plugin: "janus.plugin.videoroom",
                                    opaqueId: opaqueId,
                                    success: function (pluginHandle) {
                                        sfutest = pluginHandle;
                                        Janus.log("Plugin attached! ("
                                            + sfutest.getPlugin() + ", id="
                                            + sfutest.getId() + ")");
                                        Janus.log("  -- This is a publisher/manager");
                                        var register = {
                                            "request": "join",
                                            "room": room,
                                            "pin": pin,
                                            "ptype": "publisher",
                                            "display": myusername
                                        };
                                        pluginHandle.send({"message": register});
                                        $('#room' + room + ' .public-video-button').click(function () {
                                            if(isJoin) {
                                                publishOwnFeed(true);
                                                $('#room' + room + 'local').attr('hasControl',1);
                                                $('#room' + room + 'local .video-content-box').removeClass('bg-gray');
                                                $('#room' + room + ' .public-box').hide();
                                                $('#room' + room + 'local video').show();
                                            }
                                        });
                                        $('#room' + room + ' .stop-public-btn').click(function () {
                                            var unpublish = {"request": "unpublish"};
                                            pluginHandle.send({"message": unpublish});
                                            $('#room' + room + 'local').attr('hasControl',0);
                                            $('#room' + room + 'local .video-content-box').addClass('bg-gray');
                                            $('#room' + room + 'local video').hide();
                                            $('#room' + room + ' .public-box').show();
                                        });
                                    },
                                    error: function (error) {
                                        Janus.error("  -- Error attaching plugin...", error);
                                        Janus.log("Error attaching plugin... " + error);
                                    },
                                    consentDialog: function (on) {

                                    },
                                    mediaState: function (medium, on) {
                                        Janus.log("Janus " + (on ? "started" : "stopped")
                                            + " receiving our " + medium);
                                    },
                                    webrtcState: function (on) {
                                        Janus.log("Janus says our WebRTC PeerConnection is "
                                            + (on ? "up" : "down") + " now");
                                        //$("#video" + room + "local").unblock();
                                    },
                                    onmessage: function (msg, jsep) {
                                        Janus.debug(" ::: Got a message (publisher) :::");
                                        Janus.debug(JSON.stringify(msg));
                                        var event = msg["videoroom"];
                                        Janus.debug("Event: " + event);
                                        if (event != undefined && event != null) {
                                            if (event === "joined") {
                                                // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                                                myid = msg["id"];
                                                mypvtid = msg["private_id"];
                                                Janus.log("Successfully joined room " + msg["room"]
                                                    + " with ID " + myid);
                                                isJoin = true;
                                                // publishOwnFeed(true);
                                                // Any new feed to attach to?
                                                if (msg["publishers"] !== undefined
                                                    && msg["publishers"] !== null) {
                                                    var list = msg["publishers"];
                                                    Janus.debug(
                                                        "Got a list of available publishers/feeds:");
                                                    Janus.debug(list);
                                                    for (var f in list) {
                                                        var id = list[f]["id"];
                                                        var display = list[f]["display"];
                                                        Janus.debug("  >> [" + id + "] " + display);
                                                        newRemoteFeed(id, display)
                                                    }
                                                }
                                            } else if (event === "destroyed") {
                                                Janus.warn("The room has been destroyed!");
                                            } else if (event === "event") {
                                                // Any new feed to attach to?
                                                if (msg["publishers"] !== undefined
                                                    && msg["publishers"] !== null) {
                                                    var list = msg["publishers"];
                                                    Janus.debug(
                                                        "Got a list of available publishers/feeds:");
                                                    Janus.debug(list);
                                                    for (var f in list) {
                                                        var id = list[f]["id"];
                                                        var display = list[f]["display"];
                                                        Janus.debug("  >> [" + id + "] " + display);
                                                        newRemoteFeed(id, display)
                                                    }
                                                } else if (msg["leaving"] !== undefined
                                                    && msg["leaving"] !== null) {
                                                    // One of the publishers has gone away?
                                                    var leaving = msg["leaving"];
                                                    Janus.log("Publisher left: " + leaving);
                                                    var remoteFeed = null;
                                                    for (var i = 1; i < feeds.length; i++) {
                                                        if (feeds[i] != null
                                                            && feeds[i] != undefined
                                                            && feeds[i].rfid == leaving) {
                                                            remoteFeed = feeds[i];
                                                            break;
                                                        }
                                                    }
                                                    if (remoteFeed != null) {
                                                        Janus.debug("Feed " + remoteFeed.rfid + " ("
                                                            + remoteFeed.rfdisplay
                                                            + ") has left the room, detaching");
                                                        $('#remote'
                                                            + remoteFeed.rfindex).empty().hide();
                                                        $('#videoremote' + remoteFeed.rfindex).empty();
                                                        feeds[remoteFeed.rfindex] = null;
                                                        remoteFeed.detach();
                                                    }
                                                } else if (msg["unpublished"] !== undefined
                                                    && msg["unpublished"] !== null) {
                                                    // One of the publishers has unpublished?
                                                    var unpublished = msg["unpublished"];
                                                    Janus.log("Publisher left: " + unpublished);
                                                    if (unpublished === 'ok') {
                                                        // That's us
                                                        sfutest.hangup();
                                                        return;
                                                    }
                                                    var remoteFeed = null;
                                                    for (var i = 1; i < feeds.length; i++) {
                                                        if (feeds[i] != null
                                                            && feeds[i] != undefined
                                                            && feeds[i].rfid == unpublished) {
                                                            remoteFeed = feeds[i];
                                                            break;
                                                        }
                                                    }
                                                    if (remoteFeed != null) {
                                                        Janus.debug("Feed " + remoteFeed.rfid + " ("
                                                            + remoteFeed.rfdisplay
                                                            + ") has left the room, detaching");
                                                        $('#remote'
                                                            + remoteFeed.rfindex).empty().hide();
                                                        $('#videoremote' + remoteFeed.rfindex).empty();
                                                        feeds[remoteFeed.rfindex] = null;
                                                        remoteFeed.detach();
                                                    }
                                                } else if (msg["error"] !== undefined
                                                    && msg["error"] !== null) {
                                                    if (msg["error_code"] === 426) {
                                                        Janus.debug("No such room");
                                                    } else {
                                                        Janus.debug(msg["error"]);
                                                    }
                                                }
                                            }
                                        }
                                        if (jsep !== undefined && jsep !== null) {
                                            Janus.debug("Handling SDP as well...");
                                            Janus.debug(jsep);
                                            sfutest.handleRemoteJsep({jsep: jsep});
                                        }
                                    },
                                    onlocalstream: function (stream) {
                                        Janus.debug(" ::: Got a local stream :::");
                                        mystream = stream;
                                        Janus.debug(JSON.stringify(stream));
                                        $('#room' + room + 'local video').remove();

                                        if ($('#room' + room + 'local video').length
                                            === 0) {
                                            $('#room' + room
                                                + 'local .video-content-box').append(
                                                '<video class="rounded centered" id="myvideo'
                                                + room
                                                + '" width="100%" height="100%" autoplay muted="muted"/>');
                                            // Add a 'mute' button
                                            //$('#room' + room + 'local video').append(
                                            ///'<button class="btn btn-warning btn-xs" id="mute' + room + '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;">Mute</button>');
                                            //$('#mute' + room).click(toggleMute);
                                            // Add an 'unpublish' button
                                            //$('#videolocal').append(
                                            // '<button class="btn btn-warning btn-xs" id="unpublish" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;">Unpublish</button>');
                                            //$('#unpublish').click(unpublishOwnFeed);
                                        }
                                        $('#room' + room
                                            + 'local .video-title span').html(
                                            myusername).show();
                                        Janus.attachMediaStream($('#myvideo' + room).get(0),
                                            stream);
                                        $("#myvideo" + room).get(0).muted = "muted";
                                        //$('#room' + room + 'local').block({
                                        //message: '<b>准备中...</b>',
                                        //css: {
                                        //border: 'none',
                                        //backgroundColor: 'transparent',
                                        //color: 'white'
                                        //}
                                        //});
                                        var videoTracks = stream.getVideoTracks();
                                        if (videoTracks === null || videoTracks === undefined
                                            || videoTracks.length === 0) {
                                            // No webcam
                                            $('#myvideo' + room).hide();
                                            $('#video' + room + 'local').append(
                                                '<div class="no-video-container">' +
                                                '<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>'
                                                +
                                                '<span class="no-video-text" style="font-size: 16px;">No webcam available</span>'
                                                +
                                                '</div>');
                                        }
                                        $('#mute' + room).unbind("click");
                                        $('#mute' + room).click(function () {
                                            toggleMute();
                                        });
                                    },
                                    onremotestream: function (stream) {
                                        // The publisher stream is sendonly, we don't expect anything here
                                    },
                                    oncleanup: function () {
                                        Janus.log(
                                            " ::: Got a cleanup notification: we are unpublished now :::");
                                        mystream = null;
                                        $('#video' + room + 'local').html(
                                            '<button id="publish' + room
                                            + '" class="btn btn-primary">发布</button>');
                                        $('#publish' + room).click(function () {
                                            publishOwnFeed(true);
                                        });
                                        //$('#video' + room + 'local').unblock();
                                    }
                                });
                        },
                        error: function (error) {
                            Janus.error(error);

                        },
                        destroyed: function () {
                            window.location.reload();
                        }
                    });

            }
        });
    }

    function publishOwnFeed(useAudio) {
        // Publish our stream
        //$('#publish').attr('disabled', true).unbind('click');
        sfutest.createOffer(
            {
                // Add data:true here if you want to publish datachannels as well
                media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true },	// Publishers are sendonly
                success: function(jsep) {
                    Janus.debug("Got publisher SDP!");
                    Janus.debug(jsep);
                    var publish = { "request": "configure", "audio": useAudio, "video": true };
                    sfutest.send({"message": publish, "jsep": jsep});
                },
                error: function(error) {
                    Janus.error("WebRTC error:", error);
                    if (useAudio) {
                        publishOwnFeed(false);
                    } else {
                        Janus.debug("WebRTC error... " + JSON.stringify(error));
                        //$('#publish').removeAttr('disabled').click(function() { publishOwnFeed(true); });
                    }
                }
            });
    }

    function toggleMute() {
        var muted = sfutest.isAudioMuted();
        Janus.log((muted ? "Unmuting" : "Muting") + " local stream...");
        if (muted) {
            sfutest.unmuteAudio();
        } else {
            sfutest.muteAudio();
        }
        muted = sfutest.isAudioMuted();
        var muteClass = muted ? "voice-close-btn" : "voice-btn";
        $('#mute' + room).attr("class" , muteClass);
    }

    function unpublishOwnFeed() {
        // Unpublish our stream
        $('#unpublish' + room).attr('disabled', true).unbind('click');
        var unpublish = {"request": "unpublish"};
        sfutest.send({"message": unpublish});
    }

    function newRemoteFeed(id, display) {
        // A new feed has been published, create a new plugin handle and attach to it as a listener
        var remoteFeed = null;
        janus.attach(
            {
                plugin: "janus.plugin.videoroom",
                opaqueId: opaqueId,
                success: function (pluginHandle) {
                    remoteFeed = pluginHandle;
                    Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id="
                        + remoteFeed.getId() + ")");
                    Janus.log("  -- This is a subscriber");
                    // We wait for the plugin to send us an offer
                    var listen = {
                        "request": "join",
                        "room": room,
                        "pin": pin,
                        "ptype": "listener",
                        "feed": id,
                        "private_id": mypvtid
                    };
                    remoteFeed.send({"message": listen});
                },
                error: function (error) {
                    Janus.error("  -- Error attaching plugin...", error);
                    Janus.log("Error attaching plugin... " + error);
                },
                onmessage: function (msg, jsep) {
                    Janus.debug(" ::: Got a message (listener) :::");
                    Janus.debug(JSON.stringify(msg));
                    var event = msg["videoroom"];
                    Janus.debug("Event: " + event);
                    if (event != undefined && event != null) {
                        if (event === "attached") {
                            // Subscriber created and attached
                            for (var i = 1; i < 1000; i++) {
                                if (feeds[i] === undefined || feeds[i]
                                    === null) {
                                    feeds[i] = remoteFeed;
                                    remoteFeed.rfindex = i;
                                    break;
                                }
                            }
                            remoteFeed.rfid = msg["id"];
                            remoteFeed.rfdisplay = msg["display"];
                            /*if (remoteFeed.spinner === undefined || remoteFeed.spinner
                             === null) {
                             var target = document.getElementById('videoremote'
                             + remoteFeed.rfindex);
                             remoteFeed.spinner = new Spinner({top: 100}).spin(target);
                             } else {
                             remoteFeed.spinner.spin();
                             }*/
                            Janus.log("Successfully attached to feed " + remoteFeed.rfid
                                + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
                            $('#remote' + remoteFeed.rfindex+ room).removeClass('hide').html(
                                remoteFeed.rfdisplay).show();
                        } else if (msg["error"] !== undefined && msg["error"] !== null) {
                            Janus.log(msg["error"]);
                        } else {
                            // What has just happened?
                        }
                    }
                    if (jsep !== undefined && jsep !== null) {
                        Janus.debug("Handling SDP as well...");
                        Janus.debug(jsep);
                        // Answer and attach
                        remoteFeed.createAnswer(
                            {
                                jsep: jsep,
                                // Add data:true here if you want to subscribe to datachannels as well
                                // (obviously only works if the publisher offered them in the first place)
                                media: {audioSend: false, videoSend: false},	// We want recvonly audio/video
                                success: function (jsep) {
                                    Janus.debug("Got SDP!");
                                    Janus.debug(jsep);
                                    var body = {"request": "start", "room": room};
                                    remoteFeed.send({"message": body, "jsep": jsep});
                                },
                                error: function (error) {
                                    Janus.error("WebRTC error:", error);
                                    Janus.log("WebRTC error... " + JSON.stringify(error));
                                }
                            });
                    }
                },
                webrtcState: function (on) {
                    Janus.log("Janus says this WebRTC PeerConnection (feed #"
                        + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
                },
                onlocalstream: function (stream) {
                    // The subscriber stream is recvonly, we don't expect anything here
                },
                onremotestream: function (stream) {
                    console.log("用户"+remoteFeed.rfdisplay+"加入房间");
                    Janus.debug("Remote feed #" + remoteFeed.rfindex);
                    var joinUser = remoteFeed.rfdisplay.split(':');
                    if($('#currentUser').val() == joinUser[0]) {
                        console.log("用户"+remoteFeed.rfdisplay+"加入房间，用户已存在");
                        return;//确保远程视频排除自己
                    }
                    if ($('#room' + room+ 'remote' + remoteFeed.rfindex).length === 0) {
                        $('#room' + room).append('<div class="video-box" id="room'+room+'remote' +remoteFeed.rfindex+ '">');
                        $('#room' + room+ 'remote' + remoteFeed.rfindex).append('<div class="video-title color-blue"></div><div class="video-content-box"><div class="address-box"><i class="fa fa-map-marker color-white" aria-hidden="true"></i> &nbsp;&nbsp;<span class="color-white"></span></div>');
                        $('#room' + room+ 'remote' + remoteFeed.rfindex + ' .video-content-box')
                            .append('<video class="rounded centered relative hide" id="remotevideo'
                                + remoteFeed.rfindex + room
                                + '" width="100%" height="100%" autoplay/>'
                                + '<div class="controls-box">'
                                //+ '<span class="voice-btn"></span>'
                                + '<ul class="video-content-list">'
                                + '<li><span class="full-screen-btn"></span></li>'
                                + '<li><span class="video-stop-btn"></span><span class="video-start-btn" style="display: none"></span></li>'
                                + '<li><span id="curres' + remoteFeed.rfindex + room + '" class="color-white font-size-12px"></span></li>'
                                + '<li><span id="curbitrate' + remoteFeed.rfindex + room + '" class="color-white font-size-12px"></span></li>'
                                + '</ul></div>')
                        fillVideoInfo('#room' + room+ 'remote' + remoteFeed.rfindex,joinUser[0],remoteFeed,room);
                    }

                    // Show the video, hide the spinner and show the resolution when we get a playing event
                    $("#remotevideo" + remoteFeed.rfindex + room).bind("playing", function () {

                    });
                    Janus.attachMediaStream(
                        $('#remotevideo' + remoteFeed.rfindex + room).get(0), stream);
                    var videoTracks = stream.getVideoTracks();
                    if (videoTracks === null || videoTracks === undefined
                        || videoTracks.length === 0 || videoTracks[0].muted) {
                        // No remote video
                        $('#remotevideo' + remoteFeed.rfindex + room).hide();
                        $('#videoremote' + remoteFeed.rfindex + room).append(
                            '<div class="no-video-container">' +
                            '<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>'
                            +
                            '<span class="no-video-text" style="font-size: 16px;">No remote video available</span>'
                            +
                            '</div>');
                    }
                    if (adapter.browserDetails.browser === "chrome"
                        || adapter.browserDetails.browser === "firefox" ||
                        adapter.browserDetails.browser === "safari") {
                        $('#curbitrate' + remoteFeed.rfindex).removeClass('hide').show();
                        bitrateTimer[remoteFeed.rfindex] = setInterval(
                            function () {
                                // Display updated bitrate, if supported
                                var bitrate = remoteFeed.getBitrate();
                                if(bitrate == 'Invalid handle') {
                                    bitrate = '0 kbits/sec'
                                }
                                $('#curbitrate' + remoteFeed.rfindex + room).text(bitrate);
                                // Check if the resolution changed too
                                var width,height= 0;
                                if($("#remotevideo" + remoteFeed.rfindex + room).get(0)) {
                                    width = $("#remotevideo" + remoteFeed.rfindex + room).get(0).videoWidth;
                                }
                                if(height = $("#remotevideo" + remoteFeed.rfindex + room).get(0)) {
                                    height = $("#remotevideo" + remoteFeed.rfindex + room).get(0).videoHeight;
                                }
                                if (width > 0 && height > 0) {
                                    $('#curres' + remoteFeed.rfindex + room).removeClass(
                                        'hide').text(width + 'x' + height).show();
                                }
                            }, 1000);
                    }
                },
                oncleanup: function () {
                    Janus.log(" ::: Got a cleanup notification (remote feed " + id
                        + ") :::");
                    /*if (remoteFeed.spinner !== undefined && remoteFeed.spinner
                     !== null) {
                     remoteFeed.spinner.stop();
                     }
                     remoteFeed.spinner = null;*/

                    bitrateTimer[remoteFeed.rfindex] = null;
                    try {
                        if(remoteFeed && typeof remoteFeed.hangup === 'function') {
                            remoteFeed.hangup();
                        }
                    } catch(error) {
                        console.log("远程视频已经挂断");
                    }
                    $('#room' + room + 'remote' + remoteFeed.rfindex).remove();
                }
            });
    }

}

$(document).ready(function () {
    //初始化视频房间
    initTask();
    //多屏接警台，开启其他两屏
    $('#page_chat').click(function () {
        window.open(BASESERVLET +"/web/home?page=chat");
    });
    $('#page_map').click(function () {
        window.open(BASESERVLET +"/web/infoTask/getMapHtml");
    });
    //初始化地址反解析
    //window.geoc = new BMap.Geocoder();
    setTimeout(function () {
        AMap.service('AMap.Geocoder', function () {//回调函数
            //实例化Geocoder
            window.geoc = new AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
        });
    },5000);
    //多屏模块初始化
    // APP110.loadConfig(3);
    // APP110.load(1);//加载第1屏
});
function initTask(){
    var obj = {};
    obj.room = $('#currentRoom').val();
    obj.server = $('#currentServer').val();
    obj.pin = $('#currentPin').val();
    var tab = $("#tab-template").html();
    tab = (tab+"").replace(/{{ROOM-ID}}/g, obj.room);//替换
    $("#room_box").append(tab);
    currentRoom = '#room' + obj.room;
    addButtonFun('#room'+obj.room+'local',null,null,true);
    $("#room"+obj.room+"local").mouseover(function(){
        if($(this).attr('hasControl') == '1') {
            $(this).children().find(".controls-box").css("display","block");
        }
    });

    $("#room"+obj.room+"local").mouseout(function(){
        $(this).children().find(".controls-box").css("display","none");
    });
    var userId = $('#currentUser').val();
    joinRoom(obj.server,Number(obj.room),obj.pin,userId+":"+1);
    // localStorage.setItem('currentLat',lat);
    // localStorage.setItem('currentLng',lng);
    // localStorage.setItem('currentTaskId',taskId);
    // localStorage.setItem('currentRoomId',obj.id);
    // APP110.callModFun("chat","choice",taskId,obj.id);
    // APP110.callModFun("map","gpsMap",lat,lng);

}

function joinRoom(server, room, pin, name) {
    var config = {
        server: server,
        room: room,
        username: name,
        pin: pin
    }
    var commander = new Commander(config);
    commander.attend();
}

function fillVideoInfo(domId, userId, plugin, room) {
    $(domId).mouseover(function(){
        $(this).children().find(".controls-box").css("display","block");
    });
    $(domId).mouseout(function(){
        $(this).children().find(".controls-box").css("display","none");
    });
    // $.ajax({
    //     url:BASESERVLET+"/web/getPoliceCoordinates/"+userId,
    //     type:"get",
    //     success:function(data){
    //         if(data.status) {
    //             var obj = data.obj;
    //             $(domId+' .video-title').html(obj.userName);
    //             $(domId+' .video-title').attr("title",obj.groupName);
    //             if(obj.longitude && obj.latitude) {
    //                 //var point = new BMap.Point(Number(obj.longitude),Number(obj.latitude));
    //                 // geoc.getLocation(point, function(rs){
    //                 //     var address = rs.address;
    //                 //     $(domId).find('.address-box:first').find('span').html(address);
    //                 // });
    //                 var lnglatXY = [obj.longitude, obj.latitude];//地图上所标点的坐标
    //                 geoc.getAddress(lnglatXY, function (status, result) {
    //                     if (status === 'complete' && result.info === 'OK') {
    //                         //获得了有效的地址信息:
    //                         //即，result.regeocode.formattedAddress
    //                         $(domId).find('.address-box:first').find('span').html(result.regeocode.formattedAddress);
    //                     } else {
    //                         //获取地址失败
    //                     }
    //                 });
    //             } else {
    //                 $(domId).find('.address-box:first').find('span').html(obj.groupName);
    //             }
    //
    //         }
    //     }
    // });
    addButtonFun(domId, plugin, room);

}

function addButtonFun(domId, plugin, room, isLocal) {
    //全屏按钮
    $(domId).find('.full-screen-btn:first').on('click',function(){
        $(domId).find('video').first()[0].webkitRequestFullScreen();
    });
    if(isLocal) {
        //暂停按钮
        $(domId).find('.video-stop-btn:first').on('click',function(){
            $(this).hide();
            $(domId).find('.video-start-btn:first').show();
            if(sfutest && typeof sfutest.muteVideo() === "function") {
                try {
                    sfutest.muteVideo();
                } catch(error) {
                    console.log("视频插件已经停止");
                }
            }
        });
        //播放按钮
        $(domId).find('.video-start-btn:first').on('click',function(){
            $(this).hide();
            $(domId).find('.video-stop-btn:first').show();
            if(sfutest && typeof sfutest.unmuteVideo() === "function") {
                try {
                    sfutest.unmuteVideo();
                } catch(error) {
                    console.log("视频插件已经停止");
                }
            };
        });
    } else {
        //暂停按钮
        $(domId).find('.video-stop-btn:first').on('click',function(){
            $(this).hide();
            $(domId).find('.video-start-btn:first').show();
            var body = {"request": "pause", "room": room};
            plugin.send({"message": body});
        });
        //播放按钮
        $(domId).find('.video-start-btn:first').on('click',function(){
            $(this).hide();
            $(domId).find('.video-stop-btn:first').show();
            var body = {"request": "start", "room": room};
            plugin.send({"message": body});
        });
    }

}

// APP110.mods["video"].add = function(taskId, comment, lat, lng){
//     if($('#'+taskId).length > 0) {
//         console.log("新增任务已存在");
//     } else {
//         APP110.taskNum++;
//         $("#tasks_ul").prepend('<li id="'+taskId+'" lat="'+lat+'" lng="'+lng+'" style="cursor:pointer;"><abbr title="'+comment+'">'+buildTaskName(comment)+'</abbr></li>');
//         //增加选项卡
//         $("#"+taskId).css("z-index", 300 + APP110.taskNum);
//         // $("#"+taskId).on("click", function() {
//         //     liEvent(this);
//         // });
//         //加入房间
//         //initTask(taskId);
//         $('#notice_mp3')[0].play();
//     }
//
// }

// function buildTaskName(name) {
//     if($.trim(name) == '') {
//         return '未命名任务';
//     } else {
//         if(name.length > 9) {
//             return name.substring(0, 9)+'...';
//         } else {
//             return name;
//         }
//     }
// }
// skynetSocket.afterConnect = function() {
//     // if(!APP110.isSocketInit) {
//     //     APP110.isSocketInit = true;
//     // }
//     var headers = {
//         'activemq.retroactive': 'true'
//     };
//     chatSubscribe = skynetSocket.subscribe("/topic/POLICE_TASK", function (m) {
//         console.log("收到调度任务<<<<<<<：o%", m);
//         var body;
//         try {
//             body = JSON.parse(m.body);
//         } catch (e) {
//             layer.alert("解析消息异常：" + e.message + "\n\n" + m.body);
//             console.error("解析消息异常：s%", m.body);
//             return;
//         }
//         if (!body) {
//             return;
//         }
//         var task = body.body;
//         if(body.event == 'ADD_TASK') {
//             APP110.mods["video"].add(task.id, task.taskName, task.policeInfoLat, task.policeInfoLng);
//         } else {
//             var currentTaskId = $('.checked-tab:first').attr('id');
//             if(currentTaskId == task.id) {
//                 removeTaskId = task.id;
//             } else {
//                 $('#'+task.id).remove();
//             }
//         }
//     }, headers);
// }