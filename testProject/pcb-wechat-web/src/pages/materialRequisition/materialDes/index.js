import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
import './index.less'
import { View } from '@tarojs/components'


export default function MaterialDes({index, item}) {
    const [id, setId] = useState(0);
    useLoad(async (options) => {
        // console.log(options.id)
        setId(Number(options.id))
    })
    return (
        <View className="material-des">
            <View class="order-detail-table">
                <View class="order-detail-table-label">物料编码:</View>
                <View class="order-detail-table-value">{item?.code}</View>
                <View class="order-detail-table-label">物料名称:</View>
                <View class="order-detail-table-value">{item?.name}</View>

                <View class="order-detail-table-label one">规格型号:</View>
                <View class="order-detail-table-value one">{item?.materialSpecification}</View>
                
                <View class="order-detail-table-label">单位:</View>
                <View class="order-detail-table-value">{item?.units}</View>
                <View class="order-detail-table-label">库存数量:</View>
                <View class="order-detail-table-value">{item?.actualStock}</View>
            </View>
        </View>
    )
}