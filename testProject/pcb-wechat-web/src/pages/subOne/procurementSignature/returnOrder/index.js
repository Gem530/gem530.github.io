import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import GTag from '../../../../components/g-tag/index'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import GDownList from '../../../../components/g-down-list'
import ReturnOrderCard from '../components/returnOrderCard'
import GVoucherPop from '../../../../components/g-voucher-pop'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { createSignFileAPI, listMaterialBackAppAPI } from '../../../services/materialRequisition/index'
import GFeedback from '../../../../components/g-feedback'

export default function ProcurementSignatureReturnOrder() {
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
        { id: 0, name: '全部' },
        { id: 1, name: '待对方确认' },
        { id: 3, name: '已确认' },
    ]
    const scrollRef = useRef()
    const GDownListRef = useRef()
    const GVoucherPopRef = useRef()
    // const gShareFileRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [tagInfo, setTagInfo] = useState(tagList[0])
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        pageSize: 10,
        confirmStatus: '2', // 待确认退货单'2',确认记录'3'
    })
    useLoad(() => {
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        Taro.removeStorageSync('confirmStatus')
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
          title: current == 0 ? '待确认退货单' : '确认记录',
          path: '/pages/index/index'
        }
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待确认退货单'
        } else if (e == 1) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? '2' : (tagInfo?.id || ''), field: 'confirmStatus' }])
    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e, field: 'code' }]
        getAuditList(tempList)
    }

    // 选择卡片
    const chooseTag = (item) => {
        setTagInfo(item)
        const tempList = [{ value: 1, field: 'pageNum' },{ value: item.id || '', field: 'confirmStatus' }]
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
        listMaterialBackAppAPI(params).then((res) => {
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
        current == 1 && await createSignFileAPI({code: item.code})
        GDownListRef.current?.openFile(e, item, '3')
    }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.id,item.id)
    }

    // 跳转到详情
    const toDetail = (id, confirmStatus) => {
        Taro.navigateTo({ url: `detail/index?id=${id}&status=${confirmStatus}` })
    }
    return (
        <View className='return-page'>
            <CSearch placeholder={'退货单号'} inputChange={(e) => updateData([{ value: e, field: 'code' }])} search={(e) => searchHandle(e)} type={3} scanPath="detail/index" scanError="订单不存在"></CSearch>

            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认退货单' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            {current == 1 ? <View style={`padding: 0 32rpx;margin-top: 20rpx;`}>
                <GTag tagInfo={tagInfo} list={tagList} choose={(item) => chooseTag(item)}></GTag>
            </View> : <></>}

            {/* <View >
            下单公司下单公司下单公司下单公司 <button style={'display: inline; float: right;'}>下载</button>
            </View> */}

            <ScrollView ref={scrollRef} lowerThreshold={150} className={`return-box list-no-scroll ${current == 1 && 'contract-has-tag'}`} scrollY onScrollToLower={scrolltolower} scrollIntoView={scrollIntoId} onScroll={scrollHandle}>
                {
                    list.map((item, index) => {
                        return (
                            <ReturnOrderCard current={current} item={item} index={index} toDetail={toDetail} openVouch={openVouch} openFile={openFile}></ReturnOrderCard>
                            // <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.code, item.confirmStatus)}>
                            //     {item?.confirmStatus == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                            //     <View className='common-item head'>
                            //         <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                            //         <View className='common-title'>{item.code}</View>
                            //         <View className='primary-right'></View>
                            //     </View>

                            //     <View className='common-item'>
                            //         <View className='common-item-label'>供应商</View>
                            //         <View className='common-item-value'>{item?.supplierName}</View>
                            //     </View>

                            //     <View className='common-item'>
                            //         <View className='common-item-label'>退货数量</View>
                            //         <View className='common-item-value'>{item?.quantity}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>退货公司</View>
                            //         <View className='common-item-value'>{item?.ownerName}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>退货地址</View>
                            //         <View className='common-item-value'>{item?.addressName}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>退货日期</View>
                            //         <View className='common-item-value'>{item?.backTime}
                            //             {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                            //         </View>
                            //     </View>
                            // </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>

            <GVoucherPop ref={GVoucherPopRef}></GVoucherPop>

            <GDownList ref={GDownListRef} moduleCode='10'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}
