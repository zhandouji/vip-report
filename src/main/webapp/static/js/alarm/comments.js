//公用查询回复内容方法
function queryCommentStr(){
	var caseId = $("input[name='parent']").val();
	$.ajax({
		url:BASESERVLET+"/api/queryCaseComment/"+caseId,
		type:"get",
		dataType: "json",
		success:function(data){
			if(data && data.list){
				$.each(data.list,function(i,item){
					$(".pl_box").css('display','block');
					$("#info").append(item.commentStr);
				})
			}
		}
	});
}
//回复按钮隐藏显示事件
function clicks(b){
	$(".hf_box").css('display',b);
	if(b == 'none'){
		$("textarea").val('');
	}
}
$(function(){
	queryCommentStr();
})
$(function(){
	$(".tjbtn").click(function(){
		var params = $("form").serialize();
		if($("textarea").val()==''){
			alert("请输入需要回复的内容");
			return false;
		}
		$.ajax({
			url:BASESERVLET+"/api/addCaseComment/",
			type:"post",
			dataType: "json",
			data:params,
			success:function(data){
//				alert(data.error);
				clicks('none');
				queryCommentStr();
			}
		});
	})
})
//图片放大
$(function () {
	var console = window.console || { log: function () {} };
	var handler = function (e) {
        console.log(e.type);
      };
	var options = {
			url: 'data-original',
	        build: handler,
	        built: handler,
	        show: handler,
	        shown: handler,
	        hide: handler,
	        hidden: handler,
			button:true,//在图片查看器的右上角显示关闭按钮。
			navbar:false,//显示图片导航条
			title:false,//显示图片标题。标题来自图片的alt属性或从URL解析的图片名称。
			toolbar:true,//显示工具栏。
			tooltop:true,//在放大缩小图片的时候显示图片的百分比比例。
			movable:true,//图片是否可以移动。
			zoomable:true,//图片是否可以放大缩小。
			rotatable:true,//图片是否可以旋转。
			scalable :true//图片是否可以翻转
	}
	$(".view").viewer(options);
})

/*
var server = null;
if(window.location.protocol === 'http:')
	server = "http://110.249.218.82:8088/janus";
else
	server = "https://110.249.218.82:8088/janus";

var recordplay = null;
var playing = false;
var spinner = null;
var janus = null;
var selectedRecording = null;
var selectedRecordingInfo = null;
var recordingId = null;
var started = false;
var bandwidth = 1024 * 1024;
//查看报警视频
$(document).ready(function() {
	Janus.init({
	  debug: "all", callback: function() {
			$('#play').click(function(){
				
				selectedRecording = $('#play').val();
				
				if(started)
					return;
				started = true;
				if(!Janus.isWebrtcSupported()) {
					bootbox.alert("No WebRTC support... ");
					return;
				}
				janus = new Janus({
					server: server,
					success:function(){
						janus.attach(
						{
							plugin: "janus.plugin.recordplay",
							success: function(pluginHandle) {
								recordplay = pluginHandle;
								Janus.log("Plugin attached! (" + recordplay.getPlugin() + ", id=" + recordplay.getId() + ")");
								$('#video').removeClass('hide').show();
								startPlayout();
							},
							onmessage: function(msg, jsep){
								var result = msg["result"];
								if(result !== null && result !== undefined) {
									if(result["status"] !== undefined && result["status"] !== null){
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
										}else if(event === 'playing') {
											Janus.log("Playout has started!");
										}else if(event === 'stopped'){
											Janus.log("Session has stopped!");
											var id = result["id"];
											if(recordingId !== null && recordingId !== undefined) {
												if(recordingId !== id) {
													Janus.warn("Not a stop to our recording?");
													return;
												}
												bootbox.alert("Recording completed! Check the list of recordings to replay it.");
											}
											if(selectedRecording !== null && selectedRecording !== undefined) {
												if(selectedRecording !== id) {
													Janus.warn("Not a stop to our playout?");
													return;
												}
	//											$('#play').click(startPlayout);
												startPlayout();
											}
											
										} 
									}
								}else {
									// FIXME Error?
									var error = msg["error"];
									bootbox.alert(error);
									// FIXME Reset status
									$('#videobox').empty();
									$('#video').hide();
									startPlayout();
									recordplay.hangup();
								}
							},
							onlocalstream: function(stream) {
							},
							onremotestream: function(stream) {
								alert("进来了"+stream);
								if(playing === false){
									return;
								}
								Janus.debug(" ::: Got a remote stream :::");
								Janus.debug(JSON.stringify(stream));
								alert(JSON.stringify(stream));
	//							$('#videotitle').html(selectedRecordingInfo);
								$('#stop').click(stop);
								$('#video').removeClass('hide').show();
								if($('#thevideo').length === 0) {
									$('#videobox').append('<video class="rounded centered hide" id="thevideo" width=320 height=240 autoplay/>');
									// No remote video yet
									$('#videobox').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
									if(spinner == null) {
										var target = document.getElementById('videobox');
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
								attachMediaStream($('#thevideo').get(0), stream);
							},
							oncleanup: function() {
								Janus.log(" ::: Got a cleanup notification :::");
								// FIXME Reset status
								$('#waitingvideo').remove();
								if(spinner !== null && spinner !== undefined)
									spinner.stop();
								spinner = null;
								$('#videobox').empty();
								$('#video').hide();
	//							$('#play').onclick(startPlayout);
								startPlayout();
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
	//					window.location.reload();
	//					showMain(BASESERVLET+"/web/recordPlay");
					}
				});
			});
		}
	});
});
function startPlayout() {
	if(playing)
		return;
	playing = true;
	if(selectedRecording === undefined || selectedRecording === null) {
		playing = false;
		return;
	}
	var play = { "request": "play", "id": parseInt(selectedRecording) };
	recordplay.send({"message": play});
}
function stop() {
	// Stop a recording/playout
	$('#stop').unbind('click');
	var stop = { "request": "stop" };
	recordplay.send({"message": stop});
	recordplay.hangup();
//	$('#video').hide();
}
*/