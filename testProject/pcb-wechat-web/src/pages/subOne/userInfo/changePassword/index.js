import './index.less'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from "taro-ui"
import { useEffect, useState } from "react"
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import GFeedback from '../../../../components/g-feedback'
import {editPasswordAPI, logoutAPI} from "../../../services/login/loginService";
import {loginOut} from "../../../util/func";

export default function ChangePassword() {
  const [isLoading, setLoading] = useState(false);
  const [psdInfo, setPsdInfo] = useState({
    // smsCode: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  // const [userInfo, setUserInfo] = useState();

  useEffect(() => {
  }, []);
/*  useLoad(() => {
    isPhoneLogin()
  })*/
  useShareAppMessage(() => {
    return {
      title: '修改密码',
      path: '/pages/index/index'
    }
  })

  // useLoad(() => {
  //   setUserInfo(Taro.getStorageSync('__USER_INFO__')?.user)
  // })

  // 更新数据
  const updateData = (value, label) => {
    let tempInfo = Object.assign({}, psdInfo)
    tempInfo[label] = value
    setPsdInfo(tempInfo)
  }

  // 校验数据
  const checkData = () => {
    const { password, newPassword, confirmPassword } = psdInfo
    let err = ''
    if (!password) {
      err = '旧密码不能为空'
    } else if (!newPassword) {
      err = '新密码不能为空'
    } else if (!confirmPassword) {
      err = '确认密码不能为空'
    } else if (newPassword != confirmPassword) {
      err = '确认密码与新密码不一致'
    } else if (newPassword.length > 20 || newPassword.length < 5){
      console.log("newPassword.length",newPassword.length)
      err = '用户新密码长度必须在5到20个字符之间'
    } else if (confirmPassword.length > 20 || confirmPassword.length < 5){
      console.log("confirmPassword.length",confirmPassword.length)
      err = '用户确认密码长度必须在5到20个字符之间'
    }
    return err
  }
  const changePassword = () => {
    const { password, newPassword } = psdInfo
    const param ={
      oldPassword: password,
      newPassword: newPassword,
    }
    const params = JSON.parse(JSON.stringify(param))
    console.log("打印入参：",params)
    setLoading(true);
    editPasswordAPI(params).then((res) => {
      if (res.code == 200) {
        console.log("返回结果",res.code)
        //登出
        loginOut()
      }
      if (res.code != 200) {
        Taro.showToast({ title: "操作失败", icon: 'none', duration: 1500 })
        return;
      }
    }).finally(() => setLoading(false))
  }

  const passwordEditHandle = () => {
    Taro.showModal({
      title: '修改后需要重新登录，是否确认修改？',
      success: (res) => {
        if (res !== null && res !== void 0 && res.confirm) {
          changePassword()
        }
        if (res.cancel) {
          setLoading(false);
        }
      },
      fail: () => {
        setLoading(false);
      }
    })
  }

  const changeHandle = () => {
    const err = checkData()
    if (err) {
      setLoading(false);
      Taro.showToast({ title: err, icon: 'none', duration: 1500 })
      return;
    }
    passwordEditHandle()
  }

  /*const [isSend, setIsSend] = useState('1')
  const [sendTime, setSendTime] = useState('')
  //0账号登录 1手机号码登录
  const [isPhone, setIsPhone] = useState('1')

  // 验证码倒计时，点击获取验证码触发
  const countDown = () => {
    console.log(11)
    setIsSend('0')
    var Num = 60;
    setSendTime(Num)
    var timer = setInterval(function () {
      Num -= 1;
      setSendTime(Num)
      if (Num <= -1) {
        clearInterval(timer)
        setIsSend(1)
        Num = 60
        setSendTime(Num)
      }
    }, 1000)
  }


  // 判断当前是使用手机号码登录还是使用账号登录
  const isPhoneLogin = () => {
    console.log("判断是否是手机号码登录~")
    const userInfo = Taro.getStorageSync('__USER_INFO__')
    console.log("userInfo:",userInfo)
    var phone = userInfo?.phoneNumber
    if (phone){
      setIsPhone(1)
    }
  }*/




  return (
    <View className="change-password-page">
      <View className='user-card'>
{/*        { isPhone == "1" ?
          <View className='user-card-item'>
            <AtInput title='短信验证' type='password' placeholder='请输入验证' value={psdInfo.smsCode} onChange={(e) => updateData(e, 'smsCode')}></AtInput>
            {
              isSend == '1' ? <AtButton type='primary' className='sms-send-btn' disabled={isSend != '1'} onClick={countDown}>获取验证码</AtButton> : <></>
            }
            {
              isSend == 0 ? <AtButton type='primary' className='sms-send-btn' disabled={true}>{sendTime}s</AtButton> : <></>
            }
          </View>
          : <></>
        }*/}

{/*        { isPhone == "0" ?
          <View className='user-card-item'>
            <AtInput title='旧密码' type='password' placeholder='请输入密码' value={psdInfo.password} onChange={(e) => updateData(e, 'password')}></AtInput>
          </View>
          : <></>
        }*/}

        <View className='user-card-item'>
          <AtInput title='旧密码' type='password' placeholder='请输入旧密码' value={psdInfo.password} onChange={(e) => updateData(e, 'password')}></AtInput>
        </View>

        <View className='user-card-item'>
          <AtInput title='新密码' type='password' placeholder='请输入新密码' value={psdInfo.newPassword} onChange={(e) => updateData(e, 'newPassword')}></AtInput>
        </View>

        <View className='user-card-item'>
          <AtInput title='确认密码' type='password' placeholder='请输入确认密码' value={psdInfo.confirmPassword} onChange={(e) => updateData(e, 'confirmPassword')}></AtInput>
        </View>
      </View>

      <View className='change-password-btn'>
        <AtButton type='primary' onClick={changeHandle} loading={isLoading} disabled={isLoading}>确认修改</AtButton>
      </View>
      <GFeedback></GFeedback>
    </View>
  )
}
