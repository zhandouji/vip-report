//------------接警单-------------//
APP110.mods["alarmCase"].alarmDescEditable = true;

APP110.mods["alarmCase"].init = function(){

    //获取警情类别，警情级别
    $.ajax({
        url:BASESERVLET+"/api/data/110",
        type:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(!data.status){
                layer.alert("获取警情类别，警情级别失败："+data.error);
                $(".layui-layer-content").css("color","#FFF");
                return;
            }
            var d = data.obj;
            //警情级别
            var alarmLevels = APP110.mods["alarmCase"].alarmLevels = d.alarmLevels;
            //警情类别
            var jqlbMap = APP110.mods["alarmCase"].jqlbMap = d.jqlbMap;
            //报警类别
            var alarmClasses = APP110.mods["alarmCase"].alarmClasses = d.alarmClasses;

            //警情级别
            var $caseLevel = $("#a_c_caseLevel");
            for(var i=0; i<alarmLevels.length; i++){
                var al = alarmLevels[i];
                if(al.jz==1){
                    $caseLevel.append('<option value="'+al.value+'" zd="'+al.zdbz+'" td="'+al.tdbz+'">'+al.desc+'</option>');
                }
            }

            //报警类别
            var $alarmClass = $("#a_c_alarmClass");
            for(var i=0; i<alarmClasses.length; i++){
                var ac = alarmClasses[i];
                $alarmClass.append('<option value="'+ac.value+'" >'+ac.desc+'</option>');
            }

            //警情类别
            var $caseType = $("#a_c_type");
            var level1s = jqlbMap.level1List;
            var $caseType2 = $("#a_c_type2");
            var $caseType3 = $("#a_c_type3");
            var $caseType4 = $("#a_c_type4");
            var map234 = jqlbMap.causeMap;
            $caseType.change(function(){
                $caseType2.empty();
                $caseType3.empty();
                $caseType4.empty();
                var selVal = $caseType.val();
                if(!selVal){
                    return;
                }
                var tmpList = map234[selVal];
                if(tmpList && tmpList.length>0){
                    for(var i=0; i<tmpList.length; i++){
                        var eve = tmpList[i];
                        $caseType2.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
                    }
                    $caseType2.change();
                }
            });
            $caseType2.change(function(){
                $caseType3.empty();
                $caseType4.empty();
                var selVal = $caseType2.val();
                if(!selVal){
                    return;
                }
                var tmpList = map234[selVal];
                if(tmpList && tmpList.length>0){
                    for(var i=0; i<tmpList.length; i++){
                        var eve = tmpList[i];
                        $caseType3.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
                    }
                    $caseType3.change();
                }
            });
            $caseType3.change(function(){
                $caseType4.empty();
                var selVal = $caseType3.val();
                if(!selVal){
                    return;
                }
                var tmpList = map234[selVal];
                if(tmpList && tmpList.length>0){
                    for(var i=0; i<tmpList.length; i++){
                        var eve = tmpList[i];
                        $caseType4.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
                    }
                }
            });
            $caseType[0].options.length=0;
            for(var i=0; i<level1s.length; i++){
                var eve = level1s[i];
                if(eve.jz==1){
                    $caseType.append('<option value="'+eve.bh+'" >'+eve.mc+'</option>');
                }

            }
            $caseType.change();
        }
    });

    //获取区县单位，用于所属单位。辖区单位
    var types = [1,2,3,14,13,15,16];//1市（区、分）局,2	派出所,3交警,14县局,16巡区,15刑警
    types = JSON.stringify(types);
    $.ajax({
        type:"post",
        url:BASESERVLET+"/api/getGroupsByTypes",
        data:types,
        contentType:"application/json",
        dataType:"json",
        success:function(data){
            if(!data.status){
                layer.alert("获取所属单位、辖区单位信息失败："+data.error);
                return;
            }
            var list = data.list;
            //console.log("获取待选的所属单位，辖区单位：%o", list);
            var $a_c_group = $("#a_c_group");//所属单位
            var $a_c_areaGroup = $("#a_c_areaGroup");//辖区单位
            var dw,xqdw=[],xqjwz={};
            //添加所属单位，并收集派出所，警务室
            for(var i=0; i<list.length; i++){
                dw = list[i];
                if(dw.type==1 || dw.type==14){
                    //所属单位
                    $a_c_group.append('<option value="'+dw.id+'" code="'+dw.code+'">'+dw.name+'</option>');
                }else if(dw.type==2 || dw.type==3 ||dw.type==15){
                    //辖区单位
                    xqdw.push(dw);
                }else if(dw.type==13){
                    //辖区警务室
                    if(xqjwz[dw.parent]){
                        xqjwz[dw.parent].push(dw);
                    }else{
                        xqjwz[dw.parent] = [dw];
                    }
                }else if(dw.type==16){
                    //巡区
                    //石家庄没有。。。
                }
            }
            //添加派出所及下级警务室
            for(var i=0; i<xqdw.length; i++){
                dw = xqdw[i];
                $a_c_areaGroup.append('<option value="'+dw.id+'"  code="'+dw.code+'">'+dw.name+'</option>');
                //$a_c_areaGroup.append('<optgroup value="'+dw.id+'" label="'+dw.name+'" class="group-1">');
                var jws = xqjwz[dw.id];
                if(jws && jws.length>0){
                    for(var j=0; j<jws.length; j++){
                        dw = jws[j];
                        $a_c_areaGroup.append('<option value="'+dw.id+'" code="'+dw.code+'">----'+dw.name+'</option>');
                    }
                }
            }
            $('#a_c_areaGroup').searchableSelect();
          getAudioCookie(chatAudioOutput);
          getAudioCookie(alarmAudioOutput);
        }
    });

    //所属单位自动选中时，改变辖区单位
    $("#a_c_group").change(function(){
        var gcode = $(this).val();
        //改变辖区单位选择范围

    });

  //输入姓名后变化报警描述中的内容
  $("#a_c_name").blur(function () {
    APP110.callModFun("alarmCase", "changeAlarmDescContent");
  });
  //输入姓名后变化报警描述中的内容
  $("#a_c_detailedaddress").blur(function () {
    APP110.callModFun("alarmCase", "changeAlarmDescContent");
  });
  //报警描述改变时
  $("#a_c_description").blur(function () {
    APP110.mods["alarmCase"].alarmDescEditable = false;
    });
};

function getAudioCookie(name) {
  //取cookie的函数
  if (arr = document.cookie.match(name)) {
    var st = arr.input.split(";");
    for (var i = 0; i < st.length; i++) {
      var s = st[i].substring(0, st[i].lastIndexOf('='));
      var deviceId = st[i].substring(st[i].lastIndexOf('=') + 1, st[i].length);
      if (s === " chatAudioOutput" || s === "chatAudioOutput") {
        $("#chatAudioOutput option[value=\'" + deviceId + "\']").attr(
            "selected", "selected");
      }
      if (s === " alarmAudioOutput" || s === "alarmAudioOutput") {
        $("#alarmAudioOutput option[value=\'" + deviceId + "\']").attr(
            "selected", "selected");
      }
    }
  }
}
//重置接警单信息
APP110.mods["alarmCase"].reset = function(){
    $("#a_c_description").val('');//报警描述
    $("#a_c_address").val('');//事发地址
    $("#a_c_mobile").val('');//报警人电话
    $("#a_c_name").val('');//报警人姓名
    $("#a_c_type option:first").prop("selected", 'selected');//警情类别
    $("#a_c_type").change();
    $("#a_c_caseLevel").val('2');//警情级别
    $("#a_c_group").val('');//所属单位
    $("#a_c_detailedaddress").val('');//所属单位
  $("#a_c_alarmClass option:first").prop("selected", 'selected');//报警类别
    $("#a_c_alarmType").val('');//报警方式
    $(".chujing-radio").removeClass('chujing-radio-checked');//处警方式
    $(".chujing-radio[status='-4']").addClass('chujing-radio-checked');
}

/**
 * 报警人姓名或者案发地址信息变化后，修改警情描述内容
 */
APP110.mods["alarmCase"].changeAlarmDescContent = function () {
  // 只有警情描述框允许修改并且接警状态下，才会执行
  if (APP110.mods["alarmCase"].alarmDescEditable && APP110.currentBjr) {
    var bjr = APP110.currentBjr;//当前报警人
    var cc = APP110.currentCase;//当前案件信息
    var changeName = $('#a_c_name').val();//修改后的报警人的姓名
    var a_c_template = $('#alarm_description_template').val();//报警描述
    a_c_template = a_c_template.replace('${time}', cc.time);
    a_c_template = a_c_template.replace('${address}',
        $("#a_c_detailedaddress").val());
    a_c_template = a_c_template.replace('${name}', changeName);
    a_c_template = a_c_template.replace('${phone}', bjr.phone);
    $("#a_c_description").val(a_c_template);
  }
}

//将报警信息填充到接警单
APP110.mods["alarmCase"].fill = function(){
  APP110.mods["alarmCase"].alarmDescEditable = true;
    var ci = APP110.currentMedia;//当前案件视频信息
    var cc = APP110.currentCase;//当前案件信息
    var bjr = APP110.currentBjr;//当前报警人
    $("#a_c_name").val(bjr.name);//姓名
    $("#a_c_mobile").val(bjr.phone);//手机
    $("#a_c_time").val(cc.time);//报警时间
    $("#a_c_detailedaddress").val(cc.address);//案发地址
    $("#a_c_alarmType").val(cc.alarmType);//报警方式
    var a_c_template = $('#alarm_description_template').val();//报警描述
    if(typeof(cc.time)!="undefined"){
        a_c_template = a_c_template.replace('${time}', cc.time);
    }else {
        a_c_template = a_c_template.replace('${time}', '');
    }
    if(typeof(cc.address)!="undefined"){
        a_c_template = a_c_template.replace('${address}', cc.address);
    }else {
        a_c_template = a_c_template.replace('${address}', '');

    }
    if(typeof(bjr.name)!="undefined"){
        a_c_template = a_c_template.replace('${name}', bjr.name);
    }else{
        a_c_template = a_c_template.replace('${name}',"");
    }
    if(typeof(bjr.phone) != 'undefined'){
        a_c_template = a_c_template.replace('${phone}', bjr.phone);
    }else {
        a_c_template = a_c_template.replace('${phone}', '');

    }
    $("#a_c_description").val(a_c_template);
    var city = cc.city;
    var district = cc.district;
    $.ajax({
        type:"get",
        url:BASESERVLET+"/api/area_code/city_district",
        data:{city:city, district:district},
        dataType:"json",
        success:function(data){
            if(!data.status){
                layer.msg("获取【"+city+" "+district+"】的区划代码错误："+data.error);
                return;
            }
            console.info("获取案情的区划代码：%o", data.obj);
            if(!data.obj){
              $("#a_c_group option:last").prop("selected", 'selected');
                return;
            }
            var qhobj = data.obj;
            var qh = qhobj.regionalismCode;
            var tsdy, cityCode;
            try{
                cityCode = qh.substring(0,4);
                console.log(cityCode);
                tsdy = GB2GROUP[cityCode] ? GB2GROUP[cityCode] : false;
                console.log(tsdy);
                qh = tsdy[qh] ? tsdy[qh].code : qh;//如果特殊对应中有数据，则使用特殊对应的区划码
                console.log(qh);
            }catch(e){}

            //根据区划代码获取对应的单位
            var $a_c_group = $("#a_c_group option");//所属单位
            var code;
            $.each($("#a_c_group option"), function(i, o){
                $o = $(o);
                code = $o.attr("code");
                if(code && code.indexOf(qh)==0){
                    $("#a_c_group").val($o.val());
                    return false;//停止循环
                }
            });
          if ($("#a_c_group").val() == "") {
            $("#a_c_group option:last").prop("selected", 'selected');
          }
        }
    });
}

//获取报警信息对象
APP110.mods["alarmCase"].getData = function(){
    var alarmInfo = {};
    var ci = APP110.currentMedia;//当前案件信息
    var bjr = APP110.currentBjr;//当前报警人
    alarmInfo.caseId = ci.caseId;
    alarmInfo.description = $("#a_c_description").val();
    alarmInfo.address = $("#a_c_address").val();
    alarmInfo.mobile = $("#a_c_mobile").val();
    alarmInfo.name = $("#a_c_name").val();
    alarmInfo.status = $(".chujing-radio-checked:first").attr("status");
    alarmInfo.type = $("#a_c_type").val();
    alarmInfo.gender = $("#bjrxx-xb").html() == '男' ? "1" : "0";
    alarmInfo.detailedaddress = $("#a_c_detailedaddress").val();
    if($("#a_c_type2").val()){
        alarmInfo.type = $("#a_c_type2").val();
    }
    if($("#a_c_type3").val()){
        alarmInfo.type = $("#a_c_type3").val();
    }
    if($("#a_c_type4").val()){
        alarmInfo.type = $("#a_c_type4").val();
    }
    alarmInfo.caseLevel = $("#a_c_caseLevel").val();
    alarmInfo.jjlx = $("#jjlx").val();
    if($("#a_c_group").val()){
        alarmInfo.group = {id:$("#a_c_group").val()};
    }
    if($("#a_c_areaGroup").val()){
        alarmInfo.areaGroup = {id:$("#a_c_areaGroup").val()};
    }
    if($("#a_c_alarmClass").val()){
        alarmInfo.alarmClass = $("#a_c_alarmClass").val();
    }
    if($("#a_c_alarmType").val()){
        alarmInfo.alarmType = $("#a_c_alarmType").val();
    }
    if($("#a_c_latitude").val()){
        alarmInfo.latitude = $("#a_c_latitude").val();
    }
    if($("#a_c_longitude").val()){
        alarmInfo.longitude = $("#a_c_longitude").val();
    }
    return alarmInfo;
}
//获取报警信息对象
APP110.mods["alarmCase"].transferAlarm = function () {
  //获得所有的接警中心
  $.ajax({
    url: BASESERVLET + "/web/alarmCenter/allCenter",
    type: "get",
    dataType: "json",
    success: function (data) {
      if (data.status) {
        var list = data.list;
        var html = '<div class="jingqing-message">'
            + '<div class="center-cell" style="text-align: center;"><span>选择接警中心</span>';
        html += '<select id="centerCode" name="group" style="width: 300px;"><option value="" >----请选择---</option>';
        $.each(list, function (index, value) {
          html += '<option value="' + value.code + '" >' + value.name
              + '</option>';
        });
        html += '</select>'
            + '</div><div class="center-button"><button class="add-button bg-black-blue" style="height: 40px;width: 160px;" id="saveTransfer" onclick="saveTransfer()">确定转接</button></div> </div>';
        layer.open({
          type: 1,
          title: "选择接警中心",
          shadeClose: false,
          shade: 0.5,
          area: ['670px', '350px'],
          content: html
        })
      } else {
      }
    }
  })
}

function saveTransfer() {
  var centerCode = $("#centerCode").val();
  var caseId = APP110.currentCase.caseId;
  if ("" === caseId || undefined === caseId) {
    layer.msg("暂时没有要转接的警情", {icon: 2});
    return;
  }
  if ("" === centerCode || undefined === centerCode) {
    layer.msg("请选择要转接的接警中心", {icon: 2});
    return;
  }
  $.ajax({
    url: BASESERVLET + "/web/alarm/transferAlarm/" + caseId + "/" + centerCode,
    type: "post",
    dataType: "json",
    success: function (data) {
      APP110.callModFun("notice", "repushToMq", caseId, true);
      layer.open({
        content: '转接成功'
        , skin: 'msg'
        , time: 2 //2秒后自动关闭
      });
      layer.closeAll();
      if (MyKurento.rws && MyKurento.rws.localName) {
        APP110.callModFun("kurento", "leaveRoom");
      }
      alarmEndReset();
    }
  })
}
