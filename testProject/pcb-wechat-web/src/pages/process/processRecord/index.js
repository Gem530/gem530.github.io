import { useState, useEffect } from "react";
import { AtIcon, AtButton, AtLoadMore } from "taro-ui"
import Taro, { useLoad, useDidShow, useReady } from '@tarojs/taro'
import {View,Input,Picker,ScrollView} from '@tarojs/components'
import GInput from "../../../components/g-input";
import Search from "../../../components/searchOld/index";
import ProcessCard from "../../../components/process-card";
import './index.less'
import { hasPermi } from '../../util/func'
import { getAuditListAPI } from '../../services/productWork/index'
import GFeedback from "../../../components/g-feedback";


export default function ProcessRecord({type, random, feedBottom}) {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState('loading')
    const [search, setSearch] = useState(undefined)
    const [endTime, setEndTime] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [list, setList] = useState([])
    useEffect(() => {
        initList()
    }, [type, random])
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
    const searchHandle = () => {
        initList()
    }
    // 初始化列表
    const initList = async () => {
        await setPage(1)
        setStatus('loading')
        getAuditList(true)
    }
    // 获取列表数据
    const getAuditList = (first) => {
        let roleType = 3
        if (hasPermi(['deptLeader'])) {
            roleType = 3
        } else if (hasPermi(['productManager'])) {
            roleType = 4
        }
        const params = {
            type: roleType,
            isAudit: type == 1,
            // endTime,
            // startTime,
            pageSize: 10,
            pageNum: first ? 1 : page + 1,
        }
        if (endTime) params.endTime = endTime + ' 23:59:59'
        if (startTime) params.startTime = startTime + ' 00:00:00'
        if (search) params.cardCode = search
        // console.log(params)
        getAuditListAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
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
        })
    }
    const toDetail = (item) => {
        Taro.navigateTo({url: `/pages/processDetail/index?cardId=${item.cardId}&craftId=${item.craftId}&type=${type}&roleType=${item.type}`})
    }
    // 触底事件
    const scrolltolower = () => {
        if (status == 'noMore') {
            return;
        }
        getAuditList()
    }
    return (
        <View>
            <Search
                inputView={
                    <View>
                        <GInput clear={() => setSearch(undefined)} value={search} placeholder='流转卡号' onInput={(e) => setSearch(e)} onConfirm={searchHandle}></GInput>
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
            
            <ScrollView className="scroll-view-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item) => {
                        return (
                            <View onClick={() => toDetail(item)}>
                                <ProcessCard data={item}></ProcessCard>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            <GFeedback style={feedBottom ? 'bottom: 54rpx;right: -16rpx;' : ''}></GFeedback>
        </View>
    )
}
