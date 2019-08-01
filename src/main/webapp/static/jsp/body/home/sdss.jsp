<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
	//基础静态资源请求路径:如：${base}/js/jquery.js
	request.setAttribute("base", path);
	//基础Controller请求路径，如：${baseServlet}/web/login
	request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">			
		<title>所队综合应用</title>
		<link href="${base}/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">	
		<link rel="stylesheet" href="${base}/plugins/font-awesome/css/font-awesome.min.css" />
		<link rel="stylesheet" href="${base}/theme/css/sdss.css" />
		<link rel="stylesheet" href="${base}/theme/css/video2.css" />
		<link rel="stylesheet" href="${base}/theme/css/viewer.min.css"/>
		<link rel="stylesheet" href="${base}/theme/css/jdxq.css" />
		<script type="text/javascript">
			var BASEURL = '${baseUrl}';
			var BASE = '${base}';
			var BASESERVLET = '${baseServlet}';
		</script>
		
	</head>
	<body>	
		<div class="bodyBox">		
			<div class="header_box clearfix">
				<h6 class="header_logo pull-left">
					<a href="javascript:;"><img src="${base}/theme/img/sdss/logo_sd.png" /></a>
				</h6>
				<ul class="header_menu pull-right">
					<li><i class="fa fa-user fa-fw" aria-hidden="true">&nbsp;&nbsp;</i><a href="javascript:;">${sessionScope.usersession.name }</a></li>
					<li id="changePassword"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><a href="javascript:;">修改密码</a></li>
					<li id="logoutBtn"><i class="fa fa-power-off fa-fw" aria-hidden="true">&nbsp;&nbsp;</i><a href="javascript:;">退出</a></li>
				</ul>
			</div>
			
			<!--sidebar-->				
			<div class="sidebar" state="1"> 
				<div class="sidebar_box">
					<div class="sidebar_inner_box">
						<ul class="level1 sidebar_nav">
							<li class="home"><a href="${baseServlet}/web/sdhm" title="首页"></a></li>
							<li class="alarm"><a href="${baseServlet}/web/selfalarm" title="自接警"></a></li>
							<li class="agent"><a href="${baseServlet}/web/undispatchlist" title="待办警情"></a></li>
							<li class="report"><a href="${baseServlet}/web/report" title="警员管理"></a></li>
							<li class="mana"><a href="${baseServlet}/web/handlelist" title="警情管理"></a></li>
							<li class="set"><a href="${baseServlet}/web/systemset" title="系统设置"></a></li>
						</ul>
					</div>
				</div>
			</div>
			<!-- 右侧主要内容显示 -->
			<div class="content_box">  
				<div class="content">
					<div class="content-content">
						<div class="content_top clearfix">
							<div class="left_a pull-left" id="arrow"></div>
							<ol class="breadcrumb">
								<li><a href="javascript:;" id="title">首页</a>&nbsp;&nbsp;&nbsp;&nbsp;</li>
							</ol>
						</div>
						<div class="content-inner-box" id="content-inner-box">
							<div class="content-inner">
								<div id="content_main" class="content_main">

								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
	</div>

<input type="hidden" value="${sessionScope.usersession.group}" id="groupid" />
<script id="notice-template" type="text/html">
	<div id="notice_{{NOTICE-ALARM-CLASS}}" class="notice-div">
		<div class="notice-title">
			<img src="${base}/theme/img/notice-icon.png">
			<span>警情提示</span>
		</div>
		<div class="info">
			<img src="${base}/theme/img/user-notice.png" />
			<span>您有新的警情,请及时处理</span>
		</div>
		<div class="handler">
			<a id="notice-accept" class="notice-btn" href="javascript:;" onclick="handleshow(1,'{{NOTICE-ALARM-ID}}');">查看</a>
		</div>
	</div>
</script>
<audio id="alarmAudio" style="display:none;" loop="loop">
	<source src="/res/alert0.ogg" type="audio/ogg">
	<source src="/res/alert0.mp3" type="audio/mp3">
  	<span>Your browser does not support the audio element.</span>
</audio>
		<script type="text/javascript" src="${base}/js/jquery.1.9.1.min.js" ></script>
		<script type="text/javascript" src="${base}/plugins/sockjs/sockjs.min.js" ></script>
		<script type="text/javascript" src="${base}/plugins/stomp/stomp.min.js" ></script>
		<script type="text/javascript" src="${base}/js/socket.js"></script>
		<script type="text/javascript" src="${base}/plugins/layer/layer.js" ></script>
		<script type="text/javascript" src="${base}/plugins/My97DatePicker/WdatePicker.js" ></script>	

		
		<script type="text/javascript" src="${base}/js/sdxt/viewer-jquery.min.js"></script>
		<script type="text/javascript" src="${base}/js/alarm/recordplay.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/janus.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/adapter.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/jquery.blockUI.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/bootstrap.min.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/bootbox.min.js" ></script>
		<script type="text/javascript" src="${base}/js/janus/spin.min.js" ></script>
		<script type="text/javascript" src="${base}/js/sdxt/sdxt.js" ></script>
		<script type="text/javascript" src="${base}/js/sdxt/messageTake.js" ></script>
		<script type="text/javascript">
			$(function(){
				var href = $(".home a").attr("href");
				$.ajax({
					url:href,
					type:"get",
					global:false,
					dataType: "html",
					success:function(data){
						//layer.close(layerIndex);
						$("#content_main").html(data);
					}		
				})

			  if('${pwdLevel}' == 'EASY'){
				layer.alert("您的密码强度过低，请尽快修改！");
			  }
			})

            $("#changePassword").click(function(){
                layer.open({
                    type:2,
                    title:'修改密码',
                    shadeClose:true,
                    shade:0.8,
                    area:['500px','300px'],
                    content:BASESERVLET+"/web/user/changePassword"
                })
            });
		</script>
		
	</body>
</html>
