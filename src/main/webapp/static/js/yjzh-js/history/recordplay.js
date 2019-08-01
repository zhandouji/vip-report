/**
 * 页面加载完毕首先是放掉资源
 */
releaseResource();

/**
 * 显示播放窗口
 * @param videoFile 媒体文件
 */
var index;
function showPlayWindow(videoFile) {
  index = layer.load(2, {
    shade: [0.4, '#000']
  });
  $('#playWindow').attr('onclick', 'playVideo(this,"' + videoFile + '")');
  //初始化视频链接
  pws = new PlayerWebSocket(listener);
  $("#video_outer").css('display', 'block');
  $("#video_outer").css('left', 500);
  $("#video_outer").css('top', 80);
  $("#video_outer").css('z-index', 20000000);
  $('#modal-overlay').css("visibility", "visible");
  $('#modal-overlay').css("z-index", 20000001);
}

/**
 * 关闭窗口
 */
function closeLivevideo() {
  releaseResource();
  $('#modal-overlay').css("visibility", "hidden");
  $("#video_outer").css('display', 'none');
  layer.close(index);
}