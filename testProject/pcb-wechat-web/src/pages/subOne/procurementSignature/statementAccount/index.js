import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import Search from '../../../../components/search'
import { View, ScrollView } from '@tarojs/components'
import GTag from '../../../../components/g-tag/index'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import GFeedback from '../../../../components/g-feedback'
import GDownList from '../../../../components/g-down-list'
import GDrawerFilter from '../../../../components/g-drawer-filter'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { confirmListV2API, accountOrderCountAPI } from '../../../services/materialRequisition/index'

export default function ProcurementSignatureStatementAccount() {
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
    const tagList = [
        { id: '0', name: '全部' },
        { id: '1', name: '未对账' },
        { id: '9', name: '调整中' },
        { id: '2', name: '对账完成' },
    ]
    const initQuery = {
        code: '',
        pageNum: 1,
        pageSize: 10,
        ownerName: '',
        supplierName: '',
        accountStatus: '0', // 确认状态（1待确认 3已确认）
        accountMonthQuery: '',
    }
    const searchRef = useRef()
    const scrollRef = useRef()
    const GDownListRef = useRef()
    const GDrawerFilterRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [query, setQuery] = useState(initQuery)
    const [status, setStatus] = useState('loading')
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [countInfo, setCountInfo] = useState({
        '0': 0,
        '1': 0,
        '9': 0,
        '2': 0,
    })
    const formList = [
        {
            type: 'tag',
            data: tagList,
            title: '单据状态',
            field: 'accountStatus',
            value: tagList.find((f) => f.id == initQuery?.accountStatus),
        },
        {
            value: '',
            type: 'input',
            title: '供方名称',
            field: 'supplierName',
            attrs: {
              maxLength: '50',
              placeholder: '请输入供方名称',
            }
        },
        {
            value: '',
            type: 'input',
            title: '需方名称',
            field: 'ownerName',
            attrs: {
              maxLength: '50',
              placeholder: '请输入需方名称',
            }
        },
        {
            value: '',
            type: 'date',
            title: '对账月份',
            dateType: 'month',
            field: 'accountMonthQuery',
            attrs: {
              placeholder: '请选择对账月份',
            }
        },
    ]
    useLoad(() => {
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useDidShow(() => {
        // getAuditList([{ value: 1, field: 'pageNum' }])
        const isRefresh = Taro.getStorageSync('isRefresh')
        if (isRefresh) {
            // setList([])
            getAuditList([{ value: 1, field: 'pageNum' }])
            Taro.removeStorageSync('isRefresh')
        }
    })
    useShareAppMessage(() => {
        return {
          title: '采购对账单',
          path: '/pages/index/index'
        }
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let crtTag = tagList[e]
        // setTagInfo(crtTag)
        getAuditList([{ value: 1, field: 'pageNum' },{ value: crtTag?.id, field: 'accountStatus' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        console.log(e)
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e?.value, field: 'code' }]
        getAuditList(tempList)
    }

    // 判断是否有搜索条件
    const isSearch = () => {
        return !!(!['0'].includes(query?.accountStatus + '') || query?.ownerName || query?.supplierName || query?.accountMonthQuery)
    }
    // 打开抽屉
    const openFilter = () => {
        // console.log(query)
        GDrawerFilterRef.current.openFilter({
            ownerName: query.ownerName,
            supplierName: query.supplierName,
            accountMonthQuery: query.accountMonthQuery,
            accountStatus: tagList.find((f) => f.id == query.accountStatus),
        }, '筛选')
    }
    // 筛选弹框确认
    const confirmHandle = (val) => {
        // console.log(val)
        let tempList = [
            { value: 1, field: 'pageNum' },
            { value: val.ownerName || '', field: 'ownerName' },
            { value: val.supplierName || '', field: 'supplierName' },
            { value: val.accountStatus?.id, field: 'accountStatus' },
            { value: val.accountMonthQuery || '', field: 'accountMonthQuery' },
        ]
        setCurrent(tagList.findIndex((f) => f.id == val.accountStatus?.id) || 0)
        getAuditList(tempList)
    }
    // 筛选弹框重置
    const resetHandle = () => {
        searchRef.current.clear({value: ''})
        // setQuery(initQuery)
        let tempList = [
            { value: '', field: 'code' },
            { value: 1, field: 'pageNum' },
            { value: '', field: 'ownerName' },
            { value: '', field: 'supplierName' },
            { value: '0', field: 'accountStatus' },
            { value: '', field: 'accountMonthQuery' },
        ]
        setCurrent(0)
        getAuditList(tempList)
    }

    // 选择卡片
    const chooseTag = (item) => {
        // setTagInfo(item)
        const tempList = [{ value: 1, field: 'pageNum' },{ value: item.id || '', field: 'accountStatus' }]
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
    const accountOrderCount = (tempParams) => {
        return new Promise((resolve, reject) => {
            let params = JSON.parse(JSON.stringify(tempParams))
            delete params?.pageNum
            delete params?.pageSize
            delete params?.accountStatus
            accountOrderCountAPI(params).then((res) => {
                if (res.code == 200) {
                    if (res.data) {
                        setCountInfo(res.data)
                    }
                    resolve(true)
                } else reject(res)
            }).catch((err) => reject(err))
        })
    }

    // 获取列表数据
    const getAuditList = (arr) => {
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
        if (params?.code) {
            params.codeOrSupplierName = params.code
        }
        delete params.code
        if (params?.accountStatus == 0) {
            delete params?.accountStatus
        }
        // console.log(params)
        accountOrderCount(params)
        confirmListV2API(params).then((res) => {
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
        item.bizId = item.id
        GDownListRef.current?.openFile(e, item, '4')
    }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 跳转到详情
    const toDetail = (id, accountStatus) => {
        Taro.navigateTo({ url: `detail/index?id=${id}&type=4` })
    }
    return (
        <View className='statement-page'>
            {/* <CSearch placeholder={'对账单号/供应商名称'} search={(e) => searchHandle(e)} type={4} scanPath={`/pages/reviewPdf/index`} params={`&type=4&title=对账单&isReview=2&code=''`} scanError="订单不存在"></CSearch> */}
            <View className='page-top-search'>
                <Search
                    tag={<></>}
                    time={<></>}
                    select={<></>}
                    ref={searchRef}
                    onChange={searchHandle}
                    placeholder={'搜索供方/需方/采购单号'}
                    inputChange={(e) => updateData([{ value: e, field: 'code' }])}
                    btn={
                        <View className={`flex flex-center search-com-btn ${isSearch() && 'primary-color'}`} onClick={openFilter}>
                            <View className={isSearch() ? 'primary-filter' : 'primary-filter-init'}></View>
                            <View>筛选</View>
                        </View>
                    }
                ></Search>
                <AtTabs
                    scroll
                    animated={false}
                    current={current}
                    className='new no-body'
                    tabList={tagList.map((m) => {
                        return {
                            title: `${m.name}(${countInfo[m.id] || 0})`
                        }
                    })}
                    onClick={handleClick}>
                </AtTabs>
            </View>

            {/* {current == 2 ? <View style={`padding: 0 32rpx;`}>
                <GTag tagInfo={tagInfo} list={tagList} choose={(item) => chooseTag(item)}></GTag>
            </View> : <></>} */}

            <ScrollView ref={scrollRef} lowerThreshold={150} className={`statement-box list-no-scroll ${current == 2 && 'contract-has-tag'}`} scrollY onScrollToLower={scrolltolower} scrollIntoView={scrollIntoId} onScroll={scrollHandle}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 ? 'top' : `top${index}`} className='common-card new' onClick={() => toDetail(item.id, item.accountStatus)}>
                                <View className={`${
                                    item?.accountStatus == 1 ? 'red' :
                                    item?.accountStatus == 9 ? 'yellow' :
                                    item?.accountStatus == 2 ? 'green' : ''} common-position-tip`
                                }>{
                                    item?.accountStatus == 1 ? '未对账' :
                                    item?.accountStatus == 9 ? '调整中' :
                                    item?.accountStatus == 2 ? '对账完成' : ''
                                }</View>
                                <View className='common-item new head'>
                                    <View className='common-title has-position flex flex-start'>
                                        <View className='common-type m-r-10'>{item?.supplierSwitch == '1' ? '协同' : '普通'}</View>
                                        {item?.code}
                                    </View>
                                </View>

                                <View className='common-item new'>
                                    <View className='common-item-label'>供方</View>
                                    <View className='common-item-value'>{item?.supplierName}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>需方</View>
                                    <View className='common-item-value'>{item?.ownerName}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>对账月份</View>
                                    <View className='common-item-value'>{item?.accountMonth}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>账单周期</View>
                                    <View className='common-item-value'>{item?.accountPeriod}</View>
                                </View>
                                <View className='common-item new'>
                                    <View className='common-item-label'>账单金额</View>
                                    <View className='common-item-value'>{item?.payPayablePrice}元</View>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>

            <GDrawerFilter newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle}></GDrawerFilter>
            <GDownList ref={GDownListRef} moduleCode='8'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}
