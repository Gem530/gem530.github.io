import dayjs from 'dayjs'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef, useImperativeHandle } from "react";
import { AtLoadMore, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"


export default forwardRef(function GOperat({open, list, title, onClose}, ref) {
    useLoad(() => {
        // console.log(ref)
    })
    // const testHandle = () => {
    //     console.log('12132213')
    // }
    // useImperativeHandle(ref, () => ({
    //     testHandle
    // }))
    return (
        <>
        {
        open ? <AtModal isOpened={open} onClose={onClose} className='new pop-bottom common-dialog'>
            {/* 修改记录 */}
            <AtModalHeader>{title}</AtModalHeader>
            <AtModalContent>
                {
                    list?.length ? list.map((item, index) => {
                        return (
                            <View className='common-record-card'>
                                <View className='common-record-head'>
                                    <View className='common-record-index'>{index + 1}</View>
                                    <View className='common-record-subtitle'>修改人:</View>
                                    <View className='common-record-title'>{item?.ownerName}</View>
                                    <View className='common-record-title'>{item?.createByName}</View>
                              </View>
                              <View className='common-record-item'>
                                    <View className='common-record-label'>修改内容:</View>
                                    <View className='common-record-value'>{item?.operateContent}</View>
                              </View>
                                <View className='common-record-item'>
                                    <View className='common-record-label'>修改时间:</View>
                                    <View className='common-record-value'>
                                        {item?.createTime && <>
                                            {dayjs(item?.createTime).format('YYYY-MM-DD')}
                                            <View className='common-record-unit'>{dayjs(item?.createTime).format('HH:mm:ss')}</View>
                                        </>}
                                    </View>
                                </View>
                            </View>
                        )
                    }) : <AtLoadMore status='noMore'></AtLoadMore>
                }
            </AtModalContent>
            <AtModalAction>
                <AtButton type='primary' onClick={onClose}>知道了</AtButton>
            </AtModalAction>
        </AtModal> : <></>
        }
        </>
    )
})
