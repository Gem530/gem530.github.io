import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import GStep from '../../../../../components/g-step'
import NavBar from '../../../../../components/nav-bar'
import GOperat from '../../../../../components/g-operat'
import { View, Picker, ScrollView } from '@tarojs/components'
import GShareFile from '../../../../../components/g-share-file'
import DetailUpload from '../../../../../components/detail-upload'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { validEmail, downloadImg, downloadFileByKeys } from '../../../../util/func'
import { queryOperateRecordListAPI } from '../../../../services/materialRequisition/index'
import { confirmAppHalfProcessAPI, supplierOrderDetailAPI } from '../../../../services/processOutsource/index'
import { AtToast, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import GFeedback from '../../../../../components/g-feedback'

export default function ProcessSignatureContractDetail() {
    // 弹框信息
    const initDialog = {
        id: 0,
        width: '',
        length: '',
        params: '',
        open: false,
        quantity: '',
        title: '修改数据',
    }
    const initRecord = {
        list: [],
        open: false,
        title: '修改数据',
    }
    const GShareFileRef = useRef()
    // 不参与页面交互的数据，可以直接定义，不需要使用useState
    // const [id, setId] = useState('')
    const [list, setList] = useState([])
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [option, setOption] = useState({
        code: '',
        confirmStatus: ''
    })
    const [toastInfo, setToastInfo] = useState({
      open: false,
      text: ''
    })
    useLoad((options) => {
        setOptions(options)
        // if (options?.id) {
        if (options?.id) {
            options.code = options.id
            delete options.id
        }
        if (options?.status) {
            options.confirmStatus = options.status
            delete options.status
        }
        setOption(options)
            // getMaterialOrderDetail(options?.id)
        // }
    })
    useDidShow(() => {
        const detailData = Taro.getStorageSync('detailData')
        if (detailData?.orderInfo) {
            setList(detailData?.list || [])
            setOrderInfo(detailData.orderInfo)
            setRemark(detailData?.remark || '')
        } else if (option.code && option.confirmStatus) {
            let tempType = Taro.getStorageSync('confirmStatus')
            if (tempType) {
                option.confirmStatus = tempType
            }
            getMaterialOrderDetail(option)
        }
    })
    useShareAppMessage(() => {
        return {
          title: '加工单详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val) => {
        setLoading(true)
        supplierOrderDetailAPI(val || option).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                res.data?.length && res.data.map((item) => {
                    item.tempQuantity = item.quantity
                })
                setOrderInfo(res.data[0])
                setRemark(res.data[0]?.confirmRemark || '')
                setList(res.data || [])
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
                if (['width','length','quantity'].includes(item.field)) {
                    if (item.value?.length >= 2) {
                        let crtEmpty = item.value.indexOf('0')
                        let crtI = item.value.indexOf('.')
                        if (crtEmpty == 0 && crtI != 1) {
                            item.value = item.value.substring(1)
                        } else if (crtI != -1) {
                            item.value = item.value.substring(0, crtI + 3)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                tempDialog[item.field] = item.value
            })
            // console.log('tempDialog', tempDialog)
            if (tempDialog?.params?.unit && tempDialog?.params?.unit != '1') {
                tempDialog.quantity = tempDialog.quantity.toString().replaceAll(/\./g, '')
            }
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
            arr.map((item, index) => {
                crtTemp[item.field] = item.value
            })
            setList(tempList)
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
            { value: row?.width, field: 'width' },
            { value: row?.length, field: 'length' },
            { value: Number(row?.quantity || 0), field: 'quantity' },
            { value: `修改${row?.commodityCode || ''}数据`, field: 'title' },
        ])
    }

    // 校验修改数据
    const checkList = () => {
        let res = ''
        if (!dialogInfo.width || dialogInfo.width == 0) {
            res = '请填写宽'
        } else if (!dialogInfo.length || dialogInfo.length == 0) {
            res = '请填写长'
        } else if (!dialogInfo.quantity || dialogInfo.quantity == 0) {
            res = '请填写加工数量'
        } else if (dialogInfo.quantity > Number(dialogInfo.params?.maxQuantity)) {
            res = '加工数量不可大于' + Number(dialogInfo.params?.maxQuantity)
        }
        //  else if (dialogInfo.quantity > Number(dialogInfo.params.tempQuantity)) {
        //     res = '加工数量不可大于' + Number(dialogInfo.params.tempQuantity)
        // }
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
        // // for (let key in dialogInfo) {}
        let arr = [
            // { value: dialogInfo.unit, field: 'unit' },
            { value: dialogInfo.width, field: 'width' },
            { value: dialogInfo.length, field: 'length' },
            { value: dialogInfo.quantity, field: 'quantity' },
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

    // 确定合同
    const confirmOrder = () => {
        // console.log(list, remark, orderInfo)
        // let params = JSON.parse(JSON.stringify(orderInfo))
        // params.confirmRemark = remark

        // params.orderDetailBoList = list
        // params.orderDetailVoList = undefined
        // delete params.orderDetailVoList
        let tempList = list
        tempList.map((item) => {
            item.confirmRemark = remark
        })
        setLoading(true)
        confirmAppHalfProcessAPI(tempList).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=9&title=工序外协合同&isReview=2&code=${orderInfo?.code}`)
                    Taro.removeStorageSync('detailData')
                } else {
                    // getMaterialOrderDetail(id)
                    if (options?.companyId || (options?.isRedirect == '1')) {
                        Taro.redirectTo({ url: '/pages/home/home' })
                    } else {
                        Taro.navigateBack({ delta: 1 })
                    }
                    Taro.showToast({ title: '编辑成功', icon: 'success' })
                }
            }
        }).catch((err) => {
            setToastInfo({
                open: true,
                text: err.msg
            })
        }).finally(() => { setLoading(false) })
    }

    // 保存文件
    const saveFile = async () => {
        let item = orderInfo
        item.key = item.fileKey
        item.name = item.fileName
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
            <NavBar color={'#333'} title={'加工单详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View>

            <GStep list={['开工序加工单','加工单接单','加工单确认']} current={orderInfo?.confirmStatus == 3 ? 3 : 1}></GStep>
            {/* <View className='common-step'>
                {
                    ['开产品供应商','开产品供','开产品供商'].map((item, index) => {
                        return (
                            <>
                            <View className={`common-step-item ${index < 1 && 'pass'} ${1 == index && 'wait'} ${index > 1 && 'gray'}`}>
                                <View className='common-step-item-content'>
                                    <View className={`${index < 1 && 'primary-flow-pass'} ${1 == index && 'primary-flow-wait'} ${index > 1 && 'primary-flow-gray'}`}></View>
                                    <View className='common-step-item-content-text'>{item}</View>
                                </View>
                            </View>
                            {([1,2,3].length - 1) != index && <View className={`common-step-item-line  ${index < 1 ? 'primary-flow-line-blue' : 'primary-flow-line-gray'}`}></View>}
                            </>
                        )
                    })
                }
            </View> */}

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
                    <View className='common-item-label'>下单公司</View>
                    <View className='common-item-value'>{orderInfo?.ownerName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>接收地址</View>
                    <View className='common-item-value'>{orderInfo?.deliveryAddress}</View>
                </View>

                <DetailUpload moduleCode={16} code={orderInfo?.code} id={orderInfo?.id} uploadImg={uploadImg}></DetailUpload>
            </View>
            
            {list?.length ? list.map((item, index) => {
                return (
                    <View className='common-card'>
                        <View className='common-index'>{index + 1}</View>

                        <View className='common-item border-bottom'>
                            <View className='common-item-label'>产品编码</View>
                            <View className='common-item-value'>{item?.commodityCode}
                                {orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(item)}>
                                    <View className='primary-edit'></View>
                                    <View className='common-item-btn-plain-text'>修改</View>
                                </View>}
                            </View>
                        </View>
                        {/* <View className='common-item'>
                            <View className='common-item-label'>排产单号</View>
                            <View className='common-item-value'>{item?.price}</View>
                        </View> */}
                        
                        <View className='common-between half'>
                            <View className='common-item'>
                                <View className='common-item-label'>加工工序</View>
                                <View className='common-item-value'>{item?.craftName}</View>
                            </View>
                            <View className='common-item'>
                                <View className='common-item-label'>加工类型</View>
                                <View className='common-item-value'>{item?.typeName}</View>
                            </View>
                        </View>
                        <View className='common-between half'>
                            <View className='common-item' onClick={() => openRecord(item, 'length', '长(mm)')}>
                                <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('length') && 'change'}`}>长(mm)</View>
                                <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('length') && 'change'}`}>{item?.length}</View>
                            </View>
                            <View className='common-item' onClick={() => openRecord(item, 'width', '宽(mm)')}>
                                <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('width') && 'change'}`}>宽(mm)</View>
                                <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('width') && 'change'}`}>{item?.width}</View>
                            </View>
                        </View>
                        <View className='common-between half'>
                            <View className='common-item'>
                                <View className={`common-item-label`}>加工单位</View>
                                <View className={`common-item-value`}>{item?.unitDesc}</View>
                            </View>
                            <View className='common-item' onClick={() => openRecord(item, 'quantity', '加工数量')}>
                                <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>加工数量</View>
                                <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>{item?.quantity}</View>
                            </View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>加工要求</View>
                            <View className='common-item-value'>{item?.requirement}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>加工备注</View>
                            <View className='common-item-value'>{item?.remark}</View>
                        </View>

                        {/* <View className='common-item'>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('deliverTime') && 'change'}`} onClick={() => openRecord(item, 'deliverTime', '交货日期')}>交货日期</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('deliverTime') && 'change'}`}>{item.deliverTime}</View>
                        </View> 
                        <View className='common-item'>
                            <View className='common-item-label'>备注</View>
                            <View className='common-item-value'>{item.remark}
                                {orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => delHandle(item)}>
                                    <View className='primary-del'></View>
                                    <View className='common-item-btn-plain-text'>删除</View>
                                </View>}
                            </View>
                        </View> */}
                    </View>
                )
            }) : <></>}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label m-t-4'>确认备注</View>
                    {orderInfo?.confirmStatus != 3 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value m-t-4'>{remark}</View>}
                </View> 
            </View>

            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=9&title=工序外协合同&isReview=1&code=${orderInfo?.code}`)}>预览加工单</AtButton>
                {orderInfo?.confirmStatus != 3 ? <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确认加工单</AtButton> : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View>

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='digit' title='长(mm)' value={dialogInfo.length} placeholder={dialogInfo.open ? '请填写长(mm)' : ''} onChange={(e) => updateData([{ value: e, field: 'length' }])}></AtInput>
                    <AtInput className='input-content-gray new' type='digit' title='宽(mm)' value={dialogInfo.width} placeholder={dialogInfo.open ? '请填写宽(mm)' : ''} onChange={(e) => updateData([{ value: e, field: 'width' }])}></AtInput>
                    <AtInput className='input-content-gray new' type={dialogInfo.params.unit == 1 ? 'digit' : 'number'} maxLength={15} title='加工数量' value={dialogInfo.quantity} placeholder={dialogInfo.open ? '请填写加工数量' : ''} onChange={(e) => updateData([{ value: e, field: 'quantity' }])}></AtInput>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>

            <GShareFile ref={GShareFileRef}></GShareFile>

            <AtToast isOpened={toastInfo.open} text={toastInfo.text} duration={1500} hasMask={true} onClose={() => { setToastInfo({ open: false, text: '' }) }}></AtToast>
            <GFeedback></GFeedback>
        </View>
    )
}