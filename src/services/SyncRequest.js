import request from '../utils/request';
import Api from '../config/api';
/**
 * 获取医院选择列表
 * @param payload
 * @returns {Promise<void>}
 */
export  async  function getImgCodeApi(payload){
  return request.get(Api.getImgCode+`?openId=${payload}`);
}

export async function saveUserInfoApi(payload){
  return request.post(Api.saveUserInfo,payload)
}
export async  function  saveCompanyInfoApi(payload){
  return request.post(Api.saveCompanyInfo,payload)

}
export async  function  saveSignAct(payload){
  return request.post(Api.saveSignAct,payload)
}

export async  function  signListApi(payload){
  return request.get(Api.signList+`?userId=${payload}`)
}
export async  function  alreadySignListApi(payload){
  return request.get(Api.alreadySignList+`?activityId=${payload}`)
}
export async  function  getUserCreatedActApi(payload){
  return request.get(Api.createdAct+`?userId=${payload}`)
}

export async function sign(payload){
  return request.get(payload)
}
export async function  getUserInfoApi(payload){
  return request.get(Api.getUserInfo+`?openId=${payload}`)
}
export async function  deleteActApi(payload){
  return request.delete(Api.deleteAct+`?activityId=${payload}`)
}
export async function  getCompanyInfoApi(payload){
  return request.get(Api.getCompany+`?userId=${payload}`)
}
export async  function updateCompanyInfoApi(payload){
  return request.put(Api.updateCompany,payload)
}

export async  function  getActQrcodeInfoApi(payload){
  return request.get(Api.getActQrWeiMaInfo+`?activityId=${payload}`)
}
