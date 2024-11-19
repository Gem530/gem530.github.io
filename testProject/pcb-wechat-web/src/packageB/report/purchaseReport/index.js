import './index.less'
import dayjs from 'dayjs'
import Echarts from 'taro-react-echarts'
import { useRef, useState, useEffect } from 'react'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
// import DateChoose from '../components/dateChoose'
import DateDrawer from '../components/dateDrawer'
import echartsJs from '../../../pages/util/echarts'
import { View, Switch } from '@tarojs/components'
import { priceFormat } from '../../../pages/util/func'
import GFixedIcon from '../../../components/g-fixed-icon'
import GSplitNumber from '../../../components/g-split-number'
import { initPurchaseReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import Taro, {useLoad,useShareAppMessage, useDidShow} from '@tarojs/taro'
import {
  getDetailStatisticsAPI
} from '../../../pages/services/reportForms/index'
import GTooltip from "../../../components/g-tooltip";
import GFeedback from '../../../components/g-feedback'

export default function EngineeringReport() {
  const echartsRef = useRef()
  const [head, setHead] = useState('')
  const [unit, setUnit] = useState('')
  const [type, setType] = useState('')
  const [disPage, setDisPage] = useState('')
  const [tabList, setTabList] = useState([])
  const [auditList, setAuditList] = useState([])
  const [reportConfig, setReportConfig] = useState()
  const [chartOptions, setChartOptions] = useState()

  const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
  
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
  })
  useDidShow(() => {
    Taro.showLoading({ mask: true })
    Promise.all([getVisHidConfig(), getDetailStatistics(),]).finally(() => {
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
  }, [echartsRef, chartOptions])

  // 表格，图表切换
  const changeTable = (val, tempType) => {
    let tempVal = val == '3' ? '1' : (Number(val) + 1)
    if (tempType == '1') {
      setShowTableType1(tempVal)
      // console.log(tempVal, tempType)
      // setChartDept('', '', tempVal, '')
      setDetail(auditList, unit, tempVal)
    }
  }

  // 获取显隐配置
  const getVisHidConfig = () => {
      return new Promise((resolve, reject) => {
          dailySwitchAPI('6').then((res) => {
              if (res.code == 200) {
                  let data = JSON.parse(JSON.stringify(res.data || {}))
                  data.configParam = data?.configParam ? JSON.parse(data.configParam) : initPurchaseReport

                  // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                  // 初始化序号
                  initPurchaseReport.map((m, mI) => { m.sort = (mI+1) })
                  // console.log(JSON.parse(JSON.stringify(data.configParam)), initPurchaseReport)
                  // 获取 初始化数组中 新增的数据
                  let tempConfig = initPurchaseReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                  // 获取 初始化数组中 删除的数据
                  let needDelConfig = data.configParam.filter((f) => !initPurchaseReport.map((m) => m.id).includes(f.id))
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

  // 获取物料明细数据
  const getDetailStatistics = (query) => {
    return new Promise((resolve, reject) => {
      let params = {
        createTimeEnd: query?.end || endTime,
        createTimeStart: query?.start || startTime,
      }
      if (params?.createTimeEnd) {
        params.createTimeEnd = dayjs(params?.createTimeEnd).add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (params?.createTimeStart) {
        params.createTimeStart = params?.createTimeStart + ' 00:00:00'
      }
      Taro.showLoading({ mask: true })
      getDetailStatisticsAPI(params).then((res) => {
        if (res.code == 200) {
          res.data.balanceArea = (res.data?.balanceArea || '') + ''
          setHead(res.data.totalPrice || 0)
          setUnit(res.data.unitEnum || '元')
          let units = res.data.unitEnum || '元'
          setDetail(res.data.statisticsVoList || [], units, showTableType1)
          setAuditList(res.data.statisticsVoList || [])

          // 处理表格数据
          let list = [];
          list.push({title: '物料类别', field: 'materialCategoryName'});
          list.push({title: '金额(' + units + ')', field: 'price'});
          setTabList(list);
          Taro.hideLoading()
          resolve(true)
        } else reject(false)
      }).catch((err) => reject(err))


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
    getDetailStatistics(tempDate)
  }

  // 物料明细报表
  const setDetail = ( list = [], units = '', chartType) => {
    let chart = chartType+'' ? chartType : showTableType1
    // 数据为空则不展示报表
    if(list.length == 0) {
      setChartOptions(undefined)
      return
    }
    let data = []
    data.push({
      name: units,
      data: list?.length ? list.map((m) => m.price) : [],
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
        top: '10%',
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
        data: list?.length ? list.map((m) => m.materialCategoryName) : [],
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
        name : units,
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
    }
    setChartOptions(option)
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
        <NavBar large={true} color={'#333'} title={'采购报表'} transparent={false} leftIconType={'chevron-left'}></NavBar>
        <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>
        {
        reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
            return (
            <>
            {(row?.id == 1) && row?.show ? <><View className='report-purchase-top-card'>
              {/* <DateChoose end={endTime} start={startTime} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateChoose> */}
              <View className='top-card-list flex flex-start'>
                <View className='top-card-item'>
                  <View className='top-card-label flex flex-start'>
                    物料采购金额({unit})
                    <View style={`margin: 0 0 0 10rpx;opacity: 1;`}><GTooltip msg={`在下单时间内，已经“审核通过”且“已确认”的采购单中相关物料金额之和（相关物料：板材、槽刀、菲林、干膜、钻咀、销钉、锣刀、物耗品、设备配件、铝片、油墨）`} icon={<View className='primary-question-white'></View>}></GTooltip></View>
                  </View>
                  <GSplitNumber number={head || '0'} classStr='top-card-value flex flex-start'></GSplitNumber>
                  {/* <View className='top-card-value flex flex-start font-number'>
                    {head.toString().includes('.') ? <>
                      <View className='top-card-value-large'>{head.toString().split('.')[0]}</View>
                      .{head.toString().split('.')[1]}
                    </> : <View className='top-card-value-large'>{head || 0}</View>}
                  </View> */}
                </View>
              </View>
            </View></> : <></>}
            {(row?.id == 2) && row?.show ? <><View className='report-box'>
              <View className='report-box-header flex flex-betweent'>
                <View className='report-box-title flex flex-start'>
                  采购物料明细统计
                </View>
                <View className={`flex-none m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
              </View>
              {// 1，2为图表，1为柱状图，2为线型图，3为表格
              ['1','2'].includes(showTableType1+'') ?
                <>
                  <View style={{ width: '100%', height: '400px' }}>
                    {/* <View className='daily-title margin-top'>{item.title}</View> */}
                    {chartOptions ? <Echarts
                      isPage={false}
                      ref={echartsRef}
                      echarts={echartsJs}
                      option={chartOptions}
                      // style自定义设置echarts宽高
                      style={{ width: '100%', height: '400px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                </> :
                <View style={'max-height: 390px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={auditList} titleList={tabList}
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
          <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=6')}>报表配置</View>
      </GFixedIcon>
      <GFeedback></GFeedback>
    </>
  )
}
