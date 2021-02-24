import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './sign-qrcode.scss'
import {QRCode} from "taro-code";
import {getCurrentInstance} from "@tarojs/runtime";
const SignQrCode = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [qrcode, setQrcode] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '二维码'
    })
  }, [])
  useEffect(() => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const {url, startDate, endDate, activityName} = getCurrentInstance().router.params;
    setQrcode(decodeURIComponent(url));
    console.log(333,decodeURIComponent(url));
    setStartDate(startDate);
    setEndDate(endDate);
    setActivityName(activityName);
    setIsIphoneX(isIphoneX);

  }, [])
  const back = () => {
    Taro.reLaunch({url: '/pages/index/index'})
  }
  const authorize = (url) => {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              saveFile(url);
            },
            fail:function (){
              Taro.showModal({
                title: '权限开启',
                confirmColor:'#06B48D',
                content: '是否允许开启访问相册权限?',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    _openSetting();
                  }
                }
              })
            }
          });
        } else {
          saveFile(url);
        }
      }
    });
  }
  const _openSetting = () => {
    Taro.openSetting({
      success: function (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {

        }
      }
    })
  }
  const saveFile = (file) => {
    Taro.downloadFile({
      url: file, success: function (res) {
        // 下载成功后再保存到本地
        console.log(333,res);
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
          success: function (res) {
            Taro.showToast({
              title: '二维码已保存到相册',
              icon: 'none'
            })
          },
          fail:function (res){
            console.log(333,res);
            // Taro.showToast({
            //   title: '保存失败',
            //   icon: 'none'
            // })
          }
        })
      }
    });
  }
  return (
    <View className='sign-qrcode-box'>
      <View className='main'>
        <View className='detail'>
          <View style='margin-bottom:10PX'>
            <Text style='font-family: PingFangSC-Medium;font-size: 18PX;color: #333333;'>{activityName}</Text>
          </View>
          <View onLongPress={()=>authorize(qrcode)}>
            <Image src={qrcode} style='width:192PX;height:192PX'/>
          </View>
          <View style='margin-top:20PX'>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>截屏或长按二维码保存</Text>
          </View>
          <View style='margin-top:29PX'>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 13PX;color: #999;letter-spacing: 0.18PX;'>有效期：{startDate.substring(0,startDate.indexOf(' '))}至{endDate.substring(0,endDate.indexOf(' '))}</Text>
          </View>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={back}
              style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export default SignQrCode;
