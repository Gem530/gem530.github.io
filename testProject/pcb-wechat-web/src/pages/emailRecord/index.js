import { useState, useEffect } from "react";
import { AtIcon, AtButton, AtLoadMore, AtList, AtListItem } from "taro-ui"
import Taro, { useLoad, useDidShow, useReady, useShareAppMessage } from '@tarojs/taro'
import {View,ScrollView} from '@tarojs/components'
import './index.less'
import dayjs from "dayjs";
import { businessCardListAPI } from '../services/emailRecognition/index'
import GFeedback from "../../components/g-feedback";


export default function EmailRecord() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState('loading')
    const [list, setList] = useState([])
    // useReady(() => {
    // })
    useDidShow(() => {
        console.log('useDidShow')
        setList([])
        initList()
    })
    // useLoad(() => {
    // })
    useShareAppMessage(() => {
        return {
          title: '邮箱发送记录',
          path: '/pages/index/index'
        }
    })
    // 初始化列表
    const initList = () => {
        setPage(1)
        setStatus('loading')
        getCapacityList(true)
    }
    // 获取列表数据
    const getCapacityList = (first) => {
        let userInfo = Taro.getStorageSync('__USER_INFO__');
        const params = {
            data: {
                pageSize: 15,
                pageNum: first ? 1 : page + 1,
                userId: userInfo?.user?.userId
            },
            method: 'GET'
        }
        console.log(params)
        businessCardListAPI(params).then((res) => {
            if (res.code == 200) {
                res.rows?.length && res.rows.map((item) => {
                    let tempTime = new Date(item.createTime)
                    let resTime = dayjs(item.createTime).subtract(tempTime.getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss')
                    item.createTime = resTime
                    // console.log(tempTime, item.createTime, tempTime.getTimezoneOffset(), resTime)
                })
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
    // 触底事件
    const scrolltolower = () => {
        if (status == 'noMore') {
            return;
        }
        getCapacityList()
    }
    return (
        <View className="email-record">
            <ScrollView
                scrollY
                className="email-record-box"
                onScrollToLower={scrolltolower}>
                    {
                        list.map((item) => {
                            return (
                                // <AtListItem title={item.email} extraText={item.createTime}></AtListItem>
                                <View className="email-record-item flex flex-between">
                                    <View className="email-record-value">
                                        <View>{item.email}</View>
                                        {item.remark && <View className="email-record-remark">备注：{item.remark}</View>}
                                    </View>
                                    <View className="email-record-time">{item.createTime}</View>
                                </View>
                            )
                        })
                    }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            <GFeedback></GFeedback>
        </View>
    )
}
