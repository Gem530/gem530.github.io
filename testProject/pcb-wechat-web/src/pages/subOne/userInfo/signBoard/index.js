import './index.less'
import { useState } from "react"
import { AtButton } from "taro-ui"
import { getLocal } from '../../../util/func'
import { View, Image } from '@tarojs/components'
import GDraw from '../../../../components/g-draw'
// import GFeedback from '../../../../components/g-feedback'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { editSignAPI, addSignAPI, getSignDetailAPI } from '../../../services/signMange'
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
import {receivePreviewAPI, receiveSignAPI} from "../../../services/outSource/receive";

export default function SignBoard() {
    const [len, setLen] = useState(0)
    const [type, setType] = useState('')
    const [isSave, setIsSave] = useState('0')
    const [orderId, setOrderId] = useState(0)
    const [address, setAddress] = useState('')
    const [codeList, setCodeList] = useState(0)
    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState({
        id: 0,
        url: ''
    })

    useShareAppMessage(() => {
        return {
            title: '签章',
            path: '/pages/index/index'
        }
    })
    useLoad((options) => {
        // type 1采购合同 2采购送货 3采购退货 4采购对账 5订单外协合同 6订单外协送货 7订单外协退货 8订单外协对账 9工序外协接单 10工序外协送货 11工序外协对账 20新增送货 91工序外协接单批量 101工序外协送货批量
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

    // 确定签名
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

    // 确定签名
    const confirmOrderFinish = (item) => {
        let params = {
            id: orderId,
            signType: '2',
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
    const saveImg = (item) => {
        // console.log(type)

        if (item?.isTempSign) {
            // 按钮逻辑改变，根据点击按钮来控制是否签名
            confirmOrderFinish(item)
        } else {
            let params = {
                id: info.id,
                signType: '2',
                state: Number(len) <= 0 ? 1 : 0,
                signName: info.signName || ('签章' + (Number(len || 0) + 1)),
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

    return (
        <View className="sign-board-page">
            <GDraw initUrl={info?.url || ''} isSave={isSave} saveImg={saveImg} load={loading}></GDraw>
            {/* <GFeedback></GFeedback> */}
        </View>
    )
}
