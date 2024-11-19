import './index.less'
import dayjs from 'dayjs'
import Echarts from 'taro-react-echarts'
import { useRef, useState, useEffect } from 'react'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
// import DateChoose from '../components/dateChoose'
import DateDrawer from '../components/dateDrawer'
import echartsJs from '../../../pages/util/echarts'
import GTooltip from '../../../components/g-tooltip'
import { priceFormat } from '../../../pages/util/func'
import { View, Switch, Picker } from '@tarojs/components'
import GFixedIcon from '../../../components/g-fixed-icon'
import GSplitNumber from '../../../components/g-split-number'
import { initOutSourceReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import Taro, {useLoad,useShareAppMessage, useDidShow} from '@tarojs/taro'
import {
  getCraftStatisticsAPI, getSupplierStatisticsAPI
} from '../../../pages/services/reportForms/index'
import GFeedback from '../../../components/g-feedback'

export default function EngineeringReport() {
  const echartsRef = useRef()
  const echartsRef1 = useRef()
  const [quantity , setQuantity ] = useState()
  const [area, setArea] = useState('')
  const [type, setType] = useState('')
  const [disPage, setDisPage] = useState('')
  const [craftList, setCraftList] = useState([])
  const [supplierList, setSupplierList] = useState([])
  const [craftOption, setCraftOption] = useState([])
  const [isRedirect, setIsRedirect] = useState(0)
  const [optionValue, setOptionValue] = useState()
  const [reportConfig, setReportConfig] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [supplierOptions, setSupplierOptions] = useState()

  const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
  const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格

  const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
  const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
  const [endTime, setEndTime] = useState(initEnd)
  const [startTime, setStartTime] = useState(initStart)

  useShareAppMessage(() => {
    return {
      title: typeList[type],
      path: '/pages/index/index'
    }
  })
  useLoad((options) => {
    console.log('options:', options)
    setType(options?.type || 1)
    setIsRedirect(options?.isRedirect || 0)
  })
  useDidShow(() => {
    Taro.showLoading({ mask: true })
    Promise.all([getVisHidConfig(), getOutSourceReport()]).finally(() => {
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
      if (supplierOptions) {
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
  }, [chartOptions, echartsRef, supplierOptions, echartsRef1])

  // 表格，图表切换
  const changeTable = (val, tempType) => {
    let tempVal = val == '3' ? '1' : (Number(val) + 1)
    if (tempType == '1') {
      setShowTableType1(tempVal)
      setCraftStatistics(craftList, tempVal)
    } else if (tempType == '2') {
      setShowTableType2(tempVal)
      setSupplierStatistics(supplierList, tempVal)
    }
  }

  // 获取显隐配置
  const getVisHidConfig = () => {
      return new Promise((resolve, reject) => {
          dailySwitchAPI('7').then((res) => {
              if (res.code == 200) {
                  let data = JSON.parse(JSON.stringify(res.data || {}))
                  data.configParam = data?.configParam ? JSON.parse(data.configParam) : initOutSourceReport

                  // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                  // 初始化序号
                  initOutSourceReport.map((m, mI) => { m.sort = (mI+1) })
                  // console.log(JSON.parse(JSON.stringify(data.configParam)), initOutSourceReport)
                  // 获取 初始化数组中 新增的数据
                  let tempConfig = initOutSourceReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                  // 获取 初始化数组中 删除的数据
                  let needDelConfig = data.configParam.filter((f) => !initOutSourceReport.map((m) => m.id).includes(f.id))
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
  // 获取外协统计信息
  const getOutSourceReport = (query) => {
    return new Promise((resolve, reject) => {
      let params = {
        placeOrderTimeEnd: query?.end || endTime,
        placeOrderTimeStart: query?.start || startTime,
      }
      if (params?.placeOrderTimeEnd) {
        params.placeOrderTimeEnd = dayjs(params?.placeOrderTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (params?.placeOrderTimeStart) {
        params.placeOrderTimeStart = params?.placeOrderTimeStart + ' 00:00:00'
      }
      Taro.showLoading({ mask: true })
      // 查询外协统计信息
      getCraftStatisticsAPI(params).then((res) => {
        if (res.code == 200) {
          // console.log(res)
          setQuantity(res.data.totalCount || 0);
          setArea(res.data.totalArea || 0);
          setCraftList(res.data.statisticsVoList || []);
          setCraftStatistics(res.data.statisticsVoList || []);
          if(res.data.statisticsVoList?.length > 0) {
            // 处理工艺下拉选项
            let optionList = [{title: '全部', field: 0, unit: ''}];
            res.data.statisticsVoList.map((item) => {
              optionList.push({title: item.craftName, field: item.craftId, unit: ''})
            })
            setCraftOption(optionList);
            params.craftId = 0;
            setOptionValue(optionList[0]);

            // 查询供应商统计信息
            getSupplierStatisticsAPI(params).then((res1) => {
              if (res1.code == 200) {
                console.log("params---------", params);
                setSupplierList(res1.data || []);
                setSupplierStatistics(res1.data || []);
              }});
          } else {
            setCraftOption(undefined)
            setSupplierOptions(undefined)
            setSupplierList(undefined)
          }

          Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(err))

      /*// 查询供应商统计信息
      getSupplierStatisticsAPI(params).then((res) => {
        if (res.code == 200) {
          console.log("craftOption---------", craftOption);
          setSupplierList(res.data || []);
          setSupplierStatistics(res.data || []);
          Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(err))*/
    })
  }

  // 动态更新供应商统计信息
  const changeSupplierStatistics = (query) => {
    let params = {
      placeOrderTimeEnd: query?.end || endTime,
      placeOrderTimeStart: query?.start || startTime,
      craftId: query?.craftId || 0,
    }
    if (params?.placeOrderTimeEnd) {
      params.placeOrderTimeEnd = dayjs(params?.placeOrderTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
    }
    if (params?.placeOrderTimeStart) {
      params.placeOrderTimeStart = params?.placeOrderTimeStart + ' 00:00:00'
    }
    Taro.showLoading({ mask: true })
    // 查询供应商统计信息
    getSupplierStatisticsAPI(params).then((res) => {
      if (res.code == 200) {
        setSupplierList(res.data || []);
        setSupplierStatistics(res.data || []);
        Taro.hideLoading()
      }
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
    getOutSourceReport(tempDate)
  }

  // 工序外协报表
  const setCraftStatistics = (list = [], chartType = '') => {
    let chart = chartType+'' ? chartType : showTableType1
    // 数据为空则不展示报表
    if(list.length == 0) {
      setChartOptions(undefined)
      return
    }
    let data = [];
    data.push({
      name: '面积(㎡)',
      data: list?.length ? list.map((m) => m.area) : [],
      type: chart == '1' ? 'bar' : 'line',
      yAxisIndex: 0,
      itemStyle: {
        color: '#1890FF'
      }
    })
    data.push({
      name: '单数',
      data: list?.length ? list.map((m) => m.count) : [],
      type: chart == '1' ? 'bar' : 'line',
      yAxisIndex: 1,
      itemStyle: {
        color: '#52C41A'
      }
    })
    const option = {
      grid: {
        show: false,
        top: '8%',
        left: '14%',
        right: '14%',
        bottom: 80,
        containLabel: false,
        borderWidth: 0,
      },
      legend: {
        data: list?.length ?  ['面积(㎡)','单数'] : [],
        bottom: 10,
        itemWidth: 18,
        itemHeight: 8,
        textStyle: {
          fontSize: 10,
        },
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
        // },
      },
      yAxis: [{
          type: 'value',
          min: 0,
          name: '面积(㎡)',
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          splitLine: {
              show: false,
          },
          nameTextStyle: {
            lineHeight: 0,
            align: 'left'
          },
        },{
          type: 'value',
          name: '单数',
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          splitLine: {
              show: false,
          },
          nameTextStyle: {
            lineHeight: 0,
            align: 'right'
          },
        }],
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
    setChartOptions(option)
  }

  // 供应商外协报表
  const setSupplierStatistics = (list = [], chartType = '') => {
    let chart = chartType+'' ? chartType : showTableType2
    // 数据为空则不展示报表
    if(list.length == 0) {
      setSupplierOptions(undefined)
      return
    }
    let data = [];
    data.push({
      name: '面积(㎡)',
      data: list?.length ? list.map((m) => m.area) : [],
      type: chart == '1' ? 'bar' : 'line',
      yAxisIndex: 0,
      itemStyle: {
        color: '#1890FF'
      }
    })
    data.push({
      name: '单数',
      data: list?.length ? list.map((m) => m.count) : [],
      type: chart == '1' ? 'bar' : 'line',
      yAxisIndex: 1,
      itemStyle: {
        color: '#52C41A'
      }
    })
    const option = {
      grid: {
        show: false,
        top: '8%',
        left: '14%',
        right: '14%',
        bottom: 70,
        containLabel: false,
        borderWidth: 0,
      },
      legend: {
        data: list?.length ?  ['面积(㎡)','单数'] : [],
        top: 'bottom',
        itemWidth: 18,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        },
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
        data: list?.length ? list.map((m) => m.supplierName) : [],
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
          rotate: list.length == 1 ? 0 : 35,
          showMaxLabel: true,
          color: '#333333',
          interval: 0,
          formatter: (params) => {
            var val = "";
            if (list.length > 1 && params.length > 4) {
              val = params.substr(0, 4) + '...';
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
      yAxis: [{
          type: 'value',
          min: 0,
          name: '面积(㎡)',
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          splitLine: {
              show: false,
          },
          nameTextStyle: {
            lineHeight: 0,
            align: 'left'
          },
        },{
          type: 'value',
          name: '单数',
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          splitLine: {
              show: false,
          },
          nameTextStyle: {
            lineHeight: 0,
            align: 'right'
          },
        }],
      series: data,
    }
    setSupplierOptions(option)
  }

  // 改变展示的数据
  const changeOption = (e, tempType) => {
    if(craftOption && tempType == 'option') {
      setOptionValue(craftOption[Number(e?.detail?.value)])
      changeSupplierStatistics({craftId: craftOption[Number(e?.detail?.value)]?.field})
    } else if(tempType == 'chartType1') {
      setChartType1(e?.detail?.value)
      setCraftStatistics(craftList, e?.detail?.value)
    } else if(tempType == 'chartType2') {
      setChartType2(e?.detail?.value)
      setSupplierStatistics(supplierList, e?.detail?.value)
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
      <View className={`report-page orange ${disPage}`}>
        <NavBar large={true} color={'#333'} title={'工序外协报表'} transparent={false} leftIconType={'chevron-left'}></NavBar>
        <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>
        {
        reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
            return (
            <>
            {(row?.id == 1) && row?.show ? <><View className='report-outsource-top-card'>
              {/* <DateChoose end={endTime} start={startTime} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateChoose> */}
              <View className='top-card-list flex flex-start'>
                <View className='top-card-item'>
                  <View className='top-card-label flex flex-start'>
                    工序外协单数
                    <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`以下单时间为准，统计一段时间内，工序外协单的数量（以外协单号来统计）`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                  </View>
                  <View className='top-card-value flex flex-start font-number'>
                    <View className='top-card-value-large'>{quantity || 0}</View>
                  </View>
                </View>
                <View className='top-card-item'>
                  <View className='top-card-label flex flex-start'>
                    工序外协面积(㎡)
                    <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`以下单时间为准，统计一段时间内，工序外协单的订单面积`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                  </View>
                  <GSplitNumber number={priceFormat(area, 4)} classStr={'top-card-value flex flex-start'}></GSplitNumber>
                  {/* <View className='top-card-value flex flex-start font-number'>
                    {area.toString().includes('.') ? <>
                      <View className='top-card-value-large'>{area.toString().split('.')[0]}</View>
                      .{area.toString().split('.')[1]}
                    </> : <View className='top-card-value-large'>{area || 0}</View>}
                  </View> */}
                </View>
              </View>
            </View></> : <></>}
            {(row?.id == 2) && row?.show ? <><View className='report-box'>
              <View className='report-box-header flex flex-betweent'>
                <View className='report-box-title flex flex-start'>
                  工序外协总览
                  <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`以下单时间为准，统计一段时间内，各项工序的外协加工单的数量和面积（点击对应工序即可查看该工序的外协供应商占比情况）`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                </View>
                <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
              </View>
              {// 1，2为图表，1为柱状图，2为线型图，3为表格
              ['1','2'].includes(showTableType1+'') ?
                <>
                  <View style={{ width: '100%', height: '300px' }}>
                    {/* <View className='daily-title margin-top'>{item.title}</View> */}
                    {chartOptions ? <Echarts
                      isPage={false}
                      ref={echartsRef}
                      echarts={echartsJs}
                      option={chartOptions}
                      // style自定义设置echarts宽高
                      style={{ width: '100%', height: '300px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                </> :
                <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={craftList} titleList={[
                    { title: '外协工序', field: 'craftName' },
                    { title: '单数', field: 'count' },
                    { title: '面积(㎡)', field: 'area' },
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
            {(row?.id == 3) && row?.show ? <><View className='report-box'>
              <View className='report-box-header flex flex-betweent'>
                <View className='report-box-title flex flex-start'>
                  供应商外协加工统计
                  <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`以创建时间为准，统计每道工序中参与外协加工的供应商(前八位)占比情况`} icon={<View className='primary-question-gray'></View>}></GTooltip></View>
                </View>
                <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
              </View>
              {// 1，2为图表，1为柱状图，2为线型图，3为表格
              ['1','2'].includes(showTableType2+'') ?
                <>
                  <View className='flex flex-between'>
                    <View style={'flex: 2;'} className='flex flex-end'>
                      <Picker mode='selector' rangeKey='title' range={craftOption} onChange={(e) => changeOption(e, 'option')}>
                        <View className='daily-card-switch-text flex flex-end primary-color'>
                          <View>{optionValue?.title}</View>
                          <View className='primary-bottom'></View>
                        </View>
                      </Picker>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: '310px' }}>
                    {supplierOptions ? <Echarts
                      isPage={false}
                      ref={echartsRef1}
                      echarts={echartsJs}
                      canvasId={`option2`}
                      option={supplierOptions}
                      // style自定义设置echarts宽高
                      style={{ width: '100%', height: '310px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                </> :
                <View style={'max-height: 300px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={supplierList} titleList={[
                    { title: '供应商', field: 'supplierName', width: '320rpx' },
                    { title: optionValue?.title, field: 'returned', children: [
                      { title: '单数', field: 'count', width: '100rpx' },
                      { title: '面积(㎡)', field: 'area', width: '200rpx' },
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
            </View></> : <></>}
            </>
            )
        }) : <></>
        }
      </View>
      <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
          <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=7')}>报表配置</View>
      </GFixedIcon>
      <GFeedback></GFeedback>
    </>
  )
}
