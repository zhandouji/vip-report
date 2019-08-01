<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
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
	<a href="${baseServlet}/web/group/0"><i class="icon iconfont icon-zuzhiguanli"></i><span style="display: none">组织管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/deploy/html"><i class="icon iconfont icon-zuzhiguanli"></i><span
            style="display: none">机构管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/role"><i class="icon iconfont icon-jiaoseguanli"></i><span
            style="display: none">角色管理</span></a>
</li>
<li>
	<a href="${baseServlet}/web/functionList"><i class="icon iconfont icon-gongnengguanli"></i><span style="display: none">功能管理</span></a>
</li>
<c:if test="${fn:contains(sessionScope.usersession.role , '6')}">
	<li>
		<a href="${baseServlet}/web/userManagement/search"><i class="icon iconfont icon-yonghuguanli"></i><span style="display: none">用户管理</span></a>
	</li>
</c:if>
<c:if test="${fn:contains(sessionScope.usersession.role , '24')}">
	<li>
		<a href="${baseServlet}/web/userManagement/search?searchType=police"><i class="icon iconfont icon-yonghuguanli"></i><span style="display: none">警员管理</span></a>
	</li>
	<li>
		<a href="${baseServlet}/web/userManagement/search?searchType=people"><i class="icon iconfont icon-yonghuguanli"></i><span style="display: none">群众管理</span></a>
	</li>
</c:if>
<li>
	<a href="${baseServlet}/web/auth/list" target="_blank" ><i class="icon iconfont icon-shimingrenzheng"></i><span style="display: none">实名认证</span></a>
</li>
<li>
	<a href="${baseServlet}/web/onlineUser/list" target="_blank" ><i class="icon iconfont icon-liangpingjiejingtai"></i><span style="display: none">在线人数</span></a>
</li>
<li>
    <a href="${baseServlet}/web/userScore/toUserScorePage" target="_blank"><i
            class="icon iconfont icon-jifenguanli"></i><span style="display: none">积分管理</span></a>
</li>

<!-- 系统设置二级菜单 -->
