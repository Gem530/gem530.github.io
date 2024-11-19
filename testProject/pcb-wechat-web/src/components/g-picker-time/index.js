import './index.less'
import dayjs from 'dayjs'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtButton }  from 'taro-ui'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'


export default forwardRef(function GPickerTime({cancel, confirm, children}, ref) {
    const initDate = dayjs(new Date()).format('YYYY-MM-DD')
    const [result, setResult] = useState()
    const [open, setOpen] = useState(false)
    const [flag, setFlag] = useState(false)
    const [date, setDate] = useState(initDate)
    const [dateType, setDateType] = useState('day') // year 年 month 年月 day (年月日) hour (年月日 时)
    const [value, setValue] = useState(['','','',''])
    const [prmoiseFun, setPrmoiseFun] = useState()
    const [dataInfo, setDataInfo] = useState({
        years: [],
        months: [],
        days: [],
        hours: [],
    })

    useDidShow(() => {
        initTimeList()
    })

    // 初始化时间列表
    const initTimeList = (date = '') => {
        let crtDate = date || new Date()
        let crtY = dayjs(crtDate).format('YYYY')
        let crtM = dayjs(crtDate).format('MM')
        let crtD = dayjs(crtDate).format('DD')
        let crtH = dayjs(crtDate).format('HH')
        let crtmin = dayjs(crtDate).format('mm')
        let crtsec = dayjs(crtDate).format('ss')
        let tempYear = []
        let tempMonth = []
        let tempDay = []
        let tempHour = []
        let maxYear = dayjs(crtDate).add(50, 'year').format('YYYY')
        let crtDayLength = dayjs().month(dayjs(crtDate).month()).daysInMonth()
        for (let i = 1972; i <= maxYear; i++) {
            tempYear.push(i)
        }
        for (let i = 1; i <= 12; i++) {
            tempMonth.push(i)
        }
        for (let i = 1; i <= crtDayLength; i++) {
            tempDay.push(i)
        }
        for (let i = 0; i <= 23; i++) {
            tempHour.push(i)
        }
        let tempInfo = {
            years: tempYear,
            months: tempMonth,
            days: tempDay,
            hours: tempHour,
        }
        setDataInfo(tempInfo)
        let tempValue = [tempInfo.years.findIndex((f) => f == crtY), tempInfo.months.findIndex((f) => f == crtM), tempInfo.days.findIndex((f) => f == crtD)]
        if (['hour'].includes(dateType)) {
            tempValue.push(tempInfo.hours.findIndex((f) => f == crtH))
        }
        tempValue.map((m) => {
            if (m <= 0) m = 0
        })
        // console.log(tempInfo, tempValue)
        setDate(`${crtY}-${crtM}-${crtD}${['hour'].includes(dateType) ? (' ' + crtH) : ''}`)
        setValue(tempValue)
    }

    // 打开时间选择
    const openTime = (data) => {
        // console.log(data)
        if (data?.dateType) {
            setDateType(data.dateType)
        }

        if (data?.value) {
            // if (data?.dateType == 'hour') {
            //     let ymd = data.value.split(' ')[0].split('-')
            //     let hsm = data.value.split(' ')[1].split(':')
            //     setValue([...ymd,...hsm])
            // } else {
            // console.log([y,m,d])
            let y = dataInfo.years.findIndex((f) => f == data.value.split('-')[0])
            let m = dataInfo.months.findIndex((f) => f == data.value.split('-')[1])
            let d = dataInfo.days.findIndex((f) => f == data.value.split('-')[2])
            // console.log([y,m,d])
            setValue([y,m,d])
            // }
        }

        return new Promise((resolve, reject) => {
            setOpen(true)
            setPrmoiseFun({ resolve, reject })
        })
    }

    // 取消
    const onClose = (e) => {
        setOpen(false)
        prmoiseFun.resolve({cancel: true})
    }

    // 确认
    const confirmHandle = () => {
        // console.log(result)
        // console.log(flag)
        setOpen(false)
        let resDate = dayjs(date).format(
            (dateType == 'year') ? 'YYYY' :
            (dateType == 'month') ? 'YYYY-MM' :
            (dateType == 'day') ? 'YYYY-MM-DD' :
            (dateType == 'hour') ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD'
        )
        prmoiseFun.resolve({confirm: true, data: resDate})
    }

    const changeHandle = (e) => {
        let val = e?.detail?.value ? e?.detail?.value : [0,0,0,0]
        val.map((m) => {
            if (m <= 0) m = 0
        })
        let crtY = dataInfo.years[val[0]]
        let crtM = dataInfo.months[val[1]] || '01'
        let crtD = dataInfo.days[val[2]] || '01'
        let crtH = ''
        if (['hour'].includes(dateType)) {
            crtH = dataInfo.hours[val[3]]
        }
        // console.log(e?.detail?.value, `${crtY}-${crtM}-${crtD}`)
        initTimeList(`${crtY}-${crtM}-${crtD}${['hour'].includes(dateType) ? (' ' + crtH) : ''}`)
    }
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openTime,
    }))

    return (
        <>
        <AtModal isOpened={open} onClose={onClose} className='new pop-bottom g-picker-time-pop'>
            <AtModalContent>
                <PickerView indicatorStyle='height: 50px;' style={'height: 300px;'} value={value} onChange={changeHandle} onPickStart={() => setFlag(true)} onPickEnd={() => setFlag(false)}>
                    {['year', 'month', 'day', 'hour'].includes(dateType) ? 
                    <PickerViewColumn>
                    {
                        dataInfo.years.map((item) => {
                            return (
                                <View className='flex flex-center'>{item}年</View>
                            )
                        })
                    }
                    </PickerViewColumn> : <></>}
                    {['month', 'day', 'hour'].includes(dateType) ? 
                    <PickerViewColumn>
                    {
                        dataInfo.months.map((item) => {
                            return (
                                <View className='flex flex-center'>{item}月</View>
                            )
                        })
                    }
                    </PickerViewColumn> : <></>}
                    {['day', 'hour'].includes(dateType) ? 
                    <PickerViewColumn>
                    {
                        dataInfo.days.map((item) => {
                            return (
                                <View className='flex flex-center'>{item}日</View>
                            )
                        })
                    }
                    </PickerViewColumn> : <></>}
                    {['hour'].includes(dateType) ? 
                        <PickerViewColumn>
                        {
                            dataInfo.hours.map((item) => {
                                return (
                                    <View className='flex flex-center'>{item}点</View>
                                )
                            })
                        }
                        </PickerViewColumn> : <></>
                    }
                </PickerView>
            </AtModalContent>
            <AtModalAction>
                <View className="flex flex-center g-picker-time-pop-btn">
                    <AtButton onClick={onClose}>取消</AtButton>
                    <AtButton type='primary' disabled={flag} onClick={confirmHandle}>确认</AtButton>
                </View>
            </AtModalAction>
        </AtModal>
        </>
    )
})