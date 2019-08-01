/**
 * 保存框架主页用到的javascript
 */

$(initMain);//页面加载完成调用

var currentMMR;//当前主要页面顶部的菜单请求对象

var dmenu; //顶部菜单按钮
var lymenu;//左侧一级菜单按钮
var lsmenu;//左侧二级菜单按钮

/**
 * 初始化main页面的javascript
 */
function initMain(){

	/**
	 * jQuery 的ajax请求的默认错误处理器，处理服务器错误、断开连接等情况；
	 * 如有其他需求，可在具体ajax方法中覆盖
	 */
	jQuery.ajaxSetup({
		cache:true,
		error:function(err,err1,err2){
			var msg;
			if(!err){
				msg = "连接服务器失败，请检查网络";
				layer ? layer.alert(msg, {icon:0}) : alert(msg);
				return;
			}
			msg = err.responseText;
			console.log("error",msg);
			//layer ? layer.alert(msg, {icon:0}) : alert(msg);
		}
	});
	
	$("#logoutBtn").click(function(){
		location.href = BASESERVLET+"/web/logout";
	});
	
	//左侧一级菜单点击事件
	left_yiji();

	//顶部菜单点击事件
	$("#header_menu li").on("click", function(){
		if($(this).hasClass("current_top")){
			//当前菜单处于选中状态不处理
			return;
		}
		$(".header_nav li").removeClass("current_top");
		$(this).addClass("current_top");
		var menu_dom = $(this).find("a");
		dmenu = menu_dom.text();

		leftchange(menu_dom.attr("menu"));

	})


	//左侧一级菜单点击事件
	function left_yiji(){
		$("#left_xxx").on("click","li",function(event){
			var li = $(this);

			if(li.has("ul").length){
				//点击一级菜单，是二级菜单的展开与闭合
                if(clicknum == 1) {
                    //$(".menu-hidden").trigger('click');
                    //$("#left_xxx").find(".hidden-li").removeClass("hidden-li");
				}
				var level2as = li.find("ul").first();
				if(level2as.is(":hidden")){
					$(".sub-menu-list").hide();
                    li.find(".icon-right").first().removeClass("fa-angle-right").addClass("fa-angle-down");
					level2as.show();
				}else{
                    li.find(".icon-right").first().removeClass("fa-angle-down").addClass("fa-angle-right");
					level2as.hide();
				}
			}else{
				//没有二级菜单或者点击二级菜单
				var level2 = li.parent(".sub-menu-list");//取直接上级;
				if(level2.length){
					//点击的是二级菜单，选中二级菜单
					$(".checked-li").removeClass("checked-li");
					li.addClass("checked-li");
                    level2.parent("li").addClass("checked-li");
				// }else{
					//点击的是一级菜单，关闭其他二级菜单，添加选中效果
					// $("#left_xxx .level2a").hide();
					// li.siblings().removeClass("current_left");
					// li.addClass("current_left");//添加选中效果
				}
				var a = li.find("a");
				var href = a.attr("href");
				lymenu = a.text();
                dmenu = li.parent().prev().find("span").text();
				content_topchange(href,dmenu,lymenu,lsmenu);


				var iframe = a.attr("iframe");
				if(iframe=="true"){
					event.stopPropagation();
					event.preventDefault();
					$("#content_main").html('<iframe style="width:100%;height:100%;margin:0;padding:0;border:0;background:transparent;" src="'+href+'"></iframe>')
					return;
				}
				if(!href || /javascript:\s*;*/.test(href)){
					return;
				}
				if(href.indexOf("javascript:")>=0){
					//js方法，自动执行
				}else{
					//url，阻止默认事件执行
					event.stopPropagation();
					event.preventDefault();
					mainchange(href);//显示到主页面
				}
			}
		});

	}

	//$("#header_menu li:eq(0)")[0].click();
    leftchange();

    //更新用户头像
    var current_user_id = $('#current_user_id').val();
    $.ajax({
        url:BASESERVLET+"/api/userpic/"+current_user_id,
        type:"get",
        dataType:"json",
        success:function(data){
            if(!data.status){
                console.log("获取用户头像失败："+data.error);
                return;
            }
            var face_url = '/theme/img/jiejingtai/right-head.jpg';
            // var icon_url = '/theme/img/jiejingtai/right-head.jpg';
            if(data.obj != null){
                var pics = data.obj;
                // if($.trim(pics.icon)!='') {
                //     icon_url = pics.icon;
                // }
                if($.trim(pics.face)!='') {
                    var file = pics.face.split("/");
                    face_url = BASESERVLET + '/web/file/' + file[file.length-1];
                }
            }
            $('#current_user_img').val(face_url);
        }
    });
}


//左侧菜单内容改变
function leftchange(){
	var left_a = $("#left_xxx");
	left_a.empty();//清空主业务展示区原来的菜单

	//加载中效果
	//spin.js
	left_a.load(
		BASESERVLET+"/web/menu",
		{},
		function(){
			//菜单效果
            initIndex();
            //取左侧[0]
			left_a.find("li a:first")[0].click();
		}
	);
}

//content_top内容
function content_topchange(menu,dmenu,lymenu,lsmenu){
	//var _content_top = $("#top_menu");
	//_content_top.html("");
	//_content_top.html('<div class="left_a pull-left" id="arrow"></div><ol class="breadcrumb"><li><a href="#"><span class="glyphicon glyphicon-home">&nbsp;</span>'+dmenu+'</a></li><li id="secondli"><a href="#"></span>'+lymenu+'</a></li><li class="active"></li></ol>');
    $("#firstli").html(dmenu);
    $("#secondli").html(lymenu);
}

//main中主要内容显示
function mainchange(url){
	var layerIndex = layer.load(2);//time参数，最多等待十秒
	$.ajax({
		type:"get",
		url:url,
		dataType:"html",
		success:function(data){
			layer.close(layerIndex);
			$("#content_main").html(data);
		}
	});
}
function jblb(){
    $.ajax({
        type:"get",
        url:BASESERVLET+"/api/getcluelist/"+1,
        dataType:"json",
        success:function(data){
           var list=data.list;
            var htm = '<br/><table class="table table-hover table-bordered table-striped" style="background:#8ab5ce; white-space: nowrap;"><thead style="color: #fff;"><tr><th>类别</th><th>内容描述</th> <th>地址</th> <th>事发时间</th> <th>举报人</th> <th>状态</th> <th>操作</th></tr></thead>';
			htm+='<tbody style="background: #e7eef4;"> ';
            for(var i = 0;i<list.length;i++){
				var obj=list[i];
				var ty='';
				if(obj.type==0){
						ty="卖淫嫖娼";
				}else if(obj.type==1){
					ty="赌博";
				}else if(obj.type==2){
					ty="违规养犬";
				}else if(obj.type==3){
					ty="违法小广告";
				}else if(obj.type==4){
                    ty="精神病人违规出丑";
                }else if(obj.type==5){
                    ty="保安不按规定着装";
                }else if(obj.type==6){
                    ty="影响校园周边安全";
                }else if(obj.type==7){
                    ty="默认违规行为";
                }
                var status='';
                if(obj.status==1){
					status="已举报";
				}else if(obj.status==2){
					status="已处理";
				}else if(obj.status==3){
                    status="已反馈";
                }else if(obj.status==4){
                    status="已经奖励";
                }else if(obj.status==5){
                    status="已经处罚";
                }else if(obj.status==6){
                    status="已删除";
                }
                var text="";
                if(null!=obj.content) {
                    if (obj.content.length <= 10) {
                        text = obj.content;
                    } else if (obj.content.length > 10) {
                        text = obj.content.substring(0, 11);
                        text += "...";
                    }
                }
				htm+='<tr><td>'+ty+'</td><td>'+text+'</td><td>'+obj.occurAdress+'</td><td>'+obj.occurTime+'</td>';
				htm+='<td>'+obj.createName+'</td><td>'+status+'</td><td><a id="'+obj.id+'" href="javascript:;" onclick="detilClick(this.id)">详情</a></tr>';
			}
            htm+='</tbody></table>';
            $("#content_main").html(htm);
        }
    });
}
function detilClick(id){
    layer.open({
        type:2,
        title:'详情',
        shadeClose:true,
        shade:0.8,
        area:['800px','85%'],
        content:BASESERVLET+"/web/getClueInfo/"+id
    })
}
