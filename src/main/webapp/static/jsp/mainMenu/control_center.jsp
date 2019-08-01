<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<jsp:include page="../lib.jsp"></jsp:include>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
    //基础静态资源请求路径:如：${base}/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如：${baseServlet}/web/login
    request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!-- 指挥调度左边菜单栏 -->
<li>
    <a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/videoRoom',this)" target="_blank" ><i class="fa fa-history" aria-hidden="true"></i><span style="display: none">指挥中心</span></a>
</li>
<li>
    <a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/historyList',this)" target="_blank"><i class="fa fa-television" aria-hidden="true"></i><span style="display: none">历史记录</span></a>
</li>

<%--<li class="checked-level1">--%>
    <%--<a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/videoRoom',this)">--%>
        <%--<i class="fa fa-tasks font-size-18px" aria-hidden="true"></i>&nbsp;&nbsp;<span>指挥中心</span></a>--%>
<%--</li>--%>
<%--<li>--%>
    <%--<a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/historyList',this)">--%>
        <%--<i class="fa fa-search font-size-18px" aria-hidden="true"></i>&nbsp;&nbsp;<span>历史记录</span></a>--%>
<%--</li>--%>
<%--<li>--%>
    <%--<a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/client/uploadPage',this)">--%>
        <%--<i class="fa fa-android font-size-18px" aria-hidden="true"></i>&nbsp;&nbsp;<span>应用版本</span></a>--%>
<%--</li>--%>
