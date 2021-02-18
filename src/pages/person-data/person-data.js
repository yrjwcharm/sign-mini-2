import React, {useEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Input, Text, View} from "@tarojs/components";
import {isEmpty} from "../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../utils/RegUtil";
import './person-data.scss'
import Api from '../../config/api'
import ListRow from "../../components/ListRow";
import  '../../components/ListRow.scss'
import {getImgCodeApi, saveUserInfoApi} from "../../services/SyncRequest";
const PersonData = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [code, setCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [imgCode, setImgCode] = useState('');
  useEffect(()=>{
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    getImageCode();
  },[])
  const getImageCode = async () => {
    const userInfo = Taro.getStorageSync('userInfo');
    const {openId} =userInfo;
    Taro.request({
      url: Api.getImgCode+`?openId=${openId}`,
      data: {code},
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      responseType: 'arraybuffer',
      success: function (res) {
        let url ='data:image/png;base64,'+Taro.arrayBufferToBase64(res.data);
        setImgCode(url);
      }
    })
  }
  const nextStep = async () => {
    if (isEmpty(name)) {
      Taro.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (isEmpty(phone)) {
      Taro.showToast({
        title: '手机号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isMobile(phone)) {
      Taro.showToast({
        title: '手机号输入有误，请重新输入',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(idCard)) {
      Taro.showToast({
        title: '身份证号码不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isIdCard(idCard)) {
      Taro.showToast({
        title: '身份证号输入有误，请重新输入',
        icon: 'none',
      })
      return;
    }
    if(isEmpty(verifyCode)){
      Taro.showToast({
        title: '验证码不能为空',
        icon: 'none',
      })
      return;
    }

    Taro.showLoading({
      title:'请稍等...'
    })
    const {openId} = Taro.getStorageSync('userInfo');
    const res =await saveUserInfoApi({
      idCard, // 身份证号
      username:name,
      mobile:phone,  // 手机号
      verifyCode,     // 验证码
      openId   // openID
    })
    Taro.hideLoading();
    if(res.code==200){
      Taro.eventCenter.trigger('updateUserData',true);
      Taro.navigateBack({
         delta:1
       })
    }else{
      Taro.showToast({
        title:res.msg,
        icon:'none'
      })
    }


  }
  return (
    <View className='personal-box'>
      <View className='main'>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='姓名' style='margin-right:71PX' placeholder='请输入姓名'/>
        <ListRow className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='电话' style='margin-right:71PX' placeholder='请输入手机号码'/>
        <ListRow className='list-row-input' type='idcard' onInput={(e) => {
          setIdCard(e.detail.value);
        }} label='身份证号'  style='margin-right:43PX' placeholder='请输入身份证号'/>
        <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
              <View style='display:flex;align-items:center;flex:1;'>
                <Text className='list-row-text'>验证码</Text>
                <Input type='text' style='padding-left:57px;flex:1;' className='list-row-input' onInput={(e) => {
                  setVerifyCode(e.detail.value);
                }} placeholder={'请输入验证码'}
                       placeholderClass='list-row-input-placeholder'/>
              </View>
              <View className='code-view' onClick={getImageCode}>
                <Image src={imgCode} className='img-code'/>
              </View>
            </View>
          </View>
          <View className='line'/>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={nextStep}>
          <Text className='btn-submit-text'>保存</Text>
        </View>
      </View>
    </View>
  )
}
export default PersonData;
