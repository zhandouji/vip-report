/**
 * 判断选中的民警是否已经选中
 */
function personSelected(param) {
  var personList = $("#selectedPolice").children();
  var userList = new Array();
  if (personList.length > 0) {
    for (var i = 0; i < personList.length; i++) {
      userList.push(personList.eq(i).data("text"));
    }
  }

  if ($.inArray($(param).attr("id"), userList) == -1) {
    addSelectedPolice(param);
  } else {
    layer.msg('民警已选择', {
      icon: 2,
      time: 500 //2秒关闭（如果不配置，默认是3秒）
    });
    return;
  }
}

/**
 * 选中需要发送通知的民警
 */
function addSelectedPolice(param) {
  $(param).css("background", "#10AEFF");
  var personHtml = '<div class="name-cell" data-text="' + $(param).attr("id")
      + '">'
      + '<div class="remove-checked">×</div>'
      + '<span>' + $(param).html() + '</span></div>';
  $("#selectedPolice").append(personHtml);
}

/**
 * 发送任务通知
 */
function sendTaskNotice() {
  //任务通知的名称
  var noticeName = $("#noticeName").val();
  if (noticeName == "" || noticeName == null || noticeName == undefined) {
    layer.msg('任务通知名称不能为空', {
      icon: 2,
      time: 500 //2秒关闭（如果不配置，默认是3秒）
    });
    return;
  }
  //任务通知的名称
  var noticeContent = $("#noticeContent").val();
  //任务通知人员
  var personList = $("#selectedPolice").children();
  if (personList.length > 0) {
    var userList = new Array();
    for (var i = 0; i < personList.length; i++) {
      var userInfo = personList.eq(i).find("span").html();
      var split = userInfo.split("-");
      if (split.length >= 3) {
        var user = {
          "id": personList.eq(i).data("text"),
          "name": split[1],
        }
        userList.push(user);
      }
    }
    //是否允许修改任务信息
    var addInfoFlag = $("input[name='addInfoFlag']:checked").val();
    //参数值
    var param = {
      "noticeName": noticeName,
      "noticeContent": noticeContent,
      "taskId": $("#taskId").val(),
      "flag": addInfoFlag,
      "userList": userList
    };
    //访问请求
    $.ajax({
      url: "/skynet/web/infoTask/sendTaskNotice",
      type: "post",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(param),
      success: function (data) {
        if (data.status) {
          layer.msg('通知发送成功', {
            icon: 1,
            time: 500 //2秒关闭（如果不配置，默认是3秒）
          }, function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
          });
        }
      }
    });
  } else {
    layer.msg('请选择需要通知的警员', {
      icon: 2,
      time: 500 //2秒关闭（如果不配置，默认是3秒）
    });
  }
}

/**
 * 全选
 */
function selectPersonAll() {
  $("#selectedPolice").empty();
  var personList = $("#selectPolice").children();
  if (personList.length <= 0) {
    layer.msg('没有可选择的民警', {
      icon: 2,
      time: 500 //2秒关闭（如果不配置，默认是3秒）
    });
    return;
  } else {
    $("#selectPolice").find(".dispatch-personnel").each(function () {
      addSelectedPolice(this);
    })
  }
}

/**
 * 全不选
 */
function cancelAll() {
  $("#selectedPolice").empty();
  $("#selectPolice").find(".dispatch-personnel").each(function () {
    $(this).css("background", "#efeff4")
  })
}

/**
 * 跳转任务通知的页面
 */
function taskNoticeListHtml(taskId) {
  layer.open({
    type: 2,
    title: "查看任务通知",
    shadeClose: true,
    shade: 0.3,
    area: ['1100px', '80%'],
    content: BASESERVLET + "/web/infoTask/showTaskNoticeHtml?taskId=" + taskId
  });
}

/**
 * 获取任务通知
 */
function taskNoticeList(taskId) {
  var index = layer.load();
  $.ajax({
    type: "get",
    url: "/skynet/web/infoTask/showTaskNotice?taskId=" + taskId,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (!data.status) {
        layer.msg(data.error);
        layer.close(index);
        return;
      }
      if (data.list != null && data.list.length > 0) {
        var html = '';
        $.each(data.list, function (index, value) {
          html += '<tr>';
          html += '<td style="max-width: 200px">' + value.noticeName + '</td>';
          html += '<td style="max-width: 200px">' + value.noticeContent
              + '</td>';
          html += '<td>' + value.sendUnitName + '</td>';
          html += '<td>' + value.sendUserName + '</td>';
          html += '<td>' + value.createTime + '</td>';
          /* html += '<td><button class="button2" onClick="taskNoticeDetails(\''
               + value.noticeId + '\',)">查看详情</button></td>';*/
          html += '</tr>';
        });
        $('#list').html(html);
      } else {
        $('#list').html('<tr><td colspan="5">暂无数据...</td></tr>');
      }
      layer.close(index);
    }
  });
}

/**
 * 查看任务通知的详情
 */
function taskNoticeDetails(noticeId) {
}