//-----------自定义类------------//
var map = new BMap.Map("allmap");
$(function(){
    $("#searchName").val("河北省公安厅");
    APP110.loadConfig(3);
    APP110.load(3);//加载第3屏
    $("#searchName").on("keyup", function(e){
        if(e.which==13){
            goSearch();
        }
    });

    var currentLat = localStorage.getItem('currentLat');
    var currentLng = localStorage.getItem('currentLng');
    if(currentLat && currentLng) {
        happend(currentLat,currentLng);
    }
});
function goSearch() {
    var addressName=$("#searchName").val();
    map.clearOverlays();
    getGps(addressName);
    console.log("输入查询地名"+addressName);
}
function getGps(addressName) {
    var pointInitialization = new BMap.Point(114.427248, 38.029035);
    map.centerAndZoom(pointInitialization, 15);
    var local = new BMap.LocalSearch(map, {
        renderOptions:{map: map}
    });
    local.search(addressName);
    var markerArr = new Array();
    local.setMarkersSetCallback(function(pois){
       for(var i=0;i<pois.length;i++){
           markerArr[i]=pois[i].marker;
           pois[i].marker.addEventListener("click", function(e){
               //do something
               $("#lng").val(e.point.lng);
               $("#lat").val(e.point.lat);
               map.clearOverlays();
               happend(e.point.lat,e.point.lng)
           })
       }
     })
    console.log(local+"local");
}

function happend(lat,lng) {
    if(lat == "null"||lat == "" || lat == undefined || lat == null || lng == "null" ||lng == "" || lng == undefined || lng == null){
        lng=114.427248;
        lat =38.029035;
    }
    map.clearOverlays();
    console.log("点击拿到的坐标"+lng+","+lat);
    var point = new BMap.Point(lng,lat);
    map.centerAndZoom(point, 15);
    var marker = new BMap.Marker(point);  // 创建标注
    marker.enableDragging();//marker可拖拽
    multiPoint(map,point);
    marker.addEventListener("dragend", function(e){
        point.lng=e.point.lng;
        point.lat=e.point.lat;
        multiPoint(map,point);
    })
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //鼠标放大缩小事件
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.addOverlay(marker);               // 将标注添加到地图中
    //城市列表
    // var size = new BMap.Size(10, 20);
    // map.addControl(new BMap.CityListControl({
    //     anchor: BMAP_ANCHOR_TOP_LEFT,
    //     offset: size,
    // }));
    /*****************************************根据坐标获取中文地址************************************/
    var geoc = new BMap.Geocoder();
    geoc.getLocation(point, function(rs){
        var addComp = rs.addressComponents;
        var caseAddress=addComp.province + addComp.city + addComp.district + addComp.street +  addComp.streetNumber;
        $("#gpsAddress").text(caseAddress);
    });
    /*****************************************多点************************************/
}
function multiPoint(map,point) {
    $.ajax({
        url:BASESERVLET+"/web/policeGroup/search",
        type:"get",
        contentType:"application/json",
        data:"lng="+point.lng+"&lat="+point.lat,
        success:function(data){
            $("#groupNum").text(data.obj.groupNum);
            $("#policeNum").text(data.obj.userNum);
            if(data.list && data.list.length>0){
                for (var i=0;i<data.list.length;i++)
                {
                    var name=data.list[i].name;
                    var label = new BMap.Label("暂无描述",{offset:new BMap.Size(20,-10)});
                    // 编写自定义函数,创建标注
                    if(1==data.list[i].type){
                        //派出所
                        var myIcon = new BMap.Icon('/theme/yjzh-img/map/police-station.png', new BMap.Size(36, 48), {
                            anchor: new BMap.Size(36, 48)
                        });
                    }else if(2==data.list[i].type){
                        //警察
                        var myIcon = new BMap.Icon('/theme/yjzh-img/map/police-person.png', new BMap.Size(36, 48), {
                            anchor: new BMap.Size(36, 48)
                        });
                    }
                    var label = new BMap.Label(name,{offset:new BMap.Size(20,-10)});
                    var pt = new BMap.Point(data.list[i].longitude, data.list[i].latitude);
                    var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                    marker2.setLabel(label);
                    // marker2.addEventListener("mouseover", function(){
                    //     label.setStyle({  //给label设置样式，任意的CSS都是可以的
                    //         display:"block"
                    //     });
                    //
                    // });
                    // marker2.addEventListener("mouseout", function(e){
                    //     label.setStyle({  //给label设置样式，任意的CSS都是可以的
                    //         display:"none"
                    //     });
                    // });


                    // marker2.addEventListener("click", function(e){  覆盖点的点击事件
                    //     alert(e.point.lat+","+e.point.lng);
                    // })
                    map.addOverlay(marker2); // 将标注添加到地图中
                }
            }
        }
    });
    /************************************把数据返回到页面list上*************************/
    $.ajax({
        url:BASESERVLET+"/web/policeGroup/searchHtml",
        type:"get",
        dataType: "html",
        data:"lng="+point.lng+"&lat="+point.lat,
        success:function(data){
            $("#unit_list").html(data);
            $("#police_list").html(data);
        }
    });
    
}




/************************************地图页面数据填充************************/
function getUnitAndPolice() {
    var unitAndPolice = new Object();
    var unitStr="";
    $("input[name='police-station']:checked").each(function(){ //遍历table里的全部checkbox
        unitStr += $(this).val() + ","; //获取所有checkbox的值
    });
    if(unitStr.length > 0) //如果获取到
        unitStr = unitStr.substring(0, unitStr.length - 1); //把最后一个逗号去掉
    unitAndPolice.unit = unitStr;
    var policeStr="";
    $("input[name='police-person']:checked").each(function(){ //遍历table里的全部checkbox
        policeStr += $(this).val() + ","; //获取所有checkbox的值
    });
    if(policeStr.length > 0) //如果获取到
        policeStr = policeStr.substring(0, policeStr.length - 1); //把最后一个逗号去掉
    unitAndPolice.user = policeStr;
    return unitAndPolice;
}


function fill() {
    var task = new Object();
    var unitAndPolice =getUnitAndPolice();
    task.unit=unitAndPolice.unit;
    task.user=unitAndPolice.user;
    task.lng=$("#lng").val();
    task.lat=$("#lat").val();
    return task;
}
/************************************任务添加跳转************************/
function add() {
    layer.open({
        type: 2,
        title: "添加任务信息",
        shadeClose: true,
        closeBtn:1,
        shade: 0.3,
        area: ['1240px', '90%'],
        content: BASESERVLET+'/web/infoTask/mapAdd'
    });
}
APP110.mods["map"].gpsMap = function(lat,lng){
    if(null != lat && null != lng){
        happend(lat,lng);
    }
}
APP110.mods["map"].newTask = function(){
    add();
}