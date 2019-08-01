$(document).ready(function() {

	//控制权限的选择出现及隐藏
	$(".control-select").change(function() {
		//当选中的是阅读的时候
		if(this.options[1].selected == true) {
			$(".power").css({
				'display': 'table-cell'
			});
		}

		if(this.options[1].selected == false) {
			$(".power").css({
				'display': 'none'
			});
		}
	});

	//点击人员名字的按钮实现的效果
	var num = 0;
	//封装阅读人员是否重复循环判断
	function has_person(name) {
		
		for(var i = 0; i < $(".yuedu1>div").length; i++) {
			
			if($(".yuedu1>div").eq(i).find("span").text() == name) {
				
				num = 1;

			}
		}

		for(var i = 0; i < $(".yuedu2>div").length; i++) {

			if($(".yuedu2>div").eq(i).find("span").text() == name) {

				num = 1;

			}
		}

		for(var i = 0; i < $(".yuedu3>div").length; i++) {

			if($(".yuedu3>div").eq(i).find("span").text() == name) {

				num = 1;

			}
		}
	}

	$(".police-person>.person").click(function() {

		var name = $(this).text();

		//当选中的是调度员的时候
		//		alert($('option:selected','.control-select').index());
		//		alert($(".control-select").prop("selectedIndex"));
		//		alert($(".control-select>option").index($(".control-select>option:selected")));
		if($(".control-select").prop("selectedIndex") == 0) {

			if($(".diaodu>div").length == 0) {

				$(".diaodu").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

			} else {

				alert("调度员只可以选取一位哦");

			}

		}

		//当选中的是阅读的时候
		if($(".control-select").prop("selectedIndex") == 1) {
			
			//当选择的为仅可以进行评论的时候	
			if($(".power-select").prop("selectedIndex") == 0) {
				
				//当其他都没有选择警员的时候直接进行添加
				if($(".yuedu1>div").length == 0 && $(".yuedu2>div").length == 0 && $(".yuedu3>div").length == 0) {
					
					$(".yuedu1").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

				} else {
					
					has_person(name);
					
					if(num == 0) {

						$(".yuedu1").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

					} else {

            alert("您已经选择了该民警已被选择了");
						num = 0;

					}

				}
			}
			
			//当选择的为仅可以进行评论且可以查看评论的时候	
			if($(".power-select").prop("selectedIndex") == 1) {

				if($(".yuedu1>div").length == 0 && $(".yuedu2>div").length == 0 && $(".yuedu3>div").length == 0) {

					$(".yuedu2").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

				} else {
					
					has_person(name);
					
					if(num == 0) {

						$(".yuedu2").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

					} else {

            alert("您已经选择了该民警已被选择了");
						num = 0;

					}

				}
			}
			
			//当选择的为仅可以进行评论且可以查看评论与处理过程的时候	
			if($(".power-select").prop("selectedIndex") == 2) {

				if($(".yuedu1>div").length == 0 && $(".yuedu2>div").length == 0 && $(".yuedu3>div").length == 0) {

					$(".yuedu3").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

				} else {
					
					has_person(name);
					
					if(num == 0) {

						$(".yuedu3").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

					} else {

            alert("您已经选择了该民警已被选择了");
						num = 0;

					}

				}
			}

		}

		//当选中的是现场的时候
		if($(".control-select").prop("selectedIndex") == 2) {

			if($(".xianchang>div").length == 0) {

				$(".xianchang").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

			} else {

				for(var i = 0; i < $(".xianchang>div").length; i++) {

					if($(".xianchang>div").eq(i).find("span").text() == name) {

						num = 1;

					}
				}

				if(num == 0) {

					$(".xianchang").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

				} else {

          alert("您已经选择了该民警，无须重复选择");
					num = 0;

				}

			}

		}
		//当选中的是审核员的时候
		if($(".control-select").prop("selectedIndex") == 3) {
			if($(".shenhe>div").length == 0) {

				$(".shenhe").prepend("<div class='person'><span>" + name + "</span><button>×</button></div>");

			} else {

				alert("审核人只可以选取一位哦");

			}

		}

	});

	//封装删除事件
	function delete_person(obj) {
		$(obj).parent().remove();
	}

	//删除已备选的人员
	$(".manage-list").on("click", ".person button", function() {

		delete_person($(this));

	});

});