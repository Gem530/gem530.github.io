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
import { sourceFullProcessDeliveryEditAPI, sourceFullProcessDeliveryDetailAPI } from '../../../../services/orderOutsource/index'
import { AtTabs, AtLoadMore, AtButton, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import GFeedback from '../../../../../components/g-feedback'

export default function OutsourceSignatureContractDetail() {
    // 弹框信息
    const initDialog = {
        id: 0,
        open: false,
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
        sourceFullProcessDeliveryDetailAPI(val || id).then((res) => {
            // console.log(res)
            if (res.code == 200) {
                setOrderInfo(res.data)
                setRemark(res.data?.confirmRemark || '')
                res.data?.outSourceFullProcessDeliveryList?.length && res.data?.outSourceFullProcessDeliveryList.map((item) => {
                    item.tempDeliveryQuantity = item.deliveryQuantity
                })
                setList(res.data?.outSourceFullProcessDeliveryList || [])
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
                        } else if (crtI != -1) {
                            item.value = item.value.substring(0, crtI + 4)
                        } else {
                            item.value = Number(item.value) + ''
                        }
                    }
                }
                if (['deliveryQuantity'].includes(item.field)) {
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

            // 改变数量后，重新统计总数
            let tempOrder = JSON.parse(JSON.stringify(orderInfo))
            let tempQuantity = 0
            tempList.map((item) => {
                tempQuantity = Decimal(Number(tempQuantity || 0)).add(Decimal(Number(item?.deliveryQuantity || 0))).toNumber()
            })
            tempOrder.sumQuantity = tempQuantity
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
            { value: row?.deliveryQuantity, field: 'deliveryQuantity' },
            { value: `修改${row?.commodityCode || ''}数据`, field: 'title' },
        ])
    }

    // 校验修改数据
    const checkList = () => {
        let res = ''
        let params = dialogInfo.params
        let max = (Number(params.quantity || 0) - Number(params.deliverQuantity || 0) + Number(params.tempDeliveryQuantity || 0))
        // console.log(max, dialogInfo.deliveryQuantity, params)
        if (!dialogInfo.deliveryQuantity || dialogInfo.deliveryQuantity == 0) {
            res = dialogInfo.deliveryQuantity == 0 ? '送货数量必须输入大于0的数' : '请填写送货数量'
        } else if (dialogInfo.deliveryQuantity > max) {
            res = `送货数量不能超过${max}`
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
            { value: dialogInfo.deliveryQuantity, field: 'deliveryQuantity' },
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

    // 确定合同
    const confirmOrder = () => {
        // console.log(list, remark, orderInfo)
        let params = JSON.parse(JSON.stringify(orderInfo))
        params.status = '3'
        params.confirmRemark = remark
        params.outSourceFullProcessDeliveryList = list
        // delete params.orderDetailVoList
        setLoading(true)
        sourceFullProcessDeliveryEditAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                if (res.data == true) {
                    toPath(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=6&title=送货单&isReview=2`)
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

                <View className='common-between'>
                    <View className='common-item'>
                        <View className='common-item-label'>送货总量</View>
                        <View className='common-item-value'>{orderInfo?.sumQuantity}
                            <View className='common-item-unit'>PCS</View>
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>送货人</View>
                        <View className='common-item-value'>{orderInfo?.createByName}</View>
                    </View>
                </View>

                <View className='common-item'>
                    <View className='common-item-label'>送货日期</View>
                    <View className='common-item-value'>{orderInfo?.deliveryTime}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>供应商</View>
                    <View className='common-item-value'>{orderInfo?.companyName}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>下单公司</View>
                    <View className='common-item-value'>{orderInfo?.company}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>接收地址</View>
                    <View className='common-item-value'>{orderInfo?.deliveryAddress}</View>
                </View>

                {/* orderInfo?.id 送货单改用bizId查询 */}
                <DetailUpload type='6' moduleCode={14} code={orderInfo?.code} id={orderInfo?.bizId} uploadImg={uploadImg}></DetailUpload>
            </View>
            
            {list?.length ? list.map((item, index) => {
                return (
                <View className='common-card'>
                    <View className='common-index'>{index + 1}</View>

                    <View className='common-item'>
                        <View className='common-item-label'>产品编码</View>
                        <View className='common-item-value'>{item.commodityCode}
                            {orderInfo?.status != 3 && <View className='common-item-btn-plain' onClick={() => openEdit(item)}>
                                <View className='primary-edit'></View>
                                <View className='common-item-btn-plain-text'>修改</View>
                            </View>}
                        </View>
                    </View>                             
                    <View className='common-item border-bottom'>
                        <View className={`common-item-label ${item?.recordFields?.length && item.recordFields.includes('deliveryQuantity') && 'change'}`} onClick={() => openRecord(item, 'deliveryQuantity', '送货数量')}>送货数量</View>
                        <View className={`common-item-value ${item?.recordFields?.length && item.recordFields.includes('deliveryQuantity') && 'change'}`} onClick={() => openRecord(item, 'deliveryQuantity', '送货数量')}>{item.deliveryQuantity}
                            <View className='common-item-unit'>PCS</View>
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>产品名称</View>
                        <View className='common-item-value'>{item.commodityName}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>外协单号</View>
                        <View className='common-item-value'>{item.code}</View>
                    </View>

                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>板材</View>
                            <View className='common-item-value'>{item.materialQuality}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>成品板厚</View>
                            <View className='common-item-value'>{item.commodityThickness}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>外层铜厚</View>
                            <View className='common-item-value'>{item.materialCopperOutside}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>内层铜厚</View>
                            <View className='common-item-value'>{item.materialCopperInside}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>联片方式</View>
                            <View className='common-item-value'>{item.unitedWayLength}*{item.unitedWayWidth}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>联片尺寸</View>
                            <View className='common-item-value'>{item.unitedLength}<View className='common-item-unit f-w-4'>mm</View>*{item.unitedWidth}<View className='common-item-unit f-w-4'>mm</View>
                            </View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>阻焊颜色</View>
                            <View className='common-item-value'>{item.commoditySolder}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>字符颜色</View>
                            <View className='common-item-value'>{item.characterColor}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className='common-item-label'>成形方式</View>
                            <View className='common-item-value'>{item.commodityForm}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>测试方式</View>
                            <View className='common-item-value'>{item.commodityTestWay}</View>
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>总孔数</View>
                        <View className='common-item-value'>{item.holeCount}</View>
                    </View>

                    {/* <View className='common-item'>
                        <View className='common-item-label'>备注</View>
                        <View className='common-item-value'>{item.remark}
                        </View>
                    </View> */}
                </View>)
            }) : <></>}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label m-t-4'>确认备注</View>
                    {orderInfo?.status != 3 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value m-t-4'>{remark}</View>}
                </View> 
            </View>

            <View className='common-bottom-btn'>
                <AtButton loading={loading} disabled={loading} onClick={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=6&title=送货单&isReview=1`)}>预览送货单</AtButton>
                {orderInfo?.status != 3 ? <AtButton loading={loading} disabled={loading} type='primary' onClick={confirmOrder}>签收送货单</AtButton> : <AtButton loading={loading} disabled={loading} type='primary' onClick={saveFile}>发送给好友</AtButton>}
            </View>

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='number' maxLength={15} title='送货数量' value={dialogInfo.deliveryQuantity} placeholder={dialogInfo.open ? '请填写送货数量' : ''} onChange={(e) => updateData([{ value: e, field: 'deliveryQuantity' }])}>
                        <View className='max-unit'>最大值{(Number(dialogInfo?.params?.quantity || 0) - Number(dialogInfo?.params?.deliverQuantity || 0) + Number(dialogInfo?.params?.tempDeliveryQuantity || 0))}</View>
                    </AtInput>
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
            
            <GShareFile ref={GShareFileRef}></GShareFile>
            <GFeedback></GFeedback>
        </View>
    )
}