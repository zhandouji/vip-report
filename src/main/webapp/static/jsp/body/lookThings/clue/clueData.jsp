<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<style type="text/css">
    table1 td{
        min-width: 80px;
    }
</style>
<div style="height: 36px;background-color:#fefae5;line-height: 36px;padding: 0 10px;margin-bottom: 10px">
    <span style="color: #712f15">失物名称: </span>
    <span id="name" style="color: #712f15">${name}</span>
</div>
<input type="hidden" id="start" value="${condition.start}">
<table class="table1">
    <tbody style="background: #FFF;">
    <tr>
        <th>线索人</th>
        <th>线索人联系方式</th>
        <th>线索时间</th>
        <th>线索位置</th>
        <th>线索描述</th>
        <th>操作</th>
    </tr>
    <c:if test="${empty clue}">
        <tr><td colspan="9">暂无数据...</td></tr>
    </c:if>
    <c:forEach items='${clue}' var='item' varStatus="o">
        <tr>
            <td>${item.reporterName == null ? "未知" : item.reporterName}</td>

            <td>${item.reporterPhone}</td>

            <td><fmt:formatDate value="${item.createTime}" pattern="yyyy-MM-dd HH:mm:ss" /></td>

            <td>${item.location}</td>

            <c:if test="${fn:length(item.content) > 30}">
                <td>${fn:substring(item.content, 0, 30)}...</td>
            </c:if>
            <c:if test="${fn:length(item.content) <= 30}">
                <td>${item.content}</td>
            </c:if>

            <td class="">
                <button class="caozuo-button5" onclick="detailClue('${item.id}', '${item.peopleSearchId}');">详情</button>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<jsp:include page="../../page4js.jsp"></jsp:include>

<script type="text/javascript">

    function detailClue(id, peopleSearchId) {
        var start = $("#start").val();
        if(start || start == ''){
            start = 1;
        }
        $.ajax({
            url:"/skynet/web/lookThings/clueDetail?id="+id + "&areaCode=" + areaCode+"&start="+start + "&peopleSearchId="+ peopleSearchId,
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }

</script>
