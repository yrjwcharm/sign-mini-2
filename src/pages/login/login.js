import Taro from '@tarojs/taro';
import {Button, Image, Text, View} from '@tarojs/components';
import './login.scss';
import React, {Component} from "react";
import {AtModal, AtModalAction} from "taro-ui";

class Login extends Component {
  constructor() {
    super();
  }

  wxLogin = (e) => {
    if (e.detail.userInfo) {
      console.log(333, e);
      Taro.setStorageSync('userInfo', e.detail.userInfo)
    }
  }
  render() {
    return (
      <View className='container'>
        <View className='main'>
          <View className='login-box'>
            {/*<Image src={Icon} className='hospital-img'/>*/}
            <Text className='hospital'>小佑极速签到</Text>
            <View className='line'/>
          </View>
          <View className='wrap_line' cl>
            <View className='line'/>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='auth'>登录后开发者将获得以下权限</Text>
            </View>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='info'>·获得你的公开信息（昵称、头像等）</Text>
            </View>
          </View>
          <Button type='primary' openType='getUserInfo' className='wx-login-btn'
                  onGetUserInfo={this.wxLogin}>确认登录</Button>
        </View>
      </View>
    );
  }
}

export default Login;
