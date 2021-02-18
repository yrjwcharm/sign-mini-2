import React, {Component, useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './create.scss'
import OrgAct from "../org-act/org-act";
import CreateSignAct from "../create-sign-act/create-sign-act";
const Create =()=>{
  const [orgSelected,setOrgSelected] =useState(true);
  const [personalSelected,setPersonalSelected] =useState(false);
  useLayoutEffect(()=>{
    Taro.setNavigationBarTitle({
      title:'创建签到活动'
    })
  },[])
    const _orgSelected =()=>{
      setPersonalSelected(false)
      setOrgSelected(true);
    }
    const _personalSelected =()=>{
    setPersonalSelected(true);
    setOrgSelected(false);

    }
    return (
      <View className='create-box'>
        <View className='header'>
          <View className='org-view' style={orgSelected?'border-bottom: 2PX solid #06B48D;':'border-bottom:0'} onClick={_orgSelected}>
            <Text className='org-text' style={orgSelected?'color: #06B48D;':'color:#333'}>机构/团体活动</Text>
          </View>
          <View className='personal-act-view' style={personalSelected?'border-bottom: 2PX solid #06B48D;':'border-bottom:0'} onClick={_personalSelected}>
            <Text className='personal-act-text' style={personalSelected?'color: #06B48D;':'color:#333'}>个人活动</Text>
          </View>
        </View>
        <View style='margin-top:20PX'>
          {orgSelected?<OrgAct/>:<CreateSignAct/>}
        </View>
      </View>
    );
}
export default Create
