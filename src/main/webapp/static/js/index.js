$(document).ready(function() {



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


            $(this).children("span").removeClass("hidden-li");
			clicknum = 0;
		}

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