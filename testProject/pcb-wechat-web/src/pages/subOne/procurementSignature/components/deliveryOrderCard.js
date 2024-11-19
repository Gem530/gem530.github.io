import { useRef, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtInput, AtLoadMore, AtButton } from "taro-ui"

export default function deliveryOrderCard({item, index, current, openVouch, openFile, toDetail, toggle}) {
    return (
        <View className='common-bottom-card'>
        <View id={index == 0 ? 'top' : `top${index}`} className='common-card' onClick={() => toDetail(item.id)}>
            {item?.status == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
            <View className='common-item head'>
                <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                <View className='common-title'>{item.code}</View>
                <View className='primary-right'></View>
            </View>

            <View className='common-between'>
                <View className='common-item'>
                    <View className='common-item-label'>物料总数</View>
                    <View className='common-item-value'>{item?.deliveryQuantity}</View>
                </View>
                <View className='common-item'>
                    <View className='common-item-label'>送货人</View>
                    <View className='common-item-value'>{item?.createByName}</View>
                </View>
            </View>

            <View className='common-item'>
                <View className='common-item-label'>送货方</View>
                <View className='common-item-value'>{item?.companyName}</View>
            </View>
            <View className='common-item'>
                <View className='common-item-label'>送货日期</View>
                <View className='common-item-value'>{item?.deliveryTime}</View>
            </View>
            <View className='common-item'>
                <View className='common-item-label'>接收地址</View>
                <View className='common-item-value'>{item?.deliveryAddress}
                    {/* {current == 2 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>文件列表</AtButton> : <></>} */}
                </View>
            </View>
            <View className='flex flex-start'>
                <View className='common-float-left expend-click flex flex-start' onClick={(e) => toggle(e, item)}>
                    <View className={item.showDetail ? 'primary-top' : 'primary-bottom'}></View>
                    <View className='primary-color'>{item.showDetail ? '收起' : '展开'}</View>
                </View>
            </View>
        </View>
        {item.showDetail ? <ScrollView scrollY className='common-bottom-detail'>
            {
            item?.detailList?.length ? item.detailList.map((el, elIndex) => {
                return (<>
                <View className='bottom-detail-card'>
                    <View className='bottom-detail-card-head'>
                        <View className='bottom-detail-card-head-index'>{elIndex + 1}</View>
                        <View className='bottom-detail-card-head-title'>{el?.materialName}</View>
                        <View className='bottom-detail-card-head-tag'>{el?.deliveryQuantity || 0}&nbsp;&nbsp;张</View>
                    </View>
                    <View className='bottom-detail-card-item'>
                        <View className='bottom-detail-card-item-label'>规格型号</View>
                        <View className='bottom-detail-card-item-value'>{el?.specification}</View>
                    </View>
                    <View className='bottom-detail-card-item'>
                        <View className='bottom-detail-card-item-label'>送货备注</View>
                        <View className='bottom-detail-card-item-value'>{el?.remark}</View>
                    </View>
                </View>
                {elIndex < (item.detailList.length - 1) ? <View className='common-bottom-detail-border'>
                    <View className='border'></View>
                </View> : <></>}
                </>)
            }) : <AtLoadMore status={'loading'}></AtLoadMore>
            }
        </ScrollView> : <></>}
        </View>
    )
}
