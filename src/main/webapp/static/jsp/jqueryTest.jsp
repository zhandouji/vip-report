<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="/js/clue/jquery-1.12.3.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        $(function(){
            //第一种直接选择html标签
            alert($("tbody").attr("id"));
            //id #
            alert($("#td").html());
            // class .
            alert($(".cl").html());
        })
    </script>
</head>
<body>
<table style="border: 1px red solid">
    <tbody id="body1" >
        <tr>
            <td id="td">td1</td>
        </tr>
    </tbody>
    <tbody id="body2">
    <tr>
        <td class="cl">td2</td>
    </tr>
    </tbody>
</table>
</body>
</html>
