import './index.less'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from "taro-ui"
import { useEffect, useState } from "react"
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import GFeedback from '../../../../components/g-feedback'

export default function ChangeName() {
  const [name, setName] = useState('');
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '姓名',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    setName(Taro.getStorageSync('__USER_INFO__')?.user?.nickName)
    setUserInfo(Taro.getStorageSync('__USER_INFO__')?.user)
    // Taro.setNavigationBarTitle({
    //     title: Taro.getStorageSync('__USER_INFO__')?.user?.nickName
    // })
  })

  const changeHandle = () => {
    if (!name) {
      Taro.showToast({ title: '姓名不能为空', icon: 'error', duration: 1500 })
      return;
    }
    // console.log('userInfo?.nickName', userInfo, name)
  }

  return (
    <View className="change-name-page">
      <View className='user-card'>
        <View className='user-card-item'>
          <AtInput title='姓名' placeholder='请输入姓名' value={name} onChange={(e) => setName(e)}></AtInput>
        </View>
      </View>

      <View className='change-name-btn'>
        <AtButton type='primary' onClick={changeHandle}>确定</AtButton>
      </View>
      <GFeedback></GFeedback>
    </View>
  )
}
