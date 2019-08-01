$(document).ready(function() {

	// //封装设置派警模块的宽
	// function set_nearbyWidth(num) {
    //
	// 	if(num < 670) {
    //
	// 		$(".nearby-police").css({
	// 			"width": '100%',
	// 			"float": "none",
	// 			"margin-right": "0"
	// 		});
    //
	// 		$(".check-police").css({
	// 			"width": '100%',
	// 			"float": "none",
	// 			"margin-top": "12px"
	// 		});
    //
	// 	} else {
    //
	// 		$(".nearby-police").css({
	// 			"width": (num - 42) / 2,
	// 			"float": "left",
	// 			"margin-right": "12px"
	// 		});
    //
	// 		$(".check-police").css({
	// 			"width": (num - 42) / 2,
	// 			"float": "left",
	// 			"margin-top": "0"
	// 		});
	// 	}
	// }

	clicknum = 1;

	/*当鼠标悬浮在菜单收起按钮时的动态效果*/
	$(".menu-hidden").mouseover(function() {

		if(clicknum == 1) {
			$(this).children("span").show();
			$(this).children("span").addClass("hidden-li");
		}

	}).mouseout(function() {

		if(clicknum == 1) {
			$(this).children("span").hide();
			$(this).children("span").removeClass("hidden-li");
		}

	});
	//点击隐藏左侧菜单开始
	$(".menu-hidden").click(function() {

		if(clicknum == 0) {

			//左侧菜单变窄
			$(".left-menu-box").animate({
				'width': '60px'
			}, 500);

			//右侧主要内容跟随页面变宽
			$(".all-content-box").animate({
				'left': '60px'
			}, 500);

			//图标的左边距进行调整
			// $(".left-menu-list>li>a").animate({
			// 	'padding-left': '20px'
			// }, 500);

			//点击按钮样式调整
			// $(".menu-hidden").animate({
			// 	'padding-left': '20px'
			// }, 500);
			$(".menu-hidden>span").css({
				'display': 'none'
			});

			//隐藏菜单内容
			$(".left-menu-list>li>a>span").css({
				'display': 'none'
			});

            $(".icon-right").css({
                'display': 'none'
            });

			$(".sub-menu-list").hide();

			clicknum = 1;

		} else if(clicknum == 1) {
			//左侧菜单变宽
			$(".left-menu-box").animate({
				'width': '220px'
			}, 500);

			//右侧主要内容跟随页面变窄
			$(".all-content-box").animate({
				'left': '220px'
			}, 500);

			//图标的左边距进行调整
			// $(".left-menu-list>li>a").animate({
			// 	'padding-left': '40px'
			// }, 500);

			//点击按钮样式调整
			// $(".menu-hidden").animate({
			// 	'padding-left': '40px'
			// }, 500);
			$(".menu-hidden>span").css({
				'display': 'inline'
			});

			//显示菜单内容
			$(".left-menu-list>li>a>span").css({
				'display': 'inline'
			});

            $(".icon-right").css({
                'display': 'inline'
            });

			var num2 = $(".nearby-police-box").width();

			//当菜单展开的时候进行点击按钮样式调整
			// $(".menu-hidden").mouseout(function() {
            //
			// 	if(clicknum == 0) {
			// 		$(this).children("span").show();
			// 		$(this).children("span").removeClass("hidden-li");
			// 	}
            //
			// });
            $(this).children("span").removeClass("hidden-li");
			clicknum = 0;
		}

		setTimeout(function() {
			if(typeof set_nearbyWidth=="function") {
                set_nearbyWidth(parseInt($(".nearby-police-box").css("width")));
			}
		}, 501);
	});
	//点击隐藏左侧菜单结束

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

	//设置时间
	setInterval(function() {
		$('.right-time').html(getTime)
	}, 1000);

	// //接警状态按钮样式变化
	// function state() {
	// 	$(".top-menu-box>ul>li>button").removeClass("check-button1");
	// 	$(".top-menu-box>ul>li>button").removeClass("check-button2");
	// 	$(".top-menu-box>ul>li>button").removeClass("check-button3");
	// }
	// //点击开始接警
	// $(".state1").click(function() {
	// 	state();
	// 	$(this).addClass("check-button1");
	// });
	//
	// //暂停接警
	// $(".state2").click(function() {
	// 	state();
	// 	$(this).addClass("check-button2");
	// });
	//
	// //停止接警
	// $(".state3").click(function() {
	// 	state();
	// 	$(this).addClass("check-button3");
	// });
    //
	// //在页面加载完成之后根据现在派警框的大小调整所队选择的宽度
	// set_nearbyWidth(parseInt($(".nearby-police-box").css("width")));
    //
	// //监控浏览器的拖地事件，根据浏览器变化进行派警模块的宽度调整
	// $(window).resize(function() {
    //
	// 	set_nearbyWidth(parseInt($(".nearby-police-box").css("width")));
    //
	// });

    // //派警所队选择效果样式开始
    // $(".teams1").click(function() {
    //
		// var text = $(this).text();
		// $(this).css({
		// 	"border-color": "#e5621b",
		// 	"background-color": "#f2dbce",
		// 	"color": "#e5621b",
		// 	"pointer-events": "none"
		// });
    //
		// $(".checked-teams").prepend("<div class='teams2'><span>" + text + "</span><button class='delete'></button></div>");
    //
    // });
    //
    // //点击x号按钮删除该选中所队
    // $(".checked-teams").on("click", ".delete", function() {
    //
		// var text = $(this).parent().children("span").text();
    //
		// for(var i = 0; i < $(".police-team>div").length; i++) {
    //
		// 	if($(".police-team>div").eq(i).text() == text) {
    //
		// 		$(".police-team>div").eq(i).css({
    //
		// 			"border-color": "#dcdcdc",
		// 			"background-color": "#fff",
		// 			"color": "#333",
		// 			"pointer-events": "auto"
    //
		// 		});
		// 	}
		// }
    //
		// $(this).parent().remove();
    //
    // });
    //
    // //重置按钮样式
    // $(".clear-all").click(function() {
    //
		// $(".police-team>div").css({
    //
		// 	"border-color": "#dcdcdc",
		// 	"background-color": "#fff",
		// 	"color": "#333",
		// 	"pointer-events": "auto"
    //
		// });
    //
		// $(".checked-teams").children().remove();
    //
    // });
    //
    // //派警所队选择效果样式结束
    //
    // var flag = false; // 默认flag为false，即未显示未完成报警列表，如果flag为true，即已经显示列表。
    // //显示未完成列表
    // function unfinish_list_show(){
    //     $(".shipin-box").css({ "display" : "none" });
    //     $(".chat-box").css({ "display" : "none" });
    //     $(".paijing-box").css({ "display" : "none" });
    //     $(".unfinish-warning-box").css({ "display" : "block" });
    //
    //
    //     flag = true;
    //     // alert("show ,flag = " + flag);
    // }
    // //隐藏未完成列表
    // function unfinish_list_hied(){
    //     $(".shipin-box").css({ "display" : "block" });
    //     $(".chat-box").css({ "display" : "block" });
    //     $(".paijing-box").css({ "display" : "block" });
    //     $(".unfinish-warning-box").css({ "display" : "none" });
    //
    //     flag = false;
    //     // alert("hide ,flag = " + flag);
    // }
    //
    // $(".unfinish-button").click(function(){
		// // alert("flag = " + flag);
		// if (flag){
    //         // alert("flag = " + flag);
    //         unfinish_list_hied();
    //
		// } else {
    //         // alert("flag = " + flag);
    //         unfinish_list_show();
		// }
    //
    // });
    //
    // $(".pack-up-list>button").click(function(){
    //     unfinish_list_hied();
    // });
});

function initIndex() {
    //左侧菜单的点击效果
    $(".left-menu-list>li>a").click(function() {

        $(".left-menu-list>li").removeClass("checked-li");
        $(this).parent().addClass("checked-li");

    });
    //左侧菜单的点击效果结束
    //当菜单收起后鼠标悬浮上面时
    $(".left-menu-list>li").mouseover(function() {

        if(clicknum == 1) {
            $(this).children("a").children("span").show();
            $(this).children("a").children("span").addClass("hidden-li");
            $(this).children(".sub-menu-list").show();
            $(this).children(".sub-menu-list").addClass("hidden-sub-li");
        }

    }).mouseout(function() {

        if(clicknum == 1) {
            $(this).children("a").children("span").hide();
            $(this).children("a").children("span").removeClass("hidden-li");
            $(this).children(".sub-menu-list").hide();
            $(this).children(".sub-menu-list").removeClass("hidden-sub-li");
        }

    });
}