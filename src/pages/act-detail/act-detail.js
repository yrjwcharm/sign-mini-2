import React, {useEffect, useState} from "react";
import {Image, Input, Picker, ScrollView, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import '../../components/ListRow.scss'
import './act-detail.scss'
import Location from '@assets/location.png'
import Decrease from '@assets/decrease.png';
import Increase from '@assets/increase.png';
import Close from '@assets/close.png'
import Open from '@assets/open.png'
import Calendar from '@assets/calendar.png'
import Api from "../../config/api";
import moment from 'moment'
import {tdist} from "../../common/js/utils";

const ActDetail = () => {
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
  const [timeIntervalFlag, setTimeIntervalFlag] = useState("0");
  const [callingFlag, setCallingFlag] = useState("0");
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [index, setIndex] = useState(0);
  const [startTime, setStateTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(0);
  useEffect(() => {
    const {activity} = Taro.getCurrentInstance().router.params;
    const item = JSON.parse(activity);
    const {
      activityName,
      areaCode,
      callingFlag,
      cityCode,
      companyId,
      detailedAddr,
      endDate,
      endTime1,
      endTime2,
      endTime3,
      provinceCode,
      signActivityId,
      startDate,
      startTime1,
      startTime2,
      startTime3,
      timeIntervalFlag,
      useflag,
      userId,
    } = item;
    setActTopic(activityName);
    setCallingFlag(callingFlag);
    setCityId(cityCode);
    setProvinceId(provinceCode);
    setStartDate(startDate.substring(0,startDate.lastIndexOf(' ')));
    setEndDate(endDate.substring(0,endDate.lastIndexOf(' ')));
    setTimeIntervalFlag(timeIntervalFlag);
    let provinceName = '', cityName = '', areaName = '';
    if (provinceCode && cityCode && areaCode) {
      tdist.getLev1().forEach(p => {
        if (p.id == provinceCode) {
          provinceName = p.text;
          tdist.getLev2(p.id).forEach(c => {
            if (c.id == cityCode) {
              cityName = c.text
              tdist.getLev3(c.id).forEach(q => {
                  if (q.id == areaCode) {
                    areaName = q.text
                  }
                }
              )
            }
          })
        }
      })
      setArea(provinceName + cityName + areaName);
    }
    if (startTime1 && endTime1) {
      pushTime(startTime1, endTime1)
    }
    if (startTime2 && endTime2) {
      pushTime(startTime2, endTime2)
    }
    if (startTime3 && endTime3) {
      pushTime(startTime3, endTime3)
    }
  }, [])
  const pushTime = (start, end) => {
    let startTime = start.substring(start.indexOf(' ') + 1, start.lastIndexOf(':'));
    let endTime = end.substring(end.indexOf(' ') + 1, end.lastIndexOf(':'));
    let time = `${startTime}-${endTime}`
    timeArr.push(time);
    // setTimeArr([...timeArr])
  }
  const showStartDatePicker = (e) => {
    setStartDate(e.detail.value);
  }
  const showEndDatePicker = (e) => {
    setEndDate(e.detail.value);

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
    // if (callingFlag == 1) {
    //   setCallingFlag(0);
    // } else {
    //   setCallingFlag(1);
    // }
  }
  const showStartTimePicker = (e) => {
    setStartTime1(e.detail.value + `:00`);
  }
  const showStartTimePicker1 = (e) => {
    setStartTime2(e.detail.value + `:00`);
  }
  const showStartTimePicker2 = (e) => {
    setStartTime3(e.detail.value + `:00`);
  }
  const showEndTimePicker = (e) => {
    setEndTime1(e.detail.value + `:00`);
  }
  const showEndTimePicker1 = (e) => {
    setEndTime2(e.detail.value + `:00`);
  }
  const showEndTimePicker2 = (e) => {
    setEndTime3(e.detail.value + `:00`);
  }
  return (
    <ScrollView scrollY={true} className='create-sign-act-box'>
      <View className='create-sign-act-main'>
        <ListRow value={actTopic} disabled={true} style='margin-right:43PX' className='list-row-input' type='text' onInput={(e) => {
          setActTopic(e.detail.value);
        }} label='活动名称' placeholder='请输入活动名称(10个字以内)'/>
        <Picker mode='date' disabled={true} start={moment().format('YYYY-MM-DD')} onChange={showStartDatePicker}>
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
          {/*<View className='line'/>*/}
        </Picker>
        <Picker mode={'date'} disabled={true} start={moment().format('YYYY-MM-DD')} onChange={showEndDatePicker}>
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
          {/*<View className='line'/>*/}
        </Picker>
        <View className='layout' onClick={switchSign}>
          <View className='layout-fl'>
            <Text style='color:#333;font-size:14PX;margin-right:43PX'>签到时间区间</Text>
            <Image src={timeIntervalFlag == 1 ? Open : Close} style='width:45PX;height:22PX'/>
          </View>
        </View>
        <View className='line' style='margin-left:20PX;margin-right:20PX'/>
        {timeIntervalFlag == 1 && timeArr.length !== 0 && timeArr.map((item, index) => {
          console.log(333,item)
          let timeArr = item&&item.split('-');
          return (
            <View style='display:flex;flex-direction:column;'>
              <View style='display:flex;flex-direction:column; background:#fff;height:69.5PX;justify-content:center'>
                <View
                  style='margin-left:20PX;margin-right:20PX; display:flex;align-items:center;justify-content:space-between'>
                  <View style='display:flex;flex-direction:row;flex:1'>
                    <View style='display:flex;flex-direction:column;flex:1'>
                      <Picker disabled={true} mode='time'
                              value={moment().format('hh:mm')}
                              onChange={index === 0 ? showStartTimePicker : index === 1 ? showStartTimePicker1 : showStartTimePicker2}>
                        <View style='display:flex;align-items:center;flex:1'>
                          <Text
                            style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到{index + 1}
                            开始时间</Text>
                          <Input disabled={true}
                                 value={timeArr[0]}
                                 style='flex:1;color:#666;font-size:12PX;text-align:right;' type='text'
                                 placeholder={'请选择开始时间'}
                                 placeholderClass='list-row-input-placeholder1'/>

                        </View>
                      </Picker>
                      <Picker disabled={true} mode='time'
                              value={moment().format('hh:mm')}
                              onChange={index === 0 ? showEndTimePicker : index === 1 ? showEndTimePicker1 : showEndTimePicker2}>
                        <View style='margin-top:15PX; display:flex;align-items:center;flex:1'>
                          <Text
                            style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到{index + 1}
                            结束时间</Text>
                          <Input disabled={true} value={timeArr[1]}
                                 style='color:#666;font-size:12PX;flex:1;text-align:right;' type='text'
                                 placeholder={'请选择结束时间'}
                                 placeholderClass='list-row-input-placeholder1'/>

                        </View>
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
              <View className='line' style='margin-left:20PX;margin-right:20PX'/>
            </View>

          )
        })}
        {/*{timeIntervalFlag == 1 && <View style='display:flex;height:45PX;background:#fff;' onClick={addSignTime}>*/}
        {/*  <View style='display:flex;align-items:center;margin:auto;'>*/}
        {/*    <Image src={Increase} style='width:20PX;height:20PX'/>*/}
        {/*    <Text*/}
        {/*      style='margin-left:4PX;font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>添加签到时间段</Text>*/}
        {/*  </View>*/}
        {/*</View>}*/}
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
        {/*<View className='line'/>*/}
        <View className='layout' onClick={switchCall}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>叫号系统</Text>
              <Input disabled={true} type='text' style='flex:1' className='list-row-input' placeholder='签到成功后电脑端叫号'/>
            </View>
            <Image src={callingFlag == 1 ? Open : Close} style='width:45PX;height:22PX'/>
          </View>
        </View>
        {/*<View className='line'/>*/}
        <View style='margin-top:10PX;padding-left:20PX'>
          <Text
            style='font-family: PingFangSC-Regular;font-size: 14PX;color: #999999;letter-spacing: 0.18px;'>叫号系统需要外接设备，才能呼叫号源</Text>
        </View>
      </View>
    </ScrollView>
  )

}
const ListRow = (props) => {
  const {label, placeholder, disabled, noBorder, value, style, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text' style={style}>{label}</Text>
          <Input disabled={disabled} value={value} style='flex:1' type={type} className={className} onInput={onInput}
                 placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'/>
        </View>
      </View>
      {!noBorder && <View className='line'/>}
    </View>
  )
}
export default ActDetail;
