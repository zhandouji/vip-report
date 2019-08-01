<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
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
<li>
    <a href="${baseServlet}/web/clue/list/1;" target="_blank" id="jblb"><i
            class="icon iconfont icon-jubaoliebiao"></i><span
            style="display: none">用户举报列表</span></a>
</li>
<li>
    <a href="${baseServlet}/web/unit_type/list" target="_blank"><i
            class="icon iconfont icon-xiansuoleixing"></i><span style="display: none">线索单位管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/clueDeploy/search" target="_blank"><i
            class="icon iconfont icon-xiansuoleixing"></i><span
            style="display: none">信息员管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/base_type/list" target="_blank"><i
            class="icon iconfont icon-xiansuoleixing"></i><span style="display: none">线索类型管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/importClueAd" target="_blank"><i
            class="icon iconfont icon-guanggaopeizhi"></i><span
            style="display: none">广告logo配置</span></a>
</li>

<!-- 多媒体报警二级菜单 -->
