import dayjs from 'dayjs'
import { useRef } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef } from "react"
// import GPopCalendar from '../../../components/g-pop-calendar'


export default forwardRef(function SortCard({data, nobottom}, ref) {
    return (
        <View className='common-card' style={`${nobottom && 'margin-bottom: 0 !important;'}`}>
            {data?.title ? <View className='common-title m-b-10'>{data?.title}</View> : <></>}
            <View className='g-skeleton first'></View>
            <View className='g-skeleton'></View>
            <View className='g-skeleton'></View>
        </View>
        // <View className='daily-nav has-left m-b-20' style={`${nobottom && 'margin-bottom: 0 !important;'}`}>
        //     <View className='daily-nav-left'>
        //         <View className='daily-nav-tip'><View className='g-skeleton' style={'width: 56rpx'}></View></View>
        //         <View className='daily-nav-title'>{data?.title}</View>
        //     </View>

        //     <View className='daily-nav-card'>
        //         <View className='daily-nav-top m-b-10'>
        //             <View className='daily-nav-top-item flex flex-start'><View className='g-skeleton first'></View></View>
        //             <View className='daily-nav-top-item'></View>
        //         </View>
        //         <View className='daily-nav-value flex flex-between'><View className='g-skeleton'></View></View>
        //     </View>
        //     <View className='daily-nav-card'>
        //         <View className='daily-nav-top m-b-10'>
        //             <View className='daily-nav-top-item flex flex-start'><View className='g-skeleton first'></View></View>
        //             <View className='daily-nav-top-item'></View>
        //         </View>
        //         <View className='daily-nav-value flex flex-between'><View className='g-skeleton'></View></View>
        //     </View>
        // </View>
    )
})
