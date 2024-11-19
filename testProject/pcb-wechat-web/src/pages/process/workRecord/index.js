import { useState, useEffect } from 'react'
import Taro, {useLoad,useDidShow} from '@tarojs/taro'
import './index.less'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtBadge, AtList, AtListItem, AtLoadMore } from 'taro-ui'
import ProcessRecord from '../processRecord/index'
import { craftCapacityListAPI } from '../../services/productWork/index'
import GFeedback from '../../../components/g-feedback'


export default function WorkRecord({random}) {
    const [page, setPage] = useState(1)
    const [list, setList] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState('loading')
    const [random1, setRandom1] = useState(undefined)
    const [tabList, setTabList] = useState([
        { title: '按卡审核' },
        { title: '按工艺审核' },
    ])
    useLoad(() => {
    })
    useDidShow(() => {
        setRandom1(Math.random())
        if (current == 1) {
            initList()
        }
    })
    // useEffect(() => {
    //     // console.log(1111)
    // }, [random])

    // 初始化列表
    const initList = () => {
        setPage(1)
        setStatus('loading')
        getAuditList(true)
    }
    // 获取列表数据
    const getAuditList = (first) => {
        const params = {
            // pageSize: 10,
            // pageNum: first ? 1 : page + 1,
        }
        // console.log(params)
        craftCapacityListAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (first) {
                    tempList = tempList.concat(res.data || [])
                    setList(tempList)
                } else {
                    tempList = list
                    tempList = tempList.concat(res.data || [])
                    setList(tempList)
                }
                setStatus('noMore')
                // if (tempList.length >= res.total) {
                // } else {
                //     let num = first ? 1 : page + 1
                //     setPage(num)
                // }
            }
        })
    }

    const scrolltolower = () => {
        // if (status == 'noMore') {
        //     return;
        // }
        // getAuditList()
    }

    const tabClick = (e) => {
        // (e) => setCurrent(e)
        // console.log(e)
        if (e == 1) {
            initList()
        }
        setCurrent(e)
    }

    const toDetail = (item) => {
        Taro.navigateTo({ url: `/pages/workProcess/index?id=${item.craftId}` })
    }
    return (
        <View className='work-record'>
            <AtTabs current={current} tabList={tabList} onClick={tabClick}>
                <AtTabsPane current={current} index={0} >
                    {current == 0 && <View className="tab-process-record"><ProcessRecord key='user-record' type={1} random={random1} feedBottom={true}></ProcessRecord></View>}
                </AtTabsPane>
                <AtTabsPane current={current} index={1}>
                    {current == 1 && <ScrollView lowerThreshold={80} className="scroll-work-box" scrollY onScrollToLower={scrolltolower}>
                        {/* <AtList> */}
                            {
                                list.map((item) => {
                                    return (
                                        // <AtListItem title={item.craftName} extraText={item.count} arrow='right' onClick={() => toDetail(item)}/>
                                        <View className='work-card flex flex-center' onClick={() => toDetail(item)}>
                                            <AtBadge value={item.count} maxValue={99}>
                                                <View className='work-text'>{item.craftName}</View>
                                            </AtBadge>
                                        </View>
                                    )
                                })
                            }
                        {/* </AtList> */}
                        <AtLoadMore status={status}></AtLoadMore>
                    </ScrollView>}
                </AtTabsPane>
            </AtTabs>
            {current == 1 ? <GFeedback></GFeedback> : <></>}
        </View>
    )
}
