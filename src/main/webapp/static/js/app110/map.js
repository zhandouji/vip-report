var convertor;
//-----------自定义类------------//
/**
 * 坐标点类
 * @param {Object} lon 经度(y)
 * @param {Object} lat 维度(x)
 */
function MyPoint(lon, lat){
	this.longitude = lon;
	this.latitude = lat;
}

//地图标记点类型
var MARKER_TYPE = {
	"STATION":0,	//警局，派出所	
	"POLICE":1, 	//警察
	"ALARMER":2 	//报警人
}
var policeMarkerClusterer;
var bjrMarkerClusterer;
APP110.mods["map"].reset = function(){
	var map = APP110.map;
	//消除报警用户位置
    removeAllMarker();
	//恢复中心位置
	initMapCenter(map);
    APP110.currentPoint = null;
    APP110.isInitMap = false;
    $("#max_box").hide();
    $("#map_police_list").html('');
};


APP110.mods["map"].init = function(){
	initMap();
};
//展示报警信息（报警人位置）
APP110.mods["map"].showCase = function(lon, lat,address, userId){
	var bjr_p = new MyPoint(lon, lat);
	var point = new BMap.Point(lon, lat);
	console.log(lon+","+lat);
    console.log(point);
	APP110.map.setZoom(17);
	APP110.map.panTo(point);
	$("#alarm_address").html(address);
	addBjrGPS(point, userId);
	showPolice(lon, lat);
    $("#max_box").show();
};

/**初始化地图*/
function initMap(){
	
	var map;
	//获取初始地图配置
//	var initCenterPoint = new MyPoint(114.14, 38.6);//初始地图中心坐标点
	
	//初始化地图
	map = new BMap.Map("map-div", {enableMapClick:false});//创建map实例
	
	APP110.map = map;
	
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	// 添加带有定位的导航控件
	var navigationControl = new BMap.NavigationControl({
		// 靠左上角位置
	    anchor: BMAP_ANCHOR_TOP_LEFT,
	    // LARGE类型
	    type: BMAP_NAVIGATION_CONTROL_LARGE,
	    // 启用显示定位
	    enableGeolocation: false
	});
	map.addControl(navigationControl);
    initMapCenter(map);
    //convertor = new BMap.Convertor();
	$("#submit_police").click(function () {
        submitPolice();
    });
	map.addEventListener('tilesloaded',function () {
        APP110.isInitMap = true;
    });
    policeMarkerClusterer = new BMapLib.MarkerClusterer(map,{
        isAverangeCenter : true
    });
    bjrMarkerClusterer = new BMapLib.MarkerClusterer(map,{
        isAverangeCenter : true,
        styles : [{
            url: BASE+"/theme/img/map/cluster2.png",
            size: new BMap.Size(66, 65),
            textColor: 'white',
            opt_textSize: 10
        }]
    });
    //setTimeout(showAll,5000);
    var currentLat = localStorage.getItem('currentLat');
    var currentLng = localStorage.getItem('currentLng');
    var currentAddress = localStorage.getItem('currentAddress');
    var currentBjr = localStorage.getItem('currentBjr');
    if(currentLat && currentLng && currentAddress) {
        APP110.mods["map"].showCase(currentLng,currentLat,currentAddress,currentBjr);
    }
}
/**
 * 重置到初始城市中心
 * @param map
 * @returns
 */
function initMapCenter(map){
//	map.centerAndZoom(new BMap.Point(initCenterPoint.longitude, initCenterPoint.latitude),13);//初始化地图,设置中心点坐标和地图级别
	 
	map.enableScrollWheelZoom(true);//设置鼠标滚轮缩放
	var myCity = new BMap.LocalCity();
	myCity.get(function(result){
		var cityName = result.name;
		//map.setCenter(cityName);
		console.log("定位城市中心点");
		map.centerAndZoom(cityName,12);
		//地图加载完成
		APP110.callModFun("notice", "getLatandLon"); 
	});
	return map;
}
/**
 * 隐藏某类型标记
 * @param type
 * @returns
 */
function hideMarker(type){
	
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
		var m = allOverlay[i];
		if(m.hasOwnProperty("udt") && m.udt==type){
			m.hide();
		}
	}
}
/**
 * 显示某类型标记
 * @param type
 * @returns
 */
function showMarker(type){
	var map = APP110.map;
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
		var m = allOverlay[i];
		if(m.hasOwnProperty("udt") && m.udt==type){
			m.show();
		}
	}
}
/**
 * 删除某类型标记
 * @param type
 * @returns
 */
function removeMarker(type){
	var map = APP110.map;
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
		var m = allOverlay[i];
		if(m.hasOwnProperty("udt") && m.udt==type){
		    if(m.notRemove) {
                continue;
            }
			map.removeOverlay(m);
		}
	}
}

function removeAllMarker(){
    var map = APP110.map;
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++){
        var m = allOverlay[i];
        map.removeOverlay(m);
    }
}

/**
 * 添加标注点
 * @param point
 */
function addMarker(point, icon){
	var marker = new BMap.Marker(point);
	if(icon){
		marker.setIcon(icon);
	}
	APP110.map.addOverlay(marker);
	return marker;
}

/**
 * 添加警察用户
 * @param point
 */
function addPoliceMarker(point, id){
	//警察用户图标
	var icon = new BMap.Icon(
					BASE+"/theme/img/map/marker_orange_sprite.png", 
					new BMap.Size(19, 25),
					{anchor:new BMap.Size(10, 25)});
	var marker = addMarker(point, icon);
	marker.udt = MARKER_TYPE.POLICE;
    marker.myid = id;
    var infoWindow;
    console.log(id);
    var pdata = JSON.stringify({
        userId:id
    });
    $.ajax({
        type:"post",
        url:BASESERVLET+"/api/UserInfo",
        data:pdata,
        cache:false,
        contentType:"application/json",
        dataType:"json",
        success:function(data){
            var user = data.obj;
            var opts = {
                width : 200,     // 信息窗口宽度
                height: 80,     // 信息窗口高度
                title : user.userName // 信息窗口标题
            }
            var html = '<dd>'+
                '<dl>民警：'+user.name+'</dl>'+
                //'<dl>姓名：'+user.name+'</dl>'+
                '<dl>角色：'+DD_ROLE[user.role]+'</dl>'+
                '</dd>';
            infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
        }
    });
    marker.addEventListener("click", function(){
        console.log("点击标注点，查询民警信息：");
        APP110.map.openInfoWindow(infoWindow,point);
    });
    return marker;
}

/**
 * 添加报警人图标
 * @param point
 */
function addBjrMarker(point, id, notCenter){
	//警察用户图标
	var icon = new BMap.Icon(
					BASE+"/theme/img/map/marker_bjr.png", 
					new BMap.Size(31, 31));
	var marker = addMarker(point, icon, notCenter);
    marker.udt = MARKER_TYPE.ALARMER;
    if(!notCenter) {
        marker.notRemove = true;
        centerBjr(point);
    }
    var infoWindow;
    console.log(id);
    var pdata = JSON.stringify({
        userId:id
    });
    $.ajax({
        type:"post",
        url:BASESERVLET+"/api/UserInfo",
        data:pdata,
        cache:false,
        contentType:"application/json",
        dataType:"json",
        success:function(data){
            var user = data.obj;
            var opts = {
                width : 200,     // 信息窗口宽度
                height: 80,     // 信息窗口高度
                title : user.userName // 信息窗口标题
            }
            var html = '<dd>'+
                '<dl>报警人：'+user.name+'</dl>'+
                //'<dl>姓名：'+user.name+'</dl>'+
                '<dl>角色：'+DD_ROLE[user.role]+'</dl>'+
                '</dd>';
            infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
        }
    });
	marker.addEventListener("click", function(){
		console.log("点击标注点，查询报警人用户：");
        APP110.map.openInfoWindow(infoWindow,point);
	})
	return marker;
}

function centerBjr(point) {
	if(APP110.isInitMap) {
        console.log("定位报警人位置");
        APP110.map.centerAndZoom(point, 15);
	} else {
        console.log("稍后定位报警人位置");
        setTimeout(function() {
        	centerBjr(point)
        },3000
        );
	}
}

function addBjrGPS(point, userId, notCenter) {
    if(!convertor) {
        convertor = new BMap.Convertor();
    }
    var pointArr = [];
    pointArr.push(point);
    convertor.translate(pointArr, 3, 5, function(data) {
        if(data.status === 0) {
        	APP110.currentPoint = data.points[0];
            var bjrMarker = addBjrMarker(data.points[0],userId, notCenter);
            if(notCenter) {
                bjrMarkerClusterer.addMarker(bjrMarker);
            }
        }
    });
}

/**
 * 添加警局图标
 * @param point
 */
function addJjMarker(point, entity){
	//警察用户图标
	var icon = new BMap.Icon(
					BASE+"/theme/img/map/marker_jj.png", 
					new BMap.Size(30, 30),
					{anchor:new BMap.Size(15, 15)});
	var marker = addMarker(point, icon);
    var label = new BMap.Label(entity.name+"<br>"+$.trim(entity.phone),{offset:new BMap.Size(-20,-40)});
    marker.setLabel(label);
    marker.udt = MARKER_TYPE.STATION;
    var searchComplete = function (results){
        if (transit.getStatus() != BMAP_STATUS_SUCCESS){
            return ;
        }
        var plan = results.getPlan(0);
        $("#"+entity.groupId).html(plan.getDistance(true));//获取距离
    }
    var transit = new BMap.DrivingRoute(APP110.map, {renderOptions: {map: null},
        onSearchComplete: searchComplete});
    if(APP110.currentPoint) {
        transit.search(point, APP110.currentPoint);
	}
	return marker;
}


/**
 * 根据坐标等信息查询用户
 * @param opt
 * @returns
 */
function findUsersByLocation(opt){
	opt = JSON.stringify(opt);
	console.log(opt);
	$.ajax({
		type:"post",
		url:BASESERVLET+"/api/searchUser",
		data:opt,
		cache:false,
		contentType:"application/json",
		dataType:"json",
		success:function(data){
			if(!data.status){
				layer.msg("获取地图范围内用户列表错误：\n"+data.error);
				return;
			}
			if(data.list && data.list.length>0){
				//map.clearOverlays();
			}
			console.log(data.list);
			fillUsers(data.list);
		}
	});
}


//function lalala(){
//	alert(APP110.currentCase);
//	if(APP110.currentCase){
//		var bjr_p = new MyPoint(APP110.currentCase.longitude,APP110.currentCase.latitude);
//		var point = new BMap.Point(APP110.currentCase.longitude,APP110.currentCase.latitude);
//		APP110.map.setZoom(17);
//		APP110.map.panTo(point);
//		addBjrMarker(point, APP110.currentBjr.userId);
//	}
//}

function showPolice(lon, lat) {
    var pdata = JSON.stringify({
        longitude:lon,
        latitude:lat,
        distance:5
    });
    $.ajax({
        type:"post",
        url:BASESERVLET+"/web/nearPolice",
        data: pdata,
        cache:false,
        contentType:"application/json",
        dataType:"json",
        success:function(data){
            if(!data.status){
                layer.msg("获取附近派出所列表错误：\n"+data.error);
                return;
            }
            if(data.list && data.list.length>0){
                fillPolice(data.list);
            } else {
                $("#map_police_list").html('');
			}
            console.log(data.list);
        }
    });
}

function fillPolice(list) {
	var html = "";
    var entity;
    for(var i=0; i<list.length;){
        entity = list[i];
        console.log("添加派出所："+entity.geo);
        var point = buildPointByGeo(entity.geo);
        if(point) {
            addJjGPS(point, entity);
		}
		i++;
        html+='<li class="clear">' +
            '<span class="site-img">' + i + '</span>' +
            '<span class="police-name">' + entity.name + '</span>' +
            '<p class="police-address">'+ $.trim(entity.address) + '</p>' +
            '<p class="juli">' +
            '<img src="'+BASE+'/theme/img/map/juli.png"/>' +
            '距案发地<span id="'+entity.groupId+'" style="color:#999;"></span>'+
            '</p>' +
            '<div class="check-button" onclick="javascript:checkPolice(this)" groupId="'+entity.groupId+'"></div>' +
            '</li>';
    }
    $("#map_police_list").html(html);
}

function addJjGPS(point, entity) {
	if(!convertor) {
        convertor = new BMap.Convertor();
	}
    var pointArr = [];
    pointArr.push(point);
    addJjMarker(point,entity);
    //警局位置由警务端通过百度地图采集
    // convertor.translate(pointArr, 3, 5, function(data) {
    //     if(data.status === 0) {
    //        addJjMarker(data.points[0],entity);
     //    }
	// });
}

function buildPointByGeo(geo) {
    if(!geo) {
    	return null;
	}
    var latlng = geo.split(",");
    var x,y;
    if(latlng && latlng.length == 2) {
    	if(latlng[0] > 65) {
    		x = latlng[0];
    		y = latlng[1];
		} else {
            x = latlng[1];
            y = latlng[0];
		}
        return new BMap.Point(x,y);
    } else {
        return null;
	}
}

function checkPolice(selector) {
	$(selector).toggleClass("checked-button");
}

function submitPolice() {
	var polices = [];
	$(".checked-button").each(function(){
        polices.push($(this).attr("groupId"));
    });
    APP110.callModFun("alarmHandle", "dispatch", polices);
}

function showAll() {
    setTimeout(showAll, 10000);
    var data = JSON.stringify({
        type:'all'
    });
    $.ajax({
        type:"post",
        url:BASESERVLET+"/web/case/geo",
        data: data,
        cache:false,
        contentType:"application/json",
        dataType:"json",
        success:function(data){
            if(!data.status){
                layer.msg("获取民警位置错误：\n"+data.error);
                return;
            }
            var list = data.list;
            removeMarker(MARKER_TYPE.POLICE);
            removeMarker(MARKER_TYPE.ALARMER);
            policeMarkerClusterer.clearMarkers();
            bjrMarkerClusterer.clearMarkers();
            for(var i=0; i<list.length;i++) {
                var entity = list[i];
                createMarker(entity);
            }
        }
    });
}
function createMarker(entity){
    if(!convertor) {
        convertor = new BMap.Convertor();
    }
    if(entity.type == 0) {
        addBjrGPS(new BMap.Point(entity.longitude, entity.latitude), entity.userId, entity.id, true);
    } else {
        //警员端直接使用百度坐标系
        var police = addPoliceMarker(new BMap.Point(entity.longitude, entity.latitude), entity.id);
        policeMarkerClusterer.addMarker(police);
    }
}