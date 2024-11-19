import './index.less'
import { useEffect, useState } from "react"
import { AtButton, AtLoadMore } from "taro-ui"
import { Switch, View, Text } from '@tarojs/components'
import GFeedback from '../../../../components/g-feedback'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { getUserReportRoleAPI, addUserReportRoleAPI } from '../../../services/login/loginService'

export default function ChangeName() {
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '消息推送设置',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    getUserReportRole()
  })
  const getUserReportRole = () => {
    setLoading(true)
    getUserReportRoleAPI().then((res) => {
      if (res.code == 200) {
        res.data?.sendReport?.length && res.data.sendReport.map((m, mi) => {
          m.status = (m.status == 1)
          m.mIndex = mi
        })
        setList(res.data?.sendReport || [])
      }
    }).finally(() => setLoading(false))
  }

  const handleChange = (item) => {
    const tempList = JSON.parse(JSON.stringify(list))
    tempList.map((m) => {
      if (m.roleKey == item.roleKey && m.mIndex == item.mIndex) {
        m.status = !m.status
      }
    })
    console.log(tempList)
    setList(tempList)
  }

  const changeHandle = () => {
    let tempList = JSON.parse(JSON.stringify(list))
    tempList.map((m) => {
      m.status = m.status ? '1' : '0'
    })
    let sendReport = tempList?.length ? tempList : []
    // list.map((m) => {
    //   return {
    //     roleKey: m.roleKey,
    //     status: m.status ? '1' : '0'
    //   }
    // })
    // console.log(sendReport)
    setLoading(true)
    addUserReportRoleAPI({
      sendReport
    }).then((res) => {
      if (res.code == 200) {
        Taro.showToast({ title: '保存成功' })
        getUserReportRole()
      }
    }).finally(() => setLoading(false))
  }

  const preview = () => {
    Taro.previewImage({
      current: 'https://pcb-prod.oss-cn-shenzhen.aliyuncs.com/wechat/wx-send-tip.png',
      urls: ['https://pcb-prod.oss-cn-shenzhen.aliyuncs.com/wechat/wx-send-tip.png']
    })
  }

  return (
    <View className="change-name-page">
      <View className='user-card'>
        {
          list?.length ? list.map((item) => {
            return (
              <View className='user-card-item'>
                <View className='user-item-label width-auto'>{item.reportName || ''}</View>
                <View className="user-item-value flex flex-end">
                  <Switch className='switch-small' color='#2D90ED' checked={item.status} onChange={() => handleChange(item)}></Switch>
                </View>
              </View>
            )
          }) : <AtLoadMore status="noMore" noMoreText="暂无数据"></AtLoadMore>
        }
      </View>

      <View className='report-tip' onClick={preview}>
        开启后仍无法收到消息，请查看<Text className="primary-color">操作指引</Text>
      </View>

      {list?.length ? <View className='change-name-btn'>
        <AtButton loading={loading} disabled={loading} type='primary' onClick={changeHandle}>保存</AtButton>
      </View> : <></>}
      <GFeedback></GFeedback>
    </View>
  )
}
