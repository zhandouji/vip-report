APP110.mods["person"].fill = function (bjr) {
    console.warn(bjr);
}
var policeInfo;

function getInfoTask(taskId) {
    //任务Id
    $("input[name='InfoTaskId']").val(taskId);
  var personBox = $("#personBox").attr("display");
  var unitBox = $("#unitBox").attr("display");

    $.ajax({
        url: BASESERVLET + "/web/infoTask/taskDetail",
        type: "get",
        contentType: "application/json",
        dataType: "json",
        data: {taskId: taskId},
        success: function (data) {
            if (null != data.obj) {
                policeInfo = data.obj.task;
                var status = data.obj.status;

                //任务名称
                $('#taskNameId').val(policeInfo.taskName);

                //任务类别
                $("#policeInfoType").val(policeInfo.policeInfoType);

                //任务级别
                $("#policeInfoLevel").val(policeInfo.policeInfoLevel);

                //任务创建单位
                if (data.obj.taskLeaderUnit != null && data.obj.taskLeaderUnit
                    != undefined) {
                    $("#taskLeaderUnit").val(data.obj.taskLeaderUnit);
                } else {
                    $("#taskLeaderUnit").val("暂无");
                }

                //任务描述
                if (policeInfo.policeInfoComment != null
                    && policeInfo.policeInfoComment != undefined) {
                    var str = policeInfo.policeInfoComment;
                    $('#policeInfoComment').val(str);
                } else {
                    $('#policeInfoComment').val("");
                }

                //登录用户不是派遣单位，没有购买系统，完结状态按钮隐藏
                if (status == true && policeInfo.policeInfoStatus != 5) {
                    $("#addTaskPerson").css("display", "block");
                    $("#addTaskUnit").css("display", "block");
                    $(".center-button-box").css("display", "block");
                } else {
                    $("#addTaskPerson").css("display", "none");
                    $("#addTaskUnit").css("display", "none");
                    $(".center-button-box").css("display", "none");
                }
              $("#sendNotice").css("display", "block");
              $("#showNotice").css("display", "block");
                //是否可以上报任务
                var userUnit = $("input[name='groupId']").val();
                var leaderUnit = policeInfo.leaderUnit;
                if (userUnit == leaderUnit) {
                    var reporteUnitList = reportedUnit(taskId);
                    if (reporteUnitList != undefined && reporteUnitList != null
                        && reporteUnitList.length > 0) {
                        $("#taskReported").css("display", "block");
                        $("#unitIds").empty();
                        $("#unitIds").append(
                            '<option value="0" name="">--请选择--</option>');
                        for (var i = 0; i < reporteUnitList.length; i++) {
                            $("#unitIds").append('<option value="'
                                + reporteUnitList[i].unitId
                                + '" name="' + reporteUnitList[i].level + '">'
                                + reporteUnitList[i].unitName + '</option>');
                        }
                    } else {
                        $("#taskReported").css("display", "none");
                    }
                } else {
                    $("#taskReported").css("display", "none");
                }

                //判断地址没有时，使用经纬度获取对应的地址
                if (policeInfo.policeInfoAddress != null
                    && policeInfo.policeInfoAddress != undefined
                    && policeInfo.policeInfoAddress != ""
                    && policeInfo.policeInfoAddress != "undefined") {
                    var str = policeInfo.policeInfoAddress;
                    $('#policeInfoAddress').val(str);
                } else {
                    //高德地图经纬度转为地址
                    var arr = [policeInfo.policeInfoLng, policeInfo.policeInfoLat];
                    geocoder.getAddress(arr, function (status, result) {
                        if (status === 'complete') {
                            $('#policeInfoAddress').val(result.regeocode.formattedAddress);
                        }
                    });
                }
            }
            //获取警员文件
            showPoliceFile(taskId);
            //查看派警人员
            taskPolices(taskId);
            //查看派遣指挥中心
            taskUnits(taskId);
        }
    });
}

APP110.mods["person"].refresh = function (taskId) {
    showPoliceFile(taskId);
}

function showPoliceFile(taskId) {
    $.ajax({
        url: BASESERVLET + "/web/infoTask/detail",
        type: "get",
        contentType: "application/json",
        dataType: "json",
        data: {taskId: taskId},
        success: function (data) {
          $("#polist").empty();
            //人员及上传文件
            var policeList = data.obj.pdList;
            if (typeof(policeList) != "undefined" && null != policeList && policeList.length > 0) {
              $(".sirens-detail-list-box").css("background-size", "0px");
                for (var i = 0; i < policeList.length; i++) {
                    //人员标签
                    $("#polist").append(" <li id='" + policeList[i].policeUserId + "'>" +
                        "<p class='color-dark-blue'>" + policeList[i].policeName + "</p>" +
                        "<p class='color-dark-gray'>" + policeList[i].replaceTime + "</p>" +
                        "<p class='content'></p>" +
                        "<p class='multimedia-title color-green font-blod'><i class='fa fa-caret-right color-green font-size-16px' aria-hidden='true'></i>&nbsp;&nbsp;实时视频</p>" +
                        "<div class='multimedia-box clear liveVideo'></div>" +
                        "<p class='multimedia-title color-green font-blod'><i class='fa fa-caret-right color-green font-size-16px' aria-hidden='true'></i>&nbsp;&nbsp;取证上传</p>" +
                        "<div class='multimedia-box clear policeFile'></div></li>");

                    //人员文件
                    var fileList = policeList[i].policeFile;
                    if (fileList != null && fileList != undefined) {
                        for (var j = 0; j < fileList.length; j++) {
                            var file = fileList[j];
                            if (file.type == 1) {
                                //文件描述
                                $("#" + policeList[i].policeUserId + " .content").append(file.content + "<br/>");
                            } else if (file.type == 14) {
                                //上传视频
                                var src = "/skynet/web/file/" + file.fileId;
                                $("#" + policeList[i].policeUserId + " .policeFile").append("<div class='multimedia-div' onmouseover='flow(this)' onmouseleave='hiding(this)' onclick='bigVideo(this)'><div class='multimedia-video-box'>" +
                                    "<img src='/theme/yjzh-img/other/icon_play.png' />" +
                                    "<video width='210' height='120' controls='controls' hidden='hidden'>" +
                                    "<source src='" + src + "' type='video/mp4'></source>" +
                                    "当前浏览器不支持 video直接播放，点击这里下载视频：" +
                                    "<a href='" + src + "'>下载视频</a></video></div>" +
                                    "<span style='display: none' name='address'>"
                                    + file.latlng + "</span>" +
                                    "<span style='display: none' name='time'>时间：" + file.time + "</span></div>");
                            } else if (file.type == 28) {
                                //上传音频
                                var src = "/skynet/web/file/" + file.fileId;
                                $("#" + policeList[i].policeUserId + " .policeFile").append("<div class='multimedia-div' onmouseover='flow(this)' onmouseleave='hiding(this)'><div class='audio-box' onclick='gifDiv(this)'>" +
                                    "<img src='/theme/yjzh-img/other/icon_voice.png'/>" +
                                    "<p class='color-dark-gray'>" + file.recordTimeLength + "″</p>" +
                                    "<audio hidden='hidden' controls='ontrols' onended='audioEnd(this)'>" +
                                    "<source src='" + src + "' type='audio/mpeg'> 您的浏览器不支持音频</audio></div>" +
                                    "<span style='display: none' name='address'>"
                                    + file.latlng + "</span>" +
                                    "<span style='display: none' name='time'>时间：" + file.time + "</span></div>");
                            } else if (file.type == 15) {
                                //上传文件
                                var src = "/skynet/web/file/" + file.fileId;
                                $("#" + policeList[i].policeUserId + " .policeFile").append("<div class='multimedia-div' onmouseover='flow(this)' onmouseleave='hiding(this)'>" +
                                    "<img src='" + src + "' name='photo' onclick='bigImg(this)'/>" +
                                    "<span style='display: none' name='address'>"
                                    + file.latlng + "</span>" +
                                    "<span style='display: none' name='time'>时间：" + file.time + "</span></div>");
                            }
                        }
                    }

                    //警员上传的实时视频
                    var liveFileList = policeList[i].videoBeans;
                    if (typeof(liveFileList) != "undefined" && null != liveFileList && liveFileList.length > 0) {
                        for (var a = 0; a < liveFileList.length; a++) {
                          var txt = '<div class="multimedia-div_f" onmouseover="flow(this)" onmouseleave="hiding(this)">'
                              +
                                '<div class="live-stream-video-box" style="background-image:url(\'/theme/yjzh-img/other/icon_play.png\');background-position:center; background-repeat:no-repeat" onclick="showPlayWindow(\''
                                + liveFileList[a].videoFile + '\')"></div>' +
                              '<span style="display: none" name="address" class="video_class">'
                              + liveFileList[a].gpsAddress + '</span>' +
                              '<span style="display: none" name="time">时间：'
                              + liveFileList[a].startTime + '</span>'
                              + '</div>';
                            $("#" + policeList[i].policeUserId + " .liveVideo").append(txt);
                        }
                    }
                }
            } else {
              $(".sirens-detail-list-box").css("background-size", "269px");
            }
        }
    });
}

function upl() {
    if($("#taskNameId").val() == ""){
      layer.alert('请输入任务名称');
        return;
    }
    if ($('#policeInfoAddress').val() == "") {
      layer.alert('请输入事发地址');
        return;
    }
    if ($('#policeInfoType').val() == 0) {
      layer.alert('请输入任务类别');
        return;
    }
    if ($("#policeInfoLevel").val() == 0) {
      layer.alert('请输入任务级别');
        return;
    }
    if($("#policeInfoComment").val() == 0){
      layer.alert('请输入任务指令');
        return;
    }
    if (null != policeInfo && policeInfo != undefined) {
        var policeInfoTask={
            id:policeInfo.id,
            areaCode:policeInfo.areaCode,
            taskName:$("#taskNameId").val(),
            policeInfoLevel: parseInt($("#policeInfoLevel").val()),
            policeInfoType:parseInt($('#policeInfoType').val()),
            policeInfoComment:$('#policeInfoComment').val(),
            policeInfoAddress:$("#policeInfoAddress").val(),
        }
        policeInfoTask = JSON.stringify(policeInfoTask);
        $.ajax({
            url: BASESERVLET + "/web/infoTask/update",
            type: "post",
            contentType: "application/json",
            data: policeInfoTask,
            success: function (data) {
                if (data.status == true) {
                    layer.msg('保存成功', {
                        icon: 1,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    }, function(){
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index);
                    });
                    getInfoTask(data.obj.id);
                }else {
                    layer.msg(data.error, {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
            }
        });
    } else {
      layer.msg('清新新建任务', {
        icon: 2,
        time: 2000 //2秒关闭（如果不配置，默认是3秒）
      });
    }
}


function endInfo() {
    var taskId = $("input[name='InfoTaskId']").val();
    if($("#taskNameId").val() == ""){
      layer.alert('请输入任务名称');
        return;
    }
    if ($('#policeInfoAddress').val() == "") {
      layer.alert('请输入事发地址');
        return;
    }
    if ($('#policeInfoType').val() == 0) {
      layer.alert('请输入任务类别');
        return;
    }
    if ($("#policeInfoLevel").val() == 0) {
      layer.alert('请输入任务级别');
        return;
    }
    if($("#policeInfoComment").val() == ""){
      layer.alert('请输入任务指令');
        return;
    }

    var policeInfoTask={
        id:policeInfo.id,
        areaCode:policeInfo.areaCode,
        taskName:$("#taskNameId").val(),
        policeInfoLevel: parseInt($("#policeInfoLevel").val()),
        policeInfoType:parseInt($('#policeInfoType').val()),
        policeInfoComment:$('#policeInfoComment').val(),
        policeInfoAddress:$("#policeInfoAddress").val(),
    }
    policeInfoTask = JSON.stringify(policeInfoTask);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/update",
        type: "post",
        contentType: "application/json",
        data: policeInfoTask,
        success: function (data) {
            if (data.status == true) {
                $.ajax({
                    url: BASESERVLET + "/web/endInfo/end",
                    type: "get",
                    contentType: "application/json",
                    data: {taskId: taskId},
                    success: function (data) {
                        if(data.status == true){
                            layer.msg('已完结', {
                                icon: 1,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            }, function(){
                                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                parent.parent.layer.close(index);
                            });
                            APP110.callModFun("video", "currentTasks");
                        } else {
                            layer.msg(data.error, {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                });
            }else {
                layer.msg(data.error, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
            }
        }
    });
}


