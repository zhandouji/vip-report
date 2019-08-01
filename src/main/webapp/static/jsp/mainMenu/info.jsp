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
<!-- 线索采集二级菜单 -->
<li>
	<a href="${baseServlet}/web/info/safe"><i class="fa fa-file-image-o" aria-hidden="true"></i><span style="display: none">安全守护神</span></a>
</li>
<%--<div class="sidebar" state="1">--%>
	<%--<div class="sidebar_box">--%>
		<%--<div class="sidebar_inner_box">--%>
			<%--<ul class="level1a sidebar_nav">--%>
				<%--<li><i class="fa fa-podcast" aria-hidden="true">&nbsp;&nbsp;</i><a href="${baseServlet}/web/sendRewardTask">发布悬赏令</a></li>--%>
				<%--<li><i class="fa fa-list-alt" aria-hidden="true">&nbsp;&nbsp;</i><a href="${baseServlet}/web/allrewardTaskList">悬赏令列表</a></li>--%>
				<%--<li><i class="fa fa-list" aria-hidden="true">&nbsp;&nbsp;</i><a href="${baseServlet}/web/info">线索列表</a></li>--%>
				<%--<li><i class="fa fa-camera" aria-hidden="true">&nbsp;&nbsp;</i><a href="${baseServlet}/web/info/shoot">随手拍</a></li>--%>
				<%--<li><i class="fa fa-shield" aria-hidden="true">&nbsp;&nbsp;</i><a href="${baseServlet}/web/info/safe">安全守护神</a></li>--%>
			<%--</ul>--%>
		<%--</div>--%>
	<%--</div>--%>
<%--</div>--%>