import './index.less'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Decimal } from 'decimal.js'
import { View ,Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useLoad,useDidShow, useShareAppMessage } from '@tarojs/taro'
import { getWxMaterialInTransitAPI } from '../../../pages/services/saleContract/index'
import { AtIcon, AtTabs, AtButton, AtTimeline, AtLoadMore, AtProgress } from 'taro-ui'

export default function LandMaterialDetail() {
  const [options, setOptions] = useState()
  // const [list, setList] = useState([])
  const [didShow, setDidShow] = useState(false)
  // const [items, setItems] = useState([])
  // const [current, setCurrent] = useState(0)
  // const [progress, setProgress] = useState(0)
  const [expressCrt, setExpressCrt] = useState(0)
  const [expressList, setExpressList] = useState([])
  // const [isShowProcess, setIsShowProcess] = useState('0')
  const [orderInfo, setOrderInfo] = useState({
    commodityCode: '',
    commodityName: '',
    customerPo: '',
  })
  
  const [currentOrderId, setCurrentOrderId] = useState(0)
  
  useShareAppMessage(() => {
    return {
      title: '进度跟踪',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    setOptions(option)
  })
  useDidShow(() => {
    Taro.hideHomeButton({}).then();
    console.log('option:', options)
    if (options?.q) {
      let url = decodeURIComponent(options.q)
      let obj = getUrlParam(url)
      console.log(obj)
      getDetail(obj.id)
    } else {
      getDetail(options.id)
    }
    setCurrentOrderId(options.id);
  })
  
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

  // tab改变
  const tabClick = (e) => {
    console.log('tabClick', e)
    setExpressCrt(e)
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
  
  const getDetail = (id) => {
    if (!id) return;
    Taro.showLoading({title: '加载中...',mask: true})
    getWxMaterialInTransitAPI({
      id: id,
      isApplet: '1' // 小程序1 ，erp 0
    }).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        res.data && setOrderInfo(res.data)
        
    
        if (res.data?.logisticInfoList?.length) {
          let tempExpressList = []
          res.data?.logisticInfoList?.length && res.data.logisticInfoList.map((item) => {
            let tempItemList = []
            if (item) {
              item?.logisticItemList?.length && item.logisticItemList.map((el) => {
                tempItemList.push({
                  icon: 'check-circle',
                  title: el.time,
                  content: [el.content], // el.stateText, 
                })
              })
              let tempInfo = JSON.parse(JSON.stringify(item))
              tempInfo.logisticNum = item?.logisticNum ? item.logisticNum.toLocaleUpperCase() : item?.logisticNum
              tempInfo.list = tempItemList
              tempExpressList.push(tempInfo)
            } else {
              tempExpressList.push({
                name: '',
                logisticNum: '',
                phone: '',
                fileKey: '',
                fileName: '',
                deliveryId: '',
                isCallback: '',
                deliveryTime: '',
                fileUrls: [],
                list: []
              })
            }
          })
          setExpressCrt(0)
          setExpressList(tempExpressList)
          console.log("tempExpressList",tempExpressList);
        }
        console.log('getDetail')
      }
      Taro.hideLoading()
    }).catch((err) => {
      console.log('err', err)
      setTimeout(() => {
        Taro.hideLoading()
      }, 1500)
    })
  }
  const previewImg = (fileList) => {
    console.log("====fileList",fileList)
    if (!fileList?.length) return
    setDidShow(true)
    Taro.previewImage({
      current: fileList[0],
      urls: fileList
    })
  }

  const previewImgItem = (url) => {
    if (!url) return
    setDidShow(true)
    Taro.previewImage({
      current: url,
      urls: [url]
    })
  }

   // 跳转到关联详情
   const toRelatedDetail = (e,deliveryId, orderId) => {
    console.log("expressList[expressCrt]",expressList[expressCrt])
      e.stopPropagation();
      Taro.navigateTo({ url: `/packageB/landMaterial/relatedLogistics/index?id=${currentOrderId}&deliveryId=${deliveryId}` })
  }

  return (
    <View className='sale-contract-page'>
      <View className='common-card'>
        <View className='common-item'>
          <View className='common-title'>{orderInfo?.materialName}</View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>供应商名称</View>
          <View className='common-item-value'>{orderInfo?.companyName}</View>
        </View>
        <View className='common-item'>
          <View className='common-item-label'>送货地址</View>
          <View className='common-item-value'>{orderInfo?.deliveryAddress}</View>
        </View>
        <View className='common-item'>
          <View className='common-item-label'>规格型号</View>
          <View className='common-item-value'>{orderInfo?.specification}</View>
        </View>

        <View className='common-between half'>
          <View className='common-item detail-left'>
            <View className='common-item-label'>采购数量</View>
            <View className='common-item-value'>{orderInfo?.quantity}</View>
          </View>
          <View className='common-item detail-left'>
            <View className='common-item-label'>已收数量</View>
            <View className='common-item-value'>{orderInfo?.receiveQuantity}</View>
          </View>
        </View>
        <View className='common-between half'>
          <View className='common-item detail-left'>
            <View className='common-item-label'>在途数量</View>
            <View className='common-item-value'>{orderInfo?.inTransitNumber}</View>
          </View>
          <View className='common-item detail-left'>
            <View className='common-item-label'>单位</View>
            <View className='common-item-value'>{orderInfo?.units}</View>
          </View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>要求交期</View>
          <View className='common-item-value'>{dayjs(orderInfo.deliverTime).format('YYYY-MM-DD')}</View>
        </View>
      </View>

      <View className={`sale-card `}>
        <View className='sale-card-title'>快递进度</View>
        {expressList?.length ? <>
          {expressList.length > 1 ? <AtTabs className='express-tab' scroll={expressList.length >= 4 ? true : false} current={expressCrt} tabList={expressList.map((m, mIndex) => {
            return { title: `快递进度${mIndex + 1}` }
          })} onClick={tabClick}></AtTabs> : <></>}

          {expressList[expressCrt]?.logisticNum ? 
            <>
              <View className='sale-user-info flex flex-start'>
                {expressList[expressCrt]?.isCallback == '1' ? <View className='primary-sign-back sale-user-info-back'></View> : <></>}
                <View className='sale-user-icon'></View>

                <View className='sale-user-content'>
                  <View className='sale-user-content-top flex flex-start'>
                    <View className='sale-user-company'>{expressList[expressCrt]?.name}</View>
                    <View className={`sale-user-no ${expressList[expressCrt]?.fileUrls && 'block-color'}`} >{expressList[expressCrt]?.logisticNum}</View>{expressList[expressCrt]?.logisticNum ? <View className='primary-copy' onClick={() => copyText(expressList[expressCrt]?.logisticNum)}></View> : <></>}
                  </View>

                  <View className='sale-user-content-bottom flex flex-between'>
                    <View className='sale-user-phone flex flex-start'>
                      {expressList[expressCrt]?.phone ? <View className='sale-card-tag' onClick={() => makePhone(expressList[expressCrt]?.phone)}>
                        <AtIcon value='phone' size="14" style={'margin-right: 8px;'}></AtIcon>
                        {expressList[expressCrt]?.phone}
                      </View> : <></>}
                    </View>
                    <View className='sale-user-time'>{expressList[expressCrt]?.deliveryTime}{expressList[expressCrt]?.deliveryTime ? '发货' : ''}</View>
                  </View>
                </View>
              </View>

              <View className='sign-swiper-content'>
                      {expressList[expressCrt]?.fileUrls?.length ? <Swiper
                        circular
                        indicatorDots
                        className='sign-swiper'
                        indicatorColor='rgba(211, 211, 211, 1)'
                        indicatorActiveColor='rgba(45, 144, 237, 1)'>
                        {
                            expressList[expressCrt]?.fileUrls.map((item, index) => {
                                return (
                                    <SwiperItem>
                                        <View className='sign-swiper-card' onClick={() => previewImgItem(item)}>
                                            <Image src={item} className='sign-swiper-card-img' mode='aspectFit'></Image>
                                        </View>
                                    </SwiperItem>
                                )
                            })
                        }
                    </Swiper> : <View className='g-sign-empty flex flex-center flex-column'>
                    </View>}
                  </View>

              {/* <View className='sale-card-title margin-top'>快递进度</View> */}
              {expressList[expressCrt]?.list?.length ? <AtTimeline
                className='sale-time-line'
                items={expressList[expressCrt]?.list || []}
              >
              </AtTimeline> : <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />}

              {/* <View className='sale-card-expend flex flex-center' onClick={() => setTwoShow(!twoShow)}>
                {!twoShow ? '展开' : '收起'}
                <AtIcon value={!twoShow ? 'chevron-down' : 'chevron-up'} size="16"></AtIcon>
              </View> */}
            </> :
            <>
              <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />
            </>
          }
          </> : <>
          <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />
          </>
        }
      </View>


      <View className='common-bottom-btn'>
            <AtButton plain size="mini" onClick={ (e) => toRelatedDetail(e,`${orderInfo?.deliveryId}`,`${orderInfo?.id}`) }>关联物流</AtButton>
      </View>

    </View>
  )
}
