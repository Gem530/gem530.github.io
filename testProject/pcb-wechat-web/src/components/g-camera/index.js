import { useState } from 'react'
import { AtIcon } from 'taro-ui'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { View, Camera, Image } from '@tarojs/components'
import './index.less'


export default function GCamera({ onChange }) {
    const [imgUrl, setImgUrl] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    useLoad(() => {
    })
    useDidShow(() => {
        // console.log('useDidShow--------')
        setErrorMsg('')
    })
    // 处理图片
    const dealFiles = (url, size) => {
        setImgUrl(url)
        const files = [{
            url: url,
            file: {
                url: url,
                size: size / 1024
            }
        }]
        onChange(files, 'add', 0)
    }
    // camera截图
    const takePhoto = () => {
        if (errorMsg) {
            Taro.chooseImage({
                sourceType: ['camera'],
                success: (res) => {
                    // const files = []
                    // res?.tempFiles?.length && res.tempFiles.map((item) => {
                    //     files.push({
                    //         url: item.path,
                    //         file: {
                    //             url: item.path,
                    //             size: item.size / 1024
                    //         }
                    //     })
                    // })
                    // files?.length && setImgUrl(files[0].url)
                    // onChange(files, 'add', 0)
                    let files = res?.tempFiles
                    if (files?.length) {
                        dealFiles(files[0].path, files[0].size)
                    }
                }
            })
        } else {
            const ctx = Taro.createCameraContext()
            ctx.takePhoto(({
                quality: 'high',
                success: (res) => {
                    // console.log(res)
                    Taro.getFileInfo({
                        filePath: res.tempImagePath,
                        success: (result) => {
                            dealFiles(res.tempImagePath, result.size)
                        },
                        fail: () => {
                            dealFiles(res.tempImagePath, 100)
                        }
                    })
                }
            }))
        }
    }
    // 删除图片
    const delImg = () => {
        setImgUrl('')
        onChange([], 'remove', 0)
    }
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
        <View className='g-camera'>
            {!imgUrl ? <>
                    {
                        errorMsg ?
                        <View style={'width: 100%; height: 100%;'} className='flex flex-center flex-column'>
                            <View>{errorMsg}</View>
                            <View style={'margin-top: 20px;'}>点击下方按钮，可以调用手机相机拍照</View>
                        </View> :<Camera className='camera-box' onError={onError}></Camera>
                    }
                    <View className='photo-btn flex flex-center' onClick={takePhoto}>
                        <View className='photo-center'></View>
                    </View>
                </> : <>
                    <Image src={imgUrl} style='width: 100%; height: 100%;' mode='aspectFit'></Image>
                    <View className='camera-del flex flex-center' onClick={delImg}><AtIcon value='close-circle' color='#fff' size='30'></AtIcon></View>
                </>
            }
        </View>
    )
}
