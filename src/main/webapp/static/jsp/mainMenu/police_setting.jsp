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
	<a href="${baseServlet}/web/base_type/list"><i
			class="icon iconfont icon-xiansuoleixing"></i><span
			style="display: none">线索基本类型管理</span></a>
</li>
<li>
	<a href="${baseServlet}/web/policeServerList"><i
			class="icon iconfont icon-jingwufuwuguanli1"></i><span
			style="display: none">警务服务管理</span></a>
</li>
<li>
	<a href="${baseServlet}/web/videoOption/list"><i
			class="icon iconfont icon-shipinxuanze"></i><span
			style="display: none">视频选择模板</span></a>
</li>
<li>
	<a href="${baseServlet}/web/chatTemplate/list"><i
			class="icon iconfont icon-liaotianmoban"></i><span style="display: none">聊天默认模版设置</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarmDescription/list"><i
			class="icon iconfont icon-baojingmiaoshumoban"></i><span
			style="display: none">报警描述模版设置</span></a>
</li>
<!-- 系统设置二级菜单 -->
