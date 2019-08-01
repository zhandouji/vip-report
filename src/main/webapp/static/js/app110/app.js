/*
 * 接警台的主要js
 */

var APP110 = {
	isplay:false,//是否播放视频
	map:false,//百度地图对象
	noticeWin:{},//通知弹窗index
	noticeMap:{},//报警缓存
	chatMap:{},//文字聊天室缓存信息
	currentBjr:false,//当前报警人
	currentMedia:false,//当前处理的案件的MediaSessionBean对象
	currentCase:false,//当前处理的案件的case对象
	currentPatrol:false,//当前出警任务
	jjMarker:[],//警局的地图图标
	current:{
		screenSize:2,//当前使用的配置的屏幕数，默认2
		screenIndex:0,//当前屏幕的index。每个页面都持有各自的APP110
		screens:[],//缓存屏对象，用于传送数据
		screenConfig:false,//当前屏幕配置：APP110.screenMod的值
		mod2ScreenIndex:{},//模块在哪个屏
		cacheCmd:{}//缓存命令
	}//当前的配置！！！
};

/**
 * 模块，所有方法都应属于这里面的模块
 * 所有模块均需包含：init(页面打开时的初始化方法),reset（重置为原始<页面打开时>的） 方法
 */
APP110.mods = {
	consoleState:{},		//接警台状态操作：接警，暂停，停止接警
	screenBtn:{},	//多屏按钮
	notice:{},		//弹窗通知
	kurento:{},	//视频组件
	chat:{},		//聊天
	alarmCase:{},	//接警单
	map:{}, 		//地图
	person:{},		//报警人信息
	alarmHandle:{},	//处警单
	alarmHandlePush:{}	//处警推送
};

//哪几个屏幕有哪些模块
APP110.screenMod = [
    [],//共0个屏，无用，占位
	[],//共1个屏，暂不支持
	[
     	[
     	 	"consoleState", "screenBtn", "notice", "kurento",
     	 	"chat", "alarmCase", "alarmHandle", "person","alarmHandlePush"
     	],  
     	["map"] 
    ],//共2个屏幕配置
    [
      	["kurento", "map"],
      	["chat", "alarmCase"]
    ]//共3个屏幕，待测试
];


/**
 * 加载并缓存当前选中的（screenSize参数）屏幕配置
 * @param screenSize 屏幕数
 */
APP110.loadConfig = function(screenSize){
	APP110.current.screenSize = screenSize;
	APP110.current.screenConfig = APP110.screenMod[screenSize];//[[第1个屏幕对应的模块], [..]]
	var acs = APP110.current.screenConfig;
	for(var i=0; i<acs.length; i++){
		for(var j=0, acsi=acs[i]; j<acsi.length; j++){
			APP110.current.mod2ScreenIndex[acsi[j]] = i+1;// {模块名：屏幕index}//屏幕index从1开始
		}
	}
};

/**
 * 加载哪个屏幕，需要先调用APP110.loadConfig(x)来缓存配置
 * @param screenIndex 第几个屏幕，编号从1开始
 */
APP110.load = function(screenIndex){
	//获得屏幕的模块
	APP110.current.screenIndex = screenIndex; 
	
	var mods = APP110.current.screenConfig[screenIndex-1];
	for(var i=0; i<mods.length; i++){
		var m = APP110.mods[mods[i]];
		console.log(mods[i]+"模块初始化...");
		//调用模块的初始化方法
		APP110.callModFun(mods[i], "init");	
	}

    // 2017年7月4日，王亚良，添加接警员所在单位未完成报警总数
	// 需要定时出发该ajax调用方法刷新总数
    queryUnfinishedCaseCount();
    // 2017年7月5日，王亚良，定时触发ajax返回接警员所在单位未完成报警总数
    // var interval;
    // interval = setInterval(queryUnfinishedCaseCount, 10 * 1000);

	// 2017年7月5日，王亚良，默认隐藏未完成历史报警列表
    $("#alarm_tab_div_list").hide();

    var flag = false; // 默认flag为false，即未显示未完成报警列表，如果flag为true，即已经显示列表。

	// 显示未完成报警历史列表
	// 2017年7月5日，王亚良，添加未完成历史报警列表
    $("#alarm_bt_list").click(function(){
        if (!flag){
            checkData(1);
            flag = true;
            queryUnfinishedCaseCount();
        }
    })
}

function queryUnfinishedCaseCount() {
    $.ajax({
        url:BASESERVLET+"/web/queryUnfinishedCaseCount",
        type:"post",
        contentType:"application/json",
        dataType: "json",
        success:function(data){
        	$("#alarm_bt_list").attr('disabled', false);
            $("#jjydw-wwcbj").html(data); // 未完成报警总数
            // $("#wwcbj").html(data);
        }
    });
}

//----------调用模块方法-------------------
//用于引用多屏浏览器通讯的flash组件
function thisMovie(movieName){
	if (navigator.appName.indexOf("Microsoft") != -1){
		return window[movieName];
	}else{
		return document[movieName];
	}
}

APP110.callModFun = function(mod, fun){
	var args = Array.prototype.slice.call(arguments, 2);//剔除mod,fun后真正方法的参数数组
	console.log("mod:"+mod+", fun:"+fun+", args:"+args);
	//判断是否本页面的模块
	var ind = APP110.current.screenIndex;//当前页面的屏幕编号
	var modScreenIndex = APP110.current.mod2ScreenIndex[mod];//参数模块的屏幕编号
	
	//如果是，直接调用
	if(ind==modScreenIndex){
		return APP110.mods[mod][fun].apply(this, args);//apply参数是数组形式,this无意义不要使用
		return;
	}
	//如果不是，使用其他页面模块调用方法（flash或者localStorage方式）
	console.log("非本屏幕的模块方法，使用间接方法调用...");
    // if(isAbleMultiScreen) {
    //     //from:从哪里发出的消息；mod：模块名；fun：模块方法；args：方法参数;
    //     var cmd = {from: ind, mod: mod, fun: fun, args: args};
    //     //通过flash方案发送
    //     thisMovie("multiScreenConn").sendMsg(modScreenIndex, JSON.stringify(cmd));
    // }
	var cmd = {mod:mod, fun:fun, args:args?args:[]};
	var key = "app110.cmd."+(new Date().getTime());
	APP110.current.cacheCmd[key] = false;
	localStorage.setItem(key, JSON.stringify(cmd) );
};

//其他浏览器发送给本屏的消息处理
function dealMsg(msg){
	console.warn("接收到其他浏览器发来信息：%s", msg);
	var obj = JSON.parse(msg);
	var mod = obj.mod;
	var fun = obj.fun;
	var args = obj.args;
	APP110.mods[mod][fun].apply(this, args);
}

window.onstorage = function(e){
	console.log("localStorage改变。。。。o%", e);
	var key = e.key;
	if(key.indexOf("app110.cmd.")<0){
		return;
	}
	var newValue = e.newValue;
	if(newValue==null){
		//通知命令完成
		delete APP110.current.cacheCmd[key];

		//如果有命令队列，继续发送

		return;
	}

	//解析命令
	var nvo;
	try{
		nvo = JSON.parse(newValue);
	}catch(e){
		console.log(newValue);
		console.log("解析localStorage命令失败:"+e.message);
	}
	var screenIndex = APP110.current.mod2ScreenIndex[nvo.mod];
	if(screenIndex!=APP110.current.screenIndex){
		//不是给本页面的命令
		return;
	}

	// var oldValue = e.oldValue;
	localStorage.removeItem(key);//通知发送命令页
	APP110.mods[nvo.mod][nvo.fun].apply(this, nvo.args);
}
//----------调用模块方法-------------------


/**
 * 出警任务分发类型
 */
var ParticipantType = {
	"UNKNOWN":-1,
	"ADMINISTRATOR":1,//调度员
	"ADMINISTRATOR_GROUP":2,//调度员群组
	"APP_USER":3,//警员
	"APP_USER_GROUP":4//警员群组
};
/**用户类型*/
var DD_ROLE = {
	"0":"未知用户",
	"1":"普通用户",
	"2":"高级用户",
	"3":"警察",
	"4":"高级警察",
	"5":"调度中心管理员",
	"6":"调度中心超级管理员"
}



//--------公用方法---------------------
function getUserInfo(uid, callBack){
	$.ajax({
		type:"post",
		url:BASESERVLET+"/api/UserInfo",
		data:{userId:uid},
		success:function(data){
			console.log(data);
			
			callBack ? callBack(data) : "";
		}
	});
}

/**
 * 通知弹出，点击按钮后的处理方法
 * @param type 接受，拒绝
 * @param id 报警房间信息id
 * @returns
 */
function noticeHandler(type, id){
	APP110.mods["notice"].noticeHandler(type, id);
}

/**
 * 一个报警接警完毕后的初始化
 * @returns
 */
function alarmEndReset(){
	//notice 放最后因为notice会订阅报警通知，当全部组件重置完成时，会才订阅。
	var mods = ["kurento", "chat", "alarmCase", "person", "map",  "alarmHandle", "notice"];
	console.log("::::::::=>报警结束，重置组件：%o",mods);
	
	//重置全局变量
	APP110.noticeWin = {};//通知弹窗index
	APP110.noticeMap = {};//报警缓存
	APP110.chatMap = {};//文字聊天室缓存信息
	APP110.currentBjr=false;//当前报警人
	APP110.currentCase=false;//当前处理的案件
	
	for(var i=0; i<mods.length; i++){
		var mod = APP110.mods[mods[i]];
		APP110.callModFun(mods[i], "reset");
	}
}

// 分页查询
// 2017年7月5日，王亚良，添加未完成历史报警列表
function checkData(targetPageNumber){

    var pageSize = 10;//每页查询数量
    var param = {};
    param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = pageSize;

    var indexOfLayer = layer.load(2, {time:10000});
    $("#alarm_tab_div_list").html('');

    param = JSON.stringify(param);

    $.ajax({
        url:BASESERVLET+"/web/alarmUnfinishedLists",
        type:"post",
        contentType:"application/json",
        dataType: "html",
        data:param,
        success:function(data){
            layer.close(indexOfLayer);
            $("#alarm_tab_div_list").html(data);
            // alert("重新加载页面！");
        }
    });

    // $("#alarm_tab_div_list").show();
}

// 详情页面
// 2017年7月5日，王亚良，显示未完成历史列表下某一条信息的详情
function openDetails(id) {
    layer.open({
        type: 2,
        title: "警情详情",
        shadeClose: true,
        shade: 0.3,
        area: ['80%', '80%'],
        content: BASESERVLET + "/web/alarmdetails/" + id
    });
}

// 修改状态
// 2017年7月5日，王亚良，修改未完成报警状态为已完成
function updateAlarmStatus(id) {

    layer.confirm('确认修改状态为已完结吗?', {icon: 3, title:'提示'}, function(index){
        //do something
        $.ajax({
            url:BASESERVLET + "/web/alarmUpdateStatus/" + id,
            type:"post",
            contentType:"application/json",
            dataType: "text",
            success:function(data){ // 若更新成功返回1，更新失败返回0
				if ("1" == data){
                    layer.alert('修改成功！');
                    checkData(1);
                    queryUnfinishedCaseCount();
				} else {
                    layer.alert('修改失败！');
				}

            }
        });

        layer.close(index);
    });
}

/**
 * 该方法为接警员修改警情分类的时候，查询相应的警情预案
 */
function getTypes(){
	var param = "";
	var type_name = "";
	var a_c_type = $("#a_c_type").val();
	var type1 = $("#a_c_type option:selected").text();
	var a_c_type2 = $("#a_c_type2").val();
	var type2 = $("#a_c_type2 option:selected").text();
	var a_c_type3 = $("#a_c_type3").val();
	var type3 = $("#a_c_type3 option:selected").text();
	var a_c_type4 = $("#a_c_type4").val();
	var type4 = $("#a_c_type4 option:selected").text();
	if(a_c_type){
		param += a_c_type;
		type_name += type1;
	}
	if(a_c_type2){
		param += ',' + a_c_type2;
		type_name += '-' + type2;
	}
	if(a_c_type3){
		param += ',' + a_c_type3;
		type_name += '-' + type3;
	}
	if(a_c_type4){
		param += ',' + a_c_type4;
		type_name += '-' + type4;
	}
	if(param.length == 0){
		alert("请选择警情分类");
		return;
	}
	$.ajax({
		url: BASESERVLET + "/web/plan/findOne?level="+param,
		type: "get",
		dataType: "json",
		success: function (data) {
			if(data.status){
				var content = data.obj.content;
				var group = data.obj.groupName;
				$("#group").html(group);
				$("#alarms").html(type_name);
				$("#content").html(content);
				layer.open({
                    type: 1,
					title: "预案详情",
                    shadeClose: false,
                    shade: 0.6,
                    area: ['700px', '600px'],
                    content: $("#plan")
				})
			}else {
				layer.alert("该分类未配置预案", {icon: 2});
			}
        }
	})

}