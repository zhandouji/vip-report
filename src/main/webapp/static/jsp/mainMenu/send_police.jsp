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
	<a href="${baseServlet}/web/fireEquipment/list"><i
			class="icon iconfont icon-cheliangshebei"></i><span
			style="display: none">车辆设备</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fire/linkageGroup/list?start=1"><i
			class="icon iconfont icon-lianqinguanli"></i><span style="display: none">联勤管理</span></a>
</li>


<!-- 系统设置二级菜单 -->
