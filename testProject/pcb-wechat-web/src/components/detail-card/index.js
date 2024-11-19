import Taro, {useLoad} from '@tarojs/taro'
import { AtTag } from 'taro-ui'
import {View} from '@tarojs/components'
import './index.less'


export default function DetailCard({type, data, residueArea}) {
    return (
        <View className='detail-card'>
            <View className='flex flex-between'>
                <View className='qrcode-item'>
                    {data.cardCode && data.cardCode.includes('-') ? data.cardCode.split('-').map((m) => {
                        <View>{m}</View>
                    }) : data.cardCode}
                </View>
                <View className='flex-grow'></View>
                <View className='qrcode-item' style='color: #6190E8;'>
                    {type == 1 && (<View>剩余可上报面积:{residueArea}</View>)}
                </View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>产品编码：{data.commodityCode.includes('/') ? data.commodityCode.replace(/\//g,'-') : data.commodityCode}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>本卡数量：{data.bundlePnlQuantity || 0} PNL</View>
                <View className='qrcode-item'>本卡面积：{data.cardArea || 0} ㎡</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>已审核面积：{data.finishedArea || 0} ㎡</View>
            </View>
            {/* <View className='flex flex-between' style='font-weight: 600;'>
                <View className='qrcode-item'>上报面积：0.2598 ㎡</View>
                <View className='qrcode-item'>个人产能：100 PNL</View>
            </View> */}
            <View className='flex flex-between'>
                <View className='qrcode-item'>上报工序：{data.craftName}</View>
                <View className='qrcode-item'>上报时间：{data?.createTime}</View>
            </View>
        </View>
    )
}
