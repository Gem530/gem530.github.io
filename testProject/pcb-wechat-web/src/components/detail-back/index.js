// import dayjs from 'dayjs'
// import GVoucherPop from '../g-voucher-pop'
// import {getGlobalData} from "../../global"
import Taro, { useLoad } from '@tarojs/taro'
// import bmap from '../../pages/util/bmap-wx.min'
import { View, Canvas } from '@tarojs/components'
// import { MAP_AK } from '../../pages/config/commonConfig'
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { getSystemTimeAPI, addBatchVoucherAPI } from '../../pages/services/upload'
import { getImageInfo, canvasDraw, toDataUrl, uploadFileDeal, downloadFileByKeys } from '../../pages/util/func'

export default forwardRef(function DetailBack({preview, signback, leftText = '预览', rightText = '回签'}, ref) {
    // 弹框信息
    const initDialog = {
        email: '',
        open: false,
        title: '发送邮箱',
    }
    const GVoucherPopRef = useRef()
    const [address, setAddress] = useState('')
    const [whInfo, setWhInfo] = useState({ w:0, h:0 })
    useLoad(() => {
    })
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        // saveFile,
    }))
    return (
        <>
        <View className='detail-upload-between flex flex-center'>
            <View className='detail-upload-item flex flex-center primary-color' onClick={() => preview()}>
                {/* <View className='primary-detail-check'></View> */}
                <View className='detail-upload-item-text'>{leftText}</View>
            </View>
            <View className='detail-upload-item flex flex-center primary-color' onClick={() => signback()}>
                {/* <View className='primary-detail-upload'></View> */}
                <View className='detail-upload-item-text'>{rightText}</View>
            </View>
        </View>
        </>
    )
})
