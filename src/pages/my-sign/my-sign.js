import React, {Component, useLayoutEffect} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import './my-sign.scss'
const MySign =()=>{
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'我的签到'
    })
  },[])
  return (
    <View className='my-sign-box'>
      <View className='my-sign-main' style='margin-top:11PX'>
        <View className='list-row--layout'>
          <View className='list-row--view'>
              <Text style='color:#333;font-size:16PX;'>签到主题名称1</Text>
              <Text style='color:#999;font-size:14PX;'>2021-01-29 10:55</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default MySign;
