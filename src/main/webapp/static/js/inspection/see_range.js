/**
 * Created by 52879 on 2018/1/26.
 */
var map ;
var marker;
var markers = [];
$(document).ready(function () {
});

function init(){
    map = new AMap.Map('aMap', {
        resizeEnable: true,
        zoom:13
    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });

}
/**获取选中显示类型*/
function showMap(){
    map.clearMap();
    console.log(markers.length+":length--------------");
    /**清空markers[]*/
    if(null !=markers && markers.length>0){
        markers.splice(0,markers.length);
        map = new AMap.Map('aMap', {
            resizeEnable: true,
            zoom:13
        });
    }
    console.log(markers.length+":length+++");
    var mapTypeStr = "";
    $("input[name='map-type']:checked").each(function () { //遍历table里的全部checkbox
        mapTypeStr += $(this).val() + ","; //获取所有checkbox的值
    });
    if(mapTypeStr){
        getSeeRange(mapTypeStr)
    }
}
//多边形样式
var options = {
    strokeColor: "#4FA9FA", //线颜色
    strokeOpacity: 0.9, //线透明度
    strokeWeight: 2,    //线宽
    fillColor: "#B1DAFD", //填充色
    fillOpacity: 0.5//填充透明度
}

//从后台查询数据（网格信息）
function getSeeRange(mapTypeStr) {
    console.log("mapTypeStr**************:"+mapTypeStr);
    $.ajax({
        url: "/skynet/web/company/seeRange",
        type: "get",
        data: "showFlagStr=" + mapTypeStr,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            var list = data.list;
            console.log("--------------list----------------------");
            console.log(list);
            if(null != list){
                /**网格*/
                for(var i=0;i<list.length;i++){
                    var len = list[i].areaLatLng;
                    if(len){
                        //大网格进行绘制多边形
                        var arr = new Array();
                        if(null!=len){
                            for(var j=0;j<len.length;j++){
                                var latLng = len[j];
                                var p = latLng.split(",");
                                arr.push([p[1],p[0]]);
                            }
                            /**大网格绘制多边形*/
                            editPolygon(arr, list[i].remark);
                        }
                    }else{
                        //其他的为marker标记点
                        var lng = list[i].lng;
                        var lat = list[i].lat;
                        console.log(lng+","+lat+":lngLat");
                        if(lng && lat){
                            /**标记mark点*/
                            addMarker(list[i]),mapTypeStr;
                        }
                        /**点聚合*/
                        addClusterer();
                    }
                }
            }else{
                layer.msg("暂无相应数据");
                $(".layui-layer-content").css("color", "#fff");
            }
            }
    });
}
/**
 *标记mark点
 * */
function addMarker(objMarker,mapTypeStr) {
    var strName ;
    var imgMarker;
     var makrr = new Array();
    if(null != objMarker){
        /**flag 1是网格  2 是设备*/
        if(1 == objMarker.flag){
            /**是微型消防站*/
            if(1 == objMarker.minStation){
                strName = objMarker.name;
                imgMarker= window.location.origin+"/theme/img/map/fire_station.png";
            }else {
                /**中网格*/
                if(2 == objMarker.gridLevel){
                    strName="中网格";
                    imgMarker= window.location.origin+"/theme/img/map/secondary.png";
                }else  if(3 == objMarker.gridLevel) {
                    /**小网格*/
                    strName="小网格";
                    imgMarker= window.location.origin+"/theme/img/map/small.png";
                }
            }
        }else if (2 == objMarker.flag){
            /**设备信息*/
            strName = objMarker.eqName;
            console.log("strName:"+strName);
            if("1190102"==objMarker.eqType){
                imgMarker= window.location.origin+"/theme/yjzh-img/map/shui_he.png";
            }else if("1190104"==objMarker.eqType){
                imgMarker= window.location.origin+"/theme/yjzh-img/map/xiangao.png";
            }else if("1190105"==objMarker.eqType){
                imgMarker= window.location.origin+"/theme/yjzh-img/map/xiankuan.pngg";
            }else if("1190103"==objMarker.eqType){
                imgMarker= window.location.origin+"/theme/yjzh-img/map/xiankuanxiangao.png";
            }else if("1190101"==objMarker.eqType){
                imgMarker= window.location.origin+"/theme/yjzh-img/map/dixiaxiaohuoshuan.png";
            }else{
                imgMarker= window.location.origin+"/theme/img/map/fire_hydrant.png";
            }
        }
        makrr.push(objMarker.lng,objMarker.lat);
    }
    /**
     * 生成标记点
     */
    marker = new AMap.Marker({
        position: makrr,
        icon: new AMap.Icon({
            // size: new AMap.Size(40, 50),  //图标大小
            image:imgMarker,
            // imageOffset: new AMap.Pixel(0, -36)
        })
    });

    /**
     * 自定义属性
     */
    // marker.setExtData({"objMarker":objMarker.userName,"userTel":objMarker.userTel,"address":objMarker.address,"strName":strName});
    marker.setExtData({"objMarker":objMarker,"strName":strName});
    markers.push(marker);
    /**
     * 注册点击事件
     */
    AMap.event.addListener(marker,"click",function (e) {
        listener(this);
        var info = document.getElementById("tip");
        info.style.display='none';
    });
    // marker.setMap(map);
}

/**
 * 点聚合
 */
var markerClusterer = new Object();
function addClusterer() {
    //聚合
    map.plugin(["AMap.MarkerClusterer"],function() {
        markerClusterer =  new AMap.MarkerClusterer(map,markers,{
            gridSize:80,
            minClusterSize: 3
        });
    });

    markerClusterer.flag = false;
    //给点聚合设置点击事件
    AMap.event.addListener(markerClusterer, 'click', function(e) {
        if(markerClusterer.flag){
            $("#tip").css("display", "none");
            markerClusterer.flag = false;
            return;
        }
        var info = document.getElementById("listInfo");
        $("#tip").css("display", "none");
        $("#grid_box").css("display", "none");
        $("#grid").css("display", "none");
        $("#list").css("display", "none");
        info.innerHTML="";
        var zoom =map.getZoom();
        if(zoom == 18){
                $("#tip").css("display", "block");
                $("#list_box").css("display", "block");
                $("#list").css("display", "block");
                var markerHtml="";
                for (var i = 0;i<e.markers.length;i++){
                    if(e.markers[i].getExtData().objMarker.flag == 2){
                        /**设备*/
                        markerHtml+="<li><p>所属单位："+e.markers[i].getExtData().objMarker.gridName+"</p><p>类    型："+e.markers[i].getExtData().objMarker.eqTypeName+"</p><p>名  称："+e.markers[i].getExtData().objMarker.eqName+"</p><p>地　址："+e.markers[i].getExtData().objMarker.address+"</p></li>";
                    }else if(e.markers[i].getExtData().objMarker.flag == 1){
                        /**网格*/
                        markerHtml+="<li><p>网    格："+e.markers[i].getExtData().objMarker.gridName+"</p><p>联 系 人："+e.markers[i].getExtData().objMarker.userName+"</p><p>手 机 号："+e.markers[i].getExtData().objMarker.tel+"</p><p>地　址："+e.markers[i].getExtData().objMarker.address+"</p></li>";
                    }
                }
                info.innerHTML+=markerHtml;
                markerClusterer.flag = true;
        }
    });
}
/*----------------------------------------------------------地图元素绘制开始-------------------------------------------------------------------------*/
/**
 * 大网格绘制多边形
 * @param obj
 */
function editPolygon(obj, remark) {
    options.path = obj;
    var polygon = new AMap.Polygon(options);
    polygon.status = false;
    polygon.on("click", function () {
        $("#list_box").css("display", "none");
        $("#list").css("display", "none");
        console.log("remark:"+remark);
        if(remark){
            $("#gridInfo").html(remark);
        }else{
            $("#gridInfo").html("暂无数据");
        }
        if(polygon.status){
            $("#grid_box").css("display", "none");
            $("#grid").css("display", "none");
            $("#tip").css("display", "none");
            polygon.status = false;
        }else {
            $("#grid_box").css("display", "block");
            $("#grid").css("display", "block");
            $("#tip").css("display", "block");
            polygon.status = true;
        }
    });
    polygon.setMap(map);
}
/*----------------------------------------------------------地图元素绘制结束----------------------------------------------------------------*/
/*----------------------------------------------------------地图弹出窗口开始----------------------------------------------------------------*/
/**
 * 标记点点击事件，生成信息窗体
 * @param e
 */
var infoWindow ;
function listener(e) {
    /**
     * 获取自定义信息
     */
    var objMarker = e.getExtData().objMarker;
    //设置信息窗体title，内容
    var title = objMarker.gridName;
    var content = [];
    /**flag 1是网格  2 是设备*/
    if(1 == objMarker.flag){
        /**是微型消防站*/
        if(1 == objMarker.minStation){
            var name = objMarker.userName;
            content.push("联系人："+name);
            var phone = objMarker.tel;
            content.push("电话："+phone);
            var address = objMarker.address;
            content.push("地址："+address);
        }else {
            content.push("负责人："+objMarker.userName);
            content.push("电话："+objMarker.tel);
            var address = objMarker.address;
            content.push("地址："+address);
        }
    }else if (2 == objMarker.flag){
        /**设备信息*/
        title = objMarker.eqName;
        content.push("编号："+objMarker.eqNumber);
        content.push("状态："+objMarker.eqStatus);
        content.push("负责人："+objMarker.userName);
        content.push("地址："+objMarker.address);

    }
    infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title,content.join("<br/>")),      //内容信息
        closeWhenClickMap:true,     //鼠标点击地图关闭
        offset: new AMap.Pixel(16, -45)
    });
    infoWindow.open(map,e.getPosition());
}

//构建自定义信息窗体
function createInfoWindow(title,content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    info.style.width = "200px";
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
    map.clearInfoWindow();
}
/*----------------------------------------------------------地图弹出窗结束---------------------------------------------------------------------*/