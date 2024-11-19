import dayjs from 'dayjs'
import { useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef } from "react"
import GTable from '../../../components/g-table'
// import GPopCalendar from '../../../components/g-pop-calendar'


export default forwardRef(function SortTable({data, nobottom}, ref) {
    return (
        <View className='daily-card' style={`${nobottom && 'margin-bottom: 0 !important;'}`}>
            <View className='daily-card-title flex flex-start'>
                <View>{data?.title}</View>
            </View>
            <GTable list={[1,2,3,4]} titleList={[
                { title: '测试0', field: 'typeStr' },
                { title: '测试1', field: 'typeStr' },
                { title: '测试2', field: 'typeStr' },
            ]}
            thSlot={() => {
                return (
                    <View className='g-skeleton first'></View>
                )
            }}
            tdSlot={(title, item, slotIndex) => {
                return (
                    <View className='g-skeleton first'></View>
                )
            }}
            ></GTable>
        </View>
    )
})
