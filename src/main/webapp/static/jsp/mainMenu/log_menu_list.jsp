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
<!-- 报表统计二级菜单 -->
<li>
    <a href="${baseServlet}/web/fireStatistics/toEquipmentCheck"><i
            class="icon iconfont icon-richangxunjian"></i><span
            style="display: none">日常巡检</span></a>
</li>
<li>
    <a href="${baseServlet}/web/company/statistics"><i
            class="icon iconfont icon-wanggexinxi"></i><span style="display: none">网格信息</span></a>
</li>
<li>
    <a href="${baseServlet}/web/company/toGdMap"><i class="icon iconfont icon-dituzhanshi"></i><span
            style="display: none">地图展示</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireStatistics/toOrderStatistics"><i
            class="icon iconfont icon-renwuxinxi"></i><span style="display: none">任务信息</span></a>
</li>

<!-- 报表统计二级菜单 -->
