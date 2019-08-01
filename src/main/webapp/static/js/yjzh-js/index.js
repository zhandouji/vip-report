$(document).ready(function() {

	//左侧菜单收起事件开始
	var clickNum = 1;

	//当菜单收起后鼠标悬浮上面时
	$(".left-level1-list>li").mouseover(function() {

		if(clickNum == 1) {
			$(this).children("a").children("span").show();
			$(this).children("a").children("span").addClass("hidden-li");
			$(this).children(".left-level2-list").show();
			$(this).children(".left-level2-list").addClass("hidden-level2-list");
		} else {
			$(this).children("a").children("span").removeClass("hidden-li");
			$(this).children(".left-level2-list").removeClass("hidden-level2-list");
		}

	}).mouseout(function() {

		if(clickNum == 1) {
			$(this).children("a").children("span").hide();
			$(this).children("a").children("span").removeClass("hidden-li");
			$(this).children(".left-level2-list").hide();
			$(this).children(".left-level2-list").removeClass("hidden-level2-list");
		}

	});
	/*当鼠标悬浮在菜单收起按钮时的动态效果*/
	$(".pack-up-box").mouseover(function() {

		if(clickNum == 1) {
			$(this).children("span").show();
			$(this).children("span").addClass("hidden-li");
		}

	}).mouseout(function() {

		if(clickNum == 1) {
			$(this).children("span").hide();
			$(this).children("span").removeClass("hidden-li");
		}

	});

	$(".left-inner-box").on("click", ".pack-up-box", function() {

		//收起菜单点击事件
		if(clickNum == 0) {
			//收起菜单
			$(".left-box").animate({
				"width": "60px"
			}, 500);

			$(".right-box").animate({
				"left": "60px"
			}, 500);

			//隐藏收起菜单按钮的文字内容
			$(".pack-up-box span").css("display", "none");

			//隐藏一级菜单文字内容
			$(".left-level1-list>li>a>span").css("display", "none");

			//隐藏二级菜单
			$(".left-level2-list").css("display", "none");

			//遍历所有二级菜单，根据其中二级菜单的选中状态进行样式调整
			for(var i = 0; i < $(".left-level2-list").length; i++) {

				if($(".left-level2-list").eq(i).find(".checked-level2").length == 1) {
					$(".left-level2-list").eq(i).parent().addClass("checked-level1");
					$(".left-level1-list>li").find(".icon-right").removeClass("fa-angle-down").addClass("fa-angle-right")
					$(".checked-level1-cell").removeClass("li-bg1 li-bg2 li-bg3");
					$(".checked-level1-cell").children().removeClass("color1 color2");
				}
			}

			//隐藏右侧箭头样式
			$(".icon-right").css("display", "none");

			clickNum = 1;

		} //展开菜单点击事件
		else if(clickNum == 1) {
			//展开菜单
			$(".left-box").animate({
				"width": "220px"
			}, 500);

			$(".right-box").animate({
				"left": "220px"
			}, 500);

			//显示收起菜单按钮的文字内容
			$(".pack-up-box span").css("display", "inline");

			//显示一级菜单文字内容
			$(".left-level1-list>li>a>span").css("display", "inline");

			//显示右侧箭头样式
			$(".icon-right").css("display", "inline-block");

			$(".left-level1-list>li a span").removeClass("hidden-li");
			$(".left-level2-list").removeClass("hidden-level2-list");

			$(".pack-up-box>span").removeClass("hidden-li");

			clickNum = 0;

		}

	});
	//左侧菜单收起事件结束

	//判断是否含有二级菜单开始
	for(var i = 0; i < $(".left-level1-list>li").length; i++) {
		//假如没有二级菜单的时候移除右侧箭头
		if($(".left-level1-list>li").eq(i).find(".left-level2-list").length == 0) {
			$(".left-level1-list>li").eq(i).children("a").find(".icon-right").remove();
		} else {
			//假如有二级菜单的时候添加右侧菜单
			$(".left-level1-list>li").eq(i).children("a").append("<i class='fa fa-angle-right icon-right' aria-hidden='true'></i>");
		}
	}
	//判断是否含有二级菜单结束

	//一级菜单点击事件封装开始
	function level1_click() {

		//判断是否含有二级菜单
		//假如含有二级菜单
		if($(this).parent().find(".left-level2-list").length == 1) {
			if(clickNum == 1) {
				//展开菜单
				$(".left-box").animate({
					"width": "220px"
				}, 500);

				$(".right-box").animate({
					"left": "220px"
				}, 500);

				//显示收起菜单按钮的文字内容
				$(".pack-up-box span").css("display", "inline");

				//显示一级菜单文字内容
				$(".left-level1-list>li>a>span").css("display", "inline");

				//显示右侧箭头样式
				$(".icon-right").css("display", "inline-block");

				clickNum = 0;
			}

			//移除当前一级的选中状态
			$(this).parent().removeClass("checked-level1");

			//获取当前二级菜单的状态
			var display = $(this).parent().find(".left-level2-list").css("display");

			//当二级菜单是隐藏状态的时候的样式
			if(display == "none") {

				//隐藏所有二级菜单
				$(".left-level2-list").css("display", "none");

				//修改所有箭头的方向
				$(".icon-right").removeClass("fa-angle-down").addClass("fa-angle-right");

				//遍历所有二级菜单，根据其中二级菜单的选中状态进行样式调整
				for(var i = 0; i < $(".left-level2-list").length; i++) {

					if($(".left-level2-list").eq(i).find(".checked-level2").length == 1) {
						$(".left-level2-list").eq(i).parent().addClass("checked-level1");
						$(".left-level1-list>li").find(".icon-right").removeClass("fa-angle-down").addClass("fa-angle-right")
						$(".checked-level1-cell").removeClass("li-bg1 li-bg2 li-bg3");
						$(".checked-level1-cell").children().removeClass("color1 color2");
					}
				}

				//打开当前一级菜单下面的二级菜单
				$(this).parent().find(".left-level2-list").css("display", "block");

				//修改一级菜单右侧箭头的样式
				$(this).children(".icon-right").removeClass("fa-angle-right").addClass("fa-angle-down");

				//如果当前一级菜单下的二级菜单有选中项
				if($(this).parent().find(".left-level2-list").children(".checked-level2").length == 1) {

					$(this).children().removeClass("color2").addClass("color1");
					$(this).removeClass("li-bg1 li-bg3").addClass("li-bg2");

				} else {

					$(this).removeClass("li-bg1 li-bg3").addClass("li-bg2");
				}

			} else {

				$(this).parent().find(".left-level2-list").css("display", "none");

				//修改一级菜单右侧箭头的样式
				$(this).children(".icon-right").removeClass("fa-angle-down").addClass("fa-angle-right");

				//如果当前一级菜单下的二级菜单有选中项
				if($(this).parent().find(".left-level2-list").children(".checked-level2").length == 1) {

					$(this).parent().addClass("checked-level1");
				}

				$(this).removeClass("li-bg1 li-bg2 li-bg3");
				$(this).children().removeClass("color2 color1");

			}

		} else if($(this).parent().find(".left-level2-list").length == 0) {
			//假如不含二级菜单
			//移除其他一级菜单选中的样式
			$(".left-level1-list>li>a").parent().removeClass("checked-level1");

			$(".left-level2-list>li").removeClass("checked-level2");

			$(".left-level1-list>li>a").children().removeClass("color1 color2");
			//给当前点击行列添加选中样式
			$(this).parent().addClass("checked-level1");
		}
	}

	//根据二级菜单展开的状态进行样式的改变
	if($(".left-level2-list").css("display") != "none") {

		$(this).parent().children("a").removeClass("li-bg1 li-bg3").addClass("li-bg2");

	} else if($(".left-level2-list").css("display") == "none") {

		$(this).parent().children("a").removeClass("li-bg1 li-bg2 li-bg3");
	}

	//一级菜单点击事件封装结束
	$(".left-level1-list>li").on("click", ".checked-level1-cell", level1_click);

	//二级菜单点击事件开始
	$(".left-level2-list>li").on("click", "a", function() {
		$(".left-level2-list>li").removeClass("checked-level2");
		$(this).parent().addClass("checked-level2");
		$(".left-level1-list>li>a").parent().removeClass("checked-level1");
	});
	//二级菜单点击事件结束

	//获取本地时间开始
	function getTime() {
		var d = new Date(),
			str = "";
		str += d.getFullYear() + "年";
		str += d.getMonth() + 1 + "月";
		str += d.getDate() + "日" + "\n";

		if(d.getHours() < 10) {
			str += "0" + d.getHours() + ":";
		} else {
			str += d.getHours() + ":";
		}

		if(d.getMinutes() < 10) {
			str += "0" + d.getMinutes() + ":";
		} else {
			str += d.getMinutes() + ":";
		}

		if(d.getSeconds() < 10) {
			str += '0' + d.getSeconds();
		} else {
			str += d.getSeconds();
		}

		return str;
	}
	//设置时间结束

	//设置时间
	setInterval(function() {
		$('.right-time').html(getTime)
	}, 1000);

  /*$("body").append(
      '<div class="float-window-top float-window " style="display: none"></div>');
  $("body").append('<div id="modal-overlay">'
      + '    <div class="modal-data">'
      + '        <div class="video-box-feng">'
      + '						 <div id="cleanDiv" class="treamTop"><a href="javascript:closeLivevideo()">×</a></div>'
      + '            <div class="col-md-6 hide" id="video">'
      + '                <div class="panel panel-default">'
      + '                    <div class="panel-body" id="videobox">'
      + '                        <video class="rounded centered" id="thevideo" autoplay/>'
      + '                    </div>'
      + '                </div>'
      + '            </div>'
      + '        </div>'
      + '        <div class="video-control-box-feng clear">'
      + '            <div class="video-control-btn" id="playWindow" data-num="0"></div>'
      + '            <div class="progress-bar-max-box">'
      + '                <span class="current-time">00:00</span>'
      + '                <span class="progress-bar-box-feng" onclick="click_current_time(this)">'
      + '                <span class="progress-bar">'
      + '                    <span class="current-bar"></span>'
      + '                </span>'
      + '                <span class="current-btn" style="top: -5px;"></span>'
      + '            </span>'
      + '                <span class="total-time">00:00</span>'
      + '            </div>'
      + '        </div>'
      + '    </div>'
      + '</div>')*/
});