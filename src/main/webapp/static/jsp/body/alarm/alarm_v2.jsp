<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="tilesx"
           uri="http://tiles.apache.org/tags-tiles-extras" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%--<link type="text/css" rel="stylesheet" href="/plugins/bootstrap/css/bootstrap.min.css" />--%>
<%--<link rel="stylesheet" type="text/css" href="/theme/css/index.css"/>--%>
<link rel="stylesheet" type="text/css" href="/theme/css/history.css"/>

<div class="form-box clear">
    <form class="form-horizontal" role="form">
        <%--<fieldset>--%>
        <%--<div class="form-group">--%>
        <div class="form-cell">
            <span>辖区单位</span>
            <select id="ah_group" class="form-control">
                <option value="">--请选择--</option>
            </select>
        </div>
        <div class="form-cell">
            <span>报警电话</span>
            <input type="text" class="form-control" id="ah_mobile" placeholder="">
        </div>
        <!--增加id，通过id来控制是否显示-->
        <div class="form-cell" id="status">
            <span>状态</span>
            <select id="ah_status" class="form-control">
                <option value="">--请选择--</option>
                <c:forEach items="${alarmCaseProcessStatus }" var="acs">
                    <option value="${acs.value }">${acs.desc }</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-cell" id="d_need_send_police">
            <span>处警情况</span>
            <select id="need_send_police" class="form-control">
                <option value="">--请选择--</option>
                <c:forEach items="${needSendPolice }" var="acs">
                    <option value="${acs.value }">${acs.desc }</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-cell" id="d_no_need_send_police_reason">
            <span>未处警原因</span>
            <select id="no_need_send_police_reason" class="form-control">
                <option value="">--请选择--</option>
                <c:forEach items="${noNeedSendPoliceReason }" var="acs">
                    <option value="${acs.value }">${acs.desc }</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-cell">
            <span>关键字</span>
            <input type="text" class="form-control" id="keyWord" placeholder="">
        </div>
        <div class="form-cell">
            <span>开始时间</span>
            <input class="form-control " id="startTime" type="text" onclick="changeTime()" value="">
        </div>
        <div class="form-cell">
            <span>结束时间</span>
            <input type="text" class="form-control " id="endTime" onclick="changeTime()" value="">
        </div>
        <div class="form-cell">
            <span>报警来源</span>
            <select id="caseFrom" class="form-control">
                <c:forEach items="${caseFromMap }" var="m">
                    <c:if test="${m.key == caseFromPerson}">
                        <option value="">${m.value }</option>
                    </c:if>
                    <c:if test="${m.key != caseFromPerson}">
                        <option value="${m.key }">${m.value }</option>
                    </c:if>
                </c:forEach>
            </select>
        </div>
        <div class="form-cell" style="width: 60%">
            <span>警情分类</span>
            <ul class="form-four-list clear">
                <li>
                    <select id="ah_type" class="form-control">
                        <option value="">--请选择--</option>
                    </select>
                </li>
                <li>
                    <select id="ah_type2" class="form-control">
                        <option value="">--请选择--</option>
                    </select>
                </li>
                <li>
                    <select id="ah_type3" class="form-control">
                        <option value="">--请选择--</option>
                    </select>
                </li>
                <li>
                    <select id="ah_type4" class="form-control">
                        <option value="">--请选择--</option>
                    </select>
                </li>
            </ul>
        </div>
        <div class="form-cell">
            <span></span>
            <button type="button" id="alarm_bt" onclick="checkData(1)"><i class="fa fa-search"
                                                                          aria-hidden="true"></i>&nbsp;&nbsp;查询
            </button>
        </div>
        <%--</div>--%>
        <%--</fieldset>--%>
    </form>
    <p class="text-right">

    </p>
</div>
<div id="alarm_tab_div" class="table-box">
    <!-- alarm_list.jsp 报警历史信息列表 -->

</div>
<script type="text/javascript" src="/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="/js/alarm/alarm_v2.js"></script>
<script type="text/javascript">
  var status = '<%=request.getAttribute("status")%>';
  //如果不是选择“接警历史”，则status不显示
  $(document).ready(function () {
    if (status == 1) {
      $("#need_send_police option[value='1']").attr("selected", "selected");
      $("#d_need_send_police").css('display', 'none');

      $("#d_no_need_send_police_reason").css('display', 'none');
    } else if (status == 12) {
      $("#need_send_police option[value='0']").attr("selected", "selected");
      $("#d_need_send_police").css('display', 'none');

      $("#no_need_send_police_reason option[value='12']").attr("selected", "selected");
      $("#d_no_need_send_police_reason").css('display', 'none');
    } else if (status == 15) {
      $("#need_send_police option[value='0']").attr("selected", "selected");
      $("#d_need_send_police").css('display', 'none');

      $("#no_need_send_police_reason option[value='15']").attr("selected", "selected");
      $("#d_no_need_send_police_reason").css('display', 'none');
    }

  });
</script>