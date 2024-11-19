import { useState } from 'react'
import Taro, {useLoad,useShareAppMessage} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtTimeline, AtLoadMore, AtActivityIndicator } from 'taro-ui'
import './index.less'
import MaterialReport from '../materialRequisition/materialReport'
import { getUrlByKeysErpAPI } from '../services/upload'
import { getAppletPurchaseOrderDetailAPI } from '../services/materialRequisition/index'
import GFeedback from '../../components/g-feedback'


export default function MaterialDetail() {
  const tabList = [{title: '物料详情'},{title: '审核记录'}]
  const [id, setId] = useState(0)
  const [type, setType] = useState(1)
  const [crtTab, setCrtTab] = useState(0)
  const [detailInfo, setDetailInfo] = useState(undefined)
  const [auditList, setAuditList] = useState([
    // { title: 'User1 提交', content: ['操作时间: 2024-03-26 12:12'] },
    // { title: '仓库主管审核通过', content: ['操作时间: 2024-03-26 12:12', '审核意见: 通过了'] },
    // { title: '仓库主管审核通过', content: ['操作时间: 2024-03-26 12:12', '审核意见: 驳回'] },
    // { title: 'User1 提交', content: ['操作时间: 2024-03-26 12:12'] },
  ])
  useLoad((options) => {
    console.log('detail--', options)
    setId(options.id)
    setType(options.type) // 其他页进入时参数type 1:个人记录页 2:待审核页 3:审核记录页
    getAppletPurchaseOrderDetail(options.id)
  })
  useShareAppMessage(() => {
      return {
          title: '物料请购详情',
          path: '/pages/index/index'
      }
  })

  // 获取详情
  const getAppletPurchaseOrderDetail = (id) => {
    getAppletPurchaseOrderDetailAPI(id).then((res) => {
      if (res.code == 200) {
        if (res.data?.orderDetailVoList?.length) {
          res.data.orderDetailVoList.map((item) => {
            item.isChoose = true
          })
        }
        setDetailInfo(res.data)
        if (res.data?.flowList?.length) {
          res.data.flowList.map((item) => {
            // item.isChoose = true
            item.title = `${item?.taskName || ''} ${item?.category || ''}`
            item.content = []
            if (item.finishTime) {
              item.content.push(`操作人: ${item.assigneeName || ''}`)
              item.content.push(`操作时间: ${item.finishTime || ''}`)
              item.icon = 'check-circle'
              item.color = 'green'
            }
            if (item?.comment?.comment) {
              item.content.push(`审核意见: ${item?.comment?.comment}`)
            }
            if (item?.comment?.type == '3') {
              item.color = 'red'
              item.icon = 'close-circle'
            }
          })
          setAuditList(res.data.flowList)
        }
      }
    })
  }

  // 点击 tab 切换
  const tabClick = (i) => {
    // console.log(i)
    setCrtTab(i)
  }
  return (
    <View className='material-detail'>
      {(detailInfo != undefined ? <>
        <AtTabs animated={false} current={crtTab} tabList={tabList} onClick={tabClick}>
          <AtTabsPane current={crtTab} index={0} >
            <View></View>
          </AtTabsPane>
          <AtTabsPane current={crtTab} index={1}>
            <View></View>
          </AtTabsPane>
        </AtTabs>
        <View className='material-tab-body'>
          {crtTab == 0 && <MaterialReport
              key='MaterialReportTab'
              detailInfo={detailInfo}
              disabled={[1].includes(Number(type || 0)) ? ![1].includes(Number(detailInfo?.status || 0)) : true} // 其他页进入时参数type 1:个人记录页 2:待审核页 3:审核记录页
              type={type == 2 ? 4 : type == 3 ? 5 : [1].includes(Number(detailInfo?.status || 0)) ? 2 : 3} // MaterialReport组件参数type 1:新增采购 2:修改采购 3:个人查看记录 4:待审核 5:审核记录
            ></MaterialReport>}
          {crtTab == 1 && (auditList?.length ? <AtTimeline items={auditList}></AtTimeline> : <AtLoadMore status='noMore' noMoreText='暂无记录'></AtLoadMore>)}
        </View>
      </> : <AtActivityIndicator mode='center' content='Loading...'></AtActivityIndicator>)}
      <GFeedback></GFeedback>
    </View>
  )
}
