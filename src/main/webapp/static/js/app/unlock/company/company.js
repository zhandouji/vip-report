"use strict";

/**
 * 开锁公司
 * 使用了es6语法 需要用babel转换成es5兼容低版本浏览器
 * 1.转es5  http://babeljs.io/repl/
 * 2.普通压缩 http://tool.chinaz.com/js.aspx
 * @author shilinchuan
 * @date 2018/2/6
 **/

/**
 * 公司列表
 * @param type 1下拉刷新 2触底加载
 */
var companyPageStart = 1;
var companyPageAppend = true;
function companyList(type) {
    var areaCode = $("#areaCode").val();

    if (type === 1) {
        companyPageAppend = true;
        companyPageStart = 1;
    }
    if (type === 2 && !companyPageAppend) {
        loadrefresh1();
        $("#pullUpTip").html("没有更多数据");
        return;
    }
    var param = { pageStart: companyPageStart, areaCode: areaCode };
    layer.open({ type: 2, shade: 'background-color: rgba(0,0,0,.1)' });
    $.ajax({
        type: "post",
        url: BASESERVLET + "/api/app/unlock/company/list",
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
            companyPageStart = data.obj.start + 1;
            if (data.list !== null && data.list.length > 0 && companyPageAppend) {
                $.each(data.list, function (index, value) {
                  var s = value.companyTel == null ? value.managerTel
                      : value.companyTel;
                  var html = "\n   <li>\n <a href=\"javascript:void(0);\" onclick=\"toCompanyDetail('"
                      + value.id
                      + "')\">\n <p><span class=\"font-size-036rem font-blod\">"
                      + value.name
                      + "</span><span class=\"attestation-title\"><img class=\"attestation-img\" src=\"/theme/dmapp/img/daming/attestation.png\"/> \u5DF2\u8BA4\u8BC1</span></p>\n                                <p><img class=\"icon-location\" src=\"/theme/dmapp/img/daming/list_icon_location.png\" /><span class=\"location-text vertical-align-middle\">"
                      + value.address
                      + "</span></p>\n                                <p><img class=\"icon-phone\" src=\"/theme/dmapp/img/daming/list_icon_phone.png\" />\n                                    <a class=\"vertical-align-middle color-gray-666\" >"
                      + s + "<a href=\"tel:" + s
                      + "\"  onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a></a>\n                                </p>\n                            </a>\n                        </li>\n                    ";
                    $("#list").append(html);
                });
                /*
                 * 判断是否还有更多数据
                 * 1.返回数据数量<页面应返回数量
                 * 2.如果数据正好两页，那么查询第三页数据的时候就会返回第二页的数据，所以要加的二个判断条件
                 */
                if (data.list.length < data.obj.rows || data.list.length === data.obj.rows && data.obj.start === data.obj.totalPage) {
                    companyPageAppend = false;
                    $("#pullUpTip").html("没有更多数据");
                }
            }
            if (data.obj.totalRow <= 0) {
                companyPageAppend = false;
                var html = "<img class=\"message-null\" src=\"/theme/img/deadbeat/NoData.png\" />";
                $("#wrapper").html(html);
            }
            loadrefresh1();
            layer.closeAll();
        }
    });
}

/**
 * 进入公司详情
 * @param id
 */
function toCompanyDetail(id) {
    window.location.href = BASESERVLET + '/api/app/unlock/company/toDetail/' + id;
}

/**
 * 公司详情
 *
 * @param id 公司id
 */
function companyDetail(id) {
    layer.open({ type: 2, shade: 'background-color: rgba(0,0,0,.1)' });
    $.ajax({
        type: "get",
        url: BASESERVLET + "/api/app/unlock/company/detail/" + id,
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
            $("#companyName").html(data.obj.name + "<dd class=\"attestation-title\"><img class=\"attestation-img\" src=\"/theme/dmapp/img/daming/attestation.png\"/> \u5DF2\u8BA4\u8BC1</dd>");
            $("#companyAddress").html(data.obj.address);
          $("#companyTel").html("<a class=\"color-gray-999\" >"
              + (data.obj.managerTel == '' ? '未知' : data.obj.companyTel)
              + "<a href=\"tel:" + data.obj.companyTel
              + "\"  onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a></a>");
            $("#companyChargeDesc").html("" + (data.obj.chargeDesc == '' ? '暂无' : data.obj.chargeDesc));
            layer.closeAll();
        }
    });
}

/**
 * 锁匠列表
 *
 * @param type 1下拉刷新 2触底加载
 */
var unlockerPageStart = 1;
var unlockerPageAppend = true;
function unlockerList(type, companyId) {
    var areaCode = $("#areaCode").val();
    if (type === 1) {
        unlockerPageAppend = true;
        unlockerPageStart = 1;
    }
    if (type === 2 && !unlockerPageAppend) {
        loadrefresh2();
        $("#pullUpTip1").html("没有更多数据");
        return;
    }
    var param = { pageStart: unlockerPageStart, companyId: companyId, areaCode: areaCode };

    $.ajax({
        type: "post",
      url: "/skynet/api/app/unlock/unlocker/list",
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
                $("#list1").html("");
            }
            unlockerPageStart = data.obj.start + 1;
            if (data.list !== null && data.list.length > 0 && unlockerPageAppend) {
                $.each(data.list, function (index, value) {
                  var html = "\n<li class=\"clear\" onclick=\"window.location.href='"
                      + BASESERVLET + "/api/app/unlock/unlocker/toDetail/"
                      + value.id + "/" + value.companyId
                      + "'\">\n                            <a href=\"javascript:void(0);\" >\n                                <img class=\"person-img\" src=\""
                      + (value.headImg === null
                          ? "/theme/dmapp/img/daming/yonghu.png" : BASESERVLET
                          + "/web/file/" + value.headImg)
                      + "\" />\n                                <div class=\"person-message\">\n                                    <div class=\"unlocking-person-name\">\n                                        <span class=\"font-blod font-size-036rem\">"
                      + value.name
                      + "</span>\n                                        <ul class=\"grade-star vertical-align-middle\" id=\"star_"
                      + value.companyId + "_" + value.id
                      + "\">\n                                            <li>\n                                                <span class=\"star-bg\"></span>\n                                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                            </li>\n                                            <li>\n                                                <span class=\"star-bg\"></span>\n                                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                            </li>\n                                            <li>\n                                                <span class=\"star-bg\"></span>\n                                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                            </li>\n                                            <li>\n                                                <span class=\"star-bg\"></span>\n                                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                            </li>\n                                            <li>\n                                                <span class=\"star-bg\"></span>\n                                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                                            </li>\n                                        </ul>\n                                        <span class=\"vertical-align-middle\">"
                      + value.score
                      + "\u5206</span>\n                                    </div>\n                                    <p><span>\u8054\u7CFB\u7535\u8BDD\uFF1A</span>\n                                        <a class=\"color-gray-666\" >"
                      + value.tel + "<a href=\"tel:" + value.tel
                      + "\" onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a></a>\n                                    </p>\n                                    <p><span>\u670D\u52A1\u6B21\u6570\uFF1A</span><span class=\"color-gray-666\">"
                      + (value.serviceNum == null ? 0 : value.serviceNum)
                      + "\u6B21</span></p>\n                                </div>\n                            </a>\n                        </li>\n                    ";
                    $("#list1").append(html);
                    grade_star($("#star_" + value.companyId + "_" + value.id), value.score);
                });
                /*
                 * 判断是否还有更多数据
                 * 1.返回数据数量<页面应返回数量
                 * 2.如果数据正好两页，那么查询第三页数据的时候就会返回第二页的数据，所以要加的二个判断条件
                 */
                if (data.list.length < data.obj.rows || data.list.length === data.obj.rows && data.obj.start === data.obj.totalPage) {
                    unlockerPageAppend = false;
                    $("#pullUpTip1").html("没有更多数据");
                }
            }
            if (data.obj.totalRow <= 0) {
                unlockerPageAppend = false;
                var html = "<img class=\"message-null\" src=\"/theme/img/deadbeat/NoData.png\" />";
                $("#wrapper1").html(html);
            }
            loadrefresh2();
            layer.closeAll();
        }
    });
}

/**
 * 锁匠详情
 *
 * @param id
 */
function unlockerDetail(id) {
    layer.open({ type: 2, shade: 'background-color: rgba(0,0,0,.1)' });
    $.ajax({
        type: "get",
        url: BASESERVLET + "/api/app/unlock/unlocker/detail/" + id,
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
            var html = "\n                <img class=\"person-img\" src=\"" + (data.obj.headImg === null ? "/theme/dmapp/img/daming/yonghu.png" : BASESERVLET + "/web/file/" + data.obj.headImg) + "\" />\n                <div class=\"person-message\">\n                    <p >\u9501\u5320\u540D\u79F0\uFF1A" + data.obj.name + "</p>\n                    <p>\u8054\u7CFB\u7535\u8BDD\uFF1A\n                        <a>" + data.obj.tel + "<a href=\"tel:" + data.obj.tel + "\" onclick=\"event.stopPropagation()\"><img class=\"dial-phone\" src=\"/theme/dmapp/img/daming/dial-phone.png\" /></a></a>\n                    </p>\n                    <p>\u670D\u52A1\u6B21\u6570\uFF1A" + (data.obj.serviceNum == null ? 0 : data.obj.serviceNum) + "\u6B21</p>\n                    <div class=\"datail-star-box\">\n                        <span class=\"vertical-align-middle\">\u8BC4\u4EF7\u661F\u7EA7\uFF1A</span>\n                        <ul class=\"grade-star vertical-align-middle\" id=\"star_" + data.obj.id + "\">\n                            <li>\n                                <span class=\"star-bg\"></span>\n                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                            </li>\n                            <li>\n                                <span class=\"star-bg\"></span>\n                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                            </li>\n                            <li>\n                                <span class=\"star-bg\"></span>\n                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                            </li>\n                            <li>\n                                <span class=\"star-bg\"></span>\n                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                            </li>\n                            <li>\n                                <span class=\"star-bg\"></span>\n                                <img class=\"icon-star\" src=\"/theme/dmapp/img/daming/icon_star.png\" />\n                            </li>\n                        </ul>\n                        <span class=\"color-white-orange vertical-align-middle\">" + data.obj.score + "</span>\n                    </div>\n                </div>\n            ";
            $("#unlockerInfo").html(html);
            grade_star($("#star_" + data.obj.id), data.obj.score);
            layer.closeAll();
        }
    });
}

/**
 * 评论列表
 * @param type 1下拉刷新 2上拉加载
 * @param unlockerId 锁匠id
 */
var commentPageStart = 1;
var commentPageAppend = true;
function commentList(type, unlockerId) {
    if (type === 1) {
        commentPageAppend = true;
        commentPageStart = 1;
    }
    if (type === 2 && !commentPageAppend) {
        loadrefresh();
        $("#pullUpTip").html("没有更多数据");
        return;
    }
    var param = { pageStart: commentPageStart, unlockerId: unlockerId };
    layer.open({ type: 2, shade: 'background-color: rgba(0,0,0,.1)' });
    $.ajax({
        type: "post",
        url: BASESERVLET + "/api/app/unlock/service/listComment",
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
            commentPageStart = data.obj.start + 1;
            if (data.list !== null && data.list.length > 0 && commentPageAppend) {
                $.each(data.list, function (index, value) {
                    var dateStr = new Date(value.commentTime).format("yyyy-MM-dd");
                    var html = "\n                        <li>\n                            <div class=\"comments-user-box clear\">\n                                <div class=\"user-img\"></div>\n                                <div class=\"user-name\">\n                                    <p><span>" + value.userName + "</span><span class=\"color-gray-999 float-right\"> " + dateStr + "</span></p>\n                                    <p><span class=\"color-gray-999 font-size-028rem\">" + value.userTel + "</span></p>\n                                </div>\n                            </div>\n                            <div class=\"comments-content\">" + value.comment + "</div>\n                        </li>\n                    ";
                    $("#list").append(html);
                });
                /*
                 * 判断是否还有更多数据
                 * 1.返回数据数量<页面应返回数量
                 * 2.如果数据正好两页，那么查询第三页数据的时候就会返回第二页的数据，所以要加的二个判断条件
                 */
                if (data.list.length < data.obj.rows || data.list.length === data.obj.rows && data.obj.start === data.obj.totalPage) {
                    commentPageAppend = false;
                    $("#pullUpTip").html("没有更多数据");
                }
            }
            if (data.obj.totalRow <= 0) {
                commentPageAppend = false;
                var html = "<img class=\"message-null\" src=\"/theme/img/deadbeat/NoData.png\" />";
                $("#wrapper1").html(html);
            }
            loadrefresh();
            $("#commentTotal").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u5171\u6709" + data.obj.totalRow + "\u6761\u7528\u6237\u8BC4\u4EF7");
            layer.closeAll();
        }
    });
}

/**
 * 服务列表
 * @param type 1下拉刷新 2上拉加载
 * @param status 1待服务 2待评价 3已评价 0全部
 * @param userIdentity 用户身份 1锁匠 2住户 3开锁公司负责人
 */
var servicePageStart = 2;
var servicePageAppend = true;

function serviceList1(type, unlockerId) {
  if (type === 1) {
    servicePageAppend = true;
    servicePageStart = 1;
  }
  if (type === 2 && !servicePageAppend) {
    loadrefresh();
    $("#pullUpTip").html("没有更多数据");
    return;
  }
  var param = {pageStart: servicePageStart, unlockerId: unlockerId};
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
        $("#list1").html("");
      }
      servicePageStart = data.obj.start + 1;
      if (data.list !== null && data.list.length > 0 && servicePageAppend) {
        $.each(data.list, function (index, value) {
          var id = value.id;
          var userName = value.userName;
          var dateStr = new Date(value.createTime).format(
              "yyyy-MM-dd hh:mm:ss");
          var html = "<li onclick=\"toServiceDetail(" + id + ",2)\">\n"
              + "<span align='left'>" + userName + "</span>\n"
              + "<input type='hidden' id=\"id\" value=" + id + "/>\n"
              + "<span align='right'>" + dateStr + "</span>\n"
              + "</li>";
          $("#list1").append(html);
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