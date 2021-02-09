import Taro from '@tarojs/taro';
import {loginByWX} from './SyncRequest';
import request from "../utils/request";
import Api from '../config/api'
/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    Taro.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}
export async function wxLogin(payload){
  return request.get(Api.login+`?code=${payload}`,)
}

/**
 * Promise封装wx.login
 */
export function login() {
  return new Promise(function(resolve, reject) {
    Taro.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 判断用户是否登录
 */
export function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (Taro.getStorageSync('userInfo')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}
