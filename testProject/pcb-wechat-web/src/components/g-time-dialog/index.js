import './index.less'
import dayjs from 'dayjs'
import { useState, useEffect } from "react"
import Taro, { useLoad } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"


export default function GTeimDialog({show, title, startTime, endTime, confirm, reset, onClose}) {
    const [end, setEnd] = useState()
    const [start, setStart] = useState()
    useLoad(() => {
    })
    useEffect(() => {
        setEnd(endTime)
        setStart(startTime)
    }, [startTime, endTime])

    const resetHandle = () => {
        setEnd()
        setStart()
        reset({
            endTime: '',
            startTime: '',
        })
    }
    const confirmHandle = () => {
        confirm({
            endTime: end,
            startTime: start,
        })
    }

    const changeTime = (e, timeType) => {
        if (timeType == 'startTime') {
            if (end && e?.detail?.value) {
                if (new Date(e.detail.value) > new Date(end)) {
                    Taro.showToast({
                        title: '不能大于结束时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            setStart(e?.detail?.value)
        } else {
            if (start && e?.detail?.value) {
                if (new Date(e.detail.value) < new Date(start)) {
                    Taro.showToast({
                        title: '不能小于开始时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            setEnd(e?.detail?.value)
        }
    }
    return (
        <AtModal className='g-time-dialog' isOpened={show} onClose={onClose}>
            <AtModalHeader>{title}</AtModalHeader>
            <AtModalContent>
                <View className='time-dialog-contnent flex flex-center flex-column'>
                    <Picker className='time-dialog-item' mode='date' onChange={(e) => changeTime(e, 'startTime')}>
                        <View className='flex flex-start'>
                            <View className='time-dialog-label'>开始时间</View>
                            <View className='time-dialog-value'>
                                <View>{start && dayjs(start).format('YYYY') || ''}</View>
                                <View>年</View>
                                <View>{start && dayjs(start).format('MM') || ''}</View>
                                <View>月</View>
                                <View>{start && dayjs(start).format('DD') || ''}</View>
                                <View>日</View>
                            </View>
                        </View>
                    </Picker>

                    <Picker className='time-dialog-item' mode='date' onChange={(e) => changeTime(e, 'endTime')}>
                        <View className='flex flex-start'>
                            <View className='time-dialog-label'>结束时间</View>
                            <View className='time-dialog-value'>
                                <View>{end && dayjs(end).format('YYYY') || ''}</View>
                                <View>年</View>
                                <View>{end && dayjs(end).format('MM') || ''}</View>
                                <View>月</View>
                                <View>{end && dayjs(end).format('DD') || ''}</View>
                                <View>日</View>
                            </View>
                        </View>
                    </Picker>
                </View>
            </AtModalContent>
            <AtModalAction> <AtButton onClick={resetHandle}>重置</AtButton> <AtButton type="primary" onClick={confirmHandle}>完成</AtButton> </AtModalAction>
        </AtModal>
    )
}
