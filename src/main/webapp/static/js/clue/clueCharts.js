/**线索饼状图js*/
$(function () {
    initGroup();
});

/**初始化单位*/
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
            var clue_unit = $("#clue_unit");//辖区单位
            var dw;
            //添加所属单位，并收集派出所，警务室
            for (var i = 0; i < list.length; i++) {
                dw = list[i];
                clue_unit.append('<option value="' + dw.areaCode + '">' + dw.name + '</option>');
            }
        }
    });
}

/**获取最后一天*/
function getLastDay(year,month)
{
    var new_year = year;  //取当前的年份
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
    if(month>12)      //如果当前大于12月，则年份转到下一年
    {
        new_month -=12;    //月份减
        new_year++;      //年份增
    }
    var new_date = new Date(new_year,new_month,1);        //取当年当月中的第一天
    return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
}

/**根据条件查询*/
function checkCLueBiz() {
    var param={};
    var time = $("#clue_time").val();
    var code=$("#clue_unit").val();
    if(code){
        param.areaCode=code;
    }
    if(time){
        var month=time.slice(5);
        var year=time.slice(0,4);
        var lastDay = getLastDay(year,month);
        var startTime=year+"-"+month+"-"+"01";
        var endTime=year+"-"+month+"-"+lastDay;
        if (startTime) {
            param.startDate = startTime + " 00:00:00.000";
        }
        if (endTime) {
            param.endDate = endTime + " 23:59:59.000";
        }
    }else{
        var now = new Date();
        var month= now.getMonth();
        var currentMonthFirst = getCurrentMonthFirst();
        var currentMonthLast = getCurrentMonthLast();
        if (startTime) {
            param.startDate = currentMonthFirst + " 00:00:00.000";
        }
        if (endTime) {
            param.endDate = currentMonthLast + " 23:59:59.000";
        }
    }

    var indexOfLayer = layer.load(2, {time: 100});
    $("#mountNode").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: "/skynet/web/clue/getList",
        type: "post",
        contentType: "application/json",
        dataType: "html",
        data: param,
        success: function (data) {
            layer.close(indexOfLayer);
            $("#mountNode").html(data);
        }
    });
    showBiz();

}
/**获取当前月的第一天*/

function getCurrentMonthFirst(){
    var date=new Date();
    date.setDate(1);
    return date;
}
/**获取当前月的最后一天*/
function getCurrentMonthLast(){
    var date=new Date();
    var currentMonth=date.getMonth();
    var nextMonth=++currentMonth;
    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
    var oneDay=1000*60*60*24;
    return new Date(nextMonthFirstDay-oneDay);
}
/**画图*/
function showBiz() {
    var data = [
        {name: '赌博', value: 56.33 },
        {name: 'Chrome', value: 24.03},
        {name: 'Firefox', value: 10.38},
        {name: 'Safari',  value: 4.77},
        {name: 'Opera', value: 0.91},
        {name: 'Proprietary or Undetectable', value: 0.2}
    ];
    var Stat = G2.Stat;
    var chart = new G2.Chart({
        id: 'mountNode',
        forceFit: true,
        height: 450
    });
    chart.source(data);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    chart.coord('theta', {
        radius: 0.8 // 设置饼图的大小
    });
    chart.legend('name', {
        position: 'bottom',
        itemWrap: true,
        formatter: function(val) {
            for(var i = 0, len = data.length; i < len; i++) {
                var obj = data[i];
                if (obj.name === val) {
                    return val + ': ' + obj.value + '%';
                }
            }
        }
    });
    chart.tooltip({
        title: null,
        map: {
            value: 'value'
        }
    });
    chart.intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent',function(name, percent){
            percent = (percent * 100).toFixed(2) + '%';
            return name + ' ' + percent;
        });
    chart.render();
    // 设置默认选中
    var geom = chart.getGeoms()[0]; // 获取所有的图形
    var items = geom.getData(); // 获取图形对应的数据
    geom.setSelected(items[1]); // 设置选中
}



