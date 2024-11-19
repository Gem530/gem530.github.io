import '../detail/index.less'
import dayjs from 'dayjs'
import {useState, useRef} from 'react'
import GStep from '../../../../../components/g-step'
import NavBar from '../../../../../components/nav-bar'
import GInputQuick from '../../../../../components/g-input-quick'
import {View, Picker} from '@tarojs/components'
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import {AtButton, AtInput} from "taro-ui"
import {waitDetailAPI, addDeliveryAPI} from '../../../../services/materialRequisition'
import {signListAPI} from "../../../../services/signMange";
import GSignPop from "../../../../../components/g-sign-pop";

export default function ProcurementSignatureContractDetail() {

  // 弹框信息
  const initDelivery = {
    phoneNumber: '',
    deliveryVehicle: '',
    loadingStaff: '',
    logisticsCompany: '',
    logisticsTrackingNumber: '',
    deliveryTime: dayjs(new Date()).format('YYYY-MM-DD'),
  }
  const inputQuickRef1 = useRef()
  const inputQuickRef2 = useRef()
  const inputQuickRef3 = useRef()

  // 不参与页面交互的数据，可以直接定义，不需要使用useState
  const [delivery, setDelivery] = useState(initDelivery)
  const [list, setList] = useState([])
  const [signList, setSignList] = useState([])
  const [options, setOptions] = useState()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [open, setOpen] = useState(false)

  useLoad((options) => {
    setOptions(options)
    if (options?.id) {
      getWaitDetail({id: options?.id})
    }
    if (options?.ids) {
      getWaitDetail({idList: options?.ids})
    }
  })

  useShareAppMessage(() => {
    return {
      title: '送货单详情',
      path: '/pages/index/index'
    }
  })

  // 获取详情
  const getWaitDetail = (val) => {
    setLoading(true)
    waitDetailAPI(val || '').then((res) => {
      // console.log(res)
      if (res.code == 200) {
        res.data.forEach((item) => {
          item.deliveryQuantity = item.oweQuantity
        })
        setList(res.data || [])
        setAddress(res.data?.[0].deliveryAddress || '')
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  // 修改数据
  const updateData = (arr) => {
    if (!arr?.length) return
    let tempDelivery = JSON.parse(JSON.stringify(delivery))
    arr.map((item) => {
      if (item.field == 'phoneNumber') {
        item.value = (item.value+'').replace(/[^0-9\.\-]/g,'')
      }
      tempDelivery[item.field] = item.value
    })
    // console.log('tempDelivery', tempDelivery)
    setDelivery(tempDelivery)
  }

  // 修改数组数据
  const updateList = (arr, param = {value: 0, field: 'id'}) => {
    if (!arr?.length) return
    let tempList = JSON.parse(JSON.stringify(list))
    let crtTemp = tempList.find((f) => f[param.field] == param.value)
    let errorMsg = '';
    arr.map((item) => {
      // 校验数量
      if ('deliveryQuantity' == item.field && Number(item.value) > Number(crtTemp['oweQuantity'])) {
        errorMsg = `送货数量不能超过${crtTemp['oweQuantity']}`
        return;
      }
      crtTemp[item.field] = item.value
    })
    if (errorMsg) {
      Taro.showToast({title: errorMsg, icon: 'none'})
      return
    }
    // console.log('tempList', tempList)
    setList(tempList)
  }
  // 删除数组数据
  const delList = (param = {value: 0, field: 'id'}, tempType = 'list') => {
    if (!param?.value) return
    if (tempType == 'list') {
      let tempList = JSON.parse(JSON.stringify(list))
      let crtIndex = tempList.findIndex((f) => f[param.field] == param.value)
      tempList.splice(crtIndex, 1)
      setList(tempList)
    }
  }

  // 校验修改数据
  const checkList = () => {
    let res = ''
    list.map((item) => {
      if (!item.deliveryQuantity || item.deliveryQuantity == 0) {
        res = item.deliveryQuantity == 0 ? '送货数量必须输入大于0的数' : '请填写送货数量'
      } else if (Number(item.deliveryQuantity) > Number(item.oweQuantity)) {
        res = `送货数量不能超过${item.oweQuantity}`
      }
      return
    })
    return res
  }

  // 删除操作
  const delHandle = (row) => {
    if (list?.length <= 1) {

      Taro.showToast({title: '送货明细不能为空', icon: 'none'})
      return
    }
    Taro.showModal({
      content: `确定删除${row?.materialName}商品吗？`,
      success: (res) => {
        // console.log(res)
        if (res?.confirm) {
          // console.log('确定删除')
          delList({value: row.id, field: 'id'}, 'list')
        }
      }
    })
  }

  // 确定合同
  const confirmOrder = async () => {
    let params = JSON.parse(JSON.stringify(delivery))
    params.status = '1'
    params.purchaseMaterialDeliveryList = list
    params.deliveryAddress = address
    params.deliveryTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

    // 校验数据
    const errMsg = checkList()
    if (errMsg) {
      Taro.showToast({title: errMsg, icon: 'none'})
      return
    }
    setDelivery(params)
    Taro.setStorageSync('__deliveryAdd__', JSON.parse(JSON.stringify(params)));
    // 调整到签名页面
    openSign();
  }

  // 选择签名
  const onChoose = (item) => {
    // console.log(item)
    // 设置签名key和类型
    let params = JSON.parse(JSON.stringify(delivery))
    params.imageKey = item.key
    params.signType = item.signType

    setLoading(true)
    // 新增送货单
    addDeliveryAPI(params).then((res) => {
      if (res.code == 200) {
        Taro.navigateBack({delta: 1})
        Taro.showToast({title: '操作成功', icon: 'success'})
      }
    }).finally(() => {
      setLoading(false)
      // 清除缓存
      Taro.removeStorageSync('__deliveryAdd__')
      Taro.setStorageSync('isRefresh', '1')
    })
  }

  // 打开签名弹框
  const openSign = () => {
    setOpen(true)
    Taro.showLoading({mask: true})
    signListAPI().then((res) => {
      if (res.code == 200) {
        setSignList(res.data || [])
      }
    }).finally(() => Taro.hideLoading())
  }

  // 关闭其他快捷开关
  const closeOtherHistory = (tempType) => {
    console.log(tempType)
    if (['2','3'].includes(tempType+'')) {
      inputQuickRef1.current.changeShow(false)
    }
    if (['1','3'].includes(tempType+'')) {
      inputQuickRef2.current.changeShow(false)
    }
    if (['1','2'].includes(tempType+'')) {
      inputQuickRef3.current.changeShow(false)
    }
  }

/*  // 跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }

  // 保存页面修改数据
  const saveTempData = () => {
    Taro.setStorageSync('detailData', {list})
  }*/

  return (
    <View className='contract-detail'>
      <NavBar color={'#333'} title={'新建送货单'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
      <GStep list={['我司发货', '客户确认', '客户签收']} current={0}></GStep>

      <View className='common-card'>

        <View className='common-item head'>
          <View className='common-item-label'>送货地址:</View>
          <View className='common-item-value'>{address}</View>
        </View>

        {/* <View className='common-between fixed-half m-t-20'>1 */}
          <View className='common-item'>
            <GInputQuick ref={inputQuickRef1} cacheRecordEnum={"1"} input={(dom) => {
              return (
                <AtInput className='gray-input w-100' title='送货车辆:' placeholder='请输入' value={delivery.deliveryVehicle} maxLength={30} onChange={(e) => updateData([{ value: e, field: 'deliveryVehicle' }])} onBlur={(e) => inputQuickRef1.current.save(e)}>{dom}</AtInput>
              )
            }} iconHandle={() => closeOtherHistory('1')} onChoose={(e) => updateData([{ value: e, field: 'deliveryVehicle' }])}></GInputQuick>
          </View>
          <View className='common-item'>
            <GInputQuick ref={inputQuickRef2} cacheRecordEnum={"2"} input={(dom) => {
              return (
                <AtInput className='gray-input w-100' title='装运人员:' placeholder='请输入' value={delivery.loadingStaff} maxLength={30} onChange={(e) => updateData([{ value: e, field: 'loadingStaff' }])} onBlur={(e) => inputQuickRef2.current.save(e)}>{dom}</AtInput>
              )
            }} iconHandle={() => closeOtherHistory('2')} onChoose={(e) => updateData([{ value: e, field: 'loadingStaff' }])}></GInputQuick>
          </View>
        {/* </View> */}

        {/* <View className='common-between fixed-half m-t-20'> */}
          <View className='common-item'>
            <GInputQuick ref={inputQuickRef3} cacheRecordEnum={"3"} input={(dom) => {
              return (
                <AtInput className='gray-input w-100' title='物流公司:' placeholder='请输入' value={delivery.logisticsCompany} maxLength={30} onChange={(e) => updateData([{ value: e, field: 'logisticsCompany' }])} onBlur={(e) => inputQuickRef3.current.save(e)}>{dom}</AtInput>
              )
            }} iconHandle={() => closeOtherHistory('3')} onChoose={(e) => updateData([{ value: e, field: 'logisticsCompany' }])}></GInputQuick>
          </View>
          <View className='common-item'>
            <Picker className='w-100' mode='date' onChange={(e) => updateData([{ value: e?.detail?.value, field: 'deliveryTime' }])}>
              <AtInput className='gray-input w-100' disabled title='送货日期:' value={delivery.deliveryTime} placeholder={delivery.open ? '请选择交货日期' : ''}></AtInput>
            </Picker>
          </View>
        {/* </View> */}

        <View className='common-item m-t-20'>
          <AtInput className='gray-input w-100' title='物流单号:' placeholder='请输入' value={delivery.logisticsTrackingNumber} maxLength={30} onChange={(e) => updateData([{ value: e, field: 'logisticsTrackingNumber' }])}></AtInput>
        </View>

        <View className='common-item m-t-20'>
          <AtInput className='gray-input w-100 recive-phone' title='收货手机号:' type={'number'} placeholder='顺丰物流请填写收货手机号' value={delivery.phoneNumber} maxLength={30} onChange={(e) => updateData([{ value: e, field: 'phoneNumber' }])}></AtInput>
        </View>
      </View>

      {list?.length ? list.map((item, index) => {
        return (<View className='common-card'>
            <View className='common-index'>{index + 1}</View>

            <View className='common-item head'>
              <View className='common-title'>{item.code}</View>
            </View>

            <View className='common-item'>
              <View className='common-item-label'>客户名称</View>
              <View className='common-item-value'>{item?.company}</View>
            </View>

            <View className='common-item'>
              <View className='common-item-label'>送货地址</View>
              <View className='common-item-value'>{item?.deliveryAddress}</View>
            </View>

            <View className='common-between'>
              <View className='common-item'>
                <View className='common-item-label'>商品名称</View>
                <View className='common-item-value'>{item?.materialName}</View>
              </View>
              <View className='common-item'>
                <View className='common-item-label'>单位</View>
                <View className='common-item-value'>{item?.units}</View>
              </View>
            </View>

            <View className='common-item'>
              <View className='common-item-label'>商品规格</View>
              <View className='common-item-value'>{item?.specification}</View>
            </View>

            <View className='common-between'>
              <View className='common-item'>
                <View className='common-item-label'>要求交期</View>
                <View className='common-item-value'>{item?.deliverTime}</View>
              </View>
              <View className='common-item'>
                <View className='common-item-label'>采购数量</View>
                <View className='common-item-value'>{item?.quantity}</View>
              </View>
            </View>

            <View className='common-between'>
              <View className='common-item'>
                <View className='common-item-label'>已送数量</View>
                <View className='common-item-value'>{item?.deliverQuantity}</View>
              </View>
              <View className='common-item'>
                <View className='common-item-label'>差欠数量</View>
                <View className='common-item-value'>{item?.oweQuantity}</View>
              </View>
            </View>

            <View className='common-item m-t-20'>
              <AtInput className='gray-input large w-100' title='本次送货数量:' type='digit' placeholder='请输入' value={item?.deliveryQuantity} onChange={(e) => updateList([{ value: e, field: 'deliveryQuantity' }], {value: item.id, field: 'id'})}></AtInput>
            </View>

            <View className='common-item large m-t-20' style={'align-items: center;'}>
              <AtInput className='gray-input w-100' title='送货备注:' placeholder='请输入' value={item?.remark} maxLength={30} onChange={(e) => updateList([{ value: e, field: 'remark' }], {value: item.id, field: 'id'})}></AtInput>

              <View className='common-item-btn-plain large' onClick={() => delHandle(item)}>
                <View className='primary-del'></View>
                <View className='common-item-btn-plain-text'>删除</View>
              </View>
            </View>

          </View>
        )
      }) : <></>}

      <View className='common-bottom-btn'>
        <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确定发货</AtButton>
      </View>

      <GSignPop list={signList} open={open} type={20} id={1} onClose={() => setOpen(false)} onChoose={onChoose} ></GSignPop>
    </View>

  )
}
