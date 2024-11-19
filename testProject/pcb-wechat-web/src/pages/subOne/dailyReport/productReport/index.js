import './index.less'
import dayjs from 'dayjs'
// import { AtSwitch } from 'taro-ui'
import Echarts from 'taro-react-echarts'
// import echartsJs from '../../../util/echarts'
import GTable from '../../../../components/g-table'
import { useRef, useState, useEffect } from 'react'
import GTooltip from '../../../../components/g-tooltip'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { View, Switch, Picker, Canvas, Image, Swiper, SwiperItem } from '@tarojs/components'
import { productionDailyReportAPI, productionDailyReportLineAPI } from '../../../services/dailyReport'

export default function ProductReport({ echartsJs, titleChange }) {
    const optionList = [
        {title: '款数', field: 'sumQuantity', unit: '款数'},
        {title: '面积', field: 'sumArea', unit: '㎡'},
        {title: '金额', field: 'sumPrice', unit: '元'},
        {title: '投料款数', field: 'productionQuantity', unit: '款数'}
    ]
    const echartsRef = useRef()
    const [list, setList] = useState()
    const [type, setType] = useState('')
    const [weekList, setWeekList] = useState()
    const [chartType, setChartType] = useState(false)
    const [chartTypeWeek, setChartTypeWeek] = useState(false)

    const [option1, setOption1] = useState(optionList[0])
    const [option2, setOption2] = useState(optionList[0])
    const [option3, setOption3] = useState(optionList[0])
    const [chartOptions, setChartOptions] = useState()
    const [chartOptionsWeek, setChartOptionsWeek] = useState()

    const [tagId, setTagId] = useState(1)
    const [tagList, setTagList] = useState([
        { id: 1, name: '按日' },
        { id: 2, name: '按周' },
        { id: 3, name: '按月' },
    ])
    useDidShow(() => {
        Taro.showLoading({ mask: true })
        Promise.all([productionDailyReport('', false), productionDailyReportLine('', false)]).finally(() => Taro.hideLoading())
    })

    // 获取日报表格
    const productionDailyReport = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId
            }
            flag && Taro.showLoading({ mask: true })
            productionDailyReportAPI(params).then((res) => {
                if (res.code == 200) {
                    setList(res.data)
                    // console.log('res.data:', res.data)
                    if (res.data?.deptName) {
                        titleChange && titleChange(`${res.data?.deptName || ''}生产日报`)
                    }
                    flag && Taro.hideLoading()
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => {
                reject(false)
            })
        })
    }

    // 获取日报表格
    const productionDailyReportLine = (query, flag = true) => {
        return new Promise((resolve, reject) => {
            let params = {
                type: query?.tagId ? query?.tagId : tagId
            }
            flag && Taro.showLoading({ mask: true })
            productionDailyReportLineAPI(params).then((res) => {
                if (res.code == 200) {
                    let tempList = res.data?.length ? res.data.sort((a, b) => a.index - b.index) : []
                    setWeekList(tempList)
                    setChartWeek(tempList)
                    flag && Taro.hideLoading()
                    resolve(true)
                } else {
                    reject(false)
                }
            }).catch(() => {
                reject(false)
            })
        })
    }

    // 设置周趋势
    const setChartWeek = (tempList, chart = '') => {
        let optChart = (chart + '') ? chart : chartTypeWeek
        let dataList = tempList ? tempList : weekList
        let data = []
        let color = ['#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA','#2D90ED','#D2E63C','#00BAAD','#FFEB3B','#F7BF50','#7DCBFF','#EB93FA']
        let tempWeeks = dataList?.length ? dataList[0]?.list : []
        tempWeeks?.length && tempWeeks.filter((f) => f.name != '合计').map((m, mI) => {
            let tempItem = []
            dataList.map((w) => {
                tempItem.push(w?.list.find((f) => f.name == m.name)['sum'])
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
                left: '12%',
                right: '5%',
                bottom: 30,
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
                data: dataList?.length ? dataList.map((m) => m.day) : [],
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // rotate: 15,
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
                name: '㎡',
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
            dataZoom: [{
                type: 'slider',
                show: dataList?.length > 7,
                height: 10,
                moveHandleSize: 10,
                bottom: 0,
                startValue: 0,
                endValue: 6,
                brushSelect: false,
                zoomLock: true,
            }]
        }
        // console.log('options:', option)
        setChartOptionsWeek(option)
    }

    // 改变搜索日期
    const changeTag = (id) => {
        setTagId(id)
        let params = { tagId: id }
        Taro.showLoading({ mask: true })
        Promise.all([productionDailyReport(params, false), productionDailyReportLine(params, false)]).finally(() => Taro.hideLoading())
    }

    // 改变展示的数据
    const changeOption = (e, tempType) => {
        if (tempType == 'options1') {
            setOption1(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'options2') {
            setOption2(optionList[Number(e?.detail?.value)])
            setChartDay(optionList[Number(e?.detail?.value)])
        } else if (tempType == 'options3') {
            setOption3(optionList[Number(e?.detail?.value)])
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

    return (
        <View className='daily engineering-daily'>
            <View className='daily-tag-list'>
            {
                tagList.map((item) => {
                    return (
                        <View className={`daily-tag ${item.id == tagId && 'daily-tag-active'}`} onClick={() => changeTag(item.id)}>{item.name}</View>
                    )
                })
            }
            </View>

            <View className='daily-nav has-left'>

                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>上报面积
                            <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：部门所属工序且审核通过的个人产能上报面积`}></GTooltip></View>
                        </View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <View className='daily-nav-value'>{list?.sumInformArea || 0}</View>
                </View>
                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>生产面积
                            <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：部门所属工艺的出单面积`}></GTooltip></View>
                        </View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <View className='daily-nav-value'>{list?.sumProductionArea || 0}</View>
                </View>
            </View>
            <View className='daily-nav has-left'>

                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>结存面积
                            <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：部门所属工艺的结存面积`}></GTooltip></View>
                        </View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <View className='daily-nav-value'>{list?.sumBalanceArea || 0}</View>
                </View>
                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>报废面积
                            <View style={`margin: 0 0 5rpx 10rpx;`}><GTooltip size={12} msg={`统计：部门所属工艺的报废面积`}></GTooltip></View>
                        </View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <View className='daily-nav-value'>{list?.sumScrapArea || 0}</View>
                </View>
            </View>

            <View className='daily-card'>
                <View className='daily-card-title flex flex-start'>
                    <View>上报数据</View>
                </View>
                <GTable list={list?.productionReportDeptExcelVo?.productionReportProcessVos || []} titleList={[{ title: '名称', id: 0, field: 'userName' }].concat(list?.productionReportDeptExcelVo?.processTitle.map((m) => {
                    return {
                        id: m.id,
                        title: m.title,
                        field: 'sumArea',
                    }
                }) || [])}
                tdSlot={(title, item, slotIndex) => {
                    // let value = title.field.includes('.') ? (
                    //     item[title.field.split('.')[0]][title.field.split('.')[1]]
                    // ) : item[title.field]
                    let value = ''
                    if (title.field.includes('sumArea')) {
                        value = item?.areaList[slotIndex - 1]
                    } else {
                        value = item[title.field]
                    }
                    //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                    return (
                        <View>
                            {value}
                        </View>
                    )
                }}
                ></GTable>
            </View>

            <View className='daily-card'>
                <View className='daily-card-title flex flex-start'>
                    <View>{tagId != 3 ? '周' : '月'}趋势</View>
                    <View className='flex-grow'></View>
                    <View className='flex flex-end'>
                        <View className='daily-card-switch-text'>{chartTypeWeek ? '折线图' : '柱状图'}</View>
                        <Switch className='daily-switch' color='#2D90ED' checked={chartTypeWeek} onChange={(e) => changeChart(e.detail.value, 'options3')}/>
                    </View>
                </View>
                <View style={{ width: '100%', height: '300px' }}>
                    {/* <View className='daily-title margin-top'>{item.title}</View> */}
                    {chartOptionsWeek ? <Echarts
                        isPage={false}
                        ref={echartsRef}
                        echarts={echartsJs}
                        option={chartOptionsWeek}
                        canvasId={`${option3.field}1`}
                        // style自定义设置echarts宽高
                        style={{ width: '100%', height: '300px' }}
                        // className='echarts-dom'
                    /> : <></>}
                </View>
            </View>
            <Canvas canvasId={`${option3?.field}2`} style={'display: none;'}></Canvas>
        </View>
    )
}
