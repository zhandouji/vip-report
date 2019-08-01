//平台标志符
var isAndroid = false;
var isIOS = false;

/**
 * 平台判断
 */
function crossPlatformApproach() {
    try { //平台判断
        var u = navigator.userAgent;
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    } catch (e) {
        console.log("平台判断失败");
        console.log(e);
    }
}

/**
 * 设置导航条的中间位置的标题
 * @param name
 */
function setTopBarTitle(name) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.setTopBarTitle(name);
        } else if (isIOS) {
            window.webkit.messageHandlers.setTopBarTitle.postMessage(name);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 设置导航条的右上角按钮
 * @param name 按钮名称
 * @param actionName js方法名称
 */
function setTopBarActionName(name, actionName) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.setTopBarActionName(name, actionName);
        } else if (isIOS) {
            var message={'buttonName':name,'actionName':actionName};
            window.webkit.messageHandlers.setTopBarActionName.postMessage(message);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 打开摄像头执行扫描二维码
 * @param type-类型，目前这里传递的是1
 * @param actionName-js方法名称
 */
function showQRCodeActivity(type, actionName) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.showQRCodeActivity(type, actionName);
        } else if (isIOS) {
            var message={"type":type,"actionName":actionName};
            window.webkit.messageHandlers.showQRCodeActivity.postMessage(message);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 拉起直播界面（janus）
 * @param roomParam-json字符串，参照报警返回的参数
 */
function startLiveVideo(roomParam) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.startLiveVideo(roomParam);
        } else if (isIOS) {
            window.webkit.messageHandlers.startLiveVideo.postMessage(roomParam);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 播放直播录制的视频（janus）
 * @param roomParam
 */
function playHistoryVideo(roomParam) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.playLiveVideo(roomParam);
        } else if (isIOS) {
            window.webkit.messageHandlers.playLiveVideo.postMessage(roomParam);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 播放直播视频
 * @param roomParam
 */
function playLiveVideo(roomParam){
    //平台判断
    crossPlatformApproach();
    //调用对应平台方法
    if (isAndroid) {
        window.android.joinLiveVideo(roomParam);
    } else if (isIOS) {
        window.webkit.messageHandlers.joinLiveVideo.postMessage(roomParam);
    }
}

/**
 * 上传文件,上传成功后，回调showFile方法
 * @param type:all,image,video（文件媒体类型）
 * @param choice:0 全部 1 本地选择 2 调起相机拍摄
 * @param fileType：上传文件类型(决定文件存储对应文件夹)
 */
function showImageOrVideoDialog(type, choice, fileType) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.showImageOrVideoDialog(type, choice, fileType);
        } else if (isIOS) {
            var message={"type":type,"choice":choice,"fileType":fileType};
            window.webkit.messageHandlers.showImageOrVideoDialog.postMessage(message);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 放大图片
 * @param id
 */
function getBigImage(id) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.getBigImage(id);
        } else if (isIOS) {
            window.webkit.messageHandlers.getBigImage.postMessage(id);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 播放视频
 * @param id
 */
function getVideo(id) {
    try {
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            window.android.getVideo(id);
        } else if (isIOS) {
            window.webkit.messageHandlers.getVideo.postMessage(id);
        }
    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}

/**
 * 该方法是通过调用安卓/ios提供的方法，接收其方法的返回值，解析，并将定位的位置反显到页面上
 * 安卓端是返回一个字符串，然后js主动调用解析该字符串的方法
 * iso端，是传入一个js方法名，作为一个回调方法，等待ios端调用
 * @param roomParam
 */
function setPosition() {
    try {
        var result = "";
        //平台判断
        crossPlatformApproach();
        //调用对应平台方法
        if (isAndroid) {
            result = window.android.sendLocationInfo();
            setPositionMsg(result);
        } else if (isIOS) {
            var message={"actionName":"setPositionMsg"};
             window.webkit.messageHandlers.sendLocationInfo.postMessage(message);
        }

    } catch (e) {
        if (isAndroid) {
            console.log("调用安卓失败");
            console.log(e);
        } else if (isIOS) {
            console.log("调用ios失败");
            console.log(e);
        }
    }
}