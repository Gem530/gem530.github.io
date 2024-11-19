import './index.less'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
// import { AtSwitch } from 'taro-ui'
import Echarts from 'taro-react-echarts'
// import echartsJs from '../../../util/echarts'
import GTable from '../../../../components/g-table'
import { useRef, useState, useEffect } from 'react'
import { initOperate } from '../../../util/reportInit'
import GTooltip from '../../../../components/g-tooltip'
import GFeedback from '../../../../components/g-feedback'
import { getSystemTimeAPI } from '../../../services/upload'
import GFixedIcon from '../../../../components/g-fixed-icon'
import GShowPrice from '../../../../components/g-show-price'
// import GSettingDialog from '../../../../components/g-setting-dialog'
import DateDrawer from '../../../../packageB/report/components/dateDrawer'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { View, Switch, Picker, AtIcon, Canvas, Image, Swiper, SwiperItem } from '@tarojs/components'
import { dailySwitchAPI, dailySwitchResetAPI, tenantConfigReportAPI, queryOperateReportPriceAPI, operationProductionReportAPI, operationDailyReportAPI, onlyOnLineAndOffLineDataAPI, operationDailyReportNotChangeAPI, getOperationDailyReportOnlyQuotationAPI, getOperationDailyReportOnlyRankingAPI, getSumEQPAPI } from '../../../services/dailyReport'

export default function OperateReport({ echartsJs, count }) {
    // 日报报表配置type 运营日报1 目前只定义了运营日报
    const optionList = [
        {title: '面积', field: 'sumArea', unit: '㎡'},
        {title: '金额', field: 'sumPrice', unit: '万元'},
        {title: '平米价', field: 'averagePrice', unit: '元/㎡'},
        {title: '款数', field: 'sumQuantity', unit: '款数'},
    ]
    const optionTypeList = [
        {title: '全部', field: 'allOrder'},
        {title: '新单', field: 'newOrder'},
        // {title: '批量新单', field: 'batchNew'},
        {title: '返单', field: 'returned'},
        {title: '返单有改', field: 'returnChange'},
        {title: '样转批', field: 'sampleToQuantity'},
    ]
    const orderRankType = [
        {title: '下单总数', field: 'sumQuantity'},
        {title: '新单', field: 'newQuantity'},
        {title: '返单', field: 'returnQuantity'},
        {title: '返单有改', field: 'returnChangeQuantity'},
        {title: '样转批', field: 'sampleQuantity'},
    ]
    const layerList = [
        {title: '全部', field: '0', unit: '板'},
        {title: '单面板', field: '1', unit: '板'},
        {title: '双面板', field: '2', unit: '板'},
        {title: '四层板', field: '4', unit: '板'},
        {title: '六层板', field: '6', unit: '板'},
        {title: '八层板', field: '8', unit: '板'},
        {title: '八层以上', field: '18', unit: '板'}, // 8层以上
    ]
    const initVisHidConfig = {
        // 接单
        orderCount: true,
        orderArea: true,
        orderPrice: true,
        orderAvgPrice: true,
        // 送货
        deliveryCount: true,
        deliveryArea: true,
        deliveryPrice: true,
        deliveryAvgPrice: true,
        // 投料
        feedCount: true,
        feedArea: true,
        // 入库
        inCount: true,
        inArea: true,
        // 仅报价
        quoteCount: true,
        quoteArea: true,
        // 水电
        hydropowerWater: true,
        hydropowerElectric: true,
        // 接单图表
        orderChart: true,
        // 订单数据
        orderData: true,
        // 业务员数据
        userData: true,
        // 统计图
        statistics: true,
    }
    const echartsRef = useRef()
    const echartsRef1 = useRef()
    // const GSettingDialogRef = useRef()
    const [list, setList] = useState()
    const [month, setMonth] = useState('')
    const [disPage, setDisPage] = useState('')
    const [sysTime, setSysTime] = useState('')
    const [weekList, setWeekList] = useState()
    const [quoteInfo, setQuoteInfo] = useState()
    const [orderRank, setOrderRank] = useState()
    const [orderList, setOrderList] = useState([])
    const [inDataInfo, setInDataInfo] = useState()
    const [hydropower, setHydropower] = useState()
    const [springMonth, setSpringMonth] = useState([])
    const [reportConfig, setReportConfig] = useState()
    const [notChangeList, setNotChangeList] = useState()
    const [visibleHiddenConfig, setVisibleHiddenConfig] = useState(initVisHidConfig)
    
    const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
    const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
    const [endTime, setEndTime] = useState(initEnd)
    const [startTime, setStartTime] = useState(initStart)
    
    const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
    const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格

    const [orderDay, setOrderDay] = useState([])
    const [chartOptions, setChartOptions] = useState()
    const [option1, setOption1] = useState(optionList[0])
    const [option2, setOption2] = useState(optionList[0])
    const [option3, setOption3] = useState(optionList[0])
    const [layerInfo, setLayerInfo] = useState(layerList[0])
    const [chartOptionsWeek, setChartOptionsWeek] = useState()
    const [optionType, setOptionType] = useState(optionTypeList[0])
    const [targetInfo, setRargetInfo] = useState({
        targetArea: '',
        targetAmount: '',
    })

    // const [tagId, setTagId] = useState(1)
    const [queryDay, setQueryDay] = useState(dayjs(new Date()).format('YYYY-MM'))
    const [tagList, setTagList] = useState([
        // { field: -1, title: '昨日' },
        { field: 1, title: '按日统计' },
        { field: 2, title: '按周统计' },
        { field: 3, title: '按月统计' },
    ])
    const [tagInfo, setTagInfo] = useState(tagList[0])
    useDidShow(() => {
        getVisHidConfig()
        if (count >= 1) return;
        tenantConfigReport()
        getSystemTime()
        Taro.showLoading({ mask: true })
        Promise.all([getSumEQP(), operationDailyReport(), onlyOnLineAndOffLineData(), queryOperateReportPrice(), operationProductionReport(), operationDailyReportNotChange(), getOperationDailyReportOnlyRanking(), getOperationDailyReportOnlyQuotation()]).finally(() => {
            Taro.hideLoading()
        })
    })

    useEffect(() => {
        if (notChangeList) {
            setChartDay()
        }
        if (orderRank?.length) {
            setChartWeek()
        } else {
            setChartOptionsWeek(undefined)
        }
    }, [notChangeList, orderRank, targetInfo])

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
        if (chartOptions) {
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
        setChartDay('', '', tempVal)
      } else if (tempType == '2') {
        setShowTableType2(tempVal)
        // setChartUser('', '', tempVal, '')
        setChartWeek('', tempVal)
      }
    }

    // 修改配置
    const updateData = (value, field) => {
        let tempInfo = JSON.parse(JSON.stringify(visibleHiddenConfig))
        tempInfo[field] = value
        // console.log(tempInfo, field, value)
        setVisibleHiddenConfig(tempInfo)
        if (!['orderChart','orderData','userData','statistics'].includes(field)) {
            setVisHidConfig(tempInfo)
        }
    }
    // 获取目标金额，面积
    const queryOperateReportPrice = () => {
        return new Promise((resolve, reject) => {
            queryOperateReportPriceAPI().then((res) => {
                if (res.code == 200) {
                    setRargetInfo(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }
    // 获取春节配置
    const tenantConfigReport = () => {
        return new Promise((resolve, reject) => {
            tenantConfigReportAPI({code:'SPRING_YEAR_MONTH'}).then((res) => {
                if (res.code == 200) {
                    setSpringMonth(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }
    // 保存显隐配置
    const saveConfig = (val) => {
        let valArr = Object.keys(val)
        // console.log('val', val, valArr)
        let tempInfo = JSON.parse(JSON.stringify(visibleHiddenConfig))
        for (let key in tempInfo) {
            if (valArr.includes(key)) {
                tempInfo[key] = val[key]
            }
        }
        setVisibleHiddenConfig(tempInfo)
        setVisHidConfig(tempInfo)
    }
    // 获取显隐配置
    const getVisHidConfig = () => {
        return new Promise((resolve, reject) => {
            dailySwitchAPI('1').then((res) => {
                if (res.code == 200) {
                    let data = JSON.parse(JSON.stringify(res?.data || {}))
                    setVisibleHiddenConfig(data?.paramValue ? JSON.parse(data?.paramValue) : initVisHidConfig)
                    data.configParam = data.configParam ? JSON.parse(data.configParam) : initOperate

                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    initOperate.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(data.configParam)), initOperate)
                    // 获取 初始化数组中 新增的数据
                    let tempConfig = initOperate.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = data.configParam.filter((f) => !initOperate.map((m) => m.id).includes(f.id))
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
        // setTimeout(() => {
        //     const res = Taro.getStorageSync('temp')
        //     setVisibleHiddenConfig(JSON.parse(res))
        // }, 1000)
    }
    // 设置显隐配置
    const setVisHidConfig = (tempInfo) => {
        dailySwitchResetAPI({
            type: '1',
            paramValue: JSON.stringify(tempInfo || visibleHiddenConfig),
            configParam: reportConfig?.configParam ? JSON.stringify(reportConfig?.configParam) : '',
        })
        // setTimeout(() => {
            // Taro.setStorageSync('temp', JSON.stringify(tempInfo || visibleHiddenConfig))
            // getVisHidConfig()
        // }, 1000)
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

    // 获取水电
    const getSumEQP = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
            }
            // Taro.showLoading({ mask: true })
            getSumEQPAPI(params).then((res) => {
                if (res.code == 200) {
                    setHydropower(res.data)
                    // setWeekList(res.data?.operationReportLineChildVos)
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取生产入库数据
    const operationProductionReport = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
            }
            // Taro.showLoading({ mask: true })
            operationProductionReportAPI(params).then((res) => {
                if (res.code == 200) {
                    setInDataInfo(res.data)
                    // setWeekList(res.data?.operationReportLineChildVos)
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取运营日报
    const operationDailyReport = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
            }
            // Taro.showLoading({ mask: true })
            operationDailyReportAPI(params).then((res) => {
                if (res.code == 200) {
                    setList(res.data || [])
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取运营日报
    const onlyOnLineAndOffLineData = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
            }
            // Taro.showLoading({ mask: true })
            onlyOnLineAndOffLineDataAPI(params).then((res) => {
                if (res.code == 200) {
                    setOrderList(res.data || [])
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取 仅报价
    const getOperationDailyReportOnlyQuotation = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
            }
            // Taro.showLoading({ mask: true })
            getOperationDailyReportOnlyQuotationAPI(params).then((res) => {
                if (res.code == 200) {
                    setQuoteInfo(res.data)
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }
    // 获取 下单排名
    const getOperationDailyReportOnlyRanking = (query) => {
        return new Promise((resolve, reject) => {
            let tempEnd = query?.queryDayEnd || endTime
            let tempStart = query?.queryDayStart || startTime
            let params = {
                layer: query?.layer || layerInfo?.field,
                queryDayEnd: tempEnd ? dayjs(tempEnd).add(1, 'day').format('YYYY-MM-DD 00:00:00') : tempEnd,
                queryDayStart: tempStart ? dayjs(tempStart).format('YYYY-MM-DD 00:00:00') : tempStart,
            }
            if (params?.layer == 0) {
                delete params?.layer
            }
            // Taro.showLoading({ mask: true })
            getOperationDailyReportOnlyRankingAPI(params).then((res) => {
                if (res.code == 200) {
                    setOrderRank(res.data || [])
                    // Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }

    // 获取 接单图表(原统计图) 不根据昨日改变
    const operationDailyReportNotChange = (query, flag = false) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query.tagId : tagInfo?.field
            }
            // let tempDay = query?.queryDay ? query.queryDay : queryDay
            // if (params.type == 3 && tempDay) {
            //     params.queryDay = dayjs(new Date(tempDay)).format('YYYY-MM') + '-01'
            // }
            if (params.type == -1) {
                // 应该调用接口,只是获取今日,而不是昨日
                params.type = 1
                // resolve(true)
                // return
            }
            flag && Taro.showLoading({ mask: true })
            operationDailyReportNotChangeAPI(params).then((res) => {
                if (res.code == 200) {
                    // setList(res.data)
                    setNotChangeList(res.data)
                    if (res.data?.peopleOrderTypeVoList?.length) {
                        let crtVo = res.data.peopleOrderTypeVoList[0]
                        if (['1','2'].includes(params.type+'')) {
                            // 日，周 查询
                            crtVo = res.data.peopleOrderTypeVoList[res.data.peopleOrderTypeVoList.length - 1]
                        }
                        if (['3'].includes(params.type+'')) {
                            // 月 查询
                            crtVo = res.data.peopleOrderTypeVoList[Number(month || 1) - 1]
                        }
                        setOrderDay(crtVo)
                    }
                    // setWeekList(res.data?.operationReportLineChildVos)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else reject(false)
            }).catch(() => reject(false))
        })
    }

    // 返回万为单位的数据
    const getWan = (value, float = 2) => {
        let res = value
        res = (Number(res || 0) / 10000).toFixed(float)
        return Number(res)
    }

    // 设置接单图表(原统计图)
    const setChartDay = (opt = '', optType = '', chartType = '') => {
        let item = opt || option2
        let itemType = optType || optionType
        let chart = chartType || showTableType1
        // console.log('item:', item, optChart, chartType)
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let tempTitles = notChangeList?.processTitles
        // let tempTitles = notChangeList?.peopleOrderTypeVoList[0].allOrder
        tempTitles?.length && tempTitles.map((m, mI) => {
            let fieldStr = item.field
            let infoStr = itemType.field
            let tempList = []
            notChangeList?.peopleOrderTypeVoList?.length && notChangeList.peopleOrderTypeVoList.map((vo) => {
                // console.log(vo, infoStr, fieldStr)
                let crtVal = vo[infoStr].find((f) => f.userId == m.id)[fieldStr]
                // let crtVal = vo[infoStr].find((f) => f.userId == m.userId)[fieldStr]
                // if (item.field == 'sumArea') {
                //     crtVal = getWan(crtVal, 4)
                // }
                if (item.field == 'sumPrice') {
                    crtVal = getWan(crtVal, 2)
                }
                tempList.push(
                    (tagInfo?.field == 3 && sysTime.year == dayjs(queryDay || new Date()).format('YYYY') && (Number(vo?.monthPointDay.replace('月','')) > month)) ? '' : crtVal
                )
            })
            // console.log(m, mI)
            data.push({
                name: m.title,
                data: tempList,
                type: chart == '1' ? 'bar' : 'line',
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
                data: notChangeList?.processTitles?.length ? notChangeList.processTitles.map((m) => m.title) : [],
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
                data: notChangeList?.peopleOrderTypeVoList?.length ? notChangeList.peopleOrderTypeVoList.map((m) => m.monthPointDay) : [],
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
            series: data
        }
        // console.log(option)
        setChartOptions(option)
    }

    // 设置 下单排名
    const setChartWeek = (opt, chartType = '') => {
        // let item = opt || option3
        let chart = chartType || showTableType2
        let data = []
        let color = ['#2D90ED','rgba(250, 140, 22, 1)','rgba(133, 208, 220, 1)','rgba(88, 165, 92, 1)','rgba(246, 210, 106, 1)']

        orderRankType?.length && orderRankType.map((m, mI) => {
            // console.log(vo)
            let tempList = []
            orderRank?.length && orderRank.map((vo, voI) => {
                let crtVal = vo[m.field]
                tempList.push(crtVal)
                // let tempList = []
                // orderRankType?.length && orderRankType.map((m, mI) => {
                //     // console.log(vo)
                //     let crtVal = vo[m.field]
                //     tempList.push(crtVal)
                // })
            })
            data.push({
                name: m?.title,
                data: tempList,
                type: chart == '1' ? 'bar' : 'line',
                // stack: `stackone`, // 堆叠图表，使用line会出现颜色覆盖
                itemStyle: {
                    color: color[mI]
                }
            })
        })

        // console.log(data)
        const option = {
            legend: {
                top: 0,
                left: 0,
                itemWidth: 18,
                itemHeight: 10,
                textStyle: {
                    fontSize: 10,
                },
                data: orderRankType?.length ? orderRankType.map((m) => m.title) : [],
            },
            grid: {
                show: false,
                top: '21%',
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
                },
            },
            xAxis: {
                nameGap: 18,
                nameLocation: 'start',
                type: 'category',
                data: orderRank?.length ? orderRank.map((m) => m.customerName) : [],
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
                    if (params?.length > 5) {
                      val = params.substr(0, 5) + '...';
                      return val;
                    } else {
                      return params;
                    }
                  }
                },
            },
            yAxis: {
                // offset: -3,
                nameTextStyle: {
                    lineHeight: 0,
                    align: 'left'
                },
                name: '订单数',
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
            // dataZoom: {
            //     type: 'slider',
            //     show: orderRank?.length > 7,
            //     height: 10,
            //     bottom: 0,
            //     startValue: 0,
            //     endValue: 6,
            //     zoomLock: true,
            // }
        }
        // console.log('option:', data, option)
        setChartOptionsWeek(option)
    }

    // 月份搜索
    const changeTime = (e) => {
        setQueryDay(e?.detail?.value)
        let params = { queryDay: e?.detail?.value }
        Taro.showLoading({ mask: true })
        Promise.all([operationDailyReportNotChange(params)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // // 改变搜索日期
    // const changeTag = (id) => {
    //     setTagId(id)
    //     // operationDailyReport({ tagId: id })
    //     let params = { tagId: id }
    //     Taro.showLoading({ mask: true })
    //     Promise.all([operationDailyReport(params), operationProductionReport(params), operationDailyReportNotChange(params)]).finally(() => {
    //         Taro.hideLoading()
    //     })
    // }

    // 高级筛选，选择时间
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
        Promise.all([getSumEQP(params), operationDailyReport(params), onlyOnLineAndOffLineData(params), queryOperateReportPrice(params), operationProductionReport(params),  getOperationDailyReportOnlyRanking(params), getOperationDailyReportOnlyQuotation(params)]).finally(() => {
            Taro.hideLoading()
        })
    }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            setOption1(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'options2') {
            setOption2(optionList[Number(e?.detail?.value)])
            setChartDay(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'layerInfo') {
            setLayerInfo(layerList[Number(e?.detail?.value)])
            // setChartWeek(layerList[Number(e?.detail?.value)])
            getOperationDailyReportOnlyRanking({layer: layerList[Number(e?.detail?.value)]?.field})
        } else if (tempType == 'optionsType') {
            setOptionType(optionTypeList[Number(e?.detail?.value)])
            setChartDay('', optionTypeList[Number(e?.detail?.value)])
        } else if (tempType == 'tagInfo') {
            setTagInfo(tagList[Number(e?.detail?.value)])
            let params = { tagId: tagList[Number(e?.detail?.value)]?.field }
            operationDailyReportNotChange(params, true)
        } else if (tempType == 'orderDay') {
            setOrderDay(notChangeList?.peopleOrderTypeVoList[Number(e?.detail?.value)])
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

            {/* <View className='daily-head-tag flex flex-between'>
                <View className='daily-tag-list'>
                {
                    tagList.map((item) => {
                        return (
                            <View className={`daily-tag ${item.id == tagId && 'daily-tag-active'}`} onClick={() => changeTag(item.id)}>{item.name}</View>
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

            {
            reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
                return (
                <>
                {(row?.id == 1) && row?.show ? <>
                <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>接单</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：销售合同已审核的订单款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.orderCount} click={() => updateData(!visibleHiddenConfig?.orderCount, 'orderCount')}>
                            {list?.takeOrdersVo?.quantity || 0}
                        </GShowPrice>
                        {/* <View className='daily-nav-value flex flex-start'>{visibleHiddenConfig?.orderChart ? list?.takeOrdersVo?.quantity || 0 : '****'}
                            <View className={`${visibleHiddenConfig?.orderChart ? 'primary-show-price' : 'primary-hide-price'} expend-click m-l-10`} onClick={() => updateData(!visibleHiddenConfig?.orderChart, 'orderChart')}></View>
                        </View> */}
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>面积</View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.takeOrdersVo?.area || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.orderArea} click={() => updateData(!visibleHiddenConfig?.orderArea, 'orderArea')}>
                            {list?.takeOrdersVo?.area || 0}
                        </GShowPrice>
                    </View>
                </View>
                <View className='daily-nav has-left'>
                    <View className='daily-nav-left' style={`opacity: 0;`}>
                        <View className='daily-nav-title'>接单</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>金额</View>
                            <View className='daily-nav-top-item'>元</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.takeOrdersVo?.price || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.orderPrice} click={() => updateData(!visibleHiddenConfig?.orderPrice, 'orderPrice')}>
                            {list?.takeOrdersVo?.price || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>平米价</View>
                            <View className='daily-nav-top-item'>元/㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.takeOrdersVo?.averagePrice || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.orderAvgPrice} click={() => updateData(!visibleHiddenConfig?.orderAvgPrice, 'orderAvgPrice')}>
                            {list?.takeOrdersVo?.averagePrice || 0}
                        </GShowPrice>
                    </View>
                </View>
                </> : <></>}
    
                {(row?.id == 2) && row?.show ? <>
                <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>送货</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已送货的订单款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.deliveryVo?.quantity || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.deliveryCount} click={() => updateData(!visibleHiddenConfig?.deliveryCount, 'deliveryCount')}>
                            {list?.deliveryVo?.quantity || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>面积</View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.deliveryVo?.area || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.deliveryArea} click={() => updateData(!visibleHiddenConfig?.deliveryArea, 'deliveryArea')}>
                            {list?.deliveryVo?.area || 0}
                        </GShowPrice>
                    </View>
                </View>
                <View className='daily-nav has-left'>
                    <View className='daily-nav-left' style={`opacity: 0;`}>
                        <View className='daily-nav-title'>送货</View>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>金额</View>
                            <View className='daily-nav-top-item'>元</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.deliveryVo?.price || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.deliveryPrice} click={() => updateData(!visibleHiddenConfig?.deliveryPrice, 'deliveryPrice')}>
                            {list?.deliveryVo?.price || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item'>平米价</View>
                            <View className='daily-nav-top-item'>元/㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.deliveryVo?.averagePrice || 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.deliveryAvgPrice} click={() => updateData(!visibleHiddenConfig?.deliveryAvgPrice, 'deliveryAvgPrice')}>
                            {list?.deliveryVo?.averagePrice || 0}
                        </GShowPrice>
                    </View>
                </View>
                </> : <></>}
    
                {(row?.id == 3) && row?.show ? <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>投料</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：预投审核通过的订单款数，同销售单号同产品编码算1款`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumQuantity || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.feedCount} click={() => updateData(!visibleHiddenConfig?.feedCount, 'feedCount')}>
                            {list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumQuantity || 0) : 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：预投审核通过的预投面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumArea || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.feedArea} click={() => updateData(!visibleHiddenConfig?.feedArea, 'feedArea')}>
                            {list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumArea || 0) : 0}
                        </GShowPrice>
                    </View>
                </View> : <></>}
                
                {(row?.id == 4) && row?.show ? <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>入库</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：生产入库的订单款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumQuantity || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.inCount} click={() => updateData(!visibleHiddenConfig?.inCount, 'inCount')}>
                            {inDataInfo?.quantity || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：生产入库的入库面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumArea || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.inArea} click={() => updateData(!visibleHiddenConfig?.inArea, 'inArea')}>
                            {inDataInfo?.area || 0}
                        </GShowPrice>
                    </View>
                </View> : <></>}

                {(row?.id == 9) && row?.show ? <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>仅报价</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>款数
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：报价未下单的款数`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>款</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumQuantity || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.quoteCount} click={() => updateData(!visibleHiddenConfig?.quoteCount, 'quoteCount')}>
                            {quoteInfo?.quantity || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>面积
                                <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：报价未下单的面积`}></GTooltip></View>
                            </View>
                            <View className='daily-nav-top-item'>㎡</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumArea || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.quoteArea} click={() => updateData(!visibleHiddenConfig?.quoteArea, 'quoteArea')}>
                            {quoteInfo?.area || 0}
                        </GShowPrice>
                    </View>
                </View> : <></>}

                {(row?.id == 11) && row?.show ? <View className='daily-nav has-left'>
                    <View className='daily-nav-left'>
                        <View className='daily-nav-title'>水电</View>
                    </View>
    
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>总用水
                                {/* <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：报价未下单的款数`}></GTooltip></View> */}
                            </View>
                            <View className='daily-nav-top-item'>吨</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumQuantity || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.hydropowerWater} click={() => updateData(!visibleHiddenConfig?.hydropowerWater, 'hydropowerWater')}>
                            {hydropower?.totalWater || 0}
                        </GShowPrice>
                    </View>
                    <View className='daily-nav-card'>
                        <View className='daily-nav-top'>
                            <View className='daily-nav-top-item flex flex-start'>总耗电
                                {/* <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：报价未下单的面积`}></GTooltip></View> */}
                            </View>
                            <View className='daily-nav-top-item'>度</View>
                        </View>
                        {/* <View className='daily-nav-value'>{list?.operationPutOrderVos?.length ? (list?.operationPutOrderVos[0]?.sumArea || 0) : 0}</View> */}
                        <GShowPrice classStr='daily-nav-value flex flex-between' show={visibleHiddenConfig?.hydropowerElectric} click={() => updateData(!visibleHiddenConfig?.hydropowerElectric, 'hydropowerElectric')}>
                            {hydropower?.totalElectric || 0}
                        </GShowPrice>
                    </View>
                </View> : <></>}
    
                {(row?.id == 6) && row?.show ? <View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>订单数据</View>
                    </View>
                    <GTable list={orderList} titleList={[
                        { title: '', field: 'typeStr' },
                        { title: '未下线', field: 'online', children: [
                            {width: '90rpx', title: '款数', field: 'onLineQuantity'},
                            {width: '150rpx', title: '面积(㎡)', field: 'onLineArea'},
                        ] },
                        { title: '已下线', field: 'offline', children: [
                            {width: '90rpx', title: '款数', field: 'offLineQuantity'},
                            {width: '150rpx', title: '面积(㎡)', field: 'offLineArea'},
                        ] },
                        { title: '出库存', field: 'outOfStock', children: [
                            {width: '90rpx', title: '款数', field: 'outOfStockQuantity'},
                            {width: '150rpx', title: '面积(㎡)', field: 'outOfStockArea'},
                        ] },
                    ]}
                    thSlot={(title, slotIndex) => {
                        return (
                            // {title, slotIndex}
                            <View className='flex flex-center'>
                                {title?.title}
                                {/* 未下线款数 */}
                                {title?.field == 'onLineQuantity' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核且合同状态是MI制作的订单款数`}></GTooltip></View> : <></>}
                                {/* 未下线面积 */}
                                {title?.field == 'onLineArea' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核且合同状态是MI制作的订单面积`}></GTooltip></View> : <></>}
                                {/* 已下线款数 */}
                                {title?.field == 'offLineQuantity' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已预投的订单款数`}></GTooltip></View> : <></>}
                                {/* 已下线面积 */}
                                {title?.field == 'offLineArea' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已预投的订单面积`}></GTooltip></View> : <></>}
                                {/* 出库存款数 */}
                                {title?.field == 'outOfStockQuantity' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核且合同状态是库存发货/库存发货完成的订单款数`}></GTooltip></View> : <></>}
                                {/* 出库存面积 */}
                                {title?.field == 'outOfStockArea' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核且合同状态是库存发货/库存发货完成的订单面积`}></GTooltip></View> : <></>}
                            </View>
                        )
                    }}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        // console.log('tdSlot:', title, item)
                        if (item.typeStr == '出库存' && ['offLineQuantity', 'offLineArea'].includes(title.field)) {
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
                </View> : <></>}
    
                {
                // 原统计图
                (row?.id == 8) && row?.show ? <View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>接单图表</View>
                        <View className='flex-grow'></View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
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
                        <Picker mode='selector' rangeKey='title' range={optionTypeList} onChange={(e) => changeOption(e, 'optionsType')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionType?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                        {// 1，2为图表，1为柱状图，2为线型图，3为表格
                        ['1','2'].includes(showTableType1+'') ?
                            <Picker mode='selector' rangeKey='title' range={optionList} onChange={(e) => changeOption(e, 'options2')}>
                                <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                    <View>{option2?.title}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker> :
                            <Picker mode='selector' rangeKey='monthPointDay' range={notChangeList?.peopleOrderTypeVoList} onChange={(e) => changeOption(e, 'orderDay')}>
                                <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                    <View>{orderDay?.monthPointDay}</View>
                                    <View className='primary-bottom'></View>
                                </View>
                            </Picker>
                        }
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType1+'') ? <View style={{ width: '100%', height: '300px' }}>
                        {/* <View className='daily-title margin-top'>{item.title}</View> */}
                        {chartOptions ? <Echarts
                            isPage={false}
                            ref={echartsRef1}
                            echarts={echartsJs}
                            option={chartOptions}
                            canvasId={`${option2.field}`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        /> : <></>}
                    </View> : <>
                    <View style={'max-height: 668rpx;overflow-y: auto;'}>
                    <GTable list={notChangeList?.peopleOrderTypeVoList[(orderDay?.sort || 1) - 1][optionType?.field || 'allOrder']} titleList={[
                        { title: '', field: 'userName' },
                        { title: '金额(元)', field: 'sumPrice' },
                        { title: '面积(㎡)', field: 'sumArea' },
                        { title: '款数', field: 'sumQuantity' },
                        { title: '平米价(元/㎡)', field: 'averagePrice' },
                    ]}
                    thSlot={(title, slotIndex) => {
                        return (
                            // {title, slotIndex}
                            <View className='flex flex-center'>
                                {title?.title}
                                {title?.title == '款数' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单款数`}></GTooltip></View> : <></>}
                                {title?.title == '面积' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单面积`}></GTooltip></View> : <></>}
                                {title?.title == '金额' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单金额`}></GTooltip></View> : <></>}
                            </View>
                        )
                    }}
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
                    </>}
                </View> : <></>}

                {(row?.id == 10) && row?.show ? <View className='daily-card'>
                    <View className='daily-card-title flex flex-start'>
                        <View>客户下单前10</View>
                        <View className='flex-grow'></View>
                        <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                    </View>
                    <View className='flex flex-start m-b-10'>
                        {/* <Picker mode='selector' rangeKey='title' range={optionTypeList} onChange={(e) => changeOption(e, 'optionsType')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionType?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker> */}

                        <View className='flex-grow'></View>
                        {/* <Picker mode='selector' rangeKey='title' range={optionTypeList} onChange={(e) => changeOption(e, 'optionsType')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{optionType?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker> */}
                        <Picker mode='selector' rangeKey='title' range={layerList} onChange={(e) => changeOption(e, 'layerInfo')}>
                            <View className='daily-card-switch-text expend-click flex flex-start primary-color'>
                                <View>{layerInfo?.title}</View>
                                <View className='primary-bottom'></View>
                            </View>
                        </Picker>
                    </View>
                    {// 1，2为图表，1为柱状图，2为线型图，3为表格
                    ['1','2'].includes(showTableType2+'') ? <View style={{ width: '100%', height: '300px' }}>
                        {/* <View className='daily-title margin-top'>{item.title}</View> */}
                        {orderRank?.length && chartOptionsWeek ? <Echarts
                            isPage={false}
                            ref={echartsRef}
                            echarts={echartsJs}
                            canvasId={`operateRank`}
                            option={chartOptionsWeek}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        /> : <View className='g-empty-chart'>暂无数据</View>}
                    </View> : <>
                    <View style={'max-height: 668rpx;overflow-y: auto;'}>
                    <GTable list={orderRank} titleList={[
                        { title: '客户名称', field: 'customerName', width: '200rpx' },
                        { title: '下单总数', field: 'sumQuantity' },
                        { title: '新单', field: 'newQuantity' },
                        { title: '返单', field: 'returnQuantity' },
                        { title: '返单有改', field: 'returnChangeQuantity' },
                        { title: '样转批', field: 'sampleQuantity' },
                    ]}
                    // thSlot={(title, slotIndex) => {
                    //     return (
                    //         // {title, slotIndex}
                    //         <View className='flex flex-center'>
                    //             {title?.title}
                    //             {title?.title == '款数' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单款数`}></GTooltip></View> : <></>}
                    //             {title?.title == '面积' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单面积`}></GTooltip></View> : <></>}
                    //             {title?.title == '金额' ? <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：已审核状态的订单金额`}></GTooltip></View> : <></>}
                    //         </View>
                    //     )
                    // }}
                    tdSlot={(title, item, slotIndex) => {
                        let value = title.field.includes('.') ? (
                            item[title.field.split('.')[0]][title.field.split('.')[1]]
                        ) : item[title.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}1
                        return (
                            <View>
                                {value}
                            </View>
                        )
                    }}
                    ></GTable>
                    </View>
                    </>}
                </View> : <></>}
                </>
                )
            }) : <></>
            }
            <Canvas canvasId={`${option2?.field}22`} style={'display: none;'}></Canvas>
            <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
                <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=1')}>报表配置</View>
            </GFixedIcon>
            <GFeedback></GFeedback>
            {/* <GSettingDialog rowList={[
                {name: '接单图表', field: 'orderChart', value: () => visibleHiddenConfig?.orderChart},
                {name: '订单数据', field: 'orderData', value: () => visibleHiddenConfig?.orderData},
                {name: '业务员数据', field: 'userData', value: () => visibleHiddenConfig?.userData},
                {name: '统计图', field: 'statistics', value: () => visibleHiddenConfig?.statistics},
            ]} onInit={(val) => setRargetInfo(val)} onChange={saveConfig}></GSettingDialog> */}
        </View>
    )
}
