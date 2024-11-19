import './index.less'
import GScan from '../g-scan'
import { useState } from 'react'
import { AtButton } from 'taro-ui'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'


export default function ScanCard({ scanCode, onScanQrCode }) {
    const [imgUrl, setImgUrl] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    useLoad(() => {
    })
    useDidShow(() => {
        // console.log('useDidShow--------')
        setErrorMsg('')
    })
    const againSetting = () => {
      Taro.showModal({
        title: '系统提示',
        content: '检测到您未授权摄像头，是否前往设置?',
        success: function (res) {
          if (res.confirm) {
            Taro.openSetting({
              withSubscriptions: true,
              success: (setting) => {
                console.log(setting)
              }
            })
          }
        }
      })
    }
    // 用户不允许使用摄像头时触发
    const onError = (e) => {
        console.log('onError---', e)
        setErrorMsg(e?.detail?.errMsg == 'insertXWebCamera:fail auth deny' ? '未授权摄像头，可前往设置开启' : e?.detail?.errMsg)
        // Taro.authorize({
        //     scope: 'scope.camera',
        //     success: () => {
        //         console.log('授权成功')
        //     },
        //     fail: () => {
        //         console.log('用户拒绝授权')
        //     }
        // })
        // if (e?.detail?.errMsg == 'insertXWebCamera:fail auth deny') {
        //     againSetting()
        // }
    }
    return (
        <View className='scan-card'>
            <View className="scan-bottom">
                <GScan mode={'scanCode'} onScanCode={scanCode}></GScan>
            </View>
            <View className="scan-mask">
                <View className="scan-rect"></View>
                <View className="scan-line"></View>
                <View className="scan-btn flex flex-column flex-end">
                    <View className="scan-btn-tip">请扫码流转卡号条码</View>
                    <AtButton type="primary" className="scan-btn-box" onClick={onScanQrCode}>点击扫码</AtButton>
                </View>
            </View>
        </View>
    )
}
