import { subscribeMessage } from '../util/func'
import { useState, useEffect } from 'react'
import Taro, {useLoad,useDidShow,useShareAppMessage} from '@tarojs/taro'
import './index.less'
import { View, ScrollView } from '@tarojs/components'
import WorkCard from "./work-card/index";
import { AtButton, AtLoadMore } from 'taro-ui'
import { getAuditListAPI, passCapacityByCardAPI } from '../services/productWork/index'
import GFeedback from '../../components/g-feedback'


export default function WorkProcess() {
    const [id, setId] = useState('')
    const [page, setPage] = useState(1)
    const [list, setList] = useState([])
    const [status, setStatus] = useState('loading')
    const [waitAuditArea, setWaitAuditArea] = useState(0)
    useLoad((options) => {
        // console.log(options)
        setId(options.id)
    })
    useDidShow(() => {
        if (id) {
            initList(id)
        }
    })
    useShareAppMessage(() => {
      return {
        title: '个人产能审核',
        path: '/pages/index/index'
      }
    })

    // 初始化列表
    const initList = (ids) => {
        // setPage(1)
        setStatus('loading')
        getAuditList(ids)
    }
    // 获取列表数据
    const getAuditList = (ids) => {
        const params = {
            // pageSize: 1000, // 不传分页即返回所有
            // pageNum: 1,
            // pageNum: first ? 1 : page + 1,
            isAudit: true,
        }
        if (ids) params.craftIds = ids
        // console.log(params)
        getAuditListAPI(params).then((res) => {
            if (res.code == 200) {
                setList(res.rows || [])
                setWaitAuditArea(res.waitAuditArea || 0)
                setStatus('noMore')
            }
        })
    }

    const scrolltolower = () => {
        // if (status == 'noMore') {
        //     return;
        // }
        // getAuditList()
    }

    const toDetail = (item) => {
        Taro.navigateTo({url: `/pages/processDetail/index?cardId=${item.cardId}&craftId=${item.craftId}&type=${1}&roleType=${item.type}`})
    }

    const passBatch = () => {
        if (!list?.length) {
            Taro.showToast({
                icon: 'none',
                title: '暂无数据可审核',
                duration: 1500
            })
            return
        }
        subscribeMessage().finally(() => {
            Taro.showModal({
                title: '系统提示',
                content: '是否确认通过该工艺所有已上报待审核记录？',
                success: function (res) {
                    if (res.confirm) {
                        const params = list.map((m) => {
                          return {
                            cardId: m.cardId,
                            status: m.status,
                            craftId: m.craftId,
                          }
                        })
                        // console.log('params--:', params)
                        passCapacityByCardAPI(params).then((res) => {
                            if (res.code == 200) {
                                Taro.showToast({
                                    title: '已审核通过',
                                    icon: 'success',
                                    duration: 1500
                                })
                                Taro.navigateBack({ delta: 1 })
                            }
                        })
                    }
                }
            })
        })
    }
    return (
        <View className='work-process'>
            <View className="work-table-head flex flex-between">
                <View className="work-table-title">待审核记录</View>
                <View className="work-table-tip" style='color: #6190E8;'>待审面积:{Number(waitAuditArea || 0).toFixed(4)}</View>
            </View>
            <ScrollView lowerThreshold={80} className="scroll-work-box" scrollY onScrollToLower={scrolltolower}>
                {
                    list.map((item) => {
                        return (
                            <View onClick={() => toDetail(item)}>
                                <WorkCard data={item}></WorkCard>
                            </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>
            <AtButton className='work-process-btn' type='primary' onClick={passBatch}>审核</AtButton>
            <GFeedback></GFeedback>
        </View>
    )
}
