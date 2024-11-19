import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import Search from '../../components/search'
import { View, Text, ScrollView } from '@tarojs/components'
import GDrawerFilter from '../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtTabs, AtIcon, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import GFeedback from '../../components/g-feedback'
import { checkPlanListAPI, checkPlanListCountAPI } from '../../pages/services/checkPlan/index'

export default function InventoryCheck() {
    const typeList = [
        {id: 0, name: '全部'},
        {id: 1, name: '成品盘点'},
        {id: 2, name: '物料盘点'},
    ]
    const statusList = [
        {id: 0, name: '全部'},
        {id: 1, name: '待盘点'},
        {id: 2, name: '盘点中'},
        {id: 3, name: '复盘中'},
        {id: 4, name: '审核中'},
        {id: 5, name: '已完成'},
        {id: 6, name: '已作废'},
    ]
    const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
    const initQuery = {
        type: 0,
        status: 0,
        pageNum: 1,
        pageSize: 10,
        planName: '',
        planTimeEnd: '',
        planTimeStart: '',
    }
    // 弹框信息
    const initDialog = {
        email: '',
        open: false,
        title: '发送邮箱',
    }
    // 初始化数量
    const initCounts = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    const scrollRef = useRef()
    const searchRef = useRef()
    const GDrawerFilterRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [isLoad, setIsLoad] = useState(true)
    const [query, setQuery] = useState(initQuery)
    const [status, setStatus] = useState('loading')
    const [counts, setCounts] = useState(initCounts)
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const formList = [
        {
            title: '盘点时间',
            type: 'timeRange',
            field: 'planTime',
            value: ['', ''],
            isQuick: true, // 开启时间快捷键
        },
        {
            type: 'tag',
            field: 'type',
            data: typeList,
            title: '盘点类型',
            value: typeList.find((f) => f.id == initQuery?.type),
        },
        {
            type: 'tag',
            title: '盘点状态',
            field: 'status',
            data: statusList,
            value: statusList.find((f) => f.id == initQuery?.status),
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
          title: '盘点计划',
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
        getAuditList([{ value: 1, field: 'pageNum' },{ value: statusList[e]?.id || 0, field: 'status' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e.value || '', field: 'planName' }]
        getAuditList(tempList)
    }

    // 判断是否有搜索条件
    const isSearch = () => {
        return !!(!['0'].includes(query?.type + '') || !['0'].includes(query?.status + '') || query?.planTimeEnd || query?.planTimeStart)
    }
    // 筛选弹框确认
    const confirmHandle = (val) => {
        // console.log(val)
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val.type?.id, field: 'type' },
            { value: val.status?.id, field: 'status' },
            
            { value: val?.planTime?.length >= 2 && val?.planTime[1] ? val?.planTime[1] : '', field: 'planTimeEnd' },
            { value: val?.planTime?.length >= 1 && val?.planTime[0] ? val?.planTime[0] : '', field: 'planTimeStart' },
        ]
        setCurrent(statusList.findIndex((f) => f.id == val.status?.id) || 0)
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: 0, field: 'type' },
            { value: 0, field: 'status' },
            { value: 1, field: 'pageNum' },
            { value: '', field: 'planName' },
            { value: '', field: 'planTimeEnd' },
            { value: '', field: 'planTimeStart' },
        ]
        setCurrent(0)
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

    // 获取数量
    const checkPlanListCount = (tempParams) => {
        return new Promise((resolve, reject) => {
            let params = JSON.parse(JSON.stringify(tempParams))
            delete params?.status
            checkPlanListCountAPI(params).then((res) => {
                if (res.code == 200) {
                    setCounts(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(false))
        })
    }
    // 获取列表数据
    const getAuditList = async (arr) => {
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
        // 盘点时间不会有 时分秒 ，所以筛选时不传时分秒
        // if (params?.planTimeStart) params.planTimeStart = params?.planTimeStart + ' 00:00:00'
        // if (params?.planTimeEnd) params.planTimeEnd = dayjs(params?.planTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
        if (params?.planTimeEnd) params.planTimeEnd = params?.planTimeEnd
        if (params?.planTimeStart) params.planTimeStart = params?.planTimeStart
        if (params?.type == 0) {
            params.type = ''
        }
        if (params?.status == 0) {
            // 传0报错
            params.status = ''
        }
        params.type = params.type + ''
        params.status = params.status + ''
        try {
            await checkPlanListCount(params)
        } catch (err) {
            console.log('err1', err)
        }
        checkPlanListAPI(params).then((res) => {
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

    // 打开抽屉
    const openFilter = () => {
        // console.log(query)
        GDrawerFilterRef.current.openFilter({
            type: typeList.find((f) => f.id == query.type),
            status: statusList.find((f) => f.id == query.status),
            planTime: [query?.planTimeStart || '', query?.planTimeEnd || ''],
        }, '筛选')
    }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 展示名称
    const toolTipHandle = (e, name) => {
        // console.log(e)
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

            <View className='page-top-search'>
                <Search
                    tag={<></>}
                    time={<></>}
                    select={<></>}
                    ref={searchRef}
                    onChange={searchHandle}
                    placeholder={'搜索盘点单名称'}
                    inputChange={(e) => updateData([{ value: e, field: 'planName' }])}
                    btn={
                        <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                            <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                            <View>筛选</View>
                        </View>
                    }
                ></Search>
                <AtTabs
                    scroll
                    current={current}
                    className='new no-body'
                    tabList={statusList.map((m, mI) => { 
                         return {
                            title: (m?.name || '') + `(${counts[m?.id]})`
                         }
                    })}
                    onClick={handleClick}
                ></AtTabs>
            </View>

            <ScrollView ref={scrollRef} lowerThreshold={150} scrollIntoView={scrollIntoId} className="pcb-box hide-srcoll" scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
                {
                    // [1,2].map((item, index) => {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 ? 'top' : `top${index}`} className='common-card new' onClick={(e) => toDetail(e, item.id)}>
                                <View className={`common-position-tip ${
                                    item?.status == 1 ? 'gray' :
                                    ['2','3','4'].includes(item?.status + '') ? '' :
                                    item?.status == 5 ? 'green' :
                                    item?.status == 6 ? 'red' : ''
                                }`}>{statusList.filter((f) => f.id != 0).find((f) => f.id == item?.status)?.name}</View>
                                <View className='common-item new'>
                                    <View className='common-title has-position flex flex-start' onClick={(e) => toolTipHandle(e, item?.planName)}>
                                        <View className={`primary-sigle-text ${item?.type == 1 ? 'sigle-blue' : 'sigle-yellow'}`} style={'margin-right: 8rpx;'}>{item?.type == 1 ? '成' : '物'}</View>
                                        <View className='overflow-omit'>{item?.planName}</View>
                                    </View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>盘点时间</View>
                                    <View className='common-item-value'>{item?.planTime}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>负责人</View>
                                    <View className='common-item-value'>{item?.headUserName}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>创建人</View>
                                    <View className='common-item-value'>{item?.createByName}</View>
                                </View>
                                <View className={`common-item new ${(item?.auditUserName || item?.auditTime || item?.rejectReason || item?.cancelReason) && 'border-bottom'}`}>
                                    <View className='common-item-label'>创建时间</View>
                                    <View className='common-item-value'>{item?.createTime}</View>
                                </View>

                                {
                                    item?.auditUserName ? <>
                                    <View className={`common-item new`}>
                                        <View className='common-item-label'>审核人</View>
                                        <View className='common-item-value'>{item?.auditUserName}</View>
                                    </View>
                                    </> : <></>
                                }
                                {
                                    item?.auditTime ? <>
                                    <View className={`common-item new`}>
                                        <View className='common-item-label'>审核时间</View>
                                        <View className='common-item-value'>{item?.auditTime}</View>
                                    </View>
                                    </> : <></>
                                }
                                {
                                    (item?.status == 2) && item?.rejectReason ? <>
                                    <View className={`common-item new`}>
                                        <View className='common-item-label'>驳回原因</View>
                                        <View className='common-item-value overflow-two'>
                                            <View className='overflow-two'>{item?.rejectReason}</View>
                                        </View>
                                    </View>
                                    </> : <></>
                                }
                                {
                                    item?.cancelReason ? <>
                                    <View className={`common-item new`}>
                                        <View className='common-item-label'>作废原因</View>
                                        <View className='common-item-value'>
                                            <View className='overflow-two'>{item?.cancelReason}</View>
                                        </View>
                                    </View>
                                    </> : <></>
                                }
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status} noMoreText={'暂无数据'}></AtLoadMore>
            </ScrollView>

            <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
            <GFeedback></GFeedback>
        </View>
    )
}