import React, {useEffect, useLayoutEffect, useState} from "react";
import {Image, Picker, Text, View} from '@tarojs/components'
import './already-sign.scss'
import DropDown from '@assets/drop-down.png'
import Taro from '@tarojs/taro'
import {getActQrcodeInfoApi, signListApi} from "../../services/SyncRequest";
import {getCurrentInstance} from "@tarojs/runtime";

const AlreadySign = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const[signList,setSignList] = useState([]);
  const [startDate,setStartDate] = useState('');
  const [activityName,setActivityName] = useState('');
  const [endDate,setEndDate] = useState('');
  const [url,setUrl] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '已签约'
    })
  }, [])
  useEffect(()=>{
    const {isIphoneX} = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    _getSignList();
  },[])
  const [date, setDate] = useState(['2010-08-22', '2012-09-21'])
  const onChange = e => {

  }
  const _getSignList=async ()=>{
    Taro.showLoading({
      title:'加载中...'
    })
    const {userId} = Taro.getStorageSync('userInfo');
    const {signActivityId}=getCurrentInstance().router.params;
    // const _res = await  getActQrcodeInfoApi(signActivityId);
    // const res = await  signListApi(userId);
    const res = await Promise.all([getActQrcodeInfoApi(signActivityId),signListApi(userId)])
    console.log(333,res);
    if(res[0].code==200){
      const {activity:{activityName,startDate,endDate},url} = res.data;
      setStartDate(startDate);
      setEndDate(endDate);
      setActivityName(activityName);
      setUrl(url);
    }
    if(res[1].code==200){
      setSignList(res.data);
    }
    Taro.hideLoading();
  }
  const searchQrcode =()=>{
    Taro.navigateTo({
      url: `/pages/sign-qrcode/sign-qrcode?url=${encodeURIComponent(url)}&activityName=${activityName}&startDate=${startDate}&endDate=${endDate}`
    })
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
        {signList.map((item,index)=>{
          return (
            <View className='list-row--layout'>
              <View className='list-row--view'>
                <View style='display:flex;align-items:center'>
                  <Image src={null} style='width:50PX;height:50PX'/>
                  <View style='margin-left:7PX; display:flex;flex-direction:column;'>
                    <Text style='color:#333;font-size:16PX;'>{''}</Text>
                    <Text style='color:#999;font-size:14PX;margin-top:3PX'>{item.signDate}</Text>
                  </View>
                </View>
                <Text style={item.normalFlag===0?'color: #06B48D;font-size:14PX;':'color: #E02020;font-size:14PX;'}>{item.normalFlag===0?'正常签到':'非正常签到'}</Text>
              </View>
            </View>
          )
        })}
      </View>
      <View className='footer'>
        <View className='btn-submit-view'  onClick={searchQrcode}  style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <Text className='btn-submit-text'>查看签到码</Text>
        </View>
      </View>
    </View>
  )
}
export default AlreadySign;
