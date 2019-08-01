/**
 * 网格管理
 * @author shilinchuan
 * @date 2018/1/31
**/

/**
 * 获得父节点信息
 */
function findUnitInfo(){
    var parentId = $("#parentId").val();
    var gridType = $("#gridType").val();
    if (parentId === "0"){
        //没有父网格，添加大网格
        //显示：网格描述
        $("#remarkTr").show();
        $("#parentId").val("");
        $("#parentName").val("无");
        $("#level").val("1");
        return;
    }
    $.ajax({
        type:"get",
        url:"/skynet/web/fireInspection/detail/" + parentId,
        dataType:"json",
        success:function(data){
            if (!data.status){
                layer.msg(data.error);
                return;
            }
            $("#parentName").val(data.obj.companyName);
            var level = data.obj.reseauLevel;
            if (level === 1){
                //父网格为大网格，添加中网格
                //显示：网格描述，地址
                $("#gridName").html("中网格");
                $("#remarkTr").show();
                $("#addressTr").show();
            }
            if (level === 2){
                $("#super_Grid").html("中网格");
                $("#gridName").html("小网格");

                //父网格为中网格，添加小网格
                //显示：地址，巡检时间，巡检间隔，单位类型
                if (gridType === "0"){
                    $("#addressTr").show();
                    $("#inspectionTimeTr").show();
                    $("#intervalTr").show();
                    $("#companyTypeTr").show();
                    $("#minStationTr").show();
                    listCompanyType();
                } else {
                    $("#contactsTr").hide();
                    $("#nameTr").hide();
                    $("#phoneTr").hide();
                    $("#smallUnitTr").show();
                    listAllSmallUnit();
                }
            }

            $("#level").val(Number(level) + 1);
        }
    });
}

/**
 * 查询公司类型
 */
function listCompanyType(){
    $.ajax({
        type:"get",
        url:"/skynet/web/dict/findByCode/11900",
        dataType:"json",
        success:function(data){
            if (!data.status){
                layer.msg(data.error);
                return;
            }
            var txt = '<option value="">----请选择----</option>';
            $.each(data.list, function(index, value){
                txt += '<option value="' + value.itemCode + '">' + value.name + '</option>';
            });
            $("#companyType").html(txt);
        }
    });
}

/**
 * 查询所有小网格
 */
function listAllSmallUnit(){
    $.ajax({
        type:"get",
        url:"/skynet/web/fireInspection/listAllSmall",
        dataType:"json",
        success:function(data){
            if (!data.status){
                layer.msg(data.error);
                return;
            }
            var txt = '<option value="">----请选择----</option>';
            $.each(data.list, function(index, value){
                txt += '<option value="' + value.gridId + '">' + value.gridName + '</option>';
            });
            $("#smallUnit").html(txt);
            $("#smallUnit").searchableSelect();
        }
    });
}

/**
 * 保存
 */
function saveCompany() {
    var parentId = $("#parentId").val();
    var companyName = $("#name").val();
    var contacts = $("#contacts").val();
    var phone = $("#phone").val();
    var level = $("#level").val();
    var addressAll = $("#addressAll").val();
    var longitude = $("#longitude").val();
    var latitude = $("#latitude").val();
    var companyType = $("#companyType").val();
    var minStation = $("#minStation").val();
    var inspectionStartTime = $("#inspection_start_time").val();
    var inspectionEndTime = $("#inspection_end_time").val();
    var interval1=$("#interval").val();
    var remark = editor.txt.html();
    var gridType = $("#gridType").val();
    if (interval1.length = 0 || interval1 == 0) {
        interval1 = 2;
    }
    var interval = interval1 * 60;
    var smallUnit = $("#smallUnit").val();

    if (gridType === '0'){
        if (companyName == "") {
            $("#nameError").empty().html("单位名称不能为空");
            return false;
        }
        if (contacts == "") {
            $("#contactsError").empty().html("负责人不能为空");
            return false;
        }
        if (phone.length != 11 && phone == "") {
            $("#phoneError").empty().html("手机号为空或长度错误");
            return false;
        }
    }

    if (inspectionStartTime !== '' || inspectionEndTime !== ''){
        if (inspectionStartTime !== '' && inspectionEndTime === ''){
            layer.msg("请填写巡检结束时间");
            return;
        }
        if (inspectionStartTime === '' && inspectionEndTime !== ''){
            layer.msg("请填写巡检开始时间");
            return;
        }
        inspectionStartTime = "1970-01-01 " + inspectionStartTime + ":00";
        inspectionEndTime = "1970-01-01 " + inspectionEndTime + ":00";
    }

    if (level === '1'){
        inspectionStartTime = '';
        inspectionEndTime = '';
        interval = '';
    }
    if (level === '2'){
        inspectionStartTime = '';
        inspectionEndTime = '';
        interval = '';
    }
    if (level === '3'){
        remark = '';
        if (gridType === '0'){
            /*if (companyType === undefined || companyType === ''){
                layer.msg("请选择单位类型");
                return;
            }*/
            if (minStation === undefined || minStation === ''){
                layer.msg("请选择是否创建了微型消防站");
                return;
            }
        } else {
            if (smallUnit === undefined || smallUnit === ''){
                layer.msg("请选择小网格");
                return;
            }
        }
    }

    var param = {
        "reseauLevel": level,
        "userTel": phone,
        "companyName": companyName,
        "userName": contacts,
        "companyLat": latitude,
        "companyLng": longitude,
        "parentId": parentId,
        "inspectionStartTime": inspectionStartTime,
        "inspectionEndTime": inspectionEndTime,
        "companyType":companyType,
        "minStation":minStation,
        "interval" : interval,
        "remark" : remark,
        "address":addressAll,
        "gridType" : gridType,
        "companyId": smallUnit
    };
    console.log(param);
    //防止多次点击提交
    $("#btn11").attr("disabled", true);
    $.ajax({
        url: "/skynet/web/fire/inspectionUnit/save",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (msg) {
            if (msg) {
                if (msg.status == false) {
                    $("#btn11").attr("disabled", false);
                    layer.msg(msg.error);
                } else {
                    parent.layer.msg('添加成功', {shift: -1, time: 500}, function () {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    });
                    parent.changeGridType();
                }
            } else {
                layer.msg('添加失败');
            }
        }
    });
}

function updateCompany() {
    var level = $("#level").val();
    var companyId = $("#companyId").val();
    var contacts = $("#contacts").val();
    var phone = $("#phone").val();
    var minStation = $("#minStation").val();
    var companyType = $("#companyType").val();
    var addressAll = $("#addressAll").val();
    var longitude = $("#longitude").val();
    var latitude = $("#latitude").val();
    var inspectionStartTime = $("#inspection_start_time").val();
    var inspectionEndTime = $("#inspection_end_time").val();
    var interval1 = $("#interval").val();
    var remark = '';
    if (interval1.length = 0 || interval1 == 0) {
        interval1 = 2;
    }
    var interval = interval1 * 60;

    if (level === '1'){
        remark = editor.txt.html()
        inspectionStartTime = '';
        inspectionEndTime = '';
        interval = '';
    }
    /*if (level === '2'){
        inspectionStartTime = '';
        inspectionEndTime = '';
        interval = '';
    }*/

    if (level === '3'){
        remark = '';
        if (minStation === undefined || minStation === ''){
            layer.msg("请选择是否创建了微型消防站");
            return;
        }
    }
    if (inspectionStartTime !== '' || inspectionEndTime !== ''){
        if (inspectionStartTime !== '' && inspectionEndTime === ''){
            layer.msg("请填写巡检结束时间");
            return;
        }
        if (inspectionStartTime === '' && inspectionEndTime !== ''){
            layer.msg("请填写巡检开始时间");
            return;
        }
        inspectionStartTime = "1970-01-01 " + inspectionStartTime + ":00";
        inspectionEndTime = "1970-01-01 " + inspectionEndTime + ":00";
    }
    var param = {
        "companyId": companyId,
        "userTel": phone,
        "userName": contacts,
        "minStation": minStation,
        "companyType":companyType,
        "address":addressAll,
        "companyLat": latitude,
        "companyLng": longitude,
        "inspectionStartTime": inspectionStartTime,
        "inspectionEndTime": inspectionEndTime,
        "interval" : interval,
        "remark" : remark
    };

    console.log(JSON.stringify(param));
    $.ajax({
        url: "/skynet/web/fire/inspectionUnit/update",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (msg) {
            if (msg) {
                $.ajax({
                    url: "/skynet/web/fire/inspectionUnitLists?start=1",
                    type: "POST",
                    success: function (data) {
                        $("#content_main", parent.document).html(data);
                    }
                });
                if (msg.status == false) {
                    layer.msg(msg.error);
                } else {
                    parent.layer.msg('修改成功', {shift: -1, time: 500}, function () {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    });
                }
            } else {
                layer.msg('修改失败');
            }
        }
    });
}