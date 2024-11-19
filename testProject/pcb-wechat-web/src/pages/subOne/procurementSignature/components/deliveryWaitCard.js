import {useRef, useState} from 'react'
import {View, ScrollView} from '@tarojs/components'
import {AtTabs, AtInput, AtLoadMore, AtButton} from "taro-ui"

export default function deliveryWaitCard({item, index, openVouch, toDetail, checkFlag, chooseHandle, handleLongPress}) {
  return (
    <View className='common-bottom-card'>
      <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id)} onLongPress={(e) => handleLongPress(e, item)}>
        {item?.status == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
        <View className='common-item head'>
          {checkFlag ?
            <View onClick={(e) => chooseHandle(e, item)} className={`common-title-choose ${item.choose ? 'primary-choose-active' : 'primary-choose'}`}></View> :
            <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
          }
          <View className='common-title'>{item.code}</View>
          <View className='primary-right'></View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>客户名称</View>
          <View className='common-item-value'>{item?.company}</View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>送货地址</View>
          <View className='common-item-value'>{item?.deliveryAddress}</View>
        </View>

        <View className='common-between'>
          <View className='common-item'>
            <View className='common-item-label'>商品名称</View>
            <View className='common-item-value'>{item?.materialName}</View>
          </View>
          <View className='common-item'>
            <View className='common-item-label'>单位</View>
            <View className='common-item-value'>{item?.units}</View>
          </View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>商品规格</View>
          <View className='common-item-value'>{item?.specification}</View>
        </View>

        <View className='common-between'>
          <View className='common-item'>
            <View className='common-item-label'>要求交期</View>
            <View className='common-item-value'>{item?.deliverTime}</View>
          </View>
          <View className='common-item'>
            <View className='common-item-label'>采购数量</View>
            <View className='common-item-value'>{item?.quantity}</View>
          </View>
        </View>

        <View className='common-between'>
          <View className='common-item'>
            <View className='common-item-label'>已送数量</View>
            <View className='common-item-value'>{item?.deliverQuantity}</View>
          </View>
          <View className='common-item'>
            <View className='common-item-label'>差欠数量</View>
            <View className='common-item-value'>{item?.oweQuantity}</View>
          </View>
        </View>

      </View>
    </View>)
}
