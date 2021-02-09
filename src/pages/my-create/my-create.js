import React, {useLayoutEffect} from "react";
import {Image, Text, View} from "@tarojs/components";
import Forward from '@assets/forward.png';
import './my-create.scss'
import './my-create-config'
import {AtSwipeAction} from "taro-ui";
import Taro from '@tarojs/taro'
import Qrcode from "@assets/qrcode.svg";
const MyCreate = () => {
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'我的创建'
    })
  })
  const handleSingle = (index) => {

  }
  const toAlreadySign=()=>{
    Taro.navigateTo({
      url:'/pages/already-sign/already-sign'
    })
  }
  return (
    <View className='my-create-box'>
      <View className='my-create-main' style='margin-top:11PX'>
        <AtSwipeAction
          // key={index}
          onOpened={handleSingle}
          isOpened={false}
          options={[
            {
              text: '删除',
              style: {
                color:'#fff',
                backgroundColor: 'red'
              }
            }
          ]}
        >
          <View className='list-row--layout' onClick={toAlreadySign}>
            <View className='list-row--view'>
              <View style='display:flex;flex-direction:column;'>
                <Text style='color:#333;font-size:16PX;'>签到主题名称1</Text>
                <Text style='color:#999;font-size:14PX;margin-top:3PX'>已签到10人</Text>
              </View>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Image src={Qrcode} style='width:12PX;height:12PX'/>
                <Image src={Forward} style=' margin-left:7PX; width:7PX;height:13.2PX'/>
              </View>
            </View>
          </View>
        </AtSwipeAction>
      </View>
    </View>
  )
}
export default MyCreate;
