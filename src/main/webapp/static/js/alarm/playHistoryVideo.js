/**
 * 播放历史视频文件监听类
 * @constructor
 */
function PlayHistoryListener() {
}
PlayHistoryListener.prototype = {
    constructor : PlayHistoryListener,
    getVideo : function () {
        return document.getElementById("thevideo");
    },
    onShowVideoData : function (message) {
        videoParam.totalTime = message.videoDuration;
        $(".total-time").text(millisecondToDate(videoParam.totalTime));
        videoParam.allWidth = $(".progress-bar").width();
        autoModifyProgressBar();
    },
    onPause : function () {
        
    },
    onResume : function () {
        
    },
    onDoSeek : function () {

    },
    onPlayEnd : function () {
        setEndStyle();
        videoParam.totalTime = 0;
        videoParam.currentTime = 0;
        if(videoParam.modifyProgressBarSetTimeOut){
            clearTimeout(videoParam.modifyProgressBarSetTimeOut);
        }
    }
}

var videoParam = {
    totalTime : 0,
    currentTime : 0,
    allWidth : 0,
    tag : false,
    modifyProgressBarSetTimeOut : null
}

// 将毫秒时长转换为(mm:ss)格式输出
function millisecondToDate(msd) {
    var time = parseFloat(msd) /1000;
    if (null!= time &&""!= time) {
        if (time > 60) {
            var minutes = parseInt(time /60.0) >= 10 ? parseInt(time /60.0) : "0" + parseInt(time /60.0);
            var seconds = parseInt((parseFloat(time /60.0) - parseInt(time /60.0)) *60) >= 10 ? parseInt((parseFloat(time /60.0) - parseInt(time /60.0)) *60) : "0"+parseInt((parseFloat(time /60.0) - parseInt(time /60.0)) *60);
            time = minutes +":"+ seconds;
        }else {
            time = "00:"+ (parseInt(time) >= 10 ? parseInt(time) : "0"+parseInt(time));
        }
    }else{
        time = "00:00";
    }
    return time;
}

var listener = new PlayHistoryListener();
var pws = new PlayerWebSocket(listener);

//阻止父级带来的点击事件影响
$(".current-btn").on("click", function(even) {
    even.stopPropagation();
});
//当鼠标点击下的记录
$(".current-btn").mousedown(function(e) {
    videoParam.tag = true;
});
//当鼠标放开的时候改变记录
$(document).mouseup(function() {
    videoParam.tag = false;
});
//禁用右键、文本选择功能、复制按键
$(document).bind("contextmenu", function() {
    return false;
});
$(document).bind("selectstart", function() {
    return false;
});
// $(document).keydown(function() {
//     return key(arguments[0])
// });

//鼠标移动的事件
$(".progress-bar").mousemove(function(e) { //鼠标移动
    if(!videoParam.totalTime){
        return;
    }
    if(videoParam.tag) {
        var currentWidth = e.offsetX;
        calcPlayPoint(currentWidth);
        pws.doSeek(videoParam.currentTime);
    }
});

//点击视频进度条进行调整
function click_current_time(obj) {
    if(!videoParam.totalTime){
        return;
    }
    if(!videoParam.tag) {
        var currentWidth = event.offsetX;
        calcPlayPoint(currentWidth);
        pws.doSeek(videoParam.currentTime);
    }
}

// 计算指定的播放位置
function calcPlayPoint(currentWidth) {
    var left = 0;
    if(currentWidth < 12) {
        left = 0;
    } else {
        left = currentWidth - 12;
    }
    videoParam.currentTime = parseInt(currentWidth / videoParam.allWidth * videoParam.totalTime);
    if(videoParam.currentTime > videoParam.totalTime){
        videoParam.currentTime = videoParam.totalTime;
    }
    $(".current-time").text(millisecondToDate(videoParam.currentTime));
    $(".current-bar").css("width", currentWidth);
    $(".current-btn").css("left", left);
}

// 播放时进度条每秒移动一下
function autoModifyProgressBar() {
    videoParam.modifyProgressBarSetTimeOut = setTimeout("autoModifyProgressBar()",1000);
    videoParam.currentTime = videoParam.currentTime + 1000;
    if(videoParam.currentTime > videoParam.totalTime){
        clearTimeout(videoParam.modifyProgressBarSetTimeOut);
        videoParam.currentTime = videoParam.totalTime;
    }
    var currentWidth = videoParam.currentTime / videoParam.totalTime * videoParam.allWidth;
    calcPlayPoint(currentWidth);
}

//播放视频
function playVideo(obj,videoUrl) {
    if($(obj).attr("data-num") == 0) {
        if(pws.player){
            pws.resume();
        }else {
            pws.create(videoUrl);
        }
        setPlayStyle(obj);
    } else {
        clearTimeout(videoParam.modifyProgressBarSetTimeOut);
        pws.pause();
        setPauseStyle(obj);
    }
}

// 设置播放样式
function setPlayStyle(obj) {
    $(obj).css("background-image", "url(/theme/img/jiejingtai/stop.png)");
    $(".history-video-box video").trigger('play');
    $(obj).attr("data-num", "1");
}

// 设置暂停样式
function setPauseStyle(obj) {
    $(obj).css("background-image", "url(/theme/img/jiejingtai/play.png)");
    $(".history-video-box video").trigger('pause');
    $(obj).attr("data-num", "0");
}

// 设置结束样式
function setEndStyle() {
    $(".video-control-btn").css("background-image", "url(/theme/img/jiejingtai/play.png)").attr("data-num", "0");
    $(".current-bar").css("width", 0);
    $(".current-btn").css("left", 0);
    $(".current-time").text("00:00");

}
// 释放资源
function releaseResource() {
    pws.playEnd();
    pws.close();
}

function stop() {
  pws.playEnd();
}