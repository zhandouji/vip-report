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
	<a href="${baseServlet}/web/systemConfig/list"><i class="icon iconfont icon-xitongpeizhi"></i><span style="display: none">系统配置</span></a>
</li>
<li>
	<a href="${baseServlet}/web/log/list"><i class="icon iconfont icon-xitongrizhi"></i><span
			style="display: none">系统日志</span></a>
</li>
<li>
	<a href="${baseServlet}/web/areaCode/list"><i class="icon iconfont icon-diqupeizhi"></i><span
			style="display: none">地区配置</span></a>
</li>
<li>
	<a href="${baseServlet}/web/weChatManagement/html"><i
			class="icon iconfont icon-gongzhonghaoguanli"></i><span
			style="display: none">公众号管理</span></a>
</li>
<li>
	<a href="${baseServlet}/web/message/list"><i
			class="icon iconfont icon-fasongzhanneixin"></i><span style="display: none">发送站内信</span></a>
</li>
<li>
	<a href="${baseServlet}/web/feedBack/list"><i class="icon iconfont icon-fankuiyijian"></i><span
			style="display: none">反馈意见</span></a>
</li>

<!-- 系统设置二级菜单 -->
