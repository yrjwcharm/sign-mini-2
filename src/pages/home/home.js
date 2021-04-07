import React, {Component} from "react";
import Taro from '@tarojs/taro';
import {Image, Text, View} from '@tarojs/components'
import './home.scss'
import {getSignTimesApi, getUserInfoApi, sign} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";
import {login, wxLogin} from "../../services/user";
import {desensitizationMobile} from "../../utils/Common";
import Sign from '@assets/sign.svg'
import Forward from '@assets/forward.png'
import moment  from "moment";
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      FLAG: false,
      mobile: '',
      signTimes:0,
      latestSignTime:'',
    }
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: '小佑极速签到'
    })
  }

  componentDidMount() {
    this._initData();
  }

  _initData = async () => {
    const res = await login();
    const _res = await wxLogin(res.code);
    const {openId,userId} = _res.data;
    const result = await getUserInfoApi(openId);
    console.log(222,userId);
    const _result= await getSignTimesApi(userId);

    if (_res.code == 200) {
      if (result.code == 200) {
        const {username,userId, mobile} = result.data;
        Taro.setStorageSync('userInfo',result.data)
        Taro.setStorageSync('userId',userId);
        if (isEmpty(username)) {
          this.setState({username, mobile, FLAG: true});
        } else {
          this.setState({username, mobile, FLAG: false});
        }

      }
      if(_result.code==200){
        const {todaySignCount,recentSignDate} = _result.data;
        this.setState({latestSignTime:recentSignDate,signTimes:todaySignCount})
      }

    }
  }


  scanQrCode = () => {
    if (isEmpty(this.state.username)) {
      Taro.navigateTo({
        url: '/pages/person-data/person-data'
      })
      return;
    }
    Taro.scanCode({
      success: (res) => {
        const {userId} = Taro.getStorageSync('userInfo');
        if (res.result) {
          console.log(222,res.result)
          if(res.result.indexOf('state')!==-1) {
            let url = res.result + `&userId=${userId}`;
            sign(url).then(res => {
              console.log(333, res);
              if (res.code == 200) {
                Taro.navigateTo({
                  url: '/pages/sign-success/sign-success'
                })
              } else {
                Taro.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            });
          }else {
            Taro.showToast({
              title:'未能识别此二维码，请更换',
              icon:'none',
              duration:3000
            })
          }
        }
      },
      fail: (res => {

      })
    })
  }
  finishPersonalData = () => {
    Taro.navigateTo({
      url: '/pages/person-data/person-data'
    })
  }
  navigateToUserInfo=()=>{
    if(isEmpty(this.state.username)){
      Taro.navigateTo({url:'/pages/person-data/person-data'})
    }else{
      Taro.navigateTo({url:'/pages/update-person-data/update-person-data'})
    }
  }
  render() {
    const {FLAG, username, mobile,signTimes,latestSignTime} = this.state;
    return (
      <View className='home-box'>
        <View className='home-main'>
          <View className='banner'>
            <Text className='xyjsqd-text' style='margin-left:20PX'>小佑极速签到</Text>
            <Text className='scan-qrcode-text' style='margin-left:20PX'>扫码签到、后台叫号管理</Text>
          </View>
          <View className='personal'>
            <View className='basic-info-view' onClick={this.navigateToUserInfo}>
              <View className='avatar' style='margin:auto;'>
                <open-data type="userAvatarUrl"></open-data>
              </View>
              {/*<Image src={null} className='avatar'/>*/}
              <Text className='name'>{username}</Text>
              <Text className='name'>{desensitizationMobile(mobile)}</Text>
              {FLAG && <View className='btn-finish-view' style={FLAG ? 'margin:auto;margin-top:17PX' : 'margin:auto;'}
                             onClick={this.finishPersonalData}>
                <Text className='btn-finish-view-text'>去完善</Text>
              </View>}
            </View>
          </View>
        </View>
        <View style='display:flex;flex:1;flex-direction:column;margin-bottom:50PX'>
          <View className='scan-qrcode-view'>
            <View className='scan-qrcode' onClick={this.scanQrCode}>
              <Text className='scan-dj'>扫码签到</Text>
            </View>
          </View>
          <View style='display:flex;flex-direction:column;margin-top:60PX;'>
            <Text style='color:#999;font-size:14PX;text-align:center;' onClick={()=>Taro.navigateTo({url:'/pages/my-sign/my-sign'})}>今日已签到{signTimes}次</Text>
            {signTimes!=0&& <View style='display:flex;flex-direction:column;align-items:center;' onClick={()=>Taro.navigateTo({url:'/pages/my-sign/my-sign'})}>
              <View style='margin:5PX 0;display:flex;flex-direction:row;align-items:center'>
                <Image src={Sign} style='width:16PX;height:16PX'/>
                <Text style='margin-left:5PX;margin-right:5PX;  color:#999;font-size:14PX;'>最近一次{latestSignTime}</Text>
                <Image src={Forward} style='width:7PX;height:14PX'/>
              </View>
            </View>}
          </View>
        </View>
      </View>
    );
  }
}
