import './index.less'
import dayjs from 'dayjs'
// import { AtSwitch } from 'taro-ui'
import Echarts from 'taro-react-echarts'
import GTable from '../../../../components/g-table'
import { useRef, useState, useEffect } from 'react'
import GTooltip from '../../../../components/g-tooltip'
import GFeedback from '../../../../components/g-feedback'
import { initMarktDaily } from '../../../util/reportInit'
import { getSystemTimeAPI } from '../../../services/upload'
import GFixedIcon from '../../../../components/g-fixed-icon'
import DateDrawer from '../../../../packageB/report/components/dateDrawer'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { View, Switch, Picker, Canvas, Image, Swiper, SwiperItem } from '@tarojs/components'
import { dailySwitchAPI, marketDailyReportAPI, marketDailyReportLineAPI } from '../../../services/dailyReport'

export default function MarketReport({ echartsJs }) {
    const optionList = [
        {title: '面积', field: 'sumArea', unit: '万㎡'},
        {title: '款数', field: 'sumQuantity', unit: '款数'},
        {title: '金额', field: 'sumPrice', unit: '万元'},
        {title: '投料款数', field: 'productionQuantity', unit: '款数'}
    ]
    const optionTypeList = [
        {title: '全部', field: '0'},
        {title: '新单', field: '1'},
        {title: '返单', field: '2'},
        {title: '返单有改', field: '3'},
        {title: '样转批', field: '4'},
    ]
    const echartsRef = useRef()
    const echartsRef1 = useRef()
    const [list, setList] = useState()
    const [type, setType] = useState('')
    const [month, setMonth] = useState('')
    const [disPage, setDisPage] = useState('')
    const [sysTime, setSysTime] = useState('')
    const [weekList, setWeekList] = useState()
    const [reportConfig, setReportConfig] = useState()

    const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格
  
    const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
    const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    const [endTime, setEndTime] = useState(initEnd)
    const [startTime, setStartTime] = useState(initStart)

    const [option1, setOption1] = useState(optionList[0])
    const [option2, setOption2] = useState(optionList[0])
    const [option3, setOption3] = useState(optionList[0])
    const [optionType, setOptionType] = useState(optionTypeList[0])
    const [chartOptions, setChartOptions] = useState()
    const [chartOptionsWeek, setChartOptionsWeek] = useState()

    const [tagId, setTagId] = useState(1)
    const [queryDay, setQueryDay] = useState(dayjs(new Date()).format('YYYY-MM'))
    const [tagList, setTagList] = useState([
        // { field: -1, title: '昨日' },
        { field: 1, title: '按日统计' },
        { field: 2, title: '按周统计' },
        { field: 3, title: '按月统计' },
    ])
    const [tagInfo, setTagInfo] = useState(tagList[0])
    useDidShow(() => {
        getSystemTime()
        // marketDailyReport()
        // marketDailyReportLine()
        Taro.showLoading({ mask: true })
        Promise.all([getVisHidConfig(), marketDailyReport('', false), marketDailyReportLine('', false)]).finally(() => {
            Taro.hideLoading()
        })
    })

    useEffect(() => {
        // console.log('111',list)
        // let item = optionList[0]
        // setOption1(item)
        // setOption2(item)
        // setOption3(item)
        if (list) {
            setChartDay()
        }
        if (weekList) {
            setChartWeek()
        }
    }, [list, weekList])

    useEffect(() => {
        if (chartOptions) {
            setTimeout(() => {
                if (echartsRef.current?.chartRef?.current) {
                    let crtIndex = echartsRef.current?.chartRef?.current.getOption()?.series?.length ? echartsRef.current?.chartRef?.current.getOption()?.series[0]?.data.length : 0
                    echartsRef.current?.chartRef?.current.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: crtIndex - 1,
                    })
                }
            }, 800)
        }
        if (chartOptionsWeek) {
            setTimeout(() => {
                if (echartsRef1.current?.chartRef?.current) {
                    let crtIndex = echartsRef1.current?.chartRef?.current.getOption()?.series?.length ? echartsRef1.current?.chartRef?.current.getOption()?.series[0]?.data.length : 0
                    echartsRef1.current?.chartRef?.current.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: crtIndex - 1,
                    })
                }
            }, 800)
        }
    }, [chartOptionsWeek, echartsRef, chartOptions, echartsRef1])

    // 表格，图表切换
    const changeTable = (val, tempType) => {
      let tempVal = val == '3' ? '1' : (Number(val) + 1)
      if (tempType == '1') {
        setShowTableType1(tempVal)
        // console.log(tempVal, tempType)
        // setChartDept('', '', tempVal, '')
        setChartDay('', tempVal)
      } else if (tempType == '2') {
        setShowTableType2(tempVal)
        // setChartUser('', '', tempVal, '')
        setChartWeek('', tempVal)
      }
    }

    // 获取服务器时间
    const getSystemTime = () => {
        getSystemTimeAPI().then((res) => {
            if (res.code == 200) {
                setMonth(Number(dayjs(res.msg || new Date()).format('MM')))
                let crtDate = res.msg || new Date()
                setSysTime({
                    crtDate,
                    year: dayjs(crtDate).format('YYYY')
                })
            }
        })
    }
    // 获取显隐配置
    const getVisHidConfig = () => {
        return new Promise((resolve, reject) => {
            dailySwitchAPI('3').then((res) => {
                if (res.code == 200) {
                    let data = JSON.parse(JSON.stringify(res.data || {}))
                    data.configParam = data?.configParam ? JSON.parse(data.configParam) : initMarktDaily
                    
                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    initMarktDaily.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(data.configParam)), initMarktDaily)
                    // 获取 初始化数组中 新增的数据
                    let tempConfig = initMarktDaily.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = data.configParam.filter((f) => !initMarktDaily.map((m) => m.id).includes(f.id))
                    // 把新增的数据，插入进去，并展示到页面上
                    if (tempConfig?.length) {
                        data.configParam.splice(tempConfig[0].sort, 0, tempConfig[0])
                    }
                    // 去除已经删除的数据
                    if (needDelConfig?.length) {
                        data.configParam = data.configParam.filter((f) => !needDelConfig.map((m) => m.id).includes(f.id))
                    }
                    // console.log(tempConfig, needDelConfig, data.configParam)

                    setReportConfig(data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }

    // 获取市场日报
    const marketDailyReport = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            // let params = {
            //     type: query?.tagId ? query?.tagId : tagId
            // }
            // if (query?.tagId == -1) {
            //     params.type = 1
            //     params.queryDay = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            // }
            // let tempDay = query?.queryDay ? query.queryDay : queryDay
            // if (params.type == 3 && tempDay) {
            //     params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            // }
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
            }
            flag && Taro.showLoading({ mask: true })
            marketDailyReportAPI(params).then((res) => {
                if (res.code == 200) {
                    setList(res.data)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取市场周趋势
    const marketDailyReportLine = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagInfo?.field,
                orderType: query?.orderType || optionType?.field,
            }
            // let tempDay = query?.queryDay ? query.queryDay : queryDay
            // if (params.type == 3 && tempDay) {
            //     params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            // }
            if (params?.orderType == 0) {
                delete params?.orderType
            }
            if (params.type == -1) {
                resolve(true)
                return
            }
            flag && Taro.showLoading({ mask: true })
            marketDailyReportLineAPI(params).then((res) => {
                if (res.code == 200) {
                    let tempList = res.data?.length ? res.data.sort((a, b) => a.index - b.index) : []
                    setWeekList(tempList)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    
    // 确定时间
    const confirmHandle = (data) => {
        // console.log('切换时间', data)
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
        setEndTime(tempDate.end)
        setStartTime(tempDate.start)
        let params = { 
            queryDayEnd: tempDate.end,
            queryDayStart: tempDate.start,
        }
        Taro.showLoading({ mask: true })
        Promise.all([marketDailyReport(params)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // 返回万为单位的数据
    const getWan = (value, float = 2) => {
        let res = value
        res = (Number(res || 0) / 10000).toFixed(float)
        return Number(res)
    }

    // 设置统计图
    const setChartDay = (opt = '', chartType = '') => {
        let item = opt || option2
        item = item ? JSON.parse(JSON.stringify(item)) : item
        let chart = chartType || showTableType1
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let isWan = false
        if (['sumArea','sumPrice'].includes(item.field)) {
            // 判断这两个字段中有没有过万的数据
            isWan = list?.orderPersonalCapacityVos?.length && list?.orderPersonalCapacityVos.filter((f) => f.name != '合计').some((m) => {
                let one = m.order[item.field]
                let two = m.returned[item.field]
                let thr = m.returnChange[item.field]
                let fur = m.quotation[item.field]
                let fiv = m.production[item.field]
                // console.log(one,two,thr,fur,fiv)
                if (one >= 10000 || two >= 10000 || thr >= 10000 || fur >= 10000 || fiv >= 10000) {
                    return true
                }
            })
        }
        list?.orderPersonalCapacityVos?.length && list?.orderPersonalCapacityVos.filter((f) => f.name != '合计').map((m, mI) => {
            let one = m.order[item.field]
            let two = m.returned[item.field]
            let thr = m.returnChange[item.field]
            let fur = m.quotation[item.field]
            let fiv = m.production[item.field]
            if (item.field == 'sumArea' && isWan) {
                one = getWan(one, 4)
                two = getWan(two, 4)
                thr = getWan(thr, 4)
                fur = getWan(fur, 4)
                fiv = getWan(fiv, 4)
            }
            if (item.field == 'sumPrice' && isWan) {
                one = getWan(one, 2)
                two = getWan(two, 2)
                thr = getWan(thr, 2)
                fur = getWan(fur, 2)
                fiv = getWan(fiv, 2)
            }
            
            data.push({
                name: m.name,
                data: [one, two, thr, fur, fiv],
                type: chart == '1' ? 'bar' : 'line',
                // showBackground: true,
                itemStyle: {
                    color: color[mI]
                }
            })
        })
        if (!isWan && ['sumArea','sumPrice'].includes(item.field)) {
            item.unit = item.unit.replace('万','')
        }
        // console.log(data)
        const option = {
            // title: {
            //     text: item.title
            // },
            legend: {
                top: 0,
                left: 0,
                itemWidth: 18,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                },
                data: list?.orderPersonalCapacityVos?.length ? list?.orderPersonalCapacityVos.filter((f) => f.name != '合计').map((m) => m.name) : [],
            },
            grid: {
                show: false,
                left: '12%',
                right: '5%',
                bottom: 20,
                containLabel: false,
                borderWidth: 0,
            },
            tooltip: {
                trigger: 'axis',
                show: true,
                confine: true,
                textStyle: {
                    textShadowColor: 'transparent',
                    textShadowBlur: 10,
                }
            },
            xAxis: {
                type: 'category',
                data: [
                    '新单',
                    '返单',
                    '返改/样转批',
                    '仅报价',
                    '已投料',
                ],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisLabel: {
                    // rotate: 15,
                    showMaxLabel: true,
                    // hideOverlap: false,
                    // fontSize: 10,
                    color: '#333333',
                    interval: 0,
                },
                // splitArea: {
                //   show: true,
                //   interval: 0,
                //   areaStyle: {
                //     color: ['rgba(200,200,200,0.3)','rgba(200,200,200,0.3)']
                //   }
                // },
                // splitLine: {
                //   show: true,
                //   lineStyle: {
                //     width: 3,
                //     color: ['#fff']
                //   }
                // }
            },
            yAxis: {
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'left'
                },
                name: item.unit,
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#333333',
                    },
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    // rotate: 30,
                    // width: 10,
                    // overflow: 'truncate',
                    // fontSize: 10,
                    // margin: 2,
                    color: '#333333',
                    interval: 0,
                    formatter: (params) => {
                        params = params.toString()
                        // params = params.substring(0, 12) // 最多三行
                        let resStr = ''
                        let provideNumber = 6 // 一行显示几个字
                        let paramsLen = params.length // 当前名称的长度
                        if (paramsLen > provideNumber) {
                            let start = 0
                            for (let i = 0; i < Math.ceil(paramsLen / provideNumber); i++) {
                                resStr += params.substring(start, start + provideNumber) + '\n'
                                start = (start + 1) * provideNumber
                            }
                        } else {
                            resStr = params
                        }
                        return resStr
                    }
                }
            },
            series: data
        }
        setChartOptions(option)
    }

    // 设置周趋势
    const setChartWeek = (opt, chartType = '') => {
        let item = opt || option3
        item = item ? JSON.parse(JSON.stringify(item)) : item
        let chart = chartType || showTableType2
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let tempWeeks = weekList?.length ? weekList[0]?.list : []
        let isWan = false
        if (['sumArea','sumPrice'].includes(item.field)) {
            console.log(weekList, tempWeeks)
            isWan = weekList.some((s) => {
                return s.list.some((subS) => {
                    // console.log(subS)
                    if (subS[item.field] >= 10000) {
                        return true
                    }
                })
            })
        }
        console.log('isWan-', isWan)
        tempWeeks?.length && tempWeeks.map((m, mI) => {
            let tempItem = []
            weekList.map((w) => {
                let crtVal = w?.list.find((f) => f.name == m.name)[item.field]
                if (item.field == 'sumArea' && isWan) {
                    crtVal = getWan(crtVal, 4)
                }
                if (item.field == 'sumPrice' && isWan) {
                    crtVal = getWan(crtVal, 2)
                }
                tempItem.push((tagInfo?.field == 3 && sysTime.year == dayjs(queryDay || new Date()).format('YYYY') && (Number(w?.day.replace('月','')) > month)) ? '' : crtVal)
            })
            data.push({
                name: m.name,
                data: tempItem,
                type: chart == '1' ? 'bar' : 'line',
                itemStyle: {
                    color: color[mI]
                }
            })
        })
        if (!isWan && ['sumArea','sumPrice'].includes(item.field)) {
            item.unit = item.unit.replace('万','')
        }

        // console.log(data)
        const option = {
            // title: {
            //     text: item.title
            // },
            legend: {
                top: 0,
                left: 0,
                itemWidth: 18,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                },
                data: tempWeeks?.length ? tempWeeks.map((m) => m.name) : [],
            },
            grid: {
                show: false,
                left: '15%',
                right: '5%',
                bottom: 50,
                containLabel: false,
                borderWidth: 0,
            },
            tooltip: {
                trigger: 'axis',
                show: true,
                confine: true,
                textStyle: {
                    textShadowColor: 'transparent',
                    textShadowBlur: 10,
                }
            },
            xAxis: {
                name: '时间',
                nameGap: 18,
                nameLocation: 'start',
                type: 'category',
                data: weekList?.length ? weekList.map((m) => m.day) : [],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisLabel: {
                    rotate: 35,
                    showMaxLabel: true,
                    // hideOverlap: false,
                    // fontSize: 10,
                    color: '#333333',
                    interval: 0,
                },
                // splitArea: {
                //   show: true,
                //   interval: 0,
                //   areaStyle: {
                //     color: ['rgba(200,200,200,0.3)','rgba(200,200,200,0.3)']
                //   }
                // },
                // splitLine: {
                //   show: true,
                //   lineStyle: {
                //     width: 3,
                //     color: ['#fff']
                //   }
                // }
            },
            yAxis: {
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'left'
                },
                name: item.unit,
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#333333',
                    },
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    // rotate: 30,
                    // width: 10,
                    // overflow: 'truncate',
                    // fontSize: 10,
                    // margin: 2,
                    color: '#333333',
                    interval: 0,
                    formatter: (params) => {
                        params = params.toString()
                        // params = params.substring(0, 12) // 最多三行
                        let resStr = ''
                        let provideNumber = 6 // 一行显示几个字
                        let paramsLen = params.length // 当前名称的长度
                        if (paramsLen > provideNumber) {
                            let start = 0
                            for (let i = 0; i < Math.ceil(paramsLen / provideNumber); i++) {
                                resStr += params.substring(start, start + provideNumber) + '\n'
                                start = (start + 1) * provideNumber
                            }
                        } else {
                            resStr = params
                        }
                        return resStr
                    }
                }
            },
            series: data,
            // dataZoom: [{
            //     type: 'slider',
            //     show: weekList?.length > 7,
            //     height: 10,
            //     moveHandleSize: 10,
            //     bottom: 0,
            //     startValue: 0,
            //     endValue: 6,
            //     brushSelect: false,
            //     zoomLock: true,
            // }]
        }
        setChartOptionsWeek(option)
    }

    // 月份搜索
    const changeTime = (e) => {
        setQueryDay(e?.detail?.value)
        let params = { queryDay: e?.detail?.value }
        Taro.showLoading({ mask: true })
        Promise.all([marketDailyReportLine(params, false)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // // 改变搜索日期
    // const changeTag = (id) => {
    //     setTagId(id)
    //     // marketDailyReport({ tagId: id })
    //     Taro.showLoading({ mask: true })
    //     Promise.all([marketDailyReport({ tagId: id }, false), marketDailyReportLine({ tagId: id }, false)]).finally(() => {
    //         Taro.hideLoading()
    //     })
    // }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            setOption1(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'options2') {
            setOption2(optionList[Number(e?.detail?.value)])
            setChartDay(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'options3') {
            setOption3(optionList[Number(e?.detail?.value)])
            setChartWeek(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'optionType') {
            setOptionType(optionTypeList[Number(e?.detail?.value)])
            // setChartWeek(optionList[Number(e?.detail?.value)])
            let params = { orderType: optionTypeList[Number(e?.detail?.value)]?.field }
            marketDailyReportLine(params, true)
        } else if (tempType == 'tagInfo') {
            setTagInfo(tagList[Number(e?.detail?.value)])
            let params = { tagId: tagList[Number(e?.detail?.value)]?.field }
            marketDailyReportLine(params, true)
        }
    }

    // // 展示日期
    // const showDateTxt = () => {
    //     let res = tagId == -1 ? '昨日' : tagId == 1 ? '当日' : tagId == 2 ?  '本周' : '当月'
    //     if (tagId == 3 && dayjs(sysTime?.crtDate || new Date()).format('YYYY-MM') != dayjs(queryDay || new Date()).format('YYYY-MM')) {
    //         res = dayjs(queryDay).format('M月')
    //     }
    //     return res
    // }

    // 页面跳转
    const toPath = (url) => {
        Taro.navigateTo({url})
    }

    return (
        <View className={`daily engineering-daily ${disPage}`}>
            <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>

            {/* <View className='flex flex-between'> */}
            {/* <View className='daily-head-tag flex flex-between'>
                <View className='daily-tag-list'>
                {
                    tagList.map((item) => {
                        return (
                            <View className={`daily-tag ${item.id == tagId && 'daily-tag-active'}`} onClick={() => changeTag(item.id)}>{item.title}</View>
                        )
                    })
                }
                </View>
                {tagId == 3 ? <View className='daily-head-right'>
                    <Picker mode='date' fields='month' onChange={(e) => changeTime(e)}>
                        <View className='m-b-20 flex flex-end'>
                            {queryDay}&nbsp;<View className='primary-bottom'></View>
                        </View>
                    </Picker>
                </View> : <></>}
            </View> */}
                {/* <View style={'margin-bottom: 20rpx'}>
                    <GTooltip msg={
                        <View style={'display: inline-block;width: 100%;text-align: left;white-space: pre-wrap;font-size: 26rpx;'}>{`1.按周/按月查询均是从本周/本月查询\n2.除预投数据外，皆只查询销售角色人员数据\n3.款数统计：同销售订单同产品编码算做1款`}</View>
                    }></GTooltip>
                </View>
            </View> */}

            {
            reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
                return (
                <>
                {(row?.id == 1) && row?.show ? <><View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        {/* <View className='daily-nav-tip'>{showDateTxt()}数据</View> */}
                        <View className='daily-nav-title'>下单</View>
                    </View>

                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：销售角色人员下单的已审核订单款数，同销售单号同产品编码算1款`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        <View className='daily-nav-value'>{list?.orderTotalVo?.sumQuantity || 0}</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：销售角色人员下单的已审核订单面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        <View className='daily-nav-value'>{list?.orderTotalVo?.sumArea || 0}</View>
                    </View>
                </View></> : <></>}

                {(row?.id == 2) && row?.show ? <><View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        {/* <View className='daily-nav-tip'>{showDateTxt()}数据</View> */}
                        <View className='daily-nav-title'>预投</View>
                    </View>

                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：预投审核通过的MI款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        <View className='daily-nav-value'>{list?.preInvestmentTotalVo?.sumQuantity || 0}</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：预投审核通过的预投面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        <View className='daily-nav-value'>{list?.preInvestmentTotalVo?.sumArea || 0}</View>
                    </View>
                </View></> : <></>}

                {(row?.id == 3) && row?.show ? <><View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>统计表</View>
                        <View className='flex-grow'></View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType1+'') ? <>
                    <View className='flex flex-end m-b-10'>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option2?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View>
                    <View style={{ width: '100%', height: '300px' }}>
                        {chartOptions ? <Echarts
                            isPage={false}
                            ref={echartsRef}
                            echarts={echartsJs}
                            option={chartOptions}
                            canvasId={`${option2.field}`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        /> : <></>}
                    </View>
                    </> : <>
                    <View className='flex flex-end m-b-10'>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options1')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option1?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View>
                    <GTable list={list?.orderPersonalCapacityVos} titleList={[
                        { title: '', field: 'name' },
                        { title: '新单', field: 'order.'+option1?.field },
                        { title: '返单', field: 'returned.'+option1?.field },
                        { title: '返改/样转批', field: 'returnChange.'+option1?.field },
                        { title: '合计', field: 'total.'+option1?.field },
                        { title: '仅报价', field: 'quotation.'+option1?.field },
                        { title: '已投料', field: 'production.'+option1?.field },
                        // { title: '返单', field: 'returned.'+item.field, children: [
                        //     {title: '返单1', field: 'returned.'+item.field},
                        //     {title: '返单2', field: 'returned.'+item.field},
                        // ] },
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        if (title.title == '仅报价' && title.field == 'quotation.productionQuantity') {
                            value = '/'
                        }
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                    </>}
                </View></> : <></>}

                {/* {(row?.id == 4) && row?.show ? <><View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>统计图</View>
                        <View className='flex-grow'></View>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option2?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <View className='flex flex-end daily-card-switch-box'>
                            <View className='daily-card-switch-text'>{chartType ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch' color='#2D90ED' checked={chartType} onChange={(e) => changeChart(e.detail.value, 'options2')}/>
                        </View>
                    </View>
                    {
                    <View style={{ width: '100%', height: '300px' }}>
                        {chartOptions ? <Echarts
                            isPage={false}
                            ref={echartsRef}
                            echarts={echartsJs}
                            option={chartOptions}
                            canvasId={`${option2.field}`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        /> : <></>}
                    </View>
                    }
                </View></> : <></>} */}

                {(row?.id == 5) && row?.show ? <><View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>下单图表</View>
                        <View className='flex-grow'></View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                    </View>
                    <View className='flex flex-start m-b-10'>
                        <Picker mode='selector' rangeKey='title' range={tagList} onChange={(e) => changeOption(e, 'tagInfo')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{tagInfo?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        {/* {tagInfo?.field == 3 ?
                        <Picker mode='date' fields='month' onChange={(e) => changeTime(e)}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                {queryDay}&nbsp;<View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        : <></>} */}
                        
                        <View className='flex-grow'></View>
                        <Picker mode='selector' rangeKey='title' range={optionTypeList} onChange={(e) => changeOption(e, 'optionType')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionType?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options3')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option3?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType2+'') ? <>
                    <View style={{ width: '100%', height: '300px' }}>
                        {chartOptionsWeek ? <Echarts
                            isPage={false}
                            ref={echartsRef1}
                            echarts={echartsJs}
                            option={chartOptionsWeek}
                            canvasId={`orderChart${option3?.field}`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        /> : <></>}
                    </View>
                    </> : <>
                    <View style={'max-height: 668rpx;overflow-y: auto;'}>
                    <GTable list={weekList} titleList={[
                        { title: '时间', field: 'day' },
                        ...(weekList?.length ? weekList[0].list.map((m) => {
                            return {
                                title: m.name, field: option3.field, key: m.userId
                            }
                        }) : [])
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let value = slotIndex == 0 ? item[title.field] : ((slotIndex - 1) <= item.list?.length ? item.list.find((f) => f.userId == title.key)[title.field] : '')
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                    </View>
                    </>
                    }
                </View></> : <></>}
                </>
                )
            }) : <></>
            }

            <Canvas canvasId={`${option3?.field}1`} style={'display: none;'}></Canvas>
            <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
                <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=3')}>报表配置</View>
            </GFixedIcon>
            <GFeedback></GFeedback>
        </View>
    )
}
