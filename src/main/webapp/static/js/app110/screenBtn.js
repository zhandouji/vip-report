//--------------------多屏模块--------------------//
/**
 * 多屏按钮模块的【初始化】
 */
APP110.mods["screenBtn"].init = function () {
  $("#showMap").on("click", function () {
    var size = APP110.current.screenSize;//当前配置的屏幕数
    APP110.current.screens[1] = window.open(
        BASESERVLET + "/web/app110/main/" + size + "/" + 1);
    APP110.callModFun("notice", "getLatandLon");
  });
  return;
}
