import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { sourceFullProcessDeliveryListAPI } from '../../../services/orderOutsource/index'
import GFeedback from '../../../../components/g-feedback'

export default function OutsourceSignatureDeliveryOrder() {
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
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        status: '1', // 待签收送货列表传'1',已签收列表传'3'
        pageNum: 1,
        pageSize: 30,
    })
    useLoad(() => {})
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useShareAppMessage(() => {
        return {
          title: current == 0 ? '待签收送货单' : '签收记录',
          path: '/pages/index/index'
        }
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待签收送货单'
        } else if (e == 1) {
            title = '签收记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? '1' : '3', field: 'status' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e, field: 'code' }]
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
        if (!params.code) delete params.code
        // console.log(params)
        sourceFullProcessDeliveryListAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (params.pageNum != 1) {
                    tempList = list
                }
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
        GDownListRef.current?.openFile(e, item, '6')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code, item.bizId, '6')
    }

    // 跳转到详情
    const toDetail = (id) => {
        Taro.navigateTo({ url: `detail/index?id=${id}` })
    }
    return (
        <View className='delivery-page'>
            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待签收送货单' },
                    { title: '签收记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            <CSearch placeholder={'送货单号'} search={(e) => searchHandle(e)} type={6} scanPath="detail/index" scanError="订单不存在"></CSearch>

            {/* <View >
            下单公司下单公司下单公司下单公司 <button style={'display: inline; float: right;'}>下载</button>
            </View> */}

            <ScrollView ref={scrollRef} lowerThreshold={150} className="delivery-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id)}>
                                {item?.status == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                                <View className='common-item head'>
                                    <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                                    <View className='common-title'>{item.code}</View>
                                    <View className='primary-right'></View>
                                </View>

                                <View className='common-between'>
                                    <View className='common-item'>
                                        <View className='common-item-label'>送货数量</View>
                                        <View className='common-item-value'>{item?.deliveryQuantity}
                                            <View className='common-item-unit'>PCS</View>
                                        </View>
                                    </View>
                                    <View className='common-item'>
                                        <View className='common-item-label'>送货人</View>
                                        <View className='common-item-value'>{item?.createByName}</View>
                                    </View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-label'>送货日期</View>
                                    <View className='common-item-value'>{item?.deliveryTime}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>供应商</View>
                                    <View className='common-item-value'>{item?.companyName}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>下单公司</View>
                                    <View className='common-item-value'>{item?.company}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>接收地址</View>
                                    <View className='common-item-value'>{item?.deliveryAddress}
                                        {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            
            <GVoucherPop ref={GVoucherPopRef}></GVoucherPop>

            <GDownList ref={GDownListRef} moduleCode='14'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}