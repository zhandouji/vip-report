//-----------自定义类------------//
var map;
var currentRoomId = localStorage.getItem('currentRoomId');
var currentTaskId = localStorage.getItem('currentTaskId');
var currentLat = localStorage.getItem('currentLat');
var currentLng = localStorage.getItem('currentLng');
$(function () {
    console.log("localStorage**Map初始化页面*****currentLat:{" + currentLat + "},currentLng:{" + currentLng + "},currentTaskId:{" + currentTaskId + "},currentRoomId:{" + currentRoomId + "}");
    if (currentLat && currentLng && currentTaskId) {
        map = new AMap.Map("container", {
            resizeEnable: true,
            center: [currentLng, currentLat]
        });
    } else {
        map = new AMap.Map("container", {
            resizeEnable: true
        });
    }
  $(".map-police-box").hide();
  $(".hidden-police-list").hide();
  APP110.loadConfig(3);
  APP110.load(3);//加载第3屏
  $("#searchName").on("keyup", function (e) {
    //分开是地图搜索、还是案件查看
    if (e.which == 13) {
      goSearch();
    }
  });
  /**初始化地图时候加载任务地图*/
  if (currentLat && currentLng && currentTaskId) {
    getTaskPoliceUsers(currentLat, currentLng, currentTaskId);
  }
});

function goSearch() {
  $(".map-task-police-box").hide();
  var addressName = $("#searchName").val();
  map.clearMap();
  AMap.service(["AMap.PlaceSearch"], function () {
    var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
      pageSize: 5,
      pageIndex: 1,
      city: "",//默认全国
      map: map,
      extensions: "all",
      panel: "panel"
    });
    //关键字查询
    placeSearch.search(addressName, function () {
      AMap.event.addListener(placeSearch, "markerClick", function (e) {
        placeSearch.clear();
        happend(e.data.location.lat, e.data.location.lng);
        console.log(e.data.address);//获取当前marker的具体地址信息
        // console.log(e.data);//则是包含所有的marker数据
      });
    });
  });
}

function happend(lat, lng) {
  $(".map-police-box").show();
  $(".hidden-police-list").show();
  if (lat == "null" || lat == "" || lat == undefined || lat == null || lng
      == "null" || lng == "" || lng == undefined || lng == null) {
    lng = 114.420621;
    lat = 38.023376;
  }
  console.log("点击拿到的坐标" + lng + "," + lat);
  var marker = new AMap.Marker({
    position: [lng, lat],
    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
    draggable: true, //设置点标记是否可拖拽移动，默认为false
    cursor: 'move',//指定鼠标悬停时的鼠标样式，自定义cursor，IE仅支持cur/ani/ico格式，Opera不支持自定义cursor
    raiseOnDrag: true//设置拖拽点标记时是否开启点标记离开地图的效果

  });
  setGps(lng, lat);
  AMap.event.addListener(marker, 'dragend', function (e) {
    var lat = e.lnglat.lat, lng = e.lnglat.lng;
    console.log("拖动经纬度:" + lat + ";" + lng);
    setGps(lng, lat);
    getAddress(lng, lat);
    multiPoint(lng, lat);
  });
  marker.setMap(map);
  // map.setFitView();//根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层
  marker.setAnimation('AMAP_ANIMATION_DROP');// 设置点标记的动画效果，此处为弹跳效果   “AMAP_ANIMATION_NONE”，无动画效果 “AMAP_ANIMATION_DROP”，点标掉落效果 “AMAP_ANIMATION_BOUNCE”，点标弹跳效果
  /*****************************************根据坐标获取中文地址************************************/
  getAddress(lng, lat);
  /*****************************************多点************************************/
  multiPoint(lng, lat);
}

function getAddress(lng, lat) {
  AMap.service('AMap.Geocoder', function () {//回调函数
    //实例化Geocoder
    geocoder = new AMap.Geocoder({
      city: ""//城市，默认：“全国”
    });

    var lnglatXY = [lng, lat];//地图上所标点的坐标
    geocoder.getAddress(lnglatXY, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        //获得了有效的地址信息:
        //即，result.regeocode.formattedAddress
        $("#gpsAddress").text(result.regeocode.formattedAddress);
      } else {
        //获取地址失败
      }
    });

  });
}

function multiPoint(lng, lat) {
  $.ajax({
    url: BASESERVLET + "/web/policeGroup/search",
    type: "get",
    contentType: "application/json",
    dataType: "json",
    data: "lng=" + lng + "&lat=" + lat + "&currentTaskId=" + currentTaskId,
    success: function (data) {
      console.log(data);
      $("#groupNum").text(data.obj.groupNum);
      $("#policeNum").text(data.obj.userNum);
      if (data.list && data.list.length > 0) {
        for (var i = 0; i < data.list.length; i++) {
          var name = data.list[i].name;
          // var label = new BMap.Label("暂无描述",{offset:new BMap.Size(20,-10)});
          // 编写自定义函数,创建标注
          var iconUrl = "";
          if (1 == data.list[i].type) {
            //派出所
            iconUrl = "/theme/yjzh-img/map/police-station.png";
          } else if (2 == data.list[i].type) {
              //附近20分钟内在此位置的警察。
              iconUrl = "/theme/yjzh-img/map/police_on.png";
          }
          var marker2 = new AMap.Marker({
            position: [data.list[i].longitude, data.list[i].latitude],
            title: name,
            icon: iconUrl
          });
          marker2.setMap(map);
        }
      }
    }
  });
  /************************************把数据返回到页面list上*************************/
  $.ajax({
    url: BASESERVLET + "/web/policeGroup/searchHtml",
    type: "get",
    dataType: "html",
    data: "lng=" + lng + "&lat=" + lat + "&currentTaskId=" + currentTaskId,
    success: function (data) {
      $("#unit_list").html(data);
      $("#police_list").html(data);
    }
  });

}

/************************************地图页面数据填充************************/
function getUnitAndPolice() {
  var unitAndPolice = new Object();
  var unitStr = "";
  $("input[name='police-station']:checked").each(function () { //遍历table里的全部checkbox
    unitStr += $(this).val() + ","; //获取所有checkbox的值
  });
  if (unitStr.length > 0) //如果获取到
  {
    unitStr = unitStr.substring(0, unitStr.length - 1);
  } //把最后一个逗号去掉
  unitAndPolice.unit = unitStr;
  var policeStr = "";
  $("input[name='police-person']:checked").each(function () { //遍历table里的全部checkbox
    policeStr += $(this).val() + ","; //获取所有checkbox的值
  });
  if (policeStr.length > 0) //如果获取到
  {
    policeStr = policeStr.substring(0, policeStr.length - 1);
  } //把最后一个逗号去掉
  unitAndPolice.user = policeStr;
  return unitAndPolice;
}

function fill() {
  var task = new Object();
  var unitAndPolice = getUnitAndPolice();
  task.unit = unitAndPolice.unit;
  task.user = unitAndPolice.user;
  task.lng = $("#lng").val();
  task.lat = $("#lat").val();
  task.address = $("#gpsAddress").text();
  console.log(task.address + "---------------task.address");
  return task;
}

/************************************任务添加跳转************************/
function add() {
    layer.open({
        type: 2,
        title: "添加任务信息",
        shadeClose: true,
        closeBtn: 1,
        shade: 0.3,
        area: ['1240px', '90%'],
        content: BASESERVLET + '/web/infoTask/mapAdd'
    });
}

/*设置经纬度*/
function setGps(lng, lat) {
  $("#lng").val(lng);
  $("#lat").val(lat);
}

APP110.mods["map"].gpsMap = function (lat, lng, taskId) {
  console.log("传值" + lng + "," + lat + ";" + taskId);
  if (null != taskId && taskId != undefined) {
    currentTaskId = taskId;
  }
  if (lat && lng && taskId) {
    map.clearMap();
    getTaskPoliceUsers(lat, lng, taskId);
  }
}
APP110.mods["map"].newTask = function () {
  add();
}

var makers = [];

var infoWindow = new AMap.InfoWindow({
  isCustom: true, //使用自定义窗体
  content: "",
  closeWhenClickMap: false,
  showShadow: true,
  offset: new AMap.Pixel(0, -30)
});

var lnglat1;
var lnglat2;

function getTaskPoliceUsers(lat, lng, taskId) {
  $(".map-police-box").hide();
  $(".hidden-police-list").hide();
  map.clearMap();
  console.log("传值坐标" + lng + "," + lat);
  var marker = new AMap.Marker({
    position: [lng, lat],
    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
    draggable: true, //设置点标记是否可拖拽移动，默认为false
    cursor: 'move',//指定鼠标悬停时的鼠标样式，自定义cursor，IE仅支持cur/ani/ico格式，Opera不支持自定义cursor
    raiseOnDrag: true//设置拖拽点标记时是否开启点标记离开地图的效果
  });
  setGps(lng, lat);
    //label默认蓝框白底左上角显示，样式className为：amap-marker-label
    marker.setLabel({
        //修改label相对于maker的位置
        offset: new AMap.Pixel(-18, -20),
    content: "案发地址"
  });
  marker.setMap(map);
    var point = new AMap.LngLat(lng, lat); // 创建点坐标
    map.setCenter(point);
  marker.setAnimation('AMAP_ANIMATION_BOUNCE');// 设置点标记的动画效果，此处为弹跳效果   “AMAP_ANIMATION_NONE”，无动画效果 “AMAP_ANIMATION_DROP”，点标掉落效果 “AMAP_ANIMATION_BOUNCE”，点标弹跳效果
  getAddress(lng, lat);
  /*****************************************多点************************************/
  $.ajax({
    url: BASESERVLET + "/web/policeGroup/searchTaskPolice",
    type: "get",
    contentType: "application/json",
    dataType: "json",
    data: "currentTaskId=" + taskId,
    success: function (data) {
      console.log("返回值");
      if (data.list && data.list.length > 0) {
        $("#mapTaskPolice").empty();
        for (var i = 0; i < data.list.length; i++) {
          var name = data.list[i].name;
          // 编写自定义函数,创建标注
          var iconUrl = "";
          var zIndex = 1;
          //警员列表的图标 和对应的视频状态
          var videoUrl = "";
          var videoDivName = ""
          if (2 == data.list[i].type) {
            //警察
            if (3 == data.list[i].policeFlag) {
              //3未视频
              zIndex = 90;
              iconUrl = "/theme/yjzh-img/map/police_off_video.png";
              videoUrl = "/theme/yjzh-img/map/video/video_call.png";
              videoDivName = "videoCall";
            } else if (4 == data.list[i].policeFlag) {
              //4视频中
              zIndex = 100;
              iconUrl = "/theme/yjzh-img/map/police_on_video.png";
              videoUrl = "/theme/yjzh-img/map/video/video_playback.png";
              videoDivName = "videoPlay";
            } else {
              //1离线
              iconUrl = "/theme/yjzh-img/map/police_off.png";
              videoUrl = "/theme/yjzh-img/map/video/video_stop.png";
              videoDivName = "videoStop";
            }
            var marker2 = new AMap.Marker({
              position: [data.list[i].longitude, data.list[i].latitude],
              title: name,
              icon: iconUrl,
              zIndex: zIndex,
              topWhenMouseOver: true,
              extData: data.list[i].id
            });
            makers.push(marker2);
            marker2.setMap(map);

            lnglat1 = new AMap.LngLat(data.list[i].longitude,
                data.list[i].latitude);
            lnglat2 = new AMap.LngLat(lng, lat);

            var distance = Math.round(lnglat1.distance(lnglat2));
            //当前任务的附近警员列表
            var divHtml = '<li class="clear" style="min-height: 75px" id="'
                + data.list[i].id + '">'
                + '<img class="site-img" style="margin: 10px 20px 10px 6px;" src="'
                + iconUrl + '">'
                + '<span class="police-name">' + name + '-' + data.list[i].phone
                + '</span>'
                + '<p class="juli">距案发地' + distance + '米</p>'
                + '<div class="video-button" name="' + videoDivName
                + '" onclick="openMapIfo(this)" style="background: url('
                + videoUrl + ') no-repeat center"></div>'
                + '</li>'

            $("#mapTaskPolice").append(divHtml);

          }
        }
      }


      for (var i = 0; i < makers.length; i++) {
        AMap.event.addListener(makers[i], 'click', function () {
          var userId = this.getExtData();
          var name = this.getTitle();
          markerClick(userId, name, this);
        });
      }
    }
  });

}

//点击marker点时对应的事件
function markerClick(userId, name, marker2) {
  infoWindow.open(map, marker2.getPosition());
  var html = [];
  html.push('<div class="video-outer-box">'
      + '<div name="videoCall" onclick="changeVideoCancelImg(this)" class="video-outer-box-videoCall">'
      + '<div class="video-outer-box-videoCall-div"><div>邀请TA加入视频</div></div></div>'
      /* + '<div name="videoCancel" class="video-outer-box-videoCancel">'
       + '<div class="video-outer-box-videoCancel-div">视频邀请中...</div>'
       + '<div onclick="changeVideoCallImg(this)" class="video-call-cancel">取消</div></div>'*/
      + '</div><video name="' + name + '" id="video' + userId
      + '" style="background-color: #333333; width: 100%; height: 100%; display: none" autoplay></video>')
  infoWindow.setContent(
      createInfoWindow("直播视频【" + name + "】", html.join("<br/>")));
  if (window.opener.document.getElementById("remotevideo" + userId
          + currentRoomId)) {
    $(".video-outer-box").css("display", "none");
    $("#video" + userId).css("display", "block");
    document.getElementById("video"
        + userId).srcObject = window.opener.document.getElementById("remotevideo"
        + userId + currentRoomId).srcObject;
  }
}

/************************************地图实时视频js************************/
function createInfoWindow(title, content) {
  var info = document.createElement("div");
  var info = document.createElement("div");
  info.className = "info";

  //可以通过下面的方式修改自定义窗体的宽高
  //info.style.width = "400px";
  // 定义顶部标题
  var top = document.createElement("div");
  var titleD = document.createElement("div");
  var closeX = document.createElement("img");
  top.className = "info-top";
  titleD.innerHTML = title;
  closeX.src = "http://webapi.amap.com/images/close2.gif";
  closeX.id = 'closeInfoWin';
  closeX.onclick = closeMapInfoWindow;

  top.appendChild(titleD);
  top.appendChild(closeX);
  info.appendChild(top);

  // 定义中部内容
  var middle = document.createElement("div");
  middle.className = "video-content-box";
  middle.style.backgroundColor = 'white';
  middle.innerHTML = content;
  info.appendChild(middle);

  // 定义底部内容
  var bottom = document.createElement("div");
  bottom.className = 'amap-combo-sharp';
  bottom.style.position = 'relative';
  bottom.style.top = '0px';
  bottom.style.margin = '0 auto';
  bottom.style.width = '18px';
  bottom.style.height = '9px';
  bottom.style.background = 'url(http://webapi.amap.com/theme/v1.3/images/amap-info.png) -5px -564px no-repeat';
  bottom.style.bottom = '1px';
  info.appendChild(bottom);
  return info;
}

//关闭信息窗体
function closeMapInfoWindow(param) {
  var temp = $("video");
  if (temp.length > 0) {
    temp.attr("id", "");
  }
  if (param == "leave") {
    layer.msg("民警已退出");
  }
  map.clearInfoWindow();
}

/**更新markers中的某一个marker点
 * userId 需要更新的marker
 * flag 如果是1 是视频中
 * flag 如果是2 是在线未视频
 * lng 经度
 * lat 纬度
 */
APP110.mods["map"].replaceMarker = function (userId, flag) {
  console.log(userId + "flag" + flag);
  $.ajax({
    url: BASESERVLET + "/web/getPoliceCoordinates/" + userId,
    type: "get",
    success: function (data) {
      if (data.status) {
        var obj = data.obj;
        var policeLi = $("#mapTaskPolice").find("#" + userId);
        if (obj.longitude && obj.latitude) {
          console.log("obj.longitude:{}**********************obj.latitude:{}",
              obj.longitude, obj.latitude);
          for (var i = 0; i < makers.length; i++) {
            if (makers[i].getExtData() == userId) {
              var iconUrl;
              if (1 == flag) {
                var tempVideoSrc = window.opener.document.getElementById("remotevideo"
                    + userId + currentRoomId);
                if (tempVideoSrc != null) {
                  iconUrl = "/theme/yjzh-img/map/police_on_video.png";
                } else {
                  iconUrl = "/theme/yjzh-img/map/police_off_video.png";
                }
              } else {
                iconUrl = "/theme/yjzh-img/map/police_off_video.png";
              }

              makers[i].setIcon(iconUrl);
              var point = new AMap.LngLat(obj.longitude, obj.latitude); // 创建点坐标
              makers[i].setPosition(point);
            }
          }
        }

        //修改警员列表中对应警员的状态和样式
        if (policeLi) {
          //警员列表的图标 和对应的视频状态
          var videoUrl;
          var videoName;
          var iconUrl;
          if (1 == flag) {
            var tempVideoSrc = window.opener.document.getElementById("remotevideo"
                + userId + currentRoomId);
            if (tempVideoSrc != null) {
              iconUrl = "/theme/yjzh-img/map/police_on_video.png";
              videoUrl = "url(/theme/yjzh-img/map/video/video_playback.png) no-repeat center";
              videoName = "videoPlay";
            } else {
              iconUrl = "/theme/yjzh-img/map/police_off_video.png";
              videoUrl = "url(/theme/yjzh-img/map/video/video_call.png) no-repeat center";
              videoName = "videoCall";
            }
          } else {
            iconUrl = "/theme/yjzh-img/map/police_off_video.png";
            videoUrl = "url(/theme/yjzh-img/map/video/video_call.png) no-repeat center";
            videoName = "videoCall";
          }

          policeLi.find(".site-img").attr("src", iconUrl);
          policeLi.find(".video-button").css("background", videoUrl);
          policeLi.find(".video-button").attr("name", videoName);
          //在邀请警员之后，警员进入视频中，隐藏div播放视频
          /*if (videoName == "videoCall" || videoName == "videoStop") {
            var srcObj = window.opener.document.getElementById("remotevideo" + userId + currentRoomId);
            if (srcObj) {
              document.getElementById("video" + userId).srcObject = srcObj.srcObject;
            }
            $(".video-outer-box").css("display", "none");
            $("#video" + userId).css("display", "block");
          }*/
        }
      }
    }
  });
}

//点击"邀请TA加入视频"
function changeVideoCancelImg(id) {
  //$(id).css("display", "none");
  //$(id).next().css("display", "block");
  var userId = $(id).parent().next().attr("id");
  userId = userId.substring(5, userId.length);
  /*setTimeout(function () {
    invitationVideo(userId, currentTaskId);
  }, 3000);*/
  invitationVideo(userId, currentTaskId);
}

//点击"取消邀请"
function changeVideoCallImg(id) {
  $(id).parent().css("display", "none");
  $(id).parent().prev().css("display", "block");
}

function invitationVideo(userId, taskId) {
  $.ajax({
    url: BASESERVLET + "/web/infoTask/call",
    type: "post",
    data: {userId: userId, taskId: taskId},
    dataType: "json",
    success: function (data) {
      if (data.status == true) {
        layer.msg('已通知，请等待', {
          icon: 1,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      } else {
        layer.msg('呼叫失败，请重新呼叫', {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      }
      closeMapInfoWindow("close");
    }
  });
}

//在警员列表中点击视频的3种图标的对应事件
function openMapIfo(id) {
  var userId = $(id).parent().attr("id");
  var name = $(id).attr("name");
  /*if (name === "videoStop"){
    //警员离线状态

  } else */
  //if (name === "videoPlay") {
    //警员在线未视频
    for (var i = 0; i < makers.length; i++) {
      if (makers[i].getExtData() == userId) {
        var name = makers[i].getTitle();
        markerClick(userId, name, makers[i]);
      }
    }
  //} else {
    //警员视频中
  /* for (var i = 0; i < makers.length; i++) {
     if (makers[i].getExtData() == userId) {
       var name = makers[i].getTitle();
       markerClick(userId, name, makers[i]);
     }
   }*/
  // }
}