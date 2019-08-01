//封装方法进行图片的大小调整开始
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
	var param = {
		width: width,
		height: height,
		top: 0,
		left: 0
	};
	if(width > maxWidth || height > maxHeight) {

		rateWidth = width / maxWidth;
		rateHeight = height / maxHeight;

		if(rateWidth > rateHeight) {
			param.width = maxWidth;
			param.height = Math.round(height / rateWidth);
		} else {
			param.width = Math.round(width / rateHeight);
			param.height = maxHeight;
		}
	}else if(width < maxWidth && height < maxHeight){
		rateWidth = maxWidth / width ;
		rateHeight = maxHeight / height;

		if(rateWidth < rateHeight) {
			param.width = maxWidth;
			param.height = Math.round(height * rateWidth);
		} else {
			param.width = Math.round(width * rateHeight);
			param.height = maxHeight;
		}
	}
	param.left = Math.round((maxWidth - param.width) / 2);
	param.top = Math.round((maxHeight - param.height) / 2);

	return param;
}
//封装方法进行图片的大小调整结束