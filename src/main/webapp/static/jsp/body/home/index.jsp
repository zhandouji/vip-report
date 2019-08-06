<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
	<title>首页</title>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache" />
	<link rel="shortcut icon" type="image/x-icon" href="${base}/static/theme/img/index/logo.ico" media="screen" />
	<link rel="stylesheet" type="text/css" href="${base}/static/plugins/font-awesome/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/index.css"/>
	<link rel="stylesheet" type="text/css" href="${base}/static/plugins/ali-icon/iconfont.css"/>

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
		<img class="logo-img" src="${base}/static/theme/img/index/logo.png"/>
		<span class="logo-text" id="tittle_text">会员管理系统</span>
		<img class="right-img" src="${base}/static/theme/img/login/right.png"/>
		<ul class="admin-box">
			<li id="logoutBtn"><i class="fa fa-power-off" aria-hidden="true"></i><span><a href="javascript:;">退出</a></span></li>
			<li><i class="fa fa-user" aria-hidden="true"></i><span>${sessionScope.userName }</span></li>
		</ul>
	</div>
	<!--头部结束-->
	<!--左侧菜单开始-->
	<div class="left-menu-box" style="width: 60px">
		<div class="menu-hidden">
            <i class="icon iconfont icon-shouqiliebiao"></i><span style="display: none">收起菜单</span>
		</div>
		<ul class="left-menu-list" id="left_xxx">
			<li>
				<a href="${baseServlet}/user/toUserListPage" ><i
						class="icon iconfont icon-liangpingjiejingtai"></i><span
						style="display: none">会员中心</span></a>
			</li>
			<li>
				<a href="${baseServlet}/gift/toGiftPage" target="_blank" id="jjli_v2"><i
						class="icon iconfont icon-lishijiejing"></i><span
						style="display: none">兑换物管理</span></a>
			</li>
		</ul>
	</div>
	<!--左侧菜单结束-->
	<!--右侧内容部分外层盒子开始-->
	<div class="all-content-box" style="left:60px;">
		<div class="main-content-box">
			<!--面包屑开始-->
			<div class="map-nav clear">
				<div class="left-map-title">
					<span id="firstli">会员管理</span>
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
</div>`
<script src="${base}/static/js/home.js"></script>
<script src="${base}/static/js/index.js" type="text/javascript" charset="utf-8"></script>
<script>

    $("#logoutBtn").click(function(){
        location.href = BASESERVLET+"/web/logout";
    });
</script>
</body>
</html>