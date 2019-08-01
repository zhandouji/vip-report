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
    dblClickExpand: false,//屏蔽掉双击事件
    removeHoverDom: removeHoverDom
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
  var unitName = $("#unitName").val();
  $.ajax({
    url: BASESERVLET + "/web/deploy/zTree",
    type: "get",
    data: "unitName=" + unitName,
    contentType: "application/json",
    success: function (data) {
      if (data.status == true) {
        if (data.list && data.list.length > 0) {
          for (var i = 0; i < data.list.length; i++) {
            treeData.push(data.list[i]);
          }
        }
        $.fn.zTree.init($("#groupTree"), setting, treeData);
      } else {
        layer.msg(data.error, {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      }
    }
  });
}

function removeHoverDom(treeId, treeNode) {
  $("#checkStatus").remove();
};

function searchNodes() {
  initTree();
}

var treeNodeId;

function onShow(event, treeId, treeNode) {
  treeNodeId = treeNode.id;
  showDeployByGroup(treeNode.id);
}

function saveDeploy(status, unitId, unitName) {
  if (status === 1) {
    layer.msg("该机构已购买", {
      icon: 1,
      time: 2000 //2秒关闭（如果不配置，默认是3秒）
    });
    return;
  }
  var param = {
    unitId: unitId,
    unitName: unitName
  }
  $.ajax({
    url: BASESERVLET + "/web/deploy/save",
    type: "POST",
    data: param,
    success: function (data) {
      if (data.status == true) {
        layer.msg("添加成功", {
          icon: 1,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
          var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
          parent.parent.layer.close(index);
        });
      } else {
        layer.msg(data.error, {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      }
      showDeployByGroup(treeNodeId);
    }
  });
}

function delDeploy(unitId) {
  $.ajax({
    url: BASESERVLET + "/web/deploy/delete?unitId=" + unitId,
    type: "POST",
    success: function (data) {
      if (data.status == true) {
        layer.msg("删除成功", {
          icon: 1,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
          var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引\
          parent.parent.layer.close(index);
        });
      } else {
        layer.msg(data.error, {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      }
      showDeployByGroup(treeNodeId);
    }
  });
}

function showDeployByGroup(id) {
  $.ajax({
    url: BASESERVLET + "/web/deploy/list",
    type: "get",
    data: "unitId=" + id,
    contentType: "application/json",
    success: function (data) {
      if (data.status == true) {
        if (data.list.length > 0) {
          var tableList = "";
          for (var i = 0; i < data.list.length; i++) {
            var obj = data.list[i];
            tableList += '<tr>' +
                '<td>' + obj.unitName + '</td>' +
                '<td>' + obj.deployStatus + '</td>' +
                '<td><button class="caozuo-button2" style="margin-right: 15px" onclick="saveDeploy(\''
                + obj.status + '\',\'' + obj.unitId + '\',\'' + obj.unitName
                + '\')">同意</button>'
                + '<button class="caozuo-button3" onclick="delDeploy(\''
                + obj.unitId + '\')">删除</button></td>' +
                '</tr>';
          }
          $("#groupTable").html(tableList);
        } else {
          $("#groupTable").html('<tr><td colspan="4">暂无数据...</td></tr>');
        }
      } else {
        layer.msg(data.error, {
          icon: 2,
          time: 2000 //2秒关闭（如果不配置，默认是3秒）
        });
      }
    }
  });
}