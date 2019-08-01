var unitIds = "";
var userIds = "";
$(function () {
  //获取地图上新建任务的信息：位置，机构，警员
    var task = parent.fill();
  //选中的警员
  if (null != task && (task.user != "" && task.user != undefined && task.user
          != null) && (task.unit == "" || task.unit == undefined || task.unit
          == null)) {
    var userIdStr = task.user;
    if (userIdStr) {
      console.log(userIdStr + "userIdStr");
      var userIdMapSet = userIdStr.split(",");
      if (null != userIdMapSet) {
        for (var i = 0; i < userIdMapSet.length; i++) {
          var userInfo = userIdMapSet[i].split(";");
          var userId = userInfo[0];
          var userName = userInfo[1];
          $(".checked-person-name").append('<div class="name-cell" id="'
              + userId + '"><div class="remove-checked">×</div><span>'
              + userName
              + '</span>&nbsp;<i class="fa fa-map-marker color-rose-red" aria-hidden="true"></i></div>');
        }
      }
    }
  }

  //选中的单位
    if (null != task && (task.unit != "" && task.unit != undefined && task.unit != null)) {
        var unitIdStr = task.unit;
      var userIdStr = "";
      if (task.user != "" && task.user != undefined && task.user != null) {
        var userIdStr = task.user;
      }
        if (unitIdStr) {
            $.ajax({
                type: "get",
              url: "/skynet/web/infoTask/groupUsers/search?unitIds=" + unitIdStr
              + "&userIdStr=" + userIdStr,
                contentType: "application/json",
                success: function (data) {
                    if (data.list && data.list.length > 0) {
                        for (var i = 0; i < data.list.length; i++) {
                            var userId = data.list[i].id;
                            var userName = data.list[i].name;
                          $(".checked-person-name").append('<div class="name-cell" id="'
                              + userId
                              + '"><div class="remove-checked">×</div><span>'
                              + userName
                              + '</span>&nbsp;<i class="fa fa-map-marker color-rose-red" aria-hidden="true"></i></div>');
                        }
                    }
                }
            });
        }
    }

  if (null != task && (task.address != "" && task.address != undefined
          && task.address != null)) {
        $("#address").val(task.address);
    }
});
function save() {
    var taskName = $("#taskName").val();
    var content = $("#content").val();
    if ((taskName == "" || taskName == undefined || taskName == null)) {
      layer.alert("请输入任务名称");
        return;
    }
    if ((content == "" || content == undefined || content == null)) {
      layer.alert("请输入任务指令");
        return;
    }
    //获取已选用户
    for (var i = 0; i < $(".checked-person-name .name-cell").length; i++) {
        var id = $(".checked-person-name .name-cell").eq(i).attr("id");
        userIds += id + ",";
    }
    //获取已选单位
    for (var i = 0; i < $(".checked-company-name .name-cell").length; i++) {
        var id = $(".checked-company-name .name-cell").eq(i).attr("id");
        unitIds += id + ",";
    }
    console.log("获取已选用户得信息：" + userIds)
    console.log("获取已选单位：" + unitIds)
    var task = parent.fill();
    var address = "";
    var lat = "";
    var lng = "";
    if ((task.lat != "" && task.lat != undefined && task.lat != null) && (task.lng != "" && task.lng != undefined && task.lng != null)) {
        lat = task.lat;
        lng = task.lng;
    }

    if ($("#address").val() == null || $("#address").val() == undefined || $("#address").val() == "" || $("#address").val() == "undefined") {
        address = $("#inputAddress").val();
        lat = $("#latitude").val();
        lng = $("#longitude").val();
    } else {
        address = $("#address").val();
    }


  if (userIds == "" || userIds == undefined || userIds == null) {
    layer.alert("请选择派遣民警");
        return;
    }
    if (lat == "" || lat == undefined || lat == null || lng == "" || lng == undefined || lng == null) {
      layer.alert("请输入任务地址");
        return;
    }
    var data = {
        "unitIds": unitIds,
        "userIds": userIds,
        "policeInfoLat": lat,
        "policeInfoLng": lng,
        "taskName": $("#taskName").val(),
        "policeInfoComment": $("#content").val(),
        "policeInfoAddress": address
    }
    data = JSON.stringify(data);
    $("#saveTaskBtn").attr("disabled", true);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/save",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: data,
        success: function (data) {
            unitIds = "";
            userIds = "";
            address = "";
            lat = "";
            lng = "";
            if (106 == data.code) {
                layer.msg(data.error);
                $("#saveTaskBtn").attr("disabled", false);
            } else if (105 == data.code) {
                layer.msg(data.error);
            } else {
                console.log("给视频页面传至参数：" + data.obj.id + ":obj.id,"
                    + data.obj.policeInfoComment + ":obj.taskName,"
                    + data.obj.policeInfoLat + ":obj.policeInfoLat,"
                    + data.obj.policeInfoLng + ":obj.police_info_lng");
              APP110.callModFun('video', 'add', data.obj.id, data.obj.taskName,
                  task.lat, task.lng, data.obj.createTime,
                  $("#userUnit").val());
                layer.msg('保存成功', {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
              if ($("#mark").val() == "1") {
                window.parent.location.reload();
              }
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index);
            }
        }
    });

}









