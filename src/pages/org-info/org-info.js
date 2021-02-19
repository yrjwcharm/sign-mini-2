import React, {Component, useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Input, Text, View} from "@tarojs/components";
import './org-info.scss'
import Location from '@assets/location.png'
import Edit from '@assets/edit.svg'
import {getCompanyInfoApi, updateCompanyInfoApi} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";
import {isMobile} from "../../utils/RegUtil";
import Api from "../../config/api";
const OrgInfo =()=>{
  const[companyId,setCompanyId] = useState('');
  const[area,setArea] =useState('');
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [imgCode, setImgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [disabled ,setDisabled] = useState(true);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'机构信息维护'
    })
  },[])
  useEffect(()=>{
    getCompanyInfo();
  },[])
  const getCompanyInfo=async ()=>{
    const {userId} = Taro.getStorageSync('userInfo');
    console.log(333,userId);
    const res = await  getCompanyInfoApi(userId);
    console.log(333,res);
    if(res.code==200){
      const {
      areaCode,
      cityCode,
      companyId,
      companyName,
      contactPhone,
      contactUsername,
      ctstamp,
      detailedAddress,
      provinceCode,
      remark
      } = res.data||{};
      companyName&&setOrgName(companyName);
      contactPhone&&setPhone(contactPhone);
      contactUsername&&setName(contactUsername);
      companyId&&setCompanyId(companyId);
      detailedAddress&&setArea(detailedAddress);
      areaCode&&setDistrictId(areaCode),
      cityCode&&setCityId(cityid),
      provinceCode&&setProvinceId(provinceCode);

    }
  }
  const edit =async ()=>{
    setDisabled(false);
    if(isEmpty(companyId)){
      return;
    }
    if(isEmpty(orgName)){
      Taro.showToast({
        title: '机构名称不能为空',
        icon: "none"
      })
      return;
    }
    if (isEmpty(name)) {
      Taro.showToast({
        title: '联系人不能为空',
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
        title: '手机号码输入有误，请重新输入',
        icon: 'none',
      })
      return;
    }
    Taro.showLoading({
      title:'请稍等...'
    })
    const res  = await updateCompanyInfoApi({
      companyId,
      companyName:orgName,
      contactUsername:name,
      contactPhone:phone
    })
    console.log(333,res);
    if(res.code==200){
      Taro.hideLoading();
      setDisabled(true);
      Taro.navigateBack({
        delta:1
      })
    }
  }
  // const getLocation = () => {
  //   Taro.getSetting({
  //     success: function (res) {
  //       if (!res.authSetting['scope.userLocation']) {
  //         authorize();
  //       } else {
  //         _chooseLocation();
  //       }
  //     },
  //   })
  //
  // }
  // const authorize = () => {
  //   Taro.authorize({
  //     scope: 'scope.userLocation',
  //     success: function () {
  //       // 用户已经同意小程序使用录音功能，后续调用 Taro.chooseLocation 接口不会弹窗询问
  //       _chooseLocation();
  //     },
  //     fail: function (res) {
  //       Taro.showModal({
  //         title: '权限开启',
  //         confirmColor:'#06B48D',
  //         content: '是否允许开启位置权限?',
  //         success: function (res) {
  //           if (res.confirm) {
  //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
  //             _openSetting();
  //           }
  //         }
  //       })
  //     }
  //   })
  // }
  // const _openSetting = () => {
  //   Taro.openSetting({
  //     success: function (res) {
  //       if (!res.authSetting['scope.userLocation']) {
  //
  //       }
  //     }
  //   })
  // }
  // const _chooseLocation = () => {
  //   Taro.chooseLocation({
  //     success: function (res) {
  //       const {address, latitude, longitude} = res;
  //       let url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${Api.key}&radius=1000&extensions=all&roadlevel=1`
  //       Taro.request({
  //         url,
  //         data: {},
  //         method: 'GET',
  //         header: {
  //           'content-type': 'application/json' // 默认值
  //         },
  //         success: function (res) {
  //           const data = res.data;
  //           if (data.infocode == 10000) {
  //             const res = data.regeocode.addressComponent
  //             let provinceId = res.adcode.substring(0, 2) + '0000';
  //             let cityId = res.adcode.substring(0, 4) + '00';
  //             let districtId = res.adcode;
  //             setArea(address);
  //             setProvinceId(provinceId);
  //             setCityId(cityId);
  //             setDistrictId(districtId);
  //           }
  //         }
  //       })
  //
  //
  //     },
  //     complete: function (res) {
  //       console.log(333, res);
  //     },
  //     fail: function (res) {
  //       console.log(1111, res);
  //     }
  //   })
  // }

  return (
    <View className='orgInfo-box'>
      <View className='org-info-main' style='margin-top:11PX'>
        <View className='org-detail'>
          <ListRow noBorder={disabled} value={orgName} disabled={disabled} className='list-row-input' type='text' onInput={(e) => {
            setOrgName(e.detail.value);

          }} label='机构名称' style='margin-right:43PX' placeholder='请输入机构名称'/>
          <ListRow noBorder={disabled} value={name} disabled={disabled} className='list-row-input' type='text' onInput={(e) => {
            setName(e.detail.value);

          }} label='联系人'  style='margin-right:57PX' placeholder='请输入联系人'/>
          <ListRow noBorder={disabled} disabled={disabled} className='list-row-input' type='number' onInput={(e) => {
            setPhone(e.detail.value);
          }}  label='联系电话' value={phone} style='margin-right:43PX' placeholder='请输入手机号码'/>
          <View className='address-info-container' onClick={getLocation}>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text' style='margin-right:43PX'>办公地址</Text>
                  <Text className='select-city-text'
                        style={area === '' ? 'color:#999' : 'color:#666'}>{isEmpty(area)?'请选择所属区域':area}</Text>
                </View>
                {!disabled&&<Image src={Location} className='location'/>}
              </View>
            </View>
            {!disabled&&<View className='line'/>}
          </View>
        <View style='display:flex;justify-content:flex-end;margin-top:10PX; margin-right:20PX' onClick={edit}>
          <View style='display:flex;align-items:center;'>
            <Image src={Edit} style='width:12PX;height:12PX'/>
            <Text style='color:#06B48D;font-size:14PX;margin-left:7PX'>{disabled?'编辑':'保存'}</Text>
          </View>
        </View>
        </View>
      </View>
    </View>
  )
}
const ListRow = (props) => {
  const {label, placeholder,disabled,noBorder,value, style, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text' style={style}>{label}</Text>
          <Input disabled={disabled} value={value} style='flex:1' type={type} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'/>
        </View>
      </View>
      {!noBorder&&<View className='line'/>}
    </View>
  )
}
export default OrgInfo;
