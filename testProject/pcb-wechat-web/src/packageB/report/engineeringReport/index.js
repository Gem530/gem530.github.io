import './index.less'
import dayjs from 'dayjs'
import Echarts from 'taro-react-echarts'
import { useRef, useState, useEffect } from 'react'
import GUp from '../../../components/g-up'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
// import DateChoose from '../components/dateChoose'
import DateDrawer from '../components/dateDrawer'
import echartsJs from '../../../pages/util/echarts'
import GTooltip from '../../../components/g-tooltip'
import { priceFormat } from '../../../pages/util/func'
import GFeedback from '../../../components/g-feedback'
import GFixedIcon from '../../../components/g-fixed-icon'
import GSplitNumber from '../../../components/g-split-number'
import { getSystemTimeAPI } from '../../../pages/services/upload'
import { initEngineerReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import { View, Image, Switch, Picker, Canvas, ScrollView } from '@tarojs/components'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { projectReportHeardAPI, projectDailyReportLineAPI, getProjectReportThirtyExcelAPI } from '../../../pages/services/reportForms/index'

export default function EngineeringReport() {
    const dateOption = [
        {title: '按日统计', field: '1', unit: ''},
        {title: '按周统计', field: '2', unit: ''},
        {title: '按月统计', field: '3', unit: ''},
    ]
    const countOption = [
        {title: '绩效款数', field: '3', unit: ''},
        {title: '完成款数', field: '2', unit: ''},
        {title: '分配款数', field: '1', unit: ''},
    ]
    const optionTypeList = [
        {title: '全部', field: '0'},
        {title: '新单', field: '1'},
        {title: '返单', field: '2'},
        {title: '返单有改', field: '3'},
        {title: '样转批', field: '4'},
    ]
    const optionList = [
        {title: '全部', field: '0', unit: '板'},
        {title: '单面板', field: '1', unit: '板'},
        {title: '双面板', field: '2', unit: '板'},
        {title: '四层板', field: '4', unit: '板'},
        {title: '六层板', field: '6', unit: '板'},
        {title: '八层板', field: '8', unit: '板'},
        {title: '八层以上', field: '18', unit: '板'}, // 8层以上
    ]
    const echartsRef = useRef()
    const echartsRef1 = useRef()
    const [head, setHead] = useState()
    const [type, setType] = useState('')
    const [month, setMonth] = useState('')
    const [miList, setMiList] = useState([])
    const [disPage, setDisPage] = useState('')
    const [miFlag, setMiFlag] = useState(false)
    const [countList, setCountList] = useState([])
    const [isRedirect, setIsRedirect] = useState(0)
    const [countFlag, setCountFlag] = useState(false)
    const [reportConfig, setReportConfig] = useState()
    const [chartOptions, setChartOptions] = useState()
    const [option1, setOption1] = useState(optionList[0])
    const [option2, setOption2] = useState(optionList[0])
    const [option3, setOption3] = useState(optionTypeList[0])
    const [optionDate, setOptionDate] = useState(dateOption[0])
    const [chartOptionsCount, setChartOptionsCount] = useState()
    const [optionCount, setOptionCount] = useState(countOption[0])

    const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格

    const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
    const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    const [endTime, setEndTime] = useState(initEnd)
    const [startTime, setStartTime] = useState(initStart)
    useShareAppMessage(() => {
      return {
        title: '工程报表',
        path: '/pages/index/index'
      }
    })
    useLoad((options) => {
        console.log('options:', options)
        setType(options?.type || 1)
        setIsRedirect(options?.isRedirect || 0)
    })
    useDidShow(() => {
        getSystemTime()
        Taro.showLoading({ mask: true })
        Promise.all([getVisHidConfig(), projectReportHeard(false), getProjectReportThirtyExcel(), projectDailyReportLine(false)]).finally(() => {
            setTimeout(() => Taro.hideLoading(), 1000)
        })
    })
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
        if (chartOptionsCount) {
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
    }, [chartOptions, echartsRef, chartOptionsCount, echartsRef1])

    // 表格，图表切换
    const changeTable = (val, tempType) => {
        let tempVal = val == '3' ? '1' : (Number(val) + 1)
        if (tempType == '1') {
          setShowTableType1(tempVal)
          // console.log(tempVal, tempType)
          // setChartDept('', '', tempVal, '')
          setChartDay('', [], tempVal)
        } else if (tempType == '2') {
          setShowTableType2(tempVal)
          // setChartUser('', '', tempVal, '')
          setChartDayCount('', [], tempVal)
        }
    }

    // 获取服务器时间
    const getSystemTime = () => {
        getSystemTimeAPI().then((res) => {
            if (res.code == 200) {
                setMonth(Number(dayjs(res.data || new Date()).format('MM')))
            }
        })
    }
    // 获取显隐配置
    const getVisHidConfig = () => {
        return new Promise((resolve, reject) => {
            dailySwitchAPI('4').then((res) => {
                if (res.code == 200) {
                    let data = JSON.parse(JSON.stringify(res.data || {}))
                    data.configParam = data?.configParam ? JSON.parse(data.configParam) : initEngineerReport
                    
                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    initEngineerReport.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(data.configParam)), initEngineerReport)
                    // 获取 初始化数组中 新增的数据
                    let tempConfig = initEngineerReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = data.configParam.filter((f) => !initEngineerReport.map((m) => m.id).includes(f.id))
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

    // 获取头部数据
    const projectReportHeard = (flag = true, query) => {
        return new Promise((resolve, reject) => {
            let params = {
                queryDayEnd: query?.end || endTime,
                queryDayStart: query?.start || startTime,
            }
            if (params?.queryDayEnd) {
                params.queryDayEnd = dayjs(params?.queryDayEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
            }
            if (params?.queryDayStart) {
                params.queryDayStart = params?.queryDayStart + ' 00:00:00'
            }
            flag && Taro.showLoading({ mask: true })
            projectReportHeardAPI(params).then((res) => {
                if (res.code == 200) {
                    // console.log(res)
                    res.data.balanceAreaUnit = ''
                    if (res.data.balanceArea >= 10000000) {
                        res.data.balanceArea = res.data.balanceArea / 10000000
                        res.data.balanceAreaUnit = '千万'
                    }
                    res.data.balanceArea = priceFormat(res.data?.balanceArea, 4)
                    setHead(res.data || [])
                    flag && Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }

    // 获取mi单异常数据
    const getProjectReportThirtyExcel = () => {
        return new Promise((resolve, reject) => {
            getProjectReportThirtyExcelAPI().then((res) => {
                if (res.code == 200) {
                    // console.log(res)
                    setMiList(res.data || [])
                    setChartDay('', res.data || [], showTableType1)
                    resolve(true)
                } else reject(res)
            }).catch((err) => reject(err))
        })
    }

    // 获取工程绩效
    const projectDailyReportLine = (flag = true, query, chartType) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.type ? query?.type : optionDate.field,
                layer: query?.layer ? query?.layer : option2.field,
                orderType: query?.orderType ? query?.orderType : option3.field,
                dateType: query?.dateType ? query?.dateType : optionCount.field,
            }
            if (!params?.layer || params?.layer == '0') {
                delete params?.layer
            }
            if (!params?.orderType || params?.orderType == '0') {
                delete params?.orderType
            }
            flag && Taro.showLoading({ mask: true })
            projectDailyReportLineAPI(params).then((res) => {
                if (res.code == 200) {
                    // console.log(res)
                    setCountList(res.data || [])
                    setChartDayCount(params?.type, res.data || [], chartType)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }

    // 动态更新工程绩效统计
    const changeGetEngineering = (query, chartType) => {
        projectDailyReportLine(true, {
            type: query?.type ? query?.type : optionDate.field,
            layer: query?.layer ? query?.layer : option2.field,
            orderType: query?.orderType ? query?.orderType : option3.field,
            dateType: query?.dateType ? query?.dateType : optionCount.field,
        }, chartType)
    }

    // 切换时间
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
        projectReportHeard(true, tempDate)
    }

    // MI单异常数据统计
    const setChartDay = (opt = '', tempArr = [], chartType = '') => {
        let item = opt || option1
        let list = tempArr?.length ? tempArr : miList
        let chart = chartType || showTableType1
        // 数据为空则不展示报表
        if(list?.length == 0) {
          setChartOptions(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let fieldStr = item.field
        // console.log(m, mI)
        data.push({
            name: item.title,
            data: list.map((m) => m?.layerNumMap[fieldStr]),
            type: chart == '1' ? 'bar' : 'line',
            // label: {
            //     show: true,
            //     position: 'insideTopRight',
            //     verticalAlign: 'bottom',
            //     rotate: 90,
            //     formatter: (params) => Number(params?.value) ? params?.value : ''
            // },
            itemStyle: {
                color: '#1890FF'
            }
        })
        const option = {
            grid: {
                show: false,
                top: '8%',
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
                data: list?.length ? list.map((m) => m.day) : [],
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
                // name: item.unit,
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
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
            dataZoom: [{
                type: 'slider',
                show: list?.length > 7,
                height: 10,
                moveHandleSize: 10,
                bottom: 0,
                startValue: list?.length - 6,
                endValue: list?.length,
                brushSelect: false,
                zoomLock: true,
            }]
        }
        console.log(option)
        setChartOptions(option)
    }

    // 工程绩效趋势
    const setChartDayCount = (opt = '', tempArr = [], chartType = '') => {
        let monthTxt = opt || optionDate.field
        let list = tempArr?.length ? tempArr : countList
        let chart = chartType || showTableType2
        // 数据为空则不展示报表
        if(list?.length == 0) {
          setChartOptionsCount(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        // console.log(m, mI)c
        let titleLIst = list?.length ? list[0].list.filter((f) => f.name != '合计').map((m) => m.name) : []
        list?.length && list[0]?.list?.length && list[0].list.filter((f) => f.name != '合计').map((m, mIndex) => {
            let tempDatas = list.map((td) => {
                let res = ''
                let crtVal = td.list.find((tdf) => tdf.name == m.name)?.sum
                res = (monthTxt == 3 && (Number(td?.day.replace('月','')) > month)) ? '' : crtVal
                return res
            })
            // let crtVal = w?.list.find((f) => f.name == m.name)[item.field]
            // if (item.field == 'sumArea') {
            //     crtVal = getWan(crtVal, 4)
            // }
            // if (item.field == 'sumPrice') {
            //     crtVal = getWan(crtVal, 2)
            // }
            // tempItem.push((tagId == 3 && (Number(w?.day.replace('月','')) > month)) ? '' : crtVal)
            data.push({
                name: m.name,
                data: tempDatas,
                type: chart == '1' ? 'bar' : 'line',
                // label: {
                //   show: true,
                //   position: 'inside',
                //   formatter: (params) => params?.value ? params?.value : ''
                // },
                itemStyle: {
                    color: color[mIndex]
                }
            })
        })
        const option = {
            legend: {
                bottom: 0,
                // left: 0,
                itemWidth: 18,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                },
                data: titleLIst,
            },
            grid: {
                show: false,
                top: '8%',
                left: '15%',
                right: '5%',
                bottom: 110,
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
                data: list?.length ? list.map((m) => m.day) : [],
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
                // name: item.unit,
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
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
            //     show: list?.length > 7,
            //     height: 10,
            //     moveHandleSize: 10,
            //     bottom: 0,
            //     startValue: list?.length - 6,
            //     endValue: list?.length,
            //     brushSelect: false,
            //     zoomLock: true,
            // }]
        }
        // console.log(option)
        setChartOptionsCount(option)
    }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            setOption1(optionList[Number(e?.detail?.value)])
            setChartDay(optionList[Number(e?.detail?.value)], [], showTableType1)
        } else if (tempType == 'options2') {
            setOption2(optionList[Number(e?.detail?.value)])
            changeGetEngineering({layer: optionList[Number(e?.detail?.value)]?.field}, showTableType2)
        } else if (tempType == 'options3') {
            setOption3(optionTypeList[Number(e?.detail?.value)])
            changeGetEngineering({orderType: optionTypeList[Number(e?.detail?.value)]?.field}, showTableType2)
        } else if (tempType == 'optionDate') {
            setOptionDate(dateOption[Number(e?.detail?.value)])
            changeGetEngineering({type: dateOption[Number(e?.detail?.value)]?.field}, showTableType2)
        } else if (tempType == 'optionCount') {
            setOptionCount(countOption[Number(e?.detail?.value)])
            changeGetEngineering({dateType: countOption[Number(e?.detail?.value)]?.field}, showTableType2)
        }
        //  else if (tempType == 'showTableType1') {
        //     setshowTableType1(e?.detail?.value)
        //     setChartDay('', [], e?.detail?.value)
        // } else if (tempType == 'chartType2') {
        //     setChartType2(e?.detail?.value)
        //     changeGetEngineering('', e?.detail?.value)
        // }
    }

    const toRecord = () => {
        Taro.navigateTo({ url: '/pages/emailRecord/index' })
    }

    // 页面跳转
    const toPath = (url) => {
        Taro.navigateTo({url})
    }
    return (
        <>
        <View className={`report-page orange ${disPage}`}>
            <NavBar large={true} color={'#333'} title={'工程报表'} transparent={false} leftIconType={'chevron-left'}></NavBar>
            <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>
            {
            reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
                return (
                <>
                {(row?.id == 1) && row?.show ? <><View className='report-top-card'>
                    {/* <DateChoose end={endTime} start={startTime} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateChoose> */}
                    <View className='top-card-list flex flex-start'>
                        <View className='top-card-item'>
                            <View className='top-card-label flex flex-start'>
                                结存面积({(head?.balanceAreaUnit || '') + '㎡'})
                                <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`结存面积：统计下单时间范围内，订单分配-正常订单的订单面积之和`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                            </View>
                            <GSplitNumber number={(head?.balanceArea || '') + ''} classStr='top-card-value flex flex-start'></GSplitNumber>
                            {/* <View className='top-card-value flex flex-start font-number'>
                                {head?.balanceArea.includes('.') ? <>
                                    <View className='top-card-value-large'>{head.balanceArea.split('.')[0]}</View>
                                    .{head.balanceArea.split('.')[1]}
                                </> : <View className='top-card-value-large'>{head?.balanceArea || 0}</View>}
                            </View> */}
                        </View>
                        <View className='top-card-item'>
                            <View className='top-card-label flex flex-start'>
                                结存数量
                                <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`结存数量：统计下单时间范围内，订单分配-正常订单的数量之和`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                            </View>
                            <View className='top-card-value flex flex-start font-number'>
                                <View className='top-card-value-large'>{priceFormat(head?.makingCount || 0, 0)}</View>
                            </View>
                        </View>
                    </View>
                </View></> : <></>}
                {(row?.id == 2) && row?.show ? <><View className='report-box'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            MI单异常数据统计
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`MI单分布总览：不受时间筛选影响，异常数据包括“待分配、制作中、待审核”的MI单`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType1+'') ?
                    <>
                        <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options1')}>
                            <View className='daily-card-switch-text flex flex-end primary-color'>
                                <View>{option1?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        <View style={{ width: '100%', height: '300px' }}>
                            {/* <View className='daily-title margin-top'>{item.title}</View> */}
                            {chartOptions ? <Echarts
                                isPage={false}
                                ref={echartsRef}
                                echarts={echartsJs}
                                canvasId={`option1`}
                                option={chartOptions}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '300px' }}
                            /> : <View className='g-empty-chart'>暂无数据</View>}
                            <Canvas canvasId={`option1`} style="opacity: 1;"></Canvas>
                        </View>
                    </> :
                    <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={miList} titleList={[
                        { title: '日期', field: 'day' },
                        { title: '合计', field: 'layerNumMap.0' },
                        { title: '单面板', field: 'layerNumMap.1' },
                        { title: '双面板', field: 'layerNumMap.2' },
                        { title: '四层板', field: 'layerNumMap.4' },
                        { title: '六层板', field: 'layerNumMap.6' },
                        { title: '八层板', field: 'layerNumMap.8' },
                        { title: '八层以上', field: 'layerNumMap.10' },
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
                    }
                </View></> : <></>}
                {(row?.id == 3) && row?.show ? <><View className='report-box' style={'z-index: 2;'}>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            工程绩效趋势
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msgSlot={
                                <View className='g-tooltip-box'>
                                    <View className='tooltip-title'>绩效款数统计规则：</View>
                                    <View className='tooltip-tip primary-color'>注意：a代表完成款数，b代表板层数</View>
                                    <GTable list={[
                                            { name: '单/双面板', modelNew: '1a', batchNew: '1.5a', returnChange: '0.8a', return: '0.5a', modelToBatch: '0.5a' },
                                            { name: '四层板', modelNew: '1.5a', batchNew: '2.0a', returnChange: '1.3a', return: '0.5a', modelToBatch: '1a' },
                                            { name: '六层板', modelNew: '2a', batchNew: '2.5a', returnChange: '1.8a', return: '0.5a', modelToBatch: '1.5a' },
                                            { name: '六层板以上', modelNew: '2.0a+[(b-6)/2]*0.5', batchNew: '2.5a+[(b-6)/2]*0.5', returnChange: '1.8a+[(b-6)/2]*0.5', return: '0.5a', modelToBatch: '1.5a+[(b-6)/2]*0.5' },
                                    ]} titleList={
                                        [
                                            { title: '', field: 'name' },
                                            { title: '样品新单', field: 'modelNew' },
                                            { title: '批量新单', field: 'batchNew' },
                                            { title: '返单有改', field: 'returnChange' },
                                            { title: '返单', field: 'return' },
                                            { title: '样转批', field: 'modelToBatch' },
                                        ]
                                    }
                                    tdSlot={(title, item, slotIndex) => {
                                        let value = title.field.includes('.') ? (
                                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                                        ) : item[title.field]
                                        // let value = title?.field == 'day' ? item[title.field] : item?.list?.find((f) => f?.name == title?.title)[title?.field]
                                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                                        return (
                                            <View>
                                                {value}
                                            </View>
                                        )
                                    }}
                                    ></GTable>
                                </View>
                            } icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                        {/* {!countFlag ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                            <View className='daily-card-switch-text'>{chartType2 ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType2} onChange={(e) => changeOption(e, 'chartType2')}/>
                        </View> : <></>}
                        {!countFlag ? <View className='report-box-change flex flex-end' onClick={() => setCountFlag(!countFlag)}>
                        <View className='primary-change-table'></View>
                        </View> : <View className='report-box-change flex flex-end' onClick={() => setCountFlag(!countFlag)}>
                            <View className='primary-change-chart'></View>
                        </View>
                        } */}
                    </View>

                    {/* 刷选 */}
                    <View className='flex flex-between'>
                        <View style={'flex: 1;'} className='flex flex-start'>
                            {/* 日周月 */}
                            <Picker mode='selector' rangeKey='title' range={dateOption} onChange={(e) => changeOption(e, 'optionDate')}>
                                <View className='daily-card-switch-text flex flex-end primary-color'>
                                    <View>{optionDate?.title}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker>
                        </View>

                        <View style={'flex: 2;'} className='flex flex-end'>
                            {/* 订单类型 */}
                            <Picker mode='selector' rangeKey='title' range={optionTypeList} onChange={(e) => changeOption(e, 'options3')}>
                                <View className='daily-card-switch-text flex flex-end primary-color'>
                                    <View>{option3?.title}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker>
                            {/* 款数 */}
                            <Picker mode='selector' rangeKey='title' range={countOption} onChange={(e) => changeOption(e, 'optionCount')}>
                                <View className='daily-card-switch-text flex flex-end primary-color'>
                                    <View>{optionCount?.title}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker>
                            {/* 面板层数 */}
                            <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                                <View className='daily-card-switch-text flex flex-end primary-color'>
                                    <View>{option2?.title}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker>
                        </View>
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType2+'') ?
                    <>
                        <View style={{ width: '100%', height: '400px' }}>
                            {/* <View className='daily-title margin-top'>{item.title}</View> */}
                            {chartOptionsCount ? <Echarts
                                isPage={false}
                                ref={echartsRef1}
                                echarts={echartsJs}
                                canvasId={`option2`}
                                option={chartOptionsCount}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '400px' }}
                            /> : <View className='g-empty-chart'>暂无数据</View>}
                        </View>
                    </> :
                    <View style={'max-height: 390px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={countList} titleList={
                        [{ title: '日期', field: 'day' },].concat(
                            countList?.length ? countList[0]?.list.filter((f) => f.name != '合计').map((m) => {
                                return {
                                    title: m.name,
                                    field: 'sum'
                                }
                            }) : []
                        )
                    }
                    tdSlot={(title, item, slotIndex) => {
                        // let value = title.field.includes('.') ? (
                        //     item[title.field.split('.')[0]][title.field.split('.')[1]]
                        // ) : item[title.field]
                        let value = title?.field == 'day' ? item[title.field] : item?.list?.find((f) => f?.name == title?.title)[title?.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                    </View>
                    }
                    <View style={'height: 0px;overflow: hidden;'}>
                    <Canvas canvasId={`option2`} style="opacity: 0;"></Canvas>
                    </View>
                </View></> : <></>}
                </>
                )
            }) : <></>
            }
            
            <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
                <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=4')}>报表配置</View>
            </GFixedIcon>
            <GUp style={{bottom: '292rpx', right: '15rpx'}}></GUp>
            <GFeedback></GFeedback>
        </View>
        </>
    )
}
