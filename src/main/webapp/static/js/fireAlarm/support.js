//------------处警单-------------//
APP119.mods["alarmHandle"].gids=[];
APP119.mods["alarmHandle"].init = function(){
	var groupId = $("#currentLoginUserMainGroup").val();
	var roleId = $("#currentLoginUserRole").val();
	//UserOperation.ASSIGN_PATROL = 3 //分配出警的权限
	//查询登录用户可分配的出警单位
	$.ajax({
		url:BASESERVLET+"/api/getGroupPermission/"+groupId+"/"+roleId+"/3",
		type:"get",
		dataType:"json",
		success:function(data){
			if(!data.status){
				layer.alert("获取可以分配出警的单位失败："+data.error);
				return;
			}
			console.log("获取单位角色的可操作的处警单位：%o", data);
			var list = data.obj.allow;
			if(!list){
				//如果没有可以操作的单位，返回
				return;
			}
			
			var gids = APP119.mods["alarmHandle"].gids;//可以派警的机构组的id
			for(var i=0; i<list.length; i++){
				var g = list[i];
				g = JSON.parse(g);
				gids.push(g.id);
			}
			
			//初始化显示可以派警的单位
			APP119.mods["alarmHandle"].initShow(gids);
		}
	});

	//选择单位操作
	$("#alarmHandleDiv").on("click", "span", function(){
		var span = $(this);
		if(span.hasClass("selected")){
			return;
		}
		var gid = span.attr("gid");
		var name = span.text();
		// var html = '<tr><td class="selectedUnit" gid="'+gid+'">'+name+'</td><td><span class="glyphicon glyphicon-remove remove"></span></td></tr>';
		var html = '<div class="teams2" gid="'+gid+'"gName="' + name + '"><span>' + name + '</span><button class="delete"></button></div>';

		$("#selectedUnitTbody").append(html);
		span.css({
                "border-color": "#e5621b",
                "background-color": "#f2dbce",
                "color": "#e5621b",
                "pointer-events": "none"
            });
		span.addClass("selected");
	});

    //点击x号按钮删除该选中所队
    $(".checked-teams").on("click", ".delete", function() {
        var text = $(this).parent().children("span").text();
        for(var i = 0; i < $(".unit-label>span").length; i++) {
            if($(".unit-label>span").eq(i).text() == text) {
                $(".unit-label>span").eq(i).css({
                    "border-color": "#dcdcdc",
                    "background-color": "#fff",
                    "color": "#333",
                    "pointer-events": "auto"
                });
                $(".unit-label>span").eq(i).removeClass("selected");
            }
        }
        $(this).parent().remove();

    });

    //重置按钮样式
    $(".clear-all").click(function() {
        $(".unit-label>span").css({
            "border-color": "#dcdcdc",
            "background-color": "#fff",
            "color": "#333",
            "pointer-events": "auto"
        });
        $(".unit-label>span").removeClass("selected");
        $(".checked-teams").children().remove();
    });
    //单条派警信息展示
    $("#groupSaveBtn").click(APP119.mods["alarmHandle"].groupSave);
	//保存接警单、处警单
	$("#handleSaveBtn").click(APP119.mods["alarmHandle"].save);
	APP119.mods["alarmHandle"].saving = false;
};
/*处警单结束*/


//通过输入框输入文本，搜索对应的出警单位
APP119.mods["alarmHandle"].search = function(){
	var text = $("#unitSearch").val();
	console.log(text);
	text = $.trim(text);
	$.each($("#alarmHandleDiv span"),function(i, span){
		span = $(span);
		if(span.text().indexOf(text)<0){
			// span.addClass("hide");
			span.hide();
		}else{
			span.show();
		}
	});
};
APP119.mods["alarmHandle"].initShow = function(gids){
	gids = JSON.stringify(gids);
	$.ajax({
		type:"post",
		url:BASESERVLET+"/api/group/simple/list",
		data:gids,
		contentType:"application/json",
		dataType:"json",
		success:function(data){
			if(!data.status){
				return;
			}
			var list = data.list;
			var html = '';
			for(var i=0; i<list.length; i++){
				var g = list[i];
                $('#a_h_group').append('<option value="'+g.id+'">'+g.name+'</option>');
			}
		}
	});
	//更换出警单位时更新车辆和器材
    $('#a_h_group').change(function () {
		if($(this).val()) {
            // 加载类型车辆或是器材
            $.ajax({
                type: "POST",
                url: BASESERVLET + "/web/fireEquipment/select",
				data:"groupId="+$(this).val(),
                dataType: "json",
                success: function (data) {
                    console.info(data);
                    var vehicle = data.vehicle;
                    $("#a_h_vehicle_list").empty();
                    for(var i = 0; i< vehicle.length; i++){
                        $("#a_h_vehicle_list").append('<li><span>'+ vehicle[i].name+'-'+vehicle[i].number +'</span><div class="checkbox-box1">'
							+'<input type="checkbox" name="cheliang" value="'+vehicle[i].id+'"/></div></li>');
                    }
                    var equipment = data.equipment;
                    $("#a_h_equipment_list").empty();
                    for(var i = 0; i< equipment.length; i++){
                        $("#a_h_equipment_list").append('<li><span>'+ equipment[i].name+'-'+equipment[i].number +'</span><div class="checkbox-box1">'
                            +'<input type="checkbox" name="qicai" value="'+equipment[i].id+'"/></div></li>');
                    }
                    $("#a_h_vehicle_list li").on("click", function() {
                        $(this).find(".checkbox-box1").toggleClass("checkbox1-checked");
                        if($(this).find("input[type='checkbox']").attr("checked")){
                            $(this).find("input[type='checkbox']").attr("checked",false);
                        }else{
                            $(this).find("input[type='checkbox']").attr("checked",true);
                        }
                    });
                    $("#a_h_equipment_list li").on("click", function() {
                        $(this).find(".checkbox-box1").toggleClass("checkbox1-checked");
                        if($(this).find("input[type='checkbox']").attr(":checked")){
                            $(this).find("input[type='checkbox']").attr("checked",false);
                        }else{
                            $(this).find("input[type='checkbox']").attr("checked",true);
                        }
                    });
                }
            });
		}
    });
    //初始化社会单位
    $.ajax({
        type: "POST",
        url: BASESERVLET + "/web/fire/linkageGroup/list?start=1",
        data:"type=0",
        dataType: "json",
        success: function (data) {
            if(data.status){
                var list = data.list;
                for(var i = 0; i< list.length; i++) {
                    $('#a_d_link'+list[i].type+'_list').append('<li><span>'+ list[i].name+'</span><div class="checkbox-box1">'
                        +'<input type="checkbox" name="link'+list[i].type+'" value="'+list[i].id+'"/></div></li>');
                }
                $(".a_d_link li").on("click", function() {
                    var checkImg = $(this).find(".checkbox-box1")
                    checkImg.toggleClass("checkbox1-checked");
                    var check = $(this).find("input[type='checkbox']");
                    var linkId = check.val();
                    if(check.attr("checked")){
                        check.attr("checked",false);
                        $('#'+linkId).remove();
                    }else{
                        check.attr("checked",true);
                        var checkName = check.parent().parent().find('span:first').html();
                        var html = '<div class="personnel-box1" id="'+linkId+'" name="' + checkName + '"><span class="hj-delete-span"></span>'+ checkName + '</div>';
                        $('#personnel_div').append(html);
                        $('#'+linkId+' .hj-delete-span').on("click",function(){
                            $('#'+linkId).remove();
                            checkImg.removeClass("checkbox1-checked");
                            check.attr("checked",false);
                        });
                    }
                });
            }
        }
    });


};

/**
 * 保存接警单和处警单
 */
APP119.mods["alarmHandle"].save = function(){

    //下面这句代码暂时需要 alarmHandle和alarmCase必须在一个页面
    var alarmInfo = APP119.callModFun("alarmCase", "getData");//APP119.mods["alarmCase"].getData();
    var valid = Number(alarmInfo.status)==2;//确认出警
	APP119.mods["alarmHandle"].saving = true;
	var alarmHandle = {};
	var gid;
    var caseId=$('#caseId').val();
    var groupIds=$("#personnel_div div");
    var arr = [];
    for (var i=0;i<groupIds.length;i++)
    {
        arr.push(groupIds.eq(i).attr("id"));
    }
    alarmHandle.groupId=arr;
    var gidDom = $("#shebei_div div");
	if(gidDom[0]!=null){
        $.each($(gidDom), function(i){
            var su = $(this);
            console.log(su);
            gid = {
            	id:su.attr("gid"),
				name:su.attr("gname")
			};
            console.log("gid" + gid);
            if(!gid || gid.length==0){
                    gid = {id:"", name:""};
            }
            alarmHandle.group = gid;
            var fireEngines = [];
            var vid = su.attr("vid");
            var vids = vid.split(',');
            for(var i=0;i<vids.length;i++) {
                fireEngines.push({
                    id:vids[i]
                });
			}
            alarmHandle.fireEngines = fireEngines;
            var equipments = [];
            var eid = su.attr("eid");
            var eids = eid.split(',');
            for(var i=0;i<eids.length;i++) {
                equipments.push({
                    id:eids[i]
                });
            }
            alarmHandle.equipments = equipments;
            alarmHandle.policeNumber = su.attr("num");
            alarmHandle.suggest = su.attr("content");
            alarmHandle.caseId=caseId;
            APP119.mods["alarmHandle"].saveAlarmCase(alarmHandle);
            return;
        });
        //社会单位配合消防灭火（可选）
        /*var perDom = $("#personnel_div div");
        if(perDom.length>0) {
            $.each($(gidDom), function(i){
                var su = $(this);
                console.log(su);
                gid = {
                    id:su.attr("id"),
                    name:su.attr("name")
                };
                console.log("gid" + gid);
                alarmHandle.group = gid;
                APP119.mods["alarmHandle"].saveAlarmCase(alarmHandle);
                return;
            });
        }*/
    }else{
        alarmHandle.group = {id:"", name:""};
        APP119.mods["alarmHandle"].saveAlarmCase(alarmHandle);
    }

};
//保存派警信息
APP119.mods["alarmHandle"].groupSave = function(){
	var html_per = '<div class="shebei-box1" ';
	var html = '><span class="hj-delete-span"></span>';
    var groupId = $('#a_h_group').val();

    var groupName = $('#a_h_group').find('[value='+groupId+']').html();
    html += groupName + ';'
    html_per += 'gid="'+groupId+'" gname="'+groupName+'"';

	var vid='';
    $('#a_h_vehicle_list').find('input[checked=checked]').each(function (index,element) {
        if(index != 0) {
            html += ',';
            vid += ',';
        }
        html += $(this).parent().parent().find('span:first').html();
        vid += $(this).val();
    });
    html_per += 'vid="'+vid+'" ';
    html += ';';
    var eid='';
    $('#a_h_equipment_list').find('input[checked=checked]').each(function (index,element) {
    	if(index != 0) {
            html += ',';
            eid += ',';
		}
        html += $(this).parent().parent().find('span:first').html();
        eid += $(this).val();
    });
    html_per += 'eid="'+eid+'" ';
    html += ';';
    var num = $('#a_h_num').val();
    html_per += 'num="'+num+'" ';
    html += '出警人数'+num+'人;';
    var content = $('#a_h_content').val();
    html_per += 'content="'+content+'" ';
    html += content +';';
    html += '</div>';
    $('#shebei_div').append(html_per+html);
    //点击删除按钮删除添加的内容
    $(".hj-delete-span").on("click",function(){
        $(this).parent().remove();
    });
}

APP119.mods["alarmHandle"].saveAlarmCase = function(data){
    data.caseId=document.getElementById("caseId").value;
    var groupIds=$("#personnel_div div");
    var arr = [];
    for (var i=0;i<groupIds.length;i++)
    {
        arr.push(groupIds.eq(i).attr("id"));
    }
    data.groupId=arr;
	var pdata = JSON.stringify(data);
	$.ajax({
		type:"post",
		url:BASESERVLET+"/web/fire/dispatchSave",
		data:pdata,
		contentType:"application/json",
		dataType:"json",
		success:function(data){
			//APP119.mods["alarmHandle"].saving = false;
			layer.close(APP119.mods["alarmHandle"].saveLayerIndex);
			if(!data.status){
				layer.alert(data.error);
				return;
			}
			layer.alert("再次调度成功", {icon:1});

			APP119.mods["chat"].sendMsg(note,0);
            if (MyJanus.handle) {
                console.log(MyJanus.handle);
                MyJanus.handle.hangup();
            }
			alarmEndReset();//初始化
			$('#videoremote1').empty();
			$('#videolocal').empty();
			$('#remote2').empty();
			$('#remote3').empty();
			$('#remote4').empty();
            $(".unit-label>span").css({
                "border-color": "#dcdcdc",
                "background-color": "#fff",
                "color": "#333",
                "pointer-events": "auto"
            });
            $(".unit-label>span").removeClass("selected");
            $(".checked-teams").children().remove();
		}
	});
};

/**
 * 重置
 */
APP119.mods["alarmHandle"].reset = function(){
    $("#shebei_div").empty();
    $("#a_h_num").val('');
    $("#a_h_content").val('');
    $("#a_h_vehicle_list").find('input[type=checkbox]').attr("checked",false);
    $("#a_h_equipment_list").find('input[type=checkbox]').attr("checked",false);
    $(".checkbox1-checked").removeClass("checkbox1-checked");
	APP119.mods["alarmHandle"].saving = false;
}

//选择派出所派警
APP119.mods["alarmHandle"].dispatch = function(data){
	if(data){
		for(var i=0;i<data.length;i++) {
            var gid = data[i];
			var selector = $("#selectedUnitTbody .teams2[gid="+gid+"]");
            if(selector.length > 0) {
            	continue;
			} else {
            	console.log($("#alarmHandleDiv .teams1[gid="+gid+"]"));
                $("#alarmHandleDiv .teams1[gid="+gid+"]").trigger("click");
			}
		}
	}
}

$(function(){
    APP119.mods["alarmHandle"].init();
})
//------------处警单-------------//