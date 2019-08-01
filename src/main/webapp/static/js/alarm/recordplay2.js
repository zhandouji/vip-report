/**

 * 

 */




/*var server = null;

if(window.location.protocol === 'http:')

	server = "http://110.249.218.82:8088/janus";

else

	server = "https://110.249.218.82:8088/janus";

*/
var janus = null;
var recordplay = null;
var started = false;
var spinner = null;
var bandwidth = 1024 * 1024;

var myname = null;
var recording = false;
var playing = false;
var recordingId = null;
var selectedRecording = null;
var selectedRecordingInfo = null;


function goShowVideo(server,rec_dir,arc_file,vrc_file,stoken) {
	console.log(server+"-->"+rec_dir+"***"+arc_file+"--"+vrc_file+"///"+stoken);
	$('#playdiv').hide();
	$('#showdiv').show();
	
	Janus.init({debug: "all", callback: function() {
			janus = new Janus(
				{
					server: server,
					success: function() {
						janus.attach(
							{
								plugin: "janus.plugin.recordplay",
								success: function(pluginHandle) {
									$('#details').remove();
									recordplay = pluginHandle;
									Janus.log("Plugin attached! (" + recordplay.getPlugin() + ", id=" + recordplay.getId() + ")");
									// Prepare the name prompt


									$('#recordplay').removeClass('hide').show();
									$('#start').removeAttr('disabled').html("Stop")
										.click(function() {
											$(this).attr('disabled', true);
											janus.destroy();
										});

									startPlayout(rec_dir,arc_file,vrc_file,stoken);
//									updateRecsList();


								},
								error: function(error) {
									Janus.error("  -- Error attaching plugin...", error);
									bootbox.alert("  -- Error attaching plugin... " + error);
								},
								consentDialog: function(on) {
									Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
									if(on) {
										$.blockUI({ 
											message: '<div><img src="up_arrow.png"/></div>',
											css: {
												border: 'none',
												padding: '15px',
												backgroundColor: 'transparent',
												color: '#aaa',
												top: '10px',
												left: (navigator.mozGetUserMedia ? '-100px' : '300px')
											} });
									} else {
										$.unblockUI();
									}
								},
								webrtcState: function(on) {
									Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                  if($("#videobox").parent().unblock)
                    $("#videobox").parent().unblock();
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message :::");
									Janus.debug(JSON.stringify(msg));
									var result = msg["result"];
									if(result !== null && result !== undefined) {
										if(result["status"] !== undefined && result["status"] !== null) {
											var event = result["status"];
											if(event === 'preparing') {
												Janus.log("Preparing the recording playout");
												recordplay.createAnswer(
													{
														jsep: jsep,
														media: { audioSend: false, videoSend: false },	// We want recvonly audio/video

														success: function(jsep) {
															Janus.debug("Got SDP!");
															Janus.debug(jsep);
															var body = { "request": "start" };
															recordplay.send({"message": body, "jsep": jsep});
														},
														error: function(error) {
															Janus.error("WebRTC error:", error);
															bootbox.alert("WebRTC error... " + JSON.stringify(error));
														}
													});
											} else if(event === 'recording') {
												if(jsep !== null && jsep !== undefined)
													recordplay.handleRemoteJsep({jsep: jsep});
												var id = result["id"];
												if(id !== null && id !== undefined) {
													Janus.log("The ID of the current recording is " + id);
													recordingId = id;
												}
											} else if(event === 'slow_link') {
												var uplink = result["uplink"];
												if(uplink !== 0) {
													bandwidth = parseInt(bandwidth / 1.5);
													recordplay.send({
														'message': {
															'request': 'configure',
															'video-bitrate-max': bandwidth, // Reduce the bitrate

															'video-keyframe-interval': 15000 // Keep the 15 seconds key frame interval

														}
													});
												}
											} else if(event === 'playing') {
												Janus.log("Playout has started!");
											} else if(event === 'stopped') {
												Janus.log("Session has stopped!");
												var id = result["id"];
												if(recordingId !== null && recordingId !== undefined) {
													if(recordingId !== id) {
														Janus.warn("Not a stop to our recording?");
														return;
													}
													bootbox.alert("Recording completed! Check the list of recordings to replay it.");
												}
												$('#videoremote1').empty();
												$('#video').hide();
												recordingId = null;
												recording = false;
												playing = false;
												recordplay.hangup();
												$('#record').removeAttr('disabled').click(startRecording);
												$('#play').removeAttr('disabled').click(startPlayout);
												$('#list').removeAttr('disabled').click(updateRecsList);
												$('#recset').removeAttr('disabled');
												$('#recslist').removeAttr('disabled');
												//updateRecsList();
											}
										}
									} else {
										var error = msg["error"];
										bootbox.alert(error);
										$('#videoremote1').empty();
										$('#video').hide();
										recording = false;
										playing = false;
										recordplay.hangup();
										$('#record').removeAttr('disabled').click(startRecording);
										$('#play').removeAttr('disabled').click(startPlayout);
										$('#list').removeAttr('disabled').click(updateRecsList);
										$('#recset').removeAttr('disabled');
										$('#recslist').removeAttr('disabled');
										//updateRecsList();
									}
								},
								onlocalstream: function(stream) {
									if(playing === true)
										return;
									Janus.debug(" ::: Got a local stream :::");
									Janus.debug(JSON.stringify(stream));
									$('#videotitle').html("Recording...");
									$('#stop').unbind('click').click(stop);
									$('#video').removeClass('hide').show();
									if($('#thevideo').length === 0)
										$('#videoremote1').append('<video class="rounded centered" id="thevideo" width=100% height=100% autoplay muted="muted"/>');
                  Janus.attachMediaStream($('#thevideo').get(0), stream);
									$("#thevideo").get(0).muted = "muted";
									$("#videoremote1").parent().block({
										message: '<b>Publishing...</b>',
										css: {
											border: 'none',
											backgroundColor: 'transparent',
											color: 'white'
										}
									});
								},
								onremotestream: function(stream) {
									if(playing === false)
										return;
									Janus.debug(" ::: Got a remote stream :::");
									Janus.debug(JSON.stringify(stream));
									$('#videotitle').html(selectedRecordingInfo);
									$('#stop').unbind('click').click(stop);
									$('#video').removeClass('hide').show();
									if($('#thevideo').length === 0) {
										
										$('#videoremote1').append('<video class="rounded centered hide" id="thevideo" width=100% height=100% autoplay/>');
										// No remote video yet

										$('#videoremote1').append('<video class="rounded centered" id="waitingvideo" width=100% height=100% />');
										if(spinner == null) {
											var target = document.getElementById('videoremote1');
											spinner = new Spinner({top:100}).spin(target);
										} else {
											spinner.spin();
										}
									}
									// Show the video, hide the spinner and show the resolution when we get a playing event


									$("#thevideo").bind("playing", function () {
										$('#waitingvideo').remove();
										$('#thevideo').removeClass('hide');
										if(spinner !== null && spinner !== undefined)
											spinner.stop();
										spinner = null;
									});
                  Janus.attachMediaStream($('#thevideo').get(0), stream);
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification :::");
									// FIXME Reset status


									$('#waitingvideo').remove();
									if(spinner !== null && spinner !== undefined)
										spinner.stop();
									spinner = null;
									$('#videoremote1').empty();
									//$("#videoremote1").parent().unblock();
									$('#video').hide();
									recording = false;
									playing = false;
									$('#record').removeAttr('disabled').click(startRecording);
									$('#play').removeAttr('disabled').click(startPlayout);
									$('#list').removeAttr('disabled').click(updateRecsList);
									$('#recset').removeAttr('disabled');
									$('#recslist').removeAttr('disabled');
									//updateRecsList();
								}
							});
					},
					error: function(error) {
						Janus.error(error);
						bootbox.alert(error, function() {
							window.location.reload();
						});
					},
					destroyed: function() {
						window.location.reload();
					}
				});
		
	}});
};


function checkEnter(field, event) {
	var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if(theCode == 13) {
		if(field.id == 'name')
			insertName();
		return false;
	} else {
		return true;
	}
}

function updateRecsList() {
	$('#list').unbind('click');
	$('#update-list').addClass('fa-spin');
	var body = { "request": "list" };
	Janus.debug("Sending message (" + JSON.stringify(body) + ")");
	recordplay.send({"message": body, success: function(result) {
		setTimeout(function() {
			$('#list').click(updateRecsList);
			$('#update-list').removeClass('fa-spin');
		}, 500);
		if(result === null || result === undefined) {
			bootbox.alert("Got no response to our query for available recordings");
			return;
		}
		if(result["list"] !== undefined && result["list"] !== null) {
			$('#recslist').empty();
			$('#record').removeAttr('disabled').click(startRecording);
			$('#list').removeAttr('disabled').click(updateRecsList);
			var list = result["list"];
			list.sort(function(a, b) {return (a["date"] < b["date"]) ? 1 : ((b["date"] < a["date"]) ? -1 : 0);} );
			Janus.debug("Got a list of available recordings:");
			Janus.debug(list);
			for(var mp in list) {
				Janus.debug("  >> [" + list[mp]["id"] + "] " + list[mp]["name"] + " (" + list[mp]["date"] + ")");
				$('#recslist').append("<li><a href='#' id='" + list[mp]["id"] + "'>" + list[mp]["name"] + " [" + list[mp]["date"] + "]" + "</a></li>");
			}
			$('#recslist a').unbind('click').click(function() {
				selectedRecording = $(this).attr("id");
				selectedRecordingInfo = $(this).text();
				$('#recset').html($(this).html()).parent().removeClass('open');
				$('#play').removeAttr('disabled').click(startPlayout);
				return false;
			});
		}
	}});
}

function startRecording() {
	if(recording)
		return;
	// Start a recording


	recording = true;
	playing = false;
	bootbox.prompt("Insert a name for the recording (e.g., John Smith says hello)", function(result) {
		if(result === null || result === undefined) {
			recording = false;
			return;
		}
		myname = result;
		$('#record').unbind('click').attr('disabled', true);
		$('#play').unbind('click').attr('disabled', true);
		$('#list').unbind('click').attr('disabled', true);
		$('#recset').attr('disabled', true);
		$('#recslist').attr('disabled', true);

		// bitrate and keyframe interval can be set at any time: 


		// before, after, during recording


		recordplay.send({
			'message': {
				'request': 'configure',
				'video-bitrate-max': bandwidth, // a quarter megabit

				'video-keyframe-interval': 15000 // 15 seconds

			}
		});
		
		recordplay.createOffer(
			{
				// By default, it's sendrecv for audio and video...


				success: function(jsep) {
					Janus.debug("Got SDP!");
					Janus.debug(jsep);
					var body = { "request": "record", "name": myname };
					recordplay.send({"message": body, "jsep": jsep});
				},
				error: function(error) {
					Janus.error("WebRTC error...", error);
					bootbox.alert("WebRTC error... " + error);
					recordplay.hangup();
				}
			});
	});
}

function startPlayout(rec_dir,arc_file,vrc_file,stoken) {
	Janus.log("   playing"+playing);
	if(playing)
		return;
	// Start a playout


	recording = false;
	playing = true;
	Janus.log("   recording"+recording+"  playing"+playing);
	/*if(selectedRecording === undefined || selectedRecording === null) {

		playing = false;

		return;

	}*/
	Janus.log("   recording"+recording+"  playing"+playing);
	$('#record').unbind('click').attr('disabled', true);
	$('#play').unbind('click').attr('disabled', true);
	$('#list').unbind('click').attr('disabled', true);
	$('#recset').attr('disabled', true);
	$('#recslist').attr('disabled', true);
	var play = { "request": "play", "rc_dir": rec_dir, "arc_file":arc_file, "vrc_file":vrc_file ,"stoken":stoken};
	Janus.log(rec_dir+"   arc_file"+arc_file+"  vrc_file"+vrc_file);
	recordplay.send({"message": play});
}

function stop1() {
	// Stop a recording/playout
	$('#playdiv').show();
	$('#showdiv').hide();
	$('#stop').unbind('click');
	var stop = { "request": "stop" };
	recordplay.send({"message": stop});
	recordplay.hangup();
	
}
