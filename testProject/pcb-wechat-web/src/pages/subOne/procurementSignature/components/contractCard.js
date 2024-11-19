import { useRef, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtInput, AtLoadMore, AtButton } from "taro-ui"

export default function ContractCard({item, index, current, openVouch, openFile, toDetail}) {
    return (
        <View id={index == 0 ? 'top' : `top${index}`} className='common-card' onClick={() => toDetail(item.id, item?.detailStatus)}>
            {item?.confirmStatus == '3' ? <View className={`${item?.status == 8 ? 'primary-status-cancel' : 'primary-status-confirm'} common-status`}></View> : <></>}
            <View className='common-item head'>
                <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                <View className='common-title'>{item.code}</View>
                <View className='primary-right'></View>
            </View>

            <View className='common-between'>
                <View className='common-item'>
                    <View className='common-item-label'>订购数量</View>
                    <View className='common-item-value'>{item?.quantity}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>下单人</View>
                    <View className='common-item-value'>{item?.submitUserName}</View>
                </View>
            </View>

            <View className='common-item'>
                <View className='common-item-label'>供应商</View>
                <View className='common-item-value'>{item?.supplierName}</View>
            </View>
            <View className='common-item'>
                <View className='common-item-label'>下单公司</View>
                <View className='common-item-value'>{item?.ownerName}</View>
            </View>
            <View className='common-item'>
                <View className='common-item-label'>下单时间</View>
                <View className='common-item-value'>{item?.createTime}</View>
            </View>
            <View className='common-item'>
                <View className='common-item-label'>收货地址</View>
                <View className='common-item-value'>{item?.addressName}
                    {/* {item?.confirmStatus == 3 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>文件列表</AtButton> : <></>} */}
                </View>
            </View>
        </View>
    )
}