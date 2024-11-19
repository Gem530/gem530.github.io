import './index.less'
import { useState, useRef } from 'react'
import GUp from '../../../../components/g-up'
import { View } from '@tarojs/components'
import GConfirm from '../../../../components/g-confirm'
import GFeedback from '../../../../components/g-feedback'
import GDrawerFilter from '../../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import {
  AtButton,
  AtModal,
  AtModalHeader, AtModalContent, AtModalAction
} from 'taro-ui'
import { listCategoryAPI, checkPlanDetailListAPI} from '../../../../pages/services/checkPlan/index'
import GStep from "../../../../components/g-step";
import GTable from "../../../../components/g-table";
import {receiveDetailAPI, receiveSignAPI} from "../../../../pages/services/outSource/receive";
import GSignPop from "../../../../components/g-sign-pop";
import {getLocal} from "../../../../pages/util/func";



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
    isDiffCheck: false,
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

  const initDialog = {
    email: '',
    open: false,
    title: '查看更多',
  }
  const GConfirmRef = useRef()
  const GDrawerFilterRef = useRef()

  const [id, setId] = useState()
  const [bizId, setBizId] = useState()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [dialogInfo, setDialogInfo] = useState(initDialog)
  const [options, setOptions] = useState()
  const [current, setCurrent] = useState(0)
  const [orderInfo, setOrderInfo] = useState()
  const [query, setQuery] = useState(initQuery)
  const [didShow, setDidShow] = useState(false)
  const [diffCheck, setDiffCheck] = useState(false)
  const [hasInvalid, setHasInvalid] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [waitShowAll, setWaitShowAll] = useState(true) // 待盘点 是否查看所有的数据
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('30')
  const [address, setAddress] = useState('')


  useShareAppMessage(() => {
    return {
      title: '发货单详情',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    // Taro.hideHomeButton({}).then();
    console.log(option)
    setId(option.id)
    setOptions(option)
    if (option?.q) {
      let url = decodeURIComponent(option.q)
      let obj = getUrlParam(url)
      setId(obj.id)
    }
    listCategory()
    getLocal().then((res) => {
      console.log('getLocal----', res)
      setAddress(res?.wxMarkerData?.length ? res?.wxMarkerData[0]?.address : '')
      console.timeEnd('localAddress')
    })
  })
  useDidShow(async () => {
    if (didShow) {
      setDidShow(false)
      return
    }
    const isRefresh = Taro.getStorageSync('isRefresh')
    if(isRefresh){
      setOpen(false);
    }
    if (id) {
      getDetail(id)
    }
  })

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

    if (tempType == 'dialog') {
      let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
      arr.map((item, index) => {
        tempInfo[item.field] = item.value
      })
      setDialogInfo(tempInfo)
    }
  }

  const updateDialog = () => {

  }

  // 选择签名
  const onChoose = (item) => {
    // console.log(item)
    confirmOrderFinish(item)
  }

  // 确定签名
  const confirmOrderFinish = (item) => {
    let params = {
      bizId:bizId,
      flagSave: '0', // 0 不保存 1 保存
      imageKey: item.key,
      signType: item.signType,
      fileAddress: address || '',
    }
    Taro.showLoading({mask: true})
    confirmAPI(params).then((res) => {
      if (res.code == 200) {
        // console.log(res)
        setOpen(false)
        // if (['1','2','3','5','6','7','9','10'].includes(type+'')) {
        //   Taro.navigateBack({ delta: 2 })
        // } else {
        Taro.setStorageSync('isRefresh', '1')
        Taro.setStorageSync('confirmStatus', '3')
        Taro.removeStorageSync('preview')
        Taro.hideLoading()

        Taro.showToast({ title: '签名成功', icon: 'success', duration: 1500 })
        // GConfirmRef.current.openConfirm({content: '签名成功!是否预览合同内容？'}).then(() =>{
        getDetail(id);
        Taro.navigateTo({ url: `/pages/reviewPdf/index?id=${orderInfo?.bizId}&type=30&title=发货单`});
        // }).catch(() => {
        //   if (options?.companyId || (options?.isRedirect == '1')) {
        //     Taro.redirectTo({ url: '/pages/home/home' })
        //   } else {
        //     Taro.navigateBack({ delta: 1 })
        //   }
        // })
        // }
      } else {
        setTimeout(() => {
          Taro.hideLoading()
        }, 1000)
      }
    }).catch(() => {
      setTimeout(() => {
        Taro.hideLoading()
      }, 1000)
    })
  }

  const confirmAPI = (item) => {
    console.log(item)
      return receiveSignAPI(item)
  }

  // 跳转去签名页
  const toSign = () => {
    // Taro.removeStorageSync('preview') // 换到签章页，点击签名时再清除，这样再返回来就可以显示签名弹框
    Taro.setStorageSync('preview', '1')
  }

  // 返回 queryType
  const getQueryType = (tempCurrent, tempStatus) => {
    let res = '8'
    // 盘点中
    if (tempStatus == 2) {
      // 已录入
      if (tempCurrent == 0) res = '6'
      // 未录入
      else res = '0'
    }
    // 复盘中
    if (tempStatus == 3) {
      // 已录入
      if (tempCurrent == 0) res = '7'
      // 未录入
      else res = '2'
    }
    // 审核中/已完成
    if (['4','5'].includes(tempStatus+'')) {
      // 全部
      if (tempCurrent == 0) res = '8'
      // 盘盈
      else if (tempCurrent == 1) res = '3'
      // 盘亏
      else if (tempCurrent == 2) res = '4'
      // 盘平
      else res = '5'
    }
    console.log('queryTypeList---', res)
    return [res]
  }
  // tab点击
  const handleClick = (e) => {
    setCurrent(e)
    let queryTypeList = getQueryType(e, resStatus())
    checkPlanDetailList([{ value: queryTypeList, field: 'queryTypeList' }])
    // getAuditList([{ value: 1, field: 'pageNum' },{ value: statusList[e]?.id || 0, field: 'inventoryStatus' }])
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
          console.log(tempList)
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
      receiveDetailAPI(id).then(async (res) => {
        // console.log(res)
        if (res.code == 200) {
          setOrderInfo(res?.data)
          setBizId(res?.data.bizId)
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => {
        console.log('err1', err)
        reject(false)
      })
    })
  }
  // 获取明细列表
  const checkPlanDetailList = (arr, flag = true) => {
    return new Promise(async (resolve, reject) => {
      let params = JSON.parse(JSON.stringify(query))
      console.log('arr--', arr)
      if (arr?.length) {
          // params
          arr.map((item, index) => {
              params[item.field] = item.value
          })
          updateData(arr)
      }
      console.log('params--', params)

      // 格式化为字符串
      if (params?.queryTypeList) {
        params.queryTypeList = params?.queryTypeList.map((m) => m+'')
      }
      // 盘点中
      if (params?.status == 2 && params?.queryTypeList.includes('6')) {
        if (params?.isDiffCheck) {
          params.queryTypeList.push('9')
        } else {
          params.queryTypeList = params.queryTypeList.filter((f) => f != '9')
        }
      }
      // 复盘中
      if (params?.status == 3 && params?.queryTypeList.includes('7')) {
        if (params?.isDiffCheck) {
          params.queryTypeList.push('1')
        } else {
          params.queryTypeList = params.queryTypeList.filter((f) => f != '1')
        }
      }
      if (params?.categoryId == 0) {
        delete params?.categoryId
      }

      flag && Taro.showLoading({title: '加载中...',mask: true})
      checkPlanDetailListAPI(params).then((res) => {
        // console.log(res)
        if (res.code == 200) {
          setList(res.rows || [])
          setTotal(res?.total || 0)
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => {
        console.log('err2', err)
        reject(false)
      })
    })
  }

  // 判断是否有搜索条件
  const isSearch = () => {
    let res = false
    if (orderInfo?.type == 1) {
      // 成品盘点
      res = query?.customerCode || query?.commodityName || query?.commidityCode
    } else {
      // 物料盘点
      res = query?.level || query?.width || query?.length || Number(query?.categoryId||'') || query?.manufacturer || query?.materialName || query?.copperThickness || query?.materialQuality || query?.boardThickness
    }
    return res
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
      // 成品盘点
      tempList = [
        { value: 1, field: 'pageNum' },
      ]
    // console.log('重置', tempList)
    checkPlanDetailList(tempList)
  }

  const openSign = () => {
    setOpen(true);
  }

  const openFile = () => {
    Taro.navigateTo({url: `file/index?id=${bizId}`})
  }

  const openDialog = () => {
    let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
    tempInfo.open = true;
    setDialogInfo(tempInfo);
  }

  return (
    <View className='inventory-page'>
      {/* <NavBar color={'#333'} title={'盘点计划详情'} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar> */}
      {/* 状态 */}
      <View className='inventory-top '>
        <GStep list={['发货单创建', '供应商发货', '客户签收']} current={orderInfo?.isSign + 1}></GStep>
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
          <View className='common-item-label'>发货单号</View>
          <View className='common-item-value'>{orderInfo?.code}</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>加工单号</View>
          <View className='common-item-value overflow-omit'>{orderInfo?.outSourceCode}</View>
          <View className='primary-color f-s-28' onClick={openDialog}>更多</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>客户订单号</View>
          <View className='common-item-value overflow-omit'>{orderInfo?.orderCode}</View>
          <View className='primary-color f-s-28' onClick={openDialog}>更多</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>外协供应商</View>
          <View className='common-item-value'>{orderInfo?.ownerName}</View>
        </View>
        <View className='common-item new outsource'>
          <View className='common-item-label'>创建人</View>
          <View className='common-item-value'>{orderInfo?.createByName}</View>
        </View>
        <View className={`common-item new outsource`}>
          <View className='common-item-label'>创建时间</View>
          <View className='common-item-value'>{orderInfo?.deliveryTime}</View>
        </View>
      </View>

      {/* 盘点明细 */}
      <View className='common-card new inventory-detail'>
        <View className='common-item new'>

          <View className='inventory-wait-head flex flex-between f-s-28'>
            <View className='common-title mini flex flex-start'>
              <View className='primary-inventory-detail'></View>
              <View style={'margin-left: 8rpx;flex: 1;'}>发货明细</View>
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
          waitShowAll ? orderInfo?.deliveryList.map((item, index) => {
            return (
              <View style={'padding:0 10rpx'}>
                <View id={index == 0 ? 'top' : `top${index}`}>
                  <View className='common-item new'>
                    <View className='common-title has-position flex flex-start'>
                      <View className='overflow-omit'>{item?.commodityCode}</View>
                    </View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>加工单号</View>
                    <View className='common-item-value'>{item?.outSourceCode}</View>
                  </View>
                  <View className='common-item new outsource'>
                    <View className='common-item-label'>客户订单号</View>
                    <View className='common-item-value'>{item?.orderCode}</View>
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
                    <View className='common-item-label'>面积</View>
                    <View className='common-item-value'>{item?.deliverArea}㎡</View>
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
                    <View className='common-item-label'>加工备注</View>
                    <View className='common-item-value'>{item?.remark}</View>
                  </View>
                </View>
              </View>
            )
          }) : <></>
        }

        <View className='common-round-btn flex flex-center'>
          <View className={'common-round-item flex flex-center'} onClick={openFile}>查看凭证</View>
          <View className={'common-round-item flex flex-center'} onClick={() => Taro.navigateTo({ url: `/pages/reviewPdf/index?id=${orderInfo?.bizId}&type=30&title=发货单` })}>发货单预览</View>
          {orderInfo?.isSign == 0 ? <View className={'common-round-item primary-color flex flex-center'} onClick={openSign}>签收</View> : <></>}
        </View>
      </View>
      {waitShowAll ? (total > 100 ? <View className='max-data-length-100'>当前最多展示100条</View> : <View className='max-data-length-100'>暂无更多数据</View>) : <></>}

      <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
        <AtModalHeader>{dialogInfo.title}</AtModalHeader>
        <AtModalContent>
          <View style={'max-height: 390px;overflow-y: auto;margin-top: 10px;'}>
            <GTable list={orderInfo?.deliveryList.reduce((accumulator, current) => {
              const x = accumulator.find(item => item.outSourceCode == current.outSourceCode && item.orderCode == current.orderCode);
              if (!x) {
                return accumulator.concat([current]); // 如果不存在则添加到结果中
              } else {
                return accumulator; // 如果已存在，则不添加
              }
            }, [])} titleList={
              [
                {title: '序号', field: 'id'},
                {title: '加工单号', field: 'outSourceCode'},
                {title: '客户订单号', field: 'orderCode'},
              ]}
                    tdSlot={(title, item, slotIndex,index) => {
                      let value = title.field.includes('.') ? (
                        item[title.field.split('.')[0]][title.field.split('.')[1]]
                      ) : item[title.field]
                      //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                      console.log(index)
                      return (
                        <View>
                          {title.field == 'id' ? index + 1 : value}
                        </View>
                      )
                    }}
            ></GTable>
          </View>
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={() => updateData([{ value: false, field: 'open' }],'dialog')}>关闭</AtButton>
        </AtModalAction>
      </AtModal>

      <GFeedback right={true}></GFeedback>
      <GUp style={{bottom: '192rpx'}}></GUp>
      <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>
      <GSignPop open={open} type={type} id={bizId} onClose={() => setOpen(false)} onChoose={onChoose} toSign={toSign}></GSignPop>
      <GDrawerFilter newF={true} classStr={'drawer-has-nav-bar'} formList={orderInfo?.type == 1 ? formList : formListAgain} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
    </View>
  )
}
