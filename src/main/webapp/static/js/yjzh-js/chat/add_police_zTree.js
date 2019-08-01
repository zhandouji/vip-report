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
    url: BASESERVLET + "/web/myTree/search",
    type: "get",
    contentType: "application/json",
    success: function (data) {
      initTree(data);
    }
  });
});

function initTree(data) {
  var treeData = [];
  var obj = data.obj;
  // treeData.push({id:obj.groupId,name:obj.name,pId:null});
  if (data.list && data.list.length > 0) {
    for (var i = 0; i < data.list.length; i++) {
      treeData.push(data.list[i]);
    }
  }
  var zTreeObj = $.fn.zTree.init($("#userTel"), setting, treeData);
}

var clickUnitId = "";//上一次点击的节点id,用来删除列表未选择的人
function onShow(event, treeId, treeNode) {
  //选中
  console.log("单位id:" + treeNode.id);
  /**如果隐藏右侧表格的话将下面两行代码中的display设置为none,将第二行的距离右边的宽度设置为0就好**/
  $(".person-list-box").css('display', 'block');
  $(".layer-contet-box").css("right", "460px");
  addUserChoice(treeNode.id, treeNode.type, treeNode.pId);
  clickUnitId = treeNode.id;

}

//删除该单位未添加用户
function deleteUser(id) {
  for (var i = 0; i < $(".table1 tr").length; i++) {
    if ($(".table1 tr").eq(i).attr("id") == id) {
      var text = $(".table1 tr").eq(i).text().substr($(".table1 tr").eq(
          i).text().length - 3, $(".table1 tr").eq(i).text().length);
      if (!new RegExp("已").test(text)) {
        $(".table1 tr").eq(i).remove();
        deleteUser(id);
      } else {
        continue;
      }
    }
  }
}

function addUserChoice(gid, type, pId) {
  var electedPolice = "";
  $(".table1").empty();
  console.log(gid + ";" + type + ";" + pId)
  $.ajax({
    url: BASESERVLET + "/web/groupUsers/search",
    type: "get",
    data: "groupId=" + gid + "&type=" + type + "&pId=" + pId,
    contentType: "application/json",
    success: function (data) {
      var list = data.list;
      var selectPolice = $("#selectPolice").find(".name-cell")
      var userLists = new Array();
      if (selectPolice != null && selectPolice.size() > 0) {
        for (var i = 0; i < selectPolice.length; i++) {
          userLists.push(selectPolice.eq(i).attr("id"));
        }
      }
      for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        var name = obj.name;
        if ($.inArray(obj.userId, userLists) === -1) {
          var name = typeof(obj.name) == "undefined" ? obj.userName : obj.name;
          electedPolice += '<tr class="' + obj.userId + '" id="' + obj.groupId
              + '"><td>' + name + '</td><td>' + obj.tel + '</td><td>'
              + obj.groupName
              + '</td><td><span class="add-police-person color-green">添加</span></td></tr>';
        } else {
          var name = typeof(obj.name) == "undefined" ? obj.userName : obj.name;
          electedPolice += '<tr class="' + obj.userId + '" id="' + obj.groupId
              + '"><td>' + name + '</td><td>' + obj.tel + '</td><td>'
              + obj.groupName
              + '</td><td><span class="add-police-person" style="color: #999">已添加</span></td></tr>';
        }
      }
      $(".table1").html(electedPolice);
    }
  });
}




