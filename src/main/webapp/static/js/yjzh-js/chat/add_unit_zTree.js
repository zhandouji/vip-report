var setting = {
    treeId:"",
    treeObj:null,
    data:{//表示tree的数据格式
        simpleData:{
            enable:true,//表示使用简单数据模式
            idKey:"id",//设置之后id为在简单数据模式中的父子节点关联的桥梁
            pidKey:"pId",//设置之后pid为在简单数据模式中的父子节点关联的桥梁和id互相对应
            rootId:"null"//pid为null的表示根节点
        }
    },
    view:{//表示tree的显示状态
        selectMulti:false//表示禁止多选
    },
    callback: {
        onClick:onShow
    }
};
$(document).ready(function(){
    $.ajax({
        url:BASESERVLET+"/web/myTree/search",
        type:"get",
        contentType:"application/json",
        success:function(data){
            initTree(data);
        }
    });
});

function initTree(data){
    var treeData = [];
    if(data.list && data.list.length>0){
        for (var i=0;i<data.list.length;i++){
            treeData.push(data.list[i]);
        }
    }
    var zTreeObj = $.fn.zTree.init($("#userTel"), setting, treeData);
}

function onShow(event,treeId,treeNode){
    var unitList = [];
    for (var i = 0; i < $("#unitIds .name-cell").length; i++){
        var temp = $("#unitIds .name-cell").eq(i).attr("id");
        unitList.push(temp);
    }
    var groupChoice = "";
    //获取已选单位
    if($.inArray(treeNode.id, unitList) === -1){
        groupChoice+='<div class="name-cell" id="'+treeNode.id+'"><div class="remove-checked">×</div><span>'+treeNode.name+'</span></div>';
    }
    //单位拼接
    $("#unitIds").append(groupChoice);
}



