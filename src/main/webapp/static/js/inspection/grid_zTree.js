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
        selectMulti: false,//表示禁止多选
        dblClickExpand: false//屏蔽掉双击事件
    },
    callback: {
        onClick: onShow
    }
};
$(document).ready(function () {
    initTree();
});
function initTree() {
    var treeData = [];
    var gridType = $("#gridType").val();
    if (null == gridType) {
        gridType == 0;
    }
    $.ajax({
        url: BASESERVLET + "/web/company/list",
        type: "get",
        data: "gridType=" + gridType,
        contentType: "application/json",
        success: function (data) {
            if (data.list && data.list.length > 0) {
                for (var i = 0; i < data.list.length; i++) {
                    treeData.push(data.list[i]);
                }
            }
            $.fn.zTree.init($("#gridTree"), setting, treeData);
        }
    });
}
var flag=false;
function searchNodes() {
    var key = $("#nodeKey").val();
    console.log(key + "::::::::::key");
    var zTreeObj = $.fn.zTree.getZTreeObj("gridTree");
    console.log(key+"key");
    if(key){
        if(flag){
            initTree();
        }
        var nodeList = zTreeObj.getNodesByParamFuzzy("name", key);
        console.log(nodeList + "::::::::::resultNodes");
        // for( var i=0, l=nodeList.length; i<l; i++) {
        // zTreeObj.updateNode(nodeList[i]);
        // }
        flag=true;
        $.fn.zTree.init($("#gridTree"), setting, nodeList);
    }else{
        flag=false;
        initTree();
    }
}

function onShow(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("gridTree");
    var nodes = treeObj.getCheckedNodes(true);
    console.log(treeNode);
    //选中
    // console.log("单位id:" + treeNode.id);
    // console.log("单位名字：" + treeNode.name);
    // console.log("级别：" + treeNode.level);
    $("#nodeId").val(treeNode.id);
    $("#nodeName").val(treeNode.name);
    $("#nodeLevel").val(treeNode.level);
    if(treeNode.pId == null || treeNode.pId == undefined){
        var zTree = $.fn.zTree.getZTreeObj("gridTree");
        zTree.expandAll(treeNode);
    }else{
        showGrid(treeNode);
    }
}

function showGrid(treeNode) {
    var gridType = $("#gridType").val();

    $("#companyId").html(treeNode.id);
    var tabHtml = '<tr>';
    console.log(treeNode.level);
    if (treeNode.level === 0) {
        tabHtml += '<td>区县</td>';
    }
    if (treeNode.level === 1) {
        tabHtml += '<td>大网格</td>';
    }
    if (treeNode.level === 2) {
        tabHtml += '<td>中网格</td>';
    }
    if (treeNode.level === 3) {
        tabHtml += '<td>小网格</td>';
    }
    tabHtml += "<td>" + treeNode.name + "</td>" +
        "<td>" + treeNode.userName + "</td>" +
        "<td>" + treeNode.tel + "</td>";

    tabHtml += "<td>";
    if (1 == treeNode.level || 2 == treeNode.level) {
        if (0 == treeNode.gridType) {
            tabHtml += "<a href='javascript:void(0);' style='text-decoration:none' onclick='scopeOfPainting(\"" + treeNode.id + "\",\"1\")'><button class='caozuo-button2'>范围</button> </a>";
        }
    }
    if (2 == treeNode.level || 3 == treeNode.level) {
        tabHtml += "<a href='javascript:void(0);' style='text-decoration:none' onclick='scopeOfPainting(\"" + treeNode.id + "\",\"2\")'><button class='caozuo-button2'>定位</button> </a>";
    }

    tabHtml += "<a href='javascript:void(0);' style='text-decoration:none' onclick='unitDetail(\"" + treeNode.id + "\")'><button class='caozuo-button2'>详情</button> </a>";
    //全部数据不现实编辑按钮
    if (gridType !== '100'){
        tabHtml += "<a href='javascript:void(0);'style='text-decoration:none' onclick='updateUnit(\"" + treeNode.id + "\")'><button class='caozuo-button5'>编辑</button></a>";
    }
    tabHtml += "</td></tr>";

    $("#gridTable").html(tabHtml);
}

function unitDetail(companyId) {
    layer.open({
        type: 2,
        title: "单位人员列表",
        shadeClose: true,
        closeBtn: 1,
        shade: 0.3,
        area: ['1000px', '600px'],
        content: "/skynet/web/unit/detail?companyId=" + companyId
    });
}

function updateUnit(companyId) {
    layer.open({
        type: 2,
        title: "编辑",
        shadeClose: true,
        closeBtn: 1,
        shade: 0.3,
        area: ['600px', '700px'],
        content: "/skynet/web/unit/update?companyId=" + companyId
    });
}
