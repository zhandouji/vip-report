<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilesx"
	uri="http://tiles.apache.org/tags-tiles-extras"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>


<div>
	<form id="fromSeach">
		关键字搜索:<input type="text" id="keyWord" placeholder="请输入关键字进行搜索"
			style="width: 200px; margin-right: 20px;padding: 5px;" value="${condition.keyword}"/>
		 开始日：<input class="laydate-icon" id="startTime" style="width: 200px; margin-right: 10px;" placeholder="请输入开始时间" 
		 	value="<fmt:formatDate value="${condition.startDate }" pattern="YYYY-MM-dd HH:mm:ss" />">
		 结束日：<input class="laydate-icon" id="endTime" style="width: 200px;" placeholder="请输入结束时间" 
		 value="<fmt:formatDate value="${condition.endDate }" pattern="YYYY-MM-dd HH:mm:ss" />">
			<input type="hidden" id="type" value="${alarmTypes[0]}">
		<button id="alarm_bt" type="button">搜索</button>
	</form>
</div>

<!--内容显示div-->
<div class="bjBox">
	<span>
	<c:choose>
		<c:when test="${alarmTypes[0] == 0}">
		普通报警:
		</c:when>
		<c:when test="${alarmTypes[0] == 1}">
		 车辆报警:
		</c:when>
		<c:when test="${alarmTypes[0] == 3}">
		可疑人报警:
		</c:when>
		<c:when test="${alarmTypes[0] == 2}">
		失踪人员报警:
		</c:when>
		<c:when test="${alarmTypes[0] == 6}">
		公安取证:
		</c:when>
		<c:when test="${alarmTypes[0] == 5}">
		突发实时视频:
		</c:when>
	</c:choose>
	共${condition.totalRow}条</span>
	<div class="btnBox">
<!-- 		<a type="text" class="add" href="">分享</a> -->
	</div>
</div>
<div class="clbjBox">
	<c:forEach items='${alarmlist}' var='alarms' varStatus="o">
		<div class="clbj">
			<div class="txBox">
				<c:choose>
					<c:when test="${!empty alarms.creator.icon}">
						<img  src="${baseServlet}/web/file/${alarms.creator.icon}" />
					</c:when>
					<c:when test="${empty alarms.creator.icon}">
						<img src="${base}/static/theme/img/tx.png" />
					</c:when>
				</c:choose>
				<div class="nameBox">
					<div>
						<a href="javascript:;">${alarms.creator.nickName}</a>
					</div>
<%-- 					<span><fmt:formatDate value="${alarms.createDate}" pattern="yyyy年MM月dd日 E" /></span> --%>
					<span><fmt:formatDate value="${alarms.createDate}" type="both" dateStyle="long" timeStyle="long" /></span>
				</div>
			</div>
			<div class="sjgy sjdw">
				<h6 class="title"><a href="javascript:;">${alarms.title}</a></h6>
				<div class="contenter">
					<c:if test="${alarms.files!=null && fn:length(alarms.files)>0 && alarms.type != 5}">
						<a class="sjtp" href="javascript:;"><img src="${baseServlet}/web/file/${alarms.files[0].id}" /></a>
					</c:if>
					<p>
						${fn:substring(alarms.description,0,200)}
					</p>
				</div>
				<div class="address">
					${alarms.address}
					&nbsp;&nbsp;&nbsp;&nbsp;
					<a class="seeAll" href="javascript:openDetails('${alarms.caseId}')">详情</a>
				</div>
			</div>
		</div>
	</c:forEach>
	
	<jsp:include page="../page4js.jsp"></jsp:include>
</div>
<%-- <jsp:include page="${base}/static/jsp/page.jsp" flush="true"></jsp:include> --%>
<script type="text/javascript">
	var start = {
		elem : '#startTime',
		format : 'YYYY-MM-DD hh:mm:ss',
		min : laydate.now() - 1000, //设定最小日期为当前日期
		max : '2099-06-16 23:59:59', //最大日期
		istime : true,
		istoday : false,
		choose : function(datas) {
			end.min = datas; //开始日选好后，重置结束日的最小日期
			end.start = datas //将结束日的初始值设定为开始日
		}
	};
	var end = {
		elem : '#endTime',
		format : 'YYYY-MM-DD hh:mm:ss',
		//min : laydate.now(),
		max : '2099-06-16 23:59:59',
		istime : true,
		istoday : false,
		choose : function(datas) {
			start.max = datas; //结束日选好后，重置开始日的最大日期
		}
	};
	laydate(start);
	laydate(end);
</script>