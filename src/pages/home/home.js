import React, {Component} from "react";
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components'
import './home.scss'
import {getUserInfoApi, sign} from "../../services/SyncRequest";
import {isEmpty} from "../../utils/EmptyUtil";
import {login, wxLogin} from "../../services/user";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
       username:'',
       FLAG:false,
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
    const res = await login();
    const _res = await wxLogin(res.code);
    if(_res.code==200){
      const {openId}=_res.data;
      const res = await getUserInfoApi(openId);
      if (res.code == 200) {
        const {username}=res.data;
        if(isEmpty(username)){
          this.setState({username,FLAG:true});
        }else{
          this.setState({username,FLAG:false});
        }

      }else{
        this.setState({FLAG:true})
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
    const {FLAG,username} = this.state;
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
              {FLAG&&<View className='btn-finish-view' style={FLAG?'margin:auto;margin-top:17PX':'margin:auto;'} onClick={this.finishPersonalData}>
                <Text className='btn-finish-view-text'>去完善</Text>
              </View>}
            </View>
          </View>
          <View>
            <View className='scan-qrcode-view'>
              <View className='scan-qrcode' onClick={this.scanQrCode}>
                <Text className='scan-dj'>扫码签到</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
