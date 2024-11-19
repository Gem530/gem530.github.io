import './index.less'
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { useRef, useState } from 'react'
import GStep from '../../../../../components/g-step'
import NavBar from '../../../../../components/nav-bar'
import GOperat from '../../../../../components/g-operat'
import GConfirm from '../../../../../components/g-confirm'
import { View, Picker, ScrollView } from '@tarojs/components'
import GShareFile from '../../../../../components/g-share-file'
import DetailUpload from '../../../../../components/detail-upload'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { validEmail, downloadImg, downloadFileByKeys } from '../../../../util/func'
import { AtTabs, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import { confirmMaterialBackAPI, accountOrderDetialAPI, materialBackDetailCompareListAPI } from '../../../../services/materialRequisition/index'
import GFeedback from '../../../../../components/g-feedback'

export default function ProcurementSignatureStatementAccountDetail() {
    // 弹框信息
    const initDialog = {
        id: 0,
        price: '',
        params: '',
        open: false,
        quantity: '',
        confirmRemark: '',
        title: '修改数据',
    }
    const initRecord = {
        list: [],
        open: false,
        title: '修改数据',
    }
    const tagList = [
        { id: '0', name: '全部' },
        { id: '1', name: '未对账' },
        { id: '9', name: '调整中' },
        { id: '2', name: '对账完成' },
    ]
    const GConfirmRef = useRef()
    const GShareFileRef = useRef()
    // 不参与页面交互的数据，可以直接定义，不需要使用useState
    const [list, setList] = useState([])
    const [status, setStatus] = useState('')
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [userInfo, setUserInfo] = useState()
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    useLoad((options) => {
        setOptions(options)
        setStatus(options?.status)
    })
    useDidShow(() => {
        let userTempInfo = Taro.getStorageSync('__USER_INFO__');
        setUserInfo(userTempInfo)
        const detailData = Taro.getStorageSync('detailData')
        if (detailData?.orderInfo) {
            setList(detailData?.list || [])
            setOrderInfo(detailData.orderInfo)
            setRemark(detailData?.remark || '')
        } else if (options?.id) {
            getMaterialOrderDetail(options?.id)
        }
    })
    useShareAppMessage(() => {
        return {
          title: '采购对账详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val, tempType) => {
        setLoading(true)
        accountOrderDetialAPI(val || options?.id).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                setOrderInfo(res.data)
                // console.log('res1', res.data)
                setList(res.data?.detailVoList || [])
                // setRemark(res.data?.confirmRemark || '')
            }
        }).finally(() => { setLoading(false) })
    }

    // 修改数据
    const updateData = (arr, tempType = 'dialog') => {
        // arr = [{ value: '1212', field: 'number' }]
        // console.log(arr)
        if (!arr?.length) return
        if (tempType == 'dialog') {
            let tempDialog = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                // console.log(item)
                if (['price','quantity'].includes(item.field)) {
                    if (item.value?.length >= 2) {
                        let crtEmpty = item.value.indexOf('0')
                        let crtI = item.value.indexOf('.')
                        if (crtEmpty == 0 && crtI != 1) {
                            item.value = item.value.substring(1)
                        } else if (crtI != -1) {
                            item.value = item.value.substring(0, crtI + 5)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                if (['quantity'].includes(item.field)) {
                    item.value = item.value.toString().replaceAll(/\./g, '')
                }
                if (['confirmRemark'].includes(item.field)) {
                    item.value = item.value.substring(0, 200)
                }
                tempDialog[item.field] = item.value
            })
            // console.log(tempDialog)
            setDialogInfo(tempDialog)
        } else if(tempType == 'record') {
            let tempDialog = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                // console.log(item)
                tempDialog[item.field] = item.value
            })
            // console.log(tempDialog)
            setRecordInfo(tempDialog)
        }
    }

    // 校验修改数据
    const checkList = () => {
        let res = ''
        if (!dialogInfo.quantity || dialogInfo.quantity == 0) {
            res = dialogInfo.quantity == 0 ? '退货数量必须输入大于0的数' : '请填写退货数量'
        } else if (dialogInfo.quantity > Number(dialogInfo.params.rawMaterialInvontoryQuantity)) {
            res = '退货数量不可大于' + Number(dialogInfo.params.rawMaterialInvontoryQuantity)
        } else if (!dialogInfo.price || dialogInfo.price == 0) {
            res = dialogInfo.price == 0 ? '退货单价必须输入大于0的数' : '请填写退货单价'
        }
        return res
    }
    // 确定修改
    const confirmHandle = () => {
        // console.log(dialogInfo)
        const errMsg = checkList()
        if (errMsg) {
            Taro.showToast({ title: errMsg, icon: 'none' })
            return
        }
        // for (let key in dialogInfo) {}
        let arr = [
            { value: dialogInfo.price, field: 'price' },
            { value: dialogInfo.quantity, field: 'quantity' },
            { value: dialogInfo.confirmRemark || '', field: 'confirmRemark' },
        ]
        updateList(arr, {value: dialogInfo.id,field: 'id'}, 'list')
        updateData([{ value: false, field: 'open' }])
    }

    // 提示是否修改 校验弹框
    const materialBackDetailCompareList = (params) => {
        return new Promise((resolve, reject) => {
            materialBackDetailCompareListAPI(params).then((res) => {
                if (res.code == 200) {
                    if (res.data == true) {
                        // 出参返回true表示有修改，需提示然后调用之前确认修改接口
                        GConfirmRef.current.openConfirm({content: '您已修改单据信息，需要对方再次确认，是否确认修改？'}).then(() => resolve(true)).catch(() => reject(false))
                    } else {
                        // 如果返回false表示没有修改，直接调用之前最终确认接口
                        resolve(true)
                    }
                } else {
                    reject(false)
                }
            }).catch(() => reject(false))
        })
    }
    // 确定合同
    const confirmOrder = async () => {
        // // console.log(list, remark, orderInfo)
        // // let params = JSON.parse(JSON.stringify(orderInfo))
        // // // params.confirmRemark = remark
        // // params.orderDetailBoList = list
        // // params.orderDetailVoList = undefined
        // // delete params.orderDetailVoList

        // // let params = {
        // //     purchaseList: list
        // // }
        // setLoading(true)
        // const checkRes = await materialBackDetailCompareList(list).catch(() => setLoading(false))
        // // console.log(checkRes)
        // if (!checkRes) return
        // confirmMaterialBackAPI(list).then((res) => {
        //     if (res.code == 200) {
        //         // console.log(res)
        //         if (res.data == true) {
        //             toPath(`/pages/reviewPdf/index?id=${list[0]?.id}&type=3&title=退货单&isReview=2&code=${options?.id}`)
        //             Taro.removeStorageSync('detailData')
        //         } else {
        //             if (options?.companyId || (options?.isRedirect == '1')) {
        //                 Taro.redirectTo({ url: '/pages/home/home' })
        //             } else {
        //                 Taro.navigateBack({ delta: 1 })
        //             }
        //             Taro.setStorageSync('isRefresh', '1')
        //             Taro.showToast({ title: '编辑成功', icon: 'success' })
        //         }
        //     }
        // }).finally(() => { setLoading(false) })
    }

    // 跳转
    const toPath = (url) => {
        Taro.navigateTo({ url })
    }

    // 复制功能
    const copyText = (e, text) => {
        e.stopPropagation()
        if (!text) return;
        Taro.setClipboardData({
            data: text,
            success () {
                Taro.showToast({ title: '复制成功', icon: 'success', duration: 1500 })
            }
        })
    }

    // 金额提示
    const accountPriceTip = () => {
        GConfirmRef.current.openConfirm({
            title: '提示',
            content: '账单金额=送货金额-退货金额-扣款金额',
            type: 'tooltip',
            showCancelBtn: false,
            confirmText: '我知道了',
        })
    }

    // 账单有误
    const accountErroTip = () => {
        GConfirmRef.current.openConfirm({
            title: '提示',
            content: <View>
                <View className='f-s-32 font-weight-4 m-b-16'>发现该对账单有误怎么办?</View>
                <View className='f-s-32 font-weight-6' style={'line-height:44rpx;'}>1、联系客户方对账人员，进行账单调整；</View>
                <View className='f-s-32 font-weight-6' style={'line-height:44rpx;'}>2、或自行登录电脑系统后，提交修改申请。</View>
            </View>,
            type: 'tooltip',
            showCancelBtn: false,
            confirmText: '我知道了',
        })
    }

    // 保存页面修改数据
    const saveTempData = () => {
        Taro.setStorageSync('detailData', { list, remark, orderInfo })
    }
    // 预览
    const previewHandle = (url) => {
        saveTempData()
        toPath(url)
    }
    return (
        <View className='statement-detail'>
            <NavBar color={'#333'} title={'采购对账详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>

            <View className='statement-top flex flex-center'>
                <View className={`${
                orderInfo?.accountStatus == 1 ? 'primary-account-wait' : 
                orderInfo?.accountStatus == 9 ? 'primary-account-doing' : 
                orderInfo?.accountStatus == 2 ? 'primary-account-finish' : 'primary-account-wait'
                }`}></View>
                <View className='statement-top-title'>{tagList.find((f) => f.id == orderInfo?.accountStatus)?.name}</View>
            </View>

            <View className='common-card new'>
                <View className='common-item new'>
                    <View className='common-title mini flex flex-start'>
                        <View className='primary-inventory-base'></View>
                        <View style={'margin-left: 8rpx;flex: 1;'}>基础信息</View>
                    </View>
                </View>

                <View className='common-item new'>
                    <View className='common-item-label'>对账单号</View>
                    <View className='common-item-value primary-color flex flex-start' onClick={(e) => copyText(e, orderInfo?.code)}>{orderInfo?.code}
                        <View className='primary-copy-blue m-l-8'></View>
                    </View>
                </View>

                <View className='common-item new'>
                    <View className='common-item-label'>对账方式</View>
                    <View className='common-item-value'>{orderInfo?.supplierSwitch == '1' ? '协同对账' : '普通对账'}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>是否含税</View>
                    <View className='common-item-value'>{orderInfo?.isTax == '1' ? '含税' : '不含税'}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>供方</View>
                    <View className='common-item-value'>{orderInfo?.supplierName}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>需方</View>
                    <View className='common-item-value'>{orderInfo?.ownerName}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>出账日</View>
                    <View className='common-item-value'>{orderInfo?.accountDay}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>账单周期</View>
                    <View className='common-item-value'>{orderInfo?.accountPeriod}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>对账月份</View>
                    <View className='common-item-value'>{orderInfo?.accountMonth}</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>账单金额</View>
                    <View className='common-item-value flex flex-start'>{orderInfo?.payPayablePrice || 0}元
                        <View className='primary-question-gray m-l-8 expend-click' onClick={accountPriceTip}></View>
                    </View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>送货金额</View>
                    <View className='common-item-value'>{orderInfo?.accountPrice || 0}元</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>退货金额</View>
                    <View className='common-item-value'>{orderInfo?.backPrice || 0}元</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>扣款金额</View>
                    <View className='common-item-value'>{orderInfo?.otherPrice || 0}元</View>
                </View>
                <View className='common-item new'>
                    <View className='common-item-label'>折扣金额</View>
                    <View className='common-item-value'>{orderInfo?.accountDiscountPrice || 0}元</View>
                </View>
            </View>
            <View className='max-data-length-100' style={'width: 500rpx;'}>账单明细请前往电脑端系统查看</View>

            <View className='common-bottom-button'>
                {/* <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${list[0]?.id}&type=3&title=退货单&isReview=1&code=${code}`)}>预览退货单</AtButton>
                {orderInfo?.confirmStatus != 3 ? (orderInfo?.isCanModify && <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确认退货单</AtButton>) : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>} */}
                {userInfo?.user?.ownerId != orderInfo?.ownerId && orderInfo ? <View className='primary-color f-s-28' onClick={accountErroTip}>发现账单有误？</View> : <></>}
                <View className='flex-grow'></View>
                <AtButton className='new gray-btn' loading={loading} disabled={loading} onClick={() => toPath(`/pages/subOne/procurementSignature/statementAccount/record/index?id=${options?.id}`)}>调整记录</AtButton>
                <AtButton loading={loading} disabled={loading} type='primary' onClick={() => Taro.navigateTo({ url: `/pages/reviewPdf/index?id=${options?.id}&type=4&title=对账单&isReview=2&code=''&supplierSwitch=${orderInfo?.supplierSwitch}&ownerId=${orderInfo?.ownerId}` })}>账单确认</AtButton>
            </View>

            <GConfirm ref={GConfirmRef}></GConfirm>
            <GFeedback></GFeedback>
        </View>
    )
}