<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<jsp:include page="../lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css?time=180524.css"/>
<%
    String path = request.getContextPath();
    String basePath =
            request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                    + path;
    //基础静态资源请求路径:如：${base}/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如：${baseServlet}/web/login
    request.setAttribute("baseServlet",
            path + request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!-- 系统设置二级菜单 -->
<li>
    <a href="${baseServlet}/web/safetyRecord/getUserTrackMapInfo">
        <i class="icon iconfont icon-dituweizhi"></i><span style="display: none">守护位置</span></a>
</li>
<li>
    <a href="${baseServlet}/web/safetyRecord/toList"><i
            class="icon iconfont icon-dituweizhi"></i><span
            style="display: none">守护记录</span></a>
</li>
<li>
    <a href="${baseServlet}/web/invitationRecord/branchOffice/list"><i
            class="icon iconfont icon-yaoqingguanli"></i><span style="display: none">单位邀请</span></a>
</li>
<li>
    <a href="${baseServlet}/web/invitationRecord/list"><i
            class="icon iconfont icon-yaoqingguanli"></i><span style="display: none">个人邀请</span></a>
</li>
<li>
    <a href="${baseServlet}/web/ClueAd"><i class="icon iconfont icon-guanggaopeizhi"></i><span
            style="display: none">广告logo配置</span></a>
</li>
<li>
    <a href="${baseServlet}/web/annoOption/list"><i class="icon iconfont icon-diquAPP"></i><span
            style="display: none">地区APP信息配置</span></a>
</li>
<li>
    <a href="${baseServlet}/web/client/uploadPage"><i class="icon iconfont icon-kehuduan"></i><span
            style="display: none">客户端上传管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/appArticle/toList"><i class="icon iconfont icon-wenzhang"></i><span
            style="display: none">首页文章</span></a>
</li>
<li>
    <a href="${baseServlet}/web/notice/boards/toList">
        <i class="icon iconfont icon-wenzhang"></i><span style="display: none">系统公告</span></a>
</li>
<!-- 系统设置二级菜单 -->
