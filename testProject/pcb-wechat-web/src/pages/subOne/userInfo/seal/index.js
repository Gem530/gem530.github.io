import './index.less'
import { AtIcon, AtButton } from "taro-ui"
import { useRef, useState } from "react"
import { View, Image } from '@tarojs/components'
import GFeedback from '../../../../components/g-feedback'
import GRemoveBg from '../../../../components/g-remove-bg'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { editSignAPI, addSignAPI, getSignDetailAPI } from '../../../services/signMange'
import { getLocal, getImageInfo, getFileInfo, uploadFileByAl } from '../../../util/func'
import {
  // 采购合同
  confirmOrderFinishAPI,
  // 采购送货单
  materialDeliverySignAPI,
  // 采购退货单
  confirmMaterialBackFinishAPI,
  // 采购对账单
  accountOrderSignAPI, accountOrderSignV2API, addDeliveryAPI,
} from '../../../services/materialRequisition'
import {
    // 订单外协合同
    confirmOrderFinishOutsourceAPI,
    // 订单外协送货
    sourceFullProcessDeliverySignAPI,
    // 订单外协退货
    confirmOrderBackFinishAPI,
} from '../../../services/orderOutsource'
import {
    // 接单
    confirmFinishHalfProcessAPI,
    // 工序外协送货
    sourceHalfProcessDeliverySignAPI,
    // 工序外协接单批量
    batchConfirmFinishAPI,
    // 工序外协送货批量
    sourceHalfProcessDeliverySignBatchAPI,
} from '../../../services/processOutsource'
import {
  // pcb-送货单
  signAppAPI
} from '../../../services/saleContract'
import { receiveSignAPI} from "../../../services/outSource/receive";

export default function Seal() {
    const GRemoveBgRef = useRef()
    const [len, setLen] = useState(0)
    const [type, setType] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [isSave, setIsSave] = useState('0')
    const [orderId, setOrderId] = useState(0)
    const [address, setAddress] = useState('')
    const [fileInfo, setFileInfo] = useState()
    const [codeList, setCodeList] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showNotice, setShowNotice] = useState(true)
    const [info, setInfo] = useState({
        id: 0,
        url: ''
    })

    useShareAppMessage(() => {
        return {
            title: '新增印章',
            path: '/pages/index/index'
        }
    })
    useLoad((options) => {
        // type 1采购合同 2采购送货 3采购退货 4采购对账 5订单外协合同 6订单外协送货 7订单外协退货 8订单外协对账 9工序外协接单 10工序外协送货 11工序外协对账 91工序外协接单批量 101工序外协送货批量
        // console.log(options)
        setType(options?.type)
        setLen(options?.len || 0)
        setOrderId(options?.orderId || 0)
        setIsSave(options?.isSave || '1')
        if (options?.id) {
            // console.log(options?.id)
            getSignDetailAPI(options?.id).then((res) => {
                if (res.code == 200) {
                    setInfo(res.data)
                    setImgUrl(res.data.url)
                    // setInfo({
                    //     id: options?.id,
                    //     url:
                    //     // 'https://pcb-test.oss-cn-shenzhen.aliyuncs.com/000000/5e4371cdee384136b95d3352d5ed9fc5_%E7%AD%BE%E7%AB%A0.png?Expires=1716540246&OSSAccessKeyId=LTAI5tMisk8sS9jyXWbWKemu&Signature=qE6UXw8kmYD4lN5ad5b3fCWgk%2Fs%3D'
                    //     // 'https://pcb-test.oss-cn-shenzhen.aliyuncs.com/000000/01d282e3e86241d98707ae4fbd3825c5_%E7%AD%BE%E7%AB%A0.png?Expires=1716540453&OSSAccessKeyId=LTAI5tMisk8sS9jyXWbWKemu&Signature=9SIMbhPrw1mCkUNa1wcBSE4n8%2BU%3D'
                    //     // 'https://img-blog.csdnimg.cn/ed841fd460fc459d827432e7c0c11bc5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASmF2YeWKnemAgOW4iOOAgQ==,size_20,color_FFFFFF,t_70,g_se,x_16'
                    // })
                }
            })
        }
        console.time('localAddress')
        getLocal().then((res) => {
          console.log('getLocal----', res)
          setAddress(res?.wxMarkerData?.length ? res?.wxMarkerData[0]?.address : '')
          console.timeEnd('localAddress')
        })
    })
    useDidShow(() => {
        if (['91', '101'].includes(type + '')) {
            setCodeList(Taro.getStorageSync('codeList') || [])
        }
    })

    // 创建签章
    const addSign = (params) => {
        setLoading(true)
        addSignAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                Taro.navigateBack({ delta: 1 })
            }
        }).finally(() => { setLoading(false) })
    }

    // 创建签章
    const editSign = (params) => {
        params.state = undefined
        delete params.state
        setLoading(true)
        editSignAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                Taro.navigateBack({ delta: 1 })
            }
        }).finally(() => { setLoading(false) })
    }

    // 确定盖章
    const confirmAPI = (item) => {
        if (type == 1) {
            // 采购合同
            return confirmOrderFinishAPI(item)
        } else if (type == 2) {
            // 采购送货
            return materialDeliverySignAPI(item)
        } else if (type == 3) {
            // 采购退货
            item.code = item.id
            delete item.id
            return confirmMaterialBackFinishAPI(item)
        } else if (['4'].includes(type+'')) {
            // 对账
            return accountOrderSignV2API(item)
        } else if (['8', '11'].includes(type + '')) {
            // 对账
            return accountOrderSignAPI(item)
        } else if (type == 5) {
            // 订单外协合同
            return confirmOrderFinishOutsourceAPI(item)
        } else if (type == 6) {
            // 订单外协送货
            return sourceFullProcessDeliverySignAPI(item)
        } else if (type == 7) {
            // 订单外协退货
            item.code = item.id
            delete item.id
            return confirmOrderBackFinishAPI(item)
        } else if (type == 9) {
            // 工序外协接单
            item.code = item.id
            delete item.id
            return confirmFinishHalfProcessAPI(item)
        } else if (type == 10) {
            // 工序外协送货
            return sourceHalfProcessDeliverySignAPI(item)
        } else if (type == 91) {
            // 工序外协接单 批量
            // item.code = item.id
            item.codeList = codeList
            delete item.id
            return batchConfirmFinishAPI(item)
        } else if (type == 101) {
            // 工序外协送货 批量
            // item.code = item.id
            item.idList = codeList
            delete item.id
            return sourceHalfProcessDeliverySignBatchAPI(item)
        } else if (type == 22) {
            return signAppAPI(item)
        } else if (type == 20) {
          // 新增采购送货单
          let params = Taro.getStorageSync('__deliveryAdd__');
          params.imageKey = item.imageKey
          params.signType = item.signType
          params.flagSave = item.flagSave
          return addDeliveryAPI(params)
        } else if (type == 30) {
          item.bizId = item.id
          delete  item.id
          return receiveSignAPI(item);
        }
    }

    // 确定盖章
    const confirmOrderFinish = (item) => {
        let params = {
            id: orderId,
            signType: '1',
            fileAddress: address || '',
            imageKey: item.params.fileInfo.key,
            flagSave: item.choose == true ? 1 : 0, // 0 不保存 1 保存
        }
        // console.log(params)
        setLoading(true)
        confirmAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                // setOpen(false)
                // if (['1', '2', '3', '5', '6', '7', '9', '10'].includes(type + '')) {
                //     Taro.navigateBack({ delta: 3 })
                // } else if (['4'].includes(type + '')) {
                //     Taro.navigateBack({ delta: 2 })
                // } else {
                    Taro.setStorageSync('isRefresh', '1')
                    Taro.setStorageSync('confirmStatus', '3')
                    Taro.removeStorageSync('preview') // 点击签名时，返回预览页，需要刷新，所以清除这个属性
                    if(type == 20) {
                      Taro.navigateBack({ delta: 2 })
                      // 清除缓存
                      Taro.removeStorageSync('__deliveryAdd__')
                      Taro.showToast({ title: '操作成功', icon: 'success' })
                    } else if (type == 30){
                      Taro.navigateBack({ delta: 1 })
                      Taro.showToast({ title: '签名成功', icon: 'success' })
                      Taro.navigateTo({ url: `/pages/reviewPdf/index?id=${orderId}&type=30&title=发货单`});
                    } else {
                      Taro.navigateBack({ delta: 1 })
                      Taro.showToast({ title: '签名成功', icon: 'success' })
                    }
                // }
            }
        }).finally(() => { setLoading(false) })
    }

    // 保存图片
    const saveImg = (tempType = '') => {
        if (!fileInfo) {
            Taro.showToast({ title: '请上传印章', icon: 'error' })
            return
        }
        const item = fileInfo
        item.choose = tempType || undefined
        // console.log(item, tempType)

        if (tempType == 1) {
            // 之前逻辑是，从预览等页面进入就一定会签名，所以用type来判断是否来自预览等页面
            // 现在只有点击 保存并签名 按钮才会签名，所以判断需要改一下
            confirmOrderFinish(item)
        } else {
            let params = {
                id: info.id,
                signType: '1',
                state: Number(len) <= 0 ? 1 : 0,
                signName: info.signName || ('印章' + (Number(len || 0) + 1)),
                ...item.params.fileInfo
            }
            if (!params.id) {
                delete params.id
                // console.log(item, params)
                addSign(params)
            } else {
                editSign(params)
            }
        }
    }

    // 选择印章
    const chooseImg = async () => {
        try {
            const tempFilePaths = await GRemoveBgRef.current.chooseImg()
            Taro.showLoading({ mask: true })
            setImgUrl(tempFilePaths)
            // fileInfo setFileInfo

            // 获取文件大小
            let imgSize = await getFileInfo(tempFilePaths)
            // 获取图片信息
            let imgInfo = await getImageInfo(tempFilePaths)
            // console.log(imgSize, imgInfo)
            setLoading(true)
            const updateRes = await uploadFileByAl({
                type: imgInfo?.type,
                tmpUrl: tempFilePaths,
                size: imgSize?.size / 1024,
                fileName: '印章.' + imgInfo?.type,
            }).finally(() => { setLoading(false) })
            console.log('updateRes', updateRes)
            // updateRes.isSave = isSave
            // updateRes.choose = choose
            setFileInfo(updateRes)
            Taro.hideLoading()
            // console.log(tempFilePath)
        } catch(err) {
            console.log('err', err)
            if (err.errMsg != 'chooseImage:fail cancel') {
                Taro.showToast({title: '上传失败，请重试'})
            }
        }
    }

    // 图片预览
    const preivew = (e) => {
        // e.stopPropagation()
        // Taro.previewImage({
        //     current: imgUrl,
        //     urls: [imgUrl]
        // })
    }

    return (
        <View className="seal-page">
            {showNotice ? <View className='common-notice block m-b-20'>
                <View className='primary-white-info'></View>
                <View className='common-notice-text'>注意：请确保上传的印章图片与实体印章一致</View>
                <AtIcon className='expend-click' value='close' size='12' color='#fff' onClick={() => setShowNotice(false)}></AtIcon>
            </View> : <View style={'height: 20rpx;'}></View>}
            <View className='seal-card' onClick={chooseImg}>
                <View className={`seal-card-box flex flex-center flex-column ${imgUrl && 'bg-white'}`}>
                    {imgUrl ? <Image src={imgUrl} mode='aspectFit' onClick={preivew}></Image> : <>
                        <View className='primary-upload-plus'></View>
                        <View className='photo-text'>上传照片</View>
                    </>}
                </View>
                <View className='seal-card-bottom'>
                    <View className='seal-card-tip'>图片大小不超过5M</View>
                    <View className='seal-card-text'>请在白纸上印章后，拍照上传</View>
                </View>
            </View>
            {/* <GDraw initUrl={info?.url || ''} isSave={isSave} saveImg={saveImg} load={loading}></GDraw> */}
            <View className='common-bottom-button'>
                {type ? <>
                    <AtButton className='new gray-btn' loading={loading} disabled={loading} onClick={saveImg}>仅保存</AtButton>
                    <AtButton loading={loading} disabled={loading} type='primary' onClick={() => saveImg(1)}>保存并签章</AtButton>
                </> : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveImg}>保存</AtButton>}
            </View>
            <GRemoveBg ref={GRemoveBgRef}></GRemoveBg>
            {/* <GFeedback></GFeedback> */}
        </View>
    )
}
