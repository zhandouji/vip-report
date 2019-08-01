//--------------------报警人信息模块--------------------//

APP110.mods["person"].init = function () {
  APP110.mods["person"].reset();

  // 当前报警人的报警历史
  $("#bjrxx-ls").click(function () {
    var uid = $(this).attr("uid");
    if (!uid) {
      layer.msg("没有报警人信息", {icon: 2});
      return false;
    }
    layer.open({
      type: 2,
      title: "报警历史",
      shadeClose: true,
      shade: 0.3,
      area: ['1600px', '80%'],
      content: BASESERVLET + '/web/alarmHistroy/' + uid
    });
  });
};

// 重置
APP110.mods["person"].reset = function () {
  $("#bjrxx-tx").css('background-image',
      'url("/theme/img/jiejingtai/head-img.jpg")');
  //姓名
  $("#bjrxx-xm").html('');
  //性别
  $("#bjrxx-xb").html('');
  //生日
  $("#bjrxx-sr").html('');
  //身份证号
  $("#bjrxx-sfzh").html('');
  //电话
  $("#bjrxx-dh").html('');
  //累积报警
  $("#bjrxx-ljbj").html('0');
  //无效报警
  $("#bjrxx-wxbj").html('0');
  //报警历史
  $("#bjrxx-ls").attr('uid', '');
}

// 将报警信息填充到接警单的报警人部分
APP110.mods["person"].fill = function (bjr) {
  console.warn(bjr);
  var name = bjr.name ? bjr.name : "";
  //姓名
  $("#bjrxx-xm").html(name);
  //性别
  $("#bjrxx-xb").html(bjr.gender == 0 ? '女' : (bjr.gender == 1 ? '男' : ''));
  //生日
  $("#bjrxx-sr").html(bjr.birthday);
  //身份证号
  $("#bjrxx-sfzh").html(bjr.id);
  //电话
  $("#bjrxx-dh").html(bjr.phone);
  //报警历史
  $("#bjrxx-ls").attr('uid', bjr.userId);

  // 2017年7月3日王亚良新增，查询用户累计报警总数。
  var uid = bjr.userId;
  $.ajax({
    url: BASESERVLET + "/web/queryUserCaseSum/" + uid,
    type: "post",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      // 累计报警次数
      $("#bjrxx-ljbj").html(data);
    }
  });
  $.ajax({
    url: BASESERVLET + "/web/queryUserUnusefulCaseCount/" + uid,
    type: "get",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      // 无效报警次数
      $("#bjrxx-wxbj").html(data);
    }
  });
}
//--------------------报警人信息模块--------------------//