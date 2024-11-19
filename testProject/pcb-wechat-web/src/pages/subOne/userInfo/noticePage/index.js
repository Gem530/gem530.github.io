import './index.less'
import { useEffect, useState } from "react"
import { View, ScrollView } from '@tarojs/components'
import GFeedback from '../../../../components/g-feedback'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { AtButton, AtLoadMore, AtTabs, AtTabsPane } from "taro-ui"
import { getNotifyListAPI, getNotifyNumAPI, getNotifyRecordAPI, getRecordNumAPI, readNotifyAPI, readAllNotifyAPI } from "../../../services/noticePage"

export default function NoticePage() {
  const tabList = [
    { id: 0, title: '未读' },
    { id: 1, title: '已读' },
  ]
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dataInfo, setDataInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [noReadCount, setNoReadCount] = useState(0);

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '消息通知',
      path: '/pages/index/index'
    }
  })

  useLoad(() => {
    Taro.removeStorageSync('noticeAccount')
    getRecordNum()
    getNotifyList()
  })

  // 获取未读消息数量
  const getNotifyNum = () => {
    return new Promise((resolve, reject) => {
      getNotifyNumAPI().then((res) => {
        if (res.code == 200) {
          setNoReadCount(res.data || 0)
          resolve(res)
        } else reject(res)
      }).catch(err => reject(err))
    })
  }
  // 获取未读消息
  const getNotifyList = async () => {
    return new Promise((resolve, reject) => {
      getNotifyNum()
      Taro.showLoading({ mask: true })
      getNotifyListAPI().then((res) => {
        if (res.code == 200) {
          res.data?.length && res.data.map((item) => {
            item.isRead = '1'
          })
          setList((res.data || []).slice(0, 100))
          Taro.hideLoading()
          resolve(res)
        } else reject(res)
      }).catch(err => reject(err))
    })
  }

  // 获取已读消息数量
  const getRecordNum = () => {
    return new Promise((resolve, reject) => {
      getRecordNumAPI().then((res) => {
        if (res.code == 200) {
          setReadCount(res.data || 0)
          resolve(res)
        } else reject(res)
      }).catch(err => reject(err))
    })
  }
  // 获取已读消息
  const getNotifyRecord = () => {
    return new Promise((resolve, reject) => {
      getRecordNum()
      Taro.showLoading({ mask: true })
      getNotifyRecordAPI().then((res) => {
        if (res.code == 200) {
          setList((res.data || []).slice(0, 100))
          Taro.hideLoading()
          resolve(res)
        } else reject(res)
      }).catch(err => reject(err))
    })
  }

  // 菜单切换
  const tabClick = (e) => {
    setCurrent(e)
    if (e == 0) {
      getNotifyList()
    } else {
      getNotifyRecord()
    }
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
  // 点击消息
  const toDetail = (row) => {
    // console.log(row)
    if (current == 0) {
      readNotifyAPI({id: row.id}).then((res) => {
        if (res.code == 200) {
          getRecordNum()
          getNotifyList()
        }
      })
    }
    if (row?.category == '4') {
      Taro.setStorageSync('noticeAccount', JSON.stringify(row?.wxContent || {}))
    }
    if (row?.url) {
      toPath(row.url)
    }
  }

  // 一键已读
  const readAllHandle = () => {
    Taro.showLoading({ mask: true })
    readAllNotifyAPI().then((res) => {
      if (res.code == 200) {
        Taro.hideLoading()
        if (current == 0) {
          getRecordNum()
          getNotifyList()
        } else {
          getNotifyNum()
          getNotifyRecord()
        }
      }
    })
  }

  return (
    <View className="notice-list-page">
      <View className='notice-head flex flex-between'>
        <AtTabs className='new notice-tabs' current={current} tabList={tabList.map(m => {
          return {
            title: `${m.title}(${m.id == 0 ? noReadCount : readCount})`
          }
        })} onClick={tabClick}></AtTabs>
        <View className='flex-grow'></View>
        {current == 0 ?
        <View className='flex flex-end' style={'width: 200rpx;'} onClick={readAllHandle}>
          <View className='primary-clean'></View>
          <View className='f-s-24 m-l-8' style={'color: #919191;'}>一键已读</View>
        </View> :<></>
        }
      </View>
      
      <View className='notice-box'>
      {/* 目前只展示100条，但不展示 只展示100 的文案 */}
      {list?.length ? list.slice(0, 100).map((m, index) => {
        return (
          <View className={`common-card new ${m?.isRead == '1' && 'badge'}`} onClick={() => toDetail(m)}>
            <View className={`common-item new head m-b-20`}>
              <View className='common-title'>{m?.title}</View>
            </View>
            {
              m?.wxContent?.length ? m.wxContent.map((sub) => {
                return (
                  <View className={`common-item new`}>
                    <View className='common-item-label'>{sub?.label}</View>
                    <View className='common-item-value'>{sub?.value}</View>
                  </View>
                )
              }) : <></>
            }
            {/* <View className={`common-item new`}>
              <View className='common-item-label'>{'供应商'}</View>
              <View className='common-item-value'>{m?.content}</View>
            </View>
            <View className={`common-item new`}>
              <View className='common-item-label'>{'申请时间'}</View>
              <View className='common-item-value'>{m?.createTime}</View>
            </View> */}
          </View>
        )
      }) : <AtLoadMore status="noMore" noMoreText="暂无数据"></AtLoadMore>}
      {/* {list?.length > 100 ? <View className='max-data-length-100'>当前最多展示100条</View> : <></>} */}
      </View>

      <GFeedback></GFeedback>
    </View>
  )
}
