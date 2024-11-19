import './index.less'
import dayjs from 'dayjs'
import Echarts from 'taro-react-echarts'
import GUp from '../../../components/g-up'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
// import DateChoose from '../components/dateChoose'
import DateDrawer from '../components/dateDrawer'
import { useRef, useState, useEffect } from 'react'
import echartsJs from '../../../pages/util/echarts'
import GTooltip from '../../../components/g-tooltip'
import GLoading from '../../../components/g-loading'
import GFixedIcon from '../../../components/g-fixed-icon'
import GSplitNumber from '../../../components/g-split-number'
import { priceFormat, getDomRect } from '../../../pages/util/func'
import { initProdcutReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import { View, Image, Switch, Picker, Canvas, ScrollView } from '@tarojs/components'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { scrapAreaAPI, deptCapacityAPI, productionAreaAPI, productionExceptionAPI, getProductionReportTopAPI, getProductionReportBottomAPI } from '../../../pages/services/reportForms/index'
import GFeedback from '../../../components/g-feedback'

export default function ProductReport() {
    const echartsRef = useRef()
    const echartsRef1 = useRef()
    const echartsWorkRef = useRef()
    const echartsWorkTimeRef = useRef()
    const [topInfo, setTopInfo] = useState()
    const [option1, setOption1] = useState()
    const [disPage, setDisPage] = useState('')
    const [bottomInfo, setBottomInfo] = useState()
    const [isRedirect, setIsRedirect] = useState(0)
    const [optionList, setOptionList] = useState([])
    const [reportConfig, setReportConfig] = useState()
    const [chartOptions, setChartOptions] = useState()
    // const [showTable1, setShowTable1] = useState(false)
    // const [showTable2, setShowTable2] = useState(false)
    // const [showTable3, setShowTable3] = useState(false)
    // const [showTable4, setShowTable4] = useState(false)
    // const [chartType1, setChartType1] = useState(false)
    // const [chartType2, setChartType2] = useState(false)
    // const [chartType3, setChartType3] = useState(false)
    // const [chartType4, setChartType4] = useState(false)
    const [chartOptionsWork, setChartOptionsWork] = useState()
    const [chartOptionsCount, setChartOptionsCount] = useState()
    const [chartOptionsCountTime, setChartOptionsCountTime] = useState()

    const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType3, setShowTableType3] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType4, setShowTableType4] = useState('1') // 1柱状图 2线型图 3表格

    const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
    const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    const [endTime, setEndTime] = useState(initEnd)
    const [startTime, setStartTime] = useState(initStart)

    const [scrapArea, setScrapArea] = useState()
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [loading4, setLoading4] = useState(false)
    const [loading5, setLoading5] = useState(false)
    const [loading6, setLoading6] = useState(false)
    const [productArea, setProductArea] = useState()
    const [deptCapacityData, setDeptCapacityData] = useState()
    const [productionExceptionData, setProductionExceptionData] = useState()

    const [showCount, setShowCount] = useState({
        count: true,
        area: true
    })
    const [showCount1, setShowCount1] = useState({
        count: true,
        area: true
    })
    useShareAppMessage(() => {
      return {
        title: '生产报表',
        path: '/pages/index/index'
      }
    })
    useLoad((options) => {
        console.log('options:', options)
        setIsRedirect(options?.isRedirect || 0)
    })
    useDidShow(() => {
        // Taro.showLoading({ mask: true })
        // Promise.all([getProductionReportTop(false), getProductionReportBottom(false)]).then(() => {
        //     Taro.hideLoading()
        // }).catch(() => { setTimeout(() => Taro.hideLoading(), 1000) })
        getVisHidConfig()
        getProductionReportTop(false)
        getProductionReportBottom(false)
    })
    useEffect(() => {
        // console.log('echartsWorkRef', echartsWorkRef?.current, echartsWorkTimeRef?.current)
        // if (echartsWorkRef?.current && !loading5) {
        //     setTimeout(() => {
        //     }, 550)
        // }
        if (echartsWorkRef?.current && !loading5) {
            // 工序结存分布
            setTimeout(() => {
                echartsWorkRef?.current?.chartRef?.current && echartsWorkRef?.current?.chartRef?.current.on('click', async (v) => {
                    const crtData = bottomInfo?.productionReportBottomDayData.find((f) => f.craftName == v.name)
                    // const dom = await getDomRect('#workTimeId')
                    // console.log(crtData)
                    // const crtOption = optionList.find((of) => of.craftName)
                    setOption1(crtData)
                    setChartCountTime('', crtData?.dayList)
                    Taro.pageScrollTo({ selector: '#workTimeId', duration: 100 })
                })
                echartsWorkRef?.current?.chartRef?.current && echartsWorkRef?.current?.chartRef?.current.on('legendselectchanged', async (v) => {
                    setShowCount1({
                        count: v.selected['款数'],
                        area: v.selected['面积(㎡)']
                    })
                })
                if (echartsWorkRef.current?.chartRef?.current) {
                    let crtIndex = echartsWorkRef.current?.chartRef?.current.getOption()?.series?.length ? echartsWorkRef.current?.chartRef?.current.getOption()?.series[0]?.data.length : 0
                    echartsWorkRef.current?.chartRef?.current.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: 0,
                    })
                }
            }, 800)
        }
        if (echartsWorkTimeRef?.current && !loading5) {
            // 工序交期情况分布
            setTimeout(() => {
                echartsWorkTimeRef?.current?.chartRef?.current && echartsWorkTimeRef?.current?.chartRef?.current.on('legendselectchanged', async (v) => {
                    setShowCount({
                        count: v.selected['款数'],
                        area: v.selected['面积(㎡)']
                    })
                })
                if (echartsWorkTimeRef.current?.chartRef?.current) {
                    let crtIndex = echartsWorkTimeRef.current?.chartRef?.current.getOption()?.series?.length ? echartsWorkTimeRef.current?.chartRef?.current.getOption()?.series[0]?.data.length : 0
                    echartsWorkTimeRef.current?.chartRef?.current.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: crtIndex - 1,
                    })
                }
            }, 800)
        }
        if (chartOptionsCount) {
            // 部门产能上报统计 开启最后的tooltip
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
        if (chartOptions) {
            // 排产过数异常统计 开启最后的tooltip
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
    }, [chartOptionsWork, loading5, chartOptions, chartOptionsCount])
    useEffect(() => {
        console.log(showCount, showCount1)
    }, [showCount, showCount1])

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
        } else if (tempType == '3') {
            setShowTableType3(tempVal)
            // setChartUser('', '', tempVal, '')
            setChartDayWork('', [], tempVal)
          } else if (tempType == '4') {
            setShowTableType4(tempVal)
            // setChartUser('', '', tempVal, '')
            setChartCountTime('', option1?.dayList || [], tempVal)
          }
    }

    // 获取显隐配置
    const getVisHidConfig = () => {
        return new Promise((resolve, reject) => {
            dailySwitchAPI('5').then((res) => {
                if (res.code == 200) {
                    let data = JSON.parse(JSON.stringify(res.data || {}))
                    data.configParam = data?.configParam ? JSON.parse(data.configParam) : initProdcutReport

                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    initProdcutReport.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(data.configParam)), initProdcutReport)
                    // 获取 初始化数组中 新增的数据
                    let tempConfig = initProdcutReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = data.configParam.filter((f) => !initProdcutReport.map((m) => m.id).includes(f.id))
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

    // 获取工程绩效
    const getProductionReportTop = (flag = true, query) => {
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
            // flag && Taro.showLoading({ mask: true })
            // getProductionReportTopAPI(params).then((res) => {
            //     if (res.code == 200) {
            //         res.data.sumProductionAreaUnit = ''
            //         res.data.sumScrapAreaUnit = ''
            //         if (res.data.sumProductionArea >= 10000000) {
            //             res.data.sumProductionArea = res.data.sumProductionArea / 10000000
            //             res.data.sumProductionAreaUnit = '千万'
            //         }
            //         if (res.data.sumScrapArea >= 10000000) {
            //             res.data.sumScrapArea = res.data.sumScrapArea / 10000000
            //             res.data.sumScrapAreaUnit = '千万'
            //         }
            //         res.data.sumProductionArea = priceFormat(res.data?.sumProductionArea, 4)
            //         res.data.sumScrapArea = priceFormat(res.data?.sumScrapArea, 4)
            //         setTopInfo(res.data)
            //         flag && Taro.hideLoading()
            //         setChartDay('', res.data?.productionExceptionData || [])
            //         setChartDayCount('', res.data?.deptCapacityData || [])
            //         resolve(true)
            //     } else reject(false)
            // }).catch((err) => reject(err))

            // flag && Taro.showLoading({ mask: true })
            // Promise.all([getScrapArea(false, params), productionArea(false, params), deptCapacity(false, params), productionException(false, params)]).then(() => {
            //     flag && Taro.hideLoading()
            //     resolve(true)
            // }).catch(() => {
            //     setTimeout(() => { flag && Taro.hideLoading() }, 1000)
            //     reject(false)
            // })

            getScrapArea(false, params)
            deptCapacity(false, params)
            productionArea(false, params)
            productionException(false, params)
        })
    }
    // 报废面积
    const getScrapArea = (flag = true, params) => {
        return new Promise((resolve, reject) => {
            setLoading2(true)
            scrapAreaAPI(params).then((res) => {
                if (res.code == 200) {
                    res.data.sumScrapAreaUnit = ''
                    if (res.data.sumScrapArea >= 10000000) {
                        res.data.sumScrapArea = res.data.sumScrapArea / 10000000
                        res.data.sumScrapAreaUnit = '千万'
                    }
                    res.data.sumScrapArea = priceFormat(res.data?.sumScrapArea, 4)
                    setScrapArea(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err)).finally(() => setLoading2(false))
        })
    }
    // 生产面积
    const productionArea = (flag = true, params) => {
        return new Promise((resolve, reject) => {
            setLoading1(true)
            productionAreaAPI(params).then((res) => {
                if (res.code == 200) {
                    res.data.sumProductionAreaUnit = ''
                    if (res.data.sumProductionArea >= 10000000) {
                        res.data.sumProductionArea = res.data.sumProductionArea / 10000000
                        res.data.sumProductionAreaUnit = '千万'
                    }
                    res.data.sumProductionArea = priceFormat(res.data?.sumProductionArea, 4)
                    setProductArea(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err)).finally(() => setLoading1(false))
        })
    }
    // 部门产能上报数据
    const deptCapacity = (flag = true, params) => {
        return new Promise((resolve, reject) => {
            setLoading4(true)
            deptCapacityAPI(params).then((res) => {
                if (res.code == 200) {
                    setDeptCapacityData(res.data)
                    setChartDayCount('', res.data?.deptCapacityData || [])
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err)).finally(() => setLoading4(false))
        })
    }
    // 排产过数异常
    const productionException = (flag = true, params) => {
        return new Promise((resolve, reject) => {
            setLoading3(true)
            productionExceptionAPI(params).then((res) => {
                if (res.code == 200) {
                    setProductionExceptionData(res.data)
                    flag && Taro.hideLoading()
                    setChartDay('', res.data?.productionExceptionData || [])
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err)).finally(() => setLoading3(false))
        })
    }

    // 获取底部数据
    const getProductionReportBottom = () => {
        return new Promise((resolve, reject) => {
            setLoading5(true)
            getProductionReportBottomAPI().then((res) => {
                if (res.code == 200) {
                    res.data?.productionReportBottomDayData?.length && res.data?.productionReportBottomDayData.map((m) => {
                        let tempList = []
                        for (let key in m?.dayList) {
                            tempList.push(m?.dayList[key])
                        }
                        m.dayList = tempList
                    })
                    res.data.sumAreaUnit = ''
                    if (res.data.sumArea >= 10000000) {
                        res.data.sumArea = res.data.sumArea / 10000000
                        res.data.sumAreaUnit = '千万'
                    }
                    res.data.sumArea = priceFormat(res.data?.sumArea, 4)
                    setBottomInfo(res.data)
                    setChartDayWork('', res.data?.productionReportBottomDayData || [])
                    setOptionList(res.data?.productionReportBottomDayData || [])
                    if (res.data?.productionReportBottomDayData?.length) {
                        const crtData = res.data?.productionReportBottomDayData[0]
                        setChartCountTime('', crtData?.dayList || {})
                        setOption1(crtData)
                    }
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err)).finally(() => setLoading5(false))
        })
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
        getProductionReportTop(true, tempDate)
    }

    // 排产过数异常数据统计
    const setChartDay = (opt = '', tempArr = [], chartType = '') => {
        let chart = chartType || showTableType1
        let list = tempArr?.length ? tempArr : (productionExceptionData?.productionExceptionData || [])
        // 数据为空则不展示报表
        if(list.length == 0) {
          setChartOptions(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#1890FF','rgb(255,192,105)','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        // console.log(m, mI)
        data.push({
            name: '款数',
            data: list.map((m) => m?.count),
            type: chart == '1' ? 'bar' : 'line',
            // label: {
            //     show: true,
            //     position: 'insideTopRight',
            //     verticalAlign: 'bottom',
            //     offset: list?.length >= 12 ? [0, 5] : list?.length <= 4 ? [0, -35] : list?.length <= 8 ? [0, -5] : [0,0],
            //     rotate: 90,
            //     formatter: (params) => Number(params?.value) ? params?.value : ''
            // },
            itemStyle: {
                color: color[0]
            }
        })
        const option = {
            grid: {
                show: false,
                top: '8%',
                left: '12%',
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
                type: 'category',
                data: list?.length ? list.map((m) => m.craftName) : [],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999',
                    },
                },
                axisLabel: {
                  rotate: 35,
                  showMaxLabel: true,
                  color: '#333333',
                  interval: 0,
                  formatter: (params) => {
                    var val = "";
                    if (list.length > 1 && params.length > 5) {
                      val = params.substr(0, 5) + '...';
                      return val;
                    } else {
                      return params;
                    }
                  }
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
        console.log(option)
        setChartOptions(option)
    }

    // 部门产能上报数据统计
    const setChartDayCount = (opt = '', tempArr = [], chartType = '') => {
        let chart = chartType+'' ? chartType : showTableType2
        // let item = opt || option2
        let list = tempArr?.length ? tempArr : (deptCapacityData?.deptCapacityData || [])
        // 数据为空则不展示报表
        if(list.length == 0) {
          setChartOptionsCount(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#1890FF','#52C41A','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let titleList = [
            { title: '未审核', field: 'unAuditSum' },
            { title: '全部', field: 'sum' },
        ]
        let typeUnit = 1 // 1㎡ 2万㎡ 3千万㎡
        let unit = '面积(㎡)'
        titleList.map((tm, tIndex) => {
            list.map((m) => {
                if (m.sum >= 10000 || m.unAuditSum >= 10000) {
                    typeUnit = 2
                    unit = '面积(万㎡)'
                }
                if (m.sum >= 10000000 || m.unAuditSum >= 10000000) {
                    typeUnit = 3
                    unit = '面积(千万㎡)'
                }
            })
            data.push({
                name: tm.title,
                data: list.map((m) => {
                    let res = m[tm.field]
                    if (typeUnit == 2) {
                        res = Number(((res||0) / 10000).toFixed(4))
                    }
                    if (typeUnit == 3) {
                        res = Number(((res||0) / 10000000).toFixed(4))
                    }
                    return res
                }),
                type: chart == '1' ? 'bar' : 'line',
                itemStyle: {
                    color: color[tIndex]
                }
            })
        })
        const option = {
            legend: {
                bottom: 5,
                // left: 0,
                itemWidth: 18,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                },
                data: titleList.map((m) => m.title),
            },
            grid: {
                show: false,
                top: '10%',
                left: '12%',
                right: '5%',
                bottom: 80,
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
                data: list?.length ? list.map((m) => m.deptName) : [],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999',
                    },
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
                name: unit,
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

    // 工序结存分布
    const setChartDayWork = (opt = '', tempArr = [], chartType = '') => {
        let chart = chartType+'' ? chartType : showTableType3
        // let item = opt || option2
        let list = tempArr?.length ? tempArr : (bottomInfo?.productionReportBottomDayData || [])
        // 数据为空则不展示报表
        if(list.length == 0) {
          setChartOptionsWork(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#1890FF','#52C41A','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        // console.log(m, mI)
        // let titleLIst = list?.length ? list[0].list.filter((f) => f.name != '合计').map((m) => m.name) : []
        let titleList = [
            { title: '面积(㎡)', field: 'sumArea' },
            { title: '款数', field: 'sumQuantity' },
        ]
        titleList.map((tm, tIndex) => {
            data.push({
                name: tm.title,
                data: list.filter((f) => f.craftName != '全部').map((m) => m[tm.field]),
                type: chart == '1' ? 'bar' : 'line',
                yAxisIndex: tm.field == 'sumQuantity' ? 1 : 0,
                // label: {
                //     show: true,
                //     position: 'inside',
                //     formatter: (params) => params?.value ? params?.value : ''
                // },
                itemStyle: {
                    color: color[tIndex]
                }
            })
        })
        const option = {
            legend: {
                bottom: 10,
                // left: 0,
                itemWidth: 18,
                itemHeight: 10,
                selected: {
                    '款数': showCount1.count,
                    '面积(㎡)': showCount1.area,
                },
                textStyle: {
                    fontSize: 10,
                },
                data: titleList.map((m) => m.title),
            },
            grid: {
                show: false,
                top: '8%',
                left: '12%',
                right: '12%',
                bottom: 80,
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
                data: list?.length ? list.filter((f) => f.craftName != '全部').map((m) => m.craftName) : [],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999',
                    },
                },
                axisLabel: {
                  rotate: 35,
                  showMaxLabel: true,
                  color: '#333333',
                  interval: 0,
                  formatter: (params) => {
                    var val = "";
                    if (list.length > 1 && params.length > 5) {
                      val = params.substr(0, 5) + '...';
                      return val;
                    } else {
                      return params;
                    }
                  }
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
            yAxis: [
                {
                    // offset: -3,
                    nameTextStyle: {
                        lineHeight: 0,
                        align: 'left'
                    },
                    name: '面积(㎡)',
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
                },{
                    // offset: -3,
                    nameTextStyle: {
                        lineHeight: 0,
                        align: 'right'
                    },
                    name: '款数',
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
                }
            ],
            series: data,
            dataZoom: [{
                type: 'slider',
                show: list?.length > 8,
                height: 10,
                moveHandleSize: 10,
                bottom: 0,
                startValue: 0,
                endValue: 8,
                brushSelect: false,
                zoomLock: true,
            }]
        }
        // console.log(option)
        setChartOptionsWork(option)
    }

    // 工序交期情况分布
    const setChartCountTime = (opt = '', tempArr = [], chartType = '') => {
        let chart = chartType+'' ? chartType : showTableType4
        // let item = opt || option2
        // console.log(tempArr)
        let list = tempArr || []
        // 数据为空则不展示报表
        if(list.length == 0) {
          setChartOptionsCountTime(undefined)
          return
        }
        // let itemType = optType || optionType
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#1890FF','#52C41A','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        // let fieldStr = item.field
        // console.log(m, mI)
        // let titleLIst = list?.length ? list[0].list.filter((f) => f.name != '合计').map((m) => m.name) : []
        let titleList = [
            { title: '面积(㎡)', field: 'area' },
            { title: '款数', field: 'quantity' },
        ]
        titleList.map((tm, tIndex) => {
            data.push({
                name: tm.title,
                data: list.map((m) => m[tm.field]),
                type: chart == '1' ? 'bar' : 'line',
                yAxisIndex: tm.field == 'quantity' ? 1 : 0,
                // label: {
                //     show: true,
                //     position: 'inside',
                //     formatter: (params) => params?.value ? params?.value : ''
                // },
                itemStyle: {
                    color: color[tIndex]
                }
            })
        })
        const option = {
            legend: {
                bottom: 0,
                // left: 0,
                itemWidth: 18,
                itemHeight: 10,
                selected: {
                    '款数': showCount.count,
                    '面积(㎡)': showCount.area,
                },
                textStyle: {
                    fontSize: 10,
                },
                data: titleList.map((m) => m.title),
            },
            grid: {
                show: false,
                top: '8%',
                left: '12%',
                right: '12%',
                bottom: 80,
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
                data: list?.length ? list.map((m) => m.name) : [],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#999999'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999999',
                    },
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
            yAxis: [{
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'left'
                },
                name: '面积(㎡)',
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
            },{
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'right'
                },
                name: '款数',
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
            }],
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
        setChartOptionsCountTime(option)
    }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            setOption1(optionList[Number(e?.detail?.value)])
            let crtData = optionList[Number(e?.detail?.value)]
            // console.log(crtData, optionList[Number(e?.detail?.value)])
            setChartCountTime(optionList[Number(e?.detail?.value)], crtData?.dayList)
        }
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
        <View className={`report-page blue ${disPage}`}>
            <NavBar large={true} color={'#333'} title={'生产报表'} transparent={false} leftIconType={'chevron-left'}></NavBar>
            <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>
            {
            reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
                return (
                <>
                {(row?.id == 1) && row?.show ? <><View className='report-top-card'>
                    {/* <DateChoose end={endTime} start={startTime} disPage={(value) => setDisPage(value)} confirm={confirmHandle}></DateChoose> */}
                    <View className='top-card-list flex flex-start'>
                        <View className='top-card-item'>
                            <View className='top-card-label flex flex-start'>
                                生产面积({(productArea?.sumProductionAreaUnit || '') + '㎡'})
                                <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`生产面积：按照排产单创建时间查询，一段时间内的净生产面积`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                            </View>
                            <GLoading loading={loading1} classStr='flex flex-start' style="max-height: 64rpx;">
                                <GSplitNumber number={(productArea?.sumProductionArea || '') + ''} classStr='top-card-value flex flex-start'></GSplitNumber>
                            </GLoading>
                            {/* <View className='top-card-value flex flex-start font-number'>
                                {topInfo?.sumProductionArea.includes('.') ? <>
                                    <View className='top-card-value-large'>{topInfo?.sumProductionArea.split('.')[0]}</View>
                                    .{topInfo.sumProductionArea.split('.')[1]}
                                </> : <View className='top-card-value-large'>{topInfo?.sumProductionArea || 0}</View>}
                            </View> */}
                        </View>
                        <View className='top-card-item'>
                            <View className='top-card-label flex flex-start'>
                                报废面积({(scrapArea?.sumScrapAreaUnit || '') + '㎡'})
                                <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`报废面积：按照排产单的创建时间查询，一段时间所产生的报废面积`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                            </View>
                            <GLoading loading={loading2} classStr='flex flex-start' style="max-height: 64rpx;">
                                <GSplitNumber number={(scrapArea?.sumScrapArea || '') + ''} classStr='top-card-value flex flex-start'></GSplitNumber>
                            </GLoading>
                            {/* <View className='top-card-value flex flex-start font-number'>
                                {topInfo?.sumScrapArea.includes('.') ? <>
                                    <View className='top-card-value-large'>{topInfo?.sumScrapArea.split('.')[0]}</View>
                                    .{topInfo.sumScrapArea.split('.')[1]}
                                </> : <View className='top-card-value-large'>{topInfo?.sumScrapArea || 0}</View>}
                            </View> */}
                        </View>
                    </View>
                </View></> : <></>}
                {(row?.id == 2) && row?.show ? <><View className='report-box'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            排产过数异常统计
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`过数异常：指排产进度到某工序后，没有进行手动过数，而是直接操作完结排产，这种情况视为过数异常`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
                        {/* {!showTable1 ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                            <View className='daily-card-switch-text'>{chartType1 ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType1} onChange={(e) => {
                                setChartType1(e?.detail?.value)
                                setChartDay('', [], e?.detail?.value)
                            }}/>
                        </View> : <></>}
                        {!showTable1 ? <View className='report-box-change flex flex-end' onClick={() => setShowTable1(!showTable1)}>
                        <View className='primary-change-table'></View>
                        </View> : <View className='report-box-change flex flex-end' onClick={() => setShowTable1(!showTable1)}>
                            <View className='primary-change-chart'></View>
                        </View>
                        } */}
                    </View>
                    <GLoading loading={loading3} color='rgb(24, 144, 255)' style="height: 300px;">
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType1+'') ?
                    <>
                        <View style={{ width: '100%', height: '300px' }}>
                            {chartOptions ? <Echarts
                                isPage={false}
                                ref={echartsRef}
                                echarts={echartsJs}
                                canvasId={`option1`}
                                option={chartOptions}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '300px' }}
                            /> : <View className='g-empty-chart'>暂无数据</View>}
                        </View>
                    </> :
                    <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={productionExceptionData?.productionExceptionData || []} titleList={[
                        { title: '排产-流转卡进度', field: 'craftName' },
                        { title: '款数', field: 'count' },
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                    </View>
                    }
                    </GLoading>
                </View></> : <></>}
                {(row?.id == 3) && row?.show ? <><View className='report-box'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            部门产能上报数据统计
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                        {/* {!showTable2 ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                            <View className='daily-card-switch-text'>{chartType2 ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType2} onChange={(e) => {
                                setChartType2(e?.detail?.value)
                                setChartDayCount('', [], e?.detail?.value)
                            }}/>
                        </View> : <></>}
                        {!showTable2 ? <View className='report-box-change flex flex-end' onClick={() => setShowTable2(!showTable2)}>
                        <View className='primary-change-table'></View>
                        </View> : <View className='report-box-change flex flex-end' onClick={() => setShowTable2(!showTable2)}>
                            <View className='primary-change-chart'></View>
                        </View>
                        } */}
                    </View>
                    <GLoading loading={loading4} color='rgb(24, 144, 255)' style="height: 310px;">
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType2+'') ?
                    <>
                        {/* <View className='flex flex-between'>
                            <View style={'flex: 1;'} className='flex flex-start'>
                                <Picker mode='selector' rangeKey='title' range={dateOption} onChange={(e) => changeOption(e, 'optionDate')}>
                                    <View className='daily-card-switch-text flex flex-end primary-color'>
                                        <View>{optionDate?.title}</View>
                                        <View className='primary-bottom'></View>
                                    </View>
                                </Picker>
                            </View>

                            <View style={'flex: 2;'} className='flex flex-end'>
                                <Picker mode='selector' rangeKey='title' range={countOption} onChange={(e) => changeOption(e, 'optionCount')}>
                                    <View className='daily-card-switch-text flex flex-end primary-color'>
                                        <View>{optionCount?.title}</View>
                                        <View className='primary-bottom'></View>
                                    </View>
                                </Picker>
                                <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                                    <View className='daily-card-switch-text flex flex-end primary-color'>
                                        <View>{option2?.title}</View>
                                        <View className='primary-bottom'></View>
                                    </View>
                                </Picker>
                            </View>
                        </View> */}
                        <View style={{ width: '100%', height: '310px' }}>
                            {chartOptionsCount ? <Echarts
                                isPage={false}
                                ref={echartsRef1}
                                echarts={echartsJs}
                                canvasId={`option2`}
                                option={chartOptionsCount}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '310px' }}
                            /> : <View className='g-empty-chart'>暂无数据</View>}
                        </View>
                    </> :
                    <View style={'max-height: 300px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={deptCapacityData?.deptCapacityData || []} titleList={[
                        { title: '部门', field: 'deptName' },
                        { title: '上报产能面积(㎡)', field: 'report', children: [
                            { title: '未审核', field: 'unAuditSum', width: '50%' },
                            { title: '全部', field: 'sum', width: '50%' },
                        ] }
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
                    </GLoading>
                </View></> : <></>}
                {(row?.id == 4) && row?.show ? <><View className='report-box product-center-card'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                        工序结存总览
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`工序结存总览：不受时间筛选影响，截止到当前时间，所有排产单-流转卡中的产品款数和订单面积`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                    </View>
                    <View className='product-center-list flex flex-start'>
                        <View className='product-center-item'>
                            <View className='product-center-item-label'>当前结存总款数</View>
                            <GLoading loading={loading5} color='rgb(24, 144, 255)' classStr='flex flex-start' style='max-height: 64rpx;'>
                                <GSplitNumber number={priceFormat(bottomInfo?.sumQuantity || 0, 0)} classStr='product-center-item-value flex flex-start'></GSplitNumber>
                            </GLoading>
                            {/* <View className='product-center-item-value'>{bottomInfo?.sumQuantity}</View> */}
                        </View>
                        <View className='product-center-item'>
                            <View className='product-center-item-label'>当前结存总面积({(bottomInfo?.sumAreaUnit || '') + '㎡'})</View>
                            <GLoading loading={loading5} color='rgb(24, 144, 255)' classStr='flex flex-start' style='max-height: 64rpx;'>
                                <GSplitNumber number={(bottomInfo?.sumArea || '') + ''} classStr='product-center-item-value flex flex-start'></GSplitNumber>
                            </GLoading>
                            {/* <View className='product-center-item-value'>{bottomInfo?.sumArea}</View> */}
                        </View>
                    </View>
                </View></> : <></>}
                {(row?.id == 5) && row?.show ? <><View className='report-box'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            工序结存分布
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={'工序结存分布：不受时间筛选影响，截止到当前时间，各个工序结存的款数和面积（点击对应工序即可查看该工序的交期状况分布）'} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType3 == '1' ? 'primary-report-bar' : showTableType3 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType3, '3')}></View>
                        {/* {!showTable3 ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                            <View className='daily-card-switch-text'>{chartType3 ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType3} onChange={(e) => {
                                setChartType3(e?.detail?.value)
                                setChartDayWork('', [], e?.detail?.value)
                            }}/>
                        </View> : <></>}
                        {!showTable3 ? <View className='report-box-change flex flex-end' onClick={() => setShowTable3(!showTable3)}>
                        <View className='primary-change-table'></View>
                        </View> : <View className='report-box-change flex flex-end' onClick={() => setShowTable3(!showTable3)}>
                            <View className='primary-change-chart'></View>
                        </View>
                        } */}
                    </View>
                    <GLoading loading={loading5} color='rgb(24, 144, 255)' style='height: 310rpx;'>
                    {/* {!showTable3 ? 控制元素是否存在，会导致echarts的legend以及点击事件失效
                    <> // 1，2为图表，1为柱状图，2为线型图，3为表格 */}
                        <View style={{ width: '100%', height: '310px', display: ['1','2'].includes(showTableType3+'') ? 'block' : 'none' }}>
                            {chartOptionsWork ? <Echarts
                                isPage={false}
                                echarts={echartsJs}
                                canvasId={`option3`}
                                ref={echartsWorkRef}
                                option={chartOptionsWork}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '310px' }}
                            /> : <View className='g-empty-chart'>暂无数据</View>}
                        </View>
                    {/* </> :  */}
                    <View style={`max-height: 300px;overflow-y: auto;margin-top: 10px;display: ${['1','2'].includes(showTableType3+'') ? 'none' : 'block'}`}>
                    <GTable list={bottomInfo?.productionReportBottomDayData || []} titleList={[
                        { title: '工序', field: 'craftName' },
                        { title: '款数', field: 'sumQuantity' },
                        { title: '面积(㎡)', field: 'sumArea' },
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
                    {/* } */}
                    </GLoading>
                </View></> : <></>}
                {(row?.id == 6) && row?.show ? <><View className='report-box' id='workTimeId'>
                    <View className='report-box-header flex flex-betweent'>
                        <View className='report-box-title flex flex-start'>
                            工序交期情况分布
                            <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`工序交期情况分布：不受时间筛选影响，截止到当前时间，各个工序结存交期情况分布`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                        </View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType4 == '1' ? 'primary-report-bar' : showTableType4 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType4, '4')}></View>
                        {/* {!showTable4 ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                            <View className='daily-card-switch-text'>{chartType4 ? '折线图' : '柱状图'}</View>
                            <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType4} onChange={(e) => {
                                setChartType4(e?.detail?.value)
                                setChartCountTime('', option1?.dayList || [], e?.detail?.value)
                            }}/>
                        </View> : <></>}
                        {!showTable4 ? <View className='report-box-change flex flex-end' onClick={() => setShowTable4(!showTable4)}>
                        <View className='primary-change-table'></View>
                        </View> : <View className='report-box-change flex flex-end' onClick={() => setShowTable4(!showTable4)}>
                            <View className='primary-change-chart'></View>
                        </View>
                        } */}
                    </View>
                    <Picker mode='selector' rangeKey='craftName' range={optionList} onChange={(e) => changeOption(e, 'options1')}>
                        <View className='daily-card-switch-text flex flex-end primary-color'>
                            <View>{option1?.craftName}</View>
                            <View className='primary-bottom'></View>
                        </View>
                    </Picker>
                    <GLoading loading={loading5} color='rgb(24, 144, 255)' style='height: 310rpx;'>
                    {/* {!showTable4 ?
                    <> */}
                        {chartOptionsCountTime ? <View style={{ width: '100%', height: '310px', display: ['1','2'].includes(showTableType4+'') ? 'block' : 'none' }}>
                            <Echarts
                                isPage={false}
                                echarts={echartsJs}
                                canvasId={`option4`}
                                ref={echartsWorkTimeRef}
                                option={chartOptionsCountTime}
                                // style自定义设置echarts宽高
                                style={{ width: '100%', height: '310px' }}
                            />
                        </View> : <View className='g-empty-chart'>暂无数据</View>}
                    {/* </> :  */}
                    <View style={`max-height: 300px;overflow-y: auto;margin-top: 10px;display: ${['1','2'].includes(showTableType4+'') ? 'none' : 'block'}`}>
                    <GTable list={
                        (() => {
                            let list = []
                            for (let i = 0; i < 2; i++) {
                                // '款数', '面积(㎡)'
                                let obj = {
                                    name: i == 0 ? '款数' : '面积(㎡)'
                                }
                                // option1?.dayList[0].quantity
                                option1?.dayList?.length && option1?.dayList.map((dm, dmIndex) => {
                                    obj[dmIndex + ''] = dm[i == 0 ? 'quantity' : 'area']
                                })
                                list.push(obj)
                            }
                            // console.log('list', list)
                            return list
                        })()
                    } titleList={[
                        { title: '工序', field: 'name', children: [{title: '交期状况', field: 'name', width: '150rpx'}] },
                        { title: option1?.craftName, field: 'returned', children: option1?.dayList?.length && option1?.dayList.map((m, mIndex) => {
                            return {title: m.name, field: mIndex+'', width: '200rpx'}
                        }) },
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        // console.log(title, item, slotIndex)
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <>
                                {slotIndex == (option1?.dayList?.length - 1) ? <View style={'color: #f5222d;'}>
                                    {value}
                                </View> : <View>{value}</View>}
                            </>
                        )
                    }}
                    ></GTable>
                    </View>
                    {/* } */}
                    <View style={'height: 0px;overflow: hidden;'}>
                    </View>
                    </GLoading>
                </View></> : <></>}
                </>
                )
            }) : <></>
            }
        </View>
        <Canvas canvasId={`option66`} style="display: none;"></Canvas>
        <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
            <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=5')}>报表配置</View>
        </GFixedIcon>
        <GUp style={{bottom: '292rpx', right: '15rpx'}}></GUp>
        <GFeedback></GFeedback>
        </>
    )
}
