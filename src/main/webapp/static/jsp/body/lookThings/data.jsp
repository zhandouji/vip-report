<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<script type="text/javascript" src="/js/jquery.1.9.1.min.js"></script>
<link rel="stylesheet" href="/theme/css/layer.css"/>
<link rel="stylesheet" href="/theme/css/commonTable.css"/>
<link rel="stylesheet" href="/theme/css/full/index.css"/>
<style type="text/css">
    table1 td{
        min-width: 80px;
    }
</style>
<input type="hidden" id="start" value="${condition.start}">
<input type="hidden" id="id" value="">
<input type="hidden" id="areaCode" value="">
<table class="table1">
    <tbody style="background: #FFF;">
    <tr>
        <th>失物名称</th>
        <th>状态</th>
        <th>联系人</th>
        <th>联系方式</th>
        <th>丢失时间</th>
        <th>操作</th>
    </tr>
    <c:if test="${empty list}">
        <tr><td colspan="9">暂无数据...</td></tr>
    </c:if>
    <c:forEach items='${list}' var='item' varStatus="o">
        <tr>
            <td>${item.name}</td>
            <td>
               ${item.statusName}
            </td>
            <td>${item.contactName}</td>
            <td>${item.contactPhone}</td>
            <td><fmt:formatDate value="${item.missTime}" pattern="yyyy-MM-dd HH:mm:ss" /></td>
            <td class="">
                <button class="caozuo-button5" onclick="edits('${item.id}','${item.areaCode}')">详情</button>
                <button class="caozuo-button2" style="width: 70px" onclick="clueList('${item.id}','${item.areaCode}')">线索列表</button>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
<jsp:include page="../page4js.jsp"></jsp:include>

<script type="text/javascript">


    function clueList(id, areaCode) {
        $.ajax({
            url:"/skynet/web/lookThings/clueList?id="+id+"&areaCode="+areaCode,
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }
    function edits(id, areaCode) {
        var start = $("#start").val();
        if(start || start == ''){
            start = 1;
        }
        $.ajax({
            url: "/skynet/web/lookThings/toWebDetail?id="+id + "&areaCode=" + areaCode+"&start="+start,
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }

</script>
