<%@ page language="java" pageEncoding="utf-8" session="false"%>
<jsp:useBean id="condition" type="com.pancm.pojo.bean.QueryCondition" scope="request"/>
<%
	com.pancm.pojo.bean.QueryCondition pagination = condition;
%>
<style>
<!--
.pagination input {
	border: 0px;
	margin: -6px -12px;
	margin-top: -12px;
	line-height: 2em;
	text-align: center;
}
#myPageNav{
	margin:10px 0;
}
#myPageNav.center {
	text-align: center;
}
#myPageNav.left {
	text-align: left;
}
#myPageNav.right {
	text-align: right;
}
#myPageNav ul.pagination{
	display:block;
	padding:0;
	margin:0;
}
#myPageNav ul.pagination li{
	display:inline-block;
	margin:0;
	
	/*border:1px solid #ccc;*/
	color:#1c86a5;
}
#myPageNav ul.pagination li a{
	color:#1c86a5;
	display:block;
	padding:5px;
}
#myPageNav ul.pagination li:hover{
	background: #364860;
}
#myPageNav ul.pagination li:hover a{
	color:#1c86a5;
}

#myPageNav ul.pagination li.disabled a{
	color:#868686;
}
#myPageNav ul.pagination li.disabled:hover{
	background:transparent;
}
-->
</style>
<script type="text/javascript">
<!--
	var __pagination = {
		total_page : <%=pagination.getTotalPage()%>
	};
	function nan(p){
		var pv = p.value;
		p.value = p.value.replace(/\D/g, '');
		if(p.value>__pagination.total_page){
			p.value = __pagination.total_page;
		}
	}
//-->
</script>
<nav id="myPageNav" class="right">
	<ul class="pagination" style="margin:0px;">
	<%
		long currentPage = pagination.getStart();
	%>
	<input type="hidden" id="currentPage" name="currentPage" value="<%=currentPage %>"/>
	<%
		if (pagination.getTotalPage() > 1) {
			if (pagination.getStart() == 1L) {
	%>
				<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到首页">首页</a></li>
				<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到上一页">上一页</a></li>
				<li class="disabled"><span><%=currentPage%>/<%=pagination.getTotalPage()%></span></li>
				<li><a href="javascript:checkData(<%=currentPage + 1%>,<%=pagination.getTotalRow() %>)"  class="btn_pagectrl" title="跳转到下一页">下一页</a>
				<li><a href="javascript:checkData(<%=pagination.getTotalPage()%>,<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到尾页">尾页</a>
			<%} else if (currentPage < pagination.getTotalPage()) {%>
				<li><a href="javascript:checkData('1',<%=pagination.getTotalRow()%>);" class="btn_pagectrl" title="跳转到首页">首页</a>
				<li><a href="javascript:checkData(<%=currentPage - 1%>,<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到上一页">上一页</a>
				<li class="disabled"><span><%=currentPage%>/<%=pagination.getTotalPage()%></span></li>
				<li><a href="javascript:checkData(<%=currentPage + 1%>,<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到下一页">下一页</a>
				<li><a href="javascript:checkData(<%=pagination.getTotalPage()%>,<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到尾页">尾页</a>
			<%} else {%>
				<li><a href="javascript:checkData('1',<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到首页">首页</a>
				<li><a href="javascript:checkData(<%=currentPage - 1%>,<%=pagination.getTotalRow()%>)" class="btn_pagectrl" title="跳转到上一页">上一页</a>
				<li class="disabled"><span><%=currentPage%>/<%=pagination.getTotalPage()%></span></li>
				<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到下一页">下一页</a></li>
				<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到尾页">尾页</a></li>
			<%}%>
<%-- 		
		<%if (1 != pagination.getTotalPage()) {%>
			<li><a><input id="page" name="page" type="text" size="3" onkeyup="nan(this)" onchange="nan(this)" placeholder="页码"/></a></li>
			<li><a href="javascript:void(0)" onclick="checkData($('#page').val(),<%=pagination.getTotalCount()%>);" class="btn btn-default" title="跳转到指定页" role="button">跳转到指定页</a></li>
		<%}else{%>
			<li><a><input id="page" name="page" type="text" size="3" onkeyup="nan(this)" onchange="nan(this)" placeholder="页码"/></a></li>
			<li><a href="javascript:void(0)" class="btn btn-default" title="跳转到指定页" role="button">跳转到指定页</a></li>
		<%}%>
--%>		
	<%}else{%>
		<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到首页">首页</a></li>
		<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到上一页">上一页</a></li>
		<li class="disabled"><span><%=currentPage%>/1</span></li>
		<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到下一页">下一页</a></li>
		<li class="disabled"><a href="javascript:void(0)" class="btn_pagectrl" title="跳转到尾页">尾页</a></li>
<%--
		<li><a><input id="page" name="page" type="text" size="3" onkeyup="nan(this)" onchange="nan(this)" placeholder="页码"/></a></li>
		<li><a href="javascript:void(0)" class="btn btn-default" title="跳转到指定页" role="button">跳转到指定页</a></li>
--%>
	<%}%>
	</ul>
</nav>