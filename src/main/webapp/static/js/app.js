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
	janusInit:false,//Janus组件是否初始化
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
	janus:{},		//视频组件
	chat:{},		//聊天
	alarmCase:{},	//接警单
	map:{}, 		//地图
	person:{},		//报警人信息
	alarmHandle:{},	//处警单
	alarmHandlePush:{},	//处警推送
	video:{}        //视频房间
};

//哪几个屏幕有哪些模块
APP110.screenMod = [
    [],//共0个屏，无用，占位
	[],//共1个屏，暂不支持
	[
     	[
     	 	"consoleState", "screenBtn", "notice", "janus", 
     	 	"chat", "alarmCase", "alarmHandle", "person","alarmHandlePush"
     	],  
     	["map"] 
    ],//共2个屏幕配置
    [
      	["video"],
      	["chat","notice","person","screenBtn"],
		["map"]
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
	
	// console.log("加载第"+screenIndex+"屏模块...");
	// //多屏通讯初始化：监听发送给本屏幕的消息
	// setTimeout(function(){
	// 	thisMovie("multiScreenConn").clientPrepare(screenIndex);
	// }, 10);
	// console.log("初始化"+screenIndex+"屏消息监听...");
	
	//获得屏幕的模块
	APP110.current.screenIndex = screenIndex; 
	
	// var mods = APP110.current.screenConfig[screenIndex-1];
	// for(var i=0; i<mods.length; i++){
	// 	var m = APP110.mods[mods[i]];
	// 	console.log("读取："+mods[i]+"模块...");
	// 	console.log(mods[i]+"模块初始化...");
	// 	//调用模块的初始化方法
	// 	APP110.callModFun(mods[i], "init");
	// }
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
  var mods = ["kurento", "chat", "alarmCase", "person", "map", "alarmHandle",
    "notice"];
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
