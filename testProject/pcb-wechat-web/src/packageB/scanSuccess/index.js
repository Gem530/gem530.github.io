import './index.less'
import { useState } from 'react'
import { AtButton, AtToast } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'


export default function ScanLogin() {
    useDidShow(() => {
      // Taro.hideHomeButton({
      //   success: () => {
      //     console.log('隐藏返回按钮成功')
      //   }
      // });
    })
    useShareAppMessage(() => {
        return {
            title: '用户登录',
            path: '/pages/index/index'
        }
    })
    return (
        <View className='scan-success-page flex flex-column flex-start'>
          <View className='primary-scan-success'></View>
          <View className='scan-success-title'>登录成功</View>
          <View className='scan-success-tip'>接下来您可以访问诺思特ERP管理系统</View>
          <View className='scan-success-tip'>
            <text style={'color: #000;'}>或</text>
            <text className='scan-success-to' onClick={() => Taro.reLaunch({ url: `/pages/home/home` })}>NOSTH生产管理系统</text>
          </View>
          {/* <AtButton className='scan-success-btn' type='primary' onClick={() => Taro.reLaunch({ url: `/pages/home/home` })}>立即进入</AtButton> */}
        </View>
    )
}
