/**
 * 本地特色js
 */

function imgClick() {
  $("#uploadFile").click();
}

/**
 * 分页查询
 */
function checkData(targetPageNumber,rows){
  var param = {};
  param.start = targetPageNumber;//页数
  param.rows = rows;//每页数
  param = JSON.stringify(param);
  $.ajax({
    url: "/skynet/web/localRecommendation/toList?page="+targetPageNumber,
    type: "GET",
    data: param,
    dataType: 'html',
    success: function (data) {
      $("#content_main").html(data);
    }
  });
}

/**
 * 添加本地特色
 */
function saveServer(type) {
//type为2时为添加项目，为1时添加分类
  var title = $("input[name='localTitle']").val();
  var text = $(".summernote").summernote('code');
  var attr = $("ul#fileList li:first").attr("id");
  if ("" == title) {
    layer.msg("标题不能为空");
    return;
  }
  if ($(".summernote").summernote('isEmpty')) {
    layer.msg("内容不能为空");
    return;
  }
  var paramJson;
  if (type == "2") {
    var typeId = $("select[name='add_type']").val();
    if(attr) {
      var imgs = attr.substring(11, 47);
    }
    paramJson = {
      "typeName": title,
      "typeDesc": text,
      "typePic": imgs,
      "type": type,
      "typeId": typeId
    }
  } else {
    if(!attr){
      layer.alert("请插入图片", {icon: 2});
      return;
    }else{
      var imgs = attr.substring(11, 47);
    }
    var visibleName = $("#visibleName").val();
    var availableDomain = $("#availableDomain").val();
    if(!visibleName && !availableDomain){
      visibleName = treeData[0].name;
      availableDomain = treeData[0].adcode;
    }
    paramJson = {
      "typeName": title,
      "typeDesc": text,
      "typePic": imgs,
      "type": type,
      // "typeId": typeId,
      "visibleName": visibleName,
      "availableDomain": availableDomain
    }
  }
  $.ajax({
    url: "/skynet/web/localRecommendation/save",
    type: "post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(paramJson),
    success: function (data) {
      layer.msg('添加成功', {shift: -1, time: 500}, function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
      });
      findList();
    }
  });

}

function findList() {
  $.ajax({
    url: "/skynet/web/localRecommendation/toList",
    type: "get",
    success: function (data) {
      $("#content_main").html(data);
    }
  })
}

/**
 * append数据
 */
function appendList(data) {
  if (undefined == data.list[0]) {
    $("#content-features").html(
        '<img class="message-null" src="/theme/img/deadbeat/NoData.png" />');
    return;
  }
  $("#content-features").html("");
  var list = data.list[0];
  var typePic = list.typePic;
  var html = "<div class=\"unlocking-company unlocking-tab-content\">";
  html += "<div id='wrapper'>\n"
      + "                    <div id='scroller'>\n"
      + "                        <div id=\"pullDown\">\n"
      + "                            <span class=\"pullDownIcon\"></span><span class=\"pullDownLabel color-gray-999\">下拉刷新</span>\n"
      + "                        </div>";
  html += "  <div class=\"banner-img\" id=\"banner-img\">\n"
      + "<img class=\"regional-banner\"\n"
      + "                                 src=\"/skynet/web/file/" + typePic
      + "\"/>\n"
      + "                        </div><ul id='ul_content' class=\"regional-features-list\">";
  var list2 = data.list;
  $.each(list2, function (index, value) {
    var itemPic = value.itemPic;
    var src = "/skynet/api/fileWithCompress/" + itemPic + "";
    var dateStr = new Date(value.addTime.replace(/-/g, '/')).format(
        "yyyy-MM-dd");
    var name = value.name;
    if (null == itemPic) {
      src = "../../../theme/dmapp/img/daming/banner-img.png";
    }
    html += "<li onclick=\"getDetail(" + value.areaCode + ",\'" + value.id
        + "\')\">\n"
        + "<img class=\"regional-img\"\n"
        + "src=" + src + ">\n"
        + "                                <div class=\"regional-cell-text\">\n"
        + "                                    <p class=\"regional-text\">\n"
        + "                                        " + name + "\n"
        + "                                    </p>\n"
        + "                                    <p class=\"clear\">\n"
        + "                                        <span class=\"float-right\">"
        + dateStr
        + "</span>\n"
        + "\n"
        + "                                    </p>\n"
        + "                                </div>\n"
        + "                            </li>\n";
  });
  html += "</ul><div id=\"pullUp\">\n"
      + "                            <span class=\"pullUpIcon\"></span><span id=\"pullUpTip1\" class=\"pullUpLabel color-gray-999\">上拉加载</span>\n"
      + "                        </div>\n"
      + "                    </div>\n"
      + "                </div></div>";
  $("#content-features").html(html);
  pullEl = document.getElementById("pullDown");
  pullOffset = pullEl.offsetHeight;
  loaded1 = loaded('pullDown', 'pullUp', 'wrapper');
  loadrefresh();
}

/**
 * 上拉时append数据
 */
function upAppendList(data) {
  var list = data.list[0];
  var typePic = list.typePic;
  var list2 = data.list;
  var html = "";
  $.each(list2, function (index, value) {
    var itemPic = value.itemPic;
    var src = "/skynet/api/fileWithCompress/" + itemPic + "";
    var dateStr = new Date(value.addTime.replace(/-/g, '/')).format(
        "yyyy-MM-dd");
    var name = value.name;
    if (null == itemPic) {
      src = "../../../theme/dmapp/img/daming/banner-img.png";
    }
    html += "<li onclick=\"getDetail(" + value.areaCode + ",\'" + value.id
        + "\')\">\n"
        + "<img class=\"regional-img\"\n"
        + "src=" + src + ">\n"
        + "                                <div class=\"regional-cell-text\">\n"
        + "                                    <p class=\"regional-text\">\n"
        + "                                        " + name + "\n"
        + "                                    </p>\n"
        + "                                    <p class=\"clear\">\n"
        + "                                        <span class=\"float-right\">"
        + dateStr
        + "</span>\n"
        + "\n"
        + "                                    </p>\n"
        + "                                </div>\n"
        + "                            </li>\n";
  });
  $("#ul_content").append(html);
  pullEl = document.getElementById("pullDown");
  pullOffset = pullEl.offsetHeight;
  loaded1 = loaded('pullDown', 'pullUp', 'wrapper');
  loadrefresh();
}

function loadrefresh() {
  loaded1.refresh();
}

function queryLocalData(typeId, areaCode) {
  if (!typeId) {
    $("#content-features").html(
        '<img class="message-null" src="/theme/img/deadbeat/NoData.png" />');
    return;
  }
  $("#content-features").html("");
  $.ajax({
    url: "/skynet/api/localRecommendation/getItemList?areaCode=" + areaCode
    + "&typeId=" + typeId
    + "&start=" + 1,
    type: "get",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      if (data.list == null) {
        $("#scroller").html(
            '<img class="message-null" src="/theme/img/deadbeat/NoData.png" />');
        return false;
      }
      appendList(data);
      unlockerPageStart = 2;
    }
  });

}

/**
 *  特色列表页上拉下拉
 * @param type 1下拉刷新 2上拉加载下一页
 */
var unlockerPageStart = 2;

function localList(type, typeId, areaCode) {
  if (type === 1) {
    queryLocalData(typeId, areaCode);
  }
  if (type === 2) {
    $.ajax({
      url: "/skynet/api/localRecommendation/getItemList?areaCode=" + areaCode
      + "&typeId=" + typeId
      + "&page=" + unlockerPageStart,
      type: "get",
      contentType: "application/json",
      dataType: "json",
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
        if (data.list !== null && data.list.length > 0) {
          upAppendList(data);
          unlockerPageStart = data.obj.start + 1;
        }
        if (data.list.length == 0) {
          $("#pullUpTip1").html("没有更多数据");
        }
        if (data.obj.totalRow <= 0) {
          unlockerPageAppend = false;
          var html = "<img class=\"message-null\" src=\"/theme/img/deadbeat/NoData.png\" />";
          $("#wrapper").html(html);
        }
      }
    });
  }
}
