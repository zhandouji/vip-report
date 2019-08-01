/**
 * 110报警地图 附近民警，报警人轨迹，附近警情
 * @author shilinchuan
 * @date 2018/3/8
**/
var polyline;
/**
 * 附近民警，报警人轨迹，附近警情tab切换
 */
$(".map-tab-bar-list li").on("click",function(){
    cleanNearbyList();
    removeMarker(MARKER_TYPE.POLICE);
    removeMarker(MARKER_TYPE.ALARM);
    removeMarker(MARKER_TYPE.TRAIL);
  closeInfoWindow();
    if (polyline !== undefined){
        APP110.map.remove(polyline);
    }
    $(".inquire-result-box").css("display","none");
    if($(this).attr("data-num")==0){
        $(".map-tab-bar-list li").removeClass("checked-bar");
        $(this).addClass("checked-bar");
        if($(this).index()==0){
            $(".near-alert-box").css("display","none");
            $(".near-police-box").css("display","block");
        }else if($(this).index()==1){
            $(".near-alert-box").css("display","none");
            $(".near-police-box").css("display","none");
            userTrail();
        }else if($(this).index()==2){
            $(".near-police-box").css("display","none");
            $(".near-alert-box").css("display","block");
            initStartEndTime();
        }
        $(".map-tab-bar-list li").attr("data-num","0");
        $(this).attr("data-num","1");
    }else{
        $(this).removeClass("checked-bar");
        $(this).attr("data-num","0");
        $(".near-alert-box").css("display","none");
        $(".near-police-box").css("display","none");
    }
});

/**
 * 清理左侧附近查询列表
 */
function cleanNearbyList(){
    $('#nearby_police_alarm_list').html('');
}

/**
 * 查询附近民警
 */
function nearbyPolice(){
    var nearbyPoliceDistance = $("#nearbyPoliceDistance").val();
    var lat = localStorage.getItem('caseLat');
    var lng = localStorage.getItem('caseLng');

    $.ajax({
        type: "get",
        url: BASESERVLET+"/web/nearbyPolice/" + lat + "/" + lng + "/" + nearbyPoliceDistance,
        dataType: "json",
        contentType: "application/json",
        success:function(data){
            if(!data.status){
                layer.open({
                    content: '操作失败' + data.error
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return;
            }
            //清除列表和地图标记
            cleanNearbyList();
            removeMarker(MARKER_TYPE.POLICE);

            //修改列表标题
            $('#nearby_police_alarm_title').html('附近民警');

            var txt = '';
            if (data.list !== null && data.list.length > 0){
                $.each(data.list, function(index, value){
                    //设置marker
                  var iconUrl = BASE + "/theme/img/map/police-red.png";
                    if (value.status === 1){
                      iconUrl = BASE + "/theme/img/map/police-blue.png";
                    }
                    var icon = new AMap.Icon({
                        size: new AMap.Size(36, 48),  //图标大小
                        image: iconUrl
                    });
                    var point = new AMap.LngLat(value.lng, value.lat);
                    var marker = addMarker(point, icon);
                    //设置覆盖物类型和警员id
                    marker.udt = MARKER_TYPE.POLICE;
                    marker.myid = value.policeId;

                    //设置信息窗口
                    var description = '';
                    var type = '';
                    if (value.alarmCase !== undefined && value.alarmCase.length > 0){
                        $.each(value.alarmCase, function(index, value){
                            description += value.description;
                            type += value.type;
                        });
                    }
                    var html = '<dd>' +
                        '<dl>姓名：' + (value.policeName !== undefined ? value.policeName:'未知') + '</dl>' +
                        '<dl>联系方式：'+value.phone +' </dl>'
                        '<dl>派出所：' + value.groupName + '</dl>' +
                        '<dl>状态：' + (value.status === 1 ? '已接警':'未接警') + '</dl>';
                    if (type !== ''){
                        html += '<dl>具体内容：' + type + '</dl>';
                    }
                    if (description !== ''){
                        html += '<dl>警情：' + description + '</dl>';
                    }
                    html += '</dd>';
                    var infoWindow = setInfoWindow(marker, '民警信息', html);

                    //显示列表
                    var listIconUrl = BASE+"/theme/img/map/minjing01.png";
                    if (value.status === 1){
                        listIconUrl = BASE+"/theme/img/map/minjing02.png";
                    }

                  txt = `<li id="nearby_police_alarm_list_${index}">
                        <img src="${listIconUrl}" />
                        <div style="margin-left: 3px">
                            <p>${value.policeName !== undefined
                      ? value.policeName
                      : `未知`}(${value.groupName}) - ${value.status === 1
                      ? `<span style="color:#174ECC;font-size:14px">处警中</span>`
                      : `<span style="color:#CD000D;font-size:14px">未处警</span>`}</p>
                            <p style="color:#999">距案发地址${value.distance}米</p>
                        </div>
                    </li>`;

                    $('#nearby_police_alarm_list').append(txt);

                    $('#nearby_police_alarm_list_' + index).on("click",function(){
                        APP110.map.setZoomAndCenter(14, marker.getPosition());
                        infoWindow.open(APP110.map, marker.getPosition());

                    });
                });
            } else {
                txt = '<li>' +
                    '<div class="">暂无数据...</div>' +
                    '</li>';
            }
            $(".inquire-result-box").css("display","block");
        }
    });
}

/**
 * 查询附近警情
 */
function nearbyAlarm(){
    var nearbyAlarmDistance = $("#nearbyAlarmDistance").val();
    var nearbyAlarmStatus = $("#nearbyAlarmStatus").val();
    var lat = localStorage.getItem('caseLat');
    var lng = localStorage.getItem('caseLng');
    var startTime = $("#startTime").val() + ":00";
    var endTime = $("#endTime").val() + ":00";
  var caseId = localStorage.getItem('caseId');
  debugger;
    var param = {lat:lat, lng:lng, distance:nearbyAlarmDistance, status:nearbyAlarmStatus, startTime:startTime, endTime:endTime, caseId: caseId};
    $.ajax({
        type: "post",
        url: BASESERVLET+"/web/alarm/nearbyAlarmCase",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(param),
        success:function(data){
            if(!data.status){
                layer.open({
                    content: '操作失败' + data.error
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return;
            }
            //清除列表和地图标记
            cleanNearbyList();
            removeMarker(MARKER_TYPE.ALARM);

            //修改列表标题
            $('#nearby_police_alarm_title').html('附近警情');

            var txt = '';
            if (data.list !== null && data.list.length > 0){
                $.each(data.list, function(index, value){
                    //设置marker
                  var iconUrl = BASE + "/theme/img/map/alarm-red.png";
                    if (value.status === 1){
                      iconUrl = BASE + "/theme/img/map/alarm-blue.png";
                    }
                    var icon = new AMap.Icon({
                        size: new AMap.Size(36, 48),  //图标大小
                        image: iconUrl
                    });
                    var point = new AMap.LngLat(value.lng, value.lat);
                    var marker = addMarker(point, icon);
                    //设置覆盖物类型和警员id
                    marker.udt = MARKER_TYPE.ALARM;
                    marker.myid = value.userId;

                    //设置信息窗口
                    var html = '<dd>' +
                        '<dl>姓名：' + (value.userName !== undefined ? value.userName:'未知') + '</dl>' +
                        '<dl>电话：' + value.userTel + '</dl>' +
                        '<dl>时间：' + value.startTime + '</dl>' +
                        '<dl>状态：' + (value.status === 1 ? '已派警' : '未派警')
                        + '</dl>';
                    if (value.type !== undefined){
                        html += '<dl>具体内容：' + value.type + '</dl>';
                    }
                    if (value.description !== undefined && value.description !== 'ALERT'){
                        html += '<dl>警情：' + value.description + '</dl>';
                    }
                    html += '</dd>';
                    var infoWindow = setInfoWindow(marker, '警情信息', html);

                    //显示列表
                  var listIconUrl = BASE + "/theme/img/map/jingqing02.png";
                    if (value.status === 1){
                      listIconUrl = BASE + "/theme/img/map/jingqing01.png";
                    }
                  txt = `<li id="nearby_police_alarm_list_${index}">
                        <img src="${listIconUrl}" />
                        <div style="margin-left: 3px">
                            <p>${value.userName !== undefined ? value.userName
                      : `未知`}(${value.userTel}) - ${value.status === 1
                      ? `<span style="color:#174ECC;font-size:14px">已派警</span>`
                      : `<span style="color:#CD000D;font-size:14px">未派警</span>`}&nbsp;&nbsp;&nbsp;${value.startTime}</p>
                            <p style="color:#999">距案发地址${value.distance}米</p>
                        </div>
                    </li>`;

                    $('#nearby_police_alarm_list').append(txt);
                    $('#nearby_police_alarm_list_' + index).on("click",function(){
                        APP110.map.setZoomAndCenter(14, marker.getPosition());
                        infoWindow.open(APP110.map, marker.getPosition());
                    });
                });
            } else {
                txt += '<li>' +
                    '<div class="">暂无数据...</div>' +
                    '</li>';
            }

            $(".inquire-result-box").css("display","block");
        }
    });
}

/**
 * 初始化设置附近警情查询开始，结束时间
 */
function initStartEndTime(){
    var now = new Date();
    //半小时前
    var start = new Date(now.getTime() - 1800000);
    var startTime = start.format("yyyy-MM-dd hh:mm");
    var endTime = now.format("yyyy-MM-dd hh:mm");
    $("#startTime").val(startTime);
    $("#endTime").val(endTime);
}

/**
 * 获得报警人轨迹
 */
function userTrail(){
    var caseId = localStorage.getItem('caseId');

    $.ajax({
        type: "get",
        url: BASESERVLET+"/web/alarm/userTrail/" + caseId,
        dataType: "json",
        contentType: "application/json",
        success:function(data){
            if(!data.status){
                layer.open({
                    content: '操作失败' + data.error
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return;
            }

            if (data.list !== null && data.list.length > 0){
                //设置轨迹
                var lineArr = [];
                $.each(data.list, function(index, value){
                    lineArr.push([value.lon, value.lat]);
                });
                polyline = new AMap.Polyline({
                    path: lineArr,          //设置线覆盖物路径
                    strokeColor: "#3366FF", //线颜色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: 5,        //线宽
                    strokeStyle: "solid",   //线样式
                    strokeDasharray: [10, 5] //补充线样式
                });
                polyline.setMap(APP110.map);

                //设置起点终点
                //起点
                var iconStart = new AMap.Icon({
                    size: new AMap.Size(36, 48),  //图标大小
                    image: BASE + "/theme/img/map/trail-start.png"
                });
                var pointStart = new AMap.LngLat(data.list[0].lon, data.list[0].lat);
                var markerStart = addMarker(pointStart, iconStart);
                //设置覆盖物类型和警员id
                markerStart.udt = MARKER_TYPE.TRAIL;
                markerStart.myid = data.list[0].lon.uid;

                //终点
                var iconEnd = new AMap.Icon({
                    size: new AMap.Size(36, 48),  //图标大小
                    image: BASE + "/theme/img/map/trail-end.png"
                });
                var pointEnd = new AMap.LngLat(data.list[data.list.length - 1].lon, data.list[data.list.length - 1].lat);
                var markerEnd = addMarker(pointEnd, iconEnd);
                //设置覆盖物类型和警员id
                markerEnd.udt = MARKER_TYPE.TRAIL;
                markerEnd.myid = data.list[data.list.length - 1].lon.uid;
            }
        }
    });
}