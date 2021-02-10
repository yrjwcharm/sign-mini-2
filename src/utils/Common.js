export function  compareDate(date1,date2){
  let oDate1 = new Date(date1);
  let oDate2 = new Date(date2);
  if(oDate1.getTime() > oDate2.getTime()){
    return true;
  } else {
    return false;
  }
}
