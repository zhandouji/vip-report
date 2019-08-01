<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<jsp:include page="../lib.jsp"></jsp:include>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
	//基础静态资源请求路径:如：${base}/js/jquery.js
	request.setAttribute("base", path);
	//基础Controller请求路径，如：${baseServlet}/web/login
	request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!-- 系统设置二级菜单 -->
<li>
	<a href="${baseServlet}/web/checkWineDriving"><i class="fa fa-id-card-o" aria-hidden="true"></i></i><span style="display: none">查酒驾预报</span></a>
</li>
<li>
	<a href="${baseServlet}/web/camera/turnToCameraList" target="_blank" ><i class="fa fa-link" aria-hidden="true"></i><span style="display: none">高速路口摄像头管理</span></a>
</li>

<!-- 系统设置二级菜单 -->
