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
    $.ajax({
        url: BASESERVLET + "/web/unitCheck/getUnit",
        type: "get",
        contentType: "application/json",
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
    var zTreeObj = $.fn.zTree.init($("#unitTree"), setting, treeData);
}

function onShow(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("unitTree");
    var nodes = treeObj.getCheckedNodes(true);
    console.log(treeNode);
    //选中
    console.log("单位id:" + treeNode.id);
    console.log("单位名字：" + treeNode.name);
    addUserChoice(treeNode, treeNode.pId, treeNode.id, treeNode.name);
    clickUnitId = treeNode.id;
}

function addUserChoice(treeNode, pId, id, name) {
    $("#groupChoice").empty();
    //单位拼接
    var groupChoice = $("#groupChoice").html();
    var idList = new Array();
    //获取现在已经被选中的单位
    if ($("#groupChoice").children("div").length >= 1) {
        for (var i = 0; i < $("#groupChoice").children("div").length; i++) {
            idList.push($("#groupChoice").children("div").eq(i).attr("id"));
        }
    }
    //获取单位类型的选择情况
    var girdType = new Array();
    var taskCellArray = $(".checked-task-name-box").find(".task-radio");
    for(var index = 0 ; index < taskCellArray.length; index++){
        if ($(".checked-task-name-box").find(".task-radio").eq(index).attr("class")=="task-radio task-radio-checked"){
            girdType.push($(".checked-task-name-box").find(".task-radio").eq(index).attr("status"));
        }
    }
    //判断哪个节点被选中
   if(treeNode.pId == null){
       //根节点
       var bigGrid = treeNode.children;
       //子节点是否存在
       if (bigGrid) {
           //"大网格"是否选中
           if($.inArray("1", girdType) != -1){
               for (var i = 0; i < bigGrid.length; i++) {
                   if ($.inArray(bigGrid[i].id, idList) == -1) {
                       groupChoice += '<div class="name-cell" id="' + bigGrid[i].id + '"><div class="remove-checked">×</div><span>' + bigGrid[i].name + '</span></div>';
                   }
               }
           }
           //"中网格"是否选中
           if($.inArray("2", girdType) != -1){
               for (var i = 0; i < bigGrid.length; i++) {
                   var midGrid = bigGrid[i].children;
                   if(midGrid){
                      for(var j = 0; j < midGrid.length; j++){
                          if ($.inArray(midGrid[j].id, idList) == -1) {
                              groupChoice += '<div class="name-cell" id="' + midGrid[j].id + '"><div class="remove-checked">×</div><span>' + midGrid[j].name + '</span></div>';
                          }
                      }
                   }
               }
           }
           //"小网格"是否选中
           if($.inArray("3", girdType) != -1){
               for (var i = 0; i < bigGrid.length; i++) {
                   var midGrid = bigGrid[i].children;
                   if(midGrid){
                       for(var j = 0; j< midGrid.length; j++){
                           var minGrid = midGrid[j].children;
                           if(minGrid){
                               for(var z = 0; z < minGrid.length; z++){
                                   if ($.inArray(minGrid[z].id, idList) == -1) {
                                       groupChoice += '<div class="name-cell" id="' + minGrid[z].id + '"><div class="remove-checked">×</div><span>' + minGrid[z].name + '</span></div>';
                                   }
                               }
                           }

                       }
                   }
               }
           }
        }
    } else{
       //选中的是大网格
       var node = treeNode.getParentNode();
       if(node.pId== null){
           if($.inArray("1", girdType) != -1){
               if ($.inArray(treeNode.id, idList) == -1) {
                   groupChoice += '<div class="name-cell" id="' + treeNode.id + '"><div class="remove-checked">×</div><span>' + treeNode.name + '</span></div>';
               }
           }
           if($.inArray("2", girdType) != -1){
               var midGrid = treeNode.children;
               if (midGrid) {
                   for (var i = 0; i < midGrid.length; i++) {
                       if ($.inArray(midGrid[i].id, idList) == -1) {
                           groupChoice += '<div class="name-cell" id="' + midGrid[i].id + '"><div class="remove-checked">×</div><span>' + midGrid[i].name + '</span></div>';
                       }
                   }
               }
           }
           if($.inArray("3", girdType) != -1){
               var midGrid = treeNode.children;
               for (var i = 0; i < midGrid.length; i++) {
                   var minGrid = midGrid[i].children;
                   if(minGrid){
                       for(var j = 0; j< minGrid.length; j++){
                           if ($.inArray(minGrid[j].id, idList) == -1) {
                               groupChoice += '<div class="name-cell" id="' + minGrid[j].id + '"><div class="remove-checked">×</div><span>' + minGrid[j].name + '</span></div>';
                           }
                       }
                   }
               }
           }
       }else{
           //选中的是中网格
           var midNode = node.getParentNode();
           if(midNode.pId == null){
               if($.inArray("2", girdType) != -1){
                   if ($.inArray(treeNode.id, idList) == -1) {
                       groupChoice += '<div class="name-cell" id="' + treeNode.id + '"><div class="remove-checked">×</div><span>' + treeNode.name + '</span></div>';
                   }
               }
               if($.inArray("3", girdType) != -1){
                   var childrenNodes = treeNode.children;
                   if (childrenNodes) {
                       for (var i = 0; i < childrenNodes.length; i++) {
                           if ($.inArray(childrenNodes[i].id, idList) == -1) {
                               groupChoice += '<div class="name-cell" id="' + childrenNodes[i].id + '"><div class="remove-checked">×</div><span>' + childrenNodes[i].name + '</span></div>';
                           }
                       }
                   }
               }
           }else{
               //选中的是小网格
               var minNode = midNode.getParentNode();
               if(minNode.pId == null){
                   if($.inArray("3", girdType) != -1){
                       if ($.inArray(id, idList) == -1) {
                           groupChoice += '<div class="name-cell" id="' + id + '"><div class="remove-checked">×</div><span>' + name + '</span></div>';
                       }
                   }
               }
           }
       }
    }
    $("#groupChoice").html(groupChoice);
}
