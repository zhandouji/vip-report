<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilesx" uri="http://tiles.apache.org/tags-tiles-extras"%>
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
	<title>首页</title>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache" />
	<!-- <link type="text/css" rel="stylesheet" href="/plugins/font-awesome/css/font-awesome.min.css" /> -->
	<%--<link type="text/css" rel="stylesheet" href="/plugins/bootstrap/css/bootstrap.min.css" />--%>
	<!-- <link type="text/css" rel="stylesheet" href="/theme/css/index.css" /> -->
	<!-- <link type="text/css" rel="stylesheet" href="/theme/css/new_index.css" /> -->

	<link rel="shortcut icon" type="image/x-icon" href="${base}/theme/img/index/logo.ico" media="screen" />
	<link rel="stylesheet" type="text/css" href="${base}/plugins/font-awesome/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="${base}/theme/css/index.css"/>

	<script type="text/javascript">
        var BASEURL = '${baseUrl}';
        var BASE = '${base}';
        var BASESERVLET = '${baseServlet}';
	</script>
</head>

<body>
<input type="hidden" id="current_user_id" value="${sessionScope.usersession.id }">
<input type="hidden" id="current_user_img" value="">
<!--最外层盒子-->
<div class="max-box">
	<!--头部开始-->
	<div class="header-box">
		<img class="logo-img" src="${base}/theme/img/index/logo.png"/>
		<span class="logo-text">一体化接处警管理平台</span>
		<img class="right-img" src="${base}/theme/img/login/right.png"/>
		<ul class="admin-box">
			<%--<li id="logoutBtn"><i class="fa fa-power-off" aria-hidden="true"></i><span><a href="javascript:;">退出</a></span></li>--%>
			<li id="logoutBtn"><i class="fa fa-power-off fa-fw" aria-hidden="true">&nbsp;&nbsp;</i><a href="javascript:;">退出</a></li>
			<li id="changePassword"><i class="fa fa-pencil-square-o" aria-hidden="true"></i><a href="javascript:;">修改密码</a></li>
			<li><i class="fa fa-user" aria-hidden="true"></i><span>${sessionScope.usersession.name }</span></li>
		</ul>
	</div>
	<!--头部结束-->
	<!--左侧菜单开始-->
	<div class="left-menu-box" style="width: 60px">
		<div class="menu-hidden">
            <i class="icon iconfont icon-shouqiliebiao"></i><span style="display: none">收起菜单</span>
		</div>
		<ul class="left-menu-list" id="left_xxx">

		</ul>
	</div>
	<!--左侧菜单结束-->
	<!--右侧内容部分外层盒子开始-->
	<div class="all-content-box" style="left:60px;">
		<div class="main-content-box">
			<!--面包屑开始-->
			<div class="map-nav clear">
				<div class="left-map-title">
					<span id="firstli">多媒体接警</span><span>&nbsp;/&nbsp;</span><span id="secondli">两屏接警台</span>
				</div>
				<div class="right-time"></div>
			</div>
			<!--面包屑结束-->
			<!--主要内容编辑区开始-->
			<div class="content-detail-box1">
				<div class="content-detail-box2" id="content_main">
				</div>
			</div>

			<%--<jsp:include page="${base}/jsp/body/app110/main_2_0.jsp" />--%>
			<!--主要内容编辑区结束-->
		</div>
	</div>
	<!--右侧内容部分外层盒子结束-->
</div>
<script src="/js/common/alertConstant.js" type="text/javascript"></script>
<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=g6zwXymtQ5ino36e95BXwrbnKXWqT3qK&s=1"></script>
<%--高德地图--%>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.2&key=9cef69900a5e27dcebd883de1cf0b776&plugin=AMap.Geocoder,AMap.CitySearch,AMap.ToolBar,AMap.MouseTool,AMap.PolyEditor"></script>
<%--<script src="/js/jquery.1.9.1.min.js"></script>--%>
<script src="${base}/js/jquery.2.1.4.min.js" type="text/javascript" charset="utf-8"></script>
<script src="/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="/plugins/layer/layer.js"></script>
<script src="/js/home.js"></script>
<%--高德地图UI库--%>
<script type="text/javascript" src="https://webapi.amap.com/ui/1.0/main.js"></script>
<%--视频播放js--%>
<link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
<script src="https://unpkg.com/video.js/dist/video.js"></script>
<script src="https://unpkg.com/videojs-flash/dist/videojs-flash.js"></script>
<script src="https://unpkg.com/videojs-contrib-hls/dist/videojs-contrib-hls.js"></script>

<script src="${base}/js/index.js" type="text/javascript" charset="utf-8"></script>

<script>
    $("#logoutBtn").click(function(){
        location.href = BASESERVLET+"/web/logout";
    });

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

    $(function(){
      if('${pwdLevel}' == 'EASY'){
        layer.alert("您的密码强度过低，请尽快修改！");
      }
    })
</script>

</body>
</html>