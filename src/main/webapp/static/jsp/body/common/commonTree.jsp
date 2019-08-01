<%--
  User: chhe
  Date: 2018/6/14
  Time: 11:16
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="tilesx" uri="http://tiles.apache.org/tags-tiles-extras" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
    //基础静态资源请求路径:如：${base}/js/jquery.js
    request.setAttribute("base", path);
    //基础Controller请求路径，如：${baseServlet}/web/login
    request.setAttribute("baseServlet", path + request.getAttribute("javax.servlet.forward.servlet_path"));
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>公共树</title>
    <link  rel="stylesheet" href="/theme/css/index.css"/>
    <link rel="stylesheet" href="/theme/css/history.css"/>
    <script src="/js/jquery.2.1.4.min.js"></script>
    <%--ztree官方文档--%>
    <link rel="stylesheet" href="/plugins/tree/zTreeStyle/zTreeStyle.css" type="text/css">
    <script type="text/javascript" src="/plugins/tree/jquery.ztree.core-3.5.min.js"></script>
    <script src="/plugins/tree/jquery.ztree.excheck-3.5.min.js"></script>
    <style type="text/css">
        #codeNames>div{
            display: inline-block;
            padding: 6px 12px;
            margin: 6px;
            border: 1px solid #dadada;
            border-radius: 4px;
            background-color: #efeff4;
            color: #1e9826;
        }
    </style>
    <%--ztree官方文档--%>
    <script type="text/javascript">
      var BASESERVLET = '${baseServlet}';

      /**
       * 根据父页面数据，选中树节点
       */
      function setTreePoint(){
        //如果没有选中的可见区域,则直接返回
        if(!visibleCode){
          return;
        }
        //获取树对象，遍历当前加载的所有节点，如果选中的可见区域包含某一个节点，则把该节点设置为选中状态
        var treeObj = $.fn.zTree.getZTreeObj("dictTree");
        var rootNode = treeObj.getNodes();
        var nodes = treeObj.transformToArray(rootNode);
        for (var i=0; i < nodes.length; i++) {
          //获取当前节点的adcode
          var adCode = nodes[i].adcode;

          //精确查找，如果该adcode被父页面的visibleCode包含，则说明他是被选中的节点
          if(visibleCode.indexOf(adCode) != -1){
            //设置该节点为被选中状态
            nodes[i].checked = true;
            //需要此方法修改一下状态
            treeObj.updateNode(nodes[i]);
            //寻找其父级节点
            var pNode = nodes[i].getParentNode();
            //递归向上循环父节点，如果有父节点切不是半选中状态，且不是全选中状态的情况下，修改该父节点为半选中状态
            while (pNode && !pNode.halfCheck && !pNode.checked){
                pNode.halfCheck = true;
                treeObj.updateNode(pNode);
                pNode = pNode.getParentNode();
            }
          }else {
            //模糊查找
            if(validateCode(adCode) && nodes[i].isParent){
              nodes[i].halfCheck = true;
              treeObj.updateNode(nodes[i]);
            }
          }
        }
      }

      /**
       * 模糊查询，假设父页面中的可见区域Vcode 为130104,130208,130000
       * 如果传入的code为130100或者130105
       * 截取code的前四位1301，如果Vcode包含code的前四位，认为传入的code所代表的城市的下级行政区域里面有县/市被选为可见区域
       */
      function validateCode(code){
        var four = code.substring(0, 4);
        var flag = visibleCode.indexOf(four) != -1;
        return flag;
      }

      /**
       * 勾选/取消勾选事件，
       * 因为每次异步加载数据会，根据缓存的visibleCode来刷新选中状态
       * @param event
       * @param treeId
       * @param treeNode
       */
      function onCheck(event, treeId, treeNode) {
        //当前节点选中状态如果是true，说明是选中状态，说明之前没有选中
        var treeCode = treeNode.adcode;
        var treeName = treeNode.name;
        var parentName;
        if(treeNode.getParentNode()){
          parentName = treeNode.getParentNode().name + "-";
        }else {
          parentName = "";
        }
        if(treeNode.checked){
            if(visibleName){
              visibleName += "," + parentName  + treeName;
            }else {
              visibleName = parentName + treeName;
            }
            if(visibleCode){
              visibleCode += "," + treeCode;
            }else {
              visibleCode = treeCode;
            }
          $("#codeNames").append("<div id = '" + treeCode + "'>" + parentName + treeName + "</div>");
        }else {
          //取消选中
          var codeReg1 = new RegExp(treeCode + ",", "g");
          var codeReg2 = new RegExp("," + treeCode, "g");
          var codeReg3 = new RegExp(treeCode, "g");
          //visibleCode有数据，如果该事件是取消选中，则从visibleCode有数据中删除该areaCode
          if(visibleCode){
            visibleCode = visibleCode.replace(codeReg1, "").replace(codeReg2, "").replace(codeReg3, "");
          }
          var nameArr = visibleName.split(",");
          visibleName = "";
          for(var index in nameArr){
            if(nameArr[index] == parentName + treeName){
              nameArr.slice(index, 1);
              continue;
            }
            if(visibleName == ""){
              visibleName += nameArr[index];
            }else {
              visibleName += "," + nameArr[index];
            }
          }
          $("#" + treeCode).remove();
        }
      }

      var settings = {
        callback: {
          onAsyncSuccess: setTreePoint,
          onCheck: onCheck
        },
        async: {
          enable: true,
          url: BASESERVLET + "/web/getAreaCodeW",
          autoParam:["adcode=areaCode"],
          otherParam:{},
          dataType: "json",
          type: "get"
        },
        check: {
          enable: true,
          chkStyle: "checkbox",
          chkboxType: { "Y": "", "N": "" },
          chkDisabledInherit: false
        },
        data: {
          enable: true,
          idKey:'adcode',
          pIdKey:'parentCode',
          rootPId: null
        },
        key:{
          name: name,
          isParent: "isParent"
        }
      };

    </script>
</head>
<body>
    <div style="position: absolute; top: 0; right: 0; bottom: 60px; left: 0;">
        <div class="clear" style="position: relative; width: 100%; height: 100%; box-sizing: border-box;">
            <div style="width: 320px; height: 100%; box-sizing: border-box; border-right: 8px solid #efeff4;padding: 12px;position: relative;">
                <div class="part-title-box">
                    <div class="part-title color-dark-blue border-dark-blue">
                        区域
                    </div>
                </div>
                <div style="position: absolute; top: 46px; right: 6px; bottom: 12px; left: 6px; overflow-y: auto;overflow-x: auto;">
                    <ul id="dictTree" class="ztree"></ul>
                </div>
            </div>
            <div  style="position: absolute; padding: 6px; top: 0; right: 0; bottom: 0; left: 320px;">
                <div style="position: relative; width: 100%; height: 100%; box-sizing: border-box;">
                    <div class="color-green" style="line-height: 20px; font-size: 16px; border-left: 4px solid #1e9826; font-weight: 600;margin-top: 8px;">&nbsp;&nbsp;选中地区</div>
                    <div id="codeNames" style="position: absolute; top: 32px; right: 0; bottom: 0; left: 0; overflow-y: auto;">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="position: absolute; right: 0; bottom: 0; left: 0; height: 60px; line-height: 60px;text-align: center;border-top: 8px solid #efeff4;">
        <button type="button" onclick="saveArea()" class="bg-black-blue color-white" style="width: 140px; height: 32px; border-radius: 5px;border: 0;">保存</button>
    </div>

</body>
<script type="text/javascript">
  var areaCode = "${areaCode}";
  //保存选中的和父页面上的code值,选中的区域名称和父页面上的可见区域名称
  var visibleCode, visibleName;

  $(function () {
    if(!areaCode){
      areaCode = '000000';
    }
    //获取页面中的选中的areaCode数据
    visibleCode = parent.$("#availableDomain").val();
    //获取页面中的选择的可见区域名称
    visibleName = parent.$("#visibleName").val();
    //初始化树，并加载初始数据
    initTreeData();
  });

  /**
   * 加载树的数据，同时根据设备数据，选中树节点
   */
  function initTreeData() {
        //初始化树
        zTreeObj = $.fn.zTree.init($("#dictTree"), settings, parent.treeData);
        //初次加载数据，选中数据中的节点
        setTreePoint();
        //提示已选中区域
        if(visibleName){
          var nameArr = visibleName.split(",");
          var codeArr = visibleCode.split(",");
          for(var index in nameArr){
            $("#codeNames").append("<div id='" + codeArr[index] + "'>" + nameArr[index] + "</div>");
          }
        }
  }

  /**
   * 保存选中的areaCode
   */
  function saveArea() {
    var treeObj = $.fn.zTree.getZTreeObj("dictTree");
    var nodes = treeObj.getCheckedNodes(true);
    //如果没有选中的节点且visibleCode为空，就说明用户取消了所有的选中节点，这种情况，暂定全省可见
    if(nodes.length == 0 && (!visibleCode || visibleCode == '')){
      visibleCode = parent.treeData[0].adcode;
      visibleName = parent.treeData[0].name;
    }
    parent.$("#availableDomain").val(visibleCode);
    parent.$("#visibleName").val(visibleName);
    //先得到当前iframe层的索引
    var index = parent.layer.getFrameIndex(window.name);
    //再执行关闭
    parent.layer.close(index);
  }

</script>