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
import { getMaterialOrderDetailAPI } from '../../../../services/materialRequisition/index'
import { statementDetailAPI, statementDetailSourceFullAPI, statementDetailSourceHalfAPI } from '../../../../services/statement/index'
import GFeedback from '../../../../../components/g-feedback'

// 同一个页面有多个atmodel时，未打卡时需要消除，否则会出现atinput点击不中
export default function DocumentStatementDetail() {
    const operatRef = useRef(null)
    // 弹框信息
    const initDialog = {
        id: 0,
        price: '',
        open: false,
        quantity: '',
        deliverTime: '',
        title: '修改数据',
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
    useLoad((options) => {
        // console.log('options:', options)
        setOptions(options)
        if (options?.id) {
            setId(options?.id)
            // getMaterialOrderDetail(options?.id)
        }
    })
    useDidShow(() => {
        Taro.removeStorageSync('__Statement__')
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
          title: '单据详情',
          path: '/pages/index/index'
        }
    })

    // 获取详情
    const getMaterialOrderDetail = (val) => {
        setLoading(true)
        getMaterialOrderDetailAPI({ id: val || id, detailStatus: options?.detailStatus }).then((res) => {
            // console.log(res)
            if (res.code == 200) {
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
                    if (['quantity'].includes(item.field)) {
                        item.value = item.value.toString().replaceAll(/\./g, '')
                    }
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
            crtTemp.totalPrice = Decimal(Number(crtTemp?.price || 0)).mul(Decimal(Number(crtTemp?.quantity || 0))).toNumber()
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
            { value: row?.quantity, field: 'quantity' },
            { value: row?.deliverTime, field: 'deliverTime' },
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
            { value: dialogInfo.price, field: 'price' },
            { value: dialogInfo.quantity, field: 'quantity' },
            { value: dialogInfo.deliverTime, field: 'deliverTime' },
        ]
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
        Taro.setStorageSync('__Statement__', '1')
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
        GConfirmRef.current.openConfirm({content: tempType == 1 ? '您是否取消结单？' : '您是否确认结单？'}).then(() => {
            let params = {
                status: tempType,
                confirmRemark: remark,
                idList: list?.length ? list.map((m) => m.id) : [],
            }
            setLoading(true)
            statementDetailAPI(params).then((res) => {
                if (res.code == 200) {
                    // cancelOrderAPI
                    if (options?.companyId || (options?.isRedirect == '1')) {
                        Taro.redirectTo({ url: '/pages/home/home' })
                    } else {
                        Taro.navigateBack({ delta: 1 })
                    }
                    Taro.showToast({ title: tempType == 6 ? '驳回成功' : '结单成功' })
                }
            }).finally(() => setLoading(false))
        })
    }
    return (
        <View className='contract-detail'>
            <NavBar color={'#333'} title={'单据详情'} leftIconType={options?.companyId ? 'home' : 'chevron-left'}></NavBar>
            {/* <View className='common-notice'>
                <View className='primary-notice'></View>
                <View className='common-notice-text'>
                点击高亮（蓝色填充）部分，可<View className='notice-weight'>查看</View>修改记录
                </View>
            </View> */}

            <GStep list={['结单申请','结单确认','结单完成']} current={options?.detailStatus == 2 ? 3 : 1}></GStep>

            <View className='common-card'>
                {options?.detailStatus == 2 && <View className='primary-status-confirm common-status'></View>}

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
                
                <DetailUpload showDocument={true} moduleCode={5} code={orderInfo?.code} id={orderInfo?.id} toDocument={() => previewHandle(`/pages/reviewPdf/index?id=${orderInfo?.id}&type=1&title=采购合同&isReview=1`)}></DetailUpload>
            </View>
            
            {list?.length ? list.map((item, index) => {
                return (
                <View className='common-card'>
                    <View className='common-index'>{index + 1}</View>

                    <View className='common-item'>
                        <View className='common-item-label'>商品名称</View>
                        <View className='common-item-value'>{item.materialName}
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
                        <View className='common-item'>
                            <View className={`common-item-label`}>数量</View>
                            <View className={`common-item-value`}>{item.quantity}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>单位</View>
                            <View className='common-item-value'>{item.units}</View>
                        </View>
                    </View>
                    <View className='common-between half'>
                        <View className='common-item'>
                            <View className={`common-item-label`}>单价</View>
                            <View className={`common-item-value`}>{item.price}</View>
                        </View>
                        <View className='common-item'>
                            <View className='common-item-label'>金额</View>
                            <View className='common-item-value'>{item.totalPrice}</View>
                        </View>
                    </View>

                    <View className='common-item'>
                        <View className={`common-item-label`}>交货日期</View>
                        <View className={`common-item-value`}>{item.deliverTime}</View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>备注</View>
                        <View className='common-item-value'>{item.applyRemark}
                        </View>
                    </View>
                    <View className='common-item'>
                        <View className='common-item-label'>结单备注</View>
                        <View className='common-item-value'>{item.confirmRemark}
                        </View>
                    </View>
                </View>)
            }) : <></>}

            <View className='common-card'>
                <View className='common-item'>
                    <View className='common-item-label'>确认备注</View>
                    {options?.detailStatus != 2 ? <AtTextarea className='common-textarea' placeholderClass='common-textarea-placeholder' height={120} value={remark} onChange={(e) => changeRemark(e)} maxLength={200} placeholder='请填写备注'></AtTextarea> : <View className='common-item-value'>{remark}</View>}
                </View> 
            </View>

            {options?.detailStatus != 2 ? <View className='common-bottom-btn'>
                <AtButton className='error' loading={loading} disabled={loading} onClick={() => finishOrder('1')}>取消结单</AtButton>
                <AtButton loading={loading} disabled={loading} type='primary' onClick={() => finishOrder('2')}>确认结单</AtButton>
            </View> : <></>}

            {/* 修改卡片数据 */}
            <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' type='number' maxLength={15} title='数量' value={dialogInfo.quantity} placeholder={dialogInfo.open ? '请填写数量' : ''} onChange={(e) => updateData([{ value: e, field: 'quantity' }])}></AtInput>
                    <AtInput className='input-content-gray new' type='digit' title='单价' value={dialogInfo.price} placeholder={dialogInfo.open ? '请填写单价' : ''} onChange={(e) => updateData([{ value: e, field: 'price' }])}></AtInput>
                    <Picker mode='date' onChange={(e) => updateData([{ value: e?.detail?.value, field: 'deliverTime' }])}>
                        <AtInput disabled className='input-content-gray new' title='交货日期' value={dialogInfo.deliverTime} placeholder={dialogInfo.open ? '请选择交货日期' : ''}></AtInput>
                    </Picker>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>

            {/* 修改记录 */}
            <GOperat ref={operatRef} open={recordInfo.open} list={recordInfo.list} title={recordInfo.title} onClose={() => updateData([{ value: false, field: 'open' }], 'record')}></GOperat>

            <GConfirm ref={GConfirmRef}></GConfirm>
            <GShareFile ref={GShareFileRef}></GShareFile>
            <GFeedback></GFeedback>
        </View>
    )
}