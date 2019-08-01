//日期格式处理 var dateStr = new Date(value.createTime).format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
};

Date.prototype.formatToIosAndAndroid = function (format) {
    var time = this.format(format)
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  return time.replace(/-/g, "/");
};


//时间戳转换日期格式
Date.prototype.timestampToTime = function  (timestamp) {
  var date = new Date(timestamp);
  Y = date.getFullYear() + '-';
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  D = date.getDate();
  return Y + M + D;
}