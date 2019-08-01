<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="tilesx" uri="http://tiles.apache.org/tags-tiles-extras" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
    //基础静态资源请求路径:如：${base}/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如：${baseServlet}/web/login
    request.setAttribute("baseServlet", path + request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>首页</title>
    <link rel="shortcut icon" type="image/x-icon" href="${base}/theme/yjzh-img/main/logo.ico" media="screen"/>
    <link rel="stylesheet" type="text/css" href="${base}/plugins/font-awesome/css/font-awesome.min.css"/>
    <link rel="stylesheet" type="text/css" href="${base}/theme/yjzh-css/main.css"/>
    <link rel="stylesheet" type="text/css" href="${base}/plugins/layer/skin/layer.css"/>
    <link rel="stylesheet" type="text/css" href="${base}/theme/yjzh-css/index.css"/>
    <link rel="stylesheet" type="text/css" href="${base}/theme/yjzh-css/all-page.css"/>
    <script type="text/javascript">
        var BASEURL = '${baseUrl}';
        var BASE = '${base}';
        var BASESERVLET = '${baseServlet}';
    </script>
    <script src="${base}/js/jquery.2.1.4.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.2&key=9cef69900a5e27dcebd883de1cf0b776"></script>
</head>
<body>
<!--最外层盒子-->
<div class="max-box">
    <!--头部盒子外层开始-->
    <div class="top-box clear">
        <img class="logo-icon" src="${base}/theme/yjzh-img/main/logo-icon.png"/>
        <span class="logo-title" id="titleText">应急指挥调度平台</span>
        <img class="logo-leaf" src="${base}/theme/yjzh-img/main/top-leaf.png"/>
        <ul class="user-list">
            <li id="logoutBtn">
                <a><i class="fa fa-power-off color-dark-blue font-size-16px" aria-hidden="true"></i><span
                        class="color-dark-blue">&nbsp;&nbsp;退出</span></a>
            </li>
            <li id="changePassword">
                <a><i class="fa fa-user color-dark-blue font-size-16px" aria-hidden="true"></i><span
                        class="color-dark-blue">&nbsp;&nbsp;您好，${sessionScope.usersession.name}</span></a>
            </li>
        </ul>
    </div>
    <!--头部盒子外层结束-->
    <!--左侧菜单外层盒子开始-->
    <div class="left-box">
        <!--左侧菜单内层盒子开始-->
        <div class="left-inner-box bg-black-blue">
            <!--收起菜单按钮样式开始-->
            <div class="pack-up-box">
                <i class="icon iconfont icon-shouqiliebiao"></i>&nbsp;&nbsp;<span
                    class="color-white">收起菜单</span>
            </div>
            <!--收起菜单按钮样式结束-->
            <!--一级菜单开始-->
            <ul class="left-level1-list">
                <li class="checked-level1">
                    <a id="video" href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/videoRoom',this)">
                        <i class="icon iconfont icon-zhihuizhongxin"></i>&nbsp;&nbsp;<span>指挥中心</span></a>
                </li>
                <li>
                    <a id="history" href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/infoTask/historyList',this)">
                        <i class="icon iconfont icon-lishijilu"></i>&nbsp;&nbsp;<span>历史记录</span></a>
                </li>
                <li>
                    <a id="tempGroupMenu" href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/tempGroup/html',this)">
                        <i class="icon iconfont icon-gongzuozuguanli"></i>&nbsp;&nbsp;<span>工作组管理</span></a>
                </li>
                <li>
                    <a href="javascript:void(0)" onclick="mainchange('${baseServlet}/web/client/uploadPage',this)">
                        <i class="icon iconfont icon-yingyongbanben"></i>&nbsp;&nbsp;<span>应用版本</span></a>
                </li>
            </ul>
            <!--一级菜单结束-->
        </div>
        <!--左侧菜单内层盒子结束-->
    </div>
    <!--左侧菜单外层盒子结束-->

    <!--右侧内容外层盒子开始-->
    <div class="right-box" id="content_main_right">

        <!--右侧内容内层盒子开始-->
        <div class="right-inner-box">

            <!--面包屑开始-->
            <div class="top-nav-box">
                <div class="nav-title">
                    <a class="color-black-gray">应急指挥调度</a><span>&nbsp;>&nbsp;</span>
                    <a id ="live_video" class="color-dark-blue" name="title"></a>
                </div>
                <%--<button id="newTaskBtn" class="button1 color-white bg-dark-blue border-dark-blue" onclick="newTask()">创建任务</button>--%>
                <div class="right-time"></div>
            </div>
            <!--面包屑结束-->
            <!--主要内容外层盒子开始-->
            <div class="content-box">
                <!--主要内容内层盒子开始-->
                <div class="content-inner-box" id="content_main">
                </div>
                <!--主要内容内层盒子结束-->
            </div>
            <!--主要内容外层盒子结束-->
        </div>
        <!--右侧内容内层盒子结束-->
    </div>
    <!--右侧内容外层盒子结束-->
</div>
<div class="float-window-top float-window " style="display: none"></div>
<div id="modal-overlay">
    <div class="modal-data">
        <div class="video-box-feng">
            <div id="cleanDiv" class="treamTop"><a href="javascript:closeLivevideo()">×</a></div>
            <div class="col-md-6 hide">
                <div class="panel panel-default">
                    <div class="panel-body" id="videobox">
                        <video class="rounded centered" id="thevideo" autoplay/>
                        /div>
                    </div>
                </div>
            </div>
            <div class="video-control-box-feng clear">
                <div class="video-control-btn" id="playWindow" data-num="0"></div>
                <div class="progress-bar-max-box">
                    <span class="current-time">00:00</span>
                    <span class="progress-bar-box-feng" onclick="click_current_time(this)">
                        <span class="progress-bar">
                            <span class="current-bar"></span>
                        </span>
                        <span class="current-btn" style="top: -5px;"></span>
                    </span>
                    <span class="total-time">00:00</span>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="${base}/js/yjzh-js/index.js" type="text/javascript" charset="utf-8"></script>
<script src="/plugins/layer/layer.js"></script>
<script src="/js/yjzh-js/home_center.js"></script>
<script src="${base}/js/index.js" type="text/javascript" charset="utf-8"></script>
<script>
    $(function(){
        getGroup();

        if('${pwdLevel}' == 'EASY'){
          layer.alert("您的密码强度过低，请尽快修改！");
        }

    });

    /**
     * 获得group信息
     */
    function getGroup(){
        $.ajax({
            type: "get",
            url: BASESERVLET + "/api/group/getProvinceName",
            dataType: "json",
            contentType: 'application/json',
            success:function(data){
                if(!data.status){
                    return;
                }
                if (data.obj.province !== null && data.obj.province !== undefined && data.obj.province !== ''){
                    console.log(data.obj.province + "-----:陕西公安应急指挥调度平台-----------")
                    if ("陕西省" == data.obj.province) {
                        $("#titleText").html("陕西公安应急指挥调度平台");
                    } else {
                        $("#titleText").html(data.obj.province + "应急指挥调度平台");
                    }
                }
            }
        });
    }

    $("#logoutBtn").click(function () {
        location.href = BASESERVLET + "/web/logout";
    });
    /**绑定鉴定 现场视频4个字  然后 视频 离开房间操作*/
    var flag = false;
    $("#live_video").bind('DOMNodeInserted', function(e) {
        if("指挥中心" ==$("#live_video").text()){
            flag = true;
        }
        if(flag && "指挥中心" !=$("#live_video").text()){
                APP110.mods["video"].leaveRoom();
        }
    });
    $("#changePassword").click(function () {
        layer.open({
            type: 2,
            title: '修改密码',
            shadeClose: true,
            shade: 0.8,
            area: ['500px', '300px'],
            content: BASESERVLET + "/web/user/changePassword"
        })
    });
    function newTask() {
        APP110.callModFun('map','newTask','');
    }
</script>
</body>
</html>
