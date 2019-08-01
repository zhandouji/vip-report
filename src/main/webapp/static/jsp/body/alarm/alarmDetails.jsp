<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String path = request.getContextPath();
    String basePath =
            request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                    + path;
    //基础静态资源请求路径:如${base}/static/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如${baseServlet}/web/login
    request.setAttribute("baseServlet",
            path + request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!DOCTYPE html>
<html>
<head>
    <title>警情详情</title>
    <meta charset="utf-8">
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <style>
        td {
            text-align: center;
        }

        .bg-rose-red {
            background-color: #f65959 !important;
        }
        .video-mini {
            float: right;
            width: 28px;
            height: 28px;
            background: url(/theme/img/jiejingtai/video-mini.png) no-repeat center;
            margin: 15px 55px 0 0;
        }
        /*视频时间轴外层盒子样式*/

        .history-video-list-box {
            width: 100%;
            min-width: 1100px;
            height: 570px;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 12px;
            text-align: left;
            background-color: #fff;
        }

        .history-video-list {
            background-image: url(/theme/img/jiejingtai/history--video-bg.png);
            background-repeat-x: no-repeat;
            background-position-y: repeat;
            background-position-x: 117px;
        }

        /*创建视频时间*/

        .create-video-time {
            display: inline-block;
            width: 88px;
            text-align: right;
            vertical-align: top;
            color: #999;
        }

        /*时间轴中心圆环样式*/

        .video-time-icon {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
            text-align: center;
            vertical-align: top;
        }

        .video-time-icon b {
            position: absolute;
            display: block;
            top: 0;
            right: 12px;
            bottom: 0;
            left: 12px;
            border-radius: 50%;
            background-color: #c6c6c6;
            margin: auto;
            border: 4px solid #fff;
        }

        /*被选中中心圆环样式*/

        .checked-time-icon .video-time-icon b {
            background: #217ede;
            border: 4px solid #a6d3f0;
        }

        /*被选中行创建时间样式*/

        .checked-time-icon .create-video-time {
            color: #217ede;
        }

        /*时间轴视频外层盒子样式*/

        .timer-shaft-video-box {
            display: inline-block;
        }

        /*视频类型样式*/

        .timer-shaft-video-type {
            color: #333;
            font-weight: 600;
            font-size: 16px;
        }

        /*被选中行视频类型样式*/

        .checked-time-icon .timer-shaft-video-type {
            color: #217ede;
        }

        .timer-shaft-video-inner-box {
            width: 840px;
            min-height: 360px;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .timer-shaft-video {
            position: relative;
            float: left;
            width: 260px;
            height: 320px;
            background-color: #333;
            margin: 0 20px 20px 0;
        }

        .timer-shaft-video-title {
            width: 100%;
            height: 60px;
            padding: 8px;
            box-sizing: border-box;
        }

        .timer-shaft-video-title p {
            color: #fff;
            line-height: 22px;
        }

        .before-play-video {
            position: absolute;
            top: 60px;
            right: 0;
            bottom: 0;
            left: 0;
            background: #333;
            z-index: 60;
            text-align: center;
            padding-top: 75px;
        }

        .before-play-video button {
            padding: 6px 18px;
            border: 2px solid transparent;
            border-radius: 5px;
            margin-bottom: 16px;
            font-weight: 600;
        }

        .color-white-blue {
            color: #40a0dd !important;
        }

        .border-white-blue {
            border-color: #40a0dd !important;
        }
        .timer-shaft-video-control-box > i {
            color: #fff;
            font-size: 18px;
            line-height: 36px;
            margin: 0 3px;
            vertical-align: middle;
        }

        .shaft-video-progress-bar-box > span {
            display: inline-block;
            font-size: 12px;
            color: #fff;
            vertical-align: middle;
        }

        .jingqing-video {
            width: 1515px;
            height: 680px;
        }

    </style>
    <link type="text/css" rel="stylesheet" href="/theme/css/site.css">
    <link type="text/css" rel="stylesheet" href="/theme/css/index.css">
    <link rel="stylesheet" type="text/css" href="/theme/css/myself-layer-window.css"/>
    <link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
    <link type="text/css" rel="stylesheet" href="/theme/css/jdxq.css">
    <link type="text/css" rel="stylesheet" href="/theme/css/video2.css">
    <link type="text/css" rel="stylesheet" href="/theme/css/viewer.min.css">
    <script type="text/javascript">
      var BASEURL = '${baseUrl}';
      var BASE = '${base}';
      var BASESERVLET = '${baseServlet}';
    </script>
    <script type="text/javascript" src="/js/jquery.2.1.4.min.js"></script>
    <script type="text/javascript" src="/plugins/layer/layer.js"></script>
    <script type="text/javascript" src="/plugins/viewer/viewer.js"></script>
    <script type="text/javascript" src="/js/kurento/kurento-utils.js"></script>
    <script type="text/javascript" src="/js/kurento/kurento_player.js"></script>
    <script type="text/javascript" src="/js/alarm/playHistoryVideo.js"></script>
</head>
<body>
<div class="content-main-details">
    <div class="main-details-nav">
        <ul id="details-nav-ul">
            <li class="click">报警单信息</li>
            <li>报警视频</li>
            <li>报警流程</li>
            <li>人脸识别</li>
        </ul>
    </div>

    <div id="five_div">
        <div class="main-details-bjdxx" style="overflow-y: auto;">
            <table style="margin-top:3px;" class="table2">
                <tr>
                    <td>报警人姓名</td>
                    <td>${af.name}</td>
                    <td>性别</td>
                    <td><c:if test="${af.gender==0}">女</c:if>
                        <c:if test="${af.gender==1}">男</c:if>
                    </td>
                    <td>联系电话</td>
                    <td>${af.creator.phone}</td>
                    <td>来话类别</td>
                    <td>${af.alarmClass }</td>
                </tr>
                <tr>
                    <td>报警时间</td>
                    <td><fmt:formatDate value="${af.time}" type="date"
                                        pattern="yyyy-MM-dd HH:mm:ss"/></td>
                    <td>警情级别</td>
                    <td>
                        ${af.caseLevel}
                    </td>
                    <td>辖区单位</td>
                    <td>${af.group.name}</td>
                    <td>接警员</td>
                    <td><span>${af.receiver.nickName}</span></td>
                </tr>
                <tr>
                    <td>警情类别</td>
                    <td>${af.type}</td>
                    <td>警情来源</td>
                    <td>
                        <c:if test="${af.caseFromMark == null ||af.caseFromMark eq '' || af.caseFromMark == caseFromPerson}">
                            自主报警
                        </c:if>
                        <c:if test="${(af.caseFromMark eq caseFromSafe) || af.caseFromMark eq caseFromSos}">
                            <a href="javascript:openSafe('${af.creator.userId}','${af.caseFromMarkId}');"
                               style="color: red">${caseFrom.get(af.caseFromMark)}</a>
                        </c:if>
                    </td>
                    <td>状态</td>
                    <td>${af.processStatusInfo}</td>
                    <td>报警方式</td>
                    <td>${af.alarmTypeDesc }</td>
                </tr>
                <tr>
                    <td>联系地址</td>
                    <td colspan="3">${af.creator.address}</td>
                    <td>事发地址</td>
                    <td colspan="3">${af.address}</td>
                </tr>
                <tr>
                    <td>主要情节</td>
                    <td colspan="3">${af.description}</td>
                    <td>处警建议</td>
                    <td colspan="3">${ahe.suggest}</td>
                </tr>
                <tr>
                    <td>警情描述</td>
                    <td colspan="7" id="chat_td" style="text-align: left;">
                        <c:forEach items="${af.media.text }" var="cm" varStatus="index">
                            <div>
                                <c:if test="${empty cm.nickName}">
                                    <span class="sender" id="u_${index.index }"
                                          sender=${cm.sender} style="color:#2b399e;">${af.mobile}</span>
                                </c:if>
                                <c:if test="${!empty cm.nickName}">
                                    <span class="sender" id="u_${index.index }"
                                          sender=${cm.sender} style="color:#2b399e;">${cm.nickName}</span>
                                </c:if>
                                <span style="color: #1b92e5; font-size: 12px;">(<fmt:formatDate
                                        value="${cm.time }" pattern="yyyy-MM-dd HH:mm:ss"/>)</span>：
                                <c:choose>
                                    <c:when test="${fn:contains(cm.text, '[img]' )}">
                                        <ul name="photos"
                                            style="display: inline-block;vertical-align: text-top;">
                                            <li>
                                                <img width="400" height="350"
                                                     src="/skynet/web/file/${fn:trim(fn:substringBefore(fn:substringAfter(cm.text, '[img]'), '[/img]'))}"/>&nbsp;
                                            </li>
                                        </ul>
                                    </c:when>
                                    <c:when test="${fn:contains(cm.text, '[video]' )}">
                                        <video width="500" height="350" controls="controls"
                                               style="vertical-align: text-top;">
                                            <source src="/skynet/web/file/${fn:trim(fn:substringBefore(fn:substringAfter(cm.text, '[video]'), '[/video]'))}"
                                                    type="video/mp4"/>
                                            当前浏览器不支持 video直接播放，点击这里下载视频：
                                            <a href="/skynet/web/file/${policeFile.fileId}">下载视频</a>
                                        </video>
                                        &nbsp;
                                    </c:when>
                                    <c:when test="${fn:contains(cm.text, '[voice]' )}">
                                        <audio src="/skynet/web/file/${fn:trim(fn:substringBefore(fn:substringAfter(cm.text, '[voice]'), '[/voice]'))}"
                                               width="400" height="100" controls="controls"
                                               controlsList="nodownload"
                                               style="vertical-align: middle;">
                                        </audio>
                                    </c:when>
                                    <c:otherwise>
                                        <span class="chat_msg">${cm.text }</span>
                                        &nbsp;
                                    </c:otherwise>
                                </c:choose>
                            </div>
                        </c:forEach>
                    </td>
                </tr>
            </table>
        </div>
        <%--报警视频开始--%>
        <div class="tab-content">
            <div class="table3-box">
                <table class="table2 jingqing-video">
                    <tr>
                        <td class="font-blod">报警视频</td>
                        <td>
                            <!--------------------新接警视频外层盒子开始------------------------>
                            <div class="history-video-list-box" id="list-box"
                                 style="display: block">

                                <c:if test="${empty listMap.tvl && empty listMap.pav && empty listMap.ov}">
                                    暂无视频数据
                                </c:if>
                                <ul class="history-video-list">
                                    <%--报警人报警视频pav   民警接警视频ov--%>
                                    <c:if test="${not empty listMap.pav|| not empty listMap.ov}">
                                        <li class="checked-time-icon">
                                        <span class="create-video-time">
                                            <c:if test="${not empty listMap.pav}">
                                             <c:forEach items="${listMap.pav}" var="pavItem"
                                                     varStatus="sta2">
                                                <c:if test="${not empty sta2.first}">
                                                     <fmt:formatDate
                                                             value="${pavItem.records.startTime}"
                                                             pattern="yyyy-MM-dd HH:mm:ss"/></span>
                                            </c:if>

                                            </c:forEach>
                                            </c:if>
                                            <c:if test="${empty listMap.pav}">
                                                <c:forEach items="${listMap.ov}" var="ovItem"
                                                           varStatus="sta2">
                                                    <c:if test="${not empty sta2.first}">
                                                        <fmt:formatDate
                                                                value="${ovItem.records.startTime}"
                                                                pattern="yyyy-MM-dd HH:mm:ss"/></span>
                                                    </c:if>
                                                </c:forEach>
                                            </c:if>
                                            <span class="video-time-icon"><b></b></span>
                                            <!--视频外层盒子开始-->
                                            <div class="timer-shaft-video-box">
                                                <!--视频类型开始-->
                                                <p class="timer-shaft-video-type">[群众报警]</p>
                                                <!--视频类型结束-->
                                                <!--视频内层盒子开始-->
                                                <div class="timer-shaft-video-inner-box clear">
                                                    <c:if test="${not empty listMap.pav}">
                                                        <c:forEach items="${listMap.pav}"
                                                                   var="pavItem" varStatus="sta2">
                                                            <!--报警人视频开始-->
                                                            <div class="timer-shaft-video">
                                                                <input type="hidden" id="roomId"
                                                                       value="${af.media.id}">
                                                                <input type="hidden" id="userId"
                                                                       value="${af.creator.userId}">
                                                                <!--报警人信息开始-->
                                                                <div class="timer-shaft-video-title bg-rose-red">
                                                                    <p>[报警人]</p>
                                                                    <p>${af.name}
                                                                        <c:if test="${empty af.name}">暂无</c:if>-
                                                                        <c:if test="${pavItem.gender==0}">女</c:if><c:if
                                                                                test="${pavItem.gender==1}">男</c:if><c:if
                                                                                test="${empty pavItem.gender}">暂无</c:if>-${pavItem.phone}</p>
                                                                </div>
                                                                <!--报警人信息结束-->
                                                                <!--视频遮罩开始-->
                                                                <div class="before-play-video">
                                                                    <button class="bg-rose-red color-white">
                                                                        <a class="color-white"
                                                                           onclick="showVideoBox('${pavItem.records.videoFile}')">查看视频</a>
                                                                    </button>
                                                                    <br/>
                                                                    <a target="_blank"
                                                                       href="${videoDownloadUrl}/video/${fn:substring(pavItem.records.videoFile, 13, 150)}">
                                                                        <button class="border-rose-red color-rose-red">
                                                                            下载视频
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                                <!--视频遮罩结束-->
                                                            </div>
                                                        </c:forEach>
                                                    </c:if>
                                                    <!--报警人视频结束-->
                                                    <c:if test="${not empty listMap.ov}">
                                                        <c:forEach items="${listMap.ov}"
                                                                   var="ovItem" varStatus="sta2">
                                                            <!--接警员视频开始-->
                                                            <div class="timer-shaft-video">
                                                                <!--接警员信息开始-->
                                                                <div class="timer-shaft-video-title bg-blue">
                                                                    <p>[接警人]</p>
                                                                    <p>${ovItem.nickName}-<c:if
                                                                            test="${ovItem.gender==0}">女</c:if><c:if
                                                                            test="${ovItem.gender==1}">男</c:if>-
                                                                            ${ovItem.policeId}
                                                                        <c:if test="${empty ovItem.policeId}">
                                                                            ${ovItem.phone}
                                                                        </c:if>

                                                                    </p>
                                                                </div>
                                                                <!--接警员信息结束-->
                                                                <!--视频遮罩开始-->
                                                                <!--视频遮罩开始-->
                                                                <div class="before-play-video">
                                                                    <button class="bg-blue color-white">
                                                                        <a class="color-white"
                                                                           onclick="showVideoBox('${ovItem.records.videoFile}')">查看视频</a>
                                                                    </button>
                                                                    <br/>
                                                                    <a target="_blank"
                                                                       href="${videoDownloadUrl}/video/${fn:substring(ovItem.records.videoFile, 13, 150)}">
                                                                        <button class="border-white-blue color-white-blue">
                                                                            下载视频
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                                <!--视频遮罩结束-->
                                                            </div>
                                                            <!--接警员视频结束-->
                                                        </c:forEach>
                                                    </c:if>

                                                </div>
                                                <!--视频内层盒子结束-->
                                            </div>
                                            <!--视频外层盒子结束-->
                                        </li>
                                    </c:if>

                                    <%--警民沟通视频tvl--%>
                                    <c:if test="${not empty listMap.tvl}">
                                        <li>
                                        <span class="create-video-time">
                                            <c:forEach items="${listMap.tvl}" var="item"
                                                    varStatus="sta2">
                                                <c:if test="${sta2.first}">
                                                     <fmt:formatDate
                                                             value="${item.records.startTime}"
                                                             pattern="yyyy-MM-dd HH:mm:ss"/></span>
                                            </c:if>
                                            </c:forEach>
                                            <span class="video-time-icon"><b></b></span>
                                            <!--视频外层盒子开始-->
                                            <div class="timer-shaft-video-box">
                                                <!--视频类型开始-->
                                                <p class="timer-shaft-video-type">[警民沟通]</p>
                                                <!--视频类型结束-->
                                                <!--视频内层盒子开始-->
                                                <div class="timer-shaft-video-inner-box clear">
                                                    <c:forEach var="item" items="${listMap.tvl}">
                                                        <c:if test="${item.userId==af.creator.userId}">
                                                            <!--报警人视频开始-->
                                                            <div class="timer-shaft-video">
                                                                <!--报警人信息开始-->
                                                                <div class="timer-shaft-video-title bg-rose-red">
                                                                    <p>[报警人]</p>
                                                                    <p>${af.name}
                                                                        <c:if
                                                                                test="${empty af.name}">暂无</c:if>-<c:if
                                                                                test="${item.gender==0}">女</c:if><c:if
                                                                                test="${item.gender==1}">男</c:if><c:if
                                                                                test="${empty item.gender}">暂无</c:if>-${item.phone}</p>
                                                                </div>
                                                                <!--报警人信息结束-->
                                                                <!--视频遮罩开始-->
                                                                <div class="before-play-video">
                                                                    <button class="bg-rose-red color-white">
                                                                        <a class="color-white"
                                                                           onclick="showVideoBox('${item.records.videoFile}')">查看视频</a>
                                                                    </button>
                                                                    <br/>
                                                                    <a target="_blank"
                                                                       href="${videoDownloadUrl}/video/${fn:substring(item.records.videoFile, 13, 150)}">
                                                                        <button class="border-rose-red color-rose-red">
                                                                            下载视频
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                                <!--视频遮罩结束-->
                                                            </div>
                                                            <!--报警人视频结束-->
                                                        </c:if>
                                                        <c:if test="${item.userId!=af.creator.userId && item.role==3}">
                                                                <!--接警员视频开始-->
                                                                <div class="timer-shaft-video">
                                                                    <!--接警员信息开始-->
                                                                    <div class="timer-shaft-video-title bg-blue">
                                                                        <p>[民警]</p>
                                                                        <p>${item.nickName}
                                                                            <c:if
                                                                                    test="${empty item.nickName}">暂无</c:if>-<c:if
                                                                                    test="${item.gender==0}">女</c:if><c:if
                                                                                    test="${item.gender==1}">男</c:if><c:if
                                                                                    test="${empty item.gender}">暂无</c:if>-${item.policeId}
                                                                            <c:if test="${empty item.policeId}">
                                                                                ${item.phone}
                                                                            </c:if>
                                                                        </p>
                                                                    </div>
                                                                    <!--接警员信息结束-->
                                                                    <!--视频遮罩开始-->
                                                                    <div class="before-play-video">
                                                                        <button class="bg-blue color-white">
                                                                            <a class="color-white"
                                                                               onclick="showVideoBox('${item.records.videoFile}')">查看视频</a>
                                                                        </button>
                                                                        <br/>
                                                                        <a target="_blank"
                                                                           href="${videoDownloadUrl}/video/${fn:substring(item.records.videoFile, 13, 150)}">
                                                                            <button class="border-white-blue color-white-blue">
                                                                                下载视频
                                                                            </button>
                                                                        </a>
                                                                    </div>
                                                                    <!--视频遮罩结束-->
                                                                </div>
                                                                <!--接警员视频结束-->

                                                        </c:if>
                                                    </c:forEach>
                                                </div>
                                                <!--视频内层盒子结束-->
                                            </div>
                                            <!--视频外层盒子结束-->
                                        </li>
                                    </c:if>
                                </ul>
                            </div>
                            <!------------------------新接警视频外层盒子结束----------------------------------->
                            <div class="play-video-box" id="play-box" style="display:none">

                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <%--报警视频结束--%>
        <%--报警流程开始--%>
        <div>
            <table class="table1 table-hover table-bordered table-striped"
                   style="background:#8ab5ce; white-space: nowrap;">
                <thead style="color: #fff;">
                <tr>
                    <th>报警时间</th>
                    <th>事件流程</th>
                </tr>
                </thead>
                <tbody style="background: #e7eef4;">
                <c:forEach items='${clList}' var='caselog' varStatus="o">
                    <tr>
                        <td>${caselog.time}</td>
                        <td>${caselog.event}</td>
                    </tr>
                </c:forEach>
                </tbody>
            </table>
        </div>
        <%--报警流程结束--%>
        <%--人脸抓取开始--%>
        <div id="faceImages">
            暂无数据
        </div>
        <%--人脸抓取结束--%>

    </div>
</div>
<script>
  //显示聊天的人名
  $(function () {
    var uids = [];
    $.each($("#chat_td .sender"), function (i, s) {
      uids.push(s.getAttribute("sender"));
    });
    console.log(uids);
    if (uids && uids.length > 0) {
      getUser4Chat(uids, 0);
    }
    checkData();
  });

  //播放视频
  function showVideoBox(file) {
    $("#list-box").attr("style", "display:none");
    var html = " <table class='table2'>\n"
        + "                                    <tr>\n"
        + "                                        <td>\n"
        + "                                            <div class='video-box'>\n"
        + "                                                <div class='col-md-6 hide' id='video'>\n"
        + "                                                    <div class='panel panel-default'>\n"
        + "                                                        <div class='panel-body' id='videobox'>\n"
        + "                                                            <video class=\"rounded centered\" id=\"thevideo\" width=640 height=480 autoplay/>\n"
        + "                                                        </div>\n"
        + "                                                    </div>\n"
        + "                                                </div>\n"
        + "                                                <div class=\"video-control-box\">\n"
        + "                                                    <%--视频开始按钮--%>\n"
        + "                                                      <div class='video-control-btn' id='auto_play' onclick=\"playVideo(this,'"
        + file + "')\" data-num=\"0\"></div>\n"
        + "                                                        <div class='progress-bar-max-box'>\n"
        + "                                                           <span class='current-time'>00:00</span>\n"
        + "                                                             <span class='progress-bar-box' onclick=\"click_current_time(this)\">\n"
        + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"progress-bar\">\n"
        + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"current-bar\"></span>\n"
        + "\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n"
        + "\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"current-btn\"></span>\n"
        + "\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n"
        + "                                                                        <span class=\"total-time\">00:00</span>\n"
        + "                                                                    </div>\n"
        + "                                                      <div class='video-mini' id='auto_play' onclick='returnList()' data-num=\"0\"></div>\n"
        + "                                                </div>\n"

        + "                                            </div>\n"
        + "                                        </td>\n"
        + "                                    </tr>\n"
        + "                                </table>  ";
    $("#play-box").html(html);
    $("#play-box").attr("style", "display:block");
    $(".current-bar").css("width", 0);
    $("#auto_play").click();
  }

  function returnList() {
    stop();
    $("#play-box").attr("style", "display:none");
    $("#list-box").attr("style", "display:block");
  }

  //nav切换开始
  function aaaa() {
    var li = document.getElementById("details-nav-ul").getElementsByTagName('li');
    var div = document.getElementById("five_div").children;
    for (var i = 0; i < li.length; i++) {
      li[i].index = i;
      li[i].onclick = function () {
        for (var j = 0; j < div.length; j++) {
          div[j].className = "";
          li[j].className = "";
        }
        li[this.index].className = "click";
        div[this.index].className = "main-details-bjdxx";
      }
    }
  }

  aaaa();
  //nav切换结束
  var m, n;
  $('#jq22').viewer({
    url: 'data-original',
    viewed: function () {
      //切换完成后所调用函数
      m = $('.viewer-active').index('.viewer-list li');
      n = $('#jq22 li').eq(m).find('span').text();
      var com = $("<div id='text'></div>"); //要添加的元素
      $('#text').remove();
      $(".viewer-container").append(com);    //将元素添加到弹层中
      $('#text').text("");
      $('#text').text(n);
      setTimeout(function () {
        var w = $('.viewer-canvas img').css('width');
        $('#text').css('width', w);
        var h = $('.viewer-canvas img').css('height');
        var h1 = 100 + parseInt(h);
        $('#text').css('top', h1 + 'px');
      }, 200);
    }
  });

  var alarmDetailCache = {};

  function getUser4Chat(uids, i) {
    if (alarmDetailCache[uids[i]]) {
      showUser4Chat(alarmDetailCache[uids[i]], uids, i)
      return;
    }
    console.log(uids[i]);
    $.ajax({
      type: "post",
      url: BASESERVLET + "/api/UserInfo",
      data: {userId: uids[i]},
      dataType: "json",
      success: function (data) {
        console.log("%s,%o ", i, data.obj)
        var user = data.obj;
        showUser4Chat(user, uids, i)
      }
    });
  }

  function showUser4Chat(user, uids, i) {
    var name = user.name ? user.name : user.nickName ? user.nickName : user.phone;
    var s = $("#u_" + i);
    if (user.userId == '${af.creator.userId}') {
      s.html(name + '【报警人】');
    } else {
      s.html(name);
      s.addClass("police");
    }
    alarmDetailCache[user.userId] = user;
    i++;
    if (i >= uids.length) {
      text2Img();
      return;
    }
    getUser4Chat(uids, i);
  }

  function text2Img() {
    $.each($("#chat_td .chat_msg"), function (i, msgSpan) {
      var msg = $(msgSpan).html();
      if (msg && msg.indexOf("[img]") == 0) {
        msg = msg.replace("[img]", "").replace("[/img]", "");
        msg = '<img class="chat_img" width="80" src="' + BASESERVLET + '/web/file/' + msg + '"/>';
      }
      $(msgSpan).html(msg);

    });
  }

  function openSafe(uid, id) {
    window.open('/skynet/web/safetyRecord/toMap/' + uid + '/' + id);
  }

  function checkData() {
    var roomId = $("#roomId").val();
    var userId = $("#userId").val();
    if (roomId != undefined || userId != undefined) {
      $.ajax({
        url: "/skynet/api/alarm/getFaceImages/" + roomId + "/" + userId,
        type: "get",
        contentType: "application/json",
        dataType: "html",
        success: function (data) {
          $("#faceImages").html("").html(data);
        }
      })
    }

  }
</script>
</body>
</html>


