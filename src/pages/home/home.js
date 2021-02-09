import React, {useLayoutEffect} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './home.scss'

const Home = () => {
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '小佑极速签到'
    })
  }, [])
  const scanQrCode = () => {
    Taro.scanCode({
      success: (res) => {
        console.log(res)
        Taro.navigateTo({
          url: '/pages/sign-success/sign-success'
        })
      },
      fail: (res => {

      })
    })
  }
  const finishPersonalData = () => {
    Taro.navigateTo({
      url: '/pages/person-data/person-data'
    })
  }
  return (
    <View className='home-box'>
      <View className='main'>
        <View className='banner'>
          <Text className='xyjsqd-text'>小佑极速签到</Text>
          <Text className='scan-qrcode-text'>扫码签到、后台叫号管理</Text>
        </View>
        <View className='personal'>
          <View className='basic-info-view'>
            <View className='avatar' style='margin:auto;'>
              <open-data type="userAvatarUrl"></open-data>
            </View>
            {/*<Image src={null} className='avatar'/>*/}
            {/*<Text className='name'>陈晓晓</Text>*/}
            <View className='btn-finish-view' onClick={finishPersonalData}>
              <Text className='btn-finish-view-text'>去完善</Text>
            </View>
          </View>
        </View>
        <View>
          <View className='scan-qrcode-view'>
            <View className='scan-qrcode' onClick={scanQrCode}>
              <Text className='scan-dj'>扫码登记</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

}
export default Home
