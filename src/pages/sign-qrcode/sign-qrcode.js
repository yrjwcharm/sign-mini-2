import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import './sign-qrcode.scss'
import {QRCode} from "taro-code";
import {getCurrentInstance} from "@tarojs/runtime";

const SignQrCode = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [activityName,setActivityName] = useState('');
  const [startDate,setStartDate] = useState('');
  const [endDate,setEndDate] = useState('');
  const [qrcode,setQrcode]=useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '二维码'
    })
  }, [])
  useEffect(()=>{
    const {isIphoneX} = Taro.getStorageSync('isIphoneX');
    const {url,startDate,endDate,activityName}= getCurrentInstance().router.params;
    setQrcode(decodeURIComponent(url));
    setStartDate(startDate);
    setEndDate(endDate);
    setActivityName(activityName);
    setIsIphoneX(isIphoneX);

  },[])
  const back = () => {
    Taro.reLaunch({url:'/pages/index/index'})
  }
  return (
    <View className='sign-qrcode-box'>
      <View className='main'>
        <View className='detail'>
          <View style='margin-bottom:10PX'>
            <Text style='font-family: PingFangSC-Medium;font-size: 18PX;color: #333333;'>{activityName}</Text>
          </View>
          <QRCode
            text={qrcode}
            size={192}
            scale={4}
            style='margin-top:10PX'
            errorCorrectLevel='M'
            typeNumber={2}
          />
          <View style='margin-top:20PX'>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>截屏或长按二维码保存</Text>
          </View>
          <View style='margin-top:29PX'>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 13PX;color: #333333;letter-spacing: 0.18PX;'>有效期：{startDate}至{endDate}</Text>
          </View>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={back}  style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export default SignQrCode;
