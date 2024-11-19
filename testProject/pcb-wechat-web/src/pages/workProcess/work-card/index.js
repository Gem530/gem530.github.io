import { useState } from "react";
import { AtTag, AtIcon }  from 'taro-ui'
import Taro, {useLoad} from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'
import './index.less'


export default function WorkCard({data}) {
    useLoad(() => {
    })
    return (
        <View className='work-card'>
            <View className='flex flex-between'>
                <View className='qrcode-item'>
                    {data.cardCode && data.cardCode.includes('-') ? data.cardCode.split('-').map((m) => {
                        <View>{m}</View>
                    }) : data.cardCode}
                </View>
                <View className='flex-grow'></View>
                <View className='qrcode-item'>
                    {/* <AtTag active circle>{data.status && statusType[data.status]}</AtTag> */}
                </View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>产品编码：{data.commodityCode}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>本卡数量：{data.bundlePnlQuantity || 0} PNL</View>
                <View className='qrcode-item'>本卡面积：{data.cardArea || 0} ㎡</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>已审核面积：{data.finishedArea || 0} ㎡</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item' style='color: #6190E8;'>待审核面积：{data.waitAuditArea || 0} ㎡</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>上报工序：{data.craftName}</View>
                <View className='qrcode-item'>上报时间：{data?.createTime}</View>
            </View>
        </View>
    )
}
