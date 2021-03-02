import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Button, Image, Input, Text, View} from "@tarojs/components";
import './org-info.scss'
import Edit from '@assets/edit.svg'
import {getCompanyInfoApi, resetPwdApi, updateCompanyInfoApi} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";
import {isMobile} from "../../utils/RegUtil";
import Api from "../../config/api";
import Copy from '@assets/copy.svg'
import Location from '@assets/location.png'
import {AtModal, AtModalAction, AtModalContent} from "taro-ui";
const {tdist} = require("@/common/js/utils");
const OrgInfo = () => {
  const [visible, setVisible] = useState(false)
  const [companyId, setCompanyId] = useState('');
  const [area, setArea] = useState('');
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [imgCode, setImgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [contactPhone, setContactPhone] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '机构信息维护'
    })
  }, [])
  useEffect(() => {
    getCompanyInfo();
  }, [])
  const getCompanyInfo = async () => {
    const {userId} = Taro.getStorageSync('userInfo');
    console.log(333, userId);
    const res = await getCompanyInfoApi(userId);
    console.log(333, res);
    if (res.code == 200) {
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
        remark,
        password,
        url
      } = res.data || {};
      companyName && setOrgName(companyName);
      contactPhone && setPhone(contactPhone);
      contactPhone && setContactPhone(contactPhone),
      contactUsername && setName(contactUsername);
      companyId && setCompanyId(companyId);
      detailedAddress && setStreetDesc(detailedAddress);
      areaCode && setDistrictId(areaCode),
      cityCode && setCityId(cityid),
      url && setBackgroundUrl(url);
      password && setPassword(password)
      provinceCode && setProvinceId(provinceCode);
      let provinceName ='',cityName='',areaName='';
      tdist.getLev1().forEach(p => {
        if (p.id === provinceCode) {
          provinceName = p.text;
          tdist.getLev2(p.id).forEach(c => {
            if (c.id === cityCode) {
              cityName = c.text
              tdist.getLev3(c.id).forEach(q => {
                  if (q.id === areaCode) {
                    areaName = q.text
                  }
                }
              )
            }
          })
        }
      })
      (provinceCode&&cityCode&&areaCode)&&setArea(provinceName+cityName+areaName);
    }
  }
  const edit = async () => {
    if (!disabled) {
      if (isEmpty(companyId)) {
        return;
      }
      if (isEmpty(orgName)) {
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
        title: '请稍等...'
      })
      console.log(333, area, provinceid, cityid);
      const res = await updateCompanyInfoApi({
        companyId,
        companyName: orgName,
        contactUsername: name,
        contactPhone: phone,
        provinceCode: provinceid,
        cityCode: cityid,					// 市编码
        areaCode: districtid,					// 区编码
        detailedAddress: area  // 详细地址
      })
      console.log(333, res);
      if (res.code == 200) {
        setDisabled(true)
        getCompanyInfo();
        Taro.showToast({
          title: '修改成功'
        })
      }
    } else {
      setDisabled(false);
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
  const resetPwd = async () => {
    const res = await resetPwdApi({
      companyId
    })
    if (res.code == 200) {
      Taro.showToast({
        title: '重置密码成功',
      })
      setVisible(false);
    }

  }
  const copyUrl = () => {
    Taro.setClipboardData({
      data: backgroundUrl,
      success: function (res) {
        Taro.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  }
  return (
    <View className='orgInfo-box'>
      <View className='org-info-main' style='margin-top:11PX'>
        <View className='org-detail'>
          <ListRow noBorder={disabled} value={orgName} disabled={disabled} className='list-row-input' type='text'
                   onInput={(e) => {
                     setOrgName(e.detail.value);

                   }} label='机构名称' style='margin-right:43PX' placeholder='请输入机构名称'/>
          <ListRow noBorder={disabled} value={name} disabled={disabled} className='list-row-input' type='text'
                   onInput={(e) => {
                     setName(e.detail.value);

                   }} label='联系人' style='margin-right:57PX' placeholder='请输入联系人'/>
          <ListRow noBorder={disabled} disabled={disabled} className='list-row-input' type='number' onInput={(e) => {
            setPhone(e.detail.value);
          }} label='联系电话' value={phone} style='margin-right:43PX' placeholder='请输入手机号码'/>
          <View className='address-info-container' onClick={disabled ? null : getLocation}>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text' style='margin-right:43PX'>办公地址</Text>
                  <Text className='select-city-text'
                        style={area === '' ? 'color:#999' : 'color:#666'}>{isEmpty(area) ? '请选择所属区域' : area}</Text>
                </View>
                {!disabled && <Image src={Location} className='location'/>}
              </View>
            </View>
            {!disabled && <View className='line'/>}
          </View>
          <ListRow style='margin-right:43PX'noBorder={disabled} value={streetdesc} className='list-row-input' type='number' onInput={(e) => {
            setStreetDesc(e.detail.value);
          }} label='详细地址' placeholder='街道、楼牌号等'/>
          <View style='display:flex;justify-content:flex-end;margin-top:10PX; margin-right:20PX' onClick={edit}>
            <View style='display:flex;align-items:center;'>
              <Image src={Edit} style='width:12PX;height:12PX'/>
              <Text style='color:#06B48D;font-size:14PX;margin-left:7PX'>{disabled ? '编辑' : '保存'}</Text>
            </View>
          </View>
        </View>
        <View
          style=' margin-top:11PX;padding-top:20PX;display:flex;background-color:#fff;flex-direction:column;padding-left:20PX;padding-right:20PX'>
          <View style='display:flex;height:45PX; flex-direction:column;justify-content:center;'>
            <View style='display:flex;flex-direction:row;align-items:center'>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text style='color:#333;font-size:14PX;'>后台登录地址</Text>
                <Text style='margin-left:30PX; color:#666;font-size:14PX'>{backgroundUrl}</Text>
              </View>
              <Image src={Copy} onClick={copyUrl} style='width:16PX;height:16PX'/>
            </View>
          </View>
          <View style='display:flex;height:45PX;flex-direction:column;justify-content:center;'>

            <View style='display:flex;flex-direction:row;align-items:center'>
              <Text style='color:#333;font-size:14PX;'>用户名</Text>
              <Text style='margin-left:50PX; color:#666;font-size:14PX'>{contactPhone}</Text>
            </View>
          </View>
          <View style='display:flex;flex-direction:column;'>
            <View style='display:flex; height:45PX;flex-direction:column;justify-content:center;'>

              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text style='color:#333;font-size:14PX;'>默认密码</Text>
                <Text style='margin-left:48PX; color:#666;font-size:14PX'>手机号后8位</Text>
              </View>
            </View>
            <View style='display:flex; height:45PX;flex-direction:column;justify-content:center;'>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text style='font-size:14PX;'>若您忘记修改后的密码，请</Text>
                <Text onClick={() => setVisible(true)} style='margin-left:5PX; font-size:14PX; color:#06B48D'>重置密码</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <AtModal closeOnClickOverlay={false} isOpened={visible} customStyle='border-radius:5PX'>
        <AtModalContent>
          {/*<View style='display:flex;height:45PX;'>*/}
          {/*  <Text style='color:#333;font-size:16PX; margin:auto;'>购买本产品联系方式</Text>*/}
          {/*</View>*/}
          {/*<View className='line'/>*/}
          <View style='padding:20PX;'>
            <Text style='font-size:14px;'>重置密码后登录密码将恢复为默认密码，为保证你的账户安全，请尽快登录叫号系统修改密码，确定重置密码？</Text>
          </View>
        </AtModalContent>
        <AtModalAction> <Button onClick={() => setVisible(false)}>取消</Button> <Button style='color:#06B48D'
                                                                            onClick={resetPwd}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
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
export default OrgInfo;
