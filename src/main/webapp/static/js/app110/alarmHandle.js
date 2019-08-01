//------------处警单-------------//
APP110.mods["alarmHandle"].gids = [];
APP110.mods["alarmHandle"].init = function () {
  var groupId = $("#currentLoginUserMainGroup").val();
  var roleId = $("#currentLoginUserRole").val();
  //UserOperation.ASSIGN_PATROL = 3 //分配出警的权限
  //查询登录用户可分配的出警单位
  $.ajax({
    url: BASESERVLET + "/api/getGroupPermission/" + groupId + "/" + roleId
    + "/3",
    type: "get",
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        layer.alert("获取可以分配出警的单位失败：" + data.error);
        return;
      }
      console.log("获取单位角色的可操作的处警单位：%o", data);
      var list = data.obj.allow;
      if (!list) {
        //如果没有可以操作的单位，返回
        return;
      }

      var gids = APP110.mods["alarmHandle"].gids;//可以派警的机构组的id
      for (var i = 0; i < list.length; i++) {
        var g = list[i];
        g = JSON.parse(g);
        gids.push(g.id);
      }

      //初始化显示可以派警的单位

      APP110.mods["alarmHandle"].initShow(gids);
    }
  });

  $("#policeUnitMap").click(function () {
    var caseid = $("#caseID").val();
    console.log(caseid);
    if (caseid == "") {
      layer.msg("没有警情需要处理", {icon: 2});
      return;
    }
    layer.open({
      type: 2,
      title: '民警地图',
      shadeClose: true,
      shade: 0.3,
      area: ['70%', '70%'],
      content: BASESERVLET + "/web/openUnitMap/" + groupId + "/" + roleId + "/3"
    });
  });

  //$("#unitSearch").on("change", APP110.mods["alarmHandle"].search);
  $("#unitSearch").on("keyup", APP110.mods["alarmHandle"].search);
  $("#unitSearchBtn").on("click", APP110.mods["alarmHandle"].search);

  //选择单位操作
  $("#alarmHandleDiv").on("click", "span", function () {
    var span = $(this);
    if (span.hasClass("selected")) {
      return;
    }
    var gid = span.attr("gid");
    var name = span.text();
    // var html = '<tr><td class="selectedUnit" gid="'+gid+'">'+name+'</td><td><span class="glyphicon glyphicon-remove remove"></span></td></tr>';
    var html = '<div class="teams2" gid="' + gid + '"gName="' + name
        + '"><span>' + name + '</span><button class="delete"></button></div>';

    $("#selectedUnitTbody").append(html);
    span.css({
      "border-color": "#e5621b",
      "background-color": "#f2dbce",
      "color": "#e5621b",
      "pointer-events": "none"
    });
    span.addClass("selected");
  });

  //派警所队选择效果样式开始
  // $(".teams1").click(function() {
  //
  //     alert("123456");
  //
  //     var text = $(this).text();
  //     $(this).css({
  //         "border-color": "#e5621b",
  //         "background-color": "#f2dbce",
  //         "color": "#e5621b",
  //         "pointer-events": "none"
  //     });
  //
  //     $(".checked-teams").prepend("<div class='teams2'><span>" + text + "</span><button class='delete'></button></div>");
  //
  // });

  //点击x号按钮删除该选中所队
  $(".checked-teams").on("click", ".delete", function () {

    var text = $(this).parent().children("span").text();

    for (var i = 0; i < $(".unit-label>span").length; i++) {

      if ($(".unit-label>span").eq(i).text() == text) {

        // alert(i + "==");

        $(".unit-label>span").eq(i).css({

          "border-color": "#dcdcdc",
          "background-color": "#fff",
          "color": "#333",
          "pointer-events": "auto"

        });

        $(".unit-label>span").eq(i).removeClass("selected");
      }
    }

    // alert(text);

    $(this).parent().remove();
    APP110.callModFun("map", "removeCheckPolice", $(this).parent().attr("gId"));
  });

  //重置按钮样式
  $(".clear-all").click(function () {

    $(".unit-label>span").css({

      "border-color": "#dcdcdc",
      "background-color": "#fff",
      "color": "#333",
      "pointer-events": "auto"

    });

    $(".unit-label>span").removeClass("selected");

    $(".checked-teams").children().remove();

  });
  $("#handleSaveBtn").click(APP110.mods["alarmHandle"].save);
  $("#hangupBtn").click(function () {
    if (MyKurento.rws && MyKurento.rws.localName) {
      APP110.callModFun("kurento", "leaveRoom");

      if (APP110.mods["chat"].chatSubscribe
          && typeof APP110.mods["chat"].chatSubscribe.unsubscribe
          === "function") {
        APP110.mods["chat"].chatSubscribe.unsubscribe();
        $('#chat-cont').empty();
      }
    }
  });
  // APP110.mods["alarmCase"].getData = null;

};
//通过输入框输入文本，搜索对应的出警单位
APP110.mods["alarmHandle"].search = function () {
  var text = $("#unitSearch").val();
  text = $.trim(text);
  $.each($("#alarmHandleDiv span"), function (i, span) {
    span = $(span);
    if (span.text().indexOf(text) < 0) {
      // span.addClass("hide");
      span.hide();
    } else {
      span.show();
      // span.removeClass("hide");
    }
    /*span = $(span);
     var reg = /^[\u4e00-\u9fa5]/;
     //判断输入得是否为汉字
     if (reg.test(text)) {
     if(span.text().indexOf(text)<0){
     span.hide();
     }else{
     span.show();
     }
     }else {
     var dx = "";
     for(var i = 0;i<$().toPinyin(span.text()).length;i++){
     if(/^[A-Z]+$/.test($().toPinyin(span.text()).charAt(i))){
     dx+=$().toPinyin(span.text()).charAt(i);
     }
     }
     if($().toPinyin(span.text()).toLowerCase().replace(/\s/g,"").indexOf(text.toLowerCase())<0){
     span.hide();
     if(dx.toLowerCase().indexOf(text.toLowerCase())>=0){
     span.show();
     }
     }else{
     span.show();
     }

     }*/
  });
};
APP110.mods["alarmHandle"].initShow = function (gids) {
  gids = JSON.stringify(gids);
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/group/simple/list",
    data: gids,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      if (!data.status) {

        return;
      }
      var list = data.list;
      var html = '';
      for (var i = 0; i < list.length; i++) {
        var g = list[i];
        html += '<span class="teams1" gid="' + g.id + '">' + g.name + '</span>';
      }
      $("#alarmHandleDiv").html(html);
    }
  });
};

/**
 * 保存接警单和处警单
 */
APP110.mods["alarmHandle"].save = function () {
  // 2017-07-10，王亚良，判断是否有报警人，如果没有不调用保存方法。
  if (!APP110.currentBjr) {
    layer.msg("没有报警信息", {icon: 2});
    return false;
  }

  //下面这句代码暂时需要 alarmHandle和alarmCase必须在一个页面
  var alarmInfo = APP110.callModFun("alarmCase", "getData");

  var gidDom = $("#selectedUnitTbody div");
  var valid = Number(alarmInfo.status) == 1;//同步勤务平台为1

  if (valid) {
    if (typeof alarmInfo.group == "undefined") {
      layer.msg("所属单位不能为空", {icon: 2});
      return false;
    }
    ;
    if (alarmInfo.description == "") {
      layer.msg("报警描述不能为空", {icon: 2});
      return false;
    }
    ;
    if (gidDom.length <= 0) {
      //当为有效报警时，才判断处警单位
      layer.msg("请选择处警单位", {icon: 2});
      return false;
    }
  }
  if (APP110.mods["alarmHandle"].saving) {
    return;
  }

  APP110.mods["alarmHandle"].saving = true;

  APP110.mods["alarmHandle"].saveLayerIndex = layer.load(2, {
    shade: [0.3, '#000'] //0.3透明度的000背景
  });

  if (!alarmInfo.caseId) {
    layer.msg("没有报警信息", {icon: 2});
    APP110.mods["alarmHandle"].saving = false;
    layer.close(APP110.mods["alarmHandle"].saveLayerIndex);
    return;
  }

  if (valid) {
    //判断接警台是选择报警人还是案发地址
    alarmInfo.selection = $("select[name='selection']").val();
    APP110.mods["chat"].sendMsg(alarmInfo.selection, 0, "CHAT_SELECTION");
    //有效报警才填这些项
    if (!alarmInfo.type) {
      layer.msg("请选择警情类别", {icon: 0}, function (index) {
        layer.close(index);
        $("#a_c_type")[0].focus();
      });
      APP110.mods["alarmHandle"].saving = false;
      layer.close(APP110.mods["alarmHandle"].saveLayerIndex);
      return;
    }
  }

  var alarmHandle = {};
  alarmHandle.suggest = $("#suggest").val();

  var gid = new Array();
  if (gidDom[0] != null) {

    $.each($(gidDom), function (i) {
      var su = $(this);
      console.log(su);
      gid.push(su.attr("gid"));
    });
  }
  var data = {alarmCaseInfo: alarmInfo, alarmHandle: alarmHandle, groups: gid};
  APP110.mods["alarmHandle"].saveAlarmCase(data);

  alarmSaveSuccess(valid);
};

APP110.mods["alarmHandle"].saveAlarmCase = function (data) {
  var pdata = JSON.stringify(data);
  console.log(pdata);

  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/alarmCase/save",
    data: pdata,
    async: false,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      APP110.mods["alarmHandle"].saving = false;
      layer.close(APP110.mods["alarmHandle"].saveLayerIndex);
      if (!data.status) {
        layer.msg(data.error, {icon: 2});
        return;
      }
      layer.msg("保存接警、处警信息成功", {icon: 1});
    }
  });
};

function alarmSaveSuccess(valid) {
  var note;
  if (valid) {
    //给报警人的通知
    note = "温馨提示：接警员接警结束,您可以挂断视频，也可以继续录制为我们提供更多的视频内容作为线索";

  } else {
    note = "温馨提示：接警员接警结束,您可以停止录制结束报警";
  }
  APP110.mods["chat"].sendMsg(note, 0);
  if (MyKurento.rws && MyKurento.rws.localName) {
    APP110.callModFun("kurento", "leaveRoom");
  }
  alarmEndReset();//初始化
  $('#remote2').empty();
  $('#remote3').empty();
  $('#remote4').empty();

  // $("#a_c_areaGroup").empty();

  // for(var i=0;i<$("#a_c_areaGroup").childNodes.length;i++){
  //     area.removeChild(area.options[0]);
  //     area.remove(0);
  //     area.options[0] = null;
  // }

  $(".unit-label>span").css({

    "border-color": "#dcdcdc",
    "background-color": "#fff",
    "color": "#333",
    "pointer-events": "auto"

  });

  $(".unit-label>span").removeClass("selected");

  $(".checked-teams").children().remove();

  //隐藏播放已挂断视频的按钮
  $("#historyVideo").css("display", "none");
  //清空存放已挂断报警视频路径的隐藏域
  $("#currentVideo").val();
}

/**
 * 重置
 */
APP110.mods["alarmHandle"].reset = function () {
  $("#suggest").val('');//派警意见
  $("#selectedUnitTbody tr").remove();//触动力量
  $("#alarmHandleDiv span").removeClass("selected");//待选出警派出所
  $("#unitSearch").val('');//待选出警派出所的搜索框
  APP110.mods["alarmHandle"].search();//恢复所有单位显示

  APP110.mods["alarmHandle"].saving = false;
}

//选择派出所派警
APP110.mods["alarmHandle"].dispatch = function (data) {
  if (data) {
    for (var i = 0; i < data.length; i++) {
      var gid = data[i];
      var selector = $("#selectedUnitTbody .teams2[gid=" + gid + "]");
      if (selector.length > 0) {
        continue;
      } else {
        console.log($("#alarmHandleDiv .teams1[gid=" + gid + "]"));
        $("#alarmHandleDiv .teams1[gid=" + gid + "]").trigger("click");
      }
    }
  }
}

//------------处警单-------------//