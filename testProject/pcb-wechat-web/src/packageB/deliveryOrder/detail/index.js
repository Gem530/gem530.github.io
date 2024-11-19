import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import NavBar from '../../../components/nav-bar'
import GFeedback from '../../../components/g-feedback'
import GShareFile from '../../../components/g-share-file'
import { desensitizedOne } from '../../../pages/util/func'
import GPhoneCheck from '../../../components/g-phone-check'
// import DetailBack from '../../../components/detail-back'
import DetailUpload from '../../../components/detail-upload'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { detailByCodeAppAPI } from '../../../pages/services/saleContract/index'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtProgress } from 'taro-ui'
import { dateMakingAPI, verifyNumberAPI } from '../../../pages/services/login/loginService'


export default function DeliveryOrderDetail() {
  const GShareFileRef = useRef()
  const GPhoneCheckRef = useRef()
  // const [list, setList] = useState([])
  const [code, setCode] = useState()
  const [options, setOptions] = useState()
  // const [items, setItems] = useState([])
  // const [current, setCurrent] = useState(0)
  const [didShow, setDidShow] = useState(false)
  // const [progress, setProgress] = useState(0)
  const [expressCrt, setExpressCrt] = useState(0)
  const [detailList, setDetailList] = useState([])
  const [expressList, setExpressList] = useState([])
  const [desensitizLevel, setDesensitizLevel] = useState('1')
  // const [isShowProcess, setIsShowProcess] = useState('0')
  const [orderInfo, setOrderInfo] = useState({
    commodityCode: '',
    commodityName: '',
    customerPo: '',
  })
  
  useShareAppMessage(() => {
    return {
      title: '送货单详情',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    Taro.hideHomeButton({}).then();
    console.log('option:', option)
    // getDetail(option.code)
    setCode(option.code)
    setOptions(option)
    if (option?.q) {
      let url = decodeURIComponent(option.q)
      let obj = getUrlParam(url)
      // console.log(obj)
      // getDetail(obj.code)
      setCode(obj.code)
    }
    // getDesensitizLevel()
  })
  useDidShow(() => {
    // console.log('didShow----', didShow)
    if (didShow) {
      setDidShow(false)
      return
    }
    if (code) {
      getDetail(code)
    }
  })

  // 获取脱敏等级
  const getDesensitizLevel = () => {
    dateMakingAPI().then((res) => {
      if (res.code == 200) {
        setDesensitizLevel(res.data || '1')
      } else {
        setDesensitizLevel('0')
      }
    }).catch(() => setDesensitizLevel('0'))
  }

  // 是否加密
  const isDesensitiz = (str, flag = false) => {
    if (flag) {
      return desensitizLevel == '1'
    }
    if (!str) return;
    return desensitizLevel == '1' ? desensitizedOne(str) : str
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

  const previewImg = (fileList) => {
    if (!fileList?.length) return
    setDidShow(true)
    Taro.previewImage({
      current: fileList[0],
      urls: fileList
    })
  }

  // 点击下载
  const saveFile = async () => {
    let item = orderInfo
    item.key = item.fileKey
    item.name = item.fileName
    GShareFileRef.current?.saveFile(item)
  }

  // 页面跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }
  
  const getDetail = (code) => {
    if (!code) return;
    Taro.showLoading({title: '加载中...',mask: true})
    detailByCodeAppAPI(code).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        // getDesensitizLevel()
        setDesensitizLevel(res.data?.dataMaskingLevel || '1')
        res.data.logisticInfoList = [res.data.logisticInfo]
        res.data && setOrderInfo(res.data)
        setDetailList(res.data?.detailList || [])
        
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
              tempExpressList.push({
                name: item.name,
                logisticNum: item?.logisticNum ? item.logisticNum.toLocaleUpperCase() : item?.logisticNum,
                phone: item.phone,
                list: tempItemList
              })
            }
            //  else {
            //   tempExpressList.push({
            //     name: '',
            //     logisticNum: '',
            //     phone: '',
            //     list: []
            //   })
            // }
          })
          // setExpressCrt(0)
          setExpressList(tempExpressList)
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

  // 打开 手机号校验弹框
  const openPhone = () => {
    GPhoneCheckRef.current.openPhone('')
  }
  // 手机号确认
  const confirmPhone = (val, fn) => {
    console.log(val)
    let params = {
      phoneTailNumber: val,
      saleOrderIdList: detailList.map((m) => m.bizId),
    }
    verifyNumberAPI(params).then((res) => {
      if (res.code == 200) {
        if (res.data) {
          setDesensitizLevel('0')
          fn && fn()
        } else {
          Taro.showToast({ title: '未查询到手机号', icon: 'none' })
        }
      }
    })
  }
  return (
    <View className='sale-contract-page'>
      <NavBar color={'#333'} title={'送货单详情'} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar>
      <View className={`sale-card`}>
        <View className='sale-card-title'>快递进度</View>
        {
          isDesensitiz('', true) ? <>
            <View className='primary-color flex flex-center g-empty-desens w-100' onClick={openPhone}>验证后查看</View>
          </> : <>
            {orderInfo?.isCallback == '1' ? <View className='primary-sign-back primary-card-absolute'></View> : <></>}
            {expressList?.length ? <>
              {/* {expressList.length >= 1 ? <AtTabs className='express-tab' scroll={expressList.length >= 4 ? true : false} current={expressCrt} tabList={expressList.map((m, mIndex) => {
                return { title: `快递进度${mIndex + 1}` }
              })} onClick={tabClick}></AtTabs> : <></>} */}
    
              {expressList[expressCrt]?.logisticNum ? 
                <>
                  <View className='sale-user-info flex flex-start'>
                    <View className='sale-user-icon'></View>
    
                    <View className='sale-user-content'>
                      <View className='sale-user-content-top flex flex-start'>
                        <View className='sale-user-company'>{expressList[expressCrt]?.name}</View>
                        <View className={`sale-user-no ${orderInfo?.fileList?.length && 'primary-color'}`} onClick={() => previewImg(orderInfo?.fileList?.length ? orderInfo.fileList.map((m) => m.url) : [])}>{expressList[expressCrt]?.logisticNum}</View>{expressList[expressCrt]?.logisticNum ? <View className='primary-copy' onClick={() => copyText(expressList[expressCrt]?.logisticNum)}></View> : <></>}
                      </View>
    
                      <View className='sale-user-content-bottom flex flex-between'>
                        <View className='sale-user-phone flex flex-start'>
                          {expressList[expressCrt]?.phone ? <View className='sale-card-tag' onClick={() => makePhone(expressList[expressCrt]?.phone)}>
                            <AtIcon value='phone' size="14"></AtIcon>
                            {expressList[expressCrt]?.phone}
                          </View> : <></>}
                        </View>
                        {/* <View className='sale-user-time'>{'2024-06-10'}发货</View> */}
                      </View>
                    </View>
                  </View>
                  <View className='sale-between' style={'margin-bottom: 0;padding-bottom: 0;'}>
                    <View className='common-item mini' style={'flex: none;width: 50%;'}>
                      <View className='common-item-label'>送货时间</View>
                      <View className='common-item-value'>{orderInfo?.deliveryTime}</View>
                    </View>
                    {orderInfo?.signTime ? <View className='common-item mini' style={'flex: none;width: 50%;'}>
                      <View className='common-item-label'>回签时间</View>
                      <View className='common-item-value'>{orderInfo?.signTime ? dayjs(orderInfo?.signTime).format('YYYY-MM-DD') : ''}</View>
                    </View> : <></>}
                  </View>
    
                  <DetailUpload type={22} code={orderInfo?.code} id={orderInfo?.id} previewImg={() => setDidShow(true)} uploadImg={() => setDidShow(true)}></DetailUpload>
                  <View className='sale-between border-bottom'></View>
    
                  {expressList[expressCrt]?.list?.length ? <AtTimeline
                    className='sale-time-line'
                    items={expressList[expressCrt]?.list}
                  >
                  </AtTimeline> : <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />}
                  {/* <DetailBack></DetailBack> */}
                </> :
                <>
                  <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />
                </>
              }
              </> : <>
              {/* <View className='sale-card-title margin-top'>快递进度</View> */}
              <AtLoadMore status={'noMore'} noMoreText='暂无快递进度' />
              </>
            }
          </>
        }
      </View>

      {
        detailList.map((item) => {
          return (
            <View className='common-card'>
              <View className='common-item'>
                <View className='common-title'>{isDesensitiz(item?.commodityName)}</View>
              </View>

              <View className='common-item'>
                <View className='common-item-label'>产品编码</View>
                <View className='common-item-value'>{isDesensitiz(item?.commodityCode)}</View>
              </View>
              <View className='common-item'>
                <View className='common-item-label'>客户PO</View>
                <View className='common-item-value'>{isDesensitiz(item?.customerPo)}</View>
              </View>
              <View className='common-item'>
                <View className='common-item-label'>送货单号</View>
                <View className='common-item-value'>{isDesensitiz(item?.code)}</View>
              </View>

              <View className='common-between half'>
                <View className='common-item'>
                  <View className='common-item-label'>送货数量</View>
                  <View className='common-item-value'>{item?.quantity}</View>
                </View>
                <View className='common-item'>
                  <View className='common-item-label'>{item?.reserveQuantity ? '备品数量' : ''}</View>
                  <View className='common-item-value'>{item?.reserveQuantity}</View>
                </View>
              </View>
            </View>
          )
        })
      }

      {!isDesensitiz('', true) ? <View className='common-round-btn flex flex-center'>
        <View className='common-round-item primary-color flex flex-center' onClick={() => toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=22&title=送货单&isReview=1`)}>预览送货单</View>
        {orderInfo?.isCallback == '0' ?<View className='common-round-item primary-color flex flex-center' onClick={() => toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=22&title=送货单&isReview=2`)}>回签</View> : <View className='common-round-item primary-color flex flex-center' onClick={saveFile}>发送给好友</View>}
      </View> : <></>}
      <GShareFile ref={GShareFileRef}></GShareFile>
      <GPhoneCheck ref={GPhoneCheckRef} confirm={confirmPhone}></GPhoneCheck>
      <GFeedback></GFeedback>
    </View>
  )
}
