import './index.less'
import GInput from '../g-input'
import GPickerTime from '../g-picker-time'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { View, Picker, Input } from '@tarojs/components'


export default function GTimeRange({
    time,
    change,
    onClickTime,
    newF = false,
    disabledStart,
    endClear = true,
    startClear = true,
    disabledStartText = '只能选择最近半年'
}) {
    const GPickerTimeRef = useRef()
    const [endTime, setEndTime] = useState()
    const [startTime, setStartTime] = useState()
    useEffect(() => {
        setEndTime(time?.length >= 2 && time[1] ? time[1] : '')
        setStartTime(time?.length >= 1 && time[0] ? time[0] : '')
    }, [time])
    useLoad(() => {
    })
    const changeTime = (e, timeType) => {
        if (timeType == 'startTime') {
            if (disabledStart && new Date(e.detail.value) < new Date(disabledStart)) {
                let msg = disabledStartText || '不能小于'+disabledStart
                Taro.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            if (endTime && e?.detail?.value) {
                if (new Date(e.detail.value) > new Date(endTime)) {
                    Taro.showToast({
                        title: '不能大于结束时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            // setStartTime(e?.detail?.value)
            confirm({endTime: endTime, startTime: e?.detail?.value})
        } else {
            if (startTime && e?.detail?.value) {
                if (new Date(e.detail.value) < new Date(startTime)) {
                    Taro.showToast({
                        title: '不能小于开始时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            // setEndTime(e?.detail?.value)
            confirm({endTime: e?.detail?.value, startTime: startTime})
        }
    }
    // 选择时间
    const clickTime = async (tempType) => {
        let res = ''
        if (onClickTime) {
            res = await onClickTime(tempType)
        } else {
            res = await GPickerTimeRef.current.openTime()
        }
        if (res) {
            console.log('res--', res, res.data)
            if (res.confirm) {
                changeTime({
                    detail: {
                        value: res.data
                    }
                }, tempType)
            }
        }
    }
    // 确认时间
    const confirm = (data) => {
        setEndTime(data.endTime)
        setStartTime(data.startTime)
        // console.log(data)
        change && change([data.startTime, data.endTime])
        // setShow(false)
        // onChangeHandle({
        //     value,
        //     tagInfo,
        //     endTime: data.endTime,
        //     startTime: data.startTime,
        //     selectInfo,
        //     operat: 'time'
        // })
    }
    return (
        <>
        <View className={`g-time-range flex flex-start ${newF && 'new'}`}>
            <View className={`g-time-half ${startTime && 'active'}`}>
                <GInput color='#2D90ED' value={startTime} slotIcon={<View className='g-time-box-icon'></View>} clearShow={startClear} clear={() => changeTime(undefined, 'startTime')} slot={
                    // <Picker mode='date' onChange={(e) => changeTime(e, 'startTime')}>
                        <Input value={startTime} disabled placeholder='请选择开始时间' onClick={() => clickTime('startTime')}></Input>
                    // </Picker>
                }></GInput>
            </View>
            <View className='g-time-between'>至</View>
            <View className={`g-time-half ${endTime && 'active'}`}>
                <GInput color='#2D90ED' value={endTime} slotIcon={<></>} clearShow={endClear} clear={() => changeTime(undefined, 'endTime')}
                slot={
                    // <Picker mode='date' onChange={(e) => changeTime(e, 'endTime')}>
                        <Input value={endTime} disabled placeholder='请选择结束时间' onClick={() => clickTime('endTime')}></Input>
                    // </Picker>
                }></GInput>
            </View>
        </View>
        <GPickerTime ref={GPickerTimeRef}></GPickerTime>
        </>
    )
}
