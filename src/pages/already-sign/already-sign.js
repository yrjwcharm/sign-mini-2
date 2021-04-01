import React, {useEffect, useLayoutEffect, useState} from "react";
import {Image, Picker, Text, View} from '@tarojs/components'
import './already-sign.scss'
import DropDown from '@assets/drop-down.png'
import Taro from '@tarojs/taro'
import {alreadySignListApi, exportExcelApi, getActQrcodeInfoApi} from "../../services/SyncRequest";
import {getCurrentInstance} from "@tarojs/runtime";
import Api from '../../config/api'
import {isEmpty} from "../../utils/EmptyUtil";
import Act from '@assets/act.png'
import SignCode from '@assets/sign_qrcode.png';
import Export from '@assets/export.png'
import EmptyData from '@assets/empty.png'
const AlreadySign = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [signList, setSignList] = useState([]);
  const [signDate, setSignDate] = useState('');
  const [signTime, setSignTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [range, setRange] = useState([]);
  const [activityName, setActivityName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [normalFlag, setNormalFlag] = useState(1);
  const [url, setUrl] = useState('');
  const [FLAG, setFLAG] = useState(false);
  const [activityId,setActivityId] = useState('');
  const [activity,setActivity] = useState({});
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '已签到'
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
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    setActivityId(signActivityId);
    if (startTime1 && endTime1) {
      pushTime(startTime1, endTime1)
    }
    if (startTime2 && endTime2) {
      pushTime(startTime2, endTime2)
    }
    if (startTime3 && endTime3) {
      pushTime(startTime3, endTime3)
    }
    range.push('非正常签到');
    setRange([...range]);
    _getSignList();
  }, [])
  const pushTime = (start, end) => {
    let startTime = start.substring(start.indexOf(' ') + 1, start.lastIndexOf(':'));
    let endTime = end.substring(end.indexOf(' ') + 1, end.lastIndexOf(':'));
    let time = `${startTime}-${endTime}`
    range.push(time);
    setRange([...range])
  }
  const onChangeDate = async e => {
    setSignDate(e.detail.value);
    const {
      signActivityId,
    } = getCurrentInstance().router.params;
    let url = '';
    if (isEmpty(signTime)) {
      url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${e.detail.value}`
    } else {
      if (signTime === '非正常签到') {
        url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${e.detail.value}&normalFlag=1`
      } else {
        let startTime = range[e.detail.value].split('-')[0] + ':00';
        let endTime = range[e.detail.value].split('-')[1] + ':00';
        url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${e.detail.value}&startTime=${startTime}&endTime=${endTime}`
      }
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
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            if (res.data.data.length === 0) {
              setSignList(res.data.data);
              setFLAG(true);
            } else {
              setSignList(res.data.data);
              setFLAG(false);
            }
          }
        }
      },

    })

  }
  const onChangeTime = e => {
    setSignTime(range[e.detail.value]);
    const {
      signActivityId,
    } = getCurrentInstance().router.params;
    let url = '';
    if (range.length !== 0) {
      if (range[e.detail.value] === '非正常签到') {
        if (isEmpty(signDate)) {
          url = Api.alreadySignList + `?activityId=${signActivityId}&normalFlag=1`
        } else {
          url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${signDate}`
        }
      } else {
        let startTime = range[e.detail.value].split('-')[0] + ':00';
        let endTime = range[e.detail.value].split('-')[1] + ':00';
        if (isEmpty(signDate)) {
          url = Api.alreadySignList + `?activityId=${signActivityId}&startTime=${startTime}&endTime=${endTime}`
        } else {
          url = Api.alreadySignList + `?activityId=${signActivityId}&signDate=${signDate}&startTime=${startTime}&endTime=${endTime}`
        }
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
              if (res.data.data.length === 0) {
                setSignList(res.data.data);
                setFLAG(true);
              } else {
                setSignList(res.data.data);
                setFLAG(false);
              }
            }
          }
        },
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
      setActivity(res[0].data.activity);
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
  const goToActDetail = ()=>{
    Taro.navigateTo({
      url:`/pages/act-detail/act-detail?activity=${JSON.stringify(activity)}`
    })
  }
  const exportsExcel = async ()=>{
    Taro.request({
      url: Api.exportExcel+`?activityId=${activityId}`,
      data: {},
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'userId':Taro.getStorageSync('userId')
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      responseType: 'arraybuffer',
      success: function (result) {
        var fileManager = Taro.getFileSystemManager();
        var FilePath = Taro.env.USER_DATA_PATH + "/" + "dataFile.xlsx";
        fileManager.writeFile({
          data: result.data,
          filePath: FilePath,
          encoding: "binary",//编码方式
          success: result => {
            console.log(222,result);
            Taro.openDocument({ //我这里成功之后直接打开
              filePath: FilePath,
              showMenu:true,
              fileType: "xlsx",
              success: result => {
                console.log("打开文档成功");
              },
              fail: result => {
                console.log(result);
              }
            });
          },
          fail: res => {
            console.log(res);
          }
        })
      }
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
        {!FLAG ? signList.map((item, index) => {
          return (
            <View className='list-row--layout'>
              <View className='list-row--view'>
                <View style='display:flex;align-items:center'>
                  {/*<Image src={null} style='width:50PX;height:50PX'/>*/}
                  <View style='display:flex;flex-direction:column;'>
                    <Text style='color:#333;font-size:16PX;'>{item.username}</Text>
                    <Text style='color:#999;font-size:14PX;margin-top:3PX'>{item.signDate}</Text>
                  </View>
                </View>
                <Text
                  style={item.normalFlag === 0 ? 'color: #06B48D;font-size:14PX;' : 'color: #E02020;font-size:14PX;'}>{item.normalFlag === 0 ? '正常签到' : '非正常签到'}</Text>
              </View>
            </View>
          )
        }) : <Empty/>}
      </View>
      <View className='_footer'>
        <View style='padding:15PX 10PX 15PX 10PX;background-color:#fff; border-radius:50PX; margin-right:15PX; margin-bottom:15PX;'>
          <View style='display:flex;flex-direction:column;align-items:center;' onClick={searchQrcode}>
            <Image src={SignCode} style='width:40PX;height:40PX;'/>
            <Text style='color:#333;font-size:14PX;'>签到码</Text>
          </View>
          <View style='margin-top:15PX; display:flex;flex-direction:column;align-items:center' onClick={exportsExcel}>
            <Image src={Export} style='width:40PX;height:40PX;'/>
            <Text style='color:#333;font-size:14PX;'>导出</Text>
          </View>
          <View style='margin-top:15PX;display:flex;flex-direction:column;align-items:center' onClick={goToActDetail}>
            <Image src={Act} style='width:40PX;height:40PX;'/>
            <Text style='color:#333;font-size:14PX;'>活动</Text>
          </View>
        </View>
        {/*<View className='btn-submit-view' onClick={searchQrcode}*/
        }
        {/*      style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}>*/
        }
        {/*  <Text className='btn-submit-text'>查看签到码</Text>*/
        }
        {/*</View>*/
        }
      </View>
    </View>
  )
}
const Empty = () => {
  return (
    <View className='empty-view' style='margin-top:50%'>
      <View className='empty-wrap'>
        <Image src={EmptyData} className='empty-img'/>
        <Text className='empty-text'>暂无数据哦~</Text>
      </View>
    </View>
  )
}
export default AlreadySign;
