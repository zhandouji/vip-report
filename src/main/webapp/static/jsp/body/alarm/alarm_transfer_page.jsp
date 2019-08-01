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
<div id="content">
    <div class="form-box clear">
        <form class="form-horizontal" role="form">
            <div class="form-cell">
                <span>状态</span>
                <select id="status" name="status" class="form-control">
                    <option value="">--请选择--</option>
                    <option value="0">转出</option>
                    <option value="1">转入</option>
                </select>
            </div>
            <div class="form-cell">
                <span>转出方</span>
                <input type="text" class="form-control" id="outCenter" placeholder="">
            </div>
            <div class="form-cell">
                <span>转入方</span>
                <input class="form-control " id="inCenter" type="text">
            </div>
            <div class="form-cell">
                <span>操作人</span>
                <input type="text" class="form-control" id="name" placeholder="">
            </div>

            <div class="form-cell">
                <span>开始时间</span>
                <input type="text" class="form-control " id="startTime" onclick="changeTime()">
            </div>
            <div class="form-cell">
                <span>结束时间</span>
                <input type="text" class="form-control " id="endTime" onclick="changeTime()">
            </div>
            <div class="form-cell">
                <span></span>
                <button type="button" id="alarm_bt" onclick="checkData(1)"><i class="fa fa-search"
                                                                              aria-hidden="true"></i>&nbsp;&nbsp;查询
                </button>
            </div>
        </form>
        <p class="text-right">

        </p>
    </div>
    <div id="alarm_tab_div" class="table-box">
        <input type="hidden" id="start" name="start" value="${condition.start}"/>
        <input type="hidden" name="pageSize" value="10"/>
    </div>
</div>
<script type="text/javascript" src="/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
  $(function () {
    checkData(1);
  });

  function checkData(targetPageNumber) {
    $("#start").val(targetPageNumber);
    var status = $("#status").val()
    var outCenter = $("#outCenter").val();
    var inCenter = $("#inCenter").val();
    var name = $("#name").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var start = $("input[name='start']").val();
    var param = {
      "status": status,
      "outCenter": outCenter,
      "inCenter": inCenter,
      "name": name,
      "start": start,
      "startTime": startTime,
      "endTime": endTime,
      "pageNumber": start
    }
    $.ajax({
      url: "/skynet/web/alarm/checkTransferLog",
      type: "post",
      contentType: "application/json",
      dataType: "html",
      data: JSON.stringify(param),
      success: function (data) {
        $("#alarm_tab_div").html("").html(data);
      }
    });
  }

  //时间
  function changeTime() {
    WdatePicker({dateFmt: 'yyyy-MM-dd HH:mm:ss'});
  }
</script>