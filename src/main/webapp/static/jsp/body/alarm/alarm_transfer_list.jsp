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
            <th>状态</th>
            <th>转出方</th>
            <th>转入方</th>
            <th>操作人</th>
            <th>操作时间</th>
            <th>操作</th>
        </tr>
        <c:forEach items='${allLog}' var='log' varStatus="o">
            <tr>

                <td><c:if test="${log.status==1}"><span
                        class="unfinish-warning-button1">转出</span></c:if>
                    <c:if test="${log.status==0}"><span
                            class="unfinish-warning-button1">转入</span></c:if>
                </td>
                <td>${log.transferOutCenter}</td>
                <td>${log.transferInCenter}</td>
                <td>${log.operatorName}</td>
                <td><fmt:formatDate value="${log.transferTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
                <td>
                    <button class="button2" onclick="openDetails('${log.caseId}')">查看详情</button>
                        <%-- <button class="button2 color-span-red" style="color: white"
                               onclick="deleteLog('${log.id}')">删除
                       </button>--%>
                </td>
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