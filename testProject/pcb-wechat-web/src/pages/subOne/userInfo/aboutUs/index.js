import './index.less'
// import {  } from "taro-ui"
import { View } from '@tarojs/components'
import { useEffect, useState } from "react"
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import GFeedback from '../../../../components/g-feedback';

export default function AboutUs() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '关于我们',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    setUserInfo(Taro.getStorageSync('__USER_INFO__')?.user)
  })

  return (
    <View className="about-us-page">
      <View className='company-logo'></View>
      <View className='company-name'>立国信</View>

      <View className='about-us-item'>
        <View className='about-us-label'>工作时间</View>
        <View className='about-us-value'>工作日 9:30-18:30</View>
      </View>

      <View className='about-us-item'>
        <View className='about-us-label'>反馈邮箱</View>
        <View className='about-us-value'>123456@enfccn.com</View>
      </View>

      <View className='about-us-item'>
        <View className='about-us-label'>微信号</View>
        <View className='about-us-value'>enfccnom</View>
      </View>

      <View className='company-copyright'>深圳立国信工业互联科技有限公司 版权所有</View>
      <GFeedback></GFeedback>
    </View>
  )
}
