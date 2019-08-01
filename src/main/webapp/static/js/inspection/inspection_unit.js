$(function () {
    checkData(1);
});
$("#level").change(function () {
    var level = $("#level").val();
    $('#company_id').empty();
    initLinkGroup(level);//初始化其实业单位
});
function initLinkGroup(company_type){
    //初始化企事业单位
    $.ajax({
        type:"get",
        url:"/skynet/web/getOwnUnit/"+company_type,
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        success:function(data){
            var map = data.obj;
            var company_id = $("#company_id");//辖区单位
            company_id.empty().append("<option value=\"\">----请选择----</option>");
            for(var v in map){
                company_id.append("<option value ="+ v +">"+ map[v] +"</option>");
            }
        }
    });
}
function checkData(targetPageNumber) {
    var pageSize = 10;//每页查询数量
    var param = {};
    param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = pageSize;
    var type = $("#company_type").val();
    var level = $("#level").val();
    var unitId = $("#company_id").val();
    var userName = $("#userName").val();
    var userName = $("#userName").val();
    if (type) {
        param.type = type;
    }
    if (unitId) {
        param.unitId = unitId;
    }
    if (userName) {
        param.name = userName;
    }
    if (level) {
        param.reseauLevel= level;
    }

    var indexOfLayer = layer.load(2, {time: 10000});
    $("#inspection_unit_div").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: "/skynet/web/fire/inspectionUnitLists",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data: param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#inspection_unit_div").html(data);
        }
    });
}

function unitDelete(companyId) {
    layer.confirm('信息删除后不可恢复，确认删除吗？', {
        btn: ['是', '否'] //按钮
    }, function () {
        $.ajax({
            url: "/skynet/web/fire/unitDelete",
            type: "post",
            dataType: "json",
            data: 'companyId=' + companyId,
            success: function (data) {
                if (data.status == false) {
                    layer.msg(data.error);
                } else {
                    layer.msg("成功删除");
                    parent.mainchange("/skynet/web/fire/UnitList");
                }
            }

        });
    }, function () {
        layer.msg("已取消删除");
    });
}
function updateUnit(companyId) {
        layer.open({
            type: 2,
            title: "编辑",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
            area: ['600px', '700px'],
            content:"/skynet/web/unit/update?companyId="+companyId
        });
    }

function unitDetail(companyId,userId) {
    layer.open({
        type: 2,
        title: "单位人员列表",
        shadeClose: true,
        closeBtn:1,
        shade: 0.3,
        area: ['1000px', '600px'],
        content:"/skynet/web/unit/detail?companyId="+companyId
    });
}

function scopeOfPainting(companyId, type) {
    layer.open({
        type: 2,
        title: "范围规划",
        shadeClose: true,
        closeBtn:1,
        shade: 0.3,
        area: ['1000px', '800px'],
        content:"/skynet/web/company/scopeOfPainting?companyId=" + companyId + "&type=" + type
    });
}