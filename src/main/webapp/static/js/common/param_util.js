/**
 * 工具类
 * @author shilinchuan
 * @date 2018/1/5
**/

//判断是否为空
function isEmpty(obj){
    return obj == null || obj == "";
}

//校验是否为数字
function isNumber(obj) {
    try{
        obj = Number(obj);
    }catch (e){
        return false;
    }
    return obj === +obj;
}

/**
 * 正则验证规则
 **/
//手机号验证
function isMobile(str){
    return /^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,6,7,8]))\d{8}$/.test(str);
}

// 身份证号验证
function isIdCard(cardid) {
    //身份证正则表达式(18位)
    var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
    var stard = "10X98765432"; //最后一位身份证的号码
    var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
    var sum = 0;
    if (!isIdCard2.test(cardid)) {
        return false;
    }
    var year = cardid.substr(6, 4);
    var month = cardid.substr(10, 2);
    var day = cardid.substr(12, 2);
    var birthday = cardid.substr(6, 8);
    if (birthday != dateToString(new Date(year + '/' + month + '/' + day))) { //校验日期是否合法
        return false;
    }
    for (var i = 0; i < cardid.length - 1; i++) {
        sum += cardid[i] * first[i];
    }
    var result = sum % 11;
    var last = stard[result]; //计算出来的最后一位身份证号码
    if (cardid[cardid.length - 1].toUpperCase() == last) {
        return true;
    } else {
        return false;
    }
}
//日期转字符串 返回日期格式20080808
function dateToString(date) {
    if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month: month;
        var day = date.getDate();
        day = day < 10 ? '0' + day: day;
        return year + "" +month+ "" + day;
    }
    return '';
}

/**
 * 获得字符串长度
 * @param str
 * @returns {*}
 */
function getStrLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
}

