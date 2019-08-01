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
	<a href="${baseServlet}/web/peopleSearch/toPeopleSearchList"><i class="icon iconfont icon-xunren"></i><span style="display: none">寻人</span></a>
</li>
<li>
	<a href="${baseServlet}/web/lookThings/toWebList"><i class="icon iconfont icon-xunwu"></i><span style="display: none">寻物</span></a>
</li>
<li>
	<a href="${baseServlet}/web/massReport/listPage"><i class="icon iconfont icon-xunwu"></i><span style="display: none">疑似走失人员</span></a>
</li>


<!-- 系统设置二级菜单 -->
