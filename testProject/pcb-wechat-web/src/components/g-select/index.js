import './index.less'
// import dayjs from 'dayjs'
// import { useRef } from 'react'
// import GShareFile from '../g-share-file'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
// import { uploadFileDeal } from '../../pages/util/func'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtModalAction, AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtCheckbox, AtButton } from "taro-ui"


export default forwardRef(function GSelect({}, ref) {
    const initRecord = {
        list: [],
        selects: [],
        open: false,
        title: '请选择',
    }
    const [prmoiseFun, setPrmoiseFun] = useState()
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
    const openSelect = async (data, info) => {
        return new Promise((resolve, reject) => {
            // e.stopPropagation()
            // console.log(data, info)
            if (info?.custom) {
                data.map((m) => {
                    // console.log(m)
                    m.value = m[info?.custom?.value]
                    m.label = m[info?.custom?.label]
                })
            }
            // console.log(data)
            updateData([
                { value: true, field: 'open' },
                { value: data, field: 'list' },
                { value: info?.selects || [], field: 'selects' },
                { value: info?.title || '请选择', field: 'title' },
            ], 'record')
            setPrmoiseFun({ resolve, reject })
        })
    }

    // 多选
    const selectHandle = (data) => {
        // console.log(data)
        updateData([
            { value: data, field: 'selects' },
        ], 'record')
    }

    // 关闭
    const close = () => {
        updateData([{ value: false, field: 'open' }], 'record')
        prmoiseFun.reject({cancel: true})
    }
    // 确定
    const confirm = () => {
        if (!recordInfo?.selects?.length) {
            Taro.showToast({ title: '请选择部门', icon: 'error' })
            return;
        }
        let tempList = recordInfo.list.filter((f) => recordInfo.selects.includes(f?.value))
        prmoiseFun.resolve({confirm: true, data: tempList})
        updateData([{ value: false, field: 'open' }], 'record')
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openSelect,
    }))
    return (
        <>
        <AtModal isOpened={recordInfo.open} onClose={close} className='new pop-bottom common-dialog'>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View className='pop-select'>
                {recordInfo?.list?.length ? <AtCheckbox
                    onChange={selectHandle}
                    options={recordInfo?.list}
                    selectedList={recordInfo.selects}
                ></AtCheckbox> : <AtLoadMore status='noMore'></AtLoadMore>}
                </View>
            </AtModalContent>
            <AtModalAction>
                <AtButton onClick={close}>取消</AtButton>
                <AtButton type='primary' onClick={confirm}>确定</AtButton>
            </AtModalAction>
        </AtModal>
        </>
    )
})
