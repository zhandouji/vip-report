/**
 * 非接警台模块，用户接警历史
 */
//报警历史查询功能的命名空间
var userAlarmHistory = {
	
	initGroup : function(){//初始化报警历史查询的所属单位数据
		//获取区县单位，用于所属单位。辖区单位
		var types = [1,14];//1市（区、分）局,2	派出所,14县局,16巡区,15警务站
		types = JSON.stringify(types);
		$.ajax({
			type:"post",
			url:BASESERVLET+"/api/getGroupsByTypes",
			data:types,
			contentType:"application/json",
			dataType:"json",
			success:function(data){
				if(!data.status){
					layer.msg("获取所属单位信息失败："+data.error);
					return;
				}
				var list = data.list;
				var $ah_group = $("#ah_group");//所属单位
				var dw;
				//添加所属单位，并收集派出所，警务室
				for(var i=0; i<list.length; i++){
					dw = list[i];
					$ah_group.append('<option value="'+dw.id+'" code="'+dw.code+'">'+dw.name+'</option>');
				}
			}
		});
	},
	initType : function(){
		//获取警情类别，警情级别
		$.ajax({
			url:BASESERVLET+"/api/dict/caseCause",
			type:"get",
			dataType:"json",
			success:function(data){
				console.log(data);
				if(!data.status){
					layer.alert("获取警情类别，警情级别失败："+data.error);
					return;
				}
				//警情类别
				var jqlbMap = data.obj;
				//警情类别
				var $caseType = $("#ah_type");
				var level1s = jqlbMap.level1List;
				for(var i=0; i<level1s.length; i++){
					var eve = level1s[i];
					if(eve.jz==1){
						$caseType.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
					}
				}
				var $caseType2 = $("#ah_type2");
				var $caseType3 = $("#ah_type3");
				var $caseType4 = $("#ah_type4");
				var map234 = jqlbMap.causeMap;
				$caseType.change(function(){
                    $caseType2.empty();
                    $caseType3.empty();
                    $caseType4.empty();
					var selVal = $caseType.val();
					if(!selVal){
						return;
					}
					var tmpList = map234[selVal];
					if(tmpList && tmpList.length>0){
						for(var i=0; i<tmpList.length; i++){
							var eve = tmpList[i];
							$caseType2.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
						}
                        $caseType2.change();
					}
				});
				$caseType2.change(function(){
                    $caseType3.empty();
                    $caseType4.empty();
					var selVal = $caseType2.val();
					if(!selVal){
						return;
					}
					var tmpList = map234[selVal];
					if(tmpList && tmpList.length>0){
						for(var i=0; i<tmpList.length; i++){
							var eve = tmpList[i];
							$caseType3.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
						}
                        $caseType3.change();
					}
				});
				$caseType3.change(function(){
                    $caseType4.empty();
					var selVal = $caseType3.val();
					if(!selVal){
						return;
					}
					var tmpList = map234[selVal];
					if(tmpList && tmpList.length>0){
						for(var i=0; i<tmpList.length; i++){
							var eve = tmpList[i];
							$caseType4.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
						}
					}
				});
				
			}
		});
	}
};

$(function(){
	//初始化所属单位
	userAlarmHistory.initGroup();
	//初始化警情分类
	userAlarmHistory.initType();
	
	
	
	//关键字查询,
	//返回值的类型：dataType: "html",
	//此方法重点在于传值，参数定义，如：data:"keyWord="+keyWord+"&startTime="+startTime+"&endTime="+endTime
	//最终结果返回的是一个html页面
	// $("#alarm_bt").click(function(){
	$("#alarm_bt_userHistory").click(function(){


		// alert("根据条件查询历史报警信息");
		checkData(1);
	});
    //加入黑名单
    $("#add_blacklist").click(function(){
        var uid = $("#uid").val();
        if(!uid){
            layer.msg("没有报警人信息");
            $(".layui-layer-content").css("color","#FFF");
            return;
        }
        layer.open({
            type: 2,
            title: "加入黑名单",
            shadeClose: true,
            shade: 0.3,
            area: ['400px', '200px'],
            content: ["/skynet/web/alarmBlacklist/toAddPage?userId="+uid]
        });
    });
	//设置今日报警为红背景
	userAlarmHistory.d = new Date().format("yyyy-MM-dd");
	checkData(1);
});

//分页查询
function checkData(targetPageNumber){
	
	var pageSize = 10;//每页查询数量
	var param = {};
	param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
	param.rows = pageSize;
	
	var keyWord = $("#keyWord").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var alarmType = $("#ah_type").val();
	var alarmType2 = $("#ah_type2").val();
	var alarmType3 = $("#ah_type3").val();
	var alarmType4 = $("#ah_type4").val();
	var status = $("#ah_status").val();
	
	if(keyWord){
		param.keyword = keyWord;
	}
	if(startTime){
		param.startDate = startTime+".000";
	}
	if(endTime){
		param.endDate = endTime+".000";
	}
	if(alarmType){
		param.type = Number(alarmType);
	}
	if(alarmType2){
		param.type = Number(alarmType2);
	}
	if(alarmType3){
		param.type = Number(alarmType3);
	}
	if(alarmType4){
		param.type = Number(alarmType4);
	}
	param.status = status;
	//var indexOfLayer = layer.load(2, {time:10000});
	$("#alarm_tab_div").html('');
	
	param = JSON.stringify(param);
	
	var uid = $("#uid").val();
	
	$.ajax({
		url:BASESERVLET+"/web/alarmHistory/"+uid,
		type:"post",
		contentType:"application/json",
		dataType: "html",
		//data:"keyWord="+keyWord+"&startTime="+startTime+"&endTime="+endTime+"&type="+alarmtype,
		data:param,
		success:function(data){
			//layer.close(indexOfLayer);
			$("#alarm_tab_div").html(data);
			$(".myDate").each(function () {
                if ($(this).attr('time') == getCurrentDate()){
					$(this).append("<span class='today'>今</span>")
                }
            })
		}
	});
}

//时间
function changeTime(){
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
}

// 获取当前日期（例如：2017-07-08）
function getCurrentDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + "-" + month + "-" + strDate;

    return currentdate;
}