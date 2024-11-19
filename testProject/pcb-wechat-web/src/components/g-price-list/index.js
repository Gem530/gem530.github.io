import './index.less'
// import dayjs from 'dayjs'
// import { useRef } from 'react'
// import GShareFile from '../g-share-file'
import { View } from '@tarojs/components'
// import Taro, { useLoad } from '@tarojs/taro'
// import { uploadFileDeal } from '../../pages/util/func'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtLoadMore, AtModal, AtModalHeader, AtModalContent } from "taro-ui"


export default forwardRef(function GPriceList({}, ref) {
    const initRecord = {
        list: [],
        open: false,
        title: '费用明细',
    }
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

    // 打开文件列表
    const openList = async (data) => {
        // e.stopPropagation()
        // console.log(data)
        updateData([
            { value: true, field: 'open' },
            { value: data, field: 'list' },
        ], 'record')
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openList,
    }))
    return (
        <>
        <AtModal isOpened={recordInfo.open} onClose={() => updateData([{ value: false, field: 'open' }], 'record')} className='new pop-bottom common-dialog'>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View className='pop-price-box'>
                {
                    recordInfo.list?.length ? recordInfo.list.map((item, index) => {
                        return (
                            <>
                            {index != 0 ? <View className='price-bottom'></View> : <></>}
                            <View className={`price-content`}>
                                {
                                    item?.length && item.map((m, mI) => {
                                        return (
                                            <>
                                            <View className='price-list flex flex-between'>
                                                <View className='price-label'>{m?.label}</View>
                                                <View className='price-value'>{m?.value}</View>
                                            </View>
                                            </>
                                        )
                                    })
                                }
                            </View>
                            </>
                        )
                    }) : <AtLoadMore status={'noMore'}></AtLoadMore>
                }
                </View>
            </AtModalContent>
        </AtModal>
        </>
    )
})
