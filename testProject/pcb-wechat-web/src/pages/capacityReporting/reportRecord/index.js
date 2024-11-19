import { useState, useEffect } from "react";
import { AtIcon, AtButton, AtLoadMore } from "taro-ui"
import Taro, { useLoad, useDidShow, useReady } from '@tarojs/taro'
import {View,Input,Picker,ScrollView} from '@tarojs/components'
import GInput from "../../../components/g-input";
import Search from "../../../components/searchOld/index";
import ReportCard from "../../../components/report-card";
import './index.less'
import { getCapacityListAPI } from '../../services/productWork/index'
// import GFeedback from "../../../components/g-feedback";


export default function ReportRecord({type}) {
    let flag = false
    const [page, setPage] = useState(1)
    const [refresh, setRefresh] = useState(true)
    const [startRef, setStartRef] = useState(false)
    const [status, setStatus] = useState('loading')
    const [search, setSearch] = useState(undefined)
    const [endTime, setEndTime] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [list, setList] = useState([])
    // useReady(() => {
    //     console.log('useReady', type)
    // })
    // useDidShow(() => {
    //     console.log('useDidShow', type)
    // })
    // useLoad(() => {
    //     console.log('useLoad', type)
    // })
    useEffect(() => {
        // type 0:全部 1:个人 2:部门
        // let tempList = []
        // for (let i = 1; i <= 10; i++) {
        //     tempList.push(i)
        // }
        // setList(tempList)
        initList()
        // console.log('useEffect', type)
    }, [type])
    const changeTime = (e, timeType) => {
        if (timeType == 'startTime') {
            if (endTime && e?.detail?.value) {
                if (new Date(e.detail.value) > new Date(endTime)) {
                    Taro.showToast({
                        title: '不能大于结束时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            setStartTime(e?.detail?.value)
        } else {
            if (startTime && e?.detail?.value) {
                if (new Date(e.detail.value) < new Date(startTime)) {
                    Taro.showToast({
                        title: '不能小于开始时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            setEndTime(e?.detail?.value)
        }
    }
    // 开启搜索
    const searchHandle = () => {
        initList()
    }
    // 初始化列表
    const initList = () => {
        setPage(1)
        setStatus('loading')
        getCapacityList(true)
    }
    // 获取列表数据
    const getCapacityList = (first) => {
        const params = {
            type,
            // endTime,
            // startTime,
            pageSize: 10,
            pageNum: page,
            isAsc: 'desc',
            orderByColumn: 'create_time',
            // commodityCode: search,
        }
        if (endTime) params.endTime = endTime + ' 23:59:59'
        if (startTime) params.startTime = startTime + ' 00:00:00'
        if (search) params.commodityCode = search
        // console.log(params)
        getCapacityListAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                setRefresh(false)
                if (first) {
                    tempList = tempList.concat(res.rows || [])
                    setList(tempList)
                } else {
                    tempList = list
                    tempList = tempList.concat(res.rows || [])
                    setList(tempList)
                }
                if (tempList.length >= res.total) {
                    setStatus('noMore')
                } else {
                    let num = page + 1
                    setPage(num)
                }
            }
        })
    }
    // 触底事件
    const scrolltolower = () => {
        if (refresh) {
            return;
        }
        if (status == 'noMore') {
            return;
        }
        getCapacityList()
    }
    // 下拉刷新
    const scrolltoupper = (e) => {
        // console.log('下拉刷新', e)
        initList()
    }
    const startPull = () => {
        setRefresh(true)
        setStartRef(true);
        // console.log(111)
    }
    const endPull = () => {
        setStartRef(false);
        // console.log(222)
    }
    return (
        <View>
            <Search
                inputView={
                    <View>
                        <GInput value={search} placeholder='产品编码' onInput={(e) => setSearch(e)} clear={() => setSearch(undefined)} onConfirm={searchHandle}></GInput>
                        <View className="search-time flex">
                            <GInput value={startTime} clear={() => changeTime(undefined, 'startTime')} slotIcon={
                                <AtIcon value='calendar' size='16' color="#999" className="g-icon"></AtIcon>
                            } slot={
                                <Picker mode='date' onChange={(e) => changeTime(e, 'startTime')}>
                                    <Input value={startTime} disabled placeholder='上报开始时间'></Input>
                                </Picker>
                            }></GInput>
                            <GInput value={endTime} clear={() => changeTime(undefined, 'endTime')} slotIcon={
                                <AtIcon value='calendar' size='16' color="#999" className="g-icon"></AtIcon>
                            } slot={
                                <Picker mode='date' onChange={(e) => changeTime(e, 'endTime')}>
                                    <Input value={endTime} disabled placeholder='上报结束时间'></Input>
                                </Picker>
                            }></GInput>
                        </View>
                    </View>
                }
                buttonView={<AtButton type='primary' size="small" onClick={searchHandle}>搜索</AtButton>}
                style={'background: transparent;'}
            ></Search>
            
            <ScrollView
                scrollY
                refresherEnabled={false}
                className="scroll-view-box"
                refresherTriggered={refresh}
                onScrollToLower={scrolltolower}
                onRefresherRefresh={scrolltoupper}
                onRefresherAbort={endPull}
                onRefresherPulling={startPull}
                onRefresherRestore={endPull}>
                {
                    list.map((item) => {
                        return (
                            <ReportCard data={item} type={type}></ReportCard>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            {/* <GFeedback></GFeedback> */}
        </View>
    )
}
