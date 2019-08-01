$(document).ready(function() {

	//统计附近警务服务站和警员的总数
	$(".all-police-station").text($(".police-station-list li").length + "个");
	$(".all-police-person").text($(".police-person-list li").length + "个");

	//自定义派警选中多选框
	$(".map-police-list li").on("click", ".check-button", function() {
		$(this).toggleClass("checked-button-bg");
		$(".police-person-num").text($(".check-button input[name = 'police-person']:checked").length);
		$(".police-station-num").text($(".check-button input[name = 'police-station']:checked").length);
	});

	//tab切换警务站和警员
	$(".hj-nearby-div div").on("click", function() {
		var nearbyIndex = $(this).index();
		$(".map-police-list").css("display", "none");
		$(".map-police-list").eq(nearbyIndex).css("display", "block");
		if(nearbyIndex == 0) {
			$(".nearby-history").text("附近警务机构");
		} else {
			$(".nearby-history").text("附近民警");
		}
	});

	//自定义下拉框列表相关点击事件
	$(".my-select").on("click", function(e) {
		e.stopPropagation();
		$(this).parent().find(".my-select-list-box").css("display", "block");
	});

	//点击确定按钮收起下拉列表
	$(".select-submit-btn-box").on("click", ".button1", function() {
		$(this).parents(".my-select-list-box").css("display", "none");
	});

	//自定义下拉框选择
	$(".my-select-list li").on("click", ".check-button", function(e) {
		e.stopPropagation();
		$(this).toggleClass("select-checked-bg");
	});

	//点击自定义下拉框每一行事件
		$(".my-select-list").on("click", "li", function(e){
			e.stopPropagation();
			
			$(this).children(".check-button").toggleClass("select-checked-bg");
			
			if($(this).find("input[type='checkbox']").is(":checked")){
				
				$(this).find("input[type='checkbox']").prop("checked",false);
			}else{
				
				$(this).find("input[type='checkbox']").prop("checked",true);
			}
		});

	//点击空白处让下拉框隐藏
	$("body").on("click", function() {
		$(".my-select-list-box").css("display", "none");
	});
	
	//点击下拉框空白处阻止下拉框隐藏
	$(".my-select-list-box").on("click", function(e) {
		e.stopPropagation();
	});
	
	//状态选择的点击事件
	$(".state2").click(function(){
		$(this).toggleClass("state-checked2");
	});

});