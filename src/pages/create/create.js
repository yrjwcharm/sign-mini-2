import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './create.scss'
import OrgAct from "../org-act/org-act";
import PersonalAct from "../../personal-act/personal-act";
import {getCompanyInfoApi} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";
import OrgSignAct from "../org-sign-act/org-sign-act";
const Create = () => {
  const [data,setData] = useState('');
  const [orgSelected, setOrgSelected] = useState(true);
  const [personalSelected, setPersonalSelected] = useState(false);
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '创建签到活动'
    })
  }, [])
  useEffect(()=>{
    _getCompanyInfo();
  },[])
  const _orgSelected = () => {
    setPersonalSelected(false)
    setOrgSelected(true);
  }
  const _personalSelected = () => {
    setPersonalSelected(true);
    setOrgSelected(false);

  }
  const _getCompanyInfo=async ()=>{
    const {userId} = Taro.getStorageSync('userInfo');
    console.log(333,userId);
    const res = await  getCompanyInfoApi(userId);
    if(res.code==200){
      setData(res.data);
    }

  }
  return (
    <View className='create-box'>
      <View className='header'>
        <View className='org-view' style={orgSelected ? 'border-bottom: 2PX solid #06B48D;' : 'border-bottom:0'}
              onClick={_orgSelected}>
          <Text className='org-text' style={orgSelected ? 'color: #06B48D;' : 'color:#333'}>机构/团体活动</Text>
        </View>
        <View className='personal-act-view'
              style={personalSelected ? 'border-bottom: 2PX solid #06B48D;' : 'border-bottom:0'}
              onClick={_personalSelected}>
          <Text className='personal-act-text' style={personalSelected ? 'color: #06B48D;' : 'color:#333'}>个人活动</Text>
        </View>
      </View>
      <View style='margin-top:20PX'>
        {orgSelected?isEmpty(data)?<OrgAct/>:<OrgSignAct/>:<PersonalAct/>}
      </View>
    </View>
  );
}
export default Create
