/**
 * Created by 52879 on 2017/12/22.
 */

var videos = {};
function open_in_new_window(id, new_page_title, features) {
    var html_contents = document.getElementById(id);
    if(!html_contents)
        return;

    if(videos[id]) {
        videos[id].close();
        delete videos[id];
        return;
    }
    var new_window;
    // if(features !== undefined && features !== '') {
    //   new_window = window.open('','', features);
    // }
    // else {
    new_window = window.open();
    // }
    videos[id] = new_window;
    if(html_contents !== null) {
        new_window.document.write('<!DOCTYPE html><html><head>'
            + '<title>' + new_page_title
            + '</title><meta charset="UTF-8" />'+'<script type="text/javascript" src="/skynet/js/jquery.2.1.4.min.js"></script></head><body>'
            + '<div style="height:99%;position:absolute;width:100%;background-color:#ccc;left:0;top:0;">'
            + '<div  style="position: relative; width: 100%; height: 100%; box-sizing: border-box;">'
            + html_contents.outerHTML +'<div  style="position: absolute; left:0; right:0; bottom:0; height:60px; background:rgba(0,0,0,0.3); box-sizing: border-box; text-align: center; line-height: 60px;">'
            + '<button class="full-screen" style="color: #fff; font-size: 18px; background-color: transparent;border:0; outline: none;" onclick="full_screen()">点击进入全屏</button></div></div></div></body><script>'
            + '    document.getElementById("' + id
            + '").srcObject=window.opener.document.getElementById("' + id
            + '").srcObject;'
            + 'function  full_screen() { document.getElementById("' + id
            + '").webkitRequestFullScreen();}'
            + '</script></html>');
    }
}