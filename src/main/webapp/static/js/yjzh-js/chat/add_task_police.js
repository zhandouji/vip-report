var userIds = "";
function save() {
    var taskId = $("#taskId").val();
    var taskName = $("#taskName").val();
    var content = $("#content").val();
    //获取已选用户
    for (var i = 0; i < $(".checked-person-name .name-cell").length; i++) {
        var id = $(".checked-person-name .name-cell").eq(i).attr("id");
        userIds += id + ",";
    }

    console.log("获取已选用户得信息：" + userIds)

  if (userIds == "" || userIds == undefined || userIds == null) {
    layer.msg("请选择派遣民警");
        $(".layui-layer-content").css("color", "#fff");
        return;
    }

    var data = {
        userIds: userIds,
        taskId: taskId
    }
    $("#saveTaskBtn").attr("disabled", true);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/addTaskPolice",
        type: "POST",
        dataType: "json",
        data: data,
        success: function (data) {
            if (data.status == true) {
                layer.msg('增加派遣人员成功', {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
              parent.taskPolices(taskId);
              parent.parent.layer.close(index);
            } else {
                layer.msg(data.error);
                $("#saveTaskBtn").attr("disabled", false);
            }
        }
    });

}









