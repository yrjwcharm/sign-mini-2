export function  compareDate(date1,date2){
  let oDate1 = new Date(date1);
  let oDate2 = new Date(date2);
  if(oDate1.getTime() > oDate2.getTime()){
    return true;
  } else {
    return false;
  }
}
// 如果time2大于time1 返回true 否则 返回false
export function compareTime(time1,time2) {
  if(time_to_sec(time2)-time_to_sec(time1)>0){
    return true;
  }
  return false;
}

//将时分秒转为时间戳
function time_to_sec(time) {
  if (time !== null) {
    let s = "";
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let sec = time.split(":")[2];
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s;
  }
}
export function desensitizationMobile(str){
  if(null != str && str != undefined){
    var pat=/(\d{3})\d*(\d{4})/;
    return str.replace(pat,'$1****$2');
  } else {
    return "";
  }
}
export function desensitizationIdCard(str){
  if(null != str && str != undefined){
    var pat=/(\w{2})\w*(\w{2})/;
    return str.replace(pat,'$1**************$2');
  } else {
    return "";
  }
}
export function getRequest(urlStr) {
  let url ='';
  if (typeof urlStr == "undefined") {
    url = decodeURI(location.search); //获取url中"?"符后的字符串
  } else {
    url = "?" + urlStr.split("?")[1];
  }
  let theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
