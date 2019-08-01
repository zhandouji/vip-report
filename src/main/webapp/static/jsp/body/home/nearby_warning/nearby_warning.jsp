<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>附近警情提醒</title>
    <link rel="stylesheet" type="text/css" href="/plugins/layer/skin/layer.css"/>
    <link rel="stylesheet" type="text/css" href="/theme/css/nearby_warning/index.css" />
    <%
        String path = request.getContextPath();
        String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
        //基础静态资源请求路径:如：${base}/js/jquery.js
        request.setAttribute("base", path);
        //基础Controller请求路径，如：${baseServlet}/web/login
        request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
    %>
    <script type="text/javascript">
        var BASEURL = '${baseUrl}';
        var BASE = '${base}';
        var BASESERVLET = '${baseServlet}';
    </script>
</head>
<style type="text/css">
    .nearby-max-box {
        background-color: #fff;
        width: 100%;
        height: 100%;
        min-width: 100%;
        box-sizing: border-box;
    }
    .close-btn{
        display: inline-block;
        position: absolute;
        right: 20px;
        color: red;
    }
</style>

<body>
<div class="nearby-max-box">
    <div class="table-box">
        <table class="table1">
            <tr>
                <th>报警时间</th>
                <th>案发地点</th>
                <th>报警电话</th>
                <th>报警人</th>
                <th>操作</th>
            </tr>
            <tbody id="list">
            </tbody>
        </table>
    </div>
</div>
</body>
<script src="/plugins/js/jquery-2.1.0.js" type="text/javascript" charset="utf-8"></script>
<script src="/plugins/layer-v3.1.1/layer.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/nearby-warning.js" type="text/javascript" charset="utf-8"></script>
<script src="/js/common/date_util.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
    $(document).ready(function(){
        //加载列表数据
        nearby_warning_list();
    });
</script>
</html>