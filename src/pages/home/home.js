import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './home.scss'
import {getUserInfoApi, sign} from "../../services/SyncRequest";
let event = Taro.eventCenter;
const Home = () => {
  const [userData,setUserData] =useState({});
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '小佑极速签到'
    })
  }, [])
  useEffect(()=>{
    getUserInfo();
    try {
      event.on('updateUserData',()=>{
        getUserInfo();
      })
    }catch(e){
    }
    return ()=>{
      event&&Taro.eventCenter.off();
    }
  },[])
  const getUserInfo= async ()=>{
    const {openId} = Taro.getStorageSync('userInfo');
    const res = await getUserInfoApi(openId);
    console.log(333,res);
    if(res.code==200){
      setUserData(res.data);
    }
  }
  const scanQrCode = () => {
    if(Object.keys(userData).length===0){
      Taro.showToast({
        title:'请先完善用户信息',
        icon:'none'
      })
      return;
    }
    Taro.scanCode({
      success:  (res) => {
        const {userId} = Taro.getStorageSync('userInfo');
        if(res.result){
           let url = res.result + `&userId=${userId}`;
           sign(url).then(res=>{
             console.log(333,res);
             if(res.code==200){
               Taro.navigateTo({
                 url: '/pages/sign-success/sign-success'
               })
             }else{
               Taro.showToast({
                 title:res.msg,
                 icon:'none'
               })
             }
           });
        }

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
          <Text className='xyjsqd-text' style='margin-left:20PX'>小佑极速签到</Text>
          <Text className='scan-qrcode-text' style='margin-left:20PX'>扫码签到、后台叫号管理</Text>
        </View>
        <View className='personal'>
          <View className='basic-info-view'>
            <View className='avatar' style='margin:auto;'>
              <open-data  type="userAvatarUrl"></open-data>
            </View>
            {/*<Image src={null} className='avatar'/>*/}
            {userData.username&&<Text className='name'>{userData.username&&userData.username}</Text>}
            {Object.keys(userData).length===0&& <View className='btn-finish-view' onClick={finishPersonalData}>
              <Text className='btn-finish-view-text'>去完善</Text>
            </View>}
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
