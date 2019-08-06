<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/history.css"/>
<link rel="stylesheet" type="text/css" href="${base}/static/theme/css/page.css"/>
<script src="${base}/static/js/page_js/MyPage.js"></script>
<div class="form-box clear">
    <form class="form-horizontal" role="form">
        <div class="form-cell" style="width: 30%;">
            <span>兑换物管理</span>
            <input id="name" type="text" style="width: 60%;"/>
        </div>
        <div style="width: 25%; float:left;text-align: right;padding: 8px 28px 0 0;box-sizing: border-box;">
            <button type="button" id="safety_bt" onclick="queryDataList();" class="download-button"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;&nbsp;查询</button>
            <button type="button" onclick="addGift()" class="add-button"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;添加</button>
        </div>
    </form>
</div>
<div id="content" class="table-box">
</div>
<%--分页插件--%>
<div class="page" id="Page"></div>

<script type="text/javascript">
    $(function () {
        queryDataList(1);
        setPage();
    })

    function setPage() {
        P.initMathod({
            params: {
                elemId: '#Page',
                total: $("#totalRow").val(),
                pageIndex : $("#currentPage").val()
            },
            requestFunction: function() {
                queryDataList(P.config.pageIndex);
            }
        });
    }

    function queryDataList(page) {
        $.ajax({
            url:BASESERVLET + "/gift/getGiftLis",
            type:"get",
            data:{"name":$("#name").val(), "pageNum": page},
            dataType: "html",
            async:false,
            success:function(data){
                $("#content").html(data);
            }
        });
    }

    function addGift() {
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

    function editsGift(id) {
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