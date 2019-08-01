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
        <table class="layer-table6">
            <tr>
                <td>姓　　名：</td>
                <td><input type="text" id="memberName" value="${info.memberName}"  style="width:840px;" /></td>
            </tr>

            <tr>
                <td>会员性别：</td>
                <td>
                    <select id="sex" name="sex"  style="width:840px;">
                    <option value="1" <c:if test="${info.sex==1}">selected</c:if>>男</option>
                    <option value="2" <c:if test="${info.sex==2}">selected</c:if>>女</option>
                </select></td>
            </tr>
            <tr>
                <td>会员电话：</td>
                <td><input id="phone" type="text" value="${info.phone}"  style="width:840px;" /></td>
            </tr>
            <tr>
                <td>会员邮箱：</td>
                <td><input id="email" type="text" value="${info.email}"  style="width:840px;" /></td>
            </tr>
            <tr>
                <td>介绍人：</td>
                <td><input id="person" type="text" value="${info.personPhone}"  style="width:840px;" /></td>
            </tr>
            <tr>
                <td colspan="2" class="submit-button-box">
                    <button onclick="saveOrUpdate()">保存</button>
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
            var memberName = $("#memberName").val();
            var phone = $("#phone").val();

            var email = $("#email").val();

            var person = $("#person").val();

            var sex = $("select[name='sex']").val();

            if(!memberName){
                layer.msg('请输入会员姓名', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            if(!sex){
                layer.msg('请选择会员性别', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            if(!phone){
                layer.msg('请输入会员联系方式', {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            var json = {
                "memberName":memberName,
                "email":email,
                "phone":phone,
                "sex": sex,
                "personPhone": person,
                "id":$("#id").val()
            }
            $.ajax({
                url:BASESERVLET + "/member/saveOrUpdate",
                type:"post",
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(json),
                success:function (data) {
                    if(data.code == 200){
                        var index = parent.layer.getFrameIndex(window.name);
                        window.parent.queryDataList(1);
                        parent.layer.close(index);
                    }else {
                        layer.msg("保存失败，请刷新重试", {icon: 2});
                    }
                }
            })
        }

    </script>
    </body>
</html>
