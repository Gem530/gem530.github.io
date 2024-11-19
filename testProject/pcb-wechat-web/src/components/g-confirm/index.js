// import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"


export default forwardRef(function GConfirm({cancelClass, confirmClass}, ref) {
    const initRecord = {
        open: false,
        content: '',
        type: 'confirm', // confirm 确认弹框，有确定取消按钮   tooltip 提示弹框，只有知道了按钮
        title: '系统提示',
        cancelText: '取消',
        checkFun: undefined,
        confirmText: '确定',
        showCancelBtn: true,
        showConfirmBtn: true,
    }
    const [prmoiseFun, setPrmoiseFun] = useState()
    const [recordInfo, setRecordInfo] = useState(initRecord)

    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
    }
    // 打开弹框
    const openConfirm = (info) => {
        return new Promise((resolve, reject) => {
            // let keyArr = Object.keys(info)
            // console.log('keyArr', keyArr)
            updateData([
                { value: true, field: 'open' },
                { value: info?.content || '', field: 'content' },
                { value: info?.type || initRecord.type, field: 'type' },
                { value: info?.checkFun || undefined, field: 'checkFun' },
                { value: info?.title || initRecord.title, field: 'title' },
                { value: info?.cancelText || initRecord.cancelText, field: 'cancelText' },
                { value: info?.confirmText || initRecord.confirmText, field: 'confirmText' },
                { value: info?.showCancelBtn ?? initRecord.showCancelBtn, field: 'showCancelBtn' },
                { value: info?.showConfirmBtn ?? initRecord.showConfirmBtn, field: 'showConfirmBtn' },
                // { value: keyArr.includes('showCancelBtn') ? info?.showCancelBtn : initRecord.showCancelBtn, field: 'showCancelBtn' },
                // { value: keyArr.includes('showConfirmBtn') ? info?.showConfirmBtn : initRecord.showConfirmBtn, field: 'showConfirmBtn' },
            ])
            setPrmoiseFun({ resolve, reject })
        })
    }

    // 取消弹框
    const cancelHandle = () => {
        updateData([ { value: false, field: 'open' } ])
        console.log(prmoiseFun)
        prmoiseFun.reject(false)
    }
    // 确定弹框
    const confirmHandle = async () => {
        if (recordInfo?.checkFun) {
            const res = await recordInfo?.checkFun()
            console.log(res)
            if (res) return;
        }
        updateData([ { value: false, field: 'open' } ])
        prmoiseFun.resolve(true)
    }
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openConfirm,
    }))
    return (
        <View style={'position: relative;z-index: 999;'}>
        {recordInfo.open ? <AtModal isOpened={recordInfo.open} closeOnClickOverlay={false} className='new'>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View className={`flex flex-center`} style={`min-height: 100rpx;`}>{recordInfo.open ? recordInfo?.content : ''}</View>
            </AtModalContent>
            <AtModalAction>
                {recordInfo?.showCancelBtn ? <AtButton className={cancelClass} onClick={cancelHandle}>{recordInfo?.cancelText}</AtButton> : <></>}
                {recordInfo?.showConfirmBtn ? <AtButton className={recordInfo?.type == 'tooltip' ? 'new gray-btn at-button-tooltip' : confirmClass} type='primary' onClick={confirmHandle}>{recordInfo?.confirmText}</AtButton> : <></>}
            </AtModalAction>
        </AtModal> : <></>}
        </View>
    )
})
