$(document).ready(function() {
	$("img").removeAttr("style");
	//	$("span").removeAttr("style", "font-size");
	//	$("font").removeAttr("style");
	$("table").removeAttr("style", "width");
	$("td").removeAttr("style", "width");
	$("table").removeAttr("style", "height");
	$("td").removeAttr("style", "height");

	function bigger(element_tab) {

		$(element_tab).css("font-size", "15pt");
		//获取当前元素的字体大小
		var objSize = $(element_tab).css("font-size");
		//或许当前缩进的数值大小
		var objIndent = $(element_tab).css("text-indent");

		//将获取到的元素大小换算成十进制数字
		var textFontSize = parseFloat(objSize, 10);
		var objtextIndent = parseFloat(objIndent, 10);
		var unit = objSize.slice(-2); //获取字体大小的单位
		var indentUnit = objIndent.slice(-2); //获取缩进字段单位

		//字体放大二倍
		textFontSize *= 1.5;
		//缩进放大二倍
		objtextIndent *= 1.5;

		$(element_tab).css("font-size", textFontSize + unit);
		$(element_tab).css("text-indent", objtextIndent + indentUnit);

	}
	
	$("p").each(function(){
		if($(this).children("img").length==0){
			$(this).addClass("text-indent-2em");
		}
	});

	for(var i = 0; i < $(".content-body-box").find("*").length; i++) {
		//		alert($(".detail-text *").eq(i).css("font-size"));
		bigger($(".content-body-box").find("*").eq(i));
	}
	
	//点击图片弹出放大样式

	var click_num = 0;

	function laod_layer_img() {
		$(".layer-inner-box ul").empty();
		for(var i = 0; i < $(".content-body-box img").length; i++) {
			img_scr = $(".content-body-box img").eq(i).attr("src");
			$(".layer-inner-box ul").append('<li><img src="' + img_scr + '"/></li>');
		}
		$('.layer-inner-box').each(function() {
			new RTP.PinchZoom($(this), {});
		});
	}
	
	setTimeout(function(){
		laod_layer_img();
	},1500);
	

	$(".content-body-box").on("click", "img", function() {
		laod_layer_img();
		click_num = $(this).index();
		$(".layer-inner-box li").eq(click_num).css("display", "block");
		$(".layer-box").css("display", "block");
		$(".page").text((click_num + 1) + "/" + $(".layer-inner-box li").length);
	});

	$(".close-img-layer").on("click", function() {
		$(".layer-box").css("display", "none");
	});

	$(".on-img").on("click", function() {
		if(click_num == 0) {
			alert("已经是第一张了");
		} else {
			click_num--;
			$(".layer-inner-box li").css("display", "none");
			$(".layer-inner-box li").eq(click_num).css("display", "block");
			$(".page").text((click_num + 1) + "/" + $(".layer-inner-box li").length);
		}
	});

	$(".next-img").on("click", function() {
		if(click_num == $(".layer-inner-box li").length - 1) {
			alert("已经是最后一张了");
		} else {
			click_num++;
			$(".layer-inner-box li").css("display", "none");
			$(".layer-inner-box li").eq(click_num).css("display", "block");
			$(".page").text((click_num + 1) + "/" + $(".layer-inner-box li").length);
		}
	});

});