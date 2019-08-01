$(document).ready(function () {

    //监听页面滚动效果
    $(".max-box").addClass("hidden-scrollbar");
    scroll_hidden($(".max-box"));
    scroll_hidden($(".unlocking-list"));
    scroll_hidden($(".order-for-arrest-box"));

    //当视频播放完毕后自动切换按钮样式
    $(".video-box video").bind("ended", function () {
        $(this).parent().children(".video-control-bar").css("display", "block");
    });

    //当视频播放完毕后的样式
    $(".video-box video").bind("ended", function () {
        $(this).parent().children(".dirving-living-control").css("display", "block").attr("data-num", "0");
        $(this).parent().children(".dirving-living-control").children("img").attr("src", "../../../img/daming/information_btn_play.png");
        $(this).parent().children(".dirving-living-control").children(".progress-bar-box").css("display", "none");
    });

    //给单选列表添加点击事件
    radio_click($(".radio-options-list"));
    //给多选列表添加点击事件
    checkbox_click($(".checkbox-options-list"));

});

//开锁服务tab标签切换功能
function tab_switchover(obj) {
    var click_index = $(obj).index();
    $(obj).parent().children("li").removeClass("checked-tab");
    $(obj).addClass("checked-tab");
    $(".unlocking-tab-content").css("display", "none");
    $(".unlocking-tab-content").eq(click_index).css("display", "block");
    loadrefresh();
}

//开锁服务列表页面的tab切换功能
function tab_service_tab(obj) {
    var click_index = $(obj).index();
    $(obj).parent().children("li").removeClass("checked-tab");
    $(obj).addClass("checked-tab");
    $(".service-list-box").css("display", "none");
    $(".service-list-box").eq(click_index).css("display", "block");
    loadrefresh();
}

//星星评分样式展示
function grade_star(obj, score) {
    var remainder = score % 1;
    var full_star = score - remainder;
    var percent = remainder * 100;

    for (var i = 0; i < $(obj).children("li").length; i++) {

        if (i < full_star) {

            $(obj).children("li").eq(i).children(".star-bg").css("width", "100%");

        } else if (i == full_star) {
            $(obj).children("li").eq(i).children(".star-bg").css("width", percent + "%");
        } else {

            $(obj).children("li").eq(i).children(".star-bg").css("width", 0);
        }
    }
}

//隐藏滚动条事件
function scroll_hidden(obj) {

    $(obj).scroll(function () {

        $(obj).removeClass("hidden-scrollbar");

        setTimeout(function () {
            $(obj).addClass("hidden-scrollbar");
        }, 1000);

    });
}

//开始播放视频事件
function play_video(obj) {
    $(".video-box video").trigger("pause");
    $(".wait-upload-video video").trigger("pause");
    $(".video-control-bar").css("display", "block");
    $(obj).parent().children("video").trigger("play");
    $(obj).css("display", "none");
}

//停止播放视频事件
function stop_video(obj) {
    $(obj).trigger("pause");
    $(obj).parent().children(".video-control-bar").css("display", "block");
}

//点击星星进行评分
function click_star(obj) {
    $(".star-list-box li").css("background-color", "#e4e4e4");
    var index = $(obj).index() + 1;
    for (var i = 0; i < index; i++) {
        $(".star-list-box li").eq(i).css("background-color", "#faba67");
    }

    $(".star-count").text(index + "星");
}

//删除订单事件
function delete_order() {
    layer.open({
        title: '删除订单',
        content: '您确定要删除该订单吗？',
        btn: ['删除', '取消'],
        yes: function (index) {
            location.reload();
            layer.close(index);
        }
    });
    $(".layui-m-layercont").css({
        "padding": " 10px 30px 40px 30px"
    });

    $(".layui-m-layerbtn").css("background-color", "#fff");
}

//创建服务单事件
function create_service_list() {
    layer.open({
        title: '视频录制',
        content: '是否立即录制开锁视频？',
        btn: ['立即录制', '稍后再录'],
        yes: function (index) {
            location.reload();
            layer.close(index);
        }
    });
    $(".layui-m-layercont").css({
        "padding": " 10px 30px 40px 30px"
    });

    $(".layui-m-layerbtn").css("background-color", "#fff");
}

//完成开锁点击事件
function supplement_transcribe() {
    layer.open({
        title: '补录照片',
        content: '是否需要补录住户身份照片？',
        btn: ['立即补录', '无须补录'],
        yes: function (index) {
            location.reload();
            layer.close(index);
        }
    });
    $(".layui-m-layercont").css({
        "padding": " 10px 30px 40px 30px"
    });

    $(".layui-m-layerbtn").css("background-color", "#fff");
}

//页面底部弹出下拉框
function select_bottom() {
    var html = '<ul class="select-list">';
    html += '<li onclick="selected(this)">普通房门</li>';
    html += '<li onclick="selected(this)">防盗门</li>';
    html += '<li onclick="selected(this)">车门锁</li></ul>';
    layer.open({
        type: 1,
        shade: 'background-color: rgba(0,0,0,.3)',
        content: html,
        anim: 'up',
        style: 'position:fixed; bottom:0; left:0; width: 100%; max-height: 9rem; padding: 0.1rem 0; border:none;'
    });

    var text_str = $(".text-align-right").children("span").text();
    $(".select-list li").each(function () {
        if ($(this).text() == text_str) {
            $(this).addClass("selected");
        }
    });
}

//选择事件
function selected(obj) {
    var text_str = $(obj).text();
    $(obj).addClass("selected");
    layer.closeAll();
    $(".text-align-right").children("span").text(text_str);
}

var timer_2seconds;

//查酒驾直播事件
function driving_vedio(obj) {
    //获取当前点击的样式
    var data_num = $(obj).attr("data-num");
    if (data_num == 0) {
        //遍历所以的视频
        $(".dirving-living-control").each(function () {
            if ($(this).attr("data-num") == 1) {
                $(this).attr("data-num", "0");
                $(this).css("display", "block");
                $(this).children(".progress-bar-box").css("display", "block");
                $(this).children(".living-video-icon").attr("src", "../../../img/daming/information_btn_play.png");
            }
        });

        $(".video-box").children("video").trigger("pause");
        //播放视频
        $(obj).parent().children("video").trigger("play");
        //遮罩层隐藏
        $(obj).css("display", "none");
        $(obj).attr("data-num", "1");
        //修改遮罩层面上的样式
        $(obj).children(".living-video-icon").attr("src", "../../../img/daming/stop-video.png");
    } else {
        //清除计时器
        clearTimeout(timer_2seconds);
        $(obj).parent().children("video").trigger("pause");
        $(obj).children(".living-video-icon").attr("src", "../../../img/daming/information_btn_play.png");
        $(obj).attr("data-num", "0");
    }
}

//设置视频时长事件
function vedio_control_show(obj) {
    //获取当前视频的总时长
    var second = parseInt($(obj)[0].duration) % 60;
    var minutes = (parseInt($(obj)[0].duration) - second) / 60;
    var all_time;
    if (minutes < 10) {
        if (second < 10) {
            all_time = "0" + minutes + ":" + "0" + second;
        } else {
            all_time = "0" + minutes + ":" + second;
        }
    } else {

        if (second < 10) {
            all_time = minutes + ":" + "0" + second;
        } else {
            all_time = minutes + ":" + second;
        }
    }

    //获取当前视频的播放时长
    obj.ontimeupdate = function () {
        var current_S = parseInt(obj.currentTime) % 60;
        var current_M = (parseInt(obj.currentTime) - current_S) / 60;
        var current_time;

        if (current_M < 10) {
            if (current_S < 10) {
                current_time = "0" + current_M + ":" + "0" + current_S;
            } else {
                current_time = "0" + current_M + ":" + current_S;
            }
        } else {

            if (current_S < 10) {
                current_time = current_M + ":" + "0" + current_S;
            } else {
                current_time = current_M + ":" + current_S;
            }
        }
        $(obj).parent().find(".past-time").text(current_time);

        //计算进度条的长度
        var percentage = parseInt(obj.currentTime) / parseInt($(obj)[0].duration);
        var current_W = percentage * 3.49;
        $(obj).parent().find(".current-bar").css("width", current_W + "rem");
    }

    $(obj).parent().children(".dirving-living-control").css("display", "block");
    $(obj).parent().find(".progress-bar-box").css("display", "block");
    $(obj).parent().find(".all-time").text(all_time);
    if ($(obj).parent().children(".dirving-living-control").attr("data-num") == 1) {
        timer_2seconds = setTimeout(function () {
            $(obj).parent().children(".dirving-living-control").css("display", "none");
        }, 2000);
    } else {
        return;
    }

}

//点击视频全屏事件
function full_screen(ev, obj) {
    ev.stopPropagation();
    $(obj).parents(".video-box").children("video").requestFullscreen();
}

//看直播点赞
function give_a_like(obj) {
    $(obj).toggleClass("color-blue");
    $(obj).children("i").toggleClass("color-blue");
}

//监听输入框中是否输入内容
function on_input(event) {
    if ($(".chatting-input").val() == "") {
        $(".give-a-like").css("display", "inline-block");
        $(".send-chatting-btn").css("display", "none");
    } else {
        $(".give-a-like").css("display", "none");
        $(".send-chatting-btn").css("display", "inline-block");
    }
}

//判断字符串不为空或者不全是空格
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

//点击发送评论
function send_chatting() {
    var sendstr = $(".chatting-input").val();

    if (sendstr.replaceAll(" ", "").length == 0 || $(".chatting-input").val().replaceAll(/[\r\n]/g, "").length == 0) {
        layer.open({
            style: 'bottom:0; color:#fff;',
            content: '发送内容不能为空',
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        $(".layui-m-layercont").css("color", "#fff");
    } else {
        var html = '<li class="clear"><img class="audience-head-img" src="../../../img/daming/user-bg.png"/>';
        html += '<div class="audience-chatting-content">';
        html += '<p><span class="color-gray-666">180****1253</span><span class="public-chatting-time">18:30</span></p>';
        html += '<div class="chatting-content-box">' + sendstr + '</div></div></li>';

        $(".chatting-list").append(html);
        $(".watching-and-chatting-box").scrollTop($(".watching-and-chatting-box")[0].scrollHeight);
        $(".chatting-input").val("");
        $(".give-a-like").css("display", "inline-block");
        $(".send-chatting-btn").css("display", "none");
    }
}

//点击回车按钮发送消息
function enter_send(event, obj) {

    var isFocus = $(obj).is(":focus");

    if (isFocus == true) {
        if (event.keyCode == 13 && event.shiftKey) {
            var sendstr = $(obj).val();
            // 这里实现换行
            sendstr += "\n";
            $(obj).val(sendstr);

        } else if (event.keyCode == 13) {
            event.preventDefault();
            send_chatting();
        }
    }
}

//滚动时加载更多内容的样式
function living_chatting_scroll(obj) {
    var scroll_top = $(obj).scrollTop();

    if (scroll_top < 5) {
        var html = '<li class="clear"><img class="audience-head-img" src="../../../img/daming/user-bg.png"/>';
        html += '<div class="audience-chatting-content">';
        html += '<p><span class="color-gray-666">180****1253</span><span class="public-chatting-time">18:30</span></p>';
        html += '<div class="chatting-content-box">我是加载出来的内容，你看的到吗？</div></div></li>';
        $(obj).find(".chatting-list").prepend(html);
    }
}

//点击添加照片下拉框
function add_media_file() {
    var html = '<ul class="add-media-list">';
    html += '<li onclick="add_media_click(this)">拍照</li>';
    html += '<li onclick="add_media_click(this)">相册</li>';
    html += '<li onclick="add_media_click(this)">视频</li>';
    html += '<li class="border-width-0 color-gray-999" onclick="add_media_click(this)">取消</li></ul>';
    layer.open({
        type: 1,
        shade: 'background-color: rgba(0,0,0,.5)',
        content: html,
        anim: 'up',
        style: 'position:fixed; bottom:0; left:0; width: 100%; height: 3.6rem; padding:0.1rem 0; border:none;'
    });
}

//选择媒体进口
function add_media_click(obj) {
    var obj_index = $(obj).index();
    if (obj_index == 0) {
        alert("打开相机");
    } else if (obj_index == 1) {
        alert("打开相册");
    } else if (obj_index == 2) {
        alert("打开摄像机");
    } else if (obj_index == 3) {
        layer.closeAll();
    }
}

//单选项点击事件
function radio_click(obj) {
    $(obj).children("li").click(function () {
        $(this).parent().find(".radio-box").removeClass("radio-cheched");
        $(this).find(".radio-box").addClass("radio-cheched");
    });
}

//多选项点击事件
function checkbox_click(obj) {
    $(obj).children("li").click(function () {
        $(this).find(".check-box").toggleClass("checkbox-cheched");
    });
}

//提交问卷事件
function submit_questionnaire(voteId,areaCode) {
    layer.open({
        content: '您确定提交改问卷吗？',
        btn: ['确定提交', '考虑一下'],
        yes: function (index) {
            var optionIdList = [];
            $(".checkbox-cheched").each(function (index, element) {
                optionIdList.push($(element).attr("class").split(" ")[0])
            });
            $(".radio-cheched").each(function (index, element) {
                optionIdList.push($(element).attr("class").split(" ")[0])
            });
            $.ajax({
                url: "/skynet/api/voteCon/save",
                type: "POST",
                dataType: "json",
                data: {
                    "optionIdList": optionIdList,
                    "voteId": voteId
                },
                success: function (data) {
                }
            });
            window.location.href = '/skynet/api/vote/submitQuestionnaireSuccess?voteId=' + voteId+"&areaCode="+areaCode;
        }
    });
}

'use strict';

//创建饼状图样式
function creat_chart_pie(objId, item, count1,data,headCount) {
    var _DataSet = DataSet,
        DataView = _DataSet.DataView;

    var dv = new DataView();
    dv.source(data).transform({
        type: 'percent',
        field: count1,
        dimension: item,
        as: 'percent'
    });
    var chart = new G2.Chart({
        id: objId,
        forceFit: true,
        height: 340,
        animate: true
    });
    chart.source(dv, {
        percent: {
            formatter: function formatter(val) {
                var temp=val * 100;
                val=temp.toFixed(2);
                val =  val+ '%';
                return val;
            }
        }
    });
    chart.coord('theta', {
        radius: 0.8,
        innerRadius: 0.6
    });
    chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    // 辅助文本
    chart.guide().html({
        position: ['50%', '50%'],
        html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">答题人数<br><span style="color:#8c8c8c;font-size:20px">'+headCount+'</span> 人</div>',
        alignX: 'middle',
        alignY: 'middle'
    });
    var interval = chart.intervalStack().position('percent').color(item).label('percent', {
        offset: 10,
        formatter: function formatter(val, item) {
            return item.point.item + ': ' + val;
        },
        textStyle: {
            fontSize: '14' // 文本大小
            //						textAlign: 'center', // 文本对齐方式
        }
    }).tooltip(item + '*percent', function (item, percent) {
        percent = percent * 100 + '%';
        return {
            name: item,
            value: percent
        };
    }).style({
        lineWidth: 1,
        stroke: '#fff'
    });
    chart.legend({
        position: 'bottom',
        offsetY: -20
    });
    chart.render();
    interval.setSelected(dv.rows[0]);
}

//投票点击事件
function voting_cell(obj, itemId) {
    var voting_num = $(obj).parents(".voting-list-box").attr("data-num");
    if (voting_num == 0) {
        layer.open({
            content: '您确定提交投票结果吗？',
            btn: ['投票', '取消'],
            yes: function (index) {
                $.ajax({
                    url: "/skynet/api/voteCon/save",
                    type: "POST",
                    dataType: "json",
                    data: {
                        "itemId": itemId
                    },
                    success: function (data) {
                        layer.msg("投票成功");
                    }
                });
                // location.reload();
                layer.close(index);
                $(obj).css("background-color", "#a8a8a8");
                var voting_num = $(obj).parent().find(".voting-num").text();
                voting_num++;
                $(obj).parent().find(".voting-num").text(voting_num++);
                $(obj).parents(".voting-list-box").attr("data-num", "1");
            }
        });
    } else if (voting_num == 1) {
        layer.msg("您已经投过票了");
        $(".layui-m-layercont").css("color", "#fff");
    }
}


//投票表格统计事件
function creat_chart_bar(objId, towns, countNum, data) {
    // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
    var ds = new DataSet();
    var dv = ds.createView().source(data);
    dv.source(data).transform({
        type: 'sort',
        callback: function callback(a, b) {
            // 排序依据，和原生js的排序callback一致
            return a.population - b.population;
        }
    });
    // Step 1: 创建 Chart 对象
    var chart = new G2.Chart({
        id: objId, // 指定图表容器 ID
        forceFit: true, //图表宽度自适应。此时，不需要设置 width 属性，即使设置了也不会生效。
        height: 300 // 指定图表高度
    });
    // Step 2: 载入数据源
    chart.source(dv);
    chart.axis(towns, {
        label: {
            offset: 12,
            textStyle: {
                fontSize: '14', // 文本大小
                textAlign: 'right', // 文本对齐方式
                fill: '#999' // 文本颜色
            }
        },
        line: {
            stroke: '#999'
        }
    });

    chart.axis(countNum, {
        label: {
            offset: 12,
            textStyle: {
                fontSize: '12', // 文本大小
                textAlign: 'center', // 文本对齐方式
                fill: '#999' // 文本颜色
            }
        },

        line: {
            stroke: '#999'
        }
    });
    chart.coord().transpose();
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.interval().position(towns + '*' + countNum).label(countNum, {
        offset: -10,
        textStyle: {
            fontSize: '14', // 文本大小
            textAlign: 'right' // 文本对齐方式
        }
    }).color('#eb7a7a');
    // Step 4: 渲染图表
    chart.render();
}

//取消寻人事件
function cancel_find_person() {
    layer.open({
        title: '取消寻人信息',
        content: '您要取消该寻人信息吗？',
        btn: ['取消', '不取消'],
        yes: function (index) {
            location.reload();
            layer.close(index);
        }
    });
    $(".layui-m-layercont").css({
        "padding": " 10px 30px 40px 30px"
    });

    $(".layui-m-layerbtn").css("background-color", "#fff");
}

//自定义单选按钮样式
function my_radio(obj) {
    var my_radio_box = $(obj).parent();
    my_radio_box.find(".my-radio").removeClass("my-radio-checked");
    $(obj).find(".my-radio").addClass("my-radio-checked");
}

