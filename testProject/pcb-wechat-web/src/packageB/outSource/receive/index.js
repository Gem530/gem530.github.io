import './index.less'
import dayjs from 'dayjs'
import {useRef, useState} from 'react'
import Search from '../../../components/search'
import {View, Text, ScrollView} from '@tarojs/components'
import GDrawerFilter from '../../../components/g-drawer-filter'
import Taro, {useLoad, useDidShow, useShareAppMessage} from '@tarojs/taro'
import {
  AtTabs,
  AtLoadMore,
  AtButton,
} from "taro-ui"
import GFeedback from '../../../components/g-feedback'
import GConfirm from "../../../components/g-confirm";
import {receiveCountAPI, receiveListAPI} from "../../../pages/services/outSource/receive";
import {queryUrlLinkAPI} from "../../../pages/services/login/loginService";

export default function InventoryCheck() {
  const statusList = [
    {id: 0, name: '待收货'},
    {id: 1, name: '收货记录'},
  ]

  const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
  const initQuery = {
    isSign: 0,
    pageNum: 1,
    pageSize: 10,
  }
  // 弹框信息
  const initDialog = {
    email: '',
    open: false,
    title: '发送邮箱',
  }
  // 初始化数量
  const initCounts = {
    0: 0,
    1: 0,
  }
  const initRecord = {
    list: [],
    open: false,
    title: '修改数据',
  }

  const GConfirmRef = useRef()
  const scrollRef = useRef()
  const searchRef = useRef()
  const GDrawerFilterRef = useRef()
  const [list, setList] = useState([])
  const [current, setCurrent] = useState(0)
  const [isLoad, setIsLoad] = useState(true)
  const [query, setQuery] = useState(initQuery)
  const [status, setStatus] = useState('loading')
  const [counts, setCounts] = useState(initCounts)
  const [scrollIntoId, setScrollIntoId] = useState('')
  const [dialogInfo, setDialogInfo] = useState(initDialog)
  const [recordInfo, setRecordInfo] = useState(initRecord)
  const formList = [
    {
      type: 'tag',
      title: '单据状态',
      field: 'isSign',
      data: statusList,
      value: statusList.find((f) => f.id == initQuery?.status),
    },
    {
      value: '',
      type: 'input',
      title: '产品型号',
      field: 'commodityCode',
      attrs: {
        maxLength: '50',
        placeholder: '请输入',
        // clear: true
      }
    },
    {
      value: ['', ''],
      type: 'inputTwo',
      title: '长 * 宽(mm)',
      field: 'chang',
      startAttrs: {
        type: 'number',
        maxLength: '13',
        placeholder: '请输入',
      },
      endAttrs: {
        type: 'number',
        maxLength: '13',
        placeholder: '请输入',
      }
    },
    {
      value: '',
      type: 'input',
      title: '加工工序',
      field: 'craftName',
      attrs: {
        maxLength: '50',
        placeholder: '请输入',
        // clear: true
      }
    },
    {
      value: '',
      type: 'input',
      title: '加工要求',
      field: 'requirementQuery',
      attrs: {
        maxLength: '50',
        placeholder: '请输入',
        // clear: true
      }
    },
    {
      value: '',
      type: 'input',
      title: '备注',
      field: 'remark',
      attrs: {
        maxLength: '50',
        placeholder: '请输入',
        // clear: true
      }
    },

  ]
  useLoad(() => {
    Taro.removeStorageSync('detailData')
    getReceiveList([{value: 1, field: 'pageNum'}])
  })
  useDidShow(() => {
    const isRefresh = Taro.getStorageSync('isRefresh')
    if (isRefresh) {
      // setList([])
      getReceiveList([{value: 1, field: 'pageNum'}])
      Taro.removeStorageSync('isRefresh')
    }
  })
  useShareAppMessage(() => {
    return {
      title: '盘点计划',
      path: '/pages/index/index'
    }
  })

  // 返回加急颜色
  const getUrgentClass = (urgent) => {
    const redList = ['加急8h', '加急12h', '加急24h']
    const yellowList = ['加急36h', '加急48h']
    let res = ''
    if (redList.includes(urgent.toLowerCase())) res = 'pcb-red'
    if (yellowList.includes(urgent.toLowerCase())) res = 'pcb-yellow'
    return res
  }
  // tab点击
  const handleClick = (e) => {
    setCurrent(e);
    getReceiveList([{value: 1, field: 'pageNum'}, {value: statusList[e]?.id || 0, field: 'isSign'}])
  }

  // 搜索事件
  const searchHandle = (e) => {
    const tempList = [{value: 1, field: 'pageNum'}, {value: e.value || '', field: 'codeOrOther'}, {value: statusList[e]?.id || 0, field: 'isSign'}]
    getReceiveList(tempList)
  }

  // 判断是否有搜索条件
  const isSearch = () => {
    return !!(!['0'].includes(query?.type + '') || !['0'].includes(query?.status + '') || query?.planTimeEnd || query?.planTimeStart)
  }
  // 筛选弹框确认
  const confirmHandle = (val) => {
    // console.log(val)
    let tempList = [
      {value: 1, field: 'pageNum'},
      {value: val.isSign?.id || 0, field: 'isSign'},
      {value: val.commodityCode || '', field: 'commodityCode'},
      { value: val?.chang[1] || '', field: 'width' },
      { value: val?.chang[0] || '', field: 'length' },
      {value: val.craftName || '', field: 'craftName'},
      {value: val.requirementQuery || '', field: 'requirementQuery'},
      {value: val.remark || '', field: 'remark'},

    ]
    setCurrent(statusList.findIndex((f) => f.id == val.isSign?.id) || 0)
    getReceiveList(tempList)
  }
  // 筛选弹框重置
  const resetHandle = () => {
    searchRef.current.clear({value: ''})
    // setQuery(initQuery)
    let tempList = [
      {value: 0, field: 'isSign'},
      {value: 1, field: 'pageNum'},
      {value: '', field: 'commodityCode'},
      { value: '', field: 'width' },
      { value: '', field: 'length' },
      {value: '', field: 'craftName'},
      {value: '', field: 'requirementQuery'},
      {value: '', field: 'remark'},
      {value: '', field: 'codeOrOther'},
    ]
    setCurrent(0)
    getReceiveList(tempList)
  }

  // 抽屉弹框确认
  const confirmDrawer = (val) => {
    // console.log(val)
    let tempList = [
      {value: 1, field: 'pageNum'},
      {value: val.isSign?.id, field: 'isSign'},

    ]
    setCurrent(statusList.findIndex((f) => f.id == val.isSign?.id) || 0)
    getReceiveList(tempList)
  }

  // 修改数据
  const updateData = (arr, tempType = 'query') => {
    // arr = [{ value: '1212', field: 'number' }]
    if (!arr?.length) return
    if (tempType == 'query') {
      let tempInfo = JSON.parse(JSON.stringify(query))
      arr.map((item, index) => {
        tempInfo[item.field] = item.value
      })
      setQuery(tempInfo)
    } else if (tempType == 'record') {
      let tempInfo = JSON.parse(JSON.stringify(recordInfo))
      arr.map((item, index) => {
        tempInfo[item.field] = item.value
      })
      setRecordInfo(tempInfo)
    } else if (tempType == 'dialog') {
      let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
      arr.map((item, index) => {
        tempInfo[item.field] = item.value
      })
      setDialogInfo(tempInfo)
    }
  }

  // 获取数量
  const checkPlanListCount = (tempParams) => {
    return new Promise((resolve, reject) => {
      let params = JSON.parse(JSON.stringify(tempParams))
      delete params?.isSign
      receiveCountAPI(params).then((res) => {
        if (res.code == 200) {
          setCounts(res.data)
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(false))
    })
  }
  // 获取列表数据
  const getReceiveList = async (arr) => {
    setIsLoad(false)
    const params = JSON.parse(JSON.stringify(query))
    if (arr?.length) {
      // params
      arr.map((item, index) => {
        params[item.field] = item.value
      })
      updateData(arr)
    }
    if (params.pageNum == 1) {
      setStatus('loading')
    }
    try {
      await checkPlanListCount(params)
    } catch (err) {
      console.log('err1', err)
    }
    receiveListAPI(params).then((res) => {
      if (res.code == 200) {
        let tempList = []
        if (params.pageNum != 1) {
          tempList = list
        }
        tempList = tempList.concat(res.rows || [])
        setList(tempList)
        // setStatus('more')
        if (tempList.length >= res.total) {
          setStatus('noMore')
        } else {
          params.pageNum = params.pageNum + 1
          updateData((arr || []).concat([{value: params.pageNum, field: 'pageNum'}]))
        }
      }
      if (params.pageNum <= 2) {
        setTimeout(() => {
          setScrollIntoId('top')
        }, 10)
      }
    }).finally(() => {
      setIsLoad(true)
    })
  }

  // 触底事件
  const scrolltolower = () => {
    if (status == 'noMore') {
      return;
    }
    if (!isLoad) {
      return
    }
    getReceiveList()
  }

  // 打开抽屉
  const openFilter = () => {
    console.log(query)
    console.log(statusList.find((f) => f.id == query.isSign))
    GDrawerFilterRef.current.openFilter({
      isSign: statusList.find((f) => f.id == query.isSign),
      commodityCode: query?.commodityCode,
      chang: [query?.length, query?.width],
      craftName: query?.craftName,
      requirementQuery: query?.requirementQuery,
      remark: query?.remark,
      codeOrOther: query?.codeOrOther
    }, '高级筛选')
  }

  // 滚动中
  const scrollHandle = () => {
    setScrollIntoId('')
  }

  // 跳转到详情
  const toDetail = (e, id) => {
    if(e){
      e.stopPropagation()
    }
    Taro.navigateTo({url: `detail/index?id=${id}`})
  }

  // 扫码按钮
  const scanHandle = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      success: async (res) => {
        console.log(res)
        const wxRes = await queryUrlLinkAPI({ urlLink: res.result })
        let id = wxRes.data
        if (wxRes?.data?.query) {
          let url = decodeURIComponent(wxRes.data.path +'?'+ wxRes.data?.query)
          let obj = getUrlParam(url)
          // console.log(obj)
          // getDetail(obj.code)
          id = obj.id
        }
        toDetail(null,id);
      },
      fail: (err) => {
        console.log(err)
        if (!err?.errMsg.includes('scanCode:fail cancel'))
          Taro.showToast({
            title: '识别失败，请重试',
            icon: 'error',
            duration: 1500
          })
      }
    })
  }

  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  return (
    <View className='pcb-page'>
      <View className='page-top-search'>
        <Search
          tag={<></>}
          time={<></>}
          select={<></>}
          ref={searchRef}
          onChange={searchHandle}
          placeholder={'搜索供应商/加工单号'}
          inputChange={(e) => updateData([{ value: e, field: 'codeOrOther' }])}
          btn={
            <View className='primary-search-scan' onClick={scanHandle}></View>
          }
          btn1={
            <View style={'margin-left:0'} className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`}
                  onClick={openFilter}>
              <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
              <View>筛选</View>
            </View>
          }
        ></Search>
        <AtTabs
          current={current}
          className='new no-body'
          tabList={statusList.map((m, mI) => {
            return {
              title: (m?.name || '') + `(${counts[m?.id]})`
            }
          })}
          onClick={handleClick}
        ></AtTabs>
      </View>

      <ScrollView ref={scrollRef} lowerThreshold={150} scrollIntoView={scrollIntoId} className="pcb-box hide-srcoll"
                  scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
        {
          // [1,2].map((item, index) => {
          list.map((item, index) => {
            return (
              <>
                <View id={index == 0 ? 'top' : `top${index}`} className='common-card new'
                      style={`margin-bottom:0; ${index == 0 ? '' : 'margin-top: 20rpx;'}`} onClick={(e) => toDetail(e, item.id)}
                      >
                  <View className={`common-position-tip`}>{item?.isSign == '0' ? '待签收' : item?.isSign == '1' ? '已签收' : ''}</View>
                  <View className='common-item new'>
                    <View className='common-title has-position flex flex-start'>
                      <View className='common-type m-r-10'>正常</View>
                      <View className='overflow-omit'>{item?.code}</View>
                    </View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工单号</View>
                    <View className='common-item-value'>{item?.outSourceCode}</View>
                  </View>
                  <View className='flex flex-between'>
                    <View className={'common-item new outsource'}>
                      <View className='common-item-label'>客户订单号</View>
                      <View className='common-item-value'>{item?.orderCode}</View>
                    </View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>外协供应商</View>
                    <View className='common-item-value'>{item?.ownerName}</View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>发货人</View>
                    <View className='common-item-value'>{item?.createByName}</View>
                  </View>
                  <View className={`common-item new outsource`}>
                    <View className='common-item-label'>发货时间</View>
                    <View className='common-item-value'>{item?.deliveryTime}</View>
                  </View>
                  <View className={`common-item new outsource`}>
                    <View className='common-item-label'>收货地址</View>
                    <View className='common-item-value'>{item?.deliveryAddress}</View>
                  </View>
                </View>
              </>
            )
          })
        }
        <AtLoadMore status={status} noMoreText={'暂无数据'}></AtLoadMore>
      </ScrollView>

      <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle}
                     confirm={confirmHandle}></GDrawerFilter>

      <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>

      <GFeedback></GFeedback>
    </View>
  )
}
