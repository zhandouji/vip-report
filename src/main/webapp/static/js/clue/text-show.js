$(document).ready(function() {
	
	$("img").removeAttr("style");
//	$("span").removeAttr("style", "font-size");
//	$("font").removeAttr("style");
	$("table").removeAttr("style", "width");
	$("td").removeAttr("style", "width");
	$("table").removeAttr("style", "height");
	$("td").removeAttr("style", "height");
	
	function bigger(element_tab){
		
		$(element_tab).css("font-size","15pt");
		//获取当前元素的字体大小
		var objSize = $(element_tab).css("font-size");
		//或许当前缩进的数值大小
		var objIndent = $(element_tab).css("text-indent");
		
		//将获取到的元素大小换算成十进制数字
		var textFontSize = parseFloat(objSize, 10);
		var objtextIndent = parseFloat(objIndent, 10);
		var unit = objSize.slice(-2); //获取字体大小的单位
		var indentUnit = objIndent.slice(-2);//获取缩进字段单位
		
//		//字体放大二倍
		textFontSize *=1.5;
//		//缩进放大二倍
		objtextIndent *=1.5;
		
		$(element_tab).css("font-size", textFontSize + unit);
		$(element_tab).css("text-indent", objtextIndent + indentUnit);
		
		
	}
	
	for(var i = 0;i<$(".detail-text").find("*").length;i++){
//		alert($(".detail-text *").eq(i).css("font-size"));
		bigger($(".detail-text").find("*").eq(i));
	}
//	
	
	$(".tab-button").click(function() {

		$(".tab-button").css({
			'color': '#696969',
			'border-color': 'transparent'
		});

		$(this).css({
			'color': '#f5954c',
			'border-color': '#9ac8dc'
		});

		if($(this).index() == 0) {

			$(".tab-box1").css({
				'display': 'block'
			});

			$(".tab-box2").css({
				'display': 'none'
			});

		} else if($(this).index() == 1) {
			$(".tab-box1").css({
				'display': 'none'
			});

			$(".tab-box2").css({
				'display': 'block'
			});
		}

	});

	var dbl_num = 0;
	$(".detail-text img").dblclick(function(){
		if(dbl_num == 0){
			
			$(this).css({ 
				"width" : "200%",
				"max-width" : "200%"
			});
			dbl_num = 1;
			
		}else if(dbl_num == 1){
			$(this).css({ 
				"width" : "auto",
				"max-width" : "100%"
			});
			dbl_num = 0;
		}
	});

});

function qiao(q_btn) {

	$(".tab-button").css({
		'color': '#696969',
		'border-color': 'transparent'
	});

	$(".tab-button:first-child").css({
		'color': '#f5954c',
		'border-color': '#9ac8dc'
	});

	$(".tab-box1").css({
		'display': 'block'
	});

	$(".tab-box2").css({
		'display': 'none'
	});

	alert($(q_btn).text());

	$(".advisory-title>input[type='text']").val($(q_btn).parent().siblings(".question").find("span").text());
}

//封装方法进行图片的大小调整开始
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
	var param = {
		width: width,
		height: height,
		top: 0,
		left: 0
	};
	if(width > maxWidth || height > maxHeight) {

		rateWidth = width / maxWidth;
		rateHeight = height / maxHeight;

		if(rateWidth > rateHeight) {
			param.width = maxWidth;
			param.height = Math.round(height / rateWidth);
		} else {
			param.width = Math.round(width / rateHeight);
			param.height = maxHeight;
		}
	}
	param.left = Math.round((maxWidth - param.width) / 2);
	param.top = Math.round((maxHeight - param.height) / 2);

	return param;
}
//封装方法进行图片的大小调整结束