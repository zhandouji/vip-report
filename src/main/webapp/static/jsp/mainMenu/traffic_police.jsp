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
<li>
    <a href="#" menu="check_wine_driving_menu"><i class="fa fa-cog" aria-hidden="true"></i><span style="display: none">交警服务</span><i class="fa icon-right color1 fa-angle-right" aria-hidden="true" style="display: none;"></i></a>
    <ul class="sub-menu-list" style="display: none">
    </ul>
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