import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import GFeedback from '../../components/g-feedback'
import GDrawerFilter from '../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtProgress, AtButton } from 'taro-ui'
import { applyListAPI, applyListCountAPI } from '../../pages/services/materialRequisition/index'


export default function ProcurementSignatureStatementAccountRecord() {
  // type 1:送货 2:退货
  const isEnterList = [
    { title: '送货单', id: '1' },
    { title: '退货单', id: '2' },
  ]
  const changeTagList = [
    { id: '0', name: '全部' },
    { id: '1', name: '单价' },
    { id: '2', name: '数量' },
    { id: '3', name: '折扣金额' },
  ]
  const initQuery = {
    code: '',
    type: '0',
    materialCode: '',
  }
  const formList = [
    {
      value: '',
      type: 'input',
      field: 'code',
      title: '单据编码:',
      attrs: {
        maxLength: '50',
        placeholder: '请输入送货/退货单号',
      }
    },
    {
      value: '',
      type: 'input',
      title: '物料编码:',
      field: 'materialCode',
      attrs: {
        maxLength: '50',
        placeholder: '请输入物料编码',
      }
    },
    {
      value: '',
      type: 'tag',
      field: 'type',
      title: '选择修改项目:',
      data: changeTagList
    },
  ]
  const GShareFileRef = useRef()
  const GDrawerFilterRef = useRef()

  const [id, setId] = useState()
  const [options, setOptions] = useState()
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState([{},{}])
  const [headInfo, setHeadInfo] = useState()
  const [query, setQuery] = useState(initQuery)
  const [didShow, setDidShow] = useState(false)
  // const [waitShowAll, setWaitShowAll] = useState(false) // 待盘点 是否查看所有的数据
  const [countInfo, setCountInfo] = useState({
    '0': 0, // 送货
    '1': 0, // 退货
  })
  
  useShareAppMessage(() => {
    return {
      title: `通知详情`,
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    console.log('option:', option)
    setId(option.id)
    setOptions(option)
    if (option?.q) {
      let url = decodeURIComponent(option.q)
      let obj = getUrlParam(url)
      setId(obj.id)
    }
  })
  useDidShow(() => {
    if (didShow) {
      setDidShow(false)
      return
    }
    let noticeAccount = Taro.getStorageSync('noticeAccount')
    if (noticeAccount && noticeAccount != '{}') {
      noticeAccount = JSON.parse(noticeAccount)
      if (noticeAccount?.length) {
        let tempParams = {
          name: noticeAccount?.find((f) => f.label == '供应商')?.value || '',
          time: noticeAccount?.find((f) => f.label == '申请时间')?.value || '',
        }
        setHeadInfo(tempParams)
      }
    }
    if (id) {
      getDetail(id)
    }
  })

  // 修改数据
  const updateData = (arr, tempType = 'query') => {
    if (!arr?.length) return
    if (tempType == 'query') {
        let tempInfo = JSON.parse(JSON.stringify(query))
        arr.map((item, index) => {
            tempInfo[item.field] = item.value
        })
        setQuery(tempInfo)
    }
  }
  
  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // // tab改变
  // const tabClick = (e) => {
  //   console.log('tabClick', e)
  //   setExpressCrt(e)
  // }
  // tab点击
  const handleClick = (e) => {
    setCurrent(e)
    let tempList = [
      { value: e + 1, field: 'orderType' },
    ]
    getDetail(id, tempList)
  }

  // 判断是否有搜索条件
  const isSearch = () => {
    return !!(query?.code || (query?.type != '0') || query?.materialCode)
  }
  // 筛选弹框确认
  const confirmHandle = (val) => {
    // console.log('确认-val', val)
    let tempList = [
      { value: val?.code, field: 'code' },
      { value: val?.type?.id || '0', field: 'type' },
      { value: val?.materialCode, field: 'materialCode' },
    ]
    getDetail(id, tempList)
  }
  // 筛选弹框重置
  const resetHandle = () => {
    // searchRef.current.clear({value: ''})
    let tempList = [
      { value: '', field: 'code' },
      { value: '0', field: 'type' },
      { value: '', field: 'materialCode' },
    ]
    getDetail(id, tempList)
  }
  // 打开抽屉
  const openFilter = () => {
    GDrawerFilterRef.current.openFilter({
      code: query?.code,
      materialCode: query?.materialCode,
      type: changeTagList.find((f) => f.id == query?.type),
    }, '筛选')
  }
  
  // 获取明细数量
  const applyListCount = (tempParams) => {
    let params = JSON.parse(JSON.stringify(tempParams))
    delete params.pageNum
    delete params.pageSize
    applyListCountAPI(params).then((res) => {
      if (res.code == 200) {
        setCountInfo(res.data)
      }
    })
  }
  const getDetail = async (tempId, arr) => {
    if (!tempId) return;
    // const params = JSON.parse(JSON.stringify(query))
    const params = {
      pageNum: 1,
      pageSize: 100,
      orderType: current + 1,
      accountOrderId: tempId,
    }
    arr?.length && arr.map((m) => {
      params[m.field] = m.value
    })
    if (params?.type == 0) {
      delete params?.type
    }
    updateData(arr)
    applyListCount(params)
    Taro.showLoading({title: '加载中...',mask: true})
    applyListAPI(params).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        setList(res?.rows || [])
      }
      Taro.hideLoading()
    }).catch((err) => {
      console.log('err', err)
      setTimeout(() => {
        Taro.hideLoading()
      }, 1500)
    })
  }

  return (
    <View className='statement-record-page'>
      <View className='common-card new'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-base'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>基础信息</View>
          </View>
        </View>

        <View className='common-item new'>
          <View className='common-item-label'>供应商</View>
          <View className='common-item-value'>{headInfo?.name}</View>
        </View>
        <View className='common-item new'>
          <View className='common-item-label'>修改时间</View>
          <View className='common-item-value'>{headInfo?.time}</View>
        </View>
      </View>

      {/* 对账明细11 */}
      <View className='common-card new record-detail'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-detail'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>修改明细</View>
          </View>
        </View>

        {
          // 待盘点
          true ? <>
          <View className='flex flex-between'>
            <AtTabs
              scroll
              current={current}
              tabList={isEnterList.map((m, mI) => {
                return {
                  title: `${m.title}(${countInfo[mI]})`
                }
              })}
              className='new no-body tab-auto'
              onClick={handleClick}
            ></AtTabs>
            <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                <View>筛选</View>
            </View>
          </View>
          {
            list?.length && list?.length ? list.map((item) => {
              return (
                <View className='record-detail-row'>
                  <View className='common-item new'>
                    <View className='common-title mini'><View className='overflow-omit w-100'>{item?.code}</View></View>
                  </View>

                  <View className='common-item new'>
                    <View className='common-item-label'>物料名称</View>
                    <View className='common-item-value'>{item?.materialName}</View>
                  </View>

                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料编码</View>
                      <View className='common-item-value overflow-hidde'>{item?.materialCode}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>修改项目</View>
                      <View className='common-item-value overflow-hidde'>{item?.type == '1' ? '单价' : '数量'}</View>
                    </View>
                  </View>
  
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>修改前</View>
                      <View className='common-item-value'>{item?.oldValue}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>修改后</View>
                      <View className='common-item-value'>{item?.modifyValue}</View>
                    </View>
                  </View>
                </View>
              )
            }) : <View className='g-empty no-margin-top'>暂无数据</View>
          }
          </> : <></>
        }
      </View>
      {list.filter((f) => f?.type == (current+1))?.length >= 100 ? <View className='max-data-length-100'>当前最多展示100条</View> : <></>}
      
      <GFeedback></GFeedback>
      <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
    </View>
  )
}
