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
