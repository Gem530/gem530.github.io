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
import { materialInventoryAPI } from '../../../../services/checkPlan'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { validEmail, downloadImg, downloadFileByKeys } from '../../../../util/func'
import { AtTabs, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import { createSignFileAPI, confirmMaterialBackAPI, queryOperateRecordListAPI, materialBackDeDetailAPI, confirmBackDetailAPI, materialBackDetailCompareListAPI } from '../../../../services/materialRequisition/index'
import GFeedback from '../../../../../components/g-feedback'

export default function ProcurementSignatureContractDetail() {
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
    const GConfirmRef = useRef()
    const GShareFileRef = useRef()
    // 不参与页面交互的数据，可以直接定义，不需要使用useState
    const [code, setCode] = useState('')
    const [list, setList] = useState([])
    const [status, setStatus] = useState('')
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    useLoad((options) => {
        setOptions(options)
        setStatus(options?.status)
        if (options?.id) {
            setCode(options?.id)
        }
    })
    useDidShow(() => {
        const detailData = Taro.getStorageSync('detailData')
        if (detailData?.orderInfo) {
            setList(detailData?.list || [])
            setOrderInfo(detailData.orderInfo)
            setRemark(detailData?.remark || '')
        } else if (code) {
            let tempType = Taro.getStorageSync('confirmStatus')
            getMaterialOrderDetail(code, tempType || status)
        }
    })
    useShareAppMessage(() => {
        return {
          title: '退货单详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val, tempType) => {
        // if ((tempType || status) == '3') {
        setLoading(true)
        confirmBackDetailAPI({ code: val || code, confirmStatus: tempType || status }).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                setOrderInfo(res.data)
                // console.log('res1', res.data)
                setList(res.data?.detailVoList || [])
                // setRemark(res.data?.confirmRemark || '')
            }
        }).finally(() => { setLoading(false) })
        // } else {
        //     setLoading(true)
        //     materialBackDeDetailAPI({ code: val || code }).then((res) => {
        //         // console.log(res)
        //         if (res.code == 200) {
        //             setOrderInfo(res.data)
        //             // console.log('res2', res.data)
        //             setList(res.data?.detailVoList || [])
        //             // setRemark(res.data?.confirmRemark || '')
        //         }
        //     }).finally(() => { setLoading(false) })
        // }
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

    // 修改数组数据
    const updateList = (arr, param = {value: 0, field: 'id'}, tempType = 'list') => {
        if (!arr?.length) return
        if (tempType == 'list') {
            let tempList = JSON.parse(JSON.stringify(list))
            let crtTemp = tempList.find((f) => f[param.field] == param.value)
            // console.log('sign', crtTemp, arr, param)
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
            setList(tempList)
        }
    }

    // 打开编辑弹框
    const openEdit = (row) => {
        // console.log(row)
        updateData([
            { value: true, field: 'open' },
            { value: row, field: 'params' },
            { value: row?.id, field: 'id' },
            { value: row?.price, field: 'price' },
            { value: `修改${row?.name || ''}数据`, field: 'title' },
            { value: Number(row?.quantity || 0), field: 'quantity' },
            { value: row?.confirmRemark || '', field: 'confirmRemark' },
        ])
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

    // 查看某一值的修改记录
    const openRecord = (item, field, tempTitle) => {
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
        // console.log(list, remark, orderInfo)
        // let params = JSON.parse(JSON.stringify(orderInfo))
        // // params.confirmRemark = remark
        // params.orderDetailBoList = list
        // params.orderDetailVoList = undefined
        // delete params.orderDetailVoList

        // let params = {
        //     purchaseList: list
        // }
        setLoading(true)

        // 校验是否修改
        const checkRes = await materialBackDetailCompareList(list).catch(() => setLoading(false))
        // console.log(checkRes)
        if (!checkRes) return

        // 校验是否在盘点中
        let tempObj = {}
        list.map((m, index) => {
            tempObj[`idList[${index}]`] = m.rawMaterialId
        })
        const planRes = await materialInventoryAPI({isCheck: '1', ...tempObj}).catch(() => setLoading(false))
        // console.log('planRes----------', planRes)
        if (planRes?.rows?.length) {
            // 有值，就不能往后执行
            // Taro.showToast({ title: `${planRes?.rows?.length}个物料盘点中，无法操作`, icon: 'none' })
            GConfirmRef.current.openConfirm({
                title: '提示',
                content: <View className='w-100 f-s-32 font-weight-4'>部分物料正在盘点中，需等待盘点结束后才能确认退货！</View>,
                type: 'tooltip',
                showCancelBtn: false,
                confirmText: '知道了',
            }).then(() => {
                takeScan()
            })
            setLoading(false)
            return
        }

        confirmMaterialBackAPI(list).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${list[0]?.id}&type=3&title=退货单&isReview=2&code=${code}`)
                    Taro.removeStorageSync('detailData')
                } else {
                    if (options?.companyId || (options?.isRedirect == '1')) {
                        Taro.redirectTo({ url: '/pages/home/home' })
                    } else {
                        Taro.navigateBack({ delta: 1 })
                    }
                    Taro.setStorageSync('isRefresh', '1')
                    Taro.showToast({ title: '编辑成功', icon: 'success' })
                }
            }
        }).finally(() => { setLoading(false) })
    }

    // 保存文件
    const saveFile = async () => {
        let item = orderInfo
        item.key = item.fileKey
        item.name = item.fileName
        if (orderInfo?.confirmStatus == 3 && !item.fileKey) {
            const res = await createSignFileAPI({code: item.code})
            // console.log(res)
            if (res.code == 200) {
                item.key = res.data?.fileKey
                item.name = res.data?.fileName
                item.fileKey = res.data?.fileKey
                item.fileName = res.data?.fileName
                setOrderInfo(item)
            }
        }
        GShareFileRef.current?.saveFile(item)
    }

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
        Taro.setStorageSync('detailData', { list, remark, orderInfo })
    }
    // 预览
    const previewHandle = (url) => {
        saveTempData()
        toPath(url)
    }
    return (
        <View className='contract-detail'>
            <NavBar color={'#333'} title={'退货单详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View>

            <GStep list={['开物料退货单','退货确认','退货单确认']} current={orderInfo?.confirmStatus == 3 ? 3 : 1}></GStep>

            <View className='common-card'>
                {orderInfo?.confirmStatus == 3 && <View className='primary-status-confirm common-status'></View>}

                <View className='common-item head'>
                    <View className='common-title'>{orderInfo?.code}</View>
                </View>


                <View className='common-item'>
                    <View className='common-item-label'>供应商</View>
                    <View className='common-item-value'>{orderInfo?.supplierName}</View>
                </View>

                <View className='common-item'>
                    <View className='common-item-label'>退货总数</View>
                    <View className='common-item-value'>{orderInfo?.quantity}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>退货公司</View>
                    <View className='common-item-value'>{orderInfo?.ownerName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>退货地址</View>
                    <View className='common-item-value'>{orderInfo?.addressName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>退货日期</View>
                    <View className='common-item-value'>{orderInfo?.backTime}</View>
                </View>

                <DetailUpload moduleCode={10} code={orderInfo?.code} id={list[0]?.bizId
                } uploadImg={uploadImg}   uploadVoucherText={'上传退货单据'} previewVoucherText={'预览退货单据'}></DetailUpload>
            </View>

            {list?.length ? list.map((item, index) => {
                return (
                <View className='common-card'>
                    <View className='common-index'>{index + 1}</View>

                    <View className='common-item'>
                        <View className='common-item-label'>商品名称</View>
                        <View className='common-item-value'>{item.name}
                            {orderInfo?.isCanModify && orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(item)}>
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
                        <View className='common-item' onClick={() => openRecord(item, 'quantity', '退货数量')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>退货数量</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>{item.quantity}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>单位</View>
                            <View className='common-item-value'>{item.unit}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item' onClick={() => openRecord(item, 'price', '退货单价')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('price') && 'change'}`}>退货单价</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('price') && 'change'}`}>{item.price}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>退货金额</View>
                            <View className='common-item-value'>{item.totalPrice}</View>
                        </View>
                    </View>

                    <View className='common-item'>
                        <View className='common-item-label'>退货原因</View>
                        <View className='common-item-value'>{item.remark}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>提货人</View>
                        <View className='common-item-value'>{item.backUserName}</View>
                    </View>
                    <View className='common-item' onClick={() => openRecord(item, 'confirmRemark', '确认备注')}>
                        <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('confirmRemark') && 'change'}`}>确认备注</View>
                        <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('confirmRemark') && 'change'}`}>{item.confirmRemark}</View>
                    </View>
                </View>)
            }) : <></>}

            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${list[0]?.id}&type=3&title=退货单&isReview=1&code=${code}`)}>预览退货单</AtButton>
                {orderInfo?.confirmStatus != 3 ? (orderInfo?.isCanModify && <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确认退货单</AtButton>) : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View>

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='number' maxLength={15} title='退货数量' value={dialogInfo.quantity} placeholder={dialogInfo.open ? '请填写退货数量' : ''} onChange={(e) => updateData([{ value: e, field: 'quantity' }])}>
                        <View className='max-unit'>最大值{(Number(dialogInfo?.params?.rawMaterialInvontoryQuantity || 0))}</View>
                    </AtInput>
                    <AtInput className='input-content-gray new' type='digit' title='退货单价' value={dialogInfo.price} placeholder={dialogInfo.open ? '请填写退货单价' : ''} onChange={(e) => updateData([{ value: e, field: 'price' }])}></AtInput>
                    <View className='common-item mini padding-t-b'>
                        <View className='common-item-label m-t-4'>确认备注</View>
                        <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={dialogInfo.confirmRemark} onChange={(e) => updateData([{ value: e, field: 'confirmRemark' }])} maxLength={200} placeholder={dialogInfo.open ? '请填写备注' : ''}></AtTextarea>
                    </View>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>
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
            <GFeedback></GFeedback>
        </View>
    )
}
