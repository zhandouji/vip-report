<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
    <script type="text/javascript" src="/js/jquery.1.9.1.min.js"></script>
    <link rel="stylesheet" href="/theme/css/layer.css"/>
    <link rel="stylesheet" href="/theme/css/commonTable.css"/>
    <link rel="stylesheet" href="/theme/css/full/index.css"/>
    <div class="layer-box">
        <div class="layer-content-box">
                <input type="hidden" id="id" value="${info.id}">
                <input type="hidden" id="areaCode" value="${info.areaCode}">
                <input type="hidden" id="start" value="${start}">
            <table class="layer-table1">
                <tr>
                    <td>状    态：</td>
                    <td id="status">${info.statusName}</td>
                </tr>

                <tr>
                    <td>失物名称：</td>
                    <td>${info.name}</td>
                </tr>
                <tr>
                    <td>丢失时间：</td>
                    <td>
                        <fmt:formatDate pattern='yyyy-MM-dd HH:mm:ss' value='${info.missTime}'/>
                    </td>
                </tr>
                <tr>
                    <td> 联系人：</td>
                    <td>
                        ${info.contactName}
                    </td>
                </tr>
                <tr>
                    <td>联系方式：</td>
                    <td>
                        ${info.contactPhone}
                    </td>
                </tr>
                <tr>
                    <td>走失位置：</td>
                    <td>
                        ${info.lnglat}
                    </td>
                </tr>
                <tr>
                    <td>群众线索是否公开：</td>
                    <td>
                        <c:if test="${info.whetherPublic == 1}">
                            公开
                        </c:if>
                        <c:if test="${info.whetherPublic == 2}">
                            不公开
                        </c:if>
                    </td>
                </tr>
                <tr>
                    <td>详细描述：</td>
                    <td>
                        ${info.content}
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="caozuo-button1" style="width: 120px" onclick="clues('${info.id}', '${info.areaCode}')">线索列表</button>
                    </td>
                    <td>
                        <button class="caozuo-button3" onclick="returnBack();">返回</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
<script type="text/javascript">


    /**
     * 跳转到线索列表页面
     * @param id 寻物记录的主键
     * @param areaCode 寻物记录的行政区划
     * personStart : 当前记录所在的页数
     */
    function clues(id, areaCode){
        $.ajax({
            url:"/skynet/web/lookThings/clueList?id="+id+"&areaCode="+areaCode,
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }

    function returnBack() {
        $.ajax({
            url:"/skynet/web/lookThings/toWebList",
            type:"get",
            dataType: "html",
            success:function(data){
                $("#content_main").html(data);
            }
        });
    }
</script>
