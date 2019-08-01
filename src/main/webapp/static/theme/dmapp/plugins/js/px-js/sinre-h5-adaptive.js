var phoneWidth = parseInt(window.screen.width);
var phoneScale = phoneWidth / 720;

var ua = navigator.userAgent;
if(/Android (\d+\.\d+)/.test(ua)) {
	var version = parseFloat(RegExp.$1);
	if(version > 2.3) {
		document.write('<meta name="viewport" content="width=720, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
	} else {
		document.write('<meta name="viewport" content="width=720, target-densitydpi=device-dpi">');
	}
} else {
	document.write('<meta name="viewport" content="width=720, user-scalable=no, target-densitydpi=device-dpi">');
}

SR_H5CORE.init({
	pageWidth: 720,
	pageHeight: 1008
});