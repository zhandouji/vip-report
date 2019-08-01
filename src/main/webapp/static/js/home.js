/**
 * 保存框架主页用到的javascript
 */

$(initMain);//页面加载完成调用

var currentMMR;//当前主要页面顶部的菜单请求对象

var dmenu; //顶部菜单按钮
var lymenu;//左侧一级菜单按钮
var lsmenu;//左侧二级菜单按钮

/**
 * 初始化main页面的javascript
 */
function initMain() {

  /**
   * jQuery 的ajax请求的默认错误处理器，处理服务器错误、断开连接等情况；
   * 如有其他需求，可在具体ajax方法中覆盖
   */
  jQuery.ajaxSetup({
    cache: true,
    error: function (err, err1, err2) {
      var msg;
      if (!err) {
        msg = "连接服务器失败，请检查网络";
        layer ? layer.alert(msg, {icon: 0}) : alert(msg);
        return;
      }
      msg = err.responseText;
      console.log("error", msg);
    }
  });

  $("#logoutBtn").click(function () {
    location.href = BASESERVLET + "/web/logout";
  });

  //左侧一级菜单点击事件
  left_yiji();

  //顶部菜单点击事件
  $("#header_menu li").on("click", function () {
    if ($(this).hasClass("current_top")) {
      //当前菜单处于选中状态不处理
      return;
    }
    $(".header_nav li").removeClass("current_top");
    $(this).addClass("current_top");
    var menu_dom = $(this).find("a");
    dmenu = menu_dom.text();
    leftchange(menu_dom.attr("menu"));

  })

  // leftchange();
}

//左侧一级菜单点击事件
function left_yiji() {
  $("#left_xxx").on("click", "li", function (event) {
    //url，阻止默认事件执行
    event.stopPropagation();
    event.preventDefault();
    var li = $(this);
    showRight(event,li);
  });
}
function showRight(event,li){
  //移除已选定的样式
  removeCheckedCss();
  if (li.has("ul").length) {
    //点击一级菜单，是二级菜单的展开与闭合
    if (clicknum == 1) {
    }
    var level2as = li.find("ul").first();
    if (level2as.is(":hidden")) {
      $(".sub-menu-list").hide();
      li.find(".icon-right").first().removeClass("fa-angle-right").addClass(
          "fa-angle-down");
      level2as.show();
    } else {
      li.find(".icon-right").first().removeClass("fa-angle-down").addClass(
          "fa-angle-right");
      level2as.hide();
    }
  } else {
    //没有二级菜单或者点击二级菜单
    var level2 = li.parent(".sub-menu-list");//取直接上级;
    if (level2.length) {
      //点击的是二级菜单，选中二级菜单
      $(".checked-li").removeClass("checked-li");
      li.addClass("checked-li");
      level2.parent("li").addClass("checked-li");
    }
    var a = li.find("a");
    var href = a.attr("href");
    lymenu = a.text();
    dmenu = li.parent().prev().find("span").text();
    content_topchange(href, dmenu, lymenu, lsmenu);
    var iframe = a.attr("iframe");
    if (iframe == "true") {
      event.stopPropagation();
      event.preventDefault();
      $("#content_main").html('<iframe style="width:100%;height:100%;margin:0;padding:0;border:0;background:transparent;" src="'
          + href + '"></iframe>')
      return;
    }
    if (!href || /javascript:\s*;*/.test(href)) {
      return;
    }
    if (href.indexOf("javascript:") >= 0) {
      //js方法，自动执行
    } else {
      //url，阻止默认事件执行
      event.stopPropagation();
      event.preventDefault();
      mainchange(href);//显示到主页面
    }
  }
}

function removeCheckedCss() {
  $("li .checked-li").each(function () {
    $(this).removeClass("checked-li");
  })
}
//左侧菜单内容改变
function leftchange() {
  var left_a = $("#left_xxx");
  left_a.empty();//清空主业务展示区原来的菜单

  //加载中效果
  //spin.js
  left_a.load(
      BASESERVLET + "/web/menu",
      {},
      function () {
        //菜单效果
        initIndex();
      }
  );
}

//获取url参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

//content_top内容
function content_topchange(menu, dmenu, lymenu, lsmenu) {
  $("#firstli").html(dmenu);
  $("#secondli").html(lymenu);
}

//main中主要内容显示
function mainchange(url) {
  var layerIndex = layer.load(2);//time参数，最多等待十秒
  $.ajax({
    type: "get",
    url: url,
    dataType: "html",
    success: function (data) {
      layer.close(layerIndex);
      $("#content_main").html(data);
    }
  });
}
