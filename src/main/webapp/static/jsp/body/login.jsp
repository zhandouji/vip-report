<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
	<title>report会员管理系统</title>
	<meta charset="utf-8">
	<meta http-equiv="Cache-Control" content="no-cache" />
	<link rel="stylesheet" type="text/css" href="${base}/static/plugins/font-awesome/css/font-awesome.min.css" />
	<link type="text/css" rel="stylesheet" href="${base}/static/theme/css/index.css" />
	<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/login.css" />
	<script src="${base}/static/js/jquery.2.1.4.min.js"></script>
</head>
<body>
<div class="max-box">
	<div class="login-content">
		<div class="logo-box">
			<img class="login-logo-img" src="${base}/static/theme/img/login/left.png" />
			<span class="login-logo-text">report会员管理系统</span>
			<img class="login-logo-img" src="${base}/static/theme/img/login/right.png" />
		</div>
		<div class="login-box">
			<div class="login shadow">
				<div class="erweima01">
					<img src="${base}/static/theme/img/login/erweima01.png?time=20180427" />
				</div>
				<div class="erweima02">
					<img src="${baseServlet}/static/theme/img/login/erweima02.png?time=20180427" />
				</div>
				<div class="inputs-box">
					<form id="loginForm" action="${baseServlet}/web/login" method="POST">
						<div id="msg_td" class="tsxx"  style="color:#FF0000;height: 10px;line-height: 10px;">${ret.error }</div>
						<div class="input-div">
							<span class="icon-span"><i class="fa fa-user" aria-hidden="true"></i></span>
							<input id="loginId" class="admin-text" type="text" name="userName" value="" placeholder="请输入用户名" />
						</div>
						<div class="input-div">
							<span class="icon-span"><i class="fa fa-lock" aria-hidden="true"></i></span>
							<input id="password"  class="admin-text" type="password" name="password" value="" placeholder="请输入密码" />
						</div>
						<div class="button-div">
							<input class="" type="button" onclick="javascript:submitForm()" value="确定"></input>
							<input type="reset" value="重置"></input>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">

    function submitForm() {
        if($.trim($('#loginId').val())==""){
            $('#msg_td').empty().text('请输入用户名');
            return;
        }
        if($.trim($('#password').val())==""){
            $('#msg_td').empty().text('请输入密码');
            return;
        }
         $('#loginForm').submit();
    }
</script>
</body>
</html>