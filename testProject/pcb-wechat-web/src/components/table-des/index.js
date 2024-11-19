import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
import '../../assets/custom.less'
import { View } from '@tarojs/components'


export default function TableDes({list}) {
    return (
        <View className="table-des">
            <View class="order-detail-table">
            {
                list.map((item) => {
                    return (
                        <>
                            <View class={`order-detail-table-label ${item?.one ? 'one' : ''}`}>{item.label}</View>
                            <View class={`order-detail-table-value ${item?.one ? 'one' : ''}`}>{item.value}</View>
                        </>
                    )
                })
            }
            </View>
        </View>
    )
}