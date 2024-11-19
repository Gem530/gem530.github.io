import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import Search from '../../components/search'
import { priceFormat } from '../../pages/util/func'
import GPriceList from '../../components/g-price-list'
import { View, Text, ScrollView } from '@tarojs/components'
import GDrawerFilter from '../../components/g-drawer-filter'
import { wxOrderListAPI,wxMaterialInTransitListAPI,wxMaterialCategoryListAPI } from '../../pages/services/saleContract/index'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtTabs, AtIcon, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

export default function LandMaterial() {
    const initRecord = {
        id: '',
        code: '',
        list: [],
        open: false,
        title: '文件列表',
    }
    const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
    const initQuery = {
        categoryName: 0,
        pageNum: 1,
        pageSize: 10,
        progressQuery: '',
        deliverTimeEnd: '',
        deliverTimeStart: '',//halfYear
        categoryName:''
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
    const [modelList, setModelList] = useState([])
    const [current, setCurrent] = useState(0)
    const [isLoad, setIsLoad] = useState(true)
    const [query, setQuery] = useState(initQuery)
    const [status, setStatus] = useState('loading')
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const formList = [
        {
            title: '要求交期',
            type: 'timeRange',
            field: 'orderTime',
            value: ['', ''],
        },
        {
            type: 'tag',
            field: 'categoryName',
            data: modelList,
            title: '物料类型',
            value: modelList.find((f) => f.id == query?.categoryName),
        },
    ]
    useLoad(() => {
        Taro.removeStorageSync('detailData')
        getAuditList([{ value: 1, field: 'pageNum' }]);
        
        //获取分类
        getCategoryList();
    })
    useDidShow(() => {
    })
    useShareAppMessage(() => {
        return {
          title: 'PCB订单进度',
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
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e.value || '', field: 'progressQuery' }]
        getAuditList(tempList)
    }

    // 判断是否有搜索条件
    const isSearch = () => {
        return !!(query?.categoryName || query?.deliverTimeEnd || query?.deliverTimeStart)
    }
    // 筛选弹框确认
    const confirmHandle = (val) => {
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val?.categoryName?.id || 0, field: 'categoryName' },
            { value: val?.orderTime?.length >= 2 && val?.orderTime[1] ? val?.orderTime[1] : '', field: 'deliverTimeEnd' },
            { value: val?.orderTime?.length >= 1 && val?.orderTime[0] ? val?.orderTime[0] : '', field: 'deliverTimeStart' },
        ]
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: '', field: 'categoryName' },
            { value: 1, field: 'pageNum' },
            { value: '', field: 'progressQuery' },
            { value: '', field: 'deliverTimeEnd' },
            { value: '', field: 'deliverTimeStart' },
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

    
    // 获取分类列表数据
    const getCategoryList = ()=>{
        let resList = [{id:undefined,name:'全部'}]
        wxMaterialCategoryListAPI().then((res) => {
            if (res.code == 200) {
                res.data?.length && res.data.map((m) => {
                    m.id=m.categoryName;
                    m.name=m.categoryName;
                })
                resList = resList.concat(res.data)
                setModelList(resList || [])
            }
        }).finally(() => {
        })
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
        if (params?.deliverTimeEnd) params.deliverTimeEnd = params?.deliverTimeEnd + ' 23:59:59'
        if (params?.deliverTimeStart) {
            params.deliverTimeStart = params?.deliverTimeStart + ' 00:00:00'
        }
        //  else {
        //     params.deliverTimeStart =  + ' 00:00:00'
        // }
        if (!params?.categoryName) {
            delete params.categoryName
        }
        wxMaterialInTransitListAPI(params).then((res) => {
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
            categoryName: modelList.find((f) => f.id == query.categoryName),
            orderTime: [query?.deliverTimeStart || '', query?.deliverTimeEnd || '']
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
        Taro.navigateTo({ url: `detail/index?id=${id}` })
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
                placeholder={'颜色/名称/规格'}
                inputChange={(e) => updateData([{ value: e, field: 'progressQuery' }])}
                btn={
                    <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                        <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                        <View>筛选</View>
                    </View>
                }
            ></Search>

            <ScrollView ref={scrollRef} scrollIntoView={scrollIntoId} className="pcb-box" scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
                {
                    // [1,2].map((item, index) => {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 ? 'top' : `top${index}`} className='common-card'>
                                <View className='common-item border-bottom pcb-head flex flex-between'>
                                    <View className='common-value flex flex-start'>
                                        <View className='pcb-card-name'>{item?.materialCode}</View>
                                        <View className='primary-copy expend-click' onClick={(e) => copyText(e, item?.materialCode)}></View>
                                    </View>
                                    <View className='pcb-head-time'>{dayjs(item.deliverTime).format('YYYY-MM-DD')}交期</View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-value pcb-title' onClick={(e) => toolTipHandle(e, item?.materialName)}>
                                        <View className='overflow-omit'>{item?.materialName}</View>
                                    </View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>
                                        <View style={'margin-bottom: 8rpx;min-height:24rpx'}>{item?.specification}</View>
                                    </View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>
                                        采购数量&nbsp;&nbsp;{item?.quantity}
                                    </View>
                                </View>
                                <View className='pcb-card-item flex flex-between'>
                                    <View className='common-item-value'>已收数量&nbsp;&nbsp;{item?.receiveQuantity}</View>
                                    <View className='common-item-right color-gray'>在途&nbsp;&nbsp;{Number(item?.inTransitNumber).toFixed(2)}</View>
                                </View>

                                <View className='common-item pcb-price' >
                                    <View className='common-item-value'></View>
                                    <AtButton type='primary' className='common-item-btn mini' onClick={(e) => toDetail(e, item.id)}>进度跟踪</AtButton>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status} noMoreText={query.pageNum == 1 ? '暂无在途物料' : '没有更多了'}></AtLoadMore>
            </ScrollView>

            <GPriceList ref={GPriceListRef}></GPriceList>
            <GDrawerFilter formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
        </View>
    )
}