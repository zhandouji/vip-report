<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/history.css"/>

<div class="form-box clear">
    <form class="form-horizontal" role="form">
        <div class="form-cell" style="width: 30%;">
            <span>查询条件</span>
            <input id="param" type="text" style="width: 60%;"/>
        </div>
        <%--<div class="form-cell" style="width: 45%;">--%>
            <%--<span>状态</span>--%>
            <%--<select name="statusS" class="form-control" style="width: 50%;">--%>
                <%--<option value="0">--请选择--</option>--%>
                <%--<option value="1" >未发布</option>--%>
                <%--<option value="2" >已发布</option>--%>
            <%--</select>--%>
        </div>
        <div style="width: 25%; float:left;text-align: right;padding: 8px 28px 0 0;box-sizing: border-box;">
            <button type="button" id="safety_bt" onclick="queryDataList(1)" class="download-button"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;&nbsp;查询</button>
            <button type="button" onclick="addCase()" class="add-button"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;添加</button>
        </div>
    </form>
    <p class="text-right">

    </p>
</div>
<div id="content" class="table-box">
    <!-- 会员列表 -->
</div>
<script type="text/javascript">
    $(function () {
        queryDataList(1);
    })

    function queryDataList(page) {
        var search = $("#param").val();
        var params = {};
        params.pageNum = 1;
        params.param = search;
        $.ajax({
            url:BASESERVLET + "/member/getMembersList",
            type:"POST",
            data: params,
            dataType: "html",
            success:function(data){
                $("#content").html(data);
            }
        });
    }

    function deleteOne(id) {
        layer.confirm('删除后不可恢复，确认删除吗？', {
            btn: ['是','否'] //按钮
        }, function(){
            $.ajax({
                url:BASESERVLET + "/member/deleteOne?id=" + id,
                type:"get",
                dataType: "json",
                success:function(data){
                    if(data.code = 200){
                        layer.msg('已删除');
                        window.parent.queryDataList(1);
                    }
                }
            });
        }, function(){
            layer.msg("已取消删除");
        });
    }

    function addCase() {
        layer.open({
            type: 2,
            title: "添加",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
            area: ['1000px', '650px'],
            content: BASESERVLET + "/member/getMemberById"
        });
    }

</script>