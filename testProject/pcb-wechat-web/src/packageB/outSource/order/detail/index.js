import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import GUp from '../../../../components/g-up'
import { View, Image } from '@tarojs/components'
import GConfirm from '../../../../components/g-confirm'
import GFeedback from '../../../../components/g-feedback'
import GDrawerFilter from '../../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtInput, AtButton, AtTextarea } from 'taro-ui'
import { listCategoryAPI} from '../../../../pages/services/checkPlan/index'
import GStep from "../../../../components/g-step";
import {
  orderCompleteAPI,
  orderDetailAPI,
  orderEnteringAPI,
  orderScrapAPI
} from "../../../../pages/services/outSource/order";
import Drawer from "../drawer";


export default function InventoryCheckDetail() {
  const initQuery = {
    level: '',
    width: '',
    length: '',
    pageNum: 1,
    pageSize: 50,
    categoryId: '',
    manufacturer: '',
    materialName: '',
    customerCode: '',
    commodityName: '',
    commidityCode: '',
    copperThickness: '',
    materialQuality: '',
    boardThickness: '',
  }
  const formList = [
      {
        value: '',
        type: 'input',
        title: '产品名称',
        field: 'commodityName',
        attrs: {
          maxLength: '50',
          placeholder: '请输入产品名称',
          // clear: true
        }
      },
      {
        value: '',
        type: 'input',
        title: '客户编码',
        field: 'customerCode',
        attrs: {
          maxLength: '50',
          placeholder: '请输入客户编码',
          // clear: true
        }
      },
      {
        value: '',
        type: 'input',
        title: '产品编码',
        field: 'commidityCode',
        attrs: {
          maxLength: '50',
          placeholder: '请输入产品编码',
          // clear: true
        }
      },
  ]
  const formListAgain = [
      {
        value: '',
        type: 'input',
        title: '物料名称',
        field: 'materialName',
        attrs: {
          maxLength: '50',
          placeholder: '请输入物料名称',
          // clear: true
        }
      },
      {
        value: [],
        type: 'tag',
        title: '物料类别',
        field: 'categoryId',
        data: [],
        attrs: {
          maxLength: '50',
        }
      },
      {
        value: '',
        type: 'input',
        title: '板厚(mm)',
        field: 'boardThickness',
        attrs: {
          maxLength: '50',
          placeholder: '请输入板厚(mm)',
          // clear: true
        }
      },
      {
        value: '',
        type: 'input',
        title: '铜厚(oz)',
        field: 'copperThickness',
        attrs: {
          maxLength: '50',
          placeholder: '请输入铜厚(oz)',
          // clear: true
        }
      },
      {
        value: ['',''],
        type: 'inputTwo',
        title: '长 x 宽(mm)',
        field: 'chang',
        startAttrs: {
          type: 'number',
          maxLength: '13',
          placeholder: '长',
        },
        endAttrs: {
          type: 'number',
          maxLength: '13',
          placeholder: '宽',
        }
      },
      {
        value: '',
        type: 'input',
        title: '级别',
        field: 'level',
        attrs: {
          maxLength: '50',
          placeholder: '请输入级别',
          // clear: true
        }
      },
      {
        value: '',
        type: 'input',
        title: '材质牌号',
        field: 'materialQuality',
        attrs: {
          maxLength: '50',
          placeholder: '请输入材质牌号',
          // clear: true
        }
      },
      {
        value: '',
        type: 'input',
        title: '品牌',
        field: 'manufacturer',
        attrs: {
          maxLength: '50',
          placeholder: '请输入品牌',
          // clear: true
        }
      },
  ]
  const GConfirmRef = useRef()
  const GDrawerFilterRef = useRef()
  const drawerFormRef = useRef()

  const [id, setId] = useState()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [options, setOptions] = useState()
  const [current, setCurrent] = useState(0)
  const [orderInfo, setOrderInfo] = useState()
  const [query, setQuery] = useState(initQuery)
  const [didShow, setDidShow] = useState(false)
  const [diffCheck, setDiffCheck] = useState(false)
  const [hasInvalid, setHasInvalid] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [waitShowAll, setWaitShowAll] = useState(true) // 待盘点 是否查看所有的数据

  useShareAppMessage(() => {
    return {
      title: '加工单详情',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    // Taro.hideHomeButton({}).then();
    setId(option.id)
    setOptions(option)
    if (option?.q) {
      let url = decodeURIComponent(option.q)
      let obj = getUrlParam(url)
      setId(obj.id)
    }
    listCategory()
  })
  useDidShow(async () => {
    if (didShow) {
      setDidShow(false)
      return
    }
    if (id) {
      getDetail(id)
    }
  })

  // 展示名称
  const toolTipHandle = (e, name) => {
    // console.log(e)
    e.stopPropagation()
    Taro.showModal({ content: name, showCancel: false, confirmText: '知道了' })
  }

  // 最终状态
  const resStatus = () => {
    return (orderInfo?.status == 6 ? orderInfo?.cancelStatus : orderInfo?.status)
  }

  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // 更新数据
  const updateData = (arr, tempType = 'query') => {
    if(tempType == 'query') {
      let tempDialog = JSON.parse(JSON.stringify(query))
      arr.map((item, index) => {
          // console.log(item)
          tempDialog[item.field] = item.value
      })
      // console.log(tempDialog)
      setQuery(tempDialog)
    }
  }

  // 页面跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }

  // 获取数量
  const listCategory = () => {
    return new Promise((resolve, reject) => {
      listCategoryAPI().then((res) => {
        if (res.code == 200) {
          let tempList = [{id: '0', name: '全部'}, ...(res.data || [])]
          setCategoryList(tempList)
          resolve(tempList)
        } else reject(false)
      }).catch((err) => reject(err))
    })
  }
  // 获取详情
  const getDetail = (id, flag = true) => {
    return new Promise((resolve, reject) => {
      if (!id) return;
      flag && Taro.showLoading({ mask: true })
      orderDetailAPI(id).then(async (res) => {
        // console.log(res)
        if (res.code == 200) {
          setOrderInfo(res?.data)
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => {
        console.log('err1', err)
        reject(false)
      })
    })
  }

  // 筛选弹框确认
  const confirmHandle = (val) => {
    let tempList = []
    if (orderInfo?.type == 1) {
      // 成品盘点
      tempList = [
        { value: 1, field: 'pageNum' },
        { value: val?.customerCode, field: 'customerCode' },
        { value: val?.commodityName, field: 'commodityName' },
        { value: val?.commidityCode, field: 'commidityCode' },
      ]
    } else {
      // 物料盘点
      tempList = [
        { value: 1, field: 'pageNum' },
        { value: val?.level, field: 'level' },
        { value: val?.chang[1], field: 'width' },
        { value: val?.chang[0], field: 'length' },
        { value: val?.categoryId?.id, field: 'categoryId' },
        { value: val?.manufacturer, field: 'manufacturer' },
        { value: val?.materialName, field: 'materialName' },
        { value: val?.copperThickness, field: 'copperThickness' },
        { value: val?.materialQuality, field: 'materialQuality' },
        { value: val?.boardThickness, field: 'boardThickness' },
      ]
    }
    console.log('确认', tempList)
    checkPlanDetailList(tempList)
  }
  // 筛选弹框重置
  const resetHandle = () => {
    // searchRef.current.clear({value: ''})
    // 还需要分物料和盘点 类型
    setQuery(initQuery)
    let tempList = []
    if (orderInfo?.type == 1) {
      // 成品盘点
      tempList = [
        { value: 1, field: 'pageNum' },
        { value: '', field: 'customerCode' },
        { value: '', field: 'commodityName' },
        { value: '', field: 'commidityCode' },
      ]
    } else {
      // 物料盘点
      tempList = [
        { value: '', field: 'level' },
        { value: '', field: 'width' },
        { value: 1, field: 'pageNum' },
        { value: '', field: 'length' },
        { value: 0, field: 'categoryId' },
        { value: '', field: 'manufacturer' },
        { value: '', field: 'materialName' },
        { value: '', field: 'copperThickness' },
        { value: '', field: 'materialQuality' },
        { value: '', field: 'boardThickness' },
      ]
    }
    // console.log('重置', tempList)
    checkPlanDetailList(tempList)
  }
  // 打开抽屉
  const openFilter = () => {
    let tempFormList = JSON.parse(JSON.stringify(orderInfo?.type == 1 ? formList : formListAgain))
    let params = ''
    if (orderInfo?.type == 1) {
      // 成品盘点
      params = {
        customerCode: query?.customerCode,
        commodityName: query?.commodityName,
        commidityCode: query?.commidityCode,
      }
    } else {
      // 物料盘点
      params = {
        level: query?.level,
        manufacturer: query?.manufacturer,
        materialName: query?.materialName,
        chang: [query?.length, query?.width],
        copperThickness: query?.copperThickness,
        materialQuality: query?.materialQuality,
        boardThickness: query?.boardThickness,
        categoryId: categoryList.length ? (categoryList.find((f) => f.id == (query?.categoryId)) || categoryList[0]) : {id:'0',name:'全部'},
      }
      tempFormList[1].data = categoryList
    }
    console.log('params---', query, params)
    GDrawerFilterRef.current.openFilter(params, '筛选', orderInfo?.type == 2 ? tempFormList : undefined)
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
          getDetail(orderInfo?.id)
        }
      }).finally(() => {
      })
    })
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

  const openScrap = () => {

  }

  const openDrawer = (item,item1,type) => {
    item1.customerName = item.customerName
    item1.status = item.status;
    drawerFormRef.current.openFilter(item1, type == 1 ? '报废录入' : '加工录入',type)
  }

  // 抽屉弹框确认
  const confirmDrawer = (val,type) => {
    if(type == 1){
      const request = JSON.parse(JSON.stringify(val));
      delete request?.id;
      request.outSourceOrderDetailId = val.id;
      orderScrapAPI(request).then(res=>{
        if (res.code == 200){
          drawerFormRef.current.closeDrawer();
          getDetail(orderInfo.id);
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
          getDetail(orderInfo.id);
        }
      })
    }


  }

  return (
    <View className='inventory-page'>
      {/* <NavBar color={'#333'} title={'盘点计划详情'} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar> */}
      {/* 状态 */}
      <View className='inventory-top '>
        <GStep list={['接单','加工中','供应商发货','客户签收']} current={['1','2'].includes(orderInfo?.status) ? '1' : ['3','4'].includes(orderInfo?.status) ? '2' : ['5'].includes(orderInfo?.status) ? '3' : '0'}></GStep>
      </View>

      {/* 基础信息 */}
      <View className='common-card new'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-base'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>基础信息</View>
          </View>
        </View>

        <View className='common-item new outsource'>
          <View className='common-item-label'>加工单号</View>
          <View className='common-item-value flex flex-start'>
            <View className='pcb-card-name'>{orderInfo?.code}</View>
            <View className='primary-copy' onClick={(e) => copyText(orderInfo?.code)}></View>
          </View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>客户订单号</View>
          <View className='common-item-value'>{orderInfo?.orderCode}</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>客户名称</View>
          <View className='common-item-value'>{orderInfo?.customerName}</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>创建人</View>
          <View className='common-item-value'>{orderInfo?.createByName}</View>
        </View>
        <View className={`common-item new outsource`}>
          <View className='common-item-label'>创建时间</View>
          <View className='common-item-value'>{orderInfo?.createTime}</View>
        </View>
      </View>

      {/* 盘点明细 */}
      <View className='common-card new inventory-detail'>
        <View className='common-item new'>

          <View className='inventory-wait-head flex flex-between f-s-28'>
            <View className='common-title mini flex flex-start'>
              <View className='primary-inventory-detail'></View>
              <View style={'margin-left: 8rpx;flex: 1;'}>加工明细</View>
            </View>
            <View style={'flex: 1;'} className='flex flex-end primary-color-new' onClick={() => setWaitShowAll(!waitShowAll)}>
              {
                waitShowAll ? <>
                  <View className={`primary-top`}></View>
                  点击收起
                </> : <>
                  <View className={`primary-bottom`}></View>
                  点击展开
                </>
              }
            </View>
          </View>
        </View>
        {
          waitShowAll ? orderInfo?.detailList?.map((item, index) => {
            return (
              <View style={'padding:0 10rpx'}>
                <View id={index == 0 ? 'top' : `top${index}`}>
                  <View className='common-item new'>
                    <View className='common-title has-position flex flex-start'>
                      <View className='overflow-omit'>{item?.commodityCode}</View>
                    </View>
                  </View>
                  <View className='flex flex-between'>
                    <View className={'common-item new outsource'}>
                      <View className='common-item-label'>长*宽</View>
                      <View className='common-item-value'>{item?.length} * {item?.width}</View>
                    </View>
                    <View className='bottom-detail-card-head'>
                      <View className='primary-color'>{item?.quantity || 0}&nbsp;&nbsp;{item?.unit == '1' ? '大料' : item?.unit == '2' ? 'PNL' : item?.unit == '3' ? 'SET' : ''}</View>
                    </View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工工序</View>
                    <View className='common-item-value'>{item?.craftName}</View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工要求</View>

                    <View className='common-item-value'>{item?.requirementQuery}</View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工部门</View>
                    <View className='common-item-value'>{item?.processDeptName}</View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工备注</View>
                    <View className='common-item-value'>{item?.remark}</View>
                  </View>
                  <View className='gray-bg m-b-12'>
                    <View className='f-s-28 font-weight-4 flex flex-start m-b-8'>
                      <View style={'flex:1'}>待加工：{item?.waitProcessQuantity}</View>
                      <View style={'flex:1'}>已加工：{item?.processQuantity}</View>
                    </View>
                    <View className='f-s-28 font-weight-4 flex flex-start m-b-8'>
                      <View style={'flex:1'}>待发货：{item?.waitDeliverQuantity}</View>
                      <View style={'flex:1'}>已发货：{item?.deliverQuantity}</View>
                    </View>
                  </View>
                  <View className={'common-item flex flex-end'}>
                    <AtButton type={'primary'} className={'new no-margin m-l-16 common-item-btn mini mini-height'} onClick={() => openDrawer(orderInfo,item,1)}>报废录入</AtButton>
                    {item.waitProcessQuantity > 0 ? <AtButton type={'primary'} className={'new no-margin m-l-16 common-item-btn mini mini-height'} onClick={() => openDrawer(orderInfo,item,2)}>加工录入</AtButton> : <></>}
                  </View>
                </View>
              </View>
            )
          }) : <></>
        }

      {orderInfo?.detailList?.some(detail => detail.waitProcessQuantity > 0) ? <AtButton className={'common-round-btn'} onClick={()=>finishAll(orderInfo.id)}>全部加工完成</AtButton> : <></>}
      </View>
      {waitShowAll ? (total > 100 ? <View className='max-data-length-100'>当前最多展示100条</View> : <View className='max-data-length-100'>暂无更多数据</View>) : <></>}


      <GFeedback right={true}></GFeedback>
      <GUp style={{bottom: '192rpx'}}></GUp>
      <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>
      <Drawer newF={true} ref={drawerFormRef} confirm={confirmDrawer}></Drawer>
      <GDrawerFilter newF={true} classStr={'drawer-has-nav-bar'} formList={orderInfo?.type == 1 ? formList : formListAgain} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
    </View>
  )
}
