import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import { priceFormat } from '../../../util/func'
import Search from '../../../../components/search'
import { View, Text, ScrollView } from '@tarojs/components'
import GPriceList from '../../../../components/g-price-list'
import GDrawerFilter from '../../../../components/g-drawer-filter'
import { wxOrderListAPI } from '../../../services/saleContract/index'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtTabs, AtIcon, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import GFeedback from '../../../../components/g-feedback'

export default function PcbProgress() {
    const modelList = [
        {id: 0, name: '全部'},
        {id: 1, name: '批量'},
        {id: 2, name: '样品'},
    ]
    const progressFlowStatusList = [
        { id: 0, name: '全部', class: '' },
        // { id: 1, name: '已下单', class: '' },
        { id: 2, name: '制作MI', class: 'orange' },
        { id: 3, name: '生产中', class: '' },
        { id: 5, name: '发货中', class: 'gray' },
        { id: 4, name: '已完成', class: 'green' },
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
        model: 0,
        pageNum: 1,
        pageSize: 10,
        progressQuery: '',
        placeOrderTimeEnd: '',
        progressFlowStatus: '', // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认合同 3确认记录
        placeOrderTimeStart: halfYear,
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
    const [showPrice, setShowPrice] = useState(false)
    const [tagList, setTagList] = useState(progressFlowStatusList) // 得在tagInfo上面，不然报错
    const [tagInfo, setTagInfo] = useState(tagList[0])
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const formList = [
        {
            endClear: true,
            title: '下单日期',
            type: 'timeRange',
            startClear: false,
            field: 'orderTime',
            value: [halfYear, ''],
            disabledStart: halfYear,
        },
        {
            type: 'tag',
            field: 'model',
            data: modelList,
            title: '订单类型',
            value: modelList.find((f) => f.id == query?.model),
        },
        {
            type: 'tag',
            data: tagList,
            value: tagInfo,
            title: '订单状态',
            field: 'progressFlowStatus',
        },
    ]
    useLoad(() => {
        Taro.removeStorageSync('detailData')
        getAuditList([{ value: 1, field: 'pageNum' }])
        let userInfo = Taro.getStorageSync('__USER_INFO__');
        if (userInfo?.permissions?.length && userInfo.permissions.includes('pcd:ordertracking:showprice')) {
            // 有权限，展示金额
            setShowPrice(true)
        } else {
            setShowPrice(false)
        }
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
          title: '订单追踪',
          path: '/pages/index/index'
        }
    })

    // 返回状态和文案
    const getStatusAndText = (status) => {
        let res = {
            name: '',
            class: '',
        }
        if (!status) return res
        let tempprogressFlowStatusList = progressFlowStatusList
        let tempprogressFlowStatusInfo = tempprogressFlowStatusList.find((f) => f.id == status)
        return tempprogressFlowStatusInfo
    }
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
        if (e.tagInfo) {
            setTagInfo(e.tagInfo)
        }
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e.value || '', field: 'progressQuery' },{ value: e.tagInfo.id || '', field: 'progressFlowStatus' }]
        getAuditList(tempList)
    }

    // 筛选弹框确认
    const confirmHandle = (val) => {
        // console.log('val-', val)
        if (val?.progressFlowStatus) {
            setTagInfo(val.progressFlowStatus)
        }
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val?.model?.id || 0, field: 'model' },
            { value: val?.progressFlowStatus?.id || '', field: 'progressFlowStatus' },
            { value: val?.orderTime?.length >= 2 && val?.orderTime[1] ? val?.orderTime[1] : '', field: 'placeOrderTimeEnd' },
            { value: val?.orderTime?.length >= 1 && val?.orderTime[0] ? val?.orderTime[0] : halfYear, field: 'placeOrderTimeStart' },
        ]
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        setTagInfo(tagList[0])
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: 0, field: 'model' },
            { value: 1, field: 'pageNum' },
            { value: '', field: 'progressQuery' },
            { value: '', field: 'placeOrderTimeEnd' },
            { value: '', field: 'progressFlowStatus' },
            { value: halfYear, field: 'placeOrderTimeStart' },
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
        if (params?.placeOrderTimeEnd) params.placeOrderTimeEnd = dayjs(params?.placeOrderTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
        if (params?.placeOrderTimeStart) {
            params.placeOrderTimeStart = params?.placeOrderTimeStart + ' 00:00:00'
        } else {
            params.placeOrderTimeStart = halfYear + ' 00:00:00'
        }
        if (!params?.model) {
            delete params.model
        }
        wxOrderListAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (params.pageNum != 1) {
                    tempList = list
                }
                res.rows?.length && res.rows.map((m) => {
                    m.showTotal = false
                })
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

    // 控制是否加密金额
    const updateShow = (e, row) => {
        e.stopPropagation()
        const tempList = JSON.parse(JSON.stringify(list))
        tempList.map((m) => {
            // console.log(m, row)
            if (m.id == row.id) {
                m.showTotal = !m.showTotal
            }
        })
        // console.log(tempList)
        setList(tempList)
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
            progressFlowStatus: tagInfo,
            model: modelList.find((f) => f.id == query.model),
            orderTime: [query?.placeOrderTimeStart || halfYear, query?.placeOrderTimeEnd || '']
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
    const toDetail = (e, id) => {
        e.stopPropagation()
        Taro.navigateTo({ url: `/pages/saleContract/index?id=${id}` })
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
                time={<></>}
                select={<></>}
                ref={searchRef}
                tagInfo={tagInfo}
                tagList={tagList}
                onChange={searchHandle}
                placeholder={'产品编号/名称/规格型号'}
                inputChange={(e) => updateData([{ value: e, field: 'progressQuery' }])}
                btn={
                    <View className='flex flex-center primary-color search-com-btn' onClick={openFilter}>
                        <View className='primary-filter'></View>
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
                                <View className={`common-position-tip ${getStatusAndText(item?.progressFlowStatus)?.class}`}>{getStatusAndText(item?.progressFlowStatus)?.name}</View>
                                <View className='common-item border-bottom pcb-head'>
                                    <View className='common-value flex flex-start'>
                                        <View className='primary-tag-gray pcb-tag'>{item?.model == 1 ? '批量' : '样品'}</View>
                                        <View className='pcb-card-name'>{item?.commodityCode}</View>
                                        <View className='primary-copy expend-click' onClick={(e) => copyText(e, item?.commodityCode)}></View>
                                    </View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-value pcb-title' onClick={(e) => toolTipHandle(e, item?.commodityName)}>
                                        <View className='overflow-omit'>{item?.commodityName}</View>
                                    </View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>
                                        <View style={'margin-bottom: 8rpx;'}>{item?.specification}</View>
                                        <View><Text className={getUrgentClass(item?.urgent)}>{item?.urgent}</Text> <Text>{item?.materialQuality}</Text></View>
                                    </View>
                                    <View className='pcb-card-number'>共 {item?.quantity} 片</View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>{dayjs(item?.placeOrderTime).format('YYYY-MM-DD')}</View>
                                </View>

                                <View className='common-item pcb-price'>
                                    <View className='common-item-value'>
                                    {showPrice ? <View className='common-item pcb-price' style="font-size: 28rpx;">
                                        <View className="common-item-price" style="font-size: 28rpx !important;">总金额</View>&nbsp;&nbsp;<View className='common-item-value flex flex-start' style={`font-size: 28rpx !important;`}>
                                            <View style={`${!item.showTotal && 'height: 28rpx;'}`}>
                                            {item.showTotal ? priceFormat(item?.totalPrice) : '******'}
                                            </View>
                                            <View className={`${item.showTotal ? 'primary-show-price' : 'primary-hide-price'} expend-click`} style={'margin-left: 15rpx;'} onClick={(e) => updateShow(e, item)}></View>
                                        </View>
                                    </View> : <></>}
                                    </View>
                                    <AtButton type='primary' className='common-item-btn mini' onClick={(e) => toDetail(e, item.id)}>订单追踪</AtButton>
                                </View>
                                {/* <View className='common-item'>
                                    <View className='common-item-label'>客户物料编码</View>
                                    <View className='common-item-value'>{item?.ownerName}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>客户物料名称</View>
                                    <View className='common-item-value'>{item?.createTime}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>客户PO</View>
                                    <View className='common-item-value'>{item?.addressName}
                                        {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                                    </View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>下单数量</View>
                                    <View className='common-item-value'>{item?.quantity}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>下单时间</View>
                                    <View className='common-item-value'>{item?.placeOrderTime}
                                        <AtButton type='primary' className='common-item-btn mini' onClick={() => toDetail(item.id)}>进度跟踪</AtButton>
                                    </View>
                                </View> */}
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status} noMoreText={query.pageNum == 1 ? '暂无订单' : '只展示近半年的订单'}></AtLoadMore>
            </ScrollView>

            <GPriceList ref={GPriceListRef}></GPriceList>
            <GDrawerFilter formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
            <GFeedback></GFeedback>
        </View>
    )
}