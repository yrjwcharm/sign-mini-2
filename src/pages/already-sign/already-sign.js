import React, {useLayoutEffect, useState} from "react";
import {Image, Picker, Text, View} from '@tarojs/components'
import './already-sign.scss'
import DropDown from '@assets/drop-down.png'
import Taro from '@tarojs/taro'

const AlreadySign = () => {
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '已签约'
    })
  }, [])
  const [date, setDate] = useState(['2010-08-22', '2012-09-21'])
  const onChange = e => {

  }
  const searchQrcode =()=>{

  }
  return (
    <View className='already-sign-box'>
      <View className='sign-header'>
        <View className='sign-date-view'>
          <View style='margin:auto; display:flex;align-items:center'>
            <Picker mode='selector' range={date} onChange={onChange}>
              <Text className='sign-date' style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>签到日期</Text>
              <Image src={DropDown} style='margin-left:7.3PX;width:13.9PX;height:8.4PX'/>
            </Picker>
          </View>
        </View>
        <View className='sign-time-view'>
          <View style=' margin:auto; display:flex;align-items:center'>
            <Text className='sign-time' style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>签到时间段</Text>
            <Image src={DropDown} style=' margin-left:7.3PX;  width:13.9PX;height:8.4PX'/>
          </View>
        </View>
      </View>
      <View className='already-sign-main' style='margin-top:11PX'>
        <View className='list-row--layout'>
          <View className='list-row--view'>
            <View style='display:flex;align-items:center'>
              <Image src={null} style='width:50PX;height:50PX'/>
              <View style='margin-left:7PX; display:flex;flex-direction:column;'>
                <Text style='color:#333;font-size:16PX;'>李美丽</Text>
                <Text style='color:#999;font-size:14PX;margin-top:3PX'>2021-01-29 11:34</Text>
              </View>
            </View>
            <Text style='color: #06B48D;font-size:14PX;'>正常签到</Text>
          </View>
        </View>
        <View className='list-row--layout'>
          <View className='list-row--view'>
            <View style='display:flex;align-items:center'>
              <Image src={null} style='width:50PX;height:50PX'/>
              <View style='margin-left:10PX; display:flex;flex-direction:column;'>
                <Text style='color:#333;font-size:16PX;'>李美丽</Text>
                <Text style='color:#999;font-size:14PX;margin-top:10PX'>2021-01-29 11:34</Text>
              </View>
            </View>
            <Text style='color: #E02020;font-size:14PX;'>非正常时间签到</Text>
          </View>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view'  onClick={searchQrcode}>
          <Text className='btn-submit-text'>查看签到码</Text>
        </View>
      </View>
    </View>
  )
}
export default AlreadySign;
