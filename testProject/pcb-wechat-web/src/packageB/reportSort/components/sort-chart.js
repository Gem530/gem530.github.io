import dayjs from 'dayjs'
import { useRef } from 'react'
import Echarts from 'taro-react-echarts'
import { useState, forwardRef } from "react"
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
// import echartsJs from '../../../pages/util/echarts'
// import GPopCalendar from '../../../components/g-pop-calendar'


export default forwardRef(function SortChart({data, children, nobottom, echartsJs}, ref) {
    const [option, setOption] = useState({})
    useDidShow(() => {
        setTimeout(() => {
            console.log(222)
            setOption({
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
            })
        }, 1000)
    })
    return (
        <View className='daily-card' style={`${nobottom && 'margin-bottom: 0 !important;'}`}>
            <View className='daily-card-title flex flex-start'>
                <View>{data?.title}</View>
                <View className='flex-grow'></View>
            </View>
            <View style={{ width: '100%', height: '300px' }}>
                {/* <View className='daily-title margin-top'>{item.title}</View> */}
                {children ? children : <Echarts
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
                    canvasId={`chart${Math.random().toString().replace('.','').slice(2,4)}`}
                    // style自定义设置echarts宽高
                    style={{ width: '100%', height: '300px' }}
                    // className='echarts-dom'
                />}
            </View>
            <Canvas canvasId={`test111${Math.random()}`} style={'display: none;'}></Canvas>
        </View>
    )
})
