import React, {Component, useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import './my-sign.scss';
import EmptyData from '@assets/empty.png'
import {signListApi} from "../../services/SyncRequest";
const MySign =()=>{
  const [signList,setSignList] = useState([]);
  const [isEmpty,setIsEmpty] = useState(false);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'我的签到'
    })
  },[])
  useEffect(()=>{
      getSignList();
  },[])
  const getSignList = async ()=>{
    const {userId} = Taro.getStorageSync('userInfo');
    const res  = await signListApi(userId);
    console.log(333,res);
    if(res.code==200){
        if(res.data.length>0){
          setIsEmpty(false);

        }else{
          setIsEmpty(true);
        }
    }else{
      setIsEmpty(true);
    }
  }
  // "signActivityId": 279136859374878720,
  //   "activityName": "签到活动1",
  //   "signDate": "2021-02-09T10:36:36.000+00:00",
  //   "normalFlag": 1
  return (
    <View className='my-sign-box'>
      <View className='my-sign-main' style={isEmpty?'margin-top:0':'margin-top:11PX'}>
        {!isEmpty?signList.map(item=>{
          return (
            <View className='list-row--layout' key={index+""}>
              <View className='list-row--view'>
                <Text style='color:#333;font-size:16PX;'>{item.activityName}</Text>
                <Text style='color:#999;font-size:14PX;'>{item.signDate}</Text>
              </View>
            </View>
          )
        }):<Empty/>}
      </View>
    </View>
  )
}
const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={EmptyData} className='empty-img'/>
        <Text className='empty-text'>暂无数据哦~</Text>
      </View>
    </View>
  )
}
export default MySign;
