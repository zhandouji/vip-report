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
    <a href="${baseServlet}/web/app119/main/2/0" target="_blank" id="lpjjt"><i
            class="icon iconfont icon-liangpingjiejingtai"></i></i><span
            style="display: none">两屏接警台</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fire/alarmlist" target="_blank" id="jjli"><i
            class="icon iconfont icon-lishijiejing"></i><span style="display: none">接警历史</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fireEquipment/list"><i
            class="icon iconfont icon-cheliangshebei"></i><span
            style="display: none">车辆设备</span></a>
</li>
<li>
    <a href="${baseServlet}/web/fire/linkageGroup/list?start=1" target="_blank" id="liandong"><i
            class="icon iconfont icon-liandongdanwei"></i><span
            style="display: none">联动单位</span></a>
</li>
<li>
    <a href="${baseServlet}/web/unitCollection/listHtml" target="_blank"
       id="institutional_approval"><i class="icon iconfont icon-jigoushenpi"></i><span
            style="display: none">机构审批</span></a>
</li>
<li>
    <a href="#" menu="grid_management"><i class="icon iconfont icon-wanggeguanli"></i><span
            style="display: none">网格管理</span>
		<i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
	<ul class="sub-menu-list" style="display: none">

	</ul>
</li>
<li>
    <a href="#" menu="routine_work"><i class="icon iconfont icon-richanggongzuo"></i><span
            style="display: none">日常工作</span>
		<i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
	<ul class="sub-menu-list" style="display: none">

	</ul>
</li>
<li>
    <a href="#" menu="log_menu_list"><i class="icon iconfont icon-tongjimokuai"></i><span
            style="display: none">统计模块</span>
		<i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
	<ul class="sub-menu-list" style="display: none">

	</ul>
</li>

<li>
    <a href="#" menu="systems_setting"><i class="icon iconfont icon-xitongshezhi1"></i><span
            style="display: none">系统设置</span>
		<i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
	<ul class="sub-menu-list">

	</ul>
</li>

<!-- 多媒体报警二级菜单 -->
<script>
    (function(){
        //加载二级菜单
        $('#left_xxx li a[href = "#"]').each(function(e) {
            var menuType = $(this).attr("menu");
            var menuSelector = $(this).siblings(".sub-menu-list").first();
            menuSelector.load(
                BASESERVLET+"/web/mainMenu/"+menuType,
                {},
                function(){
                    //菜单效果
                    menuSelector.find("span").show();
                    menuSelector.hide();
//                    if(e == 0) {
//                        menuSelector.find("li a:first")[0].click();
//                    }
                }
            );

        });
    })();
</script>
