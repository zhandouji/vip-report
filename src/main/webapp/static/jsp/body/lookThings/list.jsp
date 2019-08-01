<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<link rel="stylesheet" href="/theme/css/history.css"/>
<script type="text/javascript" src="/js/jquery.1.9.1.min.js"></script>
<link rel="stylesheet" href="/theme/css/layer.css"/>
<link rel="stylesheet" href="/theme/css/commonTable.css"/>

    <div class="form-box clear">
        <input type="hidden" id="start" name="start" value="${conditon.start}"/>
        <input type="hidden" name="pageSize" value="10"/>
        <div class="form-cell">
            <span>失物名称</span>
            <input type="text" name="name" id="name" value="" placeholder="请输入失物名称"/>
        </div>
        <div class="form-cell">
            <span>状态</span>
            <select id="statusS">
                <c:forEach items="${status}" var="status">
                    <option value="${status.key}">${status.value}</option>
                </c:forEach>
            </select>
        </div>
        <div style="float: right;margin-right: 30px;margin-top: 5px">
            <button id="searchSubmit" class="search-button" type="button" onclick="queryDataList(1);"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;&nbsp;搜索
            </button>
        </div>

    </div>


    <div id="content" class="table-box">
        <!-- data.jsp 失物数据页面 -->
    </div>

<script type="text/javascript">
    $(function () {
        queryDataList(1);
    })

    function queryDataList(page) {
        var status = $("#statusS").val();
        var name = $("#name").val();
        var param = {};
        param.status = status;
        param.name = name;
        param.pageStart = page;
        $.ajax({
            url:"/skynet/web/lookThings/toWebListData",
            type:"POST",
            dataType: "html",
            data: $.param(param),
            success:function(data){
                $("#content").html(data);
            }
        });
    }

    //分页
    function checkData(targetPageNumber){
        queryDataList(targetPageNumber);
    }
</script>
