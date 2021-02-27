import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import DefaultAvatar from '@assets/avatar.png'
import ArrowRight from '@assets/forward.png'
import Create from '@assets/create.png'
import Sign from '@assets/Sign.png'
import Team from '@assets/team.png'
import './user.scss'
const User = () => {
  const [userInfo, setUserInfo] = useState({});
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '我的'
    })
  }, [])
  const toMyCreate=()=>{
    // if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/my-create/my-create'
      })
    // }else{
    //   Taro.redirectTo({
    //     url:'/pages/auth/login/login'
    //   })
    // }

  }
  const toMySign =()=>{
    Taro.navigateTo({
      url:'/pages/my-sign/my-sign'
    })
  }
  const toOrgInfo=()=>{
    Taro.navigateTo({
      url:'/pages/org-info/org-info'
    })
  }
  return (
    <View className='user-box'>
      <View className='user-header'>
        <View className='user-header_wrap' onClick={()=>Taro.navigateTo({url:'/pages/person-data/person-data'})}>
          <View className='user-header_wrap_avatar'>
            <open-data type="userAvatarUrl"></open-data>
          </View>
          <View className='user-header_wrap_username'>
            <open-data type='userNickName'></open-data>
          </View>
        </View>
      </View>
      <View style='margin-top:10PX'>
        <ListItem label='我的创建' img={Create} onPress={toMyCreate}/>
        <ListItem label='我的签到' img={Sign} onPress={toMySign}/>
        <ListItem label='机构/团体信息' img={Team} onPress={toOrgInfo}/>
      </View>
     </View>
  )
}
export default User;
const ListItem =(props)=>{
  const {img,onPress,label}=props;
  return (
    <View className='list-row-layout' onClick={onPress}>
      <View className='list-item-view'>
        <View className='list-flex'>
          <View style='display:flex;flex-direction:row;align-items:center;'>
            <Image src={img} style='width:24PX;height:24PX'/>
            <Text style='margin-left:10PX; font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>{label}</Text>
          </View>
          <Image src={ArrowRight} style='width:7PX;height:13.2PX'/>
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}
