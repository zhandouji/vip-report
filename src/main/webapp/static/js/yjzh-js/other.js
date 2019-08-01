$(document).ready(function () {

  //统计附近警务服务站和警员的总数
  $(".all-police-station").text($(".police-station-list li").length + "个");
  $(".all-police-person").text($(".police-person-list li").length + "个");

  //自定义派警选中多选框
  $(".map-police-list li").on("click", ".check-button", function () {
    $(this).toggleClass("checked-button-bg");
    $(".police-person-num").text(
        $(".check-button input[name = 'police-person']:checked").length);
    $(".police-station-num").text(
        $(".check-button input[name = 'police-station']:checked").length);
  });

  //tab切换警务站和警员
  $(".hj-nearby-div div").on("click", function () {
    var nearbyIndex = $(this).index();
    $(".map-police-list").css("display", "none");
    $(".map-police-list").eq(nearbyIndex).css("display", "block");
    if (nearbyIndex == 0) {
      $(".nearby-history").text("附近警务机构");
    } else {
      $(".nearby-history").text("附近民警");
    }
  });

  //自定义下拉框列表相关点击事件
  $(".my-select").on("click", function (e) {
    e.stopPropagation();
    $(this).parent().find(".my-select-list-box").css("display", "block");
  });

  //点击确定按钮收起下拉列表
  $(".select-submit-btn-box").on("click", ".button1", function () {
    $(this).parents(".my-select-list-box").css("display", "none");
  });

  //自定义下拉框选择
  $(".my-select-list li").on("click", ".check-button", function (e) {
    e.stopPropagation();
    $(this).toggleClass("select-checked-bg");
  });

  //点击自定义下拉框每一行事件
  $(".my-select-list").on("click", "li", function (e) {
    e.stopPropagation();

    $(this).children(".check-button").toggleClass("select-checked-bg");

    if ($(this).find("input[type='checkbox']").is(":checked")) {

      $(this).find("input[type='checkbox']").prop("checked", false);
    } else {

      $(this).find("input[type='checkbox']").prop("checked", true);
    }
  });

  //点击空白处让下拉框隐藏
  $("body").on("click", function () {
    $(".my-select-list-box").css("display", "none");
  });

  //点击下拉框空白处阻止下拉框隐藏
  $(".my-select-list-box").on("click", function (e) {
    e.stopPropagation();
  });

  //状态选择的点击事件
  $(".state").click(function () {
    $(this).toggleClass("state-checked");
  });

  //弹窗添加警员
  $(".add-police-btn-box button").click(function () {
    var name = $(".search-police-result li").eq(0).children("div").text();
    var phoneNum = $(".search-police-result li").eq(1).children("div").text();
    var sfzNum = $(".search-police-result li").eq(2).children("div").text();
    var company = $(".search-police-result li").eq(3).children("div").text();
    $(".alert-table-box table").append("<tr><td>" + name + "</td><td>"
        + phoneNum + "</td><td>" + sfzNum + "</td><td>" + company
        + "</td><td><span class='delet-police-person color-red'>删除</span></td></tr>");
  });

  //删除添加警员
  $(".alert-table-box").on("click", ".delet-police-person", function () {
    $(this).parents("tr").remove();
  });

  //查看派警人员按钮点击事件
  //$("#checkPerson").click(function () {
  //var taskId = $("input[name='InfoTaskId']").val();
  //taskPolices(taskId);
  //});

  //查看派警单位按钮点击事件
  //$("#checkUnit").click(function () {
  //var taskId = $("input[name='InfoTaskId']").val();
  //taskUnits(taskId);
  //});

  //查看可上报指挥中心的列表
  $("#taskReported").click(function () {
    var display = $("#unitIds").css("display", "block");
  });

  $("#addTaskPerson").click(function () {
    var taskId = $("input[name='InfoTaskId']").val();
    layer.open({
      type: 2,
      title: "添加派遣民警",
      shadeClose: true,
      closeBtn: 1,
      shade: 0.3,
      area: ['1240px', '90%'],
      content: BASESERVLET + '/web/infoTask/policeAdd?taskId=' + taskId
    });
  });

  $("#addTaskUnit").click(function () {
    var taskId = $("input[name='InfoTaskId']").val();
    layer.open({
      type: 2,
      title: "添加派遣指挥中心",
      shadeClose: true,
      closeBtn: 1,
      shade: 0.3,
      area: ['1240px', '90%'],
      content: BASESERVLET + '/web/infoTask/unitAdd?taskId=' + taskId
    });
  });
});

function taskPolices(taskId) {
  $("#SendPersonnel").empty();
  $.ajax({
    url: BASESERVLET + "/web/infoTask/getTaskPolice",
    type: "get",
    dataType: "json",
    async: false,
    data: {taskId: taskId},
    success: function (data) {
      if (data.status == true) {
        //任务派遣人员
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i] != null && data.list[i] != undefined) {
            var status = "";
            if (data.list[i].status === 1) {
              status = "未认领";
            } else {
              status = "处理中";
            }
            $("#SendPersonnel").append("<div class='dispatch-personnel' id='"
                + data.list[i].policeUserId + "'>"
                + data.list[i].policeName + "-" + data.list[i].phone + "-"
                + data.list[i].unitName + "(" + status + ")</div>");
          }
        }
      }
    }
  });
}

function taskUnits(taskId) {
  $("#SendUnit").empty();
  $.ajax({
    url: BASESERVLET + "/web/infoTask/getTaskUnit",
    type: "get",
    dataType: "json",
    async: false,
    data: {taskId: taskId},
    success: function (data) {
      if (data.status == true) {
        //任务派遣人员
        if (data.list != null && data.list.length > 0) {
          for (var i = 0; i < data.list.length; i++) {
            if (data.list[i] != null && data.list[i] != undefined) {
              $("#SendUnit").append("<div class='dispatch-personnel'>"
                  + data.list[i].unitName + "</div>");
            }
          }
        }
      }
    }
  });
}

function reportedUnit(taskId) {
  var reporteUnitList = new Array();
  $.ajax({
    url: BASESERVLET + "/web/infoTask/reportedUnit",
    type: "get",
    dataType: "json",
    async: false,
    data: {taskId: taskId},
    success: function (data) {
      if (data.status == true) {
        reporteUnitList = data.list;
      }
    }
  });
  return reporteUnitList;
}

//应急指挥的大小屏的判断
$(window).resize(function () {
  //任务添加

  if ($(".alert-layer-max-box").length > 0) {
    var height = $(".alert-layer-max-box").height();
    $(".checked-company-person-box").css("height", height - 365 + "px");
  }

  //大小屏的适配问题
  if ($(document).width() <= 1600) {
    $("#showMessageBut").css("display", "block");
    $(".chatting-content-box ").css("display", "none");
    $(".chatting-max-box ").css("height", "52px");
    $(".sirens-box").css("overflow-y", "auto");
    $(".sirens-box").css("top", "52px");
  } else {
    $("#showMessageBut").css("display", "none");
    $(".chatting-content-box ").css("display", "block");
    $(".chatting-max-box ").css("height", "354px");
    $(".sirens-box").css("overflow-y", "hidden");
    $(".sirens-box").css("top", "0px");
  }
});