import React, {Component} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './home.scss'
import {getUserInfoApi, sign} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";

let event = Taro.eventCenter;
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      username:'',
    }
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: '小佑极速签到'
    })
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const {openId} = Taro.getStorageSync('userInfo');
    const res = await getUserInfoApi(openId);
    console.log(333, res);
    if (res.code == 200) {
      const {username}=res.data;
      this.setState({username});
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

  render() {
    const {username} = this.state;
    return (
      <View className='home-box'>
        <View className='main'>
          <View className='banner'>
            <Text className='xyjsqd-text' style='margin-left:20PX'>小佑极速签到</Text>
            <Text className='scan-qrcode-text' style='margin-left:20PX'>扫码签到、后台叫号管理</Text>
          </View>
          <View className='personal'>
            <View className='basic-info-view'>
              <View className='avatar' style='margin:auto;'>
                <open-data type="userAvatarUrl"></open-data>
              </View>
              {/*<Image src={null} className='avatar'/>*/}
               <Text className='name'>{username}</Text>
              {isEmpty(username)&&<View className='btn-finish-view' style={isEmpty(username)?'margin:auto;margin-top:17PX':'margin:auto;'} onClick={this.finishPersonalData}>
                <Text className='btn-finish-view-text'>去完善</Text>
              </View>}
            </View>
          </View>
          <View>
            <View className='scan-qrcode-view'>
              <View className='scan-qrcode' onClick={this.scanQrCode}>
                <Text className='scan-dj'>扫码登记</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
