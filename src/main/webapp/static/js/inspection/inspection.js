$(function () {
    setDate();
    //初始化警情分类
    initFireGroup();//初始化消防单位
    checkData(1);
    $("#inspection_check_bt").click(function () {
        checkData(1);
    });
});

/**
 * 设置时间显示
 */
function setDate(){
    var now = new Date();
    //一周时间段
    var startDate = new Date(now.getTime() - 604800000);
    var vedate = now.format("yyyy-MM-dd hh:mm:ss");
    var vsdate = startDate.format("yyyy-MM-dd hh:mm:ss");
    $("#sDate").val(vsdate);
    $("#eDate").val(vedate);
}

$("#type").change(function () {
    var item = $("#type").val();
    $('#unit_id').empty();
    initLinkGroup(item);//初始化其实业单位
});

function initLinkGroup(type){
    //初始化企事业单位
    $.ajax({
        type:"get",
        url:"/skynet/web/getEnterpriseGroup/"+type,
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        success:function(data){
            var map = data.obj;
            var unit_id = $("#unit_id");//辖区单位
            unit_id.empty().append("<option value=\"\">----请选择----</option>");
            for(var v in map){
                unit_id.append("<option value ="+ v +">"+ map[v] +"</option>");
            }
        }
    });
}

function initFireGroup(){
    //初始化消防单位
    $.ajax({
        type:"get",
        url:"/skynet/api/listChildGroup",
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        success: function (data) {
            var map = data.obj;
            var fire_group = $("#fire_group");//单位
            var mapLength = Object.keys(map).length;
            if (mapLength == 1) {
                for (var v in map) {
                    fire_group.append("<option value =" + v + ">" + map[v] + "</option>");
                }
                $("select:eq(1)").attr("disabled", "disabled");
            } else {
                fire_group.empty().append("<option value=\"\">----请选择----</option>");
                for (var v in map) {
                    fire_group.append("<option value =" + v + ">" + map[v] + "</option>");
                }
            }
        }
    });
}



function checkData(targetPageNumber) {
    var pageSize = 10;//每页查询数量
    var param = {};
    param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = pageSize;

    var type = $("#type").val();//单位类型
    var gridName = $("#gridName").val();//网格名称

    var startTime = $("#sDate").val();
    var endTime = $("#eDate").val();

    if (type) {
        param.type = type;
    }

    if (gridName) {
        param.gridName = gridName;
    }
    if (startTime) {
        param.startDate = startTime + ".000";
    }
    if (endTime) {
        param.endDate = endTime + ".000";
    }
    if (startTime&& endTime&& startTime >= endTime) {
        alert("开始时间不能大于结束时间！");
        return false;
    }
    var indexOfLayer = layer.load(2, {time: 10000});
    $("#task_tab_div").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: "/skynet/web/fireAlarm/inspectionLists",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data: param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#inspection_tab_div").html(data);
        }
    });
}


// 详情页面
function openInspectionDetail(id){
    $.ajax({
        type:"get",
        url:"/skynet/web/fire/inspectionDetails/"+id,
        dataType:"html",
        success:function(data){
            $("#check").attr("style","display:none");
            $("#detail").attr("style","display:block");
            $("#detail").html(data);

        }
    });
}
function comeback(){
    $("#detail").attr("style","display:none");
    $("#check").attr("style","display:block");
}

function goUnitDetail(id){
    layer.open({
        type: 2,
        title: "企事业单位详情",
        shadeClose: true,
        shade: 0.3,
        area: ['500px', '300px'],
        content: BASESERVLET+"/web/fire/webUnitDetail?unitId="+id
    });
}
