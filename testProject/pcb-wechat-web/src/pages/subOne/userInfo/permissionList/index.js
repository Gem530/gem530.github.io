import './index.less'
import { useEffect, useState } from "react"
import { View, ScrollView } from '@tarojs/components'
import GFeedback from '../../../../components/g-feedback'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { AtButton, AtLoadMore, AtTabs, AtTabsPane } from "taro-ui"
import { getAppletUserMenuAPI, getXcxRoutersAPI } from '../../../services/login/loginService'

export default function PermissionList() {
  const tabList = [
    { id: 0, title: 'ERP菜单' },
    { id: 1, title: '小程序菜单' },
  ]
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '权限列表',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    getXcxRouters()
  })

  // 获取菜单
  const getXcxRouters = () => {
    Taro.showLoading({ mask: true })
    // getXcxRoutersAPI().then((res) => {
    getAppletUserMenuAPI().then((res) => {
      if (res.code == 200) {
        setDataInfo(res.data)
        let tempList = res.data?.erpMenuVoList || []
        tempList.map((m) => {
          m.children.map((cm) => {
            cm.show = false
          })
        })
        setList(tempList)
        Taro.hideLoading()
      }
    })
  }

  // 菜单切换
  const tabClick = (e) => {
    setCurrent(e)
    let tempList = (e == 0 ? dataInfo?.erpMenuVoList : dataInfo?.xcxMenuVoList) || []
    tempList.map((m) => {
      m.children.map((cm) => {
        cm.show = false
      })
    })
    setList(tempList)
  }

  // 显隐按钮权限
  const changeShow = (row) => {
    let tempList = JSON.parse(JSON.stringify(list))
    tempList.map((m) => {
      m.children.map((cm) => {
        if (cm?.menuId == row?.menuId) {
          cm.show = !cm.show
        }
      })
    })
    // console.log(row, tempList)
    setList(tempList)
  }

  // 跳转到详情
  const toPath = (url) => {
    Taro.navigateTo({url})
  }

  return (
    <View className="permission-list-page">
      <AtTabs current={current} tabList={tabList} onClick={tabClick}>
      </AtTabs>
      
      <View className='permission-box'>
      {list?.length ? list.map((m) => {
        return (
          // 菜单管理分组卡片
          <View className='common-card permission-card'>
            {
              m.children?.length ? m.children.map((cm, cmIndex) => {
                return (
                  // 一级菜单
                  <>
                  <View
                    onClick={() => changeShow(cm)}
                    // ${cmIndex != (m.children.length - 1) && 'border-bottom'}
                    className={`common-item head ${cmIndex != (m.children.length - 1) && !cm.show && 'm-b-20'}`}>
                    <View className='common-title mini'>{cm?.menuName}</View>
                    <View className={`${cm.show ? 'primary-top' : 'primary-bottom'}`}></View>
                  </View>
                  {
                    cm.show ? <>
                    <View className='common-item'>
                      <View className='common-item-value primary-color' onClick={() => toPath(`detail/index?id=${cm?.menuId}`)}>页面权限</View>
                    </View>
                    {
                      // 按钮权限
                      cm.children?.length ? cm.children.map((btnM) => {
                        return (
                          <View className='common-item'>
                            <View className='common-item-value primary-color' onClick={() => toPath(`detail/index?id=${btnM?.menuId}`)}>{btnM?.menuName}</View>
                          </View>
                        )
                      }) : <></>
                    }</> : <></>
                  }
                  </>
                )
              }) : <></>
            }
          </View>
        )
      }) : <AtLoadMore status="noMore" noMoreText="暂无数据"></AtLoadMore>}
      </View>

      <GFeedback></GFeedback>
    </View>
  )
}
