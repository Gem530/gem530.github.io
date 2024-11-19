import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import Search from '../../components/search'
import { priceFormat } from '../../pages/util/func'
import GPriceList from '../../components/g-price-list'
import { View, Text, ScrollView } from '@tarojs/components'
import GDrawerFilter from '../../components/g-drawer-filter'
import { signListAppAPI } from '../../pages/services/saleContract/index'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtTabs, AtIcon, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import GFeedback from '../../components/g-feedback'

export default function DeliveryOrder() {
    const isCallbackList = [
        {id: -1, name: '全部'},
        {id: 1, name: '已回签'},
        {id: 0, name: '待回签'},
    ]
    const initRecord = {
        id: '',
        code: '',
        list: [],
        open: false,
        title: '文件列表',
    }
    const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
    const initQuery = {
        code: '',
        pageNum: 1,
        pageSize: 10,
        isCallback: -1,
        signTimeEnd: '',
        signTimeStart: '',
        deliveryTimeEnd: '',
        deliveryTimeStart: '',
    }
    // 弹框信息
    const initDialog = {
        email: '',
        open: false,
        title: '发送邮箱',
    }
    const scrollRef = useRef()
    const searchRef = useRef()
    const GPriceListRef = useRef()
    const GDrawerFilterRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [isLoad, setIsLoad] = useState(true)
    const [query, setQuery] = useState(initQuery)
    const [status, setStatus] = useState('loading')
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const formList = [
        {
            title: '送货时间',
            type: 'timeRange',
            field: 'deliveryTime',
            value: ['', ''],
        },
        {
            title: '回签时间',
            type: 'timeRange',
            field: 'signbackTime',
            value: ['', ''],
        },
        {
            type: 'tag',
            title: '送货单状态',
            field: 'isCallback',
            data: isCallbackList,
            value: isCallbackList.find((f) => f.id == query?.isCallback),
        },
    ]
    useLoad(() => {
        Taro.removeStorageSync('detailData')
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useDidShow(() => {
        const isRefresh = Taro.getStorageSync('isRefresh')
        if (isRefresh) {
            // setList([])
            getAuditList([{ value: 1, field: 'pageNum' }])
            Taro.removeStorageSync('isRefresh')
        }
    })
    useShareAppMessage(() => {
        return {
          title: '送货单',
          path: '/pages/index/index'
        }
    })

    // 返回加急颜色
    const getUrgentClass = (urgent) => {
        const redList = ['加急8h','加急12h','加急24h']
        const yellowList = ['加急36h','加急48h']
        let res = ''
        if (redList.includes(urgent.toLowerCase())) res = 'pcb-red'
        if (yellowList.includes(urgent.toLowerCase())) res = 'pcb-yellow'
        return res
    }
    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待确认合同'
        } else if (e == 1) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e + 2, field: 'status' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e.value || '', field: 'code' }]
        getAuditList(tempList)
    }

    // 判断是否有搜索条件
    const isSearch = () => {
        return !!(['1','0'].includes((query?.isCallback + '')||'') || query?.deliveryTimeEnd || query?.deliveryTimeStart || query?.signTimeEnd || query?.signTimeStart)
    }
    // 筛选弹框确认
    const confirmHandle = (val) => {
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val.isCallback?.id, field: 'isCallback' },

            { value: val?.signbackTime?.length >= 2 && val?.signbackTime[1] ? val?.signbackTime[1] : '', field: 'signTimeEnd' },
            { value: val?.signbackTime?.length >= 1 && val?.signbackTime[0] ? val?.signbackTime[0] : '', field: 'signTimeStart' },
            
            { value: val?.deliveryTime?.length >= 2 && val?.deliveryTime[1] ? val?.deliveryTime[1] : '', field: 'deliveryTimeEnd' },
            { value: val?.deliveryTime?.length >= 1 && val?.deliveryTime[0] ? val?.deliveryTime[0] : '', field: 'deliveryTimeStart' },
        ]
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: '', field: 'code' },
            { value: 1, field: 'pageNum' },
            { value: -1, field: 'isCallback' },
            { value: '', field: 'signTimeEnd' },
            { value: '', field: 'signTimeStart' },
            { value: '', field: 'deliveryTimeEnd' },
            { value: '', field: 'deliveryTimeStart' },
        ]
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
        setIsLoad(false)
        const params = JSON.parse(JSON.stringify(query))
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
        if (params?.signTimeStart) params.signTimeStart = params?.signTimeStart + ' 00:00:00'
        if (params?.signTimeEnd) params.signTimeEnd = dayjs(params?.signTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
        if (params?.deliveryTimeStart) params.deliveryTimeStart = params?.deliveryTimeStart + ' 00:00:00'
        if (params?.deliveryTimeEnd) params.deliveryTimeEnd = dayjs(params?.deliveryTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
        if (params?.isCallback == -1) {
            params.isCallback = ''
        }
        params.isCallback = params.isCallback + ''
        signListAppAPI(params).then((res) => {
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
                    updateData((arr || []).concat([{ value: params.pageNum, field: 'pageNum' }]))
                }
            }
            if (params.pageNum <= 2) {
                setTimeout(() => {
                    setScrollIntoId('top')
                }, 10)
            }
        }).finally(() => {
            setIsLoad(true)
        })
    }

    // 触底事件
    const scrolltolower = () => {
        if (status == 'noMore') {
            return;
        }
        if (!isLoad) {
            return
        }
        getAuditList()
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

    // 查看订单详情
    const openPrice = (e, row) => {
        e.stopPropagation()
        // console.log('row:', row)
        let params = [
            [
                { label: '成品费用', value: priceFormat(row?.finishedPrice) },
                { label: '模具费', value: priceFormat(row?.mouldCost) },
                { label: '测试架费', value: priceFormat(row?.testFrameCost) },
                { label: '飞针费', value: priceFormat(row?.flyProbeCost) },
                { label: '工程费', value: priceFormat(row?.engineeringCost) },
                { label: '样板费', value: priceFormat(row?.sampleCost) },
                { label: '加急费', value: priceFormat(row?.expeditedCost) },
                { label: '其他费用', value: priceFormat(row?.otherCostTotal) },
            ],
            [
                { label: '总金额（元）', value: priceFormat(row?.totalPrice) },
            ]
        ]
        GPriceListRef.current.openList(params)
    }

    // 打开抽屉
    const openFilter = () => {
        // console.log(query)
        GDrawerFilterRef.current.openFilter({
            isCallback: isCallbackList.find((f) => f.id == query.isCallback),
            signbackTime: [query?.signTimeStart || '', query?.signTimeEnd || ''],
            deliveryTime: [query?.deliveryTimeStart || '', query?.deliveryTimeEnd || ''],
        })
    }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 展示名称
    const toolTipHandle = (e, name) => {
        console.log(e)
        e.stopPropagation()
        Taro.showModal({ content: name, showCancel: false, confirmText: '知道了' })
    }

    // 跳转到详情
    const toDetail = (e, code) => {
        e.stopPropagation()
        Taro.navigateTo({ url: `detail/index?code=${code}` })
    }
    return (
        <View className='pcb-page'>
            {/* <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认合同' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs> */}

            <Search
                tag={<></>}
                time={<></>}
                select={<></>}
                ref={searchRef}
                onChange={searchHandle}
                placeholder={'送货单号/物流编码'}
                // placeholder={'产品编码/产品名称/规格型号'}
                inputChange={(e) => updateData([{ value: e, field: 'code' }])}
                btn={
                    <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                        <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                        <View>筛选</View>
                    </View>
                }
            ></Search>

            <ScrollView ref={scrollRef} lowerThreshold={150} scrollIntoView={scrollIntoId} className="pcb-box" scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
                {
                    // [1,2].map((item, index) => {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 ? 'top' : `top${index}`} className='common-card'>
                                {item?.isCallback == '1' ? <View className='primary-sign-back primary-card-absolute'></View> : <></>}
                                <View className='common-item border-bottom pcb-head flex flex-between'>
                                    <View className='common-value flex flex-start'>
                                        <View className='pcb-card-name'>{item?.code}</View>
                                        <View className='primary-copy expend-click' onClick={(e) => copyText(e, item?.code)}></View>
                                    </View>
                                    {/* <View className='pcb-head-time'>{dayjs(item.createTime).format('YYYY-MM-DD')}交期</View> */}
                                </View>

                                {/* <View className='common-item'>
                                    <View className='common-item-value pcb-title' onClick={(e) => toolTipHandle(e, item?.commodityName)}>
                                        <View className='overflow-omit'>{item?.commodityName}</View>
                                    </View>
                                </View> */}
                                <View className='common-item'>
                                    <View className='common-item-value pcb-title'>
                                        <View style={'flex: 1;'}>{item?.logisticsCompany}&nbsp;&nbsp;{item?.logisticsNo}</View>
                                    </View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>
                                        <View style={'flex: 1;'}>送货&nbsp;&nbsp;{item?.quantity}&nbsp;&nbsp;{item?.reserveQuantity ? '备品' : ''}&nbsp;&nbsp;{item?.reserveQuantity}</View>
                                        {/* <View style={'margin-bottom: 8rpx;'}>{item?.specification}</View> */}
                                    </View>
                                    {/* <View className='common-item-right color-gray' style="white-space: nowrap;">送货&nbsp;&nbsp;{item?.deliveryQuantity}</View> */}
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>{item?.deliveryTime}</View>
                                    <View className='common-item-right color-gray'>{item?.signTime ? dayjs(item?.signTime).format('YYYY-MM-DD')+'回签' : ''}</View>
                                </View>

                                <View className='common-item pcb-card-item pcb-price'>
                                    <View style={'flex: 1;'}>
                                        {/* 备品数量&nbsp;&nbsp;{item?.quantity} */}
                                    </View>
                                    <AtButton type='primary' className='common-item-btn mini' onClick={(e) => toDetail(e, item.code)}>送货单详情</AtButton>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status} noMoreText={'暂无送货单'}></AtLoadMore>
            </ScrollView>

            <GPriceList ref={GPriceListRef}></GPriceList>
            <GDrawerFilter formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
            <GFeedback></GFeedback>
        </View>
    )
}