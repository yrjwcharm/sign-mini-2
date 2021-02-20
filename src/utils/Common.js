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
function compareTime(time1,time2) {
  if(time_to_sec(time2)-time_to_sec(time1)>0){
    return true;
  }
  return false;
}

//将时分秒转为时间戳
function time_to_sec(time) {
  if (time !== null) {
    var s = "";
    var hour = time.split(":")[0];
    var min = time.split(":")[1];
    var sec = time.split(":")[2];
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s;
  }
}
