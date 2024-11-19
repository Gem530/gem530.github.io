import './index.less'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'


export default function GSplitNumber({ number = '', classStr, footStyle }) {
    useLoad(() => {
    })
    return (
        <View className={`g-split-number font-number ${classStr}`}>
            {((number || 0) + '').includes('.') ? <>
                <View className='top-card-value-large'>{number.split('.')[0]}</View>
                <View style={`margin-bottom: 6rpx; ${footStyle}`}>.{number.split('.')[1]}</View>
            </> : <View className='top-card-value-large'>{number || 0}</View>}
        </View>
    )
}
