<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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
    <title>人脸识别</title>
    <meta charset="utf-8">
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <script type="text/javascript" src="/js/jquery.2.1.4.min.js"></script>
</head>
<body>
<div class="face-recognition-box clear">
    <table id="faceImgs" class="table1 table-hover table-bordered table-striped"
           style="background:#8ab5ce; white-space: nowrap;">
        <input type="hidden" id="start" name="start" value="${condition.start}"/>
        <input type="hidden" name="pageSize" value="10"/>
        <c:if test="${!empty faceImgList}">
            <div class="face-recognition">
                <c:forEach items='${faceImgList}' var='item' varStatus="o">
                    <img width="120px" height="120px" class="face-recognition-img"
                         id='${item.fileId}'
                         src='${videoDownloadUrl}/faceDetect/${item.faceUrl}'/>
                </c:forEach>
            </div>
            <jsp:include page="../page4js.jsp"></jsp:include>
        </c:if>
        <c:if test="${empty faceImgList}">
            <div class="face-recognition">
                暂无数据
            </div>
        </c:if>
    </table>
</div>
</body>
</html>


