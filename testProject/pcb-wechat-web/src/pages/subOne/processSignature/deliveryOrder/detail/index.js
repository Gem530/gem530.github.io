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
import { sourceHalfProcessDeliveryEditAPI, sourceHalfProcessDeliveryDetailAPI } from '../../../../services/processOutsource/index'
import { AtTabs, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import Decimal from 'decimal.js'
import GFeedback from '../../../../../components/g-feedback'

export default function ProcessSignatureContractDetail() {
    // 弹框信息
    const initDialog = {
        id: 0,
        unit: '',
        index: 0,
        open: false,
        unitStr: '',
        initUniStr: '',
        title: '修改数据',
        params: undefined,
        deliveryQuantity: '',
    }
    const initRecord = {
        list: [],
        open: false,
        title: '修改数据',
    }
    const GShareFileRef = useRef()
    // 不参与页面交互的数据，可以直接定义，不需要使用useState
    const [id, setId] = useState('')
    const [list, setList] = useState([])
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [typeList, setTypeList] = useState([])
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    useLoad((options) => {
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
        } else if (id) {
            getMaterialOrderDetail(id)
        }
    })
    useShareAppMessage(() => {
        return {
          title: '送货单详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val) => {
        setLoading(true)
        sourceHalfProcessDeliveryDetailAPI(val || id).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                setOrderInfo(res.data)
                setRemark(res.data?.confirmRemark || '')
                res.data?.outSourceHalfProcessDeliveryList?.length && res.data?.outSourceHalfProcessDeliveryList.map((item) => {
                    item.tempDeliveryQuantity = item.deliveryQuantity
                })
                setList(res.data?.outSourceHalfProcessDeliveryList || [])
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
                if (['deliveryQuantity'].includes(item.field)) {
                    if (item.value?.length >= 2) {
                        let crtEmpty = item.value.indexOf('0')
                        let crtI = item.value.indexOf('.')
                        if (crtEmpty == 0 && crtI != 1) {
                            item.value = item.value.substring(1)
                        } else if (crtI != -1 && dialogInfo.unit == '1') {
                            item.value = item.value.substring(0, crtI + 3)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                tempDialog[item.field] = item.value
            })
            if (tempDialog.unit != '1' && arr.find((f) => f.field == 'deliveryQuantity')) {
                tempDialog.deliveryQuantity = tempDialog.deliveryQuantity.toString().replaceAll(/\./g, '')
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
        } else if (tempType == 'typeList') {
            let tempList = JSON.parse(JSON.stringify(typeList))
            let crtTemp = tempList.find((f) => f[param.field] == param.value)
            arr.map((item, index) => {
                if (['deliveryQuantity'].includes(item.field)) {
                    if (item.value?.length >= 2) {
                        let crtEmpty = item.value.indexOf('0')
                        let crtI = item.value.indexOf('.')
                        if (crtEmpty == 0 && crtI != 1) {
                            item.value = item.value.substring(1)
                        } else if (crtI != -1 && dialogInfo.unit == 1) {
                            item.value = item.value.substring(0, crtI + 3)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                if (['deliveryQuantity'].includes(item.field) && dialogInfo.unit != '1') {
                    item.value = item.value.toString().replaceAll(/\./g, '')
                }
                // console.log(item.value, item)
                crtTemp[item.field] = item.value
            })
            setTypeList(tempList)
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
    const openEdit = (row, index) => {
        // console.log(row)
        updateData([
            { value: true, field: 'open' },
            { value: row, field: 'params' },
            { value: row?.id, field: 'id' },
            { value: index, field: 'index' },
            { value: row?.unit, field: 'unit' },
            { value: row?.unitStr, field: 'unitStr' },
            { value: row?.unitStr, field: 'initUniStr' },
            { value: `修改${row?.commodityCode || ''}数据`, field: 'title' },
            { value: Number(row?.deliveryQuantity), field: 'deliveryQuantity' },
        ])
    }
    // 修改单位
    const changeUnit = (index) => {
        let row = JSON.parse(JSON.stringify(dialogInfo.params))
        const crtUnits = row.unitList[index]

        // 修改单位，列出单位中所有的收货类型
        let tempList = []
        crtUnits.typeList?.length && crtUnits.typeList.map((item) => {
            let copyRow = JSON.parse(JSON.stringify(row))
            // item.
            copyRow.type = item.id
            copyRow.deliveryQuantity = 0
            copyRow.unit = crtUnits.unit
            copyRow.typeName = item.typeName
            copyRow.maxNumber = item.quantity
            copyRow.unitStr = crtUnits.unitName
            copyRow.typeSize = crtUnits.typeList.length
            if (copyRow.addFlag === true){
                // item.quantity / copyRow.quantity
                copyRow.denominator = Decimal(Number(item.quantity)).div(Decimal(Number(copyRow.quantity))).toNumber()
            }else{
                // item.total / copyRow.quantity
                copyRow.denominator = Decimal(Number(item.total)).div(Decimal(Number(copyRow.quantity))).toNumber()
            }
            copyRow.denominator = Math.round(copyRow.denominator)
            tempList.push(copyRow)
        })
        setTypeList(tempList)

        // console.log(crtUnits)
        updateData([{ value: crtUnits.unit, field: 'unit' }, { value: crtUnits.unitName, field: 'unitStr' }])
        // updateData([{ value: false, field: 'unitStr' }])
    }
    // 校验修改数据
    const checkList = (max) => {
        let res = ''
        if (!dialogInfo.deliveryQuantity || dialogInfo.deliveryQuantity == 0) {
            res = '请填写送货数量'
        } else if (dialogInfo.deliveryQuantity > max) {
            res = `送货数量不能超过${max}`
        }
        return res
    }
    // 确定修改
    const confirmHandle = () => {
        // console.log(dialogInfo)
        let row = JSON.parse(JSON.stringify(dialogInfo.params)) // 当前行
        const crtUnits = row.unitList.find((f) => f.unit == dialogInfo.unit) // 当前单位
        let crtList = JSON.parse(JSON.stringify(list)) // 当前数组
        // console.log(crtUnits)
        if (dialogInfo.initUniStr == dialogInfo.unitStr) {
            // 未改单位时，只改当前值
            const max = crtUnits.typeList.find((f) => f.id == row.type).quantity
            // console.log(max)
    
            const errMsg = checkList(Number(max))
            if (errMsg) {
                Taro.showToast({ title: errMsg, icon: 'none' })
                return
            }
            let arr = [
                { value: dialogInfo.deliveryQuantity, field: 'deliveryQuantity' },
            ]
            // updateList(arr, {value: dialogInfo.id,field: 'id'}, 'list')
            // let crtList = JSON.parse(JSON.stringify(list))
            const crtInfo = crtList[dialogInfo.index]
            crtInfo.deliveryQuantity = dialogInfo.deliveryQuantity
            setList(crtList)
            // crtList?.length && crtList.map((item) => {})
        } else {
            // 单位改变时，删除当前orderId所有的数据，以新生成的typeList的数据插入之前的位置
            let crtI = crtList.findIndex((f) => f.orderId == row.orderId)
            // console.log(JSON.parse(JSON.stringify(crtList)).filter((f) => f.orderId != row.orderId))
            crtList = crtList.filter((f) => f.orderId != row.orderId)
            let tempList = typeList
            let errMsg = ''
            tempList.map((item) => {
                if (!item.deliveryQuantity || item.deliveryQuantity == 0) {
                    errMsg = `请填写送货数量`
                } else if (item.deliveryQuantity > Number(item.maxNumber)) {
                    errMsg = `送货数量不能超过${Number(item.maxNumber)}`
                }
                // if ()
            })
            if (errMsg) {
                Taro.showToast({ title: errMsg, icon: 'none' })
                return
            }
            // console.log(crtI)
            // let tempList = []
            // crtUnits.typeList?.length && crtUnits.typeList.map((item, index) => {
            //     let copyRow = JSON.parse(JSON.stringify(row))
            //     copyRow.type = item.id
            //     copyRow.unit = crtUnits.unit
            //     copyRow.deliveryQuantity = 0
            //     copyRow.typeName = item.typeName
            //     copyRow.unitStr = crtUnits.unitName
            //     copyRow.typeSize = crtUnits.typeList.length
            //     console.log(item, copyRow)
            //     copyRow.denominator = Decimal(Number(item.total)).div(Decimal(Number(copyRow.quantity))).toNumber()
            //     tempList.push(copyRow)
            // })
            // // type, typeName, unit, unitStr
            // console.log(crtI, crtUnits, tempList)
            crtList.splice(crtI, 0, ...tempList)
            setList(crtList)
        }
        // // for (let key in dialogInfo) {}
        // let arr = [
        //     { value: dialogInfo.deliveryQuantity, field: 'deliveryQuantity' },
        // ]
        // updateList(arr, {value: dialogInfo.id,field: 'id'}, 'list')
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
    const delHandle = (row, index) => {
        if (list?.length <= 1) {
            Taro.showToast({ title: '送货单明细不能为空', icon: 'none' })
            return
        }
        Taro.showModal({
            content: `确定删除${row?.commodityCode || ''}吗？`,
            success: (res) => {
                // console.log(res)
                if (res?.confirm) {
                    // console.log('确定删除')
                    // delList({value: row.id, field: 'id'}, 'list')
                    let tempList = JSON.parse(JSON.stringify(list))
                    tempList.splice(index, 1)
                    setList(tempList)
                }
            }
        })
    }

    // 确定合同
    const confirmOrder = () => {
        // console.log(list, remark, orderInfo)
        const flag = list.some((s) => !s.deliveryQuantity)
        if (flag) {
            Taro.showToast({ title: '收货数量不能为空', icon: 'none' })
            return
        }
        let params = JSON.parse(JSON.stringify(orderInfo))
        params.status = '3'
        params.confirmRemark = remark
        params.outSourceHalfProcessDeliveryList = list
        // delete params.orderDetailVoList
        setLoading(true)
        sourceHalfProcessDeliveryEditAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=10&title=送货单&isReview=2`)
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
            <NavBar color={'#333'} title={'送货单详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View>

            <GStep list={['供应商送货','我司确认','我司签收']} current={orderInfo?.status || 0}></GStep>

            <View className='common-card'>
                {orderInfo?.status == 3 && <View className='primary-status-confirm common-status'></View>}

                <View className='common-item head'>
                    <View className='common-title'>{orderInfo?.code}</View>
                </View>

                <View className='common-item'>
                    <View className='common-item-label'>供应商</View>
                    <View className='common-item-value'>{orderInfo?.companyName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>接收地址</View>
                    <View className='common-item-value'>{orderInfo?.deliveryAddress}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>接收方</View>
                    <View className='common-item-value'>{orderInfo?.company}</View>
                </View>

                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>送货人</View>
                        <View className='common-item-value'>{orderInfo?.createByName}</View>
                    </View>
                    <View className='common-item mini'>
                        <View className='common-item-label'>送货日期</View>
                        <View className='common-item-value'>{orderInfo?.deliveryTime && dayjs(orderInfo?.deliveryTime).format('YYYY-MM-DD')}</View>
                    </View>
                </View>

                <DetailUpload type='10' moduleCode={15} code={orderInfo?.code} id={orderInfo?.bizId} uploadImg={uploadImg}></DetailUpload>
            </View>
            
            {list?.length ? list.map((item, index) => {
                return (
                <View className='common-card'>
                    <View className='common-index'>{index + 1}</View>

                    <View className='common-item'>
                        <View className='common-item-label'>产品编码</View>
                        <View className='common-item-value'>{item?.commodityCode}
                            {orderInfo?.status != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(item, index)}>
                                <View className='primary-edit'></View>
                                <View className='common-item-btn-plain-text'>修改</View>
                            </View>}
                        </View>
                    </View>
                    <View className='common-item border-bottom'>
                        <View className='common-item-label'>排产单号</View>
                        <View className='common-item-value'>{item?.productionCode}</View>
                    </View>
                    
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>加工工序</View>
                            <View className='common-item-value'>{item?.craftName}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>加工类型</View>
                            <View className='common-item-value'>{item?.orderTypeName}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className={`common-item-label`}>长(mm)</View>
                            <View className={`common-item-value`}>{item?.length}</View>
                        </View>
                        <View className='common-item'>
                            <View className={`common-item-label`}>宽(mm)</View>
                            <View className={`common-item-value`}>{item?.width}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item' onClick={() => openRecord(item, 'unitsStr', '加工单位')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('unitsStr') && 'change'}`}>加工单位</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('unitsStr') && 'change'}`}>{item?.unitsStr}</View>
                        </View>
                        <View className='common-item' onClick={() => openRecord(item, 'quantity', '加工数量')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>加工数量</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('quantity') && 'change'}`}>{item?.quantity}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('unitStr') && 'change'}`}>收货单位</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('unitStr') && 'change'}`}>{item?.unitStr}</View>
                        </View>
                        <View className='common-item' onClick={() => openRecord(item, 'deliveryQuantity', '收货数量')}>
                            <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('deliveryQuantity') && 'change'}`}>收货数量</View>
                            <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('deliveryQuantity') && 'change'}`}>{item?.deliveryQuantity}</View>
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('typeName') && 'change'}`} onClick={() => openRecord(item, 'typeName', '收货类型')}>收货类型</View>
                        <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('typeName') && 'change'}`} onClick={() => openRecord(item, 'typeName', '收货类型')}>{item?.typeName}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>加工要求</View>
                        <View className='common-item-value'>{item?.requirement}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>加工备注</View>
                        <View className='common-item-value'>{item?.orderRemark}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>送货备注</View>
                        <View className='common-item-value'>{item?.remark}
                            {orderInfo?.status != 3 && <View className='common-item-btn-plain' onClick={() => delHandle(item, index)}>
                                <View className='primary-del'></View>
                                <View className='common-item-btn-plain-text'>删除</View>
                            </View>}
                        </View>
                    </View>
                </View>)
            }) : <></>}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label m-t-4'>确认备注</View>
                    {orderInfo?.status != 3 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value m-t-4'>{remark}</View>}
                </View> 
            </View>

            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=10&title=送货单&isReview=1`)}>预览送货单</AtButton>
                {orderInfo?.status != 3 ? <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>签收送货单</AtButton> : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View>

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <Picker mode='selector' rangeKey='unitName' range={dialogInfo?.params?.unitList} onChange={(e) => changeUnit(e?.detail?.value)}>
                        <AtInput disabled className='input-content-gray new' title='收货单位' value={dialogInfo?.unitStr} placeholder={dialogInfo.open ? '请选择收货单位' : ''}></AtInput>
                    </Picker>
                    {dialogInfo.initUniStr == dialogInfo.unitStr ? <AtInput className='input-content-gray new' type={dialogInfo.unit == 1 ? 'digit' : 'number'} maxLength={15} title='送货数量' value={dialogInfo.deliveryQuantity} placeholder={dialogInfo.open ? '请填写送货数量' : ''} onChange={(e) => updateData([{ value: e, field: 'deliveryQuantity' }])}>
                        <View className='max-unit'>最大值{Number(dialogInfo?.params?.quantity)}</View>
                    </AtInput> :
                    typeList.map((item) => {
                        return (
                            <>
                            <View className='common-item mini'>
                                <View className='common-item-label'>收货类型</View>
                                <View className='common-item-value'>{item.typeName}</View>
                            </View>
                            <AtInput className='input-content-gray new' type={item.unit == 1 ? 'digit' : 'number'} maxLength={15} title='送货数量' value={item.deliveryQuantity} placeholder={dialogInfo.open ? '请填写送货数量' : ''} onChange={(e) => updateList([{ value: e, field: 'deliveryQuantity' }], {value: item.type, field: 'type'}, 'typeList')}>
                                <View className='max-unit'>最大值{item.maxNumber}</View>
                            </AtInput>
                            </>
                        )
                    })
                    }
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>
            
            {/* 邮箱发送 */}
            <GShareFile ref={GShareFileRef}></GShareFile>
            <GFeedback></GFeedback>
        </View>
    )
}