var receiveConn:LocalConnection;
var sendConn:LocalConnection;
			
function clientPrepare(screenIndex:int):void{
	receiveConn = new LocalConnection();
	sendConn = new LocalConnection();
	receiveConn.client = this;
	receiveConn.connect("multiScreenConn"+screenIndex);
}
			
function dealMsg(msg:String):void{
	//调用JS方法，传递msg参数
	ExternalInterface.call("dealMsg", msg);
}
			
function sendMsg(screenIndex:int, msg:String):void{
	//向其他浏览器窗口发送消息
	sendConn.send("multiScreenConn"+screenIndex, "dealMsg", msg);
}

function areYouOK():String{
	//用于测试
	return "OK";
}
//让JS能够通过clientPrepare调用本flash的方法：clientPrepare
ExternalInterface.addCallback("clientPrepare", clientPrepare);

//让JS能够通过sendMsg调用本flash的方法：sendMsg
ExternalInterface.addCallback("sendMsg", sendMsg);

//让JS能够通过sendMsg调用本flash的方法：areYouOK
ExternalInterface.addCallback("areYouOK", areYouOK);

//只运行一次（连接不能重复创建）
stop();

//当flash加载完毕时回调JS方法
//ExternalInterface.call("multiScreenLoaded");

