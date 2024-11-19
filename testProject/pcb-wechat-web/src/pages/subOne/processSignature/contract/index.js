import './index.less'
import dayjs from 'dayjs'
import { useRef, useState, useEffect } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import GSignPop from '../../../../components/g-sign-pop'
import { signListAPI } from '../../../services/signMange'
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { batchConfirmFinishAPI, querySupplierPageListAppAPI } from '../../../services/processOutsource/index'
import GFeedback from '../../../../components/g-feedback'

export default function ProcessSignatureContract() {
    const initRecord = {
        id: '',
        code: '',
        list: [],
        open: false,
        title: '文件列表',
    }
    // 弹框信息
    const initDialog = {
        email: '',
        open: false,
        title: '发送邮箱',
    }
    const scrollRef = useRef()
    const GDownListRef = useRef()
    const GVoucherPopRef = useRef()
    const [list, setList] = useState([])
    const [signs, setSigns] = useState([])
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [checkArray, setCheckArray] = useState([])
    const [checkFlag, setCheckFlag] = useState(false)
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        pageSize: 30,
        confirmStatus: 2, // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认合同 3确认记录
    })
    useLoad(() => { })
    useDidShow(() => {
        // setCheckFlag(false)
        setOpen(false)
        Taro.removeStorageSync('codeList')
        Taro.removeStorageSync('detailData')
        Taro.removeStorageSync('confirmStatus')
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useShareAppMessage(() => {
        return {
            title: current == 0 ? '待确认加工单' : '确认记录',
            path: '/pages/index/index'
        }
    })
    useEffect(() => {
        let tempList = list.filter(item => item.choose == true)
        setCheckArray(tempList)
        // console.log(list, tempList)
    }, [list])

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待确认加工单'
        } else if (e == 1) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' }, { value: e + 2, field: 'confirmStatus' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' }, { value: e, field: 'code' }]
        getAuditList(tempList)
    }

    // 修改数据
    const updateData = (arr, tempType = 'query') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'query') {
            let tempInfo = JSON.parse(JSON.stringify(query))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setQuery(tempInfo)
        } else if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        } else if (tempType == 'dialog') {
            let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setDialogInfo(tempInfo)
        }
    }

    // 获取列表数据
    const getAuditList = (arr) => {
        const params = query
        if (arr?.length) {
            // params
            arr.map((item, index) => {
                params[item.field] = item.value
            })
            updateData(arr)
        }
        if (params.pageNum == 1) {
            setStatus('loading')
        }
        // params.confirmStatus = current + 2
        // console.log(params)
        querySupplierPageListAppAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (params.pageNum != 1) {
                    tempList = list
                }
                res.rows?.length && res.rows.map((item) => {
                    item.choose = false
                })
                tempList = tempList.concat(res.rows || [])
                setList(tempList)
                // setStatus('more')
                if (tempList.length >= res.total) {
                    setStatus('noMore')
                } else {
                    params.pageNum = params.pageNum + 1
                    updateData([{ value: params.pageNum, field: 'pageNum' }])
                }
            }
        })
    }

    // 触底事件
    const scrolltolower = () => {
        if (status == 'noMore') {
            return;
        }
        getAuditList()
    }

    // 打开文件列表
    const openFile = async (e, item) => {
        e.stopPropagation()
        GDownListRef.current?.openFile(e, item, '9')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code)
    }

    // 跳转到详情
    const toDetail = (code, confirmStatus) => {
        Taro.navigateTo({ url: `detail/index?code=${code}&confirmStatus=${confirmStatus}` })
    }

    // 长按开启多选
    const handleLongPress = (e, item) => {
        if (current != 0) return
        setCheckFlag(true)
        let tempList = JSON.parse(JSON.stringify(list))
        let crtTemp = tempList.find((f) => f.code == item.code)
        crtTemp.choose = true
        // console.log(crtTemp, item)
        setList(tempList)
        // chooseHandle(e, item)
    }
    // 点击选择
    const chooseHandle = (e, item) => {
        e.stopPropagation();
        let tempList = JSON.parse(JSON.stringify(list))
        let crtTemp = tempList.find((f) => f.code == item.code)
        crtTemp.choose = !crtTemp.choose
        // console.log(crtTemp, item)
        setList(tempList)
    }
    // 打开签名弹框
    const openSign = () => {
        setOpen(true)
        Taro.showLoading({mask: true})
        signListAPI().then((res) => {
            if (res.code == 200) {
                setSigns(res.data || [])
            }
        }).finally(() => Taro.hideLoading())
    }
    // 选择签名
    const onChoose = (item) => {
        // console.log(item)
        let params = {
            flagSave: '0',
            imageKey: item.key,
            signType: item.signType,
            codeList: checkArray.map((m) => m.code),
        }
        Taro.showLoading({mask: true})
        batchConfirmFinishAPI(params).then((res) => {
            if (res.code == 200) {
                setOpen(false)
                getAuditList([{ value: 1, field: 'pageNum' }])
                Taro.showToast({ title: '签名成功', icon: 'success' })
            } else Taro.hideLoading()
        }).catch(() => Taro.hideLoading())
    }
    // 确认选择
    const confirmChoose = () => {
        if (!checkFlag) return
        if (!checkArray?.length) {
            Taro.showToast({ title: '请选择加工单', icon: 'error' })
            return
        }
        // console.log('确认选择', checkArray, list)
        // batchConfirmFinishAPI({})
        openSign()
    }
    // 取消选择
    const cancelChoose = () => {
        let tempList = JSON.parse(JSON.stringify(list))
        tempList.map((item) => {
            item.choose = false
        })
        setList(tempList)
        setCheckFlag(false)
        // console.log('取消选择', checkArray, list, tempList)
    }
    // 全选
    const chooseAll = () => {
        if (checkArray.length != list.length) {
            // 开启选中
            setCheckFlag(true)
        }
        let tempList = JSON.parse(JSON.stringify(list))
        tempList.map((item) => {
            if (checkArray.length == list.length) {
                // 取消全选
                item.choose = false
            } else {
                // 全部选中
                item.choose = true
            }
        })
        setList(tempList)
    }
    return (
        <View className='contract-page'>
            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认加工单' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            <CSearch placeholder={'外协单号'} search={(e) => searchHandle(e)} type={9} scanPath="detail/index" scanError="订单不存在"></CSearch>

            <ScrollView ref={scrollRef} lowerThreshold={150} className="contract-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.code, item.confirmStatus)} onLongPress={(e) => handleLongPress(e, item)}>
                                {item?.confirmStatus == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                                <View className='common-item head'>
                                    {current == 0 && checkFlag ? 
                                        <View onClick={(e) => chooseHandle(e, item)} className={`common-title-choose ${item.choose ? 'primary-choose-active' : 'primary-choose'}`}></View> :
                                        <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                                    }
                                    <View className='common-title'>{item.code}</View>
                                    <View className='primary-right'></View>
                                </View>

                                <View className='common-between'>
                                    <View className='common-item'>
                                        <View className='common-item-label'>接单数量</View>
                                        <View className='common-item-value'>{item?.quantity}</View>
                                    </View>
                                    <View className='common-item'>
                                        <View className='common-item-label'>申请人</View>
                                        <View className='common-item-value'>{item?.createByName}</View>
                                    </View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-label'>供应商</View>
                                    <View className='common-item-value'>{item?.supplierName}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>下单公司</View>
                                    <View className='common-item-value'>{item?.ownerName}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>接收地址</View>
                                    <View className='common-item-value'>{item?.deliveryAddress}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>外协日期</View>
                                    <View className='common-item-value'>{item?.createTime}
                                        {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
                <View className='empty-view'></View>
            </ScrollView>

            {current == 0 && <View className='common-confirm-btn'>
                <View className='common-btn-box flex flex-start'>
                    <View className='common-btn-confirm flex flex-center flex-column' onClick={confirmChoose}>
                        <View className='common-btn-confirm-text flex flex-center'>全部确定{checkFlag && <View className='common-btn-confirm-num'>（{checkArray?.length}）</View>}</View>
                        {!checkFlag && <View className='common-btn-confirm-tip'>长按外协卡可多选</View>}
                    </View>
                    {checkFlag && <View className='common-btn-cancel flex flex-center flex-column' onClick={cancelChoose}>
                        <View className={`common-btn-cancel-icon`}></View>
                        <View className='common-btn-choose-text'>取消多选</View>
                    </View>}
                </View>
                <View className='common-btn-right flex flex-center flex-column' onClick={chooseAll}>
                    <View className={`common-btn-choose ${checkArray?.length > 0 && list?.length > 0 && checkArray.length == list.length ? 'primary-choose-active' : 'primary-choose'}`}></View>
                    <View className='common-btn-choose-text'>全选</View>
                </View>
            </View>}

            <GVoucherPop ref={GVoucherPopRef}></GVoucherPop>

            <GDownList ref={GDownListRef} moduleCode='16'></GDownList>

            <GSignPop list={signs} open={open} type={91} codeList={checkArray.map((m) => m.code)} onClose={() => setOpen(false)} onChoose={onChoose}></GSignPop>
            <GFeedback></GFeedback>
        </View>
    )
}