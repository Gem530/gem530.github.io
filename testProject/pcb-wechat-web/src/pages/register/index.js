import './index.less'
import { useState } from 'react'
import { priceFormat } from '../util/func'
import { AtButton, AtToast } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import * as service from "../services/login/loginService"
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'


export default function Register() {
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
        setOption(options)
        console.log(options)
        if (options?.url) {
          delete options?.companyId
          let path = options?.url + '?'
          for (let key in options) {
            if (key != 'url') {
              path += `&${key}=${options[key]}`
            }
          }
          path = path.replace('?&', '?')
          path = `${path}&isRedirect=1`
          // console.log('path', path)
          Taro.setStorageSync('__redirectPath__', path)
          setUrlStr(path)
        }
    })
    useDidShow(() => {
        Taro.hideHomeButton({
            success: () => {
                console.log('隐藏返回按钮成功')
            }
        });
        getUserCount()
    })
    useShareAppMessage(() => {
        return {
            title: '邀请注册',
            path: '/pages/index/index'
        }
    })
    // 获取用户数量
    const getUserCount = () => {
      service.getUserCountAPI().then((res) => {
        if (res.code == 200) {
          console.log(res)
          setUserNum(res.data)
        }
      })
    }
    const getPhoneNumber = (e) => {
        if (e?.detail?.code) {
            let params = {wxCode: e.detail.code, grantType: 'wx'}
            if (option?.companyId) {
                params.companyId = option?.companyId
            }
            if (option?.shareUserId) {
                params.shareUserId = option?.shareUserId
            }
            if (option?.shareId && needRegister) {
                params.shareId = option?.shareId
            }
            doLogin('', '', params);
        }
    }

    // 获取菜单
    const getMenuList = async () => {
      const resMenu = await service.getXcxRoutersAPI()
      if (resMenu.code == 200) {
        // console.log(resMenu)
        Taro.setStorageSync('__Menu__', resMenu.data);
      }
    }

    // 一键注册按钮
    const registerHandle = () => {
        if (!nickName) {
          Taro.showToast({ title: '请输入姓名', icon: 'error' })
          return
        }
        doLogin('', '', {phoneNumber: phone, grantType: 'wx', shareId: option.shareId, nickName: nickName})
    }

    // 登录方法
    const doLogin = (account, pwd, params) => {
        console.log(account, pwd, params)
        if (params) {
          params.err = false
        }
      setLoading(true);
      const pathStr = Taro.getStorageSync('__redirectPath__') || urlStr
      //登录之前先清理缓存
      Taro.clearStorageSync();
      console.log('pathStr:', pathStr)
      Taro.login({
        success: (wxRes) => {
          // console.log(wxRes)
          let query = {
            username: account,
            password: pwd,
            xcxCode: wxRes.code,
            err: false
          }
          query.xcxLoginType = 2
          params && (params.xcxLoginType = 2)
          service.logining(params || query).then(async (res) => {
            console.log('result', res)
            if (res) {
                if (res.data?.needRegister) {
                    // 需要注册
                    setPhone(res.data?.phoneNumber)
                    setNeedRegister(res.data.needRegister)
                    return
                }
              await getMenuList()
              // const countArr = res?.roles?.length ? res?.roles.filter((f) => f.indexOf('code-') == 0) : []
              // const otherRole = res?.roles?.length ? res?.roles.filter((f) => ['deptLeader','productManager','capacity','businessCardRecognitionEmail','qgjs_app','ckzg','cwjs','cgzj','glwl'].includes(f)) : []
              // if (countArr.length && otherRole.length == 0) {
              //   // 只有过数权限，没有上报以及审核权限
              //   Taro.redirectTo({
              //     url: `/pages/scanProduction/Index`,
              //   }).then();
              // } else {
              // const path = Taro.getStorageSync('__redirectPath__')
              // console.log(path)
              if (pathStr) {
                Taro.redirectTo({ url: pathStr });
              } else {
                Taro.redirectTo({
                  // url: `/pages/scanProduction/Index`,
                  url: `/pages/home/home`,
                }).then();
              }
              // }
            }
          }).catch((err) => {
            setToastInfo({
              open: true,
              text: err?.msg
            })
            setLoading(false);
          }).finally(() => {
            setLoading(false);
          });
        }
      })
    }
    return (
        <View className='register-page'>
            <View className='register-top'>
                <View className='register-title'>您好!</View>
                <View className='register-subtitle'>欢迎来到<Text>立国信生产系统</Text></View>
                <View className='register-top-tip'>即刻体验高效的工厂办公系统</View>
            </View>
            <View className='register-bottom'>
                {/* <View className='register-tip'>{needRegister ? '该手机号尚未注册' : ''}</View> */}
                {
                  needRegister ? 
                  <>
                  <View className='register-phone'>当前手机号{phone}</View>
                  <input className='register-input' value={nickName} placeholder='请输入姓名' onInput={(e) => setNickName(e?.detail?.value)}></input>
                  </> :
                  <>
                  <View className='register-text'>点击下方按钮，一键注册使用</View>
                  <View className='register-text-mini'>已有{priceFormat(userNum, 0) || 0}个用户注册使用</View>
                  </>
                }
                {
                    !needRegister ?
                        <button className='register-btn' open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>手机号注册并登录</button> :
                        <AtButton loading={loading} disabled={loading} className='register-btn' onClick={registerHandle}>立即注册</AtButton>
                }
                <View className='register-company flex flex-center'>
                    <View className='register-logo'></View>
                    深圳立国信工业互联科技有限公司
                </View>
            </View>

            <AtToast isOpened={toastInfo.open} text={toastInfo.text} duration={1500} hasMask={true} onClose={() => { setToastInfo({ open: false, text: '' }) }}></AtToast>
        </View>
    )
}
