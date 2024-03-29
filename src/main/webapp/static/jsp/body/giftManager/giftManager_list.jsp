<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<style type="text/css">
    table1 td{
        min-width: 80px;
    }
</style>
<input id="totalRow" type="hidden" value="${info.totalRow}" />
<input id="currPage" type="hidden" value="${info.currPage}" />
<table class="table1">
    <tbody style="background: #FFF;">
    <tr>
        <th>礼品ID</th>
        <th>礼品名称</th>
        <th>礼品积分</th>
        <th>礼品单位</th>
        <th>礼品数量</th>
        <th>操作</th>
    </tr>
    <c:if test="${empty info.list}">
        <tr><td colspan="6">暂无数据...</td></tr>
    </c:if>
    <c:forEach items='${info.list}' var='item' varStatus="o">
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
            <td>${item.unit}</td>
            <td>${item.count}</td>
            <td class="">
                <button class="caozuo-button5" onclick="editsGift('${item.id}')">编辑</button>
                <button class="caozuo-button4" onclick="deletes('${item.id}')">删除</button>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
