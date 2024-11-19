import './index.less'
import dayjs from 'dayjs'
import GTag from '../g-tag'
import { useRef } from 'react'
import GTimeRange from '../g-time-range'
import GPickerTime from '../g-picker-time'
import { getGlobalData } from "../../global"
import Taro, { useDidShow } from '@tarojs/taro'
import { getDomInfo } from '../../pages/util/func'
import { View, ScrollView } from '@tarojs/components'
import { AtButton, AtDrawer, AtInput, AtIcon } from "taro-ui"
import { useState, forwardRef, useImperativeHandle } from "react";


export default forwardRef(function GDrawerFilter({
    reset,
    close,
    confirm,
    classStr,
    newF = false,
    right = true,
    formList = [],
    width = '616rpx',
}, ref) {
    const initRecord = {
        // list: [],
        open: false,
        title: '订单筛选',
    }
    const quickTimes = [
        { id: -1, name: '昨天' },
        { id: 1, name: '今天' },
        { id: 7, name: '近7天' },
        { id: 30, name: '近1个月' },
        { id: 90, name: '近3个月' },
        { id: 180, name: '近6个月' },
    ]
    const GPickerTimeRef = useRef()
    const [h, setH] = useState(0)
    const [localFormList, setLocalFormList] = useState([])
    const [quickInfo, setQuickInfo] = useState({id:'',name:''})
    // const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')

    const [info, setInfo] = useState({})
    const [recordInfo, setRecordInfo] = useState(initRecord)

    useDidShow(() => {
        initForm()
        setTimeout(() => {
            Taro.createSelectorQuery().select('.nav-bar').fields({ rect: true, scrollOffset: true, size: true, dataset: true }, (res) => {
                console.log(res?.height)
                // getGlobalData('menuButtonInfo').top
                let barHeight = res?.height// + getGlobalData('menuButtonInfo').top
                setH(barHeight)
            }).exec()
        }, 100)
    })

    // 时间快捷键格式化
    const initFormatDate = (list) => {
        let tempList = JSON.parse(JSON.stringify(list || formList))
        console.log(tempList, list)
        if (tempList?.length) {
            let tempFormList = JSON.parse(JSON.stringify(tempList))
            tempFormList.map((m) => {
                if (m.isQuick) {
                    m.quickInfo = quickInfo
                    m.quickTimes = quickTimes
                }
            })
            setLocalFormList(tempFormList)
        }
    }
    // 初始化  会把传进来的参数清空，所以暂时弃用，后续找到更好的实现方法再改造
    const initForm = (infoTemp, list) => {
        let tempList = JSON.parse(JSON.stringify(list || formList))
        if (tempList?.length) {
            let tempInfo = infoTemp || info
            let tempFormList = JSON.parse(JSON.stringify(tempList))
            tempFormList.map((m) => {
                tempInfo[m.field] = m?.value || undefined
                if (m.isQuick) {
                    m.quickInfo = quickInfo
                    m.quickTimes = quickTimes
                }
            })
            console.log(tempInfo, tempFormList, JSON.parse(JSON.stringify(tempList)))
            setInfo(tempInfo)
            setLocalFormList(tempFormList)
        }
    }

    // 快捷键 时间
    const changeQuickTime = (e, item) => {
        console.log('changeQuickTime--', e, item)
        // setQuickInfo(e)
        let res = ['','']

        let today = dayjs(new Date()).format('YYYY-MM-DD')
        if (e?.id == -1) {
            // 昨日
            let yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
            res = [yesterday, yesterday]
        } else if (e.id == 1) {
            // 今天
            res = [today, today]
        } else if (e.id == 7) {
            // 近7天
            let sevenday = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD')
            res = [sevenday, today]
        } else if (e.id == 30) {
            // 近1个月
            let oneMonth = dayjs(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
            res = [oneMonth, today]
        } else if (e.id == 90) {
            // 近3个月
            let thrMonth = dayjs(new Date()).subtract(3, 'month').format('YYYY-MM-DD')
            res = [thrMonth, today]
        } else if (e.id == 180) {
            // 近6个月
            let sixMonth = dayjs(new Date()).subtract(6, 'month').format('YYYY-MM-DD')
            res = [sixMonth, today]
        }
        let tempList = JSON.parse(JSON.stringify(localFormList))
        // tempList.map((m) => {
        //     if (m.field == item.field) {
        //         m.quickInfo = e
        //     }
        // })
        // setLocalFormList(tempList)
        updateData([ { value: res, field: item.field } ], 'info', e)
    }

    // 点击时间
    const clickTime = async (item, tempType) => {
        // return new Promise((resolve, reject) => {
        // console.log('clickTime', tempType)
        if (tempType == 'date') {
            let tempTime = info[item.field]
            let resTime = await GPickerTimeRef.current.openTime({dateType: item?.dateType, value: tempTime})
            console.log('resTime', resTime)
            if (resTime?.confirm) updateData([ { value: resTime?.data, field: item.field }, ], 'info')
            return;
        }
        // return GPickerTimeRef.current.openTime().then((res) => resolve(res)).catch((err) => reject(err))
        // console.log(tempType)
        let tempTime = ''
        // info[item.field]
        if (tempType == 'endTime') {
            tempTime = info[item.field]?.length > 1 ? info[item.field][1] : ''
        } else if (tempType == 'startTime') {
            tempTime = info[item.field]?.length ? info[item.field][0] : ''
        }
        return GPickerTimeRef.current.openTime({dateType: item?.dateType, value: tempTime})
        
        // })
    }

    // 修改数据
    const updateData = (arr, tempType = 'record', tempQuick) => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
        if (tempType == 'info') {
            console.log(arr, tempType)
            // console.log(arr, tempType)
            let tempInfo = JSON.parse(JSON.stringify(info))
            arr.map((item, index) => {
                if (item?.type && item?.type == 'number') {
                    if (Array.isArray(item.value)) {
                        item.value = item.value.map((m) => {
                            return (m+'').replace(/[^0-9\.\-]/g,'')
                        })
                    } else {
                        item.value = (item.value+'').replace(/[^0-9\.\-]/g,'')
                    }
                }
                tempInfo[item.field] = item.value
            })
            if (arr?.length) {
                let tempLocalForm = JSON.parse(JSON.stringify(localFormList))
                tempLocalForm.map((m) => {
                    if (!tempQuick && arr.map((am) => am.field).includes(m.field) && m?.isQuick) {
                        m.quickInfo = {id:'',name:''}
                    } else if (tempQuick) {
                        m.quickInfo = tempQuick
                    }
                })
                setLocalFormList(tempLocalForm)
            }
            setInfo(tempInfo)
        }
    }

    // 打开文件列表
    const openFilter = async (data, title, list, checkFun) => {
        let tempInfo = JSON.parse(JSON.stringify(info))
        if (data) {
            // console.log(1111, data)
            for (let key in data) {
                tempInfo[key] = data[key]
            }
            setInfo(tempInfo)
        } 
        initFormatDate(list)
        updateData([
            { value: true, field: 'open' },
            { value: checkFun || undefined, field: 'checkFun' },
            { value: title || initRecord?.title, field: 'title' },
        ], 'record')
    }

    // 重置
    const resetHandle = () => {
        // console.log('resetHandle')
        reset && reset()
        closeDrawer()
    }
    // 确定
    const confirmHandle = async () => {
        // console.log('confirmHandle')
        if (recordInfo?.checkFun) {
            const res = await recordInfo?.checkFun()
            console.log(res)
            if (res) return;
        }
        confirm && confirm(info)
        closeDrawer()
    }
    // 关闭弹框
    const closeDrawer = (flag = false) => {
        updateData([
            { value: false, field: 'open' },
        ], 'record')
        if (flag) {
            close && close()
        }
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openFilter,
    }))
    return (
        <>
        <AtDrawer mask width={width} right={right} show={recordInfo.open} onClose={() => closeDrawer(true)} className={`${classStr} ${!recordInfo.open && 'none-dom'}`}>
            <View style={`height: ${h}px;`}></View>
            <View className='at-drawer-title flex flex-center'>{recordInfo.title}</View>
            <ScrollView scrollY className="at-drawer-content" style={`height: calc(100% - 96rpx - 156rpx - ${h || 0}px)`}>
            {
                localFormList?.length ? localFormList.map((item, index) => {
                    return (
                        <>
                        {item.title ? <View className='drawer-from-title'>{item.title}</View> : <></>}
                        <View className={`drawer-from-item ${['tag'].includes(item.type) && 'drawer-form-bottom-20'}`}>
                            {/* tag标签 */}
                            {item.type == 'tag' ? <GTag
                                newF={newF}
                                list={item.data}
                                tagInfo={info[item.field]}
                                choose={(e) => updateData([ { value: e, field: item.field }, ], 'info')}
                            ></GTag> : <></>}
                            {/* 日期范围选择 */}
                            {item.type == 'timeRange' ? <>
                                {item?.isQuick ? <GTag
                                    newF={newF}
                                    classStr={'g-tag-auto'}
                                    list={item?.quickTimes}
                                    tagInfo={item?.quickInfo}
                                    choose={(e) => changeQuickTime(e, item)}
                                ></GTag> : <></>}
                                <GTimeRange
                                    newF={newF}
                                    time={info[item.field]}
                                    endClear={item.endClear}
                                    startClear={item.startClear}
                                    disabledStart={item.disabledStart}
                                    onClickTime={(tempType) => clickTime(item, tempType)}
                                    change={(e) => updateData([ { value: e, field: item.field }, ], 'info')}
                                ></GTimeRange>
                            </>
                            : <></>}
                            {/* 时间选择 */}
                            {
                                item.type == 'date' ? <>
                                <AtInput
                                    editable={false}
                                    {...item?.attrs}
                                    value={info[item.field]}
                                    className="new el-imitate-input"
                                    onClick={() => clickTime(item, 'date')}
                                    placeholderClass="el-imitate-input-placeholder">
                                    <View className='primary-bottom'></View>
                                </AtInput>
                                </> : <></>
                            }
                            {/* 表单选择 */}
                            {
                                item.type == 'input' ? <>
                                <AtInput
                                    {...item?.attrs}
                                    value={info[item.field]}
                                    className="new el-imitate-input"
                                    placeholderClass="el-imitate-input-placeholder"
                                    onChange={(e) => updateData([ { value: e, field: item.field, type: item?.attrs?.type }, ], 'info')}
                                ></AtInput>
                                </> : <></>
                            }
                            {/* 两个表单拼接 */}
                            {
                                item.type == 'inputTwo' ? <>
                                <View className='flex flex-center'>
                                    <AtInput
                                        style={'flex: 1;'}
                                        {...item?.startAttrs}
                                        value={info[item.field][0]}
                                        className="new el-imitate-input"
                                        placeholderClass="el-imitate-input-placeholder"
                                        onChange={(e) => updateData([ { value: [e, info[item.field][1]], field: item.field, type: item?.startAttrs?.type }, ], 'info')}
                                    ></AtInput>
                                    <View style={'margin: 0 24rpx;'}>
                                        <AtIcon value='close' size='10' color='#333'></AtIcon>
                                    </View>
                                    <AtInput
                                        style={'flex: 1;'}
                                        {...item?.endAttrs}
                                        value={info[item.field][1]}
                                        className="new el-imitate-input"
                                        placeholderClass="el-imitate-input-placeholder"
                                        onChange={(e) => updateData([ { value: [info[item.field][0], e], field: item.field, type: item?.endAttrs?.type }, ], 'info')}
                                    ></AtInput>
                                </View>
                                </> : <></>
                            }
                        </View>
                        </>
                    )
                }) : <></>
            }
            </ScrollView>
            <View className='at-drawer-bottom'>
                <AtButton onClick={resetHandle}>重置</AtButton>
                <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
            </View>
        </AtDrawer>
        <GPickerTime ref={GPickerTimeRef}></GPickerTime>
        </>
    )
})
