
function comeback(){
    $("#detail").attr("style","display:none");
    $("#check").attr("style","display:block");
}

var bigImgs;
var num;
function bigImg(id){
    var src = $(id).attr("src");
    bigImgs = $(id).parent().parent().parent().find("img[name='photo']");
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
    var parent = $(id);
    var videoSrc = parent.children("a");
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
    }else{
        parent.layer.msg('没有更多图片', {shift: -1,time:3000},function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        });
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
    else{
        parent.layer.msg('没有更多图片', {shift: -1,time:3000},function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        });
    }
});

function closeImg(){
    $("#outerdiv").hide();
}

