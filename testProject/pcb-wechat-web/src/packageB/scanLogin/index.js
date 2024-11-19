import './index.less'
import { useState } from 'react'
import { AtButton, AtToast } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { priceFormat } from '../../pages/util/func'
import * as service from "../../pages/services/login/loginService"
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'


export default function ScanLogin() {
    const [phone, setPhone] = useState('')
    const [option, setOption] = useState()
    const [urlStr, setUrlStr] = useState('');
    const [userNum, setUserNum] = useState(0)
    const [nickName, setNickName] = useState('')
    const [loading, setLoading] = useState(false);
    const [needRegister, setNeedRegister] = useState(false)
    const [toastInfo, setToastInfo] = useState({
      open: false,
      text: ''
    })
    useLoad((options) => {
      console.log("入参：",options)
        setOption(options)
        const params = {id: options?.scene}
        console.log('params:', params)
        service.setScanValueAPI(params)
    })
    useDidShow(() => {
        // Taro.hideHomeButton({
        //     success: () => {
        //         console.log('隐藏返回按钮成功')
        //     }
        // });
    })
    useShareAppMessage(() => {
        return {
            title: '扫码登录',
            path: '/pages/index/index'
        }
    })
    const getPhoneNumber = (e) => {
        if (e?.detail?.code) {
            // let params = {wxCode: e.detail.code, grantType: 'wx'}
            // if (option?.companyId) {
            //     params.companyId = option?.companyId
            // }
            // if (option?.shareUserId) {
            //     params.shareUserId = option?.shareUserId
            // }
            // if (option?.shareId && needRegister) {
            //     params.shareId = option?.shareId
            // }
            // doLogin('', '', params);
            setLoginQRCodeValue(e?.detail?.code)
        }
    }

    // 授权登录
    const setLoginQRCodeValue = (wxCode) => {
      let params = {
        value: 'true', // 需要为字符串 true
        id: option?.scene,
        xvcCode: '222', // 目前有值就行
        phoneNumber: wxCode,
      }
      service.setLoginQRCodeValueAPI(params).then((res) => {
        console.log('1111--------------',res)
        if (res.code == 200) {
          let loginParams = {
            // wxCode: wxCode,
            phoneNumber: res.data,
            grantType: 'wx'
          }
          Taro.login({
            success: (loginRes) => {
              console.log('1',loginRes)
              if (loginRes?.code) {
                loginParams.xcxCode = loginRes.code
              }
              doLogin('', '', loginParams)
            },fail: (err) => {
              console.log('2',err)
              doLogin('', '', loginParams)
            }
          })
        }
      })
    }

  // 登录方法
  const doLogin = (account, pwd, params) => {
    setLoading(true);
    //登录之前先清理缓存
    Taro.clearStorageSync();
    Taro.login({
      success: (wxRes) => {
        // console.log(wxRes)
        let query = {
          username: account,
          password: pwd,
          xcxCode: wxRes.code
        }
        query.xcxLoginType = 1
        params && (params.xcxLoginType = 1)
        service.logining(params || query).then(async (res) => {
          console.log('result', res)
          if (res) {
            Taro.showToast({ title: '登录成功' })
            Taro.reLaunch({
              // url: `/pages/home/home`,
              url: '/packageB/scanSuccess/index'
            }).then();
          }
        }).finally(() => {
          setLoading(false);
        });
      }
    })
  }
    return (
        <View className='scan-login-page'>
            <View className='scan-login-top'>
                <View className='scan-login-title'>您好!</View>
                <View className='scan-login-subtitle'>欢迎来到<Text>立国信生产系统</Text></View>
                <View className='scan-login-top-tip'>即刻体验高效的工厂办公系统</View>
            </View>
            <View className='scan-login-bottom'>
                <View className='scan-login-text' style={'margin-bottom: 100rpx;'}>点击下方按钮，一键登录</View>
                {/* <View className='scan-login-text-mini'>已有{priceFormat(userNum, 0) || 0}个用户注册使用</View> */}
                <AtButton loading={loading} disabled={loading} openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber} className='scan-login-btn'>手机号一键登录</AtButton>
                <View className='scan-login-company flex flex-center'>
                    <View className='register-logo'></View>
                    深圳立国信工业互联科技有限公司
                </View>
            </View>

            <AtToast isOpened={toastInfo.open} text={toastInfo.text} duration={1500} hasMask={true} onClose={() => { setToastInfo({ open: false, text: '' }) }}></AtToast>
        </View>
    )
}
