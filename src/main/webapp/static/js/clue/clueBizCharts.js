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
    $("#mountNode").html('');
    param = JSON.stringify(param);
    $.ajax({
        url: "/skynet/web/clue/getList",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: param,
        success: function (data) {
            var map = data.obj;
            console.log(map);
            showPicture(map);
        }
    });
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
function showPicture(map){
    var data = [];
    var count = 0;
    for (var v in map) {
        data.push( { name : v , value : Number(map[v])})
        count++;
    }
    if(count==0){
        alert("没有更多数据");
    }
    const dv = new DataSet.View();
    dv.source(data).transform({
        type: 'percent',
        field: 'value',
        dimension: 'name',
        as: 'percent'
    });
    const chart = new G2.Chart({
        container: 'mountNode',
        forceFit: true,
        height: window.innerHeight
    });
    chart.source(dv, {
        percent: {
            formatter: function(val){
                val = (val * 100) + '%';
                return val;
             }
}
});
    chart.coord('theta', {
        radius: 0.75
    });
    chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart.intervalStack()
        .position('percent')
        .color('name')
        .label('value', {
                formatter: function(val, item) {
                    return item.point.name + ': ' + val;
                }
})
.tooltip('name*value', function(name, value){
            value = value * 100 + '%';
            return {
                name: name,
                value: value
            };
        })
.style({
        lineWidth: 1,
        stroke: '#fff'
    });
    chart.render();
}



