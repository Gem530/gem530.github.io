import './index.less'
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { useRef, useState, useEffect } from 'react'
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
import { cancelOrderAPI, confirmOrderAppAPI, queryOperateRecordListAPI, getMaterialOrderDetailAPI, materialOrderCompareListAPI } from '../../../../services/materialRequisition/index'
import GFeedback from '../../../../../components/g-feedback'

// 同一个页面有多个atmodel时，未打卡时需要消除，否则会出现atinput点击不中
export default function ProcurementSignatureContractDetail() {
    const operatRef = useRef(null)
    const taxList = [{ id: '0', name: '否' }, { id: '1', name: '是' }]
    // 弹框信息
    const initDialog = {
        id: 0,
        price: '',
        isTax: '',
        open: false,
        quantity: '',
        isTaxText: '',
        deliverTime: '',
        title: '修改数据',
        monthlyMethod: '',
        // monthlyMethodText: '',
    }
    const initRecord = {
        list: [],
        open: false,
        title: '修改数据',
    }
    // // 邮箱信息
    // const initEmail = {
    //     email: '',
    //     open: false,
    //     title: '发送邮箱',
    // }
    const GConfirmRef = useRef()
    const GShareFileRef = useRef()
    // 不参与页面交互的数据，可以直接定义，不需要使用useState
    const [id, setId] = useState('')
    const [list, setList] = useState([])
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    // const [emailInfo, setEmailInfo] = useState(initEmail)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [monthMethodList, setMonthMethodList] = useState([])
    useLoad((options) => {
        // console.log('options:', options)
        setOptions(options)
        if (options?.id) {
            setId(options?.id)
            // getMaterialOrderDetail(options?.id)
        }
    })
    useDidShow(() => {
        const detailData = Taro.getStorageSync('detailData')
        if (detailData?.orderInfo) {
            setList(detailData?.list || [])
            setOrderInfo(detailData.orderInfo)
            setRemark(detailData?.remark || '')
            setMonthMethodList(detailData?.monthMethodList || [])
        } else if (id) {
            getMaterialOrderDetail(id)
        }
    })
    useShareAppMessage(() => {
        return {
          title: orderInfo?.status == 8 ? '单据详情' : '采购合同详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val) => {
        setLoading(true)
        getMaterialOrderDetailAPI({ id: val || id }).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                setOrderInfo(res.data)
                setRemark(res.data?.confirmRemark || '')
                res.data?.orderDetailVoList?.length && res.data?.orderDetailVoList.map((m) => {
                    m.isTaxText = taxList.find((f) => f.id == m?.isTax)?.name
                    m.isTaxText = taxList.find((f) => f.id == m?.isTax)?.name
                })
                setList(res.data?.orderDetailVoList || [])
                setMonthMethodList(res.data?.monthlyMethodList || [])
            }
        }).finally(() => { setLoading(false) })
    }

    // 备注修改
    const changeRemark = (e) => {
        e = e.substring(0, 200)
        // console.log(e)
        setRemark(e)
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
                            item.value = item.value.substring(0, crtI + (['quantity'].includes(item.field) ? 3 : 5))
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                    // if (['quantity'].includes(item.field)) {
                    //     item.value = item.value.toString().replaceAll(/\./g, '')
                    // }
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
        //  else if(tempType == 'email') {
        //     let tempDialog = JSON.parse(JSON.stringify(emailInfo))
        //     arr.map((item, index) => {
        //         // console.log(item)
        //         tempDialog[item.field] = item.value
        //     })
        //     // console.log(tempDialog)
        //     setEmailInfo(tempDialog)
        // }
    }

    // 修改数组数据
    const updateList = (arr, param = {value: 0, field: 'id'}, tempType = 'list') => {
        if (!arr?.length) return
        if (tempType == 'list') {
            let tempList = JSON.parse(JSON.stringify(list))
            let crtTemp = tempList.find((f) => f[param.field] == param.value)
            arr.map((item, index) => {
                crtTemp[item.field] = item.value
            })
            // 改变数量后，重新计算总价
            crtTemp.totalPrice = Decimal(Number(crtTemp?.price || 0)).mul(Decimal(Number(crtTemp?.quantity || 0))).toNumber().toFixed(2)
            setList(tempList)

            // 改变数量后，重新统计总数
            let tempOrder = JSON.parse(JSON.stringify(orderInfo))
            let tempQuantity = 0
            tempList.map((item) => {
                tempQuantity = Decimal(Number(tempQuantity || 0)).add(Decimal(Number(item?.quantity || 0))).toNumber()
            })
            tempOrder.quantity = tempQuantity
            setOrderInfo(tempOrder)
        }
    }
    // 删除数组数据
    const delList = (param = {value: 0, field: 'id'}, tempType = 'list') => {
        if (!param?.value) return
        if (tempType == 'list') {
            let tempList = JSON.parse(JSON.stringify(list))
            let crtIndex = tempList.findIndex((f) => f[param.field] == param.value)
            tempList.splice(crtIndex, 1)

            // 改变数量后，重新统计总数
            let tempOrder = JSON.parse(JSON.stringify(orderInfo))
            let tempQuantity = 0
            tempList.map((item) => {
                tempQuantity = Decimal(Number(tempQuantity || 0)).add(Decimal(Number(item?.quantity || 0))).toNumber()
            })
            tempOrder.quantity = tempQuantity
            setOrderInfo(tempOrder)
            setList(tempList)
        }
    }

    // 打开编辑弹框
    const openEdit = (row) => {
        // console.log(row)
        updateData([
            { value: true, field: 'open' },
            { value: row?.id, field: 'id' },
            { value: row?.price, field: 'price' },
            { value: row?.isTax, field: 'isTax' },
            { value: row?.quantity, field: 'quantity' },
            { value: row?.isTaxText, field: 'isTaxText' },
            { value: row?.deliverTime, field: 'deliverTime' },
            { value: row?.monthlyMethod, field: 'monthlyMethod' },
            // { value: row?.monthlyMethodText, field: 'monthlyMethodText' },
            { value: `修改${row?.materialName || ''}数据`, field: 'title' },
        ])
    }

    // 校验修改数据
    const checkList = () => {
        let res = ''
        if (!dialogInfo.quantity || dialogInfo.quantity == 0) {
            res = dialogInfo.quantity == 0 ? '数量必须输入大于0的数' : '请填写数量'
        } else if (!dialogInfo.price || dialogInfo.price == 0) {
            res = dialogInfo.price == 0 ? '单价必须输入大于0的数' : '请填写单价'
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
            { value: dialogInfo.isTax, field: 'isTax' },
            { value: dialogInfo.price, field: 'price' },
            { value: dialogInfo.quantity, field: 'quantity' },
            { value: dialogInfo.isTaxText, field: 'isTaxText' },
            { value: dialogInfo.deliverTime, field: 'deliverTime' },
            { value: dialogInfo.monthlyMethod, field: 'monthlyMethod' },
            // { value: dialogInfo.monthlyMethodText, field: 'monthlyMethodText' },
        ]
        console.log(arr, dialogInfo)
        updateList(arr, {value: dialogInfo.id,field: 'id'}, 'list')
        updateData([{ value: false, field: 'open' }])
    }
    // 查看某一值的修改记录
    const openRecord = (item, field, tempTitle) => {
        // console.log(operatRef)
        // operatRef.current?.testHandle()
        // console.log(item)
        if (item?.recordFields?.length && item.recordFields.includes(field)) {
            let params = {
                field,
                id: item.id,
            }
            // console.log(params)
            Taro.showLoading({ title: '加载中...', mask: true })
            queryOperateRecordListAPI(params).then((res) => {
                if (res.code == 200) {
                    // console.log(res)
                    updateData([
                        { value: true, field: 'open' },
                        { value: res.data || [], field: 'list' },
                        { value: `${tempTitle}的修改记录`, field: 'title' },
                    ], 'record')
                }
            }).finally(() => Taro.hideLoading())
            updateData([
                { value: true, field: 'open' },
                { value: `${tempTitle}的修改记录`, field: 'title' },
            ], 'record')
        }
    }

    // 删除操作
    const delHandle = (row) => {
        if (list?.length <= 1) {
            Taro.showToast({ title: '采购明细不能为空', icon: 'none' })
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

    // 提示是否修改 校验弹框
    const materialOrderCompareList = (params) => {
        return new Promise((resolve, reject) => {
            materialOrderCompareListAPI(params).then((res) => {
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
        // console.log(list, remark, orderInfo)
        let params = JSON.parse(JSON.stringify(orderInfo))
        params.confirmRemark = remark
        params.orderDetailBoList = list
        params.orderDetailVoList = undefined
        delete params.orderDetailVoList
        setLoading(true)
        const checkRes = await materialOrderCompareList(params).catch(() => setLoading(false))
        // console.log(checkRes)
        if (!checkRes) return
        confirmOrderAppAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=1&title=采购合同&isReview=2`)
                    Taro.removeStorageSync('detailData')
                } else {
                    // getMaterialOrderDetail(id)
                    if (options?.companyId || (options?.isRedirect == '1')) {
                        Taro.redirectTo({ url: '/pages/home/home' })
                    } else {
                        Taro.navigateBack({ delta: 1 })
                    }
                    Taro.setStorageSync('isRefresh', '1')
                    Taro.showToast({ title: '编辑成功', icon: 'success' })
                }
            }
        }).finally(() => setLoading(false))
    }

    // 保存文件
    const saveFile = async () => {
        let item = orderInfo
        item.key = item.fileKey
        item.name = item.fileName
        GShareFileRef.current?.saveFile(item)
        // // Taro.openDocument({
        // //     filePath: tempFilePath,
        // //     showMenu: true,
        // //     success: (result) => {
        // //         console.log(result)
        // //     }
        // // })
        // Taro.showActionSheet({
        //     itemList: ['发送给好友', '发送邮箱'],
        //     success: async (res) => {
        //     //   console.log(res.tapIndex)
        //         if (res?.tapIndex == 0) {
        //             const res = await downloadFileByKeys(orderInfo.fileKey)
        //             const tempFilePath = await downloadImg(res.data[orderInfo.fileKey])
        //             Taro.shareFileMessage({
        //                 filePath: tempFilePath,
        //                 fileName: orderInfo.fileName,
        //                 // success: (result) => { console.log('转发成功', result) },
        //                 fail: (err) => {
        //                     console.log(err)
        //                     Taro.showToast({ title: '转发失败，请重试', icon: 'error' })
        //                 }
        //             })
        //         } else {
        //             updateData([{ value: true, field: 'open' }], 'email')
        //         }
        //     },
        //     fail: function (res) {
        //         console.log(res.errMsg)
        //     }
        // })
    }
    // // 数据校验
    // const checkData = () => {
    //     let res = ''
    //     if (!emailInfo.email) res = '请填写邮箱'
    //     else if (!validEmail(emailInfo.email)) res = '请填写正确的邮箱格式'
    //     return res
    // }
    // // 确定发送邮箱
    // const confirmEmail = () => {
    //     let errMsg = checkData()
    //     if (errMsg) {
    //         Taro.showToast({ title: errMsg, icon: 'none', duration: 1500 })
    //         return
    //     }
    //     console.log(dialogInfo, validEmail(dialogInfo.email))
    //     updateData([{ value: false, field: 'open' }], 'email')
    // }

    // 跳转
    const toPath = (url) => {
        Taro.navigateTo({ url })
    }

    // 点击上传图片时，保存一下数据
    const uploadImg = () => {
        saveTempData()
    }
    // 保存页面修改数据
    const saveTempData = () => {
        Taro.setStorageSync('detailData', { list, remark, orderInfo, monthMethodList })
    }
    // 预览
    const previewHandle = (url) => {
        saveTempData()
        toPath(url)
    }

    // 取消/确认结单
    const finishOrder = (tempType) => {
        if (!remark) {
            Taro.showToast({ title: '请填写确认备注', icon: 'none' })
            return
        }
        GConfirmRef.current.openConfirm({content: tempType == 6 ? '是否确认驳回此单据？' : '是否确认取消此单据？'}).then(() => {
            let params = {
                id: orderInfo?.id,
                confirmRemark: remark,
                confirmStatus: tempType,
            }
            setLoading(true)
            cancelOrderAPI(params).then((res) => {
                if (res.code == 200) {
                    // cancelOrderAPI
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
        <View className='contract-detail'>
            <NavBar color={'#333'} title={orderInfo?.status == 8 ? '单据详情' : '采购合同详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View>

            <GStep list={orderInfo?.status == 8 ? ['单据取消申请','确认','取消成功'] : ['下采购订单','合同确认','合同签字']} current={orderInfo?.confirmStatus == 3 ? 3 : 1}></GStep>

            <View className='common-card'>
                {orderInfo?.confirmStatus == 3 && <View className={`${orderInfo?.status == 8 ? 'primary-status-cancel' : 'primary-status-confirm'} common-status`}></View>}

                <View className='common-item head'>
                    <View className='common-title'>{orderInfo?.code}</View>
                </View>

                <View className='common-between'>
                    <View className='common-item'>
                        <View className='common-item-label'>订购数量</View>
                        <View className='common-item-value'>{orderInfo?.quantity}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>下单人</View>
                        <View className='common-item-value'>{orderInfo?.submitUserName}</View>
                    </View>
                </View>

                <View className='common-item'>
                    <View className='common-item-label'>供应商</View>
                    <View className='common-item-value'>{orderInfo?.supplierName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>下单公司</View>
                    <View className='common-item-value'>{orderInfo?.ownerName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>下单时间</View>
                    <View className='common-item-value'>{orderInfo?.createTime}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>收货地址</View>
                    <View className='common-item-value'>{orderInfo?.addressName}</View>
                </View>
                {/* <View className='common-item'>
                    <View className='common-item-label'>要求交期</View>
                    <View className='common-item-value'>{orderInfo?.deliverTime}</View>
                </View> */}

                <DetailUpload moduleCode={5} code={orderInfo?.code} id={orderInfo?.id} uploadImg={uploadImg}  uploadVoucherText={'上传采购单据'} previewVoucherText={'预览采购单据'}></DetailUpload>
            </View>

            {list?.length ? list.map((item, index) => {
                return (
                <View className='common-card'>
                    <View className='common-index'>{index + 1}</View>

                    <View className='common-item'>
                        <View className='common-item-label'>商品名称</View>
                        <View className='common-item-value'>{item.materialName}
                            {orderInfo?.isCanModify && orderInfo?.status != 8 && orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(item)}>
                                <View className='primary-edit'></View>
                                <View className='common-item-btn-plain-text'>修改</View>
                            </View>}
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>品牌</View>
                        <View className='common-item-value'>{item.manufacturer}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>规格型号</View>
                        <View className='common-item-value'>{item.specification}</View>
                    </View>

                    <View className='common-between half'>
                        <View className='common-item' onClick={() => openRecord(item, 'quantity', '数量')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>数量</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>{item.quantity}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>单位</View>
                            <View className='common-item-value'>{item.units}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item' onClick={() => openRecord(item, 'price', '单价')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('price') && 'change'}`}>单价</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('price') && 'change'}`}>{item.price}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>金额</View>
                            <View className='common-item-value'>{item.totalPrice}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item' onClick={() => openRecord(item, 'monthlyMethod', '月结方式')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('monthlyMethod') && 'change'}`}>月结方式</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('monthlyMethod') && 'change'}`}>{item?.monthlyMethod}</View>
                        </View>
                        <View className='common-item' onClick={() => openRecord(item, 'isTax', '是否含税')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('isTax') && 'change'}`}>是否含税</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('isTax') && 'change'}`}>{item?.isTaxText}</View>
                        </View>
                    </View>

                    <View className='common-item' onClick={() => openRecord(item, 'deliverTime', '交货日期')}>
                        <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('deliverTime') && 'change'}`}>交货日期</View>
                        <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('deliverTime') && 'change'}`}>{item.deliverTime}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>备注</View>
                        <View className='common-item-value'>{item.applyRemark}
                            {orderInfo?.isCanModify && orderInfo?.status != 8 && orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => delHandle(item)}>
                                <View className='primary-del'></View>
                                <View className='common-item-btn-plain-text'>删除</View>
                            </View>}
                        </View>
                    </View>
                </View>)
            }) : <></>}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label'>确认备注</View>
                    {orderInfo?.confirmStatus != 3 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value'>{remark}</View>}
                </View>
            </View>

            {orderInfo?.confirmStatus == 3 || orderInfo?.status != 8 ?
            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=1&title=采购合同&isReview=1`)}>预览合同</AtButton>
                {orderInfo?.confirmStatus != 3 ? (orderInfo?.isCanModify && <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确认合同</AtButton>) : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View> :
            (orderInfo?.isCanModify && <View className='common-bottom-btn'>
                <AtButton className='error' loading={loading} disabled={loading} onClick={() => finishOrder('6')}>驳回</AtButton>
                <AtButton loading={loading} disabled={loading} type='primary' onClick={() => finishOrder('3')}>确认取消</AtButton>
            </View>)}

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='digit' maxLength={15} title='数量' value={dialogInfo.quantity} placeholder={dialogInfo.open ? '请填写数量' : ''} onChange={(e) => updateData([{ value: e, field: 'quantity' }])}></AtInput>
                    <AtInput className='input-content-gray new' type='digit' title='单价' value={dialogInfo.price} placeholder={dialogInfo.open ? '请填写单价' : ''} onChange={(e) => updateData([{ value: e, field: 'price' }])}></AtInput>
                    <Picker mode='date' onChange={(e) => updateData([{ value: e?.detail?.value, field: 'deliverTime' }])}>
                        <AtInput disabled className='input-content-gray new' title='交货日期' value={dialogInfo.deliverTime} placeholder={dialogInfo.open ? '请选择交货日期' : ''}></AtInput>
                    </Picker>

                    <Picker mode='selector' rangeKey='dictValue' range={monthMethodList} onChange={(e) => updateData([
                        { value: monthMethodList[Number(e?.detail?.value)]?.dictValue, field: 'monthlyMethod' },
                        // { value: monthMethodList[Number(e?.detail?.value)]?.name, field: 'monthlyMethodText' },
                    ])}>
                        <AtInput disabled className='input-content-gray new' title='月结方式' value={dialogInfo.monthlyMethod} placeholder={dialogInfo.open ? '请选择月结方式' : ''}></AtInput>
                    </Picker>
                    <Picker mode='selector' rangeKey='name' range={taxList} onChange={(e) => updateData([
                        { value: taxList[Number(e?.detail?.value)]?.id, field: 'isTax' },
                        { value: taxList[Number(e?.detail?.value)]?.name, field: 'isTaxText' },
                    ])}>
                        <AtInput disabled className='input-content-gray new' title='是否含税' value={dialogInfo.isTaxText} placeholder={dialogInfo.open ? '请选择是否含税' : ''}></AtInput>
                    </Picker>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat ref={operatRef} open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>
            {/* <AtModal isOpened={recordInfo.open} onClose={() => updateData([{ value: false, field: 'open' }], 'record')} className='new pop-bottom common-dialog'>
                <AtModalHeader>{recordInfo.title}</AtModalHeader>
                <AtModalContent>
                    {
                        recordInfo.list?.length ? recordInfo.list.map((item, index) => {
                            return (
                                <View className='common-record-card'>
                                    <View className='common-record-head'>
                                        <View className='common-record-index'>{index + 1}</View>
                                        <View className='common-record-title'>{item?.createByName}</View>
                                        <View className='common-record-subtitle'>修改人</View>
                                    </View>
                                    <View className='common-record-item'>
                                        <View className='common-record-label'>修改内容</View>
                                        <View className='common-record-value'>{item?.operateContent}</View>
                                    </View>
                                    <View className='common-record-item'>
                                        <View className='common-record-label'>修改时间</View>
                                        <View className='common-record-value'>
                                            {item?.createTime && <>
                                                {dayjs(item?.createTime).format('YYYY-MM-DD')}
                                                <View className='common-record-unit'>{dayjs(item?.createTime).format('HH:mm')}</View>
                                            </>}
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : <AtLoadMore status='noMore'></AtLoadMore>
                    }
                </AtModalContent>
                <AtModalAction>
                    <AtButton type='primary' onClick={() => updateData([{ value: false, field: 'open' }], 'record')}>知道了</AtButton>
                </AtModalAction>
            </AtModal> */}

            <GConfirm ref={GConfirmRef}></GConfirm>
            <GShareFile ref={GShareFileRef}></GShareFile>
            {/* 邮箱发送
            <AtModal isOpened={emailInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{emailInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' title='邮箱' value={emailInfo.email} placeholder='请填写邮箱' onChange={(e) => updateData([{ value: e, field: 'email' }], 'email')}>
                    </AtInput>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }], 'email')}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmEmail}>确定</AtButton>
                </AtModalAction>
            </AtModal> */}
            <GFeedback></GFeedback>
        </View>
    )
}
