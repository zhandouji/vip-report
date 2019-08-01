
//报警历史查询功能的命名空间
var alarmHistory = {
	
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
				var $ah_group = $("#ah_group");//辖区单位
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
	alarmHistory.initGroup();
	//初始化警情分类
	alarmHistory.initType();
	
	
	//checkData(1);
	
	//关键字查询,
	//返回值的类型：dataType: "html",
	//此方法重点在于传值，参数定义，如：data:"keyWord="+keyWord+"&startTime="+startTime+"&endTime="+endTime
	//最终结果返回的是一个html页面
	/*$("#alarm_bt").click(function(status){
		checkData(1,status);
	})*/
});

//分页查询....参数1：页数，参数2：状态------在alarm.jsp中点击“查询”调用
function checkData(targetPageNumber){
	var pageSize = 10;//每页查询数量
	var param = {};
	param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
	param.rows = pageSize;
	
	var keyWord = $("#keyWord").val().trim();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var alarmType = $("#ah_type").val();
	var alarmType2 = $("#ah_type2").val();
	var alarmType3 = $("#ah_type3").val();
	var alarmType4 = $("#ah_type4").val();
	var mobile = $("#ah_mobile").val().trim();
	var statuS = $("#ah_status").val();
	var group = $("#ah_group").val();
    var caseFrom = $("#caseFrom").val();

    if(startTime || endTime){
        if(!compareDate(endTime, startTime)){
            layer.alert("请选择正确的起止时间", {icon: 2});
            return;
        }
	}
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
    if(caseFrom){
        param.caseFrom = caseFrom;
    }

	param.group = group;
	param.status = statuS;
	param.mobile = mobile;
	
	var indexOfLayer = layer.load(2, {time:10000});
	$("#alarm_tab_div").html('');
	
	param = JSON.stringify(param);
	$.ajax({
		url:BASESERVLET+"/web/alarmlists",
		type:"post",
		contentType:"application/json",
		dataType: "html",
		//data:"keyWord="+keyWord+"&startTime="+startTime+"&endTime="+endTime+"&type="+alarmtype,
		data:param,
		success:function(data){
//			console.log(data);
			layer.close(indexOfLayer);
			$("#alarm_tab_div").html(data);
		}
	});
}

function compareDate(d1,d2)
{
    return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
}

//详情页面，iframe层
/*
function openDetails(id){
	layer.open({
	    type: 2,
	    title: "报警详情",
	    shadeClose: true,
	    shade: 0.3,
	    area: ['800px', '80%'],
	    content: BASESERVLET+'/web/alarmdetails/'+id 
	});
}
*/

//详情页面 

function openDetails(id){
//	$.ajax({
//		url:BASESERVLET+"/web/alarmdetails/"+id,
//		type:"get",
//		dataType: "html",
//		success:function(data){
//			$("#content_main").html(data);
//		}
//	});
	layer.open({
	    type: 2,
	    title: "警情详情",
	    shadeClose: true,
	    shade: 0.3,
	    area: ['80%', '80%'],
	    content: BASESERVLET+"/web/alarmdetails/"+id,
        cancel: function(index, layero){
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.releaseResource();
        }
    });
}

//无效报警删除
function openDelete(id) {
    $.ajax({
    	url:BASESERVLET+"/web/deleteInvalidAlarm/"+id,
		type:"get",
		success:function (data) {
    		if(data.status&&data.obj.delete==1){
				layer.msg("删除成功");
                checkData(1);
            }
        }
	})
}

//时间
function changeTime(){
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
}

function openVideo(caseId) {
    window.open(BASESERVLET +"/web/home?caseId="+caseId);
}

