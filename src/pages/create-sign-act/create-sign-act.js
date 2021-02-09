import React, {useEffect, useState} from "react";
import {Image, Input, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import ListRow from "../../components/ListRow";
import '../../components/ListRow.scss'
import './create-sign-act.scss'
import Location from '@assets/location.png'
import {AtSwitch} from "taro-ui";
import Decrease from '@assets/decrease.png';
import Increase from '@assets/increase.png';
import Close from '@assets/close.png'
import Open from '@assets/open.png'
import Calendar from '@assets/calendar.png'
const CreateSignAct = () => {
  const [actTopic, setActTopic] = useState('');
  const [timeFor, setTimeFor] = useState([]);
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [isOpenSignSwitch,setIsOpenSignSwitch]=useState(false);
  const [isOpenCallSwitch,setIsOpenCallSwitch] = useState(false);
  useEffect(() => {

  }, [])
  const showStartDatePicker = () => {

  }
  const showEndDatePicker = () => {

  }
  const change = () => {

  }
  const generateSign = () => {
        Taro.navigateTo({
          url:'/pages/sign-qrcode/sign-qrcode'
        })
  }
  const addTimeFor = () => {
      // <View style='display:flex;flex-direction:column;'>
      //   <View style='display:flex;flex-direction:column; background:#fff;height:69.5PX;justify-content:center'>
      //     <View
      //       style='margin-left:20PX;margin-right:20PX; display:flex;align-items:center;justify-content:space-between'>
      //       <View style='display:flex;flex-direction:column;'>
      //         <Text style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到1
      //           开始时间</Text>
      //         <Text
      //           style='margin-top:15PX; font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>签到2
      //           结束时间</Text>
      //       </View>
      //       <View style='display:flex;align-items:center;'>
      //         <View style='display:flex;flex-direction:column;'>
      //           <Text
      //             style='font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>8:50</Text>
      //           <Text
      //             style='margin-top:15PX; font-family: PingFangSC-Regular;font-size: 12PX;color: #333333;letter-spacing: 0.18PX;'>9:50</Text>
      //         </View>
      //         <Image src={Decrease} style='margin-left:7PX;width:20PX; height:20PX'/>
      //       </View>
      //     </View>
      //   </View>
      //   <View className='line' style='margin-left:20PX;margin-right:20PX'/>
      // </View>
  }
  const switchSign =()=>{
    setIsOpenSignSwitch(!isOpenSignSwitch);
  }
  const switchCall=()=>{
    setIsOpenCallSwitch(!isOpenCallSwitch);
  }
  return (
    <View className='create-sign-act-box'>
      <View className='create-sign-act-main' style='margin-top:20PX'>
        <ListRow style='margin-right:43PX' className='list-row-input' type='text' onInput={(e) => {
          setActTopic(e.detail.value);

        }} label='签到主题' placeholder='请输入主题名称(10个字以内)'/>
        <View className='layout' onClick={showStartDatePicker}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX;'>开始日期</Text>
              <Input type='text' disabled={true} style='flex:1' className='list-row-input' placeholder='请选择签到开始日期'/>
            </View>
            <Image src={Calendar} style='width:13PX;height:13PX'/>
          </View>
        </View>
        <View className='line'/>
        <View className='layout' onClick={showEndDatePicker}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>结束日期</Text>
              <Input disabled={true} type='text' style='flex:1' className='list-row-input' placeholder='请选择签到结束日期'/>
            </View>
            <Image src={Calendar} style='width:13PX;height:13PX'/>
          </View>
        </View>
        <View className='line'/>
        <View className='layout' onClick={switchSign}>
          <View className='layout-fl'>
            <Text style='color:#333;font-size:14PX;margin-right:43PX'>签到时间区间</Text>
            <Image src={isOpenSignSwitch?Open:Close} style='width:40PX;height:22PX'/>
          </View>
        </View>
        <View className='line' style='margin-left:20PX;margin-right:20PX'/>
        {timeFor.length!==0&&timeFor.map((item, index) => {
          return (
              <View style='display:flex;flex-direction:column;'>
                {item}
              </View>
          )
        })}
        {isOpenSignSwitch&&<View style='display:flex;height:40PX;background:#fff;' onClick={addTimeFor}>
          <View style='display:flex;align-items:center;margin:auto;'>
            <Image src={Increase} style='width:20PX;height:20PX'/>
            <Text
              style='margin-left:4PX;font-family: PingFangSC-Regular;font-size: 14PX;color: #333333;letter-spacing: 0.18PX;'>添加签到时间段</Text>
          </View>
        </View>}
        <View className='line' style='margin-left:20PX;margin-right:20PX'/>
        <View className='layout'>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>活动地点</Text>
              <Input disabled={true} type='text' style='flex:1' className='list-row-input' placeholder='请选择活动地点'/>
            </View>
            <Image src={Location} style='width:13PX;height:16.5PX'/>
          </View>
        </View>
        <View className='line'/>
        <View className='layout' onClick={switchCall}>
          <View className='layout-fl'>
            <View style='display:flex;flex:1;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;margin-right:43PX'>叫号系统</Text>
              <Input type='text' style='flex:1' className='list-row-input' placeholder='签到成功后电脑端叫号'/>
            </View>
            <Image src={isOpenCallSwitch?Open:Close} style='width:40PX;height:22PX'/>
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
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #E02020;letter-spacing: 0.18PX;'>免费用户同时最多可以创建3个服务码，</Text>
            <Text
              style='font-family: PingFangSC-Regular;font-size: 14PX;color: #06B48D;letter-spacing: 0.18PX;'>立即购买</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default CreateSignAct;
