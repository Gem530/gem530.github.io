import './index.less'
import { useEffect, useState } from "react"
import GTag from '../../../../components/g-tag'
import { View, ScrollView } from '@tarojs/components'
import GFeedback from '../../../../components/g-feedback'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { AtButton, AtLoadMore, AtTabs, AtTabsPane } from "taro-ui"
import { getXcxRoutersAPI } from '../../../services/login/loginService'
import { remindConfigAPI, getUserRemindConfigAPI } from "../../../services/noticePage"

export default function NoticeSetting() {
  const tagList = [
    { config: '0', name: '关闭' },
    { config: '1', name: '数字' },
    { config: '2', name: '红点' },
  ]
  const [list, setList] = useState([]);
  const [notifyList, setNotifyList] = useState([])
  const [notifySetting, setNotifySetting] = useState([])

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '通知待办提醒设置',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    // getUserRemindConfig()
    getXcxRouters()
  })

  // 获取用户待办通知提醒设置
  const getUserRemindConfig = () => {
    return new Promise((resolve, reject) => {
      getUserRemindConfigAPI().then((res) => {
        if (res.code == 200) {
          setNotifySetting(res.data)
          resolve(res)
        } else reject(res)
      }).catch(err => reject(err))
    })
  }

  // 获取菜单
  const getXcxRouters = (flag = true) => {
    flag && Taro.showLoading({ mask: true })
    getXcxRoutersAPI().then(async (res) => {
    // getAppletUserMenuAPI().then((res) => {
      if (res.code == 200) {
        let tempList = res.data || []
        // 手动添加小程序通知
        tempList.unshift({
          meta: { title: '小程序通知', icon: '' },
          menuId: 'xcxNotice',
          name: 'xcxNotice',
          path: 'xcxNotice',
          children: [
            {
              meta: { title: '通知提醒', icon: '' },
              menuId: 'xcxNoticeChildren',
              name: 'xcxNoticeChildren',
              path: 'xcxNoticeChildren',
            }
          ]
        })
        const configInfo = await getUserRemindConfig()
        let data = configInfo?.data
        // console.log(data?.pendingConfig)

        tempList.map((m) => {
          m.children.map((cm) => {
            const crtMenu = data?.pendingConfig?.length && data?.pendingConfig.find((f) => f.menuId == cm.menuId)
            // console.log(crtMenu, cm)
            if (cm.menuId == 'xcxNoticeChildren') {
              cm.config = data?.notifyConfig
            } else {
              if (crtMenu) {
                cm.config = crtMenu.config
              } else {
                cm.config = '0'
              }
            }
            // cm.config = 2
          })
        })
        setList(tempList)
        flag ? Taro.hideLoading() : Taro.showToast({ title: '修改成功' })
      }
    })
  }

  // 显隐按钮权限
  const changeActive = (row, config) => {
    // let tempList = JSON.parse(JSON.stringify(list))
    // tempList.map((m) => {
    //   m.children.map((cm) => {
    //     if (cm?.name == row?.name) {
    //       cm.config = config
    //     }
    //   })
    // })
    // setList(tempList)
    // console.log(row, config, notifySetting)
    let params = {
      id: notifySetting?.id,
      menuId: row?.menuId,
      notifyConfig: config,
    }
    if (params.menuId == 'xcxNoticeChildren' || params.menuId == 'xcxNotice') {
      delete params.menuId
    }
    console.log(params)
    Taro.showLoading({ mask: true })
    remindConfigAPI(params).then((res) => {
      if (res.code == 200) {
        getXcxRouters(false)
      }
    })
  }

  // 跳转到详情
  const toPath = (url) => {
    Taro.navigateTo({url})
  }

  return (
    <View className="notice-list-page">
      <View className='notice-box'>
      {list?.length ? list.map((m) => {
        return (
          // 菜单管理分组卡片
          <>
          <View className='notice-menu-title'>{m?.meta?.title}</View>
          <View className='common-card notice-card'>
            {
              m.children?.length ? m.children.map((cm, cmIndex) => {
                return (
                  // 一级菜单
                  <>
                  <View
                    className={`common-item head`}>
                    <View className='common-title mini'>{cm?.meta?.title}</View>
                    <View>
                      <View className='tag-btn-list flex flex-end'>
                        {
                          tagList.map((tm) => {
                            return (
                              <View className={`tag-btn-item ${cm.config == tm.config && 'active'}`} onClick={() => changeActive(cm, tm.config)}>{tm.name}</View>
                            )
                          })
                        }
                      </View>
                    </View>
                  </View>
                  </>
                )
              }) : <></>
            }
          </View>
          </>
        )
      }) : <AtLoadMore status="noMore" noMoreText="暂无数据"></AtLoadMore>}
      </View>

      <GFeedback></GFeedback>
    </View>
  )
}
