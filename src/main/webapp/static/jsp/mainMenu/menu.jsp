<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
    //基础静态资源请求路径:如：${base}/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如：${baseServlet}/web/login
    request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<li>
    <a href="#" menu="organizational"><i class="icon iconfont icon-zuzhijiegou"></i><span style="display: none">组织结构</span><i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="system_setting"><i class="icon iconfont icon-xitongshezhi1"></i><span
            style="display: none">系统设置</span><i class="fa icon-right color1 fa-angle-right"
                                                aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="system_roaming">
        <i class="icon iconfont icon-manyoushezhi"></i>
        <span style="display: none">漫游设置</span>
        <i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i>
    </a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="police_setting"><i class="icon iconfont icon-jingwushezhi"></i><span
            style="display: none">警务设置</span><i class="fa icon-right color1 fa-angle-right"
                                                aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="phone_setting"><i class="icon iconfont icon-shoujiduan"></i><span
            style="display: none">手机端设置</span><i class="fa icon-right color1 fa-angle-right"
                                                 aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none">
    </ul>
</li>
<li>
    <a href="#" menu="send_police"><i class="icon iconfont icon-paijingxinxi"></i><span
            style="display: none">派警信息管理</span><i class="fa icon-right color1 fa-angle-right"
                                                  aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none"></ul>
</li>
<li>
    <a href="#" menu="police_service"><i class="icon iconfont icon-jingwufuwuguanli1"></i><span
            style="display: none">警务服务管理</span><i class="fa icon-right color1 fa-angle-right"
                                                  aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none">
    </ul>
</li>
<li>
    <a href="#" menu="alarm_center"><i class="icon iconfont icon-jingwufuwuguanli1"></i><span
            style="display: none">接警中心管理</span><i class="fa icon-right color1 fa-angle-right"
                                                  aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none">
    </ul>
</li>
<li>
    <a href="${baseServlet}/web/protocol/toListPage" target="_blank"><i
            class="icon iconfont icon-bendituijian"></i><span style="display: none">协议管理</span></a>
</li>
<script>
    (function(){
        //加载二级菜单
        $('#left_xxx li a[href=#]').each(function(e) {
            var menuType = $(this).attr("menu");
            var menuSelector = $(this).siblings(".sub-menu-list").first();
            menuSelector.load(
                BASESERVLET+"/web/mainMenu/"+menuType,
                {},
                function(){
                    //菜单效果
                    menuSelector.find("span").show();
                    menuSelector.hide();
                    if(e == 0) {
                        menuSelector.find("li a:first")[0].click();
                    }
                }
            );
        });
    })();
</script>
