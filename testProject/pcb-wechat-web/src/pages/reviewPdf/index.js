import './index.less'
import { getLocal } from '../util/func'
import { useRef, useState } from 'react'
import { getGlobalData } from "../../global"
import NavBar from '../../components/nav-bar'
import { AtButton, AtLoadMore } from "taro-ui"
// import { testAPI } from '../services/upload'
import { View, Image } from '@tarojs/components'
import GConfirm from '../../components/g-confirm'
import GSignPop from '../../components/g-sign-pop'
import { signListAPI } from '../services/signMange'
import GFeedback from '../../components/g-feedback'
import GShareFile from '../../components/g-share-file'
import Taro, { useLoad, useUnload, useDidShow, useShareAppMessage } from '@tarojs/taro'
import {
  // 采购合同
  previewSignatureAPI, confirmOrderFinishAPI,
  // 采购送货单
  previewDeliverySignatureAPI, materialDeliverySignAPI,
  // 采购退货单
  previewSignatureBackAPI, confirmMaterialBackFinishAPI,
  // 对账单
  previewSignatureStatementAPI, accountOrderSignAPI, accountOrderSignV2API, cancelAccountAPI, supConfirmAPI, queryUseModuleAPI
} from '../services/materialRequisition'
import {
  // 订单外协合同
  previewSignatureOutsourceAPI, confirmOrderFinishOutsourceAPI,
  // 订单外协送货
  sourceFullProcessDeliveryPreviewAPI, sourceFullProcessDeliverySignAPI,
  // 订单外协退货
  previewSignatureProcessBackAPI, confirmOrderBackFinishAPI,
} from '../services/orderOutsource'
import {
  // 接单
  previewSignatureHalfProcessAPI, confirmFinishHalfProcessAPI,
  // 工序外协送货
  sourceHalfProcessDeliveryPreviewAPI, sourceHalfProcessDeliverySignAPI,
} from '../services/processOutsource'
import {
  // pcb-送货单
  previewSignaturePcbAPI, signAppAPI
} from '../services/saleContract'
import {receivePreviewAPI, receiveSignAPI} from "../services/outSource/receive";


export default function ReviewPdf() {
  // 邮箱信息
  const initEmail = {
      email: '',
      open: false,
      title: '发送邮箱',
  }
  const GConfirmRef = useRef()
  const GShareFileRef = useRef()
  const [id, setId] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState('')
  const [imgs, setImgs] = useState([])
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState()
  const [userInfo, setUserInfo] = useState()
  const [address, setAddress] = useState('')
  const [isReview, setIsReview] = useState('')
  const [orderInfo, setOrderInfo] = useState()
  const [loading, setLoading] = useState(false)
  const [defaultSign, setDefaultSign] = useState()
  const [emailInfo, setEmailInfo] = useState(initEmail)
  const [viewLoading, setViewLoading] = useState('loading')
  useLoad((options) => {
    setOptions(options)
    // console.log(options)
    let { id, type, code, title, isReview } = options
    // type 1采购合同 2采购送货 3采购退货 4采购对账 5订单外协合同 6订单外协送货 7订单外协退货 8订单外协对账 9工序外协接单 10工序外协送货 11工序外协对账
    let tempTitle = title + '预览'
    setId(id)
    setCode(code)
    setType(type)
    const statementReviewTemp = Taro.getStorageSync('__Statement__')
    setTitle(statementReviewTemp == '1' ? '单据预览' : (['4','8','11'].includes(type+'') && !title ? '对账单预览' : tempTitle))
    setIsReview(isReview) // isReview 1预览 2确定
    // Taro.setNavigationBarTitle({ title: tempTitle })
    // getDetail(id, type).then(async (res) => {
    //   console.log(res)
    //   if (res.data?.confirmStatus) {
    //     res.data.status = res.data.confirmStatus
    //   }
    //   setOrderInfo(res.data)
    //   let tempList = []
    //   let tempImages = res.data?.images
    //   if (tempImages?.length) {
    //     for (let i = 0; i < tempImages.length; i++) {
    //       try {
    //         let item = tempImages[i]
    //         // 二进制图片 转为 临时地址，用于预览
    //         const tempCrt = await creatTempPath(item, i)

    //         // 得到图片的宽高，拍照时设备方向
    //         const size = await Taro.getImageInfo({src: tempCrt})
    //         const windowWidth = getGlobalData('windowWidth')
    //         // 得到图片宽度与手机宽度的比例，用于计算 预览的图片高度
    //         let rotate = windowWidth / size.width

    //         tempList.push({
    //           url: tempCrt,
    //           width: windowWidth,
    //           height: rotate * size.height,
    //         })
    //       } catch (err) {
    //         // 报错的就展示空
    //         tempList.push('')
    //         console.log('err---', err)
    //       }
    //     }
    //   }
    //   setImgs(tempList)
    // })
    console.time('localAddress')
    getLocal().then((res) => {
      console.log('getLocal----', res)
      setAddress(res?.wxMarkerData?.length ? res?.wxMarkerData[0]?.address : '')
      console.timeEnd('localAddress')
    })
  })
  useUnload(() => {
    // console.log('useUnload', '页面卸载')
    Taro.removeStorageSync('preview')
  })
  useDidShow(() => {
    let userTempInfo = Taro.getStorageSync('__USER_INFO__');
    setUserInfo(userTempInfo)
    const previewFlag = Taro.getStorageSync('preview')
    Taro.removeStorageSync('preview')
    if (previewFlag && previewFlag == '1') return
    setImgs([])
    setOrderInfo()
    if (type == '4') {
      queryUseModule()
    }
    if (id && type) {
      setOpen(false)
      setViewLoading('loading')
      getDetailHandle(id, type)
    }
  })
  useShareAppMessage(() => {
    return {
      title: title,
      path: '/pages/index/index'
    }
  })
  // 获取采购对账单是否设置默认签章
  const queryUseModule = () => {
    queryUseModuleAPI({useModule: '4'}).then((res) => {
      if (res.code == 200) {
        setDefaultSign(res.data)
      }
    })
  }
  // 获取详情
  const getDetailHandle = (id, type) => {
    getDetail(id, type).then(async (res) => {
      console.log('打印状态', res, res.data?.confirmStatus)
      // if (res.data?.confirmStatus) {
      //   res.data.status = res.data.confirmStatus
      // }
      setOrderInfo(res.data)
      let isUrl = false
      let tempList = []
      let tempImages = []
      if (res.data?.imageUrls?.length) {
        isUrl = true
        tempImages = res.data?.imageUrls || []
      } else {
        isUrl = false
        tempImages = res.data?.images || []
      }
      if (tempImages?.length) {
        for (let i = 0; i < tempImages.length; i++) {
          try {
            let item = tempImages[i]
            let tempCrt = item
            if (!isUrl) {
              // 二进制图片 转为 临时地址，用于预览
              tempCrt = await creatTempPath(item, i)
            }

            // 得到图片的宽高，拍照时设备方向
            const size = await Taro.getImageInfo({src: tempCrt})
            const windowWidth = getGlobalData('windowWidth')
            // 得到图片宽度与手机宽度的比例，用于计算 预览的图片高度
            let rotate = windowWidth / size.width

            console.log(tempCrt)
            tempList.push({
              url: tempCrt,
              width: windowWidth,
              height: rotate * size.height,
            })
          } catch (err) {
            // 报错的就展示空
            tempList.push('')
            console.log('err---', err)
          }
        }
      }
      setImgs(tempList)
    }).finally(() => setViewLoading('noMore'))
  }
  // 修改数据
  const updateData = (arr, tempType = 'email') => {
      // arr = [{ value: '1212', field: 'number' }]
      // console.log(arr)
      if (!arr?.length) return
      if(tempType == 'email') {
          let tempDialog = JSON.parse(JSON.stringify(emailInfo))
          arr.map((item, index) => {
              // console.log(item)
              tempDialog[item.field] = item.value
          })
          // console.log(tempDialog)
          setEmailInfo(tempDialog)
      }
  }
  // 获取临时文件
  const creatTempPath = (binary, index, name = 'tempName') => {
    return new Promise((resolve, reject) => {
      // 文件名不能相同，相同会出现缓存，只返回最开始的图片
      let tempUrl = Taro.env.USER_DATA_PATH + `/temp_image_${name}_${index}_${Math.random()}.png`
      Taro.getFileSystemManager().writeFile({
        data: binary,
        filePath: tempUrl, // 临时文件路径
        encoding: 'base64',
        success: (res) => {
          // console.log(res)
          resolve(tempUrl)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  // 获取详情
  const getDetail = (id, tempType) => {
    if (tempType == 1) {
      // 采购合同
      return previewSignatureAPI(id)
    } else if (tempType == 2) {
      // 采购 送货
      return previewDeliverySignatureAPI(id)
    } else if (tempType == 3) {
      // 采购 退货
      return previewSignatureBackAPI(id)
    } else if (['4','8','11'].includes(tempType+'')) {
      // 对账
      return previewSignatureStatementAPI(id)
    } else if (tempType == 5) {
      // 订单外协 合同
      return previewSignatureOutsourceAPI(id)
    } else if (tempType == 6) {
      // 订单外协 送货
      return sourceFullProcessDeliveryPreviewAPI(id)
    } else if (tempType == 7) {
      // 订单外协 退货
      return previewSignatureProcessBackAPI(id)
    } else if (tempType == 9) {
      // 工序外协 接单
      return previewSignatureHalfProcessAPI(id)
    } else if (tempType == 10) {
      // 工序外协 送货
      return sourceHalfProcessDeliveryPreviewAPI(id)
    } else if (tempType == 22) {
      return previewSignaturePcbAPI(id)
    } else if (tempType == 30) {
      return receivePreviewAPI(id)
    }
  }

  // 图片预览
  const previewImage = (i) => {
    Taro.setStorageSync('preview', '1')
    const urlArr = imgs.map((item) => item.url)
    // console.log(i, urlArr)
    Taro.previewImage({
      current: urlArr[i],
      urls: urlArr
    })
  }

  // 打开签名弹框
  const openSign = async () => {
    if (type == 4) {
      if (orderInfo?.status == '9') {
        // 采购对账单
        // 1、普通对账： 1）供应商侧不展示该按钮  2）客户侧显示该按钮，点击可进行签章
        // 2、协同对账： 1）供应商侧展示该按钮，点击可进行签章  2）客户侧展示该按钮，点击提示“该账单为协同账单，请联系供应商进账单的核对与确认”
        const res = await GConfirmRef.current.openConfirm({
          title: '提示',
          type: 'tooltip',
          showCancelBtn: false,
          confirmText: '我知道了',
          content: '当前账单正在进行数据调整，需要等待调整完成后才能进行签章确认',
        })
        // console.log(res)
        return;
      }
      if (options?.supplierSwitch == '1' && userInfo?.user?.ownerId == options?.ownerId) {
        // 采购对账单
        // 1、普通对账： 1）供应商侧不展示该按钮  2）客户侧显示该按钮，点击可进行签章
        // 2、协同对账： 1）供应商侧展示该按钮，点击可进行签章  2）客户侧展示该按钮，点击提示“该账单为协同账单，请联系供应商进账单的核对与确认”
        const res = await GConfirmRef.current.openConfirm({
          title: '提示',
          type: 'tooltip',
          showCancelBtn: false,
          confirmText: '我知道了',
          content: '该账单为协同账单，请联系供应商进账单的核对与确认',
        })
        // console.log(res)
        return;
      }
      if (defaultSign?.key) {
        // 如果默认值有key，说明设置了默认签章，直接签名，不再选择签章
        confirmOrderFinish(defaultSign)
        return;
      }
    }
    setOpen(true)
    // Taro.showLoading({mask: true})
    // signListAPI().then((res) => {
    //   if (res.code == 200) {
    //     setList(res.data || [])
    //   }
    // }).finally(() => Taro.hideLoading())
  }

  // 确认对账单
  const confirmStatement = () => {
    Taro.showLoading({mask: true})
    supConfirmAPI({id}).then((res) => {
      if (res.code == 200) {
        Taro.hideLoading()
        if (options?.companyId || (options?.isRedirect == '1')) {
            Taro.redirectTo({ url: '/pages/home/home' })
        } else {
            Taro.navigateBack({ delta: 1 })
        }
      }
    })
  }

  // 选择签名
  const onChoose = (item) => {
    // console.log(item)
    confirmOrderFinish(item)
  }

  // 跳转去签名页
  const toSign = () => {
    // Taro.removeStorageSync('preview') // 换到签章页，点击签名时再清除，这样再返回来就可以显示签名弹框
    Taro.setStorageSync('preview', '1')
  }

  // 确定签名
  const confirmAPI = (item) => {
    if (type == 1) {
      // 采购 合同
      return confirmOrderFinishAPI(item)
    } else if (type == 2) {
      // 采购 送货
      return materialDeliverySignAPI(item)
    } else if (type == 3) {
      // 采购 退货
      delete item.id
      item.code = code
      return confirmMaterialBackFinishAPI(item)
    } else if (['4'].includes(type+'')) {
      // 对账
      return accountOrderSignV2API(item)
    } else if (['8','11'].includes(type+'')) {
      // 对账
      return accountOrderSignAPI(item)
    } else if (type == 5) {
      // 订单外协 合同
      return confirmOrderFinishOutsourceAPI(item)
    } else if (type == 6) {
      // 订单外协 送货
      return sourceFullProcessDeliverySignAPI(item)
    } else if (type == 7) {
      // 订单外协 退货
      delete item.id
      item.code = code
      return confirmOrderBackFinishAPI(item)
    } else if (type == 9) {
      // 工序外协 接单
      delete item.id
      item.code = code
      return confirmFinishHalfProcessAPI(item)
    } else if (type == 10) {
      // 工序外协 送货
      return sourceHalfProcessDeliverySignAPI(item)
    } else if (type == 22) {
      return signAppAPI(item)
    } else if (type == 30) {
      return receiveSignAPI(item)
    }
  }

  // 保存文件
  const saveFile = async () => {
    let item = orderInfo
    // item.key = item.fileKey
    // item.name = item.fileName
    GShareFileRef.current?.saveFile(item)
  }

  // 确定签名
  const confirmOrderFinish = (item) => {
    let params = {
      id,
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
          getDetailHandle(id, type)
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

  // 取消/确认结单
  const finishOrder = (tempType) => {
      GConfirmRef.current.openConfirm({content: tempType == 6 ? '是否确认驳回此单据？' : '是否确认取消此单据？'}).then(() => {
          let params = {
              id: id,
              confirmStatus: tempType,
          }
          setLoading(true)
          cancelAccountAPI(params).then((res) => {
              if (res.code == 200) {
                  if (options?.companyId || (options?.isRedirect == '1')) {
                      Taro.redirectTo({ url: '/pages/home/home' })
                  } else {
                      Taro.navigateBack({ delta: 1 })
                  }
                  Taro.setStorageSync('isRefresh', '1')
                  Taro.showToast({ title: tempType == 6 ? '驳回成功' : '结单成功' })
              }
          }).finally(() => setLoading(false))
      })
  }
  return (
    <View className='pdf-page'>
      <NavBar color={'#333'} title={title} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
      {
        imgs?.length ? imgs.map((item, index) => {
          return (
            <View style={`width: ${item.width}px;height: ${item.height}px;`} onClick={() => previewImage(index)}>
              <Image src={item.url} style={`width: 100%;height: 100%;`}></Image>
            </View>
          )
        }) : <AtLoadMore status={viewLoading} noMoreText="暂无数据"></AtLoadMore>
      }

      { // 不是预览，并且有状态，不是22(回签)
      isReview != 1 && !!orderInfo?.confirmStatus && !['4','22'].includes(type+'') && <>
        {
          // 4采购对账单并且状态为5，确认状态不为3(已完成)
          (orderInfo?.confirmStatus != 3 && (['4'].includes(type) && orderInfo?.status == 5)) ?
          ((!['4'].includes(type) || orderInfo?.isCanModify) && <View className='common-bottom-btn'>
            <AtButton className='error' loading={loading} disabled={loading} onClick={() => finishOrder('6')}>驳回</AtButton>
            <AtButton loading={loading} disabled={loading} type='primary' onClick={() => finishOrder('3')}>确认取消</AtButton>
          </View>) :
          <>{
            // 已完成
            orderInfo?.confirmStatus == 3 ?
            <View className='common-bottom-btn'>
              <AtButton onClick={() => saveFile()}>发送给好友</AtButton>
              {/*  onClick={openSign} */}
            </View> :
            (
              // 不是对账单
              !['4', '8', '11'].includes(type) && ['1','2'].includes(orderInfo?.confirmStatus+'') ?
              <View className='common-bottom-button'>
                <AtButton type='primary' className='full' onClick={openSign}>去签名</AtButton>
              </View>
              : (
                // 是否可以修改
                  orderInfo?.isCanModify ?
                  // 是否可以确认
                    (orderInfo?.isConfirm ?
                    <View className='common-bottom-btn'>
                      <AtButton type='primary' onClick={confirmStatement}>确认</AtButton>
                    </View> :
                    <View className='common-bottom-btn'>
                      <AtButton type='primary' onClick={openSign}>去签名</AtButton>
                    </View>)
                  : <></>
                )
            )
          }</>
        }
      </>}
      {
        // 采购对账
        isReview != 1 && type == 4 && orderInfo?.status ?
          // 1、普通对账： 1）供应商侧不展示该按钮  2）客户侧显示该按钮，点击可进行签章
          // 2、协同对账： 1）供应商侧展示该按钮，点击可进行签章  2）客户侧展示该按钮，点击提示“该账单为协同账单，请联系供应商进账单的核对与确认”
          // 1协同对账 0普通对账
          // 已完成对账 不显示按钮
          (options?.supplierSwitch == '0' && userInfo?.user?.ownerId != options?.ownerId) || orderInfo?.status == '2' ?
            <View className='common-bottom-btn'>
                <AtButton onClick={() => saveFile()}>发送给好友</AtButton>
            </View> :
            <View className='common-bottom-btn'>
            <AtButton type='primary' onClick={openSign}>去签名(盖章)</AtButton>
          </View>
        : <></>
      }
      {
        // 回签
        isReview != 1 && type == 22 ?
          orderInfo?.isCallback == '1' ?
          <View className='common-bottom-btn'>
              <AtButton onClick={() => saveFile()}>发送给好友</AtButton>
          </View> : <View className='common-bottom-btn'>
            <AtButton type='primary' onClick={openSign}>回签</AtButton>
          </View>
         : <></>
      }

      <GConfirm ref={GConfirmRef}></GConfirm>
      {/* 邮箱发送 */}
      <GShareFile ref={GShareFileRef}></GShareFile>

      <GSignPop open={open} type={type} id={['3','7','9'].includes(type+'') ? code : id} onClose={() => setOpen(false)} onChoose={onChoose} toSign={toSign}></GSignPop>

      <GFeedback></GFeedback>
    </View>
  )
}
