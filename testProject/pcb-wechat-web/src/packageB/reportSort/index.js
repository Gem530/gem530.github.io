import './index.less'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { AtButton } from 'taro-ui'
import Echarts from 'taro-react-echarts'
import SortCard from './components/sort-card'
import SortTable from './components/sort-table'
import SortChart from './components/sort-chart'
import { rpxToPx } from '../../pages/util/func'
import echartsJs from '../../pages/util/echarts'
import GFeedback from '../../components/g-feedback'
import { useRef, useState, useEffect } from 'react'
import GSettingDialog from '../../components/g-setting-dialog'
// import { getSystemTimeAPI } from '../../pages/services/upload'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import { dailySwitchAPI, dailySwitchResetAPI, } from '../../pages/services/dailyReport'
import { View, Switch, Picker, AtIcon, Canvas, Image, Swiper, SwiperItem, ScrollView, MovableArea, MovableView } from '@tarojs/components'
import { initOperate, initEngineerDaily, initMarktDaily, initEngineerReport, initProdcutReport, initPurchaseReport, initOutSourceReport, initPedingReport, initCapacityReport } from '../../pages/util/reportInit'

export default function ReportSort() {
    const [drag, setDrag] = useState(false)
    // options.type 1:运营日报 2:工程日报 3:市场日报 4:工程报表 5:生产日报 6:采购报表 7:工序外协报表 8:待处理业务
    const [options, setOptions] = useState()
    const [loading, setLoading] = useState(false)
    const [startDrag, setStartDrag] = useState(true)
    
    const [configList, setConfigList] = useState([])
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
        h: 0,
        show: false,
        boxPadTop: 0,
        m: undefined,
    })
    const [visibleHiddenConfig, setVisibleHiddenConfig] = useState()
    const [els, setEls] = useState([])
    const [startIndex, setStartIndex] = useState(0)
    const [targetInfo, setRargetInfo] = useState({
        targetArea: '',
        targetAmount: '',
    })

    useLoad((option) => {
        setOptions(option)
        getVisHidConfig(option.type)
    })
    useEffect(() => {
        setStartDrag(false)
        setTimeout(() => {
            const dom = Taro.createSelectorQuery().selectAll('.sort-item').fields({ rect: true, scrollOffset: true, size: true, dataset: true }, (res) => {
                let initTop = Math.floor(rpxToPx(20)) + Math.floor(rpxToPx(50)) + Math.floor(rpxToPx(20)) // 页面的顶部padding-top+switch的height+margin-bottom
                // console.log('deepres', JSON.parse(JSON.stringify(res)), initTop)
                let scrollHeight = res?.length && (res[0].top != initTop) ? Math.abs(res[0].top) + initTop : 0
                res.map((m) => {
                    m.top = m.top + scrollHeight
                    m.bottom = m.bottom + scrollHeight
                })
                setEls(res)
                console.log(res, 'res')
                setStartDrag(true)
            }).exec()
        }, 50)
    }, [configList])
    // 长按开启排序
    const longPressHandle = (e, m, mI) => {
        e.stopPropagation()
        e.preventDefault()
        if (!startDrag) return;
        let domInfo = undefined
        // Taro.createSelectorQuery().select(`.item${mI}`).boundingClientRect().exec((res) => {
        //     domInfo = res
            // console.log(e, mI, e?.currentTarget, els[mI])
            // console.log(domInfo)
            setPosition({
                x: 0,
                m: m,
                show: true,
                // h: domInfo[0].height,
                y: els[mI].top - 10,
                boxPadTop: e?.changedTouches[0]?.pageY - els[mI].top,
                // boxPadTop: e?.changedTouches[0]?.pageY - e?.currentTarget?.offsetTop - 10,
            })
            // console.log(e, e?.currentTarget?.dataset, e?.currentTarget.offsetTop)
        // })
    }
    // 开始拖动
    const touchStart = (e, m, mI) => {
        e.stopPropagation()
        e.preventDefault()
        // if (!position.show) return;
        // console.log(e?.currentTarget?.dataset)
        if (!startDrag) return;
        setStartIndex(e?.currentTarget?.dataset.index)
        setPosition({
            x: 0,
            m: m,
            show: true,
            // h: domInfo[0].height,
            y: els[mI].top - 10,
            boxPadTop: e?.changedTouches[0]?.pageY - els[mI].top,
            // boxPadTop: e?.changedTouches[0]?.pageY - e?.currentTarget?.offsetTop - 10,
        })
    }
    // 拖动中
    const touchMove = (e, m) => {
        e.stopPropagation()
        e.preventDefault()
        if (!position.show) return;
        // console.log('touchMove1', e, m, position)
        setPosition({
            x: 0,
            m: m,
            show: true,
            // h: position.h,
            boxPadTop: position.boxPadTop,
            y: e?.changedTouches[0]?.pageY - position.boxPadTop,
        })
    }
    // 结束拖动
    const touchEnd = (e, m) => {
        e.stopPropagation()
        e.preventDefault()
        if (!position.show) return;
        let pY = position.y + position.boxPadTop
        let endIndex = -1
        // console.log(e, m, els, pY)
        if (pY <= els[0].bottom) {
            endIndex = 0
        } else if (pY >= els[els.length - 1].top) {
            endIndex = els.length - 1
        } else {
            els.map((em, emI) => {
                if ((emI > 0 ? els[emI-1].bottom : em.top) <= pY && em.bottom >= pY) {
                    // console.log('结束', em, em.dataset, m)
                    endIndex = emI
                }
            })
        }
        if (endIndex == -1) {
            endIndex = els.length - 1
        }
        let tempArr = JSON.parse(JSON.stringify(configList.filter((f) => f.show)))
        // console.log(tempArr, endIndex, m, startIndex)
        tempArr.splice(startIndex, 1)
        tempArr.splice(endIndex, 0, m)
        // 再次初始化显示的列表排序
        tempArr.map((m, mI) => { m.sort = mI })
        // 与完整列表排序进行排序
        let allTempArr = JSON.parse(JSON.stringify(configList))
        allTempArr.map((m) => {
            const crtTemp = tempArr.find((f) => f.id == m.id)
            if (crtTemp) {
                m.sort = crtTemp.sort
            }
        })
        allTempArr = allTempArr.sort((a,b) => a.sort - b.sort)
        console.log(tempArr, allTempArr)
        setConfigList(allTempArr)
        // setVisHidConfig(allTempArr)
        setPosition({
            x: 0,
            y: 0,
            // h: 0,
            show: false,
            boxPadTop: 0,
            m: undefined,
        })
    }
    
    // 保存显隐配置
    const saveConfig = (val) => {
        // console.log(val)
        // let valArr = Object.keys(val)
        // // console.log('val', val, valArr)
        // let tempInfo = JSON.parse(JSON.stringify(visibleHiddenConfig))
        // for (let key in tempInfo) {
        //     if (valArr.includes(key)) {
        //         tempInfo[key] = val[key]
        //     }
        // }
        // setVisibleHiddenConfig(tempInfo)
        // setVisHidConfig(tempInfo)
        setVisHidConfig(val)
    }
    // 获取显隐配置
    const getVisHidConfig = (configType) => {
        return new Promise((resolve, reject) => {
            dailySwitchAPI(configType).then((res) => {
                if (res.code == 200) {
                    let tempInit = []
                    let tempConfig = res.data?.configParam ? JSON.parse(res.data?.configParam) : []
                    if (configType == 1) {
                        tempInit = initOperate
                        if (!tempConfig?.length) tempConfig = initOperate // 运营日报
                    }
                    if (configType == 2) {
                        tempInit = initEngineerDaily
                        if (!tempConfig?.length) tempConfig = initEngineerDaily // 工程日报
                    }
                    if (configType == 3) {
                        tempInit = initMarktDaily
                        if (!tempConfig?.length) tempConfig = initMarktDaily // 市场日报
                    }
                    if (configType == 4) {
                        tempInit = initEngineerReport
                        if (!tempConfig?.length) tempConfig = initEngineerReport // 工程报表
                    }
                    if (configType == 5) {
                        tempInit = initProdcutReport
                        if (!tempConfig?.length) tempConfig = initProdcutReport // 生产报表
                    }
                    if (configType == 6) {
                        tempInit = initPurchaseReport
                        if (!tempConfig?.length) tempConfig = initPurchaseReport // 采购报表
                    }
                    if (configType == 7) {
                        tempInit = initOutSourceReport
                        if (!tempConfig?.length) tempConfig = initOutSourceReport // 工序外协报表
                    }
                    if (configType == 8) {
                        tempInit = initPedingReport
                        if (!tempConfig?.length) tempConfig = initPedingReport // 待处理业务报表
                    }
                    if (configType == 9) {
                        tempInit = initCapacityReport
                        if (!tempConfig?.length) tempConfig = initCapacityReport // 产能上报统计
                    }

                    // 找出 初始化 数组中有，但是 接口中没有的 数据，即新增的类型
                    // 初始化序号
                    tempInit.map((m, mI) => { m.sort = (mI+1) })
                    // console.log(JSON.parse(JSON.stringify(tempConfig)), initOperate)
                    // 获取 初始化数组中 新增的数据
                    let tempNewConfig = tempInit.filter((f) => !tempConfig.map((m) => m.id).includes(f.id))
                    // 获取 初始化数组中 删除的数据
                    let needDelConfig = tempConfig.filter((f) => !tempInit.map((m) => m.id).includes(f.id))
                    // 把新增的数据，插入进去，并展示到页面上
                    if (tempNewConfig?.length) {
                        tempConfig.splice(tempNewConfig[0].sort, 0, tempNewConfig[0])
                    }
                    // 去除已经删除的数据
                    if (needDelConfig?.length) {
                        tempConfig = tempConfig.filter((f) => !needDelConfig.map((m) => m.id).includes(f.id))
                    }
                    // console.log(tempInit, tempNewConfig, needDelConfig, tempConfig)

                    // 初始化 排序
                    tempConfig.map((m, mI) => {
                        m.sort = mI
                        // 需要从初始化中取名称。如果从接口中取，名称无法改变
                        const crtInit = tempInit.find((f) => f.id == m.id)
                        if (crtInit) {
                            m.title = crtInit.title
                        }
                    })
                    setConfigList(tempConfig)
                    setVisibleHiddenConfig(res.data)
                    resolve(true)
                } else reject(false)
            }).catch((err) => reject(err))
        })
    }
    // 设置显隐配置
    const setVisHidConfig = (tempInfo) => {
        let tempArr = tempInfo ? tempInfo : configList
        setLoading(true)
        dailySwitchResetAPI({
            type: options?.type,
            configParam: JSON.stringify(tempArr || ''),
            paramValue: visibleHiddenConfig?.paramValue || '{}',
        }).then((res) => {
            if (res.code == 200) {
                Taro.showToast({ title: '保存成功', icon: 'success' })
                getVisHidConfig(options.type)
            }
        }).finally(() => setLoading(false))
    }
    return (
        <View className={`report-sort daily daily-report`}>
            <MovableArea style={'width: 100%;height: 100%;'}>
                <View className='flex flex-start m-b-20' style={'height: 50rpx;'}>
                    <View className='m-r-10'>开启自定义布局</View>
                    <Switch color='#2D90ED' className='expend-click' checked={drag} onChange={(e) => setDrag(e?.detail?.value)}></Switch>
                </View>
                {
                    configList?.length && configList.filter((f) => f.show)?.length ? configList.filter((f) => f.show).map((m,mI) => {
                        return (
                            m?.show ? <>
                            <View
                                data-index={mI}
                                style={'position: relative;'}
                                className={`sort-item item${mI}`}>
                                {
                                    // 是否开启拖动
                                    drag ? <View
                                        data-index={mI}
                                        className='primary-drag-after'
                                        style={'position:absolute;top:-12rpx;right:-12rpx;z-index: 998;'}
                                        catchMove
                                        onTouchEnd={(e) => touchEnd(e, m)}
                                        onTouchMove={(e) => touchMove(e, m)}
                                        onTouchStart={(e) => touchStart(e, m, mI)}
                                        // onLongPress={(e) => longPressHandle(e, m, mI)}
                                    ></View> : <></>
                                }
                                {
                                    // 小卡片
                                    m.type == 1 ? <SortCard data={m}></SortCard> : <></>
                                }
                                {
                                    // 表格
                                    m.type == 2 ? <SortTable data={m}></SortTable> : <></>
                                }
                                {
                                    // 图表
                                    m.type == 3 ? <SortChart echartsJs={echartsJs} data={m}>
                                    <Echarts
                                        isPage={false}
                                        // ref={echartsRef}
                                        echarts={echartsJs}
                                        option={{
                                            xAxis: {
                                                type: 'category',
                                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                data: [120, 200, 150, 80, 70, 110, 130],
                                                type: 'bar'
                                                }
                                            ]
                                        }}
                                        canvasId={`chart${mI}`}
                                        // style自定义设置echarts宽高
                                        style={{ width: '100%', height: '300px' }}
                                        // className='echarts-dom'
                                    />
                                    </SortChart> : <></>
                                }
                            </View>
                            </> : <></>
                        )
                    }) : <></>
                }
                <MovableView x={position.x} y={position.y} direction='vertical' style={'width: 100%;z-index: 998;'}>
                {position?.show ? <View style={'border: 1px solid rgba(24, 144, 255, 1);border-radius: 20rpx;'}>
                    <View
                        className='primary-drag-before'
                        style={'position:absolute;top:-12rpx;right:-12rpx;z-index: 998;'}
                    ></View>
                    {/* <View style={`width: 100%;height: ${position.h}px;border: 1px solid blue;`}>{position?.m?.title}</View> */}
                    {
                        // 小卡片
                        position?.m.type == 1 ? <SortCard nobottom={true} data={position?.m}></SortCard> : <></>
                    }
                    {
                        // 表格
                        position?.m.type == 2 ? <SortTable nobottom={true} data={position?.m}></SortTable> : <></>
                    }
                    {
                        // 图表
                        position?.m.type == 3 ? <SortChart echartsJs={echartsJs} nobottom={true} data={position?.m}>
                        <Echarts
                            isPage={false}
                            // ref={echartsRef}
                            echarts={echartsJs}
                            option={{
                                xAxis: {
                                    type: 'category',
                                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                    data: [120, 200, 150, 80, 70, 110, 130],
                                    type: 'bar'
                                    }
                                ]
                            }}
                            canvasId={`chart666`}
                            // style自定义设置echarts宽高
                            style={{ width: '100%', height: '300px' }}
                            // className='echarts-dom'
                        />
                        </SortChart> : <></>
                    }
                </View> : <></>}</MovableView>
            </MovableArea>
            <View className='common-bottom-btn'>
                {/* 接口反应很快，最慢126ms，会出现闪烁，所以去除掉 loading={loading} disabled={loading} */}
                <AtButton type='primary' onClick={() => setVisHidConfig()}>保存</AtButton>
            </View>
            {/* <GSettingDialog type={options?.type} rowList={[
                {name: '接单图表', field: 'orderChart', value: () => visibleHiddenConfig?.orderChart},
                {name: '订单数据', field: 'orderData', value: () => visibleHiddenConfig?.orderData},
                {name: '业务员数据', field: 'userData', value: () => visibleHiddenConfig?.userData},
                {name: '统计图', field: 'statistics', value: () => visibleHiddenConfig?.statistics},
            ]} onInit={(val) => setRargetInfo(val)} onChange={saveConfig}></GSettingDialog> */}
            <GSettingDialog type={options?.type} rowList={configList} onChange={saveConfig}></GSettingDialog>
            <GFeedback></GFeedback>
            <Canvas canvasId={`reportSort6666`} style={'display: none;'}></Canvas>
        </View>
    )
}
