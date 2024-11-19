import './index.less'
import dayjs from 'dayjs'
// import wxbarcode from 'wxbarcode'
import { Decimal } from 'decimal.js'
import drawQrcode from 'weapp-qrcode'
import { useState, useRef } from 'react'
import NavBar from '../../components/nav-bar'
import GFeedback from '../../components/g-feedback'
import DetailBack from '../../components/detail-back'
// import { getSystemTimeAPI } from '../services/upload'
import GShareFile from '../../components/g-share-file'
import GPhoneCheck from '../../components/g-phone-check'
import { View, Image, Canvas } from '@tarojs/components'
import { rpxToPx, toDataUrl, desensitizedOne } from '../util/func'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { getOrderProcessAPI, getDeliveryOrderNumAPI } from '../services/saleContract/index'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtProgress, AtButton } from 'taro-ui'
import { generateUrlLinkAPI, dateMakingAPI, verifyNumberAPI } from '../services/login/loginService'


export default function SaleContract() {
  const GShareFileRef = useRef()
  const GPhoneCheckRef = useRef()
  // const [id, setId] = useState()
  const [list, setList] = useState([])
  const [items, setItems] = useState([])
  const [isOp, setIsOp] = useState(false)
  const [options, setOptions] = useState()
  const [sysTime, setSysTime] = useState()
  const [current, setCurrent] = useState(0)
  const [didShow, setDidShow] = useState(false)
  // const [logoUrl, setLogoUrl] = useState('')
  // const [userInfo, setUserInfo] = useState()
  const [progress, setProgress] = useState(0)
  const [oneShow, setOneShow] = useState(false)
  const [twoShow, setTwoShow] = useState(false)
  const [expressCrt, setExpressCrt] = useState(0)
  const [expressList, setExpressList] = useState([])
  const [deliveryOrder, setDeliveryOrder] = useState({})
  const [isShowProcess, setIsShowProcess] = useState('0')
  const [desensitizLevel, setDesensitizLevel] = useState('1')
  const [orderInfo, setOrderInfo] = useState({
    commodityCode: '',
    commodityName: '',
    customerPo: '',
  })
  
  useShareAppMessage(() => {
    return {
      title: '订单追踪',
      path: '/pages/index/index'
    }
  })

  useLoad(async (option) => {
    // Taro.hideHomeButton({}).then();
    console.log('option:', option)
    // setId(option.id)
    setOptions(option)
    // getDesensitizLevel()
  })

  useDidShow(() => {
    if (didShow) {
      setDidShow(false)
      return
    }
    if (options?.id) {
      // getSystemTime()
      getDetail(options?.id)
      if (options?.id) {
        generateUrlLinkAPI({
          path: 'pages/index/index',
          query: `url=/pages/saleContract/index&id=${options?.id}`
        }).then((res) => {
          if (res.code == 200) {
            // wxbarcode.qrcode('qrcodeId', res.data, 120, 120);
            drawQrcode({
              text: res.data,
              correctLevel: 2,
              width: rpxToPx(120),
              height: rpxToPx(120),
              canvasId: 'qrcodeId',
            })
          }
        })
      }
      if (options?.q) {
        let url = decodeURIComponent(options.q)
        let obj = getUrlParam(url)
        console.log(obj)
        getDetail(obj.id)
      }
    }
  })

  // 获取脱敏等级
  const getDesensitizLevel = () => {
    dateMakingAPI({customerId: id}).then((res) => {
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

  // 刷新
  const refreshHandle = () => {
    // getSystemTime()
    getDetail(options?.id)
  }

  // 获取送货单详情对应的订单数量
  const getDeliveryOrderNum = (id) => {
    if (!id.ids?.length) {
      setDeliveryOrder({})
      return;
    }
    getDeliveryOrderNumAPI(id).then((res) => {
      if (res.code == 200) {
        setDeliveryOrder(res.data)
      }
    })
  }
  
  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // 判断该送货单是否含有多个订单
  const isMoreOrder = () => {
    let result = 1
    try {
      result = deliveryOrder[expressList[expressCrt]?.deliveryId]
    } catch(err) {
      console.log(err)
      result = 1
    }
    return result > 1
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

  // 页面跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }
  
  const getDetail = (id) => {
    if (!id) return;
    Taro.showLoading({title: '加载中...',mask: true})
    getOrderProcessAPI({
      saleOrderId: id,
      isApplet: '1' // 小程序1 ，erp 0
    }).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        // getDesensitizLevel()
        setDesensitizLevel(res.data?.dataMaskingLevel || '1')
        setSysTime(res.data.nowDate || '')
        res.data?.saleOrderVo && setOrderInfo(res.data?.saleOrderVo)
        
        let tempItems = []
        res.data?.processStatusList?.length && res.data.processStatusList.map((item, index) => {
          if (item.isFinished == '0') {
            setCurrent(index)
          }
          tempItems.push({
            title: item.name,
            status: item.isFinished == '1' ? 'success' : '',
            // icon: { value: 'check', size: '20' }
          })
        })
        setItems(tempItems)
    
        let tempList = []
        if (res.data?.saleOrderProcessVoList?.length) {
          res.data?.saleOrderProcessVoList?.length && res.data.saleOrderProcessVoList.map((item) => {
            tempList.push({
              icon: (item?.completeTimeCustomize || item?.completeTimeDefault) ? 'check-circle' : 'clock',
              title: item?.craftNameCustomize || item?.craftNameDefault,
              content: [item?.completeTimeCustomize || item?.completeTimeDefault],
              color: (item?.completeTimeCustomize || item?.completeTimeDefault) ? 'blue' : 'yellow'
            })
          })
        }
        let tempProgress = 0
        let orderLen = res.data?.saleOrderProcessVoList?.length ? (res.data?.saleOrderProcessVoList?.filter((f) => f.completeTimeCustomize || f.completeTimeDefault)?.length || 0) : 0
        tempProgress = Decimal(orderLen).div(Decimal(res.data?.saleOrderProcessVoList?.length || 0)).mul(100).toNumber().toFixed(2)
        setIsShowProcess(res.data?.isShowProcess || '0')
        setProgress(Number(tempProgress))
        setList(tempList)
        // [
        //   { icon: 'check-circle', title: '刷牙洗脸', content: ['2024-05-13 17:27'] },
        //   { icon: 'check-circle', title: '吃早餐', content: ['2024-05-13 17:27'] },
        //   { icon: 'check-circle', title: '上班', content: ['2024-05-13 17:27'] },
        // ]
    
        let tempExpressList = []
        if (res.data?.logisticInfoList?.length) {
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
          // setExpressCrt(0)
        }
        setExpressList(tempExpressList)
        getDeliveryOrderNum({ids: res.data?.logisticInfoList.map((m) => m.deliveryId)})
      }
      Taro.hideLoading()
    }).catch((err) => {
      console.log('err', err)
      setTimeout(() => {
        Taro.hideLoading()
      }, 1500)
    })
  }

  const previewQr = async () => {
    toDataUrl('qrcodeId').then((res) => {
      // res.tempFilePath
      setDidShow(true)
      Taro.previewImage({
        current: res.tempFilePath,
        urls: [res.tempFilePath]
      })
    })
  }

  const previewImg = (fileList) => {
    if (!fileList?.length) return
    setDidShow(true)
    Taro.previewImage({
      current: fileList[0],
      urls: fileList
    })
  }

  const signbackHandle = () => {
    if (expressList[expressCrt]?.isCallback == '1') {
      let item = expressList[expressCrt]
      item.key = item.fileKey
      item.name = item.fileName
      GShareFileRef.current?.saveFile(item)
    } else {
      if (isMoreOrder()) {
        Taro.showModal({
          title: '',
          content: '该送货单包含多个订单，是否回签？',
          success: (res) => {
            if (res?.confirm) {
              console.log('用户点击确定')
              toPath(`/pages/reviewPdf/index?id=${expressList[expressCrt]?.deliveryId}&type=22&title=送货单&isReview=2`)
            } else if (res?.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        toPath(`/pages/reviewPdf/index?id=${expressList[expressCrt]?.deliveryId}&type=22&title=送货单&isReview=2`)
      }
    }
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
      saleOrderIdList: orderInfo?.id ? [orderInfo?.id] : [],
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
      <NavBar color={'#333'} title={'订单追踪'} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar>
      <View className='sale-head'>
        <View className='sale-company flex flex-center'>
          <Image src={orderInfo?.logoUrl}></Image>
          <View>{orderInfo?.ownerName}</View>
        </View>
        <View className='sale-qrcode'>
          {/* {isOp ? <View style={{position: 'absolute',top:'0',left:'0',width:'100%',height:'100%',background:'rgba(0, 0, 0, 0.3)'}}></View> : <></>} */}
          <Canvas canvasId='qrcodeId' style={`opacity: ${isOp ? '0.6' : '1'};width:100%;height:100%; zIndex:0;`} onClick={previewQr}></Canvas>
        </View>
      </View>

      <View className='sale-card'>
        <View className='sale-card-title'>订单信息</View>

        <View className='related-card-item'>
          <View className='related-card-label'>产品编码</View>
          <View className='related-card-value'>{isDesensitiz(orderInfo?.commodityCode)}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>产品名称</View>
          <View className='related-card-value'>{isDesensitiz(orderInfo?.commodityName)}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>客户PO号</View>
          <View className='related-card-value'>{isDesensitiz(orderInfo?.customerPo)}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>刷新时间</View>
          <View className='related-card-value flex flex-between'>
            <View>{sysTime}</View>
            <AtButton className='refresh-btn' type='primary' onClick={refreshHandle}>刷新</AtButton>
          </View>
        </View>
      </View>

      <View className='sale-card'>
        <View className='sale-card-title'>订单进度</View>
        <AtSteps
          items={items}
          current={current}
          // onChange={changeStep}
        />
      </View>

      <View className={`sale-card ${!isDesensitiz('', true) && 'p-bottom'} ${isShowProcess != '0' && list.length && !isDesensitiz('', true) && (!oneShow && 'height-overflow')}`}>
        <View className='sale-card-title'>生产进度</View>
        {
          isDesensitiz('', true) ? <>
            <View className='primary-color flex flex-center g-empty-desens w-100' onClick={openPhone}>验证后查看</View>
          </> : <>
            {isShowProcess != '0' ? 
              list.length ? <>
              <View className='sale-progress-text flex flex-start'>
                <View className='sale-progress-text-label'>进度:</View>
                <View className='sale-progress-text-value'>{progress == 0 ? '未开始' : progress == 100 ? '已完成' : '进行中'}</View>
              </View>

              <AtProgress percent={progress}/>

              <AtTimeline
                className='order-progress'
                items={list}
              ></AtTimeline>

              <View className='sale-card-expend flex flex-center' onClick={() => setOneShow(!oneShow)}>
                {!oneShow ? '展开' : '收起'}
                <AtIcon value={!oneShow ? 'chevron-down' : 'chevron-up'} size="16"></AtIcon>
              </View></> : <AtLoadMore status={'noMore'} noMoreText='暂无生产进度' />
            : <AtLoadMore status={'noMore'} noMoreText='暂无生产进度' />}
          </>
        }
      </View>

      {/* ${!!expressList?.length && !twoShow && 'height-overflow'} */}
      <View className={`sale-card `}>
        <View className='sale-card-title'>快递进度</View>
        {
          isDesensitiz('', true) ? <>
            <View className='primary-color flex flex-center g-empty-desens w-100' onClick={openPhone}>验证后查看</View>
          </> : <>
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
                        <View className={`sale-user-no ${expressList[expressCrt]?.fileUrls && 'primary-color'}`} onClick={() => previewImg(expressList[expressCrt]?.fileUrls)}>{expressList[expressCrt]?.logisticNum}</View>{expressList[expressCrt]?.logisticNum ? <View className='primary-copy' onClick={() => copyText(expressList[expressCrt]?.logisticNum)}></View> : <></>}
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
    
                  <View className='detail-back-content'>
                    <DetailBack rightText={expressList[expressCrt]?.isCallback == '1' ? '发送给好友' : '回签'} preview={() => toPath(`/pages/reviewPdf/index?id=${expressList[expressCrt]?.deliveryId}&type=22&title=送货单&isReview=1`)} signback={signbackHandle}></DetailBack>
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
          </>
        }
      </View>
      <GFeedback></GFeedback>
      <GShareFile ref={GShareFileRef}></GShareFile>
      <GPhoneCheck ref={GPhoneCheckRef} confirm={confirmPhone} openChange={(val) => setIsOp(val)}></GPhoneCheck>
    </View>
  )
}
