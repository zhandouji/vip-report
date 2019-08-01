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
<!-- 消防模块 系统设置二级菜单 -->
<li>
    <a href="${baseServlet}/web/dicManagement/html" menu="send_police"><i
            class="icon iconfont icon-shujuguanli"></i><span style="display: none">数据管理</span></a>
</li>

<!-- 消防模块 系统设置二级菜单 -->
