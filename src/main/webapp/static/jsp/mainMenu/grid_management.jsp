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
<!-- 网格管理二级菜单 -->
<li>
    <a href="${baseServlet}/web/fire/UnitList"><i
            class="icon iconfont icon-xunjiandanweipeizhi"></i><span
            style="display: none">巡检单位配置</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireFacilities/list"><i class="icon iconfont icon-caijiliebiao"></i><span
            style="display: none">采集列表</span></a>
</li>
<li>
    <a href="${baseServlet}/web/companyPerson/list"><i
            class="icon iconfont icon-qiyexunchayuanliebiao"></i><span
            style="display: none">企业巡查员列表</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireOperateLog/list"><i
            class="icon iconfont icon-wanggeguanlicaozuorizhi"></i><span style="display: none">网格管理操作日志</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireSystem/listHtml"><i
            class="icon iconfont icon-zhiduliebiao"></i><span style="display: none">制度列表</span></a>
</li>
<!-- 网格管理二级菜单 -->
