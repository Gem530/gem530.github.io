import {useEffect} from "react";
import Taro from "@tarojs/taro";
import {AtAvatar} from 'taro-ui'
import {Button, View} from '@tarojs/components'
import './index.less'
import img from "../../../public/static/nosth_logo.png";
// import * as service from "../services/login/loginService";

export default function WXLogin() {

  useEffect(() => {
    Taro.getStorage({
      key: 'phoneNumber',
      success: function (res) {
        console.log(res.data);
        Taro.navigateTo({
          url: `/pages/scanProduction/Index`,
        })
      }
    })
  }, []);

  const getPhoneNumber = (e) => {
    console.log('e', e.detail.code);
    if (e.detail.code) {
      //获取token
      // service.getPhoneNumber(e.detail.code).then(res => {
      //   console.log("phone",res);
      //   //获取手机号
      //   Taro.setStorageSync('phoneNumber', res.data.data);
      //   Taro.navigateTo({
      //     url: `/pages/scanProduction/Index`,
      //   })
      // })
    }

  }
  return (
    <>
      <View className='at-col at-col__offset-5' style={{marginTop: '36%'}}>
        <AtAvatar text='立国信生产系统' image={img} size='large'></AtAvatar>
      </View>
      <View style={{marginTop: '30%'}}>
        <Button type='primary' open-type='getPhoneNumber' size='small' onGetPhoneNumber={getPhoneNumber}>微信一键登录</Button>
      </View>
    </>
  )
}
