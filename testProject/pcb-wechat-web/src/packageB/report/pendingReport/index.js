import './index.less'
import Echarts from 'taro-react-echarts'
import {useRef, useState, useEffect} from 'react'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
import echartsJs from '../../../pages/util/echarts'
import GTooltip from '../../../components/g-tooltip'
import GFixedIcon from '../../../components/g-fixed-icon'
import { initPedingReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import { View, Switch } from '@tarojs/components'
import Taro, {useLoad, useShareAppMessage, useDidShow} from '@tarojs/taro'
import {
  getCapacityAuditStatisticsAPI, getHandleStatisticsAPI,
} from '../../../pages/services/reportForms/index'
import GFeedback from '../../../components/g-feedback'


export default function EngineeringReport() {
  const echartsRef = useRef()
  const echartsRef1 = useRef()
  const [auditList, setAuditList] = useState([])
  const [handleList, setHandleList] = useState([])
  const [todayTotal, setTodayTotal] = useState(0)
  const [earlierTotal, setEarlierTotal] = useState(0)
  const [auditFlag, setAuditFlag] = useState(false)
  const [handleFlag, setHandleFlag] = useState(false)
  const [reportConfig, setReportConfig] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [chartType1, setChartType1] = useState(false)
  const [chartType2, setChartType2] = useState(false)
  const [handleOptions, setHandleOptions] = useState()

  const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
  const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格

  useShareAppMessage(() => {
    return {
      path: '/pages/index/index'
    }
  })
  useLoad((options) => {
    console.log('options:', options)

  })
  useDidShow(() => {
    Taro.showLoading({mask: true})
    Promise.all([getVisHidConfig(), getStatisticsInfo()]).then(() => {
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
      if (handleOptions) {
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
  }, [chartOptions, echartsRef, handleOptions, echartsRef1])

  // 表格，图表切换
  const changeTable = (val, tempType) => {
    let tempVal = val == '3' ? '1' : (Number(val) + 1)
    if (tempType == '1') {
      setShowTableType1(tempVal)
      setAuditStatistics(auditList, tempVal)
    } else if (tempType == '2') {
      setShowTableType2(tempVal)
      setHandleStatistics(handleList, tempVal)
    }
  }

  // 获取显隐配置
  const getVisHidConfig = () => {
      return new Promise((resolve, reject) => {
          dailySwitchAPI('8').then((res) => {
              if (res.code == 200) {
                  let data = JSON.parse(JSON.stringify(res.data || {}))
                  data.configParam = data?.configParam ? JSON.parse(data.configParam) : initPedingReport

                  // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                  // 初始化序号
                  initPedingReport.map((m, mI) => { m.sort = (mI+1) })
                  // console.log(JSON.parse(JSON.stringify(data.configParam)), initPedingReport)
                  // 获取 初始化数组中 新增的数据
                  let tempConfig = initPedingReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                  // 获取 初始化数组中 删除的数据
                  let needDelConfig = data.configParam.filter((f) => !initPedingReport.map((m) => m.id).includes(f.id))
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

  // 获取统计信息
  const getStatisticsInfo = () => {
    let today = 0;
    let earlier = 0;
    // 获取个人产能上报数据
    getCapacityAuditStatisticsAPI().then((res) => {
      if (res.code == 200) {
        today = today + (res.data.todayTotal || 0)
        earlier = earlier + (res.data.earlierTotal || 0)
        setTodayTotal(today);
        setEarlierTotal(earlier);
        setAuditStatistics(res.data.auditStatisticsVos || [])
        setAuditList(res.data.auditStatisticsVos || [])
      }
    })

    // 获取物料采购受理统计
    getHandleStatisticsAPI().then((res) => {
      if (res.code == 200) {
        today = today + (res.data.todayTotal || 0)
        earlier = earlier + (res.data.earlierTotal || 0)
        setTodayTotal(today);
        setEarlierTotal(earlier);
        setHandleStatistics(res.data.auditStatisticsVos || [])
        setHandleList(res.data.auditStatisticsVos || [])
      }
    });
  }

  // 个人产能上报审核报表
  const setAuditStatistics = (list = [], chartType = '') => {
    let chart = chartType+'' ? chartType : showTableType1
    // 数据为空则不展示报表
    if(list.length == 0) {
      setChartOptions(undefined)
      return
    }
    let data = [];
    data.push({
      name: '昨日及更早待审核',
      data: list?.length ? list.map((m) => m.earlierCount) : [],
      type: chart == '1' ? 'bar' : 'line',
      itemStyle: {
        color: '#1890FF'
      }
    })
    data.push({
      name: '今日待审核',
      data: list?.length ? list.map((m) => m.todayCount) : [],
      type: chart == '1' ? 'bar' : 'line',
      // label: {
      //   show: true,
      //   position: 'inside',
      //   formatter: (params) => params?.value ? params?.value : ''
      // },
      itemStyle: {
        color: '#52C41A'
      }
    })

    const option = {
      grid: {
        show: false,
        top: '5%',
        left: '12%',
        right: '5%',
        bottom: 70,
        containLabel: false,
        borderWidth: 0,
      },
      legend: {
        data: list?.length ?  ['昨日及更早待审核','今日待审核'] : [],
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
        //     color: ['rgba(200,200,200,0.3)', 'rgba(200,200,200,0.3)']
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
      /*dataZoom: [{
        type: 'slider',
        show: list?.length > 7,
        height: 10,
        moveHandleSize: 10,
        bottom: 0,
        startValue: list?.length - 6,
        endValue: list?.length,
        brushSelect: false,
        zoomLock: true,
      }]*/
    }
    setChartOptions(option);
  }

  // 采购受理统计报表
  const setHandleStatistics = (list = [], chartType = '') => {
    let chart = chartType+'' ? chartType : showTableType2
    // 数据为空则不展示报表
    if(list.length == 0) {
      setHandleOptions(undefined)
      return
    }
    let data = [];
    data.push({
      name: '昨日及更早待受理',
      data: list?.length ? list.map((m) => m.earlierCount) : [],
      type: chart == '1' ? 'bar' : 'line',
      itemStyle: {
        color: '#1890FF'
      }
    })
    data.push({
      name: '今日待受理',
      data: list?.length ? list.map((m) => m.todayCount) : [],
      type: chart == '1' ? 'bar' : 'line',
      itemStyle: {
        color: '#52C41A'
      }
    })

    const option = {
      grid: {
        show: false,
        top: '5%',
        left: '12%',
        right: '5%',
        bottom: 50,
        containLabel: false,
        borderWidth: 0,
      },
      legend: {
        data: ['昨日及更早待受理','今日待受理'],
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
          showMaxLabel: true,
          color: '#333333',
          interval: 0,
        },
        // splitArea: {
        //   show: true,
        //   interval: 0,
        //   areaStyle: {
        //     color: ['rgba(200,200,200,0.3)', 'rgba(200,200,200,0.3)']
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
      /*dataZoom: [{
        type: 'slider',
        show: list?.length > 7,
        height: 10,
        moveHandleSize: 10,
        bottom: 0,
        startValue: list?.length - 6,
        endValue: list?.length,
        brushSelect: false,
        zoomLock: true,
      }]*/
    }
    setHandleOptions(option);
  }

  const toRecord = () => {
    Taro.navigateTo({url: '/pages/emailRecord/index'})
  }

  // 页面跳转
  const toPath = (url) => {
      Taro.navigateTo({url})
  }
  return (
    <>
      <View className='report-page orange'>
        <NavBar large={true} color={'#333'} title={'待处理业务统计'} transparent={false} leftIconType={'chevron-left'}></NavBar>
        {
        reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
            return (
            <>
            {(row?.id == 1) && row?.show ? <><View className='report-pending-top-card'>
              <View className='flex flex-end'>
                <View className='date-choose'>
                  <View className='current-time'>
                    数据统计截止到当前时间
                  </View>
                </View>
              </View>
              <View className='top-card-list flex flex-start'>
                <View className='top-card-item'>
                  <View className='top-card-label flex flex-start'>
                    昨日及更早待审核
                    <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`统计昨天及之前，各部门产能上报未审核以及采购未受理的单据数量`}icon={<View className='primary-question-white'></View>}></GTooltip></View>
                  </View>
                  <View className='top-card-value flex flex-start font-number'>
                    <View className='top-card-value-large'>{earlierTotal}</View>
                  </View>
                </View>
                <View className='top-card-item'>
                  <View className='top-card-label flex flex-start'>
                    今日待审核
                    <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`统计今日，各部门产能上报未审核的单据以及采购未受理的单据`}icon={<View className='primary-question-white'></View>}></GTooltip></View>
                  </View>
                  <View className='top-card-value flex flex-start font-number'>
                    <View className='top-card-value-large'>{todayTotal}</View>
                  </View>
                </View>
              </View>
            </View></> : <></>}
            {(row?.id == 2) && row?.show ? <><View className='report-box'>
              <View className='report-box-header flex flex-betweent'>
                <View className='report-box-title flex flex-start'>
                  个人产能上报审核统计
                </View>
                <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
                {/* {!auditFlag ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                    <View className='daily-card-switch-text'>{chartType1 ? '折线图' : '柱状图'}</View>
                    <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType1} onChange={(e) => {
                      setChartType1(e?.detail?.value)
                      setAuditStatistics(auditList, e?.detail?.value)
                    }}/>
                </View> : <></>}
                {!auditFlag ? <View className='report-box-change flex flex-end' onClick={() => setAuditFlag(!auditFlag)}>
                  <View className='primary-change-table'></View>
                </View> : <View className='report-box-change flex flex-end' onClick={() => setAuditFlag(!auditFlag)}>
                  <View className='primary-change-chart'></View>
                </View>
                } */}
              </View>
              {// 1，2为图表，1为柱状图，2为线型图，3为表格
              ['1','2'].includes(showTableType1+'') ?
                <>
                  <View style={{width: '100%', height: '300px'}}>
                    {/* <View className='daily-title margin-top'>{item.title}</View> */}
                    {chartOptions ? <Echarts
                      isPage={false}
                      ref={echartsRef}
                      echarts={echartsJs}
                      option={chartOptions}
                      // style自定义设置echarts宽高
                      style={{width: '100%', height: '300px'}}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                </> :
                <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                <GTable list={auditList} titleList={[
                  {title: '部门', field: 'deptName'},
                  {title: '今日待审核数量', field: 'todayCount'},
                  {title: '昨日及更早待审核数量', field: 'earlierCount'}
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
                  物料采购受理统计
                </View>
                <View className={`flex-none m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                {/* {!handleFlag ? <View className='flex flex-end daily-card-switch-box m-r-10'>
                    <View className='daily-card-switch-text'>{chartType2 ? '折线图' : '柱状图'}</View>
                    <Switch className='daily-switch switch-small' color='#2D90ED' checked={chartType2} onChange={(e) => {
                      setChartType2(e?.detail?.value)
                      setHandleStatistics(handleList, e?.detail?.value)
                    }}/>
                </View> : <></>}
                {!handleFlag ? <View className='report-box-change flex flex-end' onClick={() => setHandleFlag(!handleFlag)}>
                  <View className='primary-change-table'></View>
                </View> : <View className='report-box-change flex flex-end' onClick={() => setHandleFlag(!handleFlag)}>
                  <View className='primary-change-chart'></View>
                </View>
                } */}
              </View>
              {// 1，2为图表，1为柱状图，2为线型图，3为表格
              ['1','2'].includes(showTableType2+'') ?
                <>
                  <View style={{width: '100%', height: '300px'}}>
                    {/* <View className='daily-title margin-top'>{item.title}</View> */}
                    {handleOptions ? <Echarts
                      isPage={false}
                      ref={echartsRef1}
                      echarts={echartsJs}
                      option={handleOptions}
                      // style自定义设置echarts宽高
                      style={{width: '100%', height: '300px'}}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                </> :
                <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                <GTable list={handleList} titleList={[
                  {title: '部门', field: 'deptName'},
                  {title: '今日待受理数量', field: 'todayCount'},
                  {title: '昨日及更早待受理数量', field: 'earlierCount'}
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
          <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=8')}>报表配置</View>
      </GFixedIcon>
      <GFeedback></GFeedback>
    </>


  )
}
