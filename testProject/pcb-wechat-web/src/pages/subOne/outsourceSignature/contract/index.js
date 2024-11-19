import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
// import GShareFile from '../../../../components/g-share-file'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { listSupplierOrderAPI } from '../../../services/orderOutsource/index'
import { validEmail, uploadFileDeal, downloadImg, downloadFileByKeys } from '../../../util/func'
import { listMaterialFileAPI, uploadMaterialFileAPI } from '../../../services/materialRequisition/index'
import { AtTabs, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import GFeedback from '../../../../components/g-feedback'

export default function OutsourceSignatureContract() {
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
    // const gShareFileRef = useRef()
    const GDownListRef = useRef()
    const GVoucherPopRef = useRef()
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        pageSize: 30,
        confirmStatus: 2, // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认合同 3确认记录
    })
    useLoad(() => {})
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useShareAppMessage(() => {
        return {
          title: current == 0 ? '待确认合同' : '确认记录',
          path: '/pages/index/index'
        }
    })

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
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e + 2, field: 'confirmStatus' }])
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
        listSupplierOrderAPI(params).then((res) => {
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

    const openFile = async (e, item) => {
        e.stopPropagation()
        GDownListRef.current?.openFile(e, item, '5')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code)
    }

    // 跳转到详情
    const toDetail = (id) => {
        Taro.navigateTo({ url: `detail/index?id=${id}` })
    }
    return (
        <View className='contract-page'>
            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认合同' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            <CSearch placeholder={'合同单号'} search={(e) => searchHandle(e)} type={5} scanPath="detail/index" scanError="订单不存在"></CSearch>

            <ScrollView ref={scrollRef} lowerThreshold={150} className="contract-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item, index) => {
                        return (
                            <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id)}>
                                {item?.confirmStatus == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                                <View className='common-item head'>
                                    <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                                    <View className='common-title'>{item.code}</View>
                                    <View className='primary-right'></View>
                                </View>

                                <View className='common-between half'>
                                    <View className='common-item'>
                                        <View className='common-item-label'>外协数量</View>
                                        <View className='common-item-value'>{item?.quantity}
                                            <View className='common-item-unit'>PCS</View>
                                        </View>
                                    </View>
                                    <View className='common-item'>
                                        <View className='common-item-label'>下单人</View>
                                        <View className='common-item-value'>{item?.submitUserName}</View>
                                    </View>
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
                                    <View className='common-item-label'>供应商</View>
                                    <View className='common-item-value'>{item?.supplierName}</View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>单价</View>
                                    <View className='common-item-value'>{item?.price}
                                        <View className='common-item-unit f-w-4'>元/PCS</View>
                                    </View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>平米价</View>
                                    <View className='common-item-value'>{item?.areaPrice}
                                        <View className='common-item-unit f-w-4'>元/㎡</View>
                                    </View>
                                </View>
                                <View className='common-item'>
                                    <View className='common-item-label'>产品编码</View>
                                    <View className='common-item-value'>{item?.commodityCode}
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

            <GDownList ref={GDownListRef} moduleCode='4'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}