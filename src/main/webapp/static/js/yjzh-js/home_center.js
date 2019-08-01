/**
 * 保存框架主页用到的javascript
 */
$(initMain);//页面加载完成调用
var dmenu; //顶部菜单按钮
var lymenu;//左侧一级菜单按钮
var lsmenu;//左侧二级菜单按钮

/**
 * 初始化main页面的javascript
 */
function initMain(){
    /**
     * jQuery 的ajax请求的默认错误处理器，处理服务器错误、断开连接等情况；
     * 如有其他需求，可在具体ajax方法中覆盖
     */
    //左侧一级菜单点击事件

    jQuery.ajaxSetup({
        cache:true,
        error:function(err,err1,err2){
            var msg;
            if(!err){
                msg = "连接服务器失败，请检查网络";
                layer ? layer.alert(msg, {icon:0}) : alert(msg);
                return;
            }
            msg = err.responseText;
            console.log("error",msg);
            //layer ? layer.alert(msg, {icon:0}) : alert(msg);
        }
    });

    $("#logoutBtn").click(function(){
        location.href = BASESERVLET+"/web/logout";
    });

    // //更新用户头像
    // var current_user_id = $('#current_user_id').val();
    // $.ajax({
    //     url:BASESERVLET+"/api/userpic/"+current_user_id,
    //     type:"get",
    //     dataType:"json",
    //     success:function(data){
    //         if(!data.status){
    //             console.log("获取用户头像失败："+data.error);
    //             return;
    //         }
    //         var icon_url = '/theme/img/jiejingtai/right-head.jpg';
    //         if(data.obj != null){
    //             var pics = data.obj;
    //             if($.trim(pics.icon)!='') {
    //                 icon_url = pics.icon;
    //             }
    //         }
    //         $('#current_user_img').val(icon_url);
    //     }
    // });

    //根据url参数判断进入哪个菜单页面
    var page = GetQueryString('page');
    if(page == 'chat') {
        mainchange('/skynet/web/infoTask/chatHtml');
    } else {
        mainchange('/skynet/web/infoTask/videoRoom');
    }
}
//获取url参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//main中主要内容显示
function mainchange(url,id){

    if(typeof(id)=="undefined" ){
        $(".left-level1-list li").eq(0).attr("class","checked-level1");
    }else{
        $(".left-level1-list li").removeClass("checked-level1");
        $(id).parent().attr("class","checked-level1");
    }
    var title = $(".checked-level1").children().find("span").text();
    $("a[name='title']").text(title);
    var layerIndex = layer.load(2);//time参数，最多等待十秒
    $.ajax({
        type:"get",
        url:url,
        dataType:"html",
        success:function(data){
            layer.close(layerIndex);
            $("#content_main").html(data);
        }
    });
}
function jblb(){
    $.ajax({
        type:"get",
        url:BASESERVLET+"/api/getcluelist/"+1,
        dataType:"json",
        success:function(data){
            var list=data.list;
            var htm = '<br/><table class="table table-hover table-bordered table-striped" style="background:#8ab5ce; white-space: nowrap;"><thead style="color: #fff;"><tr><th>类别</th><th>内容描述</th> <th>地址</th> <th>事发时间</th> <th>举报人</th> <th>状态</th> <th>操作</th></tr></thead>';
            htm+='<tbody style="background: #e7eef4;"> ';
            for(var i = 0;i<list.length;i++){
                var obj=list[i];
                var ty='';
                if(obj.type==0){
                    ty="卖淫嫖娼";
                }else if(obj.type==1){
                    ty="赌博";
                }else if(obj.type==2){
                    ty="违规养犬";
                }else if(obj.type==3){
                    ty="违法小广告";
                }else if(obj.type==4){
                    ty="精神病人违规出丑";
                }else if(obj.type==5){
                    ty="保安不按规定着装";
                }else if(obj.type==6){
                    ty="影响校园周边安全";
                }else if(obj.type==7){
                    ty="默认违规行为";
                }
                var status='';
                if(obj.status==1){
                    status="已举报";
                }else if(obj.status==2){
                    status="已处理";
                }else if(obj.status==3){
                    status="已反馈";
                }else if(obj.status==4){
                    status="已经奖励";
                }else if(obj.status==5){
                    status="已经处罚";
                }else if(obj.status==6){
                    status="已删除";
                }
                var text="";
                if(null!=obj.content) {
                    if (obj.content.length <= 10) {
                        text = obj.content;
                    } else if (obj.content.length > 10) {
                        text = obj.content.substring(0, 11);
                        text += "...";
                    }
                }
                htm+='<tr><td>'+ty+'</td><td>'+text+'</td><td>'+obj.occurAdress+'</td><td>'+obj.occurTime+'</td>';
                htm+='<td>'+obj.createName+'</td><td>'+status+'</td><td><a id="'+obj.id+'" href="javascript:;" onclick="detilClick(this.id)">详情</a></tr>';
            }
            htm+='</tbody></table>';
            $("#content_main").html(htm);
        }
    });
}
function detilClick(id){
    layer.open({
        type:2,
        title:'详情',
        shadeClose:true,
        shade:0.8,
        area:['800px','85%'],
        content:BASESERVLET+"/web/getClueInfo/"+id
    })
}
