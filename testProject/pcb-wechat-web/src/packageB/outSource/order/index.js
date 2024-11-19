import './index.less'
import dayjs from 'dayjs'
import {useRef, useState} from 'react'
import Search from '../../../components/search'
import {View, Text, ScrollView} from '@tarojs/components'
import GDrawerFilter from '../../../components/g-drawer-filter'
import Drawer from './drawer'
import Taro, {useLoad, useDidShow, useShareAppMessage} from '@tarojs/taro'
import {
  AtTabs,
  AtLoadMore,
  AtButton,
} from "taro-ui"
import GFeedback from '../../../components/g-feedback'
import {checkPlanListAPI, checkPlanListCountAPI} from '../../../pages/services/checkPlan/index'
import GTag from "../../../components/g-tag";
import GConfirm from "../../../components/g-confirm";
import {
  orderListAPI,
  orderDetailAPI,
  orderCountAPI,
  orderCompleteAPI,
  orderEnteringAPI,
  orderScrapAPI,
} from "../../../pages/services/outSource/order";

export default function InventoryCheck() {
  // const outStatusList = [
  //   {id: 0, name: '全部'},
  //   {id: 1, name: '加工中'},
  //   {id: 3, name: '发货中'},
  //   {id: 5, name: '已发货'},
  // ]

  const statusList = [
    {id: 0, name: '全部'},
    {id: 1, name: '待加工'},
    {id: 2, name: '部分加工'},
    {id: 3, name: '待发货'},
    {id: 4, name: '部分发货'},
    {id: 5, name: '已发货'},
    // {id: 6, name: '待接单'},
  ]
  // const tagList = [
  //   {id: 1, name: '待加工'},
  //   {id: 2, name: '部分加工'},
  // ]
  //
  // const tagList2 = [
  //   {id: 3, name: '待发货'},
  //   {id: 4, name: '部分发货'},
  // ]

  const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
  const initQuery = {
    status: 0,
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
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
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
  const drawerFormRef = useRef()
  const [list, setList] = useState([])
  const [current, setCurrent] = useState(0)
  const [isLoad, setIsLoad] = useState(true)
  const [query, setQuery] = useState(initQuery)
  const [status, setStatus] = useState('loading')
  const [counts, setCounts] = useState(initCounts)
  const [scrollIntoId, setScrollIntoId] = useState('')
  const [dialogInfo, setDialogInfo] = useState(initDialog)
  const [recordInfo, setRecordInfo] = useState(initRecord)
  // const [tagInfo, setTagInfo] = useState(tagList[0])
  // const [tagInfo2, setTagInfo2] = useState(tagList2[0])
  const formList = [
    {
      type: 'tag',
      title: '单据状态',
      field: 'status',
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
      title: '加工部门',
      field: 'processDeptName',
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
    getOrderList([{value: 1, field: 'pageNum'}])
  })
  useDidShow(() => {
    const isRefresh = Taro.getStorageSync('isRefresh')
    if (isRefresh) {
      // setList([])
      getOrderList([{value: 1, field: 'pageNum'}])
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
    getOrderList([{value: 1, field: 'pageNum'}, {value: statusList[e]?.id || 0, field: 'status'}])
  }

  // 搜索事件
  const searchHandle = (e) => {
    const tempList = [{value: 1, field: 'pageNum'}, {value: e.value || '', field: 'codeOrOtherName'}]
    getOrderList(tempList)
  }

  // 选择卡片
  // const chooseTag = (item) => {
  //   console.log(item)
  //   current == 1 ? setTagInfo(item) : setTagInfo2(item);
  //   const tempList = [{value: 1, field: 'pageNum'}, {value: item.id || '', field: current == 1 ? 'detailStatus' : 'detailStatus2'}]
  //   getOrderList(tempList)
  // }

  // 判断是否有搜索条件
  const isSearch = () => {
    return !!(!['0'].includes(query?.type + '') || !['0'].includes(query?.status + ''))
  }
  // 筛选弹框确认
  const confirmHandle = (val) => {
    console.log(val)
    let tempList = [
      {value: 1, field: 'pageNum'},
      {value: val?.status?.id || '', field: 'status'},
      {value: val?.commodityCode || '', field: 'commodityCode'},
      { value: val?.chang[1] || '', field: 'width' },
      { value: val?.chang[0] || '', field: 'length' },
      {value: val?.craftName || '', field: 'craftName'},
      {value: val?.requirementQuery || '', field: 'requirementQuery'},
      {value: val?.processDeptName || '', field: 'processDeptName'},
      {value: val?.remark || '', field: 'remark'},

    ]
    setCurrent(statusList.findIndex((f) => f.id == val.status?.id) || 0)
    getOrderList(tempList)
  }
  // 筛选弹框重置
  const resetHandle = () => {
    searchRef.current.clear({value: ''})
    // setQuery(initQuery)
    let tempList = [
      {value: 0, field: 'status'},
      {value: 1, field: 'pageNum'},
      {value: '', field: 'commodityCode'},
      { value: '', field: 'width' },
      { value: '', field: 'length' },
      {value: '', field: 'craftName'},
      {value: '', field: 'requirementQuery'},
      {value: '', field: 'processDeptName'},
      {value: '', field: 'remark'},
      {value: '', field: 'codeOrOtherName'},
    ]
    setCurrent(0)
    getOrderList(tempList)
  }

  // 抽屉弹框确认
  const confirmDrawer = (val,type) => {
    console.log(val)
    let tempList = [
      {value: 1, field: 'pageNum'},
    ]
    if(type == 1){
      const request = JSON.parse(JSON.stringify(val));
      delete request?.id;
      request.outSourceOrderDetailId = val.id;
      orderScrapAPI(request).then(res=>{
        if (res.code == 200){
          drawerFormRef.current.closeDrawer();
          getOrderList(tempList)
        }
      })
    } else if(type == 2){
      const request = {
        id:val.id,
        processQuantity: val.processQuantity
      }
      orderEnteringAPI(request).then(res=>{
        if (res.code == 200){
          drawerFormRef.current.closeDrawer();
          getOrderList(tempList)
        }
      })
    }


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
      delete params?.status
      orderCountAPI(params).then((res) => {
        if (res.code == 200) {
          setCounts(res.data)
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(false))
    })
  }
  // 获取列表数据
  const getOrderList = async (arr) => {
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
    if (params?.status == 0) {
      // 传0报错
      params.status = ''
    }
    params.status = params.status + ''
    try {
      await checkPlanListCount(params)
    } catch (err) {
      console.log('err1', err)
    }
    orderListAPI(params).then((res) => {
      if (res.code == 200) {
        let tempList = []
        if (params.pageNum != 1) {
          tempList = list
        }
        tempList = tempList.concat(res.rows || [])
        tempList.map(item => {
          item.show = false;
        })
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
    getOrderList()
  }

  // 打开抽屉
  const openFilter = () => {
    // console.log(query)
    GDrawerFilterRef.current.openFilter({
      status: statusList.find((f) => f.id == query.status),
      commodityCode: query?.commodityCode,
      chang: [query?.length, query?.width],
      craftName: query?.craftName,
      requirementQuery: query?.requirementQuery,
      processDeptName: query?.processDeptName,
      remark: query?.remark,
      codeOrOtherName: query?.codeOrOtherName,
    }, '高级筛选')
  }

  // 滚动中
  const scrollHandle = () => {
    setScrollIntoId('')
  }

  // 跳转到详情
  const toDetail = (e, id) => {
    e.stopPropagation()
    Taro.navigateTo({url: `detail/index?id=${id}`})
  }

  const openDrawer = (item,item1,type) => {
    item1.customerName = item.customerName;
    // item1.status = current;
    drawerFormRef.current.openFilter(item1, type == 1 ? '报废录入' : '加工录入',type)
  }

  // 显隐按钮权限
  const changeShow = (row) => {
    let tempList = JSON.parse(JSON.stringify(list))
    tempList.map((m) => {
      if (m?.id == row?.id) {
        m.show = !m.show
      }
    })
    // console.log(row, tempList)
    setList(tempList)
  }

  const finishAll = (id) => {
    GConfirmRef.current.openConfirm({
      title: '加工完成确认',
      content: <View className='w-100 f-s-32 font-weight-4 block-color'>确认完成后，该加工单中的所有产品均将视为加工完成</View>,
      cancelText: '我再想想',
      confirmText: '确认完成',
    }).then(() => {
      orderCompleteAPI({id:id}).then((res) => {
        if (res.code == 200) {
          getOrderList([{value: 1, field: 'pageNum'}]);
        }
      }).finally(() => {
        setIsLoad(true)
      })
    })
  }

  // 扫码按钮
  const scanHandle = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //todo
        console.log(res)
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

  return (
    <View className='pcb-page'>
      <View className='page-top-search'>
        <Search
          tag={<></>}
          time={<></>}
          select={<></>}
          ref={searchRef}
          onChange={searchHandle}
          placeholder={'搜索客户名称/加工单号/客户订单号'}
          inputChange={(e) => updateData([{ value: e, field: 'codeOrOtherName' }])}
          // btn={
          //   <View className='primary-search-scan' onClick={scanHandle}></View>
          // }
          btn={
            <View style={'margin-left:0'} className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`}
                  onClick={openFilter}>
              <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
              <View>筛选</View>
            </View>
          }
        ></Search>
        <AtTabs
          scroll
          current={current}
          className='new no-body'
          tabList={statusList.map((m, mI) => {
            return {
              title: (m?.name || '') + `(${counts[m?.id]})`
            }
          })}
          onClick={handleClick}
        ></AtTabs>
        {/*{current == 1 || current == 2 ? <View style={`padding: 0 32rpx;margin :10rpx 10rpx`}>*/}
        {/*  <GTag tagInfo={current == 1 ? tagInfo : tagInfo2} list={current == 1 ? tagList : tagList2}*/}
        {/*        choose={(item) => chooseTag(item)}></GTag>*/}
        {/*</View> : <></>}*/}
      </View>

      <ScrollView ref={scrollRef} lowerThreshold={150} scrollIntoView={scrollIntoId} className="pcb-box hide-srcoll"
                  scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
        {
          // [1,2].map((item, index) => {
          list.map((item, index) => {
            return (
              <>
                <View id={index == 0 ? 'top' : `top${index}`} className='common-card new'
                      style={`margin-bottom:0;position:relative;z-index: 1; ${index == 0 ? '' : 'margin-top: 20rpx;'}`}
                      >
                  <View onClick={(e) => toDetail(e, item.id)}>
                  <View className={`common-position-tip ${
                    item?.status == 1 ? 'orange' :
                      item?.status == 2 ? 'blue' :
                        item?.status == 3 ? 'green' : ''
                  }`}>{statusList.filter((f) => f.id != 0).find((f) => f.id == item?.status)?.name}</View>
                  <View className='common-item new'>
                    <View className='common-title has-position flex flex-start'>
                      <View className='common-type m-r-10'>普通</View>
                      <View className='overflow-omit'>{item?.code}</View>
                    </View>
                  </View>
                  <View className='flex flex-between'>
                    <View className={'common-item new outsource'}>
                      <View className='common-item-label'>客户订单号</View>
                      <View className='common-item-value'>{item?.orderCode}</View>
                    </View>
                    <View className={'primary-right'}></View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>客户名称</View>
                    <View className='common-item-value'>{item?.customerName}</View>
                  </View>
                  <View className={`common-item new outsource`}>
                    <View className='common-item-label'>创建时间</View>
                    <View className='common-item-value'>{item?.createTime}</View>
                  </View>
                  </View>
                  {
                    <>
                      <View className={`common-item flex flex-between align-center`} style={'min-height: 50rpx;'}>
                        <View className={'flex flex-start'} onClick={() => changeShow(item)}>
                          <View className={`${!item.show ? 'primary-bottom' : 'primary-top'}`}></View>
                          <View className={'f-s-28'}>{!item.show ? '展开' : '收起'}</View>
                        </View>
                        {item?.detailList?.some(detail => detail.waitProcessQuantity > 0) ? <AtButton type={'primary'} className={'new common-item-btn mini mini-height'} onClick={()=>finishAll(item.id)}>加工完成</AtButton> : <View></View>}
                      </View>
                    </>
                  }
                </View>
                {
                  item.show ? item.detailList?.map((item1, index) => {
                    return (
                      <View style={'padding:0 10rpx; margin-top: 0rpx;'}>
                        <View id={index == 0 ? 'top' : `top${index}`} className='common-card new'>
                          <View className='common-item new'>
                            <View className='common-title has-position flex flex-start'>
                              <View className={`primary-sigle-text sigle-blue`}
                                    style={'margin-right: 8rpx;'}>{index + 1}</View>
                              <View className='overflow-omit'>{item1?.commodityCode}</View>
                            </View>
                          </View>
                          <View className='flex flex-between'>
                            <View className={'common-item new outsource'}>
                              <View className='common-item-label'>长*宽</View>
                              <View className='common-item-value'>{item1?.length} * {item1?.width}</View>
                            </View>
                            <View className='bottom-detail-card-head'>
                              <View className='primary-color'>{item1?.quantity || 0}&nbsp;&nbsp;{item1?.unit == '1' ? '大料' : item1?.unit == '2' ? 'PNL' : item1?.unit == '3' ? 'SET' : ''}</View>
                            </View>
                          </View>
                          <View className='common-item new outsource'>
                            <View className='common-item-label'>加工工序</View>
                            <View className='common-item-value'>{item1?.craftName}</View>
                          </View>
                          <View className='common-item new outsource'>
                            <View className='common-item-label'>加工要求</View>

                            <View className='common-item-value'>{item1?.requirementQuery}</View>
                          </View>
                          <View className='common-item new outsource'>
                            <View className='common-item-label'>加工部门</View>
                            <View className='common-item-value'>{item1?.processDeptName}</View>
                          </View>
                          <View className='common-item new outsource'>
                            <View className='common-item-label'>备注</View>
                            <View className='common-item-value'>{item1?.remark}</View>
                          </View>
                          <View className='gray-bg m-b-12'>
                            <View className='f-s-28 font-weight-4 flex flex-start m-b-8'>
                              <View style={'flex:1'}>待加工：{item1?.waitProcessQuantity}</View>
                              <View style={'flex:1'}>已加工：{item1?.processQuantity}</View>
                            </View>
                            <View className='f-s-28 font-weight-4 flex flex-start m-b-8'>
                              <View style={'flex:1'}>待发货：{item1?.waitDeliverQuantity}</View>
                              <View style={'flex:1'}>已发货：{item1?.deliverQuantity}</View>
                            </View>
                          </View>
                          <View className={'common-item flex flex-end'}>
                            <AtButton type={'primary'} className={'new no-margin m-l-16 common-item-btn mini mini-height'} onClick={() => openDrawer(item,item1,1)}>报废录入</AtButton>
                            {item1.waitProcessQuantity > 0 ? <AtButton type={'primary'} className={'new no-margin m-l-16 common-item-btn mini mini-height'} onClick={() => openDrawer(item,item1,2)}>加工录入</AtButton> :<></>}
                          </View>
                        </View>
                      </View>
                    )
                  }) : <></>
                }
              </>
            )
          })
        }
        <AtLoadMore status={status} noMoreText={'暂无数据'}></AtLoadMore>
      </ScrollView>

      <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle}
                     confirm={confirmHandle}></GDrawerFilter>

      <Drawer newF={true} ref={drawerFormRef} confirm={confirmDrawer}></Drawer>

      <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>

      <GFeedback></GFeedback>
    </View>
  )
}
