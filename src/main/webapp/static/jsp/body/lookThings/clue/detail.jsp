<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<script type="text/javascript" src="/js/jquery.1.9.1.min.js"></script>
<link rel="stylesheet" href="/theme/css/full/app_web_data.css">
<script type="text/javascript" src="/plugins/viewer/viewer.js" ></script>
<link type="text/css" rel="stylesheet" href="/plugins/viewer/viewer.css">

<%--详情页面样式的最外层盒子样式--%>
<div class="details-content-max-box clear">
    <%--左侧主要内容最外层盒子开始--%>
        <div class="details-content-left-box">
            <input type="hidden" id="id" value="${info.id}">
            <input type="hidden" id="areaCode" value="${info.areaCode}">
            <div class="content-part-title">
                <span class="color-blue border-blue">线索详情</span>
            </div>
            <div class="details-content-table-box">
                <table  class="details-content-table">
                    <tr>
                        <td>
                            <span>线索人 ：</span>
                            <span>${clue.reporterName}</span>
                        </td>
                        <td>
                            <span>联系方式：</span>
                            <span>${clue.reporterPhone}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>线索位置：</span>
                            <span>${clue.location}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>线索人位置：</span>
                            <span>${clue.reporterLocation}</span></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>线索描述：</span>
                            <span>${clue.content}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>线索照片/视频：</span>
                            <ul id="filePhoto">
                                <li>
                                <span>
                                    <c:forEach items="${clue.imgFiles}" var="img">
                                        <img style="width: 180px; height: 180px" src="/skynet/web/file/${img}" name="photo">
                                    </c:forEach>
                                    <c:forEach items="${clue.videoFiles}" var="video">
                                    <video style="width: 180px; height: 180px" src="/skynet/web/file/${video}" controls="controls">
                                        </c:forEach>
                                </span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
                <div class="back-button-box">
                    <button type="button" onclick="returnBack();">返回</button>
                </div>
            </div>
        </div>
        <%--左侧主要内容外层盒子结束--%>
        <%--右侧主要内容最外层盒子开始--%>
        <div class="details-content-right-box">
            <div class="content-part-title">
                <span class="color-orange border-orange">失物信息</span>
            </div>
            <div class="details-content-table-box">
                <table class="details-content-table">
                    <tr>
                        <td>
                            <span>失物名称：</span>
                            <span>${info.name}</span></td>
                        <td>
                            <span>走失时间：</span>
                            <span>
                                <fmt:formatDate pattern='yyyy-MM-dd HH:mm:ss' value='${info.missTime}'/>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>联系人：</span>
                            <span>${info.contactName}</span>
                        </td>
                        <td>
                            <span>联系方式：</span>
                            <span>
                                ${info.contactPhone}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>走失位置：</span>
                            <span>${info.lnglat}</span>
                        </td>
                        <td>
                            <span>群众线索是否公开：</span>
                            <span>
                                 <c:if test="${info.whetherPublic == 1}">
                                     公开
                                 </c:if>
                                <c:if test="${info.whetherPublic == 2}">
                                    不公开
                                </c:if>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>详细描述：</span>
                            <span>${info.content}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>照片：</span>
                            <ul id="personPhoto">
                                <li>
                                <span>
                                    <c:forEach items="${info.pictures}" var="pic">
                                        <img style="height: 200px; width: 200px" onclick="imgShow(this);" src="/skynet/web/file/${pic}" />
                                    </c:forEach>
                                </span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <%--右侧主要内容最外层盒子结束--%>
</div>
<script type="text/javascript">
    $(function () {
        $('#filePhoto').viewer({
        });
        $('#personPhoto').viewer({
        });
    });
    /**
     * 返回线索列表页
     */
    function returnBack() {
        var id = $("#id").val();
        var areaCode = $("#areaCode").val();
        $.ajax({
            url: "/skynet/web/lookThings/clueList?id=" + id +"&areaCode="+areaCode,
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }
</script>
