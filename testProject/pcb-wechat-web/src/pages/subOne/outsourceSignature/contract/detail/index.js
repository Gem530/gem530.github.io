import './index.less'
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
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
import { confirmOrderAPI, getOrderDetailAPI } from '../../../../services/orderOutsource/index'
import { AtTabs, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import GFeedback from '../../../../../components/g-feedback'

export default function OutsourceSignatureContractDetail() {
    // 弹框信息
    const initDialog = {
        id: 0,
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
    const [id, setId] = useState('')
    const [list, setList] = useState([])
    const [remark, setRemark] = useState('')
    const [options, setOptions] = useState()
    const [loading, setLoading] = useState(false)
    const [orderInfo, setOrderInfo] = useState(undefined)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    useLoad((options) => {
        // console.log('options', options)
        setOptions(options)
        if (options?.id) {
            setId(options?.id)
            // getMaterialOrderDetail(options?.id)
        }
    })
    useDidShow(() => {
        // getAuditList()
        console.log('useDidShow')
        const detailData = Taro.getStorageSync('detailData')
        if (detailData?.orderInfo) {
            console.log('detailData', detailData)
            setList(detailData?.list || [])
            setOrderInfo(detailData.orderInfo)
            setRemark(detailData?.confirmRemark || '')
        } else if (id) {
            console.log('id', id)
            getMaterialOrderDetail(id)
        }
    })
    useShareAppMessage(() => {
        return {
          title: '合同详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val) => {
        setLoading(true)
        getOrderDetailAPI(val || id).then((res) => {
            console.log('getMaterialOrderDetail', res)
            if (res.code == 200) {
                res.data.tempQuantity = res.data.quantity
                setOrderInfo(res.data)
                setRemark(res.data?.confirmRemark || '')
                setList(res.data?.orderDetailVoList || [])
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
                            item.value = item.value.substring(0, crtI + 4)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                if (['quantity'].includes(item.field)) {
                    item.value = item.value.toString().replaceAll(/\./g, '')
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
            { value: row?.id, field: 'id' },
            { value: row?.price, field: 'price' },
            { value: row?.quantity, field: 'quantity' },
            { value: row?.deliverTime, field: 'deliverTime' },
            { value: `修改${row?.code || ''}数据`, field: 'title' },
        ])
    }

    // 校验修改数据
    const checkList = () => {
        let res = ''
        if (!dialogInfo.quantity || dialogInfo.quantity == 0) {
            res = dialogInfo.quantity == 0 ? '外协数量必须输入大于0的数' : '请填写外协数量'
        } else if (dialogInfo.quantity > Number(orderInfo.tempQuantity)) {
            res = '外协数量不可大于' + Number(orderInfo.tempQuantity)
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
        let tempInfo = JSON.parse(JSON.stringify(orderInfo))
        tempInfo.quantity = dialogInfo.quantity
        
        // 修改数量后，计算合计金额
        let resultPrice = Decimal(Number(tempInfo.quantity || 0)).mul(Decimal(Number(tempInfo.price || 0))).toNumber() || 0
        let priceArr = ['mouldCost', 'testFrameCost', 'flyProbeCost', 'engineeringCost', 'sampleCost', 'expeditedCost']
        priceArr.map((field) => {
            resultPrice = Decimal(resultPrice).add(Decimal(Number(tempInfo[field] || 0))).toNumber() || 0
        })
        tempInfo.otherCostList?.length && tempInfo.otherCostList.map((item) => {
            resultPrice = Decimal(resultPrice).add(Decimal(Number(item.price || 0))).toNumber() || 0
        })

        tempInfo.totalPrice = resultPrice
        setOrderInfo(tempInfo)
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
        let params = JSON.parse(JSON.stringify(orderInfo))
        params.confirmRemark = remark
        // params.orderDetailBoList = list
        // params.orderDetailVoList = undefined
        // delete params.orderDetailVoList
        setLoading(true)
        confirmOrderAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=5&title=订单外协合同&isReview=2`)
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
            <NavBar color={'#333'} title={'合同详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View>

            <GStep list={['下外协合同','合同确认','合同签字']} current={orderInfo?.confirmStatus == 3 ? 3 : 1}></GStep>
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
                    {orderInfo?.confirmStatus != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(orderInfo)}>
                        <View className='primary-edit'></View>
                        <View className='common-item-btn-plain-text'>修改</View>
                    </View>}
                </View>

                <View className='common-between half'>
                    <View className='common-item' onClick={() => openRecord(orderInfo, 'quantity', '外协数量')}>
                        <View className={`common-item-label ${orderInfo?.recordFields?.length && orderInfo.recordFields.includes('quantity') && 'change'}`}>外协数量</View>
                        <View className={`common-item-value ${orderInfo?.recordFields?.length && orderInfo.recordFields.includes('quantity') && 'change'}`}>{orderInfo?.quantity}
                            <View className='common-item-unit'>PCS</View>
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>下单人</View>
                        <View className='common-item-value'>{orderInfo?.submitUserName}</View>
                    </View>
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
                    <View className='common-item-label'>供应商</View>
                    <View className='common-item-value'>{orderInfo?.supplierName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>要求交期</View>
                    <View className='common-item-value'>{orderInfo?.deliverTime}</View>
                </View>

                <DetailUpload moduleCode={4} code={orderInfo?.code} id={orderInfo?.id} uploadImg={uploadImg}></DetailUpload>
            </View>
            
            {/* {list?.length ? list.map((item, index) => {
                return ( */}
            <View className='common-card'>
                <View className='common-index'>{1}</View>

                <View className='common-item'>
                    <View className='common-item-label'>产品编码</View>
                    <View className='common-item-value'>{orderInfo?.commodityCode}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>外协单价</View>
                    <View className='common-item-value'>{orderInfo?.price}
                        <View className='common-item-unit f-w-4'>元/PCS</View>
                    </View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>合计金额</View>
                    <View className='common-item-value'>{orderInfo?.totalPrice}
                        <View className='common-item-unit f-w-4'>元</View>
                    </View>
                </View>
                <View className='common-item border-bottom'>
                    <View className='common-item-label'>平米价</View>
                    <View className='common-item-value'>{orderInfo?.areaPrice}
                        <View className='common-item-unit f-w-4'>元/㎡</View>
                    </View>
                </View>

                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>板材</View>
                        <View className='common-item-value'>{orderInfo?.materialQuality}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>成品板厚</View>
                        <View className='common-item-value'>{orderInfo?.commodityThickness}</View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>外层铜厚</View>
                        <View className='common-item-value'>{orderInfo?.materialCopperOutside}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>内层铜厚</View>
                        <View className='common-item-value'>{orderInfo?.materialCopperInside}</View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>联片方式</View>
                        <View className='common-item-value'>{orderInfo?.unitedWayLength}*{orderInfo?.unitedWayWidth}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>联片尺寸</View>
                        <View className='common-item-value'>{orderInfo?.unitedLength}<View className='common-item-unit f-w-4'>mm</View>*{orderInfo?.unitedWidth}
                            <View className='common-item-unit f-w-4'>mm</View>
                        </View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>阻焊颜色</View>
                        <View className='common-item-value'>{orderInfo?.commoditySolder}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>字符颜色</View>
                        <View className='common-item-value'>{orderInfo?.characterColor}</View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>成形方式</View>
                        <View className='common-item-value'>{orderInfo?.commodityForm}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>测试方式</View>
                        <View className='common-item-value'>{orderInfo?.commodityTestWay}</View>
                    </View>
                </View>
                <View className='common-item border-bottom'>
                    <View className='common-item-label'>总孔数</View>
                    <View className='common-item-value'>{orderInfo?.holeCount}</View>
                </View>

                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>模具费</View>
                        <View className='common-item-value'>{orderInfo?.mouldCost}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>测试架费</View>
                        <View className='common-item-value'>{orderInfo?.testFrameCost}</View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>飞针费</View>
                        <View className='common-item-value'>{orderInfo?.flyProbeCost}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>工程费</View>
                        <View className='common-item-value'>{orderInfo?.engineeringCost}</View>
                    </View>
                </View>
                <View className='common-between half'>
                    <View className='common-item'>
                        <View className='common-item-label'>样板费</View>
                        <View className='common-item-value'>{orderInfo?.sampleCost}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>加急费</View>
                        <View className='common-item-value'>{orderInfo?.expeditedCost}</View>
                    </View>
                </View>
                <View className='common-between fixed-half'>
                    {
                        orderInfo?.otherCostList?.length ? orderInfo.otherCostList.map((item) => {
                            return (
                                <View className='common-item'>
                                    <View className='common-item-label'>{item?.title}</View>
                                    <View className='common-item-value'>{item?.price}</View>
                                </View>
                            )
                        }) : <></>
                    }
                    {/* <View className='common-item'>
                        <View className='common-item-label'>费用1</View>
                        <View className='common-item-value'>{orderInfo?.totalPrice}</View>
                    </View> */}
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
                {/* )
            }) : <></>} */}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label m-t-4'>确认备注</View>
                    {orderInfo?.confirmStatus != 3 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value m-t-4'>{remark}</View>}
                </View> 
            </View>

            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=5&title=订单外协合同&isReview=1`)}>预览合同</AtButton>
                {orderInfo?.confirmStatus != 3 ? <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>确认合同</AtButton> : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View>

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='number' maxLength={15} title='外协数量' value={dialogInfo.quantity} placeholder={dialogInfo.open ? '请填写外协数量' : ''} onChange={(e) => updateData([{ value: e, field: 'quantity' }])}></AtInput>
                    {/* <AtInput className='input-content-gray new' type='digit' title='单价' value={dialogInfo.price} placeholder='请填写单价' onChange={(e) => updateData([{ value: e, field: 'price' }])}></AtInput> */}
                    {/* <Picker mode='date' onChange={(e) => updateData([{ value: e?.detail?.value, field: 'deliverTime' }])}>
                        <AtInput disabled className='input-content-gray new' title='交货日期' value={dialogInfo.deliverTime} placeholder='请选择交货日期'></AtInput>
                    </Picker> */}
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>

            <GShareFile ref={GShareFileRef}></GShareFile>
            <GFeedback></GFeedback>
        </View>
    )
}