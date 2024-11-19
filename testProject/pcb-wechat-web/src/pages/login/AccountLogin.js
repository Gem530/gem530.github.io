import './index.less'
import NavBar from '../../components/nav-bar'
import {Image, View} from '@tarojs/components'
import {useEffect, useState, useRef} from "react"
import { TEMPLATE_IDS } from '../config/commonConfig'
import Taro, {useDidShow,useLoad} from "@tarojs/taro"
import GChooseUser from '../../components/g-choose-user'
import * as service from "../services/login/loginService"
import {AtButton, AtForm, AtInput, AtMessage} from 'taro-ui'

export default function AccountLogin() {
  const GChooseUserRef = useRef()
  const [pwd, setPwd] = useState(null);
  const [urlStr, setUrlStr] = useState('')
  const [options, setOptions] = useState()
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [phoneShow, setPhoneShow] = useState(true);

  useLoad((options) => {
    console.log('options', JSON.parse(JSON.stringify(options)))
    setOptions(JSON.parse(JSON.stringify(options)))
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
  useEffect(() => {
    //先去缓存里看看有没有登录信息
    let token = Taro.getStorageSync('__TOKEN__');
    let userInfo = Taro.getStorageSync('__USER_INFO__');
    if (userInfo && userInfo.userName && userInfo.pwd && token) {
      //缓存存在，自动登录，登录成功后进入扫码页面
      doLogin(userInfo.userName, userInfo.pwd);
    } else if (userInfo?.phoneNumber && token) {
      doLogin(userInfo.userName, userInfo.pwd, {phoneNumber: userInfo.phoneNumber, grantType: 'wx'});
    }
  }, [])

  // 对应 onShow
  useDidShow(() => {
    Taro.hideHomeButton({
      success: () => {
        console.log('隐藏返回按钮成功')
      }
    });
  })

  const againSetting = () => {
    Taro.showModal({
      title: '系统提示',
      content: '检测到您未订阅系统通知消息，是否前往设置?',
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

  // 手机号登录，是否需要授权消息通知？
  // 获取手机号
  const getPhoneNumber = (e) => {
    // console.log('e', e.detail, e.detail.code, e.detail.encryptedData, e.detail.iv, e.detail.cloudID);
    if (e?.detail?.code) {
      let params = {wxCode: e.detail.code, grantType: 'wx'}
      if (options?.companyId) {
        params.companyId = options?.companyId
      }
      if (options?.shareUserId) {
        params.shareUserId = options?.shareUserId
      }
      if (options?.isDelivery) {
        params.isDelivery = options?.isDelivery
      }
      Taro.login({
        success: (res) => {
          console.log('1',res)
          if (res?.code) {
            params.xcxCode = res.code
          }
          doLogin(account, pwd, params);
        },fail: (err) => {
          console.log('2',err)
          doLogin(account, pwd, params);
        }
      })
    }
  }

  const onLogin = (e) => {
    if (null === account) {
      Taro.showToast({
        title: '请输入账号/手机号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (null === pwd) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // Taro.requestSubscribeMessage({
    //     tmplIds: TEMPLATE_IDS,
    //     success: (res) => {
    //       console.log(res)
    //       doLogin(account, pwd);
    //       // if (res[TEMPLATE_IDS[0]] == 'accept') {
    //       // } else {
    //       //   againSetting()
    //       // }
    //     },
    //     fail: (err) => {
    //       console.log(err)
    //       // againSetting()
    //     }
    //   })
      doLogin(account, pwd);
    }

  // // 获取菜单
  // const getMenuList = async () => {
  //   const resMenu = await service.getXcxRoutersAPI()
  //   if (resMenu.code == 200) {
  //     // console.log(resMenu)
  //     Taro.setStorageSync('__Menu__', resMenu.data);
  //   }
  // }

  // 登录方法
  const doLogin = (account, pwd, params) => {
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
          xcxCode: wxRes.code
        }
        query.xcxLoginType = 1
        params && (params.xcxLoginType = 1)
        // console.log(query, params)
        service.logining(params || query).then(async (res) => {
          console.log('result', res)
          if (res) {
            // 无障碍注册，可以不设置姓名，只要求手机号，略去设置头像和名称步骤，直接手机号登录。
            // if (res?.needAvatar) {
            //   const chooseRes = await GChooseUserRef.current.openConfirm()
            //   if (chooseRes.confirm) {
            //     const userInfo = Taro.getStorageSync('__USER_INFO__');
            //     if (userInfo) {
            //       // console.log(chooseRes)
            //       // console.log(chooseRes.data)
            //       userInfo.user.wxNickName = chooseRes.data?.wxNickName
            //       userInfo.user.avatar = chooseRes.data?.avatarUrl
            //       Taro.setStorageSync('__USER_INFO__', userInfo);
            //     }
            //   }
            // }

            // await getMenuList()
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
        }).finally(() => {
          setLoading(false);
        });
      }
    })
  }

  return (
    <View className="login-page">
      <NavBar
        fixed={true}
        title='首页'
        color='rgba(45, 144, 237, 1)'
        transparent={true}
      />
      <View className='login-logo'></View>
      <View className='login-title'>欢迎使用诺思特生产系统</View>
      <View className='flex flex-center'>
        <View className='login-subtitle'>让工厂办公更高效</View>
      </View>

      {!phoneShow ?
      <>
        <View className='login-type flex flex-between'>
          <View className='login-type-one'>账号密码登录</View>
          <button className='login-type-btn' open-type='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>
            <View className='login-type-wx flex flex-end primary-color'>
              {/* <View className='primary-wx'></View> */}
              <View className='login-type-wx-text'>手机号快捷登录</View>
            </View>
          </button>
        </View>

        {/* <View className='login-form'> */}
          {/* <AtForm> */}
        <AtInput placeholderClass='login-input-placeholder' className='login-input new' name='account' title='' type='text' placeholder='账号/手机号' value={account}
                  onChange={e => setAccount(e)}/>
        <AtInput placeholderClass='login-input-placeholder' className='login-input new' name='pwd' title='' type='password' password placeholder='密码' value={pwd}
                  onChange={e => setPwd(e)}/>
          {/* </AtForm> */}
        {/* </View> */}
        <View className='login-button'>
            <AtButton circle='true' type='primary' onClick={onLogin} loading={isLoading}
                      disabled={isLoading}>登录</AtButton>
        </View>
      </> : 
      <>
        <AtButton loading={isLoading} disabled={isLoading} type='primary' className='login-phone-button' openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>手机号快捷登录</AtButton>
        <View className='login-or'>或</View>
        <View className='login-show-account' onClick={() => !isLoading && setPhoneShow(false)}>账号密码登录</View>
      </>}

      <GChooseUser ref={GChooseUserRef}></GChooseUser>
    </View>
  )
}
