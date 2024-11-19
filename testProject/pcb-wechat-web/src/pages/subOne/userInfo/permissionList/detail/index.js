import './index.less'
import { useEffect, useState } from "react"
import GTag from '../../../../../components/g-tag'
import { View, ScrollView } from '@tarojs/components'
import GFeedback from '../../../../../components/g-feedback'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { AtButton, AtLoadMore, AtTabs, AtTabsPane } from "taro-ui"
import { getAppletUserByMenuIdAPI } from '../../../../services/login/loginService'

export default function PermissionList() {
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '权限用户',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    getAppletUserByMenuId(option.id)
  })

  // 获取菜单
  const getAppletUserByMenuId = (id) => {
    Taro.showLoading({ mask: true })
    getAppletUserByMenuIdAPI(id).then((res) => {
      if (res.code == 200) {
        console.log(res.data)
        res.data.map((m) => {
          m.id = m.userId
          m.name = m.nickName
        })
        setList(res.data || [])
        Taro.hideLoading()
      }
    })
  }

  return (
    <View className="permission-list-page">
      
      <View className='permission-box'>
        <View className='common-card permission-card'>
          {list?.length ? <>
          <GTag list={list}></GTag>
            {/* list.map((m) => {
            return (
              <View className='common-item'>
                <View className='common-item-value'>{m?.nickName}</View>
              </View>
            )
          }) */}
          </> : <AtLoadMore status="noMore" noMoreText="暂无数据"></AtLoadMore>}
        </View>
      </View>

      <GFeedback></GFeedback>
    </View>
  )
}
