import { useState, useEffect } from "react";
import { AtIcon, AtButton, AtLoadMore } from "taro-ui"
import Taro, { useLoad, useDidShow, useReady } from '@tarojs/taro'
import {View,Input,Picker,ScrollView} from '@tarojs/components'
import RecordCard from "../recordCard/index";
import GInput from "../../../components/g-input";
import Search from "../../../components/searchOld/index";
import './index.less'
import { listAppletPurchaseOrderAPI, listAppletPurchaseOrderAuditAPI } from '../../services/materialRequisition/index'
import GFeedback from "../../../components/g-feedback";


export default function MaterialRecord({type}) {
    // type 1:个人采购记录 2:待审核记录 3:已审核记录
    const [page, setPage] = useState(1)
    const [refresh, setRefresh] = useState(true)
    const [status, setStatus] = useState('loading')
    const [search, setSearch] = useState(undefined)
    const [endTime, setEndTime] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [list, setList] = useState([])
    useDidShow(() => {
        initList()
        Taro.removeStorageSync('car_data')
    })
    useEffect(() => {
        initList()
        Taro.removeStorageSync('car_data')
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
        setList([])
        setStatus('loading')
        getlistAppletPurchaseOrder(true)
    }
    const resultDeal = (res, first) => {
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
                let num = first ? 1 : page + 1
                setPage(num)
            }
        }
    }
    // 获取列表数据
    const getlistAppletPurchaseOrder = (first) => {
        const params = {
            pageSize: 10,
            pageNum: first ? 1 : page + 1,
        }
        if (search) params.code = search
        if (endTime) params.updateTimeEnd = endTime + ' 23:59:59'
        if (startTime) params.updateTimeStart = startTime + ' 00:00:00'
        // console.log(params)
        if (type == 1) {
            listAppletPurchaseOrderAPI(params).then((res) => {
                resultDeal(res, first)
            })
        } else {
            // if (type == 2)
            params.isAudit = type == 2
            listAppletPurchaseOrderAuditAPI(params).then((res) => {
                resultDeal(res, first)
            })
        }
    }
    // 触底事件
    const scrolltolower = () => {
        if (refresh) {
            return;
        }
        if (status == 'noMore') {
            return;
        }
        getlistAppletPurchaseOrder()
    }
    // 下拉刷新
    const scrolltoupper = (e) => {
        // console.log('下拉刷新', e)
        initList()
    }
    const startPull = () => {
        setRefresh(true)
        // console.log(111)
    }
    const endPull = () => {
        // console.log(222)
    }

    // 跳转到详情页
    const toMaterialDetail = (item) => {
        // console.log('item', item)
        Taro.navigateTo({ url: `/pages/materialDetail/index?id=${item.id}&type=${type}` })
    }
    return (
        <View>
            <Search
                inputView={
                    <View>
                        <GInput value={search} placeholder='采购单号' onInput={(e) => setSearch(e)} clear={() => setSearch(undefined)} onConfirm={searchHandle}></GInput>
                        <View className="search-time flex">
                            <GInput value={startTime} clear={() => changeTime(undefined, 'startTime')} slotIcon={
                                <AtIcon value='calendar' size='16' color="#999" className="g-icon"></AtIcon>
                            } slot={
                                <Picker mode='date' onChange={(e) => changeTime(e, 'startTime')}>
                                    <Input value={startTime} disabled placeholder='下单开始时间'></Input>
                                </Picker>
                            }></GInput>
                            <GInput value={endTime} clear={() => changeTime(undefined, 'endTime')} slotIcon={
                                <AtIcon value='calendar' size='16' color="#999" className="g-icon"></AtIcon>
                            } slot={
                                <Picker mode='date' onChange={(e) => changeTime(e, 'endTime')}>
                                    <Input value={endTime} disabled placeholder='下单结束时间'></Input>
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
                            <RecordCard data={item} type={type} onClick={toMaterialDetail}></RecordCard>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            <GFeedback></GFeedback>
        </View>
    )
}
