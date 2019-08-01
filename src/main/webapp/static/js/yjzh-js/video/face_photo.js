//图片显示路径
var url;
if (window.location.protocol === 'http:') {
  url = "https://test.video110.cn:18000/faceDetect/";
} else {
  url = "https://" + location.host + "/faceDetect/";
}

/**
 * 添加查询到的主图信息
 */
function addFaceImg(list, status) {
  for (var i = 0; i < list.length; i++) {
    var srcUrl = url + list[i].faceUrl;
    var ownerId = list[i].ownerId;
    var fileId = list[i].fileId;

    var faceHtml = '<div class="face-recognition" id="' + ownerId + '">'
        + '<img class="face-recognition-img" id="' + fileId + '" src="' + srcUrl
        + '"/>'
        + '<div class="face-recognition-message" id="card_' + ownerId + '">'
        + '<div name="getPersonCard" onclick="face_img_show(this,\'' + ownerId
        + '\', \'' + fileId + '\', \'' + status
        + '\')" class="face-img-show-css">身份信息获取>></div></div>';
    $(".face-recognition-box").append(faceHtml);
    //获取照片对应人员的照片的个人信息不为空
    /*if (list[i].name && list[i].name != undefined && list[i].cardNo
        && list[i].cardNo != undefined) {
      msg_html += '<span>' + list[i].name + '</span>'
          + '<span>' + list[i].cardNo + '</span>';
    } else {
      msg_html += '<span name="findUserInfo">暂无身份信息</span>';
    }*/
  }
}

/**
 * 点击身份信息获取，获得右边信息
 */
function face_img_show(element, ownerId, fileId, status) {
  //设置显示“身份信息获取”
  var getPersonCardArray = $("div[name='getPersonCard']");
  if (getPersonCardArray != null && getPersonCardArray.length > 0) {
    for (var i = 0; i < getPersonCardArray.length; i++) {
      $(getPersonCardArray[i]).show();
    }
  }
  $(element).hide();

  //设置显示更多的信息和照片的样式显示
  $(".face-recognition-left").css("right", "450px");
  $(".face-recognition-right").css("display", "block");

  //设置右边框的标题显示
  var title = '<p>身份信息</p>';
  $(".face-recognition-right .img-title").attr("id", "title_" + ownerId);
  $(".face-recognition-right .img-title").html(title);

  //设置右边框身份信息显示
  $(".face-recognition-up").css("border-bottom", "5px solid #efeff4");

  var imgUrl;
  if (status == "one" && $("#publishFileId").length > 0) {
    //获取某次视频的的某人截图（副本）
    imgUrl = "/skynet/web/faceImg/publishSameUsers?publishFileId=" + $(
        "#publishFileId").attr("value") + "&fileId=" + fileId;
  } else {
    //获取房间的某人截图（副本）
    imgUrl = "/skynet/web/faceImg/roomUserPictureList?fileId=" + fileId;
  }
  //获取跟多的人脸识别照片数据
  getMoreUserFaceFile(imgUrl, fileId, ownerId);
}

/**
 * 获取右边的数据，并且填充到页面显示
 */
function getMoreUserFaceFile(imgUrl, fileId, ownerId) {
  $.ajax({
    type: "get",
    url: imgUrl,
    dataType: "json",
    success: function (data) {
      if (data.status == true) {
        $(".face-recognition-list").empty();
        $(".face-recognition-list").append(
            '<div id="otherPhoto"><p style="margin-top: 10px; line-height: 25px; margin-bottom: 5px"><span style="font-size: 18px">其他照片</span></p></div>');
        $(".face-recognition-up").empty();
        $(".face-recognition-up").append('<table class="tableClass"></table>');
        //显示比对返回的5个信息
        if (data.obj != null) {
          $(".face-recognition-up").css("background-size", "0px");
          getFindUserInfo(data.obj);
        } else {
          $(".face-recognition-up").css("background-size", "px");
          getUserInfo(fileId);
        }
        //显示查询到的图片信息
        if (data.list != null && data.list.length > 0) {
          $(".face-recognition-right").css("background-size", "0px");
          for (var i = 0; i < data.list.length; i++) {
            var faceHtml = '<div class="face-recognition-list-img-box" onmouseover="showButton(this)" onmouseout="hideButton(this)">'
                + '<img class="face-recognition-list-img" id="'
                + data.list[i].fileId + '" src="' + url
                + data.list[i].faceUrl
                + '"/><button class="setting-main-img" onclick="setMaster(this,\''
                + ownerId + '\')">获取信息</button></div>';
            $(".face-recognition-list").append(faceHtml);
          }
        }
      }
    }
  });
}

/**
 * 显示图片比对返回的5个身份信息
 */
function getFindUserInfo(cardInfo) {
  var array = cardInfo.imgCardUdt;
  if (array != null && array.length > 0) {
    var userInfoHtml = "";
    for (var i = 0; i < array.length; i++) {
      userInfoHtml = userInfoHtml + '<tr><td><span>姓&nbsp;&nbsp;&nbsp;&nbsp;名:'
          + array[i].name
          + '</span></td><td><span>身份证号:'
          + array[i].cardNo + '</span></td></tr>'
    }
  }
  $(".face-recognition-up").find("table").html(userInfoHtml);
}

/**
 * 设为主图方法
 */
function setMaster(element, ownerId) {
  //想要设为主图的副本图片的id和地址
  var copyFileId = $(element).prev().attr("id")
  var copyFileUrl = $(element).prev().attr("src");
  //原来主图的id和地址
  var mainFileId = $("#" + ownerId).find("img").attr("id");
  var mainFileUrl = $("#" + ownerId).find("img").attr("src");
  //改变图片
  $("#" + ownerId).find("img").attr("src", copyFileUrl);
  $("#" + ownerId).find("img").attr("id", copyFileId);
  $(element).prev().attr("src", mainFileUrl);
  $(element).prev().attr("id", mainFileId);

  //图片下的显示信息
  $("#" + ownerId).find(".face-recognition-message").find("span").remove();

  /*$("#" + ownerId).find(".face-recognition-message").append(
      "<span name='findUserInfo'>正在查询信息</span>");*/
  //清空对应的获取的身份信息
  $("#title_" + ownerId).next().empty();
  $("#title_" + ownerId).next().css("background-size", "px");
  $("#title_" + ownerId).next().append('<table class="tableClass"></table>');
  //动态比对获取人员信息
  getUserInfo(copyFileId, mainFileId);
}

/**
 * 获取摆渡身份
 */
function getUserInfo(fileId, oldFileId) {
  var param = "";
  if (oldFileId != null && fileId != null) {
    param = "?fileId=" + fileId + "&oldFileId=" + oldFileId
  } else {
    param = "?fileId=" + fileId;
  }
  $.ajax({
    type: "post",
    url: "/skynet/web/faceImgCardId/get" + param,
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      if (data.status) {
      }
    }
  });
}

/**
 * 显示悬浮窗
 */
function showButton(id) {
  $(id).find(".setting-main-img").css("display", "block");
}

/**
 * 隐藏悬浮窗
 */
function hideButton(id) {
  $(id).find(".setting-main-img").css("display", "none");
}