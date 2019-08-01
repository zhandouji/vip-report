<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
    <head>
        <title></title>
        <jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
        <link rel="stylesheet" href="${base}/static/theme/css/index.css">
    </head>
    <style>
        #imgs img{
            width: 144px;
            height: 144px;
            margin: 5px 10px 5px 0;
        }
    </style>
    <body>
    <div class="layer-box" style="min-width: 100%;padding-top: 10px;box-sizing: border-box;">
        <input type="hidden" id="id" value="${info.id}">
        <table class="layer-table6">
            <tr>
                <td>礼品名称：</td>
                <td><input type="text" id="name" name="name" value="${info.name}"  style="width:760px;" /></td>
            </tr>

            <tr>
                <td>礼品积分：</td>
                <td><input id="score" name="score" type="text" value="${info.score}"  style="width:760px;" /></td>
            </tr>
            <tr>
                <td>礼品单位：</td>
                <td><input id="unit" name="unit" type="text" value="${info.unit}"  style="width:760px;" /></td>
            </tr>
            <tr>
                <td>礼品数量：</td>
                <td><textarea id="count" name="count" style="width:760px;border-radius: 3px;resize: none;height: 60px;padding-left: 5px;vertical-align: text-top;">${info.count}</textarea></td>
            </tr>
            <tr>
                <td colspan="2" class="submit-button-box">
                    <button onclick="save()">保存</button>
                </td>
            </tr>
        </table>
    </div>

    <script type="text/javascript">
        /**
         * 保存
         */
        function save() {
            var id = $("#id").val();
            //积分
            var name = $("#name").val();
            if(!name){
                layer.msg('请输入礼品名称', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var score = $("#score").val();
            if(!score){
                layer.msg('请输入积分，只支持整数', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var unit = $("#unit").val();
            if(!unit){
                layer.msg('请输入礼品单位', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var count = $("#count").val();
            if(!count){
                layer.msg('请输入礼品数量', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var json = {};
            if(id == ""){
                json = {
                    "name":name,
                    "score": score,
                    "unit":unit,
                    "count":count
                }
            }else {
                json = {
                    "id":id,
                    "name":name,
                    "score": score,
                    "unit":unit,
                    "count":count
                }
            }

            $.ajax({
                url:BASESERVLET + "/gift/saveOrUpdate",
                type:"post",
                dataType:"json",
                data:$.param(json),
                success:function (data) {
//                    layer.msg(data.error);
                    if(data.code = 200){
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        window.parent.queryDataList();//访问父页面方法
                        parent.layer.close(index);
                    }
                }
            })
        }
    </script>
    </body>
</html>
