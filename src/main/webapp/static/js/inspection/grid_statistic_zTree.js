var setting = {
    treeId: "",
    treeObj: null,
    data: {//表示tree的数据格式
        simpleData: {
            enable: true,//表示使用简单数据模式
            idKey: "id",//设置之后id为在简单数据模式中的父子节点关联的桥梁
            pidKey: "pId",//设置之后pid为在简单数据模式中的父子节点关联的桥梁和id互相对应
            rootId: "null"//pid为null的表示根节点
        }
    },
    view: {//表示tree的显示状态
        selectMulti: false//表示禁止多选
    },
    callback: {
        onClick: onShow
    }
};
$(document).ready(function () {
    //获得消防的所有网格信息
    $.ajax({
        url: BASESERVLET + "/web/company/list",
        type: "get",
        contentType: "application/json",
        data:"gridType="+0,
        success: function (data) {
            initTree(data);
        }
    });
});

function initTree(data) {
    var treeData = [];
    if (data.list && data.list.length > 0) {
        for (var i = 0; i < data.list.length; i++) {
            treeData.push(data.list[i]);
        }
    }
    var zTreeObj = $.fn.zTree.init($("#gridTree"), setting, treeData);
}

function onShow(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("gridTree");
    var nodes = treeObj.getCheckedNodes(true);
    console.log(treeNode);
    //选中
    console.log("单位id:" + treeNode.id);
    console.log("单位名字：" + treeNode.name);
    showStatistics(treeNode, treeNode.pId, treeNode.id, treeNode.name);
}

function showStatistics(treeNode, pId, id, name) {
    var companyId = id;
    if(treeNode.pId==null){
        getList("");
        companyId = "";
    }else {
        $("#companyId").html(id);
    }
    //对图表进行重新记载
    $.ajax({
        type:"get",
        url:"/skynet/web/company/statistics/byCompany?companyId="+companyId,
        contentType:"application/x-www-form-urlencoded",
        dataType:"json",
        success:function(data){
            if(null != data.list){
                var bigCount = data.list[0];
                var midCount = data.list[1];
                var minCount = data.list[2];
                addArray(bigCount, midCount, minCount);
            }
        }
    });

    //var pageSize = 10;//每页查询数量
    var param = {};
    param.start = 1;//(targetPageNumber-1)*pageSize+1;//计算start序号
    param.rows = 5;
    var level = 0;
    var unitId = companyId;
    if (unitId) {
        param.unitId = unitId;
    }
    if (level) {
        param.reseauLevel= level;
    }
    $.ajax({
        type:"post",
        url:"/skynet/web/company/byChart",
        contentType: "application/json",
        dataType: "html",
        data:JSON.stringify(param),
        success:function(data){
            $("#gridTable").html(data);
        }
    });
}
