import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import GDownList from '../../../../components/g-down-list'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { confirmListAPI } from '../../../services/materialRequisition/index'
import GFeedback from '../../../../components/g-feedback'

export default function OutsourceSignatureStatementAccount() {
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
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        pageSize: 30,
        confirmStatus: 1, // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认对账单 3确认记录
    })
    useLoad(() => {})
    useDidShow(() => {
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useShareAppMessage(() => {
        return {
          title: current == 0 ? '待确认对账单' : '确认记录',
          path: '/pages/index/index'
        }
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待确认对账单'
        } else if (e == 1) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? 1 : 3, field: 'confirmStatus' }])
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
        // params.confirmStatus = current + 2
        // console.log(params)
        params.type = 1 // 类型（1：订单外协、2：采购、5：外协加工）），
        confirmListAPI(params).then((res) => {
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

    // // 获取文件列表
    // const getFileList = (code) => {
    //     Taro.showLoading({ title: '加载中...' })
    //     return listMaterialFileAPI({bizCode: code}).finally(() => {
    //         Taro.hideLoading()
    //     })
    // }
    // 打开文件列表
    const openFile = async (e, item) => {
        e.stopPropagation()
        item.bizId = item.id
        GDownListRef.current?.openFile(e, item, '8')
    }

    // 跳转到详情
    const toDetail = (id, confirmStatus) => {
        Taro.navigateTo({ url: `/pages/reviewPdf/index?id=${id}&type=8&title=对账单&isReview=2&code=''` })
    }
    return (
        <View className='statement-page'>
            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认对账单' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            <CSearch placeholder={'对账单号'} search={(e) => searchHandle(e)} type={8} scanPath={`/pages/reviewPdf/index`} params={`&type=8&title=对账单&isReview=2&code=''`} scanError="订单不存在"></CSearch>

            <ScrollView ref={scrollRef} lowerThreshold={150} className="statement-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id, item.confirmStatus)}>
                                {item?.confirmStatus == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                                <View className='common-item head'>
                                    <View className='common-title'>{item?.code}</View>
                                    <View className='primary-right'></View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-label'>供应商</View>
                                    <View className='common-item-value'>{item?.supplierName}</View>
                                </View>
                                <View className='common-between'>
                                    <View className='common-item'>
                                        <View className='common-item-label'>剩余应收金额</View>
                                        <View className='common-item-value'>{item?.remainPayablePrice}</View>
                                    </View>
                                    <View className='common-item'>
                                        <View className='common-item-label'>对账人</View>
                                        <View className='common-item-value'>{item?.createByName}</View>
                                    </View>
                                </View>

                                <View className='common-item'>
                                    <View className='common-item-label'>折扣金额</View>
                                    <View className='common-item-value'>{item?.accountDiscountPrice}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>对账金额</View>
                                    <View className='common-item-value'>{item?.accountPrice}</View>
                                </View>

                                {/* <View className='common-between half'> */}
                                <View className='common-item'>
                                    <View className='common-item-label'>对账月份</View>
                                    <View className='common-item-value'>{dayjs(item?.accountMonth).format('YYYY-MM')}</View>
                                </View>
                                <View className='common-item mini'>
                                    <View className='common-item-label'>对账日期</View>
                                    <View className='common-item-value'>{dayjs(item?.accountTime).format('YYYY-MM-DD')}
                                        {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                                    </View>
                                </View>
                                {/* </View> */}
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>

            <GDownList ref={GDownListRef} moduleCode='8'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}