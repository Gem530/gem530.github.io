import './index.less'
import GFixedIcon from '../g-fixed-icon'
import { View, Switch } from '@tarojs/components'
import { hasPermission } from '../../pages/util/func'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import { userFeedbackAPI } from '../../pages/services/login/loginService'
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { AtTextarea, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import { queryOperateReportPriceAPI, updateOperateReportPriceAPI } from '../../pages/services/dailyReport'


export default forwardRef(function GSettingDialog({ type, rowList, children, onInit, onChange }, ref) {
    const initRecord = {
        open: false,
        targetArea: '',
        targetAmount: '',
        title: '图表配置',
    }
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [recordInfo, setRecordInfo] = useState(initRecord)

    useDidShow(() => {
        // if (rowList?.length) {
        //     console.log(rowList)
        // }
        queryOperateReportPrice()
    })
    // useEffect(() => {
    //     // if (rowList?.length) {
    //     //     let tempInfo = {}
    //     //     rowList.map((m) => {
    //     //         tempInfo[m.field] = m.value && m.value()
    //     //     })
    //     //     // console.log(rowList, tempInfo)
    //     //     setData(tempInfo)
    //     // }
    //     setData(rowList || [])
    // }, [rowList])

    // 获取目标金额，面积
    const queryOperateReportPrice = () => {
        // if (hasPermission(['dailyreport:operateReport:editPriceArea'])) {
            queryOperateReportPriceAPI().then((res) => {
                if (res.code == 200) {
                    updateData([
                        { value: res.data?.targetArea, field: 'targetArea' },
                        { value: res.data?.targetAmount, field: 'targetAmount' },
                    ])
                    onInit && onInit({
                        targetArea: res.data?.targetArea,
                        targetAmount: res.data?.targetAmount,
                    })
                }
            })
        // }
    }
    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                if (item.field == 'setting') {
                    item.value = item.value.substring(0, 200)
                }
                if (['targetAmount','targetArea'].includes(item.field)) {
                    if (item.value?.length >= 2) {
                        let crtEmpty = item.value.indexOf('0')
                        let crtI = item.value.indexOf('.')
                        if (crtEmpty == 0 && crtI != 1) {
                            item.value = item.value.substring(1)
                        } else if (crtI != -1) {
                            item.value = item.value.substring(0, crtI + (['targetAmount'].includes(item.field) ? 3 : 5))
                        }
                    }
                }
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        } else if (tempType == 'rowList') {
            // let tempInfo = JSON.parse(JSON.stringify(data))
            // arr.map((item, index) => {
            //     // if (item.field == 'setting') {
            //     //     item.value = item.value.substring(0, 200)
            //     // }
            //     tempInfo[item.field] = item.value
            // })
            // setData(tempInfo)
            let tempList = JSON.parse(JSON.stringify(data))
            arr.map((item, index) => {
                const crtInfo = tempList.find((f) => f.field == item.field)
                crtInfo.show = item.value
            })
            console.log(tempList)
            setData(tempList)
        }
    }

    // 打开弹框
    const openDialog = () => {
        setData(rowList || [])
        updateData([{ value: true, field: 'open' }], 'record')
    }
    // 关闭
    const closeHandle = () => {
        updateData([{ value: false, field: 'open' },{ value: '', field: 'setting' }], 'record')
    }
    const checkData = () => {
        let res = ''
        if (!recordInfo.targetAmount) {
            res = '请输入目标金额'
        } else if (Number(recordInfo.targetAmount) <= 0) {
            res = '目标金额必须大于0'
        } else if (!/^\d+(\.\d+)?$/.test(recordInfo.targetAmount)) {
            res = '请输入正确的目标金额'
        } else if (!recordInfo.targetArea) {
            res = '请输入目标面积'
        } else if (Number(recordInfo.targetArea) <= 0) {
            res = '目标面积必须大于0'
        } else if (!/^\d+(\.\d+)?$/.test(recordInfo.targetArea)) {
            res = '请输入正确的目标面积'
        }
        return res
    }
    // 确认
    const confirmHandle = () => {
        if (hasPermission(['dailyreport:operateReport:editPriceArea']) && (type == 1)) {
            const errMsg = checkData()
            if (errMsg) {
                Taro.showToast({
                    title: errMsg,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            // console.log('data', data)
            updateOperateReportPriceAPI({
                targetArea: recordInfo.targetArea,
                targetAmount: recordInfo.targetAmount,
            }).then((res) => {
                if (res.code == 200) {
                    updateData([{ value: false, field: 'open' },{ value: '', field: 'setting' }], 'record')
                    onInit && onInit({
                        targetArea: recordInfo?.targetArea,
                        targetAmount: recordInfo?.targetAmount,
                    })
                    onChange && onChange(data)
                }
            })
        } else {
            updateData([{ value: false, field: 'open' },{ value: '', field: 'setting' }], 'record')
            onInit && onInit({
                targetArea: recordInfo?.targetArea,
                targetAmount: recordInfo?.targetAmount,
            })
            console.log('11', data)
            onChange && onChange(data)
        }
        // if (!recordInfo?.setting) {
        //     Taro.showToast({ title: '请填写反馈意见', icon: 'error' })
        //     return
        // }
        // // console.log('confirmHandle', recordInfo)
        // setLoading(true)
        // userFeedbackAPI({ setting: recordInfo?.setting }).then((res) => {
        //     if (res.code == 200) {
        //         Taro.showToast({ title: '提交成功' })
        //         closeHandle()
        //     }
        // }).finally(() => {
        //     setLoading(false)
        // })
    }

    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        // openFile,
    }))
  return (
    <>
        <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
            <View className='setting-box flex flex-center' onClick={openDialog}>图表库</View>
        </GFixedIcon>

        <View catchMove>
        <AtModal isOpened={recordInfo.open} onClose={closeHandle} className={`new pop-bottom common-dialog content-scroll setting-pop ${recordInfo.open ? '' : 'none-dom'}`}>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View>
                    {hasPermission(['dailyreport:operateReport:editPriceArea']) && (type == 1) ? <>
                        <AtInput className='new label-auto m-b-20 no-t-b-padding' title='接单月度目标金额' type="number"
                            placeholder='请输入接单月度目标金额'
                            placeholderClass='input-dialog-placeholder'
                            value={recordInfo.targetAmount} maxLength={13}
                            onChange={(e) => updateData([{value: e, field: 'targetAmount'}])}
                        >万元</AtInput>
                        <AtInput className='new label-auto m-b-20 no-t-b-padding' title='接单月度目标面积' type="number"
                            placeholder='请输入接单月度目标面积'
                            placeholderClass='input-dialog-placeholder'
                            value={recordInfo.targetArea} maxLength={13}
                            onChange={(e) => updateData([{value: e, field: 'targetArea'}])}
                        >㎡</AtInput>
                    </> : <></>}
                    {/* {(data && rowList?.length) ? rowList.map((item) => {
                        return (
                            <View className='common-item m-b-20'>
                                <View className='common-item-label'>{item.name}</View>
                                <View className='common-item-value flex flex-end'>
                                    <Switch color='#2D90ED' checked={data[item.field]} onChange={(e) => updateData([{value: e?.detail?.value, field: item.field}], 'rowList')}/>
                                </View>
                            </View>
                        )
                    }) : <></>} */}
                    {(data && rowList?.length) ? rowList.map((item) => {
                        return (
                            <View className='common-item m-b-20'>
                                <View className='common-item-label'>{item?.title}</View>
                                <View className='common-item-value flex flex-end'>
                                    <Switch color='#2D90ED' checked={item.show} onChange={(e) => updateData([{value: e?.detail?.value, field: item.field}], 'rowList')}/>
                                </View>
                            </View>
                        )
                    }) : <></>}
                </View>
            </AtModalContent>
            <AtModalAction>
                <AtButton loading={loading} disabled={loading} className='setting-btn' type='primary' onClick={confirmHandle}>保存</AtButton>
            </AtModalAction>
        </AtModal>
        </View>
    </>
  )
})
