import React, {useEffect, useLayoutEffect, useState} from "react";
import {Image, Picker, Text, View} from '@tarojs/components'
import './already-sign.scss'
import DropDown from '@assets/drop-down.png'
import Taro from '@tarojs/taro'
import {alreadySignListApi, getActQrcodeInfoApi} from "../../services/SyncRequest";
import {getCurrentInstance} from "@tarojs/runtime";
import Api from '../../config/api'
import {isEmpty} from "../../utils/EmptyUtil";

const AlreadySign = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [signList, setSignList] = useState([]);
  const [signDate, setSignDate] = useState('');
  const [signTime, setSignTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [range, setRange] = useState([])
  const [activityName, setActivityName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [url, setUrl] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '已签约'
    })
  }, [])
  useEffect(() => {
    const {
      signActivityId,
      startTime1,
      startTime2,
      startTime3,
      endTime1,
      endTime2,
      endTime3
    } = getCurrentInstance().router.params;
    console.log(999,startTime1,endTime1);
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    if (startTime1 && endTime1) {
      let startTime = startTime1.substring(startTime1.indexOf(' ')+1);
      let endTime = endTime1.substring(endTime1.indexOf(' ')+1);
      let time = `${startTime}-${endTime}`
      range.push(time);
      setRange([...range])

    }
    if (startTime2 && endTime2) {
      let startTime = startTime2.substring(startTime2.indexOf(' ')+1);
      let endTime = endTime2.substring(endTime2.indexOf(' ')+1);

      let time = `${startTime}-${endTime}`
      range.push(time);
      setRange([...range])
    }
    if (startTime3 && endTime3) {
      let startTime = startTime3.substring(startTime3.indexOf(' ')+1);
      let endTime = endTime3.substring(endTime3.indexOf(' ')+1);

      let time = `${startTime}-${endTime}`
      range.push(time);
      setRange([...range])
    }
    _getSignList();
  }, [])
  const onChangeDate = async e => {
    setSignDate(e.detail.value);
    const {
      signActivityId,
    } = getCurrentInstance().router.params;
    let url = '';
    if (isEmpty(signTime)) {
      url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${e.detail.value}`
    } else {
      let startTime = signTime.split('-')[0];
      let endTime = signTime.split('-')[1];
      url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${e.detail.value}&startTime=${startTime}&endTime=${endTime}`
    }
    Taro.request({
      url: url,
      // data: data,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'userId': Taro.getStorageSync('userId')
      },
      success: function (res) {
        console.log(333, res);
        if (res.statusCode == 200) {
          console.log(333, res);
          if (res.data.code == 200) {
            setSignList(res.data.data);
          }

          // setSignList(res.data)
        } else {

        }

      },
      fail: function (err) {
        console.log(333, err);
      }
    })

  }
  const onChangeTime = e => {
     setSignTime(range[e.detail.value]);
    const {
      signActivityId,
    } = getCurrentInstance().router.params;
    let url = '';
    if (range.length !== 0) {
      let startTime = range[e.detail.value].split('-')[0];
      let endTime = range[e.detail.value].split('-')[1];
      if (isEmpty(signDate)) {
        url = Api.alreadySignList + `?activityId=${signActivityId}&startTime=${startTime}&endTime=${endTime}`
      } else {
        url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${signDate}&startTime=${startTime}&endTime=${endTime}`
      }
      Taro.request({
        url: url,
        // data: data,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'userId': Taro.getStorageSync('userId')
          // 'X-Litemall-Token': Taro.getStorageSync('token')
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log(333, res);
            if (res.data.code == 200) {
              setSignList(res.data.data);
            }

            // setSignList(res.data)
          } else {

          }

        },
        fail: function (err) {
        }
      })

    }
  }
  const _getSignList = async () => {
    Taro.showLoading({
      title: '加载中...'
    })
    const {userId} = Taro.getStorageSync('userInfo');
    const {signActivityId} = getCurrentInstance().router.params;
    // const _res = await  getActQrcodeInfoApi(signActivityId);
    // const res = await  signListApi(userId);
    const res = await Promise.all([getActQrcodeInfoApi(signActivityId), alreadySignListApi(signActivityId)])
    console.log(333, res);
    if (res[0].code == 200) {
      const {activity: {activityName, startDate, endDate}, url} = res[0].data;
      setStartDate(startDate);
      setEndDate(endDate);
      setActivityName(activityName);
      setUrl(url);
    }
    if (res[1].code == 200) {
      console.log(333, res[1]);
      setSignList(res[1].data);
    }
    Taro.hideLoading();
  }
  const searchQrcode = () => {
    Taro.navigateTo({
      url: `/pages/sign-qrcode/sign-qrcode?url=${encodeURIComponent(url)}&activityName=${activityName}&startDate=${startDate}&endDate=${endDate}`
    })
  }
  return (
    <View className='already-sign-box'>
      <View className='sign-header'>
        <View className='sign-date-view'>
          <View style='margin:auto; display:flex;align-items:center'>
            <Picker mode='date' onChange={onChangeDate}>
              <Text className='sign-date'
                    style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>{isEmpty(signDate) ? '签到日期' : signDate}</Text>
              <Image src={DropDown} style='margin-left:7.3PX;width:13.9PX;height:8.4PX'/>
            </Picker>
          </View>
        </View>
        <View className='sign-time-view'>
          <View style=' margin:auto; display:flex;align-items:center'>
            <Picker mode='selector' range={range} disabled={range.length == 0 ? true : false} onChange={onChangeTime}>
              <Text className='sign-time'
                    style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>{isEmpty(signTime) ? '签到时间段' : signTime}</Text>
              <Image src={DropDown} style=' margin-left:7.3PX;  width:13.9PX;height:8.4PX'/>
            </Picker>
          </View>
        </View>
      </View>
      <View className='already-sign-main' style='margin-top:11PX'>
        {signList.map((item, index) => {
          return (
            <View className='list-row--layout'>
              <View className='list-row--view'>
                <View style='display:flex;align-items:center'>
                  <Image src={null} style='width:50PX;height:50PX'/>
                  <View style='margin-left:7PX; display:flex;flex-direction:column;'>
                    <Text style='color:#333;font-size:16PX;'>{item.username}</Text>
                    <Text style='color:#999;font-size:14PX;margin-top:3PX'>{item.signDate}</Text>
                  </View>
                </View>
                <Text
                  style={item.normalFlag === 0 ? 'color: #06B48D;font-size:14PX;' : 'color: #E02020;font-size:14PX;'}>{item.normalFlag === 0 ? '正常签到' : '非正常签到'}</Text>
              </View>
            </View>
          )
        })}
      </View>
      <View className='footer'>
        <View className='btn-submit-view' onClick={searchQrcode}
              style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>
          <Text className='btn-submit-text'>查看签到码</Text>
        </View>
      </View>
    </View>
  )
}
export default AlreadySign;
