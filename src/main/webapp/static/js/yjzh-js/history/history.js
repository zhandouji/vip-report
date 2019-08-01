$(function () {
    //初始化警情分类
    initType();
    initGroup();
    checkData(1);
    $("#task_bt").click(function () {
        checkData(1);
    })
});

//初始化报警历史查询的所属单位数据
function initGroup() {
    //获取区县单位，用于所属单位。辖区单位
    var types = [1, 14];//1市（区、分）局,2	派出所,14县局,16巡区,15警务站
    types = JSON.stringify(types);
    $.ajax({
        type: "post",
        url: BASESERVLET + "/api/getGroupsByTypes",
        data: types,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if (!data.status) {
                layer.msg("获取所属单位信息失败：" + data.error);
                return;
            }
            var list = data.list;
            var $comm_region = $("#comm_region");//辖区单位
            var dw;
            //添加所属单位，并收集派出所，警务室
            for (var i = 0; i < list.length; i++) {
                dw = list[i];
                $comm_region.append('<option value="' + dw.id + '" code="' + dw.code + '">' + dw.name + '</option>');
            }
        }
    });
};

//报警历史查询功能的命名空间
function initType() {

    //获取警情类别，警情级别
    $.ajax({
        url: BASESERVLET + "/web/infoTask/infoType",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data == "") {
                layer.alert("获取任务分类，状态失败：" + data.error);
                return;
            } else {
                var infoType = data.infoType;
                $("#info_type").empty().append("<option value=\"\">----------请选择----------</option>");
                for (var i in infoType) {
                    $("#info_type").append("<option value =" + i + ">" + infoType[i].desc + "</option>");
                }
                var infoLevel = data.infoLevel;
                $("#info_level").empty().append("<option value=\"\">----------请选择----------</option>");
                for (var i in infoLevel) {
                    $("#info_level").append("<option value =" + i + ">" + infoLevel[i].desc + "</option>");
                }

            }
        }
    });
};

//分页查询....参数1：页数，参数2：状态------在alarm.jsp中点击“查询”调用
function checkDataPage(targetPageNumber,date) {
    var pageSize = 10;//每页查询数量
    var param = {};
    param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = pageSize;
    var statusOne = $("#state_one").attr("class");
    if(statusOne){
        var s1 = ($("#state_one").attr("class")).split(" ");
        if(s1[1]){
            param.statusOne = 1;
        }
    }
    var statusTwo = $("#state_two").attr("class");
    if(statusTwo){
        var s2 = ($("#state_two").attr("class")).split(" ");
        if(s2[1]){
            param.statusTwo = 2;
        }
    }
    var statusThree = $("#state_three").attr("class");
    if(statusThree){
        var s3 = ($("#state_three").attr("class")).split(" ");
        if(s3[1]){
            param.statusThree = 3;
        }
    }
    var statusFour = $("#state_five").attr("class");
    if(statusFour){
        var s4 = ($("#state_five").attr("class")).split(" ");
        if(s4[1]){
            param.statusFive = 5;
        }
    }

    var infoType = $("#info_type").val();
    var infoLevel = $("#info_level").val();

    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var region = $("#comm_region").val();

    if (infoLevel) {
        param.infoLevel = infoLevel;
    }
    if (infoType) {
        param.infoType = infoType;
    }

    if (region) {
        param.regin = Number(region);
    }
    if (date) {
        param.startDate = date + " 00:00:00.000";
        param.endDate = date + " 23:59:59.000";
        document.getElementById("startTime").value="";
        document.getElementById("endTime").value="";
    }else {
        if (startTime) {
            param.startDate = startTime + ".000";
        }
        if (endTime) {
            param.endDate = endTime + ".000";
        }
    }
    if (startTime&& endTime&& startTime >= endTime) {
        alert("开始时间不能大于结束时间！");
        return false;
    }
    var indexOfLayer = layer.load(2, {time: 10000});
    $("#task_tab_div").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/infoLists",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data: param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#task_tab_div").html(data);
        }
    });
}
function checkData(targetPageNumber) {
    var pageSize = 10;//每页查询数量
    var param = {};
    param.start = targetPageNumber;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = pageSize;
    var statusOne = $("#state_one").attr("class");
    if(statusOne){
        var s1 = ($("#state_one").attr("class")).split(" ");
        if(s1[1]){
            param.statusOne = 1;
        }
    }
    var statusTwo = $("#state_two").attr("class");
    if(statusTwo){
        var s2 = ($("#state_two").attr("class")).split(" ");
        if(s2[1]){
            param.statusTwo = 2;
        }
    }
    var statusThree = $("#state_three").attr("class");
    if(statusThree){
        var s3 = ($("#state_three").attr("class")).split(" ");
        if(s3[1]){
            param.statusThree = 3;
        }
    }
    var statusFour = $("#state_five").attr("class");
    if(statusFour){
        var s4 = ($("#state_five").attr("class")).split(" ");
        if(s4[1]){
            param.statusFive = 5;
        }
    }

    var infoType = $("#info_type").val();
    var infoLevel = $("#info_level").val();

    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var region = $("#comm_region").val();

    if (infoLevel) {
        param.infoLevel = infoLevel;
    }
    if (infoType) {
        param.infoType = infoType;
    }

    if (region) {
        param.regin = Number(region);
    }
    if (startTime) {
        param.startDate = startTime + ".000";
    }
    if (endTime) {
        param.endDate = endTime + ".000";
    }
  if (startTime && endTime && startTime >= endTime) {
    layer.msg("开始时间不能大于结束时间！");
    $("#startTime").val("");
    $("#endTime").val("");
    return;
  }
    var indexOfLayer = layer.load(2, {time: 10000});
    $("#task_tab_div").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/infoLists",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data: param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#task_tab_div").html(data);
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            setTimeout(initDate(year, month), 5000);
        }
    });
}


//时间
function changeTime() {
    WdatePicker({dateFmt: 'yyyy-MM-dd HH:mm:ss'});
}

function getInfo(taskId){
    $.ajax({
        type:"get",
        url:BASESERVLET+"/web/infoTask/detailHtml",
        dataType:"html",
        async:false,
        data:{taskId: taskId},
        success:function(data){

            $("#detail").attr("style","display:block");
            $("#detail").html(data);
            $("#check").attr("style","display:none");
        }
    });
}

function comeback(){
    $("#detail").attr("style","display:none");
    $("#check").attr("style","display:block");
}
var bigImgs;
var num;
function bigImg(id){
    var src = $(id).attr("src");
    bigImgs = $(id).parent().parent().find("img[name='photo']");
    num = bigImgs.index(id);
    imgShow(src);
};

function imgShow(src){
    $("#bigimg").attr("src", src);//设置#bigimg元素的src属性
	/*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).load(function(){
        var windowW = $(window).width();//获取当前窗口宽度
        var windowH = $(window).height();//获取当前窗口高度
        var realWidth = this.width;//获取图片真实宽度
        var realHeight = this.height;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

        if(realHeight>windowH*scale) {//判断图片高度
            imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
            if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW*scale;//再对宽度进行缩放
            }
        } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }
        $("#bigimg").css("width",imgWidth);//以最终的宽度对图片缩放

        var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
        var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
        $("#innerdiv").css({"top":h, "left":w});//设置#innerdiv的top和left属性
        $("#outerdiv").fadeIn("fast");//淡入显示#outerdiv及.pimg
    });
}

function playMusic(id) {
    var videobox = $(id).parent(); /*jquery对象转换成js对象*/
    var player = videobox.children("audio");
    var myVideo=player[0];
    if (myVideo.paused){
        myVideo.play();
    }else {
        myVideo.pause();
    }
}

function bigVideo(id) {
    var videoSrc = $(id).find("a");
    var src = videoSrc.attr("href");
    var sourceDom = $("<video width='100%' height='100%' controls='controls' id='wantSee'>" +
        "<source src=\""+ src +"\">" +
        "当前浏览器不支持 video直接播放，点击这里下载视频：" +
        "<a href=\""+ src +"\">下载视频</a></video>");
    $("#fancy_outer").append(sourceDom);
    $("#fancy_outer").css({width:600,height:500});
    $("#fancy_outer").css('display', 'block');
    $("#fancy_outer").css('left',600);
    $("#fancy_outer").css('top',80);
    $("#fancy_outer").css('z-index',9999);

    $("#fancy_outer").click(function(){//再次点击淡出消失弹出层
        $("#fancy_outer").css('display', 'none');
        $("#fancy_outer").empty();
    });

}

$('.photoLeft').click(function () {
    if(bigImgs.length>1){
        var id = $('#innerdiv').children("img");
        for(var i=0;i<bigImgs.length-1;i++){
            var img = bigImgs[i];
            if($(img).attr("src")==id.attr("src")){
                num = i;
            }
        }
        if(num > 0){
            num--;
        }else{
            num = bigImgs.length-1;
        }

        var nextImg = bigImgs[num];
        imgShow($(nextImg).attr("src"));
    }
});

$('.photoRight').click(function () {
    if(bigImgs.length>1){
        var id = $('#innerdiv').children("img");
        for(var i=0;i<bigImgs.length-1;i++){
            var img = bigImgs[i];
            if($(img).attr("src")==id.attr("src")){
                num = i;
            }
        }
        if(num < bigImgs.length-1){
            num++;
        }else{
            num = 0;
        }
        var nextImg = bigImgs[num];
        imgShow($(nextImg).attr("src"));
    }
});

function closeImg(){
    $("#outerdiv").hide();
}


function initDate(year, month) {
    var param = {};
    param.year = year;
    param.month = month;
    param = JSON.stringify(param);
    $.ajax({
        url: BASESERVLET + "/web/infoTask/DateList",
        type: "post",
        dataType: "json",
        data: param,
        contentType: "application/json",
        success: function (data) {
            setTimeout(function(){
                var arr = data.obj;
                var day = $(".date-items ol").eq(1).find("li[class!='old'][class!='new']");
                $(".date-items ol").eq(0).find("li").removeClass("special");
                $(".date-items ol").eq(2).find("li").removeClass("special");
                for (var i in arr) {
                    var cla = $(day[arr[i] - 1]).attr("class");
                    if (typeof(cla) != 'undefined' && cla != null && cla.length != 0) {
                        $(day[arr[i] - 1]).attr("class", cla + " special");
                    } else {
                        $(day[arr[i] - 1]).attr("class", "special");
                    }
                }
            },500)
        }
    });
};

function openFaceWindow(roomId, userId, publishFile) {
  var url = BASESERVLET + '/web/infoTask/faceImgHistoryHtml?roomId=' + roomId
      + '&userId=' + userId;
  if (publishFile != null && publishFile != undefined) {
    var publishFileId = $.md5(publishFile);
    url = url + '&publishFileId=' + publishFileId;
  }
  layer.open({
    type: 2,
    title: "人脸识别图片",
    shadeClose: true,
    shade: 0.3,
    area: ['1250px', '80%'],
    content: url,
    success: function (layero, index) {
      iframeBody = layer.getChildFrame('body', index);
      initFaceComparison();
    },
    cancel: function (layero, index) {
      unFaceComparison();
      layer.closeAll();
    }
  });
}

function openPoliceMap(userId, startTime, endTime) {
  if (endTime == "" || endTime == null) {
    endTime = new Date().getTime();
  } else {
    endTime = new Date(endTime).getTime();
  }
  if (startTime != "" && startTime != null) {
    startTime = new Date(startTime).getTime();
  }

  layer.open({
    type: 2,
    title: "民警轨迹",
    shadeClose: true,
    shade: 0.3,
    area: ['1200px', '80%'],
    content: BASESERVLET + '/web/infoTask/policeTrackHtml?userId=' + userId
    + '&startTime=' + startTime + '&endTime=' + endTime,
  });
}