import {useLoad,useShareAppMessage} from '@tarojs/taro'
import './index.less'
import AccountLogin from "../login/AccountLogin";


export default function Index() {

  useLoad(() => {

  })
  useShareAppMessage(() => {
    return {
      title: '登录',
      path: '/pages/index/index'
    }
  })
  return (
    <AccountLogin></AccountLogin>
  )
}
