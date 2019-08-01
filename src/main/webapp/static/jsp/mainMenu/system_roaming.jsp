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
	<a href="${baseServlet}/web/roaming/toDomainList">
		<i class="icon iconfont icon-manyoupeizhi"></i>
		<span style="display: none">漫游配置</span>
	</a>
</li>
<li>
	<a href="${baseServlet}/web/roaming/toServiceList">
		<i class="icon iconfont icon-manyoufuwu"></i>
		<span style="display: none">漫游服务</span>
	</a>
</li>
<!-- 多媒体报警二级菜单 -->
