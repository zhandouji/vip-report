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
    check: {
        enable: true,
        chkStyle: "radio"
    },
    view: {//表示tree的显示状态
        selectMulti: false//表示禁止多选
    },
    callback: {
        onCheck: onCheck
    }
};

/**
 * 加载树的数据，同时根据设备数据，选中树节点
 */
function initTreeData() {
    var gridType = 0;
    $.ajax({
        url:  BASESERVLET + "/web/company/list",
        type: "get",
        data:"gridType="+gridType,
        contentType: "application/json",
        success: function (data) {
            initTree(data);
        }
    });
}

/**
 * 单击单选框事件
 * @param e
 * @param treeId
 * @param treeNode
 */
function onCheck(e, treeId, treeNode) {
        if(!treeNode.checked){
            $("#citySel").val("");
            $("#citySel").attr("name", "");
        }else {
            var name = treeNode.name;
            var id = treeNode.id;
            console.log(id);
            console.log(name);
            $("#citySel").val(name);
            $("#citySel").attr("name", id);
            $("input[name='mainGroup']").val(id)
        }

}


function initTree(data) {
    var treeData = [];
    if (data.list && data.list.length > 0) {
        for (var i = 0; i < data.list.length; i++) {
            treeData.push(data.list[i]);
        }
    }
    var zTreeObj = $.fn.zTree.init($("#userZtree"), setting, treeData);
    setTreePoint(zTreeObj);
}

/**
 * 将单位的id 在加载数据时 选中树里面的该单位
 */
function setTreePoint(treeObj){
    var rootNode = treeObj.getNodes();
    var nodes = treeObj.transformToArray(rootNode);
    for (var i=0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if(id == companyId){
            nodes[i].checked = true;
            return;
        }
    }
}

function showMenu1() {
    var cityObj = $("#citySel");
    var cityOffset = $("#citySel").offset();
    $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}