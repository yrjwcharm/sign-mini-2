import React, {Component, useEffect, useLayoutEffect, useState} from "react";
import  Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './sign-success.scss'
import  Sign from '@assets/sign_success.png'
const  SignSuccess =()=>{
  const [isIphoneX,setIsIphoneX] = useState(false);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'详情'
    })
  },[])
  useEffect(()=>{
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);

  },[])
  const back =()=>{
      Taro.navigateBack({
        delta:1
      })
  }
  return(
    <View className='sign-success-box'>
      <View className='main'>
        <View className='detail'>
          <Image src={Sign} className='status-img'/>
          <Text className='dj-success'>签到成功</Text>
          <Text className='dj-success-desc'>请您前往报道</Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view'  onClick={back} style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export default SignSuccess;
