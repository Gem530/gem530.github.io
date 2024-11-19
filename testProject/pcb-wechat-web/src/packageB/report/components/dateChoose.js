import dayjs from 'dayjs'
import { useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef } from "react"
import GPopCalendar from '../../../components/g-pop-calendar'


export default forwardRef(function DateChoose({end, start, confirm, disPage}, ref) {
    const initRecord = {
        list: [],
        open: false,
        title: '请选择日期',
    }
    const GPopCalendarRef = useRef()
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [endTime, setEndTime] = useState(end || dayjs(new Date()).format('YYYY-MM-DD'))
    const [startTime, setStartTime] = useState(start || dayjs(new Date()).format('YYYY-MM-DD'))

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

    // 时间确认
    const confirmHandle = (data) => {
        let { date, dateTip } = data
        let tempDate = {
            end: '',
            start: '',
        }
        if (!dateTip?.end || !dateTip?.start) {
            if (!dateTip?.end) {
                tempDate = {
                    end: dateTip?.start,
                    start: dateTip?.start,
                }
            }
            if (!dateTip?.start) {
                tempDate = {
                    end: dateTip?.end,
                    start: dateTip?.end,
                }
            }
        } else {
            tempDate = date
        }
        tempDate?.end && setEndTime(tempDate.end)
        tempDate?.start && setStartTime(tempDate.start)
        disPage && disPage('')
        confirm && confirm(data)
    }

    // 打开日期选择弹框
    const openCalendar = () => {
        disPage && disPage('disabled-scroll')
        GPopCalendarRef.current.openCalendar({date: {
            end: endTime,
            start: startTime,
        }})
    }

    // 触发关闭弹框事件
    const closeHandle = () => {
        disPage && disPage('')
    }
    return (
        <View className='flex flex-end'>
        <View className='date-choose' onClick={openCalendar}>
            <View className='date-choose-time'>
                <View className='date-choose-text'>{dayjs(startTime).format('YYYY.MM.DD')}</View>
                <View className='date-choose-between'>~</View>
                <View className='date-choose-text'>{dayjs(endTime).format('YYYY.MM.DD')}</View>
            </View>
            <View className='primary-report-time'></View>
        </View>
        <GPopCalendar ref={GPopCalendarRef} close={closeHandle} confirm={confirmHandle}></GPopCalendar>
        </View>
    )
})
