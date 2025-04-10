import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import GTag from '../../../../components/g-tag'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
// import GShareFile from '../../../../components/g-share-file'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import ContractCard from '../../procurementSignature/components/contractCard'
import { validEmail, uploadFileDeal, downloadImg, downloadFileByKeys } from '../../../util/func'
import { AtTabs, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { listOrderStatementAPI, listOrderStatementSourceFullAPI, listOrderStatementSourceHalfAPI } from '../../../services/statement/index'
import GFeedback from '../../../../components/g-feedback'

export default function DocumentStatement() {
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
    // const gShareFileRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        pageSize: 30,
        detailStatus: '', // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认合同 3确认记录
    })
    useLoad(() => {})
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        console.log('query', query)
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useShareAppMessage(() => {
        return {
          title: current == 0 ? '待确认单据' : '确认记录',
          path: '/pages/index/index'
        }
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待确认单据'
        } else if (e == 1) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? '' : 2, field: 'detailStatus' }])
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
            // console.log('tempInfo', tempInfo)
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
        const params = JSON.parse(JSON.stringify(query))
        if (arr?.length) {
            // params
            arr.map((item, index) => {
                params[item.field] = item.value
            })
            updateData(arr)
        }
        if (!params?.detailStatus) {
            delete params?.detailStatus
        }
        if (params.pageNum == 1) {
            setStatus('loading')
        }
        // console.log(params)
        listOrderStatementAPI(params).then((res) => {
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
        GDownListRef.current?.openFile(e, item, '1')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code)
    }

    // 跳转到详情
    const toDetail = (id, detailStatus) => {
        Taro.navigateTo({ url: `detail/index?id=${id}&detailStatus=${detailStatus}` })
    }
    return (
        <View className='contract-page'>
            <CSearch placeholder={'单据号'} inputChange={(e) => updateData([{ value: e, field: 'code' }])} search={(e) => searchHandle(e)} type={1} showScan={false}></CSearch>

            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认单据' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            <View style={`padding: 0 32rpx;margin-top: 20rpx;`}><GTag list={[{id: '1', name: '采购'}]} tagInfo={{id: '1', name: '采购'}}></GTag></View>

            {/* <View >
            下单公司下单公司下单公司下单公司 <button style={'display: inline; float: right;'}>下载</button>
            </View> */}

            <ScrollView ref={scrollRef} lowerThreshold={150} className="contract-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id, item?.detailStatus)}>
                                {item?.detailStatus == 2 ? <View className='primary-status-confirm common-status'></View> : <></>}
                                <View className='common-item head'>
                                    <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                                    <View className='common-title'>{item.code}</View>
                                    <View className='primary-right'></View>
                                </View>

                                <View className='common-between'>
                                    <View className='common-item'>
                                        <View className='common-item-label'>订购数量</View>
                                        <View className='common-item-value'>{item?.quantity}</View>
                                    </View>
                                    <View className='common-item'>
                                        <View className='common-item-label'>下单人</View>
                                        <View className='common-item-value'>{item?.submitUserName}</View>
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
                                    <View className='common-item-label'>下单时间</View>
                                    <View className='common-item-value'>{item?.createTime}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>收货地址</View>
                                    <View className='common-item-value'>{item?.addressName}
                                        {/* {item?.detailStatus == 2 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>文件列表</AtButton> : <></>} */}
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>

            <GVoucherPop ref={GVoucherPopRef}></GVoucherPop>

            <GDownList ref={GDownListRef} moduleCode='5'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}