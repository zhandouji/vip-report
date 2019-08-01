/**
 * app h5 上传
 * @author shilinchuan
 * @date 2018/2/10
**/
//引入安卓ios平台判断js
document.write("<script type='text/javascript' src='/js/CrossPlatformApproach.js'  charset='utf-8'></script>");
/**
 * 上传照片
 *
 * @param count 上传最大数量
 * @param type 文件类型 图片image,视频video
 */
function uploadFile(count, type){
    var fileIds = $("#fileIds").val();
    var formData = new FormData();
    var file = $("#fileId")[0].files[0];
    formData.append("fileId", file);
    formData.append("type", $("#type").val());
    var fileType = file.type;
    var correctType = fileType.indexOf(type);
    if(correctType < 0){
        layer.open({
            content: '上传文件类型错误'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
        return;
    }
    $.ajax({
        url: BASESERVLET + "/api/uploadFile",
        type:"post",
        cache: false,//上传文件无需缓存
        processData: false,//用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须
        data: formData,
        success:function(data){
            if(!data.status){
                layer.open({
                    content: '操作失败'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return;
            }
            if (fileIds.length > 0){
                fileIds += ',';
            }
            fileIds += data.list[0].id;
            $("#fileIds").val(fileIds);

            //判断数量去掉上传按钮
            var fileIdsArr = fileIds.split(",");
            if (fileIdsArr.length >= count){
                $("#uploadBtn").hide();
            }

            var url = BASESERVLET + "/web/file/" + data.list[0].id;
            //显示图片
            if (type === 'image'){
                showImg(data.list[0].id, url);
            }
            //显示视频
            if (type === 'video'){
                showVideo(data.list[0].id, url);
            }
            $('#fileId').val('');
        },
        error: function(data){
            console.log(data);
        }
    });
}

//上传文件最大数量
var count;

/**
 * android原生上传照片
 *
 * @param count 上传最大数量
 * @param type 文件类型 图片image,视频video
 */
function uploadFileAndroid(count, type, fileType){
    this.count = count;
    /**
     * android上传文件,上传成功后，回调showFile方法
     * @param 文件类型 '0':全部 'image':图片 'video':视频
     * @param 文件来源 0:全部 1:相机 2:文件
     * @param 附件类型 对应系统中的附件类型
     */
    showImageOrVideoDialog(type, 0, fileType);
}

/**
 * 显示文件
 *
 * @param id
 * @param type 文件类型 图片image,视频video
 */
function showFile(id, type){
    var url;
    if (type === 'image'){
        url = BASESERVLET + "/api/fileWithCompress/" + id;
        showImg(id,url);
    }
    if (type === 'video'){
        //视频转换处理
        id = convertVideo(id);
        url = BASESERVLET + "/web/file/" + id;
        showVideo(id,url);
    }

    var fileIds = $("#fileIds").val();
    if (fileIds.length > 0){
        fileIds += ',';
    }
    fileIds += id;
    $("#fileIds").val(fileIds);
    //判断数量去掉上传按钮
    var fileIdsArr = fileIds.split(",");
    if (fileIdsArr.length >= count){
        $("#uploadBtn").hide();
    }
}

/**
 * 显示图片
 * @param id 图片id
 */
function showImg(id){
    //获取文件
    var file = $("#uploadForm").find("input")[0].files[0];
    //创建读取文件的对象
    var reader = new FileReader();
    //创建文件读取相关的变量
    var imgFile;
    //正式读取文件
    reader.readAsDataURL(file);
    //为文件读取成功设置事件
    reader.onloadend = function(e) {
        imgFile = e.target.result;
        var img = '<div class="id-card-img-box" id="img_div_' + id + '"><img src="'+url+'"/>' +
            '<span class="delete-img" onclick="delFile(\'' + id + '\')">×</span></div>';
        $('#uploadBtn').before(img);
        $('#img_' + id).attr('src', imgFile);
    };
}

/**
 * 显示图片
 * @param id 图片id
 */
function showImg(id,url){
    var img = '<div class="id-card-img-box" id="img_div_' + id + '"><img onclick="enlargeImageAndroid(\'' + id + '\')" src="'+url+'"/>' +
        '<span class="delete-img" onclick="delFile(\'' + id + '\')">×</span></div>';
    $('#uploadBtn').before(img);
}

/**
 * 显示视频
 * @param id 视频id
 */
function showVideo(id,url){
    // //h5播放
    // var video = '<div class="wait-upload-video vertical-align-middle">' +
    //                 '<span class="delete-img">×</span>' +
    //                 '<video onclick="stop_video(this)">' +
    //                     '<source src="' + url + '" type="video/mp4"/>' +
    //                 '</video>' +
    //                 '<div class="video-control-bar" onclick="play_video(this)">' +
    //                     '<img src="/theme/dmapp/img/daming/information_btn_play.png" />' +
    //                 '</div>' +
    //             '</div>';

    //android播放
    var video = '<div class="wait-upload-video vertical-align-middle">' +
        '<span class="delete-img">×</span>' +
        '<div class="video-control-bar" onclick="playVideoAndroid(\'' + id + '\')">' +
        '<img src="/theme/dmapp/img/daming/information_btn_play.png" />' +
        '</div>' +
        '</div>';
    $('#uploadBtn').before(video);
}

/**
 * 显示直播视频
 * @param id 视频id
 */
function showLiveVideo(id){
    layer.open({
        content: id
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
    var video = '<div class="wait-upload-video vertical-align-middle">' +
        '<div class="video-control-bar" onclick="historyVideoPlay(\'' + id + '\')">' +
        '<img src="/theme/dmapp/img/daming/information_btn_play.png" />' +
        '</div>' +
        '</div>';
    $('#uploadBtn').before(video);
}

/**
 * android放大图片
 *
 * @param id 文件id
 */
function enlargeImageAndroid(id){
    getBigImage(id);
}

/**
 * android播放视频
 *
 * @param id 文件id
 */
function playVideoAndroid(id){
    getVideo(id);
}

/**
 * 播放历史录播视频
 * @param id
 */
function historyVideoPlay(id){
    $.ajax({
        url: BASESERVLET + "/api/playVideo",
        type:"post",
        cache: false,//上传文件无需缓存
        dataType: "json",
        data: {id:id},
        success:function(data){
            if(data.status && data.code == 0){
                var roomParam = JSON.stringify(data.obj);
                try{
                    playHistoryVideo(roomParam);
                }catch(e) {
                    layer.open({
                        content: '打开直播窗口失败，请重试'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            }
        },
        error: function(data){
            console.log(data);
        }
    });
}

/**
 * 播放直播视频
 * @param id
 */
function liveVideoPlay(id){
    $.ajax({
        url: BASESERVLET + "/api/playVideo",
        type:"post",
        cache: false,//上传文件无需缓存
        dataType: "json",
        data: {id: id, flag: "true"},
        success:function(data){
            if(data.status && data.code == 0){
                var roomParam = JSON.stringify(data.obj);
                try{
                    playLiveVideo(roomParam);
                }catch(e) {
                    layer.open({
                        content: '打开直播窗口失败，请重试'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
                    });
                }
            }
        },
        error: function(data){
            console.log(data);
        }
    });
}

/**
 * 删除附件
 * @param id 附件id
 */
function delFile(id){
    var fileIds = $("#fileIds").val();
    fileIds = fileIds + ',';
    $('#img_div_' + id).remove();
    fileIds = fileIds.replace(id + ',', '');
    fileIds = fileIds.substring(0, fileIds.length - 1);
    $("#fileIds").val(fileIds);
    //判断数量显示上传按钮
    var fileIdsArr = fileIds.split(",");
    if (fileIds === '' || fileIdsArr.length < count){
        $("#uploadBtn").show();
    }
}

/**
 * 视频转换处理，视频截图
 * @param id
 */
function convertVideo(id){
    $.ajax({
        async: false,
        url: BASESERVLET + "/api/getCover",
        type:"get",
        data: {id:id},
        success:function(data){
            if(!data.status){
                layer.open({
                    content: '操作失败'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                return;
            }
            id = data.obj;
            console.log(id);
        },
        error: function(data){
            console.log(data);
        }
    });
    return id;
}