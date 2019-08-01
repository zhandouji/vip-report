<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<script type="text/javascript" src="/js/jquery.1.9.1.min.js"></script>
<link rel="stylesheet" href="/theme/css/layer.css"/>
<link rel="stylesheet" href="/theme/css/commonTable.css"/>
<link rel="stylesheet" href="/theme/css/full/history.css"/>

<div class="form-box clear">
    <input type="hidden" id="start" name="start" value="${conditon.start}"/>
    <input type="hidden" name="pageSize" value="10"/>
    <div class="form-cell">
        <span>线索人</span>
        <input type="text" name="name" id="name" value="" placeholder=""/>
    </div>
    <div class="form-cell" style="width: 66%;">
        <span>线索时间</span>
        <input id="sdate" name="sdate" value=""
               class="Wdate" style="width:200px;height: 32px;border: 1px solid #dedede;border-radius: 3px;background-color: #fff;padding: 0px 5px;"
               onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',readOnly:true,maxDate:'#F{$dp.$D(\'edate\')}'})"/>
        至
        <input id="edate" name="edate" value=""
               class="Wdate" style="width:200px;height: 32px;border: 1px solid #dedede;border-radius: 3px;background-color: #fff;padding: 0px 5px;"
               onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',readOnly:true,minDate:'#F{$dp.$D(\'sdate\')}',startDate:'#F{$dp.$D(\'sdate\',{d:+1})}'})"/>
        <button type="submit" class="search-button" onclick="queryDataList(1)"><i
                class="fa fa-search color-white" aria-hidden="true"></i>&nbsp;&nbsp;搜索
        </button>
        </button>
    </div>
</div>


<div id="content" class="table-box">
    <!-- clueList.jsp 线索列表 -->
</div>

<script type="text/javascript" src="/plugins/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
    var id = '${id}';
    var areaCode = '${areaCode}';
    $(function () {
        queryDataList(1);
    })

    /**
     * 查询线索列表
     * @param page
     */
    function queryDataList(page) {
        var name = $("#name").val();
        var sdate = $("#sdate").val();
        var edate = $("#edate").val();
        var param = {};
        param.reporterName = name;
        param.beginTime = sdate;
        param.endTime = edate;
        param.pageStart = page;
        param.peopleSearchId = id;
        param.areaCode = areaCode;
        $.ajax({
            url:"/skynet/web/lookThings/clueData",
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
