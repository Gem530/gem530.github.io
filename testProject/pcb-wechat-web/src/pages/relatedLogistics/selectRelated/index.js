import './index.less'
import dayjs from 'dayjs'
import { useState } from 'react'
import GInput from '../../../components/g-input'
import Search from '../../../components/searchOld'
import { View, Picker, Input, ScrollView } from '@tarojs/components'
import { AtIcon, AtButton, AtInput, AtTabs, AtLoadMore } from "taro-ui"
import Taro, {useLoad, useDidShow, useShareAppMessage} from '@tarojs/taro'
import { signListAPI, backSignListAPI, detailByCodeAPI } from '../../services/saleContract'
import GFeedback from '../../../components/g-feedback'

export default function SelectRelated() {
  const [id, setId] = useState('')
  const [type, setType] = useState(0)
  const [list, setList] = useState([])
  const [number, setNumber] = useState('')
  const [status, setStatus] = useState('loading')
  const [time, setTime] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  // const [time, setTime] = useState('2024-04-29')
  const [companyInfo, setCompanyInfo] = useState({
    id: 0,
    name: '',
  })
  useShareAppMessage(() => {
    return {
      title: '选择送货单',
      path: '/pages/index/index'
    }
  })
  useLoad((option) => {
    // console.log(option)
    setId(option?.id)
    getSignList(option?.id)
    Taro.setNavigationBarTitle({
      title: '选择送货单-' + option?.id
  })
  })

  useDidShow(() => {
  })

  const getSignList = (tempId, tempType, tempTime) => {
    let params = {
      pageNum: 1,
      pageSize: 1000,
      customerCode: tempId || id,
      deliveryTimeEnd: (tempTime || time) + ' 23:59:59',
      deliveryTimeStart: (tempTime || time) + ' 00:00:00',
      type: (tempType != undefined ? tempType : type) + '',
    }
    getList(params, tempType || 0)
  }

  // 销售订单、退货订单接口
  const getList = (params, tempType) => {
    if (tempType == '0') {
      setStatus('loading')
      signListAPI(params).then((res) => {
        if (res.code == 200) {
          setList(res.rows || [])
        }
      }).finally(() => {
        setStatus('noMore')
      })
    } else {
      setStatus('loading')
      backSignListAPI(params).then((res) => {
        if (res.code == 200) {
          res.rows?.length && res.rows.map((item) => {
            item.deliveryQuantity = item.quantity
          })
          setList(res.rows || [])
        }
      }).finally(() => {
        setStatus('noMore')
      })
    }
  }

  // 上/下一天
  const changeTime = (tempType) => {
    let tempTime = ''
    if (tempType == 'prev') {
      // 上一天
      tempTime = dayjs(time).subtract(1, 'day').format('YYYY-MM-DD')
    } else {
      // 下一天
      tempTime = dayjs(time).add(1, 'day').format('YYYY-MM-DD')
    }
    setTime(tempTime)
    getSignList(undefined, type, tempTime)
  }

  // 搜索
  const searchHandle = (e) => {
    // (e) => setTime(e.detail.value)
    // console.log(time, id)
    setTime(e.detail.value)
    getSignList('', type, e.detail.value)
  }
  // tab点击
  const tabClick = (e) => {
    // console.log(e)
    setType(e)
    getSignList('', e)
  }

  const chooseItem = (item) => {
    Taro.setStorageSync('sendOrderInfo', item)
    Taro.navigateBack({ delta: 1 })
  }

  const toPath = (item, index) => {
    // console.log(item, index)
    Taro.navigateTo({url: '/pages/scanProduction/Index'})
  }
  return (
    <View className='select-related-page'>
      <AtTabs current={type} tabList={[
        { title: '送货单' },
        { title: '退货送货单' },
      ]} onClick={tabClick}></AtTabs>
      <Search
        inputView={
          <View className='select-related-bottom flex flex-between'>
            <AtButton type='primary' onClick={() => changeTime('prev')}>上一天</AtButton>
            <GInput value={time} slotIcon={
                <AtIcon value='calendar' size='16' color="#999" className="g-icon"></AtIcon>
            } clearShow={false} slot={
              <Picker mode='date' onChange={searchHandle}>
                  <Input value={time} disabled placeholder='时间'></Input>
              </Picker>
            }></GInput>
            <AtButton type='primary' onClick={() => changeTime('next')}>下一天</AtButton>
          </View>
        }
        // buttonView={<AtButton type='primary' size="small" onClick={searchHandle}>搜索</AtButton>}
      ></Search>

      <ScrollView className='select-related-content' scrollY>
      {list.length ? <>
        {
          list.map((item) => {
            return (
              <View className='related-card'>
                <View className='related-card-title flex flex-start'>送货单信息
                  <View className='related-card-subtitle'>(订单数量：{item?.codeQuantity})</View>
                </View>

                <View className='related-card-item'>
                  <View className='related-card-label'>客户PO号:</View>
                  <View className='related-card-value'>{item?.customerPo}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>客户型号:</View>
                  <View className='related-card-value'>{item?.commodityName}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>客户物料号:</View>
                  <View className='related-card-value'>{item?.customerMaterialCode}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>料号:</View>
                  <View className='related-card-value'>{item?.commodityCode}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>发货数量:</View>
                  <View className='related-card-value'>{item?.deliveryQuantity}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>发货时间:</View>
                  <View className='related-card-value'>{item?.deliveryTime}</View>
                </View>
                <View className='related-card-item'>
                  <View className='related-card-label'>发货单号:</View>
                  <View className='related-card-value'>{item?.code}</View>
                  <View className='related-card-tag' onClick={() => chooseItem(item)}>选择</View>
                </View>
              </View>
            )
          })
        }
      </> : <></>}
      <AtLoadMore status={status} />
      </ScrollView>
      <GFeedback></GFeedback>
    </View>
  )
}
