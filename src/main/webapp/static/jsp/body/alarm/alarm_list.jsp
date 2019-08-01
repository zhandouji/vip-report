<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilesx"
	uri="http://tiles.apache.org/tags-tiles-extras"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<style type="text/css">
	table1 td{
		min-width: 80px;
	}
</style>
<table class="table1">
	<tbody style="background: #FFF;">
	<tr>
		<th>状态</th>
		<th>报警时间</th>
		<th>地点</th>
		<th>报警电话</th>
		<th>报警人</th>
		<th>报警内容</th>
		<th>警情类别</th>
		<th>接警员</th>
		<th>操作</th>
	</tr>
	<c:forEach items='${alarmlist}' var='alarms' varStatus="o">
		<c:set value="${ alarms.creator}" var="keys"></c:set>
		<tr>
			<td>
				<c:if test="${(alarms.status == 0) || (alarms.status == 1)}">
					<span class="list-color-span color-span-red" style="width: 90px;">${statusMap[alarms.status].desc}</span>
				</c:if>
				<c:if test="${(alarms.status == 2) || (alarms.status == 3) || (alarms.status == 4) || (alarms.status == 5) || (alarms.status == 6) || (alarms.status == 102) || (alarms.status == 103) || (alarms.status == 104)}">
					<span class="list-color-span color-span-yellow" style="width: 90px;">${statusMap[alarms.status].desc}</span>
				</c:if>
				<c:if test="${(alarms.status == 7) || (alarms.status == -3) || (alarms.status == -4) || (alarms.status == -2) ||(alarms.status == 8)}">
					<span class="list-color-span color-span-green" style="width: 90px;">${statusMap[alarms.status].desc}</span>
				</c:if>
			</td>
			<td><fmt:formatDate value="${alarms.time}" pattern="yyyy-MM-dd HH:mm:ss" /></td>
			<td>${alarms.address}</td>
			<c:choose>
				<c:when test="${alarms.creator.phone == null}">
				<td>无</td>
				</c:when>
				<c:when test="${alarms.creator.phone != null}">
				<td>${alarms.creator.phone}</td>
				</c:when>
			</c:choose>
			<td>${alarms.creator.name==null || alarms.creator.name=='' ? alarms.creator.nickName : alarms.creator.name}</td>
			<td>${alarms.description}</td>
			<td>${alarms.type}</td>
			<td>${alarms.receiver.nickName}</td>
			<td>
				<button class="button2" onclick="openDetails('${alarms.caseId}')">查看详情</button>
				<c:if test="${alarms.status == -2}"> <button class="button2 color-span-red" onclick="openDelete('${alarms.caseId}')">删除</button>
				</c:if>
				<%--<c:if test="${(alarms.status == 2) || (alarms.status == 3) || (alarms.status == 4) || (alarms.status == 5) || (alarms.status == 6) || (alarms.status == 102) || (alarms.status == 103) || (alarms.status == 104)}">--%>
					<%--&nbsp;&nbsp;<button class="button2 color-span-green" onclick="openVideo('${alarms.caseId}')">实时视频</button>--%>
				<%--</c:if>--%>
			</td>
		</tr>
	</c:forEach>
	</tbody>
</table>
<jsp:include page="../page4js.jsp"></jsp:include>
