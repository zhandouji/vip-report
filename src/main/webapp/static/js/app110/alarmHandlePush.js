
//处警推送信息提示
APP110.mods["alarmHandlePush"].init = function (){
	var uid=$("#currentLoginUserId").val();
	console.log("处警推送订阅："+uid);
    var headers = {
        'activemq.retroactive': 'true'
    };
	skynetSocket.subscribe("/queue/judge/"+uid, function(m){
		console.log("订阅处警推送得到结果……………………：%o", m);
		var body;	
		try{
			body = JSON.parse(m.body);		
		}catch(e){
			layer.alert("解析推送消息异常："+e.message+"\n\n"+m.body);
			console.error("解析推送消息异常：%s", m.body);
			return;
		}
		console.log(body);
		if(body.event=="accept"){
		//		alert(m.headers.group+"已派警");

			APP110.mods["alarmHandlePush"].acceptInfo(m.headers);
		}
		if(body.event=="rejects"){
//			alert("拒绝处警,理由是："+m.headers.reason);

			APP110.mods["alarmHandlePush"].rejectsInfo(m,body);	
		}
			
	},headers);
}


APP110.mods["alarmHandlePush"].iiid={};
APP110.mods["alarmHandlePush"].acceptInfo=function(headers){
	var content = $("#notice-acceptTemplate").html();
	content = (content+"").replace(/{{NOTICE-accept-ID}}/g, headers);//替换

	content = (content+"").replace(/{{NOTICE-accept-TITLE}}/g,headers.group+"已派警");//替换

	APP110.mods["alarmHandlePush"].iiid[headers]= layer.open({
	    type: 1,
	    title: false,//不显示标题

	    closeBtn:0,//不显示关闭按钮

	    shade: 0,//不显示遮罩层

	    area: '340px',//宽度340px，高度自适应

	    offset: 'rb',//右下角弹出

	    shift: 2,//动画类型

	    content: content
	});
}
//处警接受提示
function accept(headers){
	APP110.mods["alarmHandlePush"].accept(headers);
}
APP110.mods["alarmHandlePush"].accept=function(headers){
	console.log("accept:"+headers);
	layer.close(APP110.mods["alarmHandlePush"].iiid[headers]);
}
APP110.mods["alarmHandlePush"].rejectsInfo=function(m,body){
	var content = $("#notice-rejectsTemplate").html();	
	content = (content+"").replace(/{{NOTICE-rejects-ID}}/g, body.body);//替换

	content = (content+"").replace(/{{NOTICE-rejects-TITLE}}/g, m.headers.group+"拒绝处警");//替换

	content = (content+"").replace(/{{NOTICE-rejects-NICKNAME}}/g,"理由是："+m.headers.reason);//替换

	APP110.mods["alarmHandlePush"].iiid[body.body]= layer.open({
	    type: 1,
	    title: false,//不显示标题

	    closeBtn:0,//不显示关闭按钮

	    shade: 0,//不显示遮罩层

	    area: '340px',//宽度340px，高度自适应

	    offset: 'rb',//右下角弹出

	    shift: 2,//动画类型

	    content: content
	});
}

function rejects(id){
	APP110.mods["alarmHandlePush"].rejects(id);
}
APP110.mods["alarmHandlePush"].rejects=function(id){
	console.log("拒绝推送的处警单id"+id);
	layer.close(APP110.mods["alarmHandlePush"].iiid[id]);
    APP110.mods["alarmHandlePush"].open=layer.open({
        type: 2,
        title: '重新派警',
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['893px', '600px'],
        content: BASESERVLET+'/api/againDispath/'+id
    });

}

//测试手机推送结果

/* skynetSocket.subscribe("/queue/pm/14f75500-906c-11e6-b272-c95123f8f601", function(m){

	console.log("订阅手机推送得到结果……………………：%o", m);

	var body;	

	try{

		body = JSON.parse(m.body);

		

	}catch(e){

		layer.alert("解析推送消息异常："+e.message+"\n\n"+m.body);

		console.error("解析推送消息异常：%s", m.body);

		return;

	}

	console.log(body);

}); */

/* //处警拒绝推送信息

skynetSocket.subscribe("/queue/JJCJ."+uid, function(m){

	console.log("订阅处警拒绝推送得到结果……………………：%o", m);

	var body;	

	try{

		body = JSON.parse(m.body);

		

	}catch(e){

		layer.alert("解析推送消息异常："+e.message+"\n\n"+m.body);

		console.error("解析推送消息异常：%s", m.body);

		return;

	}

	console.log(body);

	var nid = body.from;

	layer.confirm(body.event+",理由为："+m.headers.reason, {

		title:'提示',

		btn: ['查看'] //可以无限个按钮

		},function(){

			$.ajax({

				url:BASESERVLET,

				type:"get",

				global:false,

				dataType: "html",

				success:function(data){

					console.log(data);

				}		

			})

}); */