import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import Search from '../../../components/search'
import { View, Text, ScrollView } from '@tarojs/components'
import GDrawerFilter from '../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtTabs, AtIcon, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import GFeedback from '../../../components/g-feedback'
import { sourceOrderProcessRecordAPI } from "../../../pages/services/outSource/receive";

export default function OutSourceRecord() {
    const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
    const initQuery = {
        pageNum: 1,
        pageSize: 50,
        searchValue: '',
        craftName: '',
        createTimeEnd: '',
        createTimeStart: '',
    }
    const scrollRef = useRef()
    const searchRef = useRef()
    const GDrawerFilterRef = useRef()
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoad, setIsLoad] = useState(true)
    const [query, setQuery] = useState(initQuery)
    const [status, setStatus] = useState('loading')
    const [scrollIntoId, setScrollIntoId] = useState('')
    const formList = [
        {
            value: ['', ''],
            title: '操作时间',
            type: 'timeRange',
            field: 'planTime',
            isQuick: true, // 开启时间快捷键
        },
        {
            value: '',
            type: 'input',
            title: '加工工序',
            field: 'craftName',
            attrs: {
              placeholder: '请输入加工工序',
            }
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
          title: '加工记录',
          path: '/pages/index/index'
        }
    })

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e.value || '', field: 'searchValue' }]
        getAuditList(tempList)
    }

    // 判断是否有搜索条件
    const isSearch = () => {
        return !!(query?.craftName || query?.createTimeEnd || query?.createTimeStart)
    }
    // 筛选弹框确认
    const confirmHandle = (val) => {
        // console.log(val)
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val.craftName, field: 'craftName' },
            
            { value: val?.planTime?.length >= 2 && val?.planTime[1] ? val?.planTime[1] : '', field: 'createTimeEnd' },
            { value: val?.planTime?.length >= 1 && val?.planTime[0] ? val?.planTime[0] : '', field: 'createTimeStart' },
        ]
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: '', field: 'searchValue' },
            { value: '', field: 'craftName' },
            { value: '', field: 'createTimeEnd' },
            { value: '', field: 'createTimeStart' },
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
        if (params?.createTimeStart) params.createTimeStart = dayjs(params?.createTimeStart).format('YYYY-MM-DD  00:00:00')
        if (params?.createTimeEnd) params.createTimeEnd = dayjs(params?.createTimeEnd).add(1, 'day').format('YYYY-MM-DD  00:00:00')
        sourceOrderProcessRecordAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (params.pageNum != 1) {
                    tempList = list
                }
                tempList = tempList.concat(res.rows || [])
                setList(tempList)
                setTotal(res?.total || 0) // 加工数量合计，而非 有多少条数据
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
        // if (status == 'noMore') {
        //     return;
        // }
        // if (!isLoad) {
        //     return
        // }
        // getAuditList()
    }

    // 打开抽屉
    const openFilter = () => {
        // console.log(query)
        GDrawerFilterRef.current.openFilter({
            craftName: query?.craftName,
            planTime: [query?.createTimeStart || '', query?.createTimeEnd || ''],
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
    return (
        <View className='outsource-record-page'>
            {/* <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认合同' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs> */}

            <View className='page-top-search' style={'padding-bottom: 5rpx;'}>
                <Search
                    tag={<></>}
                    time={<></>}
                    select={<></>}
                    ref={searchRef}
                    onChange={searchHandle}
                    placeholder={'操作人/产品型号'}
                    inputChange={(e) => updateData([{ value: e, field: 'searchValue' }])}
                    btn={
                        <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                            <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                            <View>筛选</View>
                        </View>
                    }
                ></Search>
            </View>

            <View className='primary-color f-s-24 font-weight-600 flex flex-end m-t-20' style={'padding: 0 32rpx;box-sizing: border-box;'}>加工数量合计：{total || 0}</View>
            <ScrollView ref={scrollRef} lowerThreshold={150} scrollIntoView={scrollIntoId} className="outsource-record-box hide-srcoll" scrollY onScrollToLower={scrolltolower} onScroll={scrollHandle}>
                {
                    // [1,2].map((item, index) => {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 ? 'top' : `top${index}`} className='common-card new'>
                                <View className='common-item new'>
                                    <View className='common-item-label'>操作时间</View>
                                    <View className='common-item-value'>{item?.createTime}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>操作人</View>
                                    <View className='common-item-value'>{item?.createByName}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>加工单号</View>
                                    <View className='common-item-value'>{item?.code}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>产品型号</View>
                                    <View className='common-item-value'>{item?.commodityCode}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>工序</View>
                                    <View className='common-item-value'>{item?.craftName}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>加工数量</View>
                                    <View className='common-item-value'>{item?.quantity}</View>
                                </View>
                                {/* <View className={`common-item new ${(item?.auditUserName || item?.auditTime || item?.rejectReason || item?.cancelReason) && 'border-bottom'}`}>
                                    <View className='common-item-label'>创建时间</View>
                                    <View className='common-item-value'>{item?.createTime}</View>
                                </View> */}
                            </View>
                        )
                    })
                }
                {list?.length >= 50 ? <View className='max-data-length-100'>当前最多展示50条</View> : <AtLoadMore status={'nom'} noMoreText={'暂无数据'}></AtLoadMore>}
            </ScrollView>

            <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
            <GFeedback></GFeedback>
        </View>
    )
}