<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
	//基础静态资源请求路径:如：${base}/js/jquery.js
	request.setAttribute("base", path);
	//基础Controller请求路径，如：${baseServlet}/web/login
	request.setAttribute("baseServlet", basePath);
%>
<script src="${base}/static/js/jquery.2.1.4.min.js" type="text/javascript" charset="utf-8"></script>
<link rel="stylesheet" type="text/css" href="${base}/static/plugins/layer/skin/layer.css"/>
<script src="${base}/static/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="${base}/static/plugins/layer/layer.js"></script>
<link rel="stylesheet" href="${base}/static/theme/css/layer.css"/>
<script type="text/javascript">
    var BASEURL = '${baseUrl}';
    var BASE = '${base}';
    var BASESERVLET = '${baseServlet}';
</script>