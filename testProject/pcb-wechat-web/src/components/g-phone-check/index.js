import './index.less'
// import dayjs from 'dayjs'
import { useRef } from 'react'
// import GShareFile from '../g-share-file'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
// import { uploadFileDeal } from '../../pages/util/func'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput, AtButton } from "taro-ui"
import { useEffect } from 'react';


export default forwardRef(function GPhoneCheck({ confirm, openChange }, ref) {
    const initRecord = {
        value: '',
        open: false,
        title: '请输入分享人手机号后四位',
    }
    const inputRef = useRef()
    const [recordInfo, setRecordInfo] = useState(initRecord)

    useEffect(() => {
        openChange && openChange(recordInfo.open)
    }, [recordInfo.open])

    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        // console.log(arr)
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                if (item.field == 'value') {
                    item.value = item.value.replaceAll(/[^0-9]/g,'')
                }
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
    }

    // 打开文件列表
    const openPhone = async (data) => {
        // e.stopPropagation()
        // console.log(data)
        console.log(inputRef)
        updateData([
            { value: true, field: 'open' },
            { value: data, field: 'value' },
        ], 'record')
    }

    // 数据校验
    const checkData = () => {
        let res = ''
        if (!recordInfo.value || recordInfo.value?.length < 4) res = '请输入手机号后四位'
        return res
    }
    // 确定
    const confirmHandle = () => {
        let errMsg = checkData()
        if (errMsg) {
            Taro.showToast({ title: errMsg, icon: 'none', duration: 1500 })
            return
        }
        confirm && confirm(recordInfo.value, () => {
            updateData([{ value: false, field: 'open' }], 'record')
        })
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openPhone,
    }))
    return (
        <View style={'z-index: 9999;'} catchMove>
        <AtModal isOpened={recordInfo.open} onClose={() => updateData([{ value: false, field: 'open' }], 'record')} className='new common-dialog'>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View className='phone-check-box'>
                    <AtInput className='new' type='digit' value={recordInfo.value} ref={inputRef} placeholder={recordInfo.open ? '请输入分享人手机号后四位' : ''} maxLength={4} onChange={(e) => updateData([{ value: e, field: 'value' }], 'record')}></AtInput>
                </View>
            </AtModalContent>
            <AtModalAction>
                <AtButton onClick={() => updateData([{ value: false, field: 'open' }], 'record')}>取消</AtButton>
                <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
            </AtModalAction>
        </AtModal>
        </View>
    )
})
