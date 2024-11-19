import './index.less'
import dayjs from 'dayjs'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from "taro-ui"
import { useEffect, useState } from "react"
import GFeedback from '../../../components/g-feedback'
import { loginOut, hasPermission } from '../../util/func'
import Taro, {useDidShow, useLoad, useShareAppMessage} from '@tarojs/taro'

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState();
  const [isEablePWD, setIsEablePWD] = useState('0')
  useLoad(() => {
    isPhoneLogin()
  })
  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '个人中心',
      path: '/pages/index/index'
    }
  })
  // useShareTimeline(() => {
  //   return {
  //     title: '分享标题',
  //     path: '/pages/index/index'
  //   }
  // })

// 对应 onShow
  useDidShow(() => {
    setUserInfo(Taro.getStorageSync('__USER_INFO__')?.user)
  })

  const toPath = (url) => {
    Taro.navigateTo({ url })
  }
  // 退出
  const loginOutHandle = () => {
    Taro.showModal({
      title: '是否确定退出？',
      success: (res) => {
        if (res?.confirm) {
          loginOut()
        }
      }
    })
  }

  const isPhoneLogin = () => {
    console.log("判断是否是手机号码登录~")
    const userInfos = Taro.getStorageSync('__USER_INFO__')
    console.log("userInfos:",userInfos)
    console.log("userInfos?.phoneNumber:",userInfos?.phoneNumber)
    var phone = userInfos?.phoneNumber
    if (!phone){
      setIsEablePWD("1")
    }
  }

  return (
    <View className="user-page">
      <View className='user-card'>
        <View className='user-card-item'>
          {/*  onClick={() => toPath('changeName/index')} */}
          <AtInput className='new' title='姓名' disabled={true} value={userInfo?.wxNickName || userInfo?.nickName || ''}>
            {/* <View className='user-item-right'></View> */}
          </AtInput>
        </View>

        {/* <View className='user-card-item'>
          <AtInput className='new' title='账号' disabled={true} value={userInfo?.userName}></AtInput>
        </View> */}

        <View className='user-card-item'>
          <AtInput className='new' title='手机号' disabled={true} value={userInfo?.phonenumber || userInfo?.userName}></AtInput>
        </View>

        <View className='user-card-item' onClick={() => toPath('changeCompany/index')}>
          <AtInput className='new' title='公司信息' disabled={true} value={userInfo?.dept?.deptName}>
            <View className='user-item-right'></View>
          </AtInput>
        </View>

        {/* <View className='user-card-item'>
          <AtInput className='new' title='入职时间' disabled={true} value={userInfo?.createTime && dayjs(userInfo?.createTime).format('YYYY-MM-DD')}></AtInput>
        </View> */}

        <View className='user-card-item' onClick={() => toPath('signature/index')}>
          <AtInput className='new' title='签章管理' disabled={true}>
            <View className='user-item-right'></View>
          </AtInput>
        </View>

        {/* <View className='user-card-item title-auto' onClick={() => toPath('noticeSetting/index')}>
          <AtInput className='new' title='通知待办提醒设置' disabled={true}>
            <View className='user-item-right'></View>
          </AtInput>
        </View> */}

        <View className='user-card-item title-auto' onClick={() => toPath('reportConfig/index')}>
          <AtInput className='new' title='消息推送设置' disabled={true}>
            <View className='user-item-right'></View>
          </AtInput>
        </View>

        {hasPermission('user:user:rolelist') ? <View className='user-card-item title-auto' onClick={() => toPath('permissionList/index')}>
          <AtInput className='new' title='权限列表' disabled={true}>
            <View className='user-item-right'></View>
          </AtInput>
        </View> : <></>}

        {/* <View className='user-card-item' onClick={() => toPath('pcbProgress/index')}>
          <AtInput className='new' title='订单进度' disabled={true}>
            <View className='user-item-right'></View>
          </AtInput>
        </View> */}

        {
          isEablePWD == "1" ? <View className='user-card-item' onClick={() => toPath('changePassword/index')}>
          <View className='user-item-label'>修改密码</View>
          <View className='user-item-value'></View>
          <View className='user-item-right'></View>
        </View>
            : <></>
        }

        {/*<View className='user-card-item' onClick={() => toPath('aboutUs/index')}>
          <View className='user-item-label'>关于我们</View>
          <View className='user-item-value'></View>
          <View className='user-item-right'></View>
        </View>

        <View className='user-card-item'>
          <View className='user-item-label'>账号注销</View>
          <View className='user-item-value'></View>
          <View className='user-item-right'></View>
        </View>*/}
      </View>

      <View className='user-btn'>
        <AtButton className='user-btn-error' onClick={loginOutHandle}>退出登录</AtButton>
      </View>
      <GFeedback></GFeedback>
    </View>
  )
}
