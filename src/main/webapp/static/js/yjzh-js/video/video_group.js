/**
 * 应急视频分组
 * @author shilinchuan
 * @date 2018/5/17
 **/
// 当前任务的视频分组信息
var groups = [];
// 指挥中心用户的信息
var centerUsers = new Set();
// 组中成员最大数量
var groupMax = 8;
// 订阅分组变动消息
var subscribeVideoGroupNotice = null;

/**
 * 跳转分组添加
 */
function toSaveGroup(groupId, groupName, groupUsersStr) {
  var taskId = getCurrentTaskId();
  load_layer('添加聊天组', '600px', '400px',
      '600px', '/skynet/web/videoGroup/toAddGroup?taskId=' + taskId
      + '&groupId=' + (groupId === undefined ? '' : groupId) + '&usersStr='
      + (groupUsersStr === undefined ? '' : groupUsersStr) + '&groupName='
      + (groupName === undefined ? '' : groupName));
}

/**
 * 获得分组信息
 */
function listVideoGroup(taskId) {
  //如果是自己创建的任务，取消订阅
  if (isOwnVideoGroup(taskId)) {
    unSubscribeVideoGroup();
  } else {
    initSubscribeVideoGroup();
  }

  $.ajax({
    type: "get",
    url: "/skynet/web/videoGroup/groupUsers/search?taskId=" + taskId,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (!data.status) {
        layer.msg('操作失败' + data.error);
        layer.closeAll();
        return;
      }

      groups = [];
      var groupIds = '';

      $.each(data.list, function (index, value) {
        if (value.videoGroupId == null || value.videoGroupId === undefined
            || value.videoGroupId === '') {
          return true;
        }
        if (groupIds.indexOf(value.videoGroupId + ',') === -1) {
          // 用户id，姓名，是否在视频中
          var users = [{
            id: value.policeUserId,
            name: value.policeName
          }];
          var group = {
            groupId: value.videoGroupId,
            groupName: value.videoGroupName,
            users: users
          };
          groups.push(group);
          groupIds += group.groupId + ',';
        } else {
          var user = {
            id: value.policeUserId,
            name: value.policeName
          };
          $.each(groups, function (index1, value1) {
            if (value.videoGroupId === value1.groupId) {
              value1.users.push(user);
              return false;
            }
          });
        }
      });

      $('.video-group-box').html('');
      $.each(groups, function (index, value) {
        var groupHtml = ``;
        var usernames = '';
        $.each(value.users, function (index1, value1) {
          if (usernames !== '') {
            usernames += '、';
          }
          usernames += (value1.name == null ? '未知' : value1.name);
        });
        groupHtml += `<div class="video-group" id="video-group-${index}">
                <div class="video-group-inner-box">
                  <span class="group-name">${value.groupName}</span>
                  <span class="group-members">${usernames}</span>
                </div>
              </div>`;
        $('.video-group-box').append(groupHtml);

        //鼠标悬浮事件
        if (isOwnVideoGroup(taskId)) {
          group_level1_menu(index, value.groupId, value.groupName, value.users);
        }
      });

      // 分组信息更新，检查实时视频人数
      isLiveOutOfLimit();
    }
  });
}

//显示聊天组操作菜单
function group_level1_menu(index, groupId, groupName, users) {
  var obj = $("#video-group-" + index);
  var groupUsersStr = '';
  $.each(users, function (index, value) {
    if (groupUsersStr.length > 0) {
      groupUsersStr += ',';
    }
    groupUsersStr += value.id + ':' + value.name;
  });

  var html = '<div class="group-level1-menu"><ul>';
  html += '<li class="change-group-person" id="change-group-person-' + index
      + '" onclick="toSaveGroup(\'' + groupId + '\', \'' + groupName + '\',\''
      + groupUsersStr + '\')">更改组内成员</li>';
  html += '<li onclick="groupDisband(\'' + groupId
      + '\')">解散该聊天组</li></ul></div>';
  html += '<div class="group-level2-menu">';
  html += '<div class="group-notarize">';
  html += '<span class="color-dark-gray">共<span class="color-red group-person-num">'
      + users.length + '</span>人</span>';
  html += '<span class="color-dark-blue float-right notarize-change-btn">确认</span></div></div>';

  $(obj).append(html);

  $(obj).mouseover(function () {
    $(this).find(".group-level1-menu").css("display", "block");
  });

  $(obj).mouseout(function () {
    $(this).find(".group-level1-menu").css("display", "none");
  });

  $(".group-level2-menu").find("li").click(function () {

    if ($(this).attr("data-num") == 0) {
      $(this).append(
          '<i class="icon iconfont icon-duigou color-dark-blue float-right"></i>');
      $(this).attr("data-num", "1");
    } else {
      $(this).children("i").remove();
      $(this).attr("data-num", "0");
    }

    var count_num = $(this).parent().find("i").length;

    $(this).parents().find(".group-person-num").text(count_num);

  });
}

//展开或收起全部视频人员事件
function video_person_list(obj) {
  var count = $("#minimizing_count").text();
  var flag = $(obj).children(".icon-zhankai");
  if (count > 0) {
    if (flag.length > 0) {
      $(".video-menu-box").css("display", "block");
      $(".video-person-group").css("display", "block");
      $(obj).find(".icon-zhankai").removeClass("icon-zhankai").addClass(
          "icon-shouqi");
    } else {
      $(".video-menu-box").css("display", "none");
      $(".video-person-group").css("display", "none");
      $(obj).find(".icon-shouqi").removeClass("icon-shouqi").addClass(
          "icon-zhankai");
    }
  }
}

//封装弹窗加载事件
function load_layer(layer_title, layer_width, layer_height, layer_min_width,
    layer_url) {
  layer.open({
    type: 2,
    title: layer_title,
    shadeClose: false,
    shade: 0.6,
    move: false,
    area: [layer_width, layer_height],
    content: layer_url //iframe的url
  });

  var content_H = $(".layui-layer").outerHeight() - 60;

  $(".layui-layer").css({
    "border-radius": "8px",
    "min-width": layer_min_width
  });

  $(".layui-layer-title").css({
    "border-top-left-radius": "8px",
    "border-top-right-radius": "8px",
    "height": "50px",
    "text-align": "center",
    "line-height": "50px",
    "background-color": "#fff",
    "font-size": "18px"
  });

  $(".layui-layer-content iframe").css({
    "border-bottom-left-radius": "8px",
    "border-bottom-right-radius": "8px",
    "height": content_H + "px",
    "box-sizing": "border-box"
  });
}

//关闭窗口
function close_layer() {
  var index = parent.layer.getFrameIndex(window.name);
  parent.layer.close(index);
}

/**
 * 解散分组
 * @param groupId 分组id
 */
function groupDisband(groupId) {
  var taskId = getCurrentTaskId();
  $.ajax({
    type: "post",
    url: "/skynet/web/videoGroup/disband?groupId=" + groupId,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (!data.status) {
        layer.msg('操作失败' + data.error);
        return;
      }
      listVideoGroup(taskId);
    }
  });
}

/**
 * 初始化订阅更新分组mq消息
 */
function initSubscribeVideoGroup() {
  // 如果已经存在订阅，不再进行订阅
  if (subscribeVideoGroupNotice) {
    return;
  }

  // 如果socket链接存在，直接订阅
  if (skynetSocket.connected) {
    subscribeVideoGroup();
  }
}

/**
 * 订阅更新分组mq消息
 */
function subscribeVideoGroup() {
  var headers = {
    'activemq.retroactive': 'true'
  };
  subscribeVideoGroupNotice = skynetSocket.subscribe("/topic/VIDEO_GROUP",
      function (m) {
        console.log("收到更新分组信息消息<<<<<<<：o%", m);
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
        var taskId = body.body;
        var currentTaskId = $('#tasks_ul .checked-timer-shaft').attr('id');
        if (body.event === 'REFRESH') {
          if (currentTaskId === taskId) {
            //获得分组信息
            listVideoGroup(taskId);
          }
        }
      }, headers);
}

/**
 * 停止订阅更新分组mq消息
 */
function unSubscribeVideoGroup() {
  if (subscribeVideoGroupNotice) {
    subscribeVideoGroupNotice.unsubscribe();
    subscribeVideoGroupNotice = null;
  }
}

/**
 * 判断分组中直播的视频数量是否超过最大值
 * @param groupId 分组id（分组标签中的id），不传检查所有分组
 */
function isLiveOutOfLimit(groupId) {
  //判断是否为任务创建组，不是任务创建组不检查直播视频数量
  var taskId = getCurrentTaskId();
  if (!isOwnVideoGroup(taskId)) {
    return;
  }

  var checkGroup = [];
  if (groupId !== undefined) {
    $.each(groups, function (gIndex, group) {
      if (group.groupId === groupId) {
        checkGroup.push(group);
        return false;
      }
    });
  } else {
    checkGroup = groups;
  }

  $.each(checkGroup, function (gIndex, group) {
    var count = 0;
    $.each(group.users, function (uIndex, user) {
      var isExist = $('video[id^="remotevideo' + user.id + '"]').length > 0;
      if (isExist) {
        count++;
      }
    });
    count += centerUsers.size;
    console.log(count);
    if (count > groupMax) {
      layer.alert('分组【' + group.groupName + '】当前实时视频人数超出最大人数' + groupMax
          + '，请修改分组成员！');
      return false;
    }
  });
}

/**
 * 添加指挥中心用户
 * @param userId 用户id
 */
function saveCenterUsers(userId) {
  centerUsers.add(userId);
}

/**
 * 删除指挥中心用户
 * @param userId 用户id
 */
function removeCenterUsers(userId) {
  centerUsers.delete(userId);
}

/**
 * 获得当然任务id
 * @returns
 */
function getCurrentTaskId() {
  return $('#current_task_id').val();
}
