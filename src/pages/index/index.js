import React, {Component} from 'react'
import {View, Text} from '@tarojs/components'
import Taro from "@tarojs/taro";
import {AtTabBar} from "taro-ui";
import HomePage from '../home/home'
import UserPage from '../user/user'
import CreatePage from '../create/create'
import HomeActive from '@assets/tab-bar/home-active.png'
import CreateActive from '@assets/tab-bar/create-active.png'
import Create from '@assets/tab-bar/create.png'
import Home from '@assets/tab-bar/home.png'
import UserActive from '@assets/tab-bar/user-active.png'
import User from '@assets/tab-bar/user.png'
import './index.scss'
import {getUserInfoApi} from "../../services/SyncRequest";
export default class Index extends Component {
  constructor() {
    super();
    this.state={
      current:0,
    }
  }

  handleClick= (value)=> {
    this.setState({
      current: value
    })
  }
  render() {
    const {current}=this.state;
    return (
      <View className={'index-box'}>
        {current==0&&<HomePage />}
        {current==1&&<CreatePage/>}
        {current==2&&<UserPage/>}
        <AtTabBar
          fixed
          // customStyle={{fontWeight:'bold'}}
          color={'#999'}
          selectedColor={'#06B48D'}
          iconSize={20}
          tabList={[
            { title: '首页', image:Home,selectedImage:HomeActive },
            { title: '创建', image:Create,selectedImage:CreateActive },
            { title: '我的',image:User,selectedImage:UserActive },
          ]}
          fontSize={12}
          onClick={(value)=>this.handleClick(value)}
          current={this.state.current}

        />
      </View>
    )
  }
}
