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
<!--  日常工作二级菜单 -->
<li>
    <a href="${baseServlet}/web/getCheckTask/list"><i
            class="icon iconfont icon-xunjianrenwu"></i><span style="display: none">巡检任务</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireAlarm/inspectionList"><i
            class="icon iconfont icon-xunjianliebiaochaxun"></i><span
            style="display: none">巡检列表查询</span></a>
</li>
<!--  日常工作二级菜单 -->
