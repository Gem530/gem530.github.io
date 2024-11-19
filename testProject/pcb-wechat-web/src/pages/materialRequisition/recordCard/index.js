import Taro, {useLoad} from '@tarojs/taro'
import { AtTag } from 'taro-ui'
import {View} from '@tarojs/components'
import './index.less'


export default function RecordCard({type, data, onClick}) {
    return (
        <View className='record-card' onClick={() => onClick(data)}>
            <View className='flex flex-between'>
                <View className='qrcode-item'>
                    采购单号: {data?.code}
                </View>
                <View className='flex-grow'></View>
                <View className='qrcode-item'>
                    <AtTag active circle className={data?.status == '3' ? 'tag-success' : data?.status == '4' ?  'tag-danger' : ''}>{data?.statusStr}</AtTag>
                </View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>供应商: {data?.supplierName}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>收货地址: {data?.addressName}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>下单时间: {data?.submitTime}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>采购数量: {data?.quantity}</View>
                <View className='qrcode-item'>总金额: {data?.total}</View>
            </View>
        </View>
    )
}
