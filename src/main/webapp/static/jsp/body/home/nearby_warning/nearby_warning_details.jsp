<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>附近警情详情</title>
    <link rel="stylesheet" type="text/css" href="/plugins/layer/skin/layer.css"/>
    <link rel="stylesheet" type="text/css" href="/theme/css/nearby_warning/index.css"/>
    <link rel="stylesheet" type="text/css" href="/theme/css/nearby_warning.css"/>
    <%
        String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request
                .getServerPort() + path;
        //基础静态资源请求路径:如：${base}/js/jquery.js
        request.setAttribute("base", path);
        //基础Controller请求路径，如：${baseServlet}/web/login
        request.setAttribute("baseServlet",
                path + request.getAttribute("javax.servlet.forward.servlet_path"));
    %>
    <style>
        .tt{
            padding: 0px;
            width:990px;
            height:500px;
            text-align:center;
            display: table-cell;
            vertical-align:middle
        }
        .tt span{
            font-size: 24px;
        }
    </style>
    <script type="text/javascript">
      var BASEURL = '${baseUrl}';
      var BASE = '${base}';
      var BASESERVLET = '${baseServlet}';
    </script>
</head>

<body>
<c:if test="${empty bean}">
    <div class="tt">
        <span>该警情已经被处理</span>
        <p style="padding-top: 30px"><button class="add-button" type="button" onclick="backs();">返回</button></p>
    </div>
</c:if>
<c:if test="${!empty bean}">
        <div class="nearby-max-box clear">
            <!--附近警情视频外层盒子开始-->

                <div class="nearby-video-box">
                    <div class="nearby-video" id="videoremote"
                         style="background: url(/theme/img/jiejingtai/video-bg.jpg) no-repeat center top ">
                    </div>
                </div>
                <!--附近警情视频外层盒子结束-->
                <!--附近警情相关信息外层盒子开始-->
                <div class="nearby-message-box">
                    <table class="nearby-message-table">
                        <tr>
                            <td>报警人姓名：</td>
                            <td>${bean.name == null ? bean.mobile:bean.name}</td>
                        </tr>
                        <tr>
                            <td>联系电话：</td>
                            <td>${bean.mobile}</td>
                        </tr>
                        <tr>
                            <td>报警时间：</td>
                            <td><fmt:formatDate value="${bean.caseTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
                        </tr>
                        <tr>
                            <td>事发地点：</td>
                            <td>${bean.caseAddress}</td>
                        </tr>
                    </table>
                    <div class="deal-with-button">
                        <button type="button" class="bg-blue " onclick="nearbyLeaveRoom()">暂不处理</button>
                        <button type="button" class="bg-rose-red"
                                onclick="nearbyWarningFinish('${bean.caseId}', '${bean.videoRoom}', '${handleUser.id}', '${handleUser.name}')">
                            挂断该报警
                        </button>
                    </div>
                    <p class="warning-text">*点击挂断后会提示报警人该警情已安排处理</p>
                </div>
                <!--附近警情相关信息外层盒子结束-->
    </div>
</c:if>
</body>
<script src="/plugins/js/jquery-2.1.0.js" type="text/javascript" charset="utf-8"></script>
<script src="/plugins/layer-v3.1.1/layer.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/nearby-warning.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/kurento/kurento-utils.min.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/kurento/kurento_room.js" type="text/javascript" charset="utf-8"></script>
<script src="/plugins/sockjs/sockjs.min.js" type="text/javascript"></script>
<script src="/plugins/stomp/stomp.min.js" type="text/javascript"></script>
<script src="/js/socket.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/js.util.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
  $(function () {
    var videoremote = $("#videoremote");
    if(videoremote){
      initNearbyKurento('${bean.videoRoom}', '${bean.pin}');
    }
  });
  function backs(){
    close_layer();
    open_layer_list();
  }
</script>


</html>
