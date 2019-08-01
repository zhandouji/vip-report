//tab标签切换
function tab_change(obj) {
  var tab_index = $(obj).index();
  $(".tab-list li").removeClass("cheched-li");
  $(obj).addClass("cheched-li");
  $(".tab-content").css("display", "none");
  $(".tab-content").eq(tab_index).css("display", "block");
}

//播放视频
function play_video(obj) {
  if ($(obj).attr("data-num") == 0) {
    $(obj).css("background-image", "url(../img/jiejingtai/stop.png)");
    $(".history-video-box video").trigger('play');
    $(obj).attr("data-num", "1");
  } else {
    $(obj).css("background-image", "url(../img/jiejingtai/play.png)");
    $(".history-video-box video").trigger('pause');
    $(obj).attr("data-num", "0");
  }
}

//视频旋转事件
function rotating(obj) {
  var data_num = $(obj).attr("data-num");
  data_num++;
  if (data_num > 3) {
    data_num = 0;
  }
  $(obj).attr("data-num", data_num);
  var rotate = data_num * 90;
  $(".history-video-box video").css({
    "transform": "rotate(" + rotate + "deg)",
    "-ms-transform": "rotate(" + rotate + "deg)",
    /* IE 9 */
    "-webkit-transform": "rotate(" + rotate + "deg)",
    /* Safari and Chrome */
    "-o-transform": "rotate(" + rotate + "deg)",
    /* Opera */
    "-moz-transform": "rotate(" + rotate + "deg)",
    "max-width": "570px"
  });

  if (data_num % 2 == 1) {
    $(".history-video-box video").css("max-width", "570px");
  } else {
    $(".history-video-box video").css("max-width", "760px");
  }
}

//点击视频进度条进行调整
function click_current_time(obj) {
  if (!tag) {
    var current_x = event.offsetX;
    if (current_x < 12) {
      left = 0;
    } else {
      left = current_x - 12;
    }
    $(obj).find(".current-bar").css("width", current_x);
    $(obj).find(".current-btn").css("left", left);
  }
}

//添加聊天小组人员点击事件
function click_chatting_peron(obj) {
  var count_num = 0;
  $(obj).on("click", 'span', function () {

    if (count_num < 9 || $(this).hasClass("checked-video-person")) {

      $(this).toggleClass('checked-video-person');
      count_num = $(this).parent().children(".checked-video-person").length;
      $(".checked-person-count").html(count_num);

    } else {

      layer.msg('人数已达上限');
      $(".layui-layer-content").css("color", "#fff");
    }

  });
}

//function limit_words_number(obj){
//	var str = $(obj).val();
//	if(str.replaceAll(" ","")>20){
//		layer.msg('组名限10字以内');
//		$(obj).val(str.substring(0,20));
//		$(".layui-layer-content").css("color","#fff");
//	}
//	
//}
