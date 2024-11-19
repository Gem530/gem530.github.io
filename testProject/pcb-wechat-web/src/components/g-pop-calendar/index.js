import './index.less'
import dayjs from 'dayjs'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { AtCalendar, AtButton, AtModal, AtModalHeader, AtModalContent } from "taro-ui"


export default forwardRef(function GPopCalendar({close, confirm}, ref) {
    const initRecord = {
        list: [],
        open: false,
        title: '请选择日期',
    }
    const tagList = [
        { id: -1, name: '昨天' },
        { id: 1, name: '当天' },
        { id: 7, name: '近7天' },
        { id: 30, name: '近30天' },
    ]
    const calendarRef = useRef()
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const currentTime = dayjs(new Date()).format('YYYY-MM-DD')
    const [tagInfo, setTagInfo] = useState({ id: '', name: '' })
    const [currentDate, setCurrentDate] = useState({start: currentTime, end: currentTime})
    const [currentDateTip, setCurrentDateTip] = useState({start: currentTime, end: currentTime})

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
    const openCalendar = async (data) => {
        if (data?.date) {
            setCurrentDate(data?.date)
            setCurrentDateTip(data?.date)
        }
        setTagInfo({ id: '', name: '' })
        updateData([
            { value: true, field: 'open' },
            // { value: data, field: 'list' },
        ], 'record')
    }

    // 选中日期时候触发
    const onSelectDate = (e) => {
        if (e.value?.start && e.value?.end) {
            setCurrentDate(e.value)
        }
        setCurrentDateTip({
            end: e.value?.end || '',
            start: e.value?.start || ''
        })
        setTagInfo({ id: '', name: '' })
    }

    // 选择最近天数
    const chooseTag = (item) => {
        let time = []
        if (item?.id == -1) {
            time = [dayjs(currentTime).subtract(1, 'day').format('YYYY-MM-DD'), dayjs(currentTime).subtract(1, 'day').format('YYYY-MM-DD')]
        } else if (item?.id == 1) {
            time = [currentTime, currentTime]
        } else if (item?.id == 7) {
            time = [dayjs(currentTime).subtract(7, 'day').format('YYYY-MM-DD'), currentTime]
        } else if (item?.id == 30) {
            time = [dayjs(currentTime).subtract(30, 'day').format('YYYY-MM-DD'), currentTime]
        }
        setTagInfo(item)
        if (time?.length >= 2) {
            setCurrentDate({
                end: time[1],
                start: time[0],
            })
            setCurrentDateTip({
                end: time[1],
                start: time[0],
            })
        }
    }

    // 确认
    const confirmHandle = () => {
        // if (!currentDateTip?.end || !currentDateTip?.start) {
        //     Taro.showToast({ title: `请选择${!currentDateTip?.end ? '结束' : !currentDateTip?.start ? '开始' : ''}时间`, icon: 'error' })
        //     return
        // }
        updateData([{ value: false, field: 'open' }], 'record')
        confirm && confirm({date: currentDate, dateTip: currentDateTip})
    }
    // 关闭
    const closeHandle = () => {
        close && close()
        updateData([{ value: false, field: 'open' }], 'record')
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openCalendar,
    }))
    return (
        <>
        <AtModal catchtouchmove="" onTouchMove="" onCatchTouchMove="" isOpened={recordInfo.open} onClose={closeHandle} className={`new pop-bottom common-dialog pop-calendar ${recordInfo.open ? '' : 'none-dom'}`}>
            <AtModalHeader>
                <View className='calender-header flex flex-between'>
                    <View></View>
                    <View className='calendar-title'>{recordInfo.title}</View>
                    <View className='calendar-cancel' onClick={closeHandle}>取消</View>
                </View>
            </AtModalHeader>
            <AtModalContent>
                <View className='pop-calendar'>
                    <View className='calendar-tag-list'>
                        {
                            tagList.map((item) => {
                                return (
                                    <View className={`calendar-tag ${tagInfo?.id == item.id && 'active'}`} onClick={() => chooseTag(item)}>{item.name}</View>
                                )
                            })
                        }
                    </View>
                    {recordInfo.open ? <AtCalendar className="custome-calender" ref={calendarRef} isMultiSelect hideArrow={true} currentDate={currentDate} onSelectDate={onSelectDate}/> : <></>}
                    <View className='calendar-btn'>
                        <AtButton type='primary' onClick={confirmHandle}>确认</AtButton>
                    </View>
                </View>
            </AtModalContent>
        </AtModal>
        </>
    )
})
