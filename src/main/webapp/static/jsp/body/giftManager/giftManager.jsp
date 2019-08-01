<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/history.css"/>
<%--<input type="hidden" id="start" name="start" value="${condition.start}"/>--%>
<%--<input type="hidden" name="pageSize" value="10"/>--%>
<div class="form-box clear">
    <form class="form-horizontal" role="form">
        <div class="form-cell" style="width: 30%;">
            <%--<span>兑换物管理</span>--%>
            <%--<input id="name" type="text" style="width: 60%;"/>--%>
        </div>
        <%--<div class="form-cell" style="width: 45%;">--%>
            <%--<span>状态</span>--%>
            <%--<select name="status" class="form-control" style="width: 50%;">--%>
                <%--<option value="0">--请选择--</option>--%>
                <%--<option value="1" >未发布</option>--%>
                <%--<option value="2" >已发布</option>--%>
                <%--<option value="3" >已撤销</option>--%>
            <%--</select>--%>
        <%--</div>--%>
        <div style="width: 25%; float:left;text-align: right;padding: 8px 28px 0 0;box-sizing: border-box;">
            <%--<button type="button" id="safety_bt" onclick="queryDataList();" class="download-button"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;&nbsp;查询</button>--%>
            <button type="button" onclick="addCase()" class="add-button"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;添加</button>
        </div>
    </form>
    <p class="text-right">

    </p>
</div>
<div id="content" class="table-box">

</div>
<script type="text/javascript">
    $(function () {
        queryDataList();
    })

    function queryDataList() {
        $.ajax({
            url:BASESERVLET + "/gift/getGiftLis",
            type:"post",
            dataType: "html",
            success:function(data){
                $("#content").html(data);
            }
        });
    }

    function addCase() {
        layer.open({
            type: 2,
            title: "添加",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
            area: ['1000px', '600px'],
            content:BASESERVLET + "/gift/editGift"
        });
    }

    function edits(id) {
        layer.open({
            type: 2,
            title: "编辑",
            shadeClose: true,
            closeBtn:1,
            shade: 0.3,
          area: ['1000px', '600px'],
            content:BASESERVLET + "/gift/editGift?id="+id
        });
    }

    function deletes(id) {
        layer.confirm('删除后不可恢复，确认删除吗？', {
            btn: ['是','否'] //按钮
        }, function(){
            $.ajax({
                url:BASESERVLET + "/gift/delGift?id="+id,
                type:"get",
                dataType: "json",
                success:function(data){
                    if(data.code = 200){
                        layer.msg('已删除');
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index);
                        queryDataList();
                    }
                }
            });
        }, function(){
            layer.msg("已取消删除");
        });
    }
</script>