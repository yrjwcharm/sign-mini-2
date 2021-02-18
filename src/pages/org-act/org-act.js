import Taro from '@tarojs/taro'
import {Image, Input, Text, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import Location from '@assets/location.png';
import {isEmpty} from "../../utils/EmptyUtil";
import Api from '../../config/api'
import './org-act.scss'
import ListRow from "../../components/ListRow";
import '../../components/ListRow.scss'
import {saveCompanyInfoApi} from "../../services/SyncRequest";
import {isMobile} from "../../utils/RegUtil";
const OrgAct = () => {
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
  const [area, setArea] = useState('请选择所属区域');
  const [verifyCode, setVerifyCode] = useState('');
  useEffect(() => {
    _initData();
    getImageCode();
  }, [])
  const _initData = async () => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
  }
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
    if (isEmpty(verifyCode)) {
      Taro.showToast({
        title: '验证码不能为空',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(provinceid) && isEmpty(cityid) && isEmpty(districtid)) {
      Taro.showToast({
        title: '请选择所属区域',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(streetdesc)) {
      Taro.showToast({
        title: '详细地址不能为空',
        icon: 'none',
      })
      return;
    }
    Taro.showLoading({
      title:'请稍等...'
    })
    const {openId,userId} = Taro.getStorageSync('userInfo');
    const res = await  saveCompanyInfoApi({
      openId,	// openid
      verifyCode,					// 验证码
      companyName:orgName,				// 企业名称
      userId,			// 用户id  // 必传
      contactUsername:name,
      contactPhone:phone,       	// 联系人电话
      provinceCode:provinceid,				// 省编码
      cityCode:cityid,					// 市编码
      areaCode:districtid,					// 区编码
      detailedAddress:streetdesc  // 详细地址
    })
    Taro.hideLoading();
    console.log(333,res.data);
    if(res.code==200) {
      Taro.navigateTo({
        url:'/pages/create-sign-act/create-sign-act?type=1'
      })
    }else{
      Taro.showToast({
        title:res.msg,
        icon:'none'
      })
    }
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
          confirmColor:'#06B48D',
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
  return (
    <View className='container'>
      <View className='main'>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setOrgName(e.detail.value);

        }} label='机构名称' style='margin-right:43PX' placeholder='请输入机构名称'/>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='联系人' style='margin-right:57PX' placeholder='请输入联系人'/>
        <ListRow className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='手机号' style='margin-right:57PX' placeholder='请输入手机号码'/>
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
        <View className='address-info-container' onClick={getLocation}>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text' style='margin-right:43PX'>办公地址</Text>
                <Text className='select-city-text'
                      style={area === '请选择所属区域' ? 'color:#999' : 'color:#666'}>{area}</Text>
              </View>
              <Image src={Location} className='location'/>
            </View>
          </View>
          <View className='line'/>
        </View>
        <ListRow style='margin-right:43PX' className='list-row-input' type='number' onInput={(e) => {
          setStreetDesc(e.detail.value);
        }} label='详细地址' placeholder='街道、楼牌号等'/>
        <View className='btn-next-view' onClick={nextStep}>
          <Text className='btn-next-text'>下一步</Text>
        </View>
      </View>
    </View>
  )
}

export default OrgAct
