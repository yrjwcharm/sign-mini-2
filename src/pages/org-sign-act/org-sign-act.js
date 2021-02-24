import React, {useEffect, useState} from "react";
import {Image, Input, Picker, ScrollView, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import ListRow from "../../components/ListRow";
import '../../components/ListRow.scss'
import './org-sign-act.scss'
import Location from '@assets/location.png'
import Decrease from '@assets/decrease.png';
import Increase from '@assets/increase.png';
import Close from '@assets/close.png'
import Open from '@assets/open.png'
import Calendar from '@assets/calendar.png'
import {getCompanyInfoApi, saveSignAct} from "../../services/SyncRequest";
import Api from "../../config/api";
import {isEmpty} from "../../utils/EmptyUtil";
import {compareDate,compareTime} from "../../utils/Common";
import moment from 'moment'

const OrgSignAct = () => {
  const [actTopic, setActTopic] = useState('');
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [timeArr, setTimeArr] = useState([]);
  const [area, setArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime1, setStartTime1] = useState('');
  const [startTime2, setStartTime2] = useState('');
  const [startTime3, setStartTime3] = useState('');
  const [endTime1, setEndTime1] = useState('');
  const [endTime2, setEndTime2] = useState('');
  const [endTime3, setEndTime3] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [timeIntervalFlag, setTimeIntervalFlag] = useState("1");
  const [callingFlag, setCallingFlag] = useState("1");
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [index, setIndex] = useState(0);
  const [startTime, setStateTime] = useState('');
  const [endTime, setEndTime] = useState('');
  useEffect(() => {
    const {isIphoneX} = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
  }, [])
  const showStartDatePicker = (e) => {
    setStartDate(e.detail.value);
  }
  const showEndDatePicker = (e) => {
    setEndDate(e.detail.value);

  }
  const generateSign = async () => {
    console.log(333,timeIntervalFlag);
    if (isEmpty(actTopic)) {
      Taro.showToast({
        title: '活动名称不能为空',
        icon: 'none'
      })
      return;
    }
    if(actTopic.length>10){
      Taro.showToast({
        title: '活动名称不能超过10个字符',
        icon: 'none'
      })
      return;
    }
    if (isEmpty(startDate)) {
      Taro.showToast({
        title: '开始日期不能为空',
        icon: 'none'
      })
      return;
    }
    if (isEmpty(endDate)) {
      Taro.showToast({
        title: '结束日期不能为空',
        icon: 'none'
      })
      return;
    }
    if (compareDate(startDate, endDate)) {
      Taro.showToast({
        title: '开始日期不能晚于结束日期',
        icon: 'none',
      })
      return;
    }
    if(!isEmpty(startTime1)&&!isEmpty(endTime1)){
        if(!compareTime(startTime1,endTime1)){
          Taro.showToast({
            title: '开始时间不能晚于结束时间',
            icon: 'none',
          })
          return;
        }
    }
    if(!isEmpty(startTime2)&&!isEmpty(endTime2)){
      if(!compareTime(startTime2,endTime2)){
        Taro.showToast({
          title: '开始时间不能晚于结束时间',
          icon: 'none',
        })
        return;
      }
    }
    if(!isEmpty(startTime3)&&!isEmpty(endTime3)){
      if(!compareTime(startTime2,endTime2)){
        Taro.showToast({
          title: '开始时间不能晚于结束时间',
          icon: 'none',
        })
        return;
      }
    }

    if (isEmpty(provinceid) && isEmpty(cityid) && isEmpty(districtid)) {
      Taro.showToast({
        title: '请选择活动地点',
        icon: 'none',
      })
      return;
    }
    // Taro.showLoading({
    //   title: '请稍等...'
    // })
    const {userId} = Taro.getStorageSync('userInfo');
    const _res = await getCompanyInfoApi(userId);
    const {companyId} = _res.code == 200 ? _res.data : {};
    const res = await saveSignAct({
      companyId,  // 企业id
      activityName: actTopic,			// 活动名称
      startDate,			// 开始日期
      endDate,				// 结束日期
      startTime1,			// 开始时间1
      endTime1,				// 结束时间1
      startTime2,			// 开始时间2
      endTime2,				// 结束时间2
      startTime3,			// 开始时间3
      endTime3,				// 结束时间3
      provinceCode: provinceid,			// 省
      cityCode: cityid,					// 市
      areaCode: districtid,				// 区
      detailedAddr:area,	// 详细地址
      callingFlag,				// 是否叫号  0是 1否
      timeIntervalFlag				// 是否开启时间区间   0是 1否
    })
    if (res.code == 200) {
      Taro.navigateTo({
        url: `/pages/sign-qrcode/sign-qrcode?url=${encodeURIComponent(res.data)}&activityName=${actTopic}&startDate=${startDate+` 00:00:00`}&endDate=${endDate+` 00:00:00`}`
      })
    }
    Taro.hideLoading();

  }
  const getLocation = () => {
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          authorize();
        } else {
          _chooseLocation();
        }
      },
    })

  }
  const authorize = () => {
    Taro.authorize({
      scope: 'scope.userLocation',
      success: function () {
        // 用户已经同意小程序使用录音功能，后续调用 Taro.chooseLocation 接口不会弹窗询问
        _chooseLocation();
      },
      fail: function (res) {
        Taro.showModal({
          title: '权限开启',
          confirmColor: '#06B48D',
          content: '是否允许开启位置权限?',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              _openSetting();
            }
          }
        })
      }
    })
  }
  const _openSetting = () => {
    Taro.openSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {

        }
      }
    })
  }
  const _chooseLocation = () => {
    Taro.chooseLocation({
      success: function (res) {
        const {address, latitude, longitude} = res;
        let url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${Api.key}&radius=1000&extensions=all&roadlevel=1`
        Taro.request({
          url,
          data: {},
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            const data = res.data;
            if (data.infocode == 10000) {
              const res = data.regeocode.addressComponent
              let provinceId = res.adcode.substring(0, 2) + '0000';
              let cityId = res.adcode.substring(0, 4) + '00';
              let districtId = res.adcode;
              setArea(address);
              setProvinceId(provinceId);
              setCityId(cityId);
              setDistrictId(districtId);
            }
          }
        })


      },
      complete: function (res) {
        console.log(333, res);
      },
      fail: function (res) {
        console.log(1111, res);
      }
    })
  }
  const switchSign = () => {
    if (timeIntervalFlag == 1) {
      setTimeIntervalFlag(0);
    } else {
      setTimeIntervalFlag(1);
      setStartTime1('');
      setStartTime2('');
      setStartTime3('');
      setEndTime1('');
      setEndTime2('');
      setEndTime3('')
    }

  }
  const switchCall = () => {
    if (callingFlag == 1) {
      setCallingFlag(0);
    } else {
      setCallingFlag(1);
    }
  }
  const decreaseSign = (index) => {
    if(index===0){
      setStartTime1('');
      setEndTime1('');
    }else if(index===1){
      setStartTime2('');
      setEndTime2('');
    }else{
      setStartTime3('');
      setEndTime3('')
    }

    timeArr.splice(index, 1);
    setTimeArr([...timeArr]);
    setIndex(index - 1);
  }
  const addSignTime = () => {
    if (timeArr.length > 2) {
      Taro.showToast({
        title: '最多添加三个签到时间段',
        icon: 'none'
      })
      return;
    }

    timeArr.push(<View/>)
    setTimeArr([...timeArr]);

  }

  const showStartTimePicker = (e) => {
    setStartTime1(e.detail.value+`:00`);
  }
  const showStartTimePicker1 = (e) => {
    setStartTime2(e.detail.value+`:00`);
  }
  const showStartTimePicker2 = (e) => {
    setStartTime3(e.detail.value+`:00`);
  }
  const showEndTimePicker = (e) => {
    setEndTime1(e.detail.value+`:00`);
  }
  const showEndTimePicker1 = (e) => {
    setEndTime2(e.detail.value+`:00`);
  }
  const showEndTimePicker2 = (e) => {
    setEndTime3(e.detail.value+`:00`);
  }
  return (
    <ScrollView scrollY={true} className='create-sign-act-box'>
      <View className='create-sign-act-main'>
        <ListRow style='margin-right:43PX' className='list-row-input' type='text' onInput={(e) => {
          setActTopic(e.detail.value);
        }} label='活动名称' placeholder='请输入活动名称(10个字以内)'/>
        <Picker mode='date' start={moment().format('YYYY-MM-DD')} onChange={showStartDatePicker}>
          <View className='layout'>
            <View className='layout-fl'>
              <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
                <Text style='color:#333;font-size:14PX;margin-right:43PX;'>开始日期</Text>
                <Input value={startDate} type='text' disabled={true} style='flex:1' className='list-row-input'
                       placeholder='请选择签到开始日期'/>
              </View>
              <Image src={Calendar} style='width:13PX;height:13PX'/>
            </View>
          </View>
          <View className='line'/>
        </Picker>
        <Picker mode={'date'} start={moment().format('YYYY-MM-DD')} onChange={showEndDatePicker}>
          <View className='layout'>
            <View className='layout-fl'>
              <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
                <Text style='color:#333;font-size:14PX;margin-right:43PX'>结束日期</Text>
                <Input value={endDate} disabled={true} type='text' style='flex:1' className='list-row-input'
                       placeholder='请选择签到结束日期'/>
              </View>
              <Image src={Calendar} style='width:13PX;height:13PX'/>
            </View>
          </View>
          <View className='line'/>
        </Picker>
        <View className='layout' onClick={switchSign}>
          <View className='layout-fl'>
            <Text style='color:#333;font-size:14PX;margin-right:43PX'>签到时间区间</Text>
            <Image src={timeIntervalFlag == 0 ? Open : Close} style='width:40PX;height:22PX'/>
          </View>
        </View>
        <View className='line' style='margin-left:20PX;margin-right:20PX'/>
        {timeIntervalFlag == 0 && timeArr.length !== 0 && timeArr.map((item, index) => {
          let time = moment().format('hh:mm');
          return (
            <View style='display:flex;flex-direction:column;'>
              <View style='display:flex;flex-direction:column; background:#fff;height:69.5PX;justify-content:center'>
                <View
                  style='margin-left:20PX;margin-right:20PX; display:flex;align-items:center;justify-content:space-between'>
                  <View style='display:flex;flex-direction:row;flex:1'>
                    <View style='display:flex;flex-direction:column;flex:1'>
                      <Picker mode='time'
                              value={time} onChange={index === 0 ? showStartTimePicker : index === 1 ? showStartTimePicker1 : showStartTimePicker2}>
                        <View style='display:flex;align-items:center;flex:1'>
                          <Text
                            style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到{index+1}
                            开始时间</Text>
                          <Input disabled={true} value={index===0?startTime1:index===1?startTime2:startTime3}
                                 style='flex:1;color:#666;font-size:12PX;text-align:right;' type='text'
                                 placeholder={'请选择开始时间'}
                                 placeholderClass='list-row-input-placeholder1'/>

                        </View>
                      </Picker>
                      <Picker mode='time'
                              value={time}
                              onChange={index === 0 ? showEndTimePicker : index === 1 ? showEndTimePicker1 : showEndTimePicker2}>
                        <View style='margin-top:15PX; display:flex;align-items:center;flex:1'>
                          <Text
                            style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到{index+1}
                            结束时间</Text>
                          <Input disabled={true} value={index===0?endTime1:index===1?endTime2:endTime3}
                                 style='color:#666;font-size:12PX;flex:1;text-align:right;' type='text'
                                 placeholder={'请选择结束时间'}
                                 placeholderClass='list-row-input-placeholder1'/>

                        </View>
                      </Picker>
                    </View>
                  </View>
                  <Image onClick={() => decreaseSign(index)} src={Decrease}
                         style='margin-left:7PX;width:20PX; height:20PX'/>
                </View>
              </View>
              <View className='line' style='margin-left:20PX;margin-right:20PX'/>
            </View>

          )
        })}
        {timeIntervalFlag == 0 && <View style='display:flex;height:40PX;background:#fff;' onClick={addSignTime}>
          <View style='display:flex;align-items:center;margin:auto;'>
            <Image src={Increase} style='width:20PX;height:20PX'/>
            <Text
              style='margin-left:4PX;font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>添加签到时间段</Text>
          </View>
        </View>}
        <View className='line' style='margin-left:20PX;margin-right:20PX'/>
        <View className='layout' onClick={getLocation}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>活动地点</Text>
              <Input disabled={true} value={area} type='text' style='flex:1' className='list-row-input'
                     placeholder='请选择活动地点'/>
            </View>
            <Image src={Location} style='width:13PX;height:16.5PX'/>
          </View>
        </View>
        <View className='line'/>
        <View className='layout' onClick={switchCall}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>叫号系统</Text>
              <Input disabled={true} type='text' style='flex:1' className='list-row-input' placeholder='签到成功后电脑端叫号'/>
            </View>
            <Image src={callingFlag == 0 ? Open : Close} style='width:40PX;height:22PX'/>
          </View>
        </View>
        <View className='line'/>
        <View style='margin-top:10PX;padding-left:20PX'>
          <Text
            style='font-family: PingFangSC-Regular;font-size: 14PX;color: #999999;letter-spacing: 0.18px;'>叫号系统需要外接设备，才能呼叫号源</Text>
        </View>
        <View className='btn-next-view' onClick={generateSign}>
          <Text className='btn-next-text'>生成签到码</Text>
        </View>
        <View style='display:flex;margin-top:15PX'>
          <View style=' margin:auto; display:flex;align-items:center'>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #E02020;letter-spacing: 0.18PX;'>免费用户同时最多可以创建3个活动，</Text>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>立即购买</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )

}
export default OrgSignAct;
