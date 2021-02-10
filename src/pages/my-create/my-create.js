import React, {useEffect, useLayoutEffect, useState} from "react";
import {Image, Text, View} from "@tarojs/components";
import Forward from '@assets/forward.png';
import './my-create.scss'
import './my-create-config'
import {AtSwipeAction} from "taro-ui";
import Taro from '@tarojs/taro'
import Qrcode from "@assets/qrcode.svg";
import {deleteActApi, getUserCreatedActApi} from "../../services/SyncRequest";
import EmptyData from '@assets/empty.png'
const MyCreate = () => {
  const [createSignList,setCreateSignList] = useState([]);
  const [isEmpty,setIsEmpty] = useState(false);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'我的创建'
    })
  })
  useEffect(()=>{
    getCreatedSignList();
  },[])
  const getCreatedSignList = async()=>{
    Taro.showLoading({
      title:'请稍等...'
    })
    const {userId} = Taro.getStorageSync('userInfo');
    const res = await getUserCreatedActApi(userId);
    console.log(333,res.data);
    if(res.code==200){
        if(res.data.length>0){
          setIsEmpty(false);
          setCreateSignList(res.data);
        }else{
          setIsEmpty(true);
        }
    }else{
      setIsEmpty(true);
    }
    Taro.hideLoading();
  }
  const handleSingle = (index) => {

  }
  const toAlreadySign=()=>{
    Taro.navigateTo({
      url:'/pages/already-sign/already-sign'
    })
  }
  const deleteAct =async (id)=>{
    const res = await  deleteActApi(id);
    console.log(333,res);
    if(res.code==200){
      getCreatedSignList();
    }
  }
  return (
    <View className='my-create-box'>
      <View className='my-create-main' style={isEmpty?'margin-top:0;flex:1;display:flex;flex-direction:column;':'margin-top:11PX;'}>
        {!isEmpty?createSignList.map(item=>{
          return (
            <AtSwipeAction
               key={item.signActivityId+""}
              onOpened={handleSingle}
              isOpened={false}
               onClick={()=>deleteAct(item.signActivityId)}
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
                    <Text style='color:#333;font-size:16PX;'>{item.activityName}</Text>
                    <Text style='color:#999;font-size:14PX;margin-top:3PX'>已签到{item.signNum}人</Text>
                  </View>
                  <View style='display:flex;flex-direction:row;align-items:center'>
                    <Image src={Qrcode} style='width:12PX;height:12PX'/>
                    <Image src={Forward} style=' margin-left:7PX; width:7PX;height:13.2PX'/>
                  </View>
                </View>
              </View>
            </AtSwipeAction>
          )
        }):<Empty/>}
      </View>
    </View>
  )
}
export default MyCreate;
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
