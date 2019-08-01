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

function initTree() {
    var treeData = [];
    $.ajax({
        url: BASESERVLET + "/web/dicManagement/tree",
        type: "get",
        async: false,
        contentType: "application/json",
        success: function (data) {
            if (data.list && data.list.length > 0) {
                for (var i = 0; i < data.list.length; i++) {
                    treeData.push(data.list[i]);
                }
            }
        }
    });
    treeData.push({id:$("#groupId").val(),name:"字典管理",pId:null});
    console.log("treeData"+treeData);
    var zTreeObj = $.fn.zTree.init($("#dictTree"), setting, treeData);
    var node = zTreeObj.getNodeByParam('id', $("#groupId").val());//获取id为1的点
    zTreeObj.selectNode(node);//选择点
    zTreeObj.setting.callback.onClick(null, zTreeObj.setting.treeId, node);//调用事件
}

function onShow(event, treeId, treeNode) {
    var treeObj=$.fn.zTree.getZTreeObj("dictTree");
    var nodes=treeObj.getCheckedNodes(true);
    clickNode(treeNode);
}

function clickNode(treeNode) {
    var param;
    $("#pId").val(treeNode.id);
    if(treeNode.dataType == undefined || treeNode.dataType == "" || treeNode.dataType == null){
        $("#dataType").val(1);
        param = "dictId=" + treeNode.id + "&dataType=" + 1 + "&dictCode=null";
    }else{
        $("#dataType").val(treeNode.dataType);
        param = "dictId=" + treeNode.id + "&dataType=" + $("#dataType").val() + "&dictCode=" + treeNode.dictCode+"";
        if($("#dataType").val() == "2"){
            layer.msg('字典项不可点击', {shift: -1,time:2000});
            return;
        }
    }
    $.ajax({
        type:"get",
        url:"/skynet/web/dict/listHtml",
        dataType: "html",
        data: param,
        success:function(data){
            $("#dictList").html(data);
        }
    });
}





