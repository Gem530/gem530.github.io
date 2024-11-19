import './index.less'
import { useState } from 'react'
import { View, Camera } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'


export default function GScan({ mode, onChange, onScanCode }) {
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
        <View className='g-scan'>
            {
                errorMsg ?
                <View style={'width: 100%; height: 100%;'} className='flex flex-center flex-column'>
                    <View>{errorMsg}</View>
                    {/* <View style={'margin-top: 20px;'}>点击下方按钮，可以调用手机相机拍照</View> */}
                </View> :<Camera className='camera-box' mode={mode} onError={onError} onScanCode={onScanCode}></Camera>
            }
        </View>
    )
}
