import './index.less'
import dayjs from 'dayjs'
import { AtIcon } from 'taro-ui'
import Echarts from 'taro-react-echarts'
import NavBar from '../../../components/nav-bar'
import GTable from '../../../components/g-table'
import DateDrawer from '../components/dateDrawer'
import GSelect from '../../../components/g-select'
import echartsJs from '../../../pages/util/echarts'
import { useRef, useState, useEffect } from 'react'
import GConfirm from "../../../components/g-confirm"
import GLoading from '../../../components/g-loading'
import GFeedback from '../../../components/g-feedback'
import { View, Canvas, Picker } from '@tarojs/components'
import GFixedIcon from '../../../components/g-fixed-icon'
import GSplitNumber from '../../../components/g-split-number'
import { initCapacityReport } from '../../../pages/util/reportInit'
import { dailySwitchAPI } from '../../../pages/services/dailyReport/index'
import Taro, { useLoad,useShareAppMessage, useDidShow } from '@tarojs/taro'
import { capacityCountAPI, capacityCountByDeptAPI, capacityCountByPersonalAPI, capacityCountByCraftAPI, capacityReportByDeptAPI } from '../../../pages/services/reportForms/index'

export default function CapacityReport() {
  const isProcessList = [
    { field: '1', title: '已审核' },
    { field: '2', title: '未审核' },
  ]
  const dateTypeList = [
    { field: '1', title: '按天' },
    { field: '3', title: '按月' },
  ]
  const dataTypeList = [
    { field: 'area', title: '面积' },
    { field: 'amount', title: '款数' },
  ]
  const GSelectRef = useRef()
  const echartsRef = useRef()
  const echartsRef1 = useRef()
  const echartsRef2 = useRef()
  const GConfirmRef = useRef()
  const [disPage, setDisPage] = useState('')
  const [deptList, setDeptList] = useState([])
  const [reviewInfo, setReviewInfo] = useState()
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [loading6, setLoading6] = useState(false)
  const [loading7, setLoading7] = useState(false)
  const [loading8, setLoading8] = useState(false)
  const [noReviewInfo, setNoReviewInfo] = useState()
  const [reportConfig, setReportConfig] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [deptTotalList, setDeptTotalList] = useState([])
  const [userTotalList, setUserTotalList] = useState([])
  const [workTotalList, setWorkTotalList] = useState([])
  const [deptChartList, setDeptChartList] = useState([])
  const [userChartList, setUserChartList] = useState([])
  const [workChartList, setWorkChartList] = useState([])
  const [chartUserOptions, setChartUserOptions] = useState()
  const [chartWorkOptions, setChartWorkOptions] = useState()

  const [deptQuery, setDeptQuery] = useState({
    ids: [],
    deptId: undefined,
    process: isProcessList[0],
    dateType: dateTypeList[0],
    dataType: dataTypeList[0],
  })
  const [userQuery, setUserQuery] = useState({
    ids: [],
    deptId: undefined,
    deptInfo: undefined,
    process: isProcessList[0],
    dateType: dateTypeList[0],
    dataType: dataTypeList[0],
  })
  const [workQuery, setWorkQuery] = useState({
    ids: [],
    deptId: undefined,
    deptInfo: undefined,
    process: isProcessList[0],
    dateType: dateTypeList[0],
    dataType: dataTypeList[0],
  })

  const [showTableType1, setShowTableType1] = useState('1') // 1柱状图 2线型图 3表格
  const [showTableType2, setShowTableType2] = useState('1') // 1柱状图 2线型图 3表格
  const [showTableType3, setShowTableType3] = useState('1') // 1柱状图 2线型图 3表格
  
  const initEnd = dayjs(new Date()).format('YYYY-MM-DD')
  const initStart = dayjs(new Date()).startOf('month').format('YYYY-MM-DD')
  const [endTime, setEndTime] = useState(initEnd)
  const [startTime, setStartTime] = useState(initStart)
  useShareAppMessage(() => {
    return {
      title: '产能上报统计',
      path: '/pages/index/index'
    }
  })
  useLoad((options) => {
    console.log('options:', options)
  })
  useDidShow(() => {
    // Taro.showLoading({ mask: true })
    Promise.all([getVisHidConfig(), capacityCountReview(), capacityCount(), capacityCountByDept()]).then(() => {
      // Taro.hideLoading()
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
    if (chartUserOptions) {
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
    if (chartWorkOptions) {
        setTimeout(() => {
            if (echartsRef2.current?.chartRef?.current) {
                let crtIndex = echartsRef2.current?.chartRef?.current.getOption()?.series?.length ? echartsRef2.current?.chartRef?.current.getOption()?.series[0]?.data.length : 0
                echartsRef2.current?.chartRef?.current.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: crtIndex - 1,
                })
            }
        }, 800)
    }
  }, [echartsRef, chartOptions, echartsRef1, chartUserOptions, echartsRef2, chartWorkOptions])
  // 获取显隐配置
  const getVisHidConfig = () => {
      return new Promise((resolve, reject) => {
          dailySwitchAPI('9').then((res) => {
              if (res.code == 200) {
                  let data = JSON.parse(JSON.stringify(res.data || {}))
                  data.configParam = data?.configParam ? JSON.parse(data.configParam) : initCapacityReport
                  
                  // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                  // 初始化序号
                  initCapacityReport.map((m, mI) => { m.sort = (mI+1) })
                  // console.log(JSON.parse(JSON.stringify(data.configParam)), initCapacityReport)
                  // 获取 初始化数组中 新增的数据
                  let tempConfig = initCapacityReport.filter((f) => !data.configParam.map((m) => m.id).includes(f.id))
                  // 获取 初始化数组中 删除的数据
                  let needDelConfig = data.configParam.filter((f) => !initCapacityReport.map((m) => m.id).includes(f.id))
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

  // 已审核
  const capacityCountReview = (query, flag = false) => {
    return new Promise((resolve, reject) => {
      let params = {
        isReviewed: true,
        endTime: (query?.end || endTime),
        startTime: (query?.start || startTime),
      }
      setLoading1(true)
      flag && Taro.showLoading({ mask: true })
      capacityCountAPI(params).then((res) => {
        if (res.code == 200) {
          setReviewInfo(res.data)
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => reject(err)).finally(() => setLoading1(false))
    })
  }
  // 未审核
  const capacityCount = (query, flag = false) => {
    return new Promise((resolve, reject) => {
      let params = {
        isReviewed: false,
        endTime: (query?.end || endTime),
        startTime: (query?.start || startTime),
      }
      setLoading2(true)
      flag && Taro.showLoading({ mask: true })
      capacityCountAPI(params).then((res) => {
        if (res.code == 200) {
          setNoReviewInfo(res.data)
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => reject(err)).finally(() => setLoading2(false))
    })
  }

  // 部门上报统计
  const capacityCountByDept = (query, flag = false, first = true) => {
    return new Promise((resolve, reject) => {
      let params = {
        endTime: (query?.end || endTime),
        startTime: (query?.start || startTime),
        isReviewed: (query?.isReviewed || deptQuery?.process?.field) == '1', // 1已审核 2未审核
      }
      setLoading3(true)
      setLoading4(true)
      if (first) {
        // 如果是第一次搜素，需要下方的表格所有的loading都开启
        setLoading5(true)
        setLoading6(true)
        setLoading7(true)
        setLoading8(true)
      }
      flag && Taro.showLoading({ mask: true })
      capacityCountByDeptAPI(params).then(async (res) => {
        // 如果没报错，需要立即关闭loading，否则下面的表格loading已关闭，当前loading还开启
        setLoading3(false)
        if (res.code == 200) {
          let dataList = res?.data?.productionCapacityVoList?.length ? res?.data?.productionCapacityVoList : []
          let tempList = [...(dataList?.length ? dataList : []), { name: '合计', area: res?.data?.totalArea, amount: res?.data?.totalCommoditySum }]
          setDeptTotalList(tempList)
          // console.log('-------------',params, isProcessList, isProcessList.find((f) => f.field == params?.isReviewed) || deptQuery?.process)
          let tempIds = dataList?.length ? [dataList[0]] : []
          let resTempIds = !first && deptQuery?.ids?.length ? deptQuery?.ids : tempIds
          console.log('0----0', tempIds, resTempIds, deptQuery)
          updateData([
            {value: resTempIds, field: 'ids'}, // 已有对比部门时，不再清空
            {value: dataList?.length ? dataList[0]?.id : undefined, field: 'deptId'},
            {value: isProcessList.find((f) => f.field == (params?.isReviewed ? '1' : '2')) || deptQuery?.process, field: 'process'},
          ], 'deptQuery')

          let deptId = dataList[0]?.id
          await capacityReportByDept({ids: resTempIds, end: query?.end, start: query?.start, findType: '1',deptId, isReviewed: query?.isReviewed || userQuery?.process?.field})
          if (first) {
            // 调用个人和工序数据
            updateData([
              {value: dataList?.length ? dataList[0] : undefined, field: 'deptInfo'},
              {value: dataList?.length ? dataList[0]?.id : undefined, field: 'deptId'},
              {value: isProcessList.find((f) => f.field == (params?.isReviewed ? '1' : '2')) || userQuery?.process, field: 'process'},
            ], 'userQuery')
            updateData([
              {value: dataList?.length ? dataList[0] : undefined, field: 'deptInfo'},
              {value: dataList?.length ? dataList[0]?.id : undefined, field: 'deptId'},
              {value: isProcessList.find((f) => f.field == (params?.isReviewed ? '1' : '2')) || workQuery?.process, field: 'process'},
            ], 'workQuery')
            setDeptList(dataList)
            await Promise.all([
              capacityCountByUser({end: query?.end, start: query?.start, findType: '2',deptId,deptInfo: dataList?.length ? dataList[0] : ''}),
              capacityCountByWork({end: query?.end, start: query?.start, findType: '3',deptId,deptInfo: dataList?.length ? dataList[0] : ''})
            ])
          }

          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => {
        setLoading4(false)
        if (first) {
          // 如果是第一次搜素，需要下方的表格所有的loading都关闭
          setLoading5(false)
          setLoading6(false)
          setLoading7(false)
          setLoading8(false)
        }
        reject(err)
      }).finally(() => setLoading3(false))
    })
  }
  // 个人上报统计
  const capacityCountByUser = (query, flag = false) => {
    console.log('capacityCountByUser', query)
    return new Promise((resolve, reject) => {
      let params = {
        endTime: (query?.end || endTime),
        startTime: (query?.start || startTime),
        deptId: query?.deptId || userQuery?.deptId,
        isReviewed: (query?.isReviewed || userQuery?.process?.field) == '1', // 1已审核 2未审核
      }
      setLoading5(true)
      setLoading6(true)
      flag && Taro.showLoading({ mask: true })
      capacityCountByPersonalAPI(params).then(async (res) => {
        if (res.code == 200) {
          let dataList = res?.data?.productionCapacityVoList?.length ? res?.data?.productionCapacityVoList : []
          let tempList = [...(dataList?.length ? dataList : []), { name: '合计', area: res?.data?.totalArea, amount: res?.data?.totalCommoditySum }]
          setUserTotalList(tempList)
          let tempIds = query?.ids ? query?.ids : userQuery?.ids ? userQuery?.ids : []
          if (!tempIds?.length && dataList?.length) {
            tempIds = [dataList[0]]
          }
          updateData([
            {value: tempIds, field: 'ids'},
            {value: params?.deptId || userQuery?.deptId, field: 'deptId'},
            {value: query?.type || userQuery?.dateType, field: 'dateType'},
            {value: query?.deptInfo || userQuery?.deptInfo, field: 'deptInfo'},
            {value: query?.dataType || userQuery?.dataType, field: 'dataType'},
            {value: isProcessList.find((f) => f.field == (params?.isReviewed ? '1' : '2')) || userQuery?.process, field: 'process'},
          ], 'userQuery')

          await capacityReportByDept({
            ids: tempIds,
            findType: '2',
            end: query?.end,
            start: query?.start,
            deptId: params?.deptId,
            dataType: query?.dataType || userQuery?.dataType,
            type: query?.type?.field || userQuery?.dateType?.field,
            isReviewed: query?.isReviewed || userQuery?.process?.field,
          })
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => {
        setLoading6(false)
        reject(err)
      }).finally(() => setLoading5(false))
    })
  }
  // 工序上报统计
  const capacityCountByWork = (query, flag = false) => {
    console.log('capacityCountByWork', query)
    return new Promise((resolve, reject) => {
      let params = {
        endTime: (query?.end || endTime),
        startTime: (query?.start || startTime),
        deptId: query?.deptId || workQuery?.deptId,
        isReviewed: (query?.isReviewed || workQuery?.process?.field) == '1', // 1已审核 2未审核
      }
      setLoading7(true)
      setLoading8(true)
      flag && Taro.showLoading({ mask: true })
      capacityCountByCraftAPI(params).then(async (res) => {
        if (res.code == 200) {
          let dataList = res?.data?.productionCapacityVoList?.length ? res?.data?.productionCapacityVoList : []
          let tempList = [...(dataList?.length ? dataList : []), { name: '合计', area: res?.data?.totalArea, amount: res?.data?.totalCommoditySum }]
          setWorkTotalList(tempList)
          let tempIds = query?.ids ? query?.ids : workQuery?.ids ? workQuery?.ids : []
          if (!tempIds?.length && dataList?.length) {
            tempIds = [dataList[0]]
          }
          updateData([
            {value: tempIds, field: 'ids'},
            {value: params?.deptId || workQuery?.deptId, field: 'deptId'},
            {value: query?.type || workQuery?.dateType, field: 'dateType'},
            {value: query?.deptInfo || workQuery?.deptInfo, field: 'deptInfo'},
            {value: query?.dataType || workQuery?.dataType, field: 'dataType'},
            {value: isProcessList.find((f) => f.field == (params?.isReviewed ? '1' : '2')) || workQuery?.process, field: 'process'},
          ], 'workQuery')

          await capacityReportByDept({
            ids: tempIds,
            findType: '3',
            end: query?.end,
            start: query?.start,
            deptId: params?.deptId,
            dataType: query?.dataType || workQuery?.dataType,
            type: query?.type?.field || workQuery?.dateType?.field,
            isReviewed: query?.isReviewed || workQuery?.process?.field,
          })
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => {
        setLoading8(false)
        reject(err)
      }).finally(() => setLoading7(false))
    })
  }

  // 图表统计接口
  const capacityReportByDept = (query, flag = false) => {
    return new Promise((resolve, reject) => {
      let tempInfo = query?.findType == '1' ? deptQuery : query?.findType == '2' ? userQuery : workQuery
      let params = {
        findType: query?.findType || '1',
        deptId: query?.deptId || tempInfo?.deptId,
        endTime: (query?.end || endTime),
        type: query?.type || tempInfo?.dateType?.field,
        startTime: (query?.start || startTime),
        ids: (query?.ids || tempInfo?.ids || []).map((m) => m?.id),
        isReviewed: (query?.isReviewed || tempInfo?.process?.field) == '1', // 1已审核 2未审核
      }
      if (params?.findType == '1') {
        // 部门
        setLoading4(true)
      } else if (params?.findType == '2') {
        // 个人
        setLoading6(true)
      } else if (params?.findType == '3') {
        // 工序
        setLoading8(true)
      } 
      flag && Taro.showLoading({ mask: true })
      capacityReportByDeptAPI(params).then((res) => {
        if (res.code == 200) {
          // console.log(query?.ids || tempInfo?.ids)
          if (params?.findType == '1') {
            setDeptChartList(res.data || [])
            // tempArr = [], opt = '', chartType = '', depts = []
            setChartDept(res.data || [], query?.dataType || '', '', query?.ids || tempInfo?.ids)
          } else if (params?.findType == '2') {
            setUserChartList(res.data || [])
            setChartUser(res.data || [], query?.dataType || '', '', query?.ids || tempInfo?.ids)
          } else if (params?.findType == '3') {
            setWorkChartList(res.data || [])
            setChartWork(res.data || [], query?.dataType || '', '', query?.ids || tempInfo?.ids)
          }
          flag && Taro.hideLoading()
          resolve(true)
        } else reject(res)
      }).catch((err) => reject(err)).finally(() => {
        if (params?.findType == '1') {
          // 部门
          setLoading4(false)
        } else if (params?.findType == '2') {
          // 个人
          setLoading6(false)
        } else if (params?.findType == '3') {
          // 工序
          setLoading8(false)
        } 
      })
    })
  }

  // 点击表格，切换图表数据
  const changeChartByTable = (item, tempType) => {
    // if (tempType == '1') {
      if (!item?.id) return;
      // 部门
      const tempInfo = updateData([
        { value: [item], field: 'ids' },
        // { value: isProcessList[0], field: 'process' },
        { value: dateTypeList[0], field: 'dateType' },
        { value: dataTypeList[0], field: 'dataType' },
        { value: tempType == '1' ? item?.id : tempType == '2' ? userQuery?.deptId : workQuery?.deptId, field: 'deptId' },
      ], `${tempType == '1' ? 'dept' : tempType == '2' ? 'user' : 'work'}Query`)
      tempInfo.findType = tempType
      let params = {
        findType: tempType,
        ids: tempInfo?.ids,
        deptId: tempInfo?.deptId,
        dataType: tempInfo?.dataType,
        type: tempInfo?.dateType?.field,
      }
      console.log('params', params, tempInfo, dataTypeList)
      capacityReportByDept(params, true)
    // }
  }

  // 更新数据
  const updateData = (arr, tempType = 'deptQuery') => {
    if (!arr?.length) return false;
    if (tempType == 'deptQuery') {
      let tempInfo = JSON.parse(JSON.stringify(deptQuery))
      arr.map((item, index) => {
          tempInfo[item.field] = item.value
      })
      setDeptQuery(tempInfo)
      return tempInfo
    } else if (tempType == 'userQuery') {
      let tempInfo = JSON.parse(JSON.stringify(userQuery))
      arr.map((item, index) => {
          tempInfo[item.field] = item.value
      })
      setUserQuery(tempInfo)
      return tempInfo
    } else if (tempType == 'workQuery') {
      let tempInfo = JSON.parse(JSON.stringify(workQuery))
      arr.map((item, index) => {
          tempInfo[item.field] = item.value
      })
      setWorkQuery(tempInfo)
      return tempInfo
    }
  }
  
  // 部门上报统计
  const setChartDept = (tempArr = [], opt = '', chartType = '', depts = []) => {
      let item = opt || deptQuery?.dataType
      let chart = chartType || showTableType1
      let list = tempArr?.length ? tempArr : deptChartList
      let tempDepts = depts?.length ? depts : deptQuery?.ids
      console.log(item)
      // 数据为空则不展示报表
      if(list?.length == 0) {
        setChartOptions(undefined)
        return
      }
      // let itemType = optType || optionType
      // console.log('item:', item, optChart, chartType)
      let data = []
      let color = ['#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00','#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00']
      let fieldStr = item?.field
      // console.log(m, mI)
      tempDepts.map((tm, tmI) => {
        if (tm?.id) {
          data.push({
              name: tm.name,
              data: list.map((m) => {
                let tempM = m?.totalProductionCapacityVo?.productionCapacityVoList.find((pf) => pf?.id == tm?.id)
                let crt = tempM ? (tempM[fieldStr] || 0) : 0
                return crt
              }),
              type: chart == '1' ? 'bar' : 'line',
              itemStyle: {
                  color: color[tmI]
              }
          })
        }
      })
      const option = {
          // legend: {
          //     top: 0,
          //     // left: 0,
          //     itemWidth: 18,
          //     itemHeight: 10,
          //     textStyle: {
          //         fontSize: 10,
          //     },
          //     data: tempDepts.map((m) => m.name),
          // },
          grid: {
              show: false,
              top: '10%',
              left: '20%',
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
              data: list?.length ? list.map((m) => m.monthPointDay) : [],
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
          },
          yAxis: {
              nameTextStyle: {
                  lineHeight: 0,
                  align: 'left'
              },
              name: item?.field == 'area' ? '面积(㎡)' : '款数',
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
      // console.log(option)
      setChartOptions(option)
  }
  
  // 个人上报统计
  const setChartUser = (tempArr = [], opt = '', chartType = '', depts = []) => {
      let item = opt || userQuery?.dataType
      let chart = chartType || showTableType2
      let list = tempArr?.length ? tempArr : userChartList
      let tempDepts = depts?.length ? depts : userQuery?.ids
      // console.log(list, tempArr, userChartList, tempDepts)
      // 数据为空则不展示报表
      if(list?.length == 0) {
        setChartUserOptions(undefined)
        return
      }
      // let itemType = optType || optionType
      // console.log('item:', item, optChart, chartType)
      let data = []
      let color = ['#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00','#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00']
      let fieldStr = item?.field
      // console.log(opt, item, fieldStr)
      tempDepts.map((tm, tmI) => {
        if (tm?.id) {
          data.push({
              name: tm.name,
              data: list.map((m) => {
                let tempM = m?.totalProductionCapacityVo?.productionCapacityVoList.find((pf) => pf?.id == tm?.id)
                let crt = tempM ? (tempM[fieldStr] || 0) : 0
                return crt
              }),
              type: chart == '1' ? 'bar' : 'line',
              itemStyle: {
                  color: color[tmI]
              }
          })
        }
      })
      const option = {
          // legend: {
          //     top: 0,
          //     // left: 0,
          //     itemWidth: 18,
          //     itemHeight: 10,
          //     textStyle: {
          //         fontSize: 10,
          //     },
          //     data: tempDepts.map((m) => m.name),
          // },
          grid: {
              show: false,
              top: '10%',
              left: '20%',
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
              data: list?.length ? list.map((m) => m.monthPointDay) : [],
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
          },
          yAxis: {
              nameTextStyle: {
                  lineHeight: 0,
                  align: 'left'
              },
              name: item?.field == 'area' ? '面积(㎡)' : '款数',
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
      // console.log(option)
      setChartUserOptions(option)
  }
  
  // 个人上报统计
  const setChartWork = (tempArr = [], opt = '', chartType = '', depts = []) => {
      let item = opt || workQuery?.dataType
      let chart = chartType || showTableType3
      let list = tempArr?.length ? tempArr : workChartList
      let tempDepts = depts?.length ? depts : workQuery?.ids
      // console.log(1121)
      // 数据为空则不展示报表
      if(list?.length == 0) {
        setChartWorkOptions(undefined)
        return
      }
      // let itemType = optType || optionType
      // console.log('item:', item, optChart, chartType)
      let data = []
      let color = ['#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00','#1890FF','#00BAAD','#FF9800','#F8431A','#A1E53A','#2784C2','#F7BF50','#EB93FA','#249571','#FF9090','#3CE6E0','#4B3AAA','#F1DD29','#6CA3F6','#EA8B47','#BF2EA7','#71D42E','#C76836','#FFD89D','#75B26B','#7DCBFF','#A35CD9','#C52B00']
      let fieldStr = item?.field
      // console.log(m, mI)
      tempDepts.map((tm, tmI) => {
        if (tm?.id) {
          data.push({
              name: tm.name,
              data: list.map((m) => {
                let tempM = m?.totalProductionCapacityVo?.productionCapacityVoList.find((pf) => pf?.id == tm?.id)
                let crt = tempM ? (tempM[fieldStr] || 0) : 0
                return crt
              }),
              type: chart == '1' ? 'bar' : 'line',
              itemStyle: {
                  color: color[tmI]
              }
          })
        }
      })
      const option = {
          // legend: {
          //     top: 0,
          //     // left: 0,
          //     itemWidth: 18,
          //     itemHeight: 10,
          //     textStyle: {
          //         fontSize: 10,
          //     },
          //     data: tempDepts.map((m) => m.name),
          // },
          grid: {
              show: false,
              top: '10%',
              left: '20%',
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
              data: list?.length ? list.map((m) => m.monthPointDay) : [],
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
          },
          yAxis: {
              nameTextStyle: {
                  lineHeight: 0,
                  align: 'left'
              },
              name: item?.field == 'area' ? '面积(㎡)' : '款数',
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
      // console.log(option)
      setChartWorkOptions(option)
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
    // getDetailStatistics(tempDate)
    // Taro.showLoading({ mask: true })
    Promise.all([capacityCountReview(tempDate), capacityCount(tempDate), capacityCountByDept(tempDate, false, false)],capacityCountByUser(tempDate),capacityCountByWork(tempDate)).finally(() => {
      // setTimeout(() => Taro.hideLoading(), 500)
    })
  }

  // 表格，图表切换
  const changeTable = (val, tempType) => {
    let tempVal = val == '3' ? '1' : (Number(val) + 1)
    if (tempType == '1') {
      setShowTableType1(tempVal)
      // console.log(tempVal, tempType)
      setChartDept('', '', tempVal, '')
    } else if (tempType == '2') {
      setShowTableType2(tempVal)
      setChartUser('', '', tempVal, '')
    } else if (tempType == '3') {
      setShowTableType3(tempVal)
      setChartWork('', '', tempVal, '')
    }
  }

  // 切换 搜索条件
  const changeOption = (e, tempType, queryType) => {
    // queryType dept部门 user个人 work工序
    // 部门上报统计
    let tempList = tempType == 'process' ? isProcessList : tempType == 'dateType' ? dateTypeList : tempType == 'deptInfo' ? deptList : dataTypeList
    let tempChangeQueryList = [{value: tempList[Number(e?.detail?.value)], field: tempType}]
    if (['deptInfo'].includes(tempType)) {
      tempChangeQueryList.push({value: dataTypeList[0], field: 'dataType'})
    }
    const tempInfo = updateData(tempChangeQueryList, `${queryType}Query`)
    // console.log('tempInfo--------------', tempInfo, tempType, queryType)
    if (tempType == 'dataType') {
      console.log('queryType--------------', tempInfo, tempType, queryType)
      // queryType == 'dept' ? '1' : queryType == 'user' ? '2' : '3'
      if (queryType == 'dept') {
        setChartDept('', tempInfo?.dataType, '', '')
      } else if (queryType == 'user') {
        setChartUser('', tempInfo?.dataType, '', '')
      } else if (queryType == 'work') {
        setChartWork('', tempInfo?.dataType, '', '')
      }
    } else if (['dateType','deptInfo'].includes(tempType)) {
      let params = {
        deptInfo: tempInfo?.deptInfo,
        deptId: tempInfo?.deptInfo?.id,
        type: tempInfo?.dateType?.field,
        isReviewed: tempInfo?.process?.field,
        findType: queryType == 'dept' ? '1' : queryType == 'user' ? '2' : '3',
      }
      if (['deptInfo'].includes(tempType)) {
        // 选择部门时，需要格式化搜索条件
        params = {
          ids: [],
          dataType: dataTypeList[0],
          type: dataTypeList[0]?.field,
          deptInfo: tempInfo?.deptInfo,
          deptId: tempInfo?.deptInfo?.id,
          isReviewed: isProcessList[0]?.field,
          findType: queryType == 'dept' ? '1' : queryType == 'user' ? '2' : '3',
        }
      }
      // console.log('reset', params)
      if (queryType == 'dept') {
        capacityReportByDept(params, true)
      } else if (queryType == 'user') {
        params.type = tempInfo?.dateType
        if (['deptInfo'].includes(tempType)) {
          params.type = dateTypeList[0]
        }
        capacityCountByUser(params, true)
      } else if (queryType == 'work') {
        params.type = tempInfo?.dateType
        if (['deptInfo'].includes(tempType)) {
          params.type = dateTypeList[0]
        }
        capacityCountByWork(params, true)
      }
    } else if (['process'].includes(tempType)) {
      let params = {
        isReviewed: tempInfo?.process?.field,
        findType: queryType == 'dept' ? '1' : queryType == 'user' ? '2' : '3',
      }
      // console.log('params', params)
      // capacityReportByDept(params, true)
      if (queryType == 'dept') {
        capacityCountByDept(params, false, false)
      } else if (queryType == 'user') {
        capacityCountByUser(params)
      } else if (queryType == 'work') {
        capacityCountByWork(params)
      }
    }
  }

  // 添加对比
  const addDiff = (queryType) => {
    let tempQuery = queryType == '1' ? deptQuery : queryType == '2' ? userQuery : workQuery
    let tempList = queryType == '1' ? deptList : queryType == '2' ? userTotalList : workTotalList
    tempList = tempList.filter((f) => f.id)
    GSelectRef.current.openSelect(tempList, {
      selects: tempQuery?.ids.map((m) => m.id),
      custom: {
        value: 'id',
        label: 'name',
      },
      title: queryType == '1' ? '选择部门' : queryType == '2' ? '选择员工' : '选择工序'
    }).then((res) => {
      // console.log('res', res)
      if (res?.confirm) {
        // 部门
        const tempInfo = updateData([{value: res?.data, field: 'ids'}], `${queryType == '1' ? 'dept' : queryType == '2' ? 'user' : 'work'}Query`)
        // console.log('tempInfo--------------', tempInfo)
        let params = {
          ids: tempInfo?.ids,
          findType: queryType,
        }
        // console.log('params', params)
        capacityReportByDept(params, true)
      }
    })
  }

  // 弹框提示
  const openTooltip = (content) => {
    GConfirmRef.current.openConfirm({
      content,
      title: '提示',
      type: 'tooltip',
      showCancelBtn: false,
      confirmText: '我知道了',
    })
  }

  // 页面跳转
  const toPath = (url) => {
      Taro.navigateTo({url})
  }
  return (
    <>
      <View className={`capacity-page ${disPage}`}>
        <NavBar large={true} color={'#333'} title={'产能上报统计'} transparent={false} leftIconType={'chevron-left'}></NavBar>
        <DateDrawer end={initEnd} start={initStart} confirm={confirmHandle} disPage={(value) => setDisPage(value)}></DateDrawer>
        {
        reportConfig?.configParam?.length ? reportConfig?.configParam.map((row) => {
            return (
            <>
            {(row?.id == 1) && row?.show ? <><View className='daily-nav has-left'>
                <View className='daily-nav-left'>
                    <View className='daily-nav-title'>已审</View>
                </View>

                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>上报总面积</View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <GLoading color='rgb(24, 144, 255)' loading={loading1} classStr='flex flex-start' style="max-height: 64rpx;">
                      <GSplitNumber footStyle="margin-bottom: 2rpx;" classStr="small daily-nav-value flex flex-start" number={reviewInfo?.area || 0}></GSplitNumber>
                    </GLoading>
                </View>
                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>上报总款数
                            <View style={`margin: 0 0 5rpx 10rpx;`} onClick={() => openTooltip('上报总款数：指上报的不同编号的产品数量，相同的产品编号计算为同一款')}><AtIcon value='help' size={'14'} color={'#333'}></AtIcon></View>
                        </View>
                        <View className='daily-nav-top-item'>款</View>
                    </View>
                    <GLoading color='rgb(24, 144, 255)' loading={loading1} classStr='flex flex-start' style="max-height: 64rpx;">
                      <GSplitNumber footStyle="margin-bottom: 2rpx;" classStr="small daily-nav-value flex flex-start" number={reviewInfo?.commoditySum || 0}></GSplitNumber>
                    </GLoading>
                </View>
            </View></> : <></>}

            {(row?.id == 2) && row?.show ? <><View className='daily-nav has-left'>
                <View className='daily-nav-left'>
                    <View className='daily-nav-title'>未审<AtIcon className='expend-click' value='help' size={'14'} color={'#333'} onClick={() => openTooltip('未审核：指在筛选时间内提交的产能上报，但至今仍未审核的数据')}></AtIcon></View>
                </View>

                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>上报总面积</View>
                        <View className='daily-nav-top-item'>㎡</View>
                    </View>
                    <GLoading color='rgb(24, 144, 255)' loading={loading2} classStr='flex flex-start' style="max-height: 64rpx;">
                      <GSplitNumber footStyle="margin-bottom: 2rpx;" classStr="small daily-nav-value flex flex-start" number={noReviewInfo?.area || 0}></GSplitNumber>
                    </GLoading>
                </View>
                <View className='daily-nav-card'>
                    <View className='daily-nav-top'>
                        <View className='daily-nav-top-item flex flex-start'>上报总款数
                          <View style={`margin: 0 0 5rpx 10rpx;`} onClick={() => openTooltip('上报总款数：指上报的不同编号的产品数量，相同的产品编号计算为同一款')}><AtIcon value='help' size={'14'} color={'#333'}></AtIcon></View>
                        </View>
                        <View className='daily-nav-top-item'>款</View>
                    </View>
                    <GLoading color='rgb(24, 144, 255)' loading={loading2} classStr='flex flex-start' style="max-height: 64rpx;">
                      <GSplitNumber footStyle="margin-bottom: 2rpx;" classStr="small daily-nav-value flex flex-start" number={noReviewInfo?.commoditySum || 0}></GSplitNumber>
                    </GLoading>
                </View>
            </View></> : <></>}

            {(row?.id == 3) && row?.show ? <>
              <View className='common-card new'>
                <View className='common-item new'>
                  <View className='common-title mini flex flex-start'>
                    <View className='primary-inventory-detail'></View>
                    <View style={'margin-left: 8rpx;flex: 1;'}>部门上报统计</View>
                  </View>
                </View>

                <View className='flex flex-between m-t-10'>
                  <Picker mode='selector' rangeKey='title' range={isProcessList} onChange={(e) => changeOption(e, 'process', 'dept')}>
                    <View className='daily-card-switch-text flex flex-start primary-color'>
                      <View>{deptQuery?.process?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading3} style={`${loading3 ? 'height: 300px;' : ''}`}>
                <View style={'max-height: 300px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={deptTotalList} titleList={[
                      { title: '部门', field: 'name' },
                      { title: '面积(㎡)', field: 'area' },
                      { title: '款数', field: 'amount' },
                  ]}
                  tdSlot={(title, item, slotIndex) => {
                      let value = title.field.includes('.') ? (
                          item[title.field.split('.')[0]][title.field.split('.')[1]]
                      ) : item[title.field]
                      //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                      return (<View onClick={() => changeChartByTable(item, '1')}>{value || 0}</View>)
                  }}
                  ></GTable>
                </View>
                </GLoading>
                <View className='flex flex-between m-t-10 m-b-10'>
                  <View className='g-tag-list report-item'>
                    {
                      deptQuery?.ids.map((m) => {
                        return (<View className='g-tag'>{m?.name}</View>)
                      })
                    }
                  </View>
                  <View className={`m-l-10 expend-click ${showTableType1 == '1' ? 'primary-report-bar' : showTableType1 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType1, '1')}></View>
                </View>

                <View className='flex flex-start'>
                  <Picker mode='selector' rangeKey='title' range={dateTypeList} onChange={(e) => changeOption(e, 'dateType', 'dept')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{deptQuery?.dateType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                  <Picker mode='selector' rangeKey='title' range={dataTypeList} onChange={(e) => changeOption(e, 'dataType', 'dept')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{deptQuery?.dataType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>

                  <View className='flex-grow'></View>
                  <View>
                    <View className='daily-card-switch-text flex flex-end primary-color' onClick={() => addDiff('1')}>
                      <View className='primary-report-plus'></View>
                      <View>添加对比</View>
                    </View>
                  </View>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading4} style={`${loading4 ? 'height: 300px;' : ''}`}>
                {
                  // 1，2为图表，1为柱状图，2为线型图，3为表格
                  ['1','2'].includes(showTableType1+'') ? <>
                  <View style={{ width: '100%', height: '300px' }}>
                    {chartOptions ? <Echarts
                        isPage={false}
                        ref={echartsRef}
                        echarts={echartsJs}
                        option={chartOptions}
                        canvasId={`showTableType1`}
                        // style自定义设置echarts宽高
                        style={{ width: '100%', height: '300px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                  </> : <>
                  <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={JSON.parse(JSON.stringify(deptChartList)).reverse().slice(0, 50)} titleList={[
                      // 限制最多50条，太多会导致小程序卡顿
                      { title: '日期', field: 'monthPointDay' },
                      ...(deptQuery?.ids?.length ? deptQuery?.ids.map((m) => {
                        return {
                          title: m?.name,
                          field: m?.id
                        }
                      }) : [])
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let tempVo = item?.totalProductionCapacityVo?.productionCapacityVoList?.length ? item?.totalProductionCapacityVo?.productionCapacityVoList.find((f) => f.id == title.field) : ''
                        let value = slotIndex > 0 ? (
                          tempVo ? tempVo[deptQuery?.dataType?.field] : ''
                        ) : item[title.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>{value || 0}</View>
                        )
                    }}
                    ></GTable>
                  </View>
                  {deptChartList?.length > 50 ? <View className='max-data-length-100 m-t-10'>当前最多展示50条</View> : <></>}
                  </>
                }
                </GLoading>
              </View>
            </> : <></>}

            {(row?.id == 4) && row?.show ? <>
              <View className='common-card new'>
                <View className='common-item new'>
                  <View className='common-title mini flex flex-start'>
                    <View className='primary-inventory-detail'></View>
                    <View style={'margin-left: 8rpx;flex: 1;'}>个人上报统计</View>
                  </View>
                </View>

                <View className='flex flex-between m-t-10'>
                  <Picker mode='selector' rangeKey='title' range={isProcessList} onChange={(e) => changeOption(e, 'process', 'user')}>
                    <View className='daily-card-switch-text flex flex-start primary-color'>
                      <View>{userQuery?.process?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                  <Picker mode='selector' rangeKey='name' range={deptList} onChange={(e) => changeOption(e, 'deptInfo', 'user')}>
                    <View className='daily-card-switch-text flex flex-start primary-color'>
                      <View>{userQuery?.deptInfo?.name}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading5} style={`${loading5 ? 'height: 300px;' : ''}`}>
                <View style={'max-height: 300px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={userTotalList} titleList={[
                      { title: '姓名', field: 'name' },
                      { title: '面积(㎡)', field: 'area' },
                      { title: '款数', field: 'amount' },
                  ]}
                  tdSlot={(title, item, slotIndex) => {
                      let value = title.field.includes('.') ? (
                          item[title.field.split('.')[0]][title.field.split('.')[1]]
                      ) : item[title.field]
                      //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                      return (<View onClick={() => changeChartByTable(item, '2')}>{value || 0}</View>)
                  }}
                  ></GTable>
                </View>
                </GLoading>
                <View className='flex flex-between m-t-10 m-b-10'>
                  <View className='g-tag-list report-item'>
                    {
                      userQuery?.ids.map((m) => {
                        return (<View className='g-tag'>{m?.name}</View>)
                      })
                    }
                  </View>
                  <View className={`m-l-10 expend-click ${showTableType2 == '1' ? 'primary-report-bar' : showTableType2 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType2, '2')}></View>
                </View>

                <View className='flex flex-start'>
                  <Picker mode='selector' rangeKey='title' range={dateTypeList} onChange={(e) => changeOption(e, 'dateType', 'user')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{userQuery?.dateType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                  <Picker mode='selector' rangeKey='title' range={dataTypeList} onChange={(e) => changeOption(e, 'dataType', 'user')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{userQuery?.dataType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>

                  <View className='flex-grow'></View>
                  <View>
                    <View className='daily-card-switch-text flex flex-end primary-color' onClick={() => addDiff('2')}>
                      <View className='primary-report-plus'></View>
                      <View>添加对比</View>
                    </View>
                  </View>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading6} style={`${loading6 ? 'height: 300px;' : ''}`}>
                {
                  // 1，2为图表，1为柱状图，2为线型图，3为表格
                  ['1','2'].includes(showTableType2+'') ? <>
                  <View style={{ width: '100%', height: '300px' }}>
                    {chartUserOptions ? <Echarts
                        isPage={false}
                        ref={echartsRef1}
                        echarts={echartsJs}
                        option={chartUserOptions}
                        canvasId={`showTableType2`}
                        // style自定义设置echarts宽高
                        style={{ width: '100%', height: '300px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                  </> : <>
                  <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={JSON.parse(JSON.stringify(userChartList)).reverse().slice(0, 50)} titleList={[
                      // 限制最多50条，太多会导致小程序卡顿
                      { title: '日期', field: 'monthPointDay' },
                      ...(userQuery?.ids?.length ? userQuery?.ids.map((m) => {
                        return {
                          title: m?.name,
                          field: m?.id
                        }
                      }) : [])
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let tempVo = item?.totalProductionCapacityVo?.productionCapacityVoList?.length ? item?.totalProductionCapacityVo?.productionCapacityVoList.find((f) => f.id == title.field) : ''
                        let value = slotIndex > 0 ? (
                          tempVo ? tempVo[userQuery?.dataType?.field] : ''
                        ) : item[title.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>{value || 0}</View>
                        )
                    }}
                    ></GTable>
                  </View>
                  {userChartList?.length > 50 ? <View className='max-data-length-100 m-t-10'>当前最多展示50条</View> : <></>}
                  </>
                }
                </GLoading>
              </View>
            </> : <></>}

            {(row?.id == 5) && row?.show ? <>
              <View className='common-card new'>
                <View className='common-item new'>
                  <View className='common-title mini flex flex-start'>
                    <View className='primary-inventory-detail'></View>
                    <View style={'margin-left: 8rpx;flex: 1;'}>工序上报统计</View>
                  </View>
                </View>

                <View className='flex flex-between m-t-10'>
                  <Picker mode='selector' rangeKey='title' range={isProcessList} onChange={(e) => changeOption(e, 'process', 'work')}>
                    <View className='daily-card-switch-text flex flex-start primary-color'>
                      <View>{workQuery?.process?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                  <Picker mode='selector' rangeKey='name' range={deptList} onChange={(e) => changeOption(e, 'deptInfo', 'work')}>
                    <View className='daily-card-switch-text flex flex-start primary-color'>
                      <View>{workQuery?.deptInfo?.name}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading7} style={`${loading7 ? 'height: 300px;' : ''}`}>
                <View style={'max-height: 300px;overflow-y: auto;margin-top: 10px;'}>
                  <GTable list={workTotalList} titleList={[
                      { title: '工序', field: 'name' },
                      { title: '面积(㎡)', field: 'area' },
                      { title: '款数', field: 'amount' },
                  ]}
                  tdSlot={(title, item, slotIndex) => {
                      let value = title.field.includes('.') ? (
                          item[title.field.split('.')[0]][title.field.split('.')[1]]
                      ) : item[title.field]
                      //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                      return (<View onClick={() => changeChartByTable(item, '3')}>{value || 0}</View>)
                  }}
                  ></GTable>
                </View>
                </GLoading>
                <View className='flex flex-between m-t-10 m-b-10'>
                  <View className='g-tag-list report-item'>
                    {
                      workQuery?.ids.map((m) => {
                        return (<View className='g-tag'>{m?.name}</View>)
                      })
                    }
                  </View>
                  <View className={`m-l-10 expend-click ${showTableType3 == '1' ? 'primary-report-bar' : showTableType3 == '2' ? 'primary-report-line' : 'primary-report-table'}`} onClick={() => changeTable(showTableType3, '3')}></View>
                </View>

                <View className='flex flex-start'>
                  <Picker mode='selector' rangeKey='title' range={dateTypeList} onChange={(e) => changeOption(e, 'dateType', 'work')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{workQuery?.dateType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>
                  <Picker mode='selector' rangeKey='title' range={dataTypeList} onChange={(e) => changeOption(e, 'dataType', 'work')}>
                    <View className='daily-card-switch-text flex flex-end primary-color'>
                      <View>{workQuery?.dataType?.title}</View>
                      <View className='primary-bottom'></View>
                    </View>
                  </Picker>

                  <View className='flex-grow'></View>
                  <View>
                    <View className='daily-card-switch-text flex flex-end primary-color' onClick={() => addDiff('3')}>
                      <View className='primary-report-plus'></View>
                      <View>添加对比</View>
                    </View>
                  </View>
                </View>
                <GLoading color='rgb(24, 144, 255)' loading={loading8} style={`${loading8 ? 'height: 300px;' : ''}`}>
                {
                  // 1，2为图表，1为柱状图，2为线型图，3为表格
                  ['1','2'].includes(showTableType3+'') ? <>
                  <View style={{ width: '100%', height: '300px' }}>
                    {chartWorkOptions ? <Echarts
                        isPage={false}
                        ref={echartsRef2}
                        echarts={echartsJs}
                        option={chartWorkOptions}
                        canvasId={`showTableType3`}
                        // style自定义设置echarts宽高
                        style={{ width: '100%', height: '300px' }}
                    /> : <View className='g-empty-chart'>暂无数据</View>}
                  </View>
                  </> : <>
                  <View style={'max-height: 290px;overflow-y: auto;margin-top: 10px;'}>
                    <GTable list={JSON.parse(JSON.stringify(workChartList)).reverse().slice(0, 50)} titleList={[
                      // 限制最多50条，太多会导致小程序卡顿
                      { title: '日期', field: 'monthPointDay' },
                      ...(workQuery?.ids?.length ? workQuery?.ids.map((m) => {
                        return {
                          title: m?.name,
                          field: m?.id
                        }
                      }) : [])
                    ]}
                    tdSlot={(title, item, slotIndex) => {
                        let tempVo = item?.totalProductionCapacityVo?.productionCapacityVoList?.length ? item?.totalProductionCapacityVo?.productionCapacityVoList.find((f) => f.id == title.field) : ''
                        let value = slotIndex > 0 ? (
                          tempVo ? tempVo[workQuery?.dataType?.field] : ''
                        ) : item[title.field]
                        //  style={{fontWeight: slotIndex == 0 ? 400 : 700}}
                        return (
                            <View>{value || 0}</View>
                        )
                    }}
                    ></GTable>
                  </View>
                  {workChartList?.length > 50 ? <View className='max-data-length-100 m-t-10'>当前最多展示50条</View> : <></>}
                  </>
                }
                </GLoading>
              </View>
            </> : <></>}
            </>
            )
        }) : <></>
        }
      </View>
      <Canvas canvasId='capacityReport56' style={'display: none;'}></Canvas>
      <GSelect ref={GSelectRef}></GSelect>
      <GConfirm ref={GConfirmRef}></GConfirm>
      <GFixedIcon style={{bottom: '192rpx', left: '0px'}}>
          <View className='setting-box flex flex-center' onClick={() => toPath('/packageB/reportSort/index?type=9')}>报表配置</View>
      </GFixedIcon>
      <GFeedback></GFeedback>
    </>
  )
}
