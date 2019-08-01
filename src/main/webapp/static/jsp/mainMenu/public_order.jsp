<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<jsp:include page="../lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
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
<li>
    <a href="${baseServlet}/web/deadbeat/list">
        <i class="icon iconfont icon-laolaiguanli"></i>
        <span style="display: none">老赖管理</span>
    </a>
</li>
<li>
    <a href="#" menu="unlock_menu">
        <i class="icon iconfont icon-kaisuoguanli"></i>
        <span style="display: none">开锁管理</span>
    </a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="tracing_menu"><i class="icon iconfont icon-xunrenxunwu"></i><span
            style="display: none">寻人寻物</span></a>
    <ul class="sub-menu-list" style="display: none">
    </ul>
</li>
<li>
    <a href="${baseServlet}/web/wantedPosters/toWebList">
        <i class="icon iconfont icon-tongjiling"></i>
        <span style="display: none">悬赏任务</span>
    </a>
</li>
<li>
    <a href="${baseServlet}/web/lostThings/list">
        <i class="icon iconfont icon-shiwuzhaoling"></i>
        <span style="display: none">失物招领</span>
    </a>
</li>
<li>
    <a href="${baseServlet}/web/importantCase/toImportCase" target="_blank">
        <i class="icon iconfont icon-zhongdashijianguanli"></i>
        <span style="display: none">重大案件管理</span>
    </a>
</li>
<li>
    <a href="${baseServlet}/web/safetyWarning/safetyWarning" target="_blank"><i
            class="icon iconfont icon-anquanyujingguanli"></i><span
            style="display: none">安全预警管理</span></a>
</li>
<li>
    <a href="${baseServlet}/web/vote/vote?type=1" target="_blank"><i
            class="icon iconfont icon-toupiao"></i><span style="display: none">投票</span></a>
</li>
<li>
    <a href="${baseServlet}/web/vote/vote?type=2" target="_blank"><i
            class="icon iconfont icon-wenjuan"></i><span style="display: none">问卷</span></a>
</li>
<li>
    <a href="${baseServlet}/web/policeServerList" target="_blank"><i
            class="icon iconfont icon-banshiliucheng"></i><span
            style="display: none">办事流程</span></a>
</li>
<li>
    <a href="${baseServlet}/web/localRecommendation/toList" target="_blank"><i
            class="icon iconfont icon-bendituijian"></i><span style="display: none">本地特色</span></a>
</li>
<script>
  (function () {
    //加载二级菜单
    $('#left_xxx li a[href=#]').each(function (e) {
      var menuType = $(this).attr("menu");
      var menuSelector = $(this).siblings(".sub-menu-list").first();
      menuSelector.load(
          BASESERVLET + "/web/mainMenu/" + menuType,
          {},
          function () {
            //菜单效果
            menuSelector.find("span").show();
            menuSelector.hide();
            if (e == 0) {
            }
          }
      );
    });
  })();
</script>
