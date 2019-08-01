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
	<a href="${baseServlet}/web/policeServiceType/toList"><i
			class="icon iconfont icon-jingwufuwufenlei"></i><span
			style="display: none">警务服务分类</span></a>
</li>
<li>
	<a href="${baseServlet}/web/policeServiceItem/toList"><i
			class="icon iconfont icon-jingwufuwuxiangmu"></i><span
			style="display: none">警务服务项目</span></a>
</li>
<li>
	<a href="${baseServlet}/web/areaPoliceService/toEdit"><i
			class="icon iconfont icon-quyujingwufuwu"></i><span style="display: none">区域警务服务</span></a>
</li>

<!-- 系统设置二级菜单 -->
