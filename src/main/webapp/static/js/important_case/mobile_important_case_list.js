
/**
 * 重大案件列表
 * @param type 1下拉刷新 2上拉加载
 * @param
 */
var commentPageStart = 1; //分页页数
var dataSign = true; //是否有数据标识位，为true代表还有数据可以加载，为false时 代表没有数据再可以加载了。
function queryData(type){
    if(!areaCode){
        areaCode = '';
    }
    //如果type为1 表示为下拉刷新当前页面，则重置pageStart和dataSign 标志位
    if(type === 1){
        dataSign = true;
        commentPageStart = 1;
    }

    //如果type为2 则为下拉加载新数据，然后判断数据标识位为false 是代表没有数据可以加载了
    if(type === 2 && !dataSign){
        loadrefresh();
        $("#pullUpTip").html("没有更多数据");
        return;
    }

    $.ajax({
        type: "get",
        url: "/skynet/api/importantCase/list?start=" + commentPageStart + "&areaCode=" + areaCode,
        dataType: "json",
        contentType: "application/json",
        success:function(data){
            if(!data.status){
                var html = '<img class="message-null" src="/theme/img/deadbeat/NoData.png" />';
                $("#wrapper").html(html);
                return;
            }
            if (type === 1){
                $(".safety-warning-list").html("");
            }
            //改变当前页数
            commentPageStart = data.obj.start + 1;
            //判断是否有数据返回'
            if (data.list !== null && data.list.length > 0 && dataSign){
                for(var index in data.list){
                    var value = data.list[index];
                    if(!value.unitName){
                        value.unitName = "未知";
                    }
                  var dateStr = new Date(value.createTime.replace(/-/g,'/')).format("yyyy-MM-dd hh:mm");
                    var html = "<li>" +
                        "<a onclick='detail(\""+value.id+"\" , \"" + value.areaCode+"\" );'>" +
                        "<div class='safety-warning-title'>" +value.title + "</div>" +
                        "<div class='safety-warning-note clear'><span class='float-left'>"+value.unitName+"</span><span class='float-right'>"+ dateStr +"</span>" +
                        "</div>" +
                        "</a>" +
                        "</li>";
                    $(".safety-warning-list").append(html);
                }
                /*
                 * 判断是否还有更多数据
                 * 1.返回数据数量<页面应返回数量
                 * 2.如果数据正好两页，那么查询第三页数据的时候就会返回第二页的数据，所以要加的二个判断条件
                 */

                if ((data.list.length < data.obj.rows) || (data.list.length === data.obj.rows && data.obj.start === data.obj.totalPage)){
                    dataSign = false;
                    $("#pullUpTip").html("没有更多数据");
                }
            }else{
                dataSign = false;
                var html = '<img class="message-null" src="/theme/img/deadbeat/NoData.png" />';
                $("#wrapper").html(html);
            }

            if (data.obj.totalRow <= 0){

            }
            loadrefresh();
        }
    });
}

/**
 * 查看详情
 * @param id
 * @param areaCode
 */
function detail(id, areaCode){
    window.location.href = window.location.origin +"/skynet/api/importantCase/turnToDetailForAPI?id=" + id + "&areaCode=" + areaCode;

}