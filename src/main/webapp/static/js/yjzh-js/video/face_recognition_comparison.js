/**
 * 应急视频中的人脸比对获取人员信息
 * @author feng
 * @date 2018/5/17
 **/
// 人脸识别的消息订阅
var faceComparisonNotice = null;
var mqOwnerIdCount = {};

/**
 * 初始化订阅人脸识别的mq消息
 */
function initFaceComparison() {
  // 如果已经存在订阅，不再进行订阅
  if (faceComparisonNotice) {
    return;
  }
  //订阅
  faceComparison();

}

/**
 * 订阅人脸识别mq消息
 */
function faceComparison() {
  var headers = {
    'activemq.retroactive': 'true'
  };
  subscribeVideoGroupNotice = skynetSocket.subscribe("/queue/FACE_CARD_ID",
      function (m) {
        console.log("收到人脸比对的身份信息消息<<<<<<<：o%", m);
        var body;
        try {
          body = JSON.parse(m.body);
        } catch (e) {
          layer.alert("解析消息异常：" + e.message + "\n\n" + m.body);
          console.error("解析消息异常：s%", m.body);
          return;
        }
        if (!body) {
          return;
        }

        var personInfo = body.body;
        if (body.event === 'WRITE_CARD_ID') {
          //处理比对结果
          faceRecognitionResults(personInfo)
        }
      }, headers);
}

/**
 * 停止订阅人脸识别mq消息
 */
function unFaceComparison() {
  if (faceComparisonNotice) {
    faceComparisonNotice.unsubscribe();
    faceComparisonNotice = null;
  }
}

/**
 * 人脸识别的获得结果
 */
function faceRecognitionResults(personInfo) {
  var ownerId = personInfo.ownerId;
  /*if (iframeBody.find("#" + ownerId).length > 0) {
    iframeBody.find("#"
        + ownerId).find(".face-recognition-message").find(
        "span[name='findUserInfo']").remove();
    iframeBody.find("#"
        + ownerId).find(".face-recognition-message").append(
        '<span>' + personInfo.name + '</span>'
        + '<span>' + personInfo.cardNo + '</span>');
  }*/

  //获取比对的返回的5个信息
  if (iframeBody.find("#title_" + ownerId).length > 0) {
    /*iframeBody.find("#title_"
        + ownerId).nextAll(".face-recognition-list").css("margin-top", "120px");
    iframeBody.find("#title_"
        + ownerId).nextAll(".face-recognition-list").css("border-bottom",
        "5px solid #cccccc");*/
    iframeBody.find("#title_"
        + ownerId).next().css("background-size", "0px");
    iframeBody.find("#title_"
        + ownerId).next().find("table").append(
        '<tr><td><span>姓&nbsp;&nbsp;&nbsp;&nbsp;名:' + personInfo.name
        + '</span></td><td>'
        + '<span>身份证号:' + personInfo.cardNo + '</span></td></tr>');
  }
}