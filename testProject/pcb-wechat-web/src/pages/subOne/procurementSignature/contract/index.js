import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import ContractCard from '../components/contractCard'
import GTag from '../../../../components/g-tag/index'
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
// import GShareFile from '../../../../components/g-share-file'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { validEmail, uploadFileDeal, downloadImg, downloadFileByKeys } from '../../../util/func'
import { AtTabs, AtInput, AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { listMaterialFileAPI, uploadMaterialFileAPI, listPurchaseMaterialOrderAPI } from '../../../services/materialRequisition/index'
import GFeedback from '../../../../components/g-feedback'

export default function ProcurementSignatureContract() {
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
        confirmStatus: 2, // 确认状态（1待甲方确认、2待已方确认、3已完成） 2待确认合同 3确认记录
    })
    useLoad(() => {
        getAuditList([{ value: 1, field: 'pageNum' }])
    })
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        console.log('query', query)
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
          title: current == 0 ? '待确认合同' : current == 1 ? '取消待确认' : '确认记录',
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
            title = '取消待确认'
        } else if (e == 2) {
            title = '确认记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? 2 : e == 1 ? 8 : (tagInfo?.id || ''), field: 'confirmStatus' }])
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
        // params.confirmStatus = params.confirmStatus+''
        if (params.confirmStatus == 8) {
            delete params.confirmStatus
            params.status = 8
        }
        if (params.pageNum == 1) {
            setStatus('loading')
        }
        // params.confirmStatus = current + 2
        // console.log(params)
        listPurchaseMaterialOrderAPI(params).then((res) => {
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
        GDownListRef.current?.openFile(e, item, '1')
        // const res = await getFileList(item.code)
        // if (res.code == 200) {
        //     updateData([
        //         { value: true, field: 'open' },
        //         { value: item.id, field: 'id' },
        //         { value: res.data, field: 'list' },
        //         { value: item.code, field: 'code' },
        //     ], 'record')
        // }
    }

    // // 上传文件
    // const uploadFile = async (tempType) => {
    //     let res = undefined
    //     if (tempType == 'image') {
    //         // 图片上传
    //         const file = await Taro.chooseImage({ count: 1 })
    //         // console.log(file)
    //         // const imgInfo = await getImageInfo(file.tempFilePaths[0])
    //         // const fileInfo = await getFileInfo(file.tempFilePaths[0])
    //         // console.log(imgInfo, fileInfo)
    //         if (file?.errMsg == 'chooseImage:ok') {
    //             res = await uploadFileDeal(file.tempFilePaths, {fileName: '采购合同'})
    //         }
    //     } else {
    //         // 客户端会话文件上传 即聊天记录的文件
    //         const file = await Taro.chooseMessageFile({ count: 1 })
    //         if (file?.errMsg == 'chooseMessageFile:ok') {
    //             res = await uploadFileDeal(file.tempFiles, {hasInfo: true})
    //         }
    //     }
    //     // console.log(res)
    //     let fileList = res[0].params.fileInfo
    //     fileList.bizType = '16' // 接口固定参数
    //     fileList.moduleCode = '5' // 接口固定参数
    //     fileList.bizCode = recordInfo.code
    //     const params = {
    //         fileList: [fileList],
    //         id: recordInfo.id,
    //     }
    //     uploadMaterialFileAPI(params).then(async (res) => {
    //         if (res.code == 200) {
    //             const result = await getFileList(recordInfo.code)
    //             updateData([
    //                 { value: result.data, field: 'list' },
    //             ], 'record')
    //         }
    //     })
    //     // updateData([{ value: false, field: 'open' }], 'record')
    // }

    // // 保存文件
    // const saveFile = async (item) => {
    //     // item.key = item.fileKey
    //     // item.name = item.fileName
    //     gShareFileRef.current?.saveFile(item)
    //     // // Taro.openDocument({
    //     // //     filePath: tempFilePath,
    //     // //     showMenu: true,
    //     // //     success: (result) => {
    //     // //         console.log(result)
    //     // //     }
    //     // // })
    //     // Taro.showActionSheet({
    //     //     itemList: ['发送给好友', '发送邮箱'],
    //     //     success: async (res) => {
    //     //     //   console.log(res.tapIndex)
    //     //         if (res?.tapIndex == 0) {
    //     //             const res = await downloadFileByKeys(item.key)
    //     //             const tempFilePath = await downloadImg(res.data[item.key])
    //     //             Taro.shareFileMessage({
    //     //                 filePath: tempFilePath,
    //     //                 fileName: item.name,
    //     //                 // success: (result) => { console.log('转发成功', result) },
    //     //                 fail: (err) => {
    //     //                     console.log(err)
    //     //                     Taro.showToast({ title: '转发失败，请重试', icon: 'error' })
    //     //                 }
    //     //             })
    //     //         } else {
    //     //             updateData([{ value: true, field: 'open' }], 'dialog')
    //     //         }
    //     //     },
    //     //     fail: function (res) {
    //     //         console.log(res.errMsg)
    //     //     }
    //     // })
    // }

    // // 数据校验
    // const checkData = () => {
    //     let res = ''
    //     if (!dialogInfo.email) res = '请填写邮箱'
    //     else if (!validEmail(dialogInfo.email)) res = '请填写正确的邮箱格式'
    //     return res
    // }
    // // 确定发送邮箱
    // const confirmHandle = () => {
    //     let errMsg = checkData()
    //     if (errMsg) {
    //         Taro.showToast({ title: errMsg, icon: 'none', duration: 1500 })
    //         return
    //     }
    //     console.log(dialogInfo, validEmail(dialogInfo.email))
    //     updateData([{ value: false, field: 'open' }], 'dialog')
    // }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code,item.id)
    }

    // 跳转到详情
    const toDetail = (id) => {
        Taro.navigateTo({ url: `detail/index?id=${id}` })
    }
    return (
        <View className='contract-page'>
            <CSearch placeholder={'合同单号'} inputChange={(e) => updateData([{ value: e, field: 'code' }])} search={(e) => searchHandle(e)} type={1} scanPath="detail/index" scanError="订单不存在"></CSearch>

            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待确认合同' },
                    { title: '取消待确认' },
                    { title: '确认记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>

            {current == 2 ? <View style={`padding: 0 32rpx;margin-top: 20rpx;`}>
                <GTag tagInfo={tagInfo} list={tagList} choose={(item) => chooseTag(item)}></GTag>
            </View> : <></>}

            {/* <View >
            下单公司下单公司下单公司下单公司 <button style={'display: inline; float: right;'}>下载</button>
            </View> */}

            <ScrollView ref={scrollRef} lowerThreshold={150} className={`contract-box list-no-scroll ${current == 2 && 'contract-has-tag'}`} scrollY onScrollToLower={scrolltolower} scrollIntoView={scrollIntoId} onScroll={scrollHandle}>
                {
                    list.map((item, index) => {
                        return (
                            <ContractCard current={current} item={item} index={index} toDetail={toDetail} openVouch={openVouch} openFile={openFile}></ContractCard>
                            // <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id)}>
                            //     {item?.confirmStatus == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                            //     <View className='common-item head'>
                            //         <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                            //         <View className='common-title'>{item.code}</View>
                            //         <View className='primary-right'></View>
                            //     </View>

                            //     <View className='common-between'>
                            //         <View className='common-item'>
                            //             <View className='common-item-label'>订购数量</View>
                            //             <View className='common-item-value'>{item?.quantity}</View>
                            //         </View>
                            //         <View className='common-item'>
                            //             <View className='common-item-label'>下单人</View>
                            //             <View className='common-item-value'>{item?.submitUserName}</View>
                            //         </View>
                            //     </View>

                            //     <View className='common-item'>
                            //         <View className='common-item-label'>供应商</View>
                            //         <View className='common-item-value'>{item?.supplierName}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>下单公司</View>
                            //         <View className='common-item-value'>{item?.ownerName}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>下单时间</View>
                            //         <View className='common-item-value'>{item?.createTime}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>收货地址</View>
                            //         <View className='common-item-value'>{item?.addressName}
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

            <GDownList ref={GDownListRef} moduleCode='5'></GDownList>
            {/* <AtModal isOpened={recordInfo.open} onClose={() => updateData([{ value: false, field: 'open' }], 'record')} className='new pop-bottom common-dialog'>
                <AtModalHeader>{recordInfo.title}</AtModalHeader>
                <AtModalContent>
                    {
                        recordInfo.list?.length ? recordInfo.list.map((item, index) => {
                            return (
                                <View className='common-record-card'>
                                    <View className='common-record-head flex'>
                                        <View className='common-record-index'>{index + 1}</View>
                                        <View className='common-record-title'>{item.createByName}</View>
                                        <View className='common-record-subtitle'>上传人</View>
                                        <View className='flex-grow'></View>
                                        <View className='primary-download' onClick={() => saveFile(item)}></View>
                                    </View>
                                    <View className='common-record-item'>
                                        <View className='common-record-label'>文件名称</View>
                                        <View className='common-record-value primary-color'>{item.name}</View>
                                    </View>
                                    <View className='common-record-item'>
                                        <View className='common-record-label'>上传时间</View>
                                        <View className='common-record-value'>
                                            {item?.createTime && <>
                                                {dayjs(item.createTime).format('YYYY-MM-DD')}
                                                <View className='common-record-unit'>{dayjs(item.createTime).format('HH:mm')}</View>
                                            </>}
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : <AtLoadMore status={'noMore'}></AtLoadMore>
                    }
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => uploadFile('image')}>上传图片</AtButton>
                    <AtButton type='primary' onClick={() => uploadFile('file')}>从聊天记录上传</AtButton>
                </AtModalAction>
            </AtModal> */}

            {/* <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' title='邮箱' value={dialogInfo.email} placeholder='请填写邮箱' onChange={(e) => updateData([{ value: e, field: 'email' }], 'dialog')}>
                    </AtInput>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateData([{ value: false, field: 'open' }], 'dialog')}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal> */}
            {/* <GShareFile ref={gShareFileRef}></GShareFile> */}
            <GFeedback></GFeedback>
        </View>
    )
}
