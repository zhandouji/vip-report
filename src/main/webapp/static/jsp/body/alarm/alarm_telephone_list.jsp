<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="tilesx"
           uri="http://tiles.apache.org/tags-tiles-extras" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<link rel="stylesheet" type="text/css" href="/theme/css/history.css"/>
<style>
    .form-cell {
        width: 500px;
    }

    .form-cell input[type="text"] select {
        display: inline-block;
        width: 290px;
        height: 30px;
        line-height: 30px;
        text-align: right;
    }
</style>
<div id="alarm_tab_div" class="table-box">
    <input type="hidden" id="start" name="start" value="${condition.start}"/>
    <input type="hidden" name="pageSize" value="10"/>
    <table class="table1">
        <tbody style="background: #FFF;">
        <tr>
            <th>报警人</th>
            <th>联系电话</th>
            <th>报警地点</th>
            <th>报警类型</th>
            <th>报警时间</th>
        </tr>
        <c:forEach items='${allLog}' var='log' varStatus="o">
            <tr>
                <td>${log.creatorName}</td>
                <td>${log.phone}</td>
                <td>${log.address}</td>
                <td>${log.alarmType}</td>
                <td><fmt:formatDate value="${log.alarmTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
    <jsp:include page="/jsp/body/page4js.jsp"/>
</div>
<script type="text/javascript" src="/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
  function openDetails(id) {
    layer.open({
      type: 2,
      title: "警情详情",
      shadeClose: true,
      shade: 0.3,
      area: ['80%', '80%'],
      content: BASESERVLET + "/web/alarmdetails/" + id
    });
  }

</script>