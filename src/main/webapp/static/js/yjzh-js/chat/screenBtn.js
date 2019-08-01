

//--------------------多屏模块--------------------//
/**
 * 多屏按钮模块的【初始化】
 */
APP110.mods["screenBtn"].init = function (){
   /* $("#showMap").on("click", function(){
        var size = APP110.current.screenSize;//当前配置的屏幕数
        APP110.current.screens[i] = window.open(BASESERVLET +"/web/app110/main/"+size+"/"+1);
        APP110.callModFun("notice","getLatandLon");
    });
    return;//下方为旧版初始化方法

	var pingDiv = $("#pingDiv");
	pingDiv.empty();
	//pingDiv.append('<a i="-1" title="">重置</a>');
	var size = APP110.current.screenSize;//当前配置的屏幕数
	for(var i=1; i<size; i++){
		pingDiv.append('<a i="'+i+'">第'+(i+1)+'屏</a>');
	}
	
	//多屏打开
	$("#pingDiv").on("click", "a", function(){
		var i = $(this).attr("i");
//		if(i=="-1"){
//			//重置，删除缓存对象，显示已经打开的页面链接
//			$.each($("#pingDiv a"), function(index, a){
//				var a_index = Number($(a).attr("i"));
//				if(a_index>=0){
//					APP110.current.screens.length = 1;//保留第一屏
//				}
//			});
//			$("#pingDiv a").show();
//			return;
//		}
		//打开第i屏，隐藏按钮
//		if(APP110.current.screens[i]){
//			layer.msg("已经打开第"+(Number(i)+1)+"屏");
//			return;
//		}
		APP110.current.screens[i] = window.open(BASESERVLET +"/web/app110/main/"+size+"/"+i);
		//$(this).hide();
	});*/
}

//--------------------多屏模块--------------------//

