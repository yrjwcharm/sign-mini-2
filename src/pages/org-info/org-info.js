import React, {Component, useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './org-info.scss'
import Location from '@assets/location.png'
import ListRow from "../../components/ListRow";
import Edit from '@assets/edit.svg'
const OrgInfo =()=>{
  const[area,setArea] =useState('北京朝阳区百子湾街道6号院9号楼908');
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
  const edit =()=>{
    setDistrictId(false);
  }
  return (
    <View className='orgInfo-box'>
      <View className='org-info-main' style='margin-top:11PX'>
        <View className='org-detail'>
          <ListRow noBorder disabled={disabled} className='list-row-input' type='text' onInput={(e) => {
            setOrgName(e.detail.value);

          }} label='机构名称' style='margin-right:43PX' placeholder='请输入机构名称'/>
          <ListRow noBorder disabled={disabled} className='list-row-input' type='text' onInput={(e) => {
            setName(e.detail.value);

          }} label='联系人' style='margin-right:57PX' placeholder='请输入联系人'/>
          <ListRow noBorder disabled={disabled} className='list-row-input' type='number' onInput={(e) => {
            setPhone(e.detail.value);
          }}  label='联系电话' style='margin-right:43PX' placeholder='请输入手机号码'/>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center;flex:1;'>
                  <Text className='dist-name-text' style='margin-right:43PX'>办公地址</Text>
                  <Text className='select-city-text'
                        style={area === '请选择所属区域' ? 'color:#999' : 'color:#666'}>{area}</Text>
                </View>
                {!disabled&&<Image src={Location} className='location'/>}
              </View>
            </View>
            {/*<View className='line'/>*/}
          </View>
        <View style='display:flex;justify-content:flex-end;margin-top:10PX; margin-right:20PX' onClick={edit}>
          <View style='display:flex;align-items:center;'>
            <Image src={Edit} style='width:12PX;height:12PX'/>
            <Text style='color:#06B48D;font-size:14PX;margin-left:7PX'>编辑</Text>
          </View>
        </View>
        </View>
      </View>
    </View>
  )
}
export default OrgInfo;
