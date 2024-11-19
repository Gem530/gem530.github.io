import dayjs from 'dayjs'
import { useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef } from "react"
import GDrawerFilter from '../../../components/g-drawer-filter'


export default forwardRef(function DateDrawer({end, start, confirm, disPage, dateType}, ref) {
    const initRecord = {
        list: [],
        open: false,
        title: '请选择日期',
    }
    const GDrawerFilterRef = useRef()
    // const GPopCalendarRef = useRef()
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [endTime, setEndTime] = useState(end || dayjs(new Date()).format(dateType == 'hour' ? 'YYYY.MM.DD HH' : 'YYYY.MM.DD'))
    const [startTime, setStartTime] = useState(start || dayjs(new Date()).format(dateType == 'hour' ? 'YYYY.MM.DD HH' : 'YYYY.MM.DD'))
    const formList = [
        {
            title: '',
            isQuick: true, // 开启时间快捷键
            type: 'timeRange',
            dateType: dateType,
            field: 'chooseTime',
            value: [startTime || '', endTime || ''],
        },
    ]

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

    // 重置时间
    const resetHandle = () => {
        setEndTime(end)
        setStartTime(start)
        confirmHandle({
            chooseTime: [start, end]
        })
    }
    // 时间确认
    const confirmHandle = (data) => {
        // console.log(data)
        let tempDate = {
            end: data?.chooseTime[1],
            start: data?.chooseTime[0],
        }
        if (!tempDate?.end && !tempDate?.start) return;
        if (!tempDate?.end) {
            tempDate.end = tempDate.start
        }
        if (!tempDate?.start) {
            tempDate.start = tempDate.end
        }
        let date = tempDate
        let dateTip = tempDate;
        tempDate?.end && setEndTime(tempDate.end)
        tempDate?.start && setStartTime(tempDate.start)
        disPage && disPage('')
        confirm && confirm({ date, dateTip })
        // let { date, dateTip } = data
        // let tempDate = {
        //     end: '',
        //     start: '',
        // }
        // if (!dateTip?.end || !dateTip?.start) {
        //     if (!dateTip?.end) {
        //         tempDate = {
        //             end: dateTip?.start,
        //             start: dateTip?.start,
        //         }
        //     }
        //     if (!dateTip?.start) {
        //         tempDate = {
        //             end: dateTip?.end,
        //             start: dateTip?.end,
        //         }
        //     }
        // } else {
        //     tempDate = date
        // }
        // tempDate?.end && setEndTime(tempDate.end)
        // tempDate?.start && setStartTime(tempDate.start)
        // disPage && disPage('')
        // confirm && confirm(data)
    }

    // 打开日期选择弹框`
    const openCalendar = () => {
        disPage && disPage('disabled-scroll')
        // GPopCalendarRef.current.openCalendar({date: {
        //     end: endTime,
        //     start: startTime,
        // }})
        GDrawerFilterRef.current.openFilter({
            chooseTime: [startTime, endTime]
        }, '筛选')
    }

    // 触发关闭弹框事件
    const closeHandle = () => {
        disPage && disPage('')
    }
    return (
        <>
        <View className='date-drawer flex flex-end'>
            <View className='flex flex-end' onClick={openCalendar}>
                <View className='date-drawer-text primary-color'>{dayjs(startTime).format(dateType == 'hour' ? 'YYYY.MM.DD HH点' : 'YYYY.MM.DD')}</View>
                <View className='date-drawer-between m-l-10 m-r-10'>~</View>
                <View className='date-drawer-text primary-color'>{dayjs(endTime).format(dateType == 'hour' ? 'YYYY.MM.DD HH点' : 'YYYY.MM.DD')}</View>
            </View>
            <View className='primary-filter expend-click m-l-10' onClick={openCalendar}></View>
        </View>
        {/* <GPopCalendar ref={GPopCalendarRef} close={closeHandle} confirm={confirmHandle}></GPopCalendar> */}
        <GDrawerFilter classStr={'drawer-has-nav-bar'} newF={true} formList={formList} ref={GDrawerFilterRef} reset={resetHandle} confirm={confirmHandle} close={() => {
            disPage && disPage('')
        }}></GDrawerFilter>
        </>
    )
})
