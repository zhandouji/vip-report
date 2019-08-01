<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilesx" uri="http://tiles.apache.org/tags-tiles-extras"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%String path = request.getContextPath();String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;//基础静态资源请求路径:如：${base}/static/js/jquery.jsrequest.setAttribute("base", path);//基础Controller请求路径，如：${baseServlet}/web/loginrequest.setAttribute("baseServlet", path+request.getAttribute("javax.servlet.forward.servlet_path"));%>
<script type="text/javascript" src="${base}/static/js/app110/alarmDescription.js"></script>

<link rel="stylesheet" type="text/css" href="/theme/css/history.css"/>
<form class="form-horizontal" role="form">
			<input type="hidden" id="ad_id"  value="${data.id}"  >
			<input  id="ad_groupid" type="hidden" value="${data.groupid}"  >

		<div style="height:100%;position: relative;margin: 15px;">
			<span>模板内容</span>
			<textarea name="description" id="ad_description"  placeholder="报警描述" style="resize: none;width: 800px;height: 400px;vertical-align:text-top;padding: 10px;">${data.content}
			</textarea>
			<div style="width: 860px; height: 40px; text-align: center;margin-top: 20px;">
				<button type="button" id="alarm_bt"  onclick="descriptionEdit()" style="width: 140px;height: 36px;background: #1d224a;border-radius: 5px;color: #fff;">
					<i class="fa fa-floppy-o" aria-hidden="true" style="color: #fff;"></i>&nbsp;&nbsp;保存修改</button>
			</div>
		</div>
</form>
<p class="text-right"></p>




