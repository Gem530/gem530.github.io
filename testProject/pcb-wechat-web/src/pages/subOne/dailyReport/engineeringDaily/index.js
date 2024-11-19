import './index.less'
import dayjs from 'dayjs'
// import { AtSwitch } from 'taro-ui'
import Echarts from 'taro-react-echarts'
// import echartsJs from '../../../util/echarts'
import GTable from '../../../../components/g-table'
import { useRef, useState, useEffect } from 'react'
import GTooltip from '../../../../components/g-tooltip'
import GFeedback from '../../../../components/g-feedback'
import { getSystemTimeAPI } from '../../../services/upload'
import GFixedIcon from '../../../../components/g-fixed-icon'
import { initEngineerDaily } from '../../../util/reportInit'
import DateDrawer from '../../../../packageB/report/components/dateDrawer'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { View, Switch, Picker, Canvas, Image, Swiper, SwiperItem } from '@tarojs/components'
import { dailySwitchAPI, projectDailyReportHeardAPI, projectDailyReportExcelAPI, projectDailyReportLineAPI } from '../../../services/dailyReport'

export default function EngineeringDaily({ echartsJs }) {
    const optionList = [
        {title: '绩效款数', field: '3', unit: '款数'},
        {title: '完成款数', field: '2', unit: '款数'},
        {title: '分配款数', field: '1', unit: '款数'},
    ]
    const optionLayerList = [
        {title: '单面板', field: '1'},
        {title: '双面板', field: '2'},
        {title: '四层板', field: '4'},
        {title: '六层板', field: '6'},
        {title: '八层板', field: '8'},
        {title: '十层板', field: '10'},
        {title: '十二层板', field: '12'},
        {title: '十四层板', field: '14'},
        {title: '十六层板', field: '16'},
    ]
    const echartsRef = useRef()
    const [list, setList] = useState()
    const [type, setType] = useState('')
    const [month, setMonth] = useState('')
    const [sysTime, setSysTime] = useState('')
    const [timeTip, setTimeTip] = useState('')
    const [headInfo, setHeadInfo] = useState()
    const [weekList, setWeekList] = useState()
    const [listEchart, setListEchart] = useState()
    const [chartType, setChartType] = useState(false)
    const [reportConfig, setReportConfig] = useState()
    const [chartTypeWeek, setChartTypeWeek] = useState(false)
  
    const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
    const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    const [endTime, setEndTime] = useState(initEnd)
    const [startTime, setStartTime] = useState(initStart)

    const [option1, setOption1] = useState(optionList[0])
    const [option2, setOption2] = useState(optionList[0])
    const [option3, setOption3] = useState(optionList[0])
    const [optionLayer1, setOptionLayer1] = useState(optionLayerList[0])
    const [optionLayer2, setOptionLayer2] = useState(optionLayerList[0])
    const [optionLayer3, setOptionLayer3] = useState(optionLayerList[0])
    const [chartOptions, setChartOptions] = useState()
    const [chartOptionsWeek, setChartOptionsWeek] = useState()

    const [tagId, setTagId] = useState(1)
    const [queryDay, setQueryDay] = useState(dayjs(new Date()).format('YYYY-MM'))
    const [tagList, setTagList] = useState([
        // { id: -1, name: '昨日' },
        { id: 1, name: '按日' },
        { id: 2, name: '按周' },
        { id: 3, name: '按月' },
    ])
    useDidShow(async () => {
        getSystemTime()
        // try {
        //     Taro.showLoading({ mask: true })
        //     await projectDailyReportHeard()
        //     await projectDailyReportExcel('', false)
        //     await projectDailyReportExcelEachart('', false)
        //     await projectDailyReportLine()
        // } finally {
        //     Taro.hideLoading()
        // }
        Taro.showLoading({ mask: true })
        Promise.all([getVisHidConfig(), projectDailyReportHeard(), projectDailyReportExcel('', false), projectDailyReportExcelEachart('', false), projectDailyReportLine('', false)]).finally(() => {
            Taro.hideLoading()
        })
    })
    // useEffect(() => {
    //     if (listEchart) {
    //         setChartDay()
    //     }
    // }, [listEchart])
    useEffect(() => {
        if (chartOptionsWeek) {
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
    }, [chartOptionsWeek, echartsRef])

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
            dailySwitchAPI('2').then((res) => {
                if (res.code == 200) {
                    let data = JSON.parse(JSON.stringify(res.data || {}))
                    data.configParam = data?.configParam ? JSON.parse(data.configParam) : initEngineerDaily

                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    initEngineerDaily.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(data.configParam)), initEngineerDaily)
                    // 获取 初始化数组中 新增的数据
                    let tempConfig = initEngineerDaily.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = data.configParam.filter((f) => !initEngineerDaily.map((m) => m.id).includes(f.id))
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

    // 获取工程日报 头部
    const projectDailyReportHeard = (query) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId
            }
            let tempDay = query?.queryDay ? query.queryDay : queryDay
            if (params.type == 3 && tempDay) {
                params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            }
            // if (query?.tagId == -1) {
            //     params.type = 1
            //     params.queryDay = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            // }
            projectDailyReportHeardAPI(params).then((res) => {
                if (res.code == 200) {
                    setHeadInfo(res.data)
                    setTimeTip(res.data?.timeRange)
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => reject(false))
        })
    }

    // 获取工程日报 表格
    const projectDailyReportExcel = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId,
                layer: query?.layer ? query?.layer : optionLayer1?.field,
                dateType: query?.dateType ? query?.dateType : option1?.field,
            }
            let tempDay = query?.queryDay ? query.queryDay : queryDay
            if (params.type == 3 && tempDay) {
                params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            }
            // if (query?.tagId == -1) {
            //     params.type = 1
            //     params.queryDay = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            // }
            flag && Taro.showLoading({ mask: true })
            projectDailyReportExcelAPI(params).then((res) => {
                if (res.code == 200) {
                    setList(res.data)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => reject(false))
        })
    }

    // 获取工程日报 图表
    const projectDailyReportExcelEachart = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId,
                layer: query?.layer ? query?.layer : optionLayer2?.field,
                dateType: query?.dateType ? query?.dateType : option2?.field,
            }
            if (query?.tagId == -1) {
                params.type = 1
                params.queryDay = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            }
            let tempDay = query?.queryDay ? query.queryDay : queryDay
            if (params.type == 3 && tempDay) {
                params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            }
            flag && Taro.showLoading({ mask: true })
            projectDailyReportExcelAPI(params).then((res) => {
                if (res.code == 200) {
                    setListEchart(res.data)
                    setChartDay(res.data)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => reject(false))
        })
    }

    // 获取工程日报 周趋势
    const projectDailyReportLine = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId,
                layer: query?.layer ? query?.layer : optionLayer3?.field,
                dateType: query?.dateType ? query?.dateType : option3?.field,
            }
            if (query?.tagId == -1) {
                params.type = 1
                params.queryDay = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            }
            let tempDay = query?.queryDay ? query.queryDay : queryDay
            if (params.type == 3 && tempDay) {
                params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            }
            flag && Taro.showLoading({ mask: true })
            projectDailyReportLineAPI(params).then((res) => {
                if (res.code == 200) {
                    let tempList = res.data?.length ? res.data.sort((a, b) => a.index - b.index) : []
                    setWeekList(tempList)
                    setChartWeek(tempList, '', params)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => reject(false))
        })
    }

    // 设置统计图
    const setChartDay = (tempList, chart = '') => {
        let optChart = (chart + '') ? chart : chartType
        let dataList = tempList ? tempList : listEchart
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        dataList?.length && dataList.filter((f) => f.userName != '合计').map((m, mI) => {
            data.push({
                name: m.userName,
                data: [m.modelNew, m.batchNew, m.returnChange, m.returned, m.sampleToQuantity],
                type: optChart ? 'line' : 'bar',
                itemStyle: {
                    color: color[mI]
                }
            })
        })
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
                data: dataList?.length ? dataList.filter((f) => f.userName != '合计').map((m) => m.userName) : [],
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
                    '样板新单',
                    '批量新单',
                    '返单有改',
                    '返单',
                    '样转批',
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
                name: '款数',
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
                        let provideNumber = 4 // 一行显示几个字
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
        // console.log('dataList:', dataList, data, option)
        setChartOptions(option)
    }

    // 设置周趋势
    const setChartWeek = (tempList, chart = '', params) => {
        let optChart = (chart + '') ? chart : chartTypeWeek
        let dataList = tempList ? tempList : weekList
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let tempWeeks = dataList?.length ? dataList[0]?.list : []
        tempWeeks?.length && tempWeeks.filter((f) => f.name != '合计').map((m, mI) => {
            let tempItem = []
            dataList.map((w) => {
                let crtVal = w?.list.find((f) => f.name == m.name)['sum']
                tempItem.push((tagId == 3 && sysTime.year == dayjs(params?.queryDay || queryDay || new Date()).format('YYYY') && (Number(w?.day.replace('月','')) > month)) ? '' : crtVal)
            })
            data.push({
                name: m.name,
                data: tempItem,
                type: optChart ? 'line' : 'bar',
                itemStyle: {
                    color: color[mI]
                }
            })
        })
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
                data: tempWeeks?.length ? tempWeeks.filter((f) => f.name != '合计').map((m) => m.name) : [],
            },
            grid: {
                show: false,
                top: '27%',
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
                data: dataList?.length ? dataList.map((m) => m.day) : [],
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
                splitArea: {
                  show: true,
                  interval: 0,
                  areaStyle: {
                    color: ['rgba(200,200,200,0.3)','rgba(200,200,200,0.3)']
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    width: 3,
                    color: ['#fff']
                  }
                }
            },
            yAxis: {
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'left'
                },
                name: '款数',
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
                        let provideNumber = 4 // 一行显示几个字
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
            //     show: dataList?.length > 7,
            //     height: 10,
            //     moveHandleSize: 10,
            //     bottom: 0,
            //     startValue: 0,
            //     endValue: 6,
            //     brushSelect: false,
            //     zoomLock: true,
            // }]
        }
        console.log('options:', option)
        setChartOptionsWeek(option)
    }

    // 月份搜索
    const changeTime = (e) => {
        setQueryDay(e?.detail?.value)
        let params = { tagId: tagId, queryDay: e?.detail?.value }
        Taro.showLoading({ mask: true })
        Promise.all([projectDailyReportExcel(params, false), projectDailyReportExcelEachart(params, false), projectDailyReportLine(params, false)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // 改变搜索日期
    const changeTag = (id) => {
        setTagId(id)
        Taro.showLoading({ mask: true })
        // projectDailyReportHeard({tagId: id}), 只需在进入页面时查询一次，不跟时间变化
        Promise.all([projectDailyReportExcel({tagId: id}, false), projectDailyReportExcelEachart({tagId: id}, false), projectDailyReportLine({tagId: id}, false)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            let tempOpt = optionList[Number(e?.detail?.value)]
            setOption1(tempOpt)
            projectDailyReportExcel({dateType: tempOpt?.field})
        } else if (tempType == 'options2') {
            let tempOpt = optionList[Number(e?.detail?.value)]
            setOption2(tempOpt)
            projectDailyReportExcelEachart({dateType: tempOpt?.field})
        } else if (tempType == 'options3') {
            let tempOpt = optionList[Number(e?.detail?.value)]
            setOption3(tempOpt)
            projectDailyReportLine({dateType: tempOpt?.field})
        }if (tempType == 'optionsLayer1') {
            let tempOpt = optionLayerList[Number(e?.detail?.value)]
            setOptionLayer1(tempOpt)
            projectDailyReportExcel({layer: tempOpt?.field})
        } else if (tempType == 'optionsLayer2') {
            let tempOpt = optionLayerList[Number(e?.detail?.value)]
            setOptionLayer2(tempOpt)
            projectDailyReportExcelEachart({layer: tempOpt?.field})
        } else if (tempType == 'optionsLayer3') {
            let tempOpt = optionLayerList[Number(e?.detail?.value)]
            setOptionLayer3(tempOpt)
            projectDailyReportLine({layer: tempOpt?.field})
        }
    }

    // 改变展示的图表格式
    const changeChart = (val, tempType) => {
        // console.log(val, tempType)
        if (tempType == 'options2') {
            setChartType(val)
            setChartDay('', val)
        } else if (tempType == 'options3') {
            setChartTypeWeek(val)
            setChartWeek('', val)
        }
    }

    // 页面跳转
    const toPath = (url) => {
        Taro.navigateTo({url})
    }

    return (
        <View className='daily engineering-daily'>
            <DateDrawer end={initEnd} start={initStart}></DateDrawer>
            {/*  confirm={confirmHandle} disPage={(value) => setDisPage(value)} */}

            <View className='daily-head-tag flex flex-between'>
                <View className='daily-tag-list'>
                {
                    tagList.map((item) => {
                        return (
                            <View className={`daily-tag ${item.id == tagId && 'daily-tag-active'}`} onClick={() => changeTag(item.id)}>{item.name}</View>
                        )
                    })
                }
                </View>

                <View className='flex flex-end'>
                    {tagId == 3 ? <View className='daily-head-right' style={'margin-top: 5rpx;margin-right: 20rpx;'}>
                        <Picker mode='date' fields='month' onChange={(e) => changeTime(e)}>
                            <View className='m-b-20 flex flex-end'>
                                {queryDay}&nbsp;<View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View> : <></>}
                    <View className='m-b-20'>
                        <GTooltip msg={`绩效款数规则：\r\n\r\n样板新单：单双面为:1 四层板为:1.5 六层板为:2.0 ,每多两层加0.5\r\n量产新单: 单双面为:1.5 四层板为:2.0 六层板为:2.5 ,每多两层加0.5\r\n返单有改：单双面为:0.8 四层板为:1.3 六层板为:1.8,每多两层加0.5\r\n返单：每款0.25\r\n样转批：单双面为:0.5 四层板为:1 六层板为:1.5 , 每多两层加0.5`}></GTooltip>
                    </View>
                </View>
            </View>
            {
            reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
                return (
                <>
                {(row?.id == 1) && row?.show ? <>
                <View className='daily-nav has-left'>
                    {/* <View className='daily-nav-left'>
                        <View className='daily-nav-tip'>当日数据</View>
                        <View className='daily-nav-title'>下单</View>
                    </View> */}

                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>待分配
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：正常订单的待分配的订单款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'></View>
                        </View>
                        <View className='daily-nav-value'>{headInfo?.waitAssignCount || 0}</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>待审核
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：正常订单的待审核状态的MI款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'></View>
                        </View>
                        <View className='daily-nav-value'>{headInfo?.waitAuditCount || 0}</View>
                    </View>
                </View>
                </> : <></>}
                {(row?.id == 2) && row?.show ? <>
                <View className='daily-nav has-left'>
                    {/* <View className='daily-nav-left'>
                        <View className='daily-nav-tip'>当日数据</View>
                        <View className='daily-nav-title'>预投</View>
                    </View> */}

                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>制作中
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：${timeTip}，订单分配-正常订单的结存数量`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'></View>
                        </View>
                        <View className='daily-nav-value'>{headInfo?.makingCount || 0}</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>结存面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：${timeTip}，订单分配-正常订单的结存面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        <View className='daily-nav-value'>{headInfo?.balanceArea || 0}</View>
                    </View>
                </View>
                </> : <></>}
                {(row?.id == 3) && row?.show ? <>
                <View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>统计表</View>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options1')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option1?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <Picker mode='selector' rangeKey='title' range={optionLayerList} onChange={(e) => changeOption(e, 'optionsLayer1')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionLayer1?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View>
                    <GTable list={list} titleList={[
                        { title: '', field: 'userName' },
                        { title: '样板新单', field: 'modelNew' },
                        { title: '批量新单', field: 'batchNew' },
                        { title: '返单有改', field: 'returnChange' },
                        { title: '返单', field: 'returned' },
                        { title: '样转批', field: 'sampleToQuantity' },
                        { title: '合计', field: 'sum' },
                        // { title: '返单', field: 'returned.'+item.field, children: [
                        //     {title: '返单1', field: 'returned.'+item.field},
                        //     {title: '返单2', field: 'returned.'+item.field},
                        // ] },
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                </View>
                </> : <></>}
                {(row?.id == 4) && row?.show ? <>
                <View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>{tagId == -1 ? '昨日' : tagId == 1 ? '日' : tagId == 2 ?  '周' : '月'}趋势</View>
                        <View className='flex-grow'></View>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options3')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{option3?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <Picker mode='selector' rangeKey='title' range={optionLayerList} onChange={(e) => changeOption(e, 'optionsLayer3')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionLayer3?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <View className='flex flex-end'>
                            <View className='daily-card-switch-text'>{chartTypeWeek ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch' color='#2D90ED' checked={chartTypeWeek} onChange={(e) => changeChart(e.detail.value, 'options3')}/>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: '310px' }}>
                        {chartOptionsWeek ? <Echarts
                            isPage={false}
                            ref={echartsRef}
                            echarts={echartsJs}
                            option={chartOptionsWeek}
                            canvasId={`optionsEngineering3`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '310px' }}
                            // className='echarts-dom'
                        /> : <></>}
                    </View>       
                </View>
                </> : <></>}
                </>
                )
            }) : <></>
            }

            {/* <View className='daily-card'>
                <View className='daily-card-title flex flex-start'>
                    <View>统计图</View>
                    <View className='flex-grow'></View>
                    <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                        <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                            <View>{option2?.title}</View>
                            <View className='primary-bottom'></View>
                        </View>
                    </Picker>
                    <Picker mode='selector' rangeKey='title' range={optionLayerList} onChange={(e) => changeOption(e, 'optionsLayer2')}>
                        <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                            <View>{optionLayer2?.title}</View>
                            <View className='primary-bottom'></View>
                        </View>
                    </Picker>
                    <View className='flex flex-end'>
                        <View className='daily-card-switch-text'>{chartType ? '折线图' : '柱状图'}</View>
                        <Switch className='daily-switch' color='#2D90ED' checked={chartType} onChange={(e) => changeChart(e.detail.value, 'options2')}/>
                    </View>
                </View>
                <View style={{ width: '100%', height: '300px' }}>
                    {chartOptions ? <Echarts
                        isPage={false}
                        ref={echartsRef}
                        echarts={echartsJs}
                        option={chartOptions}
                        canvasId={`optionsEngineering1`}
                        // style自定义设置echarts宽高
                        style={{ width: '100%', height: '300px' }}
                        // className='echarts-dom'
                    /> : <></>}
                </View>
            </View> */}

            <Canvas canvasId={`${option3?.field}1`} style={'display: none;'}></Canvas>
            <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
                <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=2')}>报表配置</View>
            </GFixedIcon>
            <GFeedback></GFeedback>
        </View>
    )
}
