<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<!-- header 开始 -->
<div class="header_box clearfix">
	<h6 class="header_logo pull-left">
		<a href="/skynet/web/home"><img src="/theme/img/Polie-Dispatch-Eenter.png"></a>
	</h6>
	<ul id="header_menu" class="header_nav pull-left">
		<li><a class="menu home" href="javascript:;" menu="">首&nbsp;&nbsp;页</a></li>
		<li><a class="menu home" href="javascript:;" menu="multimedia_110">多媒体报警</a></li>
		<li><a class="menu site" href="javascript:;" menu="maillist_setting">通讯录管理</a></li>
 		<li><a class="menu site" href="javascript:;" menu="system_setting">系统设置</a></li>
	</ul>
	<ul class="header_menu pull-right">
		<li><i class="fa fa-user fa-fw" aria-hidden="true">&nbsp;&nbsp;</i><a href="javascript:;">${sessionScope.usersession.name }</a></li>
		<li id="logoutBtn"><i class="fa fa-power-off fa-fw" aria-hidden="true">&nbsp;&nbsp;</i><a href="javascript:;">退出</a></li>
	</ul>
</div>
<!-- header 结束 -->