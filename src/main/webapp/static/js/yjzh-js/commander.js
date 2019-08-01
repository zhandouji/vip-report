function Commander(config) {
    var feeds = [];
    var bitrateTimer = [];
    var sfutest = null;
    var janus = null;
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
          bootbox.alert("No WebRTC support... ");
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
                },
                {urls: "stun:v1.video110.cn:34780"}],
              success: function () {
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
                        sfutest.send({"message": register});
                      },
                      error: function (error) {
                        Janus.error("  -- Error attaching plugin...", error);
                        bootbox.alert("Error attaching plugin... " + error);
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
                            publishOwnFeed(true);
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
                bootbox.alert(error, function () {
                  window.location.reload();
                });
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
    $('#mute' + room).html(muted ? "Unmute" : "Mute");
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
            bootbox.alert("Error attaching plugin... " + error);
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
                bootbox.alert(msg["error"]);
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
                      bootbox.alert("WebRTC error... " + JSON.stringify(error));
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
            Janus.debug("Remote feed #" + remoteFeed.rfindex);
            if ($('#room' + room+ 'remote' + remoteFeed.rfindex).length === 0) {
              $('#room' + room).append('<div class="video-box" id="room'+room+'remote' +remoteFeed.rfindex+ '">');
              $('#room' + room+ 'remote' + remoteFeed.rfindex).append('<div class="video-title">远程视频<span></span></div><div class="video-content-box"><div class="address-box"><i class="fa fa-map-marker color-white" aria-hidden="true"></i> &nbsp;&nbsp;<span class="color-white"></span></div>');
              $('#room' + room+ 'remote' + remoteFeed.rfindex + ' .video-content-box')
              .append('<video class="rounded centered relative hide" id="remotevideo'
                  + remoteFeed.rfindex + room
                  + '" width="100%" height="100%" autoplay/>')

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
                    $('#curbitrate' + remoteFeed.rfindex).text(bitrate);
                    // Check if the resolution changed too
                    var width = $("#remotevideo" + remoteFeed.rfindex + room).get(
                        0).videoWidth;
                    var height = $("#remotevideo" + remoteFeed.rfindex + room).get(
                        0).videoHeight;
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
          }
        });
  }

}

$(document).ready(function () {
    $.ajax({
        url:BASESERVLET+"/web/infoTask/currentTasks",
        type:"get",
        dataType: "json",
        success:function(data){
            if(data.status) {
                $("#tasks_ul").empty();
                var list = data.list;
                //事件信息加入到app.js中去，多屏交互时可以传递上任务信息

                for(var i=0; i<list.length;i++) {
                    var num = i + 1;
                    $("#tasks_ul").append('<li class="checked-tab">案件'+num+'</li>');
                    initTask(list[i].id);
                }
            }
        }
    });
    //6f532cc1-c9f2-11e7-a112-fbd1cf2ffc5a

});

function initTask(taskId){
    $.ajax({
        url:BASESERVLET+"/web/infoTask/joinVideoRoom",
        type:"post",
        data: {
            taskId : taskId
        },
        dataType: "json",
        success:function(data){
            if(data.status) {
                var obj = data.obj;
                var tab = $("#tab-template").html();
                tab = (tab+"").replace(/{{ROOM-ID}}/g, obj.room);//替换
                tab = (tab+"").replace(/{{ROOM-ID}}/g, obj.room);//替换
                $("#room_box").append(tab);
                console.log(obj);
                joinRoom(obj.server,obj.room,obj.pin,"sjzjjy");
            }
        }
    });
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
