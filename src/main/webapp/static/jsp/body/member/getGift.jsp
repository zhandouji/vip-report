<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
    <head>
        <title>Title</title>
        <jsp:include page="/static/jsp/body/common/lib.jsp"></jsp:include>
        <link rel="stylesheet" href="${base}/static/theme/css/index.css">
    </head>
    <body>
    <div class="layer-box" style="min-width: 100%;">
        <input type="hidden" id="id" value="${info.id}">
        <input type="hidden" id="score">

        <table class="layer-table6">
            <tr>
                <td>礼品选择：</td>
                <td>
                    <select id="gift" name="gift"  style="width:640px;" onchange="changeUnit();">
                        <option value="0">请选择</option>
                        <c:forEach items='${info.list}' var='item' varStatus="o">
                            <option value="${item.id}" unit = "${item.unit}" score = "${item.score}">${item.name}</option>
                        </c:forEach>
                    </select>
                </td>
            </tr>

            <tr>
                <td>礼品单位：</td>
                <td><input id="unit" type="text" style="width:840px;" /></td>
            </tr>
            <tr>
                <td>兑换数量：</td>
                <td><input id="count" type="text"onchange="changeCount(this)" style="width:840px;" /></td>
            </tr>
            <tr>
                <td>所需积分：</td>
                <td><input id="totalScore" type="text" style="width:840px;" readonly/></td>
            </tr>
            <tr>
                <td>会员积分：</td>
                <td><input id="memberIntegral" type="text" value="${info.memberIntegral}"  style="width:840px;" readonly/></td>
            </tr>
            <tr>
                <td colspan="2" class="submit-button-box">
                    <button id="saveBtn" onclick="saveOrUpdate()">保存</button>
                </td>
            </tr>
        </table>
    </div>

    <script type="text/javascript">
        $(function () {
        });

        /**
         * 保存
         */
        function saveOrUpdate() {
            var giftId = $("#gift option:selected").val();

            var count = $("#count").val();

            if(giftId == 0){
                layer.msg('请选择要兑换的礼品', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            if(count == '' && count == 0){
                layer.msg('请输入兑换的礼品数', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }

            var json = {
                "count":count,
                "giftId":giftId,
                "id":$("#id").val()
            }
            $.ajax({
                url:BASESERVLET + "/member/saveGift",
                type:"post",
                dataType:"json",
                data:json,
                success:function (data) {
                    if(data.code == 200){
                        var index = parent.layer.getFrameIndex(window.name);
                        window.parent.queryDataList(1);
                        parent.layer.close(index);
                    }else {
                        layer.msg("失败，" + data.msg, {icon: 2});
                    }
                }
            })
        }

        /**
         * 更改单位
         */
        function changeUnit() {
            var select = $('#gift option:selected');
            if(select.value == 0){
                $("#unit").val("");
                $("#score").val("");
                return;
            }
            $("#unit").val(select.attr("unit"));
            $("#score").val(select.attr("score"));
        }

        /**
         * 改变积分
         */
        function changeCount(obj) {
            var count = obj.value;
            var reg = new RegExp("^\\+?[1-9][0-9]*$");
            if(!reg.test(count)){
                layer.msg('请输入非零正整数', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var totalCount = $("#score").val() * count;
           $("#totalScore").val(totalCount);
            if(totalCount > $("#memberIntegral").val()){
                $("#saveBtn").css({'background-color' : 'gray'});
                $("#saveBtn").attr("disabled", true);
            }else {
                $("#saveBtn").css({'background-color' : ''});
                $("#saveBtn").attr("disabled", false);

            }
        }
    </script>
    </body>
</html>
