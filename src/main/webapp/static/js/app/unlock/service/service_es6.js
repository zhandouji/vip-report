"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key,
        {value: value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * 开锁服务
 * 使用了es6语法 需要用babel转换成es5兼容低版本浏览器
 * 1.转es5  http://babeljs.io/repl/
 * 2.普通压缩 http://tool.chinaz.com/js.aspx
 *
 * @author shilinchuan
 * @date 2018/2/7
 **/

// 引入安卓ios平台判断js
document.write("<script type='text/javascript' src='/js/CrossPlatformApproach.js'  charset='utf-8'></script>");

/**
 * 服务列表
 * @param type 1下拉刷新 2上拉加载
 * @param status 1待服务 2待评价 3已评价 0全部
 * @param userIdentity 用户身份 1锁匠 2住户 3开锁公司负责人
 */
var servicePageStart = 1;
var servicePageAppend = true;

function serviceList(type, status, userIdentity) {
  if (type === 1) {
    servicePageAppend = true;
    servicePageStart = 1;
  }
  if (type === 2 && !servicePageAppend) {
    loadrefresh();
    $("#pullUpTip").html("没有更多数据");
    return;
  }
  var param = {
    pageStart: servicePageStart,
    status: status,
    userIdentity: userIdentity
  };
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/list",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      if (type === 1) {
        $("#list").html("");
      }
      servicePageStart = data.obj.start + 1;
      if (data.list !== null && data.list.length > 0 && servicePageAppend) {
        $.each(data.list, function (index, value) {
          var createTimeStr = new Date(value.createTime).format(
              "yyyy-MM-dd hh:mm:ss");
          var statusStr = "";
          if (value.status === 1) {
            statusStr = "待服务";
          } else if (value.status === 2) {
            statusStr = "已完成";
          } else if (value.status === 3) {
            statusStr = "已评价";
          } else if (value.status === 4) {
            statusStr = "已取消";
          }

          var operate = "";
          if (userIdentity === '1') {
            operate += "<div class=\"service-cell-control\">";
            if (value.status === 1) {
              operate += "\n                                <button class=\"color-gray-999 border-gray-e0\" onclick=\"toCancel('"
                  + value.id
                  + "')\">\u53D6\u6D88\u8BA2\u5355</button>\n                                <button class=\"color-gray-999 border-gray-e0\" onclick=\"toUnlockerEdit('"
                  + value.id
                  + "')\">\u4FEE\u6539\u4FE1\u606F</button>\n                                <button class=\"color-blue border-blue\" onclick=\"toUnlock('"
                  + value.id + "', '" + value.userId
                  + "')\">\u76F4\u64AD\u5F00\u9501</button>\n                            ";
            }
            if (value.status === 2 || value.status === 3 || value.status
                === 4) {
              operate += "\n                                <button class=\"color-gray-999 border-gray-e0\" onclick=\"del('"
                  + value.id
                  + "', 1)\">\u5220\u9664\u8BA2\u5355</button>\n                            ";
              if (isEmpty(value.repairPics) && value.status !== 4) {
                operate += "\n                                    <button class=\"color-gray-999 border-gray-e0\" onclick=\"toRepair('"
                    + value.id + "', '" + value.userId
                    + "')\">\u8865\u5F55\u7167\u7247</button>\n                                ";
              }
            }
            operate += "</div>";
          } else if (userIdentity === '2') {
            operate += "<div class=\"service-cell-control\">";
            if (value.status === 1) {
              operate += "\n                                <button class=\"color-gray-999 border-gray-e0\" onclick=\"toCancel('"
                  + value.id
                  + "')\">\u53D6\u6D88\u8BA2\u5355</button>\n                            ";
            }
            if (value.status === 2 || value.status === 3 || value.status
                === 4) {
              operate += "\n                                <button class=\"color-gray-999 border-gray-e0\" onclick=\"del('"
                  + value.id
                  + "', 2)\">\u5220\u9664\u8BA2\u5355</button>\n                            ";
            }
            if (value.status === 2) {
              operate += "\n                                <button class=\"color-blue border-blue\" onclick=\"toComment('"
                  + value.id
                  + "')\">\u53BB\u8BC4\u4EF7</button>\n                            ";
            }
            operate += "</div>";
          } else if (userIdentity === '3') {
            operate += "\n                            <p>\n                                <a>\n                                    <img class=\"icon-person\" src=\"/theme/dmapp/img/daming/icon-person.png\" />\n                                    <span class=\"color-gray-666 vertical-align-middle\">\n                                        <a>"
                + value.userTel
                + "\n                                            <a href=\"tel:"
                + value.userTel
                + "\"  onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a>\n                                        </a>\n                                    </span>\n                                </a>\n                            </p>\n                        ";
          }

          var html = "\n                        <li>\n                            <a href=\"javascript:void(0)\" onclick=\"window.location.href = '"
              + BASESERVLET + "/api/app/unlock/service/toDetail/" + value.id
              + "/" + userIdentity
              + "';\">\n                                <div class=\"service-cell-title clear\">\n                                    <span class=\"cell-title\">"
              + value.typeName
              + "</span>\n                                    <span class=\"cell-type\">"
              + statusStr
              + "</span>\n                                </div>\n                                <p><img class=\"icon-time\" src=\"/theme/dmapp/img/daming/time.png\" /><span class=\"color-gray-666 vertical-align-middle\">"
              + createTimeStr
              + "</span></p>\n                                <p><img class=\"icon-location\" src=\"/theme/dmapp/img/daming/list_icon_location.png\" /><span class=\"location-text vertical-align-middle\">"
              + value.addressFull
              + "</span></p>\n                            </a>\n                            "
              + operate
              + "\n                        </li>\n                    ";
          $("#list").append(html);
        });
        /*
         * 判断是否还有更多数据
         * 1.返回数据数量<页面应返回数量
         * 2.如果数据正好两页，那么查询第三页数据的时候就会返回第二页的数据，所以要加的二个判断条件
         */
        if (data.list.length < data.obj.rows || data.list.length
            === data.obj.rows && data.obj.start === data.obj.totalPage) {
          servicePageAppend = false;
          $("#pullUpTip").html("没有更多数据");
        }
      }
      if (data.obj.totalRow <= 0) {
        servicePageAppend = false;
        $("#pullUpTip").html("没有更多数据");
      }
      layer.closeAll();
      loadrefresh();
    }
  });
}

/**
 * 锁匠保存服务单
 */
function unlockerSave() {
  var userId = $("#userId").val();
  var unlockType = $("#unlockType").val();
  var addressMain = $("#addressMain").val();
  var createRemark = $("#createRemark").val();
  var userPics = $("#fileIds").val();
  var userName, userCardNo;

  var isVerify = $("#isVerify").val();
  if (isVerify === '0') {
    userName = $("#userName").val();
    userCardNo = $("#userCardNo").val();

    if (isEmpty(userName)) {
      layer.open({
        content: '请输入客户姓名',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
    if (!isIdCard(userCardNo)) {
      layer.open({
        content: '请输入正确的身份证号',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
  }

  if (isEmpty(userId)) {
    layer.open({
      content: '用户信息错误',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (unlockType === '0') {
    layer.open({
      content: '请选择开锁类型',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (isEmpty(addressMain)) {
    layer.open({
      content: '请填写服务地址',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  var param = {
    userId: userId,
    type: unlockType,
    addressMain: addressMain,
    createRemark: createRemark,
    userPics: userPics,
    userName: userName,
    userCardNo: userCardNo
  };
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/unlockerSave",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        alert(data.error);
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      //是否立即进入直播开锁页面
      toUnlockFinishComfirm(data.obj.id, data.obj.userId);
    }
  });
}

/**
 * 获得用户详细信息
 * @param id
 */
function findUserDetail(id) {
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/app/unlock/service/findUserDetail/" + id,
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      var html = "";
      if (data.obj.isVerify === 0) {
        html = "\n                    <img class=\"person-img\" src=\""
            + (data.obj.icon === null ? "/theme/dmapp/img/daming/yonghu.png"
                : "" + data.obj.facePhoto)
            + "\" />\n                    <div class=\"person-message\">\n                        <input type=\"hidden\" id=\"userId\" value=\""
            + id
            + "\"/>\n                        <input type=\"hidden\" id=\"isVerify\" value=\""
            + data.obj.isVerify
            + "\"/>\n                        <p>\u5BA2\u6237\u59D3\u540D\uFF1A<input class=\"input-name\" type=\"text\" id=\"userName\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\" /></p>\n                        <p>\u8EAB\u4EFD\u8BC1\u53F7\uFF1A<input class=\"input-name\" type=\"text\" id=\"userCardNo\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\" /></p>\n                        <p>\u6027\u3000\u3000\u522B\uFF1A"
            + (data.obj.gender === 1 ? "\u7537" : "\u5973")
            + "</p>\n                        <p>\u8054\u7CFB\u7535\u8BDD\uFF1A"
            + data.obj.phone
            + "</p>\n                    </div>\n                ";
      } else {
        html = "\n                    <img class=\"person-img\" src=\""
            + (data.obj.icon === null ? "/theme/dmapp/img/daming/yonghu.png"
                : BASESERVLET + "/web/file/" + data.obj.icon)
            + "\" />\n                    <div class=\"person-message\">\n                        <input type=\"hidden\" id=\"userId\" value=\""
            + id
            + "\"/>\n                        <input type=\"hidden\" id=\"isVerify\" value=\""
            + data.obj.isVerify
            + "\"/>\n                        <p>\u5BA2\u6237\u540D\u79F0\uFF1A"
            + data.obj.name
            + "</p>\n                        <p>\u8EAB\u4EFD\u8BC1\u53F7\uFF1A"
            + (data.obj.id.substring(0, 10) + "****" + data.obj.id.substring(14,
                18))
            + "</p>\n                        <p>\u6027\u3000\u3000\u522B\uFF1A"
            + (data.obj.gender === 1 ? "\u7537" : "\u5973")
            + "</p>\n                        <p>\u8054\u7CFB\u7535\u8BDD\uFF1A"
            + data.obj.phone
            + "</p>\n                    </div>\n                ";
      }
      $("#personMessage").html(html);
      layer.closeAll();
    }
  });
}

/**
 * 从服务中获得用户信息
 * @param id
 */
function findUserDetailFromService(id) {
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/app/unlock/service/detail/" + id,
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      console.log(data);
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }

      var html = "\n                <img class=\"person-img\" src=\""
          + (data.obj.userHeadImg === null
              ? "/theme/dmapp/img/daming/yonghu.png" : BASESERVLET
              + "/web/file/" + data.obj.userHeadImg)
          + "\" />\n                <div class=\"person-message\">\n                    <input type=\"hidden\" id=\"userId\" value=\""
          + id + "\"/>\n                    <p>\u5BA2\u6237\u540D\u79F0\uFF1A"
          + data.obj.userName
          + "</p>\n                    <p>\u8EAB\u4EFD\u8BC1\u53F7\uFF1A"
          + (data.obj.userCardNo.substring(0, 10) + "****"
              + data.obj.userCardNo.substring(14, 18))
          + "</p>\n                    <p>\u6027\u3000\u3000\u522B\uFF1A"
          + (data.obj.userSex === '1' ? "\u7537" : "\u5973")
          + "</p>\n                    <p>\u8054\u7CFB\u7535\u8BDD\uFF1A"
          + data.obj.userTel + "</p>\n                </div>\n            ";
      $("#personMessage").html(html);
      layer.closeAll();
    }
  });
}

/**
 * 开锁类型
 */
function selectUnlockType() {
  var html = '<ul class="select-list">';
  html += '<li onclick="selected(this)" value="1">普通房门</li>';
  html += '<li onclick="selected(this)" value="2">防盗门</li>';
  html += '<li onclick="selected(this)" value="3">车门锁</li></ul>';
  layer.open({
    type: 1,
    shade: 'background-color: rgba(0,0,0,.3)',
    content: html,
    anim: 'up',
    style: 'position:fixed; bottom:0; left:0; width: 100%; max-height: 3rem; padding: 0.1rem 0; border:none;'
  });

  var text_str = $(".text-align-right").children("span").text();
  $(".select-list li").each(function () {
    if ($(this).text() == text_str) {
      $(this).addClass("selected");
    }
  });
}

/**
 * 下拉选中事件
 * @param obj
 */
function selected(obj) {
  var text_str = $(obj).text();
  var text_val = $(obj).val();
  $(obj).addClass("selected");
  layer.closeAll();
  $(".text-align-right").children("span").text(text_str);
  $("#unlockType").val(text_val);
}

/**
 * 服务详情
 * @param id
 * @param userIdentity 用户身份 1锁匠 2住户 3开锁公司负责人
 */
function detail(id, userIdentity) {
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/app/unlock/service/detail/" + id,
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      var status = data.obj.status;

      //用户/锁匠信息
      var personMessage = "";
      if (userIdentity === '1' || userIdentity === '3') {
        personMessage = "\n                    <img class=\"person-img\" src=\""
            + (data.obj.userHeadImg === null
                ? "/theme/dmapp/img/daming/yonghu.png" : BASESERVLET
                + "/web/file/" + data.obj.userHeadImg)
            + "\" />\n                    <div class=\"person-message\">\n                        <p>\u5BA2\u6237\u540D\u79F0\uFF1A"
            + data.obj.userName
            + "</p>\n                        <p>\u8EAB\u4EFD\u8BC1\u53F7\uFF1A"
            + (data.obj.userCardNo.substring(0, 10) + "****"
                + data.obj.userCardNo.substring(14, 18))
            + "</p>\n                        <p>\u6027\u3000\u3000\u522B\uFF1A"
            + (data.obj.userSex === '1' ? "\u7537" : "\u5973")
            + "</p>\n                        <p>\u8054\u7CFB\u7535\u8BDD\uFF1A\n                            "
            + data.obj.userTel + "<a href=\"tel:" + data.obj.userTel
            + "\" onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a>\n                        </p>\n                    </div>\n                ";
      } else if (userIdentity === '2') {
        personMessage = "\n                    <img class=\"person-img\" src=\""
            + (data.obj.unlockerHeadImg === null
                ? "/theme/dmapp/img/daming/yonghu.png" : BASESERVLET
                + "/web/file/" + data.obj.unlockerHeadImg)
            + "\" />\n                    <div class=\"person-message\">\n                        <p>\u9501\u5320\u540D\u79F0\uFF1A"
            + data.obj.unlockerName
            + "\n                            <a class=\"float-right color-blue\" href=\"javascript:void(0);\" onclick=\"window.location.href='"
            + BASESERVLET + "/api/app/unlock/unlocker/toDetail/"
            + data.obj.unlockerId + "/" + data.obj.companyId
            + "'\">\u8BE6\u60C5></a>\n                        </p>\n                        <p>\u8EAB\u4EFD\u8BC1\u53F7\uFF1A"
            + (data.obj.unlockerCardNo.substring(0, 10) + "****"
                + data.obj.unlockerCardNo.substring(14, 18))
            + "</p>\n                        <p>\u6027\u3000\u3000\u522B\uFF1A"
            + (data.obj.unlockerSex === '1' ? "\u7537" : "\u5973")
            + "</p>\n                        <p>\u8054\u7CFB\u7535\u8BDD\uFF1A\n                            "
            + data.obj.unlockerTel + "<a href=\"tel:" + data.obj.unlockerTel
            + "\" onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a>\n                        </p>\n                    </div>\n                ";
      }

      //订单信息
      var orderInfo = "\n                <p class=\"part-title\">\u2014\u2014&nbsp;\u8BA2\u5355\u4FE1\u606F&nbsp;\u2014\u2014</p>\n                <ul>\n                    <li>\n                        <span>\u8BA2\u5355\u72B6\u6001</span>\n                        <span class=\"color-blue\">\n                        "
          + (data.obj.status === 1 ? "\u5F85\u670D\u52A1" : "")
          + "\n                        " + (data.obj.status === 2
              ? "\u5DF2\u5B8C\u6210" : "") + "\n                        "
          + (data.obj.status === 3 ? "\u5DF2\u8BC4\u4EF7" : "")
          + "\n                        " + (data.obj.status === 4
              ? "\u5DF2\u53D6\u6D88" : "")
          + "\n                        </span>\n                    </li>\n                    <li>\n                        <span>\u5F00\u9501\u7C7B\u578B</span>\n                        <span>"
          + data.obj.typeName
          + "</span>\n                    </li>\n                    <li>\n                        <span>\u8BE6\u7EC6\u5730\u5740</span>\n                        <span>"
          + data.obj.addressFull
          + "</span>\n                    </li>\n                    <li>\n                        <span>\u5907\u6CE8\u5185\u5BB9</span>\n                        <span>"
          + data.obj.createRemark
          + "</span>\n                    </li>\n                </ul>\n            ";
      //获取住户身份照片
      var userPicHtml = "";
      if (data.obj.userPics !== null && data.obj.userPics !== '') {
        var userPic = data.obj.userPics.split(",");
        if (userPic.length > 0) {
          var userPicImg = "";
          $.each(userPic, function (index, value) {
            userPicImg += "<img src=\"" + BASESERVLET + "/api/fileWithCompress/"
                + value + "\" onclick=\"enlargeImageAndroid('" + value
                + "')\"/>";
          });
          userPicHtml = "\n                        <li>\n                            <p>\u4F4F\u6237\u8EAB\u4EFD\u7167\u7247</p>\n                            <div class=\"id-card-group\" >\n                                <div>"
              + userPicImg
              + "</div>\n                            </div>\n                        </li>\n                    ";
        }
      }

      //获取视频信息
      var videoHtml = "";
      if (data.obj.liveVideo !== null && data.obj.liveVideo !== '') {
        var video = data.obj.liveVideo.split(",");
        if (video.length > 0) {
          var videoFile = "";
          $.each(video, function (index, value) {
            videoFile += "\n                        <div class=\"video-box swiper-slide\">\n                            <div class=\"video-control-bar\" onclick=\"historyVideoPlay('"
                + value
                + "')\">\n                                <img src=\"/theme/dmapp/img/daming/information_btn_play.png\" />\n                            </div>\n                        </div>";
          });
          videoHtml = "\n                    <li>\n                        <p>\u5F00\u9501\u76F4\u64AD\u89C6\u9891</p>\n                        <div class=\"unlocking-video-group swiper-container\">\n                            <div class=\"video-group-box swiper-wrapper\">"
              + videoFile
              + "</div>\n                            <!-- \u5982\u679C\u9700\u8981\u5206\u9875\u5668 -->\n                            <div class=\"swiper-pagination\"></div>\n                        </div>\n                    </li>";
        }
      }

      //补录住户身份照片
      var repairPicHtml = "";
      if (data.obj.repairPics !== null && data.obj.repairPics !== '') {
        var repairPic = data.obj.repairPics.split(",");
        if (repairPic.length > 0) {
          var repairPicImg = "";
          $.each(repairPic, function (index, value) {
            repairPicImg += "<img src=\"" + BASESERVLET
                + "/api/fileWithCompress/" + value
                + "\" onclick=\"enlargeImageAndroid('" + value + "')\"/>";
          });
          repairPicHtml = "\n                        <li>\n                            <p>\u8865\u5F55\u4F4F\u6237\u8EAB\u4EFD\u7167\u7247</p>\n                            <div class=\"id-card-group\">\n                                <div>"
              + repairPicImg
              + "</div>\n                            </div>\n                        </li>\n                    ";
        }
      }
      //照片&视频信息
      var videoImg = "\n                <div class=\"more-message-cell\" >\n                    <p class=\"part-title\">\u2014\u2014&nbsp;\u7167\u7247&\u89C6\u9891&nbsp;\u2014\u2014</p>\n                    <ul>\n                        "
          + userPicHtml + "\n                        " + videoHtml
          + "\n                        " + repairPicHtml
          + "\n                    </ul>\n                </div>\n            ";

      //评价信息
      var unlocker = "\n                <div class=\"more-message-cell\">\n\t\t\t\t\t<p class=\"part-title\">\u2014\u2014&nbsp;\u670D\u52A1\u4EBA\u5458&nbsp;\u2014\u2014</p>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>\u9501\u5320\u59D3\u540D</span>\n\t\t\t\t\t\t\t<span>"
          + data.obj.unlockerName
          + "</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<span>\u9501\u5320\u7535\u8BDD</span>\n\t\t\t\t\t\t\t<span>"
          + data.obj.unlockerTel + "<a href=\"tel:" + data.obj.unlockerTel
          + "\"  onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a></span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n            ";

      //评价信息
      var comment = "\n                <div class=\"more-message-cell\">\n                    <p class=\"part-title\">\u2014\u2014&nbsp;\u8BC4\u4EF7\u4FE1\u606F&nbsp;\u2014\u2014</p>\n                    <ul>\n                        <li>\n                            <span class=\"vertical-align-middle\">\u8BC4\u4EF7\u661F\u7EA7</span>\n                            <ul class=\"grade-star vertical-align-middle margin-left-0\">\n                                <li>\n                                    <span class=\"star-bg\"></span>\n                                    <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                </li>\n                                <li>\n                                    <span class=\"star-bg\"></span>\n                                    <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                </li>\n                                <li>\n                                    <span class=\"star-bg\"></span>\n                                    <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                </li>\n                                <li>\n                                    <span class=\"star-bg\"></span>\n                                    <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                </li>\n                                <li>\n                                    <span class=\"star-bg\"></span>\n                                    <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                </li>\n                            </ul>\n                        </li>\n                        <li>\n                            <span>\u8BC4\u4EF7\u5185\u5BB9</span>\n                            <span>"
          + data.obj.comment
          + "</span>\n                        </li>\n                    </ul>\n                </div>\n            ";

      //时间信息
      var createTimeStr = new Date(data.obj.createTime).format(
          "yyyy-MM-dd hh:mm:ss");
      var completeTimeStr = new Date(data.obj.completeTime).format(
          "yyyy-MM-dd hh:mm:ss");
      var createTimeHtml = "\n                <span>\u521B\u5EFA\u65F6\u95F4</span>\n                <span>"
          + createTimeStr + "</span>\n            ";
      var completeTimeHtml = "\n                <span>\u5B8C\u6210\u65F6\u95F4</span>\n                <span>"
          + completeTimeStr + "</span>\n            ";

      //底部按钮
      var bottomButton = "";
      if (userIdentity === '1') {
        if (status === 1) {
          bottomButton = "\n                        <div class=\"bottom-button-box button-center-box\" >\n                            <button class=\"cancel-little-button margin-right-025rem\" onclick=\"toCancel('"
              + data.obj.id
              + "')\">\u53D6\u6D88\u670D\u52A1</button>\n                            <button class=\"inquire-little-button\" onclick=\"toUnlock('"
              + data.obj.id + "','" + data.obj.userId
              + "')\">\u76F4\u64AD\u5F00\u9501</button>\n                        </div>\n                    ";
        }
      } else if (userIdentity === '2') {
        if (status === 1) {
          bottomButton = "\n                        <div class=\"button-center-box\">\n                            <button class=\"cancel-button\" onclick=\"toCancel('"
              + data.obj.id
              + "')\">\u53D6\u6D88\u670D\u52A1</button>\n                        </div>\n                    ";
        }
        if (status === 2) {
          bottomButton = "\n                        <div class=\"button-center-box\">\n                            <button class=\"inquire-button\" onclick=\"toComment('"
              + data.obj.id
              + "')\">\u53BB\u8BC4\u4EF7</button>\n                        </div>\n                    ";
        }
      }

      $("#personMessage").html(personMessage);
      $("#orderInfo").html(orderInfo);
      $("#createTime").html(createTimeHtml);
      if (userIdentity === '3') {
        $("#unlocker").html(unlocker);
      }

      if (bottomButton !== "") {
        $("#bottomButton").html(bottomButton);
      }
      if (status === 2 || status === 3) {
        $("#videoImg").html(videoImg);
        //重新加载视频直播滑动效果
        initSwiper();
        $("#completeTime").html(completeTimeHtml);
        if (status === 3) {
          $("#comment").html(comment);
          grade_star($(".grade-star"), data.obj.score);
        }
      }

      //设置顶部标题和按钮 根据状态显示顶部标签
      try {
        setTopBarTitle("服务单详情");
        if (userIdentity === '1' && status === 1) {
          setTopBarActionName("编辑", "toUnlockerEdit");
        } else {
          setTopBarActionName("", "");
        }
      } catch (err) {
        console.log("调用安卓失败");
      }

      layer.closeAll();
    }
  });
}

//视频左右滑动效果
function initSwiper() {
  var _ref;

  var mySwiper = new Swiper('.swiper-container', (_ref = {
    on: {
      slideChangeTransitionStart: function slideChangeTransitionStart() {
        $(".video-box video").trigger("pause");
        $(".video-control-bar").css("display", "block");
      }
    },
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.3,
    spaceBetween: 10,
    centeredSlides: true
  }, _defineProperty(_ref, "loop", false), _defineProperty(_ref, "pagination", {
    el: '.swiper-pagination'
  }), _ref));
}

/**
 * 进入锁匠编辑页面
 * @param id 服务id
 */
function toUnlockerEdit(id) {
  window.location.href = BASESERVLET + '/api/app/unlock/service/toUnlockerEdit/'
      + id;
}

/**
 * 显示修改详情
 * @param id
 */
function editDetail(id) {
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/app/unlock/service/detail/" + id,
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      console.log(data);
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }

      var userNameP, userCardNoP;
      if (data.obj.isVerify === 0) {
        userNameP = '客户姓名：<input class="input-name" type="text" id="userName" '
            + 'value="' + data.obj.userName + '" placeholder="请输入" />';
        userCardNoP = '身份证号：<input class="input-name" type="text" id="userCardNo" '
            + 'value="' + data.obj.userCardNo + '" placeholder="请输入" />';
      } else {
        userNameP = '客户名称：' + data.obj.userName;
        userCardNoP = '身份证号：' + data.obj.userCardNo.substring(0, 10) + '****'
            + data.obj.userCardNo.substring(14, 18);
      }

      $('#isVerify').val(data.obj.isVerify);
      $('#userHeadImg').attr('src',
          data.obj.userHeadImg === null ? '/theme/dmapp/img/daming/yonghu.png'
              : '${BASESERVLET}/web/file/${data.obj.userHeadImg}');
      $('#userNameP').html(userNameP);
      $('#userCardNoP').html(userCardNoP);
      $('#userSexP').html('性　　别：' + (data.obj.userSex === '1' ? '男' : '女'));
      $('#userTelP').html('联系电话：' + data.obj.userTel);

      $('#unlockTypeName').html(data.obj.typeName);
      $('#unlockType').val(data.obj.type);
      $('#addressMain').val(data.obj.addressMain);
      $('#fileIds').val(data.obj.userPics);
      if (data.obj.userPics !== null && data.obj.userPics.length > 0) {
        var userPics = data.obj.userPics.split(',');
        $.each(userPics, function (index, value) {
          //显示图片
          var url = BASESERVLET + '/api/fileWithCompress/' + value;
          showImg(value, url);
        });
        if (userPics.length >= 5) {
          $('#uploadBtn').hide();
        }
      }
      $('#createRemark').html(data.obj.createRemark);
      layer.closeAll();
    }
  });
}

/**
 * 锁匠编辑
 * @param id 服务id
 */
function unlockerEdit(id) {
  var unlockType = $("#unlockType").val();
  var addressMain = $("#addressMain").val();
  var createRemark = $("#createRemark").val();
  var userPics = $("#fileIds").val();
  var userName, userCardNo;

  var isVerify = $("#isVerify").val();

  if (isVerify === '0') {
    userName = $("#userName").val();
    userCardNo = $("#userCardNo").val();
    if (isEmpty(userName)) {
      layer.open({
        content: '请输入客户姓名',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
    if (!isIdCard(userCardNo)) {
      layer.open({
        content: '请输入正确的身份证号',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
  }

  if (unlockType === '0') {
    layer.open({
      content: '请选择开锁类型',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (isEmpty(addressMain)) {
    layer.open({
      content: '请填写服务地址',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  var param = {
    id: id,
    type: unlockType,
    addressMain: addressMain,
    createRemark: createRemark,
    userPics: userPics,
    userName: userName,
    userCardNo: userCardNo
  };
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/unlockerEdit",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
      }
      window.location.href = BASESERVLET + '/api/app/unlock/work/toList';
    }
  });
}

/**
 * 是否进入直播开锁页面确认框
 */
function toUnlockFinishComfirm(id, userId) {
  layer.open({
    title: '视频录制',
    content: '是否立即录制开锁视频？',
    btn: ['立即录制', '稍后再录'],
    yes: function yes() {
      //立即进入直播开锁页面
      toUnlock(id, userId);
    },
    no: function no() {
      window.location.href = BASESERVLET + '/api/app/unlock/work/toList';
    },
    end: function end(index) {
      layer.close(index);
    }
  });
  $(".layui-m-layercont").css({
    "padding": " 10px 30px 40px 30px"
  });
  $(".layui-m-layerbtn").css("background-color", "#fff");
}

/**
 * 进入开锁页面
 * @param id
 */
function toUnlock(id, userId) {
  window.location.href = BASESERVLET + '/api/app/unlock/service/toUnlock/' + id
      + '/' + userId;
}

/**
 * 完成开锁
 */
function unlockFinish(id, userId) {
  var liveRemark = $("#liveRemark").val();

  var liveVideo = $("#fileIds").val();

  var param = {id: id, liveRemark: liveRemark, liveVideo: liveVideo};
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/unlockFinish",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      layer.closeAll();

      //是否进入补录照片页面确认框
      toRepairComfirm(id, userId);
    }
  });
}

/**
 * 是否进入补录照片页面确认框
 */
function toRepairComfirm(id, userId) {
  layer.open({
    title: '补录照片',
    content: '是否需要补录住户身份照片？',
    btn: ['立即补录', '无须补录'],
    yes: function yes() {
      //进入补录照片页面
      toRepair(id, userId);
    },
    no: function no() {
      window.location.href = BASESERVLET + '/api/app/unlock/work/toList';
    },
    end: function end(index) {
      layer.close(index);
    }
  });
  $(".layui-m-layercont").css({
    "padding": " 10px 30px 40px 30px"
  });
  $(".layui-m-layerbtn").css("background-color", "#fff");
}

/**
 * 进入补录照片页面
 * @param id 服务id
 * @param userId 住户id
 */
function toRepair(id, userId) {
  window.location.href = BASESERVLET + '/api/app/unlock/service/toRepair/' + id
      + '/' + userId;
}

/**
 * 补录照片
 * @param id 服务id
 */
function repair(id) {
  var repairRemark = $("#repairRemark").val();
  var repairPics = $("#fileIds").val();

  if (isEmpty(repairPics)) {
    layer.open({
      content: '请上传补录照片',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  var param = {id: id, repairRemark: repairRemark, repairPics: repairPics};
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/repair",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      window.location.href = BASESERVLET + '/api/app/unlock/work/toList';
      layer.closeAll();
    }
  });
}

/**
 * 进入评价页面
 * @param id
 */
function toComment(id) {
  window.location.href = BASESERVLET + '/api/app/unlock/service/toComment/'
      + id;
}

/**
 * 根据服务id获得服务信息并显示在页面
 * @param id
 */
function commentServiceDetail(id) {
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "get",
    url: BASESERVLET + "/api/app/unlock/service/detail/" + id,
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败' + data.error,
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      var completeTimeStr = new Date(data.obj.completeTime).format(
          "yyyy-MM-dd hh:mm:ss");
      var info = "\n                <p><span>" + data.obj.unlockerName + "-"
          + data.obj.typeName
          + "</span></p>\n                <p><span class=\"color-gray-999 font-size-028rem\" >\u5B8C\u6210\u65F6\u95F4&nbsp;&nbsp;"
          + completeTimeStr + "</span></p>\n            ";
      $("#info").html(info);
      layer.closeAll();
    }
  });
}

//点击星星进行评分
function click_star(obj) {
  $(".star-list-box li").css("background-color", "#e4e4e4");
  var index = $(obj).index() + 1;
  for (var i = 0; i < index; i++) {
    $(".star-list-box li").eq(i).css("background-color", "#faba67");
  }
  $(".star-count").text(index + "星");
  $("#score").val(index);
}

/**
 * 提交评价
 */
function comment() {
  var serviceId = $("#serviceId").val();
  var comment = $("#comment").val();
  var score = $("#score").val();

  if (isEmpty(serviceId)) {
    layer.open({
      content: '用户信息错误',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (score === '0') {
    layer.open({
      content: '请选择评分',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (isEmpty(comment)) {
    layer.open({
      content: '请填写评论信息',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }

  var param = {id: serviceId, comment: comment, score: score};
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/comment",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败',
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      window.location.href = BASESERVLET + '/api/app/unlock/service/toList';
      layer.closeAll();
    }
  });
}

/**
 * 进入取消页面
 * @param id
 */
function toCancel(id) {
  window.location.href = BASESERVLET + '/api/app/unlock/service/toCancel/' + id;
}

/**
 * 取消
 * @param id
 */
function cancel(id) {
  var cancel = $("#cancel").val();

  if (isEmpty(id)) {
    layer.open({
      content: '用户信息错误',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }
  if (isEmpty(cancel)) {
    layer.open({
      content: '请填写取消原因',
      skin: 'msg',
      time: 2 //2秒后自动关闭
    });
    return;
  }

  var param = {id: id, cancel: cancel};
  layer.open({type: 2, shade: 'background-color: rgba(0,0,0,.1)'});
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/app/unlock/service/cancel",
    data: JSON.stringify(param),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      if (!data.status) {
        layer.open({
          content: '操作失败',
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
        layer.closeAll();
        return;
      }
      if (data.obj === 1) {
        window.location.href = BASESERVLET + '/api/app/unlock/work/toList';
      } else {
        window.location.href = BASESERVLET + '/api/app/unlock/service/toList';
      }
      layer.closeAll();
    }
  });
}

/**
 * 删除服务订单
 * @param id 服务订单id
 * @param userType 用户类型 1锁匠 2住户
 */
function del(id, userType) {
  layer.open({
    title: '删除订单',
    content: '您确定要删除该订单吗？',
    btn: ['删除', '取消'],
    yes: function yes(index) {
      $.ajax({
        type: "post",
        url: BASESERVLET + "/api/app/unlock/service/del/" + id + "/" + userType,
        dataType: "json",
        contentType: "application/json",
        success: function success(data) {
          if (!data.status) {
            layer.open({
              content: '操作失败',
              skin: 'msg',
              time: 2 //2秒后自动关闭
            });
            layer.close(index);
            return;
          }
          location.reload();
          layer.close(index);
        }
      });
    }
  });
  $(".layui-m-layercont").css({
    "padding": " 10px 30px 40px 30px"
  });

  $(".layui-m-layerbtn").css("background-color", "#fff");
}