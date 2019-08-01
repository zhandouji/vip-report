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
	<a href="${baseServlet}/web/unlockCompany/list"><i class="icon iconfont icon-kaisuogongsi"></i><span style="display: none">开锁公司</span></a>
</li>
<li>
	<a href="${baseServlet}/web/unlocker/list"><i class="icon iconfont icon-suojiangguanli"></i><span style="display: none">锁匠管理</span></a>
</li>
<li>
	<a href="${baseServlet}/web/unlockService/list"><i class="icon iconfont icon-kaisuofuwu"></i><span style="display: none">开锁服务</span></a>
</li>


<!-- 系统设置二级菜单 -->
