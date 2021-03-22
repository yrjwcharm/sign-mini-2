import React, {useEffect, useLayoutEffect, useState} from "react";
import {Image, Text, View} from "@tarojs/components";
import Forward from '@assets/forward.png';
import './my-create.scss'
import './my-create-config'
import {AtSwipeAction} from "taro-ui"
import Taro from '@tarojs/taro'
import Qrcode from "@assets/qrcode.svg";
import {deleteActApi, getUserCreatedActApi} from "../../services/SyncRequest";
import EmptyData from '@assets/empty.png'
const MyCreate = () => {
  const [allSelected,setAllSelected] = useState(true);
  const [orgSelected, setOrgSelected] = useState(false);
  const [personalSelected, setPersonalSelected] = useState(false)
  const [createSignList,setCreateSignList] = useState([]);
  const [status,setStatus]  = useState(0);
  const [isEmpty,setIsEmpty] = useState(false);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'我的创建'
    })
  })
  useEffect(()=>{
    Taro.showLoading({
      title:'请稍等...'
    })
    getCreatedSignList(status);
  },[])
  const getCreatedSignList = async(status)=>{
    setStatus(status);
    const {userId} = Taro.getStorageSync('userInfo');
    console.log(888,userId);
    const res = await getUserCreatedActApi(userId,status);
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
  const toAlreadySign=(item)=>{
    Taro.navigateTo({
      url:`/pages/already-sign/already-sign?signActivityId=${item.signActivityId}&startTime1=${item.startTime1}&startTime2=${item.startTime2}&startTime3=${item.startTime3}&endTime1=${item.endTime1}&endTime2=${item.endTime2}&endTime3=${item.endTime3}`
    })
  }
  const deleteAct =async (id)=>{
    const res = await  deleteActApi(id);
    if(res.code==200){
      getCreatedSignList(status);
    }
  }
  const _allSelected =()=>{
    setAllSelected(true);
    setPersonalSelected(false);
    setOrgSelected(false);
    getCreatedSignList(0);
  }
  const _personalSelected =()=>{
    setAllSelected(false);
    setPersonalSelected(true);
    setOrgSelected(false);
    getCreatedSignList(2);
  }
  const _orgSelected =()=>{
    setAllSelected(false);
    setOrgSelected(true);
    setPersonalSelected(false);
    getCreatedSignList(1);
  }
  return (
    <View className='my-create-box'>
      <View className='header'>
        <View className='all-view' style={allSelected ? 'border-bottom: 2PX solid #06B48D;   box-sizing: border-box;' : 'border-bottom:0'}
              onClick={_allSelected}>
          <Text className='all-text' style={allSelected ? 'color: #06B48D;' : 'color:#333'}>全部活动</Text>
        </View>
        <View className='org-view' style={orgSelected ? 'border-bottom: 2PX solid #06B48D;  box-sizing: border-box;' : 'border-bottom:0'}
              onClick={_orgSelected}>
          <Text className='org-text' style={orgSelected ? 'color: #06B48D;' : 'color:#333'}>机构/团体活动</Text>
        </View>
        <View className='personal-act-view'
              style={personalSelected ? 'border-bottom: 2PX solid #06B48D;  box-sizing: border-box;' : 'border-bottom:0'}
              onClick={_personalSelected}>
          <Text className='personal-act-text' style={personalSelected ? 'color: #06B48D;' : 'color:#333'}>个人活动</Text>
        </View>
      </View>
      <View className='my-create-main' style={isEmpty?'margin-top:0;flex:1;display:flex;flex-direction:column;':'margin-top:11PX;'}>
        {!isEmpty? createSignList.map(item=>{
          console.log(222,item)
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
              <View className='list-row--layout' onClick={()=>toAlreadySign(item)}>
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
