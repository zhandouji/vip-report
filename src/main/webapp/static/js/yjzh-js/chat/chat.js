var chatSubscribe;
var currentRoomId;
//判断是否连接
var isConnect;

APP110.mods["chat"].choice = function (taskId, roomId) {
    if (null != taskId && taskId != undefined) {
        getInfoTask(taskId);
    }
    currentRoomId = roomId;
    if (roomId == null) {
        resetLog();
    } else {
        initChat(roomId);
    }
}

/**
 * 重置
 */

function resetLog() {
    //停止订阅聊天
    if (!skynetSocket) {
        console.log("重置聊天订阅时，发现没有连接，不做后续处理");
        return;
    }
    if (!skynetSocket.connected) {
        console.log("重置聊天订阅时，发现客户端消息服务尚未连接，不做后续处理");
        return;
    }
    chatSubscribe.unsubscribe();
    chatSubscribe = null;
    console.log("停止订阅聊天信息...");

    //清空聊天框
    $("#command-chat-cont").empty();

    //重置图片状态
    APP110.mods["chat"].hasImg = false;
    roomId = null;
};

/**
 * 初始化聊天监听
 * @param roomId
 */
function initChat(roomId) {
    var headers = {
        'activemq.retroactive': 'true'
    };
    var destination = "/topic/chat.message." + roomId;
    if (chatSubscribe != null) {
        resetLog();
    }
    /**获取聊天室内的历史记录*/
    fillLog(roomId);
    //查询参与者
    chatSubscribe = skynetSocket.subscribe("/app/chat.participants." + roomId, function (m) {
        console.log("订阅报警聊天室参与者得到结果<<<<<<<：o%", m);
        var body;
        try {
            body = JSON.parse(m.body);
        } catch (e) {
            layer.alert("解析报警聊天室参与者消息异常：" + e.message + "\n\n" + m.body);
            console.error("解析报警聊天室参与者消息异常：s%", m.body);
            return;
        }
        if (!body) {
            return;
        }
        for (var i = 0; i < body.length; i++) {
            var u = body[i];
            APP110.chatMap[u.userId] = u.nickname;
        }
    }, headers);

    //订阅消息
    chatSubscribe = skynetSocket.subscribe(destination, function (m) {
        console.log("订阅报警文字聊天得到结果<<<<<<<：o%", m);
        var body;
        try {
            body = JSON.parse(m.body);
        } catch (e) {
            layer.alert("解析报警推送消息异常：" + e.message + "\n\n" + m.body);
            console.error("解析报警推送消息异常：s%", m.body);
            return;
        }
        var type,//消息类型
            isTip = false,//是否提示新消息
            msg,//消息内容
            nickname,//昵称
            from,//自定义消息标识：从哪里发出如：jjy(接警员),dsf(第三方）,空表示报警人
            time = new Date(Number(m.headers.timestamp));//时间戳
        time = time.format(time.isToday() ? "hh:mm:ss" : "yyyy-MM-dd hh:mm:ss.S");
        if (body.event == "CHAT_LOGIN") {
            APP110.chatMap[body.from] = body.body.from;
            type = 0;//通知消息
            if (body.from == APP110.currentBjr.userId) {
                var cb = APP110.currentBjr;
                nickname = cb.name ? cb.name : (cb.nickName ? cb.nickName : cb.userName);
                isTip = true;//报警人消息需要提示
                $("#show-voice-box").show();//报警人加入后视频背景置黑，如果用户退出视频不以聊天为准，可以取消此处操作
                $(".video-box").css("background", "#000000 none");
            } else {
                nickname = body.body.nickName;
                APP110.chatMap[body.from] = nickname;
                if (body.from != $("#currentLoginUserId").val()) {
                    isTip = true;//非当前登录人的第三方需要提示
                }
            }
            msg = nickname + " 加入";
            from = "";//自定义消息标识，在系统发出的登录退出消息中不存在
            nickname = nickname ? nickname : "";
            showChatMsg(type, from, nickname, time, msg, isTip);
        } else if (body.event == "CHAT_LOGOUT") {
            type = 0;//通知消息
            nickname = APP110.chatMap[body.from];//退出事件中无昵称body.body.nickName;
            if (body.from == APP110.currentBjr.userId) {
                var cb = APP110.currentBjr;
                nickname = cb.name ? cb.name : (cb.nickName ? cb.nickName : cb.userName);
            } else {
                if (body.body) {
                    if (body.body.hasOwnProperty("nickName")) {
                        nickname = body.body.nickName;
                    } else {
                        return;//避免显示undefined退出
                    }
                }
            }
            isTip = true;
            if (nickname) {
                msg = nickname + " 退出";
            } else {
                return;
            }
            from = "";//自定义消息标识，在系统发出的登录退出消息中不存在
            delete APP110.chatMap[body.from];
            nickname = nickname ? nickname : "";
            showChatMsg(type, from, nickname, time, msg, isTip);
        } else if (body.event == "CHAT_MESSAGE") {
            APP110.chatMap[body.from] ? "" : APP110.chatMap[body.from] = body.body.from;
            type = 1;//聊天消息
            nickname = body.body.from;
            msg = body.body.text;//
            from = m.headers.from1;//自定义消息头标识，标识来源：接警员:jjy，第三方：dsf
            if (body.from != $("#currentLoginUserId").val()) {
                /**非当前登录人的需要提示*/
                isTip = true;
            } else {
                sendFlag = true;
                $("#chat_swap_img").remove();
            }
        }
        // if ($("#currentLoginUserId").val() == body.from) {
        //     nickname = "您";
        // }
        // if (nickname != '您'|| body.event == "CHAT_MESSAGE") {
        //     nickname = nickname ? nickname : "";
        //     showChatMsg(type, from, nickname, time, msg, isTip);
        // }
    }, headers);
}

/**发送是否成功*/
var sendFlag = true;
/**
 * 可能是发送窗口发送时的点击事件，也可能是接警完成时的提示信息
 * @param infoText
 * @param msgType
 * @param roomId
 * @param event
 */
function sendMsg(infoText, msgType, roomId, event) {
    console.log(infoText);
    console.log("*******************");
    if (roomId == null) {
        layer.msg("未加入任何房间");
        return;
    }
    if (!sendFlag) {
        layer.msg('正在努力重连中，请稍后', {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
        return;
    }
    var username = $("#currentLoginUserNickname").val();
    var uid = $("#currentLoginUserId").val();
    var destination = "/topic/chat.message." + roomId;
    var text = $("#command-chat-text").val();
    text = text.replace(/[\r\n]/g, "")//去掉回车换行
    if ($.trim(text) == '') {
        if ($.trim(infoText) == '' || !(infoText.length < 100)) {
            //发送窗口发送
            layer.msg("不能发送空消息")
            $("#command-chat-text").val('');
            return;
        }
    }
    //记录模板输入情况
    if (msgType == 1 && text.indexOf("[") == -1) {
        $.ajax({
            url: BASESERVLET + "/web/chatTemplatePersonal/save",
            type: "post",
            data: {
                content: text
            },
            dataType: "json",
            success: function (data) {

            }
        })
    }
    /**时间戳*/
    var time = new Date();
    time = time.format(time.isToday() ? "hh:mm:ss" : "yyyy-MM-dd hh:mm:ss.S");
    html = '<div class="right-chatting-box"><span class="right-head-img">' +
        '<img src="/theme/yjzh-img/other/jjr.jpg"></span>' + '<div class="right-name">' + time + ':指挥中心:张三' + '</div><br>' +
        '<div class="speech right" ng-class="speech left"><img id="chat_swap_img" class="send-again" onclick="sendMsg(\'' + infoText + '\',\'' + msgType + '\',\'' + roomId + '\',\'' + event + '\')" src="/theme/yjzh-img/other/again.png">' + infoText + '</div></div>';
    $("#command-chat-cont").append(html);
    sendFlag = false;
    text = infoText.length < 100 ? infoText : text;
    if (!event) {
        event = "CHAT_MESSAGE";
    }
    var sender = skynetSocket.send(destination, {from1: "jjy"},
        JSON.stringify({
            from: uid, event: event,
            body: {sender: uid, text: text, from: username, time: new Date().format("hh:mm:ss")}
        }));   //消息格式：{from:"", event:"", body:{message:"实际要发送的消息", nickname:"消息发送人的昵称"}}

    console.log("发送消息的返回：o%", sender);
    $("#command-chat-text").val("");//清空输入框
}


/**
 * 显示聊天信息
 * @param type
 * @param from
 * @param nickname
 * @param time
 * @param msg
 * @param isTip
 */
function showChatMsg(type, from, nickname, time, msg, isTip) {
    console.log("from"+from+"nickname"+nickname+"time"+time+"msg"+msg+"isTip"+isTip+"***********showChatMsg**************");
    var html, imgAdded = false;
    if (type == 0) {
        //通知消息：如xxx加入聊天，xxx退出聊天
        //html = '<i class="chat-tip">'+msg+' '+time+'</i>';
        html = '<div class="center-box"><p>' + time + '</p><span>' + msg + '</span> </div>';
    }
    else if(type == 4) {
        html = '<div class="center-box"><span>' + msg + '</span> </div>';
    }
    else if (type == 1) {
        //聊天消息
        if (msg.indexOf("[address]") == 0 && msg.lastIndexOf("[/address]")) {
            msg = msg.replace("[address]", "").replace("[/address]", "");
            $('#a_c_detailedaddress').val(msg);
            return;
        }

        if (msg.indexOf("[latlng]") == 0 && msg.lastIndexOf("[/latlng]")) {
            msg = msg.replace("[latlng]", "").replace("[/latlng]", "");
            var latlng = msg.split(",");
            if (latlng && latlng.length == 2) {
                $('#a_c_latitude').val(latlng[0]);
                $('#a_c_longitude').val(latlng[1]);
            }
            return;
        }

        //判断消息类型
        if (msg && msg.indexOf("[img]") == 0) {
            msg = msg.replace("[img]", "").replace("[/img]", "");
            msg = '<img class="chat_img" width="80" src="' + BASESERVLET + '/web/file/' + msg + '"/>';
            imgAdded = true;
        }

        if (msg.indexOf("[caseaddress]") == 0 && msg.lastIndexOf("[/caseaddress]")) {

            var start = msg.indexOf("[caselat]");
            var end = msg.indexOf("[/caseaddress]")
            var latlon = msg.substring(start + 9, end);
            var str = new Array();
            str = latlon.split(",")
            var lat = str[0];
            var lon = str[1];
            msg = msg.substring(msg.indexOf("[caseaddress]") + 13, msg.indexOf("[caselat]"));
        }
        if (nickname != '您') {
            html = '<div class="left-chatting-box"><span class="left-head-img">' +
                '<img src="/theme/yjzh-img/other/bjr.jpg"></span>' + '<div class="left-name">'+ time+':'+nickname + '</div><br>' +
                '<div class="speech left" ng-class="speech left">' + msg + '</div></div>';
        } else {
            html = '<div class="right-chatting-box"><span class="right-head-img">' +
                '<img src="/theme/yjzh-img/other/jjr.jpg"></span>' + '<div class="right-name">' + time + ':指挥中心' + '</div><br>' +
                '<div class="speech right" ng-class="speech left">' + msg + '</div></div>';
        }
    }
    $("#command-chat-cont").append(html);

    $("#command-chat-cont")[0].scrollTop = $("#command-chat-cont")[0].scrollHeight;

    if (imgAdded) {
        console.warn("imgadded...");
        if (APP110.mods["chat"].hasImg) {
            $('#command-chat-cont').viewer("update");//动态添加图片，需要更新展示
            return;
        } else {
            APP110.mods["chat"].hasImg = true;
            //添加图片展示
            $('#command-chat-cont').viewer({
                navbar: false   //不显示导航小图
            });
        }
    }
    if (isTip) {
        if ($("#chat-wind").is(":hidden")) {
            //提示聊天信息
            layer.tips(nickname + "：" + msg, '#chat', {
                tips: [1, '#3595CC'],
                time: 5000
            });
            $("#chat").addClass("chat-red");
        } else {
            $("#chat").removeClass("chat-red");
        }
    }
}

$.ajax({
    url: BASESERVLET + "/web/chatTemplatePersonal/list",
    type: "get",
    dataType: "json",
    success: function (data) {
        if (data.status) {
            var html = '';
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var msg = list[i];
                html += '<div class="phrase">' + msg + '</div>';
                console.log(msg);
            }
            $('#command_chat_templates').html(html);
            $('.phrase').click(function () {
                var template = $(this).text();
                $('.phrase-check').removeClass('phrase-check');
                $(this).addClass('phrase-check');
                $('#command-chat-text').val(template);
            })
        }
    }
});


//socket连接失败后的初始注册
if (skynetSocket != null) {
  skynetSocket.afterDisConnect = function (error) {
    if(isConnect){
      var msg = "消息连接异常";
      showChatMsg(4, null, null, null, msg, null);
    }
    isConnect=false;
  }
}

/**获取聊天室内的历史记录*/
function fillLog(roomId) {
    $.ajax({
        url: BASESERVLET + "/web/infoTask/taskMsg",
        type: "get",
        data: {
            mediaId : roomId
        },
        dataType: "json",
        success: function (data) {
            if(data.status) {
                var list = data.list;
                for(var i=0;i<list.length;i++) {
                    var entity = list[i];
                    showChatMsg(1,entity.sender,entity.name,entity.time,entity.msg,false);
                }
            }
        }
    });

}

/**图片、视频的q的推送*/
function receiveTopic() {
    var headers = {
        'activemq.retroactive': 'true'
    };
    var reSubscribe = skynetSocket.subscribe("/topic/POLICE_TASK", function (m) {
        console.log("上传文件<<<<<<<：o%", m);
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
        if (localStorage.getItem('currentTaskId') == task.id) {
            /**显示的详情页右栏文实时视频或者文件上传的信息*/
            showPoliceFile(task.id);
        }
    }, headers);
}