import dayjs from 'dayjs'
import { useRef } from 'react'
import GShareFile from '../g-share-file'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { uploadFileDeal } from '../../pages/util/func'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { listMaterialFileAPI, uploadMaterialFileAPI } from '../../pages/services/materialRequisition/index'


export default forwardRef(function GDownList({moduleCode}, ref) {
    const initRecord = {
        id: '',
        code: '',
        list: [],
        type: '',
        bizId: '',
        open: false,
        title: '文件列表',
    }
    const gShareFileRef = useRef()
    const [recordInfo, setRecordInfo] = useState(initRecord)

    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
    }

    // 获取文件列表
    const getFileList = (code, bizId, type) => {
        Taro.showLoading({ title: '加载中...', mask: true })
        let query = {}
        if (['2','6','10'].includes(type+'')) { // 2,6,10送货
            query.bizId = bizId
        } else {
            if (['4','8','11'].includes(type+'')) {
                query.bizId = bizId
            }
            query.bizCode = code
        }
        return listMaterialFileAPI(query).finally(() => {
            Taro.hideLoading()
        })
    }
    // 打开文件列表
    const openFile = async (e, item, type) => {
        e.stopPropagation()
        const res = await getFileList(item.code, item.bizId, type)
        if (res.code == 200) {
            updateData([
                { value: true, field: 'open' },
                { value: type, field: 'type' },
                { value: item.id, field: 'id' },
                { value: res.data, field: 'list' },
                { value: item.code, field: 'code' },
                { value: item.bizId, field: 'bizId' },
            ], 'record')
        }
    }

    // 上传文件
    const uploadFile = async (tempType) => {
        let res = undefined
        if (tempType == 'image') {
            // 图片上传
            const file = await Taro.chooseImage({ count: 1 })
            // console.log(file)
            // const imgInfo = await getImageInfo(file.tempFilePaths[0])
            // const fileInfo = await getFileInfo(file.tempFilePaths[0])
            // console.log(imgInfo, fileInfo)
            if (file?.errMsg == 'chooseImage:ok') {
                res = await uploadFileDeal(file.tempFilePaths, {fileName: '采购合同'})
            }
        } else {
            // 客户端会话文件上传 即聊天记录的文件
            const file = await Taro.chooseMessageFile({ count: 1 })
            if (file?.errMsg == 'chooseMessageFile:ok') {
                res = await uploadFileDeal(file.tempFiles, {hasInfo: true})
            }
        }
        // console.log(res)
        let fileList = res[0].params.fileInfo
        fileList.moduleCode = moduleCode//'4' // 接口固定参数
        console.log(recordInfo.type)
        fileList.bizType = ['4','8','11'].includes(recordInfo.type+'') ? '15' : '16' // 4,8,11对账单 接口固定参数
        const params = {
            fileList: [fileList],
            id: recordInfo.id,
        }
        if (['2','6','10'].includes(recordInfo.type+'')) { // 2,6,10送货
            params.id = recordInfo.bizId // 接口固定参数
        } else {
            fileList.bizCode = recordInfo.code
        }
        uploadMaterialFileAPI(params).then(async (res) => {
            if (res.code == 200) {
                const result = await getFileList(recordInfo.code, recordInfo.bizId, recordInfo.type)
                updateData([
                    { value: result.data, field: 'list' },
                ], 'record')
            }
        })
        // updateData([{ value: false, field: 'open' }], 'record')
    }

    // 保存文件
    const saveFile = async (item) => {
        // item.key = item.fileKey
        // item.name = item.fileName
        gShareFileRef.current?.saveFile(item)
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openFile,
    }))
    return (
        <>
        <AtModal isOpened={recordInfo.open} onClose={() => updateData([{ value: false, field: 'open' }], 'record')} className='new pop-bottom common-dialog content-no-padding'>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View className='common-dialog-content'>
                {
                    recordInfo.list?.length ? recordInfo.list.map((item, index) => {
                        return (
                            <View className='common-record-card'>
                                <View className='common-record-item common-record-head'>
                                    <View className='common-record-index'>{index + 1}</View>
                                    <View className='common-record-label'>上传人</View>
                                    <View className='common-record-value common-record-title'>{item.createByName}</View>
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
                </View>
            </AtModalContent>
            <AtModalAction>
                <AtButton onClick={() => uploadFile('image')}>上传图片</AtButton>
                <AtButton type='primary' onClick={() => uploadFile('file')}>从聊天记录上传</AtButton>
            </AtModalAction>
        </AtModal>
        <GShareFile ref={gShareFileRef}></GShareFile>
        </>
    )
})
