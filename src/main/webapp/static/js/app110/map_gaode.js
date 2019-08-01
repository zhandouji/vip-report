//警察集合
var policeArr = [];
//所队集合
var stationArr = [];
//初始化警察点聚合
var pcluster;
//初始化所队站点点聚合
var scluster;
//-----------自定义类------------//

//地图标记点类型
var MARKER_TYPE = {
  "STATION": 0,	//警局，派出所
  "POLICE": 1, 	//警察
  "ALARMER": 2, 	//报警人
  "ALARM": 3, 	//警情
  "TRAIL": 4   //轨迹起点，终点
}

APP110.mods["map"].reset = function () {
  var map = APP110.map;
  //消除报警用户位置
  removeAllMarker();
  //恢复中心位置
  // initMapCenter(map);
  APP110.currentPoint = null;
  APP110.isInitMap = false;
  $("#max_box").hide();
  $("#map_police_list").html('');
};

APP110.mods["map"].init = function () {
  initMap();
};
//展示报警信息（报警人位置）
APP110.mods["map"].showCase = function (lon, lat, caseLat, caseLon, address,
    userId) {
  debugger
  //报警人位置
  var point = new AMap.LngLat(lon, lat);
  APP110.currentPoint = point;
  $("#alarm_address").html(address);

  //设置报警人位置并渲染标注物
  addBjrMarker(point, userId, false);

  //设置案发地位置并渲染标注物
  var casePoint = new AMap.LngLat(caseLon, caseLat);
  APP110.casePoint = point;
  addCaseMarker(casePoint, APP110.currentMedia.caseId);

  //设置派出所位置并渲染标注物，注册事件
  showPolice(caseLon, caseLat);

  $("#max_box").show();
};

APP110.mods["map"].removeCheckPolice = function (gId) {
  $("#map_police_list .check-button").each(function () {
    if ($(this).hasClass("checked-button") && gId == $(this).attr("groupId")) {
      $(this).removeClass("checked-button");
    }
  });
}

/**初始化地图*/
function initMap() {
  var map;
  /**
   * 替换为高德地图初始化
   */
  map = new AMap.Map('map-div', {
    resizeEnable: true,
    zoom: 13
  });
  APP110.map = map;
  /**
   * 地图添加控件
   */
  map.plugin(['AMap.MapType', 'AMap.Scale', 'AMap.ToolBar'],
      function () {
        map.addControl(new AMap.MapType());

        map.addControl(new AMap.Scale());

        map.addControl(new AMap.ToolBar());

      });

  //重置到初始城市中心
  // initMapCenter(map);

  //初始化警员和所队点集合
  initMarksArr();

  //绑定方法
  $("#submit_police").click(function () {
    submitPolice();
  });
  //setTimeout(showAll,5000);
  //报警人坐标
  var currentLat = localStorage.getItem('currentLat');
  var currentLng = localStorage.getItem('currentLng');
  //案发地坐标
  var caseLat = localStorage.getItem('caseLat');
  var caseLon = localStorage.getItem('caseLng');

  var currentAddress = localStorage.getItem('currentAddress');
  var currentBjr = localStorage.getItem('currentBjr');
  if (currentLat && currentLng && currentAddress) {
    APP110.mods["map"].showCase(currentLng, currentLat, caseLat, caseLon,
        currentAddress, currentBjr);
  }
}

/**
 * 初始化警员和所队站点点聚合
 */
function initMarksArr() {

}

// /**
//  * 重置到初始城市中心
//  * @param map
//  * @returns
//  */
// function initMapCenter(map) {
//   var geolocation;
//   AMap.plugin('AMap.Geolocation', function () {
//     geolocation = new AMap.Geolocation({
//       enableHighAccuracy: true,//是否使用高精度定位，默认:true
//       timeout: 10000,          //超过10秒后停止定位，默认：无穷大
//       noIpLocate: 0,          //是否禁止使用IP定位，默认值为0，可选值0-3 0: 可以使用IP定位
//       maximumAge: 0,           //定位结果缓存0毫秒，默认：0
//       convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
//       showButton: true,        //显示定位按钮，默认：true
//       buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
//       buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//       showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
//       panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
//       zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
//     });
//     map.addControl(geolocation);
//     geolocation.getCurrentPosition();
//   });
//   return map;
// }

/**
 * 删除某类型标记
 * @param type
 * @returns
 */
function removeMarker(type) {
  var map = APP110.map;
  var allOverlay = map.getAllOverlays();
  for (var i = 0; i < allOverlay.length; i++) {
    var m = allOverlay[i];
    if (m.hasOwnProperty("udt") && m.udt == type) {
      if (m.notRemove) {
        continue;
      }
      map.remove(m);
    }
  }
}

/**
 * 移除所有的覆盖物
 */
function removeAllMarker() {
  var map = APP110.map;
  map.clearMap();
}

/**
 * 添加标注点
 * @param point
 */
function addMarker(point, icon) {
  var marker = new AMap.Marker({
    position: point,
    topWhenClick: true,
    cursor: 'cur'
  })
  if (icon) {
    marker.setIcon(icon);
  }
  marker.setMap(APP110.map);
  return marker;
}

// /**
//  * 添加警察用户
//  * @author chen
//  * @param point 坐标
//  * @param 用户id
//  */
// function addPoliceMarker(point, id) {
//   //添加警察覆盖物
//   var icon = new AMap.Icon({
//     size: new AMap.Size(19, 25),  //图标大小
//     image: BASE + "/theme/img/map/marker_orange_sprite.png",
//     imageOffset: new AMap.Pixel(10, 25)
//   });
//   var marker = addMarker(point, icon);
//
//   //设置覆盖物类型和警员id
//   marker.udt = MARKER_TYPE.POLICE;
//   marker.myid = id;
//
//   var pdata = JSON.stringify({
//     userId: id
//   });
//   $.ajax({
//     type: "post",
//     url: BASESERVLET + "/api/UserInfo",
//     data: pdata,
//     cache: false,
//     contentType: "application/json",
//     dataType: "json",
//     success: function (data) {
//       var user = data.obj;
//       if (user.name) {
//         user.name = '未知';
//       }
//       var infoWindow = new AMap.InfoWindow({
//         isCustom: true,  //使用自定义窗体
//         content: "",
//         offset: new AMap.Pixel(14, -40),
//         showShadow: true
//       });
//       var html = [];
//       html.push('<dd><dl>民警：' + user.name + '</dl><dl>联系方式：' + user.phone
//           + '</dl></dd>')
//       infoWindow.setContent(createInfoWindow("民警信息", html.join("<br/>")));
//     }
//   });
//   //鼠标点击marker弹出自定义的信息窗体
//   AMap.event.addListener(marker, 'click', function () {
//     infoWindow.open(APP110.map, marker.getPosition());
//   });
//   policeArr.push(marker);
//   return marker;
// }

/**
 * 添加报警人图标
 * @param point
 */
function addBjrMarker(point, id, notCenter) {
  //报警人图标
  var icon = new AMap.Icon({
    size: new AMap.Size(36, 46),  //图标大小
    image: BASE + "/theme/img/map/trail-current.png"
  });

  //标注物弹窗
  var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: "",
    offset: new AMap.Pixel(15, -40),
    showShadow: true
  });
  var marker = addMarker(point, icon);

  //设置标注物的类型
  marker.udt = MARKER_TYPE.ALARMER;
  //设置标注物的禁止移动删除属性
  marker.notRemove = true;
  marker.setzIndex(1000);

  if (!notCenter) {
    marker.notRemove = true;
    centerBjr(point);
  }

  var pdata = JSON.stringify({
    userId: id
  });
  $.ajax({
    type: "post",
    url: BASESERVLET + "/api/UserInfo",
    data: pdata,
    async: false,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      var user = data.obj;
      if (!user.name) {
        user.name = '未知';
      }
      var html = [];
      html.push('<dd><dl>报警人：' + user.name + '</dl><dl>联系方式：' + user.phone
          + '</dl></dd>')
      infoWindow.setContent(createInfoWindow("报警人信息", html.join("<br/>")));
      APP110.isInitMap = true;
    }
  });
  AMap.event.addListener(marker, 'click', function () {
    infoWindow.open(APP110.map, marker.getPosition());
  });
  return marker;
}

/**
 * 添加案发地点标注物
 * @param point
 * @param id
 */
function addCaseMarker(point, id) {
  //报警人图标
  var icon = new AMap.Icon({
    size: new AMap.Size(40, 50),  //图标大小
    image: BASE + "/theme/img/map/marker_bjr.png"
  });

  var marker = addMarker(point, icon);
  //设置标注物的类型
  marker.udt = MARKER_TYPE.ALARM;
  //设置标注物的禁止移动删除属性
  marker.notRemove = true;
  return marker;
}

/**
 * 迁移地图中心到报警人位置
 * @param point
 */
function centerBjr(point) {
  if (APP110.isInitMap) {
    console.log("定位报警人位置");
    APP110.map.setZoomAndCenter(14, point);
  } else {
    console.log("稍后定位报警人位置");
    setTimeout(function () {
          centerBjr(point)
        }, 3000
    );
  }
}

/**
 * 添加警局图标
 * @param point
 */
function addJjMarker(point, entity) {
  //警察局图标
  var icon = new AMap.Icon({
    size: new AMap.Size(30, 30),  //图标大小
    image: BASE + "/theme/img/map/marker_jj.png",
    imageOffset: new AMap.Pixel(0, -1)
  });
  var marker = addMarker(point, icon);
  marker.setzIndex(800);
  //设置标注类型
  marker.udt = MARKER_TYPE.STATION;
  stationArr.push(marker);

  if (!entity.name) {
    entity.name = '未知';
  }
  if (!entity.principal) {
    entity.principal = '未录入';
  }
  var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: "",
    offset: new AMap.Pixel(14, -45),
    showShadow: true
  });
  var html = [];
  html.push('<dd>')
  html.push('<dl>所队：' + entity.name + '</dl>');
  html.push('<dl>联系人：' + entity.principal + '</dl><dl>联系方式：' + entity.phone
      + '</dl></dd>');
  infoWindow.setContent(createInfoWindow("所队信息", html.join("<br/>")));
  //为marker注册单击监听
  AMap.event.addListener(marker, 'click', function () {
    infoWindow.open(APP110.map, marker.getPosition());
  });

  return marker;
}

// /**
//  * 根据坐标等信息查询用户
//  * @param opt
//  * @returns
//  */
// function findUsersByLocation(opt) {
//   opt = JSON.stringify(opt);
//   console.log(opt);
//   $.ajax({
//     type: "post",
//     url: BASESERVLET + "/api/searchUser",
//     data: opt,
//     cache: false,
//     contentType: "application/json",
//     dataType: "json",
//     success: function (data) {
//       if (!data.status) {
//         layer.msg("获取地图范围内用户列表错误：\n" + data.error);
//         return;
//       }
//       if (data.list && data.list.length > 0) {
//         //map.clearOverlays();
//       }
//       console.log(data.list);
//       fillUsers(data.list);
//     }
//   });
// }

/**
 * 获取警察驻点列表并渲染界面
 * @param lon
 * @param lat
 */
function showPolice(lon, lat) {
  var pdata = JSON.stringify({
    longitude: lon,
    latitude: lat,
    distance: 5
  });
  $.ajax({
    type: "post",
    url: BASESERVLET + "/web/nearPolice",
    data: pdata,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        layer.msg("获取附近派出所列表错误：\n" + data.error);
        return;
      }
      if (data.list && data.list.length > 0) {
        fillPolice(data.list);
      } else {
        $("#map_police_list").html('');
      }
      console.log(data.list);
    }
  });
}

/**
 * 渲染警察局标注物和警察局列表
 * @param list
 */
function fillPolice(list) {
  var html = "";
  var entity;
  for (var i = 0; i < list.length;) {
    entity = list[i];
    console.log("添加派出所：" + entity.geo);
    var point = buildPointByGeo(entity.geo);
    if (point) {
      addJjMarker(point, entity);
    }
    //获取当前报警人的点位置
    var currentPoint = APP110.currentPoint;
    //计算当前报警人与当前单位的距离,并设置距离
    var distance = currentPoint.distance(point);
    distance = distance.toFixed(0);
    i++;
    html += '<li class="clear">' +
        '<span class="site-img">' + i + '</span>' +
        '<span class="police-name">' + entity.name + '</span>' +
        '<p class="police-address">' + $.trim(entity.address) + '</p>' +
        '<p class="juli">' +
        '<img src="' + BASE + '/theme/img/map/juli.png"/>' +
        '距案发地<span id="' + entity.groupId + '" style="color:#999;">' + distance
        + '</span>米' +
        '</p>' +
        '<div class="check-button" onclick="javascript:checkPolice(this)" groupId="'
        + entity.groupId + '"></div>' +
        '</li>';
  }
  //初始化所队站点点聚合
  scluster = AMap.MarkerClusterer(APP110.map, stationArr, {gridSize: 80});
  $("#map_police_list").html(html);
}

/**
 * 数据库坐标转换为高德地图坐标
 * @param geo
 * @returns {*}
 */
function buildPointByGeo(geo) {
  if (!geo) {
    return null;
  }
  var latlng = geo.split(",");
  var x, y;
  if (latlng && latlng.length == 2) {
    if (latlng[0] > 65) {
      x = latlng[0];
      y = latlng[1];
    } else {
      x = latlng[1];
      y = latlng[0];
    }
    return new AMap.LngLat(x, y);
  } else {
    return null;
  }
}

function checkPolice(selector) {
  $(selector).toggleClass("checked-button");
}

function submitPolice() {
  var polices = [];
  $(".checked-button").each(function () {
    polices.push($(this).attr("groupId"));
  });
  APP110.callModFun("alarmHandle", "dispatch", polices);
}

// function showAll() {
//   setTimeout(showAll, 10000);
//   var data = JSON.stringify({
//     type: 'all'
//   });
//   $.ajax({
//     type: "post",
//     url: BASESERVLET + "/web/case/geo",
//     data: data,
//     cache: false,
//     contentType: "application/json",
//     dataType: "json",
//     success: function (data) {
//       if (!data.status) {
//         layer.msg("获取民警位置错误：\n" + data.error);
//         return;
//       }
//       var list = data.list;
//       removeMarker(MARKER_TYPE.POLICE);
//       removeMarker(MARKER_TYPE.ALARMER);
//       for (var i = 0; i < list.length; i++) {
//         var entity = list[i];
//         createMarker(entity);
//       }
//     }
//   });
// }

// function createMarker(entity) {
//   if (entity.type == 0) {
//     addBjrMarker(new AMap.LngLat(entity.longitude, entity.latitude),
//         entity.userId, true);
//   } else {
//     addPoliceMarker(new AMap.LngLat(entity.longitude, entity.latitude),
//         entity.id);
//     //初始化警察点聚合
//     pcluster = AMap.MarkerClusterer(APP110.map, policeArr, {gridSize: 30});
//
//   }
// }

/**
 * 构建自定义信息窗体
 * @param title
 * @param content
 * @returns {Element}
 */
function createInfoWindow(title, content) {
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
  closeX.onclick = closeInfoWindow;

  top.appendChild(titleD);
  top.appendChild(closeX);
  info.appendChild(top);

  // 定义中部内容
  var middle = document.createElement("div");
  middle.className = "info-middle";
  middle.style.backgroundColor = 'white';
  middle.innerHTML = content;
  info.appendChild(middle);

  // 定义底部内容
  var bottom = document.createElement("div");
  bottom.className = "info-bottom";
  bottom.style.position = 'relative';
  bottom.style.top = '0px';
  bottom.style.margin = '0 auto';
  var sharp = document.createElement("img");
  sharp.src = "http://webapi.amap.com/images/sharp.png";
  bottom.appendChild(sharp);
  info.appendChild(bottom);
  return info;
}

//关闭信息窗体
function closeInfoWindow() {
  APP110.map.clearInfoWindow();
}

/**
 * 设置信息窗口
 * @param marker 图标
 */
function setInfoWindow(marker, title, html) {
  var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: "",
    offset: new AMap.Pixel(14, -40),
    showShadow: true
  });
  infoWindow.setContent(createInfoWindow(title, html));
  //鼠标点击marker弹出自定义的信息窗体
  AMap.event.addListener(marker, 'click', function () {
    infoWindow.open(APP110.map, marker.getPosition());
  });
  return infoWindow;
}
