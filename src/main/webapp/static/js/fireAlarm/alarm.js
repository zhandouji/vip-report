
//报警历史查询功能的命名空间
var alarmHistory = {
	
	initGroup : function(){//初始化报警历史查询的所属单位数据
		//获取区县单位，用于所属单位。辖区单位
		var types = [5];//5 消防
		types = JSON.stringify(types);
		$.ajax({
			type:"post",
			url:BASESERVLET+"/api/getGroupsByTypes",
			data:types,
			contentType:"application/json",
			dataType:"json",
			success:function(data){
				if(!data.status){
					layer.msg("获取出警单位失败："+data.error);
					return;
				}
				var list = data.list;
				var $police_group = $("#police_group");//辖区单位
                $police_group.empty().append("<option value=\"\">--请选择--</option>");
				//添加所属单位，并收集派出所，警务室
				for(var i=0; i<list.length; i++){
					$police_group.append('<option value="'+list[i].id+'" code="'+list[i].code+'">'+list[i].name+'</option>');
				}
			}
		});
	},
	initType : function(){
		//获取警情类别，警情级别
		$.ajax({
			url:BASESERVLET+"/api/dict/fireType",
			type:"get",
			dataType:"json",
			success:function(data){
				console.log(data);
				if(data == ""){
					layer.alert("获取警情分类，状态，报警方式失败："+data.error);
					return;
				}else{
                    var fireType = data.fireType;
                    console.log(fireType);
                    $("#fireType").empty().append("<option value=\"\">--请选择--</option>");
                    for(var i in fireType){
                        $("#fireType").append("<option value ="+ i +">"+ fireType[i].desc +"</option>");
                    }
                    var fireCallAlarmType = data.fireCallAlarmType;
                    $("#fireCallAlarmType").empty().append("<option value=\"\">--请选择--</option>");;
                    for(var i in fireCallAlarmType){
                        $("#fireCallAlarmType").append("<option value ="+ i +">"+ fireCallAlarmType[i].desc +"</option>");
                    }
                    var fireAlarmCaseStatus = data.fireAlarmCaseStatus;
                    $("#fireAlarmCaseStatus").empty().append("<option value=\"\">--请选择--</option>");;
                    for(var i in fireAlarmCaseStatus){
                        $("#fireAlarmCaseStatus").append("<option value ="+ i +">"+ fireAlarmCaseStatus[i].desc +"</option>");
                    }
				}
			}
		});
	}
};

$(function(){
	//初始化所属单位
	alarmHistory.initGroup();
	//初始化警情分类
	alarmHistory.initType();
	//查询,
	$("#alarm_bt").click(function(){
		checkData(1);
	})
    //查看反馈单详情
 /*   $("#alarm_desc").click(function(){
        checkDesc();
    })*/
});
// //查看反馈单详情
// function checkDesc(handleId,feedbackId){
//     var indexOfLayer = layer.load(2, {time:10000});
//     $("#alarm_result_tab_div").html("");
//     param = JSON.stringify(param);
//
//     $.ajax({
//         url:BASESERVLET+"/web/fire/alarmDescription",
//         type:"get",
//         contentType:"application/json",
//         dataType: "html",
//         data:"handleId="+handleId+"&feedBackId="+feedbackId,
//         success:function(data){
// //			console.log(data);
//             layer.close(indexOfLayer);
//             $("#alarm_result_tab_div").html(data);
//         }
//     });
// }
//分页查询
function checkData(targetPageNumber){
	
	var pageSize = 10;//每页查询数量
	var param = {};
	param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
	param.rows = pageSize;
    param.group = $("#police_group").val();
    param.type = $("#fireType").val();
    param.status = $("#fireAlarmCaseStatus").val();
    param.mobile = $("#mobile").val();
    param.fireCallAlarmType = $("#fireCallAlarmType").val();
    param.address = $("#address").val();
    param.startDate = $("#startTime").val();
    param.endDate = $("#endTime").val();
	
	var indexOfLayer = layer.load(2, {time:10000});
	$("#alarm_tab_div").html("");
	
	param = JSON.stringify(param);
	
	$.ajax({
		url:"/skynet/web/fire/alarmlists",
		type:"post",
		contentType:"application/json",
		dataType: "html",
		data:param,
		success:function(data){
//			console.log(data);
			layer.close(indexOfLayer);
			$("#alarm_tab_div").html(data);
		}
	});
}

//详情页面 

function openDetails(id){
	layer.open({
	    type: 2,
	    title: "警情详情",
	    shadeClose: true,
	    shade: 0.3,
	    area: ['80%', '90%'],
	    content: BASESERVLET+"/web/fire/alarmdetails/"+id
	});
}
function askForHelp(id){
    layer.open({
        type: 2,
        title: "调度",
        shadeClose: true,
        shade: 0.3,
        area: ['1100px', '600px'],
        content: BASESERVLET+"/web/fire/dispatchAgain?caseId="+id
    });
}

/*function askForNextHelp(caseId){
    var handle={};
    handle.group={id:$('#select').val()};

    var a_h_group= $("#a_h_group").val();
    var a_h_vehicle_list= $("#a_h_vehicle_list").val();
    var a_h_num= $("#a_h_num").val();
    var a_h_equipment_list= $("#a_h_equipment_list").val();
    var a_h_content= $("#a_h_content").val();
	var a_d_link1_list= $("#a_d_link1_list").val();
    var a_d_link2_list= $("#a_d_link2_list").val();
    var a_d_link3_list= $("#a_d_link3_list").val();
    var a_d_link4_list= $("#a_d_link4_list").val();
	$.ajax({
		url:"/skynet//web/fire/AskforHelp/"+caseId,
		type:"post",
		dataType: "json",
		data:{caseId:caseId,group:a_h_group,policeNumber:a_h_vehicle_list,equipments:a_h_equipment_list,suggest:a_h_content,jointLogisticsUnit:a_d_link1_list,
            emergencyLinkageUnit:a_d_link2_list,enterpriseTeam:a_d_link3_list,expert:a_d_link4_list},
		success:function(data){
			parent.layer.msg('调度成功', {shift: -1,time:1000},function(){
				layer.close();
			});
		}
	});
}*/

//无效报警删除
/*function openDelete(id) {
    $.ajax({
    	url:BASESERVLET+"/web/fire/deleteInvalidAlarm/"+id,
		type:"get",
		success:function (data) {
    		if(data.status&&data.obj.delete==1){
				layer.msg("删除成功");
                checkData(1);
            }
        }
	})
}*/

//时间
function changeTime(){
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
}

