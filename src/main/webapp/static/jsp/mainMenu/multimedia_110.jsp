<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<jsp:include page="../lib.jsp"></jsp:include>
<link rel="stylesheet" type="text/css" href="/plugins/ali-icon/iconfont.css"/>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
	//基础静态资源请求路径:如：${base}/js/jquery.js
	request.setAttribute("base", path);
	//基础Controller请求路径，如：${baseServlet}/web/login
	request.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!-- 多媒体报警 二级菜单 -->
<!-- 多媒体报警 二级菜单 增加同步到勤务平台、测试报警、无效报警的报警类型 -->

<li>
    <a href="${baseServlet}/web/app110/main/2/0" target="_blank" id="lpjjt"><i
            class="icon iconfont icon-liangpingjiejingtai"></i><span
            style="display: none">两屏接警台</span></a>
</li>
<li>
	<a href="${baseServlet}/web/v2/alarmList" target="_blank" id="jjli_v2"><i
            class="icon iconfont icon-lishijiejing"></i><span
			style="display: none">接警历史</span></a>
</li>
<li>
	<a href="${baseServlet}/web/v2/alarmList?status=1"><i
            class="icon iconfont icon-tongbudaoqinwupingtai"></i><span
			style="display: none">同步到勤务平台</span></a>
</li>
<li>
	<a href="${baseServlet}/web/v2/alarmList?status=12"><i
			class="icon iconfont icon-ceshibaojing"></i><span
			style="display: none">测试报警</span></a>
</li>
<li>
	<a href="${baseServlet}/web/v2/alarmList?status=15"><i
            class="icon iconfont icon-wuxiaobaojing"></i><span
			style="display: none">无效报警</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarmList" target="_blank" id="jjli"><i
			class="icon iconfont icon-lishijiejing"></i><span
			style="display: none">旧版接警历史</span></a>
</li>
<li>
    <a href="${baseServlet}/web/safetyRecord/toList"><i
            class="icon iconfont icon-anquanshouhushen"></i><span
            style="display: none">安全守护神</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarmBlacklist/toList"><i class="icon iconfont icon-heimingdan"
														  aria-hidden="true"></i><span
			style="display: none">报警黑名单</span></a>
</li>
<li>
    <a href="${baseServlet}/web/plan/toPlanPage"><i
            class="icon iconfont icon-jingqingyuan"></i><span
			style="display: none">警情预案</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarmCase/toBusyOperationsPage"><i
			class="icon iconfont icon-fanmangcaozuojilu"></i><span
			style="display: none">繁忙操作记录</span></a>
</li>
<li>
	<a href="${baseServlet}/web/busyStatistics/toStatisticsPage"><i
			class="icon iconfont icon-fanmangcaozuotongji"></i><span
			style="display: none">繁忙操作统计</span></a>
</li>
<li>
	<a href="${baseServlet}/web/numerical/toNumericalStatementPage" target="_blank" id="tongji"><i
			class="icon iconfont icon-jubaoliebiao"></i><span
			style="display: none">用户举报列表</span></a>
</li>
<li>
    <a href="${baseServlet}/web/clue/list/1;" target="_blank" id="jblb"><i
            class="icon iconfont icon-jubaoliebiao"></i><span
            style="display: none">用户举报列表</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarm/transferLog;" target="_blank" id="zjjl"><i
			class="icon iconfont icon-zhuanjielishi"></i><span
			style="display: none">警情转接记录</span></a>
</li>
<li>
	<a href="${baseServlet}/web/alarm/telephoneLog;" target="_blank" id="dhjl"><i
			class="icon iconfont icon-dianhuabaojinglishi"></i><span
			style="display: none">电话报警记录</span></a>
</li>

<!-- 多媒体报警二级菜单 -->
