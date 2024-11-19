import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import GUp from '../../../components/g-up'
// import NavBar from '../../../components/nav-bar'
import { View, Image } from '@tarojs/components'
import GConfirm from '../../../components/g-confirm'
import GFeedback from '../../../components/g-feedback'
import { hasPermission } from '../../../pages/util/func'
import GDrawerFilter from '../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtInput, AtButton, AtTextarea } from 'taro-ui'
import { auditPostAPI, checkPlanAPI, submitAuditAPI, listCategoryAPI, checkPlanStartAPI, checkPlanCancelAPI, checkPlanDetailAPI, temporarySaveAPI, checkPlanDetailListAPI, checkPlanDetailCountAPI } from '../../../pages/services/checkPlan/index'


export default function InventoryCheckDetail() {
  const statusList = [
      // {id: 0, name: '全部'},
      {id: 1, name: '待盘点'},
      {id: 2, name: '盘点中'},
      {id: 3, name: '复盘中'},
      {id: 4, name: '审核中'},
      {id: 5, name: '已完成'},
      {id: 6, name: '已作废'},
  ]
  // 初始化数量
  const initCounts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
  }
  // 盘点中 是否录入
  const isEnterList = [
    { title: '已录入', id: 6 },
    { title: '未录入', id: 0 },
  ]
  // 复盘中 是否复盘
  const isEnterAgainList = [
    { title: '已复盘', id: 7 },
    { title: '未复盘', id: 2 },
  ]
  const queryTypeArr = [
    { id: 0, name: '盘点数量未填写' },
    { id: 1, name: '复盘有差异' },
    { id: 2, name: '复盘未填写' },
    { id: 3, name: '盘盈' },
    { id: 4, name: '盘亏' },
    { id: 5, name: '盘平' },
    { id: 6, name: '盘点数量已录入' },
    { id: 7, name: '复盘数量已录入' },
    { id: 8, name: '全部' },
    { id: 9, name: '盘点有差异' },
  ]
  const priceStatusList = [
    { title: '全部', id: 8 },
    { title: '盘盈', id: 3 },
    { title: '盘亏', id: 4 },
    { title: '盘平', id: 5 },
  ]
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
  const GConfirmRef = useRef()
  const GDrawerFilterRef = useRef()

  const [id, setId] = useState()
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [remark, setRemark] = useState('')
  const [options, setOptions] = useState()
  const [current, setCurrent] = useState(0)
  const [orderInfo, setOrderInfo] = useState()
  const [query, setQuery] = useState(initQuery)
  const [didShow, setDidShow] = useState(false)
  const [counts, setCounts] = useState(initCounts)
  const [diffCheck, setDiffCheck] = useState(false)
  const [hasInvalid, setHasInvalid] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [waitShowAll, setWaitShowAll] = useState(false) // 待盘点 是否查看所有的数据
  
  useShareAppMessage(() => {
    return {
      title: '盘点计划详情',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    // Taro.hideHomeButton({}).then();
    console.log('option:', option)
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
      checkPlanAPI(id).then(async (res) => {
        // console.log(res)
        if (res.code == 200) {
          setOrderInfo(res?.data)
          flag && Taro.hideLoading()

          // 初始化 查询明细列表 参数
          let crtCurrent = current
          if (res?.data?.status == 2) {
            // 盘点中
            crtCurrent = 1
            setCurrent(crtCurrent)
          }
          let queryTypeList = getQueryType(crtCurrent, res.data?.status == 6 ? res.data?.cancelStatus : res.data?.status)
          let tempArr = [
            { value: '0', field: 'categoryId' },
            { value: res.data.type, field: 'planType' },
            { value: id, field: 'inventoryCheckPlanId' },
            { value: queryTypeList, field: 'queryTypeList' },
            { value: res.data?.status == 6 ? res.data?.cancelStatus : res.data?.status, field: 'status' },
          ]
          console.log('tempArr--', queryTypeList, tempArr)
          checkPlanDetailList(tempArr)

          resolve(true)
        } else reject(false)
      }).catch((err) => {
        console.log('err1', err)
        reject(false)
      })
    })
  }

  // 获取数量
  const checkPlanDetailCount = (tempParams) => {
    return new Promise((resolve, reject) => {
      let params = JSON.parse(JSON.stringify(tempParams))
      delete params?.queryTypeList
      checkPlanDetailCountAPI(params).then((res) => {
        if (res.code == 200) {
          setCounts(res.data)
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(err))
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

      try {
          await checkPlanDetailCount(params)
      } catch (err) {
          console.log('err00', err)
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
  // 是否查看差异
  const diffCheckHandle = () => {
    let flag = !diffCheck
    setDiffCheck(flag)
    let arr = [
      { value: flag, field: 'isDiffCheck' }
    ]
    checkPlanDetailList(arr)
  }

  // 判断是否失效
  const checkRejectHandle = () => {
    GConfirmRef.current.openConfirm({
      title: `${orderInfo?.type == 1 ? '产品' : '物料'}失效提醒`,
      content: <View className='w-100 f-s-32 font-weight-4'>
        <View className='block-color'>部分{orderInfo?.type == 1 ? '产品' : '物料'}已失效</View>
        <View className='gray-color' style={'margin-bottom: 16rpx;'}>(被删除/修改/停用/已经在盘点中),</View>
        <View className='block-color'>请&nbsp;<text className='yellow-color'>移除失效数据</text>&nbsp;后重新提交！</View>
      </View>,
      cancelText: '我知道了',
      confirmText: '查看失效数据',
    }).then(() => {
      // console.log('判断是否失效')
      toPath(`/packageB/inventoryCheck/invalidDetail/index?id=${id}&type=${orderInfo?.type}`)
    })
  }
  // 开始盘点
  const startInventoryCheck = () => {
    console.log('开始盘点')
    GConfirmRef.current.openConfirm({
      content: <View className='f-s-32 font-weight-4'>
        开始盘点后，所选{orderInfo?.type == 1 ? '产品' : '物料'}将
        <View className='primary-inventory-lock display-inline-block' style={'vertical-align: mddle;margin-bottom: -4px;'}></View>
        <text>
          <text className='yellow-color' style={'display: inline;flex: none;'}>锁定出入库</text>
          ，请及时通知各部门做好准备！
          </text>
      </View>,
      cancelText: '我再想想',
      confirmText: '确认开始',
    }).then(() => {
      // console.log('开始盘点111')
      Taro.showLoading({ mask: true })
      checkPlanStartAPI({ id }).then((res) => {
        if (res.code == 200) {
          if (res.data?.length) {
            // data为数组，有数据，说明有失效数据
            setHasInvalid(true)
            checkRejectHandle()
            Taro.hideLoading()
          } else {
            setHasInvalid(false)
            Taro.showToast({ title: '盘点成功' })
            getDetail(id)
            Taro.setStorageSync('isRefresh', '1')
          }
        }
      })
    })
  }

  // 修改数量
  const editNumDialog = async (bizId, isScan = false) => {
    if (!hasPermission(['xcxinventory:checkPlan:make'])) return;
    console.log(bizId)
    Taro.showLoading({ mask: true })
    const res = await checkPlanDetailAPI({ qrCode: bizId, inventoryCheckPlanId: orderInfo?.id }).catch((err) => {
      console.log('err', err)
      setTimeout(() => Taro.hideLoading(), 1000)
    })

    // 没有数据，即不在当前盘点计划
    if (!res.data?.length) {
      Taro.hideLoading()
      GConfirmRef.current.openConfirm({
        title: '提示',
        content: <View className='w-100 f-s-32 font-weight-4 block-color'>该{orderInfo?.type == 1 ? '产品' : '物料'}&nbsp;<text className='primary-color-new'>不在当前盘点计划</text>&nbsp;中，请核对后重新扫码!</View>,
        cancelText: '取消',
        confirmText: '重新扫码',
      }).then(() => {
        takeScan()
      })
      return;
    }
    setTimeout(() => Taro.hideLoading(), 500)

    let data = res.data[0]
    console.log('data', data)
    // 使用useState没办法实时修改，实现函数内变量，可以实时拿到，如果需要存到useState中，在then函数里set
    let text = orderInfo?.status == 2 ? data.checkQuantity : data.replayQuantity
    GConfirmRef.current.openConfirm({
      title: `请填写本次${orderInfo?.status == 2 ? '盘点' : '复盘'}数量`,
      content: <View className='w-100 f-s-32 font-weight-4'>
        <View className='flex flex-start m-b-20'>
          <View>{orderInfo?.type == 1 ? '产品' : '物料'}编码:</View>
          <View className='m-l-16'>{orderInfo?.type == 1 ? data?.commidityCode : data?.materialCode}</View>
        </View>
        <AtInput
          value={text}
          type='digit'
          focus={true}
          maxLength={8}
          className='new el-imitate-input'
          placeholder='大于等于0，保留两位小数'
          onChange={(val) => text = val}
        ></AtInput>
      </View>,
      checkFun: async () => {
        let res = false
        if (!/^\d+(.\d{1,2})?$/.test(text)) {
          Taro.showToast({ title: '大于等于0，保留两位小数', icon: 'none' })
          res = true
          return res
        }
        let params = JSON.parse(JSON.stringify(data))
        if (orderInfo?.status == 2) {
          // 盘点中
          params.checkQuantity = text
        } else {
          // 复盘中
          params.replayQuantity =text
        }
        // console.log(params)
        Taro.showLoading({ mask: true })
        await temporarySaveAPI([params]).catch((err) => {
          console.log('err', err)
          res = true
          setTimeout(() => Taro.hideLoading(), 1000)
        })
        setTimeout(() => Taro.hideLoading(), 500)
        return res
      },
      cancelText: '取消',
      confirmText: isScan ? '确认并继续' : '确认',
    }).then((res) => {
      // console.log('确认并继续', text, res)
      checkPlanDetailList([], false)
      if (isScan) {
        takeScan()
      }
    })
  }
  // 作废
  const rejectHandle = () => {
    // 使用useState没办法实时修改，实现函数内变量，可以实时拿到，如果需要存到useState中，在then函数里set
    let text = ''
    GConfirmRef.current.openConfirm({
      title: '作废确认',
      content: <View className='w-100 f-s-32 font-weight-4'>
        <View className='block-color'>
          作废后，盘点数据将不生效，所选{orderInfo?.type == 1 ? '产品' : '物料'}将
          <View className='primary-inventory-unlock display-inline-block' style={'vertical-align: mddle;margin-bottom: -4px;'}></View>
          <text className='yellow-color'>解锁出入库</text>,是否确认作废?
        </View>
        <View className='at-textarea-box'>
          <AtTextarea
            value={text}
            count={false}
            placeholder='请输入作废原因'
            className='m-t-10 new el-imitate-textarea'
            onChange={(val) => text = val.slice(0, 200)}
          />
          {/* <View className='at-textarea-count'>{200-(text?.length || 0)}/{200}</View> */}
        </View>
      </View>,
      checkFun: async () => {
        let res = false
        if (!text) {
          Taro.showToast({ title: '请输入作废原因', icon: 'error' })
          res = true
          return res
        }
        let params = {
          id: orderInfo?.id,
          cancelReason: text,
        }
        // console.log(params)
        Taro.showLoading({ mask: true })
        await checkPlanCancelAPI(params).catch((err) => {
          console.log('err', err)
          res = true
          setTimeout(() => Taro.hideLoading(), 1000)
        })
        Taro.hideLoading()
        return res
        
      },
      cancelText: '我再想想',
      confirmText: '确认作废',
    }).then(() => {
      console.log('确认作废', text)
      Taro.setStorageSync('isRefresh', '1')
      Taro.showToast({ title: '作废成功', icon: 'success' })
      getDetail(orderInfo?.id)
    })
  }
  // 扫码盘点
  const takeScan = () => {
    setDidShow(true)
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res?.result) {
          editNumDialog(res.result, true)
        }
      },
      fail: (err) => {
        console.log(err)
        if (err.errMsg == 'scanCode:fail cancel') return;
        GConfirmRef.current.openConfirm({
          title: '提示',
          content: <View className='w-100 f-s-32 font-weight-4 block-color'>&nbsp;<text className='primary-color-new'>识别失败</text>&nbsp;，请重新扫码!</View>,
          cancelText: '取消',
          confirmText: '重新扫码',
        }).then(() => {
          takeScan()
        })
      }
    })
  }
  // 提交审核
  const submitAudit = () => {
    GConfirmRef.current.openConfirm({
      title: '提示',
      content: '确定提交审核吗?',
      cancelText: '取消',
      confirmText: '确认',
    }).then(() => {
      let params = {
        id: orderInfo?.id,
        status: orderInfo?.status
      }
      Taro.showLoading({ mask: true })
      submitAuditAPI(params).then((res) => {
        if (res.code == 200) {
          Taro.setStorageSync('isRefresh', '1')
          Taro.showToast({ title: '提交审核成功', icon: 'success' })
          getDetail(orderInfo?.id)
        }
      })
    })
  }

  // 审核驳回
  const processReject = () => {
    // 使用useState没办法实时修改，实现函数内变量，可以实时拿到，如果需要存到useState中，在then函数里set
    let text = ''
    GConfirmRef.current.openConfirm({
      title: '审核驳回确认',
      content: <View className='w-100 f-s-32 font-weight-4'>
        <View className='block-color'>
        审核驳回后，该盘点计划将回退到<text className='yellow-color'>"盘点中"</text>状态，请及时通知相关人员<text className='font-weight-7'>重新核对盘点数据！</text>
        </View>
        <AtTextarea
          value={text}
          count={false}
          placeholder='请输入驳回原因'
          className='m-t-10 new el-imitate-textarea'
          onChange={(val) => text = val.slice(0, 200)}
          placeholderClass='el-imitate-textarea-placeholder'
        />
      </View>,
      checkFun: async () => {
        let res = false
        if (!text) {
          Taro.showToast({ title: '请输入驳回原因', icon: 'error' })
          res = true
          return res
        }
        let params = {
          status: '2',
          id: orderInfo?.id,
          rejectReason: text,
        }
        // console.log(params)
        Taro.showLoading({ mask: true })
        await auditPostAPI(params).catch((err) => {
          console.log('err', err)
          res = true
          setTimeout(() => Taro.hideLoading(), 1000)
        })
        Taro.hideLoading()
        return res
      },
      cancelText: '我再想想',
      confirmText: '确认驳回',
    }).then(() => {
      console.log('确认驳回', text)
      Taro.setStorageSync('isRefresh', '1')
      Taro.showToast({ title: '驳回成功', icon: 'success' })
      getDetail(orderInfo?.id)
    })
  }
  // 审核通过
  const processPass = () => {
    // 使用useState没办法实时修改，实现函数内变量，可以实时拿到，如果需要存到useState中，在then函数里set
    let text = ''
    GConfirmRef.current.openConfirm({
      title: '审核通过确认',
      content: <View className='w-100 f-s-32 font-weight-4'>
        <View className='block-color'>
        审核通过后，系统将自动更新
        <View className='primary-inventory-refresh display-inline-block' style={'vertical-align: mddle;margin-bottom: -4px;'}></View>
        <text className='primary-color-new'>库存和成本价</text>
        ，所选{orderInfo?.type == 1 ? '产品' : '物料'}将
        <View className='primary-inventory-unlock display-inline-block' style={'vertical-align: mddle;margin-bottom: -4px;'}></View>
        <text className='yellow-color'>解锁出入库</text>
        ，确认继续？
        </View>
      </View>,
      cancelText: '我再想想',
      confirmText: '确认通过',
    }).then(() => {
      console.log('确认通过', text)
      let params = {
        status: '5',
        id: orderInfo?.id,
      }
      Taro.showLoading({ mask: true })
      auditPostAPI(params).then((res) => {
        if (res.code == 200) {
          Taro.setStorageSync('isRefresh', '1')
          Taro.showToast({ title: '审核通过成功', icon: 'success' })
          getDetail(orderInfo?.id)
        }
      })
    })
  }
  return (
    <View className='inventory-page'>
      {/* <NavBar color={'#333'} title={'盘点计划详情'} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar> */}
      {/* 状态 */}
      <View className='inventory-top flex flex-center'>
        <View className={`${
          orderInfo?.status == 1 ? 'primary-inventory-wait' : 
          orderInfo?.status == 2 ? 'primary-inventory-doing' : 
          orderInfo?.status == 3 ? 'primary-inventory-again' : 
          orderInfo?.status == 4 ? 'primary-inventory-process' : 
          orderInfo?.status == 5 ? 'primary-inventory-finish' : 
          orderInfo?.status == 6 ? 'primary-inventory-reject' : ''
        }`}></View>
        <View style={'margin-left: 8rpx;'}>{statusList.find((f) => f.id == orderInfo?.status)?.name}</View>
      </View>

      {/* 基础信息 */}
      <View className='common-card new'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-base'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>基础信息</View>
          </View>
        </View>

        <View className='common-item new'>
          <View className='common-item-label'>计划名称</View>
          <View className='common-item-value'>{orderInfo?.planName}</View>
        </View>
        <View className='common-item new'>
          <View className='common-item-label'>盘点类型</View>
          <View className='common-item-value'>{orderInfo?.type == 1 ? '成品盘点' : '物料盘点'}</View>
        </View>
        <View className='common-item new'>
          <View className='common-item-label'>盘点时间</View>
          <View className='common-item-value'>{orderInfo?.planTime}</View>
        </View>
        <View className='common-item new'>
          <View className='common-item-label'>负责人</View>
          <View className='common-item-value'>{orderInfo?.headUserName}</View>
        </View>
        <View className='common-item new'>
          <View className='common-item-label'>创建人</View>
          <View className='common-item-value'>{orderInfo?.createByName}</View>
        </View>
        <View className={`common-item new`}>
          <View className='common-item-label'>创建时间</View>
          <View className='common-item-value'>{orderInfo?.createTime}</View>
        </View>

        {
            orderInfo?.auditUserName ? <>
            <View className={`common-item new`}>
                <View className='common-item-label'>审核人</View>
                <View className='common-item-value'>{orderInfo?.auditUserName}</View>
            </View>
            </> : <></>
        }
        {
            orderInfo?.auditTime ? <>
            <View className={`common-item new`}>
              <View className='common-item-label'>审核时间</View>
              <View className='common-item-value'>{orderInfo?.auditTime}</View>
            </View>
            </> : <></>
        }
        {
            (orderInfo?.status == 2) && orderInfo?.rejectReason ? <>
            <View className={`common-item new`}>
              <View className='common-item-label'>驳回原因</View>
              <View className='common-item-value overflow-two' onClick={(e) => toolTipHandle(e, orderInfo?.rejectReason)}>
                <View className='overflow-two'>{orderInfo?.rejectReason}</View>
              </View>
            </View>
            </> : <></>
        }
        {
            orderInfo?.cancelReason ? <>
            <View className={`common-item new`}>
              <View className='common-item-label'>作废原因</View>
              <View className='common-item-value' onClick={(e) => toolTipHandle(e, orderInfo?.cancelReason)}>
                <View className='overflow-two'>{orderInfo?.cancelReason}</View>
              </View>
            </View>
            </> : <></>
        }
      </View>

      {/* 盘点明细 */}
      <View className='common-card new inventory-detail'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-detail'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>盘点明细</View>
          </View>
        </View>

        {
          // 待盘点
          ['1'].includes(orderInfo?.status+'') ? <>
          <View className='inventory-wait-head flex flex-between f-s-28'>
            <View style={'flex: 1;'}>合计&nbsp;<View className='display-inline-block font-weight-7'>{total || 0}</View>&nbsp;条数据</View>
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
          </> : <></>
        }

        {
          // 盘点中/复盘中
          ['2','3'].includes(orderInfo?.status+'') || ['2','3'].includes(orderInfo?.cancelStatus+'') ? <>
          <View className='flex flex-between'>
            <AtTabs
              scroll
              current={current}
              tabList={((resStatus()) == 2 ? isEnterList : isEnterAgainList).map((m) => {
                return {
                  title: `${m.title}(${counts[m.id]})`
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
          <View className='inventory-wait-head flex flex-between f-s-28'>
            <View className='flex flex-start' style={'flex: 1;'} onClick={diffCheckHandle}>
              <View className={`${diffCheck ? 'primary-inventory-check-active' : 'primary-inventory-check-init'}`}></View>
              <View className='m-l-8'>仅查看{(resStatus()) == 2 ? '盘点' : '复盘'}差异</View>
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
          </> : <></>
        }

        {
          // 审核中/已完成
          ['4','5'].includes(orderInfo?.status+'') || ['4','5'].includes(orderInfo?.cancelStatus+'') ? <>
          <View className='flex flex-between'>
            <AtTabs
              scroll
              current={current}
              tabList={priceStatusList.map((m) => {
                return {
                  title: `${m.title}(${counts[m.id]})`
                }
              })}
              className='new no-body tab-auto'
              onClick={handleClick}
            ></AtTabs>
            <View className={``}></View>
          </View>
          <View className='inventory-wait-head flex flex-between f-s-28'>
            {/* {orderInfo?.status == '3' ? <View className='flex flex-start' style={'flex: 1;'}>
              <View className={`${true ? 'primary-inventory-check-active' : 'primary-inventory-check-init'}`}></View>
              <View className='m-l-8'>仅查看未填写的</View>
            </View> : <></>} */}
            <View></View>
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
          </> : <></>
        }

        {
          // 明细卡片
          list?.length ? list.slice(0, waitShowAll ? list?.length : 5).map((item, index) => {
            return (
              <View className='inventory-detail-row'>
                {
                  // 物料盘点
                  orderInfo?.type == 2 ? <>
                  <View className='common-item new'>
                    <View className='common-title mini'>{item?.materialName}</View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>材质牌号</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.materialQuality}</View></View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料编码</View>
                      <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.materialCode}</View></View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料类别</View>
                      <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.categoryName}</View></View>
                    </View>
                  </View>
  
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>品牌</View>
                      <View className='common-item-value'>{item?.manufacturer}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>板厚<View className='common-label-unit'>(mm)</View></View>
                      <View className='common-item-value'>{item?.boardThickness}</View>
                    </View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>单位</View>
                      <View className='common-item-value'>{item?.units}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>长*宽<View className='common-label-unit'>(mm)</View></View>
                      <View className='common-item-value'>{(item?.width || item?.length) ? (item?.length+'*'+item?.width) : ''}</View>
                    </View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>级别</View>
                      <View className='common-item-value'>{item?.level}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>铜厚<View className='common-label-unit'>(oz)</View></View>
                      <View className='common-item-value'>{item?.copperThickness}</View>
                    </View>
                  </View>
                  </> : 
                  // 成品盘点
                  <>
                  <View className='common-item new'>
                    <View className='common-title mini'>{item?.commodityName}</View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>产品编码</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.commodityCode}</View></View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>客户编码</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.customerCode}</View></View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>单位</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.units}</View></View>
                  </View>
                  </>
                }

                {
                  // 盘点中/复盘中
                  ['2','3'].includes(orderInfo?.status+'') || ['2','3'].includes(orderInfo?.cancelStatus+'') ? <>
                    <View className='gray-bg f-s-28 font-weight-4 flex flex-start m-b-12'>
                      <View>库存数量：{item?.inventoryQuantity}</View>
                      { ['2'].includes((resStatus())+'') ?
                        (item?.replayQuantity ? <View className='m-l-32'>复盘数量：{item?.replayQuantity}</View> : <></>) : <></>
                      }
                      { ['3'].includes((resStatus())+'') ?
                        <View className='m-l-32'>首盘数量：{item?.checkQuantity}</View> : <></>
                      }
                    </View>
                    <View className='f-s-28 font-weight-4 flex flex-end m-b-12'>
                      <View className=''>本次{(resStatus()) == 2 ? '盘点' : '复盘'}</View>
                      <AtInput
                        focus={true}
                        maxLength={8}
                        editable={false}
                        placeholder="请输入"
                        disabled={orderInfo?.status == 6}
                        placeholderClass="el-imitate-input-placeholder"
                        className="new el-imitate-input m-l-16 white-bg w-160"
                        value={(resStatus()) == 2 ? item?.checkQuantity : item?.replayQuantity}
                        onClick={() => {
                          if (orderInfo?.status != 6) {
                            editNumDialog(item.bizId)
                          }
                        }}
                      ></AtInput>
                    </View>
                  </> : <></>
                }
                {
                  // 审核中/已完成
                  ['4','5'].includes(orderInfo?.status+'') || ['4','5'].includes(orderInfo?.cancelStatus+'') ? <>
                  <View className='gray-bg m-b-12'>
                    <View className='f-s-28 font-weight-4 flex flex-start m-b-8'>
                      <View>库存数量：{item?.inventoryQuantity}</View>
                      { true ? <View className='m-l-32'>盘点数量：{item?.replayQuantity}<text className={`${(item?.differenceQuantity+'').includes('-') ? 'error-color' : 'green-color'}`}>({(item?.differenceQuantity+'').includes('-') ? '' : '+'}{item?.differenceQuantity})</text></View> : <></>}
                    </View>
                    {orderInfo?.type == 2 && hasPermission(['xcxinventory:checkPlan:cost']) ? <View className='f-s-28 font-weight-4 flex flex-start'>
                      成本价(元)：{item?.inventoryCost}
                    </View> : <></>}
                  </View>
                  </> : <></>
                }
              </View>
            )
          }) : <View className='g-empty no-margin-top'>暂无数据</View>
        }
      </View>
      {waitShowAll ? (total > 50 ? <View className='max-data-length-100'>当前最多展示50条</View> : <View className='max-data-length-100'>暂无更多数据</View>) : <></>}

      {
        // 待盘点 底部按钮
        orderInfo?.status == 1 ? <View className='inventory-bottom-btn flex flex-between'>
          {hasInvalid ? <View className='expend-click' onClick={() => toPath(`/packageB/inventoryCheck/invalidDetail/index?id=${id}&type=${orderInfo?.type}`)}>
            <View className='flex flex-start'>
              <View className='primary-inventory-invalid'></View>
              <View className='f-s-28 font-weight-4 block-color m-l-8'>查看失效数据</View>
            </View>
          </View> : <View></View>}
          {hasPermission(['xcxinventory:checkPlan:start']) ? <AtButton type="primary" className='new no-margin' onClick={startInventoryCheck}>开始盘点</AtButton> : <></>}
        </View> : <></>
      }
      {
        // 盘点中/复盘中 底部按钮  提交审核使用 xcxinventory:checkPlan:make 操作权限
        ['2','3'].includes(orderInfo?.status+'') ? <View className='inventory-bottom-btn flex flex-end'>
          {hasPermission(['xcxinventory:checkPlan:cancel']) ? <AtButton className='new gray-btn no-margin' onClick={rejectHandle}>作废</AtButton> : <></>}
          {hasPermission(['xcxinventory:checkPlan:make']) ? <AtButton type="primary" className='new no-margin m-l-32' onClick={takeScan}>扫码盘点</AtButton> : <></>}
          {hasPermission(['xcxinventory:checkPlan:make']) ? <AtButton type="primary" className='new no-margin m-l-32' onClick={submitAudit}>提交审核</AtButton> : <></>}
        </View> : <></>
      }
      {
        // 审核中 底部按钮
        ['4'].includes(orderInfo?.status+'') ? <View className='inventory-bottom-btn flex flex-end'>
          {hasPermission(['xcxinventory:checkPlan:cancel']) ? <AtButton className='new gray-btn no-margin' onClick={rejectHandle}>作废</AtButton> : <></>}
          {hasPermission(['xcxinventory:checkPlan:audit']) ? <>
          <AtButton type="primary" className='new no-margin m-l-32' onClick={processReject}>审核驳回</AtButton>
          <AtButton type="primary" className='new no-margin m-l-32' onClick={processPass}>审核通过</AtButton>
          </> : <></>}
        </View> : <></>
      }
      
      <GFeedback right={true}></GFeedback>
      <GUp style={{bottom: '192rpx'}}></GUp>
      <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>
      <GDrawerFilter newF={true} classStr={'drawer-has-nav-bar'} formList={orderInfo?.type == 1 ? formList : formListAgain} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
    </View>
  )
}
