import './index.less'
import { useState } from "react"
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtButton, AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

export default function GSignDialog({id, list, open, type, codeList, onClose, onChoose, toSign}) {
    // 对应 onShow
    useDidShow(() => {
    })

    // 是否选择签名
    const chooseHandle = (item) => {
        Taro.showModal({
            title: `是否选择 ${item.signName} 去签名？`,
            success: (res) => {
                if (res?.confirm) {
                    onChoose(item)
                }
            }
        })
    }

    const toPath = (url) => {
        if (['91', '101'].includes(type+'')) {
            Taro.setStorageSync('codeList', codeList);
        }
        Taro.navigateTo({ url })
        toSign && toSign()
    }

    return (
        <AtModal isOpened={open} onClose={onClose} className='new pop-bottom common-dialog g-sign-pop'>
            <AtModalHeader>电子签名</AtModalHeader>
            <AtModalContent>
                {list?.length ? <Swiper
                    circular
                    indicatorDots
                    className='sign-swiper'
                    indicatorColor='rgba(211, 211, 211, 1)'
                    indicatorActiveColor='rgba(45, 144, 237, 1)'>
                    {
                        list.map((item, index) => {
                            return (
                                <SwiperItem>
                                    <View className='sign-swiper-card' onClick={() => chooseHandle(item)}>
                                        <View className='sign-swiper-card-title'>{item.signName}</View>
                                        <Image src={item.url} className='sign-swiper-card-img' mode='aspectFit'></Image>
                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> : <View className='g-sign-empty flex flex-center flex-column'>
                    <View className='g-sign-empty-text'>暂无电子签名</View>
                    <View className='g-sign-empty-tip'>可新增签名，并保存</View>
                </View>}
            </AtModalContent>
            <AtModalAction>
                <AtButton onClick={() => toPath(`/pages/subOne/userInfo/signBoard/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>新增签名</AtButton>
                <AtButton type='primary' onClick={() => toPath(`/pages/subOne/userInfo/seal/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>新增印章</AtButton>
            </AtModalAction>
        </AtModal>
    )
}
