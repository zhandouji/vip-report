//平台标志
var isAndroid = false,
	isiOS = false;
	
//平台判断
function crossPlatformApproach(){
	try{//平台判断
		var u = navigator.userAgent;
		isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;//安卓终端
		isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);//ios终端
		
	}catch(e){
		console.log("平台判断失败");
		console.log(e);
	}
}

/*
 * 设置导航条的中间位置的标题
 * @param name
 */
function setTopBarTitle(name) {
	try{
		//平台判断
		crossPlatformApproach();
		//调用对应平台方法
		if(isAndroid){
			
			window.android.setTopBarTitle(name);
			
		}else if(isiOS){
			
			window.webkit.UserMessageHandlers.setTopBarTitle.postMessage(name);
			
		}
		
	}catch(e){
		
		if(isAndroid){
			console.log("调用安卓失败");
			console.log(e);
		}else if(isiOS){
			console.log("调用ios失败");
			console.log(e);
		}
	}	
}