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
        <th>会员账号</th>
        <th>会员名称</th>
        <th>会员性别</th>
        <th>会员电话</th>
        <th>会员邮箱</th>
        <th>会员积分</th>
        <th>介绍人</th>
        <th>注册时间</th>
        <th>操作</th>
    </tr>
    <c:if test="${empty info.list}">
        <tr><td colspan="5">暂无数据...</td></tr>
    </c:if>
    <c:forEach items='${info.list}' var='item' varStatus="o">
        <tr>
            <td>${item.id}</td>
            <td>${item.memberName}</td>
            <c:if test="${item.sex == 1}"><td>男</td></c:if>
            <c:if test="${item.sex == 2}"><td>女</td></c:if>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td>${item.memberIntegral}</td>
            <td>${item.personPhone}</td>
            <td><fmt:formatDate value="${item.createTime}" pattern="yyyy-MM-dd HH:mm:ss" /></td>
            </td>
            <td class="">
                <c:if test="${item.giftFlag == true}">
                    <button class="caozuo-button5" onclick="getGift('${item.id}')">兑换</button>
                </c:if>
                <button class="caozuo-button5" onclick="edits('${item.id}')">编辑</button>
                <button class="caozuo-button4" onclick="deleteOne('${item.id}')">删除</button>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>


<script type="text/javascript">

    function edits(id) {
        layer.open({
            type: 2,
            title: "修改",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
            area: ['1000px', '650px'],
            content: BASESERVLET + "/member/getMemberById?id="+id
        });
    }

    function getGift(id) {
        layer.open({
            type: 2,
            title: "兑换礼品",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
            area: ['1000px', '650px'],
            content: BASESERVLET + "/member/getGift?id="+id
        });
    }

</script>
