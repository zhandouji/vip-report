<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<jsp:include page="../lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
	//基础静态资源请求路径:如：${base}/js/jquery.js
	request.setAttribute("base", path);
	//基础Controller请求路径，如：${baseServlet}/web/login
	request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!-- 多媒体报警 二级菜单 -->
<!-- 多媒体报警 二级菜单 增加同步到勤务平台、测试报警、无效报警的报警类型 -->

<li>
	<a href="${baseServlet}/web/alarmCenter/list" target="_blank" ><i class="icon iconfont icon-liangpingjiejingtai"></i><span style="display: none">接警中心</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarmCenter/broadcast/view" target="_blank"><i class="icon iconfont icon-liangpingjiejingtai"></i><span style="display: none">来警播报</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarm/area/fences/toList" target="_blank" ><i class="icon iconfont icon-liangpingjiejingtai"></i><span style="display: none">接警围栏</span></a>
</li>
<!-- 多媒体报警二级菜单 -->

