$(document).ready(function() {
	var map = new AMap.Map('myMap', {
		resizeEnable: true,
		zoom: 10,
		center: [114.484973, 38.009631],
		//			mapStyle: 'amap://styles/macaron'
	});

	//地图相关工具
	map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Geolocation'], function() {
		map.addControl(new AMap.ToolBar());
		map.addControl(new AMap.Scale());

		//地图定位
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			maximumAge: 0, //定位结果缓存0毫秒，默认：0
			convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			showButton: true, //显示定位按钮，默认：true
			buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
			showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
			panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
			zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息

	});

	//标记点
	var markers = [{
			title: "标记一",
			coordinate: [114.433925, 38.022491]
		},
		{
			title: "标记二",
			coordinate: [114.431136, 38.025736]
		},
		{
			title: "标记三",
			coordinate: [114.437144, 38.024147]
		},
	];
	for(var i = 0; i < markers.length; i++) {
		var marker = new AMap.Marker({
			position: markers[i].coordinate, //marker所在的位置
			map: map //创建时直接赋予map属性
		});
		//也可以在创建完成后通过setMap方法执行地图对象
		marker.setMap(map);
		map.setFitView();
	}

	//地图搜索
	AMap.service('AMap.PlaceSearch', function() { //回调函数
		//实例化PlaceSearch
		placeSearch = new AMap.PlaceSearch();
		//TODO: 使用placeSearch对象调用关键字搜索的功能
	});
});