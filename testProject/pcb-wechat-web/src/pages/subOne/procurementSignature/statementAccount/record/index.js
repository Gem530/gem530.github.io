import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import { View } from '@tarojs/components'
// import GUp from '../../../../../components/g-up'
import GFeedback from '../../../../../components/g-feedback'
import GDrawerFilter from '../../../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { adjustListAppAPI } from '../../../../services/materialRequisition/index'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtProgress, AtButton } from 'taro-ui'


export default function ProcurementSignatureStatementAccountRecord() {
  // type 1:送货 2:退货
  const isEnterList = [
    { title: '送货调整', id: '1' },
    { title: '退货调整', id: '2' },
  ]
  const initQuery = {
    code: '',
    materialCode: '',
    createTime: ['',''],
  }
  const formList = [
    {
      isQuick: true, // 开启时间快捷键
      value: ['', ''],
      type: 'timeRange',
      field: 'createTime',
      title: '选择调整时间',
    },
    {
      value: '',
      type: 'input',
      field: 'code',
      title: '单据编码',
      attrs: {
        maxLength: '50',
        placeholder: '请输入送货/退货单号',
      }
    },
    {
      value: '',
      type: 'input',
      title: '物料编码',
      field: 'materialCode',
      attrs: {
        maxLength: '50',
        placeholder: '请输入物料编码',
      }
    },
  ]
  const GShareFileRef = useRef()
  const GDrawerFilterRef = useRef()

  const [id, setId] = useState()
  const [options, setOptions] = useState()
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState([{},{}])
  const [query, setQuery] = useState(initQuery)
  const [didShow, setDidShow] = useState(false)
  // const [waitShowAll, setWaitShowAll] = useState(false) // 待盘点 是否查看所有的数据
  
  useShareAppMessage(() => {
    return {
      title: `调整记录`,
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

  // 步骤改变
  const changeStep = (e) => {
    console.log('changeStep', e)
  }

  // // tab改变
  // const tabClick = (e) => {
  //   console.log('tabClick', e)
  //   setExpressCrt(e)
  // }
  // tab点击
  const handleClick = (e) => {
    setCurrent(e)
  }
  // 展示名称
  const toolTipHandle = (e, name) => {
      // console.log(e)
      e.stopPropagation()
      Taro.showModal({ content: name, showCancel: false, confirmText: '知道了' })
  }

  // 复制功能
  const copyText = (text) => {
    if (!text) return;
    Taro.setClipboardData({
      data: text,
      success () {
        Taro.showToast({ title: '复制成功', icon: 'success', duration: 1500 })
      }
    })
  }

  // 跳转 拨打电话
  const makePhone = (phoneNumber) => {
    Taro.makePhoneCall({ phoneNumber })
  }

  const previewImg = (fileList) => {
    if (!fileList?.length) return
    setDidShow(true)
    Taro.previewImage({
      current: fileList[0],
      urls: fileList
    })
  }

  // 页面跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }

  // 判断是否有搜索条件
  const isSearch = () => {
    return !!(query?.code || query?.materialCode || query?.createTime[0] || query?.createTime[1])
  }
  // 筛选弹框确认
  const confirmHandle = (val) => {
    // console.log('确认-val', val)
    let tempList = [
      { value: val?.code, field: 'code' },
      { value: val?.materialCode, field: 'materialCode' },
      { value: val?.createTime || ['',''], field: 'createTime' },
    ]
    getDetail(id, tempList)
  }
  // 筛选弹框重置
  const resetHandle = () => {
    // searchRef.current.clear({value: ''})
    let tempList = [
      { value: '', field: 'code' },
      { value: '', field: 'materialCode' },
      { value: ['',''], field: 'createTime' },
    ]
    getDetail(id, tempList)
  }
  // 打开抽屉
  const openFilter = () => {
    GDrawerFilterRef.current.openFilter({
      code: query?.code,
      createTime: query?.createTime,
      materialCode: query?.materialCode,
    }, '筛选')
  }
  
  const getDetail = (tempId, arr) => {
    if (!tempId) return;
    // const params = JSON.parse(JSON.stringify(query))
    const params = {
      accountOrderId: tempId,
    }
    arr?.length && arr.map((m) => {
      params[m.field] = m.value
    })
    if (params?.createTime?.length) {
      params.createTimeStart = (params?.createTime[0] ? dayjs(params?.createTime[0]).format('YYYY-MM-DD 00:00:00') : '')
      params.createTimeEnd = params?.createTime?.length > 1 ? (params?.createTime[1] ? dayjs(params?.createTime[1]).add(1, 'day').format('YYYY-MM-DD 00:00:00') : '') : ''
      delete params?.createTime
    }
    updateData(arr)
    Taro.showLoading({title: '加载中...',mask: true})
    adjustListAppAPI(params).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        setList(res?.data || [])
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

      {/* 对账明细11 */}
      <View className='common-card new record-detail'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-reject-tip'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>调整记录明细</View>
          </View>
        </View>

        {
          // 待盘点
          true ? <>
          <View className='flex flex-between'>
            <AtTabs
              scroll
              current={current}
              tabList={isEnterList.map((m) => {
                return {
                  title: `${m.title}(${list?.length ? (list.filter((f) => f?.type == m?.id)?.length || 0) : 0})`
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
            list?.length && list.filter((f) => f?.type == (current+1))?.length ? list.filter((f) => f?.type == (current+1)).slice(0, 100).map((item) => {
              return (
                <View className='record-detail-row'>
                  <View className='common-item new'>
                    <View className='common-title mini'><View className='overflow-omit w-100'>{item?.code}</View></View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料编码</View>
                      <View className='common-item-value overflow-hidde'>{item?.materialCode}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>调整项目</View>
                      <View className='common-item-value overflow-hidde'>{item?.isPrice == '1' ? '单价' : '数量'}</View>
                    </View>
                  </View>
  
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>调整前</View>
                      <View className='common-item-value'>{item?.adjustBefore}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>调整后</View>
                      <View className='common-item-value'>{item?.adjustAfter}</View>
                    </View>
                  </View>

                  <View className='common-item new'>
                    <View className='common-item-label'>调整时间</View>
                    <View className='common-item-value'>{item?.createTime}</View>
                  </View>
                </View>
              )
            }) : <View className='g-empty no-margin-top'>暂无数据</View>
          }
          </> : <></>
        }
      </View>
      {list.filter((f) => f?.type == (current+1))?.length > 100 ? <View className='max-data-length-100'>当前最多展示100条</View> : <></>}
      
      <GFeedback right={true}></GFeedback>
      {/* <GUp style={{bottom: '192rpx'}}></GUp> */}
      <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
    </View>
  )
}
