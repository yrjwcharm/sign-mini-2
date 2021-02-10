import Taro from '@tarojs/taro';

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
          // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      success: function(res) {
        if (res.statusCode == 200) {
            resolve(res.data);

        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

request.get = (url, data) => {
  return request(url, data, 'GET');
}

request.post = (url, data) => {
  return request(url, data, 'POST');
}
request.put = (url,data)=>{
  return request(url,data,'PUT');
}
request.delete=(url,data)=>{
  return request(url,data,'DELETE');
}

export default request;
